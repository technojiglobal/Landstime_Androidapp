// Landstime_Androidapp/Frontend/app/auth/LoginScreen.jsx
import { useState, useEffect } from "react";
import Toast from 'react-native-toast-message';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "../../global.css";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/index';
import { loginUser, saveToken, saveUserData } from "../../utils/api";

export default function SignIn() {
  const { t, i18n } = useTranslation();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const router = useRouter();

  // Add this helper function at the top of your component (after line 23)
const getLocalizedName = (nameField) => {
  if (!nameField) return "User";
  if (typeof nameField === 'string') return nameField;
  const currentLang = i18n?.language || 'en';
  return nameField[currentLang] || nameField.en || nameField.te || nameField.hi || "User";
};




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

  const isPhoneValid = /^[0-9]{10}$/.test(phone);
  const canSignIn = isPhoneValid;

  const handleSignIn = async () => {
    if (!canSignIn) {
      Toast.show({
        type: 'error',
        text1: t('login_invalid_phone_title'),
        text2: t('login_invalid_phone_desc'),
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(phone);

    if (response.success && response.data.success) {
  if (response.data.data?.token) {
    await saveToken(response.data.data.token);
    console.log('🔐 Token saved on login:', response.data.data.token);
  }
  
  await saveUserData(response.data.data.user);

  // ✅ NEW: Extract localized name first
  const userName = getLocalizedName(response.data.data.user.name);

  Toast.show({
    type: 'success',
    text1: t('login_success_title'),
    text2: `${t('login_success_desc')}, ${userName}`,  // ✅ FIXED: Use userName variable
    position: 'top',
    visibilityTime: 2500,
  });

        setTimeout(() => {
          router.replace("/(tabs)/home");
        }, 2500);
      } else {
        const errorMessage = response.data?.message || "Something went wrong";
        
        if (errorMessage.includes("not found") || errorMessage.includes("Please register")) {
          Toast.show({
            type: 'error',
            text1: t('login_account_not_found_title'),
            text2: t('login_account_not_found_desc'),
            position: 'top',
            visibilityTime: 4000,
          });
        } else if (errorMessage.includes("not verified")) {
          Toast.show({
            type: 'error',
            text1: t('login_phone_not_verified_title'),
            text2: t('login_phone_not_verified_desc'),
            position: 'top',
            visibilityTime: 4000,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: t('login_failed_title'),
            text2: errorMessage,
            position: 'top',
            visibilityTime: 4000,
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      Toast.show({
        type: 'error',
        text1: t('login_network_error_title'),
        text2: t('login_network_error_desc'),
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Determine border color based on state
  const getBorderColor = () => {
    if (phone) {
      return isPhoneValid ? "#22c55e" : "#ef4444";
    }
    return isFocused ? "#22c55e" : "#0000001A";
  };

  const Content = (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 50,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Arrow */}
        <TouchableOpacity className="mb-6" onPress={() => router.push("/auth")}>
          <ChevronLeft color="gray" size={25} />
        </TouchableOpacity>

        {/* Title */}
        <Text 
          className="text-3xl font-bold"
          style={{
            fontSize: getFontSize(30),
            lineHeight: getLineHeight() + 10,
          }}
        >
          {t('login_title')}
        </Text>
        <Text 
          className="text-gray-500 mt-2 mb-6"
          style={{
            fontSize: getFontSize(14),
            lineHeight: getLineHeight(),
          }}
        >
          {t('login_subtitle')}
        </Text>

        {/* Phone Input */}
        <View
          className="flex-row items-center border rounded-xl mb-4 px-3"
          style={{
            borderWidth: 2,
            borderColor: getBorderColor(),
            backgroundColor: "#D9D9D91C",
            height: 48,
          }}
        >
          <Ionicons
            name="call-outline"
            size={20}
            color={phone ? (isPhoneValid ? "#16a34a" : "#ef4444") : "#9ca3af"}
          />
          <TextInput
            className="flex-1 ml-3 h-12"
            style={{
              fontSize: getFontSize(16),
              lineHeight: getLineHeight(),
            }}
            placeholder={t('placeholder_phone')}
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              if (/^\d{0,10}$/.test(text)) {
                setPhone(text);
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={10}
          />
        </View>

        <Text 
          className="text-gray-500 text-sm mb-6"
          style={{
            fontSize: getFontSize(14),
            lineHeight: getLineHeight(),
          }}
        >
          {t('login_note_registered_phone')}
        </Text>

        {/* Sign In Button */}
        <TouchableOpacity
          disabled={!canSignIn || loading}
          onPress={handleSignIn}
          className={`h-14 rounded-xl items-center justify-center ${
            canSignIn && !loading ? "bg-green-600" : "bg-gray-200"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              className={`text-lg font-semibold ${
                canSignIn ? "text-white" : "text-gray-500"
              }`}
              style={{
                fontSize: getFontSize(18),
              }}
            >
              {t('sign_in')}
            </Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <View className="flex-row justify-center mt-6">
          <Text 
            className="text-gray-600"
            style={{
              fontSize: getFontSize(14),
              lineHeight: getLineHeight(),
            }}
          >
            {t('already_account')}{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/auth")}>
            <Text 
              className="text-green-600 font-bold"
              style={{
                fontSize: getFontSize(14),
                lineHeight: getLineHeight(),
              }}
            >
              {t('register')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <>
      {Platform.OS === "web" ? (
        Content
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {Content}
        </TouchableWithoutFeedback>
      )}
      <Toast />
    </>
  );
}