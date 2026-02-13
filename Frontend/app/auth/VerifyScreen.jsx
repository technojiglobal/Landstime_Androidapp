// Landstime_Androidapp/Frontend/app/auth/VerifyScreen.jsx

import { useState, useEffect } from "react";
import Toast from 'react-native-toast-message';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/index';
import { sendOTP } from "../../utils/api";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const REF_WIDTH = 430;
const REF_HEIGHT = 932;

const scaleWidth = (size) => (SCREEN_WIDTH / REF_WIDTH) * size;
const scaleHeight = (size) => (SCREEN_HEIGHT / REF_HEIGHT) * size;

export default function VerificationScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const phoneNumber = params.phone || "9876543210";
  const countryCode = params.countryCode || "+91";

  // Mask phone number for display
  const maskedPhone = phoneNumber.slice(0, 2) + "******" + phoneNumber.slice(-2);

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

  useEffect(() => {
    // Force re-render when language changes
    const handleLanguageChange = () => {
      // Component will re-render automatically
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);
const handleSendOTP = async () => {
  console.log('🚀 Starting OTP send process...');
  console.log('📞 Phone:', phoneNumber, 'Country Code:', countryCode);
  
  setLoading(true);
  try {
    console.log('📡 Calling sendOTP API...');
    const response = await sendOTP(phoneNumber, countryCode);
    
    console.log('✅ Response received:', JSON.stringify(response, null, 2));

    if (response.success && response.data.success) {
      console.log('✨ OTP sent successfully!');
      
      // ✅ FIXED: Check response.data.data.devOtp instead of response.data.devOtp
      if (response.data.data?.devOtp) {
        console.log('🔐 DEV OTP:', response.data.data.devOtp);
        
        // Show Toast with OTP
        Toast.show({
          type: 'success',
          text1: t('verify_otp_sent_title') || 'OTP Sent Successfully',
          text2: `Your OTP: ${response.data.data.devOtp}`,
          visibilityTime: 6000,
          position: 'top',
          topOffset: 60,
        });
        
        setTimeout(() => {
          navigateToVerify();
        }, 1500);
      } else {
        Toast.show({
          type: 'success',
          text1: t('verify_otp_sent_title') || 'OTP Sent',
          text2: t('verify_otp_sent_desc') || 'Please check your phone',
          visibilityTime: 3000,
          position: 'top',
          topOffset: 60,
        });
        
        setTimeout(() => {
          navigateToVerify();
        }, 1000);
      }
    } 
    else {
      console.error('❌ OTP send failed:', response.data?.message);
      Toast.show({
        type: 'error',
        text1: t('verify_otp_send_failed_title') || 'Failed',
        text2: response.data.message || t('verify_otp_send_failed_desc'),
        visibilityTime: 4000,
        position: 'top',
        topOffset: 60,
      });
    }
  } catch (error) {
    console.error('💥 Network error:', error);
    Toast.show({
      type: 'error',
      text1: t('verify_otp_send_failed_title') || 'Error', 
      text2: t('verify_network_error_desc') || 'Network error occurred',
      visibilityTime: 4000,
      position: 'top',
      topOffset: 60,
    });
  } finally {
    setLoading(false);
    console.log('🏁 OTP send process completed');
  }
};

  const navigateToVerify = () => {
    router.push({
      pathname: "/auth/verifyotp",
      params: {
        phone: phoneNumber,
        countryCode: countryCode,
        name: params.name,
        email: params.email,
        role: params.role,
      },
    });
  };

  const handleEdit = () => {
    router.push({
      pathname: "/auth",
      params: {
        phone: phoneNumber,
        countryCode: countryCode,
        name: params.name,
        email: params.email,
        role: params.role,
        allowEdit: "true",
      },
    });
  };

  return (
    <>
      <View className="flex-1 bg-white px-4 pt-14">
        {/* Back Arrow */}
        <TouchableOpacity className="mb-6" onPress={() => router.back()}>
          <Image
            source={require("../../assets/arrow.png")}
            style={{ width: scaleWidth(28), height: scaleHeight(28) }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Title */}
        <Text 
          className="text-xl font-normal"
          style={{
            fontSize: getFontSize(20),
            lineHeight: getLineHeight() + 4,
          }}
        >
          {t('verify_title_prefix')}{" "}
          <Text 
            className="font-bold text-xl text-black"
            style={{
              fontSize: getFontSize(20),
              fontWeight: 'bold',
            }}
          >
            {t('verify_title_main')}
          </Text>
        </Text>
        <Text 
          className="text-gray-500 mt-2 mb-8"
          style={{
            fontSize: getFontSize(14),
            lineHeight: getLineHeight(),
          }}
        >
          {t('verify_subtitle_send_otp')}
        </Text>

        {/* Phone Box with Focus Ring */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPressIn={() => setIsFocused(true)}
          onPressOut={() => setIsFocused(false)}
          style={{
            borderWidth: 2,
            borderColor: isFocused ? "#22c55e" : "transparent",
            borderRadius: 12,
            marginBottom: 32,
          }}
        >
          <View className="flex-row items-center bg-green-50 rounded-xl p-4">
            <Ionicons name="call-outline" size={22} color="#16a34a" />
            <View className="ml-3 flex-1">
              <Text 
                className="text-green-600 text-sm"
                style={{
                  fontSize: getFontSize(14),
                }}
              >
                {t('verify_label_phone')}
              </Text>
              <Text 
                className="text-green-600 text-lg font-semibold"
                style={{
                  fontSize: getFontSize(18),
                }}
              >
                {countryCode} {maskedPhone}
              </Text>
            </View>
            <TouchableOpacity onPress={handleEdit}>
              <Text className="text-green-600 text-sm">{t("edit")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Send OTP Button */}
        <TouchableOpacity
          onPress={handleSendOTP}
          disabled={loading}
          className={`h-14 rounded-xl items-center justify-center ${
            loading ? "bg-gray-400" : "bg-green-600"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text 
              className="text-white text-lg font-semibold"
              style={{
                fontSize: getFontSize(18),
              }}
            >
              {t('verify_button_send_otp')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <Toast />
    </>
  );
}