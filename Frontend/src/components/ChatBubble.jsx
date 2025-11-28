import React from "react";
import { View, Text } from "react-native";

export default function ChatBubble({ message }) {
  const isMe = message.sender === "me";

  return (
    <View
      className={`max-w-[80%] px-4 py-3 rounded-2xl mb-2 ${
        isMe
          ? "bg-[#22C55E] self-end rounded-br-none"
          : "bg-white border border-gray-200  self-start rounded-bl-none"
      }`}
    >
      <Text className={`${isMe ? "text-white" : "text-black"}`}>
        {message.text}
      </Text>
    </View>
  );
}
