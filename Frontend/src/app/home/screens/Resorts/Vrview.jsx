import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons, Feather, Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function VRTourScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#007BFF", "#7BB4FF"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            paddingVertical: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginBottom: 30,
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>

            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
                VR Tour
              </Text>
              <Text style={{ color: "#E3E3E3", fontSize: 14 }}>
                Green Valley Plot
              </Text>
            </View>

            <TouchableOpacity>
              <Feather name="maximize-2" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* VR Card */}
          <View
            style={{
              backgroundColor: "#000",
              marginTop: 70,
              width: 320,
              borderRadius: 20,
              paddingVertical: 35,
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#00B050",
                width: 55,
                height: 55,
                borderRadius: 27.5,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 15,
              }}
            >
              <Entypo name="direction" size={26} color="#fff" />
            </View>

            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
              Explore in VR
            </Text>

            <Text
              style={{
                color: "#B0B0B0",
                fontSize: 13,
                textAlign: "center",
                paddingHorizontal: 25,
                marginTop: 8,
                marginBottom: 18,
              }}
            >
              Tap the hotspots to navigate between rooms or use the controls
              below to explore the 360° view.
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "#00B050",
                paddingVertical: 10,
                paddingHorizontal: 40,
                borderRadius: 30,
              }}
            >
              <Text
                style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}
              >
                Start Tour
              </Text>
            </TouchableOpacity>
          </View>

          {/* Control Buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: "88%",
              marginTop: 70,
            }}
          >
            {[
              { icon: "volume-2" },
              { icon: "search" },
              { icon: "play", main: true },
              { icon: "plus" },
              { icon: "rotate-cw" },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={{
                  backgroundColor: item.main ? "#00B050" : "#ffffff30",
                  width: item.main ? 60 : 46,
                  height: item.main ? 60 : 46,
                  borderRadius: item.main ? 30 : 23,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather
                  name={item.icon}
                  size={item.main ? 28 : 22}
                  color="#fff"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Tabs — even, readable, one clean row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 55,
              marginBottom: 40,
              width: "100%",
            }}
          >
            {["Garden View", "Entrance", "Main Plot", "Overview"].map(
              (label, i) => (
                <TouchableOpacity
                  key={i}
                  style={{
                    backgroundColor:
                      i === 0 ? "#00B050" : "rgba(255,255,255,0.35)",
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    borderRadius: 25,
                    flex: 1,
                    marginHorizontal: 2,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: 13,
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
