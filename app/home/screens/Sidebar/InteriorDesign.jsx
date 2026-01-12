//Frontend/app/home/screens/Sidebar/InteriorDesign.jsx

import React, { useState } from "react";
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity,StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RoomTabs from "../../../../components/interior/RoomTabs";
import FeaturedDesigns from "../../../../components/interior/FeaturedDesigns";
import { useRouter } from "expo-router";
import arrow from "../../../../assets/arrow.png";
export default function InteriorDesignScreen() {
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState("All Rooms");
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState("");

  return (
    <ScrollView 
      className="flex-1 bg-white mt-12 mb-12"
      showsVerticalScrollIndicator={true}
    >
 <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
 
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">

        {/* Back icon */}
        <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
            <Image  source={arrow}  className="w-6 h-6"/>
        </TouchableOpacity>

        {/* Title (RIGHT aligned) */}
        <Text className="text-lg font-semibold text-black mr-auto ml-3">
          Interior Design
        </Text>

        {/* Save icon – green BG + white icon */}
        <TouchableOpacity className="ml-3 bg-green-600 p-2 rounded-full" onPress={()=>router.push("/home/screens/Sidebar/SavedInteriors")}>
          <Ionicons name="bookmark-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Subtitle (Right below title & right-aligned) */}
      <Text className="text-gray-500 text-left px-4 mt-[-12px] mb-3 ml-10">
        Transform your space with experts
      </Text>

      {/* Search Bar */}
      <View className="mt-2 px-4">
        <View className="flex-row bg-gray-50 p-3 rounded-xl items-center justify-between">

          {/* Left group: Search icon + input */}
          <View className="flex-row items-center flex-1">
            <Ionicons name="search" size={20} color="gray" />
            <TextInput
              placeholder="Search properties..."
              value={searchText}
              onChangeText={setSearchText}
              className="ml-2 text-gray-700 flex-1"
            />
          </View>

          {/* Mic Icon */}
          <TouchableOpacity>
            <Image 
              source={require("../../../../assets/mic.png")} 
              style={{ width: 22, height: 22, marginRight: 10 }}
            />
          </TouchableOpacity>

          {/* Filter Icon */}
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <Image 
              source={require("../../../../assets/filter.png")} 
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>

        </View>
      </View>

      {/* Filter Tabs (visible only when filter pressed) */}
      {showFilters && (
        <RoomTabs 
          selectedRoom={selectedRoom} 
          setSelectedRoom={setSelectedRoom} 
          showIcons={true}  // enabling icons inside tabs
        />
      )}

      {/* Featured Designs with search applied */}
      <FeaturedDesigns 
        selectedRoom={selectedRoom}
        searchText={searchText}
      />

    </ScrollView>
  );
}
