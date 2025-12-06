// src/screens/Saved/SavedPropertiesScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SavedPropertyCard from "../../../../components/SavedPropertyCard";
import { fetchSavedProperties } from "../../../../data/SavedProperties";
import arrow from "../../../../assets/arrow.png";

export default function SavedPropertiesScreen() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await fetchSavedProperties();
    setSaved(data);
  };
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <ScrollView className="flex-1 bg-white px-4">
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-4 py-4"
          style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
          {/* Back icon */}
          <TouchableOpacity onPress={() => router.push("/home")}>
            <Image source={arrow} className="w-6 h-6" />
          </TouchableOpacity>

          {/* Title (RIGHT aligned) */}
          <Text className="text-lg font-bold text-black mr-auto ml-3">
            Saved Properties
          </Text>

          {/* Save icon – green BG + white icon */}
          <TouchableOpacity className="ml-3 bg-green-600 p-2 rounded-full">
            <Ionicons name="bookmark-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Subtitle (Right below title & right-aligned) */}
        <Text className="text-gray-500 text-left px-4 mt-[-12] mb-3 ml-8">
          {saved.length} Properties Saved
        </Text>

        {/* Search Bar */}
        <View className="bg-white border-2 border-gray-100 rounded-2xl flex-row items-center px-4 py-2 mb-4 mx-4">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search properties in Vizag..."
            placeholderTextColor="#999"
            className="flex-1 ml-3 text-gray-700"
          />
          <Ionicons name="mic-outline" size={22} color="gray" />
        </View>

        {/* Cards */}
        <View className="px-4">
          {saved.map((property) => (
            <SavedPropertyCard key={property.id} data={property} />
          ))}
        </View>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
