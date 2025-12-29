// //admin/src/layouts/Header.jsx
// import { Bell, Search } from "lucide-react";

// const Header = ({ title, subtitle }) => {
//   return (
//     <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      
//       {/* Left: Title */}
//       <div>
//         <h1 className="text-xl font-semibold text-gray-900">
//           {title}
//         </h1>
//         <p className="text-sm text-gray-500">
//           {subtitle}
//         </p>
//       </div>

//       {/* Right */}
//       <div className="flex items-center gap-4">
        
//         {/* Search */}
//         <div className="relative">
//           <Search
//             size={18}
//             className="absolute left-3 top-2.5 text-gray-400"
//           />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="pl-10 pr-4 py-2 w-56 border rounded-lg text-sm bg-gray-50 focus:outline-none"
//           />
//         </div>

//         {/* Bell */}
//         <div className="relative">
//           <Bell size={20} className="text-gray-600" />
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//             3
//           </span>
//         </div>

//         {/* Profile */}
//         <div className="flex items-center gap-2">
//           <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
//             A
//           </div>
//           <span className="text-sm font-medium text-gray-800">
//             Admin User
//           </span>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


import React from "react";
import { Bell, Search, Menu } from "lucide-react";

const Header = ({ title, subtitle, onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      
      {/* Left: Menu Button + Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Hamburger Menu for Mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900 p-2 -ml-2 flex-shrink-0"
        >
          <Menu size={24} />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 hidden sm:block truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Search, Bell, Profile */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        
        {/* Search - Hidden on small screens */}
        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-3 top-2.5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-40 lg:w-56 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bell - Hidden on mobile */}
        <div className="relative hidden sm:block">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
            A
          </div>
          <span className="text-sm font-medium text-gray-800 hidden sm:inline">
            Admin User
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;