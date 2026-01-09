//Frontend//app//home//screens//UploadScreens//CommericialUpload//Components//PlotVaastu.jsx

import React, { useState,useEffect,useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import VastuDropdown from "../../VastuDropdown";

export default function VastuDetailsScreen() {
  // ✅ STEP 1: Declare router and params FIRST
  const router = useRouter();
  const params = useLocalSearchParams();

  // ✅ STEP 2: Then declare state
  const [form, setForm] = useState({});

  // ✅ STEP 3: Define safeParse BEFORE useMemo
  const safeParse = (raw) => {
    if (!raw) return null;
    if (typeof raw === 'string') {
      try { return JSON.parse(raw); } catch (e) { return null; }
    }
    if (Array.isArray(raw)) {
      const first = raw[0];
      if (typeof first === 'string') {
        try { return JSON.parse(first); } catch (e) { return null; }
      }
      return first;
    }
    if (typeof raw === 'object') return raw;
    return null;
  };

  // ✅ STEP 4: Then useMemo for parsing (using safeParse)
  const commercialDetailsFromPrev = useMemo(() => {
    return safeParse(params.commercialDetails);
  }, [params.commercialDetails]);

  const images = useMemo(() => {
    try {
      if (!params.images) return [];
      if (Array.isArray(params.images)) return params.images;
      return JSON.parse(params.images);
    } catch (e) {
      console.error('Error parsing images:', e);
      return [];
    }
  }, [params.images]);

  const commercialDetails = useMemo(() => {
    try {
      if (!params.commercialDetails) return null;
      if (typeof params.commercialDetails === 'object') return params.commercialDetails;
      return JSON.parse(params.commercialDetails);
    } catch (e) {
      console.error('Error parsing commercialDetails:', e);
      return null;
    }
  }, [params.commercialDetails]);

 const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

// ✅ ADD THIS - Load draft from AsyncStorage
// ✅ Load draft from AsyncStorage
useEffect(() => {
  const loadDraft = async () => {
    // ✅ PRIORITY 1: Load from params if coming back from OwnerScreen
    if (commercialDetailsFromPrev?.vaastuDetails) {
      const vastu = commercialDetailsFromPrev.vaastuDetails;
      console.log('🔄 Restoring Plot Vaastu from params:', vastu);
      setForm(vastu);
      return;
    }

    // ✅ PRIORITY 2: Load from AsyncStorage draft
    try {
      console.log("📦 Loading Plot Vaastu draft from AsyncStorage");
      const draft = await AsyncStorage.getItem('draft_plot_vaastu');
      if (draft) {
        const parsed = JSON.parse(draft);
        console.log('✅ Plot Vaastu draft loaded from storage:', parsed);
        setForm(parsed);
        return;
      }
    } catch (e) {
      console.log('⚠️ Failed to load Plot Vaastu draft:', e);
    }
  };

  loadDraft();
}, [commercialDetailsFromPrev]); // ✅ ADD commercialDetailsFromPrev as dependency

// ✅ ADD THIS - Auto-save Vaastu draft
useEffect(() => {
  const saveDraft = async () => {
    try {
      await AsyncStorage.setItem('draft_plot_vaastu', JSON.stringify(form));
      console.log('💾 Plot Vaastu draft auto-saved');
    } catch (e) {
      console.log('⚠️ Failed to save Plot Vaastu draft:', e);
    }
  };

  const timer = setTimeout(saveDraft, 1000);
  return () => clearTimeout(timer);
}, [form]);


const handleBack = () => {
  if (!commercialDetailsFromPrev) {
    router.back();
    return;
  }

  // ✅ Save current Vaastu form data before going back
  const updatedCommercialDetails = {
    ...commercialDetailsFromPrev,
    vaastuDetails: form, // ✅ Keep current form data
  };

  console.log('🔙 Going back to PlotNext with Vaastu data:', form);

router.push({
  pathname: "/home/screens/UploadScreens/CommercialUpload/Components/PlotNext",
  params: {
    commercialDetails: JSON.stringify(updatedCommercialDetails),
    images: JSON.stringify(images),
    area: params.area,
    propertyTitle: commercialDetails?.propertyTitle || params.propertyTitle,
    plotKind: params.plotKind, // ✅ Keep this one only
  },
});
};

const handleNext = () => {
  if (!commercialDetailsFromPrev) {
    return;
  }

  const updatedCommercialDetails = {
    ...commercialDetailsFromPrev,
    vaastuDetails: form,
  };

  console.log("➡️ Plot Vastu → Owner payload:", updatedCommercialDetails);

router.push({
  pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen",
  params: {
    commercialDetails: JSON.stringify(updatedCommercialDetails),
    images: JSON.stringify(images),
    area: params.area,
    propertyTitle: commercialDetails?.propertyTitle || params.propertyTitle,
    plotKind: params.plotKind, // ✅ ADD THIS
  },
});
    
  };

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="flex-row items-center mt-12 mb-2 ml-4">
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

      <ScrollView className="flex-1 px-4 py-6">
        <View className="bg-white border border-gray-300 rounded-2xl p-4">
          <Text className="text-lg font-bold mb-4">Vastu Details</Text>

          <VastuDropdown label="Plot Facing" value={form.plotFacing}
            options={["North", "East", "North-East", "West", "South"]}
            onSelect={(v) => update("plotFacing", v)}
          />

          <VastuDropdown label="Main Entry / Gate Direction" value={form.mainEntry}
            options={["North", "East", "North-East", "West", "South-West"]}
            onSelect={(v) => update("mainEntry", v)}
          />

          <VastuDropdown label="Plot Slope Direction" value={form.plotSlope}
            options={["Towards North", "Towards East", "Towards North-East"]}
            onSelect={(v) => update("plotSlope", v)}
          />

          <VastuDropdown label="Open Space as per Vastu" value={form.openSpace}
            options={["Balanced open space", "More in North & East"]}
            onSelect={(v) => update("openSpace", v)}
          />

          <VastuDropdown label="Shape" value={form.shape}
            options={["Square", "Rectangle"]}
            onSelect={(v) => update("shape", v)}
          />

          <VastuDropdown label="Road Position" value={form.roadPosition}
            options={["North", "East", "North-East"]}
            onSelect={(v) => update("roadPosition", v)}
          />

          <VastuDropdown label="Water Source Location" value={form.waterSource}
            options={["North", "North-East"]}
            onSelect={(v) => update("waterSource", v)}
          />

          <VastuDropdown label="Drainage Direction" value={form.drainage}
            options={["North", "North-East", "East"]}
            onSelect={(v) => update("drainage", v)}
          />

          <VastuDropdown label="Compound Wall Height" value={form.compoundWall}
            options={["Equal height", "Higher in South & West"]}
            onSelect={(v) => update("compoundWall", v)}
          />

          <VastuDropdown label="Existing Structures" value={form.structures}
            options={["No structures", "Temporary structures"]}
            onSelect={(v) => update("structures", v)}
          />
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View className="flex-row justify-end mx-3 mb-12 space-x-3">
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
