import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Reference iPhone 14 Pro Max dimensions
const REF_WIDTH = 430;
const REF_HEIGHT = 932;

// Scale functions to maintain proportions
const scaleWidth = (size) => (SCREEN_WIDTH / REF_WIDTH) * size;
const scaleHeight = (size) => (SCREEN_HEIGHT / REF_HEIGHT) * size;


export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Skip Button */}
      <View
        style={{
          position: "absolute",
          top: scaleHeight(62),
          right: scaleWidth(20),
        }}
      >
        <TouchableOpacity onPress={() => router.push("/onboarding/welcomescreen4")}>
          <Text className="text-gray-500 text-base font-semibold">Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Image */}
      <Image
        source={require("../../../assets/screen1-1.jpg")}
        style={{
          position: "absolute",
          top: scaleHeight(129),
          left: SCREEN_WIDTH / 2 - scaleWidth(196), // center image
          width: scaleWidth(392),
          height: scaleHeight(417),
          borderRadius: scaleWidth(50),
        }}
      />

      {/* Title Text */}
      <Text
        style={{
          position: "absolute",
          top: scaleHeight(573),
          left: SCREEN_WIDTH / 2 - scaleWidth(77),
          width: scaleWidth(154),
          height: scaleHeight(68),
          fontSize: scaleWidth(28),
          fontWeight: "500",
          lineHeight: scaleHeight(34),
          textAlign: "center",
          color: "black",
        }}
      >
        Find Perfect{"\n"}Properties
      </Text>

      {/* 3 Dots */}
      <View
        style={{
          position: "absolute",
          top: scaleHeight(769),
          left: SCREEN_WIDTH / 2 - scaleWidth(29),
          flexDirection: "row",
          justifyContent: "space-between",
          width: scaleWidth(58),
          height: scaleHeight(10),
        }}
      >
        <View className="w-[10px] h-[10px] rounded-full bg-green-500" />
        <View className="w-[10px] h-[10px] rounded-full bg-gray-300" />
        <View className="w-[10px] h-[10px] rounded-full bg-gray-300" />
      </View>

      {/* Next Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          position: "absolute",
          top: scaleHeight(806),
          left: SCREEN_WIDTH / 2 - scaleWidth(161),
          width: scaleWidth(322),
          height: scaleHeight(51),
          borderRadius: scaleWidth(27),
          backgroundColor: "#22C55E",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => router.push("/onboarding/welcomescreen2")}
      >
        <Text
          style={{
            fontWeight: "700",
            fontSize: scaleWidth(20),
            lineHeight: scaleHeight(33),
            textAlign: "center",
            color: "#fff",
          }}
        >
          Next
        </Text>
      </TouchableOpacity>

      {/* Underline */}
      <View
        style={{
          position: "absolute",
          top: scaleHeight(892),
          left: SCREEN_WIDTH / 2 - scaleWidth(67),
          width: scaleWidth(134),
          height: scaleHeight(5),
          backgroundColor: "black",
          borderRadius: scaleWidth(10),
        }}
      />
    </View>
  );
}