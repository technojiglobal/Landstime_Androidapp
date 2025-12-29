// Landstime_Androidapp/admin/src/routes/AdminProtectedRoute.jsx

import { Navigate, Outlet } from "react-router-dom";

// ✅ NEW CODE
const AdminProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

<<<<<<< HEAD
  if (!token || role !== "Admin") {
=======
  if (!token || role !== "Admin") {  // Changed "admin" to "Admin"
>>>>>>> 30bf1f4e1c27ae3bf7205575a9bddf928f1cab82
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
