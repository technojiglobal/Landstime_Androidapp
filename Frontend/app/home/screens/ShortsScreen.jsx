// Landstime_Androidapp/Frontend/app/home/screens/ShortsScreen.jsx

import { View, Image, TouchableOpacity } from "react-native";
import React from "react";
import ShortsImg from "../../../assets/shorts.jpg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ShortsScreen = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      
      {/* Back Arrow - Top Right */}
      <TouchableOpacity
        onPress={() =>router.push("/(tabs)/home")}
        className="absolute top-12 left-5 z-10  bg-white p-2 rounded-full"
      >
        <Ionicons name="chevron-back-outline" size={22} color="black" />
      </TouchableOpacity>

      {/* Image */}
      <Image
        source={ShortsImg}
        className="w-full h-full rounded-xl"
        resizeMode="cover"
      />
    </View>
  );
};

export default ShortsScreen;
