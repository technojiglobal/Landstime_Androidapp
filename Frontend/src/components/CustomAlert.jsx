import React, { useEffect } from "react";
import { View, Text, Modal, Image } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import tick from "../../assets/tick.png";
export default function CustomAlert({
  visible,
  title,
  message,
  onClose,
  duration = 2500,
}) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      {/* Background dim */}
      <View className="flex-1 bg-black/50 justify-center items-center px-6">

        {/* Alert Box */}
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          className="w-full bg-white rounded-3xl p-8 items-center"
          style={{ shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 10 }}
        >
          {/* Title */}
          <Text className="text-2xl font-semibold text-black mb-2 text-center">
            {title}
          </Text>

          {/* Message */}
          <Text className="text-gray-500 text-center mb-6 leading-5">
            {message}
          </Text>

          {/* Green Check Icon — FIXED UI */}
          <View className="w-20 h-20 rounded-full border border-2 border-[#22C55E] justify-center items-center">
          <Image
            source={tick}
            className="w-10 h-10 mt-2"
            resizeMode="contain"
          />
        </View>
        </Animated.View>

      </View>
    </Modal>
  );
}
