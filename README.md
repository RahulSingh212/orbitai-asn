# OrbitAI - Right Fit Matcher for MBA Programs

A full-stack web application that helps students find their perfect university match using advanced statistical algorithms and data from 76 top MBA programs.

## 🎯 Overview

OrbitAI analyzes your academic profile (GMAT, GPA, work experience) and matches you with universities where you have the highest chances of admission. The system categorizes matches into Safety, Target, and Reach schools to help you build a balanced application strategy.

## ✨ Features

### Core Features

- **Statistical Matching Algorithm**: Custom algorithm using z-scores and weighted factors
- **76 MBA Programs**: Comprehensive database with real program statistics
- **Smart Categorization**: Schools grouped into Safety (60%+), Target (35-60%), and Reach (<35%)
- **Form Validation**: Client and server-side validation with helpful error messages
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

### Advanced Features

- **📊 Analytics Dashboard**: 4 interactive charts (Pie, Bar, Scatter) with insights
- **🔍 Advanced Search & Filter**: Real-time search by name/location + multi-tier filtering
- **📥 Export Functionality**: Download results as PDF, CSV, or print-friendly format
- **🌙 Dark Mode**: Full dark mode support with localStorage persistence
- **📈 Live Statistics**: Real-time counts and breakdowns of match results

## 🏗️ Technology Stack

### Backend

- **FastAPI** (v0.115.0) - Modern, fast API framework
- **SQLAlchemy** (v2.0.36) - SQL toolkit and ORM
- **Pydantic** (v2.9.2) - Data validation
- **SQLite** - Lightweight database for development
- **Python 3.13+**

### Frontend

- **React** (v19.1.1) with TypeScript
- **Tailwind CSS** (v4.1.16) - Utility-first CSS
- **Recharts** - Interactive data visualization
- **jsPDF** - PDF generation
- **PapaParse** - CSV export
- **Vite** (v7.1.7) - Build tool

### Architecture

- **Atomic Design Pattern**: Components organized into Atoms, Molecules, and Organisms
- **RESTful API**: Clean, well-documented endpoints
- **Type Safety**: Full TypeScript coverage on frontend

## 🚀 Quick Start

### Prerequisites

- Python 3.13+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database and seed data
python seed_data.py

# Run the server
python main.py
```

Backend runs at: `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs at: `http://localhost:5174`

## 📊 Matching Algorithm

The core matching algorithm uses statistical analysis to calculate admission probability:

### Factors & Weights

- **GMAT Score** (40%): Z-score analysis against program average
- **GPA** (30%): Normalized GPA comparison
- **Work Experience** (15%): Years of professional experience
- **Acceptance Rate** (15%): Program selectivity factor

### Formula

``` Calculation
Admission Probability = (
    GMAT_WEIGHT × GMAT_Match +
    GPA_WEIGHT × GPA_Match +
    WORK_EXP_WEIGHT × Experience_Match +
    ACCEPTANCE_RATE_WEIGHT × Acceptance_Factor
) × 100
```

- **Minimum**: 5% (always a chance)
- **Maximum**: 95% or (Acceptance Rate + 10%), whichever is lower

## 🗂️ Project Structure

``` directory
orbitai/
├── backend/
│   ├── main.py              # FastAPI application & endpoints
│   ├── database.py          # SQLAlchemy models
│   ├── models.py            # Pydantic schemas
│   ├── matcher.py           # Matching algorithm
│   ├── seed_data.py         # Database seeding script
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── atoms/       # Basic UI components (Button, Input, etc.)
│   │   │   ├── molecules/   # Composite components (SearchBar, Cards, etc.)
│   │   │   └── organisms/   # Complex components (ProfileForm, Analytics, etc.)
│   │   ├── contexts/        # React contexts (ThemeContext)
│   │   ├── utils/           # Utility functions (export, etc.)
│   │   ├── types.ts         # TypeScript interfaces
│   │   ├── App.tsx          # Main application component
│   │   └── main.tsx         # Application entry point
│   ├── package.json         # Node dependencies
│   └── vite.config.ts       # Vite configuration
│
└── README.md                # This file
```

## 🎨 Component Architecture

### Atomic Design Pattern

**Atoms** (9 components)

- Button, Input, Label, Badge, Card, Select, ErrorMessage, Spinner, ThemeToggle

**Molecules** (7 components)

- FormField, SelectField, StatCard, SearchBar, UniversityCard, FilterButton, ExportButtons

**Organisms** (3 components)

- ProfileForm, ResultsDisplay, AnalyticsCharts

## 📡 API Endpoints

### POST `/api/match`

Match user profile with universities

```json
{
  "gmat_score": 720,
  "gpa": 3.8,
  "work_experience": 5,
  "target_program": "MBA"
}
```

### GET `/api/universities`

List all universities with optional filtering

### GET `/api/universities/{id}`

Get specific university details

### GET `/api/searches`

List all search history

### POST `/api/users`

Create new user

## 🎯 Key Features Implemented

| Feature                    | Status | Description |
|----------------------------|--------|----------------------------------------|
| Core Matching Algorithm    | ✅     | Statistical z-score based matching      |
| Database (76 universities) | ✅     | Seeded with real program data           |
| Form Validation            | ✅     | Client & server-side validation         |
| Responsive Design          | ✅     | Mobile-first approach                   |
| Advanced Search & Filter   | ✅     | Real-time search + multi-tier filtering |
| Data Visualization         | ✅     | 4 interactive charts with insights      |
| Dark Mode                  | ✅     | Full theme support with persistence     |
| Export (PDF/CSV/Print)     | ✅     | Multiple export formats                 |
| User Authentication        | 🟡     | Partial (DB schema + endpoints)         |
| PWA Features               | ❌     | Not implemented                         |
|----------------------------|--------|-----------------------------------------|

## 🧪 Testing

### Backend Directory

```bash
cd backend
python main.py

# Test API
curl http://localhost:8000/health
```

### Frontend Directory

```bash
cd frontend
npm run dev

# Open browser
open http://localhost:5174
```

### Try It Out

1. Fill the form with test data:
   - GMAT: 720
   - GPA: 3.8
   - Work Experience: 5 years
   - Program: MBA
2. Click "Find My Matches"
3. Explore results, analytics, and export options

## 📝 Database Schema

### Users

- id, email, name, created_at

### Universities

- id, name, program_type, avg_gmat, avg_gpa, acceptance_rate, location, ranking, avg_work_experience, tuition_cost

### Searches

- id, user_id, gmat_score, gpa, work_experience, target_program, created_at

### SearchResults

- id, search_id, university_id, admission_chance, match_score

## 🔒 Environment Variables

Create a `.env` file in the backend directory (optional):

``` url
DATABASE_URL=sqlite:///./orbitai.db
```

## 🚀 Production Deployment

### Backend Points

- Use PostgreSQL instead of SQLite
- Set up environment variables
- Use a production ASGI server (e.g., Gunicorn with Uvicorn workers)
- Add authentication middleware
- Enable HTTPS

### Frontend Points

```bash
npm run build
```

- Serve the `dist/` folder with a static file server (Nginx, Vercel, Netlify)
- Update API_URL to production backend

## 📊 Performance

- **Load Time**: < 2s for initial page load
- **Match Algorithm**: < 500ms for 76 universities
- **Search/Filter**: Instant (client-side with useMemo)
- **Export**: PDF generation < 1s

## 🎓 Credits

**Developer**: Rahul Singh  
**Assignment**: OrbitAI Right Fit Matcher (FindMyOrbit)  
**Date**: October 2025

## 📄 License

This project is for educational/assessment purposes.

---
