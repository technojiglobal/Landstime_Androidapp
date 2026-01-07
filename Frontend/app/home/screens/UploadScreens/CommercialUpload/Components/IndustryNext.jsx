//Frontend//app//home//screens//UploadScreens//CommericalUpload//IndustryNext.jsx

import React, { useState } from "react";
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
    className={`px-3 py-1 rounded-full mr-2 mb-2 border ${
      selected
        ? "border-green-500 bg-green-50"
        : "border-gray-300 bg-white"
    }`}
  >
    <Text
      className={`text-xs ${
        selected ? "text-green-600" : "text-gray-600"
      }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const Checkbox = ({ label, checked, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center mb-2"
  >
    <View
      className={`w-4 h-4 mr-2 border items-center justify-center ${
        checked ? "bg-green-500 border-green-500" : "border-gray-300"
      }`}
    >
      {checked && <Text className="text-white text-[10px]">✓</Text>}
    </View>
    <Text className="text-sm text-gray-600">{label}</Text>
  </TouchableOpacity>
);
const IndustryNext = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    const images = params.images ? JSON.parse(params.images) : [];

const safeParse = (raw) => {
  if (!raw) return null;
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
};

const commercialDetailsFromPrev = safeParse(params.commercialDetails);

    /* ---------------- PRICE STATES ---------------- */
    const ownershipOptions = ['Freehold', 'Leasehold', 'Company Owned', 'Other'];
    const [ownership, setOwnership] = useState('');
    const [expectedPrice, setExpectedPrice] = useState("");
    const [allInclusive, setAllInclusive] = useState(false);
    const [priceNegotiable, setPriceNegotiable] = useState(false);
    const [taxExcluded, setTaxExcluded] = useState(false);
    const [IndustryApprovedBy, setIndustryApprovedBy] = useState("");
    const [approvedIndustryType, setApprovedIndustryType] = useState("");
    const authorityOptions = ['Local Authority'];
    /* ---------------- YES / NO STATES ---------------- */
    const [preLeased, setPreLeased] = useState(null);
    const [nocCertified, setNocCertified] = useState(null);
    const [occupancyCertified, setOccupancyCertified] = useState(null);

    /* ---------------- PREVIOUS USE ---------------- */
    const [visible, setVisible] = useState(null);

    const prevUsedForOptions = ["Commercial", "Residential", "Warehouse"];

    /* ---------------- DESCRIPTION ---------------- */
    const [describeProperty, setDescribeProperty] = useState("");
    const [wheelchairFriendly, setWheelchairFriendly] = useState(false);
    const [amenities, setAmenities] = useState([]);
    const [locAdvantages, setLocAdvantages] = useState([]);

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
  if (!expectedPrice.trim()) {
    Toast.show({
      type: "error",
      text1: "Price Required",
      text2: "Please enter expected price",
    });
    return;
  }

  if (!describeProperty.trim()) {
    Toast.show({
      type: "error",
      text1: "Description Required",
      text2: "Please describe your property",
    });
    return;
  }

 if (!commercialDetailsFromPrev) {
  Toast.show({
    type: "error",
    text1: "Something went wrong",
    text2: "Please go back and try again",
  });
  return;
}

  const industryPricingDetails = {
  ownership,
  expectedPrice: Number(expectedPrice),
  priceDetails: {
    allInclusive,
    negotiable: priceNegotiable,
    taxExcluded,
  },
  approvedBy: IndustryApprovedBy,
  approvedIndustryType,
  preLeased,
  leaseDuration: preLeased === "Yes" ? leaseDuration : null,
  monthlyRent: preLeased === "Yes" ? Number(monthlyRent) : null,
  amenities,
  locationAdvantages: locAdvantages,
  wheelchairFriendly,
};

  const updatedCommercialDetails = {
    ...commercialDetailsFromPrev,
   industryDetails: {
  ...(commercialDetailsFromPrev.industryDetails || {}),
  pricing: industryPricingDetails,
},

  };

  // NEW
router.push({
  pathname: "/home/screens/UploadScreens/CommercialUpload/Components/IndustryVaastu",
  params: {
    commercialDetails: JSON.stringify(updatedCommercialDetails),
    images: JSON.stringify(images), // ✅ ADD THIS
  },
});

};


    return (
        <View className="flex-1 bg-white">
            <View className="flex-row items-center mt-7 mt-4 mb-3 ml-4">
                    <TouchableOpacity
                        // NEW
onPress={() => router.push({
  pathname: "/home/screens/UploadScreens/CommercialUpload/Components/Industry",
  params: {
    images: JSON.stringify(images),
    commercialDetails: params.commercialDetails,
  }
})}
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
                        Expected Price Details <Text className="text-red-500">*</Text>
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
                        label="DG & UPS Price included"
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
                        Description <Text className="text-red-500">*</Text>
                    </Text>

                    <TextInput
                        placeholder="write here what makes your property unique."
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
                            Other Features
                        </Text>
                        <Checkbox
                        label="Wheelchair Friendly"
                        selected={wheelchairFriendly}
                        onPress={() => setWheelchairFriendly(!wheelchairFriendly)}
                    />

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

                </View>

                {/* More Pricing Details Modal */}
                <MorePricingDetailsModal
                    visible={pricingModalVisible}
                    onClose={() => setPricingModalVisible(false)}
                />

            </ScrollView>
            <View className="bg-white border-t border-gray-200">
            <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-12">
                <TouchableOpacity
                    className="px-10 py-3 rounded-lg bg-gray-200 mx-3"
                    onPress={() => router.back()}
                >
                    <Text className="font-semibold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="px-8 py-3 rounded-lg bg-green-500"
                    onPress={handleNext}
                >
                    <Text className="text-white font-semibold">Next</Text>
                </TouchableOpacity>

            </View>
            </View>
        </View>
    );
};

export default IndustryNext;
