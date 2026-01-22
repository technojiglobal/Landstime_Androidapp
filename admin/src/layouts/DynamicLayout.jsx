// admin/src/layouts/DynamicLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import SuperAdminLayout from "./SuperAdminLayout";

const superAdminRoutes = ["/finance", "/create-account"];

const DynamicLayout = () => {
  const location = useLocation();

  const isSuperAdminPage = superAdminRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  // ✅ Layout decided by ROUTE, not ROLE
  if (isSuperAdminPage) {
    return (
      <SuperAdminLayout>
        <Outlet />
      </SuperAdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default DynamicLayout;
