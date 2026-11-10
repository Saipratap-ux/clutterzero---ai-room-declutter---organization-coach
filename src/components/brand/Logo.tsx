import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSlogan?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  showSlogan = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Crowned Metallic S Symbol */}
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-xl overflow-hidden shadow-lg shadow-blue-950/50 group`}>
        <img
          src="/icon.svg"
          alt="SAIPRTAP Crowned Logo"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-extrabold tracking-tight text-white ${textSizes[size]}`}>
              SAIPRTAP
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-400 border border-blue-500/30 uppercase tracking-widest font-mono">
              CLOUD
            </span>
          </div>
          {showSlogan && (
            <span className="text-[11px] text-slate-400 font-medium tracking-wide mt-1">
              Build • Deploy • Host • Innovate
            </span>
          )}
        </div>
      )}
    </div>
  );
};
