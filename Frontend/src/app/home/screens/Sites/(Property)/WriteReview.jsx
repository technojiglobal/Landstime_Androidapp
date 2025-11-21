import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // ✅ Import router hook

const WriteReview = () => {
  const router = useRouter(); // ✅ Must be inside the component
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.push("/home/screens/Sites")}>
          <Ionicons name="chevron-back-outline" size={22} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold ml-2 text-black">
          Property Details
        </Text>
      </View>

      {/* Input Fields */}
      <TextInput
        className="border border-gray-300 rounded-2xl p-3 text-base mb-4 text-gray-900"
        placeholder="Summarize your experience..."
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        className="border border-gray-300 rounded-2xl p-3 text-base h-40 text-gray-900"
        placeholder="Tell others about your experience with this property, the agent/location, and any other relevant details..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <Text className="text-xs text-gray-400 mt-2">
        Minimum 50 characters required
      </Text>

      {/* Buttons */}
      <View className="flex-row justify-between mt-6 space-x-3">
        <TouchableOpacity className="flex-1 border border-gray-300 rounded-2xl py-3 items-center">
          <Text className="text-gray-800 font-medium">Save as Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 bg-gray-900 rounded-2xl py-3 items-center">
          <Text className="text-white font-semibold">Submit Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WriteReview;
