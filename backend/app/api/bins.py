from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database.database import get_db
from app.models.models import Bin, BinReading, Prediction
from app.schemas.schemas import BinResponse, BinCreate, BinUpdate
from app.ai.fill_predictor import FillPredictor

router = APIRouter(prefix="/api/bins", tags=["Bins"])

@router.get("", response_model=List[BinResponse])
def get_all_bins(
    area: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Bin)
    if area and area != "All":
        query = query.filter(Bin.area == area)
    if status and status != "All":
        query = query.filter(Bin.status == status)
    if priority and priority != "All":
        query = query.filter(Bin.priority == priority)
        
    bins = query.all()
    result = []
    for b in bins:
        pred_data = FillPredictor.predict_bin_fill(b)
        resp = BinResponse(
            id=b.id,
            bin_code=b.bin_code,
            location_name=b.location_name,
            area=b.area,
            latitude=b.latitude,
            longitude=b.longitude,
            fill_level=b.fill_level,
            max_capacity_liters=b.max_capacity_liters,
            waste_type=b.waste_type,
            status=b.status,
            priority=b.priority,
            assigned_vehicle_id=b.assigned_vehicle_id,
            last_collected_at=b.last_collected_at,
            predicted_full_time=pred_data["predicted_full_time"],
            confidence_score=pred_data["confidence_score"]
        )
        result.append(resp)
    return result

@router.get("/{bin_id}", response_model=BinResponse)
def get_bin_by_id(bin_id: int, db: Session = Depends(get_db)):
    b = db.query(Bin).filter(Bin.id == bin_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Bin not found")
    pred_data = FillPredictor.predict_bin_fill(b)
    return BinResponse(
        id=b.id,
        bin_code=b.bin_code,
        location_name=b.location_name,
        area=b.area,
        latitude=b.latitude,
        longitude=b.longitude,
        fill_level=b.fill_level,
        max_capacity_liters=b.max_capacity_liters,
        waste_type=b.waste_type,
        status=b.status,
        priority=b.priority,
        assigned_vehicle_id=b.assigned_vehicle_id,
        last_collected_at=b.last_collected_at,
        predicted_full_time=pred_data["predicted_full_time"],
        confidence_score=pred_data["confidence_score"]
    )

@router.put("/{bin_id}", response_model=BinResponse)
def update_bin(bin_id: int, update_data: BinUpdate, db: Session = Depends(get_db)):
    b = db.query(Bin).filter(Bin.id == bin_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Bin not found")
        
    if update_data.fill_level is not None:
        b.fill_level = update_data.fill_level
        # Auto update status & priority based on fill level
        if b.fill_level >= 90:
            b.status = "Overflow Risk"
            b.priority = "CRITICAL"
        elif b.fill_level >= 75:
            b.status = "Nearly Full"
            b.priority = "HIGH"
        elif b.fill_level >= 50:
            b.status = "Normal"
            b.priority = "MEDIUM"
        else:
            b.status = "Normal"
            b.priority = "LOW"
            
    if update_data.status:
        b.status = update_data.status
    if update_data.priority:
        b.priority = update_data.priority
    if update_data.last_collected_at:
        b.last_collected_at = update_data.last_collected_at
        b.fill_level = 0
        b.status = "Recently Collected"
        b.priority = "LOW"
    if update_data.assigned_vehicle_id:
        b.assigned_vehicle_id = update_data.assigned_vehicle_id
        
    db.commit()
    db.refresh(b)
    
    # Record reading
    reading = BinReading(
        bin_id=b.id,
        fill_level=b.fill_level,
        recorded_at=datetime.utcnow()
    )
    db.add(reading)
    db.commit()
    
    pred_data = FillPredictor.predict_bin_fill(b)
    return BinResponse(
        id=b.id,
        bin_code=b.bin_code,
        location_name=b.location_name,
        area=b.area,
        latitude=b.latitude,
        longitude=b.longitude,
        fill_level=b.fill_level,
        max_capacity_liters=b.max_capacity_liters,
        waste_type=b.waste_type,
        status=b.status,
        priority=b.priority,
        assigned_vehicle_id=b.assigned_vehicle_id,
        last_collected_at=b.last_collected_at,
        predicted_full_time=pred_data["predicted_full_time"],
        confidence_score=pred_data["confidence_score"]
    )
