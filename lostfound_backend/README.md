# Lost & Found Backend API

> FastAPI backend with PostgreSQL database for Lost & Found platform

---

## Overview

RESTful API providing:

- **User Management:** Create and list users (no authentication)
- **Item CRUD:** Full create, read, update, delete operations
- **Search & Filters:** Query, category, status, pagination
- **Admin Moderation:** Approve/reject flagged items
- **Image Upload:** Local file storage with validation

**Tech Stack:**

- FastAPI 0.104.1
- SQLAlchemy 2.0.23
- PostgreSQL 17.6 with pgvector
- Pydantic 2.5.0
- Uvicorn (ASGI server)

---

## Prerequisites

- Python 3.11+
- PostgreSQL 17.6+ with `lostfound` database
- Database schema deployed (see `../lostfound_db/schema.sql`)

---

## Quick Start

### 1. Setup Virtual Environment

```bash
python -m venv venv

# Activate
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update:

```ini
DATABASE_URL=postgresql://postgres:1234@localhost:5432/lostfound
API_PORT=8000
CORS_ORIGINS=http://localhost:5173
```

### 4. Seed Demo Data

```bash
python seed.py
```

**Expected Output:**
- 4 users created
- 20 items created (10 LOST, 10 FOUND)
- 4 items flagged for moderation

### 5. Run Server

```bash
# Using venv Python
./venv/Scripts/python.exe -m uvicorn main:app --reload

# Or using activated venv
uvicorn main:app --reload
```

**Server:** http://localhost:8000  
**API Docs:** http://localhost:8000/docs  
**ReDoc:** http://localhost:8000/redoc

---

## API Endpoints

### Health Check

- `GET /health` - Server health check
  ```json
  { "status": "ok", "message": "Lost & Found API is running" }
  ```

### Users

- `GET /users` - List all users
- `GET /users/{id}` - Get user by ID
- `POST /users` - Create new user
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
  ```

### Items

- `GET /items` - List items with filters
  - **Query params:**
    - `query` - Search in title, description, location
    - `status` - Filter by LOST, FOUND, REUNITED
    - `category` - Filter by category
    - `is_flagged` - Filter flagged items
    - `page` - Page number (default: 1)
    - `page_size` - Items per page (default: 20, max: 100)
  
  **Example:**
  ```bash
  GET /items?status=LOST&category=Electronics&query=phone&page=1&page_size=10
  ```

- `GET /items/{id}` - Get single item by ID
- `POST /items` - Create new item
  ```json
  {
    "title": "Lost iPhone",
    "description": "Black iPhone 13 Pro",
    "category": "Electronics",
    "status": "LOST",
    "location": "Library 2nd Floor",
    "date": "2025-10-20T10:30:00",
    "image_url": "/uploads/image.jpg",
    "contact_info": "user@example.com",
    "reporter_id": "uuid-here"
  }
  ```

- `PATCH /items/{id}` - Update item (partial)
  ```json
  {
    "title": "Updated Title",
    "status": "REUNITED"
  }
  ```

- `DELETE /items/{id}` - Delete item

### Admin

- `PATCH /admin/items/{id}/approve` - Unflag item (approve)
- `DELETE /admin/items/{id}` - Delete flagged item (reject)

### Upload

- `POST /items/upload` - Upload image file
  - **Content-Type:** `multipart/form-data`
  - **Max Size:** 5MB
  - **Allowed Types:** .jpg, .jpeg, .png, .webp, .gif
  
  **Response:**
  ```json
  {
    "url": "/uploads/uuid-filename.jpg",
    "filename": "uuid-filename.jpg"
  }
  ```

---

## Testing

### Using Swagger UI

1. Start server: `uvicorn main:app --reload`
2. Open http://localhost:8000/docs
3. Expand any endpoint
4. Click "Try it out"
5. Fill parameters and execute

### Using curl

**Get Items:**
```bash
curl "http://localhost:8000/items?status=LOST&category=Electronics"
```

**Create Item:**
```bash
# Get a user ID first
USER_ID=$(curl -s "http://localhost:8000/users" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# Create item
curl -X POST "http://localhost:8000/items" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Item",
    "description": "Test Description",
    "category": "Electronics",
    "status": "LOST",
    "location": "Test Location",
    "date": "2025-10-20T10:00:00",
    "reporter_id": "'$USER_ID'"
  }'
```

**Upload Image:**
```bash
curl -X POST "http://localhost:8000/items/upload" \
  -F "file=@/path/to/image.jpg"
```

---

## Project Structure

```
lostfound_backend/
├── main.py              # FastAPI app with all routes
├── database.py          # SQLAlchemy models + Pydantic schemas
├── seed.py              # Demo data population script
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (gitignored)
├── .env.example         # Environment template
├── uploads/             # Image storage (gitignored)
├── venv/                # Virtual environment (gitignored)
└── README.md            # This file
```

---

## Configuration

**.env Variables:**

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/lostfound` |
| `API_HOST` | Server host | `0.0.0.0` |
| `API_PORT` | Server port | `8000` |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `http://localhost:5173` |
| `UPLOAD_DIR` | Upload directory | `./uploads` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `5242880` (5MB) |
| `APP_NAME` | API title | `Lost & Found API` |
| `APP_VERSION` | API version | `1.0.0` |
| `DEBUG` | Debug mode | `True` |

---

## Database Schema

The backend connects to a PostgreSQL database with the following tables:

### users
- `id` (UUID) - Primary key
- `email` (VARCHAR) - Unique
- `name` (VARCHAR)
- `role` (VARCHAR) - USER or ADMIN
- `created_at` (TIMESTAMP)

### items
- `id` (UUID) - Primary key
- `title`, `description`, `category`, `status`, `location`, `date`
- `image_url`, `contact_info`
- `reporter_id` (UUID) - Foreign key to users
- `is_flagged` (BOOLEAN) - For moderation
- `ai_category_prediction`, `ai_moderation_score`, `embedding` - AI-ready columns (V2)
- `created_at`, `updated_at` (TIMESTAMP)

### item_matches
- `id` (UUID) - Primary key
- `lost_item_id`, `found_item_id` (UUID) - Foreign keys to items
- `similarity_score` (FLOAT) - AI matching score
- `notified` (BOOLEAN)
- `created_at` (TIMESTAMP)

---

## Troubleshooting

### Server won't start

**Issue:** `ModuleNotFoundError` or import errors

**Solution:**
```bash
# Ensure venv is activated
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Database connection failed

**Issue:** `OperationalError: could not connect to server`

**Solution:**
1. Check PostgreSQL is running:
   ```bash
   # Windows
   net start | findstr postgres
   
   # Mac/Linux
   pg_ctl status
   ```

2. Verify database exists:
   ```bash
   psql -U postgres -l | grep lostfound
   ```

3. Test connection:
   ```bash
   python database.py
   ```

4. Check `.env` DATABASE_URL is correct

### CORS errors from frontend

**Issue:** Browser blocks requests from `http://localhost:5173`

**Solution:**
1. Add frontend URL to `CORS_ORIGINS` in `.env`:
   ```ini
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

2. Restart server after `.env` changes

### Image upload fails

**Issue:** Upload returns 400 error

**Solution:**
1. Check file size < 5MB
2. Check file type (jpg, png, webp, gif only)
3. Ensure `uploads/` directory exists:
   ```bash
   mkdir uploads
   ```

### Seeding fails

**Issue:** Foreign key constraint errors

**Solution:**
```bash
# Clear and reseed
python seed.py
# Enter "yes" when prompted to clear existing data
```

---

## Development

### Running with Auto-Reload

```bash
uvicorn main:app --reload --log-level debug
```

### Testing Database Connection

```bash
python database.py
```

**Expected Output:**
```
Database connection successful
Database initialized
```

### Checking Installed Packages

```bash
pip list
```

### Database Queries

```bash
# Count users
psql -U postgres -d lostfound -c "SELECT COUNT(*) FROM users;"

# Count items by status
psql -U postgres -d lostfound -c "SELECT status, COUNT(*) FROM items GROUP BY status;"

# List flagged items
psql -U postgres -d lostfound -c "SELECT id, title FROM items WHERE is_flagged = true;"
```

---

## Deployment (Future)

### Using Render/Railway

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables:
   - `DATABASE_URL` (from hosted PostgreSQL)
   - `CORS_ORIGINS` (production frontend URL)
4. Deploy!

### Using Docker

**Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Build & Run:**
```bash
docker build -t lostfound-backend .
docker run -p 8000:8000 --env-file .env lostfound-backend
```

---

## Notes

- **No Authentication:** Demo mode - frontend selects user from dropdown
- **AI-Ready:** Database includes AI columns (`embedding`, `ai_moderation_score`) for V2 features
- **Simplified:** Single `main.py` file for easy review and learning
- **Production TODO:**
  - Add JWT authentication
  - Add rate limiting
  - Add Redis caching
  - Add background tasks for AI processing
  - Add email notifications
  - Add comprehensive logging

---

## API Response Models

### ItemResponse
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "category": "string",
  "status": "LOST|FOUND|REUNITED",
  "location": "string",
  "date": "2025-10-20T10:30:00",
  "image_url": "string|null",
  "contact_info": "string|null",
  "reporter_id": "uuid",
  "is_flagged": false,
  "ai_category_prediction": "string|null",
  "ai_moderation_score": 0.0|null,
  "embedding": "string|null",
  "created_at": "2025-10-20T10:30:00",
  "updated_at": "2025-10-20T10:30:00"
}
```

### ItemListResponse
```json
{
  "items": [ItemResponse],
  "total": 100,
  "page": 1,
  "page_size": 20
}
```

---

## Related Projects

- **Frontend:** `../lostfound_frontend/` - React + TypeScript UI
- **Database:** `../lostfound_db/` - PostgreSQL schema and migrations
- **API Documentation:** http://localhost:8000/docs

---

## License

MIT License - See LICENSE file in project root

---

## Status

**Backend Status: READY**

- Database Layer: COMPLETE
- Backend API: COMPLETE  
- Seed Data: COMPLETE
- Documentation: COMPLETE

**Next Steps:**
1. Start server: `uvicorn main:app --reload`
2. Test endpoints: http://localhost:8000/docs
3. Integrate with frontend

---

**Last Updated:** October 20, 2025  
**Version:** 1.0.0
