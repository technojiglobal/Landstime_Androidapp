//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/Industry.jsx
// ✅ MODIFIED FOR EDIT MODE SUPPORT

import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

const PillButton = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="px-3 py-1 h-[23px] rounded-full mr-2 mb-4 items-center justify-center"
    style={{
      borderWidth: 1,
      borderColor: selected ? "#22C55E" : "#0000001A",
      backgroundColor: selected ? "#22C55E17" : "white",
    }}
  >
    <Text
      className="text-[10px]"
      style={{ color: selected ? "#22C55E" : "#00000099" }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const Checkbox = ({ label, selected, onPress }) => (
  <Pressable onPress={onPress} className="flex-row items-center mb-2">
    <View
      className="w-4 h-4 mr-2 mt-3 rounded-sm items-center justify-center"
      style={{
        borderWidth: 1,
        borderColor: selected ? "#22C55E" : "#0000001A",
        backgroundColor: selected ? "#22C55E" : "white",
      }}
    >
      {selected && <Text style={{ color: "white", fontWeight: 'bold' }}>✓</Text>}
    </View>
    <Text className="text-[11px] text-[#00000099]">{label}</Text>
  </Pressable>
);

const RoundOption = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="w-8 h-8 rounded-full items-center mx-2 justify-center"
    style={{
      borderWidth: 1,
      borderColor: selected ? "#22C55E" : "#0000001A",
      backgroundColor: selected ? "#22C55E17" : "transparent",
    }}
  >
    <Text className={`text-sm ${selected ? "text-green-700 font-semibold" : "text-[rgba(0,0,0,0.6)]"}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function PropertyFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, i18n } = useTranslation(); // ✅ Get i18n from useTranslation hook

  // ✅ ADD EDIT MODE STATE
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPropertyId, setEditPropertyId] = useState(null);

  const safeParse = (raw) => {
    if (!raw) return null;
    if (typeof raw === 'string') {
      try { return JSON.parse(raw); } catch (e) { console.warn('parse error', e); return null; }
    }
    if (Array.isArray(raw)) {
      const first = raw[0];
      if (typeof first === 'string') {
        try { return JSON.parse(first); } catch (e) { console.warn('parse error', e); return null; }
      }
      return first;
    }
    if (typeof raw === 'object') return raw;
    return null;
  };

  const baseDetails = safeParse(params.commercialBaseDetails);
  const images = params.images ? JSON.parse(params.images) : [];
  const [visible, setVisible] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  // Location
  const [location, setLocation] = useState('');
  const [neighborhoodArea, setNeighborhoodArea] = useState('');

  // Area
  const [plotArea, setPlotArea] = useState('');
  const [unit, setUnit] = useState('sqft');
  const [length, setLength] = useState('');
  const [breadth, setBreadth] = useState('');
  const [rooms, setRooms] = useState(0);
  const [washroomType, setWashroomType] = useState(null);
  
  // Availability
  const [availability, setAvailability] = useState(null);
  const [ageOfProperty, setAgeOfProperty] = useState(null);
  const [possessionBy, setPossessionBy] = useState("");
  const [expectedMonth, setExpectedMonth] = useState("");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  // ✅ MODIFIED - Load edit data OR draft from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      // ✅ PRIORITY 1: Load data in edit mode
      if (params.editMode === 'true' && params.propertyData) {
        try {
          const property = JSON.parse(params.propertyData);
          setIsEditMode(true);
          setEditPropertyId(params.propertyId);
          
          console.log('📝 Loading Industry for edit:', property._id);
          
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
          
          // Load location and area
          setLocation(getLocalizedText(property.location));
          setNeighborhoodArea(getLocalizedText(property.area));
          
          // Load industry details
          if (property.commercialDetails?.industryDetails) {
            const industry = property.commercialDetails.industryDetails;
            
            setPlotArea(industry.area?.value?.toString() || '');
            setUnit(industry.area?.unit || 'sqft');
            setLength(industry.length?.toString() || '');
            setBreadth(industry.breadth?.toString() || '');
            setWashroomType(industry.washroomType || null);
            setAvailability(industry.availability || null);
            setAgeOfProperty(industry.ageOfProperty || null);
            setPossessionBy(industry.possessionBy || '');
            setExpectedMonth(industry.expectedMonth || '');
          }
          
          console.log('✅ Industry data loaded for editing');
          return; // Don't load draft in edit mode
        } catch (error) {
          console.error('❌ Error loading industry data:', error);
          Alert.alert('Error', 'Failed to load property data');
        }
      }
      
      // ✅ PRIORITY 2: Load draft (only in create mode)
      if (!params.editMode || params.editMode !== 'true') {
        try {
          console.log("📦 Loading Industry draft from AsyncStorage");
          const draft = await AsyncStorage.getItem('draft_industry_details');
          if (draft) {
            const parsed = JSON.parse(draft);
            console.log('✅ Industry draft loaded:', parsed);
            
            setLocation(parsed.location || '');
            setNeighborhoodArea(parsed.neighborhoodArea || params.area || '');
            setPlotArea(parsed.plotArea?.toString() || '');
            setUnit(parsed.unit || 'sqft');
            setLength(parsed.length?.toString() || '');
            setBreadth(parsed.breadth?.toString() || '');
            setWashroomType(parsed.washroomType || null);
            setAvailability(parsed.availability || null);
            setAgeOfProperty(parsed.ageOfProperty || null);
            setPossessionBy(parsed.possessionBy || '');
            setExpectedMonth(parsed.expectedMonth || '');
            console.log('✅ Industry draft loaded successfully');
            return;
          }
        } catch (e) {
          console.log('⚠️ Failed to load Industry draft:', e);
        }

        // ✅ FALLBACK: Load from params if no draft
        if (params.industryDetails) {
          try {
            const prevData = JSON.parse(params.industryDetails);
            console.log('🔄 Restoring from params.industryDetails');
            
            setLocation(prevData.location || '');
            setNeighborhoodArea(prevData.neighborhoodArea || params.area || '');
            setPlotArea(prevData.plotArea?.toString() || '');
            setUnit(prevData.unit || 'sqft');
            setLength(prevData.length?.toString() || '');
            setBreadth(prevData.breadth?.toString() || '');
            setWashroomType(prevData.washroomType || null);
            setAvailability(prevData.availability || null);
            setAgeOfProperty(prevData.ageOfProperty || null);
            setPossessionBy(prevData.possessionBy || '');
            setExpectedMonth(prevData.expectedMonth || '');
          } catch (e) {
            console.log('❌ Could not restore industry data:', e);
          }
        }
        
        // ✅ Always restore area from params if available
        if (params.area) {
          setNeighborhoodArea(params.area);
          console.log('✅ Area restored from params:', params.area);
        }
      }
    };

    loadData();
  }, [params.editMode, params.propertyData, params.propertyId, params.industryDetails, params.area]);

  // ✅ Auto-save draft to AsyncStorage (only in create mode)
  useEffect(() => {
    if (isEditMode) return; // Don't save drafts in edit mode

    const saveDraft = async () => {
      const draftData = {
        location,
        neighborhoodArea,
        plotArea,
        unit,
        length,
        breadth,
        washroomType,
        availability,
        ageOfProperty,
        possessionBy,
        expectedMonth,
        industryKind: baseDetails?.industryKind || params.industryKind,
        timestamp: new Date().toISOString(),
      };

      try {
        await AsyncStorage.setItem('draft_industry_details', JSON.stringify(draftData));
        console.log('💾 Industry draft auto-saved');
      } catch (e) {
        console.log('⚠️ Failed to save Industry draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [location, neighborhoodArea, plotArea, unit, length, breadth, washroomType, 
      availability, ageOfProperty, possessionBy, expectedMonth, baseDetails?.industryKind, params.industryKind, isEditMode]);

  const handleNext = () => {
    if (!location.trim()) {
      Toast.show({
        type: "error",
        text1: t('industry_location_required'),
        text2: t('industry_enter_location'),
      });
      return;
    }

    if (!neighborhoodArea.trim()) {
      Toast.show({
        type: "error",
        text1: t('industry_area_required'),
        text2: t('industry_enter_area'),
      });
      return;
    }

    if (!plotArea.trim()) {
      Toast.show({
        type: "error",
        text1: t('industry_area_required'),
        text2: t('industry_enter_area'),
      });
      return;
    }

    const commercialDetails = {
      subType: "Industry",
      
      industryDetails: {
        location,
        neighborhoodArea,
        area: {
          value: Number(plotArea),
          unit,
        },
        length: Number(length) || undefined,
        breadth: Number(breadth) || undefined,
        washroomType,
        availability,
        ageOfProperty,
        possessionBy,
        expectedMonth,
      },
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/IndustryNext",
      params: {
        commercialDetails: JSON.stringify(commercialDetails),
        images: JSON.stringify(images),
        area: neighborhoodArea.trim(),
        // ✅ Pass edit mode params
        editMode: params.editMode,
        propertyId: params.propertyId,
        propertyData: params.propertyData,
      },
    });
  };

  const handleBack = () => {
    const currentData = {
      location,
      neighborhoodArea,
      plotArea,
      unit,
      length,
      breadth,
      washroomType,
      availability,
      ageOfProperty,
      possessionBy,
      expectedMonth,
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload",
      params: {
        industryDetails: JSON.stringify(currentData),
        images: JSON.stringify(images),
        area: neighborhoodArea.trim(),
        commercialBaseDetails: JSON.stringify({
          subType: "Industry",
          industryKind: baseDetails?.industryKind || params.industryKind,
        }),
      },
    });
  };

  // ✅ Define possession options with translations
  const possessionOptions = [
    t('industry_possession_immediate'),
    t('industry_possession_3months'),
    t('industry_possession_6months'),
    t('industry_possession_2026'),
    t('industry_possession_2027'),
    t('industry_possession_2028'),
    t('industry_possession_2029'),
    t('industry_possession_2030'),
  ];

  const monthOptions = [
    t('hospitality_month_january'),
    t('hospitality_month_february'),
    t('hospitality_month_march'),
    t('hospitality_month_april'),
    t('hospitality_month_may'),
    t('hospitality_month_june'),
    t('hospitality_month_july'),
    t('hospitality_month_august'),
    t('hospitality_month_september'),
    t('hospitality_month_october'),
    t('hospitality_month_november'),
    t('hospitality_month_december'),
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center mt-7 mb-4">
          <TouchableOpacity
            onPress={handleBack}
            className="p-2"
          >
            <Image
              source={require("../../../../../../assets/arrow.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>

          <View className="ml-2">
            <Text className="text-[16px] font-semibold">
              {isEditMode ? t('edit_property') : t('upload_property_title')}
            </Text>
            <Text className="text-[12px] text-[#00000066]">
              {isEditMode ? t('update_property_details') : t('upload_property_subtitle')}
            </Text>
          </View>
        </View>

        {/* Location */}
        <View
          className="bg-white rounded-lg p-4 mb-4"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="text-[15px] text-[#00000060] mb-3">
            {t('industry_location')}<Text className="text-red-500">*</Text>
          </Text>
          <View
            className="flex-row items-center rounded-md p-3 mb-5"
            style={{
              backgroundColor: "#D9D9D91C",
              borderWidth: 1,
              borderColor: "#0000001A",
            }}
          >
            <Image
              source={require("../../../../../../assets/location.png")}
              style={{ width: 18, height: 18, marginRight: 8 }}
            />
            <TextInput
              placeholder={t('industry_enter_location')}
              value={location}
              onChangeText={setLocation}
              onFocus={() => setFocusedField("location")}
              onBlur={() => setFocusedField(null)}
              className="flex-1 rounded-lg"
              style={{
                borderWidth: 1,
                borderColor: focusedField === "location" ? "#22C55E" : "#0000001A",
              }}
            />
          </View>

          <Text className="text-[15px] text-[#00000060] mb-3">
            {t('industry_neighborhood')}<Text className="text-red-500">*</Text>
          </Text>
          <View
            className="flex-row items-center rounded-md p-3 mb-5"
            style={{
              backgroundColor: "#D9D9D91C",
              borderWidth: 1,
              borderColor: "#0000001A",
            }}
          >
            <Image
              source={require("../../../../../../assets/location.png")}
              style={{ width: 18, height: 18, marginRight: 8 }}
            />
            <TextInput
              placeholder={t('industry_enter_area')}
              value={neighborhoodArea}
              onChangeText={setNeighborhoodArea}
              onFocus={() => setFocusedField("neighborhoodArea")}
              onBlur={() => setFocusedField(null)}
              className="flex-1 rounded-lg"
              style={{
                borderWidth: 1,
                borderColor: focusedField === "neighborhoodArea" ? "#22C55E" : "#0000001A",
              }}
            />
          </View>
        </View>

        {/* Area & Details Box */}
        <View
          className="bg-white rounded-lg p-4 mb-6"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="text-[16px] font-bold text-gray-600 mb-2">
            {t('industry_add_room_details')}
          </Text>

          <Text className="text-[14px] text-gray-500 mr-4">
            {t('industry_no_of_washrooms')}
          </Text>

          <View className="flex-row mt-4">
            <PillButton
              label={t('industry_washroom_none')}
              selected={washroomType === "None"}
              onPress={() => setWashroomType("None")}
            />
            <PillButton
              label={t('industry_washroom_shared')}
              selected={washroomType === "Shared"}
              onPress={() => setWashroomType("Shared")}
            />
            {["1", "2", "3", "4+"].map((num) => (
              <RoundOption
                key={num}
                label={num}
                selected={washroomType === num}
                onPress={() => setWashroomType(num)}
              />
            ))}
          </View>

          <Text className="text-[14px] font-medium text-[#00000099] mb-3">
            {t('industry_add_area_details')}<Text className="text-red-500">*</Text>
          </Text>
          <View
            className="flex-row items-center mb-3 rounded-md"
            style={{
              borderWidth: 1,
              borderColor: focusedField === "plotArea" ? "#22C55E" : "#0000001A",
              backgroundColor: "#D9D9D91C",
              height: 52,
            }}
          >
            <TextInput
              placeholder="0"
              value={plotArea}
              onChangeText={(text) => setPlotArea(text.replace(/[^0-9]/g, ""))}
              className="flex-1 px-3"
              onFocus={() => setFocusedField("plotArea")}
              onBlur={() => setFocusedField(null)}
              style={{ height: 52 }}
              keyboardType="numeric"
            />

            <View style={{ width: 1, backgroundColor: "#0000001A", height: "60%" }} />
            <View style={{ width: 100 }}>
              <Picker
                selectedValue={unit}
                onValueChange={(v) => setUnit(v)}
                mode="dropdown"
                style={{ height: 52, width: "100%" }}
              >
                <Picker.Item label={t('industry_unit_sqft')} value="sqft" />
                <Picker.Item label={t('industry_unit_sqm')} value="sqm" />
                <Picker.Item label={t('industry_unit_acre')} value="acre" />
              </Picker>
            </View>
          </View>

          <Text className="text-[15px] text-[#00000099] font-bold mb-2">
            {t('industry_availability_status')}
          </Text>
          <View className="flex-row mb-3">
            <PillButton
              label={t('industry_ready_to_move')}
              selected={availability === "Ready"}
              onPress={() => setAvailability("Ready")}
            />
            <PillButton
              label={t('industry_under_construction')}
              selected={availability === "UnderConstruction"}
              onPress={() => setAvailability("UnderConstruction")}
            />
          </View>

          {availability === "Ready" && (
            <>
              <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                {t('industry_age_of_property')}
              </Text>
              <View className="flex-row flex-wrap mb-4">
                {[
                  { key: "0-1 years", label: t('industry_age_0_1') },
                  { key: "1-5 years", label: t('industry_age_1_5') },
                  { key: "5-10 years", label: t('industry_age_5_10') },
                  { key: "10+ years", label: t('industry_age_10plus') }
                ].map((age) => (
                  <PillButton
                    key={age.key}
                    label={age.label}
                    selected={ageOfProperty === age.key}
                    onPress={() => setAgeOfProperty(age.key)}
                  />
                ))}
              </View>
            </>
          )}

          {availability === "UnderConstruction" && (
            <>
              <TouchableOpacity
                onPress={() => setVisible(visible === "possessionBy" ? null : "possessionBy")}
                className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
              >
                <Text className="text-gray-800 text-left">
                  {possessionBy || t('industry_expected_by')}
                </Text>
                <Ionicons name="chevron-down" size={18} />
              </TouchableOpacity>

              {visible === "possessionBy" && (
                <View 
                  className="bg-white rounded-lg shadow-lg -mt-4 mb-4" 
                  style={{ borderWidth: 1, borderColor: "#0000001A" }}
                >
                  {possessionOptions.map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        setPossessionBy(item);
                        setVisible(null);
                        if (item.includes("By")) {
                          setShowMonthDropdown(true);
                        } else {
                          setShowMonthDropdown(false);
                          setExpectedMonth("");
                        }
                      }}
                      className={`p-4 border-b border-gray-200 ${
                        possessionBy === item ? "bg-green-500" : "bg-white"
                      }`}
                    >
                      <Text className={`${
                        possessionBy === item ? "text-white" : "text-gray-800"
                      }`}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {showMonthDropdown && (
                <>
                  <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                    {t('hospitality_expected_month')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setVisible(visible === "expectedMonth" ? null : "expectedMonth")}
                    className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
                  >
                    <Text className="text-gray-800 text-left">
                      {expectedMonth || t('hospitality_select_month')}
                    </Text>
                    <Ionicons name="chevron-down" size={18} />
                  </TouchableOpacity>

                  {visible === "expectedMonth" && (
                    <View 
                      className="bg-white rounded-lg shadow-lg -mt-4 mb-4" 
                      style={{ borderWidth: 1, borderColor: "#0000001A" }}
                    >
                      {monthOptions.map((item) => (
                        <TouchableOpacity
                          key={item}
                          onPress={() => {
                            setExpectedMonth(item);
                            setVisible(null);
                          }}
                          className={`p-4 border-b border-gray-200 ${
                            expectedMonth === item ? "bg-green-500" : "bg-white"
                          }`}
                        >
                          <Text className={`${
                            expectedMonth === item ? "text-white" : "text-gray-800"
                          }`}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              )}
            </>
          )}
          
        </View>
      </ScrollView>

      <View className="bg-white border-t border-gray-200">
        <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-12">
          <TouchableOpacity
            className="px-8 py-3 rounded-lg bg-gray-200 mx-3"
            onPress={handleBack}
          >
            <Text className="font-semibold">{t('button_cancel')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-10 py-3 rounded-lg bg-green-500"
            onPress={handleNext}
          >
            <Text className="text-white font-semibold">{t('button_next')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}