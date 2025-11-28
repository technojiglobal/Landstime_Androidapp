// src/screens/Saved/NearbyPropertiesScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SavedPropertyCard from "../../../../components/SavedPropertyCard";
import { fetchNearbyProperties } from "../../../../data/NearbyProperties";
import arrow from "../../../../../assets/arrow.png";
import mapImg from "../../../../../assets/map.png";
import { useRouter } from "expo-router";

export default function NearbyPropertiesScreen() {
  const [properties, setProperties] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [category, setCategory] = useState("All");
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await fetchNearbyProperties();
    setProperties(data);
  };

  return (
    <View className="flex-1 bg-white pt-12">

      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-4">

        <TouchableOpacity onPress={() => router.back()}>
          <Image source={arrow} className="w-6 h-6" />
        </TouchableOpacity>

        {/* List View Title */}
        {viewMode === "list" && (
          <Text className="text-lg font-bold text-black ml-3 mr-auto">
            Nearby Properties
          </Text>
        )}

        {/* Map View Location */}
        {viewMode === "map" && (
          <View className="ml-4 mr-auto">
            <Text className="text-[12px] text-gray-500 mb-1">
              Current Location
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="location" size={20} color="#16A34A" />
              <Text className="text-[16px] font-semibold text-black ml-1">
                Maddilapalem
              </Text>
              <Ionicons name="chevron-down" size={18} color="gray" />
            </View>
          </View>
        )}

        {/* Toggle Buttons */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setViewMode("list")}
            className={`p-2 rounded-xl border 
              ${viewMode === "list" ? "bg-[#16A34A] border-[#16A34A]" : "bg-white border-gray-300"}`}
          >
            <Ionicons
              name="list-outline"
              size={20}
              color={viewMode === "list" ? "#fff" : "#16A34A"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setViewMode("map")}
            className={`p-2 rounded-xl border 
              ${viewMode === "map" ? "bg-[#16A34A] border-[#16A34A]" : "bg-white border-gray-300"}`}
          >
            <Ionicons
              name="map-outline"
              size={20}
              color={viewMode === "map" ? "#fff" : "#16A34A"}
            />
          </TouchableOpacity>
        </View>

      </View>

      {/* Map View Filter Chips */}
      {viewMode === "map" && (
        <View className="px-4 mt-2" style={{ height: 40 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {["All", "Sites", "Resorts", "Plots", "Commercial"].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setCategory(item)}
                className={`px-6 h-8 rounded-lg mr-3 border justify-center
                  ${category === item ? "bg-[#16A34A] border-[#16A34A]" : "bg-white border-gray-300"}`}
              >
                <Text
                  className={`text-sm font-medium
                    ${category === item ? "text-white" : "text-gray-600"}`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <>
          {/* Search Bar */}
          <View className="bg-white border-2 border-gray-100 rounded-2xl flex-row items-center mx-4 px-4 py-2 mb-4">
            <Ionicons name="search" size={20} color="gray" />
            <TextInput
              placeholder="Search properties in Vizag..."
              placeholderTextColor="#999"
              className="flex-1 ml-3 text-gray-700"
            />
            <Ionicons name="mic-outline" size={22} color="gray" />
          </View>

          <ScrollView className="px-4">
            {properties.map((property) => (
              <SavedPropertyCard key={property.id} data={property} />
            ))}
            <View className="h-10" />
          </ScrollView>
        </>
      )}

      {/* MAP VIEW */}
      {viewMode === "map" && (
        <View className="flex-1">
          <Image
            source={mapImg}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      )}
    </View>
  );
}
