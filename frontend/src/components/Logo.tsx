import React from 'react';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ collapsed = false, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          {/* Recycle Leaf & Route Pin Node */}
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
          <circle cx="12" cy="9" r="2.5" className="fill-emerald-100 stroke-none" />
          <path d="M12 11.5v3" className="stroke-emerald-200" />
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 border border-white"></span>
        </span>
      </div>
      
      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight text-slate-900">EcoRoute</span>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-emerald-600 border border-emerald-500/20">AI</span>
          </div>
          <span className="text-[10px] font-medium text-slate-500 tracking-tight">Smart Waste Collection</span>
        </div>
      )}
    </div>
  );
};
