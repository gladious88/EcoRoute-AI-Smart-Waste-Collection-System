import React from 'react';
import { Sparkles, ArrowRight, AlertOctagon, TrendingDown, ShieldAlert } from 'lucide-react';
import { AIRecommendation } from '../types';
import { useNavigate } from 'react-router-dom';

interface AIRecommendationBannerProps {
  recommendations: AIRecommendation[];
}

export const AIRecommendationBanner: React.FC<AIRecommendationBannerProps> = ({ recommendations }) => {
  const navigate = useNavigate();

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-navy-900 p-5 text-white shadow-xl relative overflow-hidden">
      {/* Decorative SVG Glow */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Sparkles className="h-4 w-4 animate-spin-slow" />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide text-emerald-400 uppercase">AI Recommendations & System Alerts</h3>
          <p className="text-[11px] text-slate-300">Live operational insights calculated from real-time bin telemetry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex flex-col justify-between rounded-xl bg-white/10 p-3.5 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 transition duration-200"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  rec.priority === 'CRITICAL' ? 'bg-red-500/30 text-red-300 border border-red-500/40' :
                  rec.priority === 'HIGH' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' :
                  'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {rec.priority}
                </span>
                {rec.priority === 'CRITICAL' && <ShieldAlert className="h-4 w-4 text-red-400 animate-pulse" />}
              </div>
              <h4 className="font-bold text-xs text-white leading-snug">{rec.title}</h4>
              <p className="mt-1 text-[11px] text-slate-300 leading-relaxed">{rec.description}</p>
            </div>

            <button
              onClick={() => navigate(rec.action_target)}
              className="mt-3 flex items-center justify-between w-full rounded-lg bg-emerald-500/20 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition group"
            >
              <span>{rec.action_label}</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
