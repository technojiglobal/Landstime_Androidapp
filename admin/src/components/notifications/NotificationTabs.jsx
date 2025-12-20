import React, { useState } from "react";
import { Trash2 } from "lucide-react";

const NotificationTabs = () => {
  const [activeTab, setActiveTab] = useState("recent");

  return (
    <div className="mt-6 w-full">
      {/* PILL TABS */}
      <div className="inline-flex bg-gray-200 rounded-xl p-1">
        <button
          onClick={() => setActiveTab("recent")}
          className={`px-5 sm:px-6 py-1.5 text-sm rounded-xl transition
            ${
              activeTab === "recent"
                ? "bg-white shadow text-gray-900 font-medium"
                : "text-gray-500"
            }`}
        >
          Recent
        </button>

        <button
          onClick={() => setActiveTab("scheduled")}
          className={`px-5 sm:px-6 py-1.5 text-sm rounded-xl transition
            ${
              activeTab === "scheduled"
                ? "bg-white shadow text-gray-900 font-medium"
                : "text-gray-500"
            }`}
        >
          Scheduled
        </button>
      </div>

      {/* CONTENT */}
      <div className="mt-4">
        {activeTab === "recent" ? <RecentList /> : <ScheduledList />}
      </div>
    </div>
  );
};

export default NotificationTabs;

/* ---------------- RECENT LIST ---------------- */
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
    <div className="bg-white w-full rounded-xl border border-[#0000001A]">
      <div className="px-4 sm:px-6 py-4 border-b border-[#0000001A]">
        <h3 className="text-lg font-semibold">Notification History</h3>
      </div>

      {/* ===== DESKTOP TABLE ===== */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-[#0000001A]">
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Message</th>
              <th className="px-6 py-3 font-medium">Sent To</th>
              <th className="px-6 py-3 font-medium">Sent Date</th>
              <th className="px-6 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className=" last:border-none hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium">{item.title}</td>
                <td className="px-6 py-4 text-gray-600">{item.message}</td>
                <td className="px-6 py-4 text-gray-600">{item.sentTo}</td>
                <td className="px-6 py-4 text-gray-600">{item.date}</td>
                <td className="px-6 py-4 text-center">
                  <Trash2 className="w-4 h-4 mx-auto text-gray-400 hover:text-red-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE CARDS ===== */}
      <div className="md:hidden p-4 space-y-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="border border-[#0000001A] rounded-lg p-4"
          >
            <div className="flex justify-between gap-3">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {item.message}
                </p>
              </div>
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer" />
            </div>

            <div className="flex justify-between text-xs text-gray-400 mt-3">
              <span>{item.sentTo}</span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- SCHEDULED LIST ---------------- */
const ScheduledList = () => {
  return (
    <div className="bg-white border border-[#0000001A] rounded-xl p-4 sm:p-6 space-y-4">
      <h3 className="text-lg font-semibold">Scheduled Notifications</h3>

      {[1, 2].map((_, index) => (
        <div
          key={index}
          className="border border-[#0000001A] rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4"
        >
          <div>
            <h4 className="font-medium">
              NAPLEX Prep Bundle – Last Chance!
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Only 48 hours left to get 30% off our comprehensive NAPLEX
              preparation bundle
            </p>

            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1 text-sm border border-[#0000001A] rounded-md">
                Edit
              </button>
              <button className="px-3 py-1 text-sm border border-[#0000001A] rounded-md text-red-500">
                Cancel
              </button>
            </div>
          </div>

          <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full self-start sm:self-center">
            Scheduled
          </span>
        </div>
      ))}
    </div>
  );
};
