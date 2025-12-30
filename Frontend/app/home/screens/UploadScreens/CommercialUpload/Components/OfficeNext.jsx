import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { PillButton, Checkbox } from "./Office";

const OfficeNext = () => {
    const router = useRouter();

    /* ---------------- PRICE STATES ---------------- */
    const [expectedPrice, setExpectedPrice] = useState("");
    const [allInclusive, setAllInclusive] = useState(false);
    const [priceNegotiable, setPriceNegotiable] = useState(false);
    const [taxExcluded, setTaxExcluded] = useState(false);

    /* ---------------- YES / NO STATES ---------------- */
    const [preLeased, setPreLeased] = useState(null);
    const [nocCertified, setNocCertified] = useState(null);
    const [occupancyCertified, setOccupancyCertified] = useState(null);

    /* ---------------- PREVIOUS USE ---------------- */
    const [visible, setVisible] = useState(null);
    const [prevUsedFor, setPrevUsedFor] = useState("Commercial");
    const prevUsedForOptions = ["Commercial", "Residential", "Warehouse"];

    /* ---------------- DESCRIPTION ---------------- */
    const [describeProperty, setDescribeProperty] = useState("");

    /* ---------------- AMENITIES ---------------- */
    const amenityOptions = [
        "+Maintenance Staff",
        "+Water Storage",
        "+Water Disposal",
        "+ATM",
        "+Shopping Center",
        "+Wheelchair Accessibility",
        "+Cafeteria/Foodcourt",
        "+DG Availability",
        "+CCTV Surveillance",
        "+Grocery shop",
        "+Visitor Parking",
        "+Power Backup",
        "+Lift(s)",
    ];
    const [amenities, setAmenities] = useState([]);

    /* ---------------- LOCATION ADVANTAGES ---------------- */
    const locationAdvantages = [
        "+Close to Metro Station",
        "+Close to School",
        "+Close to Hospital",
        "+Close to Market",
        "+Close to Railway Station",
        "+Close to Airport",
        "+Close to Mall",
        "+Close to Highway",
    ];
    const [locAdvantages, setLocAdvantages] = useState([]);
    const [leaseDuration, setLeaseDuration] = useState("");
    const [monthlyRent, setMonthlyRent] = useState("");

    /* ---------------- HELPERS ---------------- */
    const toggleArrayItem = (setter, array, value) => {
        if (array.includes(value)) {
            setter(array.filter((item) => item !== value));
        } else {
            setter([...array, value]);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
             <View className="flex-row items-center mt-7 mb-4">
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/home/screens/UploadScreens/AddScreen")
                        }
                        className="p-2"
                    >
                        <Image
                            source={require("../../../../../../assets/arrow.png")}
                            style={{ width: 20, height: 20 }}
                        />
                    </TouchableOpacity>

                    <View className="ml-2">
                        <Text className="text-[16px] font-semibold">
                            Upload Your Property
                        </Text>
                        <Text className="text-[12px] text-[#00000066]">
                            Add your property details
                        </Text>
                    </View>
                </View>
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
                showsVerticalScrollIndicator={false}

            >
               
                {/* ---------- PRICE DETAILS ---------- */}
                <View
                    className="bg-white rounded-lg p-4 mb-4"
                    style={{ borderWidth: 1, borderColor: "#0000001A" }}
                >
                    <Text className="mb-2 text-[15px] font-bold text-[#00000099]">
                        Price Details
                    </Text>

                    <TextInput
                        placeholder="₹ Expected Price"
                        value={expectedPrice}
                        onChangeText={setExpectedPrice}
                        className="rounded-md p-3 mb-3"
                        style={{
                            borderWidth: 1,
                            borderColor: "#0000001A",
                            height: 52,
                            backgroundColor: "#D9D9D91C",
                        }}
                        keyboardType="numeric"
                    />

                    <Checkbox
                        label="All inclusive price"
                        selected={allInclusive}
                        onPress={() => setAllInclusive(!allInclusive)}
                    />
                    <Checkbox
                        label="Price Negotiable"
                        selected={priceNegotiable}
                        onPress={() => setPriceNegotiable(!priceNegotiable)}
                    />
                    <Checkbox
                        label="Tax and Govt. charges excluded"
                        selected={taxExcluded}
                        onPress={() => setTaxExcluded(!taxExcluded)}
                    />

                    <TouchableOpacity>
                        <Text className="text-[#22C55E] text-sm mt-2">
                            + Add more pricing details
                        </Text>
                    </TouchableOpacity>

                    {/* ---------- PRE LEASED ---------- */}
                    <Text className="text-[14px] font-bold text-[#00000099] mt-4 mb-2">
                        Is it Pre-leased/Pre-Rented?
                    </Text>
                    <View className="flex-row mb-4">
                        <PillButton
                            label="Yes"
                            selected={preLeased === "Yes"}
                            onPress={() => setPreLeased("Yes")}
                        />
                        <PillButton
                            label="No"
                            selected={preLeased === "No"}
                            onPress={() => setPreLeased("No")}
                        />
                    </View>
                    {preLeased === "Yes" && (
                        <View className="mb-4">
                            {/* Lease Duration */}
                            <Text className="text-[13px] font-semibold text-[#00000099] mb-1">
                                Lease Duration
                            </Text>
                            <TextInput
                                placeholder="Eg: 3 Years"
                                value={leaseDuration}
                                onChangeText={setLeaseDuration}
                                className="rounded-md p-3 mb-3"
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#0000001A",
                                    backgroundColor: "#D9D9D91C",
                                    height: 50,
                                }}
                            />

                            {/* Monthly Rent */}
                            <Text className="text-[13px] font-semibold text-[#00000099] mb-1">
                                Monthly Rent
                            </Text>
                            <TextInput
                                placeholder="₹ Monthly Rent"
                                value={monthlyRent}
                                onChangeText={setMonthlyRent}
                                keyboardType="numeric"
                                className="rounded-md p-3"
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#0000001A",
                                    backgroundColor: "#D9D9D91C",
                                    height: 50,
                                }}
                            />
                        </View>
                    )}


                    {/* ---------- FIRE NOC ---------- */}
                    <Text className="text-[14px] font-bold text-[#00000099] mb-2">
                        Is your office fire NOC Certified?
                    </Text>
                    <View className="flex-row mb-4">
                        <PillButton
                            label="Yes"
                            selected={nocCertified === "Yes"}
                            onPress={() => setNocCertified("Yes")}
                        />
                        <PillButton
                            label="No"
                            selected={nocCertified === "No"}
                            onPress={() => setNocCertified("No")}
                        />
                    </View>

                    {/* ---------- OCCUPANCY ---------- */}
                    <Text className="text-[14px] font-bold text-[#00000099] mb-2">
                        Is it Occupancy Certified?
                    </Text>
                    <View className="flex-row mb-4">
                        <PillButton
                            label="Yes"
                            selected={occupancyCertified === "Yes"}
                            onPress={() => setOccupancyCertified("Yes")}
                        />
                        <PillButton
                            label="No"
                            selected={occupancyCertified === "No"}
                            onPress={() => setOccupancyCertified("No")}
                        />
                    </View>

                    {/* ---------- PREVIOUS USE ---------- */}
                    <Text className="text-[14px] font-bold text-[#00000099] mb-2">
                        Office previously used for (optional)
                    </Text>

                    <TouchableOpacity
                        onPress={() =>
                            setVisible(visible === "prevUsedFor" ? null : "prevUsedFor")
                        }
                        className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
                    >
                        <Text>{prevUsedFor}</Text>
                        <Ionicons name="chevron-down" size={22} color="#888" />
                    </TouchableOpacity>

                    {visible === "prevUsedFor" && (
                        <View
                            className="bg-white rounded-lg shadow-lg -mt-3 mb-4"
                            style={{ borderWidth: 1, borderColor: "#0000001A" }}
                        >
                            {prevUsedForOptions.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    onPress={() => {
                                        setPrevUsedFor(item);
                                        setVisible(null);
                                    }}
                                    className={`p-4 border-b ${prevUsedFor === item ? "bg-green-500" : "bg-white"
                                        }`}
                                >
                                    <Text
                                        className={
                                            prevUsedFor === item ? "text-white" : "text-gray-800"
                                        }
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* ---------- DESCRIPTION ---------- */}
                    <Text className="mt-4 mb-2 font-bold text-[15px] text-[#00000099]">
                        Describe your property
                    </Text>

                    <TextInput
                        placeholder="Share some details about your property like spacious rooms, well maintained facilities."
                        value={describeProperty}
                        onChangeText={setDescribeProperty}
                        multiline
                        textAlignVertical="top"
                        className="rounded-md p-3"
                        style={{
                            borderWidth: 1,
                            borderColor: "#0000001A",
                            height: 108,
                        }}
                    />

                    {/* ---------- AMENITIES & LOCATION ---------- */}
                    <View
                        className="bg-white rounded-lg p-4 mt-4"
                        style={{ borderWidth: 1, borderColor: "#0000001A" }}
                    >
                        <Text className="text-[15px] font-bold text-[#00000099] mb-2">
                            Amenities
                        </Text>
                        <View className="flex-row flex-wrap mb-4">
                            {amenityOptions.map((a) => (
                                <PillButton
                                    key={a}
                                    label={a}
                                    selected={amenities.includes(a)}
                                    onPress={() =>
                                        toggleArrayItem(setAmenities, amenities, a)
                                    }
                                />
                            ))}
                        </View>

                        <Text className="text-[15px] font-bold text-[#00000099] mb-3">
                            Location Advantages
                        </Text>
                        <View className="flex-row flex-wrap">
                            {locationAdvantages.map((a) => (
                                <PillButton
                                    key={a}
                                    label={a}
                                    selected={locAdvantages.includes(a)}
                                    onPress={() =>
                                        toggleArrayItem(setLocAdvantages, locAdvantages, a)
                                    }
                                />
                            ))}
                        </View>
                    </View>
                    <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-3">
                                <TouchableOpacity
                                  className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
                                >
                                  <Text className="font-semibold">Cancel</Text>
                                </TouchableOpacity>
                    
                                <TouchableOpacity
                                  className="px-5 py-3 rounded-lg bg-green-500"
                                  onPress={() => router.push("/home/screens/UploadScreens/CommercialUpload/Components/OfficeVaastu")}
                                >
                                  <Text className="text-white font-semibold">Next</Text>
                                </TouchableOpacity>
                    
                              </View>
                    
                </View>
            </ScrollView>
        </View>
    );
};

export default OfficeNext;
