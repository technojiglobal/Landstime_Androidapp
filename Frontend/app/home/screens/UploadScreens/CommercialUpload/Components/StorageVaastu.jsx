//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/StorageVaastu.jsx

import React, { useState, useMemo, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import VastuDropdown from "../../VastuDropdown";
import { useTranslation } from 'react-i18next'; // ✅ ADD THIS
import { convertToEnglish } from '../../../../../../utils/reverseTranslation';

export default function VastuDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation(); // ✅ ADD THIS

  const [form, setForm] = useState({
    buildingFacing: "",
    entrance: "",
    storageArea: "",
    lightGoods: "",
    loading: "",
    office: "",
    electrical: "",
    water: "",
    washroom: "",
    height: "",
  });

  const images = useMemo(() => {
    try {
      if (!params.images) return [];
      if (typeof params.images === 'string') return JSON.parse(params.images);
      if (Array.isArray(params.images)) return params.images;
      return [];
    } catch (e) {
      console.error('❌ Error parsing images:', e);
      return [];
    }
  }, [params.images]);

  const commercialDetails = useMemo(() => {
    try {
      console.log('🔍 StorageVaastu params:', {
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
        const draft = await AsyncStorage.getItem('draft_storage_vaastu');
        if (draft) {
          const savedForm = JSON.parse(draft);
          console.log('📦 Loading Storage Vaastu draft from AsyncStorage');
          setForm(savedForm);
          return;
        }
      } catch (e) {
        console.log('⚠️ Failed to load Storage Vaastu draft:', e);
      }

      // Fallback: Load from params
      if (commercialDetails?.storageDetails?.vastuDetails) {
        const vastu = commercialDetails.storageDetails.vastuDetails;
        console.log('🔄 Restoring Storage Vaastu data from params:', vastu);
        setForm(vastu);
      }
    };

    loadDraft();
  }, [commercialDetails]);

  // Auto-save Vaastu draft
  useEffect(() => {
    const saveDraft = async () => {
      try {
        await AsyncStorage.setItem('draft_storage_vaastu', JSON.stringify(form));
        console.log('💾 Storage Vaastu draft auto-saved');
      } catch (e) {
        console.log('⚠️ Failed to save Storage Vaastu draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [form]);

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleBack = () => {
    if (!commercialDetails || !commercialDetails.storageDetails) {
      router.back();
      return;
    }

    const updatedCommercialDetails = {
      ...commercialDetails,
      storageDetails: {
        ...commercialDetails.storageDetails,
        vastuDetails: form,
      },
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/StorageNext",
      params: {
        storageDetails: JSON.stringify(commercialDetails.storageDetails),
        commercialDetails: JSON.stringify(updatedCommercialDetails),
        images: JSON.stringify(images),
        area: params.area,
        propertyTitle: commercialDetails.storageDetails?.propertyTitle || params.propertyTitle,
        commercialBaseDetails: params.commercialBaseDetails,
      },
    });
  };

const handleNext = () => {
  console.log('🔄 handleNext called with:', {
    hasCommercialDetails: !!commercialDetails,
    hasStorageDetails: !!commercialDetails?.storageDetails,
    hasVastuDetails: !!form,
  });

  if (!commercialDetails || !commercialDetails.storageDetails) {
    Alert.alert(
      t('missing_data_title'),
      t('missing_data_message'),
      [
        {
          text: "Go Back",
          onPress: () => router.back()
        },
        {
          text: t('button_cancel'),
          style: "cancel"
        }
      ]
    );
    return;
  }

  // ✅ ENSURE storageType is in English
  const storageTypeMap = {
    'వేర్‌హౌస్': 'Warehouse',
    'गोदाम': 'Warehouse',
    'కోల్డ్ స్టోరేజ్': 'Cold Storage',
    'कोल्ड स्टोरेज': 'Cold Storage'
  };

  const rawStorageType = commercialDetails.storageDetails.storageType;
  const convertedStorageType = storageTypeMap[rawStorageType] || rawStorageType;

  console.log('🔄 Storage Type in Vaastu:', {
    raw: rawStorageType,
    converted: convertedStorageType
  });

  // ✅ CONVERT VASTU DETAILS TO ENGLISH
  const englishVastuDetails = convertToEnglish(form);

  const updatedCommercialDetails = {
    ...commercialDetails,
    storageDetails: {
      ...commercialDetails.storageDetails,
      storageType: convertedStorageType, // ✅ USE CONVERTED VALUE
      vastuDetails: englishVastuDetails,
    },
  };

    console.log('✅ Navigating to OwnerScreen with:', {
      hasUpdatedDetails: !!updatedCommercialDetails,
      hasStorageDetails: !!updatedCommercialDetails.storageDetails,
      hasVastuDetails: !!updatedCommercialDetails.storageDetails.vastuDetails,
    });
  router.push({
  pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen",
  params: {
    commercialDetails: JSON.stringify(updatedCommercialDetails),
    images: JSON.stringify(images),
    area: params.area,
    propertyTitle: commercialDetails.storageDetails?.propertyTitle || params.propertyTitle,
    commercialBaseDetails: params.commercialBaseDetails,
  },
});
};

//Define Vaastu options with translations

return (
  <View className="flex-1 bg-white">

{/* Header */}
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

  {/* Scrollable Form */}
  <ScrollView className="flex-1 px-4 py-6">
    <View className="bg-white border border-gray-200 rounded-2xl p-4">
      <Text className="text-lg font-bold mb-4">{t('vaastu_details_title')}</Text>

     <VastuDropdown
  label={t('storage_building_facing')}
  value={form.buildingFacing}
  
  onSelect={(v) => update("buildingFacing", v)}
/>

<VastuDropdown
  label={t('storage_entrance_direction')}
  value={form.entrance}
 
  onSelect={(v) => update("entrance", v)}
/>

<VastuDropdown
  label={t('storage_area_direction')}
  value={form.storageArea}
  
  onSelect={(v) => update("storageArea", v)}
/>

<VastuDropdown
  label={t('storage_light_goods_direction')}
  value={form.lightGoods}
 
  onSelect={(v) => update("lightGoods", v)}
/>

<VastuDropdown
  label={t('storage_loading_direction')}
  value={form.loading}
 
  onSelect={(v) => update("loading", v)}
/>

<VastuDropdown
  label={t('storage_office_direction')}
  value={form.office}
  
  onSelect={(v) => update("office", v)}
/>

<VastuDropdown
  label={t('storage_electrical_direction')}
  value={form.electrical}
  
  onSelect={(v) => update("electrical", v)}
/>

<VastuDropdown
  label={t('storage_water_direction')}
  value={form.water}
 
  onSelect={(v) => update("water", v)}
/>

<VastuDropdown
  label={t('storage_washroom_direction')}
  value={form.washroom}
  
  onSelect={(v) => update("washroom", v)}
/>

<VastuDropdown
  label={t('storage_height_level')}
  value={form.height}
  
  onSelect={(v) => update("height", v)}
/>

    </View>
  </ScrollView>

  {/* Bottom Buttons */}
  <View className="flex-row bg-white rounded-lg p-4 justify-end mt-4 space-x-3 mx-3 mb-12">
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
);
}

  


