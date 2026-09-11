from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="Municipal Admin") # Municipal Admin or Collection Driver
    avatar = Column(String, nullable=True)

class Bin(Base):
    __tablename__ = "bins"

    id = Column(Integer, primary_key=True, index=True)
    bin_code = Column(String, unique=True, index=True, nullable=False) # e.g. TN-AN-101
    location_name = Column(String, nullable=False)
    area = Column(String, nullable=False) # Anna Nagar, T. Nagar, Velachery, etc.
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    fill_level = Column(Integer, default=0) # 0 to 100 percentage
    max_capacity_liters = Column(Integer, default=1100)
    waste_type = Column(String, default="Organic") # Organic, Recyclable, Hazardous, General
    status = Column(String, default="Normal") # Normal, Nearly Full, High Priority, Overflow Risk, Recently Collected
    priority = Column(String, default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    last_collected_at = Column(DateTime, default=datetime.utcnow)
    assigned_vehicle_id = Column(String, nullable=True)

    readings = relationship("BinReading", back_populates="bin", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="bin", cascade="all, delete-orphan")

class BinReading(Base):
    __tablename__ = "bin_readings"

    id = Column(Integer, primary_key=True, index=True)
    bin_id = Column(Integer, ForeignKey("bins.id"), nullable=False)
    fill_level = Column(Integer, nullable=False)
    temperature_c = Column(Float, default=30.0)
    battery_level = Column(Integer, default=95)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    bin = relationship("Bin", back_populates="readings")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    bin_id = Column(Integer, ForeignKey("bins.id"), nullable=False)
    current_fill = Column(Integer, nullable=False)
    average_daily_rate = Column(Float, nullable=False) # % fill per hour
    predicted_full_time = Column(String, nullable=False) # Human readable datetime string
    predicted_full_timestamp = Column(DateTime, nullable=False)
    confidence_score = Column(Integer, nullable=False) # e.g. 92%
    priority_level = Column(String, nullable=False) # LOW, MEDIUM, HIGH, CRITICAL

    bin = relationship("Bin", back_populates="predictions")

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_number = Column(String, unique=True, index=True, nullable=False) # e.g. TN-01-GA-4521
    driver_name = Column(String, nullable=False)
    capacity_tons = Column(Float, default=5.0)
    current_load_kg = Column(Float, default=0.0)
    fuel_level_pct = Column(Integer, default=85)
    status = Column(String, default="Available") # Available, On Route, Full, Maintenance
    assigned_route_code = Column(String, nullable=True)

class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    route_code = Column(String, unique=True, index=True, nullable=False) # e.g. R-AN-204
    vehicle_id = Column(String, nullable=False)
    driver_name = Column(String, nullable=False)
    status = Column(String, default="Assigned") # Assigned, In Progress, Completed
    total_distance_km = Column(Float, default=0.0)
    distance_before_opt_km = Column(Float, default=0.0)
    estimated_time_mins = Column(Integer, default=0)
    fuel_saved_liters = Column(Float, default=0.0)
    total_bins_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    stops = relationship("RouteStop", back_populates="route", cascade="all, delete-orphan")

class RouteStop(Base):
    __tablename__ = "route_stops"

    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    stop_order = Column(Integer, nullable=False)
    bin_id = Column(Integer, nullable=False)
    bin_code = Column(String, nullable=False)
    location_name = Column(String, nullable=False)
    fill_level = Column(Integer, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    estimated_arrival = Column(String, nullable=False)

    route = relationship("Route", back_populates="stops")

class CitizenReport(Base):
    __tablename__ = "citizen_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_code = Column(String, unique=True, index=True, nullable=False) # e.g. REP-2026-881
    reporter_name = Column(String, nullable=False)
    location_area = Column(String, nullable=False)
    problem_type = Column(String, nullable=False) # Overflowing bin, Damaged bin, Illegal dumping, Missed collection, Other
    description = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
    priority = Column(String, default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String, default="Pending") # Pending, Assigned, In Progress, Resolved
    created_at = Column(DateTime, default=datetime.utcnow)
    assigned_team = Column(String, default="Zone 4 Rapid Response")

class WasteAnalysis(Base):
    __tablename__ = "waste_analyses"

    id = Column(Integer, primary_key=True, index=True)
    image_name = Column(String, nullable=False)
    detected_categories = Column(Text, nullable=False) # JSON string of breakdown
    overflow_status = Column(String, nullable=False) # Normal, Nearly Full, Overflow Risk
    confidence_score = Column(Integer, nullable=False) # e.g. 91%
    recommended_priority = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False) # critical, warning, success, info
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(String, default="MEDIUM")
    is_read = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    action_url = Column(String, nullable=True)
