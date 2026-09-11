from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.models import Bin, Vehicle, Route, RouteStop
from app.schemas.schemas import RouteOptimizeRequest, RouteResponse
from app.ai.route_optimizer import RouteOptimizer

router = APIRouter(prefix="/api/routes", tags=["Route Optimization"])

@router.post("/optimize", response_model=RouteResponse)
def optimize_route_endpoint(request: RouteOptimizeRequest, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_number == request.vehicle_id).first()
    driver_name = vehicle.driver_name if vehicle else "Assigned Driver"
    
    # Query target bins based on priority filter
    query = db.query(Bin)
    if request.priority_filter == "CRITICAL":
        query = query.filter(Bin.fill_level >= 90)
    elif request.priority_filter == "HIGH":
        query = query.filter(Bin.fill_level >= 75)
    else: # ALL
        query = query.filter(Bin.fill_level >= 50)
        
    bins_db = query.limit(request.target_bin_count).all()
    bins_data = [
        {
            "id": b.id,
            "bin_code": b.bin_code,
            "location_name": b.location_name,
            "fill_level": b.fill_level,
            "latitude": b.latitude,
            "longitude": b.longitude
        }
        for b in bins_db
    ]
    
    route_result = RouteOptimizer.optimize_route(
        vehicle_id=request.vehicle_id,
        driver_name=driver_name,
        bins_list=bins_data,
        max_capacity_kg=request.max_capacity_kg,
        max_distance_km=request.max_route_distance_km
    )
    
    # Save/update vehicle status
    if vehicle:
        vehicle.status = "On Route"
        vehicle.assigned_route_code = route_result["route_code"]
        db.commit()
        
    return route_result

@router.get("", response_model=List[RouteResponse])
def get_all_routes(db: Session = Depends(get_db)):
    routes_db = db.query(Route).all()
    result = []
    for r in routes_db:
        stops = db.query(RouteStop).filter(RouteStop.route_id == r.id).order_by(RouteStop.stop_order).all()
        stops_resp = [
            {
                "stop_order": s.stop_order,
                "bin_id": s.bin_id,
                "bin_code": s.bin_code,
                "location_name": s.location_name,
                "fill_level": s.fill_level,
                "latitude": s.latitude,
                "longitude": s.longitude,
                "estimated_arrival": s.estimated_arrival
            }
            for s in stops
        ]
        
        fuel_cons = round(r.total_distance_km / 3.5, 1)
        co2_red = round(r.fuel_saved_liters * 2.68, 1)
        
        result.append(RouteResponse(
            route_code=r.route_code,
            vehicle_id=r.vehicle_id,
            driver_name=r.driver_name,
            status=r.status,
            total_distance_km=r.total_distance_km,
            distance_before_opt_km=r.distance_before_opt_km,
            distance_saved_km=round(max(0.0, r.distance_before_opt_km - r.total_distance_km), 1),
            estimated_time_mins=f"{r.estimated_time_mins} mins",
            fuel_consumed_liters=fuel_cons,
            fuel_saved_liters=r.fuel_saved_liters,
            co2_reduced_kg=co2_red,
            total_bins_count=r.total_bins_count,
            stops=stops_resp
        ))
    return result
