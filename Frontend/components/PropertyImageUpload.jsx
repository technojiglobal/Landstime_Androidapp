//Frontend/components/PropertyImageUpload.jsx

import React from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function PropertyImageUpload({
  images,
  onPickImage,
  onRemoveImage,
  onViewGuidelines,
  onWatchTutorial,
}) {
  return (
    <View className="border rounded-xl border-gray-300 bg-white mb-4">
      {/* Header */}
      <View className="px-4 py-4 flex-row justify-between items-center">
        <Text className="font-semibold text-base text-gray-900">
          Property Details
        </Text>
        <TouchableOpacity onPress={onViewGuidelines}>
          <Text className="text-sm font-medium text-green-500">
            View Guidelines
          </Text>
        </TouchableOpacity>
      </View>

      {/* Upload Box */}
      <View className="px-4">
        <TouchableOpacity
          onPress={onPickImage}
          className="
            border-2 border-dashed border-gray-300
            rounded-xl
            py-8
            items-center
            justify-center
            bg-white
          "
        >
          {/* Camera Icon */}
          <Ionicons name="camera-outline" size={36} color="#9CA3AF" />

          {/* Main Text */}
          <Text className="mt-3 text-gray-700 font-medium">
            Add Photos or Videos
          </Text>

          {/* Sub Text */}
          <Text className="text-xs text-gray-500 mt-1">
            Support 360° view photos
          </Text>

          {/* Upload Button */}
          <View className="mt-4 px-4 py-2 border border-gray-300 rounded-md">
            <Text className="text-gray-700 text-sm">
              Upload Photos
            </Text>
          </View>

          {/* Format Info */}
          <Text className="text-xs text-gray-400 mt-3">
            Required format: JPEG, PNG (Max 10MB per file)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Uploaded Images Preview */}
      {images.length > 0 && (
        <FlatList
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 mt-4"
          renderItem={({ item, index }) => (
            <View className="relative mr-3">
              <Image
                source={{ uri: item }}
                className="w-28 h-28 rounded-lg"
              />
              <TouchableOpacity
                onPress={() => onRemoveImage(index)}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
              >
                <Ionicons name="close" size={14} color="white" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      )}

      {/* Tutorial Button */}
      <TouchableOpacity
        onPress={onWatchTutorial}
        className="
          flex-row items-center justify-center
          mx-4 my-4
          py-3
          border border-gray-300
          rounded-lg
        "
      >
        <Ionicons name="play-outline" size={18} color="#6B7280" />
        <Text className="ml-2 text-gray-600 text-sm">
          Watch Tutorial: How to Take 360° Photos
        </Text>
      </TouchableOpacity>
    </View>
  );
}