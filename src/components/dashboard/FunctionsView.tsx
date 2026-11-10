import React, { useState } from 'react';
import { Project, ServerlessFunction } from '../../types';
import { 
  Zap, 
  Play, 
  Plus, 
  Code, 
  Clock, 
  Terminal, 
  CheckCircle2, 
  Trash2,
  Copy,
  Check
} from 'lucide-react';

interface FunctionsViewProps {
  project: Project;
  onAddFunction: (fn: ServerlessFunction) => void;
  onDeleteFunction: (fnId: string) => void;
}

export const FunctionsView: React.FC<FunctionsViewProps> = ({
  project,
  onAddFunction,
  onDeleteFunction,
}) => {
  const [selectedFunction, setSelectedFunction] = useState<ServerlessFunction | null>(
    project.functions[0] || null
  );
  const [testPayload, setTestPayload] = useState('{\n  "query": "hello world"\n}');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  // New function form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRoute, setNewRoute] = useState('/api/hello');
  const [newMethod, setNewMethod] = useState<'GET' | 'POST' | 'ALL'>('GET');

  const handleTestInvoke = () => {
    if (!selectedFunction) return;
    setIsExecuting(true);
    setTestResponse(null);

    const startTime = performance.now();
    setTimeout(() => {
      const duration = Math.round(performance.now() - startTime + 8);
      setExecutionTime(duration);
      setIsExecuting(false);

      if (selectedFunction.route.includes('health')) {
        setTestResponse(
          JSON.stringify(
            {
              status: 'healthy',
              timestamp: new Date().toISOString(),
              region: 'sai-edge-ap-southeast',
              platform: 'SAIPRTAP Cloud Edge v2',
              latencyMs: duration,
            },
            null,
            2
          )
        );
      } else {
        setTestResponse(
          JSON.stringify(
            {
              success: true,
              message: `Response from ${selectedFunction.route}`,
              endpoint: `https://${project.subdomain}${selectedFunction.route}`,
              runtime: selectedFunction.runtime,
              executedAt: new Date().toISOString(),
            },
            null,
            2
          )
        );
      }
    }, 450);
  };

  const handleCreateFunction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRoute.trim()) return;

    const newFn: ServerlessFunction = {
      id: `fn_${Date.now()}`,
      name: newName,
      route: newRoute.startsWith('/') ? newRoute : `/${newRoute}`,
      runtime: 'Edge Worker',
      method: newMethod,
      code: `export default async function handler(request) {\n  return new Response(JSON.stringify({\n    message: "Hello from ${newName}",\n    time: new Date().toISOString()\n  }), {\n    headers: { "Content-Type": "application/json" }\n  });\n}`,
      invocations: 0,
      avgDurationMs: 4.2,
      lastInvoked: 'Just created',
    };

    onAddFunction(newFn);
    setSelectedFunction(newFn);
    setShowAddModal(false);
    setNewName('');
    setNewRoute('/api/hello');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Serverless Edge Functions</h1>
          <p className="text-xs text-slate-400 mt-1">
            Deploy instantaneous backend APIs without provisioning servers. Globally distributed on SAIPRTAP edge nodes.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Function</span>
        </button>
      </div>

      {project.functions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800">
          <Zap className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="font-bold text-base text-white">No functions configured</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Edge functions run server-side JavaScript right next to your users with zero cold starts.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded-xl text-white transition"
          >
            Create Your First Function
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Function List (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="text-xs font-mono uppercase text-slate-500 px-1">
              Active Endpoints ({project.functions.length})
            </div>
            {project.functions.map((fn) => {
              const isSelected = selectedFunction?.id === fn.id;
              return (
                <div
                  key={fn.id}
                  onClick={() => setSelectedFunction(fn)}
                  className={`p-4 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-xs text-white truncate">{fn.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-bold">
                      {fn.method}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-amber-400 truncate">{fn.route}</div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2 pt-2 border-t border-slate-800/60">
                    <span>{fn.invocations.toLocaleString()} calls</span>
                    <span>{fn.avgDurationMs}ms avg</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Code Viewer & Live Test Playground (8 cols) */}
          {selectedFunction && (
            <div className="lg:col-span-8 space-y-4">
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedFunction.name}</h2>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      Endpoint: <span className="text-amber-400">https://{project.subdomain}{selectedFunction.route}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTestInvoke}
                      disabled={isExecuting}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isExecuting ? 'Invoking...' : 'Test Invoke'}</span>
                    </button>
                    <button
                      onClick={() => onDeleteFunction(selectedFunction.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-lg transition"
                      title="Delete function"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Code Window */}
                <div className="rounded-2xl bg-[#060912] border border-slate-800 overflow-hidden font-mono text-xs">
                  <div className="bg-[#0b101e] px-4 py-2 border-b border-slate-800 flex justify-between text-slate-400 text-[11px]">
                    <span>source.js · {selectedFunction.runtime}</span>
                    <span className="text-emerald-400">Zero Cold Start</span>
                  </div>
                  <pre className="p-4 text-slate-300 leading-relaxed overflow-x-auto text-[11px]">
                    <code>{selectedFunction.code}</code>
                  </pre>
                </div>

                {/* Test Response Box */}
                {testResponse && (
                  <div className="rounded-2xl bg-slate-950 border border-emerald-500/30 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                      <span className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Status: 200 OK
                      </span>
                      <span>Latency: {executionTime}ms</span>
                    </div>
                    <pre className="font-mono text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl overflow-x-auto">
                      <code>{testResponse}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Function Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-white text-base mb-4">Create New Serverless Function</h3>
            <form onSubmit={handleCreateFunction} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Function Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. User Signup Hook"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Route Path</label>
                <input
                  type="text"
                  required
                  value={newRoute}
                  onChange={(e) => setNewRoute(e.target.value)}
                  placeholder="/api/signup"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">HTTP Method</label>
                <select
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="ALL">ALL (Any method)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md"
                >
                  Deploy Endpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
