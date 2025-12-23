//Frontend/app/(tabs)/_layout.jsx
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";

import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabsLayout() {
 const insets = useSafeAreaInsets();

// useEffect(() => {
//   const setupNavigationBar = async () => {
//     await NavigationBar.setPositionAsync("absolute");
//     await NavigationBar.setBackgroundColorAsync("#00000001");
//     await NavigationBar.setButtonStyleAsync("light");

   
//   };
//   setupNavigationBar();
// }, []);
  

// Update the setupNavigationBar function in app/(tabs)/_layout.jsx

useEffect(() => {
  const setupNavigationBar = async () => {
    await NavigationBar.setPositionAsync("absolute");
    await NavigationBar.setBackgroundColorAsync("#00000001");
    await NavigationBar.setButtonStyleAsync("light");
  };
  setupNavigationBar();
}, []); // This will run once when the tab layout mounts


  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: insets.bottom,
          left: 0,
          right: 0,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          backgroundColor: "white",
          // display: sidebarOpen ? "none" : "flex",
          elevation: 0,
        },
      }}
    >

      {/* HOME */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Home"
              icon="home-outline"
              activeIcon="home"
            />
          ),
        }}
      />

      {/* SHORTS */}
      <Tabs.Screen
        name="shorts"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Shorts"
              icon="play-circle-outline"
              activeIcon="play-circle"
            />
          ),
        }}
      />

      {/* ADD BUTTON */}
      <Tabs.Screen
        name="add"
        options={{
          tabBarStyle: { display: "none" },
          tabBarIcon: () => (
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#22C55E",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 28,
                shadowColor: "#22C55E",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Ionicons name="add" size={32} color="white" />
            </View>
          ),
        }}
      />

      {/* PRO */}
      <Tabs.Screen
        name="pro"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Pro"
              icon="diamond-outline"
              activeIcon="diamond"
            />
          ),
        }}
      />

      {/* SETTINGS / BIDDING */}
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Bidding"
              icon="hammer"
              activeIcon="hammer"
              iconSet="material"
            />
          ),
        }}
      />

    </Tabs>
  );
}

/* ---------------------------------------------
   CUSTOM ICON COMPONENT
---------------------------------------------- */
function TabIcon({ focused, label, icon, activeIcon, iconSet = "ion" }) {
  const IconComponent =
    iconSet === "material" ? MaterialCommunityIcons : Ionicons;

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 4,
        minHeight: 50,
      }}
    >
      <IconComponent
        name={focused ? activeIcon : icon}
        size={20}
        color={focused ? "#22C55E" : "#666"}
      />
      <Text 
        style={{ 
          color: focused ? "#22C55E" : "#666",
          fontSize: 8,
          marginTop: 2,
          fontWeight: focused ? "600" : "400"
        }}
      >
        {label}
      </Text>
    </View>
  );
}