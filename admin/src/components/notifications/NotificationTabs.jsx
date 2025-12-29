//admin/src/components/notifications/NotificationTabs.jsx

import React, { useState } from "react";
import { Trash2 } from "lucide-react";

const NotificationTabs = () => {
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
        {activeTab === "recent" ? <RecentList /> : <ScheduledList />}
      </div>
    </div>
  );
};

export default NotificationTabs;

/* =============================================== */
/*           RECENT LIST COMPONENT                */
/* =============================================== */
const RecentList = () => {
  const data = [
    {
      title: "Flash Sale Alert!",
      message: "50% off on all blue teas. Limited time only!",
      sentTo: "All Users",
      date: "2024-07-25",
    },
    {
      title: "Order Shipped",
      message: "Your order #1234 has been shipped",
      sentTo: "Selected Users",
      date: "2024-07-24",
    },
    {
      title: "Weekend Special",
      message: "Free shipping on all orders this weekend",
      sentTo: "All Users",
      date: "2024-07-23",
    },
  ];

  return (
    <div className="bg-white w-full rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-b border-gray-200 bg-gray-50">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Notification History
        </h3>
      </div>

      {/* ===== DESKTOP TABLE (lg and above) ===== */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3.5 font-medium whitespace-nowrap">Title</th>
              <th className="px-6 py-3.5 font-medium whitespace-nowrap">Message</th>
              <th className="px-6 py-3.5 font-medium whitespace-nowrap">Sent To</th>
              <th className="px-6 py-3.5 font-medium whitespace-nowrap">Sent Date</th>
              <th className="px-6 py-3.5 font-medium text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                <td className="px-6 py-4 text-gray-600 max-w-md truncate">{item.message}</td>
                <td className="px-6 py-4 text-gray-600">{item.sentTo}</td>
                <td className="px-6 py-4 text-gray-600">{item.date}</td>
                <td className="px-6 py-4 text-center">
                  <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 transition-colors duration-150 group">
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
              <th className="px-5 py-3.5 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-5 py-4 font-medium text-gray-900">{item.title}</td>
                <td className="px-5 py-4 text-gray-600 max-w-xs truncate">{item.message}</td>
                <td className="px-5 py-4 text-gray-600 text-sm">{item.sentTo}</td>
                <td className="px-5 py-4 text-center">
                  <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 transition-colors duration-150 group">
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
        {data.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between gap-3 items-start">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 mb-1 truncate">{item.title}</p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.message}
                </p>
              </div>
              <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors duration-150 group">
                <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors duration-150" />
              </button>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
              <span className="font-medium">{item.sentTo}</span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =============================================== */
/*         SCHEDULED LIST COMPONENT               */
/* =============================================== */
const ScheduledList = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-b border-gray-200 bg-gray-50">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Scheduled Notifications
        </h3>
      </div>

      <div className="p-4 sm:p-5 md:p-6 space-y-4">
        {[1, 2].map((_, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 mb-2 break-words">
                NAPLEX Prep Bundle – Last Chance!
              </h4>
              <p className="text-sm text-gray-600 mb-4 break-words">
                Only 48 hours left to get 30% off our comprehensive NAPLEX preparation bundle
              </p>

              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                  Edit
                </button>
                <button className="px-4 py-1.5 text-sm font-medium border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-150">
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
    </div>
  );
};