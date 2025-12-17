//Frontend//app//home//screens// SidebarLayout.jsx
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LogoutModal from 'components/LogoutModal';
import { clearUserData } from "utils/api";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SidebarLayout({ children, sidebarOpen, toggleSidebar }) {
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.75)).current;
   const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

    const handleLogout = async () => {
    await clearUserData();
    setShowLogoutModal(false);
    toggleSidebar();
    router.replace("/auth/LoginScreen");
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: sidebarOpen ? 0 : -SCREEN_WIDTH * 0.75,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [sidebarOpen]);

  const menuItems = [
  { name: "Home", icon: "home-outline", route: "/(tabs)/home" },

  { name: "Nearby", icon: "location-outline", 
    route: "/home/screens/Sidebar/NearbyProperty" },

  { name: "Billing Details", icon: "card-outline", 
    route: "/home/screens/Sidebar/Billing" },

  { name: "Interior Design", icon: "color-palette-outline", 
    route: "/home/screens/Sidebar/InteriorDesign" },

  { name: "Vaastu Guidelines", icon: "business-outline", 
    route: "/home/screens/Vaastu" },

  { name: "Saved", icon: "bookmark-outline", 
    route: "/home/screens/Sidebar/SavedPropertiesScreen" },

  { name: "Chat", icon: "chatbubble-outline", 
    route: "/home/screens/Sidebar/MessagesScreen" },

  { name: "Notifications", icon: "notifications-outline", 
    route: "/home/screens/Notifications" },

  { name: "Settings", icon: "settings-outline", 
    route: "/home/screens/Settings" },
];

  return (
    <View style={{ flex: 1 }}>
      {/* Overlay */}
      {sidebarOpen && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 10,
          }}
          onPress={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <Animated.View
        style={{
          position: "absolute",
          height: "100%",
          width: SCREEN_WIDTH * 0.75,
          left: slideAnim,
          top: 0,
          backgroundColor: "#22C55E",
          zIndex: 20,
          padding: 20,
        }}
      >
        {/* User Info */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 30 }}>
          <Image
            source={require("../../../assets/profile.png")}
            style={{ width: 55, height: 55, borderRadius: 28, marginRight: 12 }}
          />
          <View>
            <Text className="text-white font-bold text-lg">John Doe</Text>
            <Text className="text-white text-sm">9876543210</Text>
          </View>
        </View>

        {/* Menu Items */}
        <ScrollView>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                toggleSidebar();
                router.push(item.route);
              }}
              style={{ flexDirection: "row", alignItems: "center", paddingVertical: 16 }}
            >
              <Ionicons name={item.icon} size={22} color="white" style={{ marginRight: 16 }} />
              <Text className="text-white text-lg">{item.name}</Text>
            </TouchableOpacity>
          ))}

           {/* Logout */}
          <TouchableOpacity
            onPress={() => setShowLogoutModal(true)}
            style={{ flexDirection: "row", alignItems: "center", paddingVertical: 16, marginTop: 10 }}
          >
            <Ionicons name="log-out-outline" size={22} color="white" style={{ marginRight: 16 }} />
            <Text className="text-white text-lg">Logout</Text>
          </TouchableOpacity>


        </ScrollView>
      </Animated.View>

      {/* Screen Content */}
      <View style={{ flex: 1 }}>{children}</View>

      {/* Logout Modal */}
      <LogoutModal 
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </View>
  );
}
