import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Reference device: iPhone 14 Pro Max
const REF_WIDTH = 430;
const REF_HEIGHT = 932;

const scaleWidth = (size) => (SCREEN_WIDTH / REF_WIDTH) * size;
const scaleHeight = (size) => (SCREEN_HEIGHT / REF_HEIGHT) * size;

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
       <View style={{ position: "absolute", top: scaleHeight(62), left: scaleWidth(5) }}>
          <TouchableOpacity
            onPress={() => {
              
                router.push("/onboarding/welcomescreen3"); // fallback screen
              }
            }
          >
            <Image
              source={require("../../../assets/arrow.png")}
              style={{ width: scaleWidth(28), height: scaleHeight(28) }}
              resizeMode="contain"
            />
          </TouchableOpacity>
     </View>
      {/* Title */}
      <Text
        style={{
          position: "absolute",
          top: scaleHeight(100),
          left: scaleWidth(35),
          width: scaleWidth(360),
          height: scaleHeight(68),
          fontSize: scaleWidth(24),
          fontWeight: "500",
          lineHeight: scaleHeight(28),
          color: "black",
        }}
      >
        Discover a place you{"\n"}will love to live
      </Text>

      {/* Description */}
      <Text
        style={{
          position: "absolute",
          top: scaleHeight(182),
          left: scaleWidth(35),
          width: scaleWidth(360),
          fontSize: scaleWidth(14),
          fontWeight: "500",
          lineHeight: scaleHeight(20),
          color: "#000000A6",
        }}
      >
        Browse homes for sale, original neighborhood photos, resident reviews, local insights to find what is right for you
      </Text>

      {/* Explore Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          position: "absolute",
          top: scaleHeight(291),
          left: SCREEN_WIDTH / 2 - scaleWidth(161), // center horizontally
          width: scaleWidth(322),
          height: scaleHeight(51),
          borderRadius: scaleWidth(27),
          backgroundColor: "#22C55E",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => router.push("/auth")}
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
          Let's Explore
        </Text>
      </TouchableOpacity>

      {/* Main Image */}
      <Image
        source={require("../../../assets/screen4.jpg")}
        style={{
          position: "absolute",
          top: scaleHeight(371),
          left: SCREEN_WIDTH / 2 - scaleWidth(196),
          width: scaleWidth(390),
          height: scaleHeight(546),
          borderTopLeftRadius: scaleWidth(50),
          borderTopRightRadius: scaleWidth(50),
          resizeMode: "cover",
        }}
      />
    </View>
  );
}