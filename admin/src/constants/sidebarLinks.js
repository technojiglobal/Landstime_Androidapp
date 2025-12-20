import {
  LayoutDashboard,
  Users,
  Building2,
  Bell,
  Image,
  Palette,
} from "lucide-react";

export const sidebarLinks = [
  {
    label: "Dashboard",
    path: "/",
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
];
