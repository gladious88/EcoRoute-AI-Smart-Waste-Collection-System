import { GarbageBin, AIPrediction, WasteAnalysisResult, OptimizedRoute, Vehicle, CitizenReport, NotificationItem, AnalyticsData, AIRecommendation } from '../types';
import { INITIAL_BINS, INITIAL_VEHICLES, INITIAL_REPORTS, INITIAL_NOTIFICATIONS, INITIAL_ANALYTICS, INITIAL_RECOMMENDATIONS } from '../data/seedData';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Backend API ${endpoint} unavailable, using local mock state.`);
    return null;
  }
}

export const api = {
  // Bins
  async getBins(area?: string, status?: string, priority?: string): Promise<GarbageBin[]> {
    const params = new URLSearchParams();
    if (area && area !== 'All') params.append('area', area);
    if (status && status !== 'All') params.append('status', status);
    if (priority && priority !== 'All') params.append('priority', priority);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    const data = await fetchJSON<GarbageBin[]>(`/bins${query}`);
    return data || INITIAL_BINS;
  },

  async updateBin(id: number, update: Partial<GarbageBin>): Promise<GarbageBin | null> {
    const data = await fetchJSON<GarbageBin>(`/bins/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
    return data;
  },

  // Predictions
  async getPredictions(): Promise<AIPrediction[]> {
    const data = await fetchJSON<AIPrediction[]>('/predictions');
    if (data) return data;
    
    return INITIAL_BINS.map(b => ({
      id: b.id,
      bin_id: b.id,
      bin_code: b.bin_code,
      location_name: b.location_name,
      area: b.area,
      current_fill: b.fill_level,
      average_daily_rate: 2.8,
      predicted_full_time: b.predicted_full_time || 'Today, 5:30 PM',
      confidence_score: b.confidence_score || 91,
      priority_level: b.priority,
      waste_type: b.waste_type,
      fill_history: [20, 35, 50, 68, 80, b.fill_level]
    }));
  },

  // Waste Detection
  async analyzeWaste(sampleId?: string, file?: File): Promise<WasteAnalysisResult> {
    const formData = new FormData();
    if (sampleId) formData.append('sample_id', sampleId);
    if (file) formData.append('file', file);

    const data = await fetchJSON<WasteAnalysisResult>('/analyze-waste', {
      method: 'POST',
      body: formData
    });

    if (data) return data;

    // Local heuristic analysis fallback
    return {
      id: Math.floor(Math.random() * 9000) + 1000,
      image_name: file ? file.name : (sampleId || 'waste_image.jpg'),
      categories: [
        { category: 'Plastic', percentage: 54.0, color: '#3b82f6' },
        { category: 'Paper', percentage: 22.0, color: '#f59e0b' },
        { category: 'Organic', percentage: 18.0, color: '#10b981' },
        { category: 'Metal', percentage: 6.0, color: '#6b7280' }
      ],
      overflow_status: 'Overflow Risk',
      confidence_score: 92,
      recommended_priority: 'CRITICAL',
      estimated_volume_pct: 95,
      recommendation: 'Immediate dispatch required. Bin fill exceeds capacity thresholds.',
      timestamp: new Date().toISOString()
    };
  },

  // Route Optimization
  async optimizeRoute(vehicleId: string, maxCapacityKg: number, maxDistanceKm: number, priorityFilter: string, targetBinCount: number): Promise<OptimizedRoute> {
    const data = await fetchJSON<OptimizedRoute>('/routes/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehicle_id: vehicleId,
        max_capacity_kg: maxCapacityKg,
        max_route_distance_km: maxDistanceKm,
        priority_filter: priorityFilter,
        target_bin_count: targetBinCount
      })
    });

    if (data) return data;

    const criticalBins = INITIAL_BINS.filter(b => b.fill_level >= 75);
    return {
      route_code: `R-${vehicleId.split('-').pop()}-OPT`,
      vehicle_id: vehicleId,
      driver_name: 'R. Murugan',
      status: 'Assigned',
      total_distance_km: 21.4,
      distance_before_opt_km: 32.8,
      distance_saved_km: 11.4,
      estimated_time_mins: '48 mins',
      fuel_consumed_liters: 6.1,
      fuel_saved_liters: 3.3,
      co2_reduced_kg: 8.8,
      total_bins_count: criticalBins.length,
      stops: criticalBins.map((b, idx) => ({
        stop_order: idx + 1,
        bin_id: b.id,
        bin_code: b.bin_code,
        location_name: b.location_name,
        fill_level: b.fill_level,
        latitude: b.latitude,
        longitude: b.longitude,
        estimated_arrival: `+${(idx + 1) * 8} mins`
      }))
    };
  },

  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    const data = await fetchJSON<Vehicle[]>('/vehicles');
    return data || INITIAL_VEHICLES;
  },

  // Citizen Reports
  async getReports(): Promise<CitizenReport[]> {
    const data = await fetchJSON<CitizenReport[]>('/reports');
    return data || INITIAL_REPORTS;
  },

  async createReport(report: Omit<CitizenReport, 'id' | 'report_code' | 'created_at' | 'status' | 'assigned_team'>): Promise<CitizenReport> {
    const data = await fetchJSON<CitizenReport>('/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    });

    if (data) return data;

    return {
      id: Date.now(),
      report_code: `REP-2026-${Math.floor(Math.random() * 900) + 100}`,
      ...report,
      status: 'Pending',
      created_at: new Date().toISOString(),
      assigned_team: 'Zone Rapid Response'
    };
  },

  // Analytics & Notifications
  async getAnalytics(): Promise<AnalyticsData> {
    const data = await fetchJSON<AnalyticsData>('/analytics');
    return data || INITIAL_ANALYTICS;
  },

  async getNotifications(): Promise<NotificationItem[]> {
    const data = await fetchJSON<NotificationItem[]>('/notifications');
    return data || INITIAL_NOTIFICATIONS;
  },

  async getRecommendations(): Promise<AIRecommendation[]> {
    const data = await fetchJSON<AIRecommendation[]>('/analytics/recommendations');
    return data || INITIAL_RECOMMENDATIONS;
  }
};
