import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const GREEN = "#00C853";

export default function VRTourScreen() {
  const [selectedRoom, setSelectedRoom] = useState("Living Room");

  return (
    <LinearGradient
      colors={["#0A84FF", "#3CA6FF", "#CFCFCF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <SafeAreaView style={styles.safe}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/home/screens/Flats/(Property)")}>
            <Image
              source={require("../../../../../assets/leftarrow.png")}
              style={styles.iconImg}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>VR Tour</Text>
            <Text style={styles.headerSubtitle}>Green Valley Resort</Text>
          </View>

          <TouchableOpacity style={styles.expandBtn}>
            <Image
              source={require("../../../../../assets/rightarrow.png")}
              style={styles.expandIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* FLOATING LABEL */}
        <View style={styles.livingBadge}>
          <Ionicons name="home-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.livingText}>Living Room</Text>
        </View>

        {/* CENTER BOX */}
        <View style={styles.card}>
          <View style={styles.vrIconCircle}>
            <Image
              source={require("../../../../../assets/vr.png")}
              style={styles.vrImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.cardTitle}>Explore in VR</Text>
          <Text style={styles.cardDesc}>
            Tap the hotspots to navigate between rooms or use the controls below to explore the
            360° view.
          </Text>

          <TouchableOpacity style={styles.startBtn}>
            <Text style={styles.startBtnText}>Start Tour</Text>
          </TouchableOpacity>
        </View>

        {/* CONTROLS + ROOMS */}
        <View style={styles.controls}>
          {/* ICON CONTROLS */}
          <View style={styles.iconRow}>
            {[
              require("../../../../../assets/img1.png"),
              require("../../../../../assets/img2.png"),
              require("../../../../../assets/img3.png"),
              require("../../../../../assets/img4.png"),
              require("../../../../../assets/img5.png"),
            ].map((icon, index) => (
              <TouchableOpacity
                key={index}
                style={index === 2 ? styles.playBtn : styles.iconBtn}
              >
                <Image
                  source={icon}
                  style={{
                    width: index === 2 ? 26 : 20,
                    height: index === 2 ? 26 : 20,
                    tintColor: "#fff",
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* ROOM CHIPS */}
          <Text style={styles.selectLabel}>Select Room</Text>
          <View style={styles.roomRow}>
            {["Garden View", "Entrance", "Main Plot", "Overview"].map((room) => {
              const active = selectedRoom === room;
              return (
                <TouchableOpacity
                  key={room}
                  onPress={() => setSelectedRoom(room)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {room}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 50,
    marginBottom: 100,
  },
  headerCenter: { alignItems: "center", flex: 1 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  headerSubtitle: { color: "white", fontSize: 13, marginTop: 2, fontWeight: "bold" },
  iconImg: { width: 22, height: 22 },
  expandBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  expandIcon: { width: 14, height: 14, tintColor: "#fff" },

  // Floating badge
  livingBadge: {
    position: "absolute",
    top: 130,
    right: 25,
    flexDirection: "row",
    backgroundColor: "#032E57",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 5,
  },
  livingText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  // Card
  card: {
    backgroundColor: "#000",
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 35,
    paddingHorizontal: 20,
    width: "90%",
    marginTop: 60,
    marginBottom: 40,
    height:300
  },
  // VR Icon Circle (gray background)
  vrIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1B1B1B", // dark gray circular background
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  vrImage: { width: 50, height: 50 },
  cardTitle: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 8 },
  cardDesc: {
    color: "#cfcfcf",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  startBtn: {
    backgroundColor: GREEN,
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 30,
  },
  startBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // Controls
  controls: {
    alignItems: "center",
    width: "100%",
    marginTop: 5,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "95%",
    marginBottom: 15,
  },
  iconBtn: {
    backgroundColor: "rgba(255,255,255,0.18)",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    backgroundColor: GREEN,
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
  },
  selectLabel: {
    color: "rgba(255,255,255,0.95)",
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "bold",
  },
  roomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
    fontWeight:"bold"
  },
  chip: {
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  chipActive: { backgroundColor: GREEN },
  chipText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  chipTextActive: { fontWeight: "700" },
});
