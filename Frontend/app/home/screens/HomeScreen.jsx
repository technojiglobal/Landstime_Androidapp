// HomeScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from "../../../utils/responsive";
import bell from "../../../assets/Bell-icon.png";

export default function HomeScreen({ toggleSidebar }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { scaleWidth, scaleHeight } = useResponsive();

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");

  const languages = [
    { code: "EN", label: "English", enabled: true },
    { code: "HI", label: "हिन्दी", enabled: true },
    { code: "TE", label: "తెలుగు", enabled: true },
  ];

  const categories = [
    { name: "Sites", desc: "Plot Land", img: require("../../../assets/Home.png") },
    { name: "Resorts", desc: "Luxury Getaways", img: require("../../../assets/palm tree.png") },
    { name: "Flats", desc: "Investment Land", img: require("../../../assets/Tree.png") },
    { name: "Commercial", desc: "Business Spaces", img: require("../../../assets/Bank.png") },
  ];

  const handleCategoryPress = (name) => {
    router.push(`/home/screens/${name}`);
  };

  return (
    <ScrollView className="flex-1 bg-white">

      {/* Banner */}
      <ImageBackground
        source={require("../../../assets/homescreen_banner.png")}
        resizeMode="cover"
        style={{ height: scaleHeight(240), justifyContent: "center" }}
      >
        {/* Hamburger */}
        <TouchableOpacity
          onPress={toggleSidebar}
          style={{
            position: "absolute",
            top: insets.top + scaleHeight(10),
            left: 20,
            zIndex: 20,
          }}
        >
          <Ionicons name="menu" size={scaleWidth(28)} color="white" />
        </TouchableOpacity>

        {/* Notification Icon */}
        <TouchableOpacity
          onPress={() => router.push("/home/screens/Notifications")}
          style={{
            position: "absolute",
            top: insets.top + scaleHeight(10),
            right: 20,
            backgroundColor: "white",
            width: scaleWidth(36),
            height: scaleWidth(36),
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image source={bell} style={{ width: 18, height: 18 }} />
        </TouchableOpacity>

        <Text className="text-white font-bold text-2xl ml-6 mt-12">
          Find Your Dream Property
        </Text>
        <Text className="text-white font-semibold ml-6 mt-2">
          Explore premium real estate options in Vizag
        </Text>
      </ImageBackground>

      {/* Search */}
      <View className="flex-row items-center bg-white mx-10 mt-[-20] p-2 rounded-xl shadow-md">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput placeholder="Search properties..." className="ml-2 flex-1" />
      </View>

      {/* Categories */}
      <View className="px-10 mt-6">
        <View className="flex-row flex-wrap justify-between">
          {categories.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              className="bg-white rounded-2xl border-l-8 border-[#22C55E] p-4 items-center justify-center mb-6"
              style={{ width: "45%", aspectRatio: 0.85 }}
              onPress={() => handleCategoryPress(item.name)}
            >
              <View className="bg-[#22C55E] w-10 h-10 rounded-xl justify-center items-center mb-3">
                <Image source={item.img} style={{ width: 20, height: 20 }} />
              </View>

              <Text className="font-semibold text-center">{item.name}</Text>
              <Text className="text-xs text-gray-500 text-center">{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
