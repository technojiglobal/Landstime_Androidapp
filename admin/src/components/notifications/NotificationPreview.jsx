import { Bell } from "lucide-react";

const NotificationPreview = ({ title, message }) => {
  return (
    <div className="bg-white border border-[#0000001A] rounded-xl p-6">
      {/* Heading */}
      <h3 className="text-lg font-semibold mb-4">
        Preview
      </h3>

      {/* Preview Card */}
      <div className="border border-[#0000001A] bg-[#D9D9D911] rounded-xl p-6 flex items-center gap-4">
        {/* Icon */}
        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
          <Bell className="w-6 h-6 text-blue-600" />
        </div>

        {/* Content */}
        <div>
          <h4 className="text-lg font-medium text-gray-900">
            {title || "Notification Title"}
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            {message || "Your notification message will appear here...."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreview;
