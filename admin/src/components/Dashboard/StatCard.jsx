import React from "react";
import { TrendingUp } from "lucide-react";

const StatsCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    indigo: "bg-indigo-50 text-indigo-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-start justify-between gap-3">
        {/* Left Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 truncate">
            {title}
          </p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">
            {value}
          </h2>
          {trend && (
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium truncate">
                {trend}
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className={`
            ${colorClasses[color]}
            p-2.5 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0
          `}
        >
          {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;