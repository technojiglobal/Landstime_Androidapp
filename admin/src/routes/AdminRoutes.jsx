import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/Dashboard";
import Users from "../pages/UserManagement";
import Properties from "../pages/Properties";
import Notifications from "../pages/Notifications";
import Banners from "../pages/Banners";
import InteriorDesign from "../pages/InteriorDesign";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/banners" element={<Banners />} />
        <Route path="/interior-design" element={<InteriorDesign />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
