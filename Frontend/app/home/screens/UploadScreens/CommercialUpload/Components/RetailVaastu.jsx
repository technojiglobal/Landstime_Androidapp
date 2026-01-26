


//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/RetailVaastu.jsx

import React, { useState, useEffect, useMemo } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter, useLocalSearchParams } from "expo-router";
import VastuDropdown from "../../VastuDropdown";
import { useTranslation } from 'react-i18next';
import { convertToEnglish,toEnglish } from '../../../../../../utils/reverseTranslation';

export default function RetailVaastu() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  // ✅ Initialize state with all fields
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

  // ✅ Parse images
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

  // ✅ Parse commercialDetails
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

  // ✅ Update function
  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // ✅ Load draft from AsyncStorage
  useEffect(() => {
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

  // ✅ Auto-save Vaastu draft
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

  // ✅ handleBack function
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

  // ✅ handleNext function
  const handleNext = () => {
    console.log('🔄 handleNext called with:', {
      hasCommercialDetails: !!commercialDetails,
      hasRetailDetails: !!commercialDetails?.retailDetails,
      hasVaastuDetails: !!form,
    });

    if (!commercialDetails || !commercialDetails.retailDetails) {
      Alert.alert(
        t('alert_missing_data'),
        t('alert_property_details_missing'),
        [
          {
            text: t('button_go_back'),
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

const updatedCommercialDetails = {
  ...commercialDetails,
  retailDetails: {
    ...commercialDetails.retailDetails,
    vaastuDetails: {
      shopFacing: toEnglish(form.shopFacing),  // ✅ ADD
      entrance: toEnglish(form.entrance),  // ✅ ADD
      cashCounter: toEnglish(form.cashCounter),  // ✅ ADD
      cashLocker: toEnglish(form.cashLocker),  // ✅ ADD
      ownerSeating: toEnglish(form.ownerSeating),  // ✅ ADD
      staffSeating: toEnglish(form.staffSeating),  // ✅ ADD
      storage: toEnglish(form.storage),  // ✅ ADD
      displayArea: toEnglish(form.displayArea),  // ✅ ADD
      electrical: toEnglish(form.electrical),  // ✅ ADD
      pantryArea: toEnglish(form.pantryArea),  // ✅ ADD
      staircase: toEnglish(form.staircase),  // ✅ ADD
      staircaseInside: toEnglish(form.staircaseInside),  // ✅ ADD
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
      <View className="flex-row items-center mt-12 mb-2">
        <TouchableOpacity onPress={handleBack}>
          <Image
            source={require("../../../../../../assets/arrow.png")}
            className="w-5 h-5"
          />
        </TouchableOpacity>

        <View className="ml-2">
          <Text className="text-base font-semibold">{t('upload_property_title')}</Text>
          <Text className="text-xs text-gray-500">
            {t('upload_property_subtitle')}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 bg-gray-100 px-4 py-2">
        <View className="bg-white rounded-2xl p-4 border border-gray-200">
          <Text className="text-lg font-bold mb-4">{t('retail_vaastu_details')}</Text>

          <VastuDropdown
            label={t('retail_shop_facing')}
            value={form.shopFacing}
            options={[
              t('retail_direction_north'),
              t('retail_direction_east'),
              t('retail_direction_north_east'),
              t('retail_direction_west'),
              t('retail_direction_south')
            ]}
            onSelect={(v) => update("shopFacing", v)}
          />

          <VastuDropdown
            label={t('retail_entrance_direction')}
            value={form.entrance}
            options={[
              t('retail_direction_north'),
              t('retail_direction_east'),
              t('retail_direction_north_east'),
              t('retail_direction_west')
            ]}
            onSelect={(v) => update("entrance", v)}
          />

          <VastuDropdown
            label={t('retail_cash_counter')}
            value={form.cashCounter}
            options={[
              t('retail_direction_south_west'),
              t('retail_direction_west'),
              t('retail_direction_south')
            ]}
            onSelect={(v) => update("cashCounter", v)}
          />

          <VastuDropdown
            label={t('retail_cash_locker')}
            value={form.cashLocker}
            options={[
              t('retail_direction_north'),
              t('retail_direction_east'),
              t('retail_direction_north_east')
            ]}
            onSelect={(v) => update("cashLocker", v)}
          />

          <VastuDropdown
            label={t('retail_owner_seating')}
            value={form.ownerSeating}
            options={[
              t('retail_direction_north_west'),
              t('retail_direction_west')
            ]}
            onSelect={(v) => update("ownerSeating", v)}
          />

          <VastuDropdown
            label={t('retail_staff_seating')}
            value={form.staffSeating}
            options={[
              t('retail_direction_north'),
              t('retail_direction_east'),
              t('retail_direction_north_east')
            ]}
            onSelect={(v) => update("staffSeating", v)}
          />

          <VastuDropdown
            label={t('retail_storage_room')}
            value={form.storage}
            options={[
              t('retail_direction_north'),
              t('retail_direction_north_east')
            ]}
            onSelect={(v) => update("storage", v)}
          />

          <VastuDropdown
            label={t('retail_display_area')}
            value={form.displayArea}
            options={[
              t('retail_direction_south_east'),
              t('retail_direction_north_west')
            ]}
            onSelect={(v) => update("displayArea", v)}
          />

          <VastuDropdown
            label="Electrical/Inverter/Generator Direction"
            value={form.electrical}
            options={[
              t('retail_direction_south_east'),
              t('retail_direction_north_west')
            ]}
            onSelect={(v) => update("electrical", v)}
          />

          <VastuDropdown
            label="Pantry/Wash Area Direction(If any)"
            value={form.pantryArea}
            options={[
              t('retail_direction_north_west'),
              t('retail_direction_west'),
              t('retail_direction_south_east')
            ]}
            onSelect={(v) => update("pantryArea", v)}
          />

          <VastuDropdown
            label="Staircase / Lift Direction"
            value={form.staircase}
            options={[
              t('retail_direction_south'),
              t('retail_direction_south_west'),
              t('retail_direction_west')
            ]}
            onSelect={(v) => update("staircase", v)}
          />

          <VastuDropdown
            label="Staircase/Lift Direction(If inside shop)"
            value={form.staircaseInside}
            options={[
              t('retail_direction_south_west'),
              t('retail_direction_west')
            ]}
            onSelect={(v) => update("staircaseInside", v)}
          />
        </View>
      </ScrollView>

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