# EcoRoute AI – Smart Waste Collection System

> **Subtitle**: Smart Waste Collection & Route Optimization Platform for Municipalities

EcoRoute AI is an intelligent municipal waste-management web application designed to help city administrators monitor garbage bins in real-time, predict bin overflow times using AI forecasting models, classify waste materials from photos with computer vision, and compute optimal collection routes for garbage vehicles to minimize fuel consumption and carbon emissions.

Designed specifically for municipal waste management operations in **Tamil Nadu (Greater Chennai Corporation)**.

---

## 🌟 Key Features

1. **Live Bin Monitoring & OpenStreetMap Interface**:
   - Dual **Map View** (Leaflet + OpenStreetMap) and **Searchable Data Table View**.
   - Color-coded bin status markers:
     - 🟢 **Green**: Normal (<65% capacity)
     - 🟡 **Yellow**: Nearly Full (65%–84% capacity)
     - 🟠 **Orange**: High Priority (85%–94% capacity)
     - 🔴 **Red**: Overflow Risk (≥95% capacity)
     - 🔵 **Blue**: Recently Collected
   - Interactive popups with live fill level, area landmark, waste type, predicted full time, and direct collection action button.

2. **AI Bin-Fill Time Series Forecasting**:
   - Predicts exact overflow time based on historical telemetry, area diurnal fill rate profiles, and waste material types.
   - Recharts visual fill growth curves, average hourly rate, and confidence score gauges (e.g. 94% confidence).

3. **Computer Vision Waste Classification**:
   - Upload garbage bin photos or select preset samples (`Overflowing Bin`, `Plastic Heap`, `Normal Bin`).
   - Analyzes detected material categories (Plastic %, Paper %, Organic %, Metal/Glass %), calculates overflow condition, and assigns priority.
   - Endpoint: `POST /api/analyze-waste`.

4. **Vehicle Route Optimization Engine**:
   - Solves Capacity-Constrained Vehicle Routing Problems (CVRP) using Nearest-Neighbor priority weighting.
   - Displays depot location (Guindy Central Depot), collection trucks, and animated route polylines.
   - Route comparison metrics:
     - **Before Optimization**: e.g., 32.8 km
     - **After Optimization**: e.g., 21.4 km
     - **Distance Saved**: 11.4 km
     - **Fuel Saved**: 3.3 Liters (8.8 kg CO2 reduced)

5. **Fleet Management**:
   - Garbage truck management with Tamil Nadu registration numbers (e.g., `TN-01-GA-4521`).
   - Tracks driver assignment, load capacity gauge (kg/tons), fuel level %, and status (`Available`, `On Route`, `Full`, `Maintenance`).

6. **Citizen Reports Portal**:
   - Public complaint submission form for citizens (Overflowing bin, Damaged bin, Illegal dumping, Missed collection).
   - Administrative resolution pipeline (`Pending` → `Assigned` → `In Progress` → `Resolved`).

7. **Analytics & Sustainability Impact**:
   - Interactive Recharts charts: Waste collected per day, waste generation by area, waste by material type, fuel consumption.
   - Dynamic automated AI performance insights.

8. **Dual User Persona System**:
   - Quick-switch between **Municipal Admin** and **Collection Driver** views.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Municipal Admin** | `admin@ecoroute.ai` | `admin123` | Full network statistics, AI prediction engine, route planner, fleet management, citizen reports, analytics |
| **Collection Driver** | `driver@ecoroute.ai` | `driver123` | Assigned driver route, collection waypoints, mark collected, report bin issue, vehicle load status |

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Maps**: Leaflet & OpenStreetMap (Free, no paid API key required)
- **Charts**: Recharts
- **Build Tool**: Vite

### Backend
- **Framework**: Python 3.14 + FastAPI
- **Database**: SQLite (SQLAlchemy ORM + Pydantic schema validation; PostgreSQL migration ready)
- **AI Algorithms**:
  - `fill_predictor.py`: Time-series fill forecasting model
  - `vision_analyzer.py`: Computer Vision image classification heuristic pipeline
  - `route_optimizer.py`: CVRP distance & fuel optimization model

---

## 📁 Project Architecture

```text
EcoRouteAI/
├── frontend/
│   ├── src/
│   │   ├── components/       # Logo, Sidebar, Header, KPICard, MapView, AIRecommendationBanner
│   │   ├── pages/            # Dashboard, Monitoring, Predictions, WasteDetection, RoutePlanner, Vehicles, CitizenReports, Analytics, Settings
│   │   ├── layouts/          # Responsive DashboardLayout with mobile drawer
│   │   ├── services/         # API client with fallback to local seed data
│   │   ├── context/          # AuthContext & NotificationContext
│   │   ├── data/             # Rich Tamil Nadu seed dataset (56 bins, 10 vehicles)
│   │   ├── types/            # TypeScript domain interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── api/              # FastAPI router endpoints (bins, predictions, routes, waste_detection, vehicles, reports, analytics, notifications, auth)
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── ai/               # Fill predictor, CV analyzer, Route optimizer
│   │   ├── database/         # SQLite DB connection setup
│   │   └── main.py           # FastAPI entrypoint
│   ├── requirements.txt
│   └── seed_data.py          # SQLite database seeder
├── README.md
├── .gitignore
└── docker-compose.yml
```

---

## 🚀 Installation & Running Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed SQLite database with Tamil Nadu demo data
python seed_data.py

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
Backend API will be live at: `http://127.0.0.1:8000`  
API Interactive Documentation: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend Web App will be live at: `http://localhost:3000`

---

## 📡 Key API Endpoints

- `GET /api/health` - API server health status
- `GET /api/bins` - Retrieve all bins (with area/status filtering)
- `PUT /api/bins/{id}` - Update bin fill level or mark collected
- `GET /api/predictions` - AI predicted overflow times & confidence metrics
- `POST /api/analyze-waste` - Upload image for Computer Vision classification
- `POST /api/routes/optimize` - Calculate CVRP optimized route & fuel savings
- `GET /api/vehicles` - List vehicle fleet status & driver assignments
- `GET /api/reports` - Citizen complaint tracking pipeline
- `GET /api/analytics` - Aggregate performance analytics & AI recommendations

---

## 🔮 Future Improvements

1. **IoT Sensor Hardware Integration**: Direct MQTT telemetry integration for ultrasonic bin sensors.
2. **PostgreSQL + PostGIS**: Migration to Spatial PostgreSQL database for real-time GIS routing layers.
3. **PyTorch YOLOv8 Vision Model**: Fine-tuning YOLOv8 on custom Indian municipal waste dataset.
4. **Mobile Native App**: React Native mobile app for collection vehicle drivers with offline GPS navigation.
