# 🗄️ Lost & Found Platform — Database Layer

> **PostgreSQL 17.6 + pgvector** schema powering the backend API. Robust, scalable, and ready for production.

This database layer stores users, items, and item matches for the Lost & Found platform. It supports full CRUD, search, admin moderation, and vector similarity for matching items.

---

## 📦 Schema Overview

- **Tables:**
  - `users`: Registered users
  - `items`: Lost/found items
  - `item_matches`: Item match records
- **Indexes:** 7 total (performance, uniqueness)
- **Trigger:** 1 (auto-flagging logic)
- **Extensions:**
  - `pgcrypto` (UUID generation)
  - `vector` (pgvector for similarity)

---

## 🗄️ SQL Schema Reference

- See `schema.sql` for full DDL
- Key columns:
  - `users.id`: UUID PK
  - `items.id`: UUID PK
  - `items.vector`: vector(1536)
  - `item_matches.similarity`: float

---

## ⚡ Quick Setup

```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE lostfound;"

# 2. Enable extensions
psql -U postgres -d lostfound -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
psql -U postgres -d lostfound -c "CREATE EXTENSION IF NOT EXISTS vector;"

# 3. Apply schema
psql -U postgres -d lostfound -f lostfound_db/schema.sql

# 4. Seed demo data
cd lostfound_backend
venv\Scripts\activate
python seed.py
```

---

## 🧪 Verification

- Check tables: `\dt` in psql
- Count users/items: `SELECT COUNT(*) FROM users;`
- Test vector search: See backend `/items/search` endpoint

---

## 📋 Schema Status

| Table         | Status      |
| ------------- | ----------- |
| users         | ✅ Complete |
| items         | ✅ Complete |
| item_matches  | ✅ Complete |
| Indexes       | ✅ Complete |
| Trigger       | ✅ Complete |
| Extensions    | ✅ Complete |
| Demo Data     | ✅ Complete |
| Documentation | ✅ Complete |

---

## 🐞 Troubleshooting

- **DB connection error**: Check PostgreSQL service, credentials, DB name
- **Extension error**: Ensure pgcrypto/vector installed (`CREATE EXTENSION ...`)
- **Seed script fails**: Activate venv, check backend requirements

---

## 🚀 Deployment

- Production: Use managed PostgreSQL (Railway, Render, Heroku)
- Migrations: Use Alembic or manual SQL
- Backups: pg_dump recommended

---

## 📝 License

MIT — Free to use, modify, and distribute.

---

**Built for reliability, performance, and easy integration with FastAPI backend.**
