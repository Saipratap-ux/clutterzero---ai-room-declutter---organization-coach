import React, { useState } from 'react';
import { Project } from '../../types';
import { Key, Plus, Eye, EyeOff, Trash2, ShieldCheck, Copy, Check } from 'lucide-react';

interface EnvVarsViewProps {
  project: Project;
  onUpdateEnvVars: (vars: { key: string; value: string; isSecret: boolean }[]) => void;
}

export const EnvVarsView: React.FC<EnvVarsViewProps> = ({ project, onUpdateEnvVars }) => {
  const [envVars, setEnvVars] = useState([...project.envVars]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isSecret, setIsSecret] = useState(true);
  const [visibleSecrets, setVisibleSecrets] = useState<Record<number, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleVisibility = (idx: number) => {
    setVisibleSecrets((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopy = (val: string, keyName: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    const cleanKey = newKey.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    const updated = [...envVars, { key: cleanKey, value: newValue, isSecret }];
    setEnvVars(updated);
    onUpdateEnvVars(updated);
    setNewKey('');
    setNewValue('');
  };

  const handleDelete = (index: number) => {
    const updated = envVars.filter((_, i) => i !== index);
    setEnvVars(updated);
    onUpdateEnvVars(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Environment Variables</h1>
        <p className="text-xs text-slate-400 mt-1">
          Store build configuration and encrypted runtime secrets securely across preview and production deployments.
        </p>
      </div>

      {/* Add Variable Form */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-white">Add New Environment Variable</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-medium text-slate-400 mb-1">Key Name</label>
            <input
              type="text"
              required
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="e.g. STRIPE_API_KEY or NEXT_PUBLIC_URL"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 uppercase"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-medium text-slate-400 mb-1">Value</label>
            <input
              type={isSecret ? 'password' : 'text'}
              required
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Value..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
            >
              Add Variable
            </button>
          </div>
        </form>
      </div>

      {/* Table of variables */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Configured Keys ({envVars.length})</span>
          </span>
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" /> Encrypted at rest
          </span>
        </div>

        {envVars.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No environment variables configured yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {envVars.map((item, idx) => {
              const isVisible = visibleSecrets[idx];
              return (
                <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs font-mono">
                  <div className="flex-1 truncate">
                    <span className="text-white font-bold">{item.key}</span>
                  </div>
                  <div className="flex-1 text-slate-400 truncate">
                    {item.isSecret && !isVisible ? '••••••••••••••••••••••••' : item.value}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVisibility(idx)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                      title={isVisible ? 'Hide' : 'Reveal'}
                    >
                      {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleCopy(item.value, item.key)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                      title="Copy value"
                    >
                      {copiedKey === item.key ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                      title="Delete variable"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
