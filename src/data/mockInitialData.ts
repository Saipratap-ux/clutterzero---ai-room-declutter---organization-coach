import { Project, Template, UserProfile } from '../types';

export const initialUser: UserProfile = {
  id: 'usr_sai_9918',
  name: 'Sai Pratap',
  email: 'saipratapdansana@gmail.com',
  role: 'Owner',
  isLoggedIn: true,
  plan: 'Free Community',
  creditsRemaining: 1000,
  projectsLimit: 50,
};

export const sampleHtmlAurora = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aurora AI - Next-Gen Intelligence</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background-color: #080d1a; color: #f8fafc; }
    .gold-gradient { background: linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #d97706 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .blue-glow { box-shadow: 0 0 40px -10px rgba(59, 130, 246, 0.4); }
  </style>
</head>
<body class="min-h-screen flex flex-col justify-between">
  <!-- Nav -->
  <header class="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">A</div>
      <span class="font-bold text-lg tracking-tight text-white">Aurora<span class="text-amber-400">AI</span></span>
    </div>
    <nav class="hidden md:flex gap-6 text-sm text-slate-400">
      <a href="#models" class="hover:text-white transition">Models</a>
      <a href="#features" class="hover:text-white transition">Infrastructure</a>
      <a href="#pricing" class="hover:text-white transition">Free Hosting</a>
    </nav>
    <a href="#get-started" class="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md transition">
      Try Aurora Free
    </a>
  </header>

  <!-- Hero -->
  <main class="max-w-5xl mx-auto px-6 py-20 text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-xs text-blue-300 mb-6">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Hosted with high speed on sai.app
    </div>
    <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
      Build Intelligent Systems at <span class="gold-gradient">Superhuman Speed</span>
    </h1>
    <p class="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
      Empowering developers to deploy real-time multimodal agents with zero server friction. Published globally with HTTPS on SAIPRTAP edge nodes.
    </p>
    <div class="flex flex-wrap items-center justify-center gap-4">
      <button onclick="triggerDemo()" class="px-6 py-3.5 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg blue-glow transition">
        Launch Live Demo
      </button>
      <button class="px-6 py-3.5 text-sm font-semibold rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 transition">
        Read API Docs
      </button>
    </div>

    <!-- Interactive Simulator -->
    <div id="demo-box" class="mt-16 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-left max-w-2xl mx-auto hidden">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
        <span>aurora-agent-v1</span>
        <span class="text-emerald-400 font-mono">LATENCY: 14ms</span>
      </div>
      <div id="demo-output" class="py-4 font-mono text-xs text-slate-300 leading-relaxed">
        Initializing neural weights... Model ready on edge!
      </div>
    </div>

    <!-- Feature Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left" id="features">
      <div class="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
        <h3 class="text-base font-semibold text-white mb-2">Sub-millisecond Edge</h3>
        <p class="text-sm text-slate-400">Deployed across 300+ worldwide edge locations with automatic route optimization.</p>
      </div>
      <div class="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
        <h3 class="text-base font-semibold text-white mb-2">sai.app Native Routing</h3>
        <p class="text-sm text-slate-400">Direct instant SSL certificates and customized domain aliases out of the box.</p>
      </div>
      <div class="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
        <h3 class="text-base font-semibold text-white mb-2">Atomic Rollbacks</h3>
        <p class="text-sm text-slate-400">Every single commit is preserved forever with instant 1-click rollback guarantees.</p>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-slate-800/80 px-6 py-6 text-center text-xs text-slate-500">
    Published on <a href="https://sai.app" class="text-blue-400 hover:underline">SAIPRTAP Cloud</a> · Free Public Hosting Engine
  </footer>

  <script>
    function triggerDemo() {
      const box = document.getElementById('demo-box');
      const out = document.getElementById('demo-output');
      box.classList.remove('hidden');
      out.innerHTML = '<span class="text-amber-400">Generating prompt inference:</span> "Deploying portfolio to sai.app"<br/><span class="text-emerald-400">Success!</span> Project compiled in 420ms. Status: 200 OK.';
    }
  </script>
</body>
</html>`;

export const sampleHtmlVelox = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Velox eSports & Gaming</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen">
  <nav class="border-b border-purple-900/40 bg-slate-950/80 backdrop-blur px-6 py-4 flex items-center justify-between">
    <div class="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
      ⚡ VELOX GAMING
    </div>
    <div class="text-xs text-slate-400 font-mono">LIVE ON SAI.APP</div>
  </nav>
  <main class="max-w-4xl mx-auto px-6 py-16 text-center">
    <span class="text-xs font-semibold px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full border border-purple-700/50">TOURNAMENT READY</span>
    <h1 class="text-5xl font-black mt-4 mb-6">COMPETE. DOMINATE. WIN.</h1>
    <p class="text-slate-400 max-w-xl mx-auto mb-8">Join the premier competitive gaming guild hosted globally on SAIPRTAP edge infrastructure.</p>
    <div class="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-left max-w-md mx-auto">
      <div class="font-bold text-sm text-purple-400 mb-2">Upcoming Showmatch</div>
      <div class="text-xs text-slate-300 flex justify-between py-1 border-b border-slate-800">
        <span>Team Velox vs CyberApex</span>
        <span class="text-emerald-400">LIVE NOW</span>
      </div>
      <div class="text-xs text-slate-300 flex justify-between py-1">
        <span>Prize Pool</span>
        <span class="text-amber-400 font-mono">$25,000 USD</span>
      </div>
    </div>
  </main>
</body>
</html>`;

export const sampleHtmlSynthBeats = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SynthBeats - Web Audio Synthesizer</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-neutral-950 text-neutral-100 font-sans min-h-screen flex flex-col justify-center items-center p-6">
  <div class="max-w-lg w-full bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl text-center">
    <div class="inline-block p-3 rounded-xl bg-amber-500/10 text-amber-400 mb-4 font-mono text-xs">SYNTH-ENGINE v1.2</div>
    <h1 class="text-3xl font-bold mb-2">SynthBeats Studio</h1>
    <p class="text-sm text-neutral-400 mb-8">Click keys below to play real synthesizers directly in your browser.</p>
    
    <div class="grid grid-cols-4 gap-3 mb-8">
      <button onclick="playTone(261.63)" class="py-4 bg-neutral-800 hover:bg-neutral-700 active:bg-amber-500 active:text-black rounded-lg font-bold transition text-sm">C4</button>
      <button onclick="playTone(293.66)" class="py-4 bg-neutral-800 hover:bg-neutral-700 active:bg-amber-500 active:text-black rounded-lg font-bold transition text-sm">D4</button>
      <button onclick="playTone(329.63)" class="py-4 bg-neutral-800 hover:bg-neutral-700 active:bg-amber-500 active:text-black rounded-lg font-bold transition text-sm">E4</button>
      <button onclick="playTone(392.00)" class="py-4 bg-neutral-800 hover:bg-neutral-700 active:bg-amber-500 active:text-black rounded-lg font-bold transition text-sm">G4</button>
    </div>

    <div class="text-xs text-neutral-500">Hosted seamlessly at synth-beats.sai.app</div>
  </div>

  <script>
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    function playTone(freq) {
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    }
  </script>
</body>
</html>`;

export const initialProjects: Project[] = [
  {
    id: 'proj_aurora_01',
    name: 'Aurora AI Platform',
    slug: 'aurora-ai',
    subdomain: 'aurora-ai.sai.app',
    description: 'High-performance AI agent developer platform deployed with global edge caching.',
    createdAt: '2026-11-08T10:14:00Z',
    updatedAt: '2026-11-10T08:30:00Z',
    framework: 'Static HTML & Tailwind',
    productionDeploymentId: 'dep_aurora_prod_01',
    files: {
      'index.html': sampleHtmlAurora,
      'README.md': '# Aurora AI\n\nOfficial landing page published on sai.app.',
    },
    deployments: [
      {
        id: 'dep_aurora_prod_01',
        projectId: 'proj_aurora_01',
        branch: 'main',
        commitHash: '7f9c2d1',
        commitMessage: 'feat: add interactive live demo and edge headers',
        status: 'published',
        createdAt: '2026-11-10T08:28:00Z',
        finishedAt: '2026-11-10T08:28:42Z',
        durationSeconds: 42,
        previewUrl: 'https://aurora-ai.sai.app',
        isProduction: true,
        sourceType: 'github',
        logs: [
          { id: '1', timestamp: '08:28:01', level: 'info', message: 'Build worker initialized in sandbox #worker-sg-4' },
          { id: '2', timestamp: '08:28:05', level: 'info', message: 'Cloned saipratap/aurora-ai (commit 7f9c2d1)' },
          { id: '3', timestamp: '08:28:12', level: 'info', message: 'Detected framework: Static HTML / Tailwind' },
          { id: '4', timestamp: '08:28:20', level: 'info', message: 'Validating zero path-traversal and file security... Passed' },
          { id: '5', timestamp: '08:28:28', level: 'info', message: 'Building production assets and minifying markup' },
          { id: '6', timestamp: '08:28:34', level: 'info', message: 'Pushing static artifacts to SAIPRTAP edge storage' },
          { id: '7', timestamp: '08:28:39', level: 'info', message: 'Provisioned wildcard SSL certificate for *.sai.app' },
          { id: '8', timestamp: '08:28:42', level: 'success', message: 'Atomic switch activated! Site live at https://aurora-ai.sai.app' },
        ],
        files: {
          'index.html': sampleHtmlAurora,
        },
      },
      {
        id: 'dep_aurora_prev_02',
        projectId: 'proj_aurora_01',
        branch: 'feature/pricing-v2',
        commitHash: '3a18e0b',
        commitMessage: 'test: preview pricing tier enhancements',
        status: 'preview_ready',
        createdAt: '2026-11-09T14:10:00Z',
        finishedAt: '2026-11-09T14:10:35Z',
        durationSeconds: 35,
        previewUrl: 'https://prev-3a18e0b--aurora-ai.sai.app',
        isProduction: false,
        sourceType: 'github',
        logs: [
          { id: '1', timestamp: '14:10:02', level: 'info', message: 'Branch build queued for feature/pricing-v2' },
          { id: '2', timestamp: '14:10:18', level: 'info', message: 'Validation checks passed' },
          { id: '3', timestamp: '14:10:35', level: 'success', message: 'Preview available at https://prev-3a18e0b--aurora-ai.sai.app' },
        ],
        files: {
          'index.html': sampleHtmlAurora,
        },
      },
    ],
    customDomains: [
      {
        id: 'dom_1',
        domain: 'aurora-ai.tech',
        verified: true,
        sslActive: true,
        createdAt: '2026-11-09T11:00:00Z',
        dnsRecords: [
          { type: 'CNAME', name: '@', value: 'cname.sai.app', status: 'configured' },
          { type: 'CNAME', name: 'www', value: 'aurora-ai.sai.app', status: 'configured' },
        ],
      },
    ],
    settings: {
      buildCommand: '',
      publishDirectory: './',
      framework: 'Static HTML',
      nodeVersion: '20.x',
      autoDeployOnPush: true,
    },
    envVars: [
      { key: 'VITE_API_BASE', value: 'https://api.aurora-ai.tech/v1', isSecret: false },
      { key: 'AURORA_SECRET_KEY', value: 'sk_live_994183818471928471', isSecret: true },
    ],
    forms: [
      {
        id: 'form_contact_01',
        name: 'Contact & Sales Inquiries',
        endpoint: '/api/forms/contact',
        enabled: true,
        submissionsCount: 148,
        lastSubmission: '2026-11-10T07:15:00Z',
      },
    ],
    functions: [
      {
        id: 'fn_health_01',
        name: 'Health Check Prober',
        route: '/api/health',
        runtime: 'Edge Worker',
        method: 'GET',
        code: `export default async function handler(req) {\n  return new Response(JSON.stringify({ status: "healthy", region: "sai-edge-ap-south" }), {\n    headers: { "Content-Type": "application/json" }\n  });\n}`,
        invocations: 12450,
        avgDurationMs: 4.8,
        lastInvoked: '2026-11-10T08:55:00Z',
      },
    ],
    storageBytes: 1450000,
    monthlyBandwidthBytes: 1240000000,
    visitorsToday: 1842,
    pageViewsToday: 6210,
    githubRepo: {
      owner: 'saipratap',
      name: 'aurora-ai',
      branch: 'main',
      autoDeploy: true,
    },
  },
  {
    id: 'proj_velox_02',
    name: 'Velox Gaming Guild',
    slug: 'velox-gaming',
    subdomain: 'velox-gaming.sai.app',
    description: 'Competitive eSports portal and tournament ranking board.',
    createdAt: '2026-11-07T12:00:00Z',
    updatedAt: '2026-11-09T18:20:00Z',
    framework: 'Static HTML',
    productionDeploymentId: 'dep_velox_prod_01',
    files: {
      'index.html': sampleHtmlVelox,
    },
    deployments: [
      {
        id: 'dep_velox_prod_01',
        projectId: 'proj_velox_02',
        branch: 'main',
        status: 'published',
        createdAt: '2026-11-09T18:20:00Z',
        finishedAt: '2026-11-09T18:20:25Z',
        durationSeconds: 25,
        previewUrl: 'https://velox-gaming.sai.app',
        isProduction: true,
        sourceType: 'zip',
        logs: [
          { id: '1', timestamp: '18:20:01', level: 'info', message: 'ZIP package uploaded (1.2 MB)' },
          { id: '2', timestamp: '18:20:05', level: 'info', message: 'Extracted 12 assets safely' },
          { id: '3', timestamp: '18:20:25', level: 'success', message: 'Published to https://velox-gaming.sai.app' },
        ],
        files: {
          'index.html': sampleHtmlVelox,
        },
      },
    ],
    customDomains: [],
    settings: {
      buildCommand: '',
      publishDirectory: './',
      framework: 'Static HTML',
      nodeVersion: '20.x',
      autoDeployOnPush: false,
    },
    envVars: [],
    forms: [],
    functions: [],
    storageBytes: 820000,
    monthlyBandwidthBytes: 420000000,
    visitorsToday: 640,
    pageViewsToday: 1980,
  },
  {
    id: 'proj_synth_03',
    name: 'SynthBeats Studio',
    slug: 'synth-beats',
    subdomain: 'synth-beats.sai.app',
    description: 'Interactive in-browser audio synthesizer with Web Audio API.',
    createdAt: '2026-11-06T09:00:00Z',
    updatedAt: '2026-11-08T15:40:00Z',
    framework: 'Static JavaScript',
    productionDeploymentId: 'dep_synth_prod_01',
    files: {
      'index.html': sampleHtmlSynthBeats,
    },
    deployments: [
      {
        id: 'dep_synth_prod_01',
        projectId: 'proj_synth_03',
        branch: 'main',
        status: 'published',
        createdAt: '2026-11-08T15:40:00Z',
        durationSeconds: 19,
        previewUrl: 'https://synth-beats.sai.app',
        isProduction: true,
        sourceType: 'ai',
        logs: [
          { id: '1', timestamp: '15:40:01', level: 'info', message: 'Prompt received by SAIPRTAP AI' },
          { id: '2', timestamp: '15:40:08', level: 'info', message: 'Generated Web Audio API synthesizer code' },
          { id: '3', timestamp: '15:40:19', level: 'success', message: 'Deployed to https://synth-beats.sai.app' },
        ],
        files: {
          'index.html': sampleHtmlSynthBeats,
        },
      },
    ],
    customDomains: [],
    settings: {
      buildCommand: '',
      publishDirectory: './',
      framework: 'Static JavaScript',
      nodeVersion: '20.x',
      autoDeployOnPush: false,
    },
    envVars: [],
    forms: [],
    functions: [],
    storageBytes: 310000,
    monthlyBandwidthBytes: 190000000,
    visitorsToday: 320,
    pageViewsToday: 1140,
  },
];

export const starterTemplates: Template[] = [
  {
    id: 'tpl_portfolio',
    title: 'Developer & Creator Portfolio',
    category: 'Portfolio',
    description: 'Clean personal showcase with project gallery, skills matrix, interactive contact form, and dark aesthetic.',
    previewUrl: 'https://demo-portfolio.sai.app',
    framework: 'HTML + Tailwind',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alex Rivera - Senior Full-Stack Engineer</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen">
  <div class="max-w-4xl mx-auto px-6 py-16">
    <div class="flex items-center gap-4 mb-8">
      <div class="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center font-bold text-2xl text-white">AR</div>
      <div>
        <h1 class="text-3xl font-extrabold text-white">Alex Rivera</h1>
        <p class="text-sm text-slate-400">Staff Systems Architect & Creative Technologist · San Francisco</p>
      </div>
    </div>
    <p class="text-base text-slate-300 leading-relaxed mb-12">
      Crafting high-throughput distributed systems, WebGL experiences, and cloud developer platforms. Passionate about open-source, edge computing, and minimalist interfaces.
    </p>
    <h2 class="text-xl font-bold mb-4 text-white">Selected Works</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition">
        <h3 class="font-semibold text-white">Kinesis Edge Router</h3>
        <p class="text-xs text-slate-400 mt-1">Lightweight HTTP reverse proxy built with Rust and WebAssembly.</p>
      </div>
      <div class="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition">
        <h3 class="font-semibold text-white">Prism Audio Studio</h3>
        <p class="text-xs text-slate-400 mt-1">Real-time collaborative synthesizer with WebRTC data channels.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
    },
  },
  {
    id: 'tpl_saas',
    title: 'Modern SaaS Launchpad',
    category: 'SaaS & Tech',
    description: 'High-converting SaaS landing page with animated feature highlights, pricing tiers, and trust signals.',
    previewUrl: 'https://demo-saas.sai.app',
    framework: 'HTML + Tailwind',
    files: {
      'index.html': sampleHtmlAurora,
    },
  },
  {
    id: 'tpl_education',
    title: 'EduSphere Academy Portal',
    category: 'Education',
    description: 'Course catalog, student registration, syllabus overview, and interactive quiz preview.',
    previewUrl: 'https://demo-education.sai.app',
    framework: 'HTML + Tailwind',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EduSphere Academy - Master Modern Computer Science</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen">
  <header class="p-6 border-b border-slate-800 flex justify-between items-center max-w-6xl mx-auto">
    <div class="font-bold text-lg text-emerald-400">🎓 EduSphere Academy</div>
    <button class="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg">Browse Courses</button>
  </header>
  <main class="max-w-4xl mx-auto px-6 py-16 text-center">
    <h1 class="text-4xl font-extrabold mb-4">Accelerate Your Engineering Career</h1>
    <p class="text-slate-400 mb-10">Cohort-based learning in Distributed Systems, AI Infrastructure, and Cloud Operations.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      <div class="p-6 bg-slate-800/60 border border-slate-700 rounded-xl">
        <span class="text-xs text-emerald-400 font-semibold">12-WEEK COHORT</span>
        <h3 class="text-lg font-bold mt-1 text-white">Full-Stack Cloud Infrastructure</h3>
        <p class="text-xs text-slate-400 mt-2">Deploying Kubernetes, Terraform, edge caching, and automated CI/CD.</p>
      </div>
      <div class="p-6 bg-slate-800/60 border border-slate-700 rounded-xl">
        <span class="text-xs text-blue-400 font-semibold">SELF-PACED</span>
        <h3 class="text-lg font-bold mt-1 text-white">Applied Machine Learning</h3>
        <p class="text-xs text-slate-400 mt-2">Fine-tuning open models, vector databases, and real-time inference.</p>
      </div>
    </div>
  </main>
</body>
</html>`,
    },
  },
  {
    id: 'tpl_ecommerce',
    title: 'Aura Minimalist Storefront',
    category: 'E-Commerce',
    description: 'Modern lifestyle and hardware retail storefront with product gallery, shopping cart, and checkout.',
    previewUrl: 'https://demo-shop.sai.app',
    framework: 'HTML + Tailwind',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AURA - Minimalist Everyday Essentials</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-stone-900 text-stone-100 min-h-screen">
  <header class="border-b border-stone-800 p-6 flex justify-between items-center max-w-5xl mx-auto">
    <span class="font-serif tracking-widest text-lg font-bold">A U R A</span>
    <button class="text-xs font-mono uppercase bg-stone-800 px-3 py-1.5 rounded">Cart (0)</button>
  </header>
  <main class="max-w-5xl mx-auto px-6 py-12">
    <h1 class="text-3xl font-serif mb-8 text-center">New Season Curations</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-stone-800/40 border border-stone-800 p-4 rounded-xl">
        <div class="h-48 bg-stone-800 rounded-lg flex items-center justify-center text-xs text-stone-500 font-mono">PRODUCT IMAGE</div>
        <div class="mt-4 flex justify-between font-medium text-sm">
          <span>Mechanical Desk Clock</span>
          <span class="text-amber-400">$180</span>
        </div>
      </div>
      <div class="bg-stone-800/40 border border-stone-800 p-4 rounded-xl">
        <div class="h-48 bg-stone-800 rounded-lg flex items-center justify-center text-xs text-stone-500 font-mono">PRODUCT IMAGE</div>
        <div class="mt-4 flex justify-between font-medium text-sm">
          <span>Anodized Aluminum Lamp</span>
          <span class="text-amber-400">$240</span>
        </div>
      </div>
      <div class="bg-stone-800/40 border border-stone-800 p-4 rounded-xl">
        <div class="h-48 bg-stone-800 rounded-lg flex items-center justify-center text-xs text-stone-500 font-mono">PRODUCT IMAGE</div>
        <div class="mt-4 flex justify-between font-medium text-sm">
          <span>Matte Ceramic Planter</span>
          <span class="text-amber-400">$95</span>
        </div>
      </div>
    </div>
  </main>
</body>
</html>`,
    },
  },
  {
    id: 'tpl_agency',
    title: 'Kinetic Digital Agency',
    category: 'Agency',
    description: 'Bold creative studio showcase with case studies, client roster, and service offerings.',
    previewUrl: 'https://demo-agency.sai.app',
    framework: 'HTML + Tailwind',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kinetic - Digital Product & Design Studio</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-black text-white min-h-screen">
  <div class="max-w-5xl mx-auto px-6 py-20">
    <div class="text-xs uppercase tracking-widest text-zinc-500 font-mono mb-4">STRATEGY · DESIGN · ENGINEERING</div>
    <h1 class="text-5xl sm:text-7xl font-bold tracking-tight mb-8">We turn audacious ideas into market-defining products.</h1>
    <p class="text-zinc-400 text-lg max-w-2xl mb-12">Partnering with visionary founders from pre-seed to IPO to deliver category-defining brand identities and web platforms.</p>
    <a href="#contact" class="inline-block px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition">Start a Project</a>
  </div>
</body>
</html>`,
    },
  },
  {
    id: 'tpl_restaurant',
    title: 'L\'Atelier Fine Dining & Bar',
    category: 'Restaurant',
    description: 'Culinary experience landing page with chef specials, seasonal menu, and reservation form.',
    previewUrl: 'https://demo-latelier.sai.app',
    framework: 'HTML + Tailwind',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>L'Atelier - Artisanal Cuisine</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen">
  <div class="max-w-3xl mx-auto px-6 py-16 text-center">
    <h1 class="text-4xl font-serif tracking-widest mb-2">L ' A T E L I E R</h1>
    <p class="text-xs font-mono uppercase text-amber-400 tracking-wider mb-8">Farm-to-Table Seasonal Dining</p>
    <p class="text-zinc-400 italic mb-12">"Every dish tells the story of our harvest, crafted with patience, passion, and precision."</p>
    <div class="border-y border-zinc-800 py-6 mb-8">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-zinc-300 mb-4">Chef's Tasting Highlights</h3>
      <div class="text-xs text-zinc-400 space-y-2">
        <p>Smoked Chanterelle Broth · Fermented Wild Garlic</p>
        <p>Pan-Seared Arctic Char · Sunchoke Puree & Fennel Pollen</p>
        <p>Caramelized Quince Tart · Spiced Creme Fraiche</p>
      </div>
    </div>
    <button class="px-6 py-3 bg-amber-500 text-black font-semibold text-xs tracking-wider uppercase rounded-lg">Reserve a Table</button>
  </div>
</body>
</html>`,
    },
  },
];
