// Frontend/app/home/screens/Sidebar/MyProperties.jsx

import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getUserProperties } from "utils/propertyApi";
export default function MyProperties() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");

  // Dummy data matching your screenshot
  // const properties = [
  //   {
  //     id: 1,
  //     status: "Active",
  //     title: "Green Valleys Site",
  //     subtitle: "Residential Plot Development",
  //     rating: 4.8,
  //     reviews: 124,
  //     price: "₹ 9L - 45L",
  //     location: "Near Steel Plant",
  //     image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500",
  //     verified: true,
  //   },
  //   {
  //     id: 2,
  //     status: "Pending Review",
  //     title: "Sol Enclave",
  //     subtitle: "Premium Resort",
  //     rating: 4.2,
  //     reviews: 88,
  //     price: "₹ 22L - 45L",
  //     location: "Padmavathi Nagar Road",
  //     image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500",
  //     verified: true,
  //   },
  // ];
  const [properties, setProperties] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchMyProperties = async () => {
    try {
      const res = await getUserProperties();

      console.log("🏠 RAW RESPONSE:", res);

      // ✅ ALWAYS extract an array
      const list =
        Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data?.properties)
          ? res.data.properties
          : [];

      setProperties(list);
    } catch (error) {
      console.log("Failed to load properties", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  fetchMyProperties();
}, []);



  const tabs = [
    { label: "All", count: 4 },
    { label: "Active", count: 2 },
    { label: "Pending", count: 1 },
    { label: "Sold", count: 1 },
  ];


  const filteredProperties = properties.filter((prop) => {
  if (activeTab === "All") return true;
  if (activeTab === "Active") return prop.status === "approved";
  if (activeTab === "Pending") return prop.status === "pending";
  if (activeTab === "Sold") return prop.propertyStatus === "Sold";
  return true;
});


  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="mt-9 px-4 py-2 flex-row items-center bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black ml-4">
          My Properties
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 mt-2 mb-2">
        <View className="flex-row bg-gray-50 px-4 py-3 rounded-xl items-center">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search properties in Vizag..."
            placeholderTextColor="#9CA3AF"
            className="ml-3 text-gray-700 flex-1 text-base"
          />
          <TouchableOpacity className="mr-3">
            <Ionicons name="mic-outline" size={22} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="options-outline" size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
{/* Tabs Container */}
<View className="mt-3 px-4 mb-2">
  <View
    style={{
      backgroundColor: "#F3F4F6", // light gray background
      borderRadius: 30,
      paddingVertical: 6,
      paddingHorizontal: 6,
    }}
  >
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;

        return (
          <TouchableOpacity
            key={tab.label}
            onPress={() => setActiveTab(tab.label)}
            style={{
              paddingHorizontal: 18,
              paddingVertical: 8,
              borderRadius: 20,
              marginRight: 8,
              backgroundColor: isActive ? "#FFFFFF" : "transparent",
              shadowColor: isActive ? "#000" : "transparent",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isActive ? 0.15 : 0,
              shadowRadius: 4,
              elevation: isActive ? 3 : 0,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: isActive ? "#111827" : "#6B7280",
              }}
            >
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
</View>



     
      {/* Property Cards */}
{/* Property Cards */}
<ScrollView
  className="px-4 flex-1"
  showsVerticalScrollIndicator={false}
>
  {filteredProperties.map((property) => {
    const statusLabel =
      property.status === "approved"
        ? "Active"
        : property.status === "pending"
        ? "Pending Review"
        : "Rejected";

    return (
      <View
        key={property._id}
        className="bg-white rounded-2xl mb-4 overflow-hidden"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Property Image */}
        <View className="relative">
          <Image
            source={{
              uri: property.images?.[0]
                ? `http://YOUR_BACKEND_URL/${property.images[0]}`
                : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
            }}
            className="w-full h-52"
            resizeMode="cover"
          />

          {/* Status Badge */}
          <View
            className={`absolute top-3 left-3 px-3 py-1.5 rounded-full ${
              statusLabel === "Active"
                ? "bg-[#DBFCE7]"
                : "bg-[#FEF9C2]"
            }`}
          >
            <Text className="text-[#008236] text-xs font-bold">
              {statusLabel}
            </Text>
          </View>

          {/* Action Icons */}
          <View className="absolute top-3 right-3 flex-row">
            <TouchableOpacity className="bg-white/95 p-2.5 rounded-full mr-2">
              <Ionicons name="create-outline" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-white/95 p-2.5 rounded-full">
              <Ionicons name="bookmark-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Property Details */}
        <View className="p-4">
          {/* Title */}
          <Text className="text-green-600 font-bold text-base">
            {property.propertyTitle}
          </Text>

          {/* Subtitle */}
          <Text className="text-gray-500 text-sm mt-1">
            {property.propertyType}
          </Text>

          {/* Fake rating (UI only, since backend doesn’t have it yet) */}
          <View className="flex-row items-center mt-3">
            <View className="flex-row">
              {[1, 2, 3, 4].map((_, i) => (
                <Ionicons key={i} name="star" size={16} color="#FCD34D" />
              ))}
              <Ionicons name="star-outline" size={16} color="#FCD34D" />
            </View>
            <Text className="ml-2 text-gray-800 font-semibold text-sm">
              4.5
              <Text className="text-gray-500 font-normal"> (120 reviews)</Text>
            </Text>

            {property.status === "approved" && (
              <View className="ml-auto bg-green-600 px-2.5 py-1 rounded-full flex-row items-center">
                <Ionicons name="checkmark-circle" size={12} color="white" />
                <Text className="text-white text-xs font-semibold ml-1">
                  Verified
                </Text>
              </View>
            )}
          </View>

          {/* Location */}
          <View className="flex-row items-center mt-3">
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-1">
              {property.location}
            </Text>
          </View>

          {/* Price & Actions */}
          <View className="flex-row items-center justify-between mt-4">
            <Text className="text-green-600 text-xl font-bold">
              ₹ {property.expectedPrice}
            </Text>
            <View className="flex-row">
              <TouchableOpacity className="border border-green-600 px-4 py-2 rounded-full mr-2 flex-row items-center">
                <Ionicons name="eye-outline" size={16} color="#16A34A" />
                <Text className="text-green-600 font-semibold ml-1 text-sm">
                  View
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-green-600 px-4 py-2 rounded-full">
                <Text className="text-white font-semibold text-sm">
                  Contact
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  })}
</ScrollView>

    </View>
  );
}