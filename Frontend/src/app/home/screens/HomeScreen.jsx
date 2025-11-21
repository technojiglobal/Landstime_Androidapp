import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import SidebarLayout from "./SidebarLayout";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // <-- added

export default function HomeScreen({ toggleSidebar, sidebarOpen }) {
  const insets = useSafeAreaInsets(); // <-- added
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
    { name: "Sites", desc: "Plot Land", img: require("../../../../assets/Home.png") },
    { name: "Resorts", desc: "Luxury Getaways", img: require("../../../../assets/palm tree.png"), vr: true },
    { name: "Flats", desc: "Investment Land", img: require("../../../../assets/Tree.png"), vr: true },
    { name: "Commercial", desc: "Business Spaces", img: require("../../../../assets/Bank.png") },
  ];

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang.code);
    setLanguageModalVisible(false);
  };

  const handleCategoryPress = (categoryName) => {
    switch (categoryName) {
      case "Flats":
        router.push("/home/screens/Flats");
        break;
      case "Sites":
        router.push("/home/screens/Sites");
        break;
      case "Resorts":
        router.push("/home/screens/Resorts");
        break;
      case "Commercial":
        router.push("/home/screens/Commercial");
        break;
      default:
        break;
    }
  };

  return (
    <SidebarLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
      {({ toggleSidebar: innerToggle }) => (
        <ScrollView className="flex-1 bg-white">
          {/* Banner */}
          <ImageBackground
            source={require("../../../../assets/homescreen_banner.png")}
            resizeMode="cover"
            className="w-full"
            style={{ height: 240, justifyContent: "center", paddingHorizontal: 20 }}
          >
            {/* Hamburger: positioned relative to safe-area, with high z/elevation so it's clickable */}
            <TouchableOpacity
  onPress={() => {
    const fn = innerToggle ?? toggleSidebar;
    fn?.();
  }}
  style={{
    position: "absolute",
    top: insets.top ? insets.top + 5 : 20, // ⬆ moves icon upward
    left: 32,
    zIndex: 20,
  }}
>
  <Ionicons name="menu" size={28} color="white" />
</TouchableOpacity>


            <Text className="text-3xl font-bold text-white ml-5 ">
              Find Your Dream Property
            </Text>
            <Text className="text-base font-bold text-white mt-1 ml-5">
              Explore premium real estate options in Visakhapatnam
            </Text>
          </ImageBackground>

          {/* Search Bar */}
          <View
            style={{ marginHorizontal: 26 }}
            className="flex-row items-center bg-white rounded-xl px-3 py-1 mx-10 mb-4 mt-[-20px] shadow-slate-400 shadow-md"
          >
            <Ionicons name="search" size={20} color="gray" />
            <TextInput
              placeholder="Search properties in Vizag..."
              placeholderTextColor="gray"
              className="flex-1 ml-2 text-base text-black"
            />
          </View>

          {/* Language Button aligned right */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginRight: 40,
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setLanguageModalVisible(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#22C55E",
                paddingHorizontal:6,
                paddingVertical: 6,
                borderRadius: 12,
              }}
            >
              <MaterialCommunityIcons name="earth" size={20} color="white" />
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  marginLeft: 4,
                  fontSize: 14,
                }}
              >
                {selectedLanguage}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <View style={{ paddingHorizontal: 36, marginTop:5 }}>
            <View className="flex-row flex-wrap justify-between">
              {categories.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    width: "45%",
                    marginBottom: 30,
                    paddingVertical: 30,
                    aspectRatio: 0.85,
                    borderRadius: 10,

                    // Elevation for Android
                    elevation: 3,
                  }}
                  className="bg-white rounded-2xl border-l-8 border-[#22C55E] items-center justify-center p-4"
                  activeOpacity={0.8}
                  onPress={() => handleCategoryPress(item.name)}
                >
                  {item.vr && (
                    <View
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: "rgba(34,197,94,0.2)",
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 6,
                        zIndex: 10,
                      }}
                    >
                      <Text style={{ color: "#22C55E", fontSize: 8, fontWeight: "bold" }}>
                        VR
                      </Text>
                    </View>
                  )}

                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#22C55E",
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Image
                      source={item.img}
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                    />
                  </View>

                  <Text className="text-lg font-semibold text-black text-center">
                    {item.name}
                  </Text>
                  <Text className="text-xs text-gray-500 text-center mt-1">
                    {item.desc}
                  </Text>
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
                {/* Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Your Language</Text>
                  <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                    <Ionicons name="close" size={20} color="#777" />

                  </TouchableOpacity>
                </View>

                {/* Language Grid */}
                <FlatList
                  data={languages}
                  keyExtractor={(item) => item.code}
                  numColumns={2}
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
        </ScrollView>
      )}
    </SidebarLayout>
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
    shadowColor: "#22C55E17",
    
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
    textAlign: "center",
    flex: 1,
  },
  languageButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginVertical: 6,
    marginHorizontal: 4,
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
