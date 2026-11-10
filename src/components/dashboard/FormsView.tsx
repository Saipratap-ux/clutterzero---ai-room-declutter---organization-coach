import React, { useState } from 'react';
import { Project, FormSubmission, ProjectForm } from '../../types';
import { 
  Inbox, 
  Download, 
  ShieldCheck, 
  Check, 
  Trash2, 
  Plus, 
  Mail, 
  FileSpreadsheet,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface FormsViewProps {
  project: Project;
  onAddForm: (name: string, endpoint: string) => void;
}

export const FormsView: React.FC<FormsViewProps> = ({ project, onAddForm }) => {
  const [spamFilterEnabled, setSpamFilterEnabled] = useState(true);
  const [showNewFormModal, setShowNewFormModal] = useState(false);
  const [newFormName, setNewFormName] = useState('');
  const [newEndpoint, setNewEndpoint] = useState('/api/forms/contact');

  // Simulated submissions
  const [submissions, setSubmissions] = useState<FormSubmission[]>([
    {
      id: 'sub_1',
      formId: 'form_contact_01',
      submittedAt: '2026-11-10T07:15:00Z',
      data: {
        name: 'Sarah Connor',
        email: 'sarah.connor@cyberdyne.io',
        message: 'Interested in enterprise cloud deployment and custom DNS routing.',
      },
      spamScore: 0.02,
    },
    {
      id: 'sub_2',
      formId: 'form_contact_01',
      submittedAt: '2026-11-09T18:40:00Z',
      data: {
        name: 'Marcus Vance',
        email: 'marcus@vance-robotics.de',
        message: 'Looking to migrate 40 customer websites from Netlify to SAIPRTAP.',
      },
      spamScore: 0.01,
    },
    {
      id: 'sub_3',
      formId: 'form_contact_01',
      submittedAt: '2026-11-09T11:20:00Z',
      data: {
        name: 'Aisha Patel',
        email: 'aisha@edusphere.in',
        message: 'Can we integrate custom SSL certificates with your API?',
      },
      spamScore: 0.05,
    },
  ]);

  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    const headers = ['ID', 'Date', 'Name', 'Email', 'Message', 'SpamScore'];
    const rows = submissions.map((s) => [
      s.id,
      s.submittedAt,
      `"${s.data.name || ''}"`,
      `"${s.data.email || ''}"`,
      `"${(s.data.message || '').replace(/"/g, '""')}"`,
      s.spamScore,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${project.slug}-submissions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormName.trim()) return;
    onAddForm(newFormName, newEndpoint);
    setShowNewFormModal(false);
    setNewFormName('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Website Forms & Submissions</h1>
          <p className="text-xs text-slate-400 mt-1">
            Serverless HTML form endpoints with automated Honeypot spam protection and CSV exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowNewFormModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Form Endpoint</span>
          </button>
        </div>
      </div>

      {/* Spam Filter Toggle Card */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-xs font-bold text-white">Automated Akismet & Honeypot Spam Filtering</div>
            <div className="text-[11px] text-slate-400">Blocks bot submissions before they consume quota.</div>
          </div>
        </div>
        <button
          onClick={() => setSpamFilterEnabled(!spamFilterEnabled)}
          className="text-xs font-mono text-emerald-400 flex items-center gap-1.5"
        >
          {spamFilterEnabled ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ToggleRight className="w-6 h-6 inline" /> ACTIVE
            </span>
          ) : (
            <span className="text-slate-500 flex items-center gap-1">
              <ToggleLeft className="w-6 h-6 inline" /> DISABLED
            </span>
          )}
        </button>
      </div>

      {/* Submissions Inbox */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Inbox className="w-4 h-4 text-blue-400" />
            <span>Submissions Inbox ({submissions.length})</span>
          </h2>
          <span className="text-xs font-mono text-slate-500">10,000 Free Monthly Submissions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4 text-right">Spam Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                    {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                    {sub.data.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-blue-400 whitespace-nowrap">
                    {sub.data.email}
                  </td>
                  <td className="py-3 px-4 max-w-md truncate text-slate-300">
                    {sub.data.message}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    <span className="text-emerald-400 font-bold">{sub.spamScore}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HTML Integration Snippet */}
      <div className="p-5 rounded-2xl bg-[#060a14] border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
        <div className="text-slate-400 text-[11px] font-sans font-semibold">
          How to wire your HTML website forms:
        </div>
        <pre className="p-3 bg-slate-950 rounded-xl overflow-x-auto text-[11px] text-amber-300">
          <code>{`<form action="https://${project.subdomain}/api/forms/submit" method="POST">\n  <input type="text" name="name" required placeholder="Name" />\n  <input type="email" name="email" required placeholder="Email" />\n  <textarea name="message" required></textarea>\n  <button type="submit">Send</button>\n</form>`}</code>
        </pre>
      </div>

      {/* New Form Modal */}
      {showNewFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-white text-base mb-4">Add Form Endpoint</h3>
            <form onSubmit={handleCreateForm} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Form Name</label>
                <input
                  type="text"
                  required
                  value={newFormName}
                  onChange={(e) => setNewFormName(e.target.value)}
                  placeholder="e.g. Newsletter Subscription"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Endpoint Path</label>
                <input
                  type="text"
                  required
                  value={newEndpoint}
                  onChange={(e) => setNewEndpoint(e.target.value)}
                  placeholder="/api/forms/newsletter"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFormModal(false)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md"
                >
                  Create Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
