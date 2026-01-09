//src/routes/UnifiedProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const UnifiedProtectedRoute = ({ requireSuperAdmin = false }) => {
  // Get auth data from localStorage or your auth context
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole"); // 'admin' or 'superadmin'

  // If not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If superadmin access required but user is not superadmin
  if (requireSuperAdmin && userRole !== "superadmin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default UnifiedProtectedRoute;