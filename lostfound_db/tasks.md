# 📊 DATABASE LAYER TASKS — Lost & Found Platform

> **Purpose:** PostgreSQL database setup with AI-ready schema for Lost & Found MVP  
> **Layer:** Database (PostgreSQL + pgvector)  
> **Dependencies:** PostgreSQL 17+, pgvector extension  
> **Estimated Time:** 45-60 minutes  
> **⚠️ CRITICAL:** Test after EVERY module before proceeding

---

## 🎯 CONTEXT

This database layer serves as the foundation for the Lost & Found platform. It includes:

- **3 Core Tables:** Users, Items, ItemMatches
- **AI-Ready Columns:** Embedding vectors (VECTOR 384), moderation scores, category predictions (NULL in V1)
- **pgvector Extension:** Enables semantic similarity search for V2
- **No Authentication:** Simple user/role system without passwords (demo mode)

**Design Philosophy:**

- ✅ Schema designed for V2 AI features without requiring migrations
- ✅ All AI columns nullable (populated later)
- ✅ Performance indexes on frequently queried columns
- ✅ Cascading deletes for referential integrity
- ✅ **TEST EACH MODULE** before proceeding to prevent breakage

**Safety Features:**

- 🔄 Rollback commands provided for every module
- ✅ Verification checkpoints after each step
- 🛑 Clear "STOP HERE" warnings if tests fail
- 📊 Connection string validation before deployment

---

## ⚠️ PREREQUISITES VERIFICATION

**🛑 DO NOT PROCEED** until all checks pass. Run these commands to verify readiness:

### Required Software

- [ ] **PostgreSQL 17+** installed and running

  ```bash
  psql --version
  # Should output: psql (PostgreSQL) 17.x
  ```

  - Windows: https://www.postgresql.org/download/windows/
  - Mac: `brew install postgresql@17`
  - Linux: `sudo apt-get install postgresql-17`

- [ ] **PostgreSQL Service Running**

  ```bash
  # Windows - Check service status
  net start | findstr postgres
  # Should show: postgresql-x64-17

  # Mac
  brew services list | grep postgresql

  # Linux
  sudo systemctl status postgresql
  ```

- [ ] **pgvector Extension Installed**

  ```bash
  # Test in psql
  psql -U postgres -d postgres -c "CREATE EXTENSION IF NOT EXISTS vector; SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';"
  # Should show: vector | 0.8.x or higher
  ```

  - If not available: https://github.com/pgvector/pgvector#installation
  - Windows: Use StackBuilder or download prebuilt binaries
  - Mac: `brew install pgvector`
  - Linux: Follow GitHub instructions

### Access Verification

- [ ] **Can connect to PostgreSQL**

  ```bash
  psql -U postgres -c "SELECT version();"
  # Should show PostgreSQL version without errors
  ```

- [ ] **Can create test database**

  ```bash
  createdb -U postgres test_db_check && dropdb -U postgres test_db_check
  # Should succeed without errors
  ```

- [ ] **Database credentials known**
  - Default user: `postgres`
  - Default password: Set during installation (remember this!)
  - Default port: `5432`
  - Connection string format: `postgresql://postgres:PASSWORD@localhost:5432/lostfound`

### 🚨 If Any Check Fails

- PostgreSQL not installed? Install from official website
- Service not running? Start it: `net start postgresql-x64-17` (Windows)
- pgvector missing? Install via StackBuilder or package manager
- Connection refused? Check firewall, verify service is running
- Password unknown? Reinstall PostgreSQL or reset via `pg_hba.conf`

---

## 📦 MODULE 1: DATABASE INITIALIZATION & EXTENSION SETUP

### Goal

Create the `lostfound` PostgreSQL database and enable required extensions

### Tasks

#### 1.1 Create Database

```bash
createdb -U postgres lostfound
```

**Expected Output:**

- No output = success
- Error "database already exists" → OK, proceed to next step

**If database exists and you want fresh start:**

```bash
# ⚠️ WARNING: This deletes ALL data
dropdb -U postgres lostfound && createdb -U postgres lostfound
```

#### 1.2 Verify Database Creation

```bash
psql -U postgres -l | grep lostfound
```

**Expected Output:**

```
 lostfound | postgres | UTF8 | libc | ... | ... | | |
```

**🛑 STOP HERE** if database is not listed. Check PostgreSQL service and credentials.

#### 1.3 Test Connection

```bash
psql -U postgres -d lostfound -c "SELECT current_database();"
```

**Expected Output:**

```
 current_database
------------------
 lostfound
(1 row)
```

**🛑 STOP HERE** if you get connection errors. Verify:

- PostgreSQL service running: `net start | findstr postgres`
- Password correct
- Port 5432 available: `netstat -an | findstr 5432`

#### 1.4 Enable Required Extensions

```bash
psql -U postgres -d lostfound -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
psql -U postgres -d lostfound -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

**Expected Output:**

```
CREATE EXTENSION
CREATE EXTENSION
```

#### 1.5 Verify Extensions Installed

```bash
psql -U postgres -d lostfound -c "SELECT extname, extversion FROM pg_extension WHERE extname IN ('pgcrypto', 'vector');"
```

**Expected Output:**

```
 extname  | extversion
----------+------------
 pgcrypto | 1.3
 vector   | 0.8.1
(2 rows)
```

**🛑 STOP HERE** if vector extension fails. Install pgvector:

- Windows: StackBuilder → PostgreSQL 17 → Extensions → pgvector
- Or download from: https://github.com/pgvector/pgvector/releases

#### 1.6 Test Vector Type

```bash
psql -U postgres -d lostfound -c "SELECT '[1,2,3]'::vector(3) AS test_vector;"
```

**Expected Output:**

```
 test_vector
-------------
 [1,2,3]
(1 row)
```

### Module 1 Verification Checkpoint ✅

**All checks must pass before proceeding:**

- [ ] Database `lostfound` exists
- [ ] Can connect without errors
- [ ] pgcrypto extension enabled (for UUID generation)
- [ ] vector extension enabled (for AI embeddings)
- [ ] Vector type works (test query succeeds)

**Rollback (if needed):**

```bash
# Start over completely
dropdb -U postgres lostfound
# Then repeat Module 1 from 1.1
```

**Debug Common Issues:**

- Connection refused? → `net start postgresql-x64-17`
- Password wrong? → Check password set during install
- pgcrypto missing? → Should be built-in, check PostgreSQL installation
- vector missing? → Install pgvector extension (see 1.4)
- Port conflict? → Check if another service uses port 5432

**✅ Module 1 Complete.** Database ready for schema deployment.

---

## 📦 MODULE 2: SCHEMA FILE CREATION

### Goal

Create `schema.sql` with complete table definitions matching frontend expectations

### Prerequisites

- [ ] Module 1 complete (database and extensions ready)
- [ ] Text editor or VS Code open
- [ ] Current directory: `lostfound_db/`

### Tasks

#### 2.1 Navigate to Database Directory

```bash
cd lostfound_db
```

#### 2.2 Create schema.sql File

**File:** `lostfound_db/schema.sql`

**📝 Create this file and paste the following SQL:**

```sql
-- ============================================
-- Lost & Found Platform - Database Schema
-- Version: 1.0 (AI-Ready)
-- PostgreSQL 17+ with pgvector extension
-- ============================================

-- Enable pgvector extension for AI similarity search (V2)
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- TABLE: users
-- Purpose: Store user accounts (no passwords for demo)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: items
-- Purpose: Store lost and found items
-- AI-Ready: Includes embedding, moderation, and prediction columns
-- ============================================
CREATE TABLE items (
    -- Primary Fields
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('LOST', 'FOUND', 'REUNITED')),
    location VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    image_url VARCHAR(500),
    contact_info VARCHAR(255),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_flagged BOOLEAN DEFAULT FALSE,

    -- AI-Ready Columns (NULL in V1, populated in V2)
    ai_category_prediction VARCHAR(50),              -- Auto-predicted category
    ai_moderation_score FLOAT,                       -- Content safety score (0-1)
    embedding VECTOR(384),                            -- Semantic embedding for similarity search

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: item_matches
-- Purpose: Store similarity matches between lost and found items (V2)
-- ============================================
CREATE TABLE item_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lost_item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    found_item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    similarity_score FLOAT NOT NULL,                  -- Cosine similarity (0-1)
    notified BOOLEAN DEFAULT FALSE,                   -- Has user been notified?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Prevent duplicate matches
    UNIQUE(lost_item_id, found_item_id)
);

-- ============================================
-- INDEXES for Performance
-- ============================================

-- Items: Reporter lookup (dashboard queries)
CREATE INDEX idx_items_reporter ON items(reporter_id);

-- Items: Status filtering (lost vs found pages)
CREATE INDEX idx_items_status ON items(status);

-- Items: Category filtering
CREATE INDEX idx_items_category ON items(category);

-- Items: Sorting by date (newest/oldest)
CREATE INDEX idx_items_created ON items(created_at DESC);

-- Items: Flagged items (admin dashboard)
CREATE INDEX idx_items_flagged ON items(is_flagged) WHERE is_flagged = TRUE;

-- ItemMatches: Find matches for a lost item
CREATE INDEX idx_matches_lost_item ON item_matches(lost_item_id);

-- ItemMatches: Find matches for a found item
CREATE INDEX idx_matches_found_item ON item_matches(found_item_id);

-- ============================================
-- TRIGGERS: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS for Documentation
-- ============================================
COMMENT ON TABLE users IS 'User accounts (no passwords for demo mode)';
COMMENT ON TABLE items IS 'Lost and found items with AI-ready columns';
COMMENT ON TABLE item_matches IS 'Similarity matches between lost/found items (V2 feature)';

COMMENT ON COLUMN items.embedding IS 'Sentence embedding vector for semantic search (populated in V2)';
COMMENT ON COLUMN items.ai_category_prediction IS 'ML-predicted category (populated in V2)';
COMMENT ON COLUMN items.ai_moderation_score IS 'Content moderation score 0-1 (populated in V2)';
```

#### 2.2 Verify File Created

```bash
# Check file exists
ls -la schema.sql

# Count tables defined (should be 3)
grep -c "CREATE TABLE" schema.sql
```

**Expected Output:**

```
-rw-r--r-- 1 user user 5234 Oct 20 12:00 schema.sql
3
```

#### 2.3 Validate SQL Syntax (Dry Run)

```bash
# Test SQL syntax without executing
psql -U postgres -d lostfound --single-transaction --set ON_ERROR_STOP=on -f schema.sql --echo-errors 2>&1 | grep -i error
```

**Expected Output:**

- No output = syntax valid ✅
- If errors shown → Fix SQL before proceeding

**Common Syntax Issues:**

- Missing semicolons at end of statements
- Unclosed parentheses in CREATE TABLE
- Typos in column names or types
- Missing commas between columns

#### 2.4 Count Schema Components

```bash
# Verify schema completeness
echo "Tables: $(grep -c 'CREATE TABLE' schema.sql)"
echo "Indexes: $(grep -c 'CREATE INDEX' schema.sql)"
echo "Triggers: $(grep -c 'CREATE TRIGGER' schema.sql)"
echo "Functions: $(grep -c 'CREATE.*FUNCTION' schema.sql)"
```

**Expected Output:**

```
Tables: 3
Indexes: 7
Triggers: 1
Functions: 1
```

### Module 2 Verification Checkpoint ✅

**All checks must pass before deploying:**

- [ ] `schema.sql` file created in `lostfound_db/`
- [ ] File size ~5-6 KB (reasonable for 3 tables + indexes)
- [ ] Contains all 3 tables (users, items, item_matches)
- [ ] Contains 7 indexes (performance optimization)
- [ ] Contains 1 trigger (auto-update timestamps)
- [ ] SQL syntax is valid (no errors in dry run)
- [ ] Comments and structure readable

**Rollback (if needed):**

```bash
# Delete and recreate file
rm schema.sql
# Then repeat 2.2 (paste schema content again)
```

**Debug:**

- File not found? Check current directory with `pwd`
- Syntax errors? Copy schema from tasks.md exactly
- Grep not working? Use text editor to manually verify
- Line ending issues? Ensure Unix-style (LF) not Windows (CRLF)

**✅ Module 2 Complete.** Schema file ready for deployment.

---

## 📦 MODULE 3: SCHEMA DEPLOYMENT & VERIFICATION

### Goal

Execute schema.sql to create all tables, indexes, and triggers

### Prerequisites

- [ ] Module 1 complete (database with extensions ready)
- [ ] Module 2 complete (schema.sql file validated)
- [ ] Current directory: `lostfound_db/`

### Tasks

#### 3.1 Deploy Schema

```bash
psql -U postgres -d lostfound -f schema.sql
```

**Expected Output:**

```
CREATE EXTENSION
CREATE EXTENSION
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE FUNCTION
CREATE TRIGGER
COMMENT
COMMENT
COMMENT
COMMENT
COMMENT
COMMENT
```

**🛑 STOP HERE** if you see any ERROR messages. Common issues:

- Extension not found → Install pgvector (see Module 1)
- Syntax error → Fix schema.sql (see Module 2)
- Permission denied → Use `-U postgres` flag

#### 3.2 Verify All Tables Created

```bash
psql -U postgres -d lostfound -c "\dt"
```

**Expected Output:**

```
           List of relations
 Schema |     Name      | Type  |  Owner
--------+---------------+-------+----------
 public | item_matches  | table | postgres
 public | items         | table | postgres
 public | users         | table | postgres
(3 rows)
```

**🛑 STOP HERE** if count ≠ 3 tables. Check deployment errors above.

#### 3.3 Verify Users Table Structure

```bash
psql -U postgres -d lostfound -c "\d users"
```

**Expected Output (5 columns):**

```
                    Table "public.users"
   Column   |          Type          | ... | Default
------------+------------------------+-----+----------------------
 id         | uuid                   |     | gen_random_uuid()
 email      | character varying(255) |     |
 name       | character varying(255) |     |
 role       | character varying(20)  |     | 'USER'::...
 created_at | timestamp              |     | CURRENT_TIMESTAMP
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_email_key" UNIQUE, btree (email)
Check constraints:
    "users_role_check" CHECK (role IN ('USER', 'ADMIN'))
```

**✅ Verify:** 5 columns, UUID primary key, email unique, role check constraint

#### 3.4 Verify Items Table Structure (Critical for Frontend)

```bash
psql -U postgres -d lostfound -c "\d items"
```

**Expected Output (16 columns):**

```
                        Table "public.items"
        Column         |          Type          | ... | Default
-----------------------+------------------------+-----+--------------------
 id                    | uuid                   |     | gen_random_uuid()
 title                 | character varying(255) |     |
 description           | text                   |     |
 category              | character varying(50)  |     |
 status                | character varying(20)  |     |
 location              | character varying(255) |     |
 date                  | timestamp              |     |
 image_url             | character varying(500) |     |
 contact_info          | character varying(255) |     |
 reporter_id           | uuid                   |     |
 is_flagged            | boolean                |     | false
 ai_category_prediction| character varying(50)  |     |
 ai_moderation_score   | double precision       |     |
 embedding             | vector(384)            |     |
 created_at            | timestamp              |     | CURRENT_TIMESTAMP
 updated_at            | timestamp              |     | CURRENT_TIMESTAMP
```

**🛑 CRITICAL CHECK:** Must have exactly 16 columns including:

- `embedding` as `vector(384)` (not vector(3) or other size)
- `ai_moderation_score` as `double precision` (FLOAT)
- `ai_category_prediction` as `character varying(50)`

**Frontend depends on these exact column names and types!**

#### 3.5 Verify Item_Matches Table Structure

```bash
psql -U postgres -d lostfound -c "\d item_matches"
```

**Expected Output (6 columns):**

```
                  Table "public.item_matches"
      Column      |   Type   | ... | Default
------------------+----------+-----+--------------------
 id               | uuid     |     | gen_random_uuid()
 lost_item_id     | uuid     |     |
 found_item_id    | uuid     |     |
 similarity_score | double precision |     |
 notified         | boolean  |     | false
 created_at       | timestamp|     | CURRENT_TIMESTAMP
```

#### 3.6 Verify All Indexes Created

```bash
psql -U postgres -d lostfound -c "\di" | grep idx_
```

**Expected Output (7 indexes):**

```
 public | idx_items_category      | index | postgres | items
 public | idx_items_created       | index | postgres | items
 public | idx_items_flagged       | index | postgres | items
 public | idx_items_reporter      | index | postgres | items
 public | idx_items_status        | index | postgres | items
 public | idx_matches_found_item  | index | postgres | item_matches
 public | idx_matches_lost_item   | index | postgres | item_matches
```

**🛑 STOP HERE** if count ≠ 7. Re-run schema deployment.

#### 3.7 Verify Trigger Exists

```bash
psql -U postgres -d lostfound -c "SELECT tgname, tgtype FROM pg_trigger WHERE tgname = 'update_items_updated_at';"
```

**Expected Output:**

```
        tgname         | tgtype
-----------------------+--------
 update_items_updated_at |      4
(1 row)
```

#### 3.8 Test Constraints Work

```bash
# Test role constraint (should fail)
psql -U postgres -d lostfound -c "INSERT INTO users (email, name, role) VALUES ('test@test.com', 'Test', 'INVALID');" 2>&1 | grep -i constraint

# Test status constraint (should fail)
psql -U postgres -d lostfound -c "INSERT INTO items (title, description, category, status, location, date, reporter_id) VALUES ('T', 'T', 'T', 'INVALID', 'T', NOW(), gen_random_uuid());" 2>&1 | grep -i constraint
```

**Expected Output:**

```
ERROR:  new row for relation "users" violates check constraint "users_role_check"
ERROR:  new row for relation "items" violates check constraint "items_status_check"
```

**✅ Good!** Constraints are working properly.

#### 3.9 Test Foreign Key Constraint

```bash
# Try to insert item with non-existent user (should fail)
psql -U postgres -d lostfound -c "INSERT INTO items (title, description, category, status, location, date, reporter_id) VALUES ('Test', 'Test', 'Electronics', 'LOST', 'Test', NOW(), '00000000-0000-0000-0000-000000000000');" 2>&1 | grep -i "foreign key"
```

**Expected Output:**

```
ERROR:  insert or update on table "items" violates foreign key constraint
```

**✅ Good!** Foreign keys enforced properly.

#### 3.10 Verify Extension and Vector Type

```bash
psql -U postgres -d lostfound -c "SELECT extname, extversion FROM pg_extension WHERE extname IN ('vector', 'pgcrypto');"
```

**Expected Output:**

```
 extname  | extversion
----------+------------
 pgcrypto | 1.3
 vector   | 0.8.1
(2 rows)
```

### Module 3 Verification Checkpoint ✅

**All checks must pass before proceeding to backend:**

- [ ] All 3 tables exist (users, items, item_matches)
- [ ] Users table: 5 columns, UUID pk, email unique, role constraint
- [ ] Items table: 16 columns including `embedding vector(384)`
- [ ] Item_matches table: 6 columns with foreign keys
- [ ] All 7 indexes created and named correctly
- [ ] Trigger `update_items_updated_at` exists
- [ ] Check constraints work (role, status)
- [ ] Foreign key constraints enforced
- [ ] Both extensions enabled (pgcrypto, vector)
- [ ] No SQL errors during deployment

**Rollback (if needed):**

```bash
# Drop all tables and start over
psql -U postgres -d lostfound -c "DROP TABLE IF EXISTS item_matches CASCADE;"
psql -U postgres -d lostfound -c "DROP TABLE IF EXISTS items CASCADE;"
psql -U postgres -d lostfound -c "DROP TABLE IF EXISTS users CASCADE;"
psql -U postgres -d lostfound -c "DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;"

# Then re-run deployment
psql -U postgres -d lostfound -f schema.sql
```

**Debug:**

- Wrong column count? → Check schema.sql has all fields
- Wrong vector size? → Must be `VECTOR(384)` not `VECTOR(3)`
- Missing indexes? → Check grep command output, re-run schema
- Constraints not working? → Verify CHECK definitions in schema
- Permission errors? → Ensure using `-U postgres` flag

**✅ Module 3 Complete.** Database schema fully deployed and verified.

---

## 📦 MODULE 4: DATABASE README

### Goal

Create comprehensive database documentation

### Tasks

#### 4.1 Create README.md

**File:** `lostfound_db/README.md`

**Contents:**

````markdown
# 📊 Lost & Found Database Layer

> PostgreSQL database with AI-ready schema for semantic search and content moderation

---

## 🎯 Overview

This database supports:

- User management (no passwords, demo mode)
- Lost and found item tracking
- Admin moderation workflow
- **AI-Ready:** Embedding vectors, moderation scores, category predictions

---

## 📋 Prerequisites

- PostgreSQL 14+
- pgvector extension

---

## 🚀 Quick Start

### 1. Install PostgreSQL

**Windows:**

```bash
# Download installer from:
https://www.postgresql.org/download/windows/
```
````

**Mac:**

```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**

```bash
sudo apt-get update
sudo apt-get install postgresql-14
sudo systemctl start postgresql
```

### 2. Install pgvector Extension

Follow instructions: https://github.com/pgvector/pgvector#installation

### 3. Create Database

```bash
createdb lostfound
```

### 4. Deploy Schema

```bash
psql -d lostfound -f schema.sql
```

### 5. Verify Setup

```bash
psql -d lostfound -c "\dt"
# Should show: users, items, item_matches
```

---

## 📊 Database Schema

### Table: `users`

| Column     | Type         | Description                  |
| ---------- | ------------ | ---------------------------- |
| id         | UUID         | Primary key (auto-generated) |
| email      | VARCHAR(255) | Unique email address         |
| name       | VARCHAR(255) | User's full name             |
| role       | VARCHAR(20)  | USER or ADMIN                |
| created_at | TIMESTAMP    | Account creation time        |

**No passwords:** This is a demo project using frontend role toggle.

---

### Table: `items`

| Column                     | Type         | Description                                  |
| -------------------------- | ------------ | -------------------------------------------- |
| id                         | UUID         | Primary key (auto-generated)                 |
| title                      | VARCHAR(255) | Item title                                   |
| description                | TEXT         | Detailed description                         |
| category                   | VARCHAR(50)  | Item category (Electronics, Documents, etc.) |
| status                     | VARCHAR(20)  | LOST, FOUND, or REUNITED                     |
| location                   | VARCHAR(255) | Where item was lost/found                    |
| date                       | TIMESTAMP    | When item was lost/found                     |
| image_url                  | VARCHAR(500) | Image path (optional)                        |
| contact_info               | VARCHAR(255) | Contact details (optional)                   |
| reporter_id                | UUID         | Foreign key to users.id                      |
| is_flagged                 | BOOLEAN      | Flagged for admin review                     |
| **ai_category_prediction** | VARCHAR(50)  | ML-predicted category (V2)                   |
| **ai_moderation_score**    | FLOAT        | Content safety score 0-1 (V2)                |
| **embedding**              | VECTOR(384)  | Semantic embedding (V2)                      |
| created_at                 | TIMESTAMP    | Record creation time                         |
| updated_at                 | TIMESTAMP    | Last update time                             |

**AI Columns:** Nullable in V1, populated automatically in V2.

---

### Table: `item_matches`

| Column           | Type      | Description                          |
| ---------------- | --------- | ------------------------------------ |
| id               | UUID      | Primary key (auto-generated)         |
| lost_item_id     | UUID      | Foreign key to items.id (LOST item)  |
| found_item_id    | UUID      | Foreign key to items.id (FOUND item) |
| similarity_score | FLOAT     | Cosine similarity 0-1                |
| notified         | BOOLEAN   | User notified of match?              |
| created_at       | TIMESTAMP | Match discovery time                 |

**Purpose:** V2 feature for automatic similarity notifications.

---

## 🔍 Indexes

- **idx_items_reporter:** Fast dashboard queries (reporter_id)
- **idx_items_status:** Filter lost vs found items
- **idx_items_category:** Category filtering
- **idx_items_created:** Sort by newest/oldest
- **idx_items_flagged:** Admin flagged items lookup
- **idx_matches_lost_item:** Find matches for lost item
- **idx_matches_found_item:** Find matches for found item

---

## 🧪 Verification Queries

### Check Table Counts

```sql
SELECT
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM items) as items,
  (SELECT COUNT(*) FROM item_matches) as matches;
```

### Check pgvector Extension

```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

### Verify AI Columns

```sql
SELECT
  COUNT(*) as total_items,
  COUNT(embedding) as items_with_embeddings,
  COUNT(ai_moderation_score) as items_moderated
FROM items;
```

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL running
sudo systemctl status postgresql  # Linux
brew services list  # Mac
net start  # Windows

# Check port
netstat -an | grep 5432
```

### Schema Deployment Errors

```bash
# Drop and recreate clean
dropdb lostfound
createdb lostfound
psql -d lostfound -f schema.sql
```

### pgvector Not Available

```bash
# Install extension
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make
sudo make install
```

---

## 🚀 Next Steps

1. ✅ Database created
2. → Seed demo data (run `backend/seed.py`)
3. → Start backend API
4. → Connect frontend

---

## 📝 Notes

- **Demo Mode:** No authentication, simple user selection
- **AI-Ready:** Schema supports V2 without migrations
- **Performance:** Indexes optimized for common queries
- **Integrity:** Cascading deletes maintain referential integrity

````

### Module 4 Verification ✅

- [ ] README.md created in `lostfound_db/`
- [ ] Contains installation instructions
- [ ] Contains schema documentation
- [ ] Contains troubleshooting guide
- [ ] Readable and well-formatted

---

## 📦 MODULE 5: FINAL DATABASE VERIFICATION

### Goal
Comprehensive database integrity check

### Tasks

#### 5.1 Table Structure Verification
```sql
-- Connect to database
psql -d lostfound

-- Verify users table
\d users
-- Should have: id, email, name, role, created_at

-- Verify items table
\d items
-- Should have 16 columns including embedding (vector 384)

-- Verify item_matches table
\d item_matches
-- Should have: id, lost_item_id, found_item_id, similarity_score, notified, created_at
````

#### 5.2 Constraint Verification

```sql
-- Check role constraint
INSERT INTO users (email, name, role) VALUES ('test@test.com', 'Test', 'INVALID');
-- Should fail with: check constraint "users_role_check" violated

-- Check status constraint
INSERT INTO items (title, description, category, status, location, date, reporter_id)
VALUES ('Test', 'Test', 'Test', 'INVALID', 'Test', NOW(), gen_random_uuid());
-- Should fail with: check constraint "items_status_check" violated
```

#### 5.3 Foreign Key Verification

```sql
-- Try to insert item with non-existent user
INSERT INTO items (title, description, category, status, location, date, reporter_id)
VALUES ('Test', 'Test', 'Electronics', 'LOST', 'Test', NOW(), '00000000-0000-0000-0000-000000000000');
-- Should fail with: foreign key constraint violated
```

#### 5.4 Index Verification

```sql
-- Check index usage
EXPLAIN SELECT * FROM items WHERE reporter_id = gen_random_uuid();
-- Should show: Index Scan using idx_items_reporter

EXPLAIN SELECT * FROM items WHERE status = 'LOST';
-- Should show: Index Scan using idx_items_status
```

#### 5.5 AI Column Null Check

```sql
-- Verify AI columns accept NULL
SELECT
  COUNT(*) as total,
  COUNT(embedding) as with_embedding,
  COUNT(ai_moderation_score) as with_moderation,
  COUNT(ai_category_prediction) as with_prediction
FROM items;
-- Should show: 0, 0, 0 for AI columns (no data seeded yet)
```

#### 5.6 Trigger Verification

```sql
-- Create test user and item
INSERT INTO users (email, name) VALUES ('trigger_test@test.com', 'Trigger Test') RETURNING id;
-- Copy the returned ID

INSERT INTO items (title, description, category, status, location, date, reporter_id)
VALUES ('Test Item', 'Test', 'Electronics', 'LOST', 'Library', NOW(), '<PASTE_USER_ID_HERE>')
RETURNING id, created_at, updated_at;
-- created_at and updated_at should be same

-- Wait 2 seconds, then update
SELECT pg_sleep(2);
UPDATE items SET title = 'Updated Test' WHERE title = 'Test Item'
RETURNING created_at, updated_at;
-- updated_at should be 2 seconds later than created_at

-- Clean up test data
DELETE FROM users WHERE email = 'trigger_test@test.com';
```

### Module 5 Verification Checkpoint ✅

**Complete Checklist (ALL must pass):**

- [ ] 3 tables exist with correct structure
- [ ] All columns have correct data types and names
- [ ] CHECK constraints work (role ∈ {USER, ADMIN}, status ∈ {LOST, FOUND, REUNITED})
- [ ] Foreign key constraints enforced (cascade deletes work)
- [ ] All 7 indexes created and functional
- [ ] AI columns (embedding, moderation, prediction) accept NULL
- [ ] Triggers work (updated_at auto-updates on UPDATE)
- [ ] pgvector extension enabled
- [ ] No orphaned data or constraint violations
- [ ] Database ready for backend connection and seeding

**Final Summary Check:**

```bash
# Comprehensive status
psql -U postgres -d lostfound -c "
SELECT
  (SELECT COUNT(*) FROM pg_tables WHERE tablename IN ('users', 'items', 'item_matches')) as tables,
  (SELECT COUNT(*) FROM pg_indexes WHERE indexname LIKE 'idx_%') as indexes,
  (SELECT COUNT(*) FROM pg_extension WHERE extname = 'vector') as pgvector_enabled,
  (SELECT COUNT(*) FROM pg_trigger WHERE tgname = 'update_items_updated_at') as triggers;
"
```

**Expected Output:**

```
 tables | indexes | pgvector_enabled | triggers
--------+---------+------------------+----------
      3 |       7 |                1 |        1
(1 row)
```

**🛑 STOP AND FIX** if any number doesn't match:

- tables ≠ 3 → Missing table, check Module 3
- indexes ≠ 7 → Missing index, re-deploy schema
- pgvector_enabled ≠ 1 → Extension not installed, check Module 1
- triggers ≠ 1 → Trigger not created, check schema.sql

---

## ✅ DATABASE LAYER COMPLETE

### Success Criteria

All modules completed:

- [x] Module 1: Database initialized with extensions
- [x] Module 2: Schema file created and validated
- [x] Module 3: Schema deployed successfully
- [x] Module 4: Documentation complete
- [x] Module 5: All verifications passed

### Database Ready For:

1. ✅ Backend connection (SQLAlchemy with DATABASE_URL)
2. ✅ Data seeding (demo users and items via seed.py)
3. ✅ API operations (CRUD endpoints)
4. ✅ Future AI integration (V2 - embedding columns ready)

### Database Connection String

**For backend `.env` file:**

```ini
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/lostfound
```

**Replace `YOUR_PASSWORD` with your PostgreSQL postgres user password!**

### Final Smoke Test

```bash
# Quick health check - all should succeed
psql -U postgres -d lostfound -c "SELECT 'DB_OK' as status, current_database() as db_name, version() as pg_version;"
psql -U postgres -d lostfound -c "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';"
psql -U postgres -d lostfound -c "SELECT extname FROM pg_extension WHERE extname IN ('vector', 'pgcrypto');"
```

**Expected: No errors, 3 tables, 2 extensions**

### Next Step:

→ **Proceed to Backend Layer** (`lostfound_backend/tasks.md`)

**What you'll build next:**

- FastAPI server with SQLAlchemy ORM
- RESTful API endpoints (health, users, items, admin, upload)
- Database connection using the connection string above
- Seed script for demo data (2 users, 20 items)
- Complete API testing

---

## 📚 Reference

### Connection String Format

```
postgresql://username:password@host:port/database
```

**Example:**

```
postgresql://postgres:postgres@localhost:5432/lostfound
```

### Useful Commands

```bash
# List databases
psql -l

# Connect to database
psql -d lostfound

# List tables
\dt

# Describe table
\d items

# List indexes
\di

# Exit psql
\q

# Drop database (DANGER!)
dropdb lostfound

# Backup database
pg_dump lostfound > backup.sql

# Restore database
psql -d lostfound < backup.sql
```

---

**Database Layer Status: ✅ READY**
