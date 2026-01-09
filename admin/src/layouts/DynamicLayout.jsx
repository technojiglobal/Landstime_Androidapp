//src/layouts/DynamicLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import SuperAdminLayout from "./SuperAdminLayout";

const DynamicLayout = () => {
  const userRole = localStorage.getItem("userRole");
  const location = useLocation();

  console.log("Dynamic Layout - Role:", userRole, "Path:", location.pathname); // Debug

  // Render the appropriate layout based on role
  if (userRole === "superadmin") {
    return <SuperAdminLayout><Outlet /></SuperAdminLayout>;
  }

  return <AdminLayout><Outlet /></AdminLayout>;
};

export default DynamicLayout;