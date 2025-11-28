//SidebarLayout.jsx
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SidebarLayout({ children, sidebarOpen, toggleSidebar }) {
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.75)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: sidebarOpen ? 0 : -SCREEN_WIDTH * 0.75,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [sidebarOpen]);

  const menuItems = [
    { name: "Home", icon: "home-outline" },
    { name: "Nearby", icon: "location-outline" },
    { name: "Billing Details", icon: "card-outline" },
    { name: "Interior Design", icon: "color-palette-outline" },
    { name: "Vaastu Guidelines", icon: "business-outline" },
    { name: "Saved", icon: "bookmark-outline" },
    { name: "Chat", icon: "chatbubble-outline" },
    { name: "Notifications", icon: "notifications-outline" },
    { name: "Settings", icon: "settings-outline" },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* Overlay */}
      {sidebarOpen && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "black",
            opacity: 0.4,
            zIndex: 10,
          }}
          onPress={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: slideAnim,
          height: "100%",
          width: SCREEN_WIDTH * 0.75,
          backgroundColor: "#22C55E",
          zIndex: 20,
          paddingHorizontal: 20,
          paddingVertical: 25,
        }}
      >
        {/* Profile */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            paddingTop: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../../../assets/profile.png")}
              style={{ width: 55, height: 55, borderRadius: 27.5, marginRight: 12 }}
            />
            <View>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>John Doe</Text>
              <Text style={{ color: "white", fontSize: 14 }}>9876543210</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={toggleSidebar}
            style={{
              position: "absolute",
              right: -18,
              top: 25,
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              elevation: 8,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowOffset: { width: 2, height: 2 },
              shadowRadius: 3,
            }}
          >
            <Ionicons name="chevron-back" size={22} color="#22C55E" />
          </TouchableOpacity>
        </View>

        {/* Menu */}
        <ScrollView style={{ flex: 1, marginBottom: 20,paddingTop: 40 }}>
            {menuItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  // close sidebar first
                  toggleSidebar?.();

                  // navigate based on menu item
                  switch (item.name) {
                    case "Home":
                      router.push("/home");
                      break;
                    case "Nearby":
                      // As requested: open Billing when Nearby is clicked
                      router.push("/home/screens/Nearby");
                      break;
                    case "Billing Details":
                      router.push("/home/screens/Sidebar/Billing");
                      break;
                    case "Interior Design":
                      router.push("/home/screens/Sidebar/InteriorDesign");
                      break;
                    case "Vaastu Guidelines":
                      router.push("/home/screens/Vaastu");
                      break;
                    case "Saved":
                      router.push("/home/screens/Sidebar/SavedPropertiesScreen");
                      break;
                    case "Chat":
                      router.push("/home/screens/Sidebar/MessagesScreen");
                      break;
                    case "Notifications":
                      router.push("/home/screens/Notifications");
                      break;
                    case "Settings":
                      router.push("/home/screens/Settings");
                      break;
                    default:
                      break;
                  }
                }}
                style={{ flexDirection: "row", alignItems: "center", paddingVertical: 16 }}
              >
                <Ionicons name={item.icon} size={22} color="white" style={{ marginRight: 16 }} />
                <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>{item.name}</Text>
                {item.name === "Notifications" && (
                  <View
                    style={{
                      marginLeft: "auto",
                      backgroundColor: "white",
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ color: "#22C55E", fontSize: 12 }}>5</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Logout */}
       {/* Logout */}
      <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 80 }}>
         <Ionicons name="log-out-outline" color="white" size={22} style={{ marginRight: 10 }} />
         <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>Logout</Text>
      </TouchableOpacity>
      </Animated.View>

      {/* Main Content */}
      <View style={{ flex: 1 }}>{children({ toggleSidebar })}</View>
    </View>
  );
}