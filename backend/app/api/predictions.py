from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.models import Bin
from app.schemas.schemas import PredictionResponse
from app.ai.fill_predictor import FillPredictor

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])

@router.get("", response_model=List[PredictionResponse])
def get_all_predictions(db: Session = Depends(get_db)):
    bins = db.query(Bin).all()
    predictions = []
    for b in bins:
        pred_data = FillPredictor.predict_bin_fill(b)
        predictions.append(PredictionResponse(**pred_data))
        
    # Sort by priority/fill level (highest priority first)
    predictions.sort(key=lambda x: x.current_fill, reverse=True)
    return predictions
