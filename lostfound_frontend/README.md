# 🔍 Lost & Found Platform — Frontend MVP

> **Production-ready React + TypeScript application** with authentication, CRUD operations, admin moderation, and modern UX.

A full-featured Lost & Found web application built with cutting-edge technologies. Features include real-time search, role-based access control, user dashboards, admin moderation, and a beautiful responsive UI.

## ⚡ Complete Feature List

### 🔐 Authentication & Authorization System

**User Authentication:**

- **Login System**: Email/password authentication with form validation
- **Registration**: New user signup with password confirmation
- **Session Persistence**: localStorage-based session management (key: 'lostfound_auth')
- **Auto-Login**: Persists user session across browser refreshes
- **Logout**: Clear session and redirect to login
- **Mock Users**: Pre-configured test accounts (user@lostfound.com, admin@lostfound.com)

**Authorization & Access Control:**

- **Protected Routes**: ProtectedRoute HOC wraps sensitive pages
- **Role-Based Access**: User vs Admin role distinction
- **Admin-Only Pages**: Admin dashboard restricted with `requireAdmin` prop
- **Auth Guards**: Automatic redirect to login for unauthenticated users
- **Auth Context**: Global authentication state accessible via `useAuth()` hook
- **Conditional Navigation**: Header shows different links based on auth state and role

### 📊 User Dashboard (Protected Area)

**Personal Items Management:**

- **View Your Items**: Displays only items you reported (filtered by `reporter_id`)
- **Real-Time Stats**: Dashboard cards showing Total, Lost, and Found item counts
- **Grid Layout**: Responsive grid of your reported items with images
- **Empty State**: Helpful message with CTA when no items reported

**Full CRUD Operations:**

- **Create**: Report new lost/found items via dedicated forms
- **Read**: View all your items with full details
- **Update**: Edit item title, description, category, location, image URL, status
- **Delete**: Remove items with confirmation (uses React Query mutations)
- **Optimistic Updates**: UI updates immediately, rolls back on error
- **Cache Invalidation**: Automatically refreshes list after mutations
- **Toast Notifications**: Success/error feedback for all operations

### 👨‍💼 Admin Dashboard (Admin-Only)

**Moderation Workflow:**

- **Flagged Items View**: Table of items marked for review (is_flagged: true)
- **Approve Action**: Unflag items with one click (updates is_flagged to false)
- **Reject Action**: Delete items with confirmation dialog
- **Bulk Actions**: Process multiple items efficiently
- **Action Feedback**: Toast notifications for approve/reject operations

**Admin Overview:**

- **Statistics Cards**: Total items, flagged items, recently added counts
- **Complete Item Table**: All items in system with clickable thumbnails
- **Item Details**: Click image/title to navigate to detail page
- **Filtering**: View all items or just flagged items
- **Empty States**: Clear messaging when no flagged items exist
- **Real-Time Updates**: Cache invalidation keeps data fresh

### 🏠 Homepage (Public)

**Hero Section:**

- **Gradient Background**: Eye-catching purple-to-pink gradient
- **Call-to-Action**: Large "Browse Items" button
- **Value Proposition**: Clear messaging about platform purpose
- **Responsive Design**: Adapts to mobile, tablet, desktop

**Statistics Dashboard:**

- **Total Items**: Live count of all items in system
- **Lost Items**: Count of items marked as LOST
- **Found Items**: Count of items marked as FOUND
- **Visual Cards**: Color-coded cards with icons

**Recent Items Feed:**

- **Latest 6 Items**: Shows most recent submissions (default)
- **Sorting Dropdown**: Switch between "Newest First" and "Oldest First"
- **Load More Pagination**: Button to load additional items (6 at a time)
- **Item Cards**: Visual grid with images, titles, categories, locations
- **Click-to-Detail**: Navigate to full item page on card click

### 🔍 Lost Items Page (Public)

**Browse Lost Items:**

- **Filtered View**: Shows only items with status="LOST"
- **Search Bar**: Real-time search across title, description, location
- **Category Filter**: Dropdown with 7 categories (All, Electronics, Clothing, etc.)
- **Sorting**: Newest/Oldest toggle
- **Responsive Grid**: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- **Item Count**: Display total matching items
- **Empty State**: Helpful message when no items match filters
- **Click Navigation**: Navigate to detail page on item click

### 🎯 Found Items Page (Public)

**Browse Found Items:**

- **Filtered View**: Shows only items with status="FOUND"
- **Search Bar**: Real-time search across title, description, location
- **Category Filter**: Dropdown with 7 categories (All, Electronics, Clothing, etc.)
- **Sorting**: Newest/Oldest toggle
- **Responsive Grid**: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- **Item Count**: Display total matching items
- **Empty State**: Helpful message when no items match filters
- **Click Navigation**: Navigate to detail page on item click

### 📝 Item Detail Page (Public)

**Comprehensive Item View:**

- **Large Image**: Featured image at top with object-cover scaling
- **Status Badge**: Color-coded badge (red for LOST, green for FOUND)
- **Full Details**: Title, description, category, location, date reported
- **Contact Information**: Reporter name and email (clickable mailto link)
- **Flagged Indicator**: Warning badge if item is flagged for review
- **Back Navigation**: "← Back to Browse" button

**Interactive Actions:**

- **Contact Owner**: Button with toast notification (mock functionality)
- **Report Issue**: Button to flag inappropriate content (mock functionality)
- **Loading State**: Skeleton loader while fetching item data
- **Error Handling**: User-friendly error message if item not found
- **Responsive Layout**: Stacked on mobile, side-by-side on desktop

### 📋 Report Lost Item (Protected)

**Lost Item Submission Form:**

- **Title Field**: Text input with required validation
- **Description**: Textarea for detailed description (min 10 chars)
- **Category Dropdown**: 7 predefined categories
- **Location Field**: Text input for where item was lost
- **Image URL**: Optional field for item photo
- **Form Validation**: Real-time Zod schema validation
- **Error Messages**: Field-level error display
- **Submit Handler**: React Hook Form integration
- **Success Feedback**: Toast notification + redirect to dashboard
- **Auto Status**: Automatically sets status="LOST"

### 📋 Report Found Item (Protected)

**Found Item Submission Form:**

- **Title Field**: Text input with required validation
- **Description**: Textarea for detailed description (min 10 chars)
- **Category Dropdown**: 7 predefined categories
- **Location Field**: Text input for where item was found
- **Image URL**: Optional field for item photo
- **Form Validation**: Real-time Zod schema validation
- **Error Messages**: Field-level error display
- **Submit Handler**: React Hook Form integration
- **Success Feedback**: Toast notification + redirect to dashboard
- **Auto Status**: Automatically sets status="FOUND"

### 🔒 Login Page

**User Login Interface:**

- **Email Input**: With validation and error display
- **Password Input**: Secure input type
- **Remember Me**: (UI only, not functional in MVP)
- **Form Validation**: Zod schema with React Hook Form
- **Submit Handler**: Mock authentication via api.login()
- **Error Handling**: Display backend errors (invalid credentials)
- **Success Redirect**: Navigate to dashboard on successful login
- **Registration Link**: Link to switch to register page
- **Responsive Form**: Mobile-optimized layout

### 📝 Register Page

**User Registration Interface:**

- **Name Input**: Full name field with validation
- **Email Input**: Email format validation
- **Password Input**: Minimum length validation
- **Confirm Password**: Must match password field
- **Form Validation**: Comprehensive Zod schema
- **Submit Handler**: Mock registration via api.register()
- **Error Handling**: Display backend errors (email exists)
- **Success Flow**: Auto-login + navigate to dashboard
- **Login Link**: Link to switch to login page
- **Responsive Form**: Mobile-optimized layout

### 🚫 404 Not Found Page

**Custom Error Page:**

- **Gradient Background**: Consistent with brand theme
- **Large 404 Icon**: Visual indicator of error
- **Friendly Message**: "Oops! Page not found"
- **Navigation Buttons**: "Go Home" and "Browse Items"
- **Quick Links**: Popular pages (Lost Items, Found Items, Dashboard)
- **Responsive Design**: Centered layout on all devices
- **Automatic Trigger**: Catches all invalid routes with wildcard `*`

### 🎨 UI/UX Features

**Component Library:**

- **Button Component**: 3 variants (primary, secondary, danger) with disabled state
- **Input Component**: Label, placeholder, error message support
- **Select Component**: Dropdown with label and dynamic options
- **Textarea Component**: Multi-line input with label and error display
- **Consistent Styling**: All components use Tailwind utility classes

**Loading States:**

- **Skeleton Screens**: Placeholder cards while data loads
- **Spinner Indicators**: Loading spinner for async operations
- **Disabled Buttons**: Prevent double-submission during mutations
- **Query Status**: React Query isLoading, isError states

**Empty States:**

- **No Items Found**: Helpful messages when searches return nothing
- **No Personal Items**: CTA to report first item in dashboard
- **No Flagged Items**: Success message in admin panel
- **Search No Results**: Suggestions to adjust filters

**Responsive Design:**

- **Mobile First**: Base styles optimized for mobile (320px+)
- **Tablet Breakpoint**: 2-column grids at md: (768px+)
- **Desktop Breakpoint**: 3-column grids at lg: (1024px+)
- **Flexible Navigation**: Hamburger menu on mobile (if implemented)
- **Touch Targets**: Buttons sized for touch on mobile (min 44px)

**Animations & Interactions:**

- **Hover Effects**: Scale, shadow, color transitions on cards/buttons
- **Smooth Transitions**: CSS transitions for all interactive elements
- **Toast Animations**: Slide-in notifications with auto-dismiss
- **Loading Skeletons**: Pulsing animation during data fetch
- **Form Focus States**: Visual feedback on input focus

**Accessibility Features:**

- **Semantic HTML**: Proper heading hierarchy, form labels
- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: Tab order and Enter key support
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Color Contrast**: WCAG compliant text/background contrast

## 🛠️ Tech Stack

## ⚡ Core Features

### 🔐 Authentication & Authorization

- Mock login/register with session persistence (localStorage)
- Protected routes (Dashboard, Admin)
- Role-based access control (User/Admin)
- Auto-redirect and logout functionality

### 📊 User Dashboard

- View personal items (filtered by `reporter_id`)
- **Full CRUD**: Create, Edit, Delete own items
- Real-time stats (Total, Lost, Found)
- Toast notifications for all actions

### 👨‍💼 Admin Panel

- Moderation dashboard (admin-only access)
- Approve/Reject flagged items
- Complete item table with filtering
- Real-time cache invalidation

### 🔍 Browse & Search

- Advanced search (title, description, location)
- Category filtering (7 categories)
- Sorting (Newest/Oldest)
- Pagination ("Load More")
- Item detail pages with full information

### 🎨 Modern UX

- Responsive design (mobile, tablet, desktop)
- Smooth animations and hover effects
- Loading skeletons
- Empty states with CTAs
- Custom 404 page
- Toast feedback system

## �️ Tech Stack

| Layer       | Technology                                 |
| ----------- | ------------------------------------------ |
| **Core**    | React 18.2.0, TypeScript 5.4.5, Vite 5.2.4 |
| **Routing** | React Router 6.22.3 (protected routes)     |
| **State**   | TanStack Query 5.28.4 (caching, mutations) |
| **Styling** | Tailwind CSS 3.4.1 (utility-first)         |
| **Forms**   | React Hook Form 7.51.2 + Zod 3.22.4        |
| **UI/UX**   | React Hot Toast 2.4.1 (notifications)      |
| **API**     | Mock REST API (easily swappable)           |

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → Opens at http://localhost:5173

# 3. Build for production
npm run build && npm run preview
```

**Demo Credentials:**

- User: `user@lostfound.com` / `user123`
- Admin: `admin@lostfound.com` / `admin123`

## 📂 Complete Project Structure

```
lostfound_frontend/
├── public/                          # Static assets served directly
│   └── vite.svg                    # Vite logo
│
├── src/                            # Source code root
│   ├── main.tsx                   # App entry point, React render
│   ├── App.tsx                    # Root component with routing
│   ├── App.css                    # Global app styles
│   ├── index.css                  # Tailwind imports & global CSS
│   │
│   ├── pages/                     # Route-level page components (11 pages)
│   │   ├── HomePage.tsx          # Landing page with hero, stats, recent items, sorting
│   │   ├── LostItemsPage.tsx     # Browse lost items with search, filters, sorting
│   │   ├── FoundItemsPage.tsx    # Browse found items with search, filters, sorting
│   │   ├── ItemDetailPage.tsx    # Single item view with full details, contact button
│   │   ├── ReportLostPage.tsx    # Form to report a lost item (protected)
│   │   ├── ReportFoundPage.tsx   # Form to report a found item (protected)
│   │   ├── DashboardPage.tsx     # User dashboard with personal items CRUD (protected)
│   │   ├── AdminDashboard.tsx    # Admin moderation panel (admin-only)
│   │   ├── LoginPage.tsx         # User login with form validation
│   │   ├── RegisterPage.tsx      # User registration with form validation
│   │   └── NotFoundPage.tsx      # Custom 404 error page
│   │
│   ├── components/                # Reusable UI components
│   │   ├── ProtectedRoute.tsx    # HOC for route protection with role checks
│   │   ├── Layout.tsx            # Legacy layout wrapper
│   │   │
│   │   ├── layout/               # App-wide layout components
│   │   │   ├── Header.tsx       # Navigation bar with auth state, role-based links
│   │   │   ├── Footer.tsx       # Site footer with links and credits
│   │   │   └── MainLayout.tsx   # Page wrapper with Header + Footer + Outlet
│   │   │
│   │   ├── ui/                   # Primitive UI components (form controls)
│   │   │   ├── Button.tsx       # Reusable button with variants (primary, secondary, danger)
│   │   │   ├── Input.tsx        # Text input with label and error support
│   │   │   ├── Textarea.tsx     # Multi-line text input with label
│   │   │   └── Select.tsx       # Dropdown select with label and options
│   │   │
│   │   ├── items/                # Item-specific feature components
│   │   │   ├── ItemCard.tsx     # Item card for grid display (image, title, status)
│   │   │   ├── ItemList.tsx     # Grid container for multiple ItemCards
│   │   │   └── ItemForm.tsx     # Form for creating/editing items with validation
│   │   │
│   │   ├── admin/                # Admin-specific components
│   │   │   ├── AdminItemTable.tsx  # Table wrapper for admin dashboard
│   │   │   └── AdminItemRow.tsx    # Single row in admin table with actions
│   │   │
│   │   └── search/               # Search feature components
│   │       └── SearchBar.tsx    # Search input with real-time filtering
│   │
│   ├── lib/                      # Core utilities and business logic
│   │   ├── api.ts               # Mock REST API layer (auth, CRUD, 10 sample items)
│   │   │                        # Functions: login, register, getItems, getItemById,
│   │   │                        # createItem, updateItem, deleteItem
│   │   ├── hooks.ts             # React Query custom hooks
│   │   │                        # Hooks: useAuth, useItems, useItemById, useCreateItem,
│   │   │                        # useUpdateItem, useDeleteItem
│   │   └── utils.ts             # Helper utilities
│   │                            # Functions: cn (classNames), formatDate, ITEM_CATEGORIES
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── IItem.ts             # Interfaces: IItem, IItemCreate, IUser, IAuthResponse
│   │
│   └── assets/                   # Media assets (images, icons, etc.)
│
├── .gitignore                    # Git ignore rules (node_modules, dist, .env)
├── eslint.config.js              # ESLint configuration for code quality
├── index.html                    # HTML entry point (Vite injects scripts here)
├── package.json                  # Dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── postcss.config.js             # PostCSS config for Tailwind CSS
├── progress.md                   # Development progress log
├── README.md                     # Project documentation (this file)
├── start-dev.sh                  # Bash script to start dev server
├── tailwind.config.js            # Tailwind CSS configuration (colors, themes)
├── tsconfig.json                 # TypeScript root config
├── tsconfig.app.json             # TypeScript config for app code
├── tsconfig.node.json            # TypeScript config for Node scripts
└── vite.config.ts                # Vite build tool configuration
```

## � Technical Highlights

- **11 Routes** — Public pages, protected user dashboard, admin panel, custom 404
- **Protected Routes** — HOC pattern with role-based access (requireAdmin prop)
- **Type Safety** — Full TypeScript coverage with strict mode
- **State Caching** — TanStack Query for optimistic updates & cache invalidation
- **Form Validation** — Zod schemas with React Hook Form integration
- **Responsive Design** — Mobile-first with Tailwind breakpoints
- **Mock API Ready** — Swap `api.ts` with real backend in minutes
- **Production Build** — Zero errors, optimized bundle, ready to deploy

## � Deployment

```bash
npm run build  # → dist/ folder ready for hosting
```

**Deploy to:**

- **Vercel/Netlify** — Zero-config, auto HTTPS, global CDN
- **Any static host** — Serve `dist/` folder, configure SPA routing

**Backend Integration:**
Replace mock functions in `src/lib/api.ts` with real endpoints. No other changes needed thanks to abstraction layer.

## 🎯 What's Built

| Feature Category                              | Status      |
| --------------------------------------------- | ----------- |
| Public Pages (Home, Lost, Found, Detail)      | ✅ Complete |
| Authentication (Login, Register, Session)     | ✅ Complete |
| User Dashboard (CRUD your items)              | ✅ Complete |
| Admin Dashboard (Moderation, Approve/Reject)  | ✅ Complete |
| Search & Filters (Category, Status, Location) | ✅ Complete |
| Sorting & Pagination                          | ✅ Complete |
| Form Validation (Zod schemas)                 | ✅ Complete |
| Responsive Design (Mobile-first)              | ✅ Complete |
| Loading & Error States                        | ✅ Complete |
| Toast Notifications                           | ✅ Complete |
| Custom 404 Page                               | ✅ Complete |

**Production Status:** Zero TypeScript errors, optimized build, ready for deployment.

---

## � License

MIT — Free to use, modify, and distribute.

---

**Built with ❤️ as a production-ready MVP showcasing modern React architecture.**
