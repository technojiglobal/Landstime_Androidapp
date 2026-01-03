// src/pages/Notifications.jsx

import { useState, useEffect } from "react";
import NotificationForm from "../components/notifications/NotificationForm";
import NotificationTabs from "../components/notifications/NotificationTabs";
import StatCard from "../components/Dashboard/StatCard";
import { Bell, CheckCircle } from "lucide-react";
import NotificationPreview from "../components/notifications/NotificationPreview";
import { getNotificationStats } from "../services/notificationService";

const Notifications = () => {
  const [notification, setNotification] = useState({
    title: "",
    message: "",
  });
  const [stats, setStats] = useState({
    totalSent: 0,
    deliveryRate: "0%",
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    try {
      const response = await getNotificationStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleNotificationSent = () => {
    // Refresh stats and tabs
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-5 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-5 sm:space-y-6 lg:space-y-8">
        {/* TOP GRID: FORM + STATS + PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* LEFT SIDE - FORM (Shows second on mobile, first on desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-7 xl:col-span-7">
            <NotificationForm
              notification={notification}
              setNotification={setNotification}
              onSuccess={handleNotificationSent}
            />
          </div>

          {/* RIGHT SIDE - STATS + PREVIEW (Shows first on mobile, second on desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-5 space-y-5 sm:space-y-6">
            {/* STAT CARDS */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <StatCard
                title="Total Sent"
                value={stats.totalSent.toString()}
                icon={Bell}
                color="blue"
              />
              <StatCard
                title="Delivered"
                value={stats.deliveryRate}
                icon={CheckCircle}
                color="blue"
              />
            </div>

            {/* PREVIEW */}
            <NotificationPreview
              title={notification.title}
              message={notification.message}
            />
          </div>
        </div>

        {/* FULL WIDTH TABS AND TABLES */}
        <div className="w-full">
          <NotificationTabs refresh={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default Notifications;