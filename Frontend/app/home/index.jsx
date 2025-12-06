import HomeScreen from "./screens/HomeScreen";
import SidebarLayout from "./screens/SidebarLayout";
import { useState } from "react";

export default function HomeIndex() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarLayout
      sidebarOpen={sidebarOpen}
      toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    >
      <HomeScreen toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
    </SidebarLayout>
  );
}
