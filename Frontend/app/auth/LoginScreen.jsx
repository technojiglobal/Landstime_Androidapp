// Landstime_Androidapp/Frontend/app/auth/LoginScreen.jsx
import { useState, useEffect, useRef } from "react";
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
import { loginUser, saveToken, saveUserData, sendOTP, verifyOTP } from "../../utils/api";

export default function SignIn() {
  const { t, i18n } = useTranslation();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [step, setStep] = useState('enterPhone'); // 'enterPhone' or 'enterOtp'
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);

  const otpRefs = useRef([]);

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

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Focus first OTP input when step changes
  useEffect(() => {
    if (step === 'enterOtp') {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const isPhoneValid = /^[0-9]{10}$/.test(phone);
  const canSendOtp = isPhoneValid && step === 'enterPhone';
  const canVerifyOtp = otp.join("").length === 4 && step === 'enterOtp';

  const handleSendOtp = async () => {
    if (!canSendOtp) return;

    setOtpLoading(true);
    try {
      const response = await sendOTP(phone, "+91");

      if (response.success && response.data.success) {
        setStep('enterOtp');
        setTimer(30);
        setOtp(["", "", "", ""]);

        if (response.data.devOtp) {
          Alert.alert('DEV MODE', `OTP: ${response.data.devOtp}`, [{ text: 'OK' }]);
        }

        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: 'Please check your phone for the verification code',
          position: 'top',
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to send OTP',
          text2: response.data?.message || 'Please try again',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Failed to send OTP. Please check your connection.',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!canVerifyOtp) return;

    setLoading(true);
    try {
      const otpCode = otp.join("");
      const verifyResponse = await verifyOTP(phone, otpCode);

<<<<<<< HEAD
      if (verifyResponse.success && verifyResponse.data.success) {
        // OTP verified, now login
        const response = await loginUser(phone);
=======
 if (response.success && response.data.success) {
  if (response.data.data?.token) {
    const tokenSaved = await saveToken(response.data.data.token);
    if (!tokenSaved) {
      console.error('❌ Failed to save token on login');
      throw new Error('Token storage failed');
    }
    console.log('🔐 Token saved successfully on login');
  } else {
    console.error('❌ No token in login response:', response.data);
    throw new Error('No token received from server');
  }
  
  await saveUserData(response.data.data.user);
>>>>>>> 5b8f30de684ac817925c6727c588887b927a0b70

        if (response.success) {
          if (response.data.data?.token) {
            await saveToken(response.data.data.token);
            console.log('🔐 Token saved on login:', response.data.data.token);
          }
          
          await saveUserData(response.data.data.user);

          const userName = getLocalizedName(response.data.data.user.name);

          Toast.show({
            type: 'success',
            text1: 'Login Successful',
            text2: `Welcome back, ${userName}`,
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
              text1: 'Account not found',
              text2: 'Please register first',
              position: 'top',
              visibilityTime: 4000,
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Login Failed',
              text2: errorMessage,
              position: 'top',
              visibilityTime: 4000,
            });
          }
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'OTP Verification Failed',
          text2: verifyResponse.data?.message || 'Invalid OTP',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error("Verify OTP and Login error:", error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Failed to verify OTP. Please try again.',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text, index) => {
    if (!/^\d?$/.test(text)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleBackToPhone = () => {
    setStep('enterPhone');
    setOtp(["", "", "", ""]);
    setTimer(0);
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
          {step === 'enterPhone' ? t('login_title') : 'Verify Phone Number'}
        </Text>
        <Text 
          className="text-gray-500 mt-2 mb-6"
          style={{
            fontSize: getFontSize(14),
            lineHeight: getLineHeight(),
          }}
        >
          {step === 'enterPhone' ? t('login_subtitle') : 'Enter the 4-digit code sent to your phone'}
        </Text>

        {step === 'enterPhone' ? (
          <>
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
          </>
        ) : (
          <>
            {/* OTP Inputs */}
            <View className="flex-row justify-between mb-6">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpRefs.current[index] = ref)}
                  className="w-16 h-16 bg-green-50 text-green-600 text-2xl font-bold rounded-xl text-center"
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  style={{
                    fontSize: getFontSize(24),
                  }}
                />
              ))}
            </View>

            {/* Timer and Resend */}
            <View className="items-center mb-6">
              <Text className="text-gray-600">
                {timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive OTP?"}
              </Text>
              {timer === 0 && (
                <TouchableOpacity onPress={handleSendOtp} disabled={otpLoading}>
                  <Text className="text-green-600 font-semibold mt-2">
                    {otpLoading ? 'Sending...' : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Edit Phone */}
            <TouchableOpacity onPress={handleBackToPhone} className="items-center mb-4">
              <Text className="text-gray-600 text-sm">Wrong number? Edit phone</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Action Button */}
        <TouchableOpacity
          disabled={(step === 'enterPhone' && !canSendOtp) || (step === 'enterOtp' && !canVerifyOtp) || loading || otpLoading}
          onPress={step === 'enterPhone' ? handleSendOtp : handleVerifyOtp}
          className={`h-14 rounded-xl items-center justify-center ${
            ((step === 'enterPhone' && canSendOtp) || (step === 'enterOtp' && canVerifyOtp)) && !loading && !otpLoading ? "bg-green-600" : "bg-gray-200"
          }`}
        >
          {loading || otpLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              className={`text-lg font-semibold ${
                ((step === 'enterPhone' && canSendOtp) || (step === 'enterOtp' && canVerifyOtp)) ? "text-white" : "text-gray-500"
              }`}
              style={{
                fontSize: getFontSize(18),
              }}
            >
              {step === 'enterPhone' ? 'Send OTP' : 'Verify & Sign In'}
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