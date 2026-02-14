// Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/PlotVaastu.jsx

import React, { useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import VastuDropdown from "../../VastuDropdown";
import { useTranslation } from 'react-i18next';
import { convertToEnglish } from '../../../../../../utils/reverseTranslation';

export default function VastuDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, i18n } = useTranslation();

  const [form, setForm] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPropertyId, setEditPropertyId] = useState(null);
  const [originalPropertyData, setOriginalPropertyData] = useState(null); // ✅ Store original property

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

  // ✅ Data inspection helper - logs all available data paths
  const inspectPropertyData = (property, label = "Property Data") => {
    console.log(`\n🔍 === ${label} ===`);
    console.log('📌 Root keys:', Object.keys(property || {}).join(', '));
    console.log('📌 commercialDetails keys:', Object.keys(property.commercialDetails || {}).join(', '));
    console.log('📌 vastuDetails:', JSON.stringify(property.commercialDetails?.vastuDetails, null, 2));
    console.log(`🔍 === End ${label} ===\n`);
  };

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

  // ✅ Load data from edit mode, params, or AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      // ✅ PRIORITY 1: Load data in edit mode
      if (params.editMode === 'true' && params.propertyData) {
        try {
          const property = JSON.parse(params.propertyData);
          setIsEditMode(true);
          setEditPropertyId(params.propertyId);
          setOriginalPropertyData(property); // ✅ Store original data
          
          console.log('📝 Loading Plot Vaastu for edit:', property._id);
          inspectPropertyData(property, "Plot Vaastu Edit Mode");

          // ✅ ADD MASTER DEBUGGING LOG
          console.log('\n🎯 PLOT VAASTU EDIT MODE - COMPLETE DATA INSPECTION:');
          console.log('📌 property._id:', property._id);
          console.log('📌 Has commercialDetails:', !!property.commercialDetails);
          if (property.commercialDetails) {
            console.log('📌 commercialDetails.vastuDetails:', !!property.commercialDetails.vastuDetails);
            if (property.commercialDetails.vastuDetails) {
              const vastu = property.commercialDetails.vastuDetails;
              console.log('  - plotFacing:', vastu.plotFacing);
              console.log('  - mainEntry:', vastu.mainEntry);
              console.log('  - drainage:', vastu.drainage);
              console.log('  - Full vastu:', JSON.stringify(vastu, null, 2));
            }
          }
          console.log('🎯 === END MASTER DEBUG ===\n');

          // Helper function to get localized text
          const getLocalizedText = (field) => {
            if (!field) return '';
            if (typeof field === 'string') return field;
            if (typeof field === 'object') {
              const currentLang = i18n.language || 'en';
              return field[currentLang] || field.en || field.te || field.hi || '';
            }
            return '';
          };

          // Load vaastu details from commercialDetails
          if (property.commercialDetails?.vastuDetails) {
            const vastu = property.commercialDetails.vastuDetails;
            console.log('🔄 Restoring Plot Vaastu from edit mode:', vastu);
            console.log('📊 Vaastu Fields:', {
              plotFacing: vastu.plotFacing,
              mainEntry: vastu.mainEntry,
              plotSlope: vastu.plotSlope,
              openSpace: vastu.openSpace,
              shape: vastu.shape,
              roadPosition: vastu.roadPosition,
              waterSource: vastu.waterSource,
              drainage: vastu.drainage,
              compoundWall: vastu.compoundWall,
              structures: vastu.structures,
            });
            setForm(vastu);
            return;
          } else if (property.vastuDetails) {
            // ✅ FALLBACK: Try loading from property.vastuDetails directly
            console.log('📦 Fallback: Loading from property.vastuDetails');
            const vastu = property.vastuDetails;
            console.log('🔄 Vaastu details from fallback path:', vastu);
            setForm(vastu);
            return;
          } else if (property.commercialDetails?.plotDetails?.vastuDetails) {
            // ✅ FALLBACK: Try loading from deeper nesting
            console.log('📦 Fallback: Loading from property.commercialDetails.plotDetails.vastuDetails');
            const vastu = property.commercialDetails.plotDetails.vastuDetails;
            setForm(vastu);
            return;
          } else {
            console.warn('⚠️  No vaastu details found in any expected locations');
            console.log('🔍 Full property structure:', JSON.stringify(property, null, 2));
          }

          console.log('✅ Plot Vaastu loaded for editing');
          return; // Don't load draft in edit mode
        } catch (error) {
          console.error('❌ Error loading plot vaastu data:', error);
          Alert.alert('Error', 'Failed to load property data');
        }
      }

      // ✅ PRIORITY 2: Load from params if coming back from OwnerScreen (only in create mode)
      if (!params.editMode || params.editMode !== 'true') {
        if (commercialDetailsFromPrev?.vastuDetails) {
          const vastu = commercialDetailsFromPrev.vastuDetails;
          console.log('🔄 Restoring Plot Vaastu from params:', vastu);
          setForm(vastu);
          return;
        }

        // ✅ PRIORITY 3: Load from AsyncStorage draft
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
      }
    };

    loadData();
  }, [params.editMode, params.propertyData, params.propertyId, commercialDetailsFromPrev]);

  // ✅ Auto-save Vaastu draft
  useEffect(() => {
    if (isEditMode) return; // ✅ Don't save drafts in edit mode
    
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
  }, [form, isEditMode]);

  const handleBack = () => {
    if (!commercialDetailsFromPrev) {
      router.back();
      return;
    }

    // ✅ Save current Vaastu form data before going back
    const updatedCommercialDetails = {
      ...commercialDetailsFromPrev,
      vastuDetails: form,
    };

    console.log('🔙 Going back to PlotNext with Vaastu data:', form);

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/PlotNext",
      params: {
        commercialDetails: JSON.stringify(updatedCommercialDetails),
        images: JSON.stringify(images),
        area: params.area,
        propertyTitle: commercialDetails?.propertyTitle || params.propertyTitle,
        plotKind: params.plotKind,
        // ✅ In edit mode, pass original full property data
        editMode: isEditMode ? 'true' : params.editMode,
        propertyId: isEditMode ? editPropertyId : params.propertyId,
        propertyData: isEditMode && originalPropertyData ? JSON.stringify(originalPropertyData) : params.propertyData,
      },
    });
  };

  const handleNext = () => {
    if (!commercialDetailsFromPrev) {
      return;
    }

    // ✅ Convert Telugu/Hindi Vastu values to English
    const convertedVastuDetails = convertToEnglish(form);

    console.log('🌐 Converted Vastu details:', convertedVastuDetails);

    const updatedCommercialDetails = {
      ...commercialDetailsFromPrev,
      vastuDetails: convertedVastuDetails,
      description: commercialDetailsFromPrev.description,
      expectedPrice: commercialDetailsFromPrev.expectedPrice,
      priceDetails: commercialDetailsFromPrev.priceDetails,
      pricingExtras: {
        ...commercialDetailsFromPrev.pricingExtras,
        description: commercialDetailsFromPrev.pricingExtras?.description || commercialDetailsFromPrev.description,
      },
    };

    console.log("➡️ Plot Vastu → Owner payload:", {
      ...updatedCommercialDetails,
      hasDescription: !!updatedCommercialDetails.description,
      descriptionValue: updatedCommercialDetails.description,
    });

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen",
      params: {
        commercialDetails: JSON.stringify(updatedCommercialDetails),
        images: JSON.stringify(images),
        area: params.area,
        propertyTitle: commercialDetails?.propertyTitle || params.propertyTitle,
        plotKind: params.plotKind,
        // ✅ In edit mode, pass original full property data
        editMode: isEditMode ? 'true' : params.editMode,
        propertyId: isEditMode ? editPropertyId : params.propertyId,
        propertyData: isEditMode && originalPropertyData ? JSON.stringify(originalPropertyData) : params.propertyData,
      },
    });
  };

  // ✅ Vastu options with translations
  

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
          <Text className="text-base font-semibold">{t('upload_property_title')}</Text>
          <Text className="text-xs text-gray-500">
            {t('upload_property_subtitle')}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="bg-white border border-gray-300 rounded-2xl p-4">
          <Text className="text-lg font-bold mb-4">{t('plot_vaastu_title')}</Text>

          <VastuDropdown 
            label={t('plot_vaastu_plot_facing')} 
            value={form.plotFacing}
            
            onSelect={(v) => update("plotFacing", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_main_entry')} 
            value={form.mainEntry}
            
            onSelect={(v) => update("mainEntry", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_slope')} 
            value={form.plotSlope}
            
            onSelect={(v) => update("plotSlope", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_open_space')} 
            value={form.openSpace}
            
            onSelect={(v) => update("openSpace", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_shape')} 
            value={form.shape}
            
            onSelect={(v) => update("shape", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_road_position')} 
            value={form.roadPosition}
           
            onSelect={(v) => update("roadPosition", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_water_source')} 
            value={form.waterSource}
            
            onSelect={(v) => update("waterSource", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_drainage')} 
            value={form.drainage}
            
            onSelect={(v) => update("drainage", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_compound_wall')} 
            value={form.compoundWall}
            
            onSelect={(v) => update("compoundWall", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_structures')} 
            value={form.structures}
           
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