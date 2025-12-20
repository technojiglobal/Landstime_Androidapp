import { NavLink } from "react-router-dom";
import { sidebarLinks } from "../constants/sidebarLinks";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#0B1220] text-white flex flex-col">
      
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
          <span className="font-bold text-lg">P</span>
        </div>
        <span className="text-green-400 font-semibold">PropAdmin</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarLinks.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={label}
            to={path}
            end
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
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-6 py-4 border-t border-white/10 text-sm text-gray-300">
        Logout
      </div>
    </aside>
  );
};

export default Sidebar;
