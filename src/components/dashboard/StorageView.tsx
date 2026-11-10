import React, { useState } from 'react';
import { Project } from '../../types';
import { HardDrive, UploadCloud, Copy, Check, Trash2, File, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface StorageViewProps {
  project: Project;
}

export const StorageView: React.FC<StorageViewProps> = ({ project }) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [assets, setAssets] = useState([
    { name: 'hero-banner.jpg', size: '340 KB', type: 'image/jpeg', url: `https://${project.subdomain}/assets/hero-banner.jpg`, uploadedAt: '2026-11-09' },
    { name: 'logo-vector.svg', size: '12 KB', type: 'image/svg+xml', url: `https://${project.subdomain}/assets/logo-vector.svg`, uploadedAt: '2026-11-08' },
    { name: 'whitepaper.pdf', size: '1.2 MB', type: 'application/pdf', url: `https://${project.subdomain}/assets/whitepaper.pdf`, uploadedAt: '2026-11-07' },
  ]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newAsset = {
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      type: file.type || 'application/octet-stream',
      url: `https://${project.subdomain}/assets/${file.name}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    setAssets([newAsset, ...assets]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Storage & Media Assets</h1>
          <p className="text-xs text-slate-400 mt-1">
            Host images, media files, and static downloads distributed across SAIPRTAP edge object storage.
          </p>
        </div>

        <div className="relative">
          <input
            type="file"
            onChange={handleSimulateUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition">
            <UploadCloud className="w-4 h-4" />
            <span>Upload Asset</span>
          </button>
        </div>
      </div>

      {/* Storage Quota Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-white">Storage Utilization</span>
          <span className="font-mono text-slate-400">1.55 MB / 5.0 GB Free Quota</span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[0.8%] rounded-full"></div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Hosted Media Files ({assets.length})</h2>
          <span className="text-xs text-slate-500 font-mono">Edge CDN URLs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">Asset Name</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Uploaded</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {assets.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                    {item.type.includes('image') ? (
                      <ImageIcon className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <File className="w-4 h-4 text-blue-400 shrink-0" />
                    )}
                    <span className="truncate max-w-xs">{item.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{item.size}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{item.type}</td>
                  <td className="py-3 px-4 text-slate-400">{item.uploadedAt}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleCopy(item.url)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono inline-flex items-center gap-1 transition mr-2"
                      title="Copy Edge CDN URL"
                    >
                      {copiedUrl === item.url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy URL</span>
                    </button>
                    <button
                      onClick={() => setAssets(assets.filter((_, i) => i !== idx))}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
