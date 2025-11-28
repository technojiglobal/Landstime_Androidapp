import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MessageCard({ chat, onPress }) {
  return (
    <TouchableOpacity
      className={`flex-row items-center px-4 py-3 ${
        chat.unreadCount > 0 ? "bg-[#22C55E11]" : "bg-white"
      }`}
      onPress={onPress}
    >
      {/* User Image */}
      <View className="relative">
       <Image source={{ uri: chat.image }} className="w-12 h-12 rounded-full" />

        {/* Online Dot */}
        {chat.online && (
          <View className="w-3 h-3 bg-green-500 absolute bottom-0 right-0 rounded-full border-2 border-white" />
        )}
      </View>

      {/* User Details */}
      <View className="flex-1 ml-4">
        <Text className="text-lg font-semibold text-[#0C2E2F]">
          {chat.name}
        </Text>
        <Text className="text-[#0007] text-xs">{chat.role}</Text>

        <Text
          className="text-gray-600 text-sm mt-1"
          numberOfLines={1}
        >
          {chat.lastMessage}
        </Text>
      </View>

      {/* Time + Unread */}
      <View className="items-end">
        <Text className="text-[11px] text-gray-500">{chat.time}</Text>

        {chat.unreadCount > 0 && (
          <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center mt-1">
            <Text className="text-white text-xs">{chat.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
