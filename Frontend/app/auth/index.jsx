// Landstime_Androidapp/Frontend/app/auth/index.jsx

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
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "../../global.css";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useTranslation } from 'react-i18next'; 
//import '../../i18n/index';
import i18n from '../../i18n/index';
import { registerUser, saveToken, saveUserData, checkPhoneExists } from "../../utils/api";

export default function RegisterScreen() {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState("");
  
  const params = useLocalSearchParams();
 const [phone, setPhone] = useState(() => params.phone || "");

  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [showDropdown, setShowDropdown] = useState(false);
  const [role, setRole] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  
  // Focus states
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const router = useRouter();

    // Add this helper function
 // Add this helper function
  const getFontSize = (baseSize) => {
  const currentLang = i18n?.language || 'en';
  switch(currentLang) {
    case 'te': return baseSize - 1.5; // Telugu slightly smaller
    case 'hi': return baseSize - 1;   // Hindi slightly smaller
    case 'en': 
    default: return baseSize;         // English normal
  }
};

const getLineHeight = () => {
   const currentLang = i18n?.language || 'en';
  if (currentLang === 'te') return 22;
  if (currentLang === 'hi') return 21;
  return 20;
};

useEffect(() => {
  if (!params || Object.keys(params).length === 0) return;

  if (params.countryCode) setCountryCode(params.countryCode);
  if (params.name) setName(params.name);
  if (params.email) setEmail(params.email);
  if (params.role) setRole(params.role);

  const allowEditFlag =
    String(params.allowEdit) === "true" ||
    String(params.fromEdit) === "true";

  const verifiedFlag = String(params.verified) === "true";

  if (allowEditFlag) {
    setPhoneVerified(false);
    setAllowEdit(true);
  } else if (verifiedFlag) {
    setPhoneVerified(true);
    setAllowEdit(false);
  }
}, [params.verified, params.allowEdit, params.fromEdit, params.phone, params.name, params.email, params.role, params.countryCode]);


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



  const isNameValid = name.trim().length >= 2;
  const isPhoneValid = /^[0-9]{10}$/.test(phone);
  const isEmailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const canRegister = isNameValid && isPhoneValid && isEmailValid && role && agree && phoneVerified;

  const countryCodes = ["+91", "+1", "+44", "+61", "+81"];

  // Border color functions
  const getNameBorderColor = () => {
    if (name) return isNameValid ? "#22c55e" : "#ef4444";
    return isNameFocused ? "#22c55e" : "#0000001A";
  };

  const getPhoneBorderColor = () => {
    if (phone) {
      return isPhoneValid 
        ? phoneVerified ? "#22c55e" : "#f97316"
        : "#ef4444";
    }
    return isPhoneFocused ? "#22c55e" : "#0000001A";
  };

  const getEmailBorderColor = () => {
    if (email) return isEmailValid ? "#22c55e" : "#ef4444";
    return isEmailFocused ? "#22c55e" : "#0000001A";
  };

  const handleRegister = async () => {
    if (!canRegister) return;

    if (!phoneVerified) {
      Toast.show({
        type: 'error',
        text1: t('toast_phone_not_verified_title'),
  text2: t('toast_phone_not_verified_desc'),
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!agree) {
      Toast.show({
        type: 'error',
       text1: t('toast_terms_required_title'),
      text2: t('toast_terms_required_desc'),
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);
    try {
    // Get current language
const getUserLanguage = () => {
  const currentLang = i18n.language || 'en';
  console.log('📝 Current app language:', currentLang);
  return currentLang;
};

const response = await registerUser({
  name: name.trim(),
  phone: phone,
  countryCode: countryCode,
  email: email.toLowerCase().trim(),
  role: role,
  originalLanguage: getUserLanguage() // ✅ NEW: Pass original language
});

      if (response.success && response.data.success) {
        if (response.data.data?.token) {
          const tokenSaved = await saveToken(response.data.data.token);
          if (!tokenSaved) {
            console.error('❌ Failed to save token');
            throw new Error('Token storage failed');
          }
          console.log('🔐 Token saved successfully');
        } else {
          console.error('❌ No token in response:', response.data);
          throw new Error('No token received from server');
        }
        
        if (response.data.data?.user) {
          await saveUserData(response.data.data.user);
          console.log('👤 User data saved');
        }

        Toast.show({
          type: 'success',
          text1: t('toast_register_success_title'),
          text2: t('toast_register_success_desc'),
          position: 'top',
          visibilityTime: 2500,
        });

        setTimeout(() => {
          router.replace("/(tabs)/home");
        }, 2500);
      } else {
        const errorMessage = response.data?.message || "Something went wrong";
        
        if (errorMessage.includes("phone number already exists")) {
          Toast.show({
            type: 'error',
           text1: t('toast_phone_exists_title'),
           text2: t('toast_phone_exists_desc'),
            position: 'top',
            visibilityTime: 4000,
          });
        } else if (errorMessage.includes("email already exists")) {
          Toast.show({
            type: 'error',
             text1: t('toast_email_exists_title'),
            text2: t('toast_email_exists_desc'),
            position: 'top',
            visibilityTime: 4000,
          });
        } else if (errorMessage.includes("Phone verification expired")) {
          Toast.show({
            type: 'error',
            text1: t('toast_verification_expired_title'),
            text2: t('toast_verification_expired_desc'),
            position: 'top',
            visibilityTime: 4000,
          });
          setPhoneVerified(false);
        } else {
          Toast.show({
            type: 'error',
             text1: t('toast_register_failed_title'),
            text2: errorMessage,
            position: 'top',
            visibilityTime: 4000,
          });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      Toast.show({
        type: 'error',
        text1: t('toast_network_error_title'),
         text2: t('toast_network_error_desc'),
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!isPhoneValid) return;

    setLoading(true);
    try {
      const response = await checkPhoneExists(phone);

      if (response.success && response.data.exists) {
        Toast.show({
          type: 'error',
         text1: t('toast_phone_exists_title'),
        text2: t('toast_phone_exists_desc'),
          position: 'top',
          visibilityTime: 4000,
        });
        return;
      }

      router.push({
        pathname: "/auth/VerifyScreen",
        params: { 
          phone: phone, 
          countryCode: countryCode,
          name: name,
          email: email,
          role: role
        },
      });
    } catch (error) {
      console.error('Check phone error:', error);
      Toast.show({
        type: 'error',
        text1: t('toast_network_error_title'),
        text2: 'Failed to verify phone availability',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const Content = (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white pt-14"
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="flex-row items-center justify-center mb-6 relative">
          <TouchableOpacity
            className="absolute left-0"
            onPress={() => router.push("/onboarding/welcomescreen4")}
          >
            <ChevronLeft color="gray" size={25} />
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-center">
           {t("register_title")}
          </Text>
        </View>

        <Text className="text-gray-500 text-center mb-6">
         {t("register_subtitle")}
        </Text>

        {/* Name Input */}
        <View
          className="flex-row items-center border rounded-xl mb-4 px-3"
          style={{
            borderWidth: 2,
            borderColor: getNameBorderColor(),
            backgroundColor: "#D9D9D91C",
          }}
        >
          <Ionicons
            name="person-outline"
            size={20}
            color={name ? (isNameValid ? "#16a34a" : "#ef4444") : "#9ca3af"}
          />
          <TextInput
            className="flex-1 ml-3 h-12 text-base"
            placeholder={t("placeholder_name")}
            value={name}
            onChangeText={setName}
            placeholderTextColor="#9ca3af"
            onFocus={() => setIsNameFocused(true)}
            onBlur={() => setIsNameFocused(false)}
          />
        </View>

        {/* Phone Input */}
        <View
          className="flex-row items-center border rounded-xl mb-4 px-3"
          style={{
            borderWidth: 2,
            borderColor: getPhoneBorderColor(),
            backgroundColor: "#D9D9D91C",
            minHeight: 60,
            alignItems: 'center',
          }}
        >
          <Ionicons
            name="call-outline"
            size={20}
            color={
              phone
                ? isPhoneValid
                  ? phoneVerified
                    ? "#16a34a"
                    : "#f97316"
                  : "#ef4444"
                : "#9ca3af"
            }
          />

          <TouchableOpacity
            onPress={() => setShowDropdown(true)}
            className="flex-row items-center ml-2 border-r border-gray-300 pr-2"
          >
            <Text className="text-base text-gray-700">{countryCode}</Text>
            <Ionicons
              name="chevron-down-outline"
              size={16}
              color="#9ca3af"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>

          {phoneVerified && !allowEdit ? (
            <View className="flex-1 ml-2 h-12 justify-center">
             <Text
  style={{
    fontSize: getFontSize(16),
    lineHeight: getLineHeight(),
  }}
  className="text-gray-700"
>
  {phone}
</Text>

            </View>
          ) : (
            <TextInput
  className="flex-1 ml-2 min-h-[48px] py-2"
  style={{
    fontSize: getFontSize(16),
    lineHeight: getLineHeight(),
  }}

              placeholder={t("placeholder_phone")}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => {
                if (/^\d{0,10}$/.test(text)) {
                  setPhone(text);
                  setPhoneVerified(false);
                }
              }}
              placeholderTextColor="#9ca3af"
              autoFocus={allowEdit}
              editable={!phoneVerified || allowEdit}
              onFocus={() => setIsPhoneFocused(true)}
              onBlur={() => setIsPhoneFocused(false)}
            />
          )}

          {phoneVerified ? (
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
             <TouchableOpacity
  onPress={() => {
    setPhoneVerified(false);
    setAllowEdit(true);
  }}
  className="ml-2"
>
                <Text className="text-blue-500 text-sm">{t("change_button")}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity disabled={!isPhoneValid} onPress={handleVerifyPhone}>
              <Text
                className={`font-semibold ${
                  isPhoneValid ? "text-green-500" : "text-gray-400"
                }`}
                  style={{
    fontSize: getFontSize(14),
    lineHeight: getLineHeight() + 6, // 🔴 VERY IMPORTANT
    paddingBottom: 2,               // 🔴 FIX CUTTING
  }}
>
              
               {t("verify_button")}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Country Code Modal */}
        <Modal
          visible={showDropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDropdown(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
            <View className="flex-1 bg-black/30 justify-center items-center">
              <View className="bg-white rounded-xl w-3/4 max-h-80 p-4">
                <Text className="text-lg font-semibold mb-3 text-center">
                  Select Country Code
                </Text>
                <FlatList
                  data={countryCodes}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setCountryCode(item);
                        setShowDropdown(false);
                      }}
                      className="py-3 border-b border-gray-200"
                    >
                      <Text className="text-center text-base text-gray-700">
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Email Input */}
        <View
          className="flex-row items-center border rounded-xl mb-4 px-3"
          style={{
            borderWidth: 2,
            borderColor: getEmailBorderColor(),
            backgroundColor: "#D9D9D91C",
          }}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color={email ? (isEmailValid ? "#16a34a" : "#ef4444") : "#9ca3af"}
          />
          <TextInput
  className="flex-1 ml-3 h-12 text-base"
  placeholder={t("email_placeholder")}
  keyboardType="email-address"
  value={email}
  onChangeText={setEmail}
  placeholderTextColor="#9ca3af"
  autoCapitalize="none"
  editable={true}
  pointerEvents="auto"
  onFocus={() => setIsEmailFocused(true)}
  onBlur={() => setIsEmailFocused(false)}
/>
        </View>

            {/* Role Selection */}
            <Text className="text-gray-700 mb-2">{t("role_label")}</Text>
        <View className="flex-row mb-6">
          <TouchableOpacity
            className={`px-6 py-2 rounded-full mr-3 border ${
              role === "Buyer"
                ? "bg-green-50 border-green-500"
                : "border-gray-300"
            }`}
            onPress={() => setRole("Buyer")}
          >
            <Text
              className={`${
                role === "Buyer"
                  ? "text-green-700 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {t("role_buyer")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-2 rounded-full border ${
              role === "Owner"
                ? "bg-green-50 border-green-500"
                : "border-gray-300"
            }`}
            onPress={() => setRole("Owner")}
          >
            <Text
              className={`${
                role === "Owner"
                  ? "text-green-700 font-semibold"
                  : "text-gray-500"
              }`}
            >
             {t("role_owner")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <View className="flex-row items-start mb-6">
          <TouchableOpacity
            className={`w-6 h-6 rounded border border-gray-400 mr-3 items-center justify-center ${
              agree ? "bg-green-600" : ""
            }`}
            onPress={() => setAgree(!agree)}
          >
            {agree && <Ionicons name="checkmark" size={16} color="white" />}
          </TouchableOpacity>
 <Text 
  className="text-gray-600 flex-1 flex-wrap" 
  style={{ 
    lineHeight: i18n?.language === 'te' || i18n?.language === 'hi' ? 22 : 20,
    fontSize: getFontSize(14),
    flexWrap: 'wrap',
  }}
>
  {t("agree_terms")}{" "}
  <Text className="text-green-600 font-semibold">
    {t("terms_service")}
  </Text>{" "}
  {t("and")}{" "}
  <Text className="text-green-600 font-semibold">
    {t("privacy_policy")}
  </Text>
</Text>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          disabled={!canRegister || loading}
          onPress={handleRegister}
          className={`h-14 rounded-xl items-center justify-center ${
            canRegister && !loading ? "bg-green-600" : "bg-gray-200"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              className={`text-lg font-semibold ${
                canRegister ? "text-white" : "text-gray-500"
              }`}
            >
             {t("register_button")}
            </Text>
          )}
        </TouchableOpacity>

        {/* Sign In */}
        <View className="flex-row justify-center mt-6 mb-10">
          <Text className="text-gray-600">{t("already_account")}</Text>
          <TouchableOpacity onPress={() => router.push("/auth/LoginScreen")}>
            <Text className="text-green-600 font-bold">{t("sign_in")}</Text>
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