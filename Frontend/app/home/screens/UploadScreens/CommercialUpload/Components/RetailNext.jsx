//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/RetailNext.jsx

import React, { useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import MorePricingDetailsModal from "../../MorePricingDetailsModal";
import { useTranslation } from 'react-i18next';
import { toEnglish, convertToEnglish } from '../../../../../../utils/reverseTranslation';

/* ---------- UI HELPERS ---------- */
const PillButton = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-1.5 rounded-full mr-2 mb-2 border ${
      selected ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"
    }`}
  >
    <Text
      className={`text-xs ${selected ? "text-green-600" : "text-gray-500"}`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const Checkbox = ({ label, checked, onPress }) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center mb-3">
    <View
      className={`w-4 h-4 mr-2 items-center justify-center border ${
        checked ? "border-green-500 bg-green-500" : "border-gray-300 bg-white"
      }`}
    >
      {checked && <Text className="text-white text-[10px]">✓</Text>}
    </View>
    <Text className="text-sm text-gray-600">{label}</Text>
  </TouchableOpacity>
);

export default function RetailNext() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  const [area, setArea] = useState("");

  // ✅ Parse images
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

  // ✅ Parse commercialDetails
  const commercialDetails = useMemo(() => {
    try {
      if (!params.commercialDetails) return null;
      if (typeof params.commercialDetails === 'object') return params.commercialDetails;
      return JSON.parse(params.commercialDetails);
    } catch (e) {
      console.error('❌ Error parsing commercialDetails:', e);
      return null;
    }
  }, [params.commercialDetails]);

  // ✅ Parse baseDetails
  const baseDetails = useMemo(() => {
    try {
      if (!params.commercialBaseDetails) return null;
      if (typeof params.commercialBaseDetails === 'object') return params.commercialBaseDetails;
      return JSON.parse(params.commercialBaseDetails);
    } catch (e) {
      console.error('❌ Error parsing commercialBaseDetails:', e);
      return null;
    }
  }, [params.commercialBaseDetails]);

  const forwardedPropertyTitle = params.propertyTitle || (commercialDetails && commercialDetails.propertyTitle);

  /* ---------- STATE ---------- */
  const [ownership, setOwnership] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [allInclusive, setAllInclusive] = useState(false);
  const [negotiable, setNegotiable] = useState(false);
  const [taxExcluded, setTaxExcluded] = useState(false);

  const [preLeased, setPreLeased] = useState(null);
  const [leaseDuration, setLeaseDuration] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  const [prevUsedFor, setPrevUsedFor] = useState("Commercial");
  const [showPrevUsed, setShowPrevUsed] = useState(false);

  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [locationAdvantages, setLocationAdvantages] = useState([]);

  const [focusedField, setFocusedField] = useState(null);
  const [isMorePricingModalVisible, setIsMorePricingModalVisible] = useState(false);

  /* ---------- OPTIONS ---------- */
  const ownershipOptions = [
    t('retail_ownership_freehold'),
    t('retail_ownership_leasehold'),
    t('retail_ownership_cooperative'),
    t('retail_ownership_poa'),
  ];

  const prevUsedOptions = [
    t('retail_used_commercial'),
    t('retail_used_retail'),
    t('retail_used_warehouse'),
  ];

  const amenitiesOptions = [
    t('retail_amenity_lift'),
    t('retail_amenity_maintenance'),
    t('retail_amenity_water_storage'),
    t('retail_amenity_atm'),
    t('retail_amenity_water_disposal'),
    t('retail_amenity_rainwater'),
    t('retail_amenity_fire_alarm'),
    t('retail_amenity_near_bank'),
    t('retail_amenity_visitor_parking'),
    t('retail_amenity_security_guard'),
    t('retail_amenity_lifts'),
  ];

  const locationAdvOptions = [
    t('retail_loc_metro'),
    t('retail_loc_school'),
    t('retail_loc_hospital'),
    t('retail_loc_market'),
    t('retail_loc_railway'),
    t('retail_loc_airport'),
    t('retail_loc_mall'),
    t('retail_loc_highway'),
  ];

  const toggleItem = (value, list, setList) => {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    );
  };

  // ✅ Load draft from AsyncStorage
 useEffect(() => {
  const loadData = async () => {
    // ✅ PRIORITY 1: Load data in edit mode
    if (params.editMode === 'true' && params.propertyData) {
      try {
        const property = JSON.parse(params.propertyData);
        console.log('📝 Loading Retail pricing for edit:', property._id);
        
        // Helper function to get localized text
        const getLocalizedText = (field) => {
          if (!field) return '';
          if (typeof field === 'string') return field;
          if (typeof field === 'object') {
            return field.en || field.te || field.hi || '';
          }
          return '';
        };
        
        // Load pricing details from commercialDetails
        if (property.commercialDetails?.retailDetails) {
          const retail = property.commercialDetails.retailDetails;
          
          setOwnership(retail.ownership || '');
          setExpectedPrice(retail.expectedPrice?.toString() || '');
          setAllInclusive(retail.priceDetails?.allInclusive || false);
          setNegotiable(retail.priceDetails?.negotiable || false);
          setTaxExcluded(retail.priceDetails?.taxExcluded || false);
          setPreLeased(retail.preLeased || null);
          setLeaseDuration(retail.leaseDuration || '');
          setMonthlyRent(retail.monthlyRent?.toString() || '');
          setPrevUsedFor(retail.previouslyUsedFor || 'Commercial');
          setDescription(getLocalizedText(retail.description) || '');
          setAmenities(retail.amenities || []);
          setLocationAdvantages(retail.locationAdvantages || []);
        }
        
        console.log('✅ Retail pricing loaded for editing');
        return; // Don't load draft in edit mode
      } catch (error) {
        console.error('❌ Error loading retail pricing data:', error);
      }
    }
    
    // ✅ PRIORITY 2: Load from params (navigation back)
    if (params.commercialDetails) {
      try {
        const details = JSON.parse(params.commercialDetails);
        if (details.retailDetails) {
          const retail = details.retailDetails;
          console.log('🔄 Restoring Retail pricing from params');

          setOwnership(retail.ownership || '');
          setExpectedPrice(retail.expectedPrice?.toString() || '');
          setAllInclusive(retail.priceDetails?.allInclusive || false);
          setNegotiable(retail.priceDetails?.negotiable || false);
          setTaxExcluded(retail.priceDetails?.taxExcluded || false);
          setPreLeased(retail.preLeased || null);
          setLeaseDuration(retail.leaseDuration || '');
          setMonthlyRent(retail.monthlyRent?.toString() || '');
          setPrevUsedFor(retail.previouslyUsedFor || 'Commercial');
          setDescription(retail.description || '');
          setAmenities(retail.amenities || []);
          setLocationAdvantages(retail.locationAdvantages || []);

          console.log('✅ Retail pricing restored from params');
          return;
        }
      } catch (e) {
        console.log('❌ Could not restore from params:', e);
      }
    }
    
    // ✅ PRIORITY 3: Load from AsyncStorage draft (only in create mode)
    if (!params.editMode || params.editMode !== 'true') {
      try {
        const draft = await AsyncStorage.getItem('draft_retail_pricing');
        if (draft) {
          const savedData = JSON.parse(draft);
          console.log('📦 Loading Retail pricing draft from AsyncStorage');
          
          setOwnership(savedData.ownership || '');
          setExpectedPrice(savedData.expectedPrice?.toString() || '');
          setAllInclusive(savedData.allInclusive || false);
          setNegotiable(savedData.negotiable || false);
          setTaxExcluded(savedData.taxExcluded || false);
          setPreLeased(savedData.preLeased || null);
          setLeaseDuration(savedData.leaseDuration || '');
          setMonthlyRent(savedData.monthlyRent?.toString() || '');
          setPrevUsedFor(savedData.previouslyUsedFor || 'Commercial');
          setDescription(savedData.description || '');
          setAmenities(savedData.amenities || []);
          setLocationAdvantages(savedData.locationAdvantages || []);
          
          console.log('✅ Retail pricing draft loaded');
        }
      } catch (e) {
        console.log('⚠️ Failed to load Retail pricing draft:', e);
      }
    }
  };

  loadData();
}, [params.editMode, params.propertyData, params.commercialDetails]);

  // ✅ Auto-save pricing draft
  useEffect(() => {
    if (params.editMode === 'true') return;
    const saveDraft = async () => {
      const pricingDraft = {
        ownership,
        expectedPrice,
        allInclusive,
        negotiable,
        taxExcluded,
        preLeased,
        leaseDuration,
        monthlyRent,
        previouslyUsedFor: prevUsedFor,
        description,
        amenities,
        locationAdvantages,
        timestamp: new Date().toISOString(),
      };

      try {
        await AsyncStorage.setItem('draft_retail_pricing', JSON.stringify(pricingDraft));
        console.log('💾 Retail pricing draft auto-saved');
      } catch (e) {
        console.log('⚠️ Failed to save Retail pricing draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [params.editMode, ownership, expectedPrice, allInclusive, negotiable, taxExcluded, 
      preLeased, leaseDuration, monthlyRent, prevUsedFor, description, 
      amenities, locationAdvantages]);

  // ✅ handleBack function
  const handleBack = () => {
    if (!commercialDetails || !commercialDetails.retailDetails) {
      router.back();
      return;
    }

    // Save current state before going back
    const currentData = {
      ...commercialDetails.retailDetails,
      ownership,
      expectedPrice: Number(expectedPrice) || undefined,
      priceDetails: {
        allInclusive,
        negotiable,
        taxExcluded,
      },
      preLeased,
      leaseDuration: leaseDuration || undefined,
      monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
      previouslyUsedFor: prevUsedFor,
      description,
      amenities,
      locationAdvantages,
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/Retail",
      params: {
        retailDetails: JSON.stringify(currentData),
        images: JSON.stringify(images),
        area: params.area || area,
        commercialBaseDetails: params.commercialBaseDetails,
      },
    });
  };

  /* ---------- VALIDATION & NEXT ---------- */
  const handleNext = () => {
    if (!commercialDetails) {
      Alert.alert(
        t('alert_missing_data'),
        t('alert_retail_details_missing'),
        [{ text: t('button_go_back'), onPress: () => router.back() }]
      );
      return;
    }

    if (!expectedPrice) {
      Toast.show({
        type: "error",
        text1: t('retail_price_required'),
      });
      return;
    }

    if (!description.trim()) {
      Toast.show({
        type: "error",
        text1: t('retail_description_required'),
      });
      return;
    }

    // ✅ BUILD COMPLETE commercialDetails OBJECT
  const updatedCommercialDetails = {
  ...commercialDetails,
  retailDetails: {
    ...commercialDetails.retailDetails,
    
    ownership: toEnglish(ownership),  // ✅ ADD
    expectedPrice: Number(expectedPrice),
    
    priceDetails: {
      allInclusive,
      negotiable,
      taxExcluded,
    },
    
    preLeased: toEnglish(preLeased),  // ✅ ADD
    leaseDuration: leaseDuration || undefined,
    monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
    
    previouslyUsedFor: toEnglish(prevUsedFor),  // ✅ ADD
    
    description,
    
    amenities: convertToEnglish(amenities),  // ✅ ADD
    locationAdvantages: convertToEnglish(locationAdvantages),  // ✅ ADD
  },
};
    console.log('🔄 Passing to RetailVaastu:', {
      hasCommercialDetails: !!updatedCommercialDetails,
      hasRetailDetails: !!updatedCommercialDetails.retailDetails,
      propertyTitle: updatedCommercialDetails.propertyTitle,
    });

   router.push({
  pathname: "/home/screens/UploadScreens/CommercialUpload/Components/RetailVaastu",
  params: {
    commercialDetails: JSON.stringify(updatedCommercialDetails),
    images: JSON.stringify(images),
    area: params.area || area,
    propertyTitle: updatedCommercialDetails.propertyTitle,
    commercialBaseDetails: params.commercialBaseDetails,
    // ✅ ADD THESE THREE LINES
    editMode: params.editMode,
    propertyId: params.propertyId,
    propertyData: params.propertyData,
  },
});
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* HEADER */}
      <View className="flex-row items-center mt-6 mb-4">
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

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        className="px-4"
      >
        <View className="bg-white border border-gray-200 rounded-2xl p-4">
          {/* OWNERSHIP */}
          <Text className="font-semibold mb-2">{t('retail_ownership')}</Text>
          <View className="flex-row flex-wrap mb-4">
            {ownershipOptions.map((opt) => (
              <PillButton
                key={opt}
                label={opt}
                selected={ownership === opt}
                onPress={() => setOwnership(opt)}
              />
            ))}
          </View>

          {/* EXPECTED PRICE */}
          <Text className="font-semibold mb-2">
            {t('retail_expected_price')} <Text className="text-red-500">*</Text>
          </Text>

          <TextInput
            placeholder={t('retail_enter_price')}
            value={expectedPrice}
            onChangeText={(t) => setExpectedPrice(t.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            onFocus={() => setFocusedField("price")}
            onBlur={() => setFocusedField(null)}
            className="rounded-xl px-4 py-3 mb-3 text-sm"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "price" ? "#86EFAC" : "#E5E7EB",
            }}
          />

          <Checkbox
            label={t('retail_all_inclusive')}
            checked={allInclusive}
            onPress={() => setAllInclusive(!allInclusive)}
          />
          <Checkbox
            label={t('retail_price_negotiable')}
            checked={negotiable}
            onPress={() => setNegotiable(!negotiable)}
          />
          <Checkbox
            label={t('retail_tax_excluded')}
            checked={taxExcluded}
            onPress={() => setTaxExcluded(!taxExcluded)}
          />

          <TouchableOpacity onPress={() => setIsMorePricingModalVisible(true)}>
            <Text className="text-[#22C55E] text-sm mt-2">
              + Add more pricing details
            </Text>
          </TouchableOpacity>

          {/* PRE-LEASED */}
          <Text className="font-semibold mt-4 mb-2">
            {t('retail_pre_leased')}
          </Text>

          <View className="flex-row mb-2">
            <PillButton
              label={t('retail_yes')}
              selected={preLeased === "Yes"}
              onPress={() => setPreLeased("Yes")}
            />
            <PillButton
              label={t('retail_no')}
              selected={preLeased === "No"}
              onPress={() => setPreLeased("No")}
            />
          </View>

          {preLeased === "Yes" && (
            <>
              <TextInput
                placeholder={t('retail_lease_duration')}
                value={leaseDuration}
                onChangeText={setLeaseDuration}
                onFocus={() => setFocusedField("lease")}
                onBlur={() => setFocusedField(null)}
                className="rounded-xl px-4 py-3 mb-3 text-sm"
                style={{
                  borderWidth: 2,
                  borderColor: focusedField === "lease" ? "#86EFAC" : "#E5E7EB",
                }}
              />
              <TextInput
                placeholder={t('retail_monthly_rent')}
                value={monthlyRent}
                onChangeText={(t) => setMonthlyRent(t.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                onFocus={() => setFocusedField("rent")}
                onBlur={() => setFocusedField(null)}
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  borderWidth: 2,
                  borderColor: focusedField === "rent" ? "#86EFAC" : "#E5E7EB",
                }}
              />
            </>
          )}

          {/* PREVIOUS USE */}
          <Text className="font-semibold mt-4 mb-2">
            {t('retail_previously_used')}
          </Text>

          <TouchableOpacity
            onPress={() => setShowPrevUsed(!showPrevUsed)}
            className="border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
          >
            <Text className="text-sm">{prevUsedFor}</Text>
            <Ionicons name="chevron-down" size={18} />
          </TouchableOpacity>

          {showPrevUsed &&
            prevUsedOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => {
                  setPrevUsedFor(opt);
                  setShowPrevUsed(false);
                }}
                className="px-4 py-2"
              >
                <Text className="text-sm">{opt}</Text>
              </TouchableOpacity>
            ))}

          {/* DESCRIPTION */}
          <Text className="font-semibold mt-4 mb-2">
            {t('retail_description')} <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder={t('retail_describe_placeholder')}
            value={description}
            onChangeText={(t) =>
              setDescription(t.replace(/[^a-zA-Z0-9\s]/g, ""))
            }
            multiline
            onFocus={() => setFocusedField("desc")}
            onBlur={() => setFocusedField(null)}
            className="rounded-xl px-4 py-3 h-28 text-sm"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "desc" ? "#86EFAC" : "#E5E7EB",
            }}
            textAlignVertical="top"
          />

          {/* AMENITIES */}
          <Text className="font-semibold mt-6 mb-3">{t('retail_amenities')}</Text>
          <View className="flex-row flex-wrap">
            {amenitiesOptions.map((item) => (
              <PillButton
                key={item}
                label={item}
                selected={amenities.includes(item)}
                onPress={() => toggleItem(item, amenities, setAmenities)}
              />
            ))}
          </View>

          {/* LOCATION ADVANTAGES */}
          <Text className="font-semibold mt-6 mb-3">{t('retail_location_advantages')}</Text>
          <View className="flex-row flex-wrap">
            {locationAdvOptions.map((item) => (
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
      <View
        style={{ flexDirection: "row", padding: 16, backgroundColor: "#fff" }}
        className="mb-8 justify-end mt-4 space-x-5 mx-3"
      >
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
  <Text className="text-white font-semibold">
    {isEditMode ? t('button_update') : t('button_next')}
  </Text>
</TouchableOpacity>
      </View>

      <MorePricingDetailsModal
        visible={isMorePricingModalVisible}
        onClose={() => setIsMorePricingModalVisible(false)}
      />
    </View>
  );
}