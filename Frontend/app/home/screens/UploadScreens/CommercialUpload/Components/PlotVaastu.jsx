// Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/PlotVaastu.jsx

import React, { useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import VastuDropdown from "../../VastuDropdown";
import { useTranslation } from 'react-i18next';
import { convertToEnglish } from '../../../../../../utils/reverseTranslation';

export default function VastuDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  const [form, setForm] = useState({});

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
  }, [commercialDetailsFromPrev]);

  // ✅ Auto-save Vaastu draft
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
      },
    });
  };

  // ✅ Vastu options with translations
  const vastuOptions = {
    plotFacing: [
      t('vaastu_option_north'),
      t('vaastu_option_east'),
      t('vaastu_option_north_east'),
      t('vaastu_option_west'),
      t('vaastu_option_south')
    ],
    mainEntry: [
      t('vaastu_option_north'),
      t('vaastu_option_east'),
      t('vaastu_option_north_east'),
      t('vaastu_option_west'),
      t('vaastu_option_south_west')
    ],
    plotSlope: [
      t('vaastu_option_towards_north'),
      t('vaastu_option_towards_east'),
      t('vaastu_option_north_east')
    ],
    openSpace: [
      t('vaastu_option_balanced_open_space'),
      t('vaastu_option_more_north_east')
    ],
    shape: [
      t('vaastu_option_square'),
      t('vaastu_option_rectangle')
    ],
    roadPosition: [
      t('vaastu_option_north'),
      t('vaastu_option_east'),
      t('vaastu_option_north_east')
    ],
    waterSource: [
      t('vaastu_option_north'),
      t('vaastu_option_north_east')
    ],
    drainage: [
      t('vaastu_option_north'),
      t('vaastu_option_north_east'),
      t('vaastu_option_east')
    ],
    compoundWall: [
      t('vaastu_option_equal_height'),
      t('vaastu_option_higher_south_west')
    ],
    structures: [
      t('vaastu_option_no_structures'),
      t('vaastu_option_temporary_structures')
    ],
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
            options={vastuOptions.plotFacing}
            onSelect={(v) => update("plotFacing", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_main_entry')} 
            value={form.mainEntry}
            options={vastuOptions.mainEntry}
            onSelect={(v) => update("mainEntry", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_slope')} 
            value={form.plotSlope}
            options={vastuOptions.plotSlope}
            onSelect={(v) => update("plotSlope", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_open_space')} 
            value={form.openSpace}
            options={vastuOptions.openSpace}
            onSelect={(v) => update("openSpace", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_shape')} 
            value={form.shape}
            options={vastuOptions.shape}
            onSelect={(v) => update("shape", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_road_position')} 
            value={form.roadPosition}
            options={vastuOptions.roadPosition}
            onSelect={(v) => update("roadPosition", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_water_source')} 
            value={form.waterSource}
            options={vastuOptions.waterSource}
            onSelect={(v) => update("waterSource", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_drainage')} 
            value={form.drainage}
            options={vastuOptions.drainage}
            onSelect={(v) => update("drainage", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_compound_wall')} 
            value={form.compoundWall}
            options={vastuOptions.compoundWall}
            onSelect={(v) => update("compoundWall", v)}
          />

          <VastuDropdown 
            label={t('plot_vaastu_structures')} 
            value={form.structures}
            options={vastuOptions.structures}
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