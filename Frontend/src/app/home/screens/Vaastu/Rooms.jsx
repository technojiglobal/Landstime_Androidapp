import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import VastuIcon from "../../../../../assets/vastu.png"; // update if different path

export default function Rooms() {
  const rooms = [
    {
      title: "Main Entrance",
      desc: "The main door should ideally face North, East, or Northeast.",
      tips: [
        "Keep entrance clean and well-lit",
        "Use high-quality materials for the door",
        "Avoid obstacles in front of the door",
        "Place auspicious symbols like Om or Swastik",
      ],
    },
    {
      title: "Kitchen",
      desc: "Southeast corner is ideal for kitchen placement",
      tips: [
        "Cook facing East for better health",
        "Keep kitchen clean and organized",
        "Avoid kitchen in Northeast corner",
        "Use light colors for kitchen tiles",
      ],
    },
    {
      title: "Pooja Room",
      desc: "Northeast corner is most auspicious for worship",
      tips: [
        "Face East or North while praying",
        "Keep the area clean and sacred",
        "Use white or light yellow colors",
        "Place idols on a raised platform",
      ],
    },
    {
      title: "Study Room",
      desc: "East or Northeast enhances concentration and learning",
      tips: [
        "Face East or North while studying",
        "Keep books organized and clean",
        "Use good lighting",
        "Avoid clutter on the study table",
      ],
    },
  ];

  return (
    <ScrollView className="mt-4 mb-10">
      {rooms.map((room, index) => (
        <View
          key={index}
          className="bg-white rounded-xl p-5 border border-gray-200 mb-5"
        >
          {/* Title + Desc */}
          <Text className="text-lg font-semibold text-gray-900">
            {room.title}
          </Text>
          <Text className="text-gray-600 text-sm mt-1">{room.desc}</Text>

          {/* Vaastu Icon + Heading */}
          <View className="flex-row items-center gap-2 mt-3 mb-1">
            <Image
              source={VastuIcon}
              className="w-5 h-5"
              resizeMode="contain"
            />
            <Text className="font-semibold text-gray-700">Vaastu Tips</Text>
          </View>

          {/* Bullet Tips */}
          {room.tips.map((tip, i) => (
            <View key={i} className="flex-row items-start gap-2 mt-1">
              <View className="w-2 h-2 bg-[#22C55E] rounded-full mt-1" />
              <Text className="text-gray-700 text-sm">{tip}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
