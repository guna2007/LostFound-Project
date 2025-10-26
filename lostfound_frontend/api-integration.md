# 🟢 Lost & Found Platform — API Integration Plan (Agentic AI Prompt)

> This document is a step-by-step, module-wise plan for integrating the FastAPI backend with the React/TypeScript frontend. Each module must be verified before proceeding to the next. The goal is to achieve seamless, production-ready integration for V1, preserving all existing frontend features and code structure.

---

## Here after each module check by npm run dev, and proceed if all built are rendering correctly!

## 📦 Project Context & Features

- **Frontend:** React + TypeScript + Vite, modular components, pages, hooks, and types
- **Backend:** FastAPI + Python, RESTful endpoints, Pydantic schemas, SQLAlchemy ORM,use venv in there if doing any code changes
- **Database:** PostgreSQL 17.6 + pgvector, AI-ready schema, demo data
- **Features:** User auth, item CRUD, search/filter, admin moderation, image upload, dashboards, statistics, responsive UI, accessibility
- **Goal:** Integrate backend API with frontend, ensure all features work, and code remains clean and maintainable

---

## 🧩 Module-Wise Integration Plan

### **Module 1: API Client Setup & Compatibility Check**

- Review and update `src/lib/api.ts` to use backend endpoints and correct BASE_URL
- Ensure all API functions match backend request/response formats (UUIDs as strings, dates as ISO, etc.)
- Update TypeScript types in `src/types/IItem.ts` and related files to match backend schemas
- Test API functions with sample calls (console logs, browser dev tools)
- **Verification:** Run frontend, check for type errors and successful API responses

---

### **Module 2: Item List Integration (Lost & Found Pages)**

- Connect `LostItemsPage.tsx` and `FoundItemsPage.tsx` to backend `/items` endpoint
- Implement pagination, search, and filters using backend query params
- Display items using `ItemCard` component with live data
- **Verification:** Run frontend, verify items load, filters work, and UI matches expected data

---

### **Module 3: Item Detail Integration**

- Connect `ItemDetailPage.tsx` to backend `/items/{id}` endpoint
- Display all item fields, including image, contact info, and AI fields (if present)
- Handle error states (404, network errors)
- **Verification:** Run frontend, open item detail pages, check for correct data and error handling

---

### **Module 4: Item Creation & Image Upload**

- Connect `ReportLostPage.tsx` and `ReportFoundPage.tsx` to backend `POST /items` and `POST /items/upload` endpoints
- Validate form fields before submission, match backend requirements
- Handle image upload and associate image URL with item
- Show success/error messages on submission
- **Verification:** Run frontend, create lost/found items, upload images, verify in backend and UI

---

### **Module 5: Item Update & Delete**

- Connect edit and delete actions in dashboard and item detail pages to backend `PATCH /items/{id}` and `DELETE /items/{id}` endpoints
- Ensure only item owner can edit/delete
- Update UI on success, handle errors
- **Verification:** Run frontend, edit and delete items, check backend and UI for updates

---

### **Module 6: User Dashboard Integration**

- Connect `DashboardPage.tsx` to fetch user’s items from backend (`/items?reporter_id={userId}`)
- Display statistics, item history, and quick actions
- **Verification:** Run frontend, verify dashboard loads correct data and actions work

---

### **Module 7: Admin Features Integration**

- Connect `AdminDashboard.tsx` to backend moderation endpoints (`/items?is_flagged=true`, `/admin/items/{id}/approve`, `/admin/items/{id}`)
- Implement approve/reject actions, update UI accordingly
- **Verification:** Run frontend, moderate items, verify backend and UI reflect changes

---

### **Module 8: User Authentication Integration**

- Connect `LoginPage.tsx` and `RegisterPage.tsx` to backend user endpoints (`POST /users`, future: `/auth/login`)
- Store user session/token (if implemented), handle errors and redirects
- **Verification:** Run frontend, register/login users, check session persistence and access control

---

### **Module 9: Error Handling & UI Feedback** ✅ COMPLETE

- ✅ Centralized toast notifications (`src/lib/ui/toast.ts`)
- ✅ Global ErrorBoundary component (`src/components/ErrorBoundary.tsx`)
- ✅ API error normalization (`getApiErrorMessage` in `src/lib/utils.ts`)
- ✅ Safe fallback error handling for list endpoints
- ✅ Standardized Loading component across pages
- ✅ Consistent error messages and success notifications
- **Verification:** ✅ Build passes, all toasts centralized, UX polished

---

### **Module 10: Final Testing & Documentation** ✅ COMPLETE

- ✅ Updated all README.md files with integration steps
- ✅ Updated progress.md with Module 9 completion
- ✅ Final build verification (production-ready)
- ✅ Code cleanup and optimization
- ✅ Documentation complete for deployment
- **Verification:** ✅ Full regression test passed, ready for production

---

## 🟢 **Agentic AI Instructions**

- For each module:
  1. Read the context and requirements
  2. Make only the necessary changes to integrate backend API
  3. Do not break or overwrite existing frontend features/components
  4. After each module, run the code and verify all features before proceeding
  5. If errors occur, fix them before moving to the next module
  6. Document changes and update README as needed

---

**This plan ensures robust, stepwise integration of backend API with the existing frontend, maintaining code quality and feature completeness for V1.**
