import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

// Auth & Setup Pages
import Installer from '../pages/Installer';
import Login from '../pages/Login';
import RegisterOwner from '../pages/RegisterOwner';
import RegisterHotel from '../pages/RegisterHotel';
import RegisterEmployee from '../pages/RegisterEmployee';

// Dashboard Modules
import Dashboard from '../pages/Dashboard';
import Rooms from '../pages/Rooms';
import Bookings from '../pages/Bookings';
import Guests from '../pages/Guests';
import Employees from '../pages/Employees';
import HRPayroll from '../pages/HRPayroll';
import Expenses from '../pages/Expenses';
import Inventory from '../pages/Inventory';
import Restaurant from '../pages/Restaurant';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Standalone Pages (No Sidebar Layout) */}
      <Route path="/installer" element={<Installer />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register-owner" element={<RegisterOwner />} />
      <Route path="/register-hotel" element={<RegisterHotel />} />
      
      {/* Protected Routes inside MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="guests" element={<Guests />} />
        <Route path="employees" element={<Employees />} />
        <Route path="register-employee" element={<RegisterEmployee />} />
        <Route path="hr-payroll" element={<HRPayroll />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="restaurant" element={<Restaurant />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
