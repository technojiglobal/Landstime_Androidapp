import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ChevronLeft } from 'lucide-react-native';
export default function OtpVerificationScreen() {
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);
  const [timer, setTimer] = useState(30);

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

  // Resend OTP
  const resendOtp = () => {
    setTimer(30);
    alert("OTP Resent!");
  };

  return (
    <View className="flex-1 bg-white px-6 pt-14">
      {/* Back Arrow */}
      <TouchableOpacity className="mb-6" onPress={() => router.back()}>
        <ChevronLeft color="gray" size={25} />
      </TouchableOpacity>

      {/* Title */}
      <Text className="text-xl font-normal">
        Enter{" "}
        <Text className="font-bold text-xl text-black">Verification code</Text>
      </Text>
      <Text className="text-gray-500 mt-2 mb-1">Please enter 4 digit verification code sent to</Text>
      
         <View className="flex-row items-center mb-10">
        <Ionicons name="call-outline" size={16} />
        <Text className="text-gray-400 text-base ml-1">
          98******10
        </Text>
       <TouchableOpacity onPress={() => router.back()}>
        <Text className="text-green-600 text-base ml-3 font-medium underline">Edit</Text>
        </TouchableOpacity>
      </View>
      {/* OTP Input Boxes */}
      <View className="flex-row justify-between mb-8">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            
            className="w-16 h-16 bg-green-50 text-green-600 text-2xl font-bold rounded-xl text-center"
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      {/* Timer + Resend */}
      <View className="items-center mb-6">
        <Text className="text-gray-600 flex-row items-center">
          <Ionicons name="time-outline" size={18} color="black" />{" "}
          {timer > 0 ? `00:${timer < 10 ? `0${timer}` : timer}` : "00:00"}
        </Text>

        <Text className="text-gray-600 mt-2">
          Didn’t receive OTP?{" "}
          <Text
            className="text-green-600 font-semibold"
            onPress={resendOtp}
          >
            Resend Code
          </Text>
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={() => router.push("/auth")}
        className="h-14 rounded-xl items-center justify-center bg-green-600"
      >
        <Text className="text-white text-lg font-semibold">Submit</Text>
      </TouchableOpacity>
    </View>
  );
}