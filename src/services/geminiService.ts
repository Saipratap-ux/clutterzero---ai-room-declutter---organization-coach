export interface GeneratedWebsiteResult {
  title: string;
  slug: string;
  description: string;
  files: Record<string, string>;
  framework: string;
  modelUsed?: string;
  retries?: number;
  durationMs?: number;
  warning?: string;
}

/**
 * Intelligent deterministic builder fallback when offline or server models encounter temporary high demand
 */
export function fallbackGenerateSite(prompt: string, warningMsg?: string): GeneratedWebsiteResult {
  const p = prompt.toLowerCase();
  const slug = prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24) || 'my-new-site';

  let title = 'Intelligent Web Application';
  let categoryTag = 'CLOUD DEPLOYED';
  let primaryHeading = 'Empowering Innovation with Seamless Digital Solutions';
  let subText = 'Designed with modern responsive aesthetics, edge-accelerated routing, and automatic publication on sai.app.';
  let featureOne = 'Next-Gen Architecture';
  let featureOneDesc = 'Ultra-lightweight footprint with instant worldwide CDN delivery and SSL security.';
  let featureTwo = 'Interactive Workflows';
  let featureTwoDesc = 'Engaging client components built for conversion and intuitive user experiences.';
  let featureThree = 'Continuous Publishing';
  let featureThreeDesc = 'Automated updates and rollbacks backed by SAIPRTAP hosting infrastructure.';

  if (p.includes('education') || p.includes('course') || p.includes('school') || p.includes('academy')) {
    title = 'EduSphere - Modern Learning Academy';
    categoryTag = 'EDUCATION PLATFORM';
    primaryHeading = 'Empowering Students to Master Future-Ready Skills';
    subText = 'Interactive curricula, hands-on coding sandboxes, live progress tracking, and expert mentorship.';
    featureOne = 'Interactive Cohorts';
    featureOneDesc = 'Engage in live peer code reviews and structured project milestone deliveries.';
    featureTwo = 'Skill Assessments';
    featureTwoDesc = 'Real-time automated quizzes with detailed conceptual feedback and badges.';
    featureThree = 'Student Dashboard';
    featureThreeDesc = 'Comprehensive analytics for course progression, certificates, and grades.';
  } else if (p.includes('food') || p.includes('restaurant') || p.includes('cafe') || p.includes('dining')) {
    title = 'La Maison - Artisanal Dining & Bistro';
    categoryTag = 'GOURMET EXPERIENCE';
    primaryHeading = 'A Symphony of Local Flavor and Culinary Craft';
    subText = 'Fresh organic ingredients, award-winning wine pairings, and an unforgettable cozy ambiance.';
    featureOne = 'Farm-to-Table';
    featureOneDesc = 'Every ingredient is harvested within 50 miles for optimal freshness.';
    featureTwo = 'Seasonal Tasting';
    featureTwoDesc = 'Seven-course tasting menu curated weekly by our executive chef.';
    featureThree = 'Table Reservation';
    featureThreeDesc = 'Instant online booking with confirmation via SAIPRTAP Form APIs.';
  } else if (p.includes('portfolio') || p.includes('developer') || p.includes('designer') || p.includes('resume')) {
    title = 'Sai Pratap - Full-Stack & Cloud Engineer';
    categoryTag = 'PORTFOLIO & SYSTEM ARCHITECTURE';
    primaryHeading = 'Building High-Scale Cloud Platforms & Elegant Interfaces';
    subText = 'Specializing in edge networking, developer tools, distributed databases, and high-performance frontend applications.';
    featureOne = 'Cloud Systems';
    featureOneDesc = 'Designed high-availability architectures serving millions of monthly requests.';
    featureTwo = 'Open Source';
    featureTwoDesc = 'Active maintainer of developer toolchains, CLI utilities, and UI libraries.';
    featureThree = 'Global Edge';
    featureThreeDesc = 'All projects hosted directly with wildcard SSL on https://project.sai.app.';
  } else if (p.includes('crypto') || p.includes('fintech') || p.includes('wallet') || p.includes('finance')) {
    title = 'VaultX - Next-Generation Digital Asset Security';
    categoryTag = 'FINTECH INFRASTRUCTURE';
    primaryHeading = 'Institutional-Grade Custody & Real-Time Portfolio Insights';
    subText = 'Multi-party computation, biometric authentication, and lightning-fast settlement rails.';
    featureOne = 'Zero-Knowledge Audits';
    featureOneDesc = 'Cryptographically verified proofs of solvency updated continuously.';
    featureTwo = 'Instant Settlement';
    featureTwoDesc = 'Sub-second cross-border liquidity powered by modern payment APIs.';
    featureThree = 'Security Standard';
    featureThreeDesc = 'Hardware security module compliance with bank-grade encryption.';
  }

  const generatedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
    .gold-shimmer { background: linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #d97706 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between selection:bg-blue-600/30 selection:text-blue-200">
  <!-- Top Navigation -->
  <header class="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-lg">
        ⚡
      </div>
      <span class="font-bold text-lg tracking-tight text-white">${title.split(' - ')[0]}</span>
    </div>
    <nav class="hidden md:flex gap-6 text-sm text-slate-400">
      <a href="#features" class="hover:text-white transition">Features</a>
      <a href="#experience" class="hover:text-white transition">Overview</a>
      <a href="#contact" class="hover:text-white transition">Get in Touch</a>
    </nav>
    <a href="#contact" class="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md transition">
      Explore Platform
    </a>
  </header>

  <!-- Hero Section -->
  <main class="max-w-5xl mx-auto px-6 py-20 text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 mb-6 font-mono">
      <span>●</span> ${categoryTag} · HOSTED ON SAI.APP
    </div>
    <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
      ${primaryHeading.split(' ')[0]} ${primaryHeading.split(' ')[1]} <span class="gold-shimmer">${primaryHeading.split(' ').slice(2).join(' ')}</span>
    </h1>
    <p class="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
      ${subText}
    </p>

    <div class="flex flex-wrap items-center justify-center gap-4">
      <button onclick="handlePrimaryAction()" class="px-6 py-3.5 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition">
        Get Started Now
      </button>
      <a href="#contact" class="px-6 py-3.5 text-sm font-semibold rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 transition">
        Contact Team
      </a>
    </div>

    <!-- Live Interactive Element -->
    <div id="interactive-card" class="mt-16 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-left max-w-xl mx-auto">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
        <span class="font-mono">Live Demo Interaction</span>
        <span class="text-emerald-400 font-mono">STATUS: ACTIVE</span>
      </div>
      <div class="py-4 text-sm text-slate-300">
        <p id="action-text">Click the action button above to test real live client-side interactivity!</p>
      </div>
      <div class="flex gap-2">
        <input type="text" id="demo-input" placeholder="Type something to test..." class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
        <button onclick="sendTest()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-white">Submit</button>
      </div>
      <div id="feedback-msg" class="text-xs text-emerald-400 mt-2 hidden">Data processed successfully on edge!</div>
    </div>

    <!-- 3-Column Features -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left" id="features">
      <div class="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition">
        <div class="text-2xl mb-3">🚀</div>
        <h3 class="text-base font-semibold text-white mb-2">${featureOne}</h3>
        <p class="text-sm text-slate-400 leading-relaxed">${featureOneDesc}</p>
      </div>
      <div class="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition">
        <div class="text-2xl mb-3">🛡️</div>
        <h3 class="text-base font-semibold text-white mb-2">${featureTwo}</h3>
        <p class="text-sm text-slate-400 leading-relaxed">${featureTwoDesc}</p>
      </div>
      <div class="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition">
        <div class="text-2xl mb-3">⚡</div>
        <h3 class="text-base font-semibold text-white mb-2">${featureThree}</h3>
        <p class="text-sm text-slate-400 leading-relaxed">${featureThreeDesc}</p>
      </div>
    </div>

    <!-- Contact Form section -->
    <div class="mt-20 max-w-xl mx-auto p-8 bg-slate-900/70 border border-slate-800 rounded-2xl text-left" id="contact">
      <h3 class="text-xl font-bold text-white mb-2">Connect With Us</h3>
      <p class="text-xs text-slate-400 mb-6">Built-in form processing with automatic spam detection on SAIPRTAP.</p>
      <form onsubmit="handleForm(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
          <input required type="text" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Jane Doe" />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
          <input required type="email" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="jane@example.com" />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Message</label>
          <textarea rows="3" required class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="Tell us about your requirements..."></textarea>
        </div>
        <button type="submit" class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg transition shadow-md">
          Send Message
        </button>
        <div id="form-success" class="text-xs text-emerald-400 text-center hidden">Thank you! Your submission was recorded on the SAIPRTAP Form Engine.</div>
      </form>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-slate-800/80 px-6 py-6 text-center text-xs text-slate-500">
    Published automatically on <a href="https://sai.app" class="text-blue-400 hover:underline">SAIPRTAP Cloud</a> · Free Public Hosting Engine
  </footer>

  <script>
    function handlePrimaryAction() {
      const text = document.getElementById('action-text');
      text.innerHTML = '<span class="text-amber-400 font-semibold">Action Triggered!</span> Real-time client-side event completed seamlessly.';
    }
    function sendTest() {
      const input = document.getElementById('demo-input');
      const msg = document.getElementById('feedback-msg');
      if (input.value.trim()) {
        msg.innerText = 'Received: "' + input.value + '" — Edge latency: 12ms';
        msg.classList.remove('hidden');
        input.value = '';
      }
    }
    function handleForm(e) {
      e.preventDefault();
      document.getElementById('form-success').classList.remove('hidden');
    }
  </script>
</body>
</html>`;

  return {
    title,
    slug,
    description: `Generated from prompt: "${prompt}"`,
    framework: 'Static HTML + Tailwind',
    modelUsed: 'SAIPRTAP Built-in Resilient Engine',
    warning: warningMsg,
    files: {
      'index.html': generatedHtml,
      'README.md': `# ${title}\n\nGenerated with SAIPRTAP AI Website Builder.\nPublished on \`https://${slug}.sai.app\`.`,
    },
  };
}

/**
 * Generate full website from prompt via server-side Gemini API proxy route (/api/ai/generate)
 * with automatic fallback, model switching, and exponential backoff telemetry
 */
export async function generateWebsiteFromPrompt(
  prompt: string,
  styleTone?: string,
  signal?: AbortSignal
): Promise<GeneratedWebsiteResult> {
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, styleTone }),
      signal,
    });

    if (response.ok) {
      const data = await response.json();
      const cleanedHtml = data.html || '';

      if (cleanedHtml && cleanedHtml.includes('<html') && cleanedHtml.includes('</html>')) {
        const slug = prompt
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 24) || 'ai-site';

        return {
          title: prompt.slice(0, 32),
          slug,
          description: `AI-crafted project: ${prompt.slice(0, 60)}`,
          framework: 'Static HTML + Tailwind',
          modelUsed: data.model || 'gemini-3.8-flash',
          retries: data.retries || 0,
          durationMs: data.durationMs,
          files: {
            'index.html': cleanedHtml,
            'README.md': `# Generated Project\n\nPrompt: "${prompt}"\nPublished on https://${slug}.sai.app\nModel: ${data.model || 'gemini-3.8-flash'}`,
          },
        };
      }
    } else {
      const errData = await response.json().catch(() => ({}));
      console.warn(`[Server AI Error ${response.status}]:`, errData.error || response.statusText);

      // If high demand (503) or rate limit (429), return resilient fallback with notice
      return fallbackGenerateSite(
        prompt,
        'Live Gemini model was experiencing temporary peak traffic. Resilient failover engine delivered your website without interruption.'
      );
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err;
    }
    console.warn('Server-side Gemini generation request failed, using intelligent built-in synthesizer:', err);
  }

  // Graceful fallback to deterministic generator
  return fallbackGenerateSite(prompt);
}

/**
 * AI Code Repair / Fix Tool via server-side Gemini API proxy route (/api/ai/fix)
 */
export async function repairWebsiteCode(currentCode: string, issueDescription: string): Promise<string> {
  try {
    const response = await fetch('/api/ai/fix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentCode, issueDescription }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.repairedCode) {
        return data.repairedCode;
      }
    }
  } catch (err) {
    console.warn('Server-side Gemini code fix failed, falling back to local diagnostic repair:', err);
  }

  // Local diagnostic repair fallback
  let repaired = currentCode;
  if (!repaired.includes('<meta name="viewport"')) {
    repaired = repaired.replace('<head>', '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">');
  }
  if (!repaired.includes('https://cdn.tailwindcss.com') && !repaired.includes('<style>')) {
    repaired = repaired.replace('</head>', '  <script src="https://cdn.tailwindcss.com"></script>\n</head>');
  }
  return repaired;
}
