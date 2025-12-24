// app/(tabs)/home.jsx
import { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

import SidebarLayout from "../home/screens/SidebarLayout";
import HomeScreen from "../home/screens/HomeScreen";

export default function HomeTab() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Hide Expo TAB BAR
    navigation.setOptions({
      tabBarStyle: {
        display: sidebarOpen ? "none" : "flex",
      },
    });

    // 🔥 Hide Android system navigation buttons
    if (Platform.OS === "android") {
      if (sidebarOpen) {
        NavigationBar.setVisibilityAsync("hidden"); // back / home / recent
        NavigationBar.setBehaviorAsync("overlay-swipe"); // swipe to show
      } else {
        NavigationBar.setVisibilityAsync("visible");
      }
    }
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
