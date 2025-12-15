import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AuthService from "../services/authService";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const REF_WIDTH = 430;
const REF_HEIGHT = 932;
const scaleWidth = (size) => (SCREEN_WIDTH / REF_WIDTH) * size;
const scaleHeight = (size) => (SCREEN_HEIGHT / REF_HEIGHT) * size;

export default function VerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState(null);

  useEffect(() => {
    // Get phone number from params or temp storage
    const initPhone = async () => {
      if (params.phone) {
        setPhoneNumber(params.phone);
        setCountryCode(params.countryCode || "+91");
      } else {
        const tempData = await AuthService.getTempRegistrationData();
        if (tempData) {
          setPhoneNumber(tempData.phone);
          setCountryCode(tempData.countryCode);
        }
      }
    };
    initPhone();
  }, [params]);

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Phone number not found");
      return;
    }

    setLoading(true);
    
    try {
      const result = await AuthService.sendOTP(phoneNumber, countryCode);
      
      if (result.success) {
        // Store verification ID
        setVerificationId(result.verificationId);
        
        // Store for next screen
        await AuthService.storeTempRegistrationData({
          ...(await AuthService.getTempRegistrationData()),
          verificationId: result.verificationId,
          phone: phoneNumber,
          countryCode: countryCode
        });

        Alert.alert(
          "Success", 
          "OTP sent to your phone number",
          [
            {
              text: "OK",
              onPress: () => router.push({
                pathname: "/auth/verifyotp",
                params: {
                  phone: phoneNumber,
                  countryCode: countryCode,
                  verificationId: result.verificationId
                }
              })
            }
          ]
        );
      } else {
        Alert.alert("Error", result.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-14">
      {/* Back Arrow */}
      <TouchableOpacity
        className="mb-6"
        onPress={() => router.back()}
      >
        <Image
          source={require("../../../assets/arrow.png")}
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

      {/* Phone Box */}
      <View className="flex-row items-center bg-green-50 rounded-xl p-4 mb-8">
        <Ionicons name="call-outline" size={22} color="#16a34a" />
        <View className="ml-3 flex-1">
          <Text className="text-green-600 text-sm">Phone number</Text>
          <Text className="text-green-600 text-lg font-semibold">
            {countryCode} {phoneNumber}
          </Text>
        </View>
        <Ionicons name="checkmark-circle" size={22} color="#16a34a" />
      </View>

      {/* Send OTP Button */}
      <TouchableOpacity
        onPress={handleSendOTP}
        disabled={loading || !phoneNumber}
        className={`h-14 rounded-xl items-center justify-center ${
          loading || !phoneNumber ? "bg-gray-300" : "bg-green-600"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-lg font-semibold">
            Send OTP
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}