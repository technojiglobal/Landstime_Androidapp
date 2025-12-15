import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AuthService from "../services/authService";

export default function VerifyOTPScreen() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Create refs for inputs
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (text, index) => {
    // Only allow numbers
    if (text && !/^\d+$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resendOtp = async () => {
    if (timer > 0) {
      Alert.alert("Please wait", `You can resend OTP after ${timer} seconds`);
      return;
    }

    setLoading(true);
    const tempData = await AuthService.getTempRegistrationData();
    
    if (!tempData) {
      Alert.alert("Error", "Session expired. Please start again.");
      router.push("/auth/register");
      return;
    }

    const result = await AuthService.sendOTP(tempData.phone, tempData.countryCode);
    setLoading(false);

    if (result.success) {
      await AuthService.storeTempRegistrationData({
        ...tempData,
        confirmationResult: result.confirmationResult
      });
      setTimer(60);
      setOtp(["", "", "", ""]);
      Alert.alert("Success", "OTP sent successfully!");
    } else {
      Alert.alert("Error", result.error || "Failed to resend OTP");
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 4) {
      Alert.alert("Error", "Please enter complete OTP");
      return;
    }

    setLoading(true);
    
    try {
      const tempData = await AuthService.getTempRegistrationData();
      
      if (!tempData || !tempData.confirmationResult) {
        Alert.alert("Error", "Session expired. Please start again.");
        router.push("/auth/register");
        setLoading(false);
        return;
      }

      const verifyResult = await AuthService.verifyOTP(
        tempData.confirmationResult, 
        otpString
      );
      
      if (verifyResult.success) {
        // Register user in backend
        const userData = {
          name: tempData.name,
          phone: tempData.phone,
          countryCode: tempData.countryCode,
          email: tempData.email,
          role: tempData.role,
          firebaseUid: verifyResult.firebaseUid
        };
        
        const registerResult = await AuthService.register(userData);
        
        if (registerResult.success) {
          await AuthService.clearTempRegistrationData();
          Alert.alert("Success", "Registration successful!", [
            { text: "OK", onPress: () => router.push("/home") }
          ]);
        } else {
          Alert.alert("Error", registerResult.message || "Registration failed");
        }
      } else {
        Alert.alert("Error", verifyResult.error || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Mask phone number
  const getMaskedPhone = () => {
    if (params.phone) {
      const phone = params.phone;
      return phone.substring(0, 2) + "******" + phone.substring(phone.length - 2);
    }
    return "98******10";
  };

  return (
    <View className="flex-1 bg-white px-6 pt-14">
      {/* Back Arrow */}
      <TouchableOpacity className="mb-6" onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="gray" />
      </TouchableOpacity>

      {/* Title */}
      <Text className="text-xl font-normal">
        Enter{" "}
        <Text className="font-bold text-xl text-black">Verification code</Text>
      </Text>
      <Text className="text-gray-500 mt-2 mb-1">
        Please enter 4 digit verification code sent to
      </Text>
      
      <View className="flex-row items-center mb-10">
        <Ionicons name="call-outline" size={16} />
        <Text className="text-gray-400 text-base ml-1">
          {getMaskedPhone()}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-green-600 text-base ml-3 font-medium underline">
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      {/* OTP Input Boxes */}
      <View className="flex-row justify-between mb-8">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className="w-16 h-16 bg-green-50 text-green-600 text-2xl font-bold rounded-xl text-center"
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            autoFocus={index === 0}
          />
        ))}
      </View>

      {/* Timer + Resend */}
      <View className="items-center mb-6">
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={18} color="black" />
          <Text className="text-gray-600 ml-2">
            {timer > 0 ? `00:${timer < 10 ? `0${timer}` : timer}` : "00:00"}
          </Text>
        </View>

        <Text className="text-gray-600 mt-2">
          Didn't receive OTP?{" "}
          <Text
            className={`font-semibold ${timer > 0 ? 'text-gray-400' : 'text-green-600'}`}
            onPress={resendOtp}
          >
            Resend Code
          </Text>
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleVerifyOTP}
        disabled={loading || otp.join("").length !== 4}
        className={`h-14 rounded-xl items-center justify-center ${
          loading || otp.join("").length !== 4 ? "bg-gray-300" : "bg-green-600"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-lg font-semibold">Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}