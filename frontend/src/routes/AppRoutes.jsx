import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

// Auth & Setup Pages
import Splash from '../pages/Splash';
import Login from '../pages/Login';
import RegisterAccount from '../pages/RegisterAccount';

// Dashboard Modules
import Dashboard from '../pages/Dashboard';
import Rooms from '../pages/Rooms';
import Bookings from '../pages/Bookings';
import Guests from '../pages/Guests';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import HotelInfo from '../pages/HotelInfo';

const ProtectedRoute = ({ element, requiredPermission }) => {
  const sessionData = localStorage.getItem('helloStay_session');
  if (!sessionData) return <Navigate to="/login" replace />;

  const session = JSON.parse(sessionData);
  const permissions = session.permissions || [];
  const role = session.role || '';
  
  if (role === 'Owner' || permissions.includes('Full Access')) return element;
  
  if (requiredPermission && !permissions.includes(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return element;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Entry Point */}
      <Route path="/" element={<Splash />} />

      {/* Standalone Pages (No Sidebar Layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register-account" element={<RegisterAccount />} />
      
      {/* Protected Routes inside MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/rooms" element={<ProtectedRoute element={<Rooms />} requiredPermission="Rooms" />} />
        <Route path="/bookings" element={<ProtectedRoute element={<Bookings />} requiredPermission="Bookings" />} />
        <Route path="/guests" element={<ProtectedRoute element={<Guests />} requiredPermission="Guests" />} />
        <Route path="/settings" element={<ProtectedRoute element={<Settings />} requiredPermission="Settings" />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/hotel-info" element={<ProtectedRoute element={<HotelInfo />} requiredPermission="Hotel Information" />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
