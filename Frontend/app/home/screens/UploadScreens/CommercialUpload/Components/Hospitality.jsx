//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/Hospitality.jsx

import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import Toast from 'react-native-toast-message';
import FurnishingsModal from "../../FurnishingsModal";
import { useTranslation } from 'react-i18next'; // ✅ ADD THIS

export const PillButton = ({ label, selected, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        className="px-3 py-1 h-[23px] rounded-full mr-2 mb-3 items-center justify-center"
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
        <Text
            className={`text-sm ${selected ? "text-green-700 font-semibold" : "text-[rgba(0,0,0,0.6)]"}`}
        >
            {label}
        </Text>
    </TouchableOpacity>
);

export default function Hospitality() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t } = useTranslation(); // ✅ ADD THIS

    const images = params.images ? JSON.parse(params.images) : [];

    /* ---------- VALIDATION ---------- */
    /* ---------- VALIDATION ---------- */
const handleNext = () => {
    if (!location.trim()) {
        Toast.show({ type: "error", text1: t('hospitality_location_required') });
        return;
    }
    if (!neighborhoodArea.trim()) {
        Toast.show({ type: "error", text1: t('hospitality_area_required') });
        return;
    }
    if (!plotArea.trim()) {
        Toast.show({ type: "error", text1: t('hospitality_plot_area_required') });
        return;
    }

    // ✅ CRITICAL FIX - Extract hospitalityType from params
    let hospitalityType = params.hospitalityType;
    
    if (params.commercialBaseDetails) {
        try {
            const baseDetails = JSON.parse(params.commercialBaseDetails);
            hospitalityType = baseDetails.hospitalityType || hospitalityType;
        } catch (e) {
            console.log('⚠️ Could not parse commercialBaseDetails:', e);
        }
    }

    console.log('🔄 Hospitality handleNext - hospitalityType:', hospitalityType); // ✅ Debug log

    const commercialDetails = {
        subType: "Hospitality",
        hospitalityDetails: {
            hospitalityType: hospitalityType, // ✅ CRITICAL - Add this line
            location,
            neighborhoodArea: neighborhoodArea.trim(),
            rooms,
            washroomType,
            balconies,
            otherRooms,
            furnishingType,
            furnishingDetails,
            area: { value: Number(plotArea), unit },
            areaUnit: unit,
            availability,
            ageOfProperty,
            possessionBy,
            expectedMonth,
        },
    };

    router.push({
        pathname: "/home/screens/UploadScreens/CommercialUpload/Components/HospitalityNext",
        params: {
            commercialDetails: JSON.stringify(commercialDetails),
            images: JSON.stringify(images),
            area: neighborhoodArea.trim(),
            hospitalityType: hospitalityType, // ✅ Pass it forward
        },
    });
};
    const [focusedField, setFocusedField] = useState(null);
    const [visible, setVisible] = useState(null);

    /* ---------- STATE ---------- */
    const [location, setLocation] = useState("");
    const [neighborhoodArea, setNeighborhoodArea] = useState("");
    const [plotArea, setPlotArea] = useState("");
    const [unit, setUnit] = useState("sqft");
    const [propertyTitle, setPropertyTitle] = useState(""); // ✅ ADD THIS LINE
    const [rooms, setRooms] = useState("");
    const [washroomType, setWashroomType] = useState(null);
    const [balconies, setBalconies] = useState(null);
    const [otherRooms, setOtherRooms] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [furnishingType, setFurnishingType] = useState("");
    const [furnishingDetails, setFurnishingDetails] = useState([]);
    const [modalSubtitle, setModalSubtitle] = useState("");
    const [availability, setAvailability] = useState(null);
    const [ageOfProperty, setAgeOfProperty] = useState(null);
    const [possessionBy, setPossessionBy] = useState("");
    const [expectedMonth, setExpectedMonth] = useState("");
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [hospitalityType, setHospitalityType] = useState("");
    // ✅ Load draft from AsyncStorage on mount
    useEffect(() => {
        const loadDraft = async () => {
            try {
                const draft = await AsyncStorage.getItem('draft_hospitality_details');
                if (draft) {
                    const savedData = JSON.parse(draft);
                    console.log('📦 Loading Hospitality draft from AsyncStorage');

                    setLocation(savedData.location || '');
                    setNeighborhoodArea(savedData.neighborhoodArea || savedData.area || params.area || '');
                    setPlotArea(savedData.plotArea?.toString() || '');
                    setPropertyTitle(savedData.propertyTitle || params.propertyTitle || ''); // ✅ ADD THIS LINE
                    setUnit(savedData.unit || 'sqft');
                    setRooms(savedData.rooms?.toString() || '');
                    setWashroomType(savedData.washroomType || null);
                    setBalconies(savedData.balconies || null);
                    setOtherRooms(savedData.otherRooms || []);
                    setFurnishingType(savedData.furnishingType || 'Unfurnished');
                    setFurnishingDetails(savedData.furnishingDetails || []);
                    setAvailability(savedData.availability || null);
                    setAgeOfProperty(savedData.ageOfProperty || null);
                    setPossessionBy(savedData.possessionBy || '');
                    setExpectedMonth(savedData.expectedMonth || '');
                    setHospitalityType(savedData.hospitalityType || params.hospitalityType || '');
                    console.log('✅ Hospitality draft loaded from AsyncStorage');
                    return;
                }
            } catch (e) {
                console.log('⚠️ Failed to load Hospitality draft:', e);
            }

            // ✅ FALLBACK: Load from params
            if (params.area) {
                setNeighborhoodArea(params.area);
                console.log('✅ Area set from params.area:', params.area);
            }
        };

        loadDraft();
    }, [params.area]);

    // ✅ Auto-save draft
    useEffect(() => {
        const saveDraft = async () => {
            const draftData = {
                location,
                neighborhoodArea,
                area: neighborhoodArea,
                plotArea,
                unit,
                rooms,
                propertyTitle, // ✅ ADD THIS LINE
                washroomType,
                balconies,
                otherRooms,
                furnishingType,
                furnishingDetails,
                availability,
                ageOfProperty,
                possessionBy,
                expectedMonth,
                timestamp: new Date().toISOString(),
            };

            try {
                await AsyncStorage.setItem('draft_hospitality_details', JSON.stringify(draftData));
                console.log('💾 Hospitality draft auto-saved');
            } catch (e) {
                console.log('⚠️ Failed to save Hospitality draft:', e);
            }
        };

        const timer = setTimeout(saveDraft, 1000);
        return () => clearTimeout(timer);
   }, [location, neighborhoodArea, plotArea, unit, rooms, washroomType, balconies,
    otherRooms, furnishingType, furnishingDetails, availability, ageOfProperty,
    possessionBy, expectedMonth, propertyTitle]); // ✅ ADD propertyTitle HERE

    const toggleOtherRoom = (room) => {
        setOtherRooms((prev) =>
            prev.includes(room)
                ? prev.filter((r) => r !== room)
                : [...prev, room]
        );
    };

    const possessionOptions = [
        t('hospitality_possession_immediate'),
        t('hospitality_possession_3months'),
        t('hospitality_possession_6months'),
        t('hospitality_possession_2025'),
        t('hospitality_possession_2026'),
        t('hospitality_possession_2027'),
        t('hospitality_possession_2028'),
        t('hospitality_possession_2029'),
        t('hospitality_possession_2030'),
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
            <FurnishingsModal
                visible={modalOpen}
                onClose={() => setModalOpen(false)}
                subtitle={modalSubtitle}
                onSubmit={(data) => {
                    const items = [
                        ...data.quantities.map(([item, qty]) => `${item} (${qty})`),
                        ...data.extras
                    ];
                    setFurnishingDetails(items);
                    setModalOpen(false);
                }}
            />
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                {/* HEADER */}
                <View className="flex-row items-center mt-7 mb-4">
               <TouchableOpacity
  onPress={() => {
    const currentData = {
      location,
      neighborhoodArea,
      plotArea,
      unit,
      rooms,
      washroomType,
      balconies,
      otherRooms,
      furnishingType,
      furnishingDetails,
      availability,
      ageOfProperty,
      possessionBy,
      expectedMonth,
      propertyTitle,
    };

    // ✅ FIXED - Extract hospitalityType from commercialBaseDetails
    let hospitalityType = params.hospitalityType;
    let savedPropertyTitle = propertyTitle || params.propertyTitle || '';
    
    if (params.commercialBaseDetails) {
      try {
        const baseDetails = JSON.parse(params.commercialBaseDetails);
        hospitalityType = baseDetails.hospitalityType || hospitalityType;
        savedPropertyTitle = baseDetails.propertyTitle || savedPropertyTitle;
      } catch (e) {
        console.log('⚠️ Could not parse commercialBaseDetails:', e);
      }
    }

    // ✅ IMPORTANT - Log to verify hospitalityType is being passed
   // console.log('🔙 Going back with hospitalityType:', hospitalityType);

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload",
      params: {
        hospitalityDetails: JSON.stringify(currentData),
        images: JSON.stringify(images),
        area: neighborhoodArea.trim(),
        hospitalityType: hospitalityType, // ✅ ADD THIS LINE
        commercialBaseDetails: JSON.stringify({
          subType: "Hospitality",
          hospitalityType: hospitalityType, // ✅ CRITICAL - Include hospitalityType
          propertyTitle: savedPropertyTitle,
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

                {/* LOCATION */}
                <View className="bg-white rounded-lg p-4 mb-4 border border-[#0000001A]">
                    <Text className="text-[15px] text-[#00000060] mb-3">
                        {t('hospitality_location')}<Text className="text-red-500">*</Text>
                    </Text>

                    <View className="flex-row items-center bg-[#D9D9D91C] rounded-md p-3 mb-3">
                        <Image
                            source={require("../../../../../../assets/location.png")}
                            style={{ width: 18, height: 18, marginRight: 8 }}
                        />
                        <TextInput
                            placeholder={t('hospitality_enter_location')}
                            value={location}
                            onChangeText={setLocation}
                            onFocus={() => setFocusedField("location")}
                            onBlur={() => setFocusedField(null)}
                            className="flex-1"
                            style={{
                                borderWidth: 1,
                                borderColor: focusedField === "location" ? "#22C55E" : "#0000001A",
                            }}
                        />
                    </View>

                    {/* NEIGHBORHOOD AREA FIELD */}
                    <Text className="text-[14px] font-medium text-[#00000099] mb-3">
                        {t('hospitality_area_neighborhood')}<Text className="text-red-500">*</Text>
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
                            placeholder={t('hospitality_enter_area')}
                            value={neighborhoodArea}
                            onChangeText={setNeighborhoodArea}
                            onFocus={() => setFocusedField("neighborhoodArea")}
                            onBlur={() => setFocusedField(null)}
                            className="flex-1"
                        />
                    </View>
                </View>

                {/* ADD ROOM DETAILS */}
                <View className="bg-white rounded-lg p-4 mb-6 border border-[#0000001A]">
                    <Text className="text-[16px] font-bold text-gray-600 mb-2">
                        {t('hospitality_add_room_details')}
                    </Text>

                    {/* ROOMS */}
                    <Text className="text-[14px] text-gray-500 mb-2">
                        {t('hospitality_no_of_rooms')}
                    </Text>
                    <TextInput
                        placeholder={t('hospitality_enter_total_rooms')}
                        value={rooms}
                        onChangeText={(t) => setRooms(t.replace(/[^0-9]/g, ""))}
                        keyboardType="numeric"
                        className="border border-[#0000001A] rounded-md px-3 py-3 mb-4 bg-[#D9D9D91C]"
                    />

                    {/* WASHROOMS */}
                    <Text className="text-[14px] text-gray-500 mb-2">
                        {t('hospitality_no_of_washrooms')}
                    </Text>
                    <View className="flex-row mb-4">
                        <PillButton label={t('hospitality_washroom_none')} selected={washroomType === "None"} onPress={() => setWashroomType("None")} />
                        <PillButton label={t('hospitality_washroom_shared')} selected={washroomType === "Shared"} onPress={() => setWashroomType("Shared")} />
                        {["1", "2", "3", "4+"].map((n) => (
                            <RoundOption key={n} label={n} selected={washroomType === n} onPress={() => setWashroomType(n)} />
                        ))}
                    </View>

                    {/* BALCONIES */}
                    <Text className="text-[14px] text-gray-500 mb-2">{t('hospitality_balconies')}</Text>
                    <View className="flex-row mb-4">
                        {["0", "1", "2", "3"].map((b) => (
                            <PillButton
                                key={b}
                                label={b}
                                selected={balconies === b}
                                onPress={() => setBalconies(b)}
                            />
                        ))}
                        <PillButton
                            label={t('hospitality_balcony_more')}
                            selected={balconies === "More than 3"}
                            onPress={() => setBalconies("More than 3")}
                        />
                    </View>

                    {/* OTHER ROOMS */}
                    <Text className="text-[14px] text-gray-500 mb-2">
                        {t('hospitality_other_rooms')}
                    </Text>
                    <View className="flex-row flex-wrap mb-4">
                        <PillButton label={t('hospitality_pooja_room')} selected={otherRooms.includes("Pooja Room")} onPress={() => toggleOtherRoom("Pooja Room")} />
                        <PillButton label={t('hospitality_study_room')} selected={otherRooms.includes("Study Room")} onPress={() => toggleOtherRoom("Study Room")} />
                        <PillButton label={t('hospitality_servant_room')} selected={otherRooms.includes("Servant Room")} onPress={() => toggleOtherRoom("Servant Room")} />
                        <PillButton label={t('hospitality_other')} selected={otherRooms.includes("Other")} onPress={() => toggleOtherRoom("Other")} />
                    </View>

                    {/* FURNISHING */}
                    <Text className="text-lg font-semibold text-gray-800">
                        {t('hospitality_furnishing')} <Text className="text-gray-400 text-sm">{t('hospitality_optional')}</Text>
                    </Text>

                    <View className="flex-row gap-2 mt-2 mb-4">
                        {["Unfurnished", "Semi-furnished", "Furnished"].map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => {
                                    setFurnishingType(type);
                                    if (type === "Furnished") {
                                        setModalSubtitle(t('furnishings_mandatory_note'));
                                        setModalOpen(true);
                                    } else if (type === "Semi-furnished") {
                                        setModalSubtitle("At least 1 selection is mandatory");
                                        setModalOpen(true);
                                    } else {
                                        setFurnishingDetails([]);
                                    }
                                }}
                                className={`rounded-full px-4 py-2 border ${furnishingType === type ? "border-green-500 bg-green-50" : "border-gray-300"}`}
                            >
                                <Text className={`${furnishingType === type ? "text-green-700" : "text-gray-600"}`}>
                                    {t(`hospitality_${type.toLowerCase().replace('-', '_')}`)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* AREA */}
                    <Text className="text-[14px] font-bold text-[#00000099] mb-2">
                        {t('hospitality_add_area_details')}<Text className="text-red-500">*</Text>
                    </Text>
                    <View className="flex-row items-center bg-[#D9D9D91C] border border-[#0000001A] rounded-md mb-4">
                        <TextInput
                            placeholder="0"
                            value={plotArea}
                            onChangeText={(t) => setPlotArea(t.replace(/[^0-9]/g, ""))}
                            keyboardType="numeric"
                            className="flex-1 px-3 h-[52px]"
                        />
                        <View className="w-[1px] h-[60%] bg-[#0000001A]" />
                        <Picker
                            selectedValue={unit}
                            onValueChange={setUnit}
                            style={{ width: 100, height: 52 }}
                        >
                            <Picker.Item label={t('hospitality_unit_sqft')} value="sqft" />
                            <Picker.Item label={t('hospitality_unit_sqm')} value="sqm" />
                            <Picker.Item label={t('hospitality_unit_acre')} value="acre" />
                        </Picker>
                    </View>

                    {/* AVAILABILITY */}
                    <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                        {t('hospitality_availability_status')}
                    </Text>
                    <View className="flex-row mb-3">
                        <PillButton
                            label={t('hospitality_ready_to_move')}
                            selected={availability === "Ready"}
                            onPress={() => setAvailability("Ready")}
                        />
                        <PillButton
                            label={t('hospitality_under_construction')}
                            selected={availability === "UnderConstruction"}
                            onPress={() => setAvailability("UnderConstruction")}
                        />
                    </View>

                    {availability === "Ready" && (
                        <>
                            <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                                {t('hospitality_age_of_property')}
                            </Text>
                            <View className="flex-row flex-wrap mb-4">
                                <PillButton label={t('hospitality_age_0_1')} selected={ageOfProperty === "0-1 years"} onPress={() => setAgeOfProperty("0-1 years")} />
                                <PillButton label={t('hospitality_age_1_5')} selected={ageOfProperty === "1-5 years"} onPress={() => setAgeOfProperty("1-5 years")} />
                                <PillButton label={t('hospitality_age_5_10')} selected={ageOfProperty === "5-10 years"} onPress={() => setAgeOfProperty("5-10 years")} />
                                <PillButton label={t('hospitality_age_10plus')} selected={ageOfProperty === "10+ years"} onPress={() => setAgeOfProperty("10+ years")} />
                            </View>
                        </>
                    )}

                    {availability === "UnderConstruction" && (
                        <>
                            <TouchableOpacity
                                onPress={() => setVisible(visible === "possessionBy" ? null : "possessionBy")}
                                className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
                            >
                                <Text className="text-gray-800 text-left">{possessionBy || t('hospitality_expected_by')}</Text>
                                <Image source={require("../../../../../../assets/arrow.png")} style={{ width: 20, height: 20 }} />
                            </TouchableOpacity>

                            {visible === "possessionBy" && (
                                <View className="bg-white rounded-lg shadow-lg -mt-4 mb-4" style={{ borderWidth: 1, borderColor: "#0000001A" }}>
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
                                            className={`p-4 border-b border-gray-200 ${possessionBy === item ? "bg-green-500" : "bg-white"}`}
                                        >
                                            <Text className={`${possessionBy === item ? "text-white" : "text-gray-800"}`}>{item}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {showMonthDropdown && (
                                <>
                                    <Text className="text-[15px] text-[#00000099] font-bold mb-2">{t('hospitality_expected_month')}</Text>
                                    <TouchableOpacity
                                        onPress={() => setVisible(visible === "expectedMonth" ? null : "expectedMonth")}
                                        className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
                                    >
                                        <Text className="text-gray-800 text-left">{expectedMonth || t('hospitality_select_month')}</Text>
                                        <Image source={require("../../../../../../assets/arrow.png")} style={{ width: 20, height: 20 }} />
                                    </TouchableOpacity>

                                    {visible === "expectedMonth" && (
                                        <View className="bg-white rounded-lg shadow-lg -mt-4 mb-4" style={{ borderWidth: 1, borderColor: "#0000001A" }}>
                                            {monthOptions.map((item) => (
                                                <TouchableOpacity
                                                    key={item}
                                                    onPress={() => {
                                                        setExpectedMonth(item);
                                                        setVisible(null);
                                                    }}
                                                    className={`p-4 border-b border-gray-200 ${expectedMonth === item ? "bg-green-500" : "bg-white"}`}
                                                >
                                                    <Text className={`${expectedMonth === item ? "text-white" : "text-gray-800"}`}>{item}</Text>
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

            {/* FOOTER */}
            <View className="bg-white border-t border-gray-200">
                <View className="flex-row justify-end mt-4 mx-3 mb-12">
                    <TouchableOpacity className="px-8 py-3 rounded-lg bg-gray-200 mx-3"
                        onPress={() => router.push("/home/screens/UploadScreens/CommercialUpload")}>
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