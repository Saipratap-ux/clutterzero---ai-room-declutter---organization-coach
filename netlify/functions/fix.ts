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
    console.warn('Netlify function GoogleGenAI init error in fix.ts:', err);
  }
}

function cleanCodeFence(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```html')) {
    cleaned = cleaned.replace(/^```html\n?/, '').replace(/\n?```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '');
  }
  return cleaned.trim();
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

  const { code, instructions } = body;
  if (!code || typeof code !== 'string') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Source code is required' }),
    };
  }

  if (!aiClient) {
    // Return original code if AI unavailable
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fixedCode: code }),
    };
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Fix and polish the following website markup according to these instructions: "${instructions || 'Fix any syntax errors, ensure responsive Tailwind CSS styling, improve accessibility, and polish visual hierarchy'}"\n\nCODE TO FIX:\n${code}`,
      config: {
        systemInstruction: 'You are an expert web repair engine. Return ONLY the complete corrected code file. Do not wrap in markdown quotes if possible.',
      },
    });

    const fixed = cleanCodeFence(response.text || code);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fixedCode: fixed }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'AI repair failed', details: err?.message }),
    };
  }
};
