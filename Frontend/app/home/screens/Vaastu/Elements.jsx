import React from "react";
import { View, Text, ScrollView } from "react-native";

export default function Elements() {
  const elements = [
    {
      name: "Water(Jal)",
      direction: "North & Northeast",
      benefits: ["Wealth", "Peace", "Prosperity"],
      items: ["Water Storage", "Aquarium", "Fountain", "Well"],
    },
    {
      name: "Fire(Agni)",
      direction: "South & Southeast",
      benefits: ["Health", "Energy", "Vitality"],
      items: ["Kitchen", "Electrical Panel", "Generator", "Fireplace"],
    },
    {
      name: "Air(Vayu)",
      direction: "East & Northwest",
      benefits: ["Movement", "Growth", "Communication"],
      items: ["Windows", "Balconies", "Open Spaces", "Ventilation"],
    },
    {
      name: "Earth(Prithvi)",
      direction: "West & Southwest",
      benefits: ["Stability", "Strength", "Grounding"],
      items: ["Bedroom", "Heavy Storage", "Foundation", "Walls"],
    },
    {
      name: "Space(Akash)",
      direction: "Center(Brahmasthana)",
      benefits: ["Balance", "Harmony", "Spiritual Growth"],
      items: ["Courtyard", "Living Room", "Central Hall", "Open Area"],
    },
  ];

  return (
    <ScrollView className="mt-4 pb-7">
      {elements.map((ele, index) => (
        <View
          key={index}
          className="bg-white rounded-xl p-5 border border-gray-200 mb-5"
        >
          {/* Title Row */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-900">
              {ele.name}
            </Text>

            <View className="px-3 py-1 rounded-lg border border-gray-200">
              <Text className="text-xs font-medium text-gray-400">
                {ele.direction}
              </Text>
            </View>
          </View>

          {/* Benefits */}
          <Text className="font-medium text-gray-800 mb-2">Benefits:</Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            {ele.benefits.map((benefit, i) => (
              <View
                key={i}
                className="px-4 py-1 border border-gray-300 rounded-full"
              >
                <Text className="text-gray-600 text-sm">{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Suitable Items */}
          <Text className="font-medium text-gray-800 mb-2">Suitable Items:</Text>
          <View className="flex-row flex-wrap gap-x-4 gap-y-2">
            {ele.items.map((item, i) => (
              <View key={i} className="flex-row items-center">
                <View className="w-2 h-2 bg-[#22C55E] rounded-full mr-2" />
                <Text className="text-gray-700 text-sm">{item}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
