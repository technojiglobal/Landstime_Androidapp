


//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/OfficeVaastu.jsx
import React, { useState, useMemo, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { convertToEnglish } from '../../../../../../utils/reverseTranslation'; // ✅ IMPORT THIS
import VastuDropdown from "../../VastuDropdown";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from 'react-i18next';

export default function VastuDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  const [form, setForm] = useState(() => ({
    officeFacing: "",
    entrance: "",
    cabin: "",
    workstations: "",
    conference: "",
    reception: "",
    accounts: "",
    pantry: "",
    server: "",
    washrooms: "",
    staircase: "",
    storage: "",
    cashLocker: "",
  }));

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
      console.log('🔍 OfficeVaastu params:', {
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

  useEffect(() => {
    const loadDraft = async () => {
      // ✅ PRIORITY 1: Load from params if coming back from OwnerScreen
      if (commercialDetails?.officeDetails?.vaasthuDetails) {
        const vastu = commercialDetails.officeDetails.vaasthuDetails;
        console.log('🔄 Restoring Vaastu data from params:', vastu);
        setForm(vastu);
        return;
      }

      // ✅ PRIORITY 2: Load from AsyncStorage
      try {
        const draft = await AsyncStorage.getItem('draft_office_vaastu');
        if (draft) {
          const savedForm = JSON.parse(draft);
          console.log('📦 Loading Vaastu draft from AsyncStorage');
          setForm(savedForm);
          return;
        }
      } catch (e) {
        console.log('⚠️ Failed to load Vaastu draft:', e);
      }
    };

    loadDraft();
  }, [commercialDetails]);

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // ✅ Auto-save Vaastu draft
  useEffect(() => {
    const saveDraft = async () => {
      try {
        await AsyncStorage.setItem('draft_office_vaastu', JSON.stringify(form));
        console.log('💾 Vaastu draft auto-saved');
      } catch (e) {
        console.log('⚠️ Failed to save Vaastu draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [form]);

  const handleBack = () => {
    if (!commercialDetails || !commercialDetails.officeDetails) {
      router.back();
      return;
    }

    // Save Vaastu data with existing office details
    const updatedCommercialDetails = {
      ...commercialDetails,
      officeDetails: {
        ...commercialDetails.officeDetails,
        vaasthuDetails: form,
      },
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OfficeNext",
      params: {
        officeDetails: JSON.stringify(commercialDetails.officeDetails),
        commercialDetails: JSON.stringify(updatedCommercialDetails),
        images: JSON.stringify(images),
        area: params.area,
        propertyTitle: commercialDetails.officeDetails?.propertyTitle || params.propertyTitle,
        commercialBaseDetails: params.commercialBaseDetails,
      },
    });
  };

  const handleNext = () => {
    console.log('🔄 handleNext called with:', {
      hasCommercialDetails: !!commercialDetails,
      hasOfficeDetails: !!commercialDetails?.officeDetails,
      hasVaasthuDetails: !!form,
    });

    if (!commercialDetails || !commercialDetails.officeDetails) {
      Alert.alert(
        t('missing_data_title'),
        t('missing_data_message'),
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

    // ✅ CONVERT VASTU DETAILS TO ENGLISH BEFORE SAVING
    const englishVastuDetails = convertToEnglish(form);

    const updatedCommercialDetails = {
      ...commercialDetails,
      officeDetails: {
        ...commercialDetails.officeDetails,
        vaasthuDetails: englishVastuDetails, // ✅ USE CONVERTED VERSION
      },
    };

    console.log("➡️ Office Vastu → Owner payload:", updatedCommercialDetails);

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen",
      params: {
        commercialDetails: JSON.stringify(updatedCommercialDetails),
        images: JSON.stringify(images),
        area: params.area,
        propertyTitle: commercialDetails.officeDetails?.propertyTitle || params.propertyTitle,
        commercialBaseDetails: params.commercialBaseDetails,
        officeDetails: JSON.stringify(commercialDetails.officeDetails),
      },
    });
  };

  // ✅ Define Vaastu options with translations
  

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
          <Text className="text-base font-semibold">{t('upload_property_title')}</Text>
          <Text className="text-xs text-gray-500">
            {t('upload_property_subtitle')}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="bg-white border border-gray-200 rounded-2xl p-4">
          <Text className="text-lg font-bold mb-4">{t('vaastu_details_title')}</Text>

          <VastuDropdown
            label={t('office_vaastu_facing')}
            value={form.officeFacing}
            
            onSelect={(v) => update("officeFacing", v)}
          />

          <VastuDropdown
            label={t('office_vaastu_entrance')}
            value={form.entrance}
            
            onSelect={(v) => update("entrance", v)}
          />

          <VastuDropdown
            label={t('office_vaastu_cabin')}
            value={form.cabin}
            
            onSelect={(v) => update("cabin", v)}
          />

          <VastuDropdown
            label={t('office_vaastu_workstations')}
            value={form.workstations}
            
            onSelect={(v) => update("workstations", v)}
          />

          <VastuDropdown
            label={t('office_vaastu_conference')}
            value={form.conference}
            
            onSelect={(v) => update("conference", v)}
          />

          <VastuDropdown
            label={t('office_vaastu_reception')}
            value={form.reception}
            
            onSelect={(v) => update("reception", v)}
          />

          <VastuDropdown
            label={t('office_vaastu_accounts')}
            value={form.accounts}
            
            onSelect={(v) => update("accounts", v)}
          />

          <VastuDropdown
            label={t('office_vaastu_pantry')}
            value={form.pantry}
            
            onSelect={(v) => update("pantry", v)}
          />

          <VastuDropdown
            label={t('office_vaastu_server')}
            value={form.server}
            
            onSelect={(v) => update("server", v)}
          />

          <VastuDropdown
            label={t('office_vaastu_washrooms')}
            value={form.washrooms}
            
            onSelect={(v) => update("washrooms", v)}
          />

          <VastuDropdown
            label={t('office_vaastu_staircase')}
            value={form.staircase}
            
            onSelect={(v) => update("staircase", v)}
          />

          <VastuDropdown
            label={t('office_vaastu_storage')}
            value={form.storage}
            
            onSelect={(v) => update("storage", v)}
          />

          <VastuDropdown
            label={t('office_vaastu_cash_locker')}
            value={form.cashLocker}
            
            onSelect={(v) => update("cashLocker", v)}
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