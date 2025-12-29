import React from "react";
import { MapPin } from "lucide-react";

const PropertyItem = ({ name, location, status }) => {
  const statusStyles = {
    verified: {
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Verified",
    },
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "Pending",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Rejected",
    },
  };

  const config = statusStyles[status];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors">
      {/* Property Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-1 break-words line-clamp-1">
          {name}
        </h4>
        <div className="flex items-center gap-1 text-gray-500">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <p className="text-xs sm:text-sm truncate">{location}</p>
        </div>
      </div>

      {/* Status Badge */}
      <span
        className={`
          ${config.bg} ${config.text}
          px-3 py-1 rounded-full text-xs font-medium
          whitespace-nowrap self-start sm:self-auto
        `}
      >
        {config.label}
      </span>
    </div>
  );
};

export default PropertyItem;