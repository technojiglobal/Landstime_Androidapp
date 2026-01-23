



//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/OfficeNext.jsx
import React, { useState, useEffect, useMemo } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { convertToEnglish } from '../../../../../../utils/reverseTranslation';
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MorePricingDetailsModal from "../../MorePricingDetailsModal";
import { useTranslation } from 'react-i18next';

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
      {selected && (
        <Text style={{ color: "white", fontWeight: "bold" }}>✓</Text>
      )}
    </View>
    <Text className="text-[11px] text-[#00000099]">{label}</Text>
  </Pressable>
);

const AMENITY_OPTIONS = [
  "+Maintenance Staff",
  "+Water Storage",
  "+Water Disposal",
  "+ATM",
  "+Shopping Center",
  "+Wheelchair Accessibility",
  "+Cafeteria/Foodcourt",
  "+DG Availability",
  "+CCTV Surveillance",
  "+Grocery shop",
  "+Visitor Parking",
  "+Power Backup",
  "+Lift(s)",
];

const LOCATION_ADVANTAGES = [
  "+Close to Metro Station",
  "+Close to School",
  "+Close to Hospital",
  "+Close to Market",
  "+Close to Railway Station",
  "+Close to Airport",
  "+Close to Mall",
  "+Close to Highway",
];

const OfficeNext = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  const images = params.images ? JSON.parse(params.images) : [];

  const [expectedPrice, setExpectedPrice] = useState("");
  const [allInclusive, setAllInclusive] = useState(false);
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [taxExcluded, setTaxExcluded] = useState(false);

  const [preLeased, setPreLeased] = useState(null);
  const [nocCertified, setNocCertified] = useState(null);
  const [occupancyCertified, setOccupancyCertified] = useState(null);

  const [visible, setVisible] = useState(null);
  const [prevUsedFor, setPrevUsedFor] = useState("Commercial");

  const [describeProperty, setDescribeProperty] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [locAdvantages, setLocAdvantages] = useState([]);
  const [leaseDuration, setLeaseDuration] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  const [focusedField, setFocusedField] = useState(null);
  const [isMorePricingModalVisible, setIsMorePricingModalVisible] = useState(false);

  const prevUsedForOptions = [
    t('office_prev_commercial'),
    t('office_prev_residential'),
    t('office_prev_warehouse')
  ];

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await AsyncStorage.getItem('draft_office_pricing');
        if (draft) {
          const savedData = JSON.parse(draft);
          console.log('📦 Loading pricing draft from AsyncStorage');
          
          setExpectedPrice(savedData.expectedPrice?.toString() || '');
          setAllInclusive(savedData.allInclusive || false);
          setPriceNegotiable(savedData.priceNegotiable || false);
          setTaxExcluded(savedData.taxExcluded || false);
          setPreLeased(savedData.preLeased || null);
          setLeaseDuration(savedData.leaseDuration || '');
          setMonthlyRent(savedData.monthlyRent?.toString() || '');
          setNocCertified(savedData.nocCertified || null);
          setOccupancyCertified(savedData.occupancyCertified || null);
          setPrevUsedFor(savedData.prevUsedFor || 'Commercial');
          setDescribeProperty(savedData.describeProperty || '');
          setAmenities(savedData.amenities || []);
          setLocAdvantages(savedData.locAdvantages || []);
          
          console.log('✅ Pricing draft loaded');
          return;
        }
      } catch (e) {
        console.log('⚠️ Failed to load pricing draft:', e);
      }

      const officeDetails = params.officeDetails ? JSON.parse(params.officeDetails) : null;
      
      if (officeDetails) {
        console.log('🔄 Restoring OfficeNext data from params');
        
        setExpectedPrice(officeDetails.expectedPrice?.toString() || '');
        setAllInclusive(officeDetails.priceDetails?.allInclusive || false);
        setPriceNegotiable(officeDetails.priceDetails?.negotiable || false);
        setTaxExcluded(officeDetails.priceDetails?.taxExcluded || false);
        setPreLeased(officeDetails.preLeased || null);
        setLeaseDuration(officeDetails.leaseDuration || '');
        setMonthlyRent(officeDetails.monthlyRent?.toString() || '');
        setNocCertified(officeDetails.nocCertified || null);
        setOccupancyCertified(officeDetails.occupancyCertified || null);
        setPrevUsedFor(officeDetails.previouslyUsedFor || 'Commercial');
        setDescribeProperty(officeDetails.description || '');
        setAmenities(officeDetails.amenities || []);
        setLocAdvantages(officeDetails.locationAdvantages || []);
      }
    };

    loadDraft();
  }, [params.officeDetails]);

  useEffect(() => {
    const saveDraft = async () => {
      const pricingDraft = {
        expectedPrice,
        allInclusive,
        priceNegotiable,
        taxExcluded,
        preLeased,
        leaseDuration,
        monthlyRent,
        nocCertified,
        occupancyCertified,
        prevUsedFor,
        describeProperty,
        amenities,
        locAdvantages,
        timestamp: new Date().toISOString(),
      };

      try {
        await AsyncStorage.setItem('draft_office_pricing', JSON.stringify(pricingDraft));
        console.log('💾 Pricing draft auto-saved');
      } catch (e) {
        console.log('⚠️ Failed to save pricing draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [expectedPrice, allInclusive, priceNegotiable, taxExcluded, preLeased, 
      leaseDuration, monthlyRent, nocCertified, occupancyCertified, prevUsedFor,
      describeProperty, amenities, locAdvantages]);

  const toggleArrayItem = (setter, array, value) => {
    if (array.includes(value)) {
      setter(array.filter((item) => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  const officeDetails = useMemo(() => {
    try {
      if (!params.officeDetails) return null;
      if (typeof params.officeDetails === 'object') return params.officeDetails;
      return JSON.parse(params.officeDetails);
    } catch (e) {
      console.error('❌ Error parsing officeDetails:', e);
      return null;
    }
  }, [params.officeDetails]);

const handleNext = () => {
  const baseDetails = params.commercialBaseDetails ? JSON.parse(params.commercialBaseDetails) : null;
  const officeKind = officeDetails?.officeKind || 
                     baseDetails?.officeKind || 
                     params.commercialBaseDetails?.officeKind;

  if (!officeKind) {
    console.error('❌ Office kind missing:', { officeDetails, baseDetails });
    Alert.alert(
      t('office_type_missing'),
      t('office_type_missing_message'),
      [{ text: t('button_go_back'), onPress: () => router.back() }]
    );
    return;
  }

  if (!officeDetails) {
    Alert.alert(
      t('missing_data_title'),
      t('missing_data_message'),
      [{ text: t('button_go_back'), onPress: () => router.back() }]
    );
    return;
  }

  // ✅ CREATE RAW PRICING DETAILS FIRST (with Telugu/Hindi values)
  const rawPricingDetails = {
    expectedPrice: Number(expectedPrice),
    priceDetails: {
      allInclusive,
      negotiable: priceNegotiable,
      taxExcluded,
    },
    preLeased,
    leaseDuration: leaseDuration || undefined,
    monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
    nocCertified,
    occupancyCertified,
    previouslyUsedFor: prevUsedFor,
    description: describeProperty,
    amenities,
    locationAdvantages: locAdvantages,
  };

  // ✅ CONVERT PRICING TO ENGLISH
  const convertedPricing = convertToEnglish(rawPricingDetails);

  // ✅ MERGE WITH EXISTING OFFICE DETAILS (already in English from Office.jsx)
  const commercialDetails = {
    subType: "Office",
    officeDetails: {
      ...officeDetails,
      ...convertedPricing,
    },
    propertyTitle: officeDetails.propertyTitle || params.propertyTitle,
    area: params.area,
    expectedPrice: Number(expectedPrice),
  };

  console.log('🔄 Passing to OfficeVaastu:', {
    hasCommercialDetails: !!commercialDetails,
    hasOfficeDetails: !!commercialDetails.officeDetails,
    propertyTitle: commercialDetails.propertyTitle,
  });

  router.push({
    pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OfficeVaastu",
    params: {
      commercialDetails: JSON.stringify(commercialDetails),
      images: JSON.stringify(images),
      area: params.area,
      propertyTitle: commercialDetails.officeDetails?.propertyTitle || params.propertyTitle,
    },
  });
};

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center mt-7 mb-4">
        <TouchableOpacity
          onPress={() => {
            const currentData = {
              ...officeDetails,
              expectedPrice: Number(expectedPrice) || undefined,
              priceDetails: {
                allInclusive,
                negotiable: priceNegotiable,
                taxExcluded,
              },
              preLeased,
              leaseDuration: leaseDuration || undefined,
              monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
              nocCertified,
              occupancyCertified,
              previouslyUsedFor: prevUsedFor,
              description: describeProperty,
              amenities,
              locationAdvantages: locAdvantages,
            };

            router.push({
              pathname: "/home/screens/UploadScreens/CommercialUpload/Components/Office",
              params: {
                officeDetails: JSON.stringify(currentData),
                images: JSON.stringify(images),
                area: params.area,
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
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="bg-white rounded-lg p-4 mb-4"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="mb-2 text-[15px] font-bold text-[#00000099]">
            {t('office_price_details')} <Text className="text-red-500">*</Text>
          </Text>

          <TextInput
            placeholder={t('office_expected_price_placeholder')}
            value={expectedPrice}
            onChangeText={setExpectedPrice}
            className="rounded-md p-3 mb-3"
            style={{
              borderWidth: 2,
              borderColor:
                focusedField === "expectedPrice" ? "#22C55E" : "#0000001A",
              height: 52,
              backgroundColor: "#D9D9D91C",
            }}
            keyboardType="numeric"
            onFocus={() => setFocusedField("expectedPrice")}
            onBlur={() => setFocusedField(null)}
          />

          <Checkbox
            label={t('office_all_inclusive')}
            selected={allInclusive}
            onPress={() => setAllInclusive(!allInclusive)}
          />
          <Checkbox
            label={t('office_price_negotiable')}
            selected={priceNegotiable}
            onPress={() => setPriceNegotiable(!priceNegotiable)}
          />
          <Checkbox
            label={t('office_tax_excluded')}
            selected={taxExcluded}
            onPress={() => setTaxExcluded(!taxExcluded)}
          />

          <TouchableOpacity onPress={() => setIsMorePricingModalVisible(true)}>
            <Text className="text-[#22C55E] text-sm mt-2">
              + {t('office_add_more_pricing')}
            </Text>
          </TouchableOpacity>

          <Text className="text-[14px] font-bold text-[#00000099] mt-4 mb-2">
            {t('office_pre_leased')}
          </Text>
          <View className="flex-row mb-4">
            <PillButton
              label={t('office_yes')}
              selected={preLeased === "Yes"}
              onPress={() => setPreLeased("Yes")}
            />
            <PillButton
              label={t('office_no')}
              selected={preLeased === "No"}
              onPress={() => setPreLeased("No")}
            />
          </View>
          {preLeased === "Yes" && (
            <View className="mb-4">
              <Text className="text-[13px] font-semibold text-[#00000099] mb-1">
                {t('office_lease_duration')}
              </Text>
              <TextInput
                placeholder={t('office_lease_duration_placeholder')}
                value={leaseDuration}
                onChangeText={setLeaseDuration}
                className="rounded-md p-3 mb-3"
                style={{
                  borderWidth: 2,
                  borderColor:
                    focusedField === "leaseDuration" ? "#22C55E" : "#0000001A",
                  backgroundColor: "#D9D9D91C",
                  height: 50,
                }}
                onFocus={() => setFocusedField("leaseDuration")}
                onBlur={() => setFocusedField(null)}
              />

              <Text className="text-[13px] font-semibold text-[#00000099] mb-1">
                {t('office_monthly_rent')}
              </Text>
              <TextInput
                placeholder={t('office_monthly_rent_placeholder')}
                value={monthlyRent}
                onChangeText={setMonthlyRent}
                keyboardType="numeric"
                className="rounded-md p-3"
                style={{
                  borderWidth: 2,
                  borderColor:
                    focusedField === "monthlyRent" ? "#22C55E" : "#0000001A",
                  backgroundColor: "#D9D9D91C",
                  height: 50,
                }}
                onFocus={() => setFocusedField("monthlyRent")}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          )}

          <Text className="text-[14px] font-bold text-[#00000099] mb-2">
            {t('office_fire_noc')}
          </Text>
          <View className="flex-row mb-4">
            <PillButton
              label={t('office_yes')}
              selected={nocCertified === "Yes"}
              onPress={() => setNocCertified("Yes")}
            />
            <PillButton
              label={t('office_no')}
              selected={nocCertified === "No"}
              onPress={() => setNocCertified("No")}
            />
          </View>

          <Text className="text-[14px] font-bold text-[#00000099] mb-2">
            {t('office_occupancy_certified')}
          </Text>
          <View className="flex-row mb-4">
            <PillButton
              label={t('office_yes')}
              selected={occupancyCertified === "Yes"}
              onPress={() => setOccupancyCertified("Yes")}
            />
            <PillButton
              label={t('office_no')}
              selected={occupancyCertified === "No"}
              onPress={() => setOccupancyCertified("No")}
            />
          </View>

          <Text className="text-[14px] font-bold text-[#00000099] mb-2">
            {t('office_prev_used')}
          </Text>

          <TouchableOpacity
            onPress={() =>
              setVisible(visible === "prevUsedFor" ? null : "prevUsedFor")
            }
            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
          >
            <Text>{prevUsedFor}</Text>
            <Ionicons name="chevron-down" size={22} color="#888" />
          </TouchableOpacity>

          {visible === "prevUsedFor" && (
            <View
              className="bg-white rounded-lg shadow-lg -mt-3 mb-4"
              style={{ borderWidth: 1, borderColor: "#0000001A" }}
            >
              {prevUsedForOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setPrevUsedFor(item);
                    setVisible(null);
                  }}
                  className={`p-4 border-b ${
                    prevUsedFor === item ? "bg-green-500" : "bg-white"
                  }`}
                >
                  <Text
                    className={
                      prevUsedFor === item ? "text-white" : "text-gray-800"
                    }
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text className="mt-4 mb-2 font-bold text-[15px] text-[#00000099]">
            {t('office_describe_property')} <Text className="text-red-500">*</Text>
          </Text>

          <TextInput
            placeholder={t('office_describe_placeholder')}
            value={describeProperty}
            onChangeText={setDescribeProperty}
            multiline
            textAlignVertical="top"
            className="rounded-md p-3"
            style={{
              borderWidth: 2,
              borderColor:
                focusedField === "describeProperty" ? "#22C55E" : "#0000001A",
              height: 108,
            }}
            onFocus={() => setFocusedField("describeProperty")}
            onBlur={() => setFocusedField(null)}
          />

          <View
            className="bg-white rounded-lg p-4 mt-4"
            style={{ borderWidth: 1, borderColor: "#0000001A" }}
          >
            <Text className="text-[15px] font-bold text-[#00000099] mb-2">
              {t('office_amenities')}
            </Text>
            <View className="flex-row flex-wrap mb-4">
              {AMENITY_OPTIONS.map((a) => (
                <PillButton
                  key={a}
                  label={a}
                  selected={amenities.includes(a)}
                  onPress={() => toggleArrayItem(setAmenities, amenities, a)}
                />
              ))}
            </View>

            <Text className="text-[15px] font-bold text-[#00000099] mb-3">
              {t('office_location_advantages')}
            </Text>
            <View className="flex-row flex-wrap">
              {LOCATION_ADVANTAGES.map((a) => (
                <PillButton
                  key={a}
                  label={a}
                  selected={locAdvantages.includes(a)}
                  onPress={() =>
                    toggleArrayItem(setLocAdvantages, locAdvantages, a)
                  }
                />
              ))}
            </View>
          </View>
          <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-3">
            <TouchableOpacity 
              className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
              onPress={() => {
                const currentData = {
                  ...officeDetails,
                  expectedPrice: Number(expectedPrice) || undefined,
                  priceDetails: { allInclusive, negotiable: priceNegotiable, taxExcluded },
                  preLeased,
                  leaseDuration,
                  monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
                  nocCertified,
                  occupancyCertified,
                  previouslyUsedFor: prevUsedFor,
                  description: describeProperty,
                  amenities,
                  locationAdvantages: locAdvantages,
                };

                router.push({
                  pathname: "/home/screens/UploadScreens/CommercialUpload/Components/Office",
                  params: {
                    officeDetails: JSON.stringify(currentData),
                    images: JSON.stringify(images),
                    area: params.area,
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
      </ScrollView>
      <MorePricingDetailsModal
        visible={isMorePricingModalVisible}
        onClose={() => setIsMorePricingModalVisible(false)}
      />
    </View>
  );
};

export default OfficeNext;