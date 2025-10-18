import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import LostItemsPage from '@/pages/LostItemsPage';
import FoundItemsPage from '@/pages/FoundItemsPage';
import ReportLostPage from '@/pages/ReportLostPage';
import ReportFoundPage from '@/pages/ReportFoundPage';
import DashboardPage from '@/pages/DashboardPage';
import AdminDashboard from '@/pages/AdminDashboard';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ItemDetailPage from '@/pages/ItemDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="lost" element={<LostItemsPage />} />
          <Route path="found" element={<FoundItemsPage />} />
          <Route path="item/:id" element={<ItemDetailPage />} />
          <Route path="report-lost" element={<ReportLostPage />} />
          <Route path="report-found" element={<ReportFoundPage />} />
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
