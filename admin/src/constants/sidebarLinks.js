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
  Eye,  // ✅ NEW - Added for Property Viewers
} from "lucide-react";

export const sidebarLinks = {
  admin: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      title: "Dashboard",
      subtitle: "Welcome back! Here's what's happening today.",
    },
    {
      label: "User Management",
      path: "/users",
      icon: Users,
      title: "User Management",
      subtitle: "Manage platform users and roles.",
    },
    {
      label: "Properties",
      path: "/properties",
      icon: Building2,
      title: "Properties",
      subtitle: "Review, approve or reject properties.",
    },
    {
      label: "Property Viewers",  // ✅ NEW
      path: "/property-viewers",
      icon: Eye,
      title: "Property Viewers",
      subtitle: "Track property views and viewer details.",
    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: Bell,
      title: "Notifications",
      subtitle: "View system and user notifications.",
    },
    {
      label: "Banners",
      path: "/banners",
      icon: Image,
      title: "Banners",
      subtitle: "Manage homepage banners.",
    },
    {
      label: "Interior Design",
      path: "/interior-design",
      icon: Palette,
      title: "Interior Design",
      subtitle: "Interior design requests and assets.",
    },
     {
      label: "Interior Design Viewers",  // ✅ NEW
      path: "/interior-design-viewers",
      icon: Eye,
      title: "Interior Design Viewers",
      subtitle: "Track interior design contact views.",
    },



  ],

  superadmin: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      title: "Dashboard",
      subtitle: "Full system control",
    },
    {
      label: "User Management",
      path: "/users",
      icon: Users,
      title: "User Management",
      subtitle: "Manage platform users and roles.",
    },
    {
      label: "Properties",
      path: "/properties",
      icon: Building2,
      title: "Properties",
      subtitle: "Review, approve or reject properties.",
    },
    {
      label: "Property Viewers",  // ✅ NEW
      path: "/property-viewers",
      icon: Eye,
      title: "Property Viewers",
      subtitle: "Track property views and viewer details.",
    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: Bell,
      title: "Notifications",
      subtitle: "View system and user notifications.",
    },
    {
      label: "Banners",
      path: "/banners",
      icon: Image,
      title: "Banners",
      subtitle: "Manage homepage banners.",
    },
    {
      label: "Interior Design",
      path: "/interior-design",
      icon: Palette,
      title: "Interior Design",
      subtitle: "Interior design requests and assets.",
    },
    {
      label: "My Finance",
      path: "/finance",
      icon: Wallet,
      title: "My Finance",
      subtitle: "Every rupee should count here",
    },
    {
      label: "Create Account",
      path: "/create-account",
      icon: UserPlus,
      title: "Create Account",
      subtitle: "Create admins and roles",
    },
  ],
};