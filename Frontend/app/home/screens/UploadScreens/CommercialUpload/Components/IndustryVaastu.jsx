//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/IndustryVaastu.jsx

import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
//import { convertToEnglish } from '../../../../../utils/reverseTranslation'; // ✅ ADD THIS  
import { convertToEnglish } from '../../../../../../utils/reverseTranslation'; // ✅ ADD THISr
import { useRouter, useLocalSearchParams } from "expo-router";
import VastuDropdown from "../../VastuDropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useTranslation } from 'react-i18next'; // ✅ ADD THIS

export default function VastuDetailsScreen() {
  const [form, setForm] = useState({});
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation(); // ✅ ADD THIS

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

  // ✅ Load draft from AsyncStorage
  useEffect(() => {
  const loadData = async () => {
    // ✅ PRIORITY 1: Load from edit mode first
    if (params.editMode === 'true' && params.propertyData) {
      try {
        const property = JSON.parse(params.propertyData);
        console.log('📝 Loading industry vaastu for edit:', property._id);
        
        if (property.commercialDetails?.industryDetails?.vastuDetails) {
          const vastu = property.commercialDetails.industryDetails.vastuDetails;
          console.log('🔄 Restoring Industry Vaastu from edit mode:', vastu);
          setForm(vastu);
          return;
        }
      } catch (error) {
        console.error('❌ Error loading industry vaastu:', error);
      }
    }

    // ✅ PRIORITY 2: Load from params (navigation back from next screen)
    if (commercialDetailsFromPrev?.industryDetails?.vastuDetails) {
      const vastu = commercialDetailsFromPrev.industryDetails.vastuDetails;
      console.log('🔄 Restoring Industry Vaastu from params:', vastu);
      setForm(vastu);
      return;
    }

    // ✅ PRIORITY 3: Load from AsyncStorage draft (only in create mode)
    if (!params.editMode || params.editMode !== 'true') {
      try {
        console.log("📦 Loading Industry Vaastu draft from AsyncStorage");
        const draft = await AsyncStorage.getItem('draft_industry_vaastu');
        if (draft) {
          const parsed = JSON.parse(draft);
          console.log('✅ Industry Vaastu draft loaded from storage:', parsed);
          setForm(parsed);
        }
      } catch (e) {
        console.log('⚠️ Failed to load Industry Vaastu draft:', e);
      }
    }
  };

  loadData();
}, [params.editMode, params.propertyData, commercialDetailsFromPrev]);

  // ✅ Auto-save Vaastu draft
  useEffect(() => {
  if (params.editMode === 'true') return; // ✅ Don't save drafts in edit mode
  
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
}, [form, params.editMode]); // ✅ Add params.editMode dependency

  const handleNext = () => {
    if (!commercialDetailsFromPrev) return;

   // ✅ CONVERT VASTU DETAILS TO ENGLISH
  const englishVastuDetails = convertToEnglish(form);

  const updatedCommercialDetails = {
    ...commercialDetailsFromPrev,
    industryDetails: {
      ...(commercialDetailsFromPrev.industryDetails || {}),
      vastuDetails: englishVastuDetails, // ✅ USE CONVERTED VERSION
    },
  };

    console.log("➡️ Industry Vastu → Owner payload:", updatedCommercialDetails);

   router.push({
  pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen",
  params: {
    commercialDetails: JSON.stringify(updatedCommercialDetails),
    images: JSON.stringify(images),
    area: params.area,
    // ✅ Pass edit mode params
    editMode: params.editMode,
    propertyId: params.propertyId,
    propertyData: params.propertyData,
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
    commercialBaseDetails: params.commercialBaseDetails,
    // ✅ Pass edit mode params
    editMode: params.editMode,
    propertyId: params.propertyId,
    propertyData: params.propertyData,
  },
});
  };

  // ✅ Define Vaastu options with translations
  

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="flex-row items-center ml-4 mt-12 mb-2">
        <TouchableOpacity onPress={handleBack}>
          <Image
            source={require("../../../../../../assets/arrow.png")}
            className="w-5 h-5"
          />
        </TouchableOpacity>

        <View className="ml-2">
          <Text className="text-base font-semibold">
            {t('upload_property_title')}
          </Text>
          <Text className="text-xs text-gray-500">
            {t('upload_property_subtitle')}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="bg-white border border-gray-200 rounded-2xl p-4">
          <Text className="text-lg font-bold mb-4">{t('vaastu_details_title')}</Text>

          <VastuDropdown
            label={t('industry_plot_building_facing')}
            value={form.buildingFacing}
            
            onSelect={(v) => update("buildingFacing", v)}
          />

          <VastuDropdown
            label={t('industry_entrance_direction')}
            value={form.entrance}
           
            onSelect={(v) => update("entrance", v)}
          />

          <VastuDropdown
            label={t('industry_machinery_direction')}
            value={form.machinery}
            
            onSelect={(v) => update("machinery", v)}
          />

          <VastuDropdown
            label={t('industry_production_direction')}
            value={form.production}
            
            onSelect={(v) => update("production", v)}
          />

          <VastuDropdown
            label={t('industry_raw_material_direction')}
            value={form.rawMaterial}
            
            onSelect={(v) => update("rawMaterial", v)}
          />

          <VastuDropdown
            label={t('industry_finished_goods_direction')}
            value={form.finishedGoods}
           
            onSelect={(v) => update("finishedGoods", v)}
          />

          <VastuDropdown
            label={t('industry_office_direction')}
            value={form.office}
            
            onSelect={(v) => update("office", v)}
          />

          <VastuDropdown
            label={t('industry_electrical_direction')}
            value={form.electrical}
            
            onSelect={(v) => update("electrical", v)}
          />

          <VastuDropdown
            label={t('industry_water_direction')}
            value={form.water}
            
            onSelect={(v) => update("water", v)}
          />

          <VastuDropdown
            label={t('industry_waste_direction')}
            value={form.waste}
            
            onSelect={(v) => update("waste", v)}
          />

          <VastuDropdown
            label={t('industry_washroom_direction')}
            value={form.washroom}
           
            onSelect={(v) => update("washroom", v)}
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
            <Text className="font-semibold">{t('button_cancel')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-5 py-3 rounded-lg bg-green-500"
            onPress={handleNext}
          >
            <Text className="text-white font-semibold">{t('button_next')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}