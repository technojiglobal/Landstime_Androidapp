<<<<<<< HEAD
import { Routes, Route, Navigate } from "react-router-dom";
=======
// Landstime_Androidapp/admin/src/routes/AdminRoutes.jsx

import { Routes, Route } from "react-router-dom";
>>>>>>> 30bf1f4e1c27ae3bf7205575a9bddf928f1cab82
import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/Dashboard";
import Users from "../pages/UserManagement";
import Properties from "../pages/Properties";
import Notifications from "../pages/Notifications";
import Banners from "../pages/Banners";
import InteriorDesign from "../pages/InteriorDesign";
import AdminLogin from "../pages/AdminLogin";
import AdminProtectedRoute from "./AdminProtectedRoute";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* 🔓 PUBLIC ADMIN LOGIN */}
      <Route path="login" element={<AdminLogin />} />

      {/* 🔐 PROTECTED ADMIN ROUTES */}
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          {/* ✅ DEFAULT REDIRECT */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="properties" element={<Properties />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="banners" element={<Banners />} />
          <Route path="interior-design" element={<InteriorDesign />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
