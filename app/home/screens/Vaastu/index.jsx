// Frontend/app/home/screens/Vaastu/index.jsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView, StatusBar } from "react-native";
import { useTranslation } from "react-i18next";
import DirectionDetails from "./DirectionDetails";
import Slidearrow from "../../../../assets/Slide-arrow.png";
import directionsData from "../../../../data/directionsData";
import Rooms from "./Rooms";
import Dodont from "./Dodont";
import Elements from "./Elements";
import { useRouter } from "expo-router";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Reference device: iPhone 14 Pro Max
const REF_WIDTH = 430;
const REF_HEIGHT = 932;

const scaleWidth = (size) => (SCREEN_WIDTH / REF_WIDTH) * size;
const scaleHeight = (size) => (SCREEN_HEIGHT / REF_HEIGHT) * size;

export default function VastuDirections() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Directions");
  const [activeDirection, setActiveDirection] = useState("North");

  const directions = Object.keys(directionsData);

  // Tab configuration with translation keys
  const tabs = [
    { key: "Directions", label: t('vaastu_tab_directions') },
    { key: "Rooms", label: t('vaastu_tab_rooms') },
    { key: "Do's & Don'ts", label: t('vaastu_tab_dos_donts') },
    { key: "Elements", label: t('vaastu_tab_elements') },
  ];

  // Direction labels mapping
  const directionLabels = {
    North: t('vaastu_direction_north'),
    East: t('vaastu_direction_east'),
    South: t('vaastu_direction_south'),
    West: t('vaastu_direction_west'),
    Northeast: t('vaastu_direction_northeast'),
    Southeast: t('vaastu_direction_southeast'),
    Southwest: t('vaastu_direction_southwest'),
    Northwest: t('vaastu_direction_northwest'),
  };

  // 🔥 Rotation mapping for arrow
  const directionRotation = {
    North: "-50deg",
    Northeast: "-15deg",
    East: "50deg",
    Southeast: "75deg",
    South: "135deg",
    Southwest: "175deg",
    West: "220deg",
    Northwest: "275deg",
  };

  return (
    <ScrollView className="flex-1 bg-white px-4">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Back Arrow + Title in row */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: scaleHeight(60) }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: scaleWidth(12) }}>
          <Image
            source={require("../../../../assets/arrow.png")}
            style={{
              width: scaleWidth(26),
              height: scaleHeight(26),
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: scaleWidth(24),
            fontWeight: "700",
            color: "#111",
          }}
        >
          {t('vaastu_title')}
        </Text>
      </View>

      {/* Subtitle */}
      <Text
        style={{
          marginTop: scaleHeight(4),
          fontSize: scaleWidth(14),
          fontWeight: "500",
          color: "#4c4545a6",
          marginLeft: scaleWidth(36), 
        }}
      >
        {t('vaastu_subtitle')}
      </Text>
       
      {/* Tabs Segmented Control */}
      <View className="flex-row justify-around bg-[#F2F2F2] rounded-full p-1 my-4 mx-6">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full ${activeTab === tab.key ? "bg-[#22C55E]" : ""}`}
          >
            <Text
              className={`text-sm ${activeTab === tab.key ? "text-white font-bold" : "text-gray-600"}`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ===== Compass + Direction Buttons ===== */}
      {activeTab === "Directions" && (
        <>
          {/* Compass + Arrow */}
          <View className="w-full flex justify-center items-center mt-6">
            <View className="w-56 h-56 rounded-full border border-gray-300 justify-center items-center relative">

              {/* 🔄 Rotating Arrow */}
              <View
                className="absolute w-10 h-10 rounded-full justify-center items-center bg-[#6881F1]"
                style={{
                  transform: [{ rotate: directionRotation[activeDirection] }],
                }}
              >
                <Image
                  source={Slidearrow}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </View>
              
              {/* Labels - Using vaastu_compass_* keys for compass display */}
              <Text className="absolute -top-3 text-xs text-green-700 border border-green-700 px-2 rounded-full bg-white">
                {t('vaastu_compass_north')}
              </Text>
              <Text className="absolute right-[-20px] top-1/2 -translate-y-1/2 text-xs text-blue-700 border border-blue-700 px-2 rounded-full bg-white">
                {t('vaastu_compass_east')}
              </Text>
              <Text className="absolute -bottom-3 text-xs text-red-700 border border-red-700 px-2 rounded-full bg-white">
                {t('vaastu_compass_south')}
              </Text>
              <Text className="absolute left-[-20px] top-1/2 -translate-y-1/2 text-xs text-yellow-700 border border-yellow-700 px-2 rounded-full bg-white">
                {t('vaastu_compass_west')}
              </Text>

            </View>
          </View>

          {/* Direction Buttons */}
          <View className="flex-row flex-wrap gap-4 ml-6 mt-8">
            {directions.map((dir) => (
              <TouchableOpacity
                key={dir}
                onPress={() => setActiveDirection(dir)}
                className={`px-1 py-2 rounded-xl w-[42%] mb-4 border ${
                  activeDirection === dir
                    ? "border-green-600 bg-[#22C55E17]"
                    : "border-gray-300 bg-white"
                }`}
              >
                <Text
                  className={`text-center text-base ${
                    activeDirection === dir
                      ? "text-green-700 font-bold"
                      : "text-gray-600"
                  }`}
                >
                  {directionLabels[dir]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* ===== Content for Tabs ===== */}
      <View className="mt-4">
        {activeTab === "Directions" && <DirectionDetails data={directionsData[activeDirection]} />}
        {activeTab === "Rooms" && <Rooms />}
        {activeTab === "Do's & Don'ts" && <Dodont />}
        {activeTab === "Elements" && <Elements />}
      </View>

    </ScrollView>
  );
}