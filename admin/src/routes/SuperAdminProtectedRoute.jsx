// admin/src/routes/SuperAdminProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const SuperAdminProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "superadmin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default SuperAdminProtectedRoute;
