# 🔍 Lost & Found Platform

A modern, production-ready Lost & Found application connecting people with their belongings through an intuitive web interface.

## 🌟 Overview

Lost & Found Platform is a comprehensive web application designed to help people report and find lost items. Built with modern web technologies, it features a beautiful UI, real-time search and filtering, and a seamless user experience across all devices.

## ✨ Key Features

### For Users

- **Browse Items** - View all lost and found items with an elegant card-based interface
- **Advanced Search** - Search by title, description, or location with instant results
- **Category Filtering** - Filter items by category (Electronics, Clothing, Accessories, Documents, etc.)
- **Report Items** - Easy-to-use forms to report lost or found items
- **Item Details** - Click on any item to view full details in a modal
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **User Dashboard** - Manage your reported items in one place

### For Administrators

- **Admin Dashboard** - Review and manage flagged items
- **Moderation Tools** - Approve, flag, or remove inappropriate items
- **Analytics** - View statistics on total, lost, and found items

### UI/UX Highlights

- **Modern Design** - Beautiful gradients, smooth animations, and hover effects
- **Loading States** - Skeleton screens for better perceived performance
- **Empty States** - Helpful messages and illustrations when no items are found
- **Interactive Cards** - Hover effects and smooth transitions
- **Modal Dialogs** - View item details without leaving the page
- **Toast Notifications** - User-friendly feedback for actions

## 🚀 Tech Stack

| Category             | Technology                          |
| -------------------- | ----------------------------------- |
| **Framework**        | React 18.2.0 with TypeScript        |
| **Routing**          | React Router 6.22.3                 |
| **Styling**          | Tailwind CSS 3.4.1                  |
| **State Management** | TanStack Query (React Query) 5.28.4 |
| **Forms**            | React Hook Form 7.51.2 + Zod 3.22.4 |
| **Build Tool**       | Vite 5.2.4                          |
| **Notifications**    | React Hot Toast 2.4.1               |
| **API**              | Mock API (development/demo mode)    |

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd lostfound_app/lostfound_frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production Build
npm run build        # Build for production
npm run preview      # Preview production build locally

# Linting
npm run lint         # Check code quality
```

## 🗂️ Project Structure

```
lostfound_frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Header, Footer, MainLayout
│   │   └── ui/             # Button, Input, Select, Textarea
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── LostItemsPage.tsx
│   │   ├── FoundItemsPage.tsx
│   │   ├── ReportLostPage.tsx
│   │   ├── ReportFoundPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── lib/                # Utilities and hooks
│   │   ├── api.ts         # API functions (mock)
│   │   ├── hooks.ts       # React Query hooks
│   │   └── utils.ts       # Helper functions
│   ├── types/             # TypeScript types
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## 🌐 Routes & Pages

| Route           | Page            | Description                                     |
| --------------- | --------------- | ----------------------------------------------- |
| `/`             | Home            | Landing page with hero, stats, and recent items |
| `/lost`         | Lost Items      | Browse and search lost items with filters       |
| `/found`        | Found Items     | Browse and search found items with filters      |
| `/report-lost`  | Report Lost     | Form to report a lost item                      |
| `/report-found` | Report Found    | Form to report a found item                     |
| `/dashboard`    | User Dashboard  | Manage your reported items                      |
| `/admin`        | Admin Dashboard | Admin panel for managing flagged items          |
| `/login`        | Login           | User authentication (mock)                      |
| `/register`     | Register        | User registration (mock)                        |

## 🔧 API & Data

### Mock API (Current Implementation)

The application currently uses a **mock API** for development and demonstration:

- **Location:** `src/lib/api.ts`
- **Sample Data:** 10 pre-loaded items with images
- **Delay Simulation:** 500ms to mimic real API
- **No Backend Required:** Perfect for prototyping and demos

### Mock Data Structure

```typescript
interface IItem {
  id: number;
  title: string;
  description: string;
  ai_category: string; // Electronics, Clothing, Accessories, etc.
  location: string;
  image_url: string;
  status: "LOST" | "FOUND";
  user_id: number;
  is_flagged: boolean;
  created_at: string;
}
```

### Connecting to a Real Backend

To connect to a production backend, replace mock functions in `src/lib/api.ts`:

```typescript
// Example: Replace mock with real API calls
export const getItems = async () => {
  const response = await fetch("https://your-api.com/api/items");
  return response.json();
};
```

## 🎨 Customization

### Tailwind Configuration

Modify colors, fonts, and breakpoints in `tailwind.config.js`:

```js
export default {
  theme: {
    extend: {
      colors: {
        primary: "#your-color",
        // Add custom colors
      },
    },
  },
};
```

### Item Categories

Add or modify categories in `src/lib/utils.ts`:

```typescript
export const ITEM_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Documents",
  "Books",
  // Add more categories
];
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Deployment Options

#### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Traditional Hosting

1. Run `npm run build`
2. Upload `dist/` folder to your hosting provider
3. Configure server to serve `index.html` for all routes

### Environment Variables

For production, create `.env.production`:

```bash
VITE_API_URL=https://your-backend-api.com
VITE_APP_NAME=Lost & Found Platform
```

Access in code:

```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] All pages load without errors
- [ ] Search and filter work on Lost/Found pages
- [ ] Forms validate inputs correctly
- [ ] Modal opens and closes properly
- [ ] Navigation between pages works
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Loading states display correctly
- [ ] Empty states show helpful messages

## 🔒 Security Considerations

### Current Status (MVP)

- Mock authentication (no real security)
- Client-side only
- No sensitive data storage

### For Production

- [ ] Implement real authentication (JWT, OAuth)
- [ ] Add HTTPS/SSL certificates
- [ ] Sanitize user inputs
- [ ] Add CSRF protection
- [ ] Implement rate limiting
- [ ] Secure API endpoints
- [ ] Add user permissions/roles

## 📈 Performance

### Optimization Features

- **Code Splitting** - Automatic via Vite
- **Lazy Loading** - Images and routes
- **Caching** - React Query caching
- **Minification** - Production builds are minified
- **Tree Shaking** - Unused code removed

### Performance Tips

- Images are optimized via placeholder URLs
- Skeleton screens improve perceived performance
- Debounced search for better UX
- Memoized filters to prevent unnecessary re-renders

## 🤝 Contributing

### Development Workflow

1. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Test thoroughly

4. Commit with clear messages

```bash
git commit -m "feat: add advanced search functionality"
```

5. Push and create a pull request

```bash
git push origin feature/your-feature-name
```

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support & Troubleshooting

### Common Issues

**Issue: Blank page on load**

- Ensure all dependencies are installed: `npm install`
- Check browser console for errors
- Try clearing cache and rebuilding: `npm run build`

**Issue: Tailwind styles not working**

- Verify `tailwind.config.js` is configured correctly
- Check that `index.css` imports Tailwind directives
- Restart dev server after config changes

**Issue: TypeScript errors**

- Run `npm run build` to see all errors
- Check `tsconfig.json` configuration
- Ensure all types are properly imported

### Getting Help

- Check the documentation in `src/` files
- Review component examples in `src/pages/`
- Inspect browser console for errors
- Verify network requests in DevTools

## 🎯 Roadmap

### Future Enhancements

- [ ] Real-time chat for item discussions
- [ ] Image upload with drag-and-drop
- [ ] Email notifications for matches
- [ ] Advanced filtering (date range, radius search)
- [ ] User ratings and reviews
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)
- [ ] AI-powered image recognition
- [ ] Integration with campus/organization systems

## 📞 Contact

For questions, issues, or feature requests, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

- 10 pre-populated items
- 500ms latency simulation
- Full CRUD operations (in-memory)
- No backend server required

### Mock Data Storage

All data is stored in memory and resets on page refresh. This is intentional for MVP demonstration.

## 🚀 V2 Backend Integration (Future)

To integrate with a real backend:

1. Update `src/lib/api.ts` to use `axios` with real API endpoints
2. Replace mock functions with actual HTTP calls
3. Add authentication tokens to requests
4. Update `useItems`, `useCreateItem`, etc. hooks
5. No changes needed in components!

Example:

```typescript
// Current (Mock)
export const getItems = async (): Promise<IItem[]> => {
  await delay(500);
  return mockItems;
};

// Future (Real API)
export const getItems = async (): Promise<IItem[]> => {
  const response = await axios.get("/api/items");
  return response.data;
};
```

## 📱 Responsive Breakpoints

- Mobile: 320px - 640px (1 column)
- Tablet: 641px - 1024px (2 columns)
- Desktop: 1025px+ (3 columns)

## 🎯 Key Features Showcase

### For Recruiters

This project demonstrates:

- ✅ Modern React patterns (hooks, context, custom hooks)
- ✅ TypeScript strict mode
- ✅ Component composition and reusability
- ✅ Form validation with Zod
- ✅ Async state management with React Query
- ✅ Responsive design best practices
- ✅ Clean code architecture
- ✅ Mock API abstraction (easy to swap with real backend)

## 🐛 Known Limitations (MVP)

- No real authentication (mock only)
- No image uploads (placeholder only)
- No real database (in-memory mock)
- No email notifications
- No user profile pages

## 📄 License

MIT

## 👨‍💻 Author

[Your Name]

---

**Note:** This is an MVP built for demonstration and portfolio purposes. A production version would include real backend integration, authentication, file uploads, and database persistence.
