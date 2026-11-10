import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Users, UserPlus, Shield, Check, Trash2, Mail } from 'lucide-react';

interface TeamViewProps {
  currentUser: UserProfile;
}

export const TeamView: React.FC<TeamViewProps> = ({ currentUser }) => {
  const [members, setMembers] = useState([
    { id: '1', name: currentUser.name, email: currentUser.email, role: 'Owner', status: 'Active' },
    { id: '2', name: 'Devin Chen', email: 'devin@sai.app', role: 'Admin', status: 'Active' },
    { id: '3', name: 'Kavita Roy', email: 'kavita@sai.app', role: 'Developer', status: 'Pending Invitation' },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Developer' | 'Viewer'>('Developer');
  const [invitedSuccess, setInvitedSuccess] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember = {
      id: `mem_${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'Pending Invitation',
    };

    setMembers([...members, newMember]);
    setInviteEmail('');
    setInvitedSuccess(true);
    setTimeout(() => setInvitedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Team Management & Access Control</h1>
        <p className="text-xs text-slate-400 mt-1">
          Collaborate with colleagues on website development, deployment approvals, and DNS administration.
        </p>
      </div>

      {/* Invite Member Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-blue-400" />
          <span>Invite Team Member</span>
        </h2>

        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="teammate@company.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="Admin">Admin (Full Deployment & DNS Access)</option>
            <option value="Developer">Developer (Build & Code Editing)</option>
            <option value="Viewer">Viewer (Read-only Analytics & Preview)</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition whitespace-nowrap"
          >
            Send Invite
          </button>
        </form>

        {invitedSuccess && (
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Invitation link dispatched!
          </div>
        )}
      </div>

      {/* Members List */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Organization Members ({members.length})</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">SAIPRTAP RBAC Enforced</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {members.map((mem) => (
            <div key={mem.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                  {mem.name.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{mem.name}</span>
                    {mem.role === 'Owner' && (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                        OWNER
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{mem.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-300">{mem.role}</span>
                <span className={`text-[11px] ${mem.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {mem.status}
                </span>
                {mem.role !== 'Owner' && (
                  <button
                    onClick={() => setMembers(members.filter((m) => m.id !== mem.id))}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
