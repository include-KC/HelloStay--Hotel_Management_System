import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";

import StartPage from "../pages/StartPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import DashboardPlaceholderPage from "../pages/DashboardPlaceholderPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPlaceholderPage />
          </ProtectedRoute>
        }
      />

      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}

export default AppRoutes;