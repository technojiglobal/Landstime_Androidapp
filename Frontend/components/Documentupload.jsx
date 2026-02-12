//Frontened//components//Documentupload.jsx
import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function DocumentUpload({
  title,
  subtitle,
  files,
  setFiles,
  required = false,
}) {
  const pickFile = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ❌ no video
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    // ✅ Extract filename correctly
    const filename = asset.uri.split("/").pop();

    // ✅ Extract mime-type safely
    const ext = filename.split(".").pop().toLowerCase();
    const mimeType =
      ext === "png"
        ? "image/png"
        : ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : "application/octet-stream";

    setFiles([
      {
        uri: asset.uri,
        name: filename,
        type: mimeType,
      },
    ]);
  };

  const removeFile = () => {
    setFiles([]);
  };

  return (
    <View className="bg-white rounded-xl border border-gray-200 p-4 m-4">
      <Text className="text-base font-semibold">{title}</Text>
      <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>

      {/* Upload box */}
      <View className="border border-dashed border-gray-300 rounded-lg mt-4 p-5 items-center">
        <Ionicons name="camera-outline" size={34} color="#9CA3AF" />
        <Text className="mt-2 text-gray-600 font-medium">Add Photos</Text>

        <TouchableOpacity
          onPress={pickFile}
          className="mt-3 px-4 py-2 border border-gray-300 rounded-md"
        >
          <Text className="text-gray-700">Upload Photos</Text>
        </TouchableOpacity>

        <Text className="text-xs text-gray-400 mt-2">
          JPEG or PNG only (Max 10MB)
        </Text>
      </View>

      {/* Uploaded file */}
      {files.length > 0 && (
        <View className="flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-3">
          <View className="flex-row items-center flex-1">
            <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
            <View className="ml-2 flex-1">
              <Text numberOfLines={1} className="text-sm font-medium">
                {files[0].name}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={removeFile}>
            <Ionicons name="trash-outline" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      )}

      {required && files.length === 0 && (
        <Text className="text-red-500 text-xs mt-2">
          * This field is required
        </Text>
      )}
    </View>
  );
}
