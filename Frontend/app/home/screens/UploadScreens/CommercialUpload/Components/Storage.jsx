//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/Storage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertToEnglish } from '../../../../../../utils/reverseTranslation';
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
import { useTranslation } from 'react-i18next'; // ✅ ADD THIS

export const PillButton = ({ label, selected, onPress }) => (
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

export const Checkbox = ({ label, selected, onPress }) => (
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
  const { t } = useTranslation(); // ✅ ADD THIS

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
  const [washroomType, setWashroomType] = useState(null);

  // Additional Storage Fields
  const [ceilingHeight, setCeilingHeight] = useState('');
  const [flooring, setFlooring] = useState('');
  const [ventilation, setVentilation] = useState(null);
  const [temperatureControl, setTemperatureControl] = useState(false);
  const [covered, setCovered] = useState(null);
  const [security, setSecurity] = useState([]);
  const [accessibility, setAccessibility] = useState('');

  // Availability
  const [availability, setAvailability] = useState(null);
  const [ageOfProperty, setAgeOfProperty] = useState(null);
  const [possessionBy, setPossessionBy] = useState("");
const [expectedMonth, setExpectedMonth] = useState("");
const [showMonthDropdown, setShowMonthDropdown] = useState(false);
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

  const baseDetails = useMemo(() => {
    try {
      if (!params.commercialBaseDetails) return null;
      if (typeof params.commercialBaseDetails === 'object') return params.commercialBaseDetails;
      return JSON.parse(params.commercialBaseDetails);
    } catch (e) {
      console.error('❌ Error parsing baseDetails:', e);
      return null;
    }
  }, [params.commercialBaseDetails]);

  // Load draft from AsyncStorage
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await AsyncStorage.getItem('draft_storage_details');
        if (draft) {
          const prevData = JSON.parse(draft);
          console.log('📦 Loading Storage draft from AsyncStorage');

          setLocation(prevData.location || '');
          setNeighborhoodArea(prevData.neighborhoodArea || '');
          setPlotArea(prevData.plotArea?.toString() || '');
          setUnit(prevData.unit || 'sqft');
          setLength(prevData.length?.toString() || '');
          setBreadth(prevData.breadth?.toString() || '');
          setWashroomType(prevData.washroomType || null);
          setCeilingHeight(prevData.ceilingHeight?.toString() || '');
          setFlooring(prevData.flooring || '');
          setVentilation(prevData.ventilation || null);
          setTemperatureControl(prevData.temperatureControl || false);
          setCovered(prevData.covered || null);
          setSecurity(prevData.security || []);
          setAccessibility(prevData.accessibility || '');
          setAvailability(prevData.availability || null);
          setAgeOfProperty(prevData.ageOfProperty || null);
          setPossessionBy(prevData.possessionBy || '');
          setExpectedMonth(prevData.expectedMonth || '');
          setShowMonthDropdown(false); // Add this line after setPossessionBy
          console.log('✅ Storage draft loaded');
          return;
        }
      } catch (e) {
        console.log('⚠️ Failed to load Storage draft:', e);
      }

      // Fallback to params
      if (params.storageDetails) {
        try {
          const prevData = JSON.parse(params.storageDetails);
          setLocation(prevData.location || '');
          setNeighborhoodArea(prevData.neighborhoodArea || '');
          setPlotArea(prevData.storageArea?.value?.toString() || '');
          setUnit(prevData.storageArea?.unit || 'sqft');
          setLength(prevData.dimensions?.length?.toString() || '');
          setBreadth(prevData.dimensions?.breadth?.toString() || '');
          setWashroomType(prevData.washroomType || null);
          setCeilingHeight(prevData.ceilingHeight?.toString() || '');
          setFlooring(prevData.flooring || '');
          setVentilation(prevData.ventilation || null);
          setTemperatureControl(prevData.temperatureControl || false);
          setCovered(prevData.covered || null);
          setSecurity(prevData.security || []);
          setAccessibility(prevData.accessibility || '');
          setAvailability(prevData.availability || null);
          setAgeOfProperty(prevData.ageOfProperty || null);
          setPossessionBy(prevData.possession?.expectedBy || '');

          console.log('✅ Restored from params');
        } catch (e) {
          console.log('❌ Could not restore storage data:', e);
        }
      }

      if (params.area) {
        setNeighborhoodArea(params.area);
      }
    };

    loadDraft();
  }, [params.storageDetails, params.area, params.commercialBaseDetails, params.storageType]);

  // Auto-save draft
  useEffect(() => {
    const saveDraft = async () => {
      const draftData = {
        location,
        neighborhoodArea,
        plotArea,
        unit,
        length,
        breadth,
        washroomType,
        ceilingHeight,
        flooring,
        ventilation,
        temperatureControl,
        covered,
        security,
        accessibility,
        availability,
        ageOfProperty,
        possessionBy,
        expectedMonth,
        storageType: baseDetails?.storageType,
        timestamp: new Date().toISOString(),
      };

      try {
        await AsyncStorage.setItem('draft_storage_details', JSON.stringify(draftData));
        console.log('💾 Storage draft auto-saved');
      } catch (e) {
        console.log('⚠️ Failed to save Storage draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [location, neighborhoodArea, plotArea, unit, length, breadth, washroomType,
    ceilingHeight, flooring, ventilation, temperatureControl, covered,
    security, accessibility, availability, ageOfProperty, possessionBy,expectedMonth,
    baseDetails?.storageType]);

  const handleNext = () => {
  // ✅ GET storageType from baseDetails or params
  const rawStorageType = baseDetails?.storageType ||
    baseDetails?.storageKind ||
    params.storageType;

  if (!rawStorageType) {
    Toast.show({
      type: "error",
      text1: "Storage type missing",
      text2: "Please go back and select storage type",
    });
    return;
  }

  // ✅ CONVERT Telugu/Hindi to English
  const storageTypeMap = {
    'వేర్‌హౌస్': 'Warehouse',
    'गोदाम': 'Warehouse',
    'కోల్డ్ స్టోరేజ్': 'Cold Storage',
    'कोल्ड स्टोरेज': 'Cold Storage'
  };

  const storageType = storageTypeMap[rawStorageType] || rawStorageType;

  console.log('🔄 Storage Type Conversion:', {
    raw: rawStorageType,
    converted: storageType
  });

  if (!location.trim()) {
    Toast.show({ type: "error", text1: t('storage_location_required') });
    return;
  }

  if (!neighborhoodArea.trim()) {
    Toast.show({ type: "error", text1: t('storage_area_required') });
    return;
  }

  if (!plotArea.trim()) {
    Toast.show({ type: "error", text1: t('storage_area_required_error') });
    return;
  }

  // ✅ NEW: Validate flooring type
  if (!flooring) {
    Toast.show({ 
      type: "error", 
      text1: "Flooring Type Required",
      text2: "Please select the type of flooring for your storage space"
    });
    return;
  }

  // ✅ NEW: Validate accessibility
  if (!accessibility) {
    Toast.show({ 
      type: "error", 
      text1: "Loading Access Required",
      text2: "Please specify the loading access type for your storage facility"
    });
    return;
  }

  // ✅ BUILD COMPLETE COMMERCIAL DETAILS OBJECT
  const newCommercialDetails = {
    subType: "Storage",
    propertyTitle: baseDetails?.propertyTitle,

    storageDetails: {
      storageType: storageType,
      location,
      neighborhoodArea,

      storageArea: {
        value: Number(plotArea),
        unit,
      },

      dimensions: {
        length: length ? Number(length) : null,
        breadth: breadth ? Number(breadth) : null,
      },

      ceilingHeight: ceilingHeight ? Number(ceilingHeight) : null,
      flooring,
      ventilation,
      temperatureControl,
      covered,
      security,
      accessibility,
      washroomType,
      availability,
      ageOfProperty,

      possession:
        availability === "UnderConstruction"
          ? { expectedBy: possessionBy }
          : null,
    },
  };

  router.push({
    pathname: "/home/screens/UploadScreens/CommercialUpload/Components/StorageNext",
    params: {
      commercialDetails: JSON.stringify(newCommercialDetails),
      images: JSON.stringify(images),
      area: neighborhoodArea,
      propertyTitle: baseDetails?.propertyTitle,
      // ✅ ADD storageType for back navigation
      storageType: storageType,
      commercialBaseDetails: JSON.stringify({
        subType: "Storage",
        storageType: storageType,
        propertyTitle: baseDetails?.propertyTitle,
      }),
    },
  });
};

  const toggleArrayItem = (setter, array, value) => {
    if (array.includes(value)) {
      setter(array.filter((item) => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  // ✅ Define possession options with translations
  const possessionOptions = [
    t('storage_possession_immediate'),
    t('storage_possession_3months'),
    t('storage_possession_6months'),
    t('storage_possession_2026'),
    t('storage_possession_2027'),
    t('storage_possession_2028'),
    t('storage_possession_2029'),
    t('storage_possession_2030'),
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

  //Define flooring options

  const flooringOptions = [
    t('storage_flooring_concrete'),
    t('storage_flooring_tiles'),
    t('storage_flooring_epoxy'),
    t('storage_flooring_other'),
  ];
  return (

    <View className="flex-1 bg-gray-50 mt-8">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity
          onPress={() => {
            const currentStorageData = {
              location,
              neighborhoodArea,
              plotArea,
              unit,
              length,
              breadth,
              washroomType,
              ceilingHeight,
              flooring,
              ventilation,
              temperatureControl,
              covered,
              security,
              accessibility,
              availability,
              ageOfProperty,
              possessionBy,
              storageType: baseDetails?.storageType,
            };

            {/* Header */ }




            router.push({
              pathname: "/home/screens/UploadScreens/CommercialUpload",
              params: {
                storageDetails: JSON.stringify(currentStorageData),
                images: JSON.stringify(images),
                area: neighborhoodArea,
                propertyTitle: baseDetails?.propertyTitle,
                storageType: baseDetails?.storageType || currentStorageData.storageType,
                commercialBaseDetails: JSON.stringify({
                  subType: "Storage",
                  storageType: baseDetails?.storageType,
                  propertyTitle: baseDetails?.propertyTitle,
                }),
              },
            });
          }}
          className="p-2"
        >
          <Image
            source={require("../../../../../../assets/arrow.png")}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>

        <View className="ml-2">
          <Text className="text-[16px] font-semibold">
            {t('upload_property_title')}
          </Text>
          <Text className="text-[12px] text-[#00000066]">
            {t('upload_property_subtitle')}
          </Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >


        {/* Location */}
        <View
          className="bg-white rounded-lg p-4 mb-4"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="text-[15px] text-[#00000060] mb-3">
            {t('storage_location')}<Text className="text-red-500">*</Text>
          </Text>
          <View
            className="flex-row items-center rounded-md p-3 mb-3"
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
              placeholder={t('storage_enter_location')}
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

          {/* Neighborhood Area Field */}
          <Text className="text-[14px] font-medium text-[#00000099] mb-3">
            {t('storage area neighborhood')}<Text className="text-red-500">*</Text>
          </Text>
          <View
            className="flex-row items-center rounded-md p-3 mb-5"
            style={{
              borderWidth: 1,
              borderColor: focusedField === "neighborhoodArea" ? "#22C55E" : "#0000001A",
              backgroundColor: "#D9D9D91C",
              height: 52,
            }}
          >
            <Image
              source={require("../../../../../../assets/location.png")}
              style={{ width: 18, height: 18, marginRight: 8 }}
            />
            <TextInput
              className="flex-1 py-1"
              placeholder={t('storage enter area')}
              value={neighborhoodArea}
              onChangeText={setNeighborhoodArea}
              onFocus={() => setFocusedField("neighborhoodArea")}
              onBlur={() => setFocusedField(null)}

            />
          </View>
        </View>

        {/* Area & Details Box */}
        <View
          className="bg-white rounded-lg p-4 mb-6"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="text-[14px] font-medium text-[#00000099] mb-3">
            {t('storage_storage_area')}<Text className="text-red-500">*</Text>
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
                <Picker.Item label="sqft" value="sqft" />
                <Picker.Item label="sqm" value="sqm" />
                <Picker.Item label="acre" value="acre" />
              </Picker>
            </View>
          </View>

          <Text className="text-[15px] font-bold text-[#00000099] mb-2">
            {t('storage_dimensions_optional')}
          </Text>
          <TextInput
            placeholder={t('storage_length_placeholder')}
            value={length}
            onChangeText={(text) => setLength(text.replace(/[^0-9]/g, ""))}
            className="flex-1 mb-3 rounded-md p-3"
            onFocus={() => setFocusedField("length")}
            onBlur={() => setFocusedField(null)}
            style={{
              height: 50,
              backgroundColor: "#D9D9D91C",
              borderWidth: 1,
              borderColor: focusedField === "length" ? "#22C55E" : "#0000001A",
            }}
            keyboardType="numeric"
          />

          <TextInput
            placeholder={t('storage_breadth_placeholder')}
            value={breadth}
            onChangeText={(text) => setBreadth(text.replace(/[^0-9]/g, ""))}
            className="flex-1 mb-3 rounded-md p-3"
            onFocus={() => setFocusedField("breadth")}
            onBlur={() => setFocusedField(null)}
            style={{
              height: 50,
              backgroundColor: "#D9D9D91C",
              borderWidth: 1,
              borderColor: focusedField === "breadth" ? "#22C55E" : "#0000001A",
            }}
            keyboardType="numeric"
          />

          {/* Ceiling Height */}
          <Text className="text-[15px] font-bold text-[#00000099] mb-2">
            {t('storage_ceiling_height')}
          </Text>
          <TextInput
            placeholder={t('storage_height_placeholder')}
            value={ceilingHeight}
            onChangeText={(text) => setCeilingHeight(text.replace(/[^0-9]/g, ""))}
            className="flex-1 mb-3 rounded-md p-3"
            style={{
              height: 50,
              backgroundColor: "#D9D9D91C",
              borderWidth: 1,
              borderColor: "#0000001A",
            }}
            keyboardType="numeric"
          />

          {/* Flooring Type */}
          <Text className="text-[15px] font-bold text-[#00000099] mb-2">
            {t('storage_flooring_type')}
          </Text>
          <View className="flex-row flex-wrap mb-3">
            {flooringOptions.map((type, index) => {
              const values = ["Concrete", "Tiles", "Epoxy", "Other"];
              return (
                <PillButton
                  key={type}
                  label={type}
                  selected={flooring === values[index]}
                  onPress={() => setFlooring(values[index])}
                />
              );
            })}
          </View>

          {/* Ventilation */}
          <Text className="text-[15px] font-bold text-[#00000099] mb-2">
            {t('storage_ventilation')}
          </Text>
          <View className="flex-row mb-3">
            <PillButton
              label={t('storage_ventilation_natural')}
              selected={ventilation === "Natural"}
              onPress={() => setVentilation("Natural")}
            />
            <PillButton
              label={t('storage_ventilation_mechanical')}
              selected={ventilation === "Mechanical"}
              onPress={() => setVentilation("Mechanical")}
            />
            <PillButton
              label={t('storage_ventilation_both')}
              selected={ventilation === "Both"}
              onPress={() => setVentilation("Both")}
            />
          </View>

          {/* Temperature Control */}
          <Checkbox
            label={t('storage_temperature_controlled')}
            selected={temperatureControl}
            onPress={() => setTemperatureControl(!temperatureControl)}
          />

          {/* Covered Storage */}
          <Text className="text-[15px] font-bold text-[#00000099] mb-2">
            {t('storage_storage_type')}
          </Text>
          <View className="flex-row mb-3">
            <PillButton
              label={t('storage_covered')}
              selected={covered === true}
              onPress={() => setCovered(true)}
            />
            <PillButton
              label={t('storage_open')}
              selected={covered === false}
              onPress={() => setCovered(false)}
            />
          </View>

          {/* Security Features */}
          <Text className="text-[15px] font-bold text-[#00000099] mb-2">
            {t('storage_security_features')}
          </Text>
          <View className="flex-row flex-wrap mb-3">
            {[
              { label: t('storage_security_cctv'), value: "CCTV" },
              { label: t('storage_security_guard'), value: "Security Guard" },
              { label: t('storage_security_alarm'), value: "Alarm System" },
              { label: t('storage_security_fire'), value: "Fire Safety" }
            ].map((sec) => (
              <PillButton
                key={sec.value}
                label={sec.label}
                selected={security.includes(sec.value)}
                onPress={() => toggleArrayItem(setSecurity, security, sec.value)}
              />
            ))}
          </View>

          {/* Accessibility */}
          <Text className="text-[15px] font-bold text-[#00000099] mb-2">
            {t('storage_loading_access')}
          </Text>
          <View className="flex-row flex-wrap mb-3">
            {[
              { label: t('storage_access_dock'), value: "Dock Level" },
              { label: t('storage_access_ground'), value: "Ground Level" },
              { label: t('storage_access_ramp'), value: "Ramp Access" }
            ].map((acc) => (
              <PillButton
                key={acc.value}
                label={acc.label}
                selected={accessibility === acc.value}
                onPress={() => setAccessibility(acc.value)}
              />
            ))}
          </View>

          {/* Washroom Details */}
          <Text className="text-[14px] text-gray-600 mb-2">
            {t('storage_washroom_facilities')}
          </Text>
          <View className="flex-row mt-4">
            <PillButton
              label={t('storage_washroom_none')}
              selected={washroomType === "None"}
              onPress={() => setWashroomType("None")}
            />
            <PillButton
              label={t('storage_washroom_shared')}
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

          <Text className="text-[15px] text-[#00000099] font-bold mb-2 mt-4">
            {t('storage_availability_status')}
          </Text>
          <View className="flex-row mb-3">
            <PillButton
              label={t('storage_ready_to_move')}
              selected={availability === "Ready"}
              onPress={() => setAvailability("Ready")}
            />
            <PillButton
              label={t('storage_under_construction')}
              selected={availability === "UnderConstruction"}
              onPress={() => setAvailability("UnderConstruction")}
            />
          </View>

          {availability === "Ready" && (
            <>
              <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                {t('storage_age_of_property')}
              </Text>
              <View className="flex-row flex-wrap mb-4">
                <PillButton label={t('storage_age_0_1')} selected={ageOfProperty === "0-1 years"} onPress={() => setAgeOfProperty("0-1 years")} />
                <PillButton label={t('storage_age_1_5')} selected={ageOfProperty === "1-5 years"} onPress={() => setAgeOfProperty("1-5 years")} />
                <PillButton label={t('storage_age_5_10')} selected={ageOfProperty === "5-10 years"} onPress={() => setAgeOfProperty("5-10 years")} />
                <PillButton label={t('storage_age_10plus')} selected={ageOfProperty === "10+ years"} onPress={() => setAgeOfProperty("10+ years")} />
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
                          <Image 
                            source={require("../../../../../../assets/arrow.png")} 
                            style={{ width: 20, height: 20 }} 
                          />
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
                              <Image 
                                source={require("../../../../../../assets/arrow.png")} 
                                style={{ width: 20, height: 20 }} 
                              />
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
      <View className="flex-row justify-end  space-x-3 mx-3 mb-12">
        <TouchableOpacity
          className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
          onPress={() => {
            const currentStorageData = {
              location,
              neighborhoodArea,
              plotArea,
              unit,
              length,
              breadth,
              washroomType,
              ceilingHeight,
              flooring,
              ventilation,
              temperatureControl,
              covered,
              security,
              accessibility,
              availability,
              ageOfProperty,
              possessionBy,
              storageType: baseDetails?.storageType,
            };

            router.push({
              pathname: "/home/screens/UploadScreens/CommercialUpload",
              params: {
                storageDetails: JSON.stringify(currentStorageData),
                images: JSON.stringify(images),
                area: neighborhoodArea,
                propertyTitle: baseDetails?.propertyTitle,
                storageType: baseDetails?.storageType || currentStorageData.storageType,
                commercialBaseDetails: JSON.stringify({
                  subType: "Storage",
                  storageType: baseDetails?.storageType,
                  propertyTitle: baseDetails?.propertyTitle,
                }),
              },
            });
          }}
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