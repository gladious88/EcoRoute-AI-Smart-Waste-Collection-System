from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.models import Notification
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

class NotificationSchema(BaseModel):
    id: int
    type: str
    title: str
    message: str
    priority: str
    is_read: bool
    timestamp: datetime
    action_url: str

    class Config:
        from_attributes = True

@router.get("", response_model=List[NotificationSchema])
def get_notifications(db: Session = Depends(get_db)):
    return db.query(Notification).order_by(Notification.timestamp.desc()).all()

@router.put("/{notification_id}/read")
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    n = db.query(Notification).filter(Notification.id == notification_id).first()
    if n:
        n.is_read = True
        db.commit()
    return {"status": "success"}
