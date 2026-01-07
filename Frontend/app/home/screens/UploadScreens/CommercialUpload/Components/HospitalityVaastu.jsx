//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/HospitalityVaastu.jsx

import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter,useLocalSearchParams } from "expo-router";
import Toast from 'react-native-toast-message';
import VastuDropdown from "../../VastuDropdown";

export default function VastuDetailsScreen() {
  const [form, setForm] = useState({});
  const router = useRouter();
  const params = useLocalSearchParams();

  const images = params.images ? JSON.parse(params.images) : [];

const safeParse = (raw) => {
  if (!raw) return null;
  try {
    if (typeof raw === 'string') return JSON.parse(raw);
    if (Array.isArray(raw)) {
      const first = raw[0];
      if (typeof first === 'string') return JSON.parse(first);
      return first;
    }
    if (typeof raw === 'object') return raw;
  } catch (e) {
    console.warn('Failed to parse commercialDetails param', e);
    return null;
  }
  return null;
};

const commercialDetailsFromPrev = safeParse(params.commercialDetails);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="flex-row items-center ml-4 mt-12 mb-2">
        <TouchableOpacity
          // NEW
onPress={() => router.push({
  pathname: "/home/screens/UploadScreens/CommercialUpload/Components/HospitalityNext",
  params: {
    images: JSON.stringify(images),
    commercialDetails: params.commercialDetails,
  }
})}
        >
          <Image
            source={require("../../../../../../assets/arrow.png")}
            className="w-5 h-5"
          />
        </TouchableOpacity>

        <View className="ml-2">
          <Text className="text-base font-semibold">Upload Your Property</Text>
          <Text className="text-xs text-gray-500">
            Add your property details
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="bg-white border border-gray-200 rounded-2xl p-4">
          <Text className="text-lg font-bold mb-4">Vaasthu Details</Text>

          <VastuDropdown
            label="Building/Property Facing"
            value={form.buildingFacing}
            options={["North-East", "North", "East", "West", "South"]}
            onSelect={(v) => update("buildingFacing", v)}
          />

          <VastuDropdown
            label="Main Entrance Direction"
            value={form.entrance}
            options={["South-West", "North", "East", "West", "South"]}
            onSelect={(v) => update("entrance", v)}
          />

          <VastuDropdown
            label="Reception/Lobby Direction"
            value={form.reception}
            options={["Towards North", "East", "North-East"]}
            onSelect={(v) => update("reception", v)}
          />

          <VastuDropdown
            label="Owner/Manager/Admin Office Direction"
            value={form.adminOffice}
            options={["Balanced open space", "South-West", "West"]}
            onSelect={(v) => update("adminOffice", v)}
          />

          <VastuDropdown
            label="Guest Rooms/Stay Area Direction"
            value={form.guestRooms}
            options={["Square", "South", "West"]}
            onSelect={(v) => update("guestRooms", v)}
          />

          <VastuDropdown
            label="Banquet/Function Hall Direction"
            value={form.banquet}
            options={["North-East", "East", "North"]}
            onSelect={(v) => update("banquet", v)}
          />

          <VastuDropdown
            label="Kitchen/Cooking Area Direction"
            value={form.kitchen}
            options={["Water source in North", "South-East", "North-West"]}
            onSelect={(v) => update("kitchen", v)}
          />

          <VastuDropdown
            label="Dining Area Direction"
            value={form.dining}
            options={["North-East", "East", "North"]}
            onSelect={(v) => update("dining", v)}
          />

          <VastuDropdown
            label="Cash Counter/Billing Desk Direction"
            value={form.cashCounter}
            options={["Equal height on all sides", "North", "East"]}
            onSelect={(v) => update("cashCounter", v)}
          />

          <VastuDropdown
            label="Electrical/Generator/Equipment Area Direction"
            value={form.electrical}
            options={["No structures", "South-East", "North-West"]}
            onSelect={(v) => update("electrical", v)}
          />

          <VastuDropdown
            label="Water Structure/Swimming Pool Direction (If any)"
            value={form.waterStructure}
            options={["No structures", "North", "North-East", "East"]}
            onSelect={(v) => update("waterStructure", v)}
          />

          <VastuDropdown
            label="Washrooms/Toilets Direction"
            value={form.washroom}
            options={["No structures", "North-West", "West"]}
            onSelect={(v) => update("washroom", v)}
          />

          <VastuDropdown
            label="Storage/Housekeeping Area Direction"
            value={form.storage}
            options={["No structures", "South", "West", "South-West"]}
            onSelect={(v) => update("storage", v)}
          />
        </View>
      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View className="bg-white border-t border-gray-200">
        <View className="flex-row bg-white rounded-lg p-4 justify-end mx-3 mb-12 space-x-3">
          <TouchableOpacity
            className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
            onPress={() =>
              router.push(
                "/home/screens/UploadScreens/CommercialUpload/Components/IndustryNext"
              )
            }
          >
            <Text className="font-semibold">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-5 py-3 rounded-lg bg-green-500"
            onPress={() => {
  if (!commercialDetailsFromPrev) return;

const updatedCommercialDetails = {
  ...commercialDetailsFromPrev,
  hospitalityDetails: {
    ...(commercialDetailsFromPrev.hospitalityDetails || {}),
    vastuDetails: form,
  },
};

console.log("➡️ Hospitality → Owner payload:", updatedCommercialDetails);

if (!commercialDetailsFromPrev) {
  Toast.show({ type: 'error', text1: 'Missing details', text2: 'Please complete previous steps before continuing.' });
  return;
}

// NEW
router.push({
  pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen",
  params: {
    commercialDetails: JSON.stringify(updatedCommercialDetails),
    images: JSON.stringify(images),
    area: params.area, // ✅ ADD THIS
  },
});

}}

          >
            <Text className="text-white font-semibold">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
