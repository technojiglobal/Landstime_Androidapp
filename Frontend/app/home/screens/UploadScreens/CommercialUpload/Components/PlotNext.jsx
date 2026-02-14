// Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/PlotNext.jsx

import React, { useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import MorePricingDetailsModal from "../../MorePricingDetailsModal";
import { useTranslation } from 'react-i18next';
import { convertToEnglish } from '../../../../../../utils/reverseTranslation';

/* ---------- UI HELPERS ---------- */
const PillButton = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-3 py-1 rounded-full mr-2 mb-2 border ${
      selected
        ? "border-green-500 bg-green-50"
        : "border-gray-300 bg-white"
    }`}
  >
    <Text
      className={`text-xs ${
        selected ? "text-green-600" : "text-gray-600"
      }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const Checkbox = ({ label, checked, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center mb-2"
  >
    <View className={`w-5 h-5 rounded mr-2 ${checked ? 'bg-green-500' : 'border border-gray-300'}`} />
    <Text className="text-gray-700">{label}</Text>
  </TouchableOpacity>
);

// ✅ Data inspection helper - logs all available data paths
const inspectPropertyData = (property, label = "Property Data") => {
  console.log(`\n🔍 === ${label} ===`);
  console.log('📌 Root keys:', Object.keys(property || {}).join(', '));
  console.log('📌 commercialDetails keys:', Object.keys(property.commercialDetails || {}).join(', '));
  console.log('📌 pricingExtras:', JSON.stringify(property.commercialDetails?.pricingExtras, null, 2));
  console.log('📌 expectedPrice:', property.commercialDetails?.expectedPrice);
  console.log('📌 priceDetails:', JSON.stringify(property.commercialDetails?.priceDetails, null, 2));
  console.log(`🔍 === End ${label} ===\n`);
};

/* ---------- MAIN SCREEN ---------- */
export default function PlotNext() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, i18n } = useTranslation();

  // ✅ Safe parsing helper
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

  const images = useMemo(() => safeParse(params.images) || [], [params.images]);
  const plotDetailsFromPrev = useMemo(() => safeParse(params.commercialDetails), [params.commercialDetails]);
  const propertyTitle = params.propertyTitle || plotDetailsFromPrev?.propertyTitle || "";
  const plotKindFromParams = params.plotKind || plotDetailsFromPrev?.plotDetails?.plotKind || '';

  /* ---------- STATE ---------- */
  const [ownership, setOwnership] = useState("");
  const [authority, setAuthority] = useState("");
  const [industryType, setIndustryType] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [allInclusive, setAllInclusive] = useState(false);
  const [negotiable, setNegotiable] = useState(false);
  const [taxExcluded, setTaxExcluded] = useState(false);
  const [preLeased, setPreLeased] = useState(null);
  const [leaseDuration, setLeaseDuration] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [description, setDescription] = useState("");
  const [cornerProperty, setCornerProperty] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [locationAdvantages, setLocationAdvantages] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
  const [isMorePricingModalVisible, setIsMorePricingModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPropertyId, setEditPropertyId] = useState(null);
  const [originalPropertyData, setOriginalPropertyData] = useState(null); // ✅ Store original property

  /* ---------- OPTIONS ---------- */
  const ownershipOptions = [
    t('plot_ownership_freehold'),
    t('plot_ownership_leasehold'),
    t('plot_ownership_cooperative'),
    t('plot_ownership_poa'),
  ];

const amenitiesOptions = [
  t('plot_amenity_water_storage'),
  t('plot_amenity_air_conditioned'),
  t('plot_amenity_vaastu_complex'),
  t('plot_amenity_fire_alarm'),
  t('plot_amenity_visitor_parking'),
];

const locationAdvOptions = [
  t('plot_loc_metro_station'),
  t('plot_loc_school'),
  t('plot_loc_hospital'),
  t('plot_loc_market'),
  t('plot_loc_railway_station'),
  t('plot_loc_airport'),
  t('plot_loc_mall'),
  t('plot_loc_highway'),
];

  const toggleItem = (item, list, setList) => {
    setList(
      list.includes(item)
        ? list.filter(v => v !== item)
        : [...list, item]
    );
  };

  // ✅ Load data from edit mode or AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      console.log('\n🔄 === PLOT NEXT.JSX LOAD DATA START ===');
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
          
          console.log('📝 Loading Plot pricing for edit:', property._id);
          inspectPropertyData(property, "Plot Pricing Edit Mode");

          // ✅ ADD MASTER DEBUGGING LOG
          console.log('\n🎯 PLOT NEXT EDIT MODE - COMPLETE DATA INSPECTION:');
          console.log('📌 property._id:', property._id);
          console.log('📌 property.expectedPrice:', property.expectedPrice);
          console.log('📌 Has commercialDetails:', !!property.commercialDetails);
          if (property.commercialDetails) {
            console.log('📌 commercialDetails.expectedPrice:', property.commercialDetails.expectedPrice);
            console.log('📌 commercialDetails.priceDetails:', property.commercialDetails.priceDetails);
            console.log('📌 commercialDetails.pricingExtras:', !!property.commercialDetails.pricingExtras);
            if (property.commercialDetails.pricingExtras) {
              console.log('  - ownership:', property.commercialDetails.pricingExtras.ownership);
              console.log('  - authority:', property.commercialDetails.pricingExtras.authority);
              console.log('  - description:', property.commercialDetails.pricingExtras.description);
              console.log('  - amenities:', property.commercialDetails.pricingExtras.amenities);
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

          // Load pricing details from commercialDetails
          if (property.commercialDetails?.pricingExtras) {
            const pricing = property.commercialDetails.pricingExtras;
            
            console.log('📊 Pricing Details from DB:', {
              ownership: pricing.ownership,
              authority: pricing.authority,
              industryType: pricing.industryType,
              expectedPrice: property.commercialDetails.expectedPrice,
              priceDetails: property.commercialDetails.priceDetails,
              preLeased: pricing.preLeased,
              leaseDuration: pricing.leaseDuration,
              monthlyRent: pricing.monthlyRent,
              description: pricing.description,
              cornerProperty: pricing.cornerProperty,
              amenities: pricing.amenities,
              locationAdvantages: pricing.locationAdvantages,
            });
            
            setOwnership(pricing.ownership || '');
            setAuthority(pricing.authority || '');
            setIndustryType(pricing.industryType || '');
            setExpectedPrice(property.commercialDetails.expectedPrice?.toString() || '');
            setAllInclusive(property.commercialDetails.priceDetails?.allInclusive || false);
            setNegotiable(property.commercialDetails.priceDetails?.negotiable || false);
            setTaxExcluded(property.commercialDetails.priceDetails?.taxExcluded || false);
            setPreLeased(pricing.preLeased || null);
            setLeaseDuration(pricing.leaseDuration || '');
            setMonthlyRent(pricing.monthlyRent?.toString() || '');
            setDescription(getLocalizedText(pricing.description) || '');
            setCornerProperty(pricing.cornerProperty || false);
            setAmenities(pricing.amenities || []);
            setLocationAdvantages(pricing.locationAdvantages || []);
            
            console.log('✅ ALL PRICING STATES SET:');
            console.log('  expectedPrice:', property.commercialDetails.expectedPrice?.toString() || '');
            console.log('  ownership:', pricing.ownership || '');
            console.log('  priceDetails:', property.commercialDetails.priceDetails);
            console.log('  pricingExtras:', JSON.stringify(pricing, null, 2));
          } else if (property.pricingExtras) {
            // ✅ FALLBACK: Try loading from property.pricingExtras directly
            console.log('📦 Fallback: Loading from property.pricingExtras');
            const pricing = property.pricingExtras;
            setOwnership(pricing.ownership || '');
            setAuthority(pricing.authority || '');
            setIndustryType(pricing.industryType || '');
            setExpectedPrice(pricing.expectedPrice?.toString() || property.expectedPrice?.toString() || '');
            setAllInclusive(pricing.allInclusive || false);
            setNegotiable(pricing.negotiable || false);
            setTaxExcluded(pricing.taxExcluded || false);
            setPreLeased(pricing.preLeased || null);
            setLeaseDuration(pricing.leaseDuration || '');
            setMonthlyRent(pricing.monthlyRent?.toString() || '');
            setDescription(getLocalizedText(pricing.description) || '');
            setCornerProperty(pricing.cornerProperty || false);
            setAmenities(pricing.amenities || []);
            setLocationAdvantages(pricing.locationAdvantages || []);
          } else if (property.commercialDetails?.pricing) {
            // ✅ FALLBACK: Try loading from property.commercialDetails.pricing
            console.log('📦 Fallback: Loading from property.commercialDetails.pricing');
            const pricing = property.commercialDetails.pricing;
            setOwnership(pricing.ownership || '');
            setAuthority(pricing.authority || '');
            setIndustryType(pricing.industryType || '');
            setExpectedPrice(pricing.expectedPrice?.toString() || property.commercialDetails.expectedPrice?.toString() || '');
            setAllInclusive(pricing.allInclusive || false);
            setNegotiable(pricing.negotiable || false);
            setTaxExcluded(pricing.taxExcluded || false);
            setPreLeased(pricing.preLeased || null);
            setLeaseDuration(pricing.leaseDuration || '');
            setMonthlyRent(pricing.monthlyRent?.toString() || '');
            setDescription(getLocalizedText(pricing.description) || '');
            setCornerProperty(pricing.cornerProperty || false);
            setAmenities(pricing.amenities || []);
            setLocationAdvantages(pricing.locationAdvantages || []);
          } else {
            console.warn('⚠️  No pricing data found in expected locations');
            console.log('🔍 Full property structure:', JSON.stringify(property, null, 2));
          }

          console.log('✅ Plot pricing loaded for editing');
          console.log('🔄 === PLOT NEXT.JSX LOAD DATA END (EDIT MODE) ===\n');
          return; // Don't load draft in edit mode
        } catch (error) {
          console.error('❌ Error loading plot pricing data:', error);
          Alert.alert('Error', 'Failed to load property data');
        }
      }

      console.log('❌ NOT in edit mode, checking draft...');
      // ✅ PRIORITY 2: Load draft from AsyncStorage (only in create mode)
      if (!params.editMode || params.editMode !== 'true') {
        console.log('✅ TAKING DRAFT PATH');
        try {
          console.log("📦 Loading Plot pricing draft from AsyncStorage");
          const draft = await AsyncStorage.getItem('draft_plot_pricing');
          if (draft) {
            const parsed = JSON.parse(draft);
            console.log('✅ Plot pricing draft loaded:', parsed);

            setOwnership(parsed.ownership || '');
            setAuthority(parsed.authority || '');
            setIndustryType(parsed.industryType || '');
            setExpectedPrice(parsed.expectedPrice?.toString() || '');
            setAllInclusive(parsed.allInclusive || false);
            setNegotiable(parsed.negotiable || false);
            setTaxExcluded(parsed.taxExcluded || false);
            setPreLeased(parsed.preLeased || null);
            setLeaseDuration(parsed.leaseDuration || '');
            setMonthlyRent(parsed.monthlyRent?.toString() || '');
            setDescription(parsed.description || '');
            setCornerProperty(parsed.cornerProperty || false);
            setAmenities(parsed.amenities || []);
            setLocationAdvantages(parsed.locationAdvantages || []);

            console.log('✅ Plot pricing draft loaded successfully');
            return;
          }
        } catch (e) {
          console.log('⚠️ Failed to load Plot pricing draft:', e);
        }

        // ✅ PRIORITY 3: Load from params
        if (plotDetailsFromPrev?.pricingExtras) {
          const pricing = plotDetailsFromPrev;
          console.log('🔄 Restoring from params.plotDetails.pricing');

          setOwnership(pricing.pricingExtras?.ownership || '');
          setAuthority(pricing.pricingExtras?.authority || '');
          setIndustryType(pricing.pricingExtras?.industryType || '');
          setExpectedPrice(pricing.expectedPrice?.toString() || '');
          setAllInclusive(pricing.priceDetails?.allInclusive || false);
          setNegotiable(pricing.priceDetails?.negotiable || false);
          setTaxExcluded(pricing.priceDetails?.taxExcluded || false);
          setPreLeased(pricing.pricingExtras?.preLeased || null);
          setLeaseDuration(pricing.pricingExtras?.leaseDuration || '');
          setMonthlyRent(pricing.pricingExtras?.monthlyRent?.toString() || '');
          setDescription(pricing.description || '');
          setCornerProperty(pricing.pricingExtras?.cornerProperty || false);
          setAmenities(pricing.pricingExtras?.amenities || []);
          setLocationAdvantages(pricing.pricingExtras?.locationAdvantages || []);
        }
      }
    };

    loadData();
  }, [params.editMode, params.propertyData, params.propertyId, plotDetailsFromPrev]);

  // ✅ Auto-save pricing draft
  useEffect(() => {
    if (isEditMode) return; // ✅ Don't save drafts in edit mode
    
    const saveDraft = async () => {
      const pricingDraft = {
        ownership,
        authority,
        industryType,
        expectedPrice,
        allInclusive,
        negotiable,
        taxExcluded,
        preLeased,
        leaseDuration,
        monthlyRent,
        description,
        cornerProperty,
        amenities,
        locationAdvantages,
        timestamp: new Date().toISOString(),
      };

      try {
        await AsyncStorage.setItem('draft_plot_pricing', JSON.stringify(pricingDraft));
        console.log('💾 Plot pricing draft auto-saved');
      } catch (e) {
        console.log('⚠️ Failed to save draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [ownership, authority, industryType, expectedPrice, allInclusive, negotiable, 
      taxExcluded, preLeased, leaseDuration, monthlyRent, description, cornerProperty, 
      amenities, locationAdvantages, isEditMode]);

  /* ---------------- VALIDATION ---------------- */
  const handleNext = () => {
    if (!expectedPrice.trim()) {
      Toast.show({
        type: 'error',
        text1: t('plot_expected_price'),
        text2: 'Please enter the expected price.',
      });
      return;
    }

    if (!description.trim()) {
      Toast.show({
        type: 'error',
        text1: t('plot_description'),
        text2: 'Please enter a description.',
      });
      return;
    }

    if (!propertyTitle) {
      Toast.show({
        type: "error",
        text1: "Property title missing",
      });
      return;
    }

    // ✅ Convert Telugu/Hindi to English before saving
   // ✅ Convert Telugu/Hindi to English before saving
const convertedData = {
  ownership: convertToEnglish(ownership),
  authority: convertToEnglish(authority),
  industryType: convertToEnglish(industryType),
  preLeased: convertToEnglish(preLeased),
  leaseDuration: convertToEnglish(leaseDuration),
  amenities: amenities.map(item => convertToEnglish(item)),
  locationAdvantages: locationAdvantages.map(item => convertToEnglish(item)),
};

    console.log('🌐 Converted Plot data:', convertedData);

    const updatedCommercialDetails = {
      ...plotDetailsFromPrev,
      propertyTitle,
      expectedPrice: Number(expectedPrice),
      description: description,
      priceDetails: {
        allInclusive,
        negotiable,
        taxExcluded,
      },
      pricingExtras: {
        ownership: convertedData.ownership,
        authority: convertedData.authority,
        industryType: convertedData.industryType || '',
        preLeased: convertedData.preLeased,
        leaseDuration: convertedData.leaseDuration || '',
        monthlyRent: monthlyRent ? Number(monthlyRent) : 0,
        cornerProperty,
        amenities: convertedData.amenities,
        locationAdvantages: convertedData.locationAdvantages,
        description: description
      },
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/PlotVaastu",
      params: {
        commercialDetails: JSON.stringify(updatedCommercialDetails),
        images: JSON.stringify(images),
        area: params.area,
        propertyTitle,
        plotKind: plotKindFromParams,
        // ✅ In edit mode, pass original full property data
        editMode: isEditMode ? 'true' : params.editMode,
        propertyId: isEditMode ? editPropertyId : params.propertyId,
        propertyData: isEditMode && originalPropertyData ? JSON.stringify(originalPropertyData) : params.propertyData,
      },
    });
  };

  const handleBack = () => {
    if (!plotDetailsFromPrev) {
      router.back();
      return;
    }

    // ✅ Save current Pricing form data before going back
    const updatedCommercialDetails = {
      ...plotDetailsFromPrev,
      expectedPrice: Number(expectedPrice) || undefined,
      priceDetails: { allInclusive, negotiable, taxExcluded },
      pricingExtras: {
        ownership,
        authority,
        industryType,
        preLeased,
        leaseDuration,
        monthlyRent,
        cornerProperty,
        amenities,
        locationAdvantages,
      },
    };

    console.log('🔙 Going back to Plot with Pricing data');

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/Plot",
      params: {
        commercialDetails: JSON.stringify(updatedCommercialDetails),
        images: JSON.stringify(images),
        area: params.area,
        propertyTitle,
        plotKind: plotKindFromParams,
        // ✅ In edit mode, pass original full property data
        editMode: isEditMode ? 'true' : params.editMode,
        propertyId: isEditMode ? editPropertyId : params.propertyId,
        propertyData: isEditMode && originalPropertyData ? JSON.stringify(originalPropertyData) : params.propertyData,
      },
    });
  };

  return (
    <View className="flex-1 bg-white">
      
      {/* HEADER */}
      <View className="flex-row items-center ml-4 mt-12 mb-4">
        <TouchableOpacity onPress={handleBack}>
          <Image
            source={require("../../../../../../assets/arrow.png")}
            className="w-5 h-5"
          />
        </TouchableOpacity>
        <View className="ml-2">
          <Text className="text-[16px] font-semibold">{t('upload_property_title')}</Text>
          <Text className="text-[12px] text-[#00000066]">
            {t('upload_property_subtitle')}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* ================= WHITE CARD ================= */}
        <View className="bg-white border border-gray-200 rounded-xl p-4">

          {/* OWNERSHIP */}
          <Text className="font-semibold mb-2">{t('plot_ownership')}</Text>
          <View className="flex-row flex-wrap mb-4">
            {ownershipOptions.map(opt => (
              <PillButton
                key={opt}
                label={opt}
                selected={ownership === opt}
                onPress={() => setOwnership(opt)}
              />
            ))}
          </View>

          {/* AUTHORITY */}
          <Text className="font-semibold mb-2">
            {t('plot_authority_approved')}
          </Text>
          <TextInput
            placeholder={t('plot_authority_placeholder')}
            value={authority}
            onChangeText={setAuthority}
            className="border rounded-lg px-3 py-3 mb-4 text-sm"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "authority" ? "#22C55E" : "#d1d5db",
            }}
            onFocus={() => setFocusedField("authority")}
            onBlur={() => setFocusedField(null)}
          />

          {/* INDUSTRY TYPE */}
          <Text className="font-semibold mb-2">
            {t('plot_industry_type')}
          </Text>
          <TextInput
            placeholder={t('plot_industry_type_placeholder')}
            value={industryType}
            onChangeText={setIndustryType}
            className="border rounded-lg px-3 py-3 mb-4 text-sm"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "industryType" ? "#22C55E" : "#d1d5db",
            }}
            onFocus={() => setFocusedField("industryType")}
            onBlur={() => setFocusedField(null)}
          />

          {/* PRICE */}
          <Text className="font-semibold mb-2">{t('plot_expected_price')} <Text className="text-red-500">*</Text></Text>
          <TextInput
            placeholder={t('plot_expected_price_placeholder')}
            value={expectedPrice}
            onChangeText={setExpectedPrice}
            keyboardType="numeric"
            className="border rounded-lg px-3 py-3 mb-3 text-sm"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "expectedPrice" ? "#22C55E" : "#d1d5db",
            }}
            onFocus={() => setFocusedField("expectedPrice")}
            onBlur={() => setFocusedField(null)}
          />

          <Checkbox
            label={t('plot_price_all_inclusive')}
            checked={allInclusive}
            onPress={() => setAllInclusive(!allInclusive)}
          />
          <Checkbox
            label={t('plot_price_negotiable')}
            checked={negotiable}
            onPress={() => setNegotiable(!negotiable)}
          />
          <Checkbox
            label={t('plot_price_tax_excluded')}
            checked={taxExcluded}
            onPress={() => setTaxExcluded(!taxExcluded)}
          />
          <TouchableOpacity onPress={() => setIsMorePricingModalVisible(true)}>
            <Text className="text-[#22C55E] text-sm mt-2">
              {t('plot_more_pricing')}
            </Text>
          </TouchableOpacity>

          {/* PRE-LEASED */}
          <Text className="font-semibold mt-4 mb-2">
            {t('plot_pre_leased')}
          </Text>
          <View className="flex-row mb-4">
            <PillButton
              label={t('plot_pre_leased_yes')}
              selected={preLeased === "Yes"}
              onPress={() => setPreLeased("Yes")}
            />
            <PillButton
              label={t('plot_pre_leased_no')}
              selected={preLeased === "No"}
              onPress={() => setPreLeased("No")}
            />
          </View>
          
          {preLeased === "Yes" && (
            <>
              <TextInput
                placeholder={t('plot_lease_duration')}
                value={leaseDuration}
                onChangeText={setLeaseDuration}
                className="border rounded-xl px-4 py-3 mb-3 text-sm"
                style={{
                  borderWidth: 2,
                  borderColor: focusedField === "leaseDuration" ? "#22C55E" : "#e5e7eb",
                }}
                onFocus={() => setFocusedField("leaseDuration")}
                onBlur={() => setFocusedField(null)}
              />
              <TextInput
                placeholder={t('plot_monthly_rent')}
                value={monthlyRent}
                onChangeText={setMonthlyRent}
                keyboardType="numeric"
                className="border rounded-xl px-4 py-3 text-sm"
                style={{
                  borderWidth: 2,
                  borderColor: focusedField === "monthlyRent" ? "#22C55E" : "#e5e7eb",
                }}
                onFocus={() => setFocusedField("monthlyRent")}
                onBlur={() => setFocusedField(null)}
              />
            </>
          )}

          {/* DESCRIPTION */}
          <Text className="font-semibold mb-2">{t('plot_description')} <Text className="text-red-500">*</Text></Text>
          <TextInput
            placeholder={t('plot_description_placeholder')}
            value={description}
            onChangeText={setDescription}
            multiline
            className="border rounded-lg px-3 py-3 h-24 text-sm mb-4"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "description" ? "#22C55E" : "#d1d5db",
            }}
            onFocus={() => setFocusedField("description")}
            onBlur={() => setFocusedField(null)}
          />

          {/* OTHER FEATURES */}
          <Text className="font-semibold mb-2">{t('plot_other_features')}</Text>
          <Checkbox
            label={t('plot_corner_property')}
            checked={cornerProperty}
            onPress={() => setCornerProperty(!cornerProperty)}
          />

          {/* AMENITIES */}
          <Text className="font-semibold mt-4 mb-2">{t('plot_amenities')}</Text>
          <View className="flex-row flex-wrap">
            {amenitiesOptions.map(item => (
              <PillButton
                key={item}
                label={item}
                selected={amenities.includes(item)}
                onPress={() => toggleItem(item, amenities, setAmenities)}
              />
            ))}
          </View>

          {/* LOCATION ADVANTAGES */}
          <Text className="font-semibold mt-4 mb-2">
            {t('plot_location_advantages')}
          </Text>
          <View className="flex-row flex-wrap">
            {locationAdvOptions.map(item => (
              <PillButton
                key={item}
                label={item}
                selected={locationAdvantages.includes(item)}
                onPress={() =>
                  toggleItem(item, locationAdvantages, setLocationAdvantages)
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-12">
        <TouchableOpacity
          onPress={handleBack}
          className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
        >
          <Text>{t('button_cancel')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          className="px-5 py-3 rounded-lg bg-green-500 mx-3"
        >
          <Text className="text-white font-semibold">{t('button_next')}</Text>
        </TouchableOpacity>
      </View>
      
      <MorePricingDetailsModal
        visible={isMorePricingModalVisible}
        onClose={() => setIsMorePricingModalVisible(false)}
      />
    </View>
  );
}