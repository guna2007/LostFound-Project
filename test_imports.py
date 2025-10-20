# Test if all imports work
try:
    from database import engine, get_db, User, Item
    print("✅ database.py imports OK")
    
    from fastapi import FastAPI
    print("✅ FastAPI import OK")
    
    from main import app
    print("✅ main.py imports OK") 
    
    print("\n✅ ALL IMPORTS SUCCESSFUL - Server ready to start")
except Exception as e:
    print(f"❌ Import failed: {e}")
