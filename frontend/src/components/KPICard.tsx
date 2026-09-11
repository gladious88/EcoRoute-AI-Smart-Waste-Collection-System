import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  explanation: string;
  icon: LucideIcon;
  colorScheme?: 'emerald' | 'amber' | 'red' | 'blue' | 'indigo';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  trend,
  trendUp = true,
  explanation,
  icon: Icon,
  colorScheme = 'emerald'
}) => {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600',
      border: 'border-emerald-500/20',
      shadow: 'shadow-emerald-500/5'
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-600',
      border: 'border-amber-500/20',
      shadow: 'shadow-amber-500/5'
    },
    red: {
      bg: 'bg-red-500/10',
      text: 'text-red-600',
      border: 'border-red-500/20',
      shadow: 'shadow-red-500/5'
    },
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-600',
      border: 'border-blue-500/20',
      shadow: 'shadow-blue-500/5'
    },
    indigo: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-600',
      border: 'border-indigo-500/20',
      shadow: 'shadow-indigo-500/5'
    }
  };

  const scheme = colorMap[colorScheme];

  return (
    <div className={`relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">{value}</h3>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${scheme.bg} ${scheme.text} ${scheme.border} border`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
            {trendUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            <span>{trend}</span>
          </div>
        )}
        <p className="text-[11px] font-medium text-slate-500 truncate max-w-[200px]" title={explanation}>{explanation}</p>
      </div>
    </div>
  );
};
