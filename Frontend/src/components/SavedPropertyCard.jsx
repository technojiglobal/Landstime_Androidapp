// src/components/saved/SavedPropertyCard.jsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import starImg from "../../assets/star-3d.png";
import saveIcon from "../../assets/saved-green.png";
import locationIcon from "../../assets/location-icon.png";

export default function SavedPropertyCard({ data }) {
  return (
    <View className="bg-white rounded-2xl shadow-md  border border-gray-100 mb-4">

      {/* Image */}
      <View className="relative">
        <Image
          source={data.image}
          className="w-full h-44 rounded-t-2xl"
          resizeMode="cover"
        />

        {/* Bookmark Icon */}
        <View className="absolute  w-8 h-8 rounded-full bg-white  items-center right-3  ">
          <Image source={saveIcon} className="w-5 h-5 mt-2 " />
        </View>
      </View>

      {/* Content */}
      <View className="p-4">

        {/* Title + Verified Right */}
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-semibold text-[#22C55E] flex-1">
            {data.title}
          </Text>

          {/* Verified Badge on Right */}
          <View className="bg-[#22C55E] px-3 py-1 rounded-full flex-row items-center ml-2">
            <Ionicons name="checkmark-circle" size={15}  color="white" />
            <Text className="ml-1 text-white text-xs font-bold">
              Verified
            </Text>
          </View>
        </View>

        {/* Subtitle */}
        <Text className="text-sm text-gray-600 mt-1">{data.subtitle}</Text>

        {/* Rating */}
        <View className="flex-row items-center mt-2">
          <View className="flex-row my-2">
            {[1, 2, 3, 4].map((_, i) => (
              <Image
                key={i}
                source={starImg}
                style={{ width: 22, height: 22, marginHorizontal: 2 }}
                resizeMode="contain"
              />
            ))}

            <Image
              source={starImg}
              style={{ width: 22, height: 22, marginHorizontal: 2, opacity: 0.3 }}
              resizeMode="contain"
            />
          </View>

          <Text className="ml-2 text-gray-700 text-sm font-bold">
            {data.rating}.0 ({data.reviews} reviews)
          </Text>
        </View>

        {/* Location */}
        <View className="flex-row items-center mt-2 justify-between">
          <View className="flex-row items-center">
            <Image source={locationIcon} className="w-4 h-4 mx-1" />
            <Text className="text-gray-500 text-md ">{data.location}</Text>
          </View>
          <View className="bg-[#22C55E] px-5 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold">
              ₹ {data.price}
            </Text>
          </View>
        </View>
        {/* Price Button Right */}
        

      </View>
    </View>
  );
}
