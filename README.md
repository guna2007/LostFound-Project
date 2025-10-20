# 🚀 Lost & Found Platform — Full Stack Portfolio Project

> Modern, scalable, and AI-ready web application for managing lost and found items. Built with React (TypeScript), FastAPI (Python), and PostgreSQL (pgvector).

---

## 📸 Demo Screenshots

<!-- Add screenshots here for Home, Dashboard, Item Detail, Admin Panel, etc. -->

---

## 🏆 Why This Project Stands Out

- **Production-Ready Architecture**: Clean separation of frontend, backend, and database layers
- **AI-Ready Schema**: Vector embeddings, semantic search, and moderation fields
- **Modern UI/UX**: Responsive, accessible, and mobile-first design
- **Comprehensive Feature Set**: User auth, item CRUD, search/filter, admin moderation, image upload
- **Professional Documentation**: Clear setup, API docs, and troubleshooting
- **Portfolio Quality**: Demonstrates full-stack skills, best practices, and real-world complexity

---

## 🗂️ Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [API Overview](#api-overview)
6. [Database Schema](#database-schema)
7. [Demo Data](#demo-data)
8. [Screenshots](#demo-screenshots)
9. [Troubleshooting](#troubleshooting)
10. [Deployment](#deployment)
11. [License](#license)

---

## ✨ Features

### Frontend (React + TypeScript)

- **User Authentication**: Register, login, logout, protected routes
- **Item Management**: Report lost/found items, edit, delete, mark as reunited
- **Browse & Search**: Filter by category/status/date, global search, pagination
- **User Dashboard**: Personal item history, quick actions, statistics
- **Admin Dashboard**: Flagged items, bulk moderation, user management
- **Image Upload**: Client-side validation, preview, responsive display
- **Reusable Components**: Button, Input, Select, ItemCard, SearchBar, Layout
- **Responsive & Accessible**: Mobile-first, ARIA labels, keyboard navigation
- **Routing**: Public and protected routes, error pages
- **State Management**: Global auth/session, local form/filter states
- **Performance**: Code splitting, lazy loading, memoization

### Backend (FastAPI + Python)

- **RESTful API**: 13 endpoints, JSON format, error handling
- **User & Item CRUD**: Full create/read/update/delete for users/items
- **Search & Filter**: Query, category, status, pagination, sorting
- **Admin Moderation**: Approve/reject flagged items, bulk actions
- **Image Upload**: File validation, local storage, static serving
- **Seed Data**: Demo users/items, idempotent script
- **Validation**: Pydantic schemas, email-validator, enum checks
- **CORS**: Configurable origins for frontend integration
- **Documentation**: Swagger UI, ReDoc, OpenAPI

### Database (PostgreSQL + pgvector)

- **Schema**: 3 tables (users, items, item_matches), 7 indexes, 1 trigger
- **AI-Ready**: Vector embeddings, moderation fields, semantic search
- **Data Integrity**: Constraints, cascade deletes, unique indexes
- **Extensions**: pgcrypto (UUID), vector (embeddings)
- **Demo Data**: Seed script for users/items

---

## 🛠️ Tech Stack

| Layer        | Technology                                 |
| ------------ | ------------------------------------------ |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS      |
| **Backend**  | FastAPI, Python 3.11, SQLAlchemy, Pydantic |
| **Database** | PostgreSQL 17.6, pgvector, SQL             |
| **DevOps**   | Uvicorn, Railway/Render/Heroku, Docker     |

---

## 📁 Project Structure

```
lostfound_app/
├── lostfound_frontend/   # React + TypeScript client
├── lostfound_backend/    # FastAPI + Python API
├── lostfound_db/         # PostgreSQL schema & docs
├── start_server.sh       # Backend server script
├── LICENSE               # MIT License
└── README.md             # This file
```

---

## ⚡ Setup & Installation

### 1. Clone & Install

```bash
git clone <repo-url>
cd lostfound_app
```

### 2. Backend Setup

```bash
cd lostfound_backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Edit DB URL if needed
python seed.py        # Seed demo data
uvicorn main:app --reload
```

### 3. Frontend Setup

```bash
cd lostfound_frontend
npm install
npm run dev           # http://localhost:5173
```

### 4. Database Setup

```bash
psql -U postgres -c "CREATE DATABASE lostfound;"
psql -U postgres -d lostfound -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
psql -U postgres -d lostfound -c "CREATE EXTENSION IF NOT EXISTS vector;"
psql -U postgres -d lostfound -f lostfound_db/schema.sql
```

---

## 🔌 API Overview

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: `/health`
- **Users**: `/users` (GET, POST), `/users/{id}` (GET)
- **Items**: `/items` (GET, POST, PATCH, DELETE), `/items/{id}` (GET)
- **Admin**: `/admin/items/{id}/approve` (PATCH), `/admin/items/{id}` (DELETE)
- **Image Upload**: `/items/upload` (POST)
- **Seed Data**: `/seed` (POST)

---

## 🗄️ Database Schema

- **users**: UUID PK, email, name, role
- **items**: UUID PK, title, description, category, status, location, image, vector embedding, timestamps
- **item_matches**: lost/found item pairs, similarity score
- **Indexes**: 7 for performance
- **Trigger**: Auto-update timestamps
- **Extensions**: pgcrypto, vector

---

## 🧪 Demo Data

- **4 demo users**
- **20 demo items** (10 LOST, 10 FOUND)
- **Flagged items for moderation**
- **Seed script**: `python seed.py`

---

## 🐞 Troubleshooting

- **Server won't start**: Check venv activation, dependencies, `.env` config
- **DB connection error**: Verify PostgreSQL is running, correct DB URL
- **CORS issues**: Update `CORS_ORIGINS` in `.env` to match frontend
- **Image upload fails**: Check file type/size, ensure `uploads/` exists

---

## 🚀 Deployment

- **Production**: Use Gunicorn/Uvicorn, Docker, or cloud platforms
- **Environment Variables**: Use `.env` for secrets
- **Database**: Use managed PostgreSQL (Railway, Render, Heroku)
- **Backups**: Use `pg_dump`

---

## 📊 Feature Summary

| Layer       | Features               | Status      |
| ----------- | ---------------------- | ----------- |
| Frontend    | 10+ feature sets       | ✅ Complete |
| Backend     | 13 endpoints           | ✅ Complete |
| Database    | 3 tables, AI-ready     | ✅ Complete |
| Integration | Type-safe API          | 🟡 Pending  |
| AI Features | Embeddings, moderation | 🔲 V2 Ready |

---

## 📝 License

MIT — Free to use, modify, and distribute.

---

**Built with ❤️ for modern web development, AI integration, and real-world impact.**
