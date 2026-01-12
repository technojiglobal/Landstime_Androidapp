// Landstime_Androidapp/Frontend/components/OwnersDetails.jsx

import React from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function OwnerDetails({
  ownerName,
  setOwnerName,
  phone,
  setPhone,
  email,
  setEmail,
  focusedField,
  setFocusedField,
  phoneError // ✅ Add this prop
}) {
  return (
    <View className="bg-white rounded-lg p-4 mb-4 border border-gray-200 w-full">
      {/* Title */}
      <Text className="text-[16px] font-semibold text-gray-800 mb-4">
        Owner Details <Text className="text-red-500">*</Text>
      </Text>

      {/* Owner Name */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#F3F4F6",
          borderWidth: 2,
          borderColor:
            focusedField === "ownerName" ? "#22C55E" : "#D1D5DB",
          borderRadius: 8,
          paddingHorizontal: 12,
          height: 52,
          marginBottom: 12,
          width: "100%",
        }}
      >
        <Ionicons name="person-outline" size={20} color="#9CA3AF" />
        <TextInput
          value={ownerName}
          onChangeText={setOwnerName}
          placeholder="Owner Name"
          placeholderTextColor="#9CA3AF"
          style={{ flex: 1, marginLeft: 10, color: "#111827" }}
          onFocus={() => setFocusedField("ownerName")}
          onBlur={() => setFocusedField(null)}
        />
      </View>

      {/* Phone - ✅ UPDATED SECTION */}
      <View style={{ marginBottom: 12, width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F3F4F6",
            borderWidth: 2,
            borderColor: phoneError 
              ? "#EF4444" 
              : (focusedField === "phone" ? "#22C55E" : "#D1D5DB"), // ✅ Red border on error
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 52,
          }}
        >
          <Ionicons name="call-outline" size={20} color="#9CA3AF" />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad" // ✅ Changed from phone-pad
            maxLength={10} // ✅ Limit to 10 digits
            style={{ flex: 1, marginLeft: 10, color: "#111827" }}
            onFocus={() => setFocusedField("phone")}
            onBlur={() => setFocusedField(null)}
          />
        </View>
        {/* ✅ Error message display */}
        {phoneError ? (
          <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4, marginLeft: 4 }}>
            {phoneError}
          </Text>
        ) : null}
      </View>

      {/* Email */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#F3F4F6",
          borderWidth: 2,
          borderColor:
            focusedField === "email" ? "#22C55E" : "#D1D5DB",
          borderRadius: 8,
          paddingHorizontal: 12,
          height: 52,
          width: "100%",
        }}
      >
        <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email Address"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ flex: 1, marginLeft: 10, color: "#111827" }}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
        />
      </View>
    </View>
  );
}