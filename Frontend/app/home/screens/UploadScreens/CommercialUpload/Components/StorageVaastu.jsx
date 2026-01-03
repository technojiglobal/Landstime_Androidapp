import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity,Image} from "react-native";
import { useRouter,useLocalSearchParams } from "expo-router";
import VastuDropdown from "../../VastuDropdown";

export default function VastuDetailsScreen() {
  const [form, setForm] = useState({});
  const router = useRouter();
 const params = useLocalSearchParams();

const safeParse = (raw) => {
  if (!raw) return null;
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return null; }
  }
  if (Array.isArray(raw)) {
    try { return JSON.parse(raw[0]); } catch { return null; }
  }
  if (typeof raw === "object") return raw;
  return null;
};

const commercialDetailsFromPrev = safeParse(params.commercialDetails);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row  items-center ml-4 mt-12 mb-2">
                      <TouchableOpacity onPress={() =>
  router.push({
    pathname:
      "/home/screens/UploadScreens/CommercialUpload/Components/StorageNext",
    params: {
      commercialDetails: JSON.stringify(commercialDetailsFromPrev),
    },
  })
}

 >
                          <Image
                              source={require("../../../../../../assets/arrow.png")}
                              className="w-5 h-5"
                          />
                      </TouchableOpacity>
      
                      <View className="ml-2">
                          <Text className="text-base font-semibold">
                              Upload Your Property
                          </Text>
                          <Text className="text-xs text-gray-500">
                              Add your property details
                          </Text>
                      </View>
                  </View>
      <ScrollView className="flex-1 px-4 py-6">
        <View className="bg-white border border-gray-200 rounded-2xl p-4">
          <Text className="text-lg font-bold mb-4">Vaasthu Details</Text>

          <VastuDropdown
            label="Storage Building Facing"
            value={form.buildingFacing}
            options={["North", "East", "North-East", "West", "South"]}
            onSelect={(v) => update("buildingFacing", v)}
          />

          <VastuDropdown
            label="Main Entrance / Shutter Direction"
            value={form.entrance}
            options={["North", "East", "North-East", "West", "South-West"]}
            onSelect={(v) => update("entrance", v)}
          />

          <VastuDropdown
            label="Storage Area Direction (Heavy Goods)"
            value={form.storageArea}
            options={["Towards North", "Towards South", "Towards West"]}
            onSelect={(v) => update("storageArea", v)}
          />

          <VastuDropdown
            label="Light Goods / Empty Space Direction"
            value={form.lightGoods}
            options={["Balanced open space", "North", "East"]}
            onSelect={(v) => update("lightGoods", v)}
          />

          <VastuDropdown
            label="Loading / Unloading Area Direction"
            value={form.loading}
            options={["Square", "North", "East", "West"]}
            onSelect={(v) => update("loading", v)}
          />

          <VastuDropdown
            label="Office / Admin Area Direction (If any)"
            value={form.office}
            options={["North", "East", "North-East"]}
            onSelect={(v) => update("office", v)}
          />

          <VastuDropdown
            label="Electrical / Generator / Equipment Direction"
            value={form.electrical}
            options={["Water source in North", "South-East", "North-West"]}
            onSelect={(v) => update("electrical", v)}
          />

          <VastuDropdown
            label="Water Source Direction (If any)"
            value={form.water}
            options={["North", "North-East", "East"]}
            onSelect={(v) => update("water", v)}
          />

          <VastuDropdown
            label="Washroom / Toilet Direction (If any)"
            value={form.washroom}
            options={["Equal height on all sides", "North-West", "West"]}
            onSelect={(v) => update("washroom", v)}
          />

          <VastuDropdown
            label="Height & Level"
            value={form.height}
            options={["No structures", "Higher in South & West"]}
            onSelect={(v) => update("height", v)}
          />
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="flex-row bg-white rounded-lg p-4 justify-end mx-3 mb-12 space-x-3">
        <TouchableOpacity className="px-5 py-3 rounded-lg bg-gray-200 mx-3">
          <Text className="font-semibold">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="px-5 py-3 rounded-lg bg-green-500"
          onPress={() => {
  if (!commercialDetailsFromPrev) return;

  const updatedCommercialDetails = {
    ...commercialDetailsFromPrev,
    storageDetails: {
      ...commercialDetailsFromPrev.storageDetails,
      vastuDetails: form, // ✅ THIS WAS MISSING
    },
  };

  router.push({
    pathname:
      "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen",
    params: {
      commercialDetails: JSON.stringify(updatedCommercialDetails),
    },
  });
}}

        >
          <Text className="text-white font-semibold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
