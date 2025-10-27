from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn

from database import init_db, get_db, User, University, Search, SearchResult
from models import (
    UserProfileRequest,
    UserCreateRequest,
    UniversityMatch,
    UniversityResponse,
    UserResponse,
    SearchResponse,
    MatchResponse,
    ProgramStats,
)
from matcher import CollegeMatcher

# Initialize database
init_db()

app = FastAPI(
    title="OrbitAI - Right Fit Matcher API",
    description="AI-powered college matching for MBA/MS programs",
    version="1.0.0",
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Health Check Endpoints ====================


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to OrbitAI - Right Fit Matcher API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "match": "/api/match",
            "universities": "/api/universities",
            "health": "/health",
        },
    }


@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """Health check with database connection"""
    try:
        # Test database connection
        university_count = db.query(University).count()
        return {
            "status": "healthy",
            "database": "connected",
            "universities_count": university_count,
        }
    except Exception as e:
        return {
            "status": "degraded",
            "database": "error",
            "error": str(e),
        }


# ==================== Core Matching Endpoint ====================


@app.post("/api/match", response_model=MatchResponse)
async def match_universities(
    profile: UserProfileRequest, db: Session = Depends(get_db)
):
    """
    Match user profile with universities and return ranked results

    This is the core matching algorithm endpoint that:
    1. Takes user academic profile (GMAT, GPA, work experience)
    2. Compares against university database
    3. Calculates admission probability for each match
    4. Returns ranked list of best-fit universities
    """
    try:
        # Get all universities matching the target program
        universities = (
            db.query(University)
            .filter(University.program_type == profile.target_program)
            .all()
        )

        if not universities:
            raise HTTPException(
                status_code=404,
                detail=f"No universities found for program type: {profile.target_program}. Currently, only MBA programs are available. MS and Executive MBA programs are coming soon!",
            )

        # Run matching algorithm
        matches = CollegeMatcher.match_universities(
            user_gmat=profile.gmat_score,
            user_gpa=profile.gpa,
            user_work_exp=profile.work_experience,
            target_program=profile.target_program,
            universities=universities,
        )

        # Create search record
        search = Search(
            gmat_score=profile.gmat_score,
            gpa=profile.gpa,
            work_experience=profile.work_experience,
            target_program=profile.target_program,
        )
        db.add(search)
        db.commit()
        db.refresh(search)

        # Format response
        university_matches = []
        for university, admission_prob in matches:
            # Create search result record
            search_result = SearchResult(
                search_id=search.id,
                university_id=university.id,
                admission_chance=admission_prob,
            )
            db.add(search_result)

            # Format match response
            match = UniversityMatch(
                university=university.name,
                admission_chance=f"{admission_prob:.1f}",
                program_stats=ProgramStats(
                    acceptance_rate=university.acceptance_rate,
                    avg_gmat=university.avg_gmat,
                    avg_gpa=university.avg_gpa,
                    avg_work_experience=university.avg_work_experience,
                ),
                location=university.location,
                ranking=university.ranking,
                tuition_cost=university.tuition_cost,
            )
            university_matches.append(match)

        db.commit()

        return MatchResponse(
            matches=university_matches,
            search_id=search.id,
            total_universities=len(university_matches),
        )

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Matching error: {str(e)}",
        )


# ==================== Universities Endpoint ====================


@app.get("/api/universities", response_model=List[UniversityResponse])
async def get_universities(
    program_type: Optional[str] = Query(None, description="Filter by program type"),
    limit: Optional[int] = Query(100, le=100, description="Maximum results"),
    db: Session = Depends(get_db),
):
    """
    Get list of all universities in the database

    Optional filters:
    - program_type: Filter by program (MBA, MS, etc.)
    - limit: Maximum number of results
    """
    query = db.query(University)

    if program_type:
        query = query.filter(University.program_type == program_type)

    query = query.order_by(University.ranking.asc())
    universities = query.limit(limit).all()

    return universities


@app.get("/api/universities/{university_id}", response_model=UniversityResponse)
async def get_university(university_id: int, db: Session = Depends(get_db)):
    """Get details of a specific university"""
    university = db.query(University).filter(University.id == university_id).first()

    if not university:
        raise HTTPException(status_code=404, detail="University not found")

    return university


# ==================== Search History Endpoints ====================


@app.get("/api/searches", response_model=List[SearchResponse])
async def get_searches(
    limit: int = Query(10, le=50, description="Maximum results"),
    db: Session = Depends(get_db),
):
    """Get recent search history"""
    searches = db.query(Search).order_by(Search.created_at.desc()).limit(limit).all()

    response = []
    for search in searches:
        search_data = SearchResponse(
            id=search.id,
            gmat_score=search.gmat_score,
            gpa=search.gpa,
            work_experience=search.work_experience,
            target_program=search.target_program,
            created_at=search.created_at,
            results_count=len(search.results),
        )
        response.append(search_data)

    return response


@app.get("/api/searches/{search_id}", response_model=MatchResponse)
async def get_search_results(search_id: int, db: Session = Depends(get_db)):
    """Get results from a previous search"""
    search = db.query(Search).filter(Search.id == search_id).first()

    if not search:
        raise HTTPException(status_code=404, detail="Search not found")

    # Get all results for this search
    results = (
        db.query(SearchResult)
        .filter(SearchResult.search_id == search_id)
        .order_by(SearchResult.admission_chance.desc())
        .all()
    )

    university_matches = []
    for result in results:
        university = result.university
        match = UniversityMatch(
            university=university.name,
            admission_chance=f"{result.admission_chance:.1f}",
            program_stats=ProgramStats(
                acceptance_rate=university.acceptance_rate,
                avg_gmat=university.avg_gmat,
                avg_gpa=university.avg_gpa,
                avg_work_experience=university.avg_work_experience,
            ),
            location=university.location,
            ranking=university.ranking,
            tuition_cost=university.tuition_cost,
        )
        university_matches.append(match)

    return MatchResponse(
        matches=university_matches,
        search_id=search.id,
        total_universities=len(university_matches),
    )


# ==================== User Management Endpoints ====================


@app.post("/api/users", response_model=UserResponse)
async def create_user(user: UserCreateRequest, db: Session = Depends(get_db)):
    """Create a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400, detail="User with this email already exists"
        )

    new_user = User(email=user.email, name=user.name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.get("/api/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user details"""
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload during development
    )
