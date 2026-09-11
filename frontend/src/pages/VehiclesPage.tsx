import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Vehicle } from '../types';
import { Truck, Fuel, User, ShieldCheck, Wrench, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const fetchVehicles = () => {
    setLoading(true);
    api.getVehicles().then(data => {
      setVehicles(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleUpdateVehicle = async (vId: number, status: string, driverName: string) => {
    const updated = await api.updateBin(vId, { status, driver_name: driverName } as any);
    setVehicles(prev => prev.map(v => v.id === vId ? { ...v, status: status as any, driver_name: driverName } : v));
    setEditingVehicle(null);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-xs font-semibold text-slate-500">Loading Fleet Telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="h-7 w-7 text-emerald-600" />
            <span>Vehicle Fleet Management</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Monitor garbage trucks, fuel levels, capacity loads, driver assignments & status across Chennai zones
          </p>
        </div>
        <button
          onClick={fetchVehicles}
          className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
        >
          <RefreshCw className="h-4 w-4 text-emerald-600" />
          <span>Refresh Fleet Telemetry</span>
        </button>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-extrabold text-sm text-slate-900">{v.vehicle_number}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                  v.status === 'On Route' ? 'bg-emerald-100 text-emerald-800' :
                  v.status === 'Available' ? 'bg-blue-100 text-blue-800' :
                  v.status === 'Full' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {v.status}
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                  <User className="h-4 w-4 text-emerald-600" />
                  <span>Driver: {v.driver_name}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Capacity Load</span>
                    <span className="font-bold text-slate-900">{v.current_load_kg} / {v.capacity_tons * 1000} kg</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        (v.current_load_kg / (v.capacity_tons * 1000)) >= 0.85 ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (v.current_load_kg / (v.capacity_tons * 1000)) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <Fuel className="h-3.5 w-3.5 text-amber-500" /> Fuel Level
                    </span>
                    <span className="font-bold text-slate-900">{v.fuel_level_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${v.fuel_level_pct}%` }}
                    ></div>
                  </div>
                </div>

                {v.assigned_route_code && (
                  <div className="pt-2 text-xs text-slate-600 flex justify-between items-center">
                    <span>Assigned Route:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-500/20">
                      {v.assigned_route_code}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setEditingVehicle(v)}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Update Driver / Status
            </button>
          </div>
        ))}
      </div>

      {/* Edit Vehicle Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Update Fleet Vehicle {editingVehicle.vehicle_number}</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Driver Name</label>
                <input
                  type="text"
                  defaultValue={editingVehicle.driver_name}
                  id="driver_input"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                <select
                  defaultValue={editingVehicle.status}
                  id="status_input"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Available">Available</option>
                  <option value="On Route">On Route</option>
                  <option value="Full">Full</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setEditingVehicle(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const d = (document.getElementById('driver_input') as HTMLInputElement).value;
                  const s = (document.getElementById('status_input') as HTMLSelectElement).value;
                  handleUpdateVehicle(editingVehicle.id, s, d);
                }}
                className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
