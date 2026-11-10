import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'nav' | 'sidebar' | 'banner' }> = ({ variant = 'nav' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // General instructions modal if browser doesn't expose beforeinstallprompt yet
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'nav' ? (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition whitespace-nowrap shrink-0"
          title="Install SAIPRTAP as Desktop/Mobile PWA"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Install App</span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition text-left"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <div>
              <div className="font-semibold text-white">Install PWA</div>
              <div className="text-[11px] text-slate-400">Add to home screen</div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
            PROMPT
          </span>
        </button>
      )}

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Install SAIPRTAP App</h3>
                <p className="text-xs text-slate-400">Fast offline dashboard access</p>
              </div>
            </div>
            <div className="space-y-3 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 mb-5">
              <p>
                <strong>1.</strong> Tap the <strong>Share</strong> icon <span className="text-blue-400 font-mono">⎋</span> or Chrome menu <span className="text-blue-400 font-mono">⋮</span> in your browser.
              </p>
              <p>
                <strong>2.</strong> Select <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong>.
              </p>
              <p>
                <strong>3.</strong> Launch SAIPRTAP anytime directly like a native developer workstation!
              </p>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
