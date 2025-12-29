//admin/src/pages/Notifications.jsx

import NotificationForm from "../components/notifications/NotificationForm";
import NotificationTabs from "../components/notifications/NotificationTabs";
import StatCard from "../components/Dashboard/StatCard";
import { Bell, CheckCircle } from "lucide-react";
import NotificationPreview from "../components/notifications/NotificationPreview";
import { useState } from "react";

const Notifications = () => {
  const [notification, setNotification] = useState({
    title: "",
    message: "",
  });

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
            />
          </div>

          {/* RIGHT SIDE - STATS + PREVIEW (Shows first on mobile, second on desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-5 space-y-5 sm:space-y-6">
            
            {/* STAT CARDS */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <StatCard
                title="Total Sent"
                value="5"
                icon={Bell}
                color="blue"
              />
              <StatCard
                title="Delivered"
                value="98%"
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
          <NotificationTabs />
        </div>
      </div>
    </div>
  );
};

export default Notifications;