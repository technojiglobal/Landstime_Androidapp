//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/Office.jsx

import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  Modal,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { convertToEnglish } from '../../../../../../utils/reverseTranslation';
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
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
      {selected && (
        <Text style={{ color: "white", fontWeight: "bold" }}>✓</Text>
      )}
    </View>
    <Text className="text-[11px] text-[#00000099]">{label}</Text>
  </Pressable>
);

const FeatureCheckbox = ({ label, checked, onToggle }) => (
  <TouchableOpacity
    onPress={onToggle}
    className="flex-row items-center justify-between mb-2"
  >
    <View>
      <Text className="text-sm font-medium">{label}</Text>
      <Text className="text-xs text-gray-400">
        {checked ? "Available" : "Not Available"}
      </Text>
    </View>

    <View
      className={`w-5 h-5 rounded items-center justify-center ${
        checked ? "bg-green-500" : "border border-gray-300"
      }`}
    >
      {checked && <Text className="text-white text-xs">✓</Text>}
    </View>
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

const Counter = ({ value, setValue }) => (
  <View className="flex-row items-center gap-3">
    <TouchableOpacity
      onPress={() => setValue(Math.max(0, value - 1))}
      className="w-7 h-7 rounded-full border border-gray-300 items-center justify-center"
    >
      <Text>-</Text>
    </TouchableOpacity>

    <Text className="text-sm font-semibold">{value}</Text>

    <TouchableOpacity
      onPress={() => setValue(value + 1)}
      className="w-7 h-7 rounded-full border border-gray-300 items-center justify-center"
    >
      <Text>+</Text>
    </TouchableOpacity>
  </View>
);

export default function PropertyFormScreen() {
  const params = useLocalSearchParams();
  const { t } = useTranslation(); // ✅ ADD THIS

  const images = params.images ? JSON.parse(params.images) : [];

  const baseDetails = params.commercialBaseDetails
    ? JSON.parse(params.commercialBaseDetails)
    : null;

  const officeKindFromBase = baseDetails?.officeKind;
  const [officeKinds, setOfficeKinds] = useState([]);

  const [visible, setVisible] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const [location, setLocation] = useState("");
  const [locatedInside, setLocatedInside] = useState("");
  const [zoneType, setZoneType] = useState("");
  const [neighborhoodArea, setNeighborhoodArea] = useState("");
  const [carpetArea, setCarpetArea] = useState("");
  const [unit, setUnit] = useState("sqft");
  
  const [cabins, setCabins] = useState("");
  const [meetingRooms, setMeetingRooms] = useState("");
  const [seats, setSeats] = useState("");
  const [maxSeats, setMaxSeats] = useState("");
  const [showMaxSeats, setShowMaxSeats] = useState(false);

  const [features, setFeatures] = useState({
    conferenceRoom: false,
    washRoom: false,
    reception: false,
    pantry: false,
    furnishing: false,
    centralAC: false,
    oxygenDuct: false,
    ups: false,
  });

  const [conferenceCount, setConferenceCount] = useState(null);
  const [publicWashrooms, setPublicWashrooms] = useState(null);
  const [privateWashrooms, setPrivateWashrooms] = useState(null);
  const [pantryType, setPantryType] = useState(null);
  const [pantrySize, setPantrySize] = useState("");

  const toggleFeature = (key) =>
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));

  const [additionalFeatures, setAdditionalFeatures] = useState([]);
  const [fireMeasures, setFireMeasures] = useState([]);

  const fireOptions = [
    t('office_fire_extinguisher'),
    t('office_fire_sensors'),
    t('office_fire_sprinklers'),
    t('office_fire_hose'),
  ];

  const [totalFloors, setTotalFloors] = useState("");
  const [floorNo, setFloorNo] = useState("");
  const [stairCase, setStairCase] = useState(null);
  const stairOptions = ["1", "2", "3", "4+"];

  const [lift, setLift] = useState(null);
  const [passengerLifts, setPassengerLifts] = useState(0);
  const [serviceLifts, setServiceLifts] = useState(0);

  const [parking, setParking] = useState(null);
  const [parkingOptions, setParkingOptions] = useState({
    basement: false,
    outside: false,
    private: false,
  });
  const [parkingCount, setParkingCount] = useState("");

  const [availability, setAvailability] = useState(null);
  const [ageOfProperty, setAgeOfProperty] = useState(null);
  const [possessionBy, setPossessionBy] = useState("");

  const ownershipOptions = [
    t('office_ownership_freehold'),
    t('office_ownership_leasehold'),
    t('office_ownership_company'),
    t('office_ownership_other')
  ];
  const [ownership, setOwnership] = useState("");

  const router = useRouter();

  // ✅ Load draft from AsyncStorage
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await AsyncStorage.getItem('draft_office_details');
        if (draft) {
          const prevData = JSON.parse(draft);
          console.log('📦 Loading draft from AsyncStorage');
          
          setLocation(prevData.location || '');
          setLocatedInside(prevData.locatedInside || '');
          setZoneType(prevData.zoneType || '');
          setCarpetArea(prevData.carpetArea?.toString() || '');
          setUnit(prevData.carpetAreaUnit || 'sqft');
          setNeighborhoodArea(prevData.neighborhoodArea || params.area || '');
          
          setCabins(prevData.cabins?.toString() || '');
          setMeetingRooms(prevData.meetingRooms?.toString() || '');
          setSeats(prevData.seats?.toString() || '');
          setMaxSeats(prevData.maxSeats?.toString() || '');
          setShowMaxSeats(!!prevData.maxSeats);
          
          if (prevData.receptionArea !== undefined) {
            setFeatures(prev => ({...prev, reception: prevData.receptionArea}));
          }
          if (prevData.furnishing !== undefined) {
            setFeatures(prev => ({...prev, furnishing: prevData.furnishing}));
          }
          if (prevData.pantry !== undefined) {
            setFeatures(prev => ({...prev, pantry: prevData.pantry}));
            setPantryType(prevData.pantryType || null);
            setPantrySize(prevData.pantrySize?.toString() || '');
          }
          if (prevData.additionalFeatures) {
            setFeatures(prev => ({
              ...prev,
              centralAC: prevData.additionalFeatures.includes('Central AC'),
              oxygenDuct: prevData.additionalFeatures.includes('Oxygen Duct'),
              ups: prevData.additionalFeatures.includes('UPS'),
            }));
          }

          if (prevData.conferenceRooms !== undefined && prevData.conferenceRooms !== null) {
            const roomCount = prevData.conferenceRooms.toString();
            setConferenceCount(roomCount);
            setFeatures(prev => ({...prev, conferenceRoom: true}));
          }

          if (prevData.washrooms) {
            setPublicWashrooms(prevData.washrooms.public?.toString() || null);
            setPrivateWashrooms(prevData.washrooms.private?.toString() || null);
            if (prevData.washrooms.public || prevData.washrooms.private) {
              setFeatures(prev => ({...prev, washRoom: true}));
            }
          }
          
          setFireMeasures(prevData.fireSafetyMeasures || []);
          setTotalFloors(prevData.totalFloors?.toString() || '');
          setFloorNo(prevData.floorNo?.toString() || '');
          setStairCase(prevData.staircases || null);
          setLift(prevData.lift || null);
          setPassengerLifts(prevData.passengerLifts || 0);
          setServiceLifts(prevData.serviceLifts || 0);
          
          if (prevData.parking) {
            setParking(prevData.parking.type || null);
            setParkingOptions(prevData.parking.options || {basement: false, outside: false, private: false});
            setParkingCount(prevData.parking.count?.toString() || '');
          }
          
          setAvailability(prevData.availability || null);
          setAgeOfProperty(prevData.ageOfProperty || null);
          setPossessionBy(prevData.possessionBy || '');
          setOwnership(prevData.ownership || '');
          
          console.log('✅ Draft loaded from AsyncStorage');
          return;
        }
      } catch (e) {
        console.log('⚠️ Failed to load draft:', e);
      }

      if (params.officeDetails) {
        try {
          const prevData = JSON.parse(params.officeDetails);
          console.log('🔄 Loading from params (no draft found)');
          setLocation(prevData.location || '');
        } catch (e) {
          console.log('❌ Could not restore office data:', e);
        }
      }
      
      if (params.area) {
        setNeighborhoodArea(params.area);
      }
    };

    loadDraft();
  }, [params.officeDetails, params.area, params.commercialBaseDetails]);

  // ✅ Auto-save draft
  useEffect(() => {
    const saveDraft = async () => {
      const draftData = {
        location,
        locatedInside,
        zoneType,
        neighborhoodArea,
        carpetArea,
        carpetAreaUnit: unit,
        cabins,
        meetingRooms,
        seats,
        maxSeats,
        receptionArea: features.reception,
        furnishing: features.furnishing,
        pantry: features.pantry,
        pantryType,
        pantrySize,
        additionalFeatures: [
          features.centralAC && "Central AC",
          features.oxygenDuct && "Oxygen Duct",
          features.ups && "UPS",
        ].filter(Boolean),
        conferenceRooms: conferenceCount,
        washrooms: {
          public: publicWashrooms,
          private: privateWashrooms,
        },
        fireSafetyMeasures: fireMeasures,
        totalFloors,
        floorNo,
        staircases: stairCase,
        lift,
        passengerLifts,
        serviceLifts,
        parking: {
          type: parking,
          options: parkingOptions,
          count: parkingCount,
        },
        availability,
        ageOfProperty,
        possessionBy,
        ownership,
        timestamp: new Date().toISOString(),
      };

      try {
        await AsyncStorage.setItem('draft_office_details', JSON.stringify(draftData));
        console.log('💾 Office draft auto-saved');
      } catch (e) {
        console.log('⚠️ Failed to save draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [location, neighborhoodArea, carpetArea, cabins, meetingRooms, seats, maxSeats,
      conferenceCount, publicWashrooms, privateWashrooms, pantryType, pantrySize,
      features, fireMeasures, totalFloors, floorNo, stairCase, lift,
      passengerLifts, serviceLifts, parking, parkingOptions, parkingCount,
      availability, ageOfProperty, possessionBy, ownership, zoneType, locatedInside, unit]);

  const toggleArrayItem = (arrSetter, arr, value) => {
    if (arr.includes(value)) arrSetter(arr.filter((a) => a !== value));
    else arrSetter([...arr, value]);
  };

 const handleNext = () => {
  if (!officeKindFromBase) {
    Toast.show({
      type: "error",
      text1: t('office_type_missing'),
      text2: t('office_type_missing_message'),
    });
    return;
  }

  if (!location.trim()) {
    Toast.show({
      type: "error",
      text1: t('office_location_required'),
      text2: t('office_location_required_message'),
    });
    return;
  }

  if (!neighborhoodArea.trim()) {
    Toast.show({
      type: "error",
      text1: t('office_area_required'),
      text2: t('office_area_required_message'),
    });
    return;
  }

  if (!carpetArea.trim()) {
    Toast.show({
      type: "error",
      text1: t('office_carpet_area_required'),
      text2: t('office_carpet_area_required_message'),
    });
    return;
  }

  // ✅ CREATE RAW DETAILS FIRST (with Telugu/Hindi values)
  const rawOfficeDetails = {
    officeKind: officeKindFromBase,
    propertyTitle: baseDetails?.propertyTitle,
    location,
    locatedInside,
    zoneType,
    neighborhoodArea: neighborhoodArea.trim(),
    carpetArea: carpetArea ? Number(carpetArea) : undefined,
    carpetAreaUnit: unit,
    cabins: cabins ? Number(cabins) : undefined,
    meetingRooms: meetingRooms ? Number(meetingRooms) : undefined,
    seats: seats ? Number(seats) : undefined,
    maxSeats: maxSeats ? Number(maxSeats) : undefined,
    conferenceRooms: conferenceCount,
    washrooms: {
      public: publicWashrooms ? Number(publicWashrooms) : undefined,
      private: privateWashrooms ? Number(privateWashrooms) : undefined,
    },
    receptionArea: features.reception,
    furnishing: features.furnishing,
    pantry: features.pantry,
    pantryType: pantryType,
    pantrySize: pantrySize ? Number(pantrySize) : undefined,
    additionalFeatures: [
      features.centralAC && "Central AC",
      features.oxygenDuct && "Oxygen Duct",
      features.ups && "UPS",
    ].filter(Boolean),
    fireSafetyMeasures: fireMeasures,
    totalFloors: totalFloors ? Number(totalFloors) : undefined,
    floorNo: floorNo ? Number(floorNo) : undefined,
    staircases: stairCase,
    lift,
    passengerLifts,
    serviceLifts,
    parking: {
      type: parking,
      options: parkingOptions,
      count: parkingCount ? Number(parkingCount) : undefined,
    },
    availability,
    ageOfProperty,
    possessionBy,
    ownership,
  };

  // ✅ CONVERT TO ENGLISH BEFORE PASSING TO NEXT SCREEN
  const officeDetails = convertToEnglish(rawOfficeDetails);

  router.push({
    pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OfficeNext",
    params: {
      officeDetails: JSON.stringify(officeDetails),
      images: JSON.stringify(images),
      area: neighborhoodArea.trim(),
      propertyTitle: baseDetails?.propertyTitle,
    },
  });
};

  const locatedInsideOptions = [
    t('office_located_it'),
    t('office_located_business'),
    t('office_located_other'),
  ];

  const zoneTypeOptions = [
    t('office_zone_commercial'),
    t('office_zone_residential'),
    t('office_zone_transport'),
    t('office_zone_public'),
    t('office_zone_open'),
    t('office_zone_agricultural'),
    t('office_zone_sez'),
    t('office_zone_conservation'),
    t('office_zone_government'),
  ];

  const possessionOptions = [
    t('office_possession_immediate'),
    t('office_possession_3months'),
    t('office_possession_6months'),
    t('office_possession_2026'),
    t('office_possession_2027'),
    t('office_possession_2028'),
    t('office_possession_2029'),
    t('office_possession_2030'),
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center mt-7 mb-4">
          <TouchableOpacity
            onPress={() => {
              const currentOfficeData = {
                location,
                locatedInside,
                zoneType,
                carpetArea,
                carpetAreaUnit: unit,
                cabins,
                meetingRooms,
                seats,
                maxSeats,
                receptionArea: features.reception,
                furnishing: features.furnishing,
                pantry: features.pantry,
                pantryType: pantryType,
                pantrySize: pantrySize,
                additionalFeatures: [
                  features.centralAC && "Central AC",
                  features.oxygenDuct && "Oxygen Duct",
                  features.ups && "UPS",
                ].filter(Boolean),
                conferenceRooms: conferenceCount,
                washrooms: {
                  public: publicWashrooms ? Number(publicWashrooms) : undefined,
                  private: privateWashrooms ? Number(privateWashrooms) : undefined,
                },
                fireSafetyMeasures: fireMeasures,
                totalFloors: totalFloors ? Number(totalFloors) : undefined,
                floorNo: floorNo ? Number(floorNo) : undefined,
                staircases: stairCase,
                lift,
                passengerLifts,
                serviceLifts,
                parking: {
                  type: parking,
                  options: parkingOptions,
                  count: parkingCount ? Number(parkingCount) : undefined,
                },
                availability,
                ageOfProperty,
                possessionBy,
                ownership,
              };

              router.push({
                pathname: "/home/screens/UploadScreens/CommercialUpload",
                params: {
                  officeDetails: JSON.stringify(currentOfficeData),
                  images: JSON.stringify(images),
                  area: neighborhoodArea.trim(),
                  propertyTitle: baseDetails?.propertyTitle,
                  commercialBaseDetails: JSON.stringify({
                    subType: "Office",
                    officeKind: officeKindFromBase || currentOfficeData.officeKind || officeKinds[0],
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

        {/* Location */}
        <View
          className="bg-white rounded-lg p-4 mb-4"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="text-[15px] text-[#00000060] mb-3">
            {t('office_location')}<Text className="text-red-500">*</Text>
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
              placeholder={t('office_enter_location')}
              value={location}
              onChangeText={setLocation}
              onFocus={() => setFocusedField("location")}
              onBlur={() => setFocusedField(null)}
              className="flex-1 rounded-lg"
              style={{
                borderWidth: 1,
                borderColor:
                  focusedField === "location" ? "#22C55E" : "#0000001A",
              }}
            />
          </View>

          <Text className="text-[14px] font-medium text-[#00000099] mb-3">
            {t('office_area_neighborhood')}<Text className="text-red-500">*</Text>
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
              placeholder={t('office_enter_area')}
              value={neighborhoodArea}
              onChangeText={setNeighborhoodArea}
              onFocus={() => setFocusedField("neighborhoodArea")}
              onBlur={() => setFocusedField(null)}
              className="flex-1"
            />
          </View>

          <TouchableOpacity
            onPress={() =>
              setVisible(visible === "locatedInside" ? null : "locatedInside")
            }
            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
          >
            <Text className="text-gray-800 text-left">
              {locatedInside || t('office_located_inside')}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#888" />
          </TouchableOpacity>
          {visible === "locatedInside" && (
            <View
              className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
              style={{ borderWidth: 1, borderColor: "#0000001A" }}
            >
              {locatedInsideOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setLocatedInside(item);
                    setVisible(null);
                  }}
                  className={`p-4 border-b border-gray-200 ${
                    locatedInside === item ? "bg-green-500" : "bg-white"
                  }`}
                >
                  <Text
                    className={`${locatedInside === item ? "text-white" : "text-gray-800"}`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            onPress={() =>
              setVisible(visible === "zoneType" ? null : "zoneType")
            }
            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
          >
            <Text className="text-gray-800 text-left">
              {zoneType || t('office_zone_type')}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#888" />
          </TouchableOpacity>
          {visible === "zoneType" && (
            <View
              className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
              style={{ borderWidth: 1, borderColor: "#0000001A" }}
            >
              {zoneTypeOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setZoneType(item);
                    setVisible(null);
                  }}
                  className={`p-4 border-b border-gray-200 ${zoneType === item ? "bg-green-500" : "bg-white"}`}
                >
                  <Text
                    className={`${zoneType === item ? "text-white" : "text-gray-800"}`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Area & Features Box */}
        <View
          className="bg-white rounded-lg p-4 mb-6"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="text-[14px] font-medium text-[#00000099] mb-3">
            {t('office_carpet_area')}<Text className="text-red-500">*</Text>
          </Text>
          <View
            className="flex-row items-center mb-3 rounded-md"
            style={{
              borderWidth: 1,
              borderColor: focusedField === "area" ? "#22C55E" : "#0000001A",
              backgroundColor: "#D9D9D91C",
              height: 52,
            }}
          >
            <TextInput
              placeholder="0"
              value={carpetArea}
              onChangeText={(text) => setCarpetArea(text.replace(/[^0-9]/g, ""))}
              className="flex-1 px-3"
              onFocus={() => setFocusedField("carpetArea")}
              onBlur={() => setFocusedField(null)}
              style={{ height: 52 }}
              keyboardType="numeric"
            />

            <View
              style={{ width: 1, backgroundColor: "#0000001A", height: "60%" }}
            />
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
            {t('office_describe_setup')}
          </Text>
          <TextInput
            placeholder={t('office_cabins')}
            value={cabins}
            onChangeText={(text) => setCabins(text.replace(/[^0-9]/g, ""))}
            className="flex-1 mb-3 rounded-md p-3"
            onFocus={() => setFocusedField("cabins")}
            onBlur={() => setFocusedField(null)}
            style={{
              height: 50,
              backgroundColor: "#D9D9D91C",
              borderWidth: 1,
              borderColor: focusedField === "cabins" ? "#22C55E" : "#0000001A",
            }}
            keyboardType="numeric"
          />

          <TextInput
              placeholder={t('office_meeting_rooms')}
              value={meetingRooms}
              onChangeText={(text) =>
                setMeetingRooms(text.replace(/[^0-9]/g, ""))
              }
              className="flex-1 mb-3 rounded-md p-3"
              onFocus={() => setFocusedField("meeting")}
              onBlur={() => setFocusedField(null)}
              style={{
                height: 50,
                backgroundColor: "#D9D9D91C",
                borderWidth: 1,
                borderColor: focusedField === "meeting" ? "#22C55E" : "#0000001A",
              }}
              keyboardType="numeric"
            />
            <TextInput
              placeholder={t('office_seats_min')}
              value={seats}
              onChangeText={(text) => setSeats(text.replace(/[^0-9]/g, ""))}
              className="flex-1 mb-3 rounded-md p-3"
              onFocus={() => setFocusedField("seats")}
              onBlur={() => setFocusedField(null)}
              style={{
                height: 50,
                backgroundColor: "#D9D9D91C",
                borderWidth: 1,
                borderColor: focusedField === "seats" ? "#22C55E" : "#0000001A",
              }}
              keyboardType="numeric"
            />
            <TouchableOpacity
              className="mb-2"
              onPress={() => setShowMaxSeats(true)}
            >
              <Text className="text-sm font-bold text-green-500">
                {t('office_add_max_seats')}
              </Text>
            </TouchableOpacity>

            {showMaxSeats && (
              <TextInput
                placeholder={t('office_max_seats')}
                value={maxSeats}
                onChangeText={(text) => setMaxSeats(text.replace(/[^0-9]/g, ""))}
                className="flex-1 mb-3 rounded-md p-3"
                onFocus={() => setFocusedField("maxseats")}
                onBlur={() => setFocusedField(null)}
                style={{
                  height: 50,
                  backgroundColor: "#D9D9D91C",
                  borderWidth: 1,
                  borderColor:
                    focusedField === "maxseats" ? "#22C55E" : "#0000001A",
                }}
                keyboardType="numeric"
              />
            )}
            <Text className="text-base font-bold mb-1">
              {t('office_mark_features')}
            </Text>
            <Text className="text-xs text-gray-400 mb-4">
              {t('office_select_facilities')}
            </Text>

            {/* ---------- CONFERENCE ROOM ---------- */}
            <FeatureCheckbox
              label={t('office_conference_room')}
              checked={features.conferenceRoom}
              onToggle={() => toggleFeature("conferenceRoom")}
            />

            {features.conferenceRoom && (
              <View className="flex-row mb-4">
                {["1", "2", "3", "4+"].map((n) => (
                  <RoundOption
                    key={n}
                    label={n}
                    selected={conferenceCount === n}
                    onPress={() => setConferenceCount(n)}
                  />
                ))}
              </View>
            )}

            {/* ---------- WASH ROOM ---------- */}
            <FeatureCheckbox
              label={t('office_wash_room')}
              checked={features.washRoom}
              onToggle={() => toggleFeature("washRoom")}
            />

            {features.washRoom && (
              <View className="mb-4">
                <Text className="text-xs text-gray-500 mb-2">
                  {t('office_public_washrooms')}
                </Text>
                <View className="flex-row">
                  {["1", "2", "3", "4+"].map((n) => (
                    <RoundOption
                      key={`public-${n}`}
                      label={n}
                      selected={publicWashrooms === n}
                      onPress={() => setPublicWashrooms(n)}
                    />
                  ))}
                </View>

                <Text className="text-xs text-gray-500 mt-2 mb-2">
                  {t('office_private_washrooms')}
                </Text>
                <View className="flex-row">
                  {["1", "2", "3", "4+"].map((n) => (
                    <RoundOption
                      key={`private-${n}`}
                      label={n}
                      selected={privateWashrooms === n}
                      onPress={() => setPrivateWashrooms(n)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* ---------- RECEPTION ---------- */}
            <FeatureCheckbox
              label={t('office_reception_area')}
              checked={features.reception}
              onToggle={() => toggleFeature("reception")}
            />

            {/* ---------- PANTRY ---------- */}
            <FeatureCheckbox
              label={t('office_pantry')}
              checked={features.pantry}
              onToggle={() => toggleFeature("pantry")}
            />

            {features.pantry && (
              <View className="mb-4">
                <View className="flex-row mb-2">
                  {[t('office_pantry_private'), t('office_pantry_shared')].map((type) => (
                    <PillButton
                      key={type}
                      label={type}
                      selected={pantryType === type}
                      onPress={() => setPantryType(type)}
                    />
                  ))}
                </View>

                <TextInput
                  placeholder={t('office_pantry_size')}
                  value={pantrySize}
                  onChangeText={(text) =>
                    setPantrySize(text.replace(/[^0-9]/g, ""))
                  }
                  className="flex-1 mb-3 rounded-md p-3"
                  onFocus={() => setFocusedField("pantry")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    height: 50,
                    backgroundColor: "#D9D9D91C",
                    borderWidth: 1,
                    borderColor:
                      focusedField === "pantry" ? "#22C55E" : "#0000001A",
                  }}
                  keyboardType="numeric"
                />
              </View>
            )}

            {/* ---------- SIMPLE TOGGLES ---------- */}
            <FeatureCheckbox
              label={t('office_furnishing')}
              checked={features.furnishing}
              onToggle={() => toggleFeature("furnishing")}
            />
            <FeatureCheckbox
              label={t('office_central_ac')}
              checked={features.centralAC}
              onToggle={() => toggleFeature("centralAC")}
            />
            <FeatureCheckbox
              label={t('office_oxygen_duct')}
              checked={features.oxygenDuct}
              onToggle={() => toggleFeature("oxygenDuct")}
            />
            <FeatureCheckbox
              label={t('office_ups')}
              checked={features.ups}
              onToggle={() => toggleFeature("ups")}
            />

            <Text className="text-[15px] font-bold text-[#00000099] mb-2">
              {t('office_fire_safety')}
            </Text>
            <View className="flex-row flex-wrap mb-4">
              {fireOptions.map((f) => (
                <PillButton
                  key={f}
                  label={f}
                  selected={fireMeasures.includes(f)}
                  onPress={() =>
                    toggleArrayItem(setFireMeasures, fireMeasures, f)
                  }
                />
              ))}
            </View>

            <Text className="text-[15px] font-bold text-[#00000099] mb-2">
              {t('office_floor_details')}
            </Text>
            <TextInput
              placeholder={t('office_total_floors')}
              value={totalFloors}
              onChangeText={(text) => setTotalFloors(text.replace(/[^0-9]/g, ""))}
              onFocus={() => setFocusedField("totalfloors")}
              onBlur={() => setFocusedField(null)}
              className="rounded-lg px-3 mb-3"
              style={{
                borderWidth: 1,
                borderColor:
                  focusedField === "totalfloors" ? "#22C55E" : "#0000001A",
              }}
              keyboardType="numeric"
            />
            <TextInput
              placeholder={t('office_floor_no')}
              value={floorNo}
              onChangeText={(text) => setFloorNo(text.replace(/[^0-9]/g, ""))}
              className="flex-1 mb-3 rounded-md p-3"
              onFocus={() => setFocusedField("cabins")}
              onBlur={() => setFocusedField(null)}
              style={{
                height: 50,
                backgroundColor: "#D9D9D91C",
                borderWidth: 1,
                borderColor: focusedField === "cabins" ? "#22C55E" : "#0000001A",
              }}
              keyboardType="numeric"
            />

            <Text className="text-[15px] font-bold text-[#00000099] mb-2">
              {t('office_staircases')}
            </Text>
            <View className="flex-row mb-4">
              {stairOptions.map((s) => (
                <RoundOption
                  key={s}
                  label={s}
                  selected={stairCase === s}
                  onPress={() => setStairCase(s)}
                />
              ))}
            </View>

            <Text className="text-[15px] font-bold text-[#00000099] mb-2">
              {t('office_lifts')}
            </Text>
            <View className="flex-row mb-3">
              <PillButton
                label={t('office_lift_available')}
                selected={lift === "Available"}
                onPress={() => setLift("Available")}
              />
              <PillButton
                label={t('office_lift_not_available')}
                selected={lift === "Not-Available"}
                onPress={() => setLift("Not-Available")}
              />
            </View>

            {lift === "Available" && (
              <View className="mb-4">
                <View className="flex-row justify-between mb-3">
                  <Text className="text-sm text-gray-600">{t('office_passenger_lifts')}</Text>
                  <Counter value={passengerLifts} setValue={setPassengerLifts} />
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">{t('office_service_lifts')}</Text>
                  <Counter value={serviceLifts} setValue={setServiceLifts} />
                </View>
              </View>
            )}

            <Text className="text-[15px] text-[#00000099] font-bold mb-2">
              {t('office_parking')}
            </Text>
            <View className="flex-row mb-3">
              <PillButton
                label={t('office_parking_available')}
                selected={parking === "Available"}
                onPress={() => setParking("Available")}
              />
              <PillButton
                label={t('office_parking_not_available')}
                selected={parking === "Not-Available"}
                onPress={() => setParking("Not-Available")}
              />
            </View>

            {parking === "Available" && (
              <View className="mb-4">
                {["basement", "outside", "private"].map((key) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() =>
                      setParkingOptions((p) => ({ ...p, [key]: !p[key] }))
                    }
                    className="flex-row items-center mb-2"
                  >
                    <View
                      className={`w-4 h-4 mr-2 border border-gray-300 rounded ${
                        parkingOptions[key] ? "bg-green-500" : ""
                      }`}
                    />
                    <Text className="text-xs text-gray-600">
                      {key === "basement" && t('office_parking_basement')}
                      {key === "outside" && t('office_parking_outside')}
                      {key === "private" && t('office_parking_private')}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TextInput
                  placeholder={t('office_parking_count')}
                  value={parkingCount}
                  onChangeText={setParkingCount}
                  className="mt-2 rounded-md p-3"
                  style={{
                    borderWidth: 1,
                    borderColor: "#0000001A",
                    backgroundColor: "#D9D9D91C",
                  }}
                  keyboardType="numeric"
                />
              </View>
            )}
            <Text className="text-[15px] text-[#00000099] font-bold mb-2">
              {t('office_availability_status')}
            </Text>
            <View className="flex-row mb-3">
              <PillButton
                label={t('office_availability_ready')}
                selected={availability === "Ready"}
                onPress={() => setAvailability("Ready")}
              />
              <PillButton
                label={t('office_availability_construction')}
                selected={availability === "UnderConstruction"}
                onPress={() => setAvailability("UnderConstruction")}
              />
            </View>
            {availability === "Ready" && (
              <>
                <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                  {t('office_age_property')}
                </Text>
                <View className="flex-row flex-wrap mb-4">
                  {[t('office_age_0_1'), t('office_age_1_5'), t('office_age_5_10'), t('office_age_10plus')].map(
                    (age) => (
                      <PillButton
                        key={age}
                        label={age}
                        selected={ageOfProperty === age}
                        onPress={() => setAgeOfProperty(age)}
                      />
                    )
                  )}
                </View>
              </>
            )}
            {availability === "UnderConstruction" && (
              <>
                <View>
                  <Text className="font-semibold text-gray-500 mb-2">
                    {t('office_possession_by')}
                  </Text>
                  <TouchableOpacity
                    className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-[#F9FAFB]"
                    onPress={() => setVisible("possession")}
                  >
                    <Text className="text-base text-gray-700">
                      {possessionBy || t('office_expected_by')}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                  </TouchableOpacity>
                  <Modal
                    visible={visible === "possession"}
                    transparent
                    animationType="slide"
                  >
                    <TouchableOpacity
                      activeOpacity={1}
                      onPressOut={() => setVisible(null)}
                      className="flex-1 justify-center items-center bg-black/40"
                    >
                      <View className="w-[90%] max-h-[50%] bg-white rounded-xl p-2 shadow-md">
                        <FlatList
                          data={[
                            t('office_possession_immediate'),
                            t('office_possession_3months'),
                            t('office_possession_6months'),
                            t('office_possession_2026'),
                            t('office_possession_2027'),
                            t('office_possession_2028'),
                            t('office_possession_2029'),
                            t('office_possession_2030'),
                          ]}
                          keyExtractor={(item) => item}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              className={`p-3 border-b border-gray-200 ${item === t('office_possession_immediate') ? "bg-[#22C55E]" : ""}`}
                              onPress={() => {
                                setPossessionBy(item);
                                setVisible(null);
                              }}
                            >
                              <Text
                                className={`text-base ${item === t('office_possession_immediate') ? "text-white font-medium" : "text-gray-700"}`}
                              >
                                {item}
                              </Text>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    </TouchableOpacity>
                  </Modal>
                </View>
              </>
            )}

            <Text className="text-[15px] text-[#00000099] font-bold mb-2">
              {t('office_ownership')}
            </Text>
            <View className="flex-row flex-wrap mb-4">
              {ownershipOptions.map((o) => (
                <PillButton
                  key={o}
                  label={o}
                  selected={ownership === o}
                  onPress={() => setOwnership(o)}
                />
              ))}
            </View>
            <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-3">
     
              <TouchableOpacity 
                className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
                onPress={() => {
                  const currentOfficeData = {
                    location,
                    locatedInside,
                    zoneType,
                    carpetArea,
                    carpetAreaUnit: unit,
                    cabins,
                    meetingRooms,
                    seats,
                    maxSeats,
                    receptionArea: features.reception,
                    furnishing: features.furnishing,
                    pantry: features.pantry,
                    pantryType: pantryType,
                    pantrySize: pantrySize,
                    additionalFeatures: [
                      features.centralAC && "Central AC",
                      features.oxygenDuct && "Oxygen Duct",
                      features.ups && "UPS",
                    ].filter(Boolean),
                    conferenceRooms: conferenceCount,
                    washrooms: {
                      public: publicWashrooms,
                      private: privateWashrooms,
                    },
                    fireSafetyMeasures: fireMeasures,
                    totalFloors,
                    floorNo,
                    staircases: stairCase,
                    lift,
                    passengerLifts,
                    serviceLifts,
                    parking: {
                      type: parking,
                      options: parkingOptions,
                      count: parkingCount,
                    },
                    availability,
                    ageOfProperty,
                    possessionBy,
                    ownership,
                  };

                  router.push({
                    pathname: "/home/screens/UploadScreens/CommercialUpload",
                    params: {
                      officeDetails: JSON.stringify(currentOfficeData),
                      images: JSON.stringify(images),
                      area: neighborhoodArea.trim(),
                      propertyTitle: baseDetails?.propertyTitle,
                      commercialBaseDetails: JSON.stringify({
                        subType: "Office",
                        officeKind: officeKindFromBase || currentOfficeData.officeKind,
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
        </ScrollView>
      </View>
    );
}