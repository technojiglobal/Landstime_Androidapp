// Landstime_Androidapp/Frontend/app/home/screens/UploadScreens/MorePricingDetailsModal.jsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MorePricingDetailsModal = ({ visible, onClose }) => {
  const [maintenance, setMaintenance] = useState("Monthly");
  const [showMaintenanceDropdown, setShowMaintenanceDropdown] = useState(false);

  const [expectedRental, setExpectedRental] = useState("");
  const [bookingAmount, setBookingAmount] = useState("");
  const [annualDues, setAnnualDues] = useState("");
  const [membershipCharge, setMembershipCharge] = useState("");

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center">

        <View className="bg-white w-[92%] rounded-2xl overflow-hidden">
          

          <ScrollView
            className="px-4 pt-4"
            contentContainerStyle={{ paddingBottom: 90 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
           <View className="flex-row justify-between items-start mb-4">
  {/* Title + Subtitle */}
  <View className="flex-1 pr-3">
    <Text className="text-base font-semibold text-gray-900">
      More Pricing Details
    </Text>

    <Text className="text-xs text-gray-500 mt-1">
      It is recommended to give more details.
    </Text>
  </View>

  {/* Close Icon */}
  <TouchableOpacity onPress={onClose} className="p-1">
    <Ionicons name="close" size={20} color="#111827" />
  </TouchableOpacity>
</View>

            {/* Maintenance Dropdown */}
            <TouchableOpacity
              onPress={() => setShowMaintenanceDropdown(!showMaintenanceDropdown)}
              className="border border-gray-300 rounded-md px-3 py-3 mb-1 flex-row items-center justify-between"
            >
              <Text className="text-gray-700">
                Maintenance
              </Text>

              <View className="flex-row items-center">
                <Text className="text-gray-500 mr-1">
                  {maintenance}
                </Text>
                <Ionicons
                  name={showMaintenanceDropdown ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#6B7280"
                />
              </View>
            </TouchableOpacity>

            {/* Dropdown Options */}
            {showMaintenanceDropdown && (
              <View className="border border-gray-300 rounded-md mb-3 overflow-hidden">
                {["Monthly", "Quarterly", "Yearly"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      setMaintenance(item);
                      setShowMaintenanceDropdown(false);
                    }}
                    className="px-3 py-2 border-b border-gray-200"
                  >
                    <Text className="text-gray-700">{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Expected Rental */}
            <TextInput
              value={expectedRental}
              onChangeText={setExpectedRental}
              placeholder="Expected rental"
              placeholderTextColor="#9CA3AF"
              className="border border-gray-300 rounded-md px-3 py-3 mb-3 text-gray-900"
              keyboardType="numeric"
            />

            {/* Booking Amount */}
            <TextInput
              value={bookingAmount}
              onChangeText={setBookingAmount}
              placeholder="Booking Amount"
              placeholderTextColor="#9CA3AF"
              className="border border-gray-300 rounded-md px-3 py-3 mb-3 text-gray-900"
              keyboardType="numeric"
            />

            {/* Annual dues payable */}
            <TextInput
              value={annualDues}
              onChangeText={setAnnualDues}
              placeholder="Annual dues payable"
              placeholderTextColor="#9CA3AF"
              className="border border-gray-300 rounded-md px-3 py-3 mb-3 text-gray-900"
              keyboardType="numeric"
            />

            {/* Membership charge */}
            <TextInput
              value={membershipCharge}
              onChangeText={setMembershipCharge}
              placeholder="Membership charge"
              placeholderTextColor="#9CA3AF"
              className="border border-gray-300 rounded-md px-3 py-3 mb-3 text-gray-900"
              keyboardType="numeric"
            />
          </ScrollView>

          {/* Submit Button */}
          <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <TouchableOpacity
              onPress={onClose}   // ✅ CLOSE MODAL
              className="bg-[#22C55E] rounded-md py-3 items-center"
            >
              <Text className="text-white font-semibold">
                Submit
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default MorePricingDetailsModal;
