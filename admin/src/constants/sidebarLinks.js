// admin/src/constants/sidebarLinks.js
import {
  LayoutDashboard,
  Users,
  Building2,
  Bell,
  Image,
  Palette,
  Wallet,
  UserPlus,
  FileText,
  Settings,
} from "lucide-react";

export const sidebarLinks = {
  admin: [
    {
      label: "Dashboard",
      path: "/dashboard",  // Changed from "/admin"
      icon: LayoutDashboard,
      title: "Dashboard",
      subtitle: "Welcome back! Here's what's happening today.",
    },
    {
      label: "User Management",
      path: "/users",  // Changed from "/admin/users"
      icon: Users,
      title: "User Management",
      subtitle: "Manage platform users and roles.",
    },
    {
      label: "Properties",
      path: "/properties",  // Changed from "/admin/properties"
      icon: Building2,
      title: "Properties",
      subtitle: "Review, approve or reject properties.",
    },
    {
      label: "Notifications",
      path: "/notifications",  // Changed from "/admin/notifications"
      icon: Bell,
      title: "Notifications",
      subtitle: "View system and user notifications.",
    },
    {
      label: "Banners",
      path: "/banners",  // Changed from "/admin/banners"
      icon: Image,
      title: "Banners",
      subtitle: "Manage homepage banners.",
    },
    {
      label: "Interior Design",
      path: "/interior-design",  // Changed from "/admin/interior-design"
      icon: Palette,
      title: "Interior Design",
      subtitle: "Interior design requests and assets.",
    },
  ],

  superadmin: [
    {
      label: "Dashboard",
      path: "/dashboard",  // Changed from "/superadmin"
      icon: LayoutDashboard,
      title: "Dashboard",
      subtitle: "Full system control",
    },
    {
      label: "User Management",
      path: "/users",  // Changed from "/superadmin/users"
      icon: Users,
      title: "User Management",
      subtitle: "Manage platform users and roles.",
    },
    {
      label: "Properties",
      path: "/properties",  // Changed from "/superadmin/properties"
      icon: Building2,
      title: "Properties",
      subtitle: "Review, approve or reject properties.",
    },
    {
      label: "Notifications",
      path: "/notifications",  // Changed from "/superadmin/notifications"
      icon: Bell,
      title: "Notifications",
      subtitle: "View system and user notifications.",
    },
    {
      label: "Banners",
      path: "/banners",  // Changed from "/superadmin/banners"
      icon: Image,
      title: "Banners",
      subtitle: "Manage homepage banners.",
    },
    {
      label: "Interior Design",
      path: "/interior-design",  // Changed from "/superadmin/interior-design"
      icon: Palette,
      title: "Interior Design",
      subtitle: "Interior design requests and assets.",
    },
    {
      label: "My Finance",
      path: "/finance",  // Changed from "/superadmin/finance"
      icon: Wallet,
      title: "My Finance",
      subtitle: "Every rupee should count here",
    },
    {
      label: "Create Account",
      path: "/create-account",  // Changed from "/superadmin/create-account"
      icon: UserPlus,
      title: "Create Account",
      subtitle: "Create admins and roles",
    },
  ],
};