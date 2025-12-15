import { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "../../global.css";
import { useRouter } from "expo-router";
import { ChevronLeft } from 'lucide-react-native';

export default function SignIn() {
  const [name, setName] = useState("jahnavi");
  const [phone, setPhone] = useState("7661873924");
  const [email, setEmail] = useState("abc@gmail.com");
  const [agree, setAgree] = useState(false);

  // ✅ Validation
  const isNameValid = name.trim().length >= 2;
  const isPhoneValid = /^[0-9]{10}$/.test(phone);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSignIn = isNameValid && isPhoneValid && isEmailValid && agree;

  const router = useRouter();

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
          Let’s <Text className="text-black">Sign In...</Text>
        </Text>
        <Text className="text-gray-500 mt-2 mb-6">
          Use credentials to access your account
        </Text>

        {/* ✅ Name Input */}
        <View
          className={`flex-row items-center border rounded-xl mb-4 px-3 ${
            name
              ? isNameValid
                ? "text-green-500"
                : "border-gray-300"
              : "border-gray-300"
          }`}
           style={{ borderWidth: 1, borderColor: "#0000001A" ,backgroundColor:"#D9D9D91C"}}
        >
          <Ionicons
            name="person-outline"
            size={20}
            color={name ? (isNameValid ? "#16a34a" : "#ef4444") : "#9ca3af"}
          />
          <TextInput
            className="flex-1 ml-3 h-12 text-base text-green-600"
            placeholder="Your Name"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* ✅ Phone Input */}
        <View
          className={`flex-row items-center border rounded-xl mb-4 px-3 ${
            phone
              ? isPhoneValid
                ? "text-green-500"
                : "border-gray-300"
              : "border-gray-300"
          }`}
           style={{ borderWidth: 1, borderColor: "#0000001A" ,backgroundColor:"#D9D9D91C"}}
        >
          <Ionicons
            name="call-outline"
            size={20}
            color={phone ? (isPhoneValid ? "#16a34a" : "#ef4444") : "#9ca3af"}
          />
          <TextInput
            className="flex-1 ml-3 h-12 text-base text-green-600"
            placeholder="Phone number"
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* ✅ Email Input */}
        <View
          className={`flex-row items-center border rounded-xl mb-4 px-3 ${
            email
              ? isEmailValid
                ? "text-green-500"
                : "border-gray-500"
              : "border-gray-300"
          }`}
           style={{ borderWidth: 1, borderColor: "#0000001A" ,backgroundColor:"#D9D9D91C"}}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color={email ? (isEmailValid ? "#16a34a" : "#ef4444") : "#9ca3af"}
          />
          <TextInput
            className="flex-1 ml-3 h-12 text-base text-green-600"
            placeholder="Enter your Email"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Terms Checkbox */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            className={`w-6 h-6 rounded border border-gray-400 mr-3 items-center justify-center ${
              agree ? "bg-green-600" : ""
            }`}
            onPress={() => setAgree(!agree)}
          >
            {agree && <Ionicons name="checkmark" size={16} color="white" />}
          </TouchableOpacity>
          <Text className="text-gray-600 flex-1">
            I agree to the{" "}
            <Text className="text-green-600 font-semibold">Terms of Service</Text> and{" "}
            <Text className="text-green-600 font-semibold">Privacy Policy</Text>
          </Text>
        </View>

        {/* ✅ Sign In Button */}
        <TouchableOpacity
  disabled={!canSignIn}
  onPress={() => router.replace("/(tabs)/home")}
  className={`h-14 rounded-xl items-center justify-center ${
    canSignIn ? "bg-green-600" : "bg-gray-200"
  }`}
>

          <Text
            className={`text-lg font-semibold ${
              canSignIn ? "text-white" : "text-gray-500"
            }`}
          >
            Sign In
          </Text>
        </TouchableOpacity>

        {/* ✅ Moved “Don’t have an account?” below Sign In */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Don’t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth")}>
            <Text className="text-green-600 font-bold">Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return Platform.OS === "web" ? (
    Content
  ) : (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {Content}
    </TouchableWithoutFeedback>
  );
}