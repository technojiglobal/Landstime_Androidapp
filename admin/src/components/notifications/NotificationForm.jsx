// src/components/notifications/NotificationForm.jsx - FIXED VERSION

import React, { useState, useEffect } from "react";
import { Users, ChevronDown, Calendar, Clock, Send, Info } from "lucide-react";
import { createNotification, getUserStats } from "../../services/notificationService";

const NotificationForm = ({ notification, setNotification, onSuccess }) => {
  const [audience, setAudience] = useState("all");
  const [sendType, setSendType] = useState("now");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await getUserStats();
      setUserStats(response.data);
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    }
  };

  const getRecipientCount = () => {
    switch (audience) {
      case "all":
        return userStats.totalUsers;
      case "active":
        return userStats.activeUsers;
      case "inactive":
        return userStats.inactiveUsers;
      default:
        return 0;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const notificationData = {
        title: notification.title,
        message: notification.message,
        audience,
        sendType,
        date: sendType === "schedule" ? date : undefined,
        time: sendType === "schedule" ? time : undefined,
      };

      const response = await createNotification(notificationData);

      // Reset form
      setNotification({ title: "", message: "" });
      setAudience("all");
      setSendType("now");
      setDate("");
      setTime("");

      // Refresh user stats
      fetchUserStats();

      // Show success message
      if (onSuccess) {
        onSuccess(response.message);
      }

      alert(`${response.message}\nSent to ${response.recipientCount} users`);
    } catch (err) {
      setError(err.message || "Failed to send notification");
      console.error("Notification error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 md:p-6 lg:p-7 h-full">
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-4 sm:mb-5 lg:mb-6 text-gray-900">
          Create New Notification
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Notification Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter title name"
              value={notification.title}
              onChange={(e) =>
                setNotification({ ...notification, title: e.target.value })
              }
              required
              disabled={loading}
              maxLength={100}
              className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              {notification.title.length}/100 characters
            </p>
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Enter notification message"
              value={notification.message}
              onChange={(e) =>
                setNotification({ ...notification, message: e.target.value })
              }
              required
              disabled={loading}
              maxLength={500}
              className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none resize-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              {notification.message.length}/500 characters
            </p>
          </div>

          {/* TARGET AUDIENCE */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400 pointer-events-none z-10" />
              <ChevronDown className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400 pointer-events-none z-10" />
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                disabled={loading}
                className="w-full appearance-none rounded-lg border border-gray-300 cursor-pointer pl-10 sm:pl-11 pr-10 sm:pr-11 py-2.5 sm:py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="all">All Users ({userStats.totalUsers})</option>
                <option value="active">Active Users ({userStats.activeUsers})</option>
                <option value="inactive">Inactive Users ({userStats.inactiveUsers})</option>
              </select>
            </div>
            
            {/* Recipient Info */}
            <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">
                  Will be sent to {getRecipientCount()} users
                </p>
                <p className="text-blue-600">
                  {audience === "all" && "Includes all Buyers and Owners (excluding Admins and blocked users)"}
                  {audience === "active" && "Users who logged in within the last 30 days"}
                  {audience === "inactive" && "Users who haven't logged in for 30+ days"}
                </p>
              </div>
            </div>
          </div>

          {/* SEND TO */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Send To
            </label>
            <div className="relative">
              <Send className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400 pointer-events-none z-10" />
              <ChevronDown className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400 pointer-events-none z-10" />
              <select
                value={sendType}
                onChange={(e) => setSendType(e.target.value)}
                disabled={loading}
                className="w-full appearance-none rounded-lg border border-gray-300 cursor-pointer pl-10 sm:pl-11 pr-10 sm:pr-11 py-2.5 sm:py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="now">Send Now</option>
                <option value="schedule">Schedule</option>
              </select>
            </div>
          </div>

          {/* SCHEDULE */}
          {sendType === "schedule" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400 pointer-events-none z-10" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={loading}
                    required={sendType === "schedule"}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-lg border border-gray-300 pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400 pointer-events-none z-10" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={loading}
                    required={sendType === "schedule"}
                    className="w-full rounded-lg border border-gray-300 pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 sm:gap-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2.5 sm:py-3 lg:py-3.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 shadow-sm hover:shadow-md mt-6 sm:mt-7 lg:mt-8 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                {sendType === "schedule"
                  ? "Schedule Notification"
                  : "Send Notification"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotificationForm;