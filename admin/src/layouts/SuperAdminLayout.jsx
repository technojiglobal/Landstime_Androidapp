// admin/src/layouts/SuperAdminLayout.jsx
// admin/src/layouts/SuperAdminLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";

import { sidebarLinks } from "../constants/sidebarLinks";

const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const role = localStorage.getItem("role") || "superadmin";

  const links = sidebarLinks[role];

  const active =
    links.find((item) => item.path === location.pathname) || links[0];

  return (
    <div className="flex h-screen bg-[#020617]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
       

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
