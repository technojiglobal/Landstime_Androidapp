import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated, Easing } from "react-native";

export default function TopAlert({ visible, onHide }) {
  const slideAnim = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        // Auto hide after 2 seconds
        setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: -200,
            duration: 300,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }).start(() => onHide && onHide());
        }, 2000);
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 5,
        alignSelf: "center",
        width: 334,
        height: 172,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        transform: [{ translateY: slideAnim }],
        zIndex: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          borderWidth: 3,
          borderColor: "#22C55E",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
          <Image
            source={require("../assets/tick-icon.png")}
          style={{ width: 25, height: 25, tintColor: "#22C55E" }}
        />
      </View>

      <Text
        style={{
          textAlign: "center",
          fontWeight: "600",
          color: "#22C55E",
          fontSize: 16,
        }}
      >
        Property Uploaded{"\n"}Successfully!
      </Text>
    </Animated.View>
  );
}