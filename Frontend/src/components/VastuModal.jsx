import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  PanResponder,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useResponsive } from "../utils/responsive";

export default function VastuModal({ visible, onClose }) {
  const { scaleWidth, scaleHeight } = useResponsive();
  //if (!visible) return null;

  const vastuData = [
    { icon: require("../../assets/house.png"), text: " House Facing", direction: "North East" },
    { icon: require("../../assets/bedroom.png"), text: "Master Bedroom", direction: "South-West" },
    { icon: require("../../assets/bedroom.png"), text: "Children BedRoom", direction: "South" },
    { icon: require("../../assets/living.png"), text: "Living Room", direction: "West" },
    { icon: require("../../assets/kitchen.png"), text: "Kitchen", direction: "North-East" },
    { icon: require("../../assets/pooja.png"), text: "Pooja Room", direction: "North-West" },
    { icon: require("../../assets/balcony.png"), text: "Balcony", direction: "South-East" },
  ];

  // constants
  const scrollViewHeight = 433;
  const thumbHeight = 253.7;
  const itemHeight = 64; // item + margin
  const contentHeight = vastuData.length * itemHeight;
  const scrollableHeight = contentHeight - scrollViewHeight;

  // Animated values
  const scrollY = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  // map scroll position to thumb position
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      const thumbPos =
        (value / scrollableHeight) * (scrollViewHeight - thumbHeight);
      pan.setValue(thumbPos);
    });
    return () => scrollY.removeListener(listener);
  }, [scrollY]);

  // draggable thumb behavior
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset(pan.__getValue());
      },
      onPanResponderMove: (_, gestureState) => {
        let newPos = gestureState.dy + pan._offset;
        if (newPos < 0) newPos = 0;
        if (newPos > scrollViewHeight - thumbHeight)
          newPos = scrollViewHeight - thumbHeight;

        pan.setValue(newPos);

        // calculate content scroll position based on thumb drag
        const scrollPos =
          (newPos / (scrollViewHeight - thumbHeight)) * scrollableHeight;
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: scrollPos, animated: false });
        }
      },
      onPanResponderRelease: () => pan.flattenOffset(),
    })
  ).current;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" }}>
        <View className="bg-white w-[330px] h-[600px] rounded-[20px] overflow-hidden" style={{ zIndex: 30 }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-black/10">
            <View className="flex-row items-center">
              <Image
                source={require("../../assets/vastu.png")}
                style={{
                  width: scaleWidth(25),
                  height: scaleHeight(25),
                  resizeMode: "contain",
                  marginRight: scaleWidth(8),
                }}
              />
              <Text className="text-black font-semibold text-lg">
                View Details
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={13} color="#00000066" />
            </TouchableOpacity>
          </View>

          {/* Center Box */}
          <View
            style={{
              width: scaleWidth(103),
              height: scaleHeight(24),
              backgroundColor: "#FFA5002B",
              borderRadius: scaleWidth(8),
              alignSelf: "center",
              marginVertical: scaleHeight(10),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../../assets/house.png")}
              style={{
                width: scaleWidth(13),
                height: scaleHeight(13),
                resizeMode: "contain",
                marginRight: scaleWidth(5),
              }}
            />
            <Text
              style={{ fontSize: scaleWidth(10), color: "#FFA500", fontWeight: "500" }}
            >
              House
            </Text>
          </View>

          {/* Scrollable Area */}
          <View
            style={{
              width: scaleWidth(286),
              height: scaleHeight(scrollViewHeight),
              alignSelf: "center",
              borderRadius: scaleWidth(10),
              flexDirection: "row",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            {/* Property List */}
            <Animated.ScrollView
              ref={scrollViewRef}
              style={{
                flex: 1,
                marginRight: 12, // creates gap between list and scrollbar
              }}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false} // hides system scrollbar
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
            >
              {vastuData.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    height: scaleHeight(49),
                    borderRadius: scaleWidth(10),
                    backgroundColor: "#F9FAFB",
                    borderWidth: Math.max(1, Math.round(scaleWidth(1))),
                    borderColor: "#E0E0E0",
                    elevation: 2,
                    paddingHorizontal: scaleWidth(10),
                    marginBottom: scaleHeight(15),
                  }}
                >
                  {/* Left: Icon + Text */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={item.icon}
                      style={{
                        width: scaleWidth(18),
                        height: scaleHeight(18),
                        resizeMode: "contain",
                        marginRight: scaleWidth(8),
                      }}
                    />
                    <Text
                      style={{
                        fontSize: scaleWidth(10),
                        color: "#000000CC",
                        fontWeight: "500",
                      }}
                    >
                      {item.text}
                    </Text>
                  </View>

                  {/* Right: Direction */}
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: scaleWidth(10),
                        color: "#000000CC",
                        marginBottom: scaleHeight(2),
                      }}
                    >
                      {item.direction}
                    </Text>
                    <Text style={{ fontSize: scaleWidth(8), color: "#00000066" }}>
                      Direction
                    </Text>
                  </View>
                </View>
              ))}
            </Animated.ScrollView>

            {/* Custom Scrollbar Track + Thumb */}
            <View
              style={{
                width: scaleWidth(7),
                height: scaleHeight(scrollViewHeight),
                backgroundColor: "#D9D9D980",
                borderRadius: scaleWidth(10),
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Animated.View
                {...panResponder.panHandlers}
                style={{
                  width: scaleWidth(7),
                  height: scaleHeight(thumbHeight),
                  borderRadius: scaleWidth(10),
                  backgroundColor: "#00000029",
                  transform: [{ translateY: pan }],
                }}
              />
            </View>
          </View>

          {/* Close Button */}
          <View className="items-center mt-10">
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: "#22C55E",
                width: scaleWidth(179),
                height: scaleHeight(33),
                borderRadius: scaleWidth(8),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: "white", fontSize: scaleWidth(14), fontWeight: "600" }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}