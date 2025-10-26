# 🚀 Deployment Guide - Lost & Found Platform

## Overview

This guide covers deploying the Lost & Found platform to production, including frontend (React), backend (FastAPI), and database (PostgreSQL).

---

## 📋 Pre-Deployment Checklist

### Code Quality

- [x] All TypeScript errors resolved
- [x] Production build passes (`npm run build`)
- [x] No console errors in browser
- [x] All API endpoints tested
- [x] Error handling implemented
- [x] Loading states working
- [x] Toast notifications functional

### Configuration

- [ ] Environment variables documented
- [ ] CORS origins configured
- [ ] Database connection string ready
- [ ] Secret keys generated
- [ ] API base URL configured

### Testing

- [ ] All user flows tested manually
- [ ] Admin features tested
- [ ] Authentication tested
- [ ] CRUD operations tested
- [ ] Cross-browser testing
- [ ] Mobile responsiveness tested

---

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

**Steps:**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Navigate to frontend
cd lostfound_frontend

# 3. Build locally (optional verification)
npm run build

# 4. Deploy to Vercel
vercel --prod
```

**Environment Variables (Vercel Dashboard):**

- `VITE_API_BASE_URL` → Your backend URL (e.g., `https://api.yourapp.com`)

**Build Configuration:**

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Option 2: Netlify

**Steps:**

```bash
# 1. Build
cd lostfound_frontend
npm run build

# 2. Deploy via Netlify CLI or drag dist/ folder to netlify.com
netlify deploy --prod --dir=dist
```

**netlify.toml:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Environment Variables (Netlify Dashboard):**

- `VITE_API_BASE_URL` → Your backend URL

### Option 3: GitHub Pages (Static Only)

**Steps:**

```bash
# 1. Update vite.config.ts
export default defineConfig({
  base: '/repository-name/'
})

# 2. Build and deploy
npm run build
npx gh-pages -d dist
```

---

## ⚙️ Backend Deployment

### Option 1: Railway (Recommended)

**Steps:**

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Navigate to backend
cd lostfound_backend

# 4. Initialize project
railway init

# 5. Deploy
railway up
```

**Environment Variables (Railway Dashboard):**

- `DATABASE_URL` → Auto-configured by Railway PostgreSQL addon
- `CORS_ORIGINS` → `https://yourfrontend.vercel.app,https://yourapp.com`
- `PORT` → `8000` (or Railway default)

**Procfile:**

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Option 2: Render

**render.yaml:**

```yaml
services:
  - type: web
    name: lostfound-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: lostfound-db
          property: connectionString
      - key: CORS_ORIGINS
        value: https://yourfrontend.vercel.app

databases:
  - name: lostfound-db
    databaseName: lostfound
    user: postgres
    plan: free
```

### Option 3: Heroku

**Steps:**

```bash
# 1. Create app
heroku create lostfound-backend

# 2. Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# 3. Set environment variables
heroku config:set CORS_ORIGINS=https://yourfrontend.vercel.app

# 4. Deploy
git push heroku main

# 5. Run migrations
heroku run python seed.py
```

**Procfile:**

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## 🗄️ Database Deployment

### Option 1: Railway PostgreSQL

**Steps:**

1. In Railway dashboard, click "New" → "Database" → "PostgreSQL"
2. Railway auto-generates `DATABASE_URL`
3. Connect to database:
   ```bash
   railway connect
   psql $DATABASE_URL
   ```
4. Enable extensions:
   ```sql
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
5. Run schema:
   ```bash
   psql $DATABASE_URL -f lostfound_db/schema.sql
   ```

### Option 2: Render PostgreSQL

**Steps:**

1. Create PostgreSQL instance in Render dashboard
2. Copy "External Database URL"
3. Set as `DATABASE_URL` in backend environment
4. Connect and run schema:
   ```bash
   psql <external-database-url> -f lostfound_db/schema.sql
   ```

### Option 3: Supabase

**Steps:**

1. Create project at supabase.com
2. Get connection string from Settings → Database
3. Update backend `DATABASE_URL`
4. Run schema via SQL Editor or psql

---

## 🔧 Environment Variables Reference

### Frontend (.env)

```bash
VITE_API_BASE_URL=https://your-backend.railway.app
```

### Backend (.env)

```bash
DATABASE_URL=postgresql://user:password@host:port/database
CORS_ORIGINS=https://yourfrontend.vercel.app,https://www.yourapp.com
PORT=8000
SECRET_KEY=your-random-secret-key-here
```

---

## 🧪 Post-Deployment Testing

### Smoke Tests

1. **Frontend loads:** Visit frontend URL
2. **API health:** Visit `https://api.yourapp.com/health`
3. **Swagger docs:** Visit `https://api.yourapp.com/docs`
4. **Login:** Test with demo credentials
5. **CRUD:** Create, edit, delete items
6. **Admin:** Test moderation features

### Performance Tests

```bash
# Lighthouse audit
npm i -g lighthouse
lighthouse https://yourapp.com --view

# Load testing (optional)
npm i -g artillery
artillery quick --count 10 -n 20 https://api.yourapp.com/health
```

---

## 📊 Monitoring & Maintenance

### Error Tracking

**Sentry (Recommended):**

```bash
npm install @sentry/react @sentry/vite-plugin

# In main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

### Analytics

**Google Analytics:**

```html
<!-- In index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

### Uptime Monitoring

- **UptimeRobot:** Free uptime checks every 5 minutes
- **Pingdom:** Advanced monitoring with alerts
- **Railway/Render:** Built-in health checks

### Database Backups

**Automated backups:**

```bash
# Railway: Automatic daily backups (paid plans)
# Render: Automatic backups
# Manual backup:
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

---

## 🐛 Troubleshooting

### Issue: CORS errors in production

**Solution:**

```python
# In lostfound_backend/main.py
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: Frontend can't connect to backend

**Check:**

1. `VITE_API_BASE_URL` is correct (no trailing slash)
2. Backend is running: `curl https://api.yourapp.com/health`
3. CORS is configured with frontend URL
4. Network tab shows actual request URL

### Issue: Database connection fails

**Check:**

1. `DATABASE_URL` format: `postgresql://user:password@host:port/database`
2. Database extensions enabled (pgcrypto, vector)
3. Firewall allows connections
4. SSL mode correct (`?sslmode=require` for cloud databases)

### Issue: Build fails on deployment

**Check:**

1. Node version matches local (check `.nvmrc` or `package.json` engines)
2. All dependencies in `package.json`
3. Build command correct in platform config
4. Environment variables set correctly

---

## 🔒 Security Checklist

- [ ] HTTPS enabled (automatic on Vercel/Netlify/Railway)
- [ ] Environment variables not committed to git
- [ ] CORS restricted to actual domain(s)
- [ ] SQL injection protection (use parameterized queries)
- [ ] XSS protection (React auto-escapes)
- [ ] Rate limiting on API (optional: use Cloudflare)
- [ ] Database backups configured
- [ ] Error messages don't leak sensitive info
- [ ] File upload validation (size, type)
- [ ] Admin routes require authentication

---

## 📈 Performance Optimization

### Frontend

- [x] Code splitting (Vite automatic)
- [x] Tree shaking (Vite automatic)
- [x] Minification (Vite automatic)
- [ ] Image optimization (use CDN like Cloudinary)
- [ ] Service worker (PWA)
- [ ] Lazy loading images

### Backend

- [ ] Database query optimization (indexes)
- [ ] Response caching (Redis)
- [ ] Static file CDN
- [ ] Connection pooling
- [ ] Gzip compression

---

## 🎯 Quick Deploy Commands

### Full Stack Deployment (Railway + Vercel)

**Backend:**

```bash
cd lostfound_backend
railway login
railway init
railway add
railway up
# Get backend URL from Railway dashboard
```

**Frontend:**

```bash
cd lostfound_frontend
# Update .env with backend URL
echo "VITE_API_BASE_URL=https://your-backend.railway.app" > .env.production
npm run build
vercel --prod
```

### Update Deployment

```bash
# Frontend
cd lostfound_frontend
npm run build
vercel --prod

# Backend
cd lostfound_backend
git push heroku main  # or railway up
```

---

## 📞 Support

**Issues:** Check GitHub Issues or create a new one  
**Docs:** See README.md and progress.md  
**API Docs:** https://your-backend.com/docs

---

**Deployment Complete! 🎉**

Monitor your application and iterate based on user feedback. Good luck!
