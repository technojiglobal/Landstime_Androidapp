//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/RetailVaastu.jsx
import React, { useState,useEffect, useMemo } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ ADD THIS
import { View, Text, ScrollView, TouchableOpacity, Image,Alert,ToastAndroid, TextInput } from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import VastuDropdown from "../../VastuDropdown";
import { useRouter, useLocalSearchParams } from "expo-router";
/* ---------------- REUSABLE DROPDOWN ---------------- */

/* ---------------- MAIN SCREEN ---------------- */

export default function VastuDetailsScreen() {
  // ✅ STEP 1: Declare hooks FIRST
  const router = useRouter();
  const params = useLocalSearchParams();

  // ✅ STEP 2: Initialize state with all fields
  const [form, setForm] = useState(() => ({
    shopFacing: "",
    entrance: "",
    cashCounter: "",
    cashLocker: "",
    ownerSeating: "",
    staffSeating: "",
    storage: "",
    displayArea: "",
    electrical: "",
    pantryArea: "",
    staircase: "",
    staircaseInside: "",
  }));

  // ✅ STEP 3: useMemo for parsing images
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

  // ✅ STEP 4: useMemo for parsing commercialDetails
  const commercialDetails = useMemo(() => {
    try {
      console.log('🔍 RetailVaastu params:', {
        hasCommercialDetails: !!params.commercialDetails,
        type: typeof params.commercialDetails,
      });

      if (!params.commercialDetails) {
        console.log('⚠️ No commercialDetails in params');
        return null;
      }

      if (typeof params.commercialDetails === 'object' && !Array.isArray(params.commercialDetails)) {
        console.log('✅ commercialDetails is already an object');
        return params.commercialDetails;
      }

      if (typeof params.commercialDetails === 'string') {
        console.log('✅ Parsing commercialDetails string');
        return JSON.parse(params.commercialDetails);
      }

      if (Array.isArray(params.commercialDetails)) {
        const first = params.commercialDetails[0];
        if (typeof first === 'string') {
          return JSON.parse(first);
        }
        return first;
      }

      return null;
    } catch (e) {
      console.error('❌ Error parsing commercialDetails:', e);
      return null;
    }
  }, [params.commercialDetails]);

  // ✅ STEP 5: Add update function
  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };


  // ✅ STEP 6: useEffect to restore data
useEffect(() => {
  // ✅ PRIORITY 1: Load from AsyncStorage
  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem('draft_retail_vaastu');
      if (draft) {
        const savedForm = JSON.parse(draft);
        console.log('📦 Loading Retail Vaastu draft from AsyncStorage');
        setForm(savedForm);
        return;
      }
    } catch (e) {
      console.log('⚠️ Failed to load Retail Vaastu draft:', e);
    }

    // ✅ FALLBACK: Load from params
    if (commercialDetails?.retailDetails?.vaastuDetails) {
      const vastu = commercialDetails.retailDetails.vaastuDetails;
      console.log('🔄 Restoring Retail Vaastu data from params:', vastu);
      setForm(vastu);
    }
  };

  loadDraft();
}, [commercialDetails]);

// ✅ STEP 7: Auto-save Vaastu draft
useEffect(() => {
  const saveDraft = async () => {
    try {
      await AsyncStorage.setItem('draft_retail_vaastu', JSON.stringify(form));
      console.log('💾 Retail Vaastu draft auto-saved');
    } catch (e) {
      console.log('⚠️ Failed to save Retail Vaastu draft:', e);
    }
  };

  const timer = setTimeout(saveDraft, 1000);
  return () => clearTimeout(timer);
}, [form]);


// ✅ STEP 8: Add handleBack function
const handleBack = () => {
  if (!commercialDetails || !commercialDetails.retailDetails) {
    router.back();
    return;
  }

  // Save Vaastu data with existing retail details
  const updatedCommercialDetails = {
    ...commercialDetails,
    retailDetails: {
      ...commercialDetails.retailDetails,
      vaastuDetails: form,
    },
  };

  router.push({
    pathname: "/home/screens/UploadScreens/CommercialUpload/Components/RetailNext",
    params: {
      retailDetails: JSON.stringify(commercialDetails.retailDetails),
      commercialDetails: JSON.stringify(updatedCommercialDetails),
      images: JSON.stringify(images),
      area: params.area,
      propertyTitle: commercialDetails.retailDetails?.propertyTitle || params.propertyTitle,
      commercialBaseDetails: params.commercialBaseDetails,
    },
  });
};
const handleNext = () => {
  console.log('🔄 handleNext called with:', {
    hasCommercialDetails: !!commercialDetails,
    hasRetailDetails: !!commercialDetails?.retailDetails,
    hasVaastuDetails: !!form,
  });

  if (!commercialDetails || !commercialDetails.retailDetails) {
    Alert.alert(
      "Missing Data",
      "Property details are missing. Please go back and complete all previous steps.",
      [
        {
          text: "Go Back",
          onPress: () => router.back()
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
    return;
  }

  const updatedCommercialDetails = {
    ...commercialDetails,
    retailDetails: {
      ...commercialDetails.retailDetails,
      vaastuDetails: {
        shopFacing: form.shopFacing,
        entrance: form.entrance,
        cashCounter: form.cashCounter,
        cashLocker: form.cashLocker,
        ownerSeating: form.ownerSeating,
        staffSeating: form.staffSeating,
        storage: form.storage,
        displayArea: form.displayArea,
        electrical: form.electrical,
        pantryArea: form.pantryArea,
        staircase: form.staircase,
        staircaseInside: form.staircaseInside,
      },
    },
  };

  router.push({
    pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen",
    params: {
      commercialDetails: JSON.stringify(updatedCommercialDetails),
      images: JSON.stringify(images),
      area: params.area,
      propertyTitle: commercialDetails.retailDetails?.propertyTitle || params.propertyTitle,
      commercialBaseDetails: params.commercialBaseDetails,
      retailDetails: JSON.stringify(commercialDetails.retailDetails),
    },
  });
};


  return (
    <View className="flex-1 bg-white">
      <View className="flex-row  items-center mt-12 mb-2">
       <TouchableOpacity onPress={handleBack}>
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
      <ScrollView className="flex-1 bg-gray-100 px-4 py-2">
        <View className="bg-white rounded-2xl p-4  border border-gray-200">
          <Text className="text-lg font-bold mb-4">Vaasthu Details</Text>

         <VastuDropdown
  label="Shop Facing"
  value={form.shopFacing}
  options={["North", "East", "North-East", "West", "South"]}
  onSelect={(v) => update("shopFacing", v)}
/>

<VastuDropdown
  label="Main Entrance Direction"
  value={form.entrance}
  options={["North", "East", "North-East", "West"]}
  onSelect={(v) => update("entrance", v)}
/>

<VastuDropdown
  label="Cash Counter/Billing Area Direction"
  value={form.cashCounter}
  options={["South-West", "West", "South"]}
  onSelect={(v) => update("cashCounter", v)}
/>

<VastuDropdown
  label="Cash Locker/Safe Opening Direction"
  value={form.cashLocker}
  options={["North", "East", "North-East"]}
  onSelect={(v) => update("cashLocker", v)}
/>

<VastuDropdown
  label="Owner /Manager Seating Direction"
  value={form.ownerSeating}
  options={["North-West", "West"]}
  onSelect={(v) => update("ownerSeating", v)}
/>

<VastuDropdown
  label="Staff Seating Direction"
  value={form.staffSeating}
  options={["North", "East", "North-East"]}
  onSelect={(v) => update("staffSeating", v)}
/>

<VastuDropdown
  label="Storage/Stock Room Direction"
  value={form.storage}
  options={["North", "North-East"]}
  onSelect={(v) => update("storage", v)}
/>

<VastuDropdown
  label="Display/Showcase Direction"
  value={form.displayArea}
  options={["South-East", "North-West"]}
  onSelect={(v) => update("displayArea", v)}
/>

<VastuDropdown
  label="Electrical/Inverter/Generator Direction"
  value={form.electrical}
  options={["South-East", "North-West"]}
  onSelect={(v) => update("electrical", v)}
/>

<VastuDropdown
  label="Pantry/Wash Area Direction(If any)"
  value={form.pantryArea}
  options={["North-West", "West", "South-East"]}
  onSelect={(v) => update("pantryArea", v)}
/>

<VastuDropdown
  label="Staircase / Lift Direction"
  value={form.staircase}
  options={["South", "South-West", "West"]}
  onSelect={(v) => update("staircase", v)}
/>

<VastuDropdown
  label="Staircase/Lift Direction(If inside shop)"
  value={form.staircaseInside}
  options={["South-West", "West"]}
  onSelect={(v) => update("staircaseInside", v)}
/>


        </View>
      </ScrollView>
      <View className="flex-row bg-white rounded-lg p-4  justify-end mt-4 space-x-3 mx-3 mb-12">
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
    </View>
  );
}
