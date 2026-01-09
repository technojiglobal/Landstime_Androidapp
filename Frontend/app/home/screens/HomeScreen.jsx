// Frontend/app/home/screens/HomeScreen.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../../../i18n/index";
import axios from "axios";
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
  ActivityIndicator,
  Linking,
  useWindowDimensions,
  Animated
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from "../../../utils/responsive";
import { useNotifications } from "../../../context/NotificationContext";
import bell from "../../../assets/Bell-icon.png";
const API_URL = process.env.EXPO_PUBLIC_IP_ADDRESS
export default function HomeScreen({ toggleSidebar, sidebarOpen }) {
  const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 16,
    padding: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  languageButton: {
    width: "48%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 10,
    position: "relative",
  },
  languageButtonSelected: {
    borderColor: "#22C55E",
    backgroundColor: "rgba(34,197,94,0.1)",
  },
  languageButtonDisabled: {
    backgroundColor: "#f3f4f6",
  },
  languageText: {
    fontSize: 14,
    textAlign: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginHorizontal: 4,
  },
});

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { scaleWidth, scaleHeight } = useResponsive();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // Use notification context
  const { unreadCount, isLoading: notificationLoading, refreshCount } = useNotifications();

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language.toUpperCase());
  const [banners, setBanners] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
const flatListRef = useRef(null);
const isFetchingRef = useRef(false);
const [isRefreshing, setIsRefreshing] = useState(false); // ✅ Add this

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
useEffect(() => {
  if (banners.length <= 1) return;

  const interval = setInterval(() => {
    setActiveBannerIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % banners.length;
      
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      
      return nextIndex;
    });
  }, 4000); // Change every 4 seconds

  return () => clearInterval(interval);
}, [banners.length]);
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
 const fetchBanners = async () => {
  try {
    setBannerLoading(true);
    const currentLang = i18n.language || 'en';
    
    const response = await axios.get(`${API_URL}/api/banners/active`, {
      params: { language: currentLang }
    });

    if (response.data.success && Array.isArray(response.data.data)) {
      setBanners(response.data.data);
    } else {
      setBanners([{
        title: t('home_banner_title'),
        subtitle: t('home_banner_subtitle'),
        image: null
      }]);
    }
  } catch (error) {
    console.error('Error fetching banners:', error);
    setBanners([{
      title: t('home_banner_title'),
      subtitle: t('home_banner_subtitle'),
      image: null
    }]);
  } finally {
    setBannerLoading(false);
  }
};
useEffect(() => {
  fetchBanners();
}, [i18n.language]);
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
        {/* Banner Carousel */}
        <View style={{ height: scaleHeight(300) }}>
          {bannerLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            <>
              <FlatList
               ref={flatListRef}
                data={banners}
                renderItem={({ item: banner }) => (
                  <ImageBackground
                    source={
                      banner?.image
                        ? { uri: banner.image }
                        : require("../../../assets/homescreen_banner.png")
                    }
                    resizeMode="cover"
                    style={{ width: width, height: scaleHeight(300), justifyContent: "center" }}
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
                      {banner?.title || t('home_banner_title')}
                    </Text>
                    <Text
                      className="text-white font-semibold ml-6 mt-2"
                      style={{
                        fontSize: getFontSize(16),
                        lineHeight: getLineHeight(),
                      }}
                    >
                      {banner?.subtitle || t('home_banner_subtitle')}
                    </Text>

                    {/* CTA Button */}
                    {banner?.ctaText && banner?.ctaLink && (
                      <TouchableOpacity
                        onPress={async () => {
                          try {
                            const supported = await Linking.canOpenURL(banner.ctaLink);
                            if (supported) {
                              await Linking.openURL(banner.ctaLink);
                            } else {
                              console.warn(`Don't know how to open this URL: ${banner.ctaLink}`);
                            }
                          } catch (error) {
                            console.error('Failed to open link:', error);
                          }
                        }}
                        style={{
                          backgroundColor: '#22C55E',
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                          borderRadius: 25,
                          alignSelf: 'flex-start',
                          marginLeft: 24,
                          marginTop: 16,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                          elevation: 5,
                        }}
                      >
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: getFontSize(14) }}>
                          {banner.ctaText}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </ImageBackground>
                )}
                keyExtractor={(item) => item._id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={({ nativeEvent }) => {
  const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
  if (slide !== activeBannerIndex) {
    setActiveBannerIndex(slide);
  }
}}
onScrollToIndexFailed={(info) => {
  const wait = new Promise(resolve => setTimeout(resolve, 500));
  wait.then(() => {
    flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
  });
}}
              />
              {/* Pagination Dots */}
              <View style={{ flexDirection: 'row', position: 'absolute', bottom: 10, alignSelf: 'center' }}>
                {banners.map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: activeBannerIndex === index ? 'white' : 'gray',
                      margin: 3,
                    }}
                  />
                ))}
              </View>
            </>
          )}
        </View>

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

const Paginator = ({ data, scrollX }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={{ flexDirection: 'row', height: 64 }}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return <Animated.View style={[styles.dot, { width: dotWidth, opacity }]} key={i.toString()} />;
      })}
    </View>
  );
};
