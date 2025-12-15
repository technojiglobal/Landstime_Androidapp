import React, { useState, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SavedCard from "../../../../components/interior/SavedCard";
import { useRouter } from "expo-router";
import arrow from "../../../../assets/arrow.png";
export default function SavedPropertiesScreen() {
  // 🔥 Dummy data (replace this later with backend API response)
  const [savedProperties, setSavedProperties] = useState([
    {
      id: "1",
      title: "Bed Room",
      size: "350-500 sq ft",
      time: "3-4 weeks",
      location: "Mumbai",
      price: "1,80,000 - 2,50,000",
      rating: 4.3,
      image: require("../../../../assets/bedroom.jpg"),
    },
    {
      id: "2",
      title: "Living Area",
      size: "350-500 sq ft",
      time: "3-4 weeks",
      location: "Mumbai",
      price: "1,80,000 - 2,50,000",
      rating: 4.3,
      image: require("../../../../assets/living.jpg"),
    },
    {
      id: "3",
      title: "Charming House",
      size: "350-500 sq ft",
      time: "3-4 weeks",
      location: "Mumbai",
      price: "1,80,000 - 2,50,000",
      rating: 4.3,
      image: require("../../../../assets/kitchen.jpg"),
    },
  ]);
  const router = useRouter();
  return (
    <View className="flex-1 bg-white mt-2 px-4 pt-12">

      {/* Header */}
      <View className="flex-row items-center mb-4">
       <TouchableOpacity onPress={() => router.push("/home/screens/Sidebar/InteriorDesign")}>
            <Image  source={arrow}  className="w-6 h-6"/>
        </TouchableOpacity>
        <Text className="text-[18px] font-semibold ml-2">Saved Interior Design Properties</Text>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-[#F4F4F4] rounded-xl px-3 py-3 mb-4">
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search saved properties..."
          placeholderTextColor="#999"
          className="ml-2 flex-1 text-[15px]"
        />
      </View>

      {/* Filters */}
      <View className="flex-row space-x-2 mb-4">
        {["Sites", "Resorts", "Flats", "Commercial"].map((item, index) => (
          <TouchableOpacity
            key={index}
            className={`px-4 py-2 mx-1 rounded-full border ${
              index === 0 ? "bg-green-100 border-green-400" : "border-gray-300"
            }`}
          >
            <Text className={`${index === 0 ? "text-green-600" : "text-gray-600"}`}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Saved Properties Count */}
      <Text className="text-[16px] font-semibold mb-2">
        Saved Properties ({savedProperties.length})
      </Text>

      {/* Property List */}
      <FlatList
        data={savedProperties}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        renderItem={({ item }) => <SavedCard item={item} />}
      />
    </View>
  );
}
