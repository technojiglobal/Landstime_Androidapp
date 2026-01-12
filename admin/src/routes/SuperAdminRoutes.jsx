// admin/src/routes/SuperAdminRoutes.jsx
// admin/src/routes/SuperAdminRoutes.jsx
import { Route } from "react-router-dom";
import SuperAdminProtectedRoute from "./SuperAdminProtectedRoute";
import SuperAdminLayout from "../layouts/SuperAdminLayout";
import CreateAccount from "../pages/superadmin/CreateAccount";
// Pages
import Dashboard from "../pages/superadmin/Dashboard";
import MyFinance from "../pages/superadmin/MyFinance";

const SuperAdminRoutes = () => {
  return (
    <>
      <Route element={<SuperAdminProtectedRoute />}>
        {/* ✅ BASE PATH IS REQUIRED */}
        <Route path="/superadmin" element={<SuperAdminLayout />}>
          {/* ✅ DEFAULT PAGE */}
          <Route index element={<Dashboard />} />

          {/* Enable later */}

          <Route path="finance" element={<MyFinance />} />
          <Route path="create-account" element={<CreateAccount />} />
          {/* <Route path="reports" element={<Reports />} /> */}
          {/* <Route path="people" element={<People />} /> */}
          {/* <Route path="company" element={<CompanyDetails />} /> */}

        </Route>
      </Route>
    </>
  );
};

export default SuperAdminRoutes;
