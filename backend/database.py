from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./orbitai.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    searches = relationship("Search", back_populates="user")


class University(Base):
    __tablename__ = "universities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    program_type = Column(String, default="MBA")

    avg_gmat = Column(Float, nullable=False)
    avg_gpa = Column(Float, nullable=False)
    acceptance_rate = Column(Float, nullable=False)

    location = Column(String)
    ranking = Column(Integer)
    avg_work_experience = Column(Float, default=3.0)
    tuition_cost = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)

    search_results = relationship("SearchResult", back_populates="university")


class Search(Base):
    __tablename__ = "searches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    gmat_score = Column(Integer, nullable=False)
    gpa = Column(Float, nullable=False)
    work_experience = Column(Float, default=0.0)
    target_program = Column(String, default="MBA")

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="searches")
    results = relationship(
        "SearchResult", back_populates="search", cascade="all, delete-orphan"
    )


class SearchResult(Base):
    __tablename__ = "search_results"

    id = Column(Integer, primary_key=True, index=True)
    search_id = Column(Integer, ForeignKey("searches.id"), nullable=False)
    university_id = Column(Integer, ForeignKey("universities.id"), nullable=False)

    admission_chance = Column(Float, nullable=False)
    match_score = Column(Float)

    search = relationship("Search", back_populates="results")
    university = relationship("University", back_populates="search_results")


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
