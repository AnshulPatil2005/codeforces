# Codeforces Redesign - Backend API

FastAPI backend for the Codeforces Redesign project.

## Features

- User information and rating history endpoints
- Problem browsing with filtering and search
- Dashboard with performance insights
- Rate limiting (5 requests/second to Codeforces API)
- Caching (5-minute TTL for API responses)

## Setup

### 1. Create virtual environment

```bash
python -m venv venv
```

### 2. Activate virtual environment

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment (optional)

Copy `.env.example` to `.env` and modify if needed:

```bash
copy .env.example .env
```

### 5. Run the server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at: `http://localhost:8000`

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Users

- `GET /api/v1/users/{handle}` - Get user information
- `GET /api/v1/users/{handle}/rating-history` - Get rating history
- `GET /api/v1/users/{handle}/dashboard` - Get dashboard data
- `GET /api/v1/users/{handle}/insights` - Get performance insights

### Problems

- `GET /api/v1/problems` - Get problems with filtering
  - Query params: `tags`, `min_rating`, `max_rating`, `search`, `sort_by`, `limit`, `offset`

## Example Requests

```bash
# Get user info
curl http://localhost:8000/api/v1/users/tourist

# Get rating history
curl http://localhost:8000/api/v1/users/tourist/rating-history

# Get dashboard
curl http://localhost:8000/api/v1/users/tourist/dashboard

# Search problems
curl "http://localhost:8000/api/v1/problems?tags=dp,greedy&min_rating=1200&max_rating=1600&limit=10"
```
