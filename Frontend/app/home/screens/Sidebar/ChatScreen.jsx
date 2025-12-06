// src/screens/Chat/ChatScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image,TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChatBubble from "../../../../components/ChatBubble";
import { fetchChatMessages, fetchChats } from "../../../../data/Chat";
import { useLocalSearchParams, useRouter } from "expo-router";
import arrow from "../../../../assets/arrow.png"
export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const chats = await fetchChats();
    setChatInfo(chats.find((c) => c.id === id));

    const msgs = await fetchChatMessages(id);
    setMessages(msgs);
  };

  const handleSend = () => {
    if (input.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "me",
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <View className="flex-1 bg-white pt-16 ">

      {/* Header */}
      <View className="flex-row items-center px-4 ">
        <TouchableOpacity onPress={() => router.push("/home/screens/Sidebar/MessagesScreen")}>
          <Image  source={arrow}  className="w-6 h-6"/>
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="text-2xl font-semibold mb-1">{chatInfo?.name}</Text>
          <Text className="text-green-500 text-xs">Online</Text>
        </View>
    
        <TouchableOpacity onPress={() =>
                router.push({
                pathname: "home/screens/Sidebar/Call",
                params: {
                    name: chatInfo?.name,
                    image: chatInfo?.image, // must be uri
                },
                })
            }
        >
          <Ionicons
                name="call-outline"
                size={26}
                color="#22C55E"
          />
        </TouchableOpacity>

      </View>

      {/* Chat Messages */}
      <ScrollView className="flex-1 px-4 mt-4 mb-4">
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} 
          className="mb-4"
          />
        ))}
      </ScrollView>

      {/* Input Bar */}
      <View className="flex-row items-center bg-white border-t border-gray-200 px-4 py-3 mb-12">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Write a text Message..."
          className="flex-1 border-2 border-[#22C55E]  rounded-2xl px-4 py-5"
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          onPress={handleSend}
          className="bg-[#22C55E] w-12 h-12 rounded-full items-center justify-center ml-3"
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
