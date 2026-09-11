import sys
import os
import random
from datetime import datetime, timedelta

# Ensure backend root is on python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import engine, Base, SessionLocal
from app.models.models import User, Bin, BinReading, Prediction, Vehicle, Route, RouteStop, CitizenReport, WasteAnalysis, Notification
from app.ai.fill_predictor import FillPredictor
from app.ai.route_optimizer import RouteOptimizer

# Tamil Nadu Chennai Area Coordinates & Landmarks
AREAS = [
    {
        "name": "Anna Nagar",
        "center_lat": 13.0850,
        "center_lon": 80.2101,
        "landmarks": ["Tower Park", "2nd Avenue", "Shanti Colony", "Roundtana", "10th Main Rd", "Metro Station", "Blue Star"]
    },
    {
        "name": "T. Nagar",
        "center_lat": 13.0418,
        "center_lon": 80.2341,
        "landmarks": ["Ranganathan St", "Usman Road", "Pondy Bazaar", "Panagal Park", "G N Chetty Rd", "Vani Mahal", "South Boag Rd"]
    },
    {
        "name": "Velachery",
        "center_lat": 12.9815,
        "center_lon": 80.2180,
        "landmarks": ["Phoenix Marketcity", "100 Feet Bypass Rd", "Velachery Lake", "MRTS Station", "Taramani Link Rd", "Vijayanagar Bus Stand"]
    },
    {
        "name": "Adyar",
        "center_lat": 13.0012,
        "center_lon": 80.2565,
        "landmarks": ["LB Road", "Adyar Signal", "Kasturba Nagar", "Gandhi Nagar", "IIT Gate", "Besant Avenue", "Cancer Institute"]
    },
    {
        "name": "Guindy",
        "center_lat": 13.0067,
        "center_lon": 80.2206,
        "landmarks": ["Race Course", "Kathipara Junction", "Olympia Tech Park", "Guindy Industrial Estate", "Anna University", "TVK Estate"]
    },
    {
        "name": "Tambaram",
        "center_lat": 12.9249,
        "center_lon": 80.1000,
        "landmarks": ["East Tambaram Market", "MCC Gate", "GST Road", "Sanatorium", "West Tambaram Bus Stand", "MEPZ Zone"]
    },
    {
        "name": "Porur",
        "center_lat": 13.0382,
        "center_lon": 80.1565,
        "landmarks": ["Porur Lake", "Mount Poonamallee Rd", "SRMC Campus", "Porur Junction", "DLF IT Park", "Ramachandra Hospital"]
    }
]

WASTE_TYPES = ["Organic", "Recyclable", "Hazardous", "General"]

VEHICLES_DATA = [
    {"vehicle_number": "TN-01-GA-4521", "driver_name": "R. Murugan", "capacity_tons": 5.0, "fuel_level_pct": 88, "status": "On Route", "assigned_route_code": "R-4521-12"},
    {"vehicle_number": "TN-02-AZ-8812", "driver_name": "S. Kamesh", "capacity_tons": 6.5, "fuel_level_pct": 74, "status": "On Route", "assigned_route_code": "R-8812-10"},
    {"vehicle_number": "TN-05-BK-1934", "driver_name": "M. Selvam", "capacity_tons": 5.0, "fuel_level_pct": 92, "status": "Available", "assigned_route_code": None},
    {"vehicle_number": "TN-07-CL-6720", "driver_name": "P. Karthik", "capacity_tons": 8.0, "fuel_level_pct": 65, "status": "On Route", "assigned_route_code": "R-6720-14"},
    {"vehicle_number": "TN-09-DH-3041", "driver_name": "V. Anbarasu", "capacity_tons": 5.0, "fuel_level_pct": 45, "status": "Maintenance", "assigned_route_code": None},
    {"vehicle_number": "TN-10-EJ-9182", "driver_name": "G. Venkatesh", "capacity_tons": 6.0, "fuel_level_pct": 95, "status": "Available", "assigned_route_code": None},
    {"vehicle_number": "TN-12-FK-5509", "driver_name": "D. Elango", "capacity_tons": 5.0, "fuel_level_pct": 80, "status": "Available", "assigned_route_code": None},
    {"vehicle_number": "TN-14-GL-7733", "driver_name": "K. Saravanan", "capacity_tons": 7.5, "fuel_level_pct": 60, "status": "Full", "assigned_route_code": None},
    {"vehicle_number": "TN-22-HM-4102", "driver_name": "N. Senthil", "capacity_tons": 5.0, "fuel_level_pct": 84, "status": "Available", "assigned_route_code": None},
    {"vehicle_number": "TN-04-AB-2299", "driver_name": "A. Rajan", "capacity_tons": 6.0, "fuel_level_pct": 90, "status": "Available", "assigned_route_code": None}
]

CITIZEN_REPORTS_DATA = [
    {
        "report_code": "REP-2026-101",
        "reporter_name": "S. Ramanathan",
        "location_area": "Anna Nagar",
        "problem_type": "Overflowing bin",
        "description": "Bin TN-AN-104 near Tower Park is completely overflowing onto the footpath.",
        "priority": "CRITICAL",
        "status": "In Progress",
        "assigned_team": "Zone 8 Rapid Response"
    },
    {
        "report_code": "REP-2026-102",
        "reporter_name": "P. Priya",
        "location_area": "T. Nagar",
        "problem_type": "Illegal dumping",
        "description": "Commercial debris dumped near Pondy Bazaar bin zone.",
        "priority": "HIGH",
        "status": "Assigned",
        "assigned_team": "Zone 10 Enforcement Team"
    },
    {
        "report_code": "REP-2026-103",
        "reporter_name": "K. Balaji",
        "location_area": "Velachery",
        "problem_type": "Damaged bin",
        "description": "Lid broken on bin TN-VL-302 near 100 Feet Bypass Road.",
        "priority": "MEDIUM",
        "status": "Pending",
        "assigned_team": "Maintenance Crew A"
    },
    {
        "report_code": "REP-2026-104",
        "reporter_name": "Dr. Anita Suresh",
        "location_area": "Adyar",
        "problem_type": "Missed collection",
        "description": "Bin TN-AD-401 near LB Road was not collected during morning round.",
        "priority": "HIGH",
        "status": "Resolved",
        "assigned_team": "Zone 13 Sanitation Team"
    },
    {
        "report_code": "REP-2026-105",
        "reporter_name": "M. Dinesh",
        "location_area": "Guindy",
        "problem_type": "Overflowing bin",
        "description": "Industrial park bin TN-GD-503 reaching 98% capacity.",
        "priority": "CRITICAL",
        "status": "In Progress",
        "assigned_team": "Zone 9 Rapid Response"
    }
]

def seed_database():
    print("Re-creating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # 1. Create Default Users
        admin_user = User(
            email="admin@ecoroute.ai",
            password_hash="admin123",
            full_name="Dr. K. Vijay (Greater Chennai Corp)",
            role="Municipal Admin",
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
        )
        driver_user = User(
            email="driver@ecoroute.ai",
            password_hash="driver123",
            full_name="R. Murugan (Senior Driver)",
            role="Collection Driver",
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
        )
        db.add_all([admin_user, driver_user])
        db.commit()

        # 2. Seed 56 Bins across 7 Chennai Areas
        created_bins = []
        bin_counter = 101

        for area in AREAS:
            area_code = area["name"][:2].upper()
            for idx, landmark in enumerate(area["landmarks"]):
                lat = area["center_lat"] + random.uniform(-0.012, 0.012)
                lon = area["center_lon"] + random.uniform(-0.012, 0.012)
                
                # Distribution of fill levels: some critical, some high, many normal
                if idx == 0:
                    fill = random.randint(92, 98)
                    status = "Overflow Risk"
                    priority = "CRITICAL"
                elif idx == 1 or idx == 2:
                    fill = random.randint(76, 89)
                    status = "Nearly Full"
                    priority = "HIGH"
                elif idx == 3:
                    fill = random.randint(55, 74)
                    status = "Normal"
                    priority = "MEDIUM"
                else:
                    fill = random.randint(15, 54)
                    status = "Normal"
                    priority = "LOW"
                
                bin_obj = Bin(
                    bin_code=f"TN-{area_code}-{bin_counter}",
                    location_name=f"{landmark}, {area['name']}",
                    area=area["name"],
                    latitude=round(lat, 6),
                    longitude=round(lon, 6),
                    fill_level=fill,
                    max_capacity_liters=random.choice([1100, 1500, 2400]),
                    waste_type=WASTE_TYPES[idx % len(WASTE_TYPES)],
                    status=status,
                    priority=priority,
                    last_collected_at=datetime.utcnow() - timedelta(hours=random.randint(2, 28))
                )
                db.add(bin_obj)
                created_bins.append(bin_obj)
                bin_counter += 1

        db.commit()

        # Refresh created bins to get IDs
        for b in created_bins:
            db.refresh(b)

        # 3. Create 120+ Historical Bin Readings & AI Predictions
        for b in created_bins:
            # Historical readings
            for h in range(4, 0, -1):
                past_fill = max(0, b.fill_level - h * random.randint(12, 20))
                reading = BinReading(
                    bin_id=b.id,
                    fill_level=past_fill,
                    temperature_c=round(random.uniform(28.5, 34.0), 1),
                    battery_level=random.randint(85, 99),
                    recorded_at=datetime.utcnow() - timedelta(hours=h * 6)
                )
                db.add(reading)

            # AI Prediction calculation
            pred_data = FillPredictor.predict_bin_fill(b)
            pred = Prediction(
                bin_id=b.id,
                current_fill=pred_data["current_fill"],
                average_daily_rate=pred_data["average_daily_rate"],
                predicted_full_time=pred_data["predicted_full_time"],
                predicted_full_timestamp=datetime.utcnow() + timedelta(hours=random.randint(1, 18)),
                confidence_score=pred_data["confidence_score"],
                priority_level=pred_data["priority_level"]
            )
            db.add(pred)

        db.commit()

        # 4. Create Vehicles
        vehicle_objs = []
        for v in VEHICLES_DATA:
            v_obj = Vehicle(**v)
            db.add(v_obj)
            vehicle_objs.append(v_obj)
        db.commit()

        # 5. Create Initial Optimized Routes
        critical_and_high_bins = [
            {
                "id": b.id,
                "bin_code": b.bin_code,
                "location_name": b.location_name,
                "fill_level": b.fill_level,
                "latitude": b.latitude,
                "longitude": b.longitude
            }
            for b in created_bins if b.fill_level >= 75
        ]

        # Generate primary route for Vehicle 1
        v1 = vehicle_objs[0]
        route_result = RouteOptimizer.optimize_route(
            vehicle_id=v1.vehicle_number,
            driver_name=v1.driver_name,
            bins_list=critical_and_high_bins[:12]
        )

        route_db = Route(
            route_code=route_result["route_code"],
            vehicle_id=route_result["vehicle_id"],
            driver_name=route_result["driver_name"],
            status="In Progress",
            total_distance_km=route_result["total_distance_km"],
            distance_before_opt_km=route_result["distance_before_opt_km"],
            estimated_time_mins=int(route_result["estimated_time_mins"].split()[0]),
            fuel_saved_liters=route_result["fuel_saved_liters"],
            total_bins_count=route_result["total_bins_count"]
        )
        db.add(route_db)
        db.commit()

        for stop in route_result["stops"]:
            stop_db = RouteStop(
                route_id=route_db.id,
                stop_order=stop["stop_order"],
                bin_id=stop["bin_id"],
                bin_code=stop["bin_code"],
                location_name=stop["location_name"],
                fill_level=stop["fill_level"],
                latitude=stop["latitude"],
                longitude=stop["longitude"],
                estimated_arrival=stop["estimated_arrival"]
            )
            db.add(stop_db)

        # 6. Seed Citizen Reports
        for rep in CITIZEN_REPORTS_DATA:
            rep_obj = CitizenReport(**rep)
            db.add(rep_obj)

        # 7. Seed Notifications
        notifications = [
            Notification(
                type="critical",
                title="Critical Bin Overflow Warning",
                message="Bin TN-AN-101 (Tower Park, Anna Nagar) is predicted to overflow within 1.5 hours.",
                priority="CRITICAL",
                action_url="/predictions"
            ),
            Notification(
                type="warning",
                title="Heavy Waste Volume in T. Nagar",
                message="Pondy Bazaar and Usman Road bins experiencing 35% higher fill rate than weekday average.",
                priority="HIGH",
                action_url="/monitoring"
            ),
            Notification(
                type="success",
                title="Route Optimization Complete",
                message="Route R-4521-12 generated. Reduced travel distance by 11.2 km (3.2 liters fuel saved).",
                priority="MEDIUM",
                action_url="/routes"
            ),
            Notification(
                type="info",
                title="New Citizen Report Submitted",
                message="Report REP-2026-101 received for Anna Nagar. Assigned to Zone 8 Rapid Response.",
                priority="MEDIUM",
                action_url="/reports"
            )
        ]
        for n in notifications:
            db.add(n)

        db.commit()
        print("Database seeded successfully with realistic Tamil Nadu demo data!")

    except Exception as e:
        print("Error seeding database:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
