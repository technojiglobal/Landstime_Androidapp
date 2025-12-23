// app/(tabs)/home.jsx
import { useState } from "react";
import SidebarLayout from "../home/screens/SidebarLayout";
import HomeScreen from "../home/screens/HomeScreen";

export default function HomeTab() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarLayout
      sidebarOpen={sidebarOpen}
      toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    >
      <HomeScreen 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
    </SidebarLayout>
  );
}
