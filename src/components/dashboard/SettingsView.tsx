import React, { useState } from 'react';
import { UserProfile, Project } from '../../types';
import { Settings, User, Bell, Shield, Key, Trash2, Check, AlertTriangle } from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onDeleteAccount: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onDeleteAccount,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [notifyOnBuild, setNotifyOnBuild] = useState(true);
  const [notifyOnDomain, setNotifyOnDomain] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, email });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Account & Platform Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your developer profile, notification channels, and active sessions.
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <span>Profile Information</span>
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
            >
              Save Profile
            </button>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile updated
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Notification Preferences (PRD Section 19) */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          <span>Deployment & Health Notifications</span>
        </h2>

        <div className="space-y-3 max-w-lg text-xs">
          <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <span className="text-slate-300">Notify on successful build & publication</span>
            <input
              type="checkbox"
              checked={notifyOnBuild}
              onChange={(e) => setNotifyOnBuild(e.target.checked)}
              className="accent-blue-600 w-4 h-4 rounded"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <span className="text-slate-300">Notify on custom domain SSL certificate renewal</span>
            <input
              type="checkbox"
              checked={notifyOnDomain}
              onChange={(e) => setNotifyOnDomain(e.target.checked)}
              className="accent-blue-600 w-4 h-4 rounded"
            />
          </label>
        </div>
      </div>

      {/* Database & Persistence Controls (PRD Module Database Operations) */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Database & Persistence Management</span>
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            LOCAL PERSISTENCE ACTIVE
          </span>
        </div>
        <p className="text-xs text-slate-400">
          All your projects, custom domains, functions, forms, and atomic deployment histories are securely stored in your browser's persistent database and synced automatically.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => {
              const rawData = localStorage.getItem('saiprtap_db_projects_v2') || '[]';
              const blob = new Blob([rawData], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `saiprtap-database-${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition"
          >
            Export Database (JSON)
          </button>
          <button
            onClick={() => {
              if (confirm('Reset database to default showcase projects? Custom changes will be restored to defaults.')) {
                localStorage.removeItem('saiprtap_db_projects_v2');
                localStorage.removeItem('saiprtap_db_active_proj_id_v2');
                window.location.reload();
              }
            }}
            className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs rounded-xl transition"
          >
            Reset to Default Projects
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-900/40 space-y-3">
        <h2 className="text-sm font-bold text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Danger Zone</span>
        </h2>
        <p className="text-xs text-slate-400">
          Permanently delete your account and all associated *.sai.app hosted websites. This action cannot be reversed.
        </p>
        <button
          onClick={() => {
            if (confirm('Permanently delete your SAIPRTAP account and all deployed sites?')) {
              onDeleteAccount();
            }
          }}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
        >
          Delete Account & Projects
        </button>
      </div>
    </div>
  );
};
