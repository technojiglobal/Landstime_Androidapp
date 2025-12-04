//Flats//(Property)//index.jsx
import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import TopAlert from "../../../../../components/TopAlert";
import VastuModal from "../../../../../components/VastuModal";

export default function OverviewScreen() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [showVastuModal, setShowVastuModal] = useState(false);

  const handleBrochurePress = () => setShowAlert(true);

  return (
    <View className="flex-1 bg-white relative">
     {(showAlert) && (
             <View
               className="absolute inset-0 bg-black/40"
               style={{ zIndex: 10 }}
               pointerEvents={"auto"}
             />
           )}
           {( showVastuModal) && (
             <View
               className="absolute inset-0 bg-black/40"
               //style={{ zIndex: 10 }}
               pointerEvents={"auto"}
             />
           )}

      <ScrollView
        className="flex-1 bg-white"
        scrollEnabled={!showAlert && !showVastuModal}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 90,
        }}
      >
        {/* Commercial Image */}
        <View className="items-center  relative">
          <View className="relative">
            <Image
              source={require("../../../../../../assets/CommercialHub.jpg")}
              className="rounded-[17px]"
              style={{ height: 223, width: 330, resizeMode: "cover" }}
            />
            <View
              className="absolute bg-white rounded-full p-1"
              style={{
                bottom: 10,
                right: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.5,
                elevation: 2,
              }}
            >
              <Image
                source={require("../../../../../../assets/tick-icon.png")}
                style={{ width: 13, height: 13, resizeMode: "contain" }}
              />
            </View>
          </View>
        </View>

        {/* Property Info */}
        <View className="px-5 mt-5">
          {/* Name + Location + Rating */}
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-[20px] text-green-500 font-semibold" style={{ fontFamily: "Poppins",fontWeight:"bold" }}>
                Green Valley Commercial Hub
              </Text>
              <View className="flex-row items-center mt-1">
                <Image
                  source={require("../../../../../../assets/location-icon.png")}
                  style={{ width: 12, height: 12, resizeMode: "contain" }}
                />
                <Text className="text-[12px] text-[#72707090] ml-1" style={{ fontFamily: "Poppins" }}>
                  Visakhapatnam
                </Text>
              </View>
            </View>

            <View className="items-end">
              <View className="flex-row items-center mb-1">
                <Ionicons name="star" size={14} color="#FF9500" />
                <Text className="text-[12px] ml-1 text-[#9CA3AF]" style={{ fontFamily: "Poppins" }}>
                  4.3
                </Text>
              </View>

              
            </View>
          </View>

          {/* Price + Vaastu */}
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-[24px] font-semibold text-[#22C55E]" style={{ fontFamily: "Poppins" }}>
              ₹ 85,00,000
            </Text>

            <TouchableOpacity
              onPress={() => setShowVastuModal(true)}
              className="flex-row items-center px-2 py-[2px] rounded-md"
              style={{ borderWidth: 0.5, borderColor: "#FFA50066" }}
            >
              <Image
                source={require("../../../../../../assets/vastu.png")}
                style={{ width: 12, height: 12, resizeMode: "contain" }}
              />
              <Text className="ml-1 text-[12px] font-bold text-[#FFA500]" style={{ fontFamily: "Poppins" }}>
                View Vaastu
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="flex-row justify-between mt-5">
            {[
              { label: "Acres", value: "2.5" },
              { label: "Rooms", value: "15" },
              { label: "Buildings", value: "3" },
              { label: "Built", value: "2018" },
            ].map((item, idx) => (
              <View key={idx} className="items-center">
                <Text className="text-[14px] font-semibold" style={{ fontFamily: "Poppins" }}>
                  {item.value}
                </Text>
                <Text className="text-[12px] text-[#00000091]" style={{ fontFamily: "Poppins" }}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <View className="mt-6">
            <Text className="text-[20px] font-semibold mb-1" style={{ fontFamily: "Poppins" }}>
              Description
            </Text>
            <Text className="text-[14px] text-[#00000091]" style={{ fontFamily: "Poppins" }}>
              Prime commercial plot strategically located on themain highway with excellent visibility and accessibility. Perfect for retail outlets,showrooms,offices,or mixed-use development.RERA approvedwith clear titles and ready for immediate development.
            </Text>
          </View>

          {/* Buttons */}
          <View className="flex-row justify-between mt-8 mb-10">
            <TouchableOpacity
              onPress={handleBrochurePress}
              className="flex-1 border border-[#22C55E] py-3 rounded-[12px] mr-3 items-center flex-row justify-center"
              activeOpacity={0.8}
            >
              <Text className="text-[#22C55E] text-[14px]" style={{ fontFamily: "Poppins" }}>
                Brochure
              </Text>
              <Feather name="download" size={16} color="#22C55E" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-[#22C55E] py-3 rounded-[12px] items-center justify-center"
              activeOpacity={0.8}
              onPress={() => router.push("/home/screens/ContactForm")}
            >
              <Text className="text-white text-[14px]" style={{ fontFamily: "Poppins" }}>
                Contact Agent
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Alerts / Modals */}
      <TopAlert visible={showAlert} onHide={() => setShowAlert(false)} />
      <VastuModal visible={showVastuModal} onClose={() => setShowVastuModal(false)} />
    </View>
  );
}
