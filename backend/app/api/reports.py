from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import random
from datetime import datetime

from app.database.database import get_db
from app.models.models import CitizenReport
from app.schemas.schemas import CitizenReportResponse, CitizenReportCreate, CitizenReportUpdate

router = APIRouter(prefix="/api/reports", tags=["Citizen Reports"])

@router.get("", response_model=List[CitizenReportResponse])
def get_reports(
    status: Optional[str] = Query(None),
    area: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(CitizenReport)
    if status and status != "All":
        query = query.filter(CitizenReport.status == status)
    if area and area != "All":
        query = query.filter(CitizenReport.location_area == area)
    return query.order_by(CitizenReport.created_at.desc()).all()

@router.post("", response_model=CitizenReportResponse)
def create_report(report_data: CitizenReportCreate, db: Session = Depends(get_db)):
    report_code = f"REP-2026-{random.randint(100, 999)}"
    
    # Priority heuristic based on problem type
    priority = "MEDIUM"
    if "overflow" in report_data.problem_type.lower():
        priority = "CRITICAL"
    elif "dumping" in report_data.problem_type.lower():
        priority = "HIGH"
        
    db_report = CitizenReport(
        report_code=report_code,
        reporter_name=report_data.reporter_name,
        location_area=report_data.location_area,
        problem_type=report_data.problem_type,
        description=report_data.description,
        image_url=report_data.image_url or "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400",
        priority=priority,
        status="Pending",
        created_at=datetime.utcnow(),
        assigned_team="Zone Rapid Response"
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@router.put("/{report_id}", response_model=CitizenReportResponse)
def update_report(report_id: int, update_data: CitizenReportUpdate, db: Session = Depends(get_db)):
    r = db.query(CitizenReport).filter(CitizenReport.id == report_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found")
        
    if update_data.status:
        r.status = update_data.status
    if update_data.priority:
        r.priority = update_data.priority
    if update_data.assigned_team:
        r.assigned_team = update_data.assigned_team
        
    db.commit()
    db.refresh(r)
    return r
