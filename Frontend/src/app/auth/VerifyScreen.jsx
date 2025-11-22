import { View, Text,Image, TouchableOpacity,Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Reference device: iPhone 14 Pro Max
const REF_WIDTH = 430;
const REF_HEIGHT = 932;

const scaleWidth = (size) => (SCREEN_WIDTH / REF_WIDTH) * size;
const scaleHeight = (size) => (SCREEN_HEIGHT / REF_HEIGHT) * size;
export default function VerificationScreen() {
  const router = useRouter();

  const phoneNumber = "987654321"; // <-- you can pass this dynamically via params

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
        We have shared an OTP to your registered phone number
      </Text>

      {/* Phone Box */}
      <View className="flex-row items-center bg-green-50 rounded-xl p-4 mb-8">
        <Ionicons name="call-outline" size={22} color="#16a34a" />
        <View className="ml-3 flex-1">
          <Text className="text-green-600 text-sm">Phone number</Text>
          <Text className="text-green-600 text-lg font-semibold">
            {phoneNumber}
          </Text>
        </View>
        <Ionicons name="checkmark-circle" size={22} color="#16a34a" />
      </View>

      {/* Send OTP Button */}
      <TouchableOpacity
        onPress={() => router.push("/auth/verifyotp")}
        className="h-14 rounded-xl items-center justify-center bg-green-600"
      >
        <Text className="text-white text-lg font-semibold">
          Send OTP
        </Text>
      </TouchableOpacity>
    </View>
  );
}
