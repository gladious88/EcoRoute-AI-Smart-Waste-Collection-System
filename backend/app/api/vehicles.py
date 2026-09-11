from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.models import Vehicle
from app.schemas.schemas import VehicleResponse, VehicleAssignRequest

router = APIRouter(prefix="/api/vehicles", tags=["Vehicles"])

@router.get("", response_model=List[VehicleResponse])
def get_vehicles(db: Session = Depends(get_db)):
    return db.query(Vehicle).all()

@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(vehicle_id: int, request: VehicleAssignRequest, db: Session = Depends(get_db)):
    v = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    if request.driver_name:
        v.driver_name = request.driver_name
    if request.assigned_route_code is not None:
        v.assigned_route_code = request.assigned_route_code
    if request.status:
        v.status = request.status
        
    db.commit()
    db.refresh(v)
    return v
