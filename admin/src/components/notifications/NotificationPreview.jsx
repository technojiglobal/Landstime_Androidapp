//admin/src/components/notifications/NotificationPreview.jsx
import { Bell } from "lucide-react";

const NotificationPreview = ({ title, message }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5 md:p-6">
      {/* Heading */}
      <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 text-gray-900">
        Preview
      </h3>

      {/* Preview Card */}
      <div className="border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 sm:p-5 md:p-6 flex items-start gap-3 sm:gap-4 shadow-sm">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-1 break-words">
            {title || "Notification Title"}
          </h4>
          <p className="text-sm text-gray-600 break-words">
            {message || "Your notification message will appear here...."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreview;