import { Bell } from "lucide-react";

const statusStyles = {
  delivered: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  pending: "bg-blue-100 text-blue-700",
};

const NotificationItem = ({ title, desc, status }) => {
  return (
    <div className="flex items-start justify-between gap-4 bg-gray-50 rounded-lg px-4 py-3">
      <div className="flex gap-3">
        <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
          <Bell size={18} className="text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-gray-500 line-clamp-2">{desc}</p>
        </div>
      </div>
      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyles[status]}`}>
        {status}
      </span>
    </div>
  );
};

export default NotificationItem;
