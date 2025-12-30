import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VastuDropdown from "../../VastuDropdown";
import { useRouter } from "expo-router";
/* ---------------- REUSABLE DROPDOWN ---------------- */


/* ---------------- MAIN SCREEN ---------------- */

export default function VastuDetailsScreen() {
    const [form, setForm] = useState({});
    const router = useRouter();
    const update = (key, value) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    return (
        <View className="flex-1 bg-gray-100">
            <ScrollView className="flex-1 bg-gray-100 px-4 py-6">
                <View className="bg-white rounded-2xl p-4">
                    <Text className="text-lg font-bold mb-4">Vaasthu Details</Text>

                    <VastuDropdown
                        label="Shop Facing"
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
                        label="Cash Counter/Billing Area Direction"
                        value={form.cabin}
                        options={["South-West", "West", "South"]}
                        onSelect={(v) => update("cabin", v)}
                    />

                    <VastuDropdown
                        label="Cash Locker/Safe Opening Direction"
                        value={form.workstations}
                        options={["North", "East", "North-East"]}
                        onSelect={(v) => update("workstations", v)}
                    />

                    <VastuDropdown
                        label="Owner /Manager Seating Direction"
                        value={form.conference}
                        options={["North-West", "West"]}
                        onSelect={(v) => update("conference", v)}
                    />

                    <VastuDropdown
                        label="Staff Seating Direction"
                        value={form.reception}
                        options={["North", "East", "North-East"]}
                        onSelect={(v) => update("reception", v)}
                    />

                    <VastuDropdown
                        label="Storage/Stock Room Direction"
                        value={form.accounts}
                        options={["North", "North-East"]}
                        onSelect={(v) => update("accounts", v)}
                    />

                    <VastuDropdown
                        label="Display/Showcase Direction"
                        value={form.pantry}
                        options={["South-East", "North-West"]}
                        onSelect={(v) => update("pantry", v)}
                    />

                    <VastuDropdown
                        label="Electrical/Inverter/Generator Direction"
                        value={form.server}
                        options={["South-East", "North-West"]}
                        onSelect={(v) => update("server", v)}
                    />

                    <VastuDropdown
                        label="Pantry/Wash Area Direction(If any)"
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
                        label="Staircase/Lift Direction(If inside shop)"
                        value={form.storage}
                        options={["South-West", "West"]}
                        onSelect={(v) => update("storage", v)}
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
                    onPress={() => router.push("/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen")}
                >
                    <Text className="text-white font-semibold">Next</Text>
                </TouchableOpacity>

            </View>
        </View>


    );
}
