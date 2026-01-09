//Frontend//components//ImageUpload.jsx

import React from "react";
import { View, Text, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function ImageUpload({
  title,
  subtitle,
  files,
  setFiles,
  required = false,
}) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const selectedAssets = result.assets.map(asset => {
        const filename = asset.uri.split("/").pop();
        const ext = filename.split(".").pop().toLowerCase();
        const mimeType =
          ext === "png"
            ? "image/png"
            : ext === "jpg" || ext === "jpeg"
            ? "image/jpeg"
            : "application/octet-stream";

        return {
            uri: asset.uri,
            name: filename,
            type: mimeType,
        };
    });

    setFiles(prevFiles => [...prevFiles, ...selectedAssets]);
  };

  const removeImage = (uri) => {
    setFiles(files.filter(file => file.uri !== uri));
  };

  return (
    <View className="bg-white rounded-xl border border-gray-200 p-4 m-4">
      <Text className="text-base font-semibold">{title}</Text>
      <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>

      {/* Upload box */}
      <View className="border border-dashed border-gray-300 rounded-lg mt-4 p-5 items-center">
        <Ionicons name="images-outline" size={34} color="#9CA3AF" />
        <Text className="mt-2 text-gray-600 font-medium">Add Property Photos</Text>

        <TouchableOpacity
          onPress={pickImage}
          className="mt-3 px-4 py-2 border border-gray-300 rounded-md"
        >
          <Text className="text-gray-700">Upload Photos</Text>
        </TouchableOpacity>

        <Text className="text-xs text-gray-400 mt-2">
          JPEG or PNG only (Max 10MB)
        </Text>
      </View>

    {files.length > 0 && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="mt-4">
          {files.map((file, index) => (
            <View key={`${file.uri}-${index}`} className="relative mr-2">
              <Image source={{ uri: file.uri }} className="w-24 h-24 rounded-lg" />
              <TouchableOpacity onPress={() => removeImage(file.uri)} className="absolute top-1 right-1 bg-red-500 rounded-full p-1">
                <Ionicons name="close" size={12} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {required && files.length === 0 && (
        <Text className="text-red-500 text-xs mt-2">
          * This field is required
        </Text>
      )}
    </View>
  );
}
