//admin// src/components/notifications/NotificationTabs.jsx

import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import {
  getRecentNotifications,
  getScheduledNotifications,
  deleteNotification,
  cancelScheduledNotification,
} from "../../services/notificationService";

const NotificationTabs = ({ refresh }) => {
  const [activeTab, setActiveTab] = useState("recent");

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      {/* PILL TABS */}
      <div className="inline-flex bg-gray-100 rounded-xl p-1 w-full sm:w-auto">
        <button
          onClick={() => setActiveTab("recent")}
          className={`flex-1 sm:flex-none px-6 sm:px-8 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === "recent"
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Recent
        </button>

        <button
          onClick={() => setActiveTab("scheduled")}
          className={`flex-1 sm:flex-none px-6 sm:px-8 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === "scheduled"
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Scheduled
        </button>
      </div>

      {/* CONTENT */}
      <div>
        {activeTab === "recent" ? (
          <RecentList refresh={refresh} />
        ) : (
          <ScheduledList refresh={refresh} />
        )}
      </div>
    </div>
  );
};

export default NotificationTabs;

/* =============================================== */
/*           RECENT LIST COMPONENT                */
/* =============================================== */
const RecentList = ({ refresh }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getRecentNotifications();
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch recent notifications:", error);
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
      setData(data.filter((n) => n._id !== id));
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
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 flex justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white w-full rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-b border-gray-200 bg-gray-50">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Notification History
        </h3>
      </div>

      {data.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No notifications sent yet
        </div>
      ) : (
        <>
          {/* ===== DESKTOP TABLE (lg and above) ===== */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3.5 font-medium whitespace-nowrap">
                    Title
                  </th>
                  <th className="px-6 py-3.5 font-medium whitespace-nowrap">
                    Message
                  </th>
                  <th className="px-6 py-3.5 font-medium whitespace-nowrap">
                    Sent To
                  </th>
                  <th className="px-6 py-3.5 font-medium whitespace-nowrap">
                    Sent Date
                  </th>
                  <th className="px-6 py-3.5 font-medium text-center whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {data.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-md truncate">
                      {item.message}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.sentTo}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(item.sentDate)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 transition-colors duration-150 group"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors duration-150" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== TABLET VIEW (md to lg) ===== */}
          <div className="hidden md:block lg:hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3.5 font-medium">Title</th>
                  <th className="px-5 py-3.5 font-medium">Message</th>
                  <th className="px-5 py-3.5 font-medium">Sent To</th>
                  <th className="px-5 py-3.5 font-medium text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {data.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {item.title}
                    </td>
                    <td className="px-5 py-4 text-gray-600 max-w-xs truncate">
                      {item.message}
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-sm">
                      {item.sentTo}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 transition-colors duration-150 group"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors duration-150" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== MOBILE CARDS ===== */}
          <div className="md:hidden p-4 space-y-3">
            {data.map((item) => (
              <div
                key={item._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between gap-3 items-start">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 mb-1 truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors duration-150 group"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors duration-150" />
                  </button>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                  <span className="font-medium">{item.sentTo}</span>
                  <span>{formatDate(item.sentDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* =============================================== */
/*         SCHEDULED LIST COMPONENT               */
/* =============================================== */
const ScheduledList = ({ refresh }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getScheduledNotifications();
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch scheduled notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (
      !window.confirm("Are you sure you want to cancel this notification?")
    ) {
      return;
    }

    try {
      await cancelScheduledNotification(id);
      setData(data.filter((n) => n._id !== id));
      alert("Notification cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel notification:", error);
      alert("Failed to cancel notification");
    }
  };

  const formatDateTime = (date, time) => {
    const dateStr = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return `${dateStr} at ${time}`;
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 flex justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-b border-gray-200 bg-gray-50">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Scheduled Notifications
        </h3>
      </div>

      {data.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No scheduled notifications
        </div>
      ) : (
        <div className="p-4 sm:p-5 md:p-6 space-y-4">
          {data.map((item) => (
            <div
              key={item._id}
              className="border border-gray-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 mb-2 break-words">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3 break-words">
                  {item.message}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDateTime(item.scheduledDate, item.scheduledTime)}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => handleCancel(item._id)}
                    className="px-4 py-1.5 text-sm font-medium border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <span className="inline-flex items-center justify-center text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium self-start sm:self-center whitespace-nowrap h-fit">
                Scheduled
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};