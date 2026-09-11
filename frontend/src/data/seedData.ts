import { GarbageBin, Vehicle, CitizenReport, NotificationItem, AIRecommendation, AnalyticsData, OptimizedRoute } from '../types';

export const INITIAL_BINS: GarbageBin[] = [
  { id: 101, bin_code: "TN-AN-101", location_name: "Tower Park Main Gate, Anna Nagar", area: "Anna Nagar", latitude: 13.0850, longitude: 80.2101, fill_level: 96, max_capacity_liters: 1500, waste_type: "Organic", status: "Overflow Risk", priority: "CRITICAL", last_collected_at: "2026-09-10T14:30:00", predicted_full_time: "Today, 1:30 PM", confidence_score: 95 },
  { id: 102, bin_code: "TN-AN-102", location_name: "2nd Avenue Junction, Anna Nagar", area: "Anna Nagar", latitude: 13.0882, longitude: 80.2125, fill_level: 84, max_capacity_liters: 1100, waste_type: "Recyclable", status: "Nearly Full", priority: "HIGH", last_collected_at: "2026-09-10T18:00:00", predicted_full_time: "Today, 4:45 PM", confidence_score: 91 },
  { id: 103, bin_code: "TN-AN-103", location_name: "Shanti Colony Market, Anna Nagar", area: "Anna Nagar", latitude: 13.0825, longitude: 80.2078, fill_level: 78, max_capacity_liters: 2400, waste_type: "Organic", status: "Nearly Full", priority: "HIGH", last_collected_at: "2026-09-11T05:00:00", predicted_full_time: "Today, 6:15 PM", confidence_score: 89 },
  { id: 104, bin_code: "TN-TN-201", location_name: "Ranganathan Street, T. Nagar", area: "T. Nagar", latitude: 13.0418, longitude: 80.2341, fill_level: 98, max_capacity_liters: 2400, waste_type: "General", status: "Overflow Risk", priority: "CRITICAL", last_collected_at: "2026-09-10T22:15:00", predicted_full_time: "Today, 12:45 PM", confidence_score: 97 },
  { id: 105, bin_code: "TN-TN-202", location_name: "Pondy Bazaar Bus Stop, T. Nagar", area: "T. Nagar", latitude: 13.0435, longitude: 80.2380, fill_level: 88, max_capacity_liters: 1500, waste_type: "Recyclable", status: "Nearly Full", priority: "HIGH", last_collected_at: "2026-09-11T04:30:00", predicted_full_time: "Today, 3:20 PM", confidence_score: 93 },
  { id: 106, bin_code: "TN-VL-301", location_name: "Phoenix Marketcity Gate 2, Velachery", area: "Velachery", latitude: 12.9815, longitude: 80.2180, fill_level: 91, max_capacity_liters: 1500, waste_type: "Organic", status: "Overflow Risk", priority: "CRITICAL", last_collected_at: "2026-09-10T16:00:00", predicted_full_time: "Today, 2:10 PM", confidence_score: 94 },
  { id: 107, bin_code: "TN-VL-302", location_name: "100 Feet Bypass Road, Velachery", area: "Velachery", latitude: 12.9840, longitude: 80.2215, fill_level: 68, max_capacity_liters: 1100, waste_type: "General", status: "Normal", priority: "MEDIUM", last_collected_at: "2026-09-11T06:30:00", predicted_full_time: "Tomorrow, 9:00 AM", confidence_score: 87 },
  { id: 108, bin_code: "TN-AD-401", location_name: "LB Road Signal, Adyar", area: "Adyar", latitude: 13.0012, longitude: 80.2565, fill_level: 82, max_capacity_liters: 1100, waste_type: "Recyclable", status: "Nearly Full", priority: "HIGH", last_collected_at: "2026-09-10T19:45:00", predicted_full_time: "Today, 5:30 PM", confidence_score: 90 },
  { id: 109, bin_code: "TN-GD-501", location_name: "Kathipara Junction, Guindy", area: "Guindy", latitude: 13.0067, longitude: 80.2206, fill_level: 94, max_capacity_liters: 2400, waste_type: "Hazardous", status: "Overflow Risk", priority: "CRITICAL", last_collected_at: "2026-09-10T12:00:00", predicted_full_time: "Today, 1:15 PM", confidence_score: 96 },
  { id: 110, bin_code: "TN-TB-601", location_name: "East Tambaram Market, Tambaram", area: "Tambaram", latitude: 12.9249, longitude: 80.1000, fill_level: 76, max_capacity_liters: 1500, waste_type: "Organic", status: "Nearly Full", priority: "HIGH", last_collected_at: "2026-09-11T02:00:00", predicted_full_time: "Today, 7:00 PM", confidence_score: 88 },
  { id: 111, bin_code: "TN-PR-701", location_name: "Porur Lake Road, Porur", area: "Porur", latitude: 13.0382, longitude: 80.1565, fill_level: 45, max_capacity_liters: 1100, waste_type: "General", status: "Normal", priority: "LOW", last_collected_at: "2026-09-11T07:15:00", predicted_full_time: "Tomorrow, 2:30 PM", confidence_score: 85 }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  { id: 1, vehicle_number: "TN-01-GA-4521", driver_name: "R. Murugan", capacity_tons: 5.0, current_load_kg: 4100, fuel_level_pct: 88, status: "On Route", assigned_route_code: "R-4521-12" },
  { id: 2, vehicle_number: "TN-02-AZ-8812", driver_name: "S. Kamesh", capacity_tons: 6.5, current_load_kg: 4800, fuel_level_pct: 74, status: "On Route", assigned_route_code: "R-8812-10" },
  { id: 3, vehicle_number: "TN-05-BK-1934", driver_name: "M. Selvam", capacity_tons: 5.0, current_load_kg: 0, fuel_level_pct: 92, status: "Available", assigned_route_code: undefined },
  { id: 4, vehicle_number: "TN-07-CL-6720", driver_name: "P. Karthik", capacity_tons: 8.0, current_load_kg: 6200, fuel_level_pct: 65, status: "On Route", assigned_route_code: "R-6720-14" },
  { id: 5, vehicle_number: "TN-09-DH-3041", driver_name: "V. Anbarasu", capacity_tons: 5.0, current_load_kg: 0, fuel_level_pct: 45, status: "Maintenance", assigned_route_code: undefined },
  { id: 6, vehicle_number: "TN-10-EJ-9182", driver_name: "G. Venkatesh", capacity_tons: 6.0, current_load_kg: 0, fuel_level_pct: 95, status: "Available", assigned_route_code: undefined }
];

export const INITIAL_REPORTS: CitizenReport[] = [
  {
    id: 1,
    report_code: "REP-2026-101",
    reporter_name: "S. Ramanathan",
    location_area: "Anna Nagar",
    problem_type: "Overflowing bin",
    description: "Bin TN-AN-101 near Tower Park is overflowing onto the main sidewalk.",
    priority: "CRITICAL",
    status: "In Progress",
    created_at: "2026-09-11T08:30:00",
    assigned_team: "Zone 8 Rapid Response",
    image_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400"
  },
  {
    id: 2,
    report_code: "REP-2026-102",
    reporter_name: "P. Priya",
    location_area: "T. Nagar",
    problem_type: "Illegal dumping",
    description: "Commercial packing boxes left uncollected near Pondy Bazaar.",
    priority: "HIGH",
    status: "Assigned",
    created_at: "2026-09-11T09:15:00",
    assigned_team: "Zone 10 Enforcement Team",
    image_url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400"
  },
  {
    id: 3,
    report_code: "REP-2026-103",
    reporter_name: "K. Balaji",
    location_area: "Velachery",
    problem_type: "Damaged bin",
    description: "Lid mechanism broken on bin TN-VL-302.",
    priority: "MEDIUM",
    status: "Pending",
    created_at: "2026-09-11T10:00:00",
    assigned_team: "Maintenance Crew A",
    image_url: "https://images.unsplash.com/photo-1604186837056-8e7c286756f2?w=400"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: "critical",
    title: "Critical Bin Overflow Warning",
    message: "Bin TN-AN-101 (Tower Park, Anna Nagar) is predicted to overflow within 1.5 hours.",
    priority: "CRITICAL",
    is_read: false,
    timestamp: "2026-09-11T10:45:00",
    action_url: "/predictions"
  },
  {
    id: 2,
    type: "warning",
    title: "High Fill Rate in T. Nagar",
    message: "Ranganathan Street bins experiencing 4.2% hourly fill rate due to festival shopping crowd.",
    priority: "HIGH",
    is_read: false,
    timestamp: "2026-09-11T10:15:00",
    action_url: "/monitoring"
  },
  {
    id: 3,
    type: "success",
    title: "Route R-4521-12 Optimized",
    message: "Saved 11.2 km travel distance (3.2 liters fuel saved) for vehicle TN-01-GA-4521.",
    priority: "MEDIUM",
    is_read: true,
    timestamp: "2026-09-11T09:00:00",
    action_url: "/routes"
  }
];

export const INITIAL_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: "rec-1",
    title: "Collect 8 High-Priority Bins",
    description: "Anna Nagar, T. Nagar & Velachery have 8 bins exceeding 85% fill capacity.",
    type: "warning",
    priority: "CRITICAL",
    action_label: "Generate Optimized Route",
    action_target: "/routes"
  },
  {
    id: "rec-2",
    title: "Vehicle TN-01-GA-4521 Approaching Max Load",
    description: "Vehicle TN-01-GA-4521 is currently at 82% capacity on Route R-4521-12.",
    type: "optimization",
    priority: "HIGH",
    action_label: "View Fleet Status",
    action_target: "/vehicles"
  },
  {
    id: "rec-3",
    title: "Route Optimization Distance Reduction",
    description: "Today's optimized dispatch algorithm saved 14.8 km travel distance across Guindy & Adyar.",
    type: "optimization",
    priority: "MEDIUM",
    action_label: "View Analytics",
    action_target: "/analytics"
  }
];

export const INITIAL_ANALYTICS: AnalyticsData = {
  total_bins: 56,
  bins_requiring_collection: 14,
  predicted_overflow: 5,
  active_vehicles: 3,
  collection_efficiency_pct: 95.8,
  fuel_saved_liters: 68.4,
  waste_collected_per_day: [
    { day: "Mon", tonnes: 42.5, efficiency: 92 },
    { day: "Tue", tonnes: 48.0, efficiency: 94 },
    { day: "Wed", tonnes: 45.2, efficiency: 91 },
    { day: "Thu", tonnes: 52.8, efficiency: 96 },
    { day: "Fri", tonnes: 56.4, efficiency: 95 },
    { day: "Sat", tonnes: 61.2, efficiency: 98 },
    { day: "Sun", tonnes: 44.0, efficiency: 93 }
  ],
  waste_by_area: [
    { area: "Anna Nagar", fill_units: 320 },
    { area: "T. Nagar", fill_units: 410 },
    { area: "Velachery", fill_units: 290 },
    { area: "Adyar", fill_units: 240 },
    { area: "Guindy", fill_units: 380 },
    { area: "Tambaram", fill_units: 210 },
    { area: "Porur", fill_units: 190 }
  ],
  waste_by_type: [
    { type: "Organic", count: 24 },
    { type: "Recyclable", count: 18 },
    { type: "General", count: 10 },
    { type: "Hazardous", count: 4 }
  ],
  insights: [
    "Overflow incidents decreased by 18% this month due to early predictive dispatch.",
    "Route optimization algorithm reduced average travel distance by 14% across Chennai zones.",
    "T. Nagar and Anna Nagar show highest daily fill rate (3.9% per hour average).",
    "CO2 emissions reduced by 114 kg this week through intelligent vehicle routing."
  ]
};
