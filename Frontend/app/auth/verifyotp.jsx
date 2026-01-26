//frontend//app//auth//verifyotp.jsx
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/index';
import { verifyOTP, resendOTP } from "../../utils/api";

export default function OtpVerificationScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const phoneNumber = params.phone || "";
  const countryCode = params.countryCode || "+91";
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

  // Countdown Timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP Change
  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus
    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timer > 0) return;

    setResendLoading(true);
    try {
      const response = await resendOTP(phoneNumber, countryCode);

      if (response.success && response.data.success) {
        setTimer(30);
        setOtp(["", "", "", ""]);
        Alert.alert(t('alert_resend_success_title'), t('alert_resend_success_desc'));
      } else {
        Alert.alert(
          t('alert_resend_failed_title'),
          response.data.message || t('alert_resend_failed_desc')
        );
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      Alert.alert(t('alert_resend_failed_title'), t('alert_resend_failed_desc'));
    } finally {
      setResendLoading(false);
    }
  };

  // Submit OTP
  const handleSubmit = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 4) {
      Alert.alert(t('alert_invalid_otp_title'), t('alert_invalid_otp_desc'));
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOTP(phoneNumber, otpCode);

      if (response.success && response.data.success) {
        // Navigate to registration screen with verified phone
        router.replace({
          pathname: "/auth",
          params: {
            phone: phoneNumber,
            countryCode: countryCode,
            verified: "true",
            name: params.name,
            email: params.email,
            role: params.role,
          },
        });
      } else {
        Alert.alert(
          t('alert_verification_failed_title'),
          response.data.message || t('alert_verification_failed_desc')
        );
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      Alert.alert(t('alert_verify_error_title'), t('alert_verify_error_desc'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-14">
      {/* Back Arrow */}
      <TouchableOpacity className="mb-6" onPress={() => router.back()}>
        <ChevronLeft color="gray" size={25} />
      </TouchableOpacity>

      {/* Title */}
      <Text 
        className="text-xl font-normal"
        style={{
          fontSize: getFontSize(20),
          lineHeight: getLineHeight() + 4,
        }}
      >
        {t('otp_title_enter')}
      </Text>
      <Text 
        className="text-gray-500 mt-2 mb-1"
        style={{
          fontSize: getFontSize(14),
          lineHeight: getLineHeight(),
        }}
      >
        {t('otp_subtitle')}
      </Text>

      <View className="flex-row items-center mb-10">
        <Ionicons name="call-outline" size={16} />
        <Text 
          className="text-gray-400 ml-1"
          style={{
            fontSize: getFontSize(16),
          }}
        >
          {maskedPhone}
        </Text>
        <TouchableOpacity
          onPress={() => {
            console.log('✏️ OTP Edit pressed — params:', params);
            router.replace({
              pathname: "/auth",
              params: {
                phone: phoneNumber,
                countryCode: countryCode,
                name: params.name || "",
                email: params.email || "",
                role: params.role || "",
                allowEdit: "true",
                verified: "false",
                fromEdit: "true",
              },
            });
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
          accessibilityLabel="Edit phone number"
        >
          <Text
            className="text-green-600 ml-3 font-medium underline"
            style={{
              fontSize: getFontSize(16),
            }}
          >
            {t('otp_edit') || 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* OTP Input Boxes */}
      <View className="flex-row justify-between mb-8">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            className="w-16 h-16 bg-green-50 text-green-600 text-2xl font-bold rounded-xl text-center"
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            selectTextOnFocus
          />
        ))}
      </View>

      {/* Timer + Resend */}
      <View className="items-center mb-6">
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={18} color="black" />
          <Text 
            className="text-gray-600 ml-2"
            style={{
              fontSize: getFontSize(16),
            }}
          >
            {t('otp_timer_prefix')}{timer > 0 ? `00:${timer < 10 ? `0${timer}` : timer}` : "00:00"}
          </Text>
        </View>

        <Text 
          className="text-gray-600 mt-2"
          style={{
            fontSize: getFontSize(14),
            lineHeight: getLineHeight(),
          }}
        >
          {t('otp_didnt_receive')}{" "}
          {resendLoading ? (
            <ActivityIndicator size="small" color="#16a34a" />
          ) : (
            <Text
              className={`font-semibold ${
                timer > 0 ? "text-gray-400" : "text-green-600"
              }`}
              style={{
                fontSize: getFontSize(14),
              }}
              onPress={handleResendOtp}
            >
              {t('otp_resend')}
            </Text>
          )}
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading || otp.join("").length !== 4}
        className={`h-14 rounded-xl items-center justify-center ${
          loading || otp.join("").length !== 4 ? "bg-gray-200" : "bg-green-600"
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
            {t('otp_submit')}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}