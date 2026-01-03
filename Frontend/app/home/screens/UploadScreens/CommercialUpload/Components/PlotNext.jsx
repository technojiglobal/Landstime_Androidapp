import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter,useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import MorePricingDetailsModal from "../../MorePricingDetailsModal";
/* ---------- UI HELPERS ---------- */
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

/* ---------- MAIN SCREEN ---------- */
export default function PlotNext() {
  const router = useRouter();
  const params = useLocalSearchParams();

const safeParse = (raw) => {
  if (!raw) return null;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch (e) { console.warn('parse error', e); return null; }
  }
  if (Array.isArray(raw)) {
    const first = raw[0];
    if (typeof first === 'string') {
      try { return JSON.parse(first); } catch (e) { console.warn('parse error', e); return null; }
    }
    return first;
  }
  if (typeof raw === 'object') return raw;
  return null;
};

const propertyTitle = params.propertyTitle || "";
const plotDetailsFromPrev = safeParse(params.commercialDetails);
  /* ---------- STATE ---------- */
  const [ownership, setOwnership] = useState("");
  const [authority, setAuthority] = useState("");
  const [industryType, setIndustryType] = useState("");

  const [expectedPrice, setExpectedPrice] = useState("");
  const [allInclusive, setAllInclusive] = useState(false);
  const [negotiable, setNegotiable] = useState(false);
  const [taxExcluded, setTaxExcluded] = useState(false);

   const [preLeased, setPreLeased] = useState(null);
  const [leaseDuration, setLeaseDuration] = useState("");
   const [monthlyRent, setMonthlyRent] = useState("");
  const [description, setDescription] = useState("");

  const [cornerProperty, setCornerProperty] = useState(false);

  const [amenities, setAmenities] = useState([]);
  const [locationAdvantages, setLocationAdvantages] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
 const [isMorePricingModalVisible, setIsMorePricingModalVisible] =
    useState(false);
  /* ---------- OPTIONS ---------- */
  const ownershipOptions = [
    "Freehold",
    "Leasehold",
    "Co-operative Society",
    "Power of Attorney",
  ];

  const amenitiesOptions = [
    "+ Service/Goods Lift",
    "+ Maintenance Staff",
    "+ Water Storage",
    "+ ATM",
    "+ Water Disposal",
    "+ Rainwater Harvesting",
    "+ Security Fire Alarm",
    "+ Near Bank",
    "+ Visitor Parking",
    "+ Security Guard",
    "+ Lift(s)",
  ];

  const locationAdvOptions = [
    "+ Close to Metro Station",
    "+ Close to School",
    "+ Close to Hospital",
    "+ Close to Market",
    "+ Close to Railway Station",
    "+ Close to Airport",
    "+ Close to Mall",
    "+ Close to Highway",
  ];

  const toggleItem = (item, list, setList) => {
    setList(
      list.includes(item)
        ? list.filter(v => v !== item)
        : [...list, item]
    );
  };

  /* ---------------- VALIDATION ---------------- */
  const handleNext = () => {
    if (!expectedPrice.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Expected Price Required',
        text2: 'Please enter the expected price.',
      });
      return;
    }

    if (!description.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Description Required',
        text2: 'Please enter a description.',
      });
      return;
    }
 if (!propertyTitle) {
  Toast.show({
    type: "error",
    text1: "Property title missing",
  });
  return;
}
    Toast.show({
      type: 'success',
      text1: 'Details Saved',
      text2: 'Moving to next step...',
    });

 router.push({
  pathname:
    "/home/screens/UploadScreens/CommercialUpload/Components/PlotVaastu",
  params: {
    commercialDetails: JSON.stringify({
      ...plotDetailsFromPrev,

      // ✅ MUST be at ROOT
      propertyTitle,
      expectedPrice: Number(expectedPrice),
      description,

      // ✅ price flags only
      priceDetails: {
        allInclusive,
        negotiable,
        taxExcluded,
      },

      // ✅ optional extras (custom object)
      pricingExtras: {
        ownership,
        authority,
        industryType,
        preLeased,
        leaseDuration,
        monthlyRent,
        cornerProperty,
        amenities,
        locationAdvantages,
      },
    }),
  },
});


  };

  return (
    <View className="flex-1 bg-white">
      
         {/* HEADER */}
                <View className="flex-row items-center  ml-4 mt-12 mb-4">
                  <TouchableOpacity onPress={() =>  router.push("/home/screens/UploadScreens/CommercialUpload/Components/Plot")}>
                    <Image
                      source={require("../../../../../../assets/arrow.png")}
                      className="w-5 h-5"
                    />
                  </TouchableOpacity>
                  <View className="ml-2">
                    <Text className="text-[16px] font-semibold">Upload Your Property</Text>
                    <Text className="text-[12px] text-[#00000066]">
                      Add your property details
                    </Text>
                  </View>
                </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>


        {/* ================= WHITE CARD ================= */}
        <View className="bg-white border border-gray-200 rounded-xl p-4">

          {/* OWNERSHIP */}
          <Text className="font-semibold mb-2">Ownership</Text>
          <View className="flex-row flex-wrap mb-4">
            {ownershipOptions.map(opt => (
              <PillButton
                key={opt}
                label={opt}
                selected={ownership === opt}
                onPress={() => setOwnership(opt)}
              />
            ))}
          </View>

          {/* AUTHORITY */}
          <Text className="font-semibold mb-2">
            Which authority the property is approved by? (optional)
          </Text>
          <TextInput
            placeholder="Local Authority"
            value={authority}
            onChangeText={setAuthority}
            className="border rounded-lg px-3 py-3 mb-4 text-sm"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "authority" ? "#22C55E" : "#d1d5db",
            }}
            onFocus={() => setFocusedField("authority")}
            onBlur={() => setFocusedField(null)}
          />

          {/* INDUSTRY TYPE */}
          <Text className="font-semibold mb-2">
            Approved for Industry Type (optional)
          </Text>
          <TouchableOpacity className="border border-gray-300 rounded-lg px-3 py-3 flex-row justify-between mb-4">
            <Text className="text-gray-500 text-sm">
              {industryType || "Select Industry Type"}
            </Text>
            
          </TouchableOpacity>

          {/* PRICE */}
          <Text className="font-semibold mb-2">Expected Price Details <Text className="text-red-500">*</Text></Text>
          <TextInput
            placeholder="₹ Expected Price"
            value={expectedPrice}
            onChangeText={setExpectedPrice}
            keyboardType="numeric"
            className="border rounded-lg px-3 py-3 mb-3 text-sm"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "expectedPrice" ? "#22C55E" : "#d1d5db",
            }}
            onFocus={() => setFocusedField("expectedPrice")}
            onBlur={() => setFocusedField(null)}
          />

          <Checkbox
            label="All inclusive price"
            checked={allInclusive}
            onPress={() => setAllInclusive(!allInclusive)}
          />
          <Checkbox
            label="Price negotiable"
            checked={negotiable}
            onPress={() => setNegotiable(!negotiable)}
          />
          <Checkbox
            label="Tax and govt charges excluded"
            checked={taxExcluded}
            onPress={() => setTaxExcluded(!taxExcluded)}
          />
         <TouchableOpacity  onPress={() => setIsMorePricingModalVisible(true)}>
                                <Text className="text-[#22C55E] text-sm mt-2">
                                    + Add more pricing details
                                </Text>
                            </TouchableOpacity>
          {/* PRE-LEASED */}
          <Text className="font-semibold mt-4 mb-2">
            Is it Pre-leased / Pre-rented?
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
                        <>
                          <TextInput
                            placeholder="Lease duration (eg: 5 years)"
                            value={leaseDuration}
                            onChangeText={setLeaseDuration}
                            className="border rounded-xl px-4 py-3 mb-3 text-sm"
                            style={{
                              borderWidth: 2,
                              borderColor: focusedField === "leaseDuration" ? "#22C55E" : "#e5e7eb",
                            }}
                            onFocus={() => setFocusedField("leaseDuration")}
                            onBlur={() => setFocusedField(null)}
                          />
                          <TextInput
                            placeholder="₹ Monthly rent"
                            value={monthlyRent}
                            onChangeText={setMonthlyRent}
                            keyboardType="numeric"
                            className="border rounded-xl px-4 py-3 text-sm"
                            style={{
                              borderWidth: 2,
                              borderColor: focusedField === "monthlyRent" ? "#22C55E" : "#e5e7eb",
                            }}
                            onFocus={() => setFocusedField("monthlyRent")}
                            onBlur={() => setFocusedField(null)}
                          />
                        </>
                      )}
          {/* DESCRIPTION */}
          <Text className="font-semibold mb-2">Description <Text className="text-red-500">*</Text></Text>
          <TextInput
            placeholder="Write here what makes your property unique"
            value={description}
            onChangeText={setDescription}
            multiline
            className="border rounded-lg px-3 py-3 h-24 text-sm mb-4"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "description" ? "#22C55E" : "#d1d5db",
            }}
            onFocus={() => setFocusedField("description")}
            onBlur={() => setFocusedField(null)}
          />

          {/* OTHER FEATURES */}
          <Text className="font-semibold mb-2">Other Features</Text>
          <Checkbox
            label="Corner Property"
            checked={cornerProperty}
            onPress={() => setCornerProperty(!cornerProperty)}
          />

          {/* AMENITIES */}
          <Text className="font-semibold mt-4 mb-2">Amenities</Text>
          <View className="flex-row flex-wrap">
            {amenitiesOptions.map(item => (
              <PillButton
                key={item}
                label={item}
                selected={amenities.includes(item)}
                onPress={() => toggleItem(item, amenities, setAmenities)}
              />
            ))}
          </View>

          {/* LOCATION ADVANTAGES */}
          <Text className="font-semibold mt-4 mb-2">
            Location Advantages
          </Text>
          <View className="flex-row flex-wrap">
            {locationAdvOptions.map(item => (
              <PillButton
                key={item}
                label={item}
                selected={locationAdvantages.includes(item)}
                onPress={() =>
                  toggleItem(item, locationAdvantages, setLocationAdvantages)
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-12">
        <TouchableOpacity
          onPress={() =>  router.push("/home/screens/UploadScreens/CommercialUpload/Components/Plot")}
          className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
        >
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          className="px-5 py-3 rounded-lg bg-green-500 mx-3"
        >
          <Text className="text-white font-semibold">Next</Text>
        </TouchableOpacity>
      </View>
      <MorePricingDetailsModal
        visible={isMorePricingModalVisible}
        onClose={() => setIsMorePricingModalVisible(false)}
      />
    </View>
  );
}
