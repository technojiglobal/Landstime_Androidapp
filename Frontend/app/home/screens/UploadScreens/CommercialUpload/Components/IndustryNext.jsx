//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/IndustryNext.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { convertToEnglish }  from '../../../../../../utils/reverseTranslation'; // ✅ ADD THIS
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from 'react-i18next'; // ✅ ADD THIS
import MorePricingDetailsModal from "../../MorePricingDetailsModal";

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

const Checkbox = ({ label, selected, onPress }) => (  // ✅ CHANGE 'checked' to 'selected'
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center mb-2"
  >
    <View
      className={`w-4 h-4 mr-2 border items-center justify-center ${
        selected ? "bg-green-500 border-green-500" : "border-gray-300"  // ✅ CHANGE 'checked' to 'selected'
      }`}
    >
      {selected && <Text className="text-white text-[10px]">✓</Text>}  // ✅ CHANGE 'checked' to 'selected'
    </View>
    <Text className="text-sm text-gray-600">{label}</Text>
  </TouchableOpacity>
);

const IndustryNext = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t } = useTranslation(); // ✅ ADD THIS

    const safeParse = (raw) => {
      if (!raw) return null;
      try {
        return typeof raw === "string" ? JSON.parse(raw) : raw;
      } catch {
        return null;
      }
    };

    // ✅ Use useMemo to prevent infinite re-parsing
    const commercialDetailsFromPrev = useMemo(() => {
      return safeParse(params.commercialDetails);
    }, [params.commercialDetails]);

    const images = params.images ? JSON.parse(params.images) : [];

    /* ---------------- PRICE STATES ---------------- */
    const [ownership, setOwnership] = useState('');
    const [expectedPrice, setExpectedPrice] = useState("");
    const [allInclusive, setAllInclusive] = useState(false);
    const [priceNegotiable, setPriceNegotiable] = useState(false);
    const [taxExcluded, setTaxExcluded] = useState(false);
    const [IndustryApprovedBy, setIndustryApprovedBy] = useState("");
    const [approvedIndustryType, setApprovedIndustryType] = useState("");
    
    /* ---------------- YES / NO STATES ---------------- */
    const [preLeased, setPreLeased] = useState(null);
    const [nocCertified, setNocCertified] = useState(null);
    const [occupancyCertified, setOccupancyCertified] = useState(null);

    /* ---------------- DESCRIPTION ---------------- */
    const [describeProperty, setDescribeProperty] = useState("");
    const [wheelchairFriendly, setWheelchairFriendly] = useState(false);
    const [amenities, setAmenities] = useState([]);
    const [locAdvantages, setLocAdvantages] = useState([]);

    const [focusedField, setFocusedField] = useState(null);
    const [pricingModalVisible, setPricingModalVisible] = useState(false);
    const [leaseDuration, setLeaseDuration] = useState("");
    const [monthlyRent, setMonthlyRent] = useState("");

    // ✅ Define options with translations
    const ownershipOptions = [
        t('industry_ownership_freehold'),
        t('industry_ownership_leasehold'),
        t('industry_ownership_company'),
        t('industry_ownership_other')
    ];

    const authorityOptions = [t('industry_approved_authority')];

    const amenityOptions = [
        "+Water Storage",
        "+currently Air Conditioned",
        "+Vaastu Complex",
        "+Security fire Alarm",
        "+Visitor Parking",
    ];

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

    /* ---------------- HELPERS ---------------- */
    const toggleArrayItem = (setter, array, value) => {
        if (array.includes(value)) {
            setter(array.filter((item) => item !== value));
        } else {
            setter([...array, value]);
        }
    };

    // ✅ Load draft from AsyncStorage
    useEffect(() => {
      const loadDraft = async () => {
        try {
          console.log("📦 Loading Industry pricing draft from AsyncStorage");
          const draft = await AsyncStorage.getItem('draft_industry_pricing');
          if (draft) {
            const parsed = JSON.parse(draft);
            console.log('✅ Industry pricing draft loaded:', parsed);

            setOwnership(parsed.ownership || '');
            setExpectedPrice(parsed.expectedPrice?.toString() || '');
            setAllInclusive(parsed.allInclusive || false);
            setPriceNegotiable(parsed.priceNegotiable || false);
            setTaxExcluded(parsed.taxExcluded || false);
            setIndustryApprovedBy(parsed.IndustryApprovedBy || '');
            setApprovedIndustryType(parsed.approvedIndustryType || '');
            setPreLeased(parsed.preLeased || null);
            setNocCertified(parsed.nocCertified || null);
            setOccupancyCertified(parsed.occupancyCertified || null);
            setLeaseDuration(parsed.leaseDuration || '');
            setMonthlyRent(parsed.monthlyRent?.toString() || '');
            setDescribeProperty(parsed.describeProperty || '');
            setWheelchairFriendly(parsed.wheelchairFriendly || false);
            setAmenities(parsed.amenities || []);
            setLocAdvantages(parsed.locAdvantages || []);

            console.log('✅ Industry pricing draft loaded successfully');
            return;
          }
        } catch (e) {
          console.log('⚠️ Failed to load Industry pricing draft:', e);
        }

        // ✅ FALLBACK: Load from params
        if (commercialDetailsFromPrev?.industryDetails?.pricing) {
          const pricing = commercialDetailsFromPrev.industryDetails.pricing;
          console.log('🔄 Restoring from params.industryDetails.pricing');

          setOwnership(pricing.ownership || '');
          setExpectedPrice(pricing.expectedPrice?.toString() || '');
          setAllInclusive(pricing.priceDetails?.allInclusive || false);
          setPriceNegotiable(pricing.priceDetails?.negotiable || false);
          setTaxExcluded(pricing.priceDetails?.taxExcluded || false);
          setIndustryApprovedBy(pricing.approvedBy || '');
          setApprovedIndustryType(pricing.approvedIndustryType || '');
          setPreLeased(pricing.preLeased || null);
          setLeaseDuration(pricing.leaseDuration || '');
          setMonthlyRent(pricing.monthlyRent?.toString() || '');
          setDescribeProperty(pricing.description || '');
          setWheelchairFriendly(pricing.wheelchairFriendly || false);
          setAmenities(pricing.amenities || []);
          setLocAdvantages(pricing.locationAdvantages || []);
        }
      };

      loadDraft();
    }, []); // ✅ CHANGED: Remove commercialDetailsFromPrev from dependencies

    // ✅ Auto-save pricing draft
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
          nocCertified,
          occupancyCertified,
          leaseDuration,
          monthlyRent,
          describeProperty,
          wheelchairFriendly,
          amenities,
          locAdvantages,
          timestamp: new Date().toISOString(),
        };

        try {
          await AsyncStorage.setItem('draft_industry_pricing', JSON.stringify(pricingDraft));
          console.log('💾 Industry pricing draft auto-saved');
        } catch (e) {
          console.log('⚠️ Failed to save Industry pricing draft:', e);
        }
      };

      const timer = setTimeout(saveDraft, 1000);
      return () => clearTimeout(timer);
    }, [ownership, expectedPrice, allInclusive, priceNegotiable, taxExcluded, 
        IndustryApprovedBy, approvedIndustryType, preLeased, nocCertified, occupancyCertified, 
        leaseDuration, monthlyRent, describeProperty, wheelchairFriendly, amenities, locAdvantages]);

    const handleNext = () => {
      if (!expectedPrice.trim()) {
        Toast.show({
          type: "error",
          text1: t('industry_price_required'),
          text2: t('industry_enter_price'),
        });
        return;
      }

      if (!describeProperty.trim()) {
        Toast.show({
          type: "error",
          text1: t('industry_description_required'),
          text2: "Please describe your property",
        });
        return;
      }

      if (!commercialDetailsFromPrev) {
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: "Please go back and try again",
        });
        return;
      }

      // ✅ CREATE RAW DETAILS FIRST
  const rawPricingDetails = {
    ownership,
    expectedPrice: Number(expectedPrice),
    priceDetails: {
      allInclusive,
      negotiable: priceNegotiable,
      taxExcluded,
    },
    approvedBy: IndustryApprovedBy,
    approvedIndustryType,
    preLeased,
    leaseDuration: preLeased === "Yes" ? leaseDuration : null,
    monthlyRent: preLeased === "Yes" ? Number(monthlyRent) : null,
    description: describeProperty,
    amenities,
    locationAdvantages: locAdvantages,
    wheelchairFriendly,
  };


      const industryPricingDetails = {
        ownership,
        expectedPrice: Number(expectedPrice),
        priceDetails: {
          allInclusive,
          negotiable: priceNegotiable,
          taxExcluded,
        },
        approvedBy: IndustryApprovedBy,
        approvedIndustryType,
        preLeased,
        leaseDuration: preLeased === "Yes" ? leaseDuration : null,
        monthlyRent: preLeased === "Yes" ? Number(monthlyRent) : null,
        description: describeProperty,
        amenities,
        locationAdvantages: locAdvantages,
        wheelchairFriendly,
      };

      const updatedCommercialDetails = {
        ...commercialDetailsFromPrev,
        industryDetails: {
          ...(commercialDetailsFromPrev.industryDetails || {}),
          pricing: industryPricingDetails,
        },
      };

      router.push({
        pathname: "/home/screens/UploadScreens/CommercialUpload/Components/IndustryVaastu",
        params: {
          commercialDetails: JSON.stringify(updatedCommercialDetails),
          images: JSON.stringify(images),
          area: params.area,
        },
      });
    };

    const handleBack = () => {
      const currentData = {
        ownership,
        expectedPrice: Number(expectedPrice) || undefined,
        priceDetails: {
          allInclusive,
          negotiable: priceNegotiable,
          taxExcluded,
        },
        approvedBy: IndustryApprovedBy,
        approvedIndustryType,
        preLeased,
        leaseDuration: leaseDuration || undefined,
        monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
        amenities,
        locationAdvantages: locAdvantages,
        wheelchairFriendly,
      };

      router.push({
        pathname: "/home/screens/UploadScreens/CommercialUpload/Components/Industry",
        params: {
          commercialDetails: JSON.stringify(commercialDetailsFromPrev),
          industryDetails: JSON.stringify(currentData),
          images: JSON.stringify(images),
          area: params.area,
        },
      });
    };

    return (
        <View className="flex-1 bg-white ">
            <View className="flex-row items-center mt-12 mb-2 ml-4">
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
                {/* ---------- PRICE DETAILS ---------- */}
                <View
                    className="bg-white rounded-lg p-4 mb-4"
                    style={{ borderWidth: 1, borderColor: "#0000001A" }}
                >
                    <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                        {t('industry_ownership')}
                    </Text>
                    <View className="flex-row flex-wrap mb-4">
                        {ownershipOptions.map((o) => (
                            <PillButton key={o} label={o} selected={ownership === o} onPress={() => setOwnership(o)} />
                        ))}
                    </View>

                    <Text className="mb-2 text-[15px] font-bold text-[#00000099]">
                        {t('industry_approved_by')}
                    </Text>
                    <View className="flex-row flex-wrap mb-4">
                        {authorityOptions.map((auth) => (
                            <PillButton
                                key={auth}
                                label={auth}
                                selected={IndustryApprovedBy === auth}
                                onPress={() => setIndustryApprovedBy(auth)}
                            />
                        ))}
                    </View>

                    <Text className="mb-2 text-[15px] font-bold text-[#00000099]">
                        {t('industry_approved_industry_type')}
                    </Text>
                    <TextInput
                        placeholder={t('industry_select_industry')}
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
                        {t('industry_expected_price')} <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        placeholder={t('industry_enter_price')}
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
                        label={t('industry_dg_ups_included')}
                        selected={allInclusive}
                        onPress={() => setAllInclusive(!allInclusive)}
                    />
                    <Checkbox
                        label={t('industry_price_negotiable')}
                        selected={priceNegotiable}
                        onPress={() => setPriceNegotiable(!priceNegotiable)}
                    />
                    <Checkbox
                        label={t('industry_tax_excluded')}
                        selected={taxExcluded}
                        onPress={() => setTaxExcluded(!taxExcluded)}
                    />

                    <TouchableOpacity onPress={() => setPricingModalVisible(true)}>
                        <Text className="text-[#22C55E] text-sm mt-2">
                            + Add more pricing details
                        </Text>
                    </TouchableOpacity>

                    {/* ---------- PRE LEASED ---------- */}
                    <Text className="text-[14px] font-bold text-[#00000099] mt-4 mb-2">
                        {t('industry_pre_leased')}
                    </Text>
                    <View className="flex-row mb-4">
                        <PillButton
                            label={t('industry_yes')}
                            selected={preLeased === "Yes"}
                            onPress={() => setPreLeased("Yes")}
                        />
                        <PillButton
                            label={t('industry_no')}
                            selected={preLeased === "No"}
                            onPress={() => setPreLeased("No")}
                        />
                    </View>

                    {preLeased === "Yes" && (
                        <View className="mb-4">
                            <TextInput
                                placeholder={t('industry_current_rent')}
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
                                placeholder={t('industry_lease_tenure')}
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

                    {/* ---------- DESCRIPTION ---------- */}
                    <Text className="mt-4 mb-2 font-bold text-[15px] text-[#00000099]">
                        {t('industry_description')} <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        placeholder={t('industry_describe_placeholder')}
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

                    {/* ---------- AMENITIES & LOCATION ---------- */}
                    <View
                        className="bg-white rounded-lg p-4 mt-4"
                        style={{ borderWidth: 1, borderColor: "#0000001A" }}
                    >
                        <Text className="text-[15px] font-bold text-[#00000099] mb-2">
                            {t('industry_amenities')}
                        </Text>
                        <View className="flex-row flex-wrap mb-4">
                            {amenityOptions.map((a) => (
                                <PillButton
                                    key={a}
                                    label={a}
                                    selected={amenities.includes(a)}
                                    onPress={() =>
                                        toggleArrayItem(setAmenities, amenities, a)
                                    }
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
                            {t('industry_location_advantages')}
                        </Text>
                        <View className="flex-row flex-wrap">
                            {locationAdvantages.map((a) => (
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
                </View>

                {/* More Pricing Details Modal */}
                <MorePricingDetailsModal
                    visible={pricingModalVisible}
                    onClose={() => setPricingModalVisible(false)}
                />
            </ScrollView>

            <View className="bg-white border-t border-gray-200">
                <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-12">
                    <TouchableOpacity
                        className="px-10 py-3 rounded-lg bg-gray-200 mx-3"
                        onPress={handleBack}
                    >
                        <Text className="font-semibold">{t('button_cancel')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="px-8 py-3 rounded-lg bg-green-500"
                        onPress={handleNext}
                    >
                        <Text className="text-white font-semibold">{t('button_next')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default IndustryNext;