// //admin/src/pages/Dashboard.jsx

// import React from "react";
// import StatCard from "../components/Dashboard/StatCard";
// import PropertyItem from "../components/Dashboard/PropertyItem";
// import NotificationItem from "../components/Dashboard/NotificationItem";
// import StatsCard from "../components/UserManagement/StatsCard";

// import {
//   Users,
//   DollarSign,
//   Crown,
//   Building2,
//   CheckCircle,
//   Clock,
//   XCircle,
// } from "lucide-react";

// const Dashboard = () => {
//   /* =======================
//      ALL STAT CARDS
//   ======================= */
//   const stats = [
//     {
//       title: "Total Subscribers",
//       value: "1,248",
//       icon: Users,
//       color: "blue",
//       trend: "+12% from last month",
//     },
//     {
//       title: "Total Revenue",
//       value: "$89,500",
//       icon: DollarSign,
//       color: "green",
//       trend: "+8% from last month",
//     },
//     {
//       title: "Premium Users",
//       value: "456",
//       icon: Crown,
//       color: "purple",
//       trend: "+5% from last month",
//     },
//     {
//       title: "Total Properties",
//       value: "892",
//       icon: Building2,
//       color: "indigo",
//       trend: "+15% from last month",
//     },
//     {
//       title: "Approved Properties",
//       value: 654,
//       icon: CheckCircle,
//       color: "green",
//     },
//     {
//       title: "Pending Approval",
//       value: 149,
//       icon: Clock,
//       color: "yellow",
//     },
//     {
//       title: "Rejected Properties",
//       value: 89,
//       icon: XCircle,
//       color: "red",
//     },
//   ];

//   /* =======================
//      RECENT PROPERTIES
//   ======================= */
//   const properties = [
//     { name: "Sunset Villa Estate", location: "Miami Beach, FL", status: "verified" },
//     { name: "Manhattan Penthouse", location: "New York, NY", status: "pending" },
//     { name: "Silicon Valley Tech Campus", location: "Palo Alto, CA", status: "verified" },
//     { name: "Rocky Mountain Retreat Plot", location: "Aspen, CO", status: "rejected" },
//     { name: "Lakefront Paradise", location: "Lake Tahoe, CA", status: "pending" },
//   ];

//   /* =======================
//      RECENT NOTIFICATIONS
//   ======================= */
//   const notifications = [
//     {
//       title: "New Property Alert!",
//       desc: "A stunning beachfront villa matching your preferences is now available",
//       status: "delivered",
//     },
//     {
//       title: "Price Drop Alert",
//       desc: "The Manhattan Penthouse you viewed has reduced its price by $200,000",
//       status: "completed",
//     },
//     {
//       title: "Exclusive Subscriber Offer",
//       desc: "Early access to 10 new luxury listings",
//       status: "completed",
//     },
//     {
//       title: "Weekend Open Houses",
//       desc: "Join this weekend for exclusive open house events",
//       status: "pending",
//     },
//   ];

//   return (
//     <div className="space-y-6">

//       {/* =======================
//           STAT CARDS GRID
//       ======================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((item, idx) => (
//           <StatsCard key={idx} {...item} />
//         ))}
//       </div>

//       {/* =======================
//           BOTTOM SECTION
//       ======================= */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//         {/* Recent Properties */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <h3 className="text-lg font-semibold mb-4">Recent Properties</h3>
//           <div className="space-y-3">
//             {properties.map((item, idx) => (
//               <PropertyItem key={idx} {...item} />
//             ))}
//           </div>
//         </div>

//         {/* Recent Notifications */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
//           <div className="space-y-4">
//             {notifications.map((item, idx) => (
//               <NotificationItem key={idx} {...item} />
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React from "react";
import StatsCard from "../components/UserManagement/StatsCard";
import PropertyItem from "../components/Dashboard/PropertyItem";
import NotificationItem from "../components/Dashboard/NotificationItem";

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
  const stats = [
    {
      title: "Total Subscribers",
      value: "1,248",
      icon: Users,
      color: "blue",
      trend: "+12% from last month",
    },
    {
      title: "Total Revenue",
      value: "$89,500",
      icon: DollarSign,
      color: "green",
      trend: "+8% from last month",
    },
    {
      title: "Premium Users",
      value: "456",
      icon: Crown,
      color: "purple",
      trend: "+5% from last month",
    },
    {
      title: "Total Properties",
      value: "892",
      icon: Building2,
      color: "indigo",
      trend: "+15% from last month",
    },
    {
      title: "Approved Properties",
      value: "654",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Pending Approval",
      value: "149",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Rejected Properties",
      value: "89",
      icon: XCircle,
      color: "red",
    },
  ];

  const properties = [
    { name: "Sunset Villa Estate", location: "Miami Beach, FL", status: "verified" },
    { name: "Manhattan Penthouse", location: "New York, NY", status: "pending" },
    { name: "Silicon Valley Tech Campus", location: "Palo Alto, CA", status: "verified" },
    { name: "Rocky Mountain Retreat Plot", location: "Aspen, CO", status: "rejected" },
    { name: "Lakefront Paradise", location: "Lake Tahoe, CA", status: "pending" },
  ];

  const notifications = [
    {
      title: "New Property Alert!",
      desc: "A stunning beachfront villa matching your preferences is now available",
      status: "delivered",
    },
    {
      title: "Price Drop Alert",
      desc: "The Manhattan Penthouse you viewed has reduced its price by $200,000",
      status: "completed",
    },
    {
      title: "Exclusive Subscriber Offer",
      desc: "Early access to 10 new luxury listings",
      status: "completed",
    },
    {
      title: "Weekend Open Houses",
      desc: "Join this weekend for exclusive open house events",
      status: "pending",
    },
  ];

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