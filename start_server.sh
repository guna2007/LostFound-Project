#!/bin/bash
cd /c/Users/lanka/OneDrive/Desktop/AI_projects/lostFound-frontend/lostfound_app/lostfound_backend
./venv/Scripts/python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000
