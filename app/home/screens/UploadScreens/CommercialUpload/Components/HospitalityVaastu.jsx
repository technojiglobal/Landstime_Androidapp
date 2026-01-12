//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/HospitalityVaastu.jsx

import React, { useState, useEffect, useMemo } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from 'react-native-toast-message';
import VastuDropdown from "../../VastuDropdown";

export default function VastuDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [form, setForm] = useState({});

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
      console.log('🔍 HospitalityVaastu params:', {
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

  // Load draft from AsyncStorage
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await AsyncStorage.getItem('draft_hospitality_vaastu');
        if (draft) {
          const savedForm = JSON.parse(draft);
          console.log('📦 Loading Hospitality Vaastu draft from AsyncStorage');
          setForm(savedForm);
          return;
        }
      } catch (e) {
        console.log('⚠️ Failed to load Vaastu draft:', e);
      }

      // FALLBACK: Load from params
      if (commercialDetails?.hospitalityDetails?.vastuDetails) {
        const vastu = commercialDetails.hospitalityDetails.vastuDetails;
        console.log('🔄 Restoring Vaastu data from params:', vastu);
        setForm(vastu);
      }
    };

    loadDraft();
  }, [commercialDetails]);

  // Auto-save Vaastu draft
  useEffect(() => {
    const saveDraft = async () => {
      try {
        await AsyncStorage.setItem('draft_hospitality_vaastu', JSON.stringify(form));
        console.log('💾 Hospitality Vaastu draft auto-saved');
      } catch (e) {
        console.log('⚠️ Failed to save Vaastu draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [form]);

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleBack = () => {
    if (!commercialDetails || !commercialDetails.hospitalityDetails) {
      router.back();
      return;
    }

    const updatedCommercialDetails = {
      ...commercialDetails,
      hospitalityDetails: {
        ...commercialDetails.hospitalityDetails,
        vastuDetails: form,
      },
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/HospitalityNext",
      params: {
        hospitalityDetails: JSON.stringify(commercialDetails.hospitalityDetails),
        commercialDetails: JSON.stringify(updatedCommercialDetails),
        images: JSON.stringify(images),
        area: params.area,
        propertyTitle: commercialDetails.hospitalityDetails?.propertyTitle || params.propertyTitle,
        commercialBaseDetails: params.commercialBaseDetails,
      },
    });
  };

  const handleNext = () => {
    console.log('🔄 handleNext called with:', {
      hasCommercialDetails: !!commercialDetails,
      hasHospitalityDetails: !!commercialDetails?.hospitalityDetails,
      hasVastuDetails: !!form,
    });

    if (!commercialDetails || !commercialDetails.hospitalityDetails) {
      Toast.show({
        type: 'error',
        text1: 'Missing Data',
        text2: 'Property details are missing. Please go back and complete all previous steps.',
      });
      return;
    }

    const updatedCommercialDetails = {
      ...commercialDetails,
      hospitalityDetails: {
        ...commercialDetails.hospitalityDetails,
        vastuDetails: form,
      },
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen",
      params: {
        commercialDetails: JSON.stringify(updatedCommercialDetails),
        images: JSON.stringify(images),
        area: params.area,
        propertyTitle: commercialDetails.hospitalityDetails?.propertyTitle || params.propertyTitle,
        commercialBaseDetails: params.commercialBaseDetails,
        hospitalityDetails: JSON.stringify(commercialDetails.hospitalityDetails),
      },
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="flex-row items-center ml-4 mt-12 mb-2">
        <TouchableOpacity onPress={handleBack} className="p-2">
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
        <View className="bg-white border border-gray-200 rounded-2xl p-4">
          <Text className="text-lg font-bold mb-4">Vaasthu Details</Text>

          <VastuDropdown
            label="Building/Property Facing"
            value={form.buildingFacing}
            options={["North-East", "North", "East", "West", "South"]}
            onSelect={(v) => update("buildingFacing", v)}
          />

          <VastuDropdown
            label="Main Entrance Direction"
            value={form.entrance}
            options={["South-West", "North", "East", "West", "South"]}
            onSelect={(v) => update("entrance", v)}
          />

          <VastuDropdown
            label="Reception/Lobby Direction"
            value={form.reception}
            options={["Towards North", "East", "North-East"]}
            onSelect={(v) => update("reception", v)}
          />

          <VastuDropdown
            label="Owner/Manager/Admin Office Direction"
            value={form.adminOffice}
            options={["Balanced open space", "South-West", "West"]}
            onSelect={(v) => update("adminOffice", v)}
          />

          <VastuDropdown
            label="Guest Rooms/Stay Area Direction"
            value={form.guestRooms}
            options={["Square", "South", "West"]}
            onSelect={(v) => update("guestRooms", v)}
          />

          <VastuDropdown
            label="Banquet/Function Hall Direction"
            value={form.banquet}
            options={["North-East", "East", "North"]}
            onSelect={(v) => update("banquet", v)}
          />

          <VastuDropdown
            label="Kitchen/Cooking Area Direction"
            value={form.kitchen}
            options={["Water source in North", "South-East", "North-West"]}
            onSelect={(v) => update("kitchen", v)}
          />

          <VastuDropdown
            label="Dining Area Direction"
            value={form.dining}
            options={["North-East", "East", "North"]}
            onSelect={(v) => update("dining", v)}
          />

          <VastuDropdown
            label="Cash Counter/Billing Desk Direction"
            value={form.cashCounter}
            options={["Equal height on all sides", "North", "East"]}
            onSelect={(v) => update("cashCounter", v)}
          />

          <VastuDropdown
            label="Electrical/Generator/Equipment Area Direction"
            value={form.electrical}
            options={["No structures", "South-East", "North-West"]}
            onSelect={(v) => update("electrical", v)}
          />

          <VastuDropdown
            label="Water Structure/Swimming Pool Direction (If any)"
            value={form.waterStructure}
            options={["No structures", "North", "North-East", "East"]}
            onSelect={(v) => update("waterStructure", v)}
          />

          <VastuDropdown
            label="Washrooms/Toilets Direction"
            value={form.washroom}
            options={["No structures", "North-West", "West"]}
            onSelect={(v) => update("washroom", v)}
          />

          <VastuDropdown
            label="Storage/Housekeeping Area Direction"
            value={form.storage}
            options={["No structures", "South", "West", "South-West"]}
            onSelect={(v) => update("storage", v)}
          />
        </View>
      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View className="bg-white border-t border-gray-200">
        <View className="flex-row bg-white rounded-lg p-4 justify-end mx-3 mb-12 space-x-3">
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
    </View>
  );
}