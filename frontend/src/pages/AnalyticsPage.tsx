import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AnalyticsData } from '../types';
import { BarChart3, TrendingUp, Sparkles, Fuel, ShieldCheck, Leaf, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState('7days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics().then(data => {
      setAnalytics(data);
      setLoading(false);
    });
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-xs font-semibold text-slate-500">Aggregating Municipal Analytics...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-emerald-600" />
            <span>Waste Network Analytics & Insights</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Aggregated operational metrics, collection efficiency & sustainability impact reports
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
          <Calendar className="h-4 w-4 text-slate-400 ml-2" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none pr-2"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* AI Automated Insights Cards */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950 to-navy-900 p-5 text-white shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          <h3 className="font-extrabold text-sm text-emerald-400 uppercase tracking-wider">Automated AI Performance Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {analytics.insights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-2.5 rounded-xl bg-white/10 p-3 backdrop-blur-md border border-white/10">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mt-0.5">
                ✓
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Waste Collection Bar Chart */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Daily Waste Collected (Tonnes)</h3>
            <p className="text-xs text-slate-500">Volume collected across Chennai zones over 7 days</p>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.waste_collected_per_day}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" t" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="tonnes" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Generation by Area Donut Chart */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Waste Generation Distribution by Area</h3>
            <p className="text-xs text-slate-500">Relative fill capacity proportion across major zones</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.waste_by_area}
                  dataKey="fill_units"
                  nameKey="area"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                >
                  {analytics.waste_by_area.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Material Breakdown */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Waste Classification Breakdown</h3>
            <p className="text-xs text-slate-500">Proportion of Organic, Recyclable, Hazardous & General waste</p>
          </div>
          <div className="space-y-3">
            {analytics.waste_by_type.map((t, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{t.type} Waste</span>
                  <span>{t.count} Bins</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(t.count / analytics.total_bins) * 100}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sustainability Impact Metrics */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Sustainability & Fuel Savings Summary</h3>
            <p className="text-xs text-slate-500">Environmental footprint reduction achieved through EcoRoute AI</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-500/20 text-center">
              <Fuel className="h-7 w-7 text-emerald-600 mx-auto mb-1" />
              <span className="text-2xl font-extrabold text-slate-900">{analytics.fuel_saved_liters} L</span>
              <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">Total Fuel Saved</span>
            </div>

            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-500/20 text-center">
              <Leaf className="h-7 w-7 text-emerald-600 mx-auto mb-1" />
              <span className="text-2xl font-extrabold text-slate-900">{round(analytics.fuel_saved_liters * 2.68, 1)} kg</span>
              <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">CO2 Emissions Prevented</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 text-xs text-slate-600 font-medium">
            💡 <strong className="text-slate-900">Eco Fact:</strong> EcoRoute AI dynamic vehicle routing reduces annual municipal fuel expenses by up to 14.2% while preventing overflow contamination.
          </div>
        </div>
      </div>
    </div>
  );
};

function round(val: number, decimals: number) {
  return Number(val.toFixed(decimals));
}
