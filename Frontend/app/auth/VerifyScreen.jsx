import { useState } from "react";
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
import { sendOTP } from "../../utils/api";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const REF_WIDTH = 430;
const REF_HEIGHT = 932;

const scaleWidth = (size) => (SCREEN_WIDTH / REF_WIDTH) * size;
const scaleHeight = (size) => (SCREEN_HEIGHT / REF_HEIGHT) * size;

export default function VerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const phoneNumber = params.phone || "9876543210";
  const countryCode = params.countryCode || "+91";

  // Mask phone number for display
  const maskedPhone = phoneNumber.slice(0, 2) + "******" + phoneNumber.slice(-2);

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
        
        // Check if OTP is in response (dev mode)
        if (response.data.devOtp) {
          console.log('🔐 DEV OTP:', response.data.devOtp);
          Alert.alert('DEV MODE', `OTP: ${response.data.devOtp}`, [
            { text: 'OK', onPress: () => navigateToVerify() }
          ]);
        } else {
          navigateToVerify();
        }
      } 
      else {
        console.error('❌ OTP send failed:', response.data?.message);
        Alert.alert(
          "Error",
          response.data.message || "Failed to send OTP. Please try again."
        );
      }
    } catch (error) {
      console.error('💥 Network error:', error);
      console.error('Error details:', error.message);
      Alert.alert("Error", "Failed to send OTP. Please check your connection.");
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

  return (
    <>
      <View className="flex-1 bg-white px-6 pt-14">
        {/* Back Arrow */}
        <TouchableOpacity className="mb-6" onPress={() => router.back()}>
          <Image
            source={require("../../assets/arrow.png")}
            style={{ width: scaleWidth(28), height: scaleHeight(28) }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-xl font-normal">
          Enter{" "}
          <Text className="font-bold text-xl text-black">
            Verification code
          </Text>
        </Text>
        <Text className="text-gray-500 mt-2 mb-8">
          We will send an OTP to your registered phone number
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
              <Text className="text-green-600 text-sm">Phone number</Text>
              <Text className="text-green-600 text-lg font-semibold">
                {countryCode} {maskedPhone}
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={22} color="#16a34a" />
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
            <Text className="text-white text-lg font-semibold">Send OTP</Text>
          )}
        </TouchableOpacity>
      </View>
      <Toast />
    </>
  );
}