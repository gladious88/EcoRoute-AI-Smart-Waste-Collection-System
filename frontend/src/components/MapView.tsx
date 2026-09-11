import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GarbageBin, RouteStop } from '../types';
import { MapPin, Trash2, Clock, Truck, ShieldAlert } from 'lucide-react';

// Custom SVG Markers for Leaflet
const createCustomMarkerIcon = (fillLevel: number, status: string, isSelected = false) => {
  let color = '#22c55e'; // Green - Normal
  if (status === 'Recently Collected') color = '#3b82f6'; // Blue
  else if (fillLevel >= 90 || status === 'Overflow Risk') color = '#ef4444'; // Red
  else if (fillLevel >= 80 || status === 'High Priority') color = '#f97316'; // Orange
  else if (fillLevel >= 65 || status === 'Nearly Full') color = '#eab308'; // Yellow

  const svgHtml = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
      <div style="
        width: 32px; 
        height: 32px; 
        background-color: ${color}; 
        border: 3px solid #ffffff; 
        border-radius: 50%; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex; 
        align-items: center; 
        justify-content: center;
        color: white;
        font-weight: 800;
        font-size: 11px;
        transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
        transition: all 0.2s ease;
      ">
        ${fillLevel}%
      </div>
      ${fillLevel >= 90 ? `<div style="position: absolute; top: -3px; right: -3px; width: 10px; height: 10px; background-color: #ef4444; border: 2px solid white; border-radius: 50%; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-bin-icon',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });
};

const depotIcon = L.divIcon({
  html: `
    <div style="
      width: 38px; 
      height: 38px; 
      background-color: #0f172a; 
      border: 3px solid #10b981; 
      border-radius: 12px; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      display: flex; 
      align-items: center; 
      justify-content: center;
      color: #10b981;
      font-weight: 800;
      font-size: 14px;
    ">
      🚛
    </div>
  `,
  className: 'custom-leaflet-depot-icon',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -20]
});

interface MapViewProps {
  bins: GarbageBin[];
  routeStops?: RouteStop[];
  selectedBinId?: number | null;
  onBinSelect?: (bin: GarbageBin) => void;
  onMarkCollected?: (binId: number) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const MapRecenter: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  bins,
  routeStops = [],
  selectedBinId = null,
  onBinSelect,
  onMarkCollected,
  center = [13.0418, 80.2206], // Chennai Default Center
  zoom = 12,
  height = "h-[500px]"
}) => {
  // Depot coordinate (Guindy Central Depot)
  const depotPos: [number, number] = [13.0067, 80.2206];

  // Route polylines path if route stops provided
  const routePolyline: [number, number][] = routeStops.length > 0
    ? [depotPos, ...routeStops.map(s => [s.latitude, s.longitude] as [number, number]), depotPos]
    : [];

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-200 shadow-sm z-10`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter center={center} zoom={zoom} />

        {/* Municipal Depot Marker */}
        <Marker position={depotPos} icon={depotIcon}>
          <Popup>
            <div className="p-3">
              <span className="inline-block rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">Municipal Central Depot</span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">Guindy Fleet Depot</h4>
              <p className="text-xs text-slate-500">Central Dispatch & Vehicle Charging Station</p>
            </div>
          </Popup>
        </Marker>

        {/* Route Line */}
        {routePolyline.length > 1 && (
          <Polyline
            positions={routePolyline}
            pathOptions={{
              color: '#10b981',
              weight: 5,
              opacity: 0.8,
              dashArray: '8, 8'
            }}
          />
        )}

        {/* Garbage Bins Markers */}
        {bins.map((bin) => {
          const isSelected = bin.id === selectedBinId;
          return (
            <Marker
              key={bin.id}
              position={[bin.latitude, bin.longitude]}
              icon={createCustomMarkerIcon(bin.fill_level, bin.status, isSelected)}
              eventHandlers={{
                click: () => onBinSelect && onBinSelect(bin)
              }}
            >
              <Popup>
                <div className="p-3.5 w-64">
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                    <span className="font-extrabold text-xs text-slate-900">{bin.bin_code}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      bin.fill_level >= 90 ? 'bg-red-100 text-red-700' :
                      bin.fill_level >= 75 ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {bin.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-800 leading-tight">{bin.location_name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{bin.area}, Chennai</p>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Fill Level:</span>
                      <span className="font-bold text-slate-900">{bin.fill_level}% ({bin.max_capacity_liters}L)</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          bin.fill_level >= 90 ? 'bg-red-500' : bin.fill_level >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${bin.fill_level}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-400">Waste Type:</span>
                      <span className="font-semibold text-slate-700">{bin.waste_type}</span>
                    </div>
                    
                    {bin.predicted_full_time && (
                      <div className="flex items-center justify-between text-[11px] text-amber-600 font-semibold">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Predicted Full:</span>
                        <span>{bin.predicted_full_time}</span>
                      </div>
                    )}
                  </div>

                  {onMarkCollected && (
                    <button
                      onClick={() => onMarkCollected(bin.id)}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Mark as Collected</span>
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
