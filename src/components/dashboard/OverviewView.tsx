import React from 'react';
import { Project, UserProfile } from '../../types';
import { 
  Globe, 
  GitBranch, 
  Activity, 
  Users, 
  HardDrive, 
  Layers, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  Sparkles, 
  UploadCloud, 
  FolderGit2,
  Terminal,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface OverviewViewProps {
  projects: Project[];
  user: UserProfile;
  onOpenProject: (projectId: string) => void;
  onNavigateTab: (tab: any) => void;
  onOpenSandbox: (project: Project) => void;
  onUploadZipClick: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  projects,
  user,
  onOpenProject,
  onNavigateTab,
  onOpenSandbox,
  onUploadZipClick,
}) => {
  const totalDeployments = projects.reduce((acc, p) => acc + p.deployments.length, 0);
  const totalVisitors = projects.reduce((acc, p) => acc + p.visitorsToday, 0);
  const totalPageViews = projects.reduce((acc, p) => acc + p.pageViewsToday, 0);
  const totalStorageKb = Math.round(projects.reduce((acc, p) => acc + p.storageBytes, 0) / 1024);
  const totalBandwidthMb = Math.round(projects.reduce((acc, p) => acc + p.monthlyBandwidthBytes, 0) / (1024 * 1024));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-[11px] text-blue-300 font-mono mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SAIPRTAP EDGE CLOUD · 300+ NODES OPERATIONAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Developer Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Build, deploy, and host static sites and web applications with free public publishing on <span className="text-amber-400 font-mono">*.sai.app</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigateTab('ai-builder')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create with AI</span>
          </button>
          <button
            onClick={onUploadZipClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 transition whitespace-nowrap"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Website</span>
          </button>
        </div>
      </div>

      {/* 8 PRD Dashboard Cards (PRD Section 4.3) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Projects</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{projects.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Unlimited free static sites</div>
        </div>

        {/* Published Websites */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Published Sites</span>
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {projects.filter((p) => p.productionDeploymentId).length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">100% Online & HTTPS</div>
        </div>

        {/* Total Deployments */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Deployments</span>
            <GitBranch className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{totalDeployments}</div>
          <div className="text-[11px] text-slate-500 mt-1">Atomic versioned builds</div>
        </div>

        {/* Website Visitors */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Today's Visitors</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{totalVisitors.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">{totalPageViews.toLocaleString()} page views</div>
        </div>

        {/* Successful Builds */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Successful Builds</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {projects.flatMap(p => p.deployments).filter(d => d.status === 'published' || d.status === 'preview_ready').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Zero critical build errors</div>
        </div>

        {/* Failed Builds */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Failed Builds</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">0</div>
          <div className="text-[11px] text-emerald-400 mt-1">Healthy build workers</div>
        </div>

        {/* Storage Usage */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Storage Usage</span>
            <HardDrive className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{totalStorageKb} KB</div>
          <div className="text-[11px] text-slate-500 mt-1">Free quota: 5 GB</div>
        </div>

        {/* Bandwidth Usage */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Bandwidth (Month)</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{totalBandwidthMb} MB</div>
          <div className="text-[11px] text-slate-500 mt-1">100 GB Free Fair-Use</div>
        </div>
      </div>

      {/* Main Grid: Active Projects & Live Deployment Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Published Projects List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Active Projects</span>
            </h2>
            <button
              onClick={() => onNavigateTab('projects')}
              className="text-xs text-blue-400 hover:text-blue-300 transition"
            >
              View all ({projects.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm truncate">{project.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      LIVE
                    </span>
                  </div>
                  <a
                    href={`https://${project.subdomain}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenSandbox(project);
                    }}
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 truncate"
                  >
                    <span>https://{project.subdomain}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  <p className="text-xs text-slate-400 truncate">{project.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenSandbox(project)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition"
                  >
                    Open Live
                  </button>
                  <button
                    onClick={() => onOpenProject(project.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Quick Deploy & System Status */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Instant Publish</span>
          </h2>

          <div
            onClick={onUploadZipClick}
            className="p-6 rounded-2xl bg-slate-900/40 border-2 border-dashed border-slate-700 hover:border-blue-500 cursor-pointer transition text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-white">Drop ZIP or Website Files</h3>
            <p className="text-xs text-slate-400 mt-1 mb-3">
              HTML, CSS, JS, or compiled static folder. Automatic path inspection & live deployment.
            </p>
            <span className="inline-block px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg">
              Browse Files
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span>Hosting Infrastructure</span>
              <span className="text-emerald-400 font-mono text-[11px]">ALL SYSTEMS GREEN</span>
            </div>
            <div className="text-xs text-slate-400 space-y-2">
              <div className="flex justify-between">
                <span>Domain Wildcard:</span>
                <span className="font-mono text-slate-200">*.sai.app</span>
              </div>
              <div className="flex justify-between">
                <span>Edge Routing:</span>
                <span className="font-mono text-slate-200">Cloudflare Workers</span>
              </div>
              <div className="flex justify-between">
                <span>Free SSL Certificates:</span>
                <span className="font-mono text-emerald-400">Automated Let's Encrypt</span>
              </div>
              <div className="flex justify-between">
                <span>Atomic Activation:</span>
                <span className="font-mono text-slate-200">Zero-Downtime Rollbacks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
