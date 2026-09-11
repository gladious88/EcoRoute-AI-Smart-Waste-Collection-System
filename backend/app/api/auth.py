from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.models import User
from app.schemas.schemas import UserLogin, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

DEMO_USERS = {
    "admin@ecoroute.ai": {
        "id": 1,
        "email": "admin@ecoroute.ai",
        "full_name": "Dr. K. Vijay (Greater Chennai Corp)",
        "role": "Municipal Admin",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    },
    "driver@ecoroute.ai": {
        "id": 2,
        "email": "driver@ecoroute.ai",
        "full_name": "R. Murugan (Senior Driver)",
        "role": "Collection Driver",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    }
}

@router.post("/login", response_model=UserResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    email = credentials.email.strip().lower()
    
    # Check DB user or Demo user
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user
        
    if email in DEMO_USERS:
        return DEMO_USERS[email]
        
    # Default fallback for demo prototype login with any email
    return UserResponse(
        id=99,
        email=email,
        full_name="Municipal Officer",
        role="Municipal Admin" if "driver" not in email else "Collection Driver",
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    )
