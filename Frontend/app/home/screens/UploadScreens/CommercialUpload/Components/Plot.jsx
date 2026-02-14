// Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/Plot.jsx

import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import LocationSection from "components/LocationSection";
import Toast from "react-native-toast-message";
import { useTranslation } from 'react-i18next';
import { convertToEnglish } from '../../../../../../utils/reverseTranslation';

/* ---------- UI HELPERS ---------- */
const PillButton = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-[14px] py-[6px] rounded-full border mr-2 mb-2 ${selected
      ? "border-[#22C55E] bg-[#22C55E17]"
      : "border-[#E5E7EB] bg-white"
      }`}
  >
    <Text className={`text-[12px] ${selected ? "text-[#22C55E]" : "text-[#6B7280]"}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

// ✅ Data inspection helper - logs all available data paths
const inspectPropertyData = (property, label = "Property Data") => {
  console.log(`\n🔍 === ${label} ===`);
  console.log('📌 Root keys:', Object.keys(property || {}).join(', '));
  console.log('📌 commercialDetails keys:', Object.keys(property.commercialDetails || {}).join(', '));
  console.log('📌 plotDetails:', JSON.stringify(property.commercialDetails?.plotDetails, null, 2));
  console.log(`🔍 === End ${label} ===\n`);
};

export default function Plot() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, i18n } = useTranslation();

  // ✅ Parse params safely
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

  const images = params.images ? safeParse(params.images) || [] : [];
  const baseDetails = safeParse(params.commercialBaseDetails);
  const propertyTitle = baseDetails?.propertyTitle || params.propertyTitle || "";

  const plotKindFromParams = baseDetails?.plotKind ||
    params.plotKind ||
    safeParse(params.plotDetails)?.plotKind ||
    '';

  console.log('🔍 Plot.jsx mounted - plotKindFromParams:', plotKindFromParams);

  /* ---------- STATE ---------- */
  const [location, setLocation] = useState("");
  const [locality, setLocality] = useState("");
  const [neighborhoodArea, setNeighborhoodArea] = useState("");
  const [plotArea, setPlotArea] = useState("");
  const [plotKind, setPlotKind] = useState(plotKindFromParams || "");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [roadWidth, setRoadWidth] = useState("");
  const [openSides, setOpenSides] = useState("");
  const [constructionDone, setConstructionDone] = useState("");
  const [possessionBy, setPossessionBy] = useState("");
  const [expectedMonth, setExpectedMonth] = useState("");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [constructionTypes, setConstructionTypes] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
  const [visible, setVisible] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPropertyId, setEditPropertyId] = useState(null);
  const [originalPropertyData, setOriginalPropertyData] = useState(null); // ✅ Store original property

// Add monthOptions constant with the other constants (around line 56)
const monthOptions = [
  t('month_january'),
  t('month_february'),
  t('month_march'),
  t('month_april'),
  t('month_may'),
  t('month_june'),
  t('month_july'),
  t('month_august'),
  t('month_september'),
  t('month_october'),
  t('month_november'),
  t('month_december'),
];
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

  const toggleConstruction = (value) => {
    if (constructionTypes.includes(value)) {
      setConstructionTypes(constructionTypes.filter(v => v !== value));
    } else {
      setConstructionTypes([...constructionTypes, value]);
    }
  };

  // ✅ Load data from AsyncStorage or edit mode
  useEffect(() => {
    const loadData = async () => {
      console.log('\n🔄 === PLOT.JSX LOAD DATA START ===');
      console.log('📍 params.editMode:', params.editMode);
      console.log('📍 params.propertyId:', params.propertyId);
      console.log('📍 params.propertyData exists:', !!params.propertyData);
      
      // ✅ PRIORITY 1: Load data in edit mode
      if (params.editMode === 'true' && params.propertyData) {
        console.log('✅ TAKING EDIT MODE PATH');
        try {
          const property = JSON.parse(params.propertyData);
          setIsEditMode(true);
          setEditPropertyId(params.propertyId);
          setOriginalPropertyData(property); // ✅ Store original data
          
          console.log('📝 Loading Plot for edit:', property._id);
          inspectPropertyData(property, "Plot Edit Mode");
          
          // ✅ ADD MASTER DEBUGGING LOG
          console.log('\n🎯 PLOT EDIT MODE - COMPLETE DATA INSPECTION:');
          console.log('📌 property._id:', property._id);
          console.log('📌 property.location:', property.location);
          console.log('📌 property.area:', property.area);
          console.log('📌 property.expectedPrice:', property.expectedPrice);
          console.log('📌 Has commercialDetails:', !!property.commercialDetails);
          if (property.commercialDetails) {
            console.log('📌 commercialDetails.plotDetails:', !!property.commercialDetails.plotDetails);
            if (property.commercialDetails.plotDetails) {
              console.log('  - plotDetails.area:', property.commercialDetails.plotDetails.area);
              console.log('  - plotDetails.dimensions:', property.commercialDetails.plotDetails.dimensions);
              console.log('  - plotDetails.length:', property.commercialDetails.plotDetails.length);
              console.log('  - plotDetails.breadth:', property.commercialDetails.plotDetails.breadth);
              console.log('  - plotDetails.locality:', property.commercialDetails.plotDetails.locality);
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
          
          // Load location and area
          setLocation(getLocalizedText(property.location));
          setNeighborhoodArea(getLocalizedText(property.area));
          
          // Load plot details
          if (property.commercialDetails?.plotDetails) {
            const plot = property.commercialDetails.plotDetails;
            
            console.log('📊 Plot Details from DB:', {
              locality: plot.locality,
              area: plot.area,
              plotKind: plot.plotKind,
              dimensions: plot.dimensions,
              roadWidth: plot.roadWidth,
              openSides: plot.openSides,
              constructionDone: plot.constructionDone,
              possessionBy: plot.possessionBy,
              expectedMonth: plot.expectedMonth,
              constructionTypes: plot.constructionTypes,
            });
            
            setLocality(getLocalizedText(plot.locality) || '');
            setPlotArea(plot.area?.toString() || '');
            setPlotKind(plot.plotKind || '');
            setLength(plot.dimensions?.length?.toString() || '');
            setBreadth(plot.dimensions?.breadth?.toString() || '');
            setRoadWidth(plot.roadWidth?.toString() || '');
            setOpenSides(plot.openSides || '');
            setConstructionDone(plot.constructionDone || '');
            setPossessionBy(plot.possessionBy || '');
            setExpectedMonth(plot.expectedMonth || '');
            setConstructionTypes(plot.constructionTypes || []);
            
            console.log('✅ ALL STATES SET - Checking values...');
            console.log('  🔍 Full plotDetails JSON:', JSON.stringify(plot, null, 2));
          } else if (property.plotDetails) {
            // ✅ FALLBACK 1: Try loading from property.plotDetails directly
            console.log('📦 Fallback 1: Loading from property.plotDetails');
            console.log('📦 property.plotDetails:', JSON.stringify(property.plotDetails, null, 2));
            const plot = property.plotDetails;
            setLocality(getLocalizedText(plot.locality) || '');
            setPlotArea(plot.area?.toString() || '');
            setPlotKind(plot.plotKind || '');
            setLength(plot.dimensions?.length?.toString() || plot.length?.toString() || '');
            setBreadth(plot.dimensions?.breadth?.toString() || plot.breadth?.toString() || '');
            setRoadWidth(plot.roadWidth?.toString() || '');
            setOpenSides(plot.openSides || '');
            setConstructionDone(plot.constructionDone || '');
            setPossessionBy(plot.possessionBy || '');
            setExpectedMonth(plot.expectedMonth || '');
            setConstructionTypes(plot.constructionTypes || []);
            console.log('✅ Fallback 1 SET - Plot dimensions from property.plotDetails');
          } else if (property.commercialDetails?.plotDetails?.plotDetails) {
            // ✅ FALLBACK 2: Try deeper nesting
            console.log('📦 Fallback 2: Loading from property.commercialDetails.plotDetails.plotDetails');
            const plot = property.commercialDetails.plotDetails.plotDetails;
            setLocality(getLocalizedText(plot.locality) || '');
            setPlotArea(plot.area?.toString() || '');
            setPlotKind(plot.plotKind || '');
            setLength(plot.dimensions?.length?.toString() || plot.length?.toString() || '');
            setBreadth(plot.dimensions?.breadth?.toString() || plot.breadth?.toString() || '');
            setRoadWidth(plot.roadWidth?.toString() || '');
            setOpenSides(plot.openSides || '');
            setConstructionDone(plot.constructionDone || '');
            setPossessionBy(plot.possessionBy || '');
            setExpectedMonth(plot.expectedMonth || '');
            setConstructionTypes(plot.constructionTypes || []);
            console.log('✅ Fallback 2 SET');
          } else if (property.dimensions) {
            // ✅ FALLBACK 3: Check if dimensions are at top level
            console.log('📦 Fallback 3: Found dimensions at top level');
            console.log('📦 property.dimensions:', JSON.stringify(property.dimensions, null, 2));
            setLength(property.dimensions?.length?.toString() || property.length?.toString() || '');
            setBreadth(property.dimensions?.breadth?.toString() || property.breadth?.toString() || '');
            console.log('✅ Fallback 3 SET - top-level dimensions');
          } else {
            console.warn('⚠️  No plot details found in ANY expected locations');
            console.log('🔍 Full property structure:', JSON.stringify(property, null, 2));
            console.log('📌 Checking for alternate paths...');
            console.log('  - property.length:', property.length);
            console.log('  - property.breadth:', property.breadth);
            console.log('  - property.area:', property.area);
            console.log('  - property.plotArea:', property.plotArea);
          }
          
          console.log('✅ Plot data loaded for editing');
          console.log('🔄 === PLOT.JSX LOAD DATA END (EDIT MODE) ===\n');
          return; // Don't load draft in edit mode
        } catch (error) {
          console.error('❌ Error loading plot data:', error);
          Alert.alert('Error', 'Failed to load property data');
        }
      }
      
      console.log('❌ NOT in edit mode, checking draft...');
      // ✅ PRIORITY 2: Load draft from AsyncStorage (only in create mode)
      if (!params.editMode || params.editMode !== 'true') {
        console.log('✅ TAKING DRAFT PATH');
        try {
          console.log("📦 Loading Plot draft from AsyncStorage");
          const draft = await AsyncStorage.getItem('draft_plot_details');
          if (draft) {
            const parsed = JSON.parse(draft);
            console.log('✅ Plot draft loaded:', parsed);

            setLocation(parsed.location || '');
            setLocality(parsed.locality || '');
            setNeighborhoodArea(parsed.neighborhoodArea || params.area || '');
            setPlotArea(parsed.plotArea?.toString() || '');
            setLength(parsed.length?.toString() || '');
            setBreadth(parsed.breadth?.toString() || '');
            setRoadWidth(parsed.roadWidth?.toString() || '');
            setOpenSides(parsed.openSides || '');
            setConstructionDone(parsed.constructionDone || '');
            setPossessionBy(parsed.possessionBy || '');
            setExpectedMonth(parsed.expectedMonth || '');
            if (parsed.possessionBy?.includes("By")) setShowMonthDropdown(true);
            setConstructionTypes(parsed.constructionTypes || []);

            const restoredPlotKind = parsed.plotKind || plotKindFromParams || '';
            setPlotKind(restoredPlotKind);
            console.log('✅ plotKind restored:', restoredPlotKind);
            return;
          }
        } catch (e) {
          console.log('⚠️ Failed to load Plot draft:', e);
        }

        // ✅ PRIORITY 3: Load from params if no draft
        if (params.plotDetails) {
          try {
            const prevData = safeParse(params.plotDetails);
            console.log('🔄 Restoring from params.plotDetails');

            setLocation(prevData.location || '');
            setLocality(prevData.locality || '');
            setNeighborhoodArea(prevData.neighborhoodArea || params.area || '');
            setPlotArea(prevData.plotArea?.toString() || '');
            setPlotKind(prevData.plotKind || plotKindFromParams || '');
            setLength(prevData.length?.toString() || '');
            setBreadth(prevData.breadth?.toString() || '');
            setRoadWidth(prevData.roadWidth?.toString() || '');
            setOpenSides(prevData.openSides || '');
            setConstructionDone(prevData.constructionDone || '');
            setPossessionBy(prevData.possessionBy || '');
            setExpectedMonth(prevData.expectedMonth || '');
            setConstructionTypes(prevData.constructionTypes || []);
          } catch (e) {
            console.log('❌ Could not restore plot data:', e);
          }
        }

        if (params.area) {
          setNeighborhoodArea(params.area);
          console.log('✅ Area restored from params:', params.area);
        }
      }
      console.log('🔄 === PLOT.JSX LOAD DATA END (DRAFT PATH) ===\n');
    };

    loadData();
  }, [params.editMode, params.propertyData, params.propertyId, params.plotDetails, params.area, plotKindFromParams]);

  // ✅ Auto-save draft to AsyncStorage
  useEffect(() => {
    if (isEditMode) return; // ✅ Don't save drafts in edit mode
    
    const saveDraft = async () => {
      let existingPlotKind = plotKindFromParams;

      try {
        const existingDraft = await AsyncStorage.getItem('draft_plot_details');
        if (existingDraft) {
          const parsed = JSON.parse(existingDraft);
          if (!plotKindFromParams && parsed.plotKind) {
            existingPlotKind = parsed.plotKind;
          }
        }
      } catch (e) {
        console.log('⚠️ Could not load existing draft:', e);
      }

      const draftData = {
        location,
        locality,
        neighborhoodArea,
        plotArea,
        length,
        breadth,
        roadWidth,
        openSides,
        constructionDone,

        constructionTypes,
        possessionBy,        // ✅ ADD
        expectedMonth,
        plotKind: existingPlotKind || plotKindFromParams,
        timestamp: new Date().toISOString(),
      };

      try {
        await AsyncStorage.setItem('draft_plot_details', JSON.stringify(draftData));
        console.log('💾 Plot draft auto-saved with plotKind:', existingPlotKind || plotKindFromParams);
      } catch (e) {
        console.log('⚠️ Failed to save Plot draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [location, locality, neighborhoodArea, plotArea, length, breadth, roadWidth,
    openSides, constructionDone, possessionBy, expectedMonth, constructionTypes, plotKindFromParams, isEditMode]);

  const handleNext = () => {
    const finalPlotKind = plotKind || plotKindFromParams;

    console.log('🔍 handleNext - plotKind (state):', plotKind);
    console.log('🔍 handleNext - plotKindFromParams:', plotKindFromParams);
    console.log('🔍 handleNext - finalPlotKind:', finalPlotKind);

    if (!finalPlotKind) {
      console.log('❌ Plot kind is missing!');
      Toast.show({
        type: "error",
        text1: t('plot_kind_missing'),
        text2: t('plot_select_plot_type'),
      });
      return;
    }

    if (!location.trim() || !neighborhoodArea.trim() || !plotArea.trim() || !length || !breadth || !roadWidth) {
      Toast.show({
        type: "error",
        text1: t('plot_all_fields_required'),
      });
      return;
    }

    // ✅ CREATE RAW DETAILS FIRST (with Telugu/Hindi values)
    // ✅ CREATE RAW DETAILS FIRST (with Telugu/Hindi values)
    const rawPlotDetails = {
      location,
      locality,
      neighborhoodArea,
      area: Number(plotArea),
      dimensions: {
        length: Number(length),
        breadth: Number(breadth),
      },
      roadWidth: Number(roadWidth),
      openSides,
      constructionDone,
      constructionTypes: constructionTypes.map(type => convertToEnglish(type)),
      possessionBy: convertToEnglish(possessionBy),
      expectedMonth: convertToEnglish(expectedMonth),
      plotKind: convertToEnglish(finalPlotKind),
    };

    // ✅ CONVERT TO ENGLISH
    const convertedPlotDetails = convertToEnglish(rawPlotDetails);

    const commercialDetails = {
      subType: "Plot/Land",
      propertyTitle,
      plotDetails: convertedPlotDetails,
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/PlotNext",
      params: {
        commercialDetails: JSON.stringify(commercialDetails),
        propertyTitle,
        images: JSON.stringify(images),
        area: neighborhoodArea,
        plotKind: plotKindFromParams,
        // ✅ In edit mode, pass original full property data
        editMode: isEditMode ? 'true' : params.editMode,
        propertyId: isEditMode ? editPropertyId : params.propertyId,
        propertyData: isEditMode && originalPropertyData ? JSON.stringify(originalPropertyData) : params.propertyData,
      },
    });
  };

  const handleBack = () => {
    const currentData = {
      location,
      locality,
      neighborhoodArea,
      plotArea,
      length,
      breadth,
      roadWidth,
      openSides,
      constructionDone,
      possessionBy,
      expectedMonth,
      constructionTypes,
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload",
      params: {
        plotKind: plotKindFromParams,
        plotDetails: JSON.stringify({
          ...currentData,
          plotKind: plotKindFromParams,
        }),
        images: JSON.stringify(images),
        area: neighborhoodArea,
        propertyTitle,
        commercialBaseDetails: JSON.stringify({
          subType: "Plot/Land",
          plotKind: plotKindFromParams,
          propertyTitle,
        }),
      },
    });
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>

        {/* HEADER */}
        <View className="flex-row items-center mt-6 mb-4">
          <TouchableOpacity
            onPress={handleBack}
            className="p-2"
          >
            <Image
              source={require("../../../../../../assets/arrow.png")}
              className="w-5 h-5"
            />
          </TouchableOpacity>
          <View className="ml-2">
            <Text className="text-[16px] font-semibold">{t('upload_property_title')}</Text>
            <Text className="text-[12px] text-[#00000066]">{t('upload_property_subtitle')}</Text>
          </View>
        </View>

        {/* LOCATION */}
        <LocationSection
          location={location}
          setLocation={setLocation}
          locality={locality}
          setLocality={setLocality}
        />

        {/* AREA/NEIGHBORHOOD FIELD */}
        <View className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] mt-4">
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            {t('plot_area_neighborhood')}<Text className="text-red-500">*</Text>
          </Text>
          <View
            className="flex-row items-center rounded-md p-3 mb-3"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "neighborhoodArea" ? "#22C55E" : "#E5E7EB",
              backgroundColor: "#D9D9D91C",
            }}
          >
            <Image
              source={require("../../../../../../assets/location.png")}
              style={{ width: 18, height: 18, marginRight: 8 }}
            />
            <TextInput
              placeholder={t('plot_area_neighborhood_placeholder')}
              value={neighborhoodArea}
              onChangeText={setNeighborhoodArea}
              onFocus={() => setFocusedField("neighborhoodArea")}
              onBlur={() => setFocusedField(null)}
              className="flex-1"
            />
          </View>
        </View>

        {/* WHITE CARD */}
        <View className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] mt-4">

          {/* AREA */}
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            {t('plot_add_area_details')}<Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row items-center h-[52px] px-3 mb-3 border rounded-[12px]"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "plotArea" ? "#22C55E" : "#E5E7EB",
            }}>
            <TextInput
              placeholder={t('plot_area_placeholder')}
              value={plotArea}
              onChangeText={(t) => setPlotArea(t.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              className="flex-1 text-[14px]"
              onFocus={() => setFocusedField("plotArea")}
              onBlur={() => setFocusedField(null)}
            />
            <Text className="text-[#6B7280]">{t('plot_area_unit_sqft')}</Text>
          </View>

          {/* DIMENSIONS */}
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            {t('plot_dimensions')} <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder={t('plot_length_placeholder')}
            value={length}
            onChangeText={(t) => setLength(t.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            className="border rounded-[12px] p-3 mb-2"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "length" ? "#22C55E" : "#E5E7EB",
            }}
            onFocus={() => setFocusedField("length")}
            onBlur={() => setFocusedField(null)}
          />
          <TextInput
            placeholder={t('plot_breadth_placeholder')}
            value={breadth}
            onChangeText={(t) => setBreadth(t.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            className="border rounded-[12px] p-3 mb-3"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "breadth" ? "#22C55E" : "#E5E7EB",
            }}
            onFocus={() => setFocusedField("breadth")}
            onBlur={() => setFocusedField(null)}
          />

          {/* ROAD WIDTH */}
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            {t('plot_road_width')}<Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row items-center h-[52px] px-3 mb-3 border rounded-[12px]"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "roadWidth" ? "#22C55E" : "#E5E7EB",
            }}>
            <TextInput
              placeholder={t('plot_road_width_placeholder')}
              value={roadWidth}
              onChangeText={(t) => setRoadWidth(t.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              className="flex-1"
              onFocus={() => setFocusedField("roadWidth")}
              onBlur={() => setFocusedField(null)}
            />
            <Text className="text-[#6B7280]">{t('plot_road_width_unit_feet')}</Text>
          </View>

          {/* OPEN SIDES */}
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            {t('plot_open_sides')}
          </Text>
          <View className="flex-row mb-3">
            {["1", "2", "3", "4"].map(n => (
              <PillButton
                key={n}
                label={n}
                selected={openSides === n}
                onPress={() => setOpenSides(n)}
              />
            ))}
          </View>

          {/* CONSTRUCTION */}
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            {t('plot_construction_done')}
          </Text>
          <View className="flex-row mb-3">
            <PillButton
              label={t('plot_construction_yes')}
              selected={constructionDone === "Yes"}
              onPress={() => setConstructionDone("Yes")}
            />
            <PillButton
              label={t('plot_construction_no')}
              selected={constructionDone === "No"}
              onPress={() => setConstructionDone("No")}
            />
          </View>

          {/* POSSESSION */}
          {/* POSSESSION */}
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            {t('plot_possession_by')}
          </Text>

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
                  className={`p-4 border-b border-gray-200 ${possessionBy === item ? "bg-green-500" : "bg-white"
                    }`}
                >
                  <Text className={`${possessionBy === item ? "text-white" : "text-gray-800"
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
                      className={`p-4 border-b border-gray-200 ${expectedMonth === item ? "bg-green-500" : "bg-white"
                        }`}
                    >
                      <Text className={`${expectedMonth === item ? "text-white" : "text-gray-800"
                        }`}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
          

          

          {constructionDone === "Yes" && (
            <>
              <Text className="text-sm font-semibold mb-2 mt-3">
                {t('plot_construction_type')}
              </Text>

              <View className="flex-row flex-wrap">
                {[
                  t('plot_construction_shed'),
                  t('plot_construction_room'),
                  t('plot_construction_washroom'),
                  t('plot_construction_other')
                ].map(item => (
                  <PillButton
                    key={item}
                    label={item}
                    selected={constructionTypes.includes(item)}
                    onPress={() => toggleConstruction(item)}
                  />
                ))}
              </View>
            </>
          )}

        </View>
      </ScrollView>

      {/* FOOTER */}
      <View className="bg-white border-t border-gray-200">
        <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-12">
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