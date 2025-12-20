import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { sidebarLinks } from "../constants/sidebarLinks";

const AdminLayout = () => {
  const location = useLocation();

  const active =
    sidebarLinks.find((item) => item.path === location.pathname) ||
    sidebarLinks[0];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={active.title} subtitle={active.subtitle} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
