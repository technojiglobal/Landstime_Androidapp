// Landstime_Androidapp/Frontend/app/home/screens/SidebarLayout.jsx

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import LogoutModal from 'components/LogoutModal';
import { clearUserData, getUserData } from "utils/api";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SidebarLayout({ children, sidebarOpen, toggleSidebar }) {
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.75)).current;
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const { t, i18n } = useTranslation();

  // Helper functions for font sizing (consistent with other screens)
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

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      const data = await getUserData();
      if (data) {
        setUserData(data);
      }
    };
    loadUserData();
  }, []);

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

  const handleLogout = async () => {
    await clearUserData();
    setShowLogoutModal(false);
    toggleSidebar();
    router.replace("/auth/LoginScreen");
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: sidebarOpen ? 0 : -SCREEN_WIDTH * 0.75,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [sidebarOpen]);

  // Menu items with translation keys matching your te.json
  const menuItems = [
    { 
      name: t('sidebar_menu_home'), 
      icon: "home-outline", 
      route: "/(tabs)/home" 
    },
    { 
      name: t('sidebar_menu_nearby'), 
      icon: "location-outline", 
      route: "/home/screens/Sidebar/NearbyProperty" 
    },
    { 
      name: t('sidebar_menu_billing'), 
      icon: "card-outline", 
      route: "/home/screens/Sidebar/Billing" 
    },
    { 
      name: t('sidebar_menu_interior'), 
      icon: "color-palette-outline", 
      route: "/home/screens/Sidebar/InteriorDesign" 
    },
    { 
      name: t('sidebar_menu_vaastu'), 
      icon: "business-outline", 
      route: "/home/screens/Vaastu" 
    },
    { 
      name: t('sidebar_menu_saved'), 
      icon: "bookmark-outline", 
      route: "/home/screens/Sidebar/SavedPropertiesScreen" 
    },
    { 
      name: t('sidebar_menu_chat'), 
      icon: "chatbubble-outline", 
      route: "/home/screens/Sidebar/MessagesScreen" 
    },
    { 
      name: t('sidebar_menu_notifications'), 
      icon: "notifications-outline", 
      route: "/home/screens/Notifications" 
    },
    { 
      name: t('sidebar_menu_settings'), 
      icon: "settings-outline", 
      route: "/home/screens/Settings" 
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* Overlay */}
      {sidebarOpen && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 50,
          }}
          onPress={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <Animated.View
        style={{
          position: "absolute",
          height: "100%",
          width: SCREEN_WIDTH * 0.75,
          left: slideAnim,
          top: 0,
          backgroundColor: "#22C55E",
          zIndex: 100,
          padding: 20,
          paddingTop: 50,
        }}
      >
        {/* User Info */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <Image
            source={require("../../../assets/profile.png")}
            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12 }}
          />
          <View>
            <Text 
              className="text-white font-semibold"
              style={{ fontSize: getFontSize(16), lineHeight: getLineHeight() }}
            >
              {userData?.name || "Guest User"}
            </Text>
            <Text 
              className="text-white opacity-90"
              style={{ fontSize: getFontSize(12), lineHeight: getLineHeight() - 2 }}
            >
              {userData?.phone || "No phone"}
            </Text>
          </View>
        </View>

        {/* Back Button - Half Circle */}
        <TouchableOpacity
          onPress={toggleSidebar}
          style={{
            position: "absolute",
            right: 0,
            top: 80,
            backgroundColor: "white",
            width: 40,
            height: 60,
            borderTopLeftRadius: 30,
            borderBottomLeftRadius: 30,
            justifyContent: "center",
            alignItems: "center",
            paddingRight: 8,
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#22C55E" />
        </TouchableOpacity>

        {/* Menu Items */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                toggleSidebar();
                router.push(item.route);
              }}
              style={{ flexDirection: "row", alignItems: "center", paddingVertical: 16 }}
            >
              <Ionicons 
                name={item.icon} 
                size={22} 
                color="white" 
                style={{ marginRight: 16 }} 
              />
              <Text 
                className="text-white"
                style={{ 
                  fontSize: getFontSize(18), 
                  lineHeight: getLineHeight() + 2 
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Spacer before Logout */}
          <View style={{ height: 40 }} />

          {/* Logout */}
          <TouchableOpacity
            onPress={() => setShowLogoutModal(true)}
            style={{ flexDirection: "row", alignItems: "center", paddingVertical: 16 }}
          >
            <Ionicons 
              name="log-out-outline" 
              size={22} 
              color="white" 
              style={{ marginRight: 16 }} 
            />
            <Text 
              className="text-white"
              style={{ 
                fontSize: getFontSize(18), 
                lineHeight: getLineHeight() + 2 
              }}
            >
              {t('sidebar_menu_logout')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Screen Content */}
      <View style={{ flex: 1 }}>{children}</View>

      {/* Logout Modal */}
      <LogoutModal 
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </View>
  );
}