//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/StorageNext.jsx

import React, { useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from 'react-native-toast-message';
import MorePricingDetailsModal from "../../MorePricingDetailsModal";
import { useTranslation } from 'react-i18next'; // ✅ ADD THIS

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

const Checkbox = ({ label, selected, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
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
    <Text style={{ fontSize: 11, color: '#00000099' }}>{label}</Text>
  </TouchableOpacity>
);

const StorageNext = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation(); // ✅ ADD THIS

  /* ---------------- PRICE STATES ---------------- */
  const ownershipOptions = [
    t('storage_ownership_freehold'),
    t('storage_ownership_leasehold'),
    t('storage_ownership_company'),
    t('storage_ownership_other')
  ];

  const [ownership, setOwnership] = useState('');
  const [expectedPrice, setExpectedPrice] = useState("");
  const [allInclusive, setAllInclusive] = useState(false);
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [taxExcluded, setTaxExcluded] = useState(false);
  const [IndustryApprovedBy, setIndustryApprovedBy] = useState("");
  const [approvedIndustryType, setApprovedIndustryType] = useState("");
  const authorityOptions = [t('storage_local_authority')];

  /* ---------------- YES / NO STATES ---------------- */
  const [preLeased, setPreLeased] = useState(null);

  /* ---------------- DESCRIPTION ---------------- */
  const [describeProperty, setDescribeProperty] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [pricingModalVisible, setPricingModalVisible] = useState(false);
  const [wheelchairFriendly, setWheelchairFriendly] = useState(false);
  /* ---------------- AMENITIES ---------------- */
  const amenityOptions = [
    "+Water Storage",
    "+currently Air Conditioned",
    "+Vaastu Complex",
    "+Security fire Alarm",
    "+Visitor Parking",
  ];
  const [amenities, setAmenities] = useState([]);

  /* ---------------- LOCATION ADVANTAGES ---------------- */
  const locationAdvantages = [
    "+Close to Metro Station",
    "+Close to School",
    "+Close to Hospital",
    "+Close to Market",
    "+Close to Railway Station",
    "+Close to Airport",
    "+Close to Mall",
    "+Close to Highway",
  ];
  const [locAdvantages, setLocAdvantages] = useState([]);

  const [leaseDuration, setLeaseDuration] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  // Parse params
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

  // Load draft from AsyncStorage
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await AsyncStorage.getItem('draft_storage_pricing');
        if (draft) {
          const savedData = JSON.parse(draft);
          console.log('📦 Loading Storage pricing draft from AsyncStorage');

          setOwnership(savedData.ownership || '');
          setExpectedPrice(savedData.expectedPrice?.toString() || '');
          setAllInclusive(savedData.allInclusive || false);
          setPriceNegotiable(savedData.priceNegotiable || false);
          setTaxExcluded(savedData.taxExcluded || false);
          setIndustryApprovedBy(savedData.IndustryApprovedBy || '');
          setApprovedIndustryType(savedData.approvedIndustryType || '');
          setPreLeased(savedData.preLeased || null);
          setLeaseDuration(savedData.leaseDuration || '');
          setMonthlyRent(savedData.monthlyRent?.toString() || '');
          setDescribeProperty(savedData.describeProperty || '');
          setWheelchairFriendly(parsed.wheelchairFriendly || false);
          if (Array.isArray(savedData.amenities)) {
            setAmenities(savedData.amenities);
          }
          if (Array.isArray(savedData.locAdvantages)) {
            setLocAdvantages(savedData.locAdvantages);
          }

          console.log('✅ Storage pricing draft loaded');
          return;
        }
      } catch (e) {
        console.log('⚠️ Failed to load Storage pricing draft:', e);
      }

      // Fallback to params
      if (commercialDetails?.storageDetails) {
        const storage = commercialDetails.storageDetails;

        setOwnership(storage.ownership || '');
        setExpectedPrice(storage.expectedPrice?.toString() || '');
        setAllInclusive(storage.priceDetails?.allInclusive || false);
        setPriceNegotiable(storage.priceDetails?.negotiable || false);
        setTaxExcluded(storage.priceDetails?.taxExcluded || false);
        setIndustryApprovedBy(storage.authority || '');
        setApprovedIndustryType(storage.approvedIndustryType || '');
        setPreLeased(storage.preLeased || null);
        setLeaseDuration(storage.leaseDuration || '');
        setMonthlyRent(storage.monthlyRent?.toString() || '');
        setDescribeProperty(storage.description || '');

        const restoredAmenities = storage.amenities || [];
        const restoredLocAdvantages = storage.locationAdvantages || storage.locAdvantages || [];

        if (Array.isArray(restoredAmenities) && restoredAmenities.length > 0) {
          setAmenities(restoredAmenities);
        }

        if (Array.isArray(restoredLocAdvantages) && restoredLocAdvantages.length > 0) {
          setLocAdvantages(restoredLocAdvantages);
        }
      }
    };

    loadDraft();
  }, [commercialDetails]);

  // Auto-save pricing draft
  useEffect(() => {
    const saveDraft = async () => {
      const pricingDraft = {
        ownership,
        expectedPrice,
        allInclusive,
        priceNegotiable,
        taxExcluded,
        IndustryApprovedBy,
        approvedIndustryType,
        preLeased,
        leaseDuration,
        monthlyRent,
        describeProperty,
        amenities,
        locAdvantages,
        wheelchairFriendly,
        timestamp: new Date().toISOString(),
      };

      try {
        await AsyncStorage.setItem('draft_storage_pricing', JSON.stringify(pricingDraft));
        console.log('💾 Storage pricing draft auto-saved');
      } catch (e) {
        console.log('⚠️ Failed to save Storage pricing draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [ownership, expectedPrice, allInclusive, priceNegotiable, taxExcluded,
    IndustryApprovedBy, approvedIndustryType, preLeased, leaseDuration,
    monthlyRent, describeProperty, wheelchairFriendly, amenities, locAdvantages]);

  /* ---------------- HELPERS ---------------- */
  const toggleArrayItem = (setter, array, value) => {
    if (array.includes(value)) {
      setter(array.filter((item) => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  const handleNext = () => {
    if (!commercialDetails) {
      Toast.show({ type: "error", text1: "Storage details missing" });
      return;
    }

    if (!expectedPrice.trim()) {
      Toast.show({ type: "error", text1: t('storage_price_required') });
      return;
    }

    if (!describeProperty.trim()) {
      Toast.show({ type: "error", text1: t('storage_description_required') });
      return;
    }

    // ✅ CONVERT storageType before saving
    const storageTypeMap = {
      'వేర్‌హౌస్': 'Warehouse',
      'गोदाम': 'Warehouse',
      'కోల్డ్ స్టోరేజ్': 'Cold Storage',
      'कोल्ड स्टोरेज': 'Cold Storage'
    };

    const rawStorageType = commercialDetails?.storageDetails?.storageType ||
      commercialDetails?.storageType ||
      params.storageType;

    const convertedStorageType = storageTypeMap[rawStorageType] || rawStorageType;

    console.log('🔄 Storage Type in StorageNext:', {
      raw: rawStorageType,
      converted: convertedStorageType
    });

    const updatedCommercialDetails = {
      ...commercialDetails,

      storageDetails: {
        ...commercialDetails.storageDetails,
        storageType: convertedStorageType, // ✅ USE CONVERTED VALUE

        expectedPrice: Number(expectedPrice),
        description: describeProperty,

        priceDetails: {
          allInclusive,
          negotiable: priceNegotiable,
          taxExcluded,
        },

        ownership,
        authority: IndustryApprovedBy,
        approvedIndustryType,

        preLeased,
        leaseDuration,
        monthlyRent: monthlyRent ? Number(monthlyRent) : null,

        amenities,
        locationAdvantages: locAdvantages,
        wheelchairFriendly,
      },
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/StorageVaastu",
      params: {
        commercialDetails: JSON.stringify(updatedCommercialDetails),
        images: JSON.stringify(images),
        area: params.area,
        propertyTitle: commercialDetails.storageDetails?.propertyTitle || params.propertyTitle,
      },
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center mt-7 mb-4">
          <TouchableOpacity
            onPress={() => {
              const currentData = {
                ...commercialDetails?.storageDetails,
                expectedPrice: Number(expectedPrice) || undefined,
                priceDetails: { allInclusive, negotiable: priceNegotiable, taxExcluded },
                ownership,
                authority: IndustryApprovedBy,
                approvedIndustryType,
                preLeased,
                leaseDuration,
                monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
                description: describeProperty,
                amenities,
                locationAdvantages: locAdvantages,
              };

              router.push({
                pathname: "/home/screens/UploadScreens/CommercialUpload/Components/Storage",
                params: {
                  storageDetails: JSON.stringify(currentData),
                  images: JSON.stringify(images),
                  area: params.area,
                  storageType: commercialDetails?.storageDetails?.storageType || params.storageType,
                  commercialBaseDetails: params.commercialBaseDetails,
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

        {/* PRICE DETAILS */}
        <View
          className="bg-white rounded-lg p-4 mb-4"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="text-[15px] text-[#00000099] font-bold mb-2">
            {t('storage_ownership')}
          </Text>
          <View className="flex-row flex-wrap mb-4">
            {ownershipOptions.map((o, index) => {
              const values = ['Freehold', 'Leasehold', 'Company Owned', 'Other'];
              return (
                <PillButton
                  key={o}
                  label={o}
                  selected={ownership === values[index]}
                  onPress={() => setOwnership(values[index])}
                />
              );
            })}
          </View>

          <Text className="mb-2 text-[15px] font-bold text-[#00000099]">
            {t('storage_approved_by')}
          </Text>
          <View className="flex-row flex-wrap mb-4">
            {authorityOptions.map((auth) => (
              <PillButton
                key={auth}
                label={auth}
                selected={IndustryApprovedBy === 'Local Authority'}
                onPress={() => setIndustryApprovedBy('Local Authority')}
              />
            ))}
          </View>

          <Text className="mb-2 text-[15px] font-bold text-[#00000099]">
            {t('storage_industry_type')}
          </Text>
          <TextInput
            placeholder={t('storage_select_industry')}
            value={approvedIndustryType}
            onChangeText={setApprovedIndustryType}
            onFocus={() => setFocusedField("industryType")}
            onBlur={() => setFocusedField(null)}
            className="rounded-md p-3 mb-3"
            style={{
              borderWidth: 1,
              borderColor: focusedField === "industryType" ? "#22C55E" : "#0000001A",
              backgroundColor: "#D9D9D91C",
              height: 50,
            }}
          />

          <Text className="mb-2 text-[15px] font-bold text-[#00000099]">
            {t('storage_price_details')} <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder={t('storage_expected_price')}
            value={expectedPrice}
            onChangeText={setExpectedPrice}
            onFocus={() => setFocusedField("expectedPrice")}
            onBlur={() => setFocusedField(null)}
            className="rounded-md p-3 mb-3"
            style={{
              borderWidth: 1,
              borderColor: focusedField === "expectedPrice" ? "#22C55E" : "#0000001A",
              height: 52,
              backgroundColor: "#D9D9D91C",
            }}
            keyboardType="numeric"
          />

          <Checkbox
            label={t('storage_all_inclusive')}
            selected={allInclusive}
            onPress={() => setAllInclusive(!allInclusive)}
          />
          <Checkbox
            label={t('storage_price_negotiable')}
            selected={priceNegotiable}
            onPress={() => setPriceNegotiable(!priceNegotiable)}
          />
          <Checkbox
            label={t('storage_tax_excluded')}
            selected={taxExcluded}
            onPress={() => setTaxExcluded(!taxExcluded)}
          />

          <TouchableOpacity onPress={() => setPricingModalVisible(true)}>
            <Text className="text-[#22C55E] text-sm mt-2">
              + Add more pricing details
            </Text>
          </TouchableOpacity>

          {/* PRE LEASED */}
          <Text className="text-[14px] font-bold text-[#00000099] mt-4 mb-2">
            {t('storage_pre_leased')}
          </Text>
          <View className="flex-row mb-4">
            <PillButton
              label={t('storage_yes')}
              selected={preLeased === "Yes"}
              onPress={() => setPreLeased("Yes")}
            />
            <PillButton
              label={t('storage_no')}
              selected={preLeased === "No"}
              onPress={() => setPreLeased("No")}
            />
          </View>

          {preLeased === "Yes" && (
            <View className="mb-4">
              <TextInput
                placeholder={t('storage_current_rent')}
                value={leaseDuration}
                onChangeText={setLeaseDuration}
                onFocus={() => setFocusedField("leaseDuration")}
                onBlur={() => setFocusedField(null)}
                className="rounded-md p-3 mb-3"
                style={{
                  borderWidth: 1,
                  borderColor: focusedField === "leaseDuration" ? "#22C55E" : "#0000001A",
                  backgroundColor: "#D9D9D91C",
                  height: 50,
                }}
              />

              <TextInput
                placeholder={t('storage_lease_tenure')}
                value={monthlyRent}
                onChangeText={setMonthlyRent}
                onFocus={() => setFocusedField("monthlyRent")}
                onBlur={() => setFocusedField(null)}
                keyboardType="numeric"
                className="rounded-md p-3"
                style={{
                  borderWidth: 1,
                  borderColor: focusedField === "monthlyRent" ? "#22C55E" : "#0000001A",
                  backgroundColor: "#D9D9D91C",
                  height: 50,
                }}
              />
            </View>
          )}

          {/* DESCRIPTION */}
          <Text className="mt-4 mb-2 font-bold text-[15px] text-[#00000099]">
            {t('storage_description')} <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder={t('storage_describe_placeholder')}
            value={describeProperty}
            onChangeText={setDescribeProperty}
            onFocus={() => setFocusedField("describeProperty")}
            onBlur={() => setFocusedField(null)}
            multiline
            textAlignVertical="top"
            className="rounded-md p-3"
            style={{
              borderWidth: 1,
              borderColor: focusedField === "describeProperty" ? "#22C55E" : "#0000001A",
              height: 108,
            }}
          />

          {/* AMENITIES & LOCATION */}
          <View
            className="bg-white rounded-lg p-4 mt-4"
            style={{ borderWidth: 1, borderColor: "#0000001A" }}
          >
            <Text className="text-[15px] font-bold text-[#00000099] mb-2">
              {t('storage_amenities')}
            </Text>
            <View className="flex-row flex-wrap mb-4">
              {amenityOptions.map((a) => (
                <PillButton
                  key={a}
                  label={a}
                  selected={amenities.includes(a)}
                  onPress={() => toggleArrayItem(setAmenities, amenities, a)}
                />
              ))}
            </View>
            <Text className="text-[15px] font-bold text-[#00000099] mb-3">
              {t('industry_other_features')}
            </Text>
            <Checkbox
              label={t('industry_wheelchair_friendly')}
              selected={wheelchairFriendly}
              onPress={() => setWheelchairFriendly(!wheelchairFriendly)}
            />

            <Text className="text-[15px] font-bold text-[#00000099] mb-3">
              {t('storage_location_advantages')}
            </Text>
            <View className="flex-row flex-wrap">
              {locationAdvantages.map((a) => (
                <PillButton
                  key={a}
                  label={a}
                  selected={locAdvantages.includes(a)}
                  onPress={() => toggleArrayItem(setLocAdvantages, locAdvantages, a)}
                />
              ))}
            </View>
          </View>


        </View>

        {/* More Pricing Details Modal */}
        <MorePricingDetailsModal
          visible={pricingModalVisible}
          onClose={() => setPricingModalVisible(false)}
        />
      </ScrollView>
      <View className="flex-row justify-end  space-x-3 mx-3 mb-12">
        <TouchableOpacity
          className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
          onPress={() => {
            const currentData = {
              ...commercialDetails?.storageDetails,
              expectedPrice: Number(expectedPrice) || undefined,
              priceDetails: { allInclusive, negotiable: priceNegotiable, taxExcluded },
              ownership,
              authority: IndustryApprovedBy,
              approvedIndustryType,
              preLeased,
              leaseDuration,
              monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
              description: describeProperty,
              amenities,
              locationAdvantages: locAdvantages,
            };

            router.push({
              pathname: "/home/screens/UploadScreens/CommercialUpload/Components/Storage",
              params: {
                storageDetails: JSON.stringify(currentData),
                images: JSON.stringify(images),
                area: params.area,
                storageType: commercialDetails?.storageDetails?.storageType || params.storageType,
                commercialBaseDetails: params.commercialBaseDetails,
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
};

export default StorageNext;