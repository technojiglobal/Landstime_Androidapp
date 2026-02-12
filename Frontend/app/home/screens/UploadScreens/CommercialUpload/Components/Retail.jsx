//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/Retail.jsx

import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LocationSection from "components/LocationSection";
import { useTranslation } from 'react-i18next';
import { toEnglish, convertToEnglish } from '../../../../../../utils/reverseTranslation';

/* ---------- UI HELPERS ---------- */
const PillButton = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: selected ? "#22C55E" : "#E5E7EB",
      backgroundColor: selected ? "#22C55E17" : "#fff",
      marginRight: 8,
      marginBottom: 8,
    }}
  >
    <Text style={{ fontSize: 12, color: selected ? "#22C55E" : "#6B7280" }}>
      {label}
    </Text>
  </TouchableOpacity>
);

const Checkbox = ({ selected }) => (
  <View
    style={{
      width: 16,
      height: 16,
      borderWidth: 1,
      borderColor: selected ? "#22C55E" : "#D1D5DB",
      backgroundColor: selected ? "#22C55E" : "#fff",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    }}
  >
    {selected && <Text style={{ color: "#fff", fontSize: 10 }}>✓</Text>}
  </View>
);

/* ---------- MAIN SCREEN ---------- */
export default function Retail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  const images = params.images ? JSON.parse(params.images) : [];

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

  /* ---------- STATE ---------- */
  const [focusedField, setFocusedField] = useState(null);
  const [visible, setVisible] = useState(null);

  // Location & Area
  const [location, setLocation] = useState("");
  const [locality, setLocality] = useState("");
  const [neighborhoodArea, setNeighborhoodArea] = useState("");

  // Retail Specific
  const [locatedInside, setLocatedInside] = useState("");
  const [zoneType, setZoneType] = useState("");

  // Area Measurements
  const [carpetArea, setCarpetArea] = useState("");
  const [unit, setUnit] = useState("sqft");

  // Shop Details
  const [entranceWidth, setEntranceWidth] = useState("");
  const [ceilingHeight, setCeilingHeight] = useState("");

  // Facilities
  const [washroom, setWashroom] = useState("");
  const [floorDetails, setFloorDetails] = useState("");
  const [locatedNear, setLocatedNear] = useState([]);
  const [parkingType, setParkingType] = useState("");

  // Availability
  const [availability, setAvailability] = useState("");
  const [propertyAge, setPropertyAge] = useState("");
  const [possessionBy, setPossessionBy] = useState("");
  // Keep existing possessionMonth state
  // Remove possessionYear state
  // Possession (for Under Construction)

  const [possessionMonth, setPossessionMonth] = useState("");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  // Business Types
  const [businessTypes, setBusinessTypes] = useState([]);
  const [showBusinessTypes, setShowBusinessTypes] = useState(false);
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
  /* ---------- LOAD DRAFT ---------- */
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await AsyncStorage.getItem('draft_retail_details');
        if (draft) {
          const parsed = JSON.parse(draft);
          console.log('📦 Loading Retail draft from AsyncStorage:', parsed);

          setLocation(parsed.location || '');
          setLocality(parsed.locality || '');
          setNeighborhoodArea(parsed.neighborhoodArea || params.area || '');
          setCarpetArea(parsed.carpetArea?.toString() || '');
          setUnit(parsed.carpetAreaUnit || 'sqft');

          setLocatedInside(toEnglish(prevData.locatedInside) || '');
          setZoneType(parsed.zoneType || '');

          setEntranceWidth(parsed.entranceWidth?.toString() || '');
          setCeilingHeight(parsed.ceilingHeight?.toString() || '');
          setWashroom(toEnglish(parsed.washroom) || '');
          setFloorDetails(toEnglish(parsed.floorDetails) || '');
          setLocatedNear(convertToEnglish(parsed.locatedNear) || []);
          setParkingType(toEnglish(parsed.parkingType) || '');
          setAvailability(toEnglish(parsed.availability) || '');
          setPropertyAge(toEnglish(parsed.propertyAge) || '');

          setPossessionBy(toEnglish(parsed.possessionBy) || '');
          setPossessionMonth(toEnglish(parsed.possessionMonth) || '');
          if (parsed.possessionBy?.includes("By")) setShowMonthDropdown(true);

          if (parsed.suitableFor) setBusinessTypes(convertToEnglish(parsed.suitableFor));

          console.log('✅ Retail draft loaded successfully');
          return;
        }
      } catch (e) {
        console.log('⚠️ Failed to load Retail draft:', e);
      }

      // FALLBACK: Load from params if no draft
      if (params.retailDetails) {
        try {
          const prevData = JSON.parse(params.retailDetails);
          console.log('🔄 Restoring Retail data from params');

          setLocation(prevData.location || '');
          setLocality(prevData.locality || '');
          setNeighborhoodArea(prevData.neighborhoodArea || params.area || '');
          setCarpetArea(prevData.carpetArea?.toString() || '');
          setUnit(prevData.carpetAreaUnit || 'sqft');

          setLocatedInside(toEnglish(prevData.locatedInside) || '');
          setZoneType(prevData.zoneType || '');

          setEntranceWidth(prevData.entranceWidth?.toString() || '');
          setCeilingHeight(prevData.ceilingHeight?.toString() || '');
          setWashroom(toEnglish(prevData.washroom) || '');
          setFloorDetails(toEnglish(prevData.floorDetails) || '');
          setLocatedNear(convertToEnglish(prevData.locatedNear) || []);
          setParkingType(toEnglish(prevData.parkingType) || '');
          setAvailability(toEnglish(prevData.availability) || '');
          setPropertyAge(toEnglish(prevData.propertyAge) || '');

          if (prevData.possession) {

            setPossessionMonth(toEnglish(prevData.possession.month) || '');
            if (prevData.possession.year) setShowMonthDropdown(true);
          }

          if (prevData.suitableFor) setBusinessTypes(convertToEnglish(prevData.suitableFor));
        } catch (e) {
          console.log('❌ Could not restore retail data:', e);
        }
      }

      // Always restore area from params if available
      if (params.area) {
        setNeighborhoodArea(params.area);
        console.log('✅ Area restored from params:', params.area);
      }
    };

    loadDraft();
  }, [params.retailDetails, params.area]);

  /* ---------- AUTO-SAVE DRAFT ---------- */
  useEffect(() => {
    const saveDraft = async () => {
      const draftData = {
        location,
        locality,
        neighborhoodArea,
        carpetArea,
        carpetAreaUnit: unit,

        locatedInside,
        zoneType,
        retailKind: baseDetails?.retailType,

        entranceWidth,
        ceilingHeight,
        washroom,
        floorDetails,
        locatedNear,
        parkingType,
        availability,
        propertyAge,
        possessionBy,        // ✅ ADD
        possessionMonth,

        suitableFor: businessTypes,
        timestamp: new Date().toISOString(),
      };

      try {
        await AsyncStorage.setItem('draft_retail_details', JSON.stringify(draftData));
        console.log('💾 Retail draft auto-saved');
      } catch (e) {
        console.log('⚠️ Failed to save Retail draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [location, locality, neighborhoodArea, carpetArea, unit,
    locatedInside, zoneType,
    entranceWidth, ceilingHeight, washroom, floorDetails, locatedNear,
    parkingType, availability, propertyAge, possessionBy, possessionMonth,
    businessTypes, baseDetails?.retailType]);

  /* ---------- OPTIONS ---------- */
  const locatedInsideOptions = [
    t('retail_located_inside_mall') || "Mall",
    t('retail_located_inside_commercial') || "Commercial Project",
    t('retail_located_inside_residential') || "Residential Project",
    t('retail_located_inside_retail') || "Retail Complex / Building",
    t('retail_located_inside_market') || "Market / High Street"
  ];

  const zoneTypeOptions = [
    t('retail_zone_commercial'),
    t('retail_zone_residential'),
    t('retail_zone_transport'),
    t('retail_zone_public'),
    t('retail_zone_open_spaces'),
    t('retail_zone_agricultural'),
    t('retail_zone_special_economic'),
    t('retail_zone_natural'),
    t('retail_zone_government'),
    t('retail_zone_other')
  ];

  const washroomOptions = [
    `+${t('retail_washroom_private') || 'Private Washrooms'}`,
    `+${t('retail_washroom_public') || 'Public Washrooms'}`,
    t('retail_washroom_not_available')
  ];

  const locatedNearOptions = [
    `+${t('retail_near_entrance') || 'Entrance'}`,
    `+${t('retail_near_elevator') || 'Elevator'}`,
    `+${t('retail_near_stairs') || 'Stairs'}`
  ];

  const parkingOptions = [
    `+${t('retail_parking_private') || 'Private Parking'}`,
    `+${t('retail_parking_public') || 'Public Parking'}`,
    `+${t('retail_parking_multilevel') || 'Multilevel Parking'}`,
    t('retail_parking_not_available')
  ];

  const availabilityOptions = [
    t('retail_ready_to_move'),
    t('retail_under_construction')
  ];

  const propertyAgeOptions = [
    t('retail_age_0_1'),
    t('retail_age_1_5'),
    t('retail_age_5_10'),
    t('retail_age_10plus')
  ];

  const businessTypeOptions = [
    t('retail_business_atm'),
    t('retail_business_bakery'),
    t('retail_business_boutique'),
    t('retail_business_clinic'),
    t('retail_business_clothes'),
    t('retail_business_cloud_kitchen'),
    t('retail_business_coffee'),
    t('retail_business_fast_food'),
    t('retail_business_footwear'),
    t('retail_business_grocery'),
    t('retail_business_gym'),
    t('retail_business_jewellery'),
    t('retail_business_medical'),
    t('retail_business_mobile'),
    t('retail_business_restaurant'),
    t('retail_business_salon_spa'),
    t('retail_business_sweet_shop'),
    t('retail_business_other')
  ];

  const monthOptions = [
    t('retail_month_january'),
    t('retail_month_february'),
    t('retail_month_march'),
    t('retail_month_april'),
    t('retail_month_may'),
    t('retail_month_june'),
    t('retail_month_july'),
    t('retail_month_august'),
    t('retail_month_september'),
    t('retail_month_october'),
    t('retail_month_november'),
    t('retail_month_december')
  ];

  /* ---------- HANDLERS ---------- */
  const toggleArray = (val, arr, setArr) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const handleBack = () => {
    const currentData = {
      location,
      locality,
      neighborhoodArea,
      carpetArea,
      locatedInside,
      zoneType,
      entranceWidth,
      ceilingHeight,
      washroom,
      floorDetails,
      locatedNear,
      parkingType,
      availability,
      propertyAge,
     
      suitableFor: businessTypes,
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload",
      params: {
        retailDetails: JSON.stringify(currentData),
        images: JSON.stringify(images),
        area: neighborhoodArea.trim(),
        propertyTitle: baseDetails?.propertyTitle,
        commercialBaseDetails: JSON.stringify({
          subType: "Retail",
          retailKind: baseDetails?.retailType,
          locatedInside: currentData.locatedInside || locatedInside,
          propertyTitle: baseDetails?.propertyTitle,
        }),
      },
    });
  };

  const handleRetailNext = () => {
    if (!location.trim()) {
      Toast.show({
        type: "error",
        text1: t('retail_location_required'),
      });
      return;
    }

    if (!neighborhoodArea.trim()) {
      Toast.show({
        type: "error",
        text1: t('retail_area_required'),
      });
      return;
    }

    if (!carpetArea.trim()) {
      Toast.show({
        type: "error",
        text1: t('retail_carpet_area_required'),
      });
      return;
    }

    // ✅ CONVERT ALL Telugu/Hindi to English BEFORE creating commercialDetails
    // ✅ CONVERT ALL Telugu/Hindi to English BEFORE creating commercialDetails
    const commercialDetails = {
      subType: "Retail",
      propertyTitle: baseDetails?.propertyTitle,
      retailDetails: {
        location,
        locality,

        locatedInside: toEnglish(locatedInside),  // ✅ ADD
        zoneType: toEnglish(zoneType),  // ✅ ADD

        neighborhoodArea: neighborhoodArea.trim(),
        carpetArea: carpetArea ? Number(carpetArea) : undefined,
        carpetAreaUnit: unit,

        entranceWidth: entranceWidth ? Number(entranceWidth) : undefined,
        ceilingHeight: ceilingHeight ? Number(ceilingHeight) : undefined,
        washroom: toEnglish(washroom),  // ✅ ADD
        floorDetails,
        locatedNear: convertToEnglish(locatedNear),  // ✅ ADD
        parkingType: toEnglish(parkingType),  // ✅ ADD
        availability: toEnglish(availability),  // ✅ ADD
        propertyAge: toEnglish(propertyAge),  // ✅ ADD
        possessionBy: toEnglish(possessionBy),
        possessionMonth: toEnglish(possessionMonth),
        suitableFor: convertToEnglish(businessTypes),  // ✅ ADD
      },
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/RetailNext",
      params: {
        commercialDetails: JSON.stringify(commercialDetails),
        propertyTitle: baseDetails?.propertyTitle,
        images: JSON.stringify(images),
        area: neighborhoodArea.trim(),
      },
    });
  };

  /* ---------- STYLES ---------- */
  const sectionLabel = {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
  };

  const inputWithUnit = {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    height: 52,
    paddingHorizontal: 12,
    marginBottom: 12,
  };

  const inputText = {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  };

  const divider = {
    width: 1,
    height: 24,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  };

  const unitText = {
    fontSize: 14,
    color: "#6B7280",
  };

  const plainInput = {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  };

  const dropdownBox = {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  };

  /* ---------- UI ---------- */
  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* HEADER */}
      <View className="flex-row items-center mt-7 mb-4">
        <TouchableOpacity onPress={handleBack} className="p-2">
          <Image
            source={require("../../../../../../assets/arrow.png")}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>

        <View className="ml-2">
          <Text className="text-[16px] font-semibold">
            {t('upload_property_title') || 'Upload Your Property'}
          </Text>
          <Text className="text-[12px] text-[#00000066]">
            {t('upload_property_subtitle') || 'Add your property details'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* LOCATION SECTION */}
        <LocationSection
          location={location}
          setLocation={setLocation}
          locality={locality}
          setLocality={setLocality}
        />

        {/* LOCATED INSIDE & ZONE TYPE */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            marginBottom: 12,
          }}
        >
          <Text style={sectionLabel}>{t('retail_located_inside') || 'Located Inside'}</Text>
          <TouchableOpacity
            onPress={() => setVisible(visible === "locatedInside" ? null : "locatedInside")}
            style={{
              backgroundColor: "#D9D9D91C",
              borderRadius: 12,
              padding: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text>{locatedInside || t('retail_select_located_inside') || "Select Located Inside"}</Text>
            <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          {visible === "locatedInside" && (
            <View style={{ marginTop: 8 }}>
              {locatedInsideOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setLocatedInside(item);
                    setVisible(null);
                  }}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderColor: "#E5E7EB",
                    backgroundColor: locatedInside === item ? "#22C55E" : "#fff",
                  }}
                >
                  <Text style={{ color: locatedInside === item ? "#fff" : "#374151" }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={{ ...sectionLabel, marginTop: 16 }}>{t('retail_zone_type')}</Text>
          <TouchableOpacity
            onPress={() => setVisible(visible === "zoneType" ? null : "zoneType")}
            style={{
              backgroundColor: "#D9D9D91C",
              borderRadius: 12,
              padding: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text>{zoneType || t('retail_select_zone_type')}</Text>
            <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          {visible === "zoneType" && (
            <View style={{ marginTop: 8 }}>
              {zoneTypeOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setZoneType(item);
                    setVisible(null);
                  }}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderColor: "#E5E7EB",
                    backgroundColor: zoneType === item ? "#22C55E" : "#fff",
                  }}
                >
                  <Text style={{ color: zoneType === item ? "#fff" : "#374151" }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* AREA & MEASUREMENTS */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            marginBottom: 20,
          }}
        >
          {/* NEIGHBORHOOD AREA */}
          <Text style={sectionLabel}>
            {t('retail_area_neighborhood')}<Text className="text-red-500">*</Text>
          </Text>
          <View
            className="flex-row items-center rounded-md p-3 mb-3"
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
              placeholder={t('retail_enter_area')}
              value={neighborhoodArea}
              onChangeText={setNeighborhoodArea}
              onFocus={() => setFocusedField("neighborhoodArea")}
              onBlur={() => setFocusedField(null)}
              className="flex-1 py-1"
            />
          </View>

          {/* CARPET AREA */}
          <Text style={sectionLabel}>
            {t('retail_carpet_area')}<Text className="text-red-500">*</Text>
          </Text>
          <View style={inputWithUnit}>
            <TextInput
              placeholder={t('retail_enter_carpet_area')}
              value={carpetArea}
              onChangeText={(text) => setCarpetArea(text.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              style={inputText}
            />
            <View style={divider} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={unitText}>{t('retail_unit_sqft')}</Text>
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
            </View>
          </View>

          {/* SHOP FACADE SIZE */}
          <Text style={sectionLabel}>{t('retail_shop_facade')}</Text>
          <View style={inputWithUnit}>
            <TextInput
              placeholder={t('retail_entrance_width')}
              value={entranceWidth}
              onChangeText={setEntranceWidth}
              keyboardType="numeric"
              style={inputText}
            />
            <View style={divider} />
            <Text style={unitText}>ft</Text>
          </View>

          <View style={inputWithUnit}>
            <TextInput
              placeholder={t('retail_ceiling_height')}
              value={ceilingHeight}
              onChangeText={setCeilingHeight}
              keyboardType="numeric"
              style={inputText}
            />
            <View style={divider} />
            <Text style={unitText}>ft</Text>
          </View>

          {/* WASHROOM */}
          <Text style={sectionLabel}>{t('retail_washroom_details')}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {washroomOptions.map((o) => (
              <PillButton
                key={o}
                label={o}
                selected={washroom === o}
                onPress={() => setWashroom(o)}
              />
            ))}
          </View>

          {/* FLOOR DETAILS */}
          <Text style={sectionLabel}>{t('retail_floor_details')}</Text>
          <TextInput
            placeholder={t('retail_total_floors')}
            value={floorDetails}
            onChangeText={setFloorDetails}
            style={plainInput}
          />

          {/* LOCATED NEAR */}
          <Text style={sectionLabel}>{t('retail_located_near')}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {locatedNearOptions.map((o) => (
              <PillButton
                key={o}
                label={o}
                selected={locatedNear.includes(o)}
                onPress={() => toggleArray(o, locatedNear, setLocatedNear)}
              />
            ))}
          </View>

          {/* PARKING */}
          <Text style={sectionLabel}>{t('retail_parking_type')}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {parkingOptions.map((o) => (
              <PillButton
                key={o}
                label={o}
                selected={parkingType === o}
                onPress={() => setParkingType(o)}
              />
            ))}
          </View>

          {/* AVAILABILITY */}
          <Text style={sectionLabel}>{t('retail_availability_status')}</Text>
          <View style={{ flexDirection: "row" }}>
            {availabilityOptions.map((o) => (
              <PillButton
                key={o}
                label={o}
                selected={availability === o}
                onPress={() => setAvailability(o)}
              />
            ))}
          </View>

          {/* PROPERTY AGE (Ready to move) */}
          {availability === t('retail_ready_to_move') && (
            <>
              <Text style={sectionLabel}>{t('retail_age_of_property')}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {propertyAgeOptions.map((o) => (
                  <PillButton
                    key={o}
                    label={o}
                    selected={propertyAge === o}
                    onPress={() => setPropertyAge(o)}
                  />
                ))}
              </View>
            </>
          )}

          {/* POSSESSION (Under Construction) */}
          {/* POSSESSION (Under Construction) */}
          {availability === t('retail_under_construction') && (
            <>
              <Text style={sectionLabel}>{t('retail_possession_by')}</Text>

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
                          setPossessionMonth("");
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
                  <Text style={sectionLabel}>{t('hospitality_expected_month')}</Text>
                  <TouchableOpacity
                    onPress={() => setVisible(visible === "expectedMonth" ? null : "expectedMonth")}
                    className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
                  >
                    <Text className="text-gray-800 text-left">
                      {possessionMonth || t('hospitality_select_month')}
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
                            setPossessionMonth(item);
                            setVisible(null);
                          }}
                          className={`p-4 border-b border-gray-200 ${possessionMonth === item ? "bg-green-500" : "bg-white"
                            }`}
                        >
                          <Text className={`${possessionMonth === item ? "text-white" : "text-gray-800"
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

          {/* BUSINESS TYPES */}
          {/* BUSINESS TYPES */}
          <Text style={sectionLabel}>{t('retail_business_types')}</Text>
          <TouchableOpacity
            onPress={() => setShowBusinessTypes(!showBusinessTypes)}
            style={dropdownBox}
          >
            <Text>
              {businessTypes.length > 0
                ? `${businessTypes.length} ${t('retail_business_selected')}`
                : t('retail_select_business_type')}
            </Text>
            <Ionicons name="chevron-down" size={18} />
          </TouchableOpacity>

          {showBusinessTypes &&
            businessTypeOptions.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => toggleArray(item, businessTypes, setBusinessTypes)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <Checkbox selected={businessTypes.includes(item)} />
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}



        </View>

      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View
        style={{ flexDirection: "row", padding: 16, backgroundColor: "#fff" }}
        className="mb-8 justify-end mt-4 space-x-5 mx-3"
      >
        <TouchableOpacity
          onPress={handleBack}
          style={{
            marginRight: 10,
            backgroundColor: "#E5E7EB",
            padding: 14,
            alignItems: "center",
          }}
          className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
        >
          <Text>{t('button_cancel') || 'Cancel'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRetailNext}
          style={{
            backgroundColor: "#22C55E",
            padding: 14,
            alignItems: "center",
          }}
          className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            {t('button_next') || 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}