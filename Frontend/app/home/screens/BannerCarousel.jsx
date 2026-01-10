// Frontend/app/home/components/BannerCarousel.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
  ActivityIndicator,
  Linking,
  useWindowDimensions,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import bell from "../../../assets/Bell-icon.png";

const API_URL = process.env.EXPO_PUBLIC_IP_ADDRESS;

export default function BannerCarousel({
  toggleSidebar,
  sidebarOpen,
  handleNotificationPress,
  unreadCount,
  notificationLoading,
  scaleHeight,
  scaleWidth,
  getFontSize,
  getLineHeight,
  refreshCount,
}) {
  const { width } = useWindowDimensions();
  const { t, i18n } = useTranslation();
  
  const [banners, setBanners] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const isInitialMount = useRef(true);

  const fetchBanners = async (isBackground = false) => {
    try {
      if (!isBackground) {
        setBannerLoading(true);
      }
      const currentLang = i18n.language || 'en';
      
      const response = await axios.get(`${API_URL}/api/banners/active`, {
        params: { language: currentLang }
      });

      if (response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
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
      if (!isBackground) {
        setBannerLoading(false);
      }
    }
  };

  // Initial load and language changes
  useEffect(() => {
    fetchBanners(false);
  }, [i18n.language]);

  // Background refreshes triggered by admin changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchBanners(true);
  }, [refreshCount]);

  // Progress animation for timeout bar
  useEffect(() => {
    if (banners.length > 1) {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  }, [activeBannerIndex, banners.length]);

  // Reset active index if banners change
  useEffect(() => {
    if (banners.length > 0 && activeBannerIndex >= banners.length) {
      setActiveBannerIndex(0);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
  }, [banners]);

  // Auto-scroll banners
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
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleScroll = ({ nativeEvent }) => {
    const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
    if (slide !== activeBannerIndex) {
      setActiveBannerIndex(slide);
    }
  };

  const handleScrollToIndexFailed = (info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    });
  };

  const handleCTAPress = async (ctaLink) => {
    try {
      const supported = await Linking.canOpenURL(ctaLink);
      if (supported) {
        await Linking.openURL(ctaLink);
      } else {
        console.warn(`Don't know how to open this URL: ${ctaLink}`);
      }
    } catch (error) {
      console.error('Failed to open link:', error);
    }
  };

  return (
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
                onError={(error) => {
                  console.error('❌ Image failed to load:', banner?.image);
                  console.error('Image error:', error.nativeEvent.error);
                }}
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
                    onPress={() => handleCTAPress(banner.ctaLink)}
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
            keyExtractor={(item, index) => item._id || `banner-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onScrollToIndexFailed={handleScrollToIndexFailed}
          />

          {/* Timeout Animation */}
          {banners.length > 1 && (
            <View style={{ 
              position: 'absolute', 
              bottom: 22, 
              left: '5%', 
              right: '5%', 
              height: 2, 
              backgroundColor: 'rgba(255,255,255,0.3)', 
              borderRadius: 1 
            }}>
              <Animated.View
                style={{
                  height: '100%',
                  width: progress.interpolate({ 
                    inputRange: [0, 1], 
                    outputRange: ['0%', '100%'] 
                  }),
                  backgroundColor: 'white',
                  borderRadius: 1,
                }}
              />
            </View>
          )}

          {/* Pagination Dots */}
          <View style={{ 
            flexDirection: 'row', 
            position: 'absolute', 
            bottom: 10, 
            alignSelf: 'center' 
          }}>
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
  );
}