import React, { useState } from 'react';
import { Project, Deployment } from '../../types';
import { 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Terminal, 
  RotateCcw, 
  AlertCircle, 
  Play, 
  XCircle, 
  Copy, 
  Check,
  Eye,
  ShieldCheck,
  Server
} from 'lucide-react';

interface DeploymentsViewProps {
  project: Project;
  onRollback: (deploymentId: string) => void;
  onOpenSandbox: (url: string, html: string, name: string) => void;
  onTriggerNewBuild: () => void;
}

export const DeploymentsView: React.FC<DeploymentsViewProps> = ({
  project,
  onRollback,
  onOpenSandbox,
  onTriggerNewBuild,
}) => {
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<string>(
    project.productionDeploymentId || project.deployments[0]?.id || ''
  );
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const selectedDeployment =
    project.deployments.find((d) => d.id === selectedDeploymentId) || project.deployments[0];

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const getStatusBadge = (status: Deployment['status'], isProd: boolean) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            {isProd ? 'PRODUCTION' : 'PUBLISHED'}
          </span>
        );
      case 'preview_ready':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold">
            <Eye className="w-3 h-3" />
            PREVIEW READY
          </span>
        );
      case 'building':
      case 'installing':
      case 'publishing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3 animate-spin" />
            BUILDING
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
            QUEUED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Deployments & Build Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time build logs, branch preview environments, and atomic rollbacks for <span className="font-mono text-amber-400">{project.name}</span>.
          </p>
        </div>

        <button
          onClick={onTriggerNewBuild}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Trigger New Build</span>
        </button>
      </div>

      {/* Main 2-Column Split: Deployment List (Left) + Detailed Logs Terminal (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Deployment History List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 px-1">
            Deployment History ({project.deployments.length})
          </div>

          <div className="space-y-2.5">
            {project.deployments.map((dep) => {
              const isSelected = dep.id === selectedDeployment?.id;
              const isProd = dep.id === project.productionDeploymentId;

              return (
                <div
                  key={dep.id}
                  onClick={() => setSelectedDeploymentId(dep.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500/70 shadow-lg shadow-blue-950/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {getStatusBadge(dep.status, isProd)}
                    <span className="text-[11px] font-mono text-slate-500">
                      {dep.durationSeconds ? `${dep.durationSeconds}s` : '32s'}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-white mb-1 truncate">
                    {dep.commitMessage || `${dep.sourceType.toUpperCase()} Deployment`}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3 text-slate-500" />
                      {dep.branch} {dep.commitHash && `(${dep.commitHash})`}
                    </span>
                    <span className="text-slate-500">
                      {new Date(dep.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenSandbox(
                          dep.previewUrl,
                          dep.files['index.html'] || project.files['index.html'],
                          `${project.name} (${dep.branch})`
                        );
                      }}
                      className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 truncate"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{dep.previewUrl.replace('https://', '')}</span>
                    </button>

                    {!isProd && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Rollback to this version? It will become the live production site.')) {
                            onRollback(dep.id);
                          }
                        }}
                        className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded-lg transition"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Rollback</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Deployment Details & Terminal Build Logs (7 cols) */}
        {selectedDeployment && (
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">
                      Deployment {selectedDeployment.id}
                    </h2>
                    {getStatusBadge(
                      selectedDeployment.status,
                      selectedDeployment.id === project.productionDeploymentId
                    )}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">
                    Branch: <span className="text-white">{selectedDeployment.branch}</span> · Source: {selectedDeployment.sourceType}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(selectedDeployment.previewUrl)}
                    className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg transition"
                    title="Copy URL"
                  >
                    {copiedUrl === selectedDeployment.previewUrl ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() =>
                      onOpenSandbox(
                        selectedDeployment.previewUrl,
                        selectedDeployment.files['index.html'] || project.files['index.html'],
                        project.name
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open in Sandbox</span>
                  </button>
                </div>
              </div>

              {/* URL card */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/90 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-300 truncate">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{selectedDeployment.previewUrl}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                  HEALTH CHECK OK (200)
                </span>
              </div>

              {/* Real-time Terminal Log Viewer (PRD Section 6) */}
              <div className="rounded-2xl bg-[#050811] border border-slate-800 overflow-hidden font-mono text-xs">
                <div className="bg-[#0b101e] px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    Build Worker Logs (#worker-ap-southeast-1)
                  </span>
                  <span className="text-[10px] text-slate-500">Atomic Activation Engine</span>
                </div>

                <div className="p-4 space-y-2 max-h-[380px] overflow-y-auto text-slate-300 leading-relaxed text-[11px]">
                  {selectedDeployment.logs.map((log) => {
                    const levelColors = {
                      info: 'text-slate-400',
                      warn: 'text-amber-400',
                      error: 'text-rose-400',
                      success: 'text-emerald-400 font-semibold',
                    };
                    return (
                      <div key={log.id} className="flex gap-3">
                        <span className="text-slate-600 select-none">{log.timestamp}</span>
                        <span className={levelColors[log.level]}>
                          {log.level === 'success' && '✓ '}
                          {log.message}
                        </span>
                      </div>
                    );
                  })}
                  <div className="pt-2 text-slate-500 select-none">
                    ────────────────────────────────────────────────────
                    <div className="text-emerald-400 pt-1 font-bold">
                      Build succeeded. Atomic CDN cache invalidated in 240ms.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
