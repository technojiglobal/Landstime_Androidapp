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
    <div className="p-6 space-y-6">

      {/* TOP GRID: FORM + STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">


        {/* RIGHT SIDE - Shows first on mobile */}
        <div className="space-y-6 lg:col-span-2 lg:order-2">
          {/* STAT CARDS */}
         <div className="
              grid grid-cols-1 sm:grid-cols-2 
              gap-4 sm:gap-3 
              lg:max-w-none
            ">


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

          {/* PREVIEW (HERE IT IS) */}
          <NotificationPreview
            title={notification.title}
            message={notification.message}
          />
        </div>

        {/* FORM - Shows second on mobile */}
        <div className="lg:col-span-3 lg:order-1">
          <NotificationForm
            notification={notification}
            setNotification={setNotification} />
        </div>
      </div>

      {/* FULL WIDTH TABLE */}
      <div className="w-full">
        <NotificationTabs />
      </div>

    </div>
  );
};

export default Notifications;