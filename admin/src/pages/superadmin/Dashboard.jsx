// pages/superadmin/Dashboard.jsx
import {
  Users,
  UserCog,
  DollarSign,
  BarChart3,
  Settings,
  FileSearch,
  Shield,
  Activity,
} from "lucide-react";

import StatCard from "../../components/superadmin/Dashboard/StatCard";
import OptionCard from "../../components/superadmin/Dashboard/OptionCard";
import SectionHeader from "../../components/superadmin/Dashboard/SectionHeader";
import SystemStatus from "../../components/superadmin/Dashboard/SystemStatus";
import RecentAlerts from "../../components/superadmin/Dashboard/RecentAlerts";
const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Complete system control and management
          </p>
        </div>

        <div className="px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm flex items-center gap-2">
          <Shield size={14} /> Super Admin Access
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Admins"
          value="24"
          subtext="+3 this month"
          icon={UserCog}
        />
        <StatCard
          title="Active Users"
          value="12,847"
          subtext="+12% growth"
          icon={Users}
        />
        <StatCard
          title="Today's Revenue"
          value="₹2.4L"
          subtext="+8% vs yesterday"
          icon={DollarSign}
        />
        
      </div>

      {/* Admin Options */}
      <SectionHeader title="Admin Options" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <OptionCard
          title="Admin Management"
          icon={UserCog}
          color="#3B82F6"
          items={[
            "View all admins",
            "Role-based access control",
            "Permission management",
            "Login history and activity logs",
          ]}
        />

        <OptionCard
          title="User Management"
          icon={Users}
          color="#10B981"
          items={[
            "View all users created by admins",
            "Block / unblock users",
            "User verification status",
            "User activity tracking",
          ]}
        />

        <OptionCard
          title="Financial Controls"
          icon={DollarSign}
          color="#F59E0B"
          items={[
            "View admin-wise financial reports",
            "Approve or reject transactions",
            "Set financial limits for admins",
            "Tax and commission configuration",
          ]}
        />

        <OptionCard
          title="Reports & Analytics"
          icon={BarChart3}
          color="#A855F7"
          items={[
            "System-wide reports",
            "Admin performance reports",
            "Revenue analytics",
            "Custom report generation",
          ]}
        />

        <OptionCard
          title="System Settings"
          icon={Settings}
          color="#64748B"
          items={[
            "Application configuration",
            "Currency and localization settings",
            "Notification settings",
          ]}
        />

        <OptionCard
          title="Audit & Logs"
          icon={FileSearch}
          color="#06B6D4"
          items={[
            "Complete audit trail",
            "Admin actions log",
            "Financial transaction logs",
          ]}
        />

        <OptionCard
          title="Security Settings"
          icon={Shield}
          color="#EF4444"
          items={[
            "Two-factor authentication control",
            "Password policies",
            "Session management",
          ]}
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentAlerts />
        <SystemStatus />
      </div>
    </div>
  );
};

export default Dashboard;
