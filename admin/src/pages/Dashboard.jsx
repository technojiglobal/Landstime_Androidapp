// admin/src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import StatsCard from "../components/UserManagement/StatsCard";
import PropertyItem from "../components/Dashboard/PropertyItem";
import NotificationItem from "../components/Dashboard/NotificationItem";
import { getDashboardData } from "../services/dashboardApi";

import {
  Users,
  DollarSign,
  Crown,
  Building2,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [properties, setProperties] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Icon mapping - convert string names to actual components
  const iconMap = {
    Users,
    DollarSign,
    Crown,
    Building2,
    CheckCircle,
    Clock,
    XCircle,
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardData();
      if (response.success) {
        // ✅ Map icon strings to actual components
        const statsWithIcons = response.data.stats.map(stat => ({
          ...stat,
          icon: iconMap[stat.icon] || Users, // fallback to Users icon
        }));
        
        setStats(statsWithIcons);
        setProperties(response.data.properties);
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Stats Grid - Responsive for all screen sizes */}
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((item, idx) => (
          <StatsCard key={idx} {...item} />
        ))}
      </div>

      {/* Bottom Section - Properties and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Recent Properties */}
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Recent Properties
            </h3>
            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded">
              {properties.length} total
            </span>
          </div>
          <div className="space-y-3">
            {properties.map((item, idx) => (
              <PropertyItem key={idx} {...item} />
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Recent Notifications
            </h3>
            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded">
              {notifications.length} new
            </span>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {notifications.map((item, idx) => (
              <NotificationItem key={idx} {...item} />
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;