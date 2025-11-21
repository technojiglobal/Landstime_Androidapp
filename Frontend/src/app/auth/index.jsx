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
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "../../../global.css";
import { useRouter } from "expo-router";
import { ChevronLeft } from 'lucide-react-native';
export default function App() {
  const [name, setName] = useState("jahnavi");
  const [phone, setPhone] = useState("7661873924");
  const [email, setEmail] = useState("abc@gmail.com");
  const [countryCode, setCountryCode] = useState("+91");
  const [showDropdown, setShowDropdown] = useState(false);
  const [role, setRole] = useState("");
  const [agree, setAgree] = useState(false);

  const router = useRouter();

  // ✅ Validation
  const isNameValid = name.trim().length >= 2;
  const isPhoneValid = /^[0-9]{10}$/.test(phone);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canRegister = isNameValid && isPhoneValid && isEmailValid && role && agree;


  const countryCodes = ["+91", "+1", "+44", "+61", "+81"];

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
         <TouchableOpacity className="mb-6" onPress={() => router.push("/onboarding/welcomescreen4")}>
               <ChevronLeft color="gray" size={25} />
                </TouchableOpacity>
        {/* Title */}
        <Text className="text-3xl font-bold text-center mt-10">
          Create Account
        </Text>
        <Text className="text-gray-500 text-center mt-2 mb-6">
          Join thousands finding their perfect home
        </Text>

        {/* ✅ Name Input */}
        <View
          className={`flex-row items-center border rounded-xl mb-4 px-3 ${
            name
              ? isNameValid
                ? "text-green-500"
                : "border-gray-500"
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
            className="flex-1 ml-3 h-12 text-base text-green-600 "
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* ✅ Phone Input with dropdown */}
        <View
          className={`flex-row items-center border rounded-xl mb-4 px-3 ${
            phone
              ? isPhoneValid
                ? "text-green-500"
                : "border-gray-500"
              : "border-gray-300"
          }`}
          style={{ borderWidth: 1, borderColor: "#0000001A" ,backgroundColor:"#D9D9D91C"}}
        >
          <Ionicons
            name="call-outline"
            size={20}
            color={phone ? (isPhoneValid ? "#16a34a" : "#ef4444") : "#9ca3af"}
          />

          <TouchableOpacity
            onPress={() => setShowDropdown(true)}
            className="flex-row items-center ml-2 border-r border-gray-200 pr-2"
          >
            <Text
              className={`text-base ${
                isPhoneValid ? "text-green-600" : "text-gray-700"
              }`}
            >
              {countryCode}
            </Text>
            <Ionicons
              name="chevron-down-outline"
              size={16}
              color={isPhoneValid ? "#16a34a" : "#9ca3af"}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>

          <TextInput
            className="flex-1 ml-2 h-12 text-base text-green-600"
            placeholder="Phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholderTextColor="#9ca3af"
          />

          <TouchableOpacity
            disabled={!isPhoneValid}
            onPress={() => router.push("auth/VerifyScreen")}
          >
            <Text
              className={`font-semibold ${
                isPhoneValid ? "text-green-500" : "text-gray-400"
              }`}
            >
              Verify
            </Text>
          </TouchableOpacity>
        </View>

        {/* Country code modal */}
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

        {/* ✅ Email Input */}
        <View
          className={`flex-row items-center border rounded-xl mb-4 px-3 ${
            email
              ? isEmailValid
                ? "text-green-500"
                : "border-gray-300"
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
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#9ca3af"
          />

          <TouchableOpacity
            disabled={!isEmailValid}
            onPress={() => alert("Email verification link sent!")}
          >
            <Text
              className={`font-semibold ${
                isEmailValid ? "text-green-500" : "text-gray-400"
              }`}
            >
              Verify
            </Text>
          </TouchableOpacity>
        </View>

        {/* Role */}
        <Text className="text-gray-700 mb-2">What is your role?</Text>
        <View className="flex-row mb-6">
          <TouchableOpacity
            className={`px-6 py-2 rounded-full mr-3 border ${
              role === "Buyer"
                ? "text-green-600 bg-green-50 border-green-500"
                : "border-gray-300"
            }`}
            onPress={() => setRole("Buyer")}
          >
            <Text
              className={`${
                role === "Buyer"
                  ? "text-green-700 font-semibold "
                  : "text-gray-500"
                  
              }`}
            >
              Buyer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-2 rounded-full border ${
              role === "Owner"
                ? "text-green-600 bg-green-50 border-green-500"
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
              Owner
            </Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
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
            <Text className="text-green-600 font-semibold">
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text className="text-green-600 font-semibold">
              Privacy Policy
            </Text>
          </Text>
        </View>

        {/* ✅ Register Button */}
        <TouchableOpacity
          disabled={!canRegister}
          onPress={() => router.push("/auth/LoginScreen")}
          className={`h-14 rounded-xl items-center justify-center ${
            canRegister ? "bg-green-600" : "bg-gray-200"
          }`}
        >
          <Text
            className={`text-lg font-semibold ${
              canRegister ? "text-white" : "text-gray-500"
            }`}
          >
            Register
          </Text>
        </TouchableOpacity>

        {/* ✅ Sign In Link directly below */}
        <View className="flex-row justify-center mt-6 mb-10">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/LoginScreen")}>
            <Text className="text-green-600 font-bold">Sign In</Text>
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