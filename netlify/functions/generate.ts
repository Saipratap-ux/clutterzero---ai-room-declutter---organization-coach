import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Netlify function GoogleGenAI init error:', err);
  }
}

const PRIMARY_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-2.5-flash-lite';

function cleanCodeFence(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```html')) {
    cleaned = cleaned.replace(/^```html\n?/, '').replace(/\n?```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '');
  }
  return cleaned.trim();
}

function sleep(ms: number): Promise<void> {
  const jitter = Math.random() * 200;
  return new Promise((resolve) => setTimeout(resolve, ms + jitter));
}

function isTransientError(err: any): boolean {
  const status = Number(err.status || err.statusCode || 0);
  const msg = String(err.message || '').toLowerCase();
  return (
    status === 503 ||
    status === 429 ||
    status === 502 ||
    status === 504 ||
    status === 500 ||
    msg.includes('unavailable') ||
    msg.includes('high demand') ||
    msg.includes('rate limit') ||
    msg.includes('resource exhausted')
  );
}

export const handler = async (event: any) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let body: any = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const { prompt, aestheticTone } = body;
  if (!prompt || typeof prompt !== 'string') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Prompt is required' }),
    };
  }

  const cleanPrompt = prompt.trim();
  const slug = cleanPrompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 20) || `site-${Date.now().toString().slice(-4)}`;

  // Check client
  if (!aiClient) {
    // Generate high quality standalone markup
    const sampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanPrompt.slice(0, 40)} · SAIPRTAP</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between font-sans">
  <header class="border-b border-slate-800 p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
    <div class="font-bold text-xl text-white">SAI<span class="text-amber-400">PRTAP</span></div>
    <div class="text-xs font-mono text-emerald-400">LIVE ON *.SAI.APP</div>
  </header>
  <main class="max-w-4xl mx-auto px-6 py-20 text-center">
    <h1 class="text-4xl sm:text-5xl font-extrabold text-white mb-6">${cleanPrompt}</h1>
    <p class="text-slate-300 max-w-xl mx-auto mb-10">Production-ready web application deployed seamlessly to SAIPRTAP edge nodes.</p>
    <a href="https://sai.app" class="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm">Explore SAIPRTAP</a>
  </main>
  <footer class="border-t border-slate-800 p-6 text-center text-xs text-slate-500">
    Published on SAIPRTAP Cloud · Free Public Hosting Engine
  </footer>
</body>
</html>`;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: cleanPrompt.slice(0, 36),
        slug,
        description: cleanPrompt,
        framework: 'HTML + Tailwind CSS',
        files: {
          'index.html': sampleHtml,
        },
        modelUsed: 'template-fallback',
      }),
    };
  }

  // Model fallback and backoff loop
  const systemInstruction = `You are an expert web development engineer for SAIPRTAP, a modern web hosting and deployment platform.
Generate a complete, production-ready, beautiful single-page website matching the user request.
REQUIREMENTS:
- Return ONLY valid, complete HTML5 starting with <!DOCTYPE html>.
- Include Tailwind CSS CDN script (<script src="https://cdn.tailwindcss.com"></script>) in <head>.
- Incorporate interactive JavaScript directly inside a <script> tag.
- Ensure fully responsive design (mobile, tablet, desktop).
- No markdown code blocks, return raw html.`;

  const modelsToTry = [PRIMARY_MODEL, FALLBACK_MODEL];
  let lastError: any = null;

  for (const model of modelsToTry) {
    let delay = 1000;
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await aiClient.models.generateContent({
          model,
          contents: `Create a website for: ${cleanPrompt}\nAesthetic tone: ${aestheticTone || 'Modern Dark & Tech'}`,
          config: {
            systemInstruction,
          },
        });

        const rawText = response.text || '';
        const cleanedHtml = cleanCodeFence(rawText);

        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: cleanPrompt.slice(0, 36),
            slug,
            description: cleanPrompt,
            framework: 'HTML + Tailwind CSS',
            files: {
              'index.html': cleanedHtml,
            },
            modelUsed: model,
          }),
        };
      } catch (err: any) {
        lastError = err;
        if (!isTransientError(err) || attempt === maxRetries) {
          break; // break retry loop to try next model or fail
        }
        await sleep(delay);
        delay *= 2;
      }
    }
  }

  return {
    statusCode: 503,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: 'AI is experiencing high demand. Please try again.',
      details: lastError?.message,
    }),
  };
};
