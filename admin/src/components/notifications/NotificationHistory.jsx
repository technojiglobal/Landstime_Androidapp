// src/components/notifications/NotificationHistory.jsx

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  getRecentNotifications,
  deleteNotification,
} from "../../services/notificationService";

const NotificationHistory = ({ refresh }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [refresh]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getRecentNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      await deleteNotification(id);
      setNotifications(notifications.filter((n) => n._id !== id));
      alert("Notification deleted successfully");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      alert("Failed to delete notification");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="mt-6 sm:mt-8 lg:mt-10 bg-white border border-gray-200 rounded-xl shadow-sm p-8 flex justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8 lg:mt-10 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
          Notification History
        </h3>
      </div>

      {notifications.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No notifications sent yet
        </div>
      ) : (
        <>
          {/* ========== DESKTOP TABLE (Large screens: 1024px+) ========== */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 bg-gray-50/80 border-b border-gray-200">
                  <th className="px-6 xl:px-8 py-4 font-semibold whitespace-nowrap w-[18%]">
                    Title
                  </th>
                  <th className="px-6 xl:px-8 py-4 font-semibold whitespace-nowrap w-[32%]">
                    Message
                  </th>
                  <th className="px-6 xl:px-8 py-4 font-semibold whitespace-nowrap w-[14%]">
                    Send To
                  </th>
                  <th className="px-6 xl:px-8 py-4 font-semibold whitespace-nowrap w-[12%]">
                    Status
                  </th>
                  <th className="px-6 xl:px-8 py-4 font-semibold whitespace-nowrap w-[14%]">
                    Sent Date
                  </th>
                  <th className="px-6 xl:px-8 py-4 font-semibold text-center whitespace-nowrap w-[10%]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {notifications.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <td className="px-6 xl:px-8 py-4">
                      <div className="font-semibold text-gray-900 truncate">
                        {item.title}
                      </div>
                    </td>

                    <td className="px-6 xl:px-8 py-4">
                      <div className="text-gray-600 truncate max-w-[300px] xl:max-w-[400px]">
                        {item.message}
                      </div>
                    </td>

                    <td className="px-6 xl:px-8 py-4">
                      <div className="text-gray-600 truncate">{item.sentTo}</div>
                    </td>

                    <td className="px-6 xl:px-8 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${
                          item.status === "delivered"
                            ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                            : item.status === "completed"
                            ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                            : "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 xl:px-8 py-4 text-gray-600">
                      {formatDate(item.sentDate)}
                    </td>

                    <td className="px-6 xl:px-8 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-red-50 transition-all duration-200 group"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 group-hover:scale-110 transition-all duration-200" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ========== TABLET TABLE (Medium screens: 768px - 1023px) ========== */}
          <div className="hidden md:block lg:hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 bg-gray-50/80 border-b border-gray-200">
                  <th className="px-5 py-3.5 font-semibold whitespace-nowrap">
                    Title
                  </th>
                  <th className="px-5 py-3.5 font-semibold whitespace-nowrap">
                    Message
                  </th>
                  <th className="px-5 py-3.5 font-semibold whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-center whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {notifications.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900 max-w-[140px] truncate">
                        {item.title}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-gray-600 max-w-[220px] truncate">
                        {item.message}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${
                          item.status === "delivered"
                            ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                            : item.status === "completed"
                            ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                            : "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 transition-all duration-200 group"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ========== MOBILE CARDS (Small screens: < 768px) ========== */}
          <div className="md:hidden p-4 space-y-3">
            {notifications.map((item) => (
              <div
                key={item._id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-200 bg-white"
              >
                {/* TOP SECTION */}
                <div className="flex justify-between gap-3 items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 mb-1.5 truncate text-base">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 active:bg-red-100 transition-colors duration-200 group"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 group-active:text-red-600 transition-colors duration-200" />
                  </button>
                </div>

                {/* BOTTOM SECTION */}
                <div className="flex justify-between items-center gap-3 pt-3 border-t border-gray-100">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                      item.status === "delivered"
                        ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                        : item.status === "completed"
                        ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                        : "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200"
                    }`}
                  >
                    {item.status}
                  </span>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="font-medium">{item.sentTo}</span>
                    <span className="text-gray-400">•</span>
                    <span>{formatDate(item.sentDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationHistory;