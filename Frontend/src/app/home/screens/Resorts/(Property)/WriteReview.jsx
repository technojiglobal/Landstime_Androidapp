import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const WriteReview = () => {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      {/* Header */}
      <View className="flex-row items-center mb-6">
         <TouchableOpacity onPress={() => {router.push('/home/screens/Resorts')}}>
           <Ionicons name="chevron-back-outline" size={22} />
         </TouchableOpacity>
        <Text className="text-lg font-neue font-semibold ml-2">Property Details</Text>
      </View>

      {/* Input Fields */}
      <TextInput
        className="border border-gray-300 rounded-2xl p-3 text-base font-neue mb-4"
        placeholder="Summarize your experience..."
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        className="border border-gray-300 rounded-2xl p-3 text-base font-neue h-40 text-gray-800"
        placeholder="Tell others about your experience with this property, the agent/location, and any other relevant details..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <Text className="text-xs text-gray-400 mt-2 font-neue">
        Minimum 50 characters required
      </Text>

      {/* Buttons */}
      <View className="flex-row justify-between mt-6 space-x-3">
        <TouchableOpacity className="flex-1 border border-gray-300 rounded-2xl py-3 items-center">
          <Text className="font-neue font-medium text-gray-800">Save as Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 bg-gray-900 rounded-2xl py-3 items-center">
          <Text className="font-neue font-semibold text-white">Submit Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WriteReview;