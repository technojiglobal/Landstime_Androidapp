import { useState } from "react";
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
import { loginUser, saveToken, saveUserData } from "../../utils/api";

export default function SignIn() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // Add focus state

  const isPhoneValid = /^[0-9]{10}$/.test(phone);
  const canSignIn = isPhoneValid;

  const router = useRouter();

  const handleSignIn = async () => {
    if (!canSignIn) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Phone Number',
        text2: 'Please enter a valid 10-digit phone number',
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

        Toast.show({
          type: 'success',
          text1: 'Login Successful! 👋',
          text2: `Welcome back, ${response.data.data.user.name}`,
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
            text1: 'Account Not Found',
            text2: 'This number is not registered. Please sign up first.',
            position: 'top',
            visibilityTime: 4000,
          });
        } else if (errorMessage.includes("not verified")) {
          Toast.show({
            type: 'error',
            text1: 'Phone Not Verified',
            text2: 'Please verify your phone number',
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
    } catch (error) {
      console.error("Login error:", error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Failed to login. Please check your connection.',
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
      return isPhoneValid ? "#22c55e" : "#ef4444"; // green-500 : red-500
    }
    return isFocused ? "#22c55e" : "#0000001A"; // green-500 when focused : default gray
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
        <Text className="text-3xl font-bold">
          Let's <Text className="text-black">Sign In...</Text>
        </Text>
        <Text className="text-gray-500 mt-2 mb-6">
          Enter your phone number to access your account
        </Text>

        {/* Phone Input */}
        <View
          className="flex-row items-center border rounded-xl mb-4 px-3"
          style={{
            borderWidth: 2, // Increased to 2 for better visibility
            borderColor: getBorderColor(),
            backgroundColor: "#D9D9D91C",
          }}
        >
          <Ionicons
            name="call-outline"
            size={20}
            color={phone ? (isPhoneValid ? "#16a34a" : "#ef4444") : "#9ca3af"}
          />
          <TextInput
            className="flex-1 ml-3 h-12 text-base"
            placeholder="Phone number"
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

        <Text className="text-gray-500 text-sm mb-6">
          Note: Make sure you registered this phone number before signing in.
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
            >
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth")}>
            <Text className="text-green-600 font-bold">Register</Text>
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