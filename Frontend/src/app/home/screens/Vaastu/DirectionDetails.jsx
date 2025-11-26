import React from "react";
import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DirectionDetails({ data }) {
  return (
    <View className="border border-gray-200 rounded-xl p-5 mb-7 bg-white">

      {/* Title */}
      <View className="flex flex-row items-center gap-2">
        <Image
          source={require("../../../../../assets/Vaastu-dir.png")}
          style={{ width: 13, height: 13 }}
          resizeMode="contain"
        />
        <Text className="text-gray-800 font-bold text-lg">{data.name}</Text>
      </View>

      <Text className="text-sm text-gray-500 mt-1">
        Element: {data.element} | Deity: {data.deity}
      </Text>

      {/* Benefits */}
      <View className="mt-6">
        <View className="flex-row items-center gap-2">
          <Image
            source={require("../../../../../assets/Do.png")}
            style={{ width: 15, height: 15 }}
            resizeMode="contain"
          />
          <Text className="font-semibold text-green-600 text-base">
            Benefits
          </Text>
        </View>

        {data.benefits.map((benefit, index) => (
          <View key={index} className="flex-row items-center mt-2">
            <Ionicons name="ellipse" size={6} color="#22c55e" />
            <Text className="text-gray-700 text-sm ml-2 flex-1">
              {benefit}
            </Text>
          </View>
        ))}
      </View>

      {/* Ideal Placements */}
      <View className="mt-6">
        <Text className="font-semibold text-gray-700 mb-3">
          ☆ Ideal Placements
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {data.idealPlacements.map((item, index) => (
            <View
              key={index}
              className="px-3 py-[3px] rounded-full border"
              style={{
                borderColor: "#0000001A",
                borderWidth: 1,
              }}
            >
              <Text className="text-sm text-gray-700">{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Avoid */}
      <View className="mt-6 ">
        <View className="flex-row items-center gap-2 mb-3">
          <Ionicons name="close-circle" size={18} color="#ef4444" />
          <Text className="font-semibold text-gray-700 text-base">
            Avoid
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {data.avoid.map((item, index) => (
            <View
              key={index}
              className="px-3 py-[3px] rounded-full border"
              style={{
                borderColor: "#0000001A",
                borderWidth: 1,
              }}
            >
              <Text className="text-sm text-gray-700">{item}</Text>
            </View>
          ))}
        </View>
      </View>

    </View>
  );
}
