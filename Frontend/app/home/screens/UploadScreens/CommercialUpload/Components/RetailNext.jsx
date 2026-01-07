//CommericialUpload//Components//RetailNext.jsx

import React, { useState,useEffect,useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import MorePricingDetailsModal from "../../MorePricingDetailsModal";

/* ---------- UI HELPERS ---------- */
const PillButton = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-1.5 rounded-full mr-2 mb-2 border ${
      selected ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"
    }`}
  >
    <Text
      className={`text-xs ${selected ? "text-green-600" : "text-gray-500"}`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const Checkbox = ({ label, checked, onPress }) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center mb-3">
    <View
      className={`w-4 h-4 mr-2 items-center justify-center border ${
        checked ? "border-green-500 bg-green-500" : "border-gray-300 bg-white"
      }`}
    >
      {checked && <Text className="text-white text-[10px]">✓</Text>}
    </View>
    <Text className="text-sm text-gray-600">{label}</Text>
  </TouchableOpacity>
);

export default function RetailNext() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [area, setArea] = useState("");

 // ✅ Use useMemo to prevent infinite re-renders
const images = useMemo(() => {
  try {
    if (!params.images) return [];
    if (Array.isArray(params.images)) return params.images;
    return JSON.parse(params.images);
  } catch (e) {
    console.error('❌ Error parsing images:', e);
    return [];
  }
}, [params.images]);

const commercialDetails = useMemo(() => {
  try {
    if (!params.commercialDetails) return null;
    if (typeof params.commercialDetails === 'object') return params.commercialDetails;
    return JSON.parse(params.commercialDetails);
  } catch (e) {
    console.error('❌ Error parsing commercialDetails:', e);
    return null;
  }
}, [params.commercialDetails]);
const forwardedPropertyTitle = params.propertyTitle ||  (commercialDetails && commercialDetails.propertyTitle);

// ✅ NEW - Add missing baseDetails extraction
const baseDetails = useMemo(() => {
  try {
    if (!params.commercialBaseDetails) return null;
    if (typeof params.commercialBaseDetails === 'object') return params.commercialBaseDetails;
    return JSON.parse(params.commercialBaseDetails);
  } catch (e) {
    console.error('❌ Error parsing commercialBaseDetails:', e);
    return null;
  }
}, [params.commercialBaseDetails]);



  /* ---------- STATE ---------- */
  const [ownership, setOwnership] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [allInclusive, setAllInclusive] = useState(false);
  const [negotiable, setNegotiable] = useState(false);
  const [taxExcluded, setTaxExcluded] = useState(false);

  const [preLeased, setPreLeased] = useState(null);
  const [leaseDuration, setLeaseDuration] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  const [prevUsedFor, setPrevUsedFor] = useState("Commercial");
  const [showPrevUsed, setShowPrevUsed] = useState(false);

  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [locationAdvantages, setLocationAdvantages] = useState([]);

  const [focusedField, setFocusedField] = useState(null);
  const [isMorePricingModalVisible, setIsMorePricingModalVisible] =
    useState(false);

  // ✅ NEW - Add handleBack function (matching OfficeNext pattern)
const handleBack = () => {
  if (!commercialDetails || !commercialDetails.retailDetails) {
    router.back();
    return;
  }

  // Save current state before going back
  const currentData = {
    ...commercialDetails.retailDetails,
    ownership,
    expectedPrice: Number(expectedPrice) || undefined,
    priceDetails: {
      allInclusive,
      negotiable,
      taxExcluded,
    },
    preLeased,
    leaseDuration: leaseDuration || undefined,
    monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
    previouslyUsedFor: prevUsedFor,
    description,
    amenities,
    locationAdvantages,
  };

  router.push({
    pathname: "/home/screens/UploadScreens/CommercialUpload/Components/Retail",
    params: {
      retailDetails: JSON.stringify(currentData),
      images: JSON.stringify(images),
      area: params.area || area,
      commercialBaseDetails: params.commercialBaseDetails,
    },
  });
};


  // ✅ NEW - Load draft from AsyncStorage
useEffect(() => {
  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem('draft_retail_pricing');
      if (draft) {
        const savedData = JSON.parse(draft);
        console.log('📦 Loading Retail pricing draft from AsyncStorage');
        
        setOwnership(savedData.ownership || '');
        setExpectedPrice(savedData.expectedPrice?.toString() || '');
        setAllInclusive(savedData.allInclusive || false);
        setNegotiable(savedData.negotiable || false);
        setTaxExcluded(savedData.taxExcluded || false);
        setPreLeased(savedData.preLeased || null);
        setLeaseDuration(savedData.leaseDuration || '');
        setMonthlyRent(savedData.monthlyRent?.toString() || '');
        setPrevUsedFor(savedData.previouslyUsedFor || 'Commercial');
        setDescription(savedData.description || '');
        setAmenities(savedData.amenities || []);
        setLocationAdvantages(savedData.locationAdvantages || []);
        
        console.log('✅ Retail pricing draft loaded');
        return;
      }
    } catch (e) {
      console.log('⚠️ Failed to load Retail pricing draft:', e);
    }

    // ✅ FALLBACK: Load from params
    if (commercialDetails?.retailDetails) {
      const retail = commercialDetails.retailDetails;
      console.log('🔄 Restoring RetailNext data from params');
      
      setOwnership(retail.ownership || '');
      setExpectedPrice(retail.expectedPrice?.toString() || '');
      setAllInclusive(retail.priceDetails?.allInclusive || false);
      setNegotiable(retail.priceDetails?.negotiable || false);
      setTaxExcluded(retail.priceDetails?.taxExcluded || false);
      setPreLeased(retail.preLeased || null);
      setLeaseDuration(retail.leaseDuration || '');
      setMonthlyRent(retail.monthlyRent?.toString() || '');
      setPrevUsedFor(retail.previouslyUsedFor || 'Commercial');
      setDescription(retail.description || '');
      setAmenities(retail.amenities || []);
      setLocationAdvantages(retail.locationAdvantages || []);
    }
  };

  loadDraft();
}, [commercialDetails]);

// ✅ NEW - Auto-save pricing draft
useEffect(() => {
  const saveDraft = async () => {
    const pricingDraft = {
      ownership,
      expectedPrice,
      allInclusive,
      negotiable,
      taxExcluded,
      preLeased,
      leaseDuration,
      monthlyRent,
      previouslyUsedFor: prevUsedFor,
      description,
      amenities,
      locationAdvantages,
      timestamp: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem('draft_retail_pricing', JSON.stringify(pricingDraft));
      console.log('💾 Retail pricing draft auto-saved');
    } catch (e) {
      console.log('⚠️ Failed to save Retail pricing draft:', e);
    }
  };

  const timer = setTimeout(saveDraft, 1000);
  return () => clearTimeout(timer);
}, [ownership, expectedPrice, allInclusive, negotiable, taxExcluded, 
    preLeased, leaseDuration, monthlyRent, prevUsedFor, description, 
    amenities, locationAdvantages]);


  /* ---------- OPTIONS ---------- */
  const ownershipOptions = [
    "Freehold",
    "Leasehold",
    "Co-operative Society",
    "Power of Attorney",
  ];

  const prevUsedOptions = ["Commercial", "Retail", "Warehouse"];

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

  const toggleItem = (value, list, setList) => {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    );
  };

  /* ---------- VALIDATION (OfficeNext style) ---------- */
 const handleNext = () => {
  if (!commercialDetails) {
    Alert.alert(
      "Missing Data",
      "Retail details are missing. Please go back and complete the previous step.",
      [{ text: "Go Back", onPress: () => router.back() }]
    );
    return;
  }

  if (!expectedPrice) {
    Toast.show({
      type: "error",
      text1: "Expected price is required",
    });
    return;
  }

  if (!description.trim()) {
    Toast.show({
      type: "error",
      text1: "Description is required",
    });
    return;
  }

  // ✅ BUILD COMPLETE commercialDetails OBJECT (matching Office structure)
  const updatedCommercialDetails = {
    subType: "Retail",
    
    retailDetails: {
      ...commercialDetails.retailDetails, // ✅ Preserve all fields from Retail.jsx
      
      // ✅ ADD NEW FIELDS from this screen
      ownership,
      expectedPrice: Number(expectedPrice),
      
      priceDetails: {
        allInclusive,
        negotiable,
        taxExcluded,
      },
      
      preLeased,
      leaseDuration: leaseDuration || undefined,
      monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
      
      previouslyUsedFor: prevUsedFor,
      
      description,
      
      amenities,
      locationAdvantages,
    },

    propertyTitle: commercialDetails.retailDetails?.propertyTitle || 
                   baseDetails?.propertyTitle || 
                   forwardedPropertyTitle,
    area: params.area || area, // ✅ Neighborhood area
  };

  console.log('🔄 Passing to RetailVaastu:', {
    hasCommercialDetails: !!updatedCommercialDetails,
    hasRetailDetails: !!updatedCommercialDetails.retailDetails,
    propertyTitle: updatedCommercialDetails.propertyTitle,
  });

  router.push({
    pathname: "/home/screens/UploadScreens/CommercialUpload/Components/RetailVaastu",
    params: {
      commercialDetails: JSON.stringify(updatedCommercialDetails),
      images: JSON.stringify(images),
      area: params.area || area,
      propertyTitle: updatedCommercialDetails.propertyTitle,
    },
  });
};

  

  return (
    <View className="flex-1 bg-gray-50">
      {/* HEADER */}
      <View className="flex-row items-center mt-6 mb-4">
      <TouchableOpacity 
  onPress={handleBack}
  className="p-2"
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

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        className="px-4"
      >
        <View className="bg-white border border-gray-200 rounded-2xl p-4">
          {/* OWNERSHIP */}
          <Text className="font-semibold mb-2">Ownership</Text>
          <View className="flex-row flex-wrap mb-4">
            {ownershipOptions.map((opt) => (
              <PillButton
                key={opt}
                label={opt}
                selected={ownership === opt}
                onPress={() => setOwnership(opt)}
              />
            ))}
          </View>

          {/* EXPECTED PRICE */}
          <Text className="font-semibold mb-2">
            Expected Price Details <Text className="text-red-500">*</Text>
          </Text>

          <TextInput
            placeholder="₹ Expected Price"
            value={expectedPrice}
            onChangeText={(t) => setExpectedPrice(t.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            onFocus={() => setFocusedField("price")}
            onBlur={() => setFocusedField(null)}
            className="rounded-xl px-4 py-3 mb-3 text-sm"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "price" ? "#86EFAC" : "#E5E7EB",
            }}
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
            label="Tax & govt. charges excluded"
            checked={taxExcluded}
            onPress={() => setTaxExcluded(!taxExcluded)}
          />

          <TouchableOpacity onPress={() => setIsMorePricingModalVisible(true)}>
            <Text className="text-[#22C55E] text-sm mt-2">
              + Add more pricing details
            </Text>
          </TouchableOpacity>

          {/* PRE-LEASED */}
          <Text className="font-semibold mt-4 mb-2">
            Is it Pre-leased / Pre-rented?
          </Text>

          <View className="flex-row mb-2">
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
                onFocus={() => setFocusedField("lease")}
                onBlur={() => setFocusedField(null)}
                className="rounded-xl px-4 py-3 mb-3 text-sm"
                style={{
                  borderWidth: 2,
                  borderColor: focusedField === "lease" ? "#86EFAC" : "#E5E7EB",
                }}
              />
              <TextInput
                placeholder="₹ Monthly rent"
                value={monthlyRent}
                onChangeText={(t) => setMonthlyRent(t.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                onFocus={() => setFocusedField("rent")}
                onBlur={() => setFocusedField(null)}
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  borderWidth: 2,
                  borderColor: focusedField === "rent" ? "#86EFAC" : "#E5E7EB",
                }}
              />
            </>
          )}

          {/* PREVIOUS USE */}
          <Text className="font-semibold mt-4 mb-2">
            Property previously used for (optional)
          </Text>

          <TouchableOpacity
            onPress={() => setShowPrevUsed(!showPrevUsed)}
            className="border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
          >
            <Text className="text-sm">{prevUsedFor}</Text>
            <Ionicons name="chevron-down" size={18} />
          </TouchableOpacity>

          {showPrevUsed &&
            prevUsedOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => {
                  setPrevUsedFor(opt);
                  setShowPrevUsed(false);
                }}
                className="px-4 py-2"
              >
                <Text className="text-sm">{opt}</Text>
              </TouchableOpacity>
            ))}

          {/* DESCRIPTION */}
          <Text className="font-semibold mt-4 mb-2">
            Description <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder="Write here what makes your property unique"
            value={description}
            onChangeText={(t) =>
              setDescription(t.replace(/[^a-zA-Z0-9\s]/g, ""))
            }
            multiline
            onFocus={() => setFocusedField("desc")}
            onBlur={() => setFocusedField(null)}
            className="rounded-xl px-4 py-3 h-28 text-sm"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "desc" ? "#86EFAC" : "#E5E7EB",
            }}
            textAlignVertical="top"
          />

          {/* AMENITIES */}
          <Text className="font-semibold mt-6 mb-3">Amenities</Text>
          <View className="flex-row flex-wrap">
            {amenitiesOptions.map((item) => (
              <PillButton
                key={item}
                label={item}
                selected={amenities.includes(item)}
                onPress={() => toggleItem(item, amenities, setAmenities)}
              />
            ))}
          </View>

          {/* LOCATION ADVANTAGES */}
          <Text className="font-semibold mt-6 mb-3">Location Advantages</Text>
          <View className="flex-row flex-wrap">
            {locationAdvOptions.map((item) => (
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
      <View
        style={{ flexDirection: "row", padding: 16, backgroundColor: "#fff" }}
        className="mb-8 justify-end mt-4 space-x-5 mx-3"
      >
        <TouchableOpacity 
  className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
  onPress={handleBack}
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

      <MorePricingDetailsModal
        visible={isMorePricingModalVisible}
        onClose={() => setIsMorePricingModalVisible(false)}
      />
    </View>
  );
}
