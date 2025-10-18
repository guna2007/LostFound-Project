import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import HomePage from '@/pages/HomePage';
import LostItemsPage from '@/pages/LostItemsPage';
import FoundItemsPage from '@/pages/FoundItemsPage';
import ReportLostPage from '@/pages/ReportLostPage';
import ReportFoundPage from '@/pages/ReportFoundPage';
import DashboardPage from '@/pages/DashboardPage';
import AdminDashboard from '@/pages/AdminDashboard';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="lost" element={<LostItemsPage />} />
          <Route path="found" element={<FoundItemsPage />} />
          <Route path="report-lost" element={<ReportLostPage />} />
          <Route path="report-found" element={<ReportFoundPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
