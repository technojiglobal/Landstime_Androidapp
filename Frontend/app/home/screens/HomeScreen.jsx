//Frontend//app//home//screens// HomeScreen.jsx
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
  StyleSheet
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from "../../../utils/responsive";
import bell from "../../../assets/Bell-icon.png";

export default function HomeScreen({ toggleSidebar ,sidebarOpen}) {
  const insets = useSafeAreaInsets();
  const { scaleWidth, scaleHeight } = useResponsive();

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");

  const router = useRouter();

  const languages = [
    { code: "EN", label: "English", enabled: true },
    { code: "HI", label: "हिन्दी", enabled: true },
    { code: "TE", label: "తెలుగు", enabled: true },
    { code: "TA", label: "தமிழ்", enabled: false },
    { code: "KA", label: "ಕನ್ನಡ", enabled: false },
    { code: "ML", label: "മലയാളം", enabled: false },
    { code: "GU", label: "ગુજરાતી", enabled: false },
    { code: "MR", label: "मराठी", enabled: false },
    { code: "ZH", label: "中文", enabled: false },
    { code: "RU", label: "Русский", enabled: false },
    { code: "DE", label: "Deutsch", enabled: false },
    { code: "ES", label: "Español", enabled: false },
    { code: "JA", label: "日本語", enabled: false },
    { code: "BN", label: "বাংলা", enabled: false },
  ];

  const categories = [
    { name: "Sites", desc: "Plot Land", img: require("../../../assets/Home.png") },
    { name: "Resorts", desc: "Luxury Getaways", img: require("../../../assets/palm tree.png"), vr: true },
    { name: "Flats", desc: "Investment Land", img: require("../../../assets/Tree.png"), vr: true },
    { name: "Commercial", desc: "Business Spaces", img: require("../../../assets/Bank.png") },
  ];

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang.code);
    setLanguageModalVisible(false);
  };

  const handleCategoryPress = (name) => {
    router.push(`/home/screens/${name}`);
  };

  return (
   <View className="flex-1 bg-black">
     <View 
       className="flex-1 bg-white" 
       style={{ 
         marginTop: insets.top, 
        marginBottom: insets.bottom
       }}
     >
    
      {/* Banner */}
      <ImageBackground
        source={require("../../../assets/homescreen_banner.png")}
        resizeMode="cover"
        style={{ height: scaleHeight(300), justifyContent: "center" }}
      >
        {/* Hamburger */}
        {!sidebarOpen && (
  <TouchableOpacity
    onPress={toggleSidebar}
    style={{
      position: "absolute",
      top: scaleHeight(4),
      left: 20,
      zIndex: 20,
    }}
  >
    <Ionicons name="menu" size={scaleWidth(28)} color="white" />
  </TouchableOpacity>
)}

        {/* Notification */}
        <TouchableOpacity
          onPress={() => router.push("/home/screens/Notifications")}
          style={{
            position: "absolute",
            top: scaleHeight(10),
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

        <Text className="text-white font-bold text-2xl ml-6 mt-1">
          Find Your Dream Property
        </Text>
        <Text className="text-white font-semibold ml-6 mt-2">
          Explore premium real estate options in Vizag
        </Text>
      </ImageBackground>

      {/* Search Bar */}
      <View className="flex-row items-center bg-white mx-10 mt-[-40] p-2 rounded-xl shadow-md z-10">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput placeholder="Search properties..." className="ml-2 flex-1" />
      </View>

      {/* Language Selector */}
      <View className=" flex-row justify-end mr-5 mb-4 mt-2">
        <TouchableOpacity
          onPress={() => setLanguageModalVisible(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#22C55E",
            paddingHorizontal: scaleWidth(6),
            paddingVertical: scaleHeight(6),
            borderRadius: scaleWidth(12),
          }}
        >
          <MaterialCommunityIcons name="earth" size={scaleWidth(20)} color="white" />
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              marginLeft: scaleWidth(4),
              fontSize: scaleWidth(14),
            }}
          >
            {selectedLanguage}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View className="px-10 mt-2 flex-1 justify-center">
  <View className="flex-row flex-wrap justify-between">
          {categories.map((item, idx) => (
            <TouchableOpacity
  key={idx}
  className="bg-white rounded-2xl border-l-8 border-[#22C55E] p-4 py-5 my-2 items-center justify-center"
style={{ 
  width: "46%",
  minHeight: scaleHeight(180),   // ⬅️ INCREASE CARD HEIGHT
  shadowColor: "#22C55E",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 10,
}}

  onPress={() => handleCategoryPress(item.name)}
>
              {/* VR Badge */}
              {item.vr && (
                <View
                  style={{
                    position: "absolute",
                    top: scaleHeight(10),
                    right: scaleWidth(10),
                    backgroundColor: "rgba(34,197,94,0.2)",
                    paddingHorizontal: scaleWidth(8),
                    paddingVertical: scaleHeight(2),
                    borderRadius: scaleWidth(6),
                    zIndex: 10,
                  }}
                >
                  <Text
                    style={{ color: "#22C55E", fontSize: scaleWidth(8), fontWeight: "bold" }}
                  >
                    VR
                  </Text>
                </View>
              )}

              {/* Icon */}
              <View className="bg-[#22C55E] w-12 h-12 rounded-xl justify-center items-center mb-3">
                <Image source={item.img} style={{ width: 20, height: 30 }} />
              </View>

              <Text className="font-semibold text-center">{item.name}</Text>
              <Text className="text-xs text-gray-500 text-center">{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Language Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Your Language</Text>
              <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                <Ionicons name="close" size={20} color="#777" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={languages}
              numColumns={2}
              keyExtractor={(item) => item.code}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              renderItem={({ item }) => {
                const isSelected = item.code === selectedLanguage;
                const isDisabled = !item.enabled;
                return (
                  <Pressable
                    onPress={() => !isDisabled && handleLanguageSelect(item)}
                    disabled={isDisabled}
                    style={[
                      styles.languageButton,
                      isSelected && styles.languageButtonSelected,
                      isDisabled && styles.languageButtonDisabled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.languageText,
                        isSelected && { color: "#22C55E", fontWeight: "600" },
                        isDisabled && { color: "#ccc" },
                      ]}
                    >
                      {item.label}
                    </Text>

                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#22C55E"
                        style={{ position: "absolute", top: 4, right: 6 }}
                      />
                    )}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 30,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  languageButton: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    margin: 6,
    backgroundColor: "white",
  },
  languageButtonSelected: {
    borderColor: "#22C55E",
  },
  languageText: {
    fontSize: 15,
    color: "#333",
  },
  languageButtonDisabled: {
    backgroundColor: "#f5f5f5",
    opacity: 0.5,
  },
});
