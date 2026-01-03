import React, { useState,useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import { useRouter,useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';


import MorePricingDetailsModal from "../../MorePricingDetailsModal";
 const PillButton = ({ label, selected, onPress }) => (
   <TouchableOpacity
     onPress={onPress}
     style={{
       paddingHorizontal: 14,
       paddingVertical: 6,
       borderRadius: 20,
       borderWidth: 1,
       borderColor: selected ? "#22C55E" : "#E5E7EB",
       backgroundColor: selected ? "#22C55E17" : "#fff",
       marginRight: 8,
       marginBottom: 8,
     }}
   >
     <Text style={{ fontSize: 12, color: selected ? "#22C55E" : "#6B7280" }}>
       {label}
     </Text>
   </TouchableOpacity>
 );
 
 const Checkbox = ({ selected }) => (
   <View
     style={{
       width: 16,
       height: 16,
       borderWidth: 1,
       borderColor: selected ? "#22C55E" : "#D1D5DB",
       backgroundColor: selected ? "#22C55E" : "#fff",
       justifyContent: "center",
       alignItems: "center",
       marginRight: 8,
     }}
   >
     {selected && <Text style={{ color: "#fff", fontSize: 10 }}>✓</Text>}
   </View>
 );
const StorageNext = () => {
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

const [storageDetailsFromPrev, setStorageDetailsFromPrev] = useState(null);

useEffect(() => {
  const parsed = safeParse(params.commercialDetails);
  setStorageDetailsFromPrev(parsed);
}, [params.commercialDetails]);



    /* ---------------- PRICE STATES ---------------- */
    const ownershipOptions = ['Freehold', 'Leasehold', 'Company Owned', 'Other'];
    const [ownership, setOwnership] = useState('');
    const [expectedPrice, setExpectedPrice] = useState("");
    const [allInclusive, setAllInclusive] = useState(false);
    const [priceNegotiable, setPriceNegotiable] = useState(false);
    const [taxExcluded, setTaxExcluded] = useState(false);
    const [IndustryApprovedBy, setIndustryApprovedBy] = useState("");
    const [approvedIndustryType, setApprovedIndustryType] = useState("");
    const authorityOptions = ['Local Authority',];
    /* ---------------- YES / NO STATES ---------------- */
    const [preLeased, setPreLeased] = useState(null);
    const [nocCertified, setNocCertified] = useState(null);
    const [occupancyCertified, setOccupancyCertified] = useState(null);

    /* ---------------- PREVIOUS USE ---------------- */
    const [visible, setVisible] = useState(null);

    const prevUsedForOptions = ["Commercial", "Residential", "Warehouse"];

    /* ---------------- DESCRIPTION ---------------- */
    const [describeProperty, setDescribeProperty] = useState("");
    const [focusedField, setFocusedField] = useState(null);
    const [pricingModalVisible, setPricingModalVisible] = useState(false);

    /* ---------------- AMENITIES ---------------- */
    const amenityOptions = [

        "+Water Storage",
        "+currently Air Conditioned",
        "+Vaastu Complex",
        "+Security fire Alarm",
        "+Visitor Parking",
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

    const handleNext = () => {
  if (!storageDetailsFromPrev) {
    Toast.show({ type: "error", text1: "Storage details missing" });
    return;
  }

  if (!expectedPrice.trim()) {
    Toast.show({ type: "error", text1: "Expected price required" });
    return;
  }

  if (!describeProperty.trim()) {
    Toast.show({ type: "error", text1: "Description required" });
    return;
  }

  const commercialDetails = {
    ...storageDetailsFromPrev,

    expectedPrice: Number(expectedPrice),
    description: describeProperty,

    priceDetails: {
      allInclusive,
      negotiable: priceNegotiable,
      taxExcluded,
    },

    pricingExtras: {
      ownership,
      authority: IndustryApprovedBy,
      approvedIndustryType,

      preLeased,
      leaseDuration,
      monthlyRent: monthlyRent ? Number(monthlyRent) : null,

      amenities,
      locationAdvantages: locAdvantages,
    },
  };

  router.push({
    pathname:
      "/home/screens/UploadScreens/CommercialUpload/Components/StorageVaastu",
    params: {
      commercialDetails: JSON.stringify(commercialDetails),
    },
  });
};



    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
                showsVerticalScrollIndicator={false}

            >
                <View className="flex-row items-center mt-7 mb-4">
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/home/screens/UploadScreens/CommercialUpload/Components/Storage")
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
                {/* ---------- PRICE DETAILS ---------- */}
                <View
                    className="bg-white rounded-lg p-4 mb-4"
                    style={{ borderWidth: 1, borderColor: "#0000001A" }}
                >
                    <Text className="text-[15px] text-[#00000099] font-bold mb-2">Ownership</Text>
                    <View className="flex-row flex-wrap mb-4">
                        {ownershipOptions.map((o) => (
                            <PillButton key={o} label={o} selected={ownership === o} onPress={() => setOwnership(o)} />
                        ))}
                    </View>

                    <Text className="mb-2 text-[15px] font-bold text-[#00000099]">
                        Which authority the property is approved by?
                    </Text>
                    <View className="flex-row flex-wrap mb-4">
                        {authorityOptions.map((auth) => (
                            <PillButton
                                key={auth}
                                label={auth}
                                selected={IndustryApprovedBy === auth}
                                onPress={() => setIndustryApprovedBy(auth)}
                            />
                        ))}
                    </View>
                    <Text className="mb-2 text-[15px] font-bold text-[#00000099]">
                        Approved for industry type
                    </Text>

                    <TextInput
                        placeholder="select Industry Type"
                        value={approvedIndustryType}
                        onChangeText={setApprovedIndustryType}
                        onFocus={() => setFocusedField("industryType")}
                        onBlur={() => setFocusedField(null)}
                        className="rounded-md p-3 mb-3"
                        style={{
                            borderWidth: 1,
                            borderColor: focusedField === "industryType" ? "#22C55E" : "#0000001A",
                            backgroundColor: "#D9D9D91C",
                            height: 50,
                        }}
                    />

                    <Text className="mb-2 text-[15px] font-bold text-[#00000099]">
                        Price Details <Text className="text-red-500">*</Text>
                    </Text>

                    <TextInput
                        placeholder="₹ Expected Price"
                        value={expectedPrice}
                        onChangeText={setExpectedPrice}
                        onFocus={() => setFocusedField("expectedPrice")}
                        onBlur={() => setFocusedField(null)}
                        className="rounded-md p-3 mb-3"
                        style={{
                            borderWidth: 1,
                            borderColor: focusedField === "expectedPrice" ? "#22C55E" : "#0000001A",
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

                    <TouchableOpacity onPress={() => setPricingModalVisible(true)}>
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

                            <TextInput
                                placeholder="Current rent per month"
                                value={leaseDuration}
                                onChangeText={setLeaseDuration}
                                onFocus={() => setFocusedField("leaseDuration")}
                                onBlur={() => setFocusedField(null)}
                                className="rounded-md p-3 mb-3"
                                style={{
                                    borderWidth: 1,
                                    borderColor: focusedField === "leaseDuration" ? "#22C55E" : "#0000001A",
                                    backgroundColor: "#D9D9D91C",
                                    height: 50,
                                }}
                            />

                            {/* Monthly Rent */}

                            <TextInput
                                placeholder=" Lease Tenure in years"
                                value={monthlyRent}
                                onChangeText={setMonthlyRent}
                                onFocus={() => setFocusedField("monthlyRent")}
                                onBlur={() => setFocusedField(null)}
                                keyboardType="numeric"
                                className="rounded-md p-3"
                                style={{
                                    borderWidth: 1,
                                    borderColor: focusedField === "monthlyRent" ? "#22C55E" : "#0000001A",
                                    backgroundColor: "#D9D9D91C",
                                    height: 50,
                                }}
                            />
                        </View>
                    )}


                    {/* ---------- FIRE NOC ---------- */}


                    {/* ---------- OCCUPANCY ---------- */}


                    {/* ---------- PREVIOUS USE ---------- */}

                    {/* ---------- DESCRIPTION ---------- */}
                    <Text className="mt-4 mb-2 font-bold text-[15px] text-[#00000099]">
                        Describe your property <Text className="text-red-500">*</Text>
                    </Text>

                    <TextInput
                        placeholder="Share some details about your property like spacious rooms, well maintained facilities."
                        value={describeProperty}
                        onChangeText={setDescribeProperty}
                        onFocus={() => setFocusedField("describeProperty")}
                        onBlur={() => setFocusedField(null)}
                        multiline
                        textAlignVertical="top"
                        className="rounded-md p-3"
                        style={{
                            borderWidth: 1,
                            borderColor: focusedField === "describeProperty" ? "#22C55E" : "#0000001A",
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
                            onPress={() => router.push("/home/screens/UploadScreens/CommercialUpload/Components/Storage")}
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

                {/* More Pricing Details Modal */}
                <MorePricingDetailsModal
                    visible={pricingModalVisible}
                    onClose={() => setPricingModalVisible(false)}
                />

            </ScrollView>
        </View>
    );
};

export default StorageNext;
