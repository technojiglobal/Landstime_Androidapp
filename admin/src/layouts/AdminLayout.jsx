// //admin/src/layouts/AdminLayout.jsx

// import React, { useState } from "react";
// import { Menu, X } from "lucide-react";

// // Sidebar Component
// const Sidebar = ({ isOpen, onClose }) => {
//   const sidebarLinks = [
//     { label: "Dashboard", path: "/", active: true },
//     { label: "User Management", path: "/users", active: false },
//     { label: "Properties", path: "/properties", active: false },
//     { label: "Notifications", path: "/notifications", active: false },
//     { label: "Banners", path: "/banners", active: false },
//     { label: "Interior Design", path: "/interior-design", active: false },
//   ];

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`
//           fixed lg:static inset-y-0 left-0 z-50
//           w-64 bg-[#0B1220] text-white flex flex-col
//           transform transition-transform duration-300 ease-in-out
//           ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//         `}
//       >
//         {/* Logo */}
//         <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
//               <span className="font-bold text-lg">P</span>
//             </div>
//             <span className="text-green-400 font-semibold">PropAdmin</span>
//           </div>
//           <button onClick={onClose} className="lg:hidden text-white">
//             <X size={24} />
//           </button>
//         </div>

//         {/* Menu */}
//         <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//           {sidebarLinks.map(({ label, path, active }) => (
//             <button
//               key={label}
//               className={`
//                 w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
//                 ${
//                   active
//                     ? "bg-blue-600 text-white"
//                     : "text-gray-300 hover:bg-white/10"
//                 }
//               `}
//             >
//               {label}
//             </button>
//           ))}
//         </nav>

//         {/* Logout */}
//         <div className="px-6 py-4 border-t border-white/10">
//           <button className="text-sm text-gray-300 hover:text-white transition">
//             Logout
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// // Header Component
// const Header = ({ onMenuClick }) => {
//   return (
//     <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
//       {/* Left: Menu + Title */}
//       <div className="flex items-center gap-3 min-w-0 flex-1">
//         <button
//           onClick={onMenuClick}
//           className="lg:hidden text-gray-600 hover:text-gray-900 p-2 -ml-2"
//         >
//           <Menu size={24} />
//         </button>
//         <div className="min-w-0">
//           <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
//             Dashboard
//           </h1>
//           <p className="text-xs sm:text-sm text-gray-500 hidden sm:block truncate">
//             Welcome back! Here's what's happening today.
//           </p>
//         </div>
//       </div>

//       {/* Right: Profile */}
//       <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
//         <div className="relative hidden sm:block">
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//             3
//           </span>
//           <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
//             🔔
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
//             A
//           </div>
//           <span className="text-sm font-medium text-gray-800 hidden sm:inline">
//             Admin
//           </span>
//         </div>
//       </div>
//     </header>
//   );
// };

// // Main Layout
// const AdminLayout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden">
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
//       <div className="flex-1 flex flex-col min-w-0">
//         <Header onMenuClick={() => setSidebarOpen(true)} />
        
//         <main className="flex-1 overflow-y-auto">
//           <div className="p-4 sm:p-6 lg:p-8">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;


import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { sidebarLinks } from "../constants/sidebarLinks";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const active =
    sidebarLinks.find((item) => item.path === location.pathname) ||
    sidebarLinks[0];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          title={active.title} 
          subtitle={active.subtitle}
          onMenuClick={() => setSidebarOpen(true)} 
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;