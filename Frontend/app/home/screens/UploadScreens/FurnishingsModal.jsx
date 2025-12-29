// Landstime_Androidapp/Frontend/app/home/screens/UploadScreens/FurnishingsModal.jsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FurnishingsModal({
  visible,
  onClose,
  subtitle = "Select furnishings",
  onSubmit,
}) {
  const initialItems = [
    "Light",
    "Fans",
    "AC",
    "TV",
    "Beds",
    "Wardrobe",
    "Geyser",
  ];

  const secondaryItems = [
    "Sofa",
    "Washing Machine",
    "Stove",
    "Fridge",
    "Water Purifier",
    "Microwave",
    "Modular Kitchen",
    "Chimney",
    "Dining Table",
    "Curtains",
    "Exhaust Fan",
  ];

  const [quantities, setQuantities] = useState(
    Object.fromEntries(initialItems.map((i) => [i, 0]))
  );

  const [selectedSecondary, setSelectedSecondary] = useState([]);

  /* Quantity handlers */
  const increase = (item) => {
    setQuantities((prev) => ({ ...prev, [item]: prev[item] + 1 }));
  };

  const decrease = (item) => {
    setQuantities((prev) => ({
      ...prev,
      [item]: Math.max(0, prev[item] - 1),
    }));
  };

  /* Checkbox toggle */
  const toggleSecondary = (item) => {
    setSelectedSecondary((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handleClear = () => {
    setQuantities(Object.fromEntries(initialItems.map((i) => [i, 0])));
    setSelectedSecondary([]);
  };

  const handleSubmit = () => {
    const selectedQuantities = Object.entries(quantities).filter(
      ([_, qty]) => qty > 0
    );

    onSubmit({
      quantities: selectedQuantities,
      extras: selectedSecondary,
    });

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl p-5 max-h-[80%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-3">
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} />
            </TouchableOpacity>

            <Text className="text-lg font-semibold">Add Furnishings</Text>

            <TouchableOpacity onPress={handleClear}>
              <Text className="text-green-600 font-semibold">Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Subtitle */}
          <Text className="text-gray-500 mb-4">{subtitle}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 🔹 Quantity Section */}
            

            {initialItems.map((item) => (
              <View
                key={item}
                className="flex-row justify-between items-center py-3 border-b border-gray-100"
              >
                <Text className="text-gray-800">{item}</Text>

                <View className="flex-row items-center gap-4">
                  <TouchableOpacity
                    onPress={() => decrease(item)}
                    className="w-8 h-8 rounded-full border items-center justify-center"
                  >
                    <Text className="text-lg">−</Text>
                  </TouchableOpacity>

                  <Text className="w-6 text-center font-semibold">
                    {quantities[item]}
                  </Text>

                  <TouchableOpacity
                    onPress={() => increase(item)}
                    className="w-8 h-8 rounded-full bg-green-500 items-center justify-center"
                  >
                    <Text className="text-white text-lg">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* 🔹 Checkbox Section */}
            

            {secondaryItems.map((item) => {
              const selected = selectedSecondary.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => toggleSecondary(item)}
                  className="flex-row justify-between items-center py-3 border-b border-gray-100"
                >
                  <Text className="text-gray-800">{item}</Text>

                  <Ionicons
                    name={
                      selected
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={22}
                    color={selected ? "#22C55E" : "#999"}
                  />
                </TouchableOpacity>
              );
            })}

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-green-500 py-3 mt-6 mb-4 rounded-xl items-center"
            >
              <Text className="text-white font-semibold text-lg">
                Done
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
