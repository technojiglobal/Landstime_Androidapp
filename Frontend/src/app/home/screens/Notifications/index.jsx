import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const REF_WIDTH = 430;
const scaleWidth = (size) => (SCREEN_WIDTH / REF_WIDTH) * size;

const initialNotifications = [
  {
    id: "1",
    title: "New Property Match",
    message:
      "A new 3-bedroom house in Beverly Hills matches your search criteria",
    time: "5 minutes ago",
    isRead: false,
  },
  {
    id: "2",
    title: "Price Drop Alert",
    message: "Manhattan apartment price reduced by $50,000",
    time: "1 hour ago",
    isRead: false,
  },
  {
    id: "3",
    title: "New Chat Message",
    message: "Laxmi sent you a message about property viewing",
    time: "2 hours ago",
    isRead: true,
  },
];

export default function Notifications() {
  const router = useRouter();
  const { tab = "All" } = useLocalSearchParams();
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const filteredData =
    tab === "Unread" ? notifications.filter((item) => !item.isRead) : notifications;

  const changeTab = (newTab) => {
    router.push(`/home/screens/Notifications?tab=${newTab}`);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isRead: true } : item
      )
    );
  };

  return (
    <ScrollView className="flex-1 bg-white px-4">
      
      {/* Header */}
<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 56,
    marginBottom: 10,
  }}
>
  {/* Back Button + Title */}
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <TouchableOpacity onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={26} />
    </TouchableOpacity>

    <Text style={{ fontSize: 20, fontWeight: "700", marginLeft: 10 }}>
      Notifications
    </Text>
  </View>

  {/* Right Bell Icon Placeholder Image */}
  <TouchableOpacity>
    <Image
      source={require("../../../../../assets/Bell-icon.png")} // 💡 Replace this image later
      style={{
        width: 26,
        height: 26,
        tintColor: "#22C55E", // Apply green tint (just like mockup)
      }}
      resizeMode="contain"
    />
  </TouchableOpacity>
</View>

      {/* Tabs */}
      <View className="flex-row bg-[#F2F2F2] rounded-md p-1 my-5 mx-6">
        {["All", "Unread"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => changeTab(item)}
            className={`flex-1 py-2 rounded-md ${
              tab === item ? "bg-white" : ""
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                tab === item ? "text-gray-700" : "text-gray-500"
              }`}
            >
              {item} (
              {item === "All" ? notifications.length : unreadCount}
              )
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications */}
      <View className="mb-20">
        {filteredData.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => markAsRead(item.id)}
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              paddingVertical: 14,
              paddingHorizontal: 12,
              flexDirection: "row",
              alignItems: "stretch",
              marginBottom: 12,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            {/* Green strip always visible */}
            <View
              style={{
                width: 3,
                height: "100%",
                backgroundColor: "#22C55E",
                borderTopLeftRadius: 16,
                borderBottomLeftRadius: 16,
                marginRight: 12,
              }}
            />

            {/* Content */}
            <View style={{ flex: 1, justifyContent: "center" }}>
              
              {/* Title + Time */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <Text className="font-semibold text-[15px]">{item.title}</Text>
                <Text className="text-gray-400 text-[11px]">{item.time}</Text>
              </View>

              {/* Message + Badge */}
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Text
                  className="text-gray-600 text-[13px]"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ flex: 1, paddingRight: 6 }}
                >
                  {item.message}
                </Text>

                {!item.isRead && (
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: "#22C55E",
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 2,
                    }}
                  >
                    <Text className="text-white text-[11px] font-semibold">
                      1
                    </Text>
                  </View>
                )}
              </View>

            </View>
          </TouchableOpacity>
        ))}

        {filteredData.length === 0 && (
          <Text className="text-center text-gray-500 mt-10">
            No notifications here 🎉
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
