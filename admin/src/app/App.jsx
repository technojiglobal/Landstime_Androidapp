// admin/src/app/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import UnifiedProtectedRoute from "../routes/UnifiedProtectedRoute";
import DynamicLayout from "../layouts/DynamicLayout";

// Admin Dashboard
import Dashboard from "../pages/Dashboard";

// SuperAdmin Dashboard
import SuperAdminDashboard from "../pages/superadmin/Dashboard";

// Shared Pages
import Users from "../pages/UserManagement";
import Properties from "../pages/Properties";
import Notifications from "../pages/Notifications";
import Banners from "../pages/Banners";
import InteriorDesign from "../pages/InteriorDesign";

// SuperAdmin Only Pages
import MyFinance from "../pages/superadmin/MyFinance";
import CreateAccount from "../pages/superadmin/CreateAccount";

// Dashboard wrapper that shows correct dashboard based on role
const DashboardWrapper = () => {
  const userRole = localStorage.getItem("userRole");

  if (userRole === "superadmin") {
    return <SuperAdminDashboard />;
  }

  return <Dashboard />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected Routes */}
        <Route element={<UnifiedProtectedRoute />}>
          <Route element={<DynamicLayout />}>
            {/* Shared Routes */}
            <Route path="/dashboard" element={<DashboardWrapper />} />
            <Route path="/users" element={<Users />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/banners" element={<Banners />} />
            <Route path="/interior-design" element={<InteriorDesign />} />
            
            {/* SuperAdmin Only Routes */}
            <Route element={<UnifiedProtectedRoute requireSuperAdmin />}>
              <Route path="/finance" element={<MyFinance />} />
              <Route path="/create-account" element={<CreateAccount />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;