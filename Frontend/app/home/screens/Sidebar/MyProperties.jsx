// Frontend/app/home/screens/Sidebar/MyProperties.jsx

import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function MyProperties() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");

  // Dummy data matching your screenshot
  const properties = [
    {
      id: 1,
      status: "Active",
      title: "Green Valleys Site",
      subtitle: "Residential Plot Development",
      rating: 4.8,
      reviews: 124,
      price: "₹ 9L - 45L",
      location: "Near Steel Plant",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500",
      verified: true,
    },
    {
      id: 2,
      status: "Pending Review",
      title: "Sol Enclave",
      subtitle: "Premium Resort",
      rating: 4.2,
      reviews: 88,
      price: "₹ 22L - 45L",
      location: "Padmavathi Nagar Road",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500",
      verified: true,
    },
  ];

  const tabs = [
    { label: "All", count: 4 },
    { label: "Active", count: 2 },
    { label: "Pending", count: 1 },
    { label: "Sold", count: 1 },
  ];

  const filteredProperties = properties.filter((prop) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return prop.status === "Active";
    if (activeTab === "Pending") return prop.status === "Pending Review";
    return false;
  });

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="mt-12 px-4 py-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-black ml-4">
          My Properties
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 mt-4">
        <View className="flex-row bg-gray-50 p-3 rounded-xl items-center">
          <Ionicons name="search" size={20} color="gray" />
          <Text className="ml-2 text-gray-400 flex-1">
            Search properties in Vizag...
          </Text>
          <TouchableOpacity>
            <Image
              source={require("../../../../assets/mic.png")}
              style={{ width: 22, height: 22, marginRight: 10 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../../../assets/filter.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 mt-4"
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.label}
            onPress={() => setActiveTab(tab.label)}
            className={`mr-4 px-4 py-2 rounded-full ${
              activeTab === tab.label ? "bg-green-600" : "bg-gray-100"
            }`}
          >
            <Text
              className={`font-medium ${
                activeTab === tab.label ? "text-white" : "text-gray-700"
              }`}
            >
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Property Cards */}
      <ScrollView className="px-4 mt-4 flex-1">
        {filteredProperties.map((property) => (
          <View
            key={property.id}
            className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100"
          >
            {/* Property Image */}
            <View className="relative">
              <Image
                source={{ uri: property.image }}
                className="w-full h-48 rounded-t-2xl"
                resizeMode="cover"
              />

              {/* Status Badge */}
              <View
                className={`absolute top-3 left-3 px-3 py-1 rounded-full ${
                  property.status === "Active" ? "bg-green-600" : "bg-yellow-500"
                }`}
              >
                <Text className="text-white text-xs font-semibold">
                  {property.status}
                </Text>
              </View>

              {/* Action Icons */}
              <View className="absolute top-3 right-3 flex-row space-x-2">
                <TouchableOpacity className="bg-white/90 p-2 rounded-full">
                  <Ionicons name="create-outline" size={18} color="black" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-white/90 p-2 rounded-full">
                  <Ionicons name="bookmark-outline" size={18} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Property Details */}
            <View className="p-4">
              {/* Title & Subtitle */}
              <Text className="text-green-600 font-semibold text-base">
                {property.title}
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                {property.subtitle}
              </Text>

              {/* Rating */}
              <View className="flex-row items-center mt-2">
                {[1, 2, 3, 4].map((_, i) => (
                  <Ionicons key={i} name="star" size={16} color="#FFD700" />
                ))}
                <Ionicons name="star-outline" size={16} color="#FFD700" />
                <Text className="ml-2 text-gray-700 font-semibold">
                  {property.rating}
                  <Text className="text-gray-500 text-xs">
                    {" "}
                    ({property.reviews} reviews)
                  </Text>
                </Text>
                {property.verified && (
                  <View className="ml-auto bg-green-600 px-2 py-1 rounded-full">
                    <Text className="text-white text-xs font-semibold">
                      ✓ Verified
                    </Text>
                  </View>
                )}
              </View>

              {/* Location */}
              <View className="flex-row items-center mt-3">
                <Ionicons name="location-outline" size={16} color="gray" />
                <Text className="text-gray-600 text-sm ml-1">
                  {property.location}
                </Text>
              </View>

              {/* Price */}
              <View className="flex-row items-center justify-between mt-4">
                <Text className="text-green-600 text-xl font-bold">
                  {property.price}
                </Text>
                <View className="flex-row space-x-2">
                  <TouchableOpacity className="border border-green-600 px-4 py-2 rounded-full">
                    <Text className="text-green-600 font-semibold">👁 View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-green-600 px-4 py-2 rounded-full">
                    <Text className="text-white font-semibold">Contact</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}