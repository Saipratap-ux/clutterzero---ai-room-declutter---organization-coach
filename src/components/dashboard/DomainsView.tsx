import React, { useState } from 'react';
import { Project, CustomDomain } from '../../types';
import { 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  RotateCw, 
  ExternalLink,
  Copy,
  Check,
  Lock,
  ArrowRight
} from 'lucide-react';

interface DomainsViewProps {
  project: Project;
  onUpdateSlug: (newSlug: string) => void;
  onAddCustomDomain: (domainName: string) => void;
  onRemoveCustomDomain: (domainId: string) => void;
  onVerifyDomain: (domainId: string) => void;
}

export const DomainsView: React.FC<DomainsViewProps> = ({
  project,
  onUpdateSlug,
  onAddCustomDomain,
  onRemoveCustomDomain,
  onVerifyDomain,
}) => {
  const [slugInput, setSlugInput] = useState(project.slug);
  const [isUpdatingSlug, setIsUpdatingSlug] = useState(false);
  const [slugMessage, setSlugMessage] = useState('');
  
  const [newDomainInput, setNewDomainInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedValue(val);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const handleSlugSave = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = slugInput.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!clean) return;
    if (clean === 'admin' || clean === 'api' || clean === 'docs' || clean === 'status' || clean === 'app') {
      setSlugMessage('This subdomain is reserved by the SAIPRTAP platform.');
      return;
    }
    setIsUpdatingSlug(true);
    setTimeout(() => {
      onUpdateSlug(clean);
      setIsUpdatingSlug(false);
      setSlugMessage('Subdomain updated successfully!');
      setTimeout(() => setSlugMessage(''), 3000);
    }, 400);
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput.trim()) return;
    const cleanDomain = newDomainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    onAddCustomDomain(cleanDomain);
    setNewDomainInput('');
  };

  const handleTriggerVerify = (domainId: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      onVerifyDomain(domainId);
      setIsVerifying(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Domains & DNS Routing</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure default <span className="text-amber-400 font-mono">*.sai.app</span> routing, wildcard certificates, and custom domains.
        </p>
      </div>

      {/* Primary Subdomain Configuration */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase">
              Platform Subdomain
            </span>
            <h2 className="text-base font-bold text-white mt-1">Public sai.app Address</h2>
            <p className="text-xs text-slate-400">
              Every SAIPRTAP project receives a free, forever-live SSL subdomain on the sai.app edge network.
            </p>
          </div>
          <span className="text-emerald-400 font-mono text-xs flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            Automatic HTTPS
          </span>
        </div>

        <form onSubmit={handleSlugSave} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <div className="flex items-center flex-1 max-w-md">
            <span className="bg-slate-950 border border-r-0 border-slate-800 px-3.5 py-2.5 rounded-l-xl text-xs font-mono text-slate-500">
              https://
            </span>
            <input
              type="text"
              value={slugInput}
              onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="project-slug"
              className="w-full bg-slate-950 border-y border-slate-800 py-2.5 px-3 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
            <span className="bg-slate-800 border border-l-0 border-slate-700 px-3.5 py-2.5 rounded-r-xl text-xs font-mono text-amber-400 font-semibold">
              .sai.app
            </span>
          </div>

          <button
            type="submit"
            disabled={isUpdatingSlug || slugInput === project.slug}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-xs shadow-md transition"
          >
            {isUpdatingSlug ? 'Saving...' : 'Update Subdomain'}
          </button>
        </form>

        {slugMessage && (
          <div className="text-xs text-emerald-400 font-medium">{slugMessage}</div>
        )}
      </div>

      {/* Custom Domains Management (PRD Section 12) */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase">
                Custom Domains
              </span>
              <h2 className="text-base font-bold text-white mt-1">Connect Your Own Domain</h2>
              <p className="text-xs text-slate-400">
                Point your domain or subdomain to SAIPRTAP. We automatically issue and renew Let's Encrypt TLS certificates.
              </p>
            </div>
          </div>
        </div>

        {/* Add domain form */}
        <form onSubmit={handleAddDomain} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            value={newDomainInput}
            onChange={(e) => setNewDomainInput(e.target.value)}
            placeholder="e.g. mycompany.com or app.mycompany.com"
            className="flex-1 max-w-md bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Domain</span>
          </button>
        </form>

        {/* Custom Domains Table */}
        {project.customDomains.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800/80">
            <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              No custom domains added yet. Your site is currently served from <span className="text-amber-400 font-mono">https://{project.subdomain}</span>.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {project.customDomains.map((dom) => (
              <div
                key={dom.id}
                className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-white text-sm font-mono">{dom.domain}</span>
                    {dom.verified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        VERIFIED & SSL ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        <AlertCircle className="w-3 h-3" />
                        PENDING DNS CONFIGURATION
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTriggerVerify(dom.id)}
                      disabled={isVerifying}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                      <span>{isVerifying ? 'Verifying...' : 'Verify DNS'}</span>
                    </button>
                    <button
                      onClick={() => onRemoveCustomDomain(dom.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                      title="Remove domain"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* DNS Instructions Table */}
                <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/40 text-xs">
                  <div className="p-3 bg-slate-900/90 border-b border-slate-800 font-semibold text-slate-300">
                    Required DNS Configuration
                  </div>
                  <div className="p-3 overflow-x-auto">
                    <table className="w-full font-mono text-[11px]">
                      <thead>
                        <tr className="text-left text-slate-500 border-b border-slate-800/80">
                          <th className="pb-2">Type</th>
                          <th className="pb-2">Name</th>
                          <th className="pb-2">Value / Target</th>
                          <th className="pb-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 text-slate-300">
                        <tr>
                          <td className="py-2.5 text-amber-400 font-bold">CNAME</td>
                          <td className="py-2.5">{dom.domain.includes('.') && dom.domain.split('.').length > 2 ? dom.domain.split('.')[0] : '@'}</td>
                          <td className="py-2.5">cname.sai.app</td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => handleCopy('cname.sai.app')}
                              className="text-slate-400 hover:text-white"
                              title="Copy value"
                            >
                              {copiedValue === 'cname.sai.app' ? <Check className="w-3.5 h-3.5 text-emerald-400 inline" /> : <Copy className="w-3.5 h-3.5 inline" />}
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-blue-400 font-bold">A Record</td>
                          <td className="py-2.5">@</td>
                          <td className="py-2.5">76.76.21.21 (SAIPRTAP Anycast Edge)</td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => handleCopy('76.76.21.21')}
                              className="text-slate-400 hover:text-white"
                              title="Copy value"
                            >
                              {copiedValue === '76.76.21.21' ? <Check className="w-3.5 h-3.5 text-emerald-400 inline" /> : <Copy className="w-3.5 h-3.5 inline" />}
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
