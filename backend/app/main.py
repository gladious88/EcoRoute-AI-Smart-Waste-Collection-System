from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.database.database import engine, Base
from app.api import bins, predictions, waste_detection, routes, vehicles, reports, analytics, notifications, auth
from seed_data import seed_database

# Initialize Database tables if not existing
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EcoRoute AI - Smart Waste Collection System API",
    description="Intelligent municipal waste monitoring, bin-fill forecasting, waste vision detection, and route optimization API for Tamil Nadu.",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(bins.router)
app.include_router(predictions.router)
app.include_router(waste_detection.router)
app.include_router(routes.router)
app.include_router(vehicles.router)
app.include_router(reports.router)
app.include_router(analytics.router)
app.include_router(notifications.router)
app.include_router(auth.router)

@app.on_event("startup")
def startup_event():
    # Auto-seed database if empty
    from app.database.database import SessionLocal
    from app.models.models import Bin
    db = SessionLocal()
    try:
        count = db.query(Bin).count()
        if count == 0:
            print("Database empty. Seeding initial Tamil Nadu waste collection data...")
            seed_database()
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "name": "EcoRoute AI API",
        "subtitle": "Smart Waste Collection & Route Optimization",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "system": "EcoRoute AI Engine",
        "environment": "production-prototype",
        "database": "SQLite (PostgreSQL ready)"
    }
