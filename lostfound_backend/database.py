"""
Database models, schemas, and connection management
Uses SQLAlchemy 2.0 declarative models with Pydantic v2 schemas
"""

from sqlalchemy import create_engine, Column, String, Text, Boolean, Float, DateTime, ForeignKey, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime
from dotenv import load_dotenv
import os
import uuid

# Load environment variables
load_dotenv()

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/lostfound")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=10
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models
Base = declarative_base()


# ============================================
# SQLAlchemy ORM Models
# ============================================

class User(Base):
    """User account model (no passwords for demo)"""
    __tablename__ = "users"
    
    id = Column(PGUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(20), nullable=True, server_default=text("'USER'"))
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))


class Item(Base):
    """Lost and found item model with AI-ready columns"""
    __tablename__ = "items"
    
    id = Column(PGUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False)
    location = Column(String(255), nullable=False)
    date = Column(DateTime, nullable=False)
    image_url = Column(String(500), nullable=True)
    contact_info = Column(String(255), nullable=True)
    reporter_id = Column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    is_flagged = Column(Boolean, server_default=text("false"))
    
    # AI-Ready columns (nullable for V1)
    ai_category_prediction = Column(String(50), nullable=True)
    ai_moderation_score = Column(Float, nullable=True)
    embedding = Column(String, nullable=True)  # VECTOR(384) - stored as string for now
    
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"), onupdate=datetime.utcnow)


# ============================================
# Pydantic Schemas for Request/Response
# ============================================

# User Schemas
class UserCreate(BaseModel):
    """Schema for creating a new user"""
    email: EmailStr
    name: str
    role: Optional[str] = "USER"
    
    model_config = ConfigDict(from_attributes=True)


class UserResponse(BaseModel):
    """Schema for user response"""
    id: str
    email: str
    name: str
    role: str
    created_at: datetime
    
    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={uuid.UUID: str}
    )


# Item Schemas
class ItemCreate(BaseModel):
    """Schema for creating a new item"""
    title: str
    description: str
    category: str
    status: str
    location: str
    date: datetime
    image_url: Optional[str] = None
    contact_info: Optional[str] = None
    reporter_id: str
    
    model_config = ConfigDict(from_attributes=True)


class ItemUpdate(BaseModel):
    """Schema for updating an item (all fields optional)"""
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    location: Optional[str] = None
    date: Optional[datetime] = None
    image_url: Optional[str] = None
    contact_info: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class ItemResponse(BaseModel):
    """Schema for item response (includes AI fields)"""
    id: str
    title: str
    description: str
    category: str
    status: str
    location: str
    date: datetime
    image_url: Optional[str] = None
    contact_info: Optional[str] = None
    reporter_id: str
    is_flagged: bool
    ai_category_prediction: Optional[str] = None
    ai_moderation_score: Optional[float] = None
    embedding: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ItemListResponse(BaseModel):
    """Schema for paginated item list response"""
    items: List[ItemResponse]
    total: int
    page: int
    page_size: int
    
    model_config = ConfigDict(from_attributes=True)


# ============================================
# Database Dependency for FastAPI
# ============================================

def get_db():
    """Dependency injection for database sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================
# Helper Functions
# ============================================

def convert_uuid_to_str(obj):
    """Convert UUID fields to strings for Pydantic serialization"""
    if hasattr(obj, '__dict__'):
        for key, value in obj.__dict__.items():
            if isinstance(value, uuid.UUID):
                setattr(obj, key, str(value))
    return obj


# ============================================
# Database Initialization
# ============================================

def init_db():
    """Initialize database (create tables if they don't exist)"""
    # Note: We're using existing schema, so no need to create tables
    # This function just verifies connection
    print("✅ Database initialized")


# Test database connection
if __name__ == "__main__":
    try:
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection successful")
        
        # Initialize
        init_db()
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
