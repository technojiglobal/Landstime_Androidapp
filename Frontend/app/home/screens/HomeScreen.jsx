// Frontend/app/home/screens/HomeScreen.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../../../i18n/index";
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
  ActivityIndicator
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from "../../../utils/responsive";
import { useNotifications } from "../../../context/NotificationContext";
import bell from "../../../assets/Bell-icon.png";

export default function HomeScreen({ toggleSidebar, sidebarOpen }) {
  const insets = useSafeAreaInsets();
  const { scaleWidth, scaleHeight } = useResponsive();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // Use notification context
  const { unreadCount, isLoading: notificationLoading, refreshCount } = useNotifications();

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language.toUpperCase());

  // Helper functions for font sizing
  const getFontSize = (baseSize) => {
    const currentLang = i18n?.language || 'en';
    switch(currentLang) {
      case 'te': return baseSize - 1.5;
      case 'hi': return baseSize - 1;
      case 'en': 
      default: return baseSize;
    }
  };

  const getLineHeight = () => {
    const currentLang = i18n?.language || 'en';
    if (currentLang === 'te') return 22;
    if (currentLang === 'hi') return 21;
    return 20;
  };

  // Sync with i18n language changes
  useEffect(() => {
    const currentLang = i18n.language.toUpperCase();
    setSelectedLanguage(currentLang);
  }, [i18n.language]);

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Component will re-render automatically
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const languages = [
    { code: "en", label: "English", enabled: true },
    { code: "hi", label: "हिन्दी", enabled: true },
    { code: "te", label: "తెలుగు", enabled: true },
    { code: "ta", label: "தமிழ்", enabled: false },
    { code: "ka", label: "ಕನ್ನಡ", enabled: false },
    { code: "ml", label: "മലയാളം", enabled: false },
    { code: "gu", label: "ગુજરાતી", enabled: false },
    { code: "mr", label: "मराठी", enabled: false },
    { code: "zh", label: "中文", enabled: false },
    { code: "ru", label: "Русский", enabled: false },
    { code: "de", label: "Deutsch", enabled: false },
    { code: "es", label: "Español", enabled: false },
    { code: "ja", label: "日本語", enabled: false },
    { code: "bn", label: "বাংলা", enabled: false },
  ];

  const categories = [
    { 
      key: 'Sites',
      name: t('home_category_sites'), 
      desc: t('home_category_sites_desc'), 
      img: require("../../../assets/Home.png") 
    },
    { 
      key: 'Resorts',
      name: t('home_category_resorts'), 
      desc: t('home_category_resorts_desc'), 
      img: require("../../../assets/palm tree.png"), 
      vr: true 
    },
    { 
      key: 'Flats',
      name: t('home_category_flats'), 
      desc: t('home_category_flats_desc'), 
      img: require("../../../assets/Tree.png"), 
      vr: true 
    },
    { 
      key: 'Commercial',
      name: t('home_category_commercial'), 
      desc: t('home_category_commercial_desc'), 
      img: require("../../../assets/Bank.png") 
    },
  ];

  const handleLanguageSelect = async (lang) => {
    const langCode = lang.code.toLowerCase();
    await changeLanguage(langCode);
    setSelectedLanguage(lang.code.toUpperCase());
    setLanguageModalVisible(false);
  };

  const handleCategoryPress = (categoryKey) => {
    const routeMap = {
      [t('home_category_sites')]: 'Sites',
      [t('home_category_resorts')]: 'Resorts',
      [t('home_category_flats')]: 'Flats',
      [t('home_category_commercial')]: 'Commercial'
    };
    
    const routeName = routeMap[categoryKey] || categoryKey;
    router.push(`/home/screens/${routeName}`);
  };

  const handleNotificationPress = () => {
    router.push("/home/screens/Notifications");
  };

  return (
    <View className="flex-1 bg-black">
      <View 
        className="flex-1 bg-white" 
        style={{ 
          marginTop: insets.top,
          //marginBottom: insets.bottom  
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

          {/* Notification with Badge */}
          <TouchableOpacity
            onPress={handleNotificationPress}
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
            
            {/* Badge */}
            {unreadCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  backgroundColor: "#EF4444",
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 4,
                  borderWidth: 2,
                  borderColor: "white",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}

            {/* Loading indicator */}
            {notificationLoading && (
              <View
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                }}
              >
                <ActivityIndicator size="small" color="#22C55E" />
              </View>
            )}
          </TouchableOpacity>

          <Text 
            className="text-white font-bold ml-6 mt-1"
            style={{
              fontSize: getFontSize(24),
              lineHeight: getLineHeight() + 8,
            }}
          >
            {t('home_banner_title')}
          </Text>
          <Text 
            className="text-white font-semibold ml-6 mt-2"
            style={{
              fontSize: getFontSize(16),
              lineHeight: getLineHeight(),
            }}
          >
            {t('home_banner_subtitle')}
          </Text>
        </ImageBackground>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white mx-10 mt-[-40] p-2 rounded-xl shadow-md z-10">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput 
            placeholder={t('home_search_placeholder')} 
            className="ml-2 flex-1"
            style={{
              fontSize: getFontSize(14),
            }}
          />
        </View>

        {/* Language Selector */}
        <View className="flex-row justify-end mr-5 mb-4 mt-2">
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
                  minHeight: scaleHeight(180),
                  shadowColor: "#22C55E",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 10,
                }}
                onPress={() => handleCategoryPress(item.key)}
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
                      style={{ 
                        color: "#22C55E", 
                        fontSize: scaleWidth(8), 
                        fontWeight: "bold" 
                      }}
                    >
                      VR
                    </Text>
                  </View>
                )}

                {/* Icon */}
                <View className="bg-[#22C55E] w-12 h-12 rounded-xl justify-center items-center mb-3">
                  <Image source={item.img} style={{ width: 20, height: 30 }} />
                </View>

                <Text 
                  className="font-semibold text-center"
                  style={{
                    fontSize: getFontSize(14),
                  }}
                >
                  {item.name}
                </Text>
                <Text 
                  className="text-xs text-gray-500 text-center"
                  style={{
                    fontSize: getFontSize(12),
                  }}
                >
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
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('home_language_modal_title')}</Text>
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
                  const isSelected = item.code.toLowerCase() === i18n.language.toLowerCase();
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