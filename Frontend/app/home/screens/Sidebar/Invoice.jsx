import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function InvoiceScreen({ navigation }) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white mt-12">

      {/* Header */}
      <View className="bg-[#22C55E] flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.push("/home/screens/Sidebar/Billing")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Invoice</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* Invoice Card */}
        <View className="border border-gray-200 rounded-xl p-5 bg-white">

          {/* Invoice Number */}
          <Text className="text-gray-400 text-sm">Invoice No</Text>
          <Text className="text-black font-bold mb-3">
            F4CFC-77EB2-FCGA2-7F983
          </Text>

          {/* Date */}
          <Text className="text-gray-400 text-sm">Date</Text>
          <Text className="text-black font-semibold mb-3">16/10/25</Text>

          {/* Current Plan */}
          <Text className="text-[#22C55E] text-sm font-semibold mb-1 ml-24">
            Current Plan
          </Text>

          {/* Description */}
          <Text className="text-gray-400 text-sm">Description</Text>
          <Text className="text-black font-semibold mb-3">Streaming Services</Text>

          {/* Service Period */}
          <Text className="text-gray-500 text-xs">Service Period</Text>
          <Text className="text-black font-semibold mb-3">
            16/10/25 to 15/11/25
          </Text>

          {/* Amount */}
          <Text className="text-gray-400 text-sm">Amount</Text>
          <Text className="text-black font-bold mb-3">$168.64</Text>

          {/* IGST */}
          <Text className="text-gray-400 text-sm">IGST(18%)</Text>
          <Text className="text-black font-bold mb-3">$38.64</Text>

          {/* Total */}
          <Text className="text-gray-400 text-sm">Total</Text>
          <Text className="text-black font-bold mb-3">$199</Text>

          {/* Summary */}
          <Text className="text-gray-400 text-sm">SUBTOTAL</Text>
          <Text className="text-black font-bold mb-3">$168.64</Text>

          <Text className="text-gray-400 text-sm">TAX TOTAL</Text>
          <Text className="text-black font-bold mb-3">$30.36</Text>

          <Text className="text-gray-400 text-sm">TOTAL</Text>
          <Text className="text-black font-bold text-lg mb-4">$199</Text>

     {/* PAYMENT METHOD */}
<Text className="text-gray-400 text-sm font-semibold mb-1">
  Payment Method
</Text>

{/* FIRST ROW: Credit Card + (circles + dots) */}
<View className="flex-row justify-between items-center">

  {/* LEFT SIDE: Credit Card only */}
  <Text className="text-black text-sm">
    Credit Card
  </Text>

  {/* RIGHT SIDE BLOCK */}
  <View className="flex-row items-center">

    {/* Circles */}
    <View className="flex-row items-center mr-3">
      <View
        className="w-5 h-5 rounded-full"
        style={{ backgroundColor: "#EB001B", marginRight: -10 }}
      />
      <View
        className="w-5 h-5 rounded-full"
        style={{ backgroundColor: "#F79E1B" }}
      />
    </View>

    {/* Dots */}
    <Text className="text-gray-500 text-sm">
      •••• •••• •••• 7917
    </Text>

  </View>
</View>

{/* SECOND ROW (aligned under circles + dots) */}
<View className="flex-row justify-end  mt-1">

  {/* mastercard under circles */}
  <Text className="text-gray-500 text-sm mr-10">
    mastercard
  </Text>

  

</View>





          {/* Payment Date */}
          <Text className="text-gray-400 text-sm mt-3">Payment Date</Text>
          <Text className="text-black font-semibold mb-3">
            10/16/2025, 1:12 AM
          </Text>

          {/* Reference ID */}
          <Text className="text-gray-400 text-sm">Reference ID</Text>
          <Text className="text-black font-semibold mb-3">
            BHM42X90Z03JX
          </Text>

          {/* Place of Supply */}
          <Text className="text-gray-400 text-sm">Place of Supply</Text>
          <Text className="text-black font-semibold mb-3">
            Andhra Pradesh
          </Text>

          {/* HSN Code */}
          <Text className="text-gray-400 text-sm">HSN Code</Text>
          <Text className="text-black font-semibold mb-3">998439</Text>

        </View>
      </ScrollView>
    </View>
  );
}
