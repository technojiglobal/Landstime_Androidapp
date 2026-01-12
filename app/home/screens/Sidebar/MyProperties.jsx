// Frontend/app/home/screens/Sidebar/MyProperties.jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getUserProperties } from "utils/propertyApi";

export default function MyProperties() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const propertyList = await getUserProperties();
      
      console.log("🏠 Fetched properties:", propertyList);
      console.log("📊 Properties count:", propertyList.length);
      
      setProperties(Array.isArray(propertyList) ? propertyList : []);
    } catch (error) {
      console.error("❌ Failed to load properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { label: "All", count: properties.length },
    { label: "Active", count: properties.filter(p => p.status === "approved").length },
    { label: "Pending", count: properties.filter(p => p.status === "pending").length },
    { label: "Sold", count: properties.filter(p => p.propertyStatus === "Sold").length },
  ];

  const filteredProperties = properties.filter((prop) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return prop.status === "approved";
    if (activeTab === "Pending") return prop.status === "pending";
    if (activeTab === "Sold") return prop.propertyStatus === "Sold";
    return true;
  });

  // ✅ Helper function to handle base64 images from backend
  const getImageSource = (imageData) => {
    if (!imageData) {
      return { uri: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6" };
    }
    
    // If it's already a base64 data URI (starts with data:image), use it directly
    if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
      return { uri: imageData };
    }
    
    // If it's a URL, use it
    if (typeof imageData === 'string' && (imageData.startsWith('http://') || imageData.startsWith('https://'))) {
      return { uri: imageData };
    }
    
    // Fallback to placeholder
    return { uri: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6" };
  };

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
            backgroundColor: "#F3F4F6",
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

      {/* Loading State */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16A34A" />
          <Text className="mt-4 text-gray-600">Loading properties...</Text>
        </View>
      ) : filteredProperties.length === 0 ? (
        /* Empty State */
        <View className="flex-1 justify-center items-center px-4">
          <Ionicons name="home-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-600 text-lg font-semibold mt-4">
            No properties found
          </Text>
          <Text className="text-gray-500 text-sm mt-2 text-center">
            {activeTab === "All"
              ? "You haven't added any properties yet"
              : `No ${activeTab.toLowerCase()} properties`}
          </Text>
        </View>
      ) : (
        /* Property Cards */
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

            // ✅ Debug logging
            console.log('🖼️ Property:', property.propertyTitle);
            console.log('📸 Image data type:', typeof property.images?.[0]);
            console.log('📸 Image starts with:', property.images?.[0]?.substring(0, 30));

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
                    source={getImageSource(property.images?.[0])}
                    className="w-full h-52"
                    resizeMode="cover"
                    onError={(error) => {
                      console.error('❌ Image load error for:', property.propertyTitle);
                      console.error('❌ Error details:', error.nativeEvent.error);
                    }}
                    onLoad={() => {
                      console.log('✅ Image loaded successfully for:', property.propertyTitle);
                    }}
                  />

                  {/* Status Badge */}
                  <View
                    className={`absolute top-3 left-3 px-3 py-1.5 rounded-full ${
                      statusLabel === "Active"
                        ? "bg-[#DBFCE7]"
                        : statusLabel === "Pending Review"
                        ? "bg-[#FEF9C2]"
                        : "bg-red-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        statusLabel === "Active"
                          ? "text-[#008236]"
                          : statusLabel === "Pending Review"
                          ? "text-yellow-700"
                          : "text-red-700"
                      }`}
                    >
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

                  {/* Rating */}
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
                      ₹ {property.expectedPrice?.toLocaleString('en-IN')}
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
      )}
    </View>
  );
}