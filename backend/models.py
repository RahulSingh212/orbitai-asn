from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime


class UserProfileRequest(BaseModel):
    gmat_score: int = Field(..., ge=0, le=800, description="GMAT score (0-800)")
    gpa: float = Field(..., ge=0.0, le=4.0, description="GPA (0.0-4.0)")
    work_experience: float = Field(
        default=0.0, ge=0, le=30, description="Years of work experience"
    )
    target_program: str = Field(
        default="MBA", description="Target program type (MBA, MS, etc.)"
    )

    @validator("gmat_score")
    def validate_gmat(cls, v):
        if v < 200 or v > 800:
            raise ValueError("GMAT score typically ranges from 200-800")
        return v

    @validator("gpa")
    def validate_gpa(cls, v):
        if v < 0.0 or v > 4.0:
            raise ValueError("GPA must be between 0.0 and 4.0")
        return v


class UserCreateRequest(BaseModel):
    email: str = Field(..., description="User email")
    name: str = Field(..., description="User name")


class ProgramStats(BaseModel):
    acceptance_rate: float
    avg_gmat: float
    avg_gpa: float
    avg_work_experience: Optional[float] = None


class UniversityMatch(BaseModel):
    university: str
    admission_chance: str
    program_stats: ProgramStats
    location: Optional[str] = None
    ranking: Optional[int] = None
    tuition_cost: Optional[float] = None

    class Config:
        from_attributes = True


class UniversityResponse(BaseModel):
    id: int
    name: str
    program_type: str
    avg_gmat: float
    avg_gpa: float
    acceptance_rate: float
    location: Optional[str]
    ranking: Optional[int]
    avg_work_experience: float
    tuition_cost: Optional[float]

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True


class SearchResponse(BaseModel):
    id: int
    gmat_score: int
    gpa: float
    work_experience: float
    target_program: str
    created_at: datetime
    results_count: int = 0

    class Config:
        from_attributes = True


class MatchResponse(BaseModel):
    matches: List[UniversityMatch]
    search_id: Optional[int] = None
    total_universities: int
