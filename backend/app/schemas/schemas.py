from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    avatar: Optional[str] = None

    class Config:
        from_attributes = True

# Bin Schemas
class BinBase(BaseModel):
    bin_code: str
    location_name: str
    area: str
    latitude: float
    longitude: float
    fill_level: int = Field(..., ge=0, le=100)
    max_capacity_liters: int = 1100
    waste_type: str = "Organic"
    status: str = "Normal"
    priority: str = "LOW"
    assigned_vehicle_id: Optional[str] = None

class BinCreate(BinBase):
    pass

class BinUpdate(BaseModel):
    fill_level: Optional[int] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    last_collected_at: Optional[datetime] = None
    assigned_vehicle_id: Optional[str] = None

class BinResponse(BinBase):
    id: int
    last_collected_at: datetime
    predicted_full_time: Optional[str] = "Today, 5:30 PM"
    confidence_score: Optional[int] = 88

    class Config:
        from_attributes = True

# Bin Reading Schemas
class BinReadingResponse(BaseModel):
    id: int
    bin_id: int
    fill_level: int
    temperature_c: float
    battery_level: int
    recorded_at: datetime

    class Config:
        from_attributes = True

# AI Prediction Schemas
class PredictionResponse(BaseModel):
    id: int
    bin_id: int
    bin_code: str
    location_name: str
    area: str
    current_fill: int
    average_daily_rate: float
    predicted_full_time: str
    confidence_score: int
    priority_level: str
    waste_type: str
    fill_history: List[int] = []

    class Config:
        from_attributes = True

# Computer Vision Waste Detection Schemas
class WasteAnalysisRequest(BaseModel):
    image_base64: Optional[str] = None
    sample_image_id: Optional[str] = None

class WasteCategoryDetail(BaseModel):
    category: str
    percentage: float
    color: str

class WasteAnalysisResponse(BaseModel):
    id: int
    image_name: str
    categories: List[WasteCategoryDetail]
    overflow_status: str
    confidence_score: int
    recommended_priority: str
    estimated_volume_pct: int
    recommendation: str
    timestamp: datetime

# Route Optimization Schemas
class RouteOptimizeRequest(BaseModel):
    vehicle_id: str
    max_capacity_kg: float = 5000.0
    max_route_distance_km: float = 50.0
    priority_filter: str = "ALL" # ALL, HIGH, CRITICAL
    target_bin_count: int = 15

class RouteStopResponse(BaseModel):
    stop_order: int
    bin_id: int
    bin_code: str
    location_name: str
    fill_level: int
    latitude: float
    longitude: float
    estimated_arrival: str

class RouteResponse(BaseModel):
    route_code: str
    vehicle_id: str
    driver_name: str
    status: str
    total_distance_km: float
    distance_before_opt_km: float
    distance_saved_km: float
    estimated_time_mins: str
    fuel_consumed_liters: float
    fuel_saved_liters: float
    co2_reduced_kg: float
    total_bins_count: int
    stops: List[RouteStopResponse]

# Vehicle Schemas
class VehicleResponse(BaseModel):
    id: int
    vehicle_number: str
    driver_name: str
    capacity_tons: float
    current_load_kg: float
    fuel_level_pct: int
    status: str
    assigned_route_code: Optional[str] = None

    class Config:
        from_attributes = True

class VehicleAssignRequest(BaseModel):
    driver_name: Optional[str] = None
    assigned_route_code: Optional[str] = None
    status: Optional[str] = None

# Citizen Report Schemas
class CitizenReportCreate(BaseModel):
    reporter_name: str
    location_area: str
    problem_type: str
    description: str
    image_url: Optional[str] = None

class CitizenReportUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_team: Optional[str] = None

class CitizenReportResponse(BaseModel):
    id: int
    report_code: str
    reporter_name: str
    location_area: str
    problem_type: str
    description: str
    image_url: Optional[str] = None
    priority: str
    status: str
    created_at: datetime
    assigned_team: str

    class Config:
        from_attributes = True

# Analytics & Recommendations Schemas
class AnalyticsResponse(BaseModel):
    total_bins: int
    bins_requiring_collection: int
    predicted_overflow: int
    active_vehicles: int
    collection_efficiency_pct: float
    fuel_saved_liters: float
    waste_collected_per_day: List[dict]
    waste_by_area: List[dict]
    waste_by_type: List[dict]
    insights: List[str]

class AIRecommendation(BaseModel):
    id: str
    title: str
    description: str
    type: str # warning, action, optimization
    priority: str # CRITICAL, HIGH, MEDIUM
    action_label: str
    action_target: str
