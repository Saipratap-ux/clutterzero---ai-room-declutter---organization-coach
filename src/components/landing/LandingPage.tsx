import React, { useState } from 'react';
import { Project, UserProfile } from '../../types';
import { Logo } from '../brand/Logo';
import { 
  Sparkles, 
  Rocket, 
  UploadCloud, 
  FolderGit2, 
  Globe, 
  ShieldCheck, 
  Zap, 
  RotateCcw, 
  BarChart3, 
  Smartphone, 
  ArrowRight, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Laptop,
  Code
} from 'lucide-react';

interface LandingPageProps {
  onStartBuilding: () => void;
  onDeployWebsite: () => void;
  onExploreAI: () => void;
  onOpenDocs: () => void;
  onOpenSandbox: (project: Project) => void;
  projects: Project[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartBuilding,
  onDeployWebsite,
  onExploreAI,
  onOpenDocs,
  onOpenSandbox,
  projects,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const featuredProject = projects[0];

  const faqs = [
    {
      q: 'How does SAIPRTAP replace netlify.app with sai.app?',
      a: 'SAIPRTAP operates its own independent global edge routing and deployment infrastructure. Every project you publish is automatically routed to https://your-project.sai.app with free, automated TLS/SSL certificates and Anycast CDN caching.',
    },
    {
      q: 'Is public website publishing truly free without a mandatory subscription?',
      a: 'Yes! SAIPRTAP was built around the core principle that public website publishing should be accessible to everyone. You get unlimited static projects, 100GB monthly bandwidth, atomic deployments, and preview URLs with zero credit card required.',
    },
    {
      q: 'Can I connect a custom domain like mybrand.com?',
      a: 'Absolutely. In addition to your free *.sai.app subdomain, you can bind any custom domain. Simply add a CNAME record pointing to cname.sai.app and we automatically provision Let\'s Encrypt TLS certificates.',
    },
    {
      q: 'How does the AI Website Builder work?',
      a: 'You describe your website needs in natural language. SAIPRTAP generates full HTML5 markup, responsive Tailwind CSS layouts, interactive client-side logic, and embedded forms, followed by automated health checks and instant live deployment.',
    },
    {
      q: 'Can I roll back if an update introduces a bug?',
      a: 'Yes. Every single build is immutable and versioned. You can rollback to any previous commit or ZIP upload in under 300 milliseconds with zero downtime.',
    },
    {
      q: 'Can I install the SAIPRTAP developer console as an app?',
      a: 'Yes! SAIPRTAP is a compliant Progressive Web App (PWA). You can install it on macOS, Windows, Linux, iOS, and Android for instant offline dashboard access.',
    },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 font-mono shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            FREE PUBLIC WEBSITE PUBLISHING · ON YOUR OWN SAI.APP ADDRESS
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Your Website. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">
              Your Code. Your World.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Build, deploy and publish websites with SAIPRTAP. Use AI, upload your project or connect GitHub and publish your website on your own <span className="text-amber-400 font-mono font-bold">your-site.sai.app</span> address.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <button
              onClick={onStartBuilding}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              Start Building Free
            </button>
            <button
              onClick={onDeployWebsite}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition transform hover:-translate-y-0.5"
            >
              Deploy Your Website
            </button>
            <button
              onClick={onExploreAI}
              className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold transition"
            >
              Explore AI Builder
            </button>
            <button
              onClick={onOpenDocs}
              className="px-5 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-sm font-medium transition"
            >
              Documentation
            </button>
          </div>

          {/* Slogan */}
          <div className="pt-4 text-xs font-mono uppercase tracking-widest text-slate-500">
            Build • Deploy • Host • Innovate
          </div>
        </div>

        {/* Live Interactive Sandbox Showcase Hero Card */}
        {featuredProject && (
          <div className="mt-14 max-w-5xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-blue-600/30 to-purple-600/30 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
              {/* Browser bar */}
              <div className="bg-[#0e1628] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-4 py-1.5 text-xs font-mono text-slate-300">
                  <span className="text-emerald-400">🔒 https://</span>
                  <span className="text-amber-400 font-bold">{featuredProject.subdomain}</span>
                </div>

                <button
                  onClick={() => onOpenSandbox(featuredProject)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition"
                >
                  <span>Interactive View</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Embedded frame */}
              <div className="h-[440px] sm:h-[500px] w-full bg-white">
                <iframe
                  title="Hero Live Showcase"
                  srcDoc={featuredProject.files['index.html']}
                  sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
                  className="w-full h-full border-0 bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* URL System Comparison Banner (PRD Section 3) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                PROPRIETARY DOMAIN SYSTEM
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 leading-tight">
                No More Netlify Branding. <br />
                Your Identity on <span className="text-blue-400">sai.app</span>.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                Every published project uses the SAIPRTAP domain architecture with wildcard Anycast routing and automated Let's Encrypt certificates.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-500">Other Providers:</span>
                <span className="text-rose-400 line-through">your-project.netlify.app</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-500">SAIPRTAP Production:</span>
                <span className="text-emerald-400 font-bold">https://your-site.sai.app</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Branch Preview:</span>
                <span className="text-blue-400">https://prev-9a1b--site.sai.app</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12 Core Architecture Features (PRD Section 4.1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Independent Developer Cloud
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A comprehensive hosting, deployment, and AI-accelerated creation engine crafted for high performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. AI Creation */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">1. AI-Powered Website Creation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Describe requirements in plain language. Generate responsive layouts, functional client code, and preview instantly.
            </p>
          </div>

          {/* 2. One-Click Deployment */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">2. One-Click ZIP Deployment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag and drop any ZIP archive or build folder. Automatic path traversal sanitization and framework detection.
            </p>
          </div>

          {/* 3. Free Public Hosting */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">3. Free Public Hosting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No mandatory subscription for publishing. Unlimited static sites on <code className="text-amber-400 font-mono">*.sai.app</code> with 100GB monthly bandwidth.
            </p>
          </div>

          {/* 4. GitHub CI/CD */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">4. GitHub Continuous Delivery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect your repository and branch. Automatically build and publish whenever new commits land on main.
            </p>
          </div>

          {/* 5. Automatic HTTPS */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">5. Automatic HTTPS Everywhere</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated TLS 1.3 certificates provisioned instantaneously via Let's Encrypt for all subdomains and custom domains.
            </p>
          </div>

          {/* 6. Deployment Previews */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">6. Atomic Previews & Rollbacks</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unique preview addresses for every branch and build. One-click instant rollbacks if any regression occurs.
            </p>
          </div>

          {/* 7. Analytics */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">7. Privacy-Conscious Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track page views, unique visitors, top referrers, and geography without tracking cookies or GDPR overhead.
            </p>
          </div>

          {/* 8. Developer Tools */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">8. Built-in Code Editor & AI Fix</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full file explorer, syntax highlight, AI diagnostics repair, live hot preview, and source code ZIP downloads.
            </p>
          </div>

          {/* 9. Custom Domains */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">9. Custom Domain Routing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bring your own external domain names. Guided CNAME and A record verification with automated certificate binding.
            </p>
          </div>

          {/* 10. PWA Support */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">10. Progressive Web App (PWA)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Install the SAIPRTAP dashboard on Android, iOS, Windows, or Mac with offline service worker caching.
            </p>
          </div>

          {/* 11. Security */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">11. Sandboxed Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero unsandboxed code execution. Path-traversal defense, zip bomb protection, and encrypted environment secrets.
            </p>
          </div>

          {/* 12. Edge CDN */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">12. Worldwide Edge Distribution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Published directly to Cloudflare edge nodes across 300+ cities with sub-20ms global delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (PRD Section 4.1 #12) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Clear answers about SAIPRTAP hosting, domains, and our free publishing model.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-blue-400 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-blue-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Footer Strip */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-blue-950/80 via-slate-900 to-amber-950/30 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
          <Logo size="lg" className="justify-center mb-2" showSlogan={false} />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Deploy your website on sai.app today.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join developers and creators launching fast, secure websites with automatic HTTPS and edge acceleration.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onStartBuilding}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition"
            >
              Start Free Publication
            </button>
            <button
              onClick={onDeployWebsite}
              className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition"
            >
              Upload Project ZIP
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 pt-10 text-center text-xs text-slate-500 space-y-3">
        <div className="flex items-center justify-center gap-6 font-mono text-[11px] text-slate-400">
          <span>*.sai.app</span>
          <span>·</span>
          <span>Free Public Publishing</span>
          <span>·</span>
          <span>Autonomous Edge Infrastructure</span>
        </div>
        <p>© 2026 SAIPRTAP Cloud. Create • Innovate • Deploy • Empower.</p>
      </footer>
    </div>
  );
};
