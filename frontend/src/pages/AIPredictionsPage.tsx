import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AIPrediction } from '../types';
import { BrainCircuit, Clock, ShieldCheck, TrendingUp, AlertTriangle, AreaChart as AreaChartIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AIPredictionsPage: React.FC = () => {
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<AIPrediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPredictions().then(data => {
      setPredictions(data);
      if (data.length > 0) setSelectedPrediction(data[0]);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-xs font-semibold text-slate-500">Calculating AI Bin-Fill Predictions...</p>
        </div>
      </div>
    );
  }

  // Generate chart data for selected prediction
  const chartData = selectedPrediction?.fill_history ? selectedPrediction.fill_history.map((val, idx) => ({
    time: `t-${6 - idx}h`,
    fill: val,
    threshold: 90
  })) : [
    { time: 't-6h', fill: 25, threshold: 90 },
    { time: 't-4h', fill: 45, threshold: 90 },
    { time: 't-2h', fill: 68, threshold: 90 },
    { time: 'Now', fill: selectedPrediction?.current_fill || 78, threshold: 90 },
    { time: '+2h (Pred)', fill: Math.min(100, (selectedPrediction?.current_fill || 78) + 15), threshold: 90 },
    { time: '+4h (Pred)', fill: 100, threshold: 90 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-navy-900 p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">AI Bin-Fill Forecasting Engine</h1>
            <p className="text-xs text-slate-300">Time-series predictive model based on historical telemetry, area diurnal curves & waste types</p>
          </div>
        </div>
      </div>

      {/* Detail Chart & Prediction Summary */}
      {selectedPrediction && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fill History & Future Curve Chart */}
          <div className="lg:col-span-2 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">{selectedPrediction.bin_code}</span>
                <h3 className="text-lg font-extrabold text-slate-900">{selectedPrediction.location_name}</h3>
                <p className="text-xs text-slate-500">{selectedPrediction.area}, Chennai &bull; Waste Type: {selectedPrediction.waste_type}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                selectedPrediction.priority_level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                selectedPrediction.priority_level === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {selectedPrediction.priority_level} PRIORITY
              </span>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="fill" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#fillGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Metrics Card */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">Calculated Prediction Metrics</h3>

            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                <span className="text-slate-500 text-xs block font-medium">Current Fill Level</span>
                <span className="text-2xl font-extrabold text-slate-900">{selectedPrediction.current_fill}%</span>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                <span className="text-slate-500 text-xs block font-medium">Predicted Full Time</span>
                <span className="text-lg font-bold text-amber-600 flex items-center gap-1.5 mt-0.5">
                  <Clock className="h-4 w-4" />
                  {selectedPrediction.predicted_full_time}
                </span>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                <span className="text-slate-500 text-xs block font-medium">Daily Generation Rate</span>
                <span className="text-base font-bold text-slate-800">{selectedPrediction.average_daily_rate}% / day</span>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3.5 border border-emerald-500/20">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-emerald-600" /> AI Confidence Score</span>
                  <span>{selectedPrediction.confidence_score}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Predictions Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">All Bin Forecasts</h3>
          <span className="text-xs text-slate-500">{predictions.length} bins calculated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Bin Code</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Current Fill</th>
                <th className="px-4 py-3.5">Avg Rate</th>
                <th className="px-4 py-3.5">Predicted Full Time</th>
                <th className="px-4 py-3.5">Confidence</th>
                <th className="px-4 py-3.5">Priority</th>
                <th className="px-4 py-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {predictions.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedPrediction(p)}
                  className={`hover:bg-slate-50/80 transition cursor-pointer ${
                    selectedPrediction?.id === p.id ? 'bg-emerald-50/40' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-extrabold text-slate-900">{p.bin_code}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{p.location_name}</td>
                  <td className="px-4 py-3 font-extrabold text-slate-900">{p.current_fill}%</td>
                  <td className="px-4 py-3 text-slate-500">{p.average_daily_rate}% / day</td>
                  <td className="px-4 py-3 text-amber-600 font-semibold">{p.predicted_full_time}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">{p.confidence_score}%</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      p.priority_level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      p.priority_level === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {p.priority_level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-emerald-600 font-bold hover:underline">Select &rarr;</button>
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
