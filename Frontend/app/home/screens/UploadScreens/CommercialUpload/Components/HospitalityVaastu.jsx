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
  const loadData = async () => {
    // ✅ PRIORITY 1: Load data in edit mode
    if (params.editMode === 'true' && params.propertyData) {
      try {
        const property = JSON.parse(params.propertyData);
        console.log('📝 Loading Hospitality Vaastu for edit:', property._id);

        // Load vaastu details from commercialDetails
        if (property.commercialDetails?.hospitalityDetails?.vastuDetails) {
          const vastu = property.commercialDetails.hospitalityDetails.vastuDetails;
          console.log('🔄 Restoring Hospitality Vaastu from edit mode:', vastu);
          setForm(vastu);
          return;
        }
      } catch (error) {
        console.error('❌ Error loading hospitality vaastu data:', error);
      }
    }

    // ✅ PRIORITY 2: Load from params (navigation back from next step)
    if (commercialDetails?.hospitalityDetails?.vastuDetails) {
      const vastu = commercialDetails.hospitalityDetails.vastuDetails;
      console.log('🔄 Restoring Hospitality Vaastu from params:', vastu);
      setForm(vastu);
      return;
    }

    // ✅ PRIORITY 3: Load from AsyncStorage draft (only in create mode)
    if (!params.editMode || params.editMode !== 'true') {
      try {
        console.log("📦 Loading Hospitality Vaastu draft from AsyncStorage");
        const draft = await AsyncStorage.getItem('draft_hospitality_vaastu');
        if (draft) {
          const parsed = JSON.parse(draft);
          console.log('✅ Hospitality Vaastu draft loaded from storage:', parsed);
          setForm(parsed);
          return;
        }
      } catch (e) {
        console.log('⚠️ Failed to load Hospitality Vaastu draft:', e);
      }
    }
  };

  loadData();
}, [params.editMode, params.propertyData, commercialDetails]);

    // Auto-save Vaastu draft
    useEffect(() => {
        // Don't save drafts in edit mode
        if (params.editMode === 'true') {
            return;
        }

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
    }, [params.editMode, form]);

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
                hospitalityType: hospitalityType,
                commercialBaseDetails: params.commercialBaseDetails,
                // ✅ ADD THESE THREE LINES
                editMode: params.editMode,
                propertyId: params.propertyId,
                propertyData: params.propertyData,
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
                hospitalityType: hospitalityType,
                commercialBaseDetails: params.commercialBaseDetails,
                hospitalityDetails: JSON.stringify(commercialDetails.hospitalityDetails),
                // ✅ ADD THESE THREE LINES
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

                        onSelect={(v) => update("buildingFacing", v)}
                    />

                    <VastuDropdown
                        label={t('main_entrance_direction')}
                        value={form.entrance}

                        onSelect={(v) => update("entrance", v)}
                    />

                    <VastuDropdown
                        label={t('reception_lobby_direction')}
                        value={form.reception}

                        onSelect={(v) => update("reception", v)}
                    />

                    <VastuDropdown
                        label={t('admin_office_direction')}
                        value={form.adminOffice}

                        onSelect={(v) => update("adminOffice", v)}
                    />

                    <VastuDropdown
                        label={t('guest_rooms_direction')}
                        value={form.guestRooms}

                        onSelect={(v) => update("guestRooms", v)}
                    />

                    <VastuDropdown
                        label={t('banquet_direction')}
                        value={form.banquet}

                        onSelect={(v) => update("banquet", v)}
                    />

                    <VastuDropdown
                        label="Kitchen/Cooking Area Direction"
                        value={form.kitchen}

                        onSelect={(v) => update("kitchen", v)}
                    />

                    <VastuDropdown
                        label={t('dining_direction')}
                        value={form.dining}

                        onSelect={(v) => update("dining", v)}
                    />

                    <VastuDropdown
                        label={t('cash_counter_direction')}
                        value={form.cashCounter}

                        onSelect={(v) => update("cashCounter", v)}
                    />

                    <VastuDropdown
                        label={t('electrical_area_direction')}
                        value={form.electrical}

                        onSelect={(v) => update("electrical", v)}
                    />

                    <VastuDropdown
                        label={t('water_structure_direction')}
                        value={form.waterStructure}

                        onSelect={(v) => update("waterStructure", v)}
                    />

                    <VastuDropdown
                        label={t('washroom_direction')}
                        value={form.washroom}

                        onSelect={(v) => update("washroom", v)}
                    />

                    <VastuDropdown
                        label={t('storage_direction')}
                        value={form.storage}

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