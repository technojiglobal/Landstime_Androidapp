import React from "react";
import { Bell } from "lucide-react";

const NotificationItem = ({ title, desc, status }) => {
  const statusStyles = {
    delivered: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-700",
    },
    completed: {
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
      badgeBg: "bg-green-100",
      badgeText: "text-green-700",
    },
    pending: {
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-700",
      badgeBg: "bg-yellow-100",
      badgeText: "text-yellow-700",
    },
  };

  const config = statusStyles[status];

  return (
    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors">
      {/* Icon */}
      <div
        className={`
          ${config.iconBg} ${config.iconColor}
          p-2 rounded-lg flex-shrink-0
        `}
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm sm:text-base font-medium text-gray-900 break-words flex-1">
            {title}
          </h4>
          <span
            className={`
              ${config.badgeBg} ${config.badgeText}
              px-2 sm:px-3 py-1 rounded-full text-xs font-medium
              whitespace-nowrap flex-shrink-0
            `}
          >
            {status}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 break-words leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;