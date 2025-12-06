// src/screens/Messages/MessagesScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image,TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MessageCard from "../../../../components/MessageCard";
import { fetchChats } from "../../../../data/Chat";
import { useRouter } from "expo-router";
import arrow from "../../../../assets/arrow.png"
export default function MessagesScreen() {
  const [chats, setChats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const result = await fetchChats();
    setChats(result);
  };

  return (
    <ScrollView className="flex-1 bg-white pt-12">

      {/* Header */}
      <View className="flex-row items-center px-4 mb-3 mt-5">
         <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
              <Image  source={arrow}  className="w-6 h-6"/>
          </TouchableOpacity>
        <Text className="text-xl font-bold ml-4">Messages</Text>
      </View>

      {/* Search */}
      <View className="mx-4  border border-gray-100 rounded-2xl flex-row items-center px-4 py-3 mb-4">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search properties in Vizag..."
          placeholderTextColor="#999"
          className="flex-1 ml-3"
        />
        <Ionicons name="mic-outline" size={22} color="gray" />
      </View>

      {chats.map((chat) => (
  <MessageCard
    key={chat.id}
    chat={chat}
    onPress={() =>
      router.push({
        pathname: "/home/screens/Sidebar/ChatScreen",
        params: { id: chat.id,
           name: chat.name,
      image: chat.image, 
         },

      })
    }
  />
))}


      <View className="h-10" />

    </ScrollView>
  );
}
