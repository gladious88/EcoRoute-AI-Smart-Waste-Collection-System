import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CitizenReport, ReportProblemType } from '../types';
import { AlertTriangle, Plus, Search, Filter, CheckCircle2, Clock, ShieldAlert, Send } from 'lucide-react';

export const CitizenReportsPage: React.FC = () => {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Form State
  const [reporterName, setReporterName] = useState('');
  const [locationArea, setLocationArea] = useState('Anna Nagar');
  const [problemType, setProblemType] = useState<ReportProblemType>('Overflowing bin');
  const [description, setDescription] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const fetchReports = () => {
    setLoading(true);
    api.getReports().then(data => {
      setReports(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName || !description) return;

    const newReport = await api.createReport({
      reporter_name: reporterName,
      location_area: locationArea,
      problem_type: problemType,
      description: description,
      priority: problemType === 'Overflowing bin' ? 'CRITICAL' : 'HIGH',
      image_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400'
    });

    setReports(prev => [newReport, ...prev]);
    setShowForm(false);
    setReporterName('');
    setDescription('');
    setSubmittedMessage(`Report ${newReport.report_code} submitted successfully! Assigned to ${newReport.assigned_team}.`);
  };

  const filteredReports = reports.filter(r => statusFilter === 'All' || r.status === statusFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-7 w-7 text-amber-500" />
            <span>Citizen Issue Reports Portal</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Public municipal complaint tracking for overflowing bins, illegal dumping & maintenance requests
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Submit New Report</span>
        </button>
      </div>

      {submittedMessage && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 border border-emerald-500/30 text-emerald-900 text-xs font-semibold shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{submittedMessage}</span>
        </div>
      )}

      {/* Report Form Drawer/Modal */}
      {showForm && (
        <form onSubmit={handleSubmitReport} className="rounded-2xl bg-white p-6 border border-emerald-500/30 shadow-xl space-y-4 animate-in fade-in">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">Submit Municipal Waste Complaint</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. S. Ramanathan"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Area Location (Chennai)</label>
              <select
                value={locationArea}
                onChange={(e) => setLocationArea(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Anna Nagar">Anna Nagar</option>
                <option value="T. Nagar">T. Nagar</option>
                <option value="Velachery">Velachery</option>
                <option value="Adyar">Adyar</option>
                <option value="Guindy">Guindy</option>
                <option value="Tambaram">Tambaram</option>
                <option value="Porur">Porur</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Problem Type</label>
              <select
                value={problemType}
                onChange={(e) => setProblemType(e.target.value as ReportProblemType)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Overflowing bin">Overflowing bin</option>
                <option value="Damaged bin">Damaged bin</option>
                <option value="Illegal dumping">Illegal dumping</option>
                <option value="Missed collection">Missed collection</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Description & Landmark Details</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the issue and precise landmark..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        {['All', 'Pending', 'Assigned', 'In Progress', 'Resolved'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              statusFilter === st ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Reports Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((r) => (
          <div key={r.id} className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-extrabold text-xs text-slate-900">{r.report_code}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  r.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                  r.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  r.status === 'Assigned' ? 'bg-purple-100 text-purple-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {r.status}
                </span>
              </div>

              {r.image_url && (
                <img src={r.image_url} alt="Report Photo" className="h-40 w-full object-cover rounded-xl mt-3 border border-slate-100" />
              )}

              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{r.problem_type}</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                    r.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {r.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">{r.description}</p>
                <div className="pt-2 text-[11px] text-slate-400 flex justify-between">
                  <span>By: {r.reporter_name}</span>
                  <span>{r.location_area}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{r.assigned_team}</span>
              <button
                onClick={() => {
                  api.createReport({ ...r, status: 'Resolved' } as any);
                  setReports(prev => prev.map(item => item.id === r.id ? { ...item, status: 'Resolved' } : item));
                }}
                className="text-emerald-600 font-bold hover:underline"
              >
                Mark Resolved &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
