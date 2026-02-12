# Codeforces Redesign

Modern full-stack application for viewing Codeforces contest dashboards, rating visualizations, and problem browsing.

## 🎯 Project Status

### ✅ Phase 1: Backend Foundation (COMPLETE)
- FastAPI server with CORS
- User endpoints (info, rating history, dashboard, insights)
- Problem browsing endpoint with filters
- Rate limiting (5 req/sec) and caching (5 min TTL)
- Successfully tested with real Codeforces data

### ✅ Phase 2: Frontend Foundation (COMPLETE)
- React + Vite + TypeScript setup
- Tailwind CSS styling
- React Router with navigation  
- React Query for data fetching
- API service layer

### 🚧 Next: Phase 3 - Contest Dashboard
Will implement stats cards, charts, and contest history table.

## 🚀 Quick Start

### Backend (Terminal 1)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend runs at **http://localhost:8000** (API docs at /docs)

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

## 📚 API Endpoints

- `GET /api/v1/users/{handle}` - User info
- `GET /api/v1/users/{handle}/rating-history` - Rating history
- `GET /api/v1/users/{handle}/dashboard` - Dashboard data
- `GET /api/v1/users/{handle}/insights` - Performance insights
- `GET /api/v1/problems?tags=dp&min_rating=1200` - Filtered problems

## 🏗️ Tech Stack

**Backend:** Python, FastAPI, HTTPX, Pydantic, Caching  
**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Query, Recharts

See implementation plan at [.claude/plans/snoopy-painting-beaver.md](.claude/plans/snoopy-painting-beaver.md)
