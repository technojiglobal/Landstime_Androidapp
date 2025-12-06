import { useRouter } from "expo-router";
import React from "react";
import { View, Text, Dimensions, TouchableOpacity, Image } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Reference device: iPhone 14 Pro Max
const REF_WIDTH = 430;
const REF_HEIGHT = 932;

const scaleWidth = (size) => (SCREEN_WIDTH / REF_WIDTH) * size;
const scaleHeight = (size) => (SCREEN_HEIGHT / REF_HEIGHT) * size;
const Hero = () => {
  const router = useRouter();
  return (
    <View className="border-b border-gray-200 m-2 p-2 flex flex-col">
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: scaleHeight(12),
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: scaleWidth(12) }}
        >
          <Image
            source={require("../../../../../assets/arrow.png")}
            style={{
              width: scaleWidth(26),
              height: scaleHeight(26),
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className="font-semibold text-md">Settings</Text>
      </View>
      <Text
  className="text-gray-700 text-sm"
  style={{ marginLeft: scaleWidth(38) }}
>
  Manage your app preferences
</Text>

    </View>
  );
};

export default Hero;
