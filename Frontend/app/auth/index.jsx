//frontend//app//auth//index.jsx
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
import { registerUser, saveToken, saveUserData,checkPhoneExists } from "../../utils/api";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [showDropdown, setShowDropdown] = useState(false);
  const [role, setRole] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams()
useEffect(() => {
  // Only process if params has data
  if (!params || Object.keys(params).length === 0) return;
  
  console.log('📥 Received params:', JSON.stringify(params, null, 2));
  console.log('allowEdit value:', params.allowEdit);
  console.log('verified value:', params.verified);
  
  // Load data from params
  if (params.phone) {
    setPhone(params.phone);
  }
  
  if (params.countryCode) {
    setCountryCode(params.countryCode);
  }
  
  if (params.name) {
    setName(params.name);
  }
  
  if (params.email) {
    setEmail(params.email);
  }
  
  if (params.role) {
    setRole(params.role);
  }
  
  // Set verification status
  if (params.allowEdit === "true") {
    setPhoneVerified(false);
    setAllowEdit(true);
  } else if (params.verified === "true") {
    setPhoneVerified(true);
    setAllowEdit(false);
  }
}, [params]);

  console.log('🔐 phoneVerified:', phoneVerified);
console.log('✏️ allowEdit:', allowEdit);
console.log('📝 editable:', !phoneVerified || allowEdit);


  const isNameValid = name.trim().length >= 2;
  const isPhoneValid = /^[0-9]{10}$/.test(phone);
 const isEmailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const canRegister =
    isNameValid && isPhoneValid && isEmailValid && role && agree && phoneVerified;

  const countryCodes = ["+91", "+1", "+44", "+61", "+81"];

const handleRegister = async () => {
  if (!canRegister) return;

  // Additional validations before submitting
  if (!phoneVerified) {
    Toast.show({
      type: 'error',
      text1: 'Phone Not Verified',
      text2: 'Please verify your phone number first',
      position: 'top',
      visibilityTime: 3000,
    });
    return;
  }

  if (!agree) {
    Toast.show({
      type: 'error',
      text1: 'Terms Required',
      text2: 'Please agree to Terms of Service',
      position: 'top',
      visibilityTime: 3000,
    });
    return;
  }

  setLoading(true);
  try {
    const response = await registerUser({
      name: name.trim(),
      phone: phone,
      countryCode: countryCode,
      email: email.toLowerCase().trim(),
      role: role,
    });

    if (response.success && response.data.success) {
      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Registration Successful! 🎉',
        text2: 'Please login to continue',
        position: 'top',
        visibilityTime: 2500,
      });

      // Navigate to login after 2.5 seconds
      setTimeout(() => {
        router.replace("/auth/LoginScreen");
      }, 2500);
    } else {
      // Handle specific errors
      const errorMessage = response.data?.message || "Something went wrong";
      
      if (errorMessage.includes("phone number already exists")) {
        Toast.show({
          type: 'error',
          text1: 'Phone Already Registered',
          text2: 'This number is already registered. Please login.',
          position: 'top',
          visibilityTime: 4000,
        });
      } else if (errorMessage.includes("email already exists")) {
        Toast.show({
          type: 'error',
          text1: 'Email Already Registered',
          text2: 'This email is already in use.',
          position: 'top',
          visibilityTime: 4000,
        });
      } else if (errorMessage.includes("Phone verification expired")) {
        Toast.show({
          type: 'error',
          text1: 'Verification Expired',
          text2: 'Please verify your phone number again',
          position: 'top',
          visibilityTime: 4000,
        });
        setPhoneVerified(false);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
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
      text1: 'Network Error',
      text2: 'Failed to register. Please check your connection.',
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
    // Check if phone already exists
    const response = await checkPhoneExists(phone);

    if (response.success && response.data.exists) {
      Toast.show({
        type: 'error',
        text1: 'Phone Already Registered',
        text2: 'This number is already registered. Please login instead.',
        position: 'top',
        visibilityTime: 4000,
      });
      return;
    }

    // Phone is available, proceed to verification
    router.push({
      pathname: "/auth/VerifyScreen",
      params: { 
        phone: phone, 
        countryCode: countryCode,
        name : name,
        email: email,
        role: role
      },
    });

  } catch (error) {
    console.error('Check phone error:', error);
    Toast.show({
      type: 'error',
      text1: 'Error',
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
            Create Accounts
          </Text>
        </View>

        <Text className="text-gray-500 text-center mb-6">
          Join thousands finding their perfect home
        </Text>

        {/* Name Input */}
        <View
          className={`flex-row items-center border rounded-xl mb-4 px-3 ${
            name
              ? isNameValid
                ? "border-green-500"
                : "border-red-500"
              : "border-gray-300"
          }`}
          style={{
            borderWidth: 1,
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
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#9ca3af"
          />
        </View>

      {/* Phone Input */}
<View
  className={`flex-row items-center border rounded-xl mb-4 px-3 ${
    phone
      ? isPhoneValid
        ? phoneVerified
          ? "border-green-500"
          : "border-orange-500"
        : "border-red-500"
      : "border-gray-300"
  }`}
  style={{
    borderWidth: 1,
    backgroundColor: "#D9D9D91C",
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
    className="flex-row items-center ml-2 border-r border-gray-200 pr-2"
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
    <Text className="text-base text-gray-700">{phone}</Text>
  </View>
) : Platform.OS === 'web' ? (
  <input
    type="tel"
    placeholder="Phone number"
    value={phone}
    onChange={(e) => {
      const text = e.target.value;
      if (/^\d{0,10}$/.test(text)) {
        setPhone(text);
        setPhoneVerified(false);
        setAllowEdit(false);
      }
    }}
    maxLength={10}
    autoFocus={allowEdit}
    className="flex-1 ml-2 h-12 text-base"
    style={{
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      fontSize: '16px',
      color: '#111827'
    }}
  />
) : (
  <TextInput
    className="flex-1 ml-2 h-12 text-base"
    placeholder="Phone number"
    keyboardType="phone-pad"
    value={phone}
    onChangeText={(text) => {
      if (/^\d{0,10}$/.test(text)) {
        setPhone(text);
        setPhoneVerified(false);
        setAllowEdit(false);
      }
    }}
    placeholderTextColor="#9ca3af"
    autoFocus={allowEdit}
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
        <Text className="text-blue-500 text-sm">Change</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity disabled={!isPhoneValid} onPress={handleVerifyPhone}>
      <Text
        className={`font-semibold ${
          isPhoneValid ? "text-green-500" : "text-gray-400"
        }`}
      >
        Verify
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
          className={`flex-row items-center border rounded-xl mb-4 px-3 ${
            email
              ? isEmailValid
                ? "border-green-500"
                : "border-red-500"
              : "border-gray-300"
          }`}
          style={{
            borderWidth: 1,
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
            placeholder="Enter your Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
          />
        </View>

        {/* Role Selection */}
        <Text className="text-gray-700 mb-2">What is your role?</Text>
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
              Buyer
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
              Register
            </Text>
          )}
        </TouchableOpacity>

        {/* Sign In */}
        <View className="flex-row justify-center mt-6 mb-10">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/LoginScreen")}>
            <Text className="text-green-600 font-bold">Sign In</Text>
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
      <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
        {Content}
      </TouchableWithoutFeedback>
    )}
    <Toast />
    </>
  )
}
