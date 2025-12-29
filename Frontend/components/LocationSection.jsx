import React from "react";
import { View, Text, TextInput, Image } from "react-native";

export default function LocationSection({
  location,
  setLocation,
  locality,
  setLocality,
}) {
  return (
    <View
      className="bg-white rounded-xl p-4 mb-4"
      style={{ borderWidth: 1, borderColor: "#E5E7EB" }}
    >
      {/* Title */}
      <Text className="text-[15px] font-semibold text-gray-800 mb-3">
        Location
      </Text>

      {/* Location Input */}
      <View
        className="flex-row items-center rounded-lg px-3 py-3 mb-3"
        style={{
          borderWidth: 1,
          borderColor: "#E5E7EB",
          backgroundColor: "#F9FAFB",
        }}
      >
        <Image
          source={require("../assets/location.png")} // update path if needed
          style={{ width: 18, height: 18, marginRight: 8 }}
        />
        <TextInput
          placeholder="Enter Property Location"
          placeholderTextColor="#9CA3AF"
          value={location}
          onChangeText={setLocation}
          className="flex-1 text-[14px] text-gray-800"
        />
      </View>

      {/* Locality Input */}
      <TextInput
        placeholder="Locality"
        placeholderTextColor="#9CA3AF"
        value={locality}
        onChangeText={setLocality}
        className="rounded-lg px-3 py-3 text-[14px] text-gray-800"
        style={{
          borderWidth: 1,
          borderColor: "#E5E7EB",
          backgroundColor: "#F9FAFB",
        }}
      />
    </View>
  );
}
