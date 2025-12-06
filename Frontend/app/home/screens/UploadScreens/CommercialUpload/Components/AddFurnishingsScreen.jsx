// app/AddFurnishingsScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddFurnishingsScreen({ onClose, onSubmit }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const incrementDecrementItems = ["Light", "Fans", "AC", "TV", "Beds", "Wardrobe", "Geyser"];

  const items = [
    "Light", "Fans", "AC", "TV", "Beds", "Wardrobe", "Geyser",
    "Sofa", "Washing Machine", "Stove", "Fridge", "Water Purifier",
    "Microwave", "Modular Kitchen", "Chimney", "Dining Table",
    "Curtains", "Exhaust Fan",
  ];

  const [itemCounts, setItemCounts] = useState(
    items.reduce((acc, item) => ({ ...acc, [item]: 0 }), {})
  );

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <View className="flex-1 justify-end">
      <TouchableOpacity className="flex-1 bg-black/30" onPress={onClose} activeOpacity={1} ></TouchableOpacity>
      <View className="bg-white h-[75%] rounded-t-2xl pt-5 px-5">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={26} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Add Furnishings</Text>
        <TouchableOpacity onPress={() => setSelectedItems([])}>
          <Text className="text-green-600 font-semibold">Clear All</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-gray-500 mb-4 text-left">At least 3 selections are mandatory</Text>

      {/* Furnishings List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            className="flex-row justify-between items-center py-3 border-b border-gray-100"
            style={{ gap: 12 }}
          >
            <Text className="text-gray-800 text-left">{item}</Text>
            {incrementDecrementItems.includes(item) ? (
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() =>
                    setItemCounts({ ...itemCounts, [item]: Math.max(0, itemCounts[item] - 1) })
                  }
                  className="w-7 h-7 rounded-full items-center justify-center border border-gray-300"
                >
                  <Text className="text-gray-600">-</Text>
                </TouchableOpacity>
                <Text className="mx-2 text-gray-800 w-5 text-center">{itemCounts[item]}</Text>
                <TouchableOpacity
                  onPress={() => setItemCounts({ ...itemCounts, [item]: itemCounts[item] + 1 })}
                  className="w-7 h-7 rounded-full items-center justify-center border border-gray-300"
                >
                  <Text className="text-gray-600">+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Ionicons
                name={
                  selectedItems.includes(item) ? "checkmark-circle" : "ellipse-outline"
                }
                size={22}
                color={selectedItems.includes(item) ? "#22C55E" : "#999"}
                onPress={() => toggleItem(item)}
              />
            )}
          </TouchableOpacity>
        ))}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={onClose}
          className="bg-green-500 py-3 mt-8 mb-6 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-lg">Submit</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
    </View>
  );
}