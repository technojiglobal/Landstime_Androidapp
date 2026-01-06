
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import AdminProtectedRoute from "../routes/AdminProtectedRoute";
import SuperAdminProtectedRoute from "../routes/SuperAdminProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import SuperAdminLayout from "../layouts/SuperAdminLayout";

// Admin Pages
import Dashboard from "../pages/Dashboard";
import Users from "../pages/UserManagement";
import Properties from "../pages/Properties";
import Notifications from "../pages/Notifications";
import Banners from "../pages/Banners";
import InteriorDesign from "../pages/InteriorDesign";

// SuperAdmin Pages
import SuperAdminDashboard from "../pages/superadmin/Dashboard";
import CreateAccount from "../pages/superadmin/CreateAccount";
import MyFinance from "../pages/superadmin/MyFinance";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Login Route */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="properties" element={<Properties />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="banners" element={<Banners />} />
            <Route path="interior-design" element={<InteriorDesign />} />
          </Route>
        </Route>

        {/* SuperAdmin Routes */}
        <Route element={<SuperAdminProtectedRoute />}>
          <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="properties" element={<Properties />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="banners" element={<Banners />} />
            <Route path="interior-design" element={<InteriorDesign />} />
            <Route path="finance" element={<MyFinance />} />
            <Route path="create-account" element={<CreateAccount />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;



