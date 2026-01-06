// components/superadmin/createAccount/AdminSearchBar.jsx
import { Search, SlidersHorizontal } from "lucide-react";

const AdminSearchBar = () => {
  return (
    <div className="flex gap-4 mt-8">
      <div className="flex-1 relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          placeholder="Search admins by name or email..."
          className="w-full bg-[#0B1220] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      <button className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-xl text-sm font-medium">
        <SlidersHorizontal size={16} />
        Filters
      </button>
    </div>
  );
};

export default AdminSearchBar;
