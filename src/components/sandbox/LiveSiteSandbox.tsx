import React, { useState } from 'react';
import { 
  Laptop, 
  Tablet, 
  Smartphone, 
  RotateCw, 
  Lock, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  Code,
  Globe
} from 'lucide-react';

interface LiveSiteSandboxProps {
  url: string;
  htmlContent: string;
  siteName: string;
  onClose?: () => void;
  isModal?: boolean;
}

export const LiveSiteSandbox: React.FC<LiveSiteSandboxProps> = ({
  url,
  htmlContent,
  siteName,
  onClose,
  isModal = false,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showSslModal, setShowSslModal] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const containerWidths = {
    desktop: 'w-full',
    tablet: 'max-w-[768px] mx-auto',
    mobile: 'max-w-[390px] mx-auto',
  };

  return (
    <div className={`flex flex-col bg-[#0b101d] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl ${isModal ? 'fixed inset-4 sm:inset-8 z-50' : 'w-full h-[680px]'}`}>
      {/* Top Browser Bar */}
      <div className="bg-[#0f172a] border-b border-slate-800/90 px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left Window Dots & Site Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-xs font-semibold text-slate-300 hidden sm:inline truncate max-w-[140px]">
            {siteName}
          </span>
        </div>

        {/* Center: Device Switcher & URL Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-2xl justify-center">
          {/* Device Switcher */}
          <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded text-xs transition ${deviceMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Desktop View (Full Width)"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded text-xs transition ${deviceMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded text-xs transition ${deviceMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Mobile View (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive URL bar */}
          <div className="flex-1 flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 shadow-inner group">
            <button 
              onClick={() => setShowSslModal(true)}
              className="flex items-center text-emerald-400 mr-2 hover:text-emerald-300"
              title="View SSL Certificate details"
            >
              <Lock className="w-3 h-3" />
            </button>
            <span className="text-slate-500 mr-0.5">https://</span>
            <span className="text-slate-100 font-medium truncate flex-1">{url.replace('https://', '')}</span>
            <button
              onClick={handleCopyUrl}
              className="ml-2 text-slate-500 hover:text-slate-300 p-0.5 transition"
              title="Copy URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition"
            title="Reload sandbox"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Actions: Code preview & Close */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCodePreview(!showCodePreview)}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition ${showCodePreview ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'}`}
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inspect</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Close Sandbox"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Sandbox Canvas & Code Drawer */}
      <div className="flex-1 bg-[#050811] relative overflow-hidden flex">
        {/* Iframe Viewport Container */}
        <div className={`flex-1 h-full p-2 sm:p-4 overflow-auto flex justify-center items-stretch transition-all duration-300`}>
          <div className={`h-full ${containerWidths[deviceMode]} transition-all duration-300 bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-800`}>
            <iframe
              key={iframeKey}
              title={`Sandbox: ${siteName}`}
              srcDoc={htmlContent}
              sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
              className="w-full h-full border-0 bg-white"
            />
          </div>
        </div>

        {/* Inspect Code Drawer */}
        {showCodePreview && (
          <div className="w-80 sm:w-96 border-l border-slate-800 bg-slate-950 flex flex-col z-20">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="font-mono">Serving: index.html</span>
              <button 
                onClick={() => setShowCodePreview(false)}
                className="text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <pre className="flex-1 p-4 overflow-auto font-mono text-[11px] text-slate-300 leading-relaxed bg-[#070b14]">
              <code>{htmlContent}</code>
            </pre>
          </div>
        )}
      </div>

      {/* SSL Modal */}
      {showSslModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowSslModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">HTTPS Connection Secure</h3>
                <p className="text-xs text-slate-400">Automatic SSL Certificate Active</p>
              </div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2 font-mono text-slate-300 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Domain:</span>
                <span className="text-amber-400">*.sai.app</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Issuer:</span>
                <span>SAIPRTAP Edge Authority</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Protocol:</span>
                <span className="text-emerald-400">TLS 1.3 / HTTP 2.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Encryption:</span>
                <span>AES_256_GCM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-400 font-bold">Valid & Auto-Renewing</span>
              </div>
            </div>
            <button
              onClick={() => setShowSslModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
