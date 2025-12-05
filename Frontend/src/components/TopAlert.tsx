import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated, Easing } from "react-native";
import { useResponsive } from "../utils/responsive";

interface TopAlertProps {
  visible: boolean;
  onHide: () => void;
}

export default function TopAlert({ visible, onHide }: TopAlertProps) {
  const { scaleHeight, scaleWidth, clampWidth } = useResponsive();
  const slideAnim = useRef(new Animated.Value(-scaleHeight(220))).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: -scaleHeight(220),
            duration: 300,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }).start(() => onHide());
        }, 2000);
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: scaleHeight(8),
        alignSelf: "center",
        width: clampWidth(334, 24),
        height: scaleHeight(172),
        borderBottomLeftRadius: scaleWidth(30),
        borderBottomRightRadius: scaleWidth(30),
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        transform: [{ translateY: slideAnim }],
        zIndex: 20,
      }}
    >
      <View
        style={{
          width: scaleWidth(60),
          height: scaleWidth(60),
          borderRadius: scaleWidth(30),
          borderWidth: Math.max(1, Math.round(scaleWidth(3))),
          borderColor: "#22C55E",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: scaleHeight(10),
        }}
      >
        <Image
          source={require("../../assets/tick.png")}
          
          style={{ width: scaleWidth(25), height: scaleWidth(25), tintColor: "#22C55E" }}
          resizeMode="contain"
        />
      </View>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#22C55E",
          fontSize: scaleWidth(16),
          lineHeight: scaleHeight(20),
        }}
      >
        Brochure Downloaded{"\n"}Successfully...
      </Text>
    </Animated.View>
  );
}