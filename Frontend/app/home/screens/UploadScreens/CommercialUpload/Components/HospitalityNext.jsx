//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/HospitalityNext.jsx

import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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

const Checkbox = ({ selected, onPress, label }) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center mb-3">
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
        <Text className="text-gray-700">{label}</Text>
    </TouchableOpacity>
);

const HospitalityNext = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t } = useTranslation(); // ✅ ADD THIS

    const images = params.images ? JSON.parse(params.images) : [];

    /* ---------------- PRICE STATES ---------------- */
    const ownershipOptions = [
        t('hospitality_ownership_freehold'),
        t('hospitality_ownership_leasehold'),
        t('hospitality_ownership_company'),
        t('hospitality_ownership_other')
    ];
    const [ownership, setOwnership] = useState('');
    const [expectedPrice, setExpectedPrice] = useState("");
    const [allInclusive, setAllInclusive] = useState(false);
    const [priceNegotiable, setPriceNegotiable] = useState(false);
    const [taxExcluded, setTaxExcluded] = useState(false);
    const [IndustryApprovedBy, setIndustryApprovedBy] = useState("");
    const [approvedIndustryType, setApprovedIndustryType] = useState("");
    const authorityOptions = [t('hospitality_local_authority')];

    /* ---------------- YES / NO STATES ---------------- */
    const [preLeased, setPreLeased] = useState(null);

    /* ---------------- PREVIOUS USE ---------------- */
    const [visible, setVisible] = useState(null);

    /* ---------------- DESCRIPTION ---------------- */
    const [describeProperty, setDescribeProperty] = useState("");
    const [wheelchairFriendly, setWheelchairFriendly] = useState(false);
    const [amenities, setAmenities] = useState([]);
    const [locAdvantages, setLocAdvantages] = useState([]);
    const [flooringType, setFlooringType] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const [pricingModalVisible, setPricingModalVisible] = useState(false);
    const [leaseDuration, setLeaseDuration] = useState("");
    const [monthlyRent, setMonthlyRent] = useState("");

    // ✅ Load draft from AsyncStorage
    useEffect(() => {
        const loadDraft = async () => {
            try {
                const draft = await AsyncStorage.getItem('draft_hospitality_pricing');
                if (draft) {
                    const savedData = JSON.parse(draft);
                    console.log('📦 Loading Hospitality pricing draft from AsyncStorage');

                    setOwnership(savedData.ownership || '');
                    setIndustryApprovedBy(savedData.IndustryApprovedBy || '');
                    setApprovedIndustryType(savedData.approvedIndustryType || '');
                    setExpectedPrice(savedData.expectedPrice?.toString() || '');
                    setAllInclusive(savedData.allInclusive || false);
                    setPriceNegotiable(savedData.priceNegotiable || false);
                    setTaxExcluded(savedData.taxExcluded || false);
                    setPreLeased(savedData.preLeased || null);
                    setLeaseDuration(savedData.leaseDuration || '');
                    setMonthlyRent(savedData.monthlyRent?.toString() || '');
                    setDescribeProperty(savedData.describeProperty || '');
                    setWheelchairFriendly(savedData.wheelchairFriendly || false);
                    setAmenities(savedData.amenities || []);
                    setLocAdvantages(savedData.locAdvantages || []);
                    setFlooringType(savedData.flooringType || '');

                    console.log('✅ Hospitality pricing draft loaded');
                    return;
                }
            } catch (e) {
                console.log('⚠️ Failed to load pricing draft:', e);
            }

            // ✅ FALLBACK: Load from params
            if (params.commercialDetails) {
                try {
                    const details = JSON.parse(params.commercialDetails);
                    if (details.hospitalityDetails) {
                        const hospitality = details.hospitalityDetails;

                        setOwnership(hospitality.ownership || '');
                        setExpectedPrice(hospitality.expectedPrice?.toString() || '');
                        setAllInclusive(hospitality.priceDetails?.allInclusive || false);
                        setPriceNegotiable(hospitality.priceDetails?.negotiable || false);
                        setTaxExcluded(hospitality.priceDetails?.taxExcluded || false);
                        setPreLeased(hospitality.preLeased || null);
                        setLeaseDuration(hospitality.leaseDuration || '');
                        setMonthlyRent(hospitality.monthlyRent?.toString() || '');
                        setDescribeProperty(hospitality.description || '');
                        setAmenities(hospitality.amenities || []);
                        setLocAdvantages(hospitality.locationAdvantages || []);

                        console.log('✅ Hospitality pricing restored from params');
                    }
                } catch (e) {
                    console.log('❌ Could not restore from params:', e);
                }
            }
        };

        loadDraft();
    }, [params.commercialDetails]);

    // ✅ Auto-save pricing draft
    useEffect(() => {
        const saveDraft = async () => {
            const pricingDraft = {
                ownership,
                IndustryApprovedBy,
                approvedIndustryType,
                expectedPrice,
                allInclusive,
                priceNegotiable,
                taxExcluded,
                preLeased,
                leaseDuration,
                monthlyRent,
                describeProperty,
                wheelchairFriendly,
                amenities,
                locAdvantages,
                flooringType,
                timestamp: new Date().toISOString(),
            };

            try {
                await AsyncStorage.setItem('draft_hospitality_pricing', JSON.stringify(pricingDraft));
                console.log('💾 Hospitality pricing draft auto-saved');
            } catch (e) {
                console.log('⚠️ Failed to save pricing draft:', e);
            }
        };

        const timer = setTimeout(saveDraft, 1000);
        return () => clearTimeout(timer);
    }, [ownership, IndustryApprovedBy, approvedIndustryType, expectedPrice,
        allInclusive, priceNegotiable, taxExcluded, preLeased, leaseDuration,
        monthlyRent, describeProperty, wheelchairFriendly, amenities,
        locAdvantages, flooringType]);

    /* ---------------- AMENITIES ---------------- */
   const amenityOptions = [
    t('hospitality_amenity_water_storage'),
    t('hospitality_amenity_air_conditioned'),
    t('hospitality_amenity_vaastu_complex'),
    t('hospitality_amenity_fire_alarm'),
    t('hospitality_amenity_visitor_parking'),
];

    /* ---------------- LOCATION ADVANTAGES ---------------- */
   const locationAdvantages = [
    t('hospitality_loc_metro_station'),
    t('hospitality_loc_school'),
    t('hospitality_loc_hospital'),
    t('hospitality_loc_market'),
    t('hospitality_loc_railway_station'),
    t('hospitality_loc_airport'),
    t('hospitality_loc_mall'),
    t('hospitality_loc_highway'),
];

    /* ---------------- HELPERS ---------------- */
    const toggleArrayItem = (setter, array, value) => {
        if (array.includes(value)) {
            setter(array.filter((item) => item !== value));
        } else {
            setter([...array, value]);
        }
    };

    const handleNext = () => {
        if (!expectedPrice.trim()) {
            Toast.show({
                type: 'error',
                text1: t('hospitality_price_required'),
                text2: 'Please enter the expected price.',
            });
            return;
        }
        if (!describeProperty.trim()) {
            Toast.show({
                type: 'error',
                text1: t('hospitality_description_required'),
                text2: 'Please describe your property.',
            });
            return;
        }

        // ✅ BUILD COMPLETE DETAILS
        const updatedCommercialDetails = JSON.parse(params.commercialDetails);

        updatedCommercialDetails.hospitalityDetails = {
            ...updatedCommercialDetails.hospitalityDetails,
            ownership,
            IndustryApprovedBy,
            approvedIndustryType,
            expectedPrice: Number(expectedPrice),
            priceDetails: {
                allInclusive,
                negotiable: priceNegotiable,
                taxExcluded,
            },
            preLeased,
            leaseDuration: leaseDuration || undefined,
            monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
            description: describeProperty,
            amenities,
            locationAdvantages: locAdvantages,
            wheelchairFriendly,
            flooringType,
        };

        Toast.show({
            type: 'success',
            text1: t('hospitality_details_saved'),
            text2: t('hospitality_moving_next'),
        });

        router.push({
            pathname: "/home/screens/UploadScreens/CommercialUpload/Components/HospitalityVaastu",
            params: {
                commercialDetails: JSON.stringify(updatedCommercialDetails),
                images: JSON.stringify(images),
                area: params.area || updatedCommercialDetails.hospitalityDetails.neighborhoodArea,
                propertyTitle: updatedCommercialDetails.hospitalityDetails?.propertyTitle || params.propertyTitle,
            },
        });
    };

    const flooringOptions = [
        t('hospitality_flooring_marble'),
        t('hospitality_flooring_concrete'),
        t('hospitality_flooring_ceramic'),
        t('hospitality_flooring_mosaic'),
        t('hospitality_flooring_cement'),
        t('hospitality_flooring_stone'),
        t('hospitality_flooring_vinyl'),
        t('hospitality_flooring_spartex'),
        t('hospitality_flooring_ips'),
        t('hospitality_flooring_vitrified'),
        t('hospitality_flooring_wooden'),
        t('hospitality_flooring_granite'),
        t('hospitality_flooring_others'),
    ];

    return (
        <View className="flex-1 bg-white">
            <View className="flex-row items-center mt-4 mb-3 ml-4">
                <TouchableOpacity
                    onPress={() => {
                        const currentData = JSON.parse(params.commercialDetails);
                        currentData.hospitalityDetails = {
                            ...currentData.hospitalityDetails,
                            ownership,
                            IndustryApprovedBy,
                            approvedIndustryType,
                            expectedPrice: Number(expectedPrice) || undefined,
                            priceDetails: { allInclusive, negotiable: priceNegotiable, taxExcluded },
                            preLeased,
                            leaseDuration,
                            monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
                            description: describeProperty,
                            amenities,
                            locationAdvantages: locAdvantages,
                            wheelchairFriendly,
                            flooringType,
                        };

                        router.push({
                            pathname: "/home/screens/UploadScreens/CommercialUpload/Components/Hospitality",
                            params: {
                                images: JSON.stringify(images),
                                commercialDetails: JSON.stringify(currentData),
                                area: params.area || currentData.hospitalityDetails.neighborhoodArea,
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
                {/* ---------- PRICE DETAILS ---------- */}
                <View
                    className="bg-white rounded-lg p-4 mb-4"
                    style={{ borderWidth: 1, borderColor: "#0000001A" }}
                >
                    <Text className="text-[15px] text-[#00000099] font-bold mb-2">{t('hospitality_ownership')}</Text>
                    <View className="flex-row flex-wrap mb-4">
                        {ownershipOptions.map((o) => (
                            <PillButton key={o} label={o} selected={ownership === o} onPress={() => setOwnership(o)} />
                        ))}
                    </View>

                    <Text className="mb-2 text-[15px] font-bold text-[#00000099]">
                        {t('hospitality_approved_by')}
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
                        {t('hospitality_industry_type')}
                    </Text>
                    <TextInput
                        placeholder={t('hospitality_select_industry')}
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
                        {t('hospitality_expected_price')} <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        placeholder={t('hospitality_enter_price')}
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
                        label={t('hospitality_dg_ups_included')}
                        selected={allInclusive}
                        onPress={() => setAllInclusive(!allInclusive)}
                    />
                    <Checkbox
                        label={t('hospitality_price_negotiable')}
                        selected={priceNegotiable}
                        onPress={() => setPriceNegotiable(!priceNegotiable)}
                    />
                    <Checkbox
                        label={t('hospitality_tax_excluded')}
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
                        {t('hospitality_pre_leased')}
                    </Text>
                    <View className="flex-row mb-4">
                        <PillButton
                            label={t('hospitality_yes')}
                            selected={preLeased === "Yes"}
                            onPress={() => setPreLeased("Yes")}
                        />
                        <PillButton
                            label={t('hospitality_no')}
                            selected={preLeased === "No"}
                            onPress={() => setPreLeased("No")}
                        />
                    </View>

                    {preLeased === "Yes" && (
                        <View className="mb-4">
                            <TextInput
                                placeholder={t('hospitality_current_rent')}
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
                                placeholder={t('hospitality_lease_tenure')}
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
                        {t('hospitality_description')} <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        placeholder={t('hospitality_describe_placeholder')}
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
                            {t('hospitality_amenities')}
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
                            {t('hospitality_other_features')}
                        </Text>
                        <Checkbox
                            label={t('hospitality_wheelchair_friendly')}
                            selected={wheelchairFriendly}
                            onPress={() => setWheelchairFriendly(!wheelchairFriendly)}
                        />

                        <Text className="text-[15px] font-bold text-[#00000099] mb-2 mt-3">
                            {t('hospitality_flooring_type')}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setVisible(visible === 'flooring' ? null : 'flooring')}
                            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
                        >
                            <Text className="text-gray-800 text-left">
                                {flooringType || t('hospitality_select_flooring')}
                            </Text>
                            <Ionicons name="chevron-down" size={24} color="#888" />
                        </TouchableOpacity>

                        {visible === 'flooring' && (
                            <View
                                className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
                                style={{ borderWidth: 1, borderColor: "#0000001A" }}
                            >
                                {flooringOptions.map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        onPress={() => {
                                            setFlooringType(item);
                                            setVisible(null);
                                        }}
                                        className={`p-4 border-b border-gray-200 ${flooringType === item ? "bg-green-500" : "bg-white"}`}
                                    >
                                        <Text className={`${flooringType === item ? "text-white" : "text-gray-800"}`}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <Text className="text-[15px] font-bold text-[#00000099] mb-3">
                            {t('hospitality_location_advantages')}
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

            <View className="bg-white border-t border-gray-200">
                <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-12">
                    <TouchableOpacity
                        className="px-10 py-3 rounded-lg bg-gray-200 mx-3"
                        onPress={() => router.back()}
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

export default HospitalityNext;