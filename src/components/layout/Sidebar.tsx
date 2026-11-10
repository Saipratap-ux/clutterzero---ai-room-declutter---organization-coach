import React from 'react';
import { Project, UserProfile } from '../../types';
import { 
  LayoutDashboard, 
  FolderGit2, 
  PlusCircle, 
  Sparkles, 
  GitBranch, 
  Globe, 
  BarChart3, 
  Zap, 
  Inbox, 
  HardDrive, 
  Key, 
  Users, 
  BookOpen, 
  Settings, 
  LifeBuoy, 
  Activity,
  Layers,
  ChevronDown,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';

export type DashboardTab = 
  | 'overview'
  | 'projects'
  | 'create'
  | 'ai-builder'
  | 'deployments'
  | 'github'
  | 'domains'
  | 'analytics'
  | 'functions'
  | 'forms'
  | 'storage'
  | 'env-vars'
  | 'team'
  | 'docs'
  | 'settings'
  | 'admin'
  | 'templates';

interface SidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
  user: UserProfile;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  projects,
  selectedProjectId,
  onSelectProject,
  user,
  onLogout,
  onOpenAuth,
}) => {
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const menuItems: { id: DashboardTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'My Projects', icon: <Layers className="w-4 h-4" />, badge: `${projects.length}` },
    { id: 'create', label: 'Create Website', icon: <PlusCircle className="w-4 h-4 text-emerald-400" /> },
    { id: 'ai-builder', label: 'AI Website Builder', icon: <Sparkles className="w-4 h-4 text-blue-400" />, badge: 'AI' },
    { id: 'deployments', label: 'Deployments', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'github', label: 'GitHub CI/CD', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'domains', label: 'Domains & DNS', icon: <Globe className="w-4 h-4 text-amber-400" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'functions', label: 'Edge Functions', icon: <Zap className="w-4 h-4" /> },
    { id: 'forms', label: 'Forms & Inbox', icon: <Inbox className="w-4 h-4" /> },
    { id: 'storage', label: 'Storage & Assets', icon: <HardDrive className="w-4 h-4" /> },
    { id: 'env-vars', label: 'Env Variables', icon: <Key className="w-4 h-4" /> },
    { id: 'team', label: 'Team Members', icon: <Users className="w-4 h-4" /> },
    { id: 'docs', label: 'Documentation', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'admin', label: 'Platform Health', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0">
      {/* Project Switcher Bar */}
      <div className="p-3 border-b border-slate-800/70">
        <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1 block px-1">
          Active Project
        </label>
        <div className="relative">
          <select
            value={selectedProjectId}
            onChange={(e) => onSelectProject(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-white rounded-xl py-2 px-3 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer pr-8 truncate"
          >
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name} ({proj.slug}.sai.app)
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={isActive ? 'text-blue-400' : 'text-slate-400'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Resource Quotas & Fair-use meter */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl mb-3 space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Monthly Bandwidth</span>
            <span className="font-mono text-white text-[10px]">1.85 / 100 GB</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-amber-400 w-[1.85%]"></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 pt-0.5">
            <span>Free Public Tier</span>
            <span className="text-emerald-400 font-mono">100% FREE</span>
          </div>
        </div>

        <PWAInstallButton variant="sidebar" />

        {/* User bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center justify-between">
          {user.isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 truncate">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="truncate text-left">
                  <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium transition"
            >
              Sign In to Save Sites
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
