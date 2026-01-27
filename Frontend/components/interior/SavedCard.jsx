// Landstime_Androidapp/Frontend/components/interior/SavedCard.jsx
import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import scaleIcon from "../../assets/scale-icon.png";
import clockIcon from "../../assets/clock.png";
import locationIcon from "../../assets/location-icon2.png";
import starIcon from "../../assets/star-3d.png";
export default function SavedCard({ item }) {
  return (
    <View className="bg-white rounded-xl p-3 mb-4 border border-gray-200 shadow-sm">

      {/* 🚀 ROW: Image Left + Content Right */}
      <View className="flex-row">
        
        {/* LEFT IMAGE */}
        <Image
          source={item.image}
          className="w-24 h-24 rounded-lg"
        />

        {/* RIGHT CONTENT */}
        <View className="flex-1 ml-3 justify-between">

          {/* TITLE + RATING */}
          <View className="flex-row  items-start">
            <Text className="text-[16px] font-semibold" numberOfLines={1}>
              {item.title}
            </Text>

            <View className="flex-row  mt-1 ml-2 items-center">
              <Image source={starIcon} className="w-4 h-4" />
              <Text className="ml-1 text-gray-700 text-xs">{item.rating}</Text>
            </View>
          </View>

          {/* DETAIL ROWS */}
          <View className="flex-row justify-between mt-1">

            {/* Size */}
            <View className="flex-row items-center space-x-1">
              <Image source={scaleIcon} className="w-3 h-3 mx-1" />
              <Text className="text-[10px] text-gray-600">{item.size}</Text>
            </View>

            {/* Time */}
            <View className="flex-row items-center space-x-1">
              <Image source={clockIcon} className="w-3 h-3 mx-1" />
              <Text className="text-[10px] text-gray-600">{item.time}</Text>
            </View>

            {/* Location */}
            <View className="flex-row items-center space-x-1">
              <Image source={locationIcon} className="w-3 h-3 mx-1" />
              <Text className="text-[10px] text-gray-600">{item.location}</Text>
            </View>
          </View>

          {/* PRICE */}
          <Text className="text-green-600 text-[15px] font-semibold mt-2">
            {item.price}
          </Text>
        </View>
      </View>

    </View>
  );
}
