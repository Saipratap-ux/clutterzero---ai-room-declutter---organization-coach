import React, { useState } from 'react';
import { BookOpen, Terminal, Copy, Check, ExternalLink, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-[11px] text-blue-300 font-mono mb-2">
          <span>DOCS.SAI.APP</span> · DEVELOPER REFERENCE
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          SAIPRTAP Cloud Documentation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Everything you need to build, deploy, configure domains, and automate publishing on the SAIPRTAP edge platform.
        </p>
      </div>

      {/* CLI Quickstart */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">SAIPRTAP Command-Line Interface (CLI)</h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">v2.4.0 (Latest)</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Deploy directly from your local terminal with one command. Compatible with any Node.js, Rust, Go, or static project.
        </p>

        <div className="space-y-2">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs flex items-center justify-between">
            <code className="text-slate-200">npm install -g @saiprtap/cli</code>
            <button
              onClick={() => handleCopy('npm install -g @saiprtap/cli', 'cli-install')}
              className="text-slate-400 hover:text-white"
            >
              {copiedSnippet === 'cli-install' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs flex items-center justify-between">
            <code className="text-slate-200">sai login</code>
            <button
              onClick={() => handleCopy('sai login', 'cli-login')}
              className="text-slate-400 hover:text-white"
            >
              {copiedSnippet === 'cli-login' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs flex items-center justify-between">
            <code className="text-amber-400">sai deploy --prod --domain my-site.sai.app</code>
            <button
              onClick={() => handleCopy('sai deploy --prod --domain my-site.sai.app', 'cli-deploy')}
              className="text-slate-400 hover:text-white"
            >
              {copiedSnippet === 'cli-deploy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Netlify to SAIPRTAP Migration Guide */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-400" />
          <span>Migrating from Netlify to SAIPRTAP</span>
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          SAIPRTAP is 100% drop-in compatible with Netlify configuration files, redirects, and headers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-xs text-white">_redirects Syntax</div>
            <pre className="font-mono text-[11px] text-slate-300 leading-relaxed">
              <code>{`# SPA Fallback routing\n/*    /index.html   200\n\n# 301 Redirects\n/old-path   /new-path   301\n/blog/*     https://blog.sai.app/:splat  301`}</code>
            </pre>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-xs text-white">_headers Security Rules</div>
            <pre className="font-mono text-[11px] text-slate-300 leading-relaxed">
              <code>{`/*\n  X-Frame-Options: SAMEORIGIN\n  X-Content-Type-Options: nosniff\n  Strict-Transport-Security: max-age=31536000\n  Content-Security-Policy: default-src 'self'`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Free Public Hosting Fair-Use Matrix (PRD Section 13) */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Transparent Fair-Use Policy & Quotas</span>
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          No mandatory subscriptions. Free public website publishing forever on <code className="text-amber-400 font-mono">*.sai.app</code>.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px]">Projects</div>
            <div className="text-base font-bold text-white mt-1">Unlimited</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px]">Monthly Bandwidth</div>
            <div className="text-base font-bold text-emerald-400 mt-1">100 GB Free</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px]">Build Minutes</div>
            <div className="text-base font-bold text-white mt-1">500 Mins / mo</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px]">SSL Certificates</div>
            <div className="text-base font-bold text-emerald-400 mt-1">Automated Free</div>
          </div>
        </div>
      </div>
    </div>
  );
};
