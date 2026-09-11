import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { OptimizedRoute, Vehicle } from '../types';
import { MapView } from '../components/MapView';
import { Map, Truck, Fuel, Clock, ArrowRight, ShieldCheck, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';

export const RoutePlannerPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('TN-01-GA-4521');
  const [maxCapacityKg, setMaxCapacityKg] = useState<number>(5000);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(50);
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [targetBinCount, setTargetBinCount] = useState<number>(12);

  const [route, setRoute] = useState<OptimizedRoute | null>(null);
  const [bins, setBins] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getVehicles(), api.getBins()]).then(([vehData, binData]) => {
      setVehicles(vehData);
      setBins(binData);
      // Generate initial route
      handleGenerateRoute('TN-01-GA-4521', 5000, 50, 'ALL', 12);
    });
  }, []);

  const handleGenerateRoute = async (
    vId = selectedVehicleId,
    cap = maxCapacityKg,
    dist = maxDistanceKm,
    prio = priorityFilter,
    cnt = targetBinCount
  ) => {
    setLoading(true);
    setSuccessMessage(null);
    const res = await api.optimizeRoute(vId, cap, dist, prio, cnt);
    setRoute(res);
    setLoading(false);
    setSuccessMessage(`Optimized route ${res.route_code} generated successfully! Saved ${res.distance_saved_km} km (${res.fuel_saved_liters} L fuel).`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Map className="h-7 w-7 text-emerald-600" />
            <span>AI Collection Route Planner</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Capacity-Constrained Vehicle Routing (CVRP) optimization engine for minimal fuel consumption
          </p>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 border border-emerald-500/30 text-emerald-900 text-xs font-semibold shadow-sm animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-600" />
              <span>Optimization Parameters</span>
            </h3>

            {/* Vehicle Selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Assigned Vehicle</label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.vehicle_number}>
                    {v.vehicle_number} - {v.driver_name} ({v.capacity_tons} Tons)
                  </option>
                ))}
              </select>
            </div>

            {/* Max Capacity Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Max Capacity Limit</span>
                <span className="text-emerald-600">{maxCapacityKg} kg</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={maxCapacityKg}
                onChange={(e) => setMaxCapacityKg(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Max Distance Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Max Route Distance</span>
                <span className="text-emerald-600">{maxDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Priority Filter */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Priority Level Threshold</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              >
                <option value="ALL">All Bins (&gt;= 50% Fill)</option>
                <option value="HIGH">High Priority Only (&gt;= 75% Fill)</option>
                <option value="CRITICAL">Critical Overflow Only (&gt;= 90% Fill)</option>
              </select>
            </div>

            {/* Bin Count Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Bins Target Count</span>
                <span className="text-emerald-600">{targetBinCount} bins</span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={targetBinCount}
                onChange={(e) => setTargetBinCount(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleGenerateRoute()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-extrabold text-white hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Optimizing Waypoints...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 fill-white" />
                  <span>Generate Optimized Route</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Interactive Route Map & Comparison */}
        <div className="lg:col-span-8 space-y-4">
          {/* Comparison Cards Header */}
          {route && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-sm">
                <span className="text-[11px] text-slate-500 block font-medium">Before Optimization</span>
                <span className="text-lg font-extrabold text-slate-400 line-through">{route.distance_before_opt_km} km</span>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3.5 border border-emerald-500/30">
                <span className="text-[11px] text-emerald-800 block font-bold">After Optimization</span>
                <span className="text-xl font-extrabold text-emerald-700">{route.total_distance_km} km</span>
              </div>

              <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-sm">
                <span className="text-[11px] text-slate-500 block font-medium">Distance Saved</span>
                <span className="text-lg font-extrabold text-emerald-600">↓ {route.distance_saved_km} km</span>
              </div>

              <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-sm">
                <span className="text-[11px] text-slate-500 block font-medium">Fuel Saved</span>
                <span className="text-lg font-extrabold text-emerald-600">⛽ {route.fuel_saved_liters} L</span>
              </div>
            </div>
          )}

          {/* Route Map */}
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Optimized Polyline Route Map</h3>
                <p className="text-xs text-slate-500">Depot &rarr; Sequential Stop Waypoints &rarr; Return to Depot</p>
              </div>
              {route && (
                <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-800">
                  {route.stops.length} Bins Scheduled
                </span>
              )}
            </div>

            <MapView
              bins={bins}
              routeStops={route?.stops || []}
              height="h-[440px]"
            />
          </div>

          {/* Sequential Waypoint Stops List */}
          {route && route.stops.length > 0 && (
            <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
                Sequential Waypoint Stop Schedule ({route.route_code})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {route.stops.map((stop) => (
                  <div key={stop.stop_order} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-extrabold text-white">
                      {stop.stop_order}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 truncate">{stop.bin_code}</span>
                        <span className="text-[10px] font-bold text-emerald-600">{stop.estimated_arrival}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{stop.location_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
