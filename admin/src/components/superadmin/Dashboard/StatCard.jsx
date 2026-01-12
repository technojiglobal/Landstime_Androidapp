// components/superadmin/StatCard.jsx
import { TrendingUp } from "lucide-react";

const StatCard = ({ title, value, subtext, icon: Icon }) => {
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <h3 className="text-2xl font-semibold text-white mt-1">{value}</h3>
        <p className="text-sm text-emerald-400 mt-2 flex items-center gap-1">
          <TrendingUp size={14} /> {subtext}
        </p>
      </div>

      <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
        <Icon size={22} />
      </div>
    </div>
  );
};

export default StatCard;
