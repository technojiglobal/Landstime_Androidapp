// Landstime_Androidapp/admin/src/routes/AdminProtectedRoute.jsx

import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  // ✅ Use unified token key
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;

