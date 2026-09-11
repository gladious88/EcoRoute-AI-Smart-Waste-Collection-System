import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { GarbageBin } from '../types';
import { MapView } from '../components/MapView';
import { Search, Filter, Map, List, RefreshCw, CheckCircle2, Trash2, ShieldAlert } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const BinMonitoringPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialStatus = searchParams.get('status') || 'All';

  const [bins, setBins] = useState<GarbageBin[]>([]);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [areaFilter, setAreaFilter] = useState<string>('All');
  const [selectedBin, setSelectedBin] = useState<GarbageBin | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBins = () => {
    setLoading(true);
    api.getBins(areaFilter, statusFilter).then(data => {
      setBins(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBins();
  }, [statusFilter, areaFilter]);

  const handleMarkCollected = async (binId: number) => {
    const updatedBin = await api.updateBin(binId, { fill_level: 0, status: 'Recently Collected', priority: 'LOW' });
    if (updatedBin) {
      setBins(prev => prev.map(b => b.id === binId ? updatedBin : b));
    } else {
      setBins(prev => prev.map(b => b.id === binId ? { ...b, fill_level: 0, status: 'Recently Collected', priority: 'LOW' } : b));
    }
  };

  const filteredBins = bins.filter(b => {
    const matchesSearch = b.bin_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const areasList = ['All', 'Anna Nagar', 'T. Nagar', 'Velachery', 'Adyar', 'Guindy', 'Tambaram', 'Porur'];
  const statusList = ['All', 'Normal', 'Nearly Full', 'Overflow Risk', 'Critical', 'Recently Collected'];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Live Bin Monitoring</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Real-time telemetry and spatial distribution of smart bins across Chennai zones
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="h-4 w-4 text-emerald-600" />
            <span>Map View</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="h-4 w-4 text-emerald-600" />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Bin ID or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
          >
            {areasList.map(a => <option key={a} value={a}>Area: {a}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
          >
            {statusList.map(s => <option key={s} value={s}>Status: {s}</option>)}
          </select>

          <button
            onClick={fetchBins}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition shrink-0"
            title="Refresh Telemetry"
          >
            <RefreshCw className="h-4 w-4 text-emerald-600" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MapView
              bins={filteredBins}
              selectedBinId={selectedBin?.id}
              onBinSelect={(b) => setSelectedBin(b)}
              onMarkCollected={handleMarkCollected}
              height="h-[600px]"
            />
          </div>

          {/* Selected Bin Detail Card */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            {selectedBin ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-sm font-extrabold text-slate-900">{selectedBin.bin_code}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                    selectedBin.fill_level >= 90 ? 'bg-red-100 text-red-700' :
                    selectedBin.fill_level >= 75 ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {selectedBin.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900">{selectedBin.location_name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedBin.area}, Chennai</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Fill Level:</span>
                    <span className="font-extrabold text-slate-900">{selectedBin.fill_level}%</span>
                  </div>

                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        selectedBin.fill_level >= 90 ? 'bg-red-500' : selectedBin.fill_level >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${selectedBin.fill_level}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Capacity:</span>
                      <span className="font-bold text-slate-800">{selectedBin.max_capacity_liters} Liters</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Waste Type:</span>
                      <span className="font-bold text-slate-800">{selectedBin.waste_type}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 text-xs text-amber-700 font-semibold">
                    Predicted Full: {selectedBin.predicted_full_time || 'Today, 4:30 PM'}
                  </div>
                </div>

                <button
                  onClick={() => handleMarkCollected(selectedBin.id)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Mark as Collected Now</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
                <Trash2 className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">Select a bin marker on the map to inspect live metrics</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Data Table View */
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Bin ID</th>
                  <th className="px-4 py-3.5">Location</th>
                  <th className="px-4 py-3.5">Area</th>
                  <th className="px-4 py-3.5">Fill Level</th>
                  <th className="px-4 py-3.5">Predicted Full</th>
                  <th className="px-4 py-3.5">Priority</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredBins.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-extrabold text-slate-900">{b.bin_code}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{b.location_name}</td>
                    <td className="px-4 py-3 text-slate-500">{b.area}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 w-8">{b.fill_level}%</span>
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              b.fill_level >= 90 ? 'bg-red-500' : b.fill_level >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${b.fill_level}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-amber-600 font-semibold">{b.predicted_full_time || 'Today, 5:00 PM'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        b.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        b.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {b.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === 'Overflow Risk' ? 'bg-red-100 text-red-700' :
                        b.status === 'Nearly Full' ? 'bg-amber-100 text-amber-700' :
                        b.status === 'Recently Collected' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleMarkCollected(b.id)}
                        className="rounded-lg bg-emerald-50 border border-emerald-500/20 px-2.5 py-1 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold transition"
                      >
                        Collect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
