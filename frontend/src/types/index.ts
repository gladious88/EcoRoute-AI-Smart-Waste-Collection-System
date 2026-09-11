export type UserRole = 'Municipal Admin' | 'Collection Driver';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  avatar?: string;
}

export type WasteType = 'Organic' | 'Recyclable' | 'Hazardous' | 'General';
export type BinStatus = 'Normal' | 'Nearly Full' | 'High Priority' | 'Overflow Risk' | 'Recently Collected';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface GarbageBin {
  id: number;
  bin_code: string;
  location_name: string;
  area: string;
  latitude: number;
  longitude: number;
  fill_level: number;
  max_capacity_liters: number;
  waste_type: WasteType;
  status: BinStatus;
  priority: PriorityLevel;
  last_collected_at: string;
  assigned_vehicle_id?: string;
  predicted_full_time?: string;
  confidence_score?: number;
}

export interface AIPrediction {
  id: number;
  bin_id: number;
  bin_code: string;
  location_name: string;
  area: string;
  current_fill: number;
  average_daily_rate: number;
  predicted_full_time: string;
  confidence_score: number;
  priority_level: PriorityLevel;
  waste_type: WasteType;
  fill_history: number[];
}

export interface WasteCategoryDetail {
  category: string;
  percentage: number;
  color: string;
}

export interface WasteAnalysisResult {
  id: number;
  image_name: string;
  categories: WasteCategoryDetail[];
  overflow_status: string;
  confidence_score: number;
  recommended_priority: PriorityLevel;
  estimated_volume_pct: number;
  recommendation: string;
  timestamp: string;
}

export interface RouteStop {
  stop_order: number;
  bin_id: number;
  bin_code: string;
  location_name: string;
  fill_level: number;
  latitude: number;
  longitude: number;
  estimated_arrival: string;
}

export interface OptimizedRoute {
  route_code: string;
  vehicle_id: string;
  driver_name: string;
  status: 'Assigned' | 'In Progress' | 'Completed';
  total_distance_km: number;
  distance_before_opt_km: number;
  distance_saved_km: number;
  estimated_time_mins: string;
  fuel_consumed_liters: number;
  fuel_saved_liters: number;
  co2_reduced_kg: number;
  total_bins_count: number;
  stops: RouteStop[];
}

export interface Vehicle {
  id: number;
  vehicle_number: string;
  driver_name: string;
  capacity_tons: number;
  current_load_kg: number;
  fuel_level_pct: number;
  status: 'Available' | 'On Route' | 'Full' | 'Maintenance';
  assigned_route_code?: string;
}

export type ReportProblemType = 'Overflowing bin' | 'Damaged bin' | 'Illegal dumping' | 'Missed collection' | 'Other';
export type ReportStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved';

export interface CitizenReport {
  id: number;
  report_code: string;
  reporter_name: string;
  location_area: string;
  problem_type: ReportProblemType;
  description: string;
  image_url?: string;
  priority: PriorityLevel;
  status: ReportStatus;
  created_at: string;
  assigned_team: string;
}

export interface NotificationItem {
  id: number;
  type: 'critical' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  priority: PriorityLevel;
  is_read: boolean;
  timestamp: string;
  action_url?: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'action' | 'optimization';
  priority: PriorityLevel;
  action_label: string;
  action_target: string;
}

export interface AnalyticsData {
  total_bins: number;
  bins_requiring_collection: number;
  predicted_overflow: number;
  active_vehicles: number;
  collection_efficiency_pct: number;
  fuel_saved_liters: number;
  waste_collected_per_day: { day: string; tonnes: number; efficiency: number }[];
  waste_by_area: { area: string; fill_units: number }[];
  waste_by_type: { type: string; count: number }[];
  insights: string[];
}
