import React from 'react';
import { Logo } from '../brand/Logo';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { UserProfile } from '../../types';
import { LayoutDashboard, LogIn, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'dashboard';
  onNavigate: (view: 'landing' | 'dashboard', tab?: string) => void;
  user: UserProfile;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onStartBuilding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  onOpenAuth,
  onStartBuilding,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line */}
        <button
          onClick={() => onNavigate('landing')}
          className="text-left flex items-center hover:opacity-90 transition whitespace-nowrap shrink-0"
        >
          <Logo size="md" showSlogan={false} />
        </button>

        {/* Zone 2: 4–5 nav links, 1–2 word labels, single-line */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('landing')}
            className={`hover:text-white transition whitespace-nowrap shrink-0 ${currentView === 'landing' ? 'text-amber-400 font-semibold' : ''}`}
          >
            Product
          </button>
          <button
            onClick={() => onNavigate('dashboard', 'ai-builder')}
            className="hover:text-white transition whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Builder</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard', 'deployments')}
            className="hover:text-white transition whitespace-nowrap shrink-0"
          >
            Hosting
          </button>
          <button
            onClick={() => onNavigate('dashboard', 'templates')}
            className="hover:text-white transition whitespace-nowrap shrink-0"
          >
            Templates
          </button>
          <button
            onClick={() => onNavigate('dashboard', 'docs')}
            className="hover:text-white transition whitespace-nowrap shrink-0"
          >
            Docs
          </button>
        </nav>

        {/* Zone 3: 1 primary action area */}
        <div className="flex items-center gap-3 shrink-0">
          <PWAInstallButton variant="nav" />

          {currentView === 'landing' ? (
            user.isLoggedIn ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition whitespace-nowrap shrink-0"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition whitespace-nowrap shrink-0"
                >
                  Log In
                </button>
                <button
                  onClick={onStartBuilding}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition whitespace-nowrap shrink-0"
                >
                  Start Building
                </button>
              </div>
            )
          ) : (
            <button
              onClick={() => onNavigate('landing')}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition whitespace-nowrap shrink-0"
            >
              Public Home
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
