import { Routes, Route, Navigate } from "react-router-dom";
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
