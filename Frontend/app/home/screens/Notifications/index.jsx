// Frontend/app/home/screens/Notifications/index.jsx
// ✅ UPDATED WITH CONTEXT FOR AUTO-SYNC

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNotifications } from "../../../../context/NotificationContext";
import { API_URL } from "../../../../utils/apiConfig";

export default function Notifications() {
  const router = useRouter();
  const { tab = "All" } = useLocalSearchParams();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Use notification context
  const { 
    unreadCount, 
    refreshCount, 
    markAsRead: contextMarkAsRead,
    markAllAsRead: contextMarkAllAsRead 
  } = useNotifications();

  useEffect(() => {
    checkAuthAndFetch();
  }, [tab]);

  // Refresh context count when component mounts or tab changes
  useEffect(() => {
    refreshCount();
  }, [tab]);

  const checkAuthAndFetch = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      
      console.log("🔑 Token from AsyncStorage:", token ? "Found" : "Not found");
      
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
      await fetchNotifications(token);
    } catch (err) {
      console.error("Auth check error:", err);
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  const fetchNotifications = async (token = null) => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        token = await AsyncStorage.getItem("userToken");
      }

      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      const endpoint =
        tab === "Unread"
          ? `${API_URL}/api/user/notifications/unread`
          : `${API_URL}/api/user/notifications`;

      console.log("📡 Fetching notifications from:", endpoint);

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });

      console.log("✅ Notifications response:", response.data);

      if (response.data.success) {
        const transformedData = response.data.data.map((item) => ({
          id: item._id,
          title: item.title,
          message: item.message,
          time: getTimeAgo(item.sentAt),
          isRead: item.isRead,
        }));

        setNotifications(transformedData);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error("❌ Fetch notifications error:", err);
      console.error("Error response:", err.response?.data);
      
      if (err.response?.status === 401) {
        await AsyncStorage.removeItem("userToken");
        setIsLoggedIn(false);
        setError("Session expired. Please login again");
      } else if (err.code === 'ECONNABORTED') {
        setError("Request timeout. Please check your connection");
      } else if (err.message === 'Network Error') {
        setError("Network error. Please check your internet connection");
      } else {
        setError(err.response?.data?.message || "Failed to load notifications");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkAuthAndFetch();
    await refreshCount(); // Refresh context count
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      // Mark as read via context (updates global count)
      await contextMarkAsRead(id);

      // Update local state
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
      );
    } catch (err) {
      console.error("Mark as read error:", err);
      if (err.response?.status === 401) {
        await AsyncStorage.removeItem("userToken");
        setIsLoggedIn(false);
      } else {
        Alert.alert("Error", "Failed to mark notification as read");
      }
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      await axios.delete(`${API_URL}/api/user/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from local state
      setNotifications((prev) => prev.filter((item) => item.id !== id));
      
      // Refresh context count
      await refreshCount();
      
      Alert.alert("Success", "Notification deleted");
    } catch (err) {
      console.error("Delete notification error:", err);
      if (err.response?.status === 401) {
        await AsyncStorage.removeItem("userToken");
        setIsLoggedIn(false);
      } else {
        Alert.alert("Error", "Failed to delete notification");
      }
    }
  };

  const markAllAsRead = async () => {
    try {
      // Mark all as read via context (updates global count)
      await contextMarkAllAsRead();

      // Update local state
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true }))
      );
      
      Alert.alert("Success", "All notifications marked as read");
    } catch (err) {
      console.error("Mark all as read error:", err);
      if (err.response?.status === 401) {
        await AsyncStorage.removeItem("userToken");
        setIsLoggedIn(false);
      } else {
        Alert.alert("Error", "Failed to mark all as read");
      }
    }
  };

  const handleLogin = () => {
    router.push("/auth/LoginScreen");
  };

  const filteredData =
    tab === "Unread"
      ? notifications.filter((item) => !item.isRead)
      : notifications;

  const changeTab = (newTab) => {
    router.push(`/home/screens/Notifications?tab=${newTab}`);
  };

  // Show login prompt if not logged in
  if (!isLoggedIn) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 56,
            marginBottom: 10,
            paddingHorizontal: 16,
          }}
        >
          <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
             <Ionicons name="chevron-back" size={26} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "700", marginLeft: 10 }}>
            Notifications
          </Text>
        </View>

        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-red-50 rounded-full p-4 mb-4">
            <Ionicons name="log-in-outline" size={64} color="#EF4444" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">
            Login Required
          </Text>
          <Text className="text-center text-gray-600 mb-6">
            Please login to view your notifications
          </Text>
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-[#22C55E] px-8 py-4 rounded-lg w-full max-w-xs"
          >
            <Text className="text-white font-semibold text-center text-base">
              Login Now
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4"
          >
            <Text className="text-gray-500">Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#22C55E" />
        <Text className="mt-4 text-gray-600">Loading notifications...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 56,
            marginBottom: 10,
            paddingHorizontal: 16,
          }}
        >
         <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
  <Ionicons name="chevron-back" size={26} />
</TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "700", marginLeft: 10 }}>
            Notifications
          </Text>
        </View>

        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="mt-4 text-gray-600 text-center text-base">{error}</Text>
          <TouchableOpacity
            onPress={() => checkAuthAndFetch()}
            className="mt-6 bg-[#22C55E] px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-4"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#22C55E"]}
          tintColor="#22C55E"
        />
      }
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
  <Ionicons name="chevron-back" size={26} />
</TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: "700", marginLeft: 10 }}>
            Notifications
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <Ionicons name="checkmark-done-outline" size={24} color="#22C55E" />
            </TouchableOpacity>
          )}

          <View style={{ position: "relative" }}>
            <Image
              source={require("../../../../assets/Bell-icon.png")}
              style={{
                width: 26,
                height: 26,
                tintColor: "#22C55E",
              }}
              resizeMode="contain"
            />
            {unreadCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  backgroundColor: "#EF4444",
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 4,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
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
              {item} ({item === "All" ? notifications.length : unreadCount})
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
            onLongPress={() => {
              Alert.alert(
                "Delete Notification",
                "Are you sure you want to delete this notification?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteNotification(item.id),
                  },
                ]
              );
            }}
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

            <View style={{ flex: 1, justifyContent: "center" }}>
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

        {filteredData.length === 0 && !loading && (
          <View className="items-center mt-10">
            <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
            <Text className="text-center text-gray-500 mt-4">
              No notifications here 🎉
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}