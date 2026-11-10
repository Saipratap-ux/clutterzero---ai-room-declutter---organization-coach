import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// ==========================================
// 1. Telemetry & Monitoring Metrics Store
// ==========================================
interface AIMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  retriesAttempted: number;
  fallbackModelUsed: number;
  errors429: number;
  errors503: number;
  otherErrors: number;
  activeRequests: number;
  avgLatencyMs: number;
  lastError: { timestamp: string; message: string; code?: number } | null;
}

const aiMetrics: AIMetrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  retriesAttempted: 0,
  fallbackModelUsed: 0,
  errors429: 0,
  errors503: 0,
  otherErrors: 0,
  activeRequests: 0,
  avgLatencyMs: 0,
  lastError: null,
};

let totalLatencyAccumulator = 0;

function recordMetricSuccess(durationMs: number, usedFallback: boolean) {
  aiMetrics.totalRequests++;
  aiMetrics.successfulRequests++;
  if (usedFallback) aiMetrics.fallbackModelUsed++;
  totalLatencyAccumulator += durationMs;
  aiMetrics.avgLatencyMs = Math.round(totalLatencyAccumulator / aiMetrics.successfulRequests);
}

function recordMetricError(err: any) {
  aiMetrics.totalRequests++;
  aiMetrics.failedRequests++;
  const status = err.status || err.statusCode || 500;
  if (status === 429) aiMetrics.errors429++;
  else if (status === 503) aiMetrics.errors503++;
  else aiMetrics.otherErrors++;

  aiMetrics.lastError = {
    timestamp: new Date().toISOString(),
    message: err.message || 'Unknown error',
    code: status,
  };
}

// ==========================================
// 2. GoogleGenAI Server Initialization
// ==========================================
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
    console.warn('Failed to initialize server GoogleGenAI client:', err);
  }
}

// Valid models hierarchy per skill rules:
// Primary: gemini-3.8-flash, Secondary Fallback: gemini-3.1-flash-lite
const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODEL = 'gemini-3.1-flash-lite';

// Helper to clean markdown code blocks
function cleanCodeFence(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```html')) {
    cleaned = cleaned.replace(/^```html\n?/, '').replace(/\n?```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '');
  }
  return cleaned.trim();
}

// Sleep with jitter helper
function sleep(ms: number): Promise<void> {
  const jitter = Math.random() * 250;
  return new Promise((resolve) => setTimeout(resolve, ms + jitter));
}

// Check if error is transient and eligible for retry (503, 429, 500, 502, 504)
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
    msg.includes('resource exhausted') ||
    msg.includes('econnreset')
  );
}

// ==========================================
// 3. Resilient Generation Execution Engine
// ==========================================
interface GenerationOptions {
  contents: string;
  systemInstruction?: string;
  timeoutMs?: number;
}

interface GenerationResult {
  text: string;
  modelUsed: string;
  retries: number;
  durationMs: number;
}

// Concurrency queue
let currentActiveTasks = 0;
const MAX_CONCURRENT_TASKS = 4;
const taskQueue: Array<() => void> = [];

function acquireTaskSlot(): Promise<void> {
  if (currentActiveTasks < MAX_CONCURRENT_TASKS) {
    currentActiveTasks++;
    aiMetrics.activeRequests = currentActiveTasks;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    taskQueue.push(() => {
      currentActiveTasks++;
      aiMetrics.activeRequests = currentActiveTasks;
      resolve();
    });
  });
}

function releaseTaskSlot() {
  currentActiveTasks = Math.max(0, currentActiveTasks - 1);
  aiMetrics.activeRequests = currentActiveTasks;
  const next = taskQueue.shift();
  if (next) next();
}

/**
 * Execute Gemini model call with exponential backoff, jitter, and model fallback
 */
async function executeWithReliability(opts: GenerationOptions): Promise<GenerationResult> {
  if (!aiClient) {
    throw new Error('Gemini API key is not configured on the server.');
  }

  await acquireTaskSlot();
  const startTime = Date.now();
  let retriesCount = 0;
  const modelsToTry = [PRIMARY_MODEL, FALLBACK_MODEL];

  try {
    for (let mIdx = 0; mIdx < modelsToTry.length; mIdx++) {
      const currentModel = modelsToTry[mIdx];
      const maxRetriesForModel = mIdx === 0 ? 3 : 2;

      for (let attempt = 0; attempt <= maxRetriesForModel; attempt++) {
        try {
          const config: any = {};
          if (opts.systemInstruction) {
            config.systemInstruction = opts.systemInstruction;
          }

          const response = await aiClient.models.generateContent({
            model: currentModel,
            contents: opts.contents,
            config: Object.keys(config).length > 0 ? config : undefined,
          });

          const text = response.text || '';
          const duration = Date.now() - startTime;
          recordMetricSuccess(duration, currentModel !== PRIMARY_MODEL);

          return {
            text,
            modelUsed: currentModel,
            retries: retriesCount,
            durationMs: duration,
          };
        } catch (err: any) {
          retriesCount++;
          aiMetrics.retriesAttempted++;
          console.warn(`[Gemini Attempt Failed] Model=${currentModel} Attempt=${attempt + 1}:`, err.message || err);

          if (!isTransientError(err) || attempt === maxRetriesForModel) {
            // If permanent error or exhausted retries on primary model, break inner loop to try fallback model
            if (mIdx < modelsToTry.length - 1) {
              console.log(`[Gemini Fallback] Switching from ${currentModel} to ${modelsToTry[mIdx + 1]}`);
              break;
            } else {
              recordMetricError(err);
              throw err;
            }
          }

          // Exponential backoff with jitter: 1s, 2s, 4s
          const backoff = Math.min(1000 * Math.pow(2, attempt), 8000);
          await sleep(backoff);
        }
      }
    }

    throw new Error('All configured Gemini models are currently unavailable.');
  } finally {
    releaseTaskSlot();
  }
}

// ==========================================
// 4. API Endpoints
// ==========================================

// Server & AI Health Status
app.get('/api/ai/status', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    primaryModel: PRIMARY_MODEL,
    fallbackModel: FALLBACK_MODEL,
    activeTasks: currentActiveTasks,
  });
});

// Telemetry & Reliability Metrics (PRD Module D)
app.get('/api/ai/metrics', (_req, res) => {
  res.json({
    ...aiMetrics,
    serverUptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Full prompt-to-website generation
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, styleTone } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const contents = `You are SAIPRTAP AI, an elite web architect and full-stack software engineer.
User prompt: "${prompt}"
Design aesthetic: ${styleTone || 'Modern Dark Developer interface with Royal Gold and Electric Blue accents'}.

Create a complete, single-file production-ready HTML5 page including Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>) and Google Fonts.
Requirements:
1. Make it completely functional with embedded CSS and JavaScript (<script> tags).
2. Include rich UI sections: Header/Navbar, Hero with CTA, Interactive Feature/Simulator card, 3-column benefits, working contact form with JavaScript onsubmit handler, and Footer mentioning "Published on SAIPRTAP Cloud · https://sai.app".
3. Return ONLY the raw HTML code without markdown wrappers if possible, or standard markdown \`\`\`html.
4. Do NOT output incomplete placeholders or stubs.`;

    const result = await executeWithReliability({ contents });
    const cleanedHtml = cleanCodeFence(result.text);

    return res.json({
      html: cleanedHtml,
      raw: result.text,
      model: result.modelUsed,
      retries: result.retries,
      durationMs: result.durationMs,
    });
  } catch (err: any) {
    console.error('Server Gemini generate error:', err);
    return res.status(err.status === 429 ? 429 : 503).json({
      error: 'AI is experiencing high demand. Your request has not been lost. Please try again.',
      rawMessage: err.message,
      code: err.status || 503,
      fallback: true,
    });
  }
});

// Real-time Streaming Generation (SSE with auto-fallback)
app.post('/api/ai/generate-stream', async (req, res) => {
  try {
    const { prompt, styleTone } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!aiClient) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server.',
        fallback: true,
      });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const contents = `You are SAIPRTAP AI, an elite web architect and full-stack software engineer.
User prompt: "${prompt}"
Design aesthetic: ${styleTone || 'Modern Dark Developer interface with Royal Gold and Electric Blue accents'}.

Create a complete, single-file production-ready HTML5 page including Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>) and Google Fonts.
Requirements:
1. Make it completely functional with embedded CSS and JavaScript (<script> tags).
2. Include rich UI sections: Header/Navbar, Hero with CTA, Interactive Feature/Simulator card, 3-column benefits, working contact form with JavaScript onsubmit handler, and Footer mentioning "Published on SAIPRTAP Cloud · https://sai.app".
3. Return ONLY the raw HTML code without markdown wrappers if possible, or standard markdown \`\`\`html.
4. Do NOT output incomplete placeholders or stubs.`;

    let activeStream: any = null;
    let modelUsed = PRIMARY_MODEL;

    try {
      activeStream = await aiClient.models.generateContentStream({
        model: PRIMARY_MODEL,
        contents,
      });
    } catch (streamErr) {
      console.warn(`[Stream Primary Model Failed, trying fallback ${FALLBACK_MODEL}]`, streamErr);
      modelUsed = FALLBACK_MODEL;
      activeStream = await aiClient.models.generateContentStream({
        model: FALLBACK_MODEL,
        contents,
      });
    }

    for await (const chunk of activeStream) {
      const text = chunk.text || '';
      res.write(`data: ${JSON.stringify({ text, model: modelUsed })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err: any) {
    console.error('Server Gemini streaming error:', err);
    if (!res.headersSent) {
      res.status(503).json({
        error: 'AI is experiencing high demand. Your request has not been lost. Please try again.',
        fallback: true,
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted. Please retry.' })}\n\n`);
      res.end();
    }
  }
});

// Diagnostic Code Repair
app.post('/api/ai/fix', async (req, res) => {
  try {
    const { currentCode, issueDescription } = req.body;
    if (!currentCode) {
      return res.status(400).json({ error: 'currentCode is required' });
    }

    const contents = `You are the SAIPRTAP AI Diagnostic Repair Engine.
Fix the following HTML/CSS/JS code according to the issue: "${issueDescription || 'Fix all syntax errors, broken layout tags, responsive mobile scaling, and improve accessibility.'}".
Current Code:
${currentCode}

Fix all syntax errors, broken layout tags, responsive mobile scaling, and improve accessibility.
Return ONLY the corrected full raw HTML code without markdown code fences.`;

    const result = await executeWithReliability({ contents });
    const cleanedHtml = cleanCodeFence(result.text);

    return res.json({
      repairedCode: cleanedHtml,
      model: result.modelUsed,
      retries: result.retries,
      durationMs: result.durationMs,
    });
  } catch (err: any) {
    console.error('Server Gemini fix error:', err);
    return res.status(503).json({
      error: 'AI is experiencing high demand. Your request has not been lost. Please try again.',
      fallback: true,
    });
  }
});

// Multi-turn Chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, systemInstruction } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const lastMsg = messages[messages.length - 1];
    const textMsg = typeof lastMsg === 'string' ? lastMsg : lastMsg.content || lastMsg.text;

    const result = await executeWithReliability({
      contents: textMsg,
      systemInstruction: systemInstruction || 'You are SAIPRTAP AI, an expert developer platform coding assistant.',
    });

    return res.json({
      text: result.text,
      model: result.modelUsed,
      retries: result.retries,
    });
  } catch (err: any) {
    console.error('Server Gemini chat error:', err);
    return res.status(503).json({
      error: 'AI is experiencing high demand. Your request has not been lost. Please try again.',
      fallback: true,
    });
  }
});

// ===================================================
// 5. Vite Middleware & WebSocket / HMR Configuration
// (PRD Module A: Vite WebSocket Repair)
// ===================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    
    // Check if HMR should be explicitly disabled per environment flag
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        // When DISABLE_HMR is true (e.g. AI Studio preview), set hmr: false so the browser
        // never attempts a failing WebSocket connection.
        // When enabled, attach to httpServer so WebSocket upgrades are cleanly handled on the same port!
        hmr: isHmrDisabled
          ? false
          : {
              server: httpServer,
            },
        watch: isHmrDisabled ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`SAIPRTAP Cloud Server running on http://0.0.0.0:${PORT}`);
    console.log(`AI Models: Primary=${PRIMARY_MODEL}, Fallback=${FALLBACK_MODEL}`);
  });
}

startServer();
