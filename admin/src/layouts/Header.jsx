import { Bell, Search } from "lucide-react";

const Header = ({ title, subtitle }) => {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      
      {/* Left: Title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          {title}
        </h1>
        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-2.5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-56 border rounded-lg text-sm bg-gray-50 focus:outline-none"
          />
        </div>

        {/* Bell */}
        <div className="relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            A
          </div>
          <span className="text-sm font-medium text-gray-800">
            Admin User
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
