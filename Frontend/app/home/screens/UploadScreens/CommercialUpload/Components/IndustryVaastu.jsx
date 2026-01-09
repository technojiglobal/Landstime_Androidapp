

//CommercialUpload//Components//IndustryVaastu.jsx

import React, { useState, useEffect ,useMemo} from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import VastuDropdown from "../../VastuDropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function VastuDetailsScreen() {
  const [form, setForm] = useState({});
  const router = useRouter();
  const params = useLocalSearchParams();

  const safeParse = (raw) => {
  if (!raw) return null;
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
};

// ✅ Use useMemo to prevent infinite re-parsing
const commercialDetailsFromPrev = useMemo(() => {
  return safeParse(params.commercialDetails);
}, [params.commercialDetails]);

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

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ✅ NEW - Load draft from AsyncStorage
useEffect(() => {
  const loadDraft = async () => {
    // ✅ PRIORITY 1: Load from params if coming back from OwnerScreen
    if (commercialDetailsFromPrev?.industryDetails?.vastuDetails) {
      const vastu = commercialDetailsFromPrev.industryDetails.vastuDetails;
      console.log('🔄 Restoring Industry Vaastu from params:', vastu);
      setForm(vastu);
      return;
    }

    // ✅ PRIORITY 2: Load from AsyncStorage draft
    try {
      console.log("📦 Loading Industry Vaastu draft from AsyncStorage");
      const draft = await AsyncStorage.getItem('draft_industry_vaastu');
      if (draft) {
        const parsed = JSON.parse(draft);
        console.log('✅ Industry Vaastu draft loaded from storage:', parsed);
        setForm(parsed);
        return;
      }
    } catch (e) {
      console.log('⚠️ Failed to load Industry Vaastu draft:', e);
    }
  };

  loadDraft();
}, [commercialDetailsFromPrev]); // ✅ ADD commercialDetailsFromPrev as dependency

  // ✅ NEW - Auto-save Vaastu draft
  useEffect(() => {
    const saveDraft = async () => {
      try {
        await AsyncStorage.setItem('draft_industry_vaastu', JSON.stringify(form));
        console.log('💾 Industry Vaastu draft auto-saved');
      } catch (e) {
        console.log('⚠️ Failed to save Industry Vaastu draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [form]);

  const handleNext = () => {
    if (!commercialDetailsFromPrev) return;

    const updatedCommercialDetails = {
      ...commercialDetailsFromPrev,
      industryDetails: {
        ...(commercialDetailsFromPrev.industryDetails || {}),
        vastuDetails: form,
      },
    };

    console.log("➡️ Industry Vastu → Owner payload:", updatedCommercialDetails);

    router.push({
      pathname:
        "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen",
      params: {
        commercialDetails: JSON.stringify(updatedCommercialDetails),
        images: JSON.stringify(images),
        area: params.area,
      },
    });
  };

const handleBack = () => {
  if (!commercialDetailsFromPrev) {
    router.back();
    return;
  }

  // ✅ Save current Vaastu form data before going back
  const updatedCommercialDetails = {
    ...commercialDetailsFromPrev,
    industryDetails: {
      ...(commercialDetailsFromPrev.industryDetails || {}),
      vastuDetails: form, // ✅ Keep current form data
    },
  };

  console.log('🔙 Going back to IndustryNext with Vaastu data:', form);

  router.push({
    pathname: "/home/screens/UploadScreens/CommercialUpload/Components/IndustryNext",
    params: {
      commercialDetails: JSON.stringify(updatedCommercialDetails),
      images: JSON.stringify(images),
      area: params.area,
      commercialBaseDetails: params.commercialBaseDetails, // ✅ ADD THIS
    },
  });
};

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="flex-row items-center ml-4 mt-12 mb-2">
        <TouchableOpacity
          onPress={handleBack}
        >
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
        <View className="bg-white border border-gray-200 rounded-2xl p-4">
          <Text className="text-lg font-bold mb-4">Vastu details</Text>

          <VastuDropdown
            label="Industrial Plot/Building Facing"
            value={form.buildingFacing}
            options={[
              "North",
              "South",
              "East",
              "West",
              "North-East",
              "North-West",
              "South-East",
              "South-West",
            ]}
            onSelect={(v) => update("buildingFacing", v)}
          />

          <VastuDropdown
            label="Main Entrance/Gate Direction"
            value={form.entrance}
            options={[
              "North",
              "South",
              "East",
              "West",
              "North-East",
              "North-West",
              "South-East",
              "South-West",
            ]}
            onSelect={(v) => update("entrance", v)}
          />

          <VastuDropdown
            label="Heavy Machinery Placement Direction"
            value={form.machinery}
            options={[
              "Towards South",
              "Towards West",
              "South-West",
              "North-West",
            ]}
            onSelect={(v) => update("machinery", v)}
          />

          <VastuDropdown
            label="Production/Manufacturing Area Direction"
            value={form.production}
            options={[
              "Balanced open space",
              "North",
              "East",
              "North-East",
            ]}
            onSelect={(v) => update("production", v)}
          />

          <VastuDropdown
            label="Raw Material Storage Direction"
            value={form.rawMaterial}
            options={[
              "Square",
              "South",
              "West",
              "South-West",
            ]}
            onSelect={(v) => update("rawMaterial", v)}
          />

          <VastuDropdown
            label="Finished Goods Storage Direction"
            value={form.finishedGoods}
            options={[
              "North",
              "East",
              "North-East",
            ]}
            onSelect={(v) => update("finishedGoods", v)}
          />

          <VastuDropdown
            label="Office/Administration Area Direction"
            value={form.office}
            options={[
              "Water source in North",
              "North",
              "East",
              "North-East",
            ]}
            onSelect={(v) => update("office", v)}
          />

          <VastuDropdown
            label="Electrical/Generator/Boiler Area Direction"
            value={form.electrical}
            options={[
              "South-East",
              "North-West",
              "West",
            ]}
            onSelect={(v) => update("electrical", v)}
          />

          <VastuDropdown
            label="Water Source/Tank Direction"
            value={form.water}
            options={[
              "North",
              "North-East",
              "East",
              "Equal height on all sides",
            ]}
            onSelect={(v) => update("water", v)}
          />

          <VastuDropdown
            label="Waste/Scrap Area Direction"
            value={form.waste}
            options={[
              "South",
              "West",
              "South-West",
              "No structures",
            ]}
            onSelect={(v) => update("waste", v)}
          />

          <VastuDropdown
            label="Washrooms/Toilets Direction"
            value={form.washroom}
            options={[
              "North-West",
              "West",
              "No structures",
            ]}
            onSelect={(v) => update("washroom", v)}
          />
        </View>
      </ScrollView>

      {/* BOTTOM BUTTONS */}
       <View className="bg-white border-t border-gray-200">
      <View className="flex-row bg-white rounded-lg p-4 justify-end mx-3 mb-12 space-x-3">
        <TouchableOpacity className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
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
    </View>
  );
}