from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import json

from app.database.database import get_db
from app.models.models import WasteAnalysis
from app.schemas.schemas import WasteAnalysisResponse
from app.ai.vision_analyzer import VisionAnalyzer

router = APIRouter(prefix="/api/analyze-waste", tags=["Computer Vision Waste Detection"])

@router.post("", response_model=WasteAnalysisResponse)
async def analyze_waste(
    sample_id: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    image_name = "sample_waste_image.jpg"
    if file:
        image_name = file.filename
        
    analysis_data = VisionAnalyzer.analyze_image(
        sample_id=sample_id,
        image_name=image_name
    )
    
    # Save to database
    db_record = WasteAnalysis(
        image_name=analysis_data["image_name"],
        detected_categories=json.dumps(analysis_data["categories"]),
        overflow_status=analysis_data["overflow_status"],
        confidence_score=analysis_data["confidence_score"],
        recommended_priority=analysis_data["recommended_priority"]
    )
    db.add(db_record)
    db.commit()
    
    return analysis_data
