//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/HospitalityVaastu.jsx

import React, { useState, useEffect, useMemo } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from 'react-native-toast-message';
import VastuDropdown from "../../VastuDropdown";
import { useTranslation } from 'react-i18next'; // ✅ ADD THIS

export default function VastuDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t } = useTranslation(); // ✅ ADD THIS

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

    // ✅ FIXED - Extract hospitalityType
    let hospitalityType;
    if (params.commercialBaseDetails) {
      try {
        const baseDetails = JSON.parse(params.commercialBaseDetails);
        hospitalityType = baseDetails.hospitalityType;
      } catch (e) {
        console.log('⚠️ Could not parse commercialBaseDetails:', e);
      }
    }

    router.push({
        pathname: "/home/screens/UploadScreens/CommercialUpload/Components/HospitalityNext",
        params: {
            hospitalityDetails: JSON.stringify(commercialDetails.hospitalityDetails),
            commercialDetails: JSON.stringify(updatedCommercialDetails),
            images: JSON.stringify(images),
            area: params.area,
            propertyTitle: commercialDetails.hospitalityDetails?.propertyTitle || params.propertyTitle,
            hospitalityType: hospitalityType, // ✅ ADD THIS
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
                text1: t('missing_data_title'),
                text2: t('missing_data_message'),
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

      // ✅ FIXED - Extract hospitalityType before navigation
let hospitalityType;
if (params.commercialBaseDetails) {
  try {
    const baseDetails = JSON.parse(params.commercialBaseDetails);
    hospitalityType = baseDetails.hospitalityType;
  } catch (e) {
    console.log('⚠️ Could not parse commercialBaseDetails:', e);
  }
}

router.push({
    pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen",
    params: {
        commercialDetails: JSON.stringify(updatedCommercialDetails),
        images: JSON.stringify(images),
        area: params.area,
        propertyTitle: commercialDetails.hospitalityDetails?.propertyTitle || params.propertyTitle,
        hospitalityType: hospitalityType, // ✅ ADD THIS
        commercialBaseDetails: params.commercialBaseDetails,
        hospitalityDetails: JSON.stringify(commercialDetails.hospitalityDetails),
    },
});
    };

    // ✅ Define Vaastu options with translations
    const vastuOptions = {
        buildingFacing: [
            t('vaastu_option_north_east'),
            t('vaastu_option_north'),
            t('vaastu_option_east'),
            t('vaastu_option_west'),
            t('vaastu_option_south')
        ],
        entrance: [
            t('vaastu_option_south_west'),
            t('vaastu_option_north'),
            t('vaastu_option_east'),
            t('vaastu_option_west'),
            t('vaastu_option_south')
        ],
        reception: [
            t('vaastu_option_towards_north'),
            t('vaastu_option_east'),
            t('vaastu_option_north_east')
        ],
        adminOffice: [
            t('vaastu_option_balanced_open_space'),
            t('vaastu_option_south_west'),
            t('vaastu_option_west')
        ],
        guestRooms: [
            t('vaastu_option_square'),
            t('vaastu_option_south'),
            t('vaastu_option_west')
        ],
        banquet: [
            t('vaastu_option_north_east'),
            t('vaastu_option_east'),
            t('vaastu_option_north')
        ],
        kitchen: [
            t('vaastu_option_water_source_north'),
            t('vaastu_option_south_east'),
            t('vaastu_option_north_west')
        ],
        dining: [
            t('vaastu_option_north_east'),
            t('vaastu_option_east'),
            t('vaastu_option_north')
        ],
        cashCounter: [
            t('vaastu_option_equal_height'),
            t('vaastu_option_north'),
            t('vaastu_option_east')
        ],
        electrical: [
            t('vaastu_option_no_structures'),
            t('vaastu_option_south_east'),
            t('vaastu_option_north_west')
        ],
        waterStructure: [
            t('vaastu_option_no_structures'),
            t('vaastu_option_north'),
            t('vaastu_option_north_east'),
            t('vaastu_option_east')
        ],
        washroom: [
            t('vaastu_option_no_structures'),
            t('vaastu_option_north_west'),
            t('vaastu_option_west')
        ],
        storage: [
            t('vaastu_option_no_structures'),
            t('vaastu_option_south'),
            t('vaastu_option_west'),
            t('vaastu_option_south_west')
        ],
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
                        label={t('building_property_facing')}
                        value={form.buildingFacing}
                        options={vastuOptions.buildingFacing}
                        onSelect={(v) => update("buildingFacing", v)}
                    />

                    <VastuDropdown
                        label={t('main_entrance_direction')}
                        value={form.entrance}
                        options={vastuOptions.entrance}
                        onSelect={(v) => update("entrance", v)}
                    />

                    <VastuDropdown
                        label={t('reception_lobby_direction')}
                        value={form.reception}
                        options={vastuOptions.reception}
                        onSelect={(v) => update("reception", v)}
                    />

                    <VastuDropdown
                        label={t('admin_office_direction')}
                        value={form.adminOffice}
                        options={vastuOptions.adminOffice}
                        onSelect={(v) => update("adminOffice", v)}
                    />

                    <VastuDropdown
                        label={t('guest_rooms_direction')}
                        value={form.guestRooms}
                        options={vastuOptions.guestRooms}
                        onSelect={(v) => update("guestRooms", v)}
                    />

                    <VastuDropdown
                        label={t('banquet_direction')}
                        value={form.banquet}
                        options={vastuOptions.banquet}
                        onSelect={(v) => update("banquet", v)}
                    />

                    <VastuDropdown
                        label="Kitchen/Cooking Area Direction"
                        value={form.kitchen}
                        options={vastuOptions.kitchen}
                        onSelect={(v) => update("kitchen", v)}
                    />

                    <VastuDropdown
                        label={t('dining_direction')}
                        value={form.dining}
                        options={vastuOptions.dining}
                        onSelect={(v) => update("dining", v)}
                    />

                    <VastuDropdown
                        label={t('cash_counter_direction')}
                        value={form.cashCounter}
                        options={vastuOptions.cashCounter}
                        onSelect={(v) => update("cashCounter", v)}
                    />

                    <VastuDropdown
                        label={t('electrical_area_direction')}
                        value={form.electrical}
                        options={vastuOptions.electrical}
                        onSelect={(v) => update("electrical", v)}
                    />

                    <VastuDropdown
                        label={t('water_structure_direction')}
                        value={form.waterStructure}
                        options={vastuOptions.waterStructure}
                        onSelect={(v) => update("waterStructure", v)}
                    />

                    <VastuDropdown
                        label={t('washroom_direction')}
                        value={form.washroom}
                        options={vastuOptions.washroom}
                        onSelect={(v) => update("washroom", v)}
                    />

                    <VastuDropdown
                        label={t('storage_direction')}
                        value={form.storage}
                        options={vastuOptions.storage}
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