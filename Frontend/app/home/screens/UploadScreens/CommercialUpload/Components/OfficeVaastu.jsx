import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VastuDropdown from "../../VastuDropdown";
import { useRouter,useLocalSearchParams } from "expo-router";
/* ---------------- MAIN SCREEN ---------------- */

export default function VastuDetailsScreen() {
    const [form, setForm] = useState({});
    const router = useRouter();
    const update = (key, value) =>
        setForm((prev) => ({ ...prev, [key]: value }));
    const params = useLocalSearchParams();

const commercialDetails = params.commercialDetails
  ? JSON.parse(params.commercialDetails)
  : null;
 const handleNext = () => {
  if (!commercialDetails) {
    alert("Missing property details. Please restart.");
    return;
  }

  const updatedCommercialDetails = {
    ...commercialDetails,
    officeDetails: {
      ...commercialDetails.officeDetails,
      vaasthuDetails: {
        officeFacing: form.officeFacing,
        entrance: form.entrance,
        cabin: form.cabin,
        workstations: form.workstations,
        conference: form.conference,
        reception: form.reception,
        accounts: form.accounts,
        pantry: form.pantry,
        server: form.server,
        washrooms: form.washrooms,
        staircase: form.staircase,
        storage: form.storage,
        cashLocker: form.cashLocker,
      },
    },
  };

  router.push({
    pathname:
      "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen",
    params: {
      commercialDetails: JSON.stringify(updatedCommercialDetails),
    },
  });
};

    return (
        <View className="flex-1 bg-gray-100">
            <ScrollView className="flex-1 bg-gray-100 px-4 py-6">
                <View className="bg-white rounded-2xl p-4">
                    <Text className="text-lg font-bold mb-4">Vaasthu Details</Text>

                    <VastuDropdown
                        label="Office Facing"
                        value={form.officeFacing}
                        options={["North", "East", "North-East", "West", "South"]}
                        onSelect={(v) => update("officeFacing", v)}
                    />

                    <VastuDropdown
                        label="Main Entrance Direction"
                        value={form.entrance}
                        options={["North", "East", "North-East", "West"]}
                        onSelect={(v) => update("entrance", v)}
                    />

                    <VastuDropdown
                        label="Owner / MD / Manager Cabin Direction"
                        value={form.cabin}
                        options={["South-West", "West", "South"]}
                        onSelect={(v) => update("cabin", v)}
                    />

                    <VastuDropdown
                        label="Workstations / Employee Seating Direction"
                        value={form.workstations}
                        options={["North", "East", "North-East"]}
                        onSelect={(v) => update("workstations", v)}
                    />

                    <VastuDropdown
                        label="Conference / Meeting Room Direction"
                        value={form.conference}
                        options={["North-West", "West"]}
                        onSelect={(v) => update("conference", v)}
                    />

                    <VastuDropdown
                        label="Reception Area Direction"
                        value={form.reception}
                        options={["North", "East", "North-East"]}
                        onSelect={(v) => update("reception", v)}
                    />

                    <VastuDropdown
                        label="Accounts / Finance Department Direction"
                        value={form.accounts}
                        options={["North", "North-East"]}
                        onSelect={(v) => update("accounts", v)}
                    />

                    <VastuDropdown
                        label="Pantry / Cafeteria Direction"
                        value={form.pantry}
                        options={["South-East", "North-West"]}
                        onSelect={(v) => update("pantry", v)}
                    />

                    <VastuDropdown
                        label="Server / IT / Electrical Room Direction"
                        value={form.server}
                        options={["South-East", "North-West"]}
                        onSelect={(v) => update("server", v)}
                    />

                    <VastuDropdown
                        label="Washrooms / Toilets Direction"
                        value={form.washrooms}
                        options={["North-West", "West", "South-East"]}
                        onSelect={(v) => update("washrooms", v)}
                    />

                    <VastuDropdown
                        label="Staircase / Lift Direction"
                        value={form.staircase}
                        options={["South", "South-West", "West"]}
                        onSelect={(v) => update("staircase", v)}
                    />

                    <VastuDropdown
                        label="Storage / Records Room Direction"
                        value={form.storage}
                        options={["South-West", "West"]}
                        onSelect={(v) => update("storage", v)}
                    />

                    <VastuDropdown
                        label="Cash Locker / Safe Direction"
                        value={form.cashLocker}
                        options={["South-West"]}
                        onSelect={(v) => update("cashLocker", v)}
                    />
                </View>

            </ScrollView>
            <View className="flex-row bg-white rounded-lg p-4  justify-end mt-4 space-x-3 mx-3 mb-12">
                <TouchableOpacity
                    className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
                >
                    <Text className="font-semibold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="px-5 py-3 rounded-lg bg-green-500"
                    onPress={handleNext}
                >
                    <Text className="text-white font-semibold">Next</Text>
                </TouchableOpacity>

            </View>
        </View>


    );
}
