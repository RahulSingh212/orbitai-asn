# OrbitAI - Right Fit Matcher

An intelligent college matching system for MBA/MS programs that uses advanced algorithms to match student profiles with universities based on admission probability.

## 🎯 Features

### Core Functionality

- **Smart Matching Algorithm**: Analyzes GMAT scores, GPA, work experience, and acceptance rates
- **76+ Universities Database**: Comprehensive dataset of top MBA programs
- **Probability Calculation**: Calculates admission probability using statistical models
- **Real-time Results**: Instant matching with detailed insights

### User Experience

- **Clean, Modern UI**: Beautiful gradient design with Tailwind CSS
- **Form Validation**: Client-side validation with helpful error messages
- **Loading States**: Smooth loading animations and feedback
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Search & Filter**: Filter by admission tier and search by name/location
- **Multiple Sort Options**: Sort by admission chance, ranking, tuition, or acceptance rate

### Backend Features

- **RESTful API**: 7 well-documented endpoints
- **Database Integration**: SQLite with SQLAlchemy ORM
- **Search History**: Tracks all searches with results
- **Error Handling**: Comprehensive validation and error responses
- **CORS Configured**: Secure cross-origin resource sharing

## 🏗️ Architecture

### Backend Stack

- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation using Python type annotations
- **SQLite**: Lightweight database
- **Uvicorn**: ASGI server

### Frontend Stack

- **React 19**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server

## 📊 Database Schema

### Users Table

- `id`: Primary key
- `email`: Unique user email
- `name`: User full name
- `created_at`: Timestamp

### Universities Table

- `id`: Primary key
- `name`: University name
- `program_type`: MBA, MS, etc.
- `avg_gmat`: Average GMAT score
- `avg_gpa`: Average GPA
- `acceptance_rate`: Acceptance rate percentage
- `location`: City, State
- `ranking`: National ranking
- `avg_work_experience`: Average years of work experience
- `tuition_cost`: Annual tuition in USD

### Searches Table

- `id`: Primary key
- `user_id`: Foreign key to users (optional)
- `gmat_score`: User's GMAT score
- `gpa`: User's GPA
- `work_experience`: Years of experience
- `target_program`: Target program type
- `created_at`: Timestamp

### SearchResults Table

- `id`: Primary key
- `search_id`: Foreign key to searches
- `university_id`: Foreign key to universities
- `admission_chance`: Calculated probability
- `match_score`: Internal matching score

## 🚀 Getting Started

### Prerequisites

- Python 3.13+
- Node.js 18+
- npm or yarn

### Backend Setup

**Navigate to backend directory**:

```bash
cd backend
```

**Create virtual environment**:

```bash
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
# OR
venv\Scripts\activate  # On Windows
```

**Install dependencies**:

```bash
pip install -r requirements.txt
```

**Seed the database**:

```bash
python seed_data.py
```

**Start the server**:

```bash
python main.py
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Core Matching

- `POST /api/match` - Match user profile with universities

```json
  {
    "gmat_score": 720,
    "gpa": 3.8,
    "work_experience": 5.0,
    "target_program": "MBA"
  }
```

### Universities

- `GET /api/universities` - Get all universities
- `GET /api/universities/{id}` - Get specific university
- Query params: `program_type`, `limit`

### Search History

- `GET /api/searches` - Get recent searches
- `GET /api/searches/{id}` - Get specific search results
- Query param: `limit`

### User Management

- `POST /api/users` - Create new user
- `GET /api/users/{id}` - Get user details

### Health Check

- `GET /` - API information
- `GET /health` - Health status with database connection

## 🧮 Matching Algorithm

The algorithm calculates admission probability using:

1. **GMAT Match (40% weight)**: Compares user GMAT vs university average
2. **GPA Match (30% weight)**: Compares user GPA vs university average
3. **Work Experience Match (15% weight)**: Compares years of experience
4. **Acceptance Rate (15% weight)**: Factors in base acceptance rate

### Calculation Method

- Uses normal distribution for score matching
- Z-score calculation for statistical comparison
- Weighted composite scoring
- Probabilistic outcome estimation (5-95% range)

### Result Tiers

- **Safety Schools**: ≥60% admission chance
- **Target Schools**: 35-60% admission chance
- **Reach Schools**: <35% admission chance

## 🎨 UI Components

### ProfileForm Component

- Input validation with real-time feedback
- GMAT score (200-800 range)
- GPA (0.0-4.0 scale)
- Work experience (0-30 years)
- Program type selector
- Profile strength indicator
- Loading states

### ResultsDisplay Component

- University cards with detailed stats
- Search functionality
- Sort options (admission, ranking, tuition, acceptance)
- Filter by tier (all, safety, target, reach)
- Responsive grid layout
- Quick statistics overview

## 🧪 Testing the API

### Using cURL

```bash
# Test matching endpoint
curl -X POST http://localhost:8000/api/match \
  -H "Content-Type: application/json" \
  -d '{
    "gmat_score": 720,
    "gpa": 3.8,
    "work_experience": 5.0,
    "target_program": "MBA"
  }'

# Get all universities
curl http://localhost:8000/api/universities

# Get search history
curl http://localhost:8000/api/searches
```

### Interactive Documentation

Visit `http://localhost:8000/docs` for Swagger UI

## 📈 Key Metrics

- **76 Universities**: Comprehensive database coverage
- **7 API Endpoints**: Full CRUD operations
- **3 Sort Options**: Multiple ranking criteria
- **4 Filter Options**: Granular result filtering
- **Real-time Validation**: Instant form feedback
- **Mobile Responsive**: Works on all screen sizes

## 🛠️ Development

### Project Structure

``` directory
orbitai/
├── backend/
│   ├── main.py           # FastAPI application
│   ├── database.py       # Database models
│   ├── models.py         # Pydantic models
│   ├── matcher.py        # Matching algorithm
│   ├── seed_data.py      # Database seeding
│   ├── requirements.txt  # Python dependencies
│   └── orbitai.db        # SQLite database
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProfileForm.tsx
    │   │   └── ResultsDisplay.tsx
    │   ├── types.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    └── vite.config.ts
```

### Adding New Universities

Edit `backend/seed_data.py` and add to `universities_data`:

```python
{
    "name": "University Name",
    "avg_gmat": 700,
    "avg_gpa": 3.5,
    "acceptance_rate": 30.0,
    "ranking": 25,
    "location": "City, State",
    "tuition_cost": 50000,
    "avg_work_experience": 5.0
}
```

Then re-run: `python seed_data.py`

### Customizing the Algorithm

Edit `backend/matcher.py` to adjust:

- Weight factors for different criteria
- Probability calculation method
- Score normalization
- Tier boundaries

## 🔒 Security Features

- Input validation on both frontend and backend
- SQL injection prevention via SQLAlchemy ORM
- CORS configuration for secure API access
- Type safety with TypeScript and Pydantic
- Error handling without exposing sensitive data

## 🚀 Deployment

### Backend Deployment

1. Use environment variables for configuration
2. Switch to PostgreSQL for production
3. Set up proper CORS origins
4. Enable HTTPS
5. Configure proper logging

### Frontend Deployment

1. Build for production: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update API endpoint in production config
4. Enable CDN for static assets

## 📝 Assignment Requirements

✅ **Core Functionality**: Matching algorithm implemented  
✅ **Database**: 76+ universities with proper schema  
✅ **API Endpoints**: 7 endpoints with full CRUD  
✅ **Frontend**: Clean, intuitive interface  
✅ **Validation**: Client and server-side validation  
✅ **Responsive**: Works on all devices  
✅ **Loading States**: Smooth UX with feedback  
✅ **Error Handling**: Comprehensive error management  
✅ **Sorting/Filtering**: Multiple options available  
✅ **CORS**: Properly configured  

## 🎓 Algorithm Insights

The matching algorithm is inspired by real college admissions data and uses:

- **Statistical modeling**: Normal distribution for score comparison
- **Multi-factor analysis**: Combines academic and professional factors
- **Probabilistic outcomes**: Realistic admission chances
- **Tier classification**: Helps students build balanced application lists

## 📚 References

- FastAPI Documentation:    `https://fastapi.tiangolo.com`
- SQLAlchemy Documentation: `https://www.sqlalchemy.org`
- React Documentation:      `https://react.dev`
- Tailwind CSS:             `https://tailwindcss.com`

## 👤 Author

Built by Rahul Singh for the OrbitAI Right Fit Matcher assignment.

## 📄 License

This project is created for educational and assessment purposes.
