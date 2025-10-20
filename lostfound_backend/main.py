"""
Lost & Found Platform - FastAPI Backend
Main application file with all routes (simplified for demo)
"""

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from database import (
    get_db, User, Item, UserCreate, UserResponse,
    ItemCreate, ItemUpdate, ItemResponse, ItemListResponse, init_db,
    convert_uuid_to_str
)
from typing import Optional, List
from datetime import datetime
import os
import uuid as uuid_pkg
import shutil
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 5242880))  # 5MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

# Create uploads directory if not exists
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ============================================
# Helper Functions
# ============================================

def item_to_response(item: Item) -> ItemResponse:
    """Convert Item ORM object to ItemResponse with UUID converted to string"""
    return ItemResponse(
        id=str(item.id),
        title=item.title,
        description=item.description,
        category=item.category,
        status=item.status,
        location=item.location,
        date=item.date,
        image_url=item.image_url,
        contact_info=item.contact_info,
        reporter_id=str(item.reporter_id),
        is_flagged=item.is_flagged,
        ai_category_prediction=item.ai_category_prediction,
        ai_moderation_score=item.ai_moderation_score,
        embedding=item.embedding,
        created_at=item.created_at,
        updated_at=item.updated_at
    )


# ============================================
# FastAPI Application
# ============================================

# Initialize FastAPI app
app = FastAPI(
    title=os.getenv("APP_NAME", "Lost & Found API"),
    version=os.getenv("APP_VERSION", "1.0.0"),
    description="REST API for Lost & Found Platform",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ============================================
# Startup Event
# ============================================

@app.on_event("startup")
def startup_event():
    """Initialize database on startup"""
    init_db()
    print(" FastAPI server started")


# ============================================
# Health Check
# ============================================

@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "Lost & Found API is running"}


# ============================================
# User Endpoints (No Auth)
# ============================================

@app.get("/users", response_model=List[UserResponse], tags=["Users"])
def get_users(db: Session = Depends(get_db)):
    """Get all users"""
    users = db.query(User).all()
    # Manually create response dictionaries with UUID converted to string
    return [
        UserResponse(
            id=str(user.id),
            email=user.email,
            name=user.name,
            role=user.role,
            created_at=user.created_at
        )
        for user in users
    ]


@app.get("/users/{user_id}", response_model=UserResponse, tags=["Users"])
def get_user(user_id: str, db: Session = Depends(get_db)):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        role=user.role,
        created_at=user.created_at
    )


@app.post("/users", response_model=UserResponse, status_code=201, tags=["Users"])
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create new user"""
    # Check if email exists
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return UserResponse(
        id=str(new_user.id),
        email=new_user.email,
        name=new_user.name,
        role=new_user.role,
        created_at=new_user.created_at
    )


# ============================================
# Item Endpoints (CRUD)
# ============================================

@app.get("/items", response_model=ItemListResponse, tags=["Items"])
def get_items(
    query: Optional[str] = Query(None, description="Search query (title, description, location)"),
    status: Optional[str] = Query(None, description="Filter by status: LOST, FOUND, REUNITED"),
    category: Optional[str] = Query(None, description="Filter by category"),
    is_flagged: Optional[bool] = Query(None, description="Filter flagged items"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """Get items with filtering, search, and pagination"""
    # Base query
    items_query = db.query(Item)
    
    # Apply filters
    if query:
        search_filter = or_(
            Item.title.ilike(f"%{query}%"),
            Item.description.ilike(f"%{query}%"),
            Item.location.ilike(f"%{query}%")
        )
        items_query = items_query.filter(search_filter)
    
    if status:
        items_query = items_query.filter(Item.status == status.upper())
    
    if category:
        items_query = items_query.filter(Item.category == category)
    
    if is_flagged is not None:
        items_query = items_query.filter(Item.is_flagged == is_flagged)
    
    # Get total count
    total = items_query.count()
    
    # Pagination
    offset = (page - 1) * page_size
    items = items_query.order_by(Item.created_at.desc()).offset(offset).limit(page_size).all()
    
    # Convert to response objects
    items_response = [item_to_response(item) for item in items]
    
    return ItemListResponse(
        items=items_response,
        total=total,
        page=page,
        page_size=page_size
    )


@app.get("/items/{item_id}", response_model=ItemResponse, tags=["Items"])
def get_item(item_id: str, db: Session = Depends(get_db)):
    """Get single item by ID"""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item_to_response(item)


@app.post("/items", response_model=ItemResponse, status_code=201, tags=["Items"])
def create_item(item_data: ItemCreate, db: Session = Depends(get_db)):
    """Create new item"""
    # Verify reporter exists
    reporter = db.query(User).filter(User.id == item_data.reporter_id).first()
    if not reporter:
        raise HTTPException(status_code=404, detail="Reporter user not found")
    
    new_item = Item(
        title=item_data.title,
        description=item_data.description,
        category=item_data.category,
        status=item_data.status.upper(),
        location=item_data.location,
        date=item_data.date,
        image_url=item_data.image_url,
        contact_info=item_data.contact_info,
        reporter_id=item_data.reporter_id
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return item_to_response(new_item)


@app.patch("/items/{item_id}", response_model=ItemResponse, tags=["Items"])
def update_item(
    item_id: str,
    item_data: ItemUpdate,
    db: Session = Depends(get_db)
):
    """Update item (partial update)"""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Update only provided fields
    for field, value in item_data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    
    db.commit()
    db.refresh(item)
    return item_to_response(item)


@app.delete("/items/{item_id}", status_code=204, tags=["Items"])
def delete_item(item_id: str, db: Session = Depends(get_db)):
    """Delete item"""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    return None


# ============================================
# Admin Endpoints (Simple Flag Operations)
# ============================================

@app.patch("/admin/items/{item_id}/approve", response_model=ItemResponse, tags=["Admin"])
def approve_item(item_id: str, db: Session = Depends(get_db)):
    """Approve (unflag) an item"""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    item.is_flagged = False
    db.commit()
    db.refresh(item)
    return item_to_response(item)


@app.delete("/admin/items/{item_id}", status_code=204, tags=["Admin"])
def reject_item(item_id: str, db: Session = Depends(get_db)):
    """Reject (delete) a flagged item"""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    return None


# ============================================
# Image Upload Endpoint
# ============================================

@app.post("/items/upload", tags=["Items"])
async def upload_image(file: UploadFile = File(...)):
    """Upload image file for item"""
    # Check file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Check file size
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to start
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size: {MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid_pkg.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return URL
    file_url = f"/uploads/{unique_filename}"
    return {"url": file_url, "filename": unique_filename}


# ============================================
# Seed Data Endpoint (Optional for Demo)
# ============================================

@app.post("/seed", tags=["Development"])
def seed_database(db: Session = Depends(get_db)):
    """Populate database with demo data (USE SEED.PY INSTEAD)"""
    return {
        "message": "Please run seed.py script instead",
        "command": "python seed.py"
    }


# ============================================
# Run Server (for development)
# ============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("API_HOST", "0.0.0.0"),
        port=int(os.getenv("API_PORT", 8000)),
        reload=True
    )
