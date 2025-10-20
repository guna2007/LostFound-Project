"""
Seed script to populate database with demo data
Run: python seed.py
"""

from sqlalchemy.orm import Session
from database import SessionLocal, User, Item
from datetime import datetime, timedelta
import random

def clear_data(db: Session):
    """Clear existing data"""
    db.query(Item).delete()
    db.query(User).delete()
    db.commit()
    print("  Cleared existing data")

def create_users(db: Session):
    """Create demo users"""
    users = [
        User(email="user@lostfound.com", name="Demo User", role="USER"),
        User(email="admin@lostfound.com", name="Admin User", role="ADMIN"),
        User(email="john@example.com", name="John Doe", role="USER"),
        User(email="jane@example.com", name="Jane Smith", role="USER"),
    ]
    
    db.add_all(users)
    db.commit()
    
    for user in users:
        db.refresh(user)
    
    print(f" Created {len(users)} users")
    return users

def create_items(db: Session, users):
    """Create demo items"""
    demo_user = users[0]  # user@lostfound.com
    
    categories = ["Electronics", "Clothing", "Accessories", "Documents", "Keys", "Bags", "Books", "Other"]
    
    lost_items = [
        {"title": "iPhone 13 Pro", "description": "Black iPhone 13 Pro, cracked screen protector", "category": "Electronics", "location": "Library 2nd Floor"},
        {"title": "Blue Denim Jacket", "description": "Medium size blue denim jacket with brown buttons", "category": "Clothing", "location": "Student Center"},
        {"title": "Silver MacBook Air", "description": "2020 MacBook Air with stickers on lid", "category": "Electronics", "location": "Computer Lab B"},
        {"title": "Black Leather Wallet", "description": "Contains student ID and credit cards", "category": "Accessories", "location": "Main Cafeteria"},
        {"title": "Car Keys with BMW Fob", "description": "BMW key fob with university keychain", "category": "Keys", "location": "Parking Lot C"},
        {"title": "Red Backpack", "description": "North Face red backpack with laptop inside", "category": "Bags", "location": "Engineering Building"},
        {"title": "Calculus Textbook", "description": "Stewart Calculus 8th edition with notes", "category": "Books", "location": "Math Department"},
        {"title": "AirPods Pro", "description": "White AirPods Pro in charging case", "category": "Electronics", "location": "Gym Locker Room"},
        {"title": "Gold Watch", "description": "Mens gold watch, Seiko brand", "category": "Accessories", "location": "Sports Complex"},
        {"title": "Student ID Card", "description": "ID card for Sarah Johnson", "category": "Documents", "location": "Administration Office"},
    ]
    
    found_items = [
        {"title": "Samsung Galaxy Phone", "description": "Found Samsung phone, locked screen", "category": "Electronics", "location": "Building A Entrance"},
        {"title": "Green Umbrella", "description": "Large green umbrella, slightly worn", "category": "Other", "location": "Library Entrance"},
        {"title": "Prescription Glasses", "description": "Black frame reading glasses in case", "category": "Accessories", "location": "Classroom 301"},
        {"title": "USB Flash Drive", "description": "32GB SanDisk flash drive, blue color", "category": "Electronics", "location": "Computer Lab A"},
        {"title": "House Keys", "description": "Set of 3 keys on Hello Kitty keychain", "category": "Keys", "location": "Parking Lot B"},
        {"title": "Textbook - Biology", "description": "Campbell Biology 11th edition", "category": "Books", "location": "Science Building"},
        {"title": "Wireless Mouse", "description": "Logitech wireless mouse, black", "category": "Electronics", "location": "Library Study Room"},
        {"title": "Scarf", "description": "Red and white striped winter scarf", "category": "Clothing", "location": "Main Hall"},
        {"title": "Water Bottle", "description": "Stainless steel Hydro Flask, purple", "category": "Other", "location": "Gymnasium"},
        {"title": "Notebook", "description": "Spiral notebook with chemistry notes", "category": "Books", "location": "Chemistry Lab"},
    ]
    
    items = []
    base_date = datetime.now()
    
    # Create LOST items
    for i, item_data in enumerate(lost_items):
        item = Item(
            title=item_data["title"],
            description=item_data["description"],
            category=item_data["category"],
            status="LOST",
            location=item_data["location"],
            date=base_date - timedelta(days=random.randint(1, 30)),
            contact_info=f"{demo_user.email}" if i < 5 else f"{users[random.randint(2, 3)].email}",
            reporter_id=demo_user.id if i < 5 else users[random.randint(2, 3)].id,
            is_flagged=(i % 5 == 0)  # Flag every 5th item
        )
        items.append(item)
    
    # Create FOUND items
    for i, item_data in enumerate(found_items):
        item = Item(
            title=item_data["title"],
            description=item_data["description"],
            category=item_data["category"],
            status="FOUND",
            location=item_data["location"],
            date=base_date - timedelta(days=random.randint(1, 25)),
            contact_info=f"{users[random.randint(1, 3)].email}",
            reporter_id=users[random.randint(1, 3)].id,
            is_flagged=(i % 5 == 0)  # Flag every 5th item
        )
        items.append(item)
    
    db.add_all(items)
    db.commit()
    
    print(f" Created {len(items)} items")
    print(f"   - LOST: {len(lost_items)}")
    print(f"   - FOUND: {len(found_items)}")
    print(f"   - Flagged: {sum(1 for item in items if item.is_flagged)}")
    
    return items

def seed_database():
    """Main seeding function"""
    db = SessionLocal()
    
    try:
        print("\n" + "="*50)
        print(" STARTING DATABASE SEEDING")
        print("="*50 + "\n")
        
        # Clear existing data
        response = input("Clear existing data? (yes/no): ").lower()
        if response == "yes":
            clear_data(db)
        
        # Create users
        users = create_users(db)
        
        # Create items
        items = create_items(db, users)
        
        print("\n" + "="*50)
        print(" DATABASE SEEDED SUCCESSFULLY")
        print("="*50)
        print(f" Users: {len(users)}")
        print(f"   - Demo User: {users[0].email}")
        print(f"   - Admin User: {users[1].email}")
        print(f"\n Items: {len(items)}")
        print(f"   - LOST: {sum(1 for item in items if item.status == 'LOST')}")
        print(f"   - FOUND: {sum(1 for item in items if item.status == 'FOUND')}")
        print(f"   - Flagged: {sum(1 for item in items if item.is_flagged)}")
        print(f"\n Demo User Items: {sum(1 for item in items if str(item.reporter_id) == str(users[0].id))} (for testing dashboard)")
        print("="*50 + "\n")
        
    except Exception as e:
        print(f"\n Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("\n Starting database seeding...\n")
    seed_database()
    print("\n Seeding complete!\n")
