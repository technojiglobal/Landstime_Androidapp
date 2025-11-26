import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import starImg from "../../../../../assets/star-3d.png"; 
export default function RoomOverviewScreen() {
  const router = useRouter();
  const { item } = useLocalSearchParams();
  const data = JSON.parse(item);

  return (
    <ScrollView className="flex-1 bg-white mt-12">

      {/* Top Image Section */}
      <View className="relative">
        <Image 
          source={data.image}
          className="w-full h-64"
          resizeMode="cover"
        />

        {/* Back Icon */}
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="absolute top-10 left-4 bg-black/30 p-2 rounded-full"
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>

        {/* Bookmark */}
        <TouchableOpacity className="absolute top-10 right-4 bg-black/30 p-2 rounded-full">
          <Ionicons name="bookmark-outline" size={22} color="white" />
        </TouchableOpacity>

        {/* Views + Likes */}
        <View className="absolute bottom-3 right-3 flex-row space-x-4">
          <View className=" px-2 py-1 rounded-2xl bg-[#302924CC] flex-row items-center mx-2 ">
            <Ionicons name="eye" size={16} color="white" />
            <Text className="text-white ml-1">{data.views}</Text>
          </View>
          <View className="flex-row items-center px-2 py-1 rounded-2xl bg-[#302924CC]">
            <Ionicons name="heart" size={16} color="white" />
            <Text className="text-white ml-1">{data.likes}</Text>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View className="p-4">

        {/* Title */}
        <Text className="text-xl font-bold text-gray-900">
          {data.title}
        </Text>

        {/* Rating Row */}
        <View className="flex-row justify-between items-center mt-2">

          {/* Left Rating */}
          <View className="flex-row items-center">
            <View className="flex-row my-2">
                     {[1, 2, 3, 4].map((_, i) => (
                       <Image
                         key={i}
                         source={starImg}
                         style={{
                           width: 22,
                           height: 22,
                           marginHorizontal: 2,
                           opacity: 1,
                         }}
                         resizeMode="contain"
                       />
                     ))}
           
                     <Image
                       source={starImg}
                       style={{
                         width: 22,
                         height: 22,
                         marginHorizontal: 2,
                         opacity: 0.3, // empty
                       }}
                       resizeMode="contain"
                     />
                   </View>
           
            <Text className="ml-1 text-gray-800 font-semibold">
              {data.rating}
            </Text>
            <Text className="ml-1 text-gray-500 text-sm">
              ({data.reviews})
            </Text>
          </View>

          {/* Button */}
          <TouchableOpacity className="bg-[#22C55E] px-4 py-2 rounded-full flex-row items-center">
            <Ionicons name="location-outline" size={18} color="white" />
            <Text className="ml-2 text-white font-semibold">See on Map</Text>
          </TouchableOpacity>

        </View>

        {/* Price Section */}
        <Text className="text-green-600 mt-3 text-xl font-bold">
          {data.minprice}
          <Text className="text-green-300 mt-3 text-lg font-bold">{data.maxprice}</Text>
        </Text>

        {/* Info Row */}
        <View className="flex-row justify-between mt-4">

          {/* Area */}
          <View className="items-center">
            <Text className="font-semibold text-base">{data.area}</Text>
            <Text className="text-gray-500 text-sm">sq ft</Text>
          </View>

          {/* Duration */}
          <View className="items-center">
            <Text className="font-semibold text-base">{data.duration}</Text>
            <Text className="text-gray-500 text-sm">Weeks</Text>
          </View>

          {/* Location */}
          <View className="items-center">
            <Text className="font-semibold text-base">{data.location}</Text>
            <Text className="text-gray-500 text-sm">Location</Text>
          </View>

        </View>

        {/* Description */}
        <Text className="mt-6 text-xl font-semibold">Description</Text>
            <Text className="text-gray-600 mt-2 leading-6">
            {data.description ||
                "Luxurious resort property nestled in the heart of Araku’s tea plantations. Features modern amenities, panoramic valley views, and excellent connectivity to major attractions. Perfect for hospitality business or private retreat.\n\nLuxurious resort property nestled in the heart of Araku’s tea plantations. Features modern amenities, panoramic valley views, and excellent connectivity to major attractions. Perfect for hospitality business or private retreat."
            }
            </Text>

        
        {/* Action Buttons */}
        <View className="flex-row justify-between mt-8">

          <TouchableOpacity className="flex-1 mr-2 border-2 border-green-600 py-3 rounded-xl items-center">
            <Text className="text-green-600 font-semibold">Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 ml-2 bg-green-600 py-3 rounded-xl items-center">
            <Text className="text-white font-semibold">
              Call +91 727272928
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </ScrollView>
  );
}
