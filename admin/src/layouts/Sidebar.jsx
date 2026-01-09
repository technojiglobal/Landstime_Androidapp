//admin/src/layouts/Sidebar.jsx
import React , {useState} from "react";
import { NavLink , useNavigate} from "react-router-dom";
import { sidebarLinks } from "../constants/sidebarLinks";
import { X } from "lucide-react";
import { adminLogout } from "../services/authService";
import LogoutModal from "../components/LogoutModal";

const Sidebar = ({ isOpen = true, onClose = () => {} }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const role = localStorage.getItem("userRole") || "admin";
  const links = sidebarLinks[role] || sidebarLinks.admin;
 const handleLogout = async () => {
  setLoggingOut(true);
  try {
    await adminLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");  // Changed from "role"
    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
    // Even if API call fails, clear local storage and redirect
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");  // Changed from "role"
    navigate("/login");
  } finally {
    setLoggingOut(false);
    setShowLogoutModal(false);
  }
};

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-[#0B1220] text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="font-bold text-lg">P</span>
            </div>
            <span className="text-green-400 font-semibold">PropAdmin</span>
          </div>
          {/* Close button for mobile */}
          <button onClick={onClose} className="lg:hidden text-white hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={label}
              to={path}
              end
              onClick={() => onClose()} // Close sidebar on mobile when link is clicked
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-white/10"
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
       {/* Logout */}
        <div className="px-6 py-4 border-t border-white/10">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="text-sm text-gray-300 hover:text-white transition w-full text-left"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        loading={loggingOut}
      />
    </>
  );
};

export default Sidebar;