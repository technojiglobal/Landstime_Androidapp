// Frontend//app//home//screens//UploadScreens//AddFurnishingsScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AddFurnishingsScreen() {
  const navigation = useNavigation();
  const [selectedItems, setSelectedItems] = useState([]);

  const items = [
    "Light", "Fans", "AC", "TV", "Beds", "Wardrobe", "Geyser",
    "Sofa", "Washing Machine", "Stove", "Fridge", "Water Purifier",
    "Microwave", "Modular Kitchen", "Chimney", "Dining Table",
    "Curtains", "Exhaust Fan"
  ];

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  return (
    <View className="flex-1 bg-white pt-10 px-5">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={26} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Add Furnishings</Text>
        <TouchableOpacity onPress={() => setSelectedItems([])}>
          <Text className="text-green-600 font-semibold">Clear All</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-gray-500 mb-4 text-left">
        At least 3 selections are mandatory
      </Text>

      {/* Furnishings List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => toggleItem(item)}
            className="flex-row justify-between items-center py-3 border-b border-gray-100"
          >
            <Text className="text-gray-800 text-left">{item}</Text>
            <Ionicons
              name={
                selectedItems.includes(item)
                  ? "checkmark-circle"
                  : "ellipse-outline"
              }
              size={22}
              color={selectedItems.includes(item) ? "#22C55E" : "#999"}
            />
          </TouchableOpacity>
        ))}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-green-500 py-3 mt-8 mb-6 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-lg">Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}