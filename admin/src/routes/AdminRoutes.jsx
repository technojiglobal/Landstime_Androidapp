// admin/src/routes/AdminRoutes.jsx
import { Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/Dashboard";
import Users from "../pages/UserManagement";
import Properties from "../pages/Properties";
import Notifications from "../pages/Notifications";
import Banners from "../pages/Banners";
import InteriorDesign from "../pages/InteriorDesign";
import AdminProtectedRoute from "./AdminProtectedRoute";
import PropertyViewers from "../pages/PropertyViewers";

const AdminRoutes = () => {
  return (
    <>
      {/* 🔐 ADMIN ROUTES */}
      <Route element={<AdminProtectedRoute />}>
        {/* ✅ BASE PATH IS REQUIRED */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* ✅ DEFAULT PAGE */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="properties" element={<Properties />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="banners" element={<Banners />} />
          <Route path="interior-design" element={<InteriorDesign />} />
          <Route path="property-viewers" element={<PropertyViewers />} /> 
        </Route>
      </Route>
    </>
  );
};

export default AdminRoutes;
