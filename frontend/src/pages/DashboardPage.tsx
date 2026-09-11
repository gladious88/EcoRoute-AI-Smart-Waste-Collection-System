import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { GarbageBin, AnalyticsData, AIRecommendation } from '../types';
import { KPICard } from '../components/KPICard';
import { AIRecommendationBanner } from '../components/AIRecommendationBanner';
import { MapView } from '../components/MapView';
import { Trash2, AlertTriangle, TrendingUp, Truck, ShieldCheck, Fuel, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bins, setBins] = useState<GarbageBin[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getBins(),
      api.getAnalytics(),
      api.getRecommendations()
    ]).then(([binsData, analyticsData, recsData]) => {
      setBins(binsData);
      setAnalytics(analyticsData);
      setRecommendations(recsData);
      setLoading(false);
    });
  }, []);

  const criticalBins = bins.filter(b => b.fill_level >= 85);
  const isDriver = user.role === 'Collection Driver';

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-xs font-semibold text-slate-500">Loading EcoRoute AI Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, <span className="text-emerald-600">{user.full_name.split(' ')[0]}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            “Here’s what is happening across the waste collection network today.”
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/routes')}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
          >
            <Truck className="h-4 w-4" />
            <span>{isDriver ? 'My Assigned Route' : 'Generate Optimized Route'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Bins"
          value={analytics?.total_bins || 56}
          trend="↑ 4 added"
          trendUp={true}
          explanation="Monitored smart bins across Chennai"
          icon={Trash2}
          colorScheme="blue"
        />
        <KPICard
          title="Collection Required"
          value={analytics?.bins_requiring_collection || 14}
          trend="14 active"
          trendUp={false}
          explanation="Bins filled over 75% capacity"
          icon={AlertTriangle}
          colorScheme="amber"
        />
        <KPICard
          title="Predicted Overflow"
          value={analytics?.predicted_overflow || 5}
          trend="↑ 8% vs yesterday"
          trendUp={false}
          explanation="Bins predicted full in < 2 hrs"
          icon={TrendingUp}
          colorScheme="red"
        />
        <KPICard
          title="Active Vehicles"
          value={analytics?.active_vehicles || 3}
          trend="3/6 on route"
          trendUp={true}
          explanation="Collection trucks in operation"
          icon={Truck}
          colorScheme="indigo"
        />
        <KPICard
          title="Efficiency"
          value={`${analytics?.collection_efficiency_pct || 95.8}%`}
          trend="↑ 2.4% this week"
          trendUp={true}
          explanation="On-time collection performance"
          icon={ShieldCheck}
          colorScheme="emerald"
        />
        <KPICard
          title="Fuel Saved"
          value={`${analytics?.fuel_saved_liters || 68.4} L`}
          trend="114 kg CO2"
          trendUp={true}
          explanation="Total diesel saved via AI routing"
          icon={Fuel}
          colorScheme="emerald"
        />
      </div>

      {/* AI Recommendations Banner */}
      <AIRecommendationBanner recommendations={recommendations} />

      {/* Live Map & Critical Overflow Bins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View Widget */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Live Waste Network Map</h3>
              <p className="text-xs text-slate-500">Real-time fill status across Greater Chennai Corporation</p>
            </div>
            <button
              onClick={() => navigate('/monitoring')}
              className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              <span>Full Screen Map</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <MapView bins={bins} height="h-[380px]" />
        </div>

        {/* Critical Bins List */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>Critical Bins</span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-extrabold text-red-700">
                  {criticalBins.length}
                </span>
              </h3>
              <p className="text-xs text-slate-500">Requires priority collection</p>
            </div>
            <button
              onClick={() => navigate('/monitoring?status=Overflow+Risk')}
              className="text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {criticalBins.map((bin) => (
              <div
                key={bin.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200/80 hover:border-emerald-500/40 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900">{bin.bin_code}</span>
                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">
                      {bin.fill_level}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium truncate max-w-[180px] mt-0.5">{bin.location_name}</p>
                  <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> Full: {bin.predicted_full_time}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/routes')}
                  className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 transition shadow-sm shrink-0"
                >
                  Dispatch
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => navigate('/predictions')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              View All AI Bin Predictions &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
