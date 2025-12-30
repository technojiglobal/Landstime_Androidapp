// Landstime_Androidapp/admin/src/routes/AdminProtectedRoute.jsx

import { Navigate, Outlet } from "react-router-dom";

// ✅ NEW CODE
const AdminProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "Admin") {  // Changed "admin" to "Admin"
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
