import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity,Image } from "react-native";
import { useRouter } from "expo-router";
import VastuDropdown from "../../VastuDropdown";

export default function VastuDetailsScreen() {
  const [form, setForm] = useState({});
  const router = useRouter();

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row  items-center mt-12 mb-2">
                      <TouchableOpacity onPress={() => onPress(() =>  router.push("/home/screens/UploadScreens/CommercialUpload/Components/RetailNext"))} >
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
        <View className="bg-white border-2 border-gray-300 rounded-2xl p-4">
          <Text className="text-lg font-bold mb-4">Vaasthu Details</Text>

          <VastuDropdown
            label="Plot Facing"
            value={form.plotFacing}
            options={["North", "East", "North-East", "West", "South"]}
            onSelect={(v) => update("plotFacing", v)}
          />

          <VastuDropdown
            label="Main Entry / Gate Direction"
            value={form.mainEntry}
            options={["North", "East", "North-East", "West", "South-West"]}
            onSelect={(v) => update("mainEntry", v)}
          />

          <VastuDropdown
            label="Plot Slope Direction"
            value={form.plotSlope}
            options={["Towards North", "Towards East", "Towards North-East"]}
            onSelect={(v) => update("plotSlope", v)}
          />

          <VastuDropdown
            label="Open Space as per Vastu"
            value={form.openSpace}
            options={["Balanced open space", "More in North & East"]}
            onSelect={(v) => update("openSpace", v)}
          />

          <VastuDropdown
            label="Shape"
            value={form.shape}
            options={["Square", "Rectangle"]}
            onSelect={(v) => update("shape", v)}
          />

          <VastuDropdown
            label="Road Position"
            value={form.roadPosition}
            options={["North", "East", "North-East"]}
            onSelect={(v) => update("roadPosition", v)}
          />

          <VastuDropdown
            label="Water Source Location"
            value={form.waterSource}
            options={["Water source in North", "Water source in North-East"]}
            onSelect={(v) => update("waterSource", v)}
          />

          <VastuDropdown
            label="Drainage Direction"
            value={form.drainage}
            options={["North", "North-East", "East"]}
            onSelect={(v) => update("drainage", v)}
          />

          <VastuDropdown
            label="Compound Wall Height"
            value={form.compoundWall}
            options={["Equal height on all sides", "Higher in South & West"]}
            onSelect={(v) => update("compoundWall", v)}
          />

          <VastuDropdown
            label="Existing Structures"
            value={form.structures}
            options={["No structures", "Temporary structures"]}
            onSelect={(v) => update("structures", v)}
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
          onPress={() =>
            router.push(
              "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen"
            )
          }
        >
          <Text className="text-white font-semibold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
