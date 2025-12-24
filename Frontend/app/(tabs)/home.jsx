// app/(tabs)/home.jsx
import { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import SidebarLayout from "../home/screens/SidebarLayout";
import HomeScreen from "../home/screens/HomeScreen";

export default function HomeTab() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        display: sidebarOpen ? "none" : "flex",
      },
    });
  }, [sidebarOpen]);

  return (
    <SidebarLayout
      sidebarOpen={sidebarOpen}
      toggleSidebar={() => setSidebarOpen((prev) => !prev)}
    >
      <HomeScreen
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        sidebarOpen={sidebarOpen}
      />
    </SidebarLayout>
  );
}
