import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity,StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import arrow from "../../../../assets/arrow.png";
export default function PaymentHistory() {
  const router = useRouter();

  const payments = [
    {
      id: 1,
      date: "16/10/2025",
      amount: "$199",
      gst: "$168.64 + 30.36 IGST",
      description: "Membership for 1",
      period: "6/10/2025 to 15/10/2025",
      mastercard: ".... .... .... 7917",
      color: "#22C55E",
      bg: "rgba(34, 197, 94, 0.1)",
    },
    {
      id: 2,
      date: "16/10/2025",
      amount: "$199",
      gst: "$168.64 + 30.36 IGST",
      description: "Membership for 1",
      period: "6/10/2025 to 15/10/2025",
      mastercard: ".... .... .... 7917",
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.1)",
    },
  ];

  return (
    <View className="flex-1 bg-white mt-12">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="bg-[#22C55E] flex-row items-center justify-between px-4 py-4">
       <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
                   <Ionicons name="arrow-back" size={24} color="white" />
         
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Payment History</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Gold Plan Banner */}
      <View className="mx-4 mt-4 rounded-xl overflow-hidden">
        <Image
          source={require("../../../../assets/billing.jpg")}
          className="w-full h-56 rounded-xl"
        />

        {/* Overlay */}
        <View className="absolute bottom-4 left-4">
          <Text className="text-white text-xl font-bold">Gold Plan</Text>
          <Text className="text-white text-sm mt-1">
            Your next billing date is 16 November 2025
          </Text>
          <Text className="text-white text-xl font-bold mt-1">$199</Text>
        </View>
      </View>

      {/* Scrollable Cards */}
      <View className="mt-2 ">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-2"
      >
        {payments.map((item) => (
          <View
            key={item.id}
            className="bg-white w-[250px] h-[180px] mx-3 mt-2 border border-gray-200 rounded-xl p-4"
            style={{ elevation: 3 }}
          >
            {/* Date + Amount row */}
            <View className="flex-row justify-between items-center">
              <View
                className="px-2 py-1 rounded-md border"
                style={{
                  borderColor: item.color,
                  backgroundColor: item.bg,
                }}
              >
                <Text
                  className="font-semibold"
                  style={{ color: item.color }}
                >
                  {item.date}
                </Text>
              </View>

              <Text className="text-lg font-bold">{item.amount}</Text>
            </View>

            <Text className="text-xs text-gray-600 mt-3">{item.gst}</Text>
            <Text className="text-xs text-gray-800 mt-2">{item.description}</Text>
            <Text className="text-sm mt-1">{item.period}</Text>

            {/* Mastercard Circles + Number */}
            <View className="flex-row items-center mt-3">
              <View
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: "#EB001B", marginRight: -10 }}
              />
              <View
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: "#F79E1B" }}
              />
              <Text className="text-base font-semibold ml-4">
                {item.mastercard}
              </Text>
            </View>

            {/* View Invoice button */}
            <TouchableOpacity
              onPress={() => router.push("/home/screens/Sidebar/Invoice")}
              className="flex-row justify-center items-center mt-4"
            >
              <Image
                source={require("../../../../assets/Eye.png")}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="ml-2 text-sm text-gray-500">view Invoice</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      </View>
      {/* LANDSTIME LOGO (Now positioned just below cards) */}
       <View className="items-center mt-16">
        <Image
          source={require("../../../../assets/logo.png")}
          className="w-60 h-24 opacity-25"
          resizeMode="contain"
        />
      </View>
    </View>
  );
}