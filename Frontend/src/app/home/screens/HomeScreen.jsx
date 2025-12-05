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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from "../../../utils/responsive";
import bell from '../../../../assets/Bell-icon.png'
export default function HomeScreen({ toggleSidebar, sidebarOpen }) {
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
            style={{ height: scaleHeight(240), justifyContent: "center", paddingHorizontal: scaleWidth(20) }}
          >
            {/* Hamburger: positioned relative to safe-area, with high z/elevation so it's clickable */}
            <TouchableOpacity
  onPress={() => {
    const fn = innerToggle ?? toggleSidebar;
    fn?.();
  }}
  style={{
    position: "absolute",
    top: insets.top ? insets.top + scaleHeight(8) : scaleHeight(20),
    left: scaleWidth(16),
    zIndex: 20,
  }}
>
  <Ionicons name="menu" size={scaleWidth(28)} color="white" />


</TouchableOpacity>


            <Text className="text-3xl font-bold text-white" style={{ fontSize: scaleWidth(28), lineHeight: scaleHeight(36), marginLeft: scaleWidth(10), marginTop: scaleHeight(12) }}>
              Find Your Dream Property
            </Text>
            <Text className="text-base font-bold text-white" style={{ fontSize: scaleWidth(14), lineHeight: scaleHeight(20), marginTop: scaleHeight(8), marginLeft: scaleWidth(16) }}>
              Explore premium real estate options in Visakhapatnam
            </Text>
         <TouchableOpacity
  onPress={() => router.push("/home/screens/Notifications")}
  style={{
    position: "absolute",
    top: insets.top ? insets.top + scaleHeight(8) : scaleHeight(20),
    right: scaleWidth(16),
    width: scaleWidth(36),
    height: scaleWidth(36),
    backgroundColor: "white",
    borderRadius: scaleWidth(18),
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  }}
  activeOpacity={0.7}
>
  <Image source={bell} style={{ width: scaleWidth(18), height: scaleWidth(18) }} resizeMode="contain" />
</TouchableOpacity>


          </ImageBackground>

          {/* Search Bar */}
          <View
            style={{ marginHorizontal: scaleWidth(26), marginBottom: scaleHeight(16), marginTop: scaleHeight(-20) }}
            className="flex-row items-center bg-white rounded-xl px-3 py-1 mx-10 shadow-slate-400 shadow-md"
          >
            <Ionicons name="search" size={scaleWidth(20)} color="gray" />
            <TextInput
              placeholder="Search properties in Vizag..."
              placeholderTextColor="gray"
              className="flex-1 ml-2 text-base text-black"
              style={{ fontSize: scaleWidth(14), marginLeft: scaleWidth(8) }}
            />
          </View>

          {/* Language Button aligned right */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginRight: scaleWidth(40),
              marginBottom: scaleHeight(5),
              marginTop: Math.max(scaleHeight(5), 5),
            }}
          >
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
          <View style={{ paddingHorizontal: scaleWidth(36), marginTop: Math.max(scaleHeight(20), 16) }}>
            <View className="flex-row  flex-wrap justify-between">
              {categories.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    width: "45%",
                    marginBottom: scaleHeight(30),
                    paddingVertical: scaleHeight(30),
                    aspectRatio: 0.85,
                    borderRadius: scaleWidth(10),

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
                        top: scaleHeight(10),
                        right: scaleWidth(10),
                        backgroundColor: "rgba(34,197,94,0.2)",
                        paddingHorizontal: scaleWidth(8),
                        paddingVertical: scaleHeight(2),
                        borderRadius: scaleWidth(6),
                        zIndex: 10,
                      }}
                    >
                      <Text style={{ color: "#22C55E", fontSize: scaleWidth(8), fontWeight: "bold" }}>
                        VR
                      </Text>
                    </View>
                  )}

                  <View
                    style={{
                      width: scaleWidth(40),
                      height: scaleWidth(40),
                      backgroundColor: "#22C55E",
                      borderRadius: scaleWidth(12),
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: scaleHeight(10),
                    }}
                  >
                    <Image
                      source={item.img}
                      style={{ width: scaleWidth(20), height: scaleWidth(20) }}
                      resizeMode="contain"
                    />
                  </View>

                  <Text className="text-lg font-semibold text-black text-center" style={{ fontSize: scaleWidth(14) }}>
                    {item.name}
                  </Text>
                  <Text className="text-xs text-gray-500 text-center mt-1" style={{ fontSize: scaleWidth(11), marginTop: scaleHeight(4) }}>
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
    
    Width: 1,
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
