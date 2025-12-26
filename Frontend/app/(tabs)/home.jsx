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
  navigation.setOptions({
    tabBarStyle: {
      display: sidebarOpen ? "none" : "flex",
    },
  });

  if (Platform.OS === "android") {
    NavigationBar.setBackgroundColorAsync("#ffffff");

    if (sidebarOpen) {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    } else {
      NavigationBar.setVisibilityAsync("visible");
      NavigationBar.setBehaviorAsync("inset-swipe");
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
