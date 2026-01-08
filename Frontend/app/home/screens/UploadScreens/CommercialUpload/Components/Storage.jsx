//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/Storage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter,useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Toast from 'react-native-toast-message';

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
      {selected && <Text style={{ color: "white", fontWeight: 'bold' }}>✓</Text>}
    </View>
    <Text className="text-[11px] text-[#00000099]">{label}</Text>
  </Pressable>
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
    <Text className={`text-sm ${selected ? "text-green-700 font-semibold" : "text-[rgba(0,0,0,0.6)]"}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function PropertyFormScreen() {
  const [visible, setVisible] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  // Location
  const [location, setLocation] = useState('');
  
  // ✅ NEW - Neighborhood Area
  const [neighborhoodArea, setNeighborhoodArea] = useState('');

  // Area
  const [plotArea, setPlotArea] = useState('');
  const [unit, setUnit] = useState('sqft');
  const [length, setLength] = useState('');
  const [breadth, setBreadth] = useState('');
  const [washroomType, setWashroomType] = useState(null);
  
  // ✅ NEW - Additional Storage Fields
  const [ceilingHeight, setCeilingHeight] = useState('');
  const [flooring, setFlooring] = useState('');
  const [ventilation, setVentilation] = useState(null);
  const [temperatureControl, setTemperatureControl] = useState(false);
  const [covered, setCovered] = useState(null);
  const [security, setSecurity] = useState([]);
  const [accessibility, setAccessibility] = useState('');

  // Availability
  const [availability, setAvailability] = useState(null);
  const [ageOfProperty, setAgeOfProperty] = useState(null);
  const [possessionBy, setPossessionBy] = useState("");

  const router = useRouter();
  const params = useLocalSearchParams();

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

  const baseDetails = useMemo(() => {
    try {
      if (!params.commercialBaseDetails) return null;
      if (typeof params.commercialBaseDetails === 'object') return params.commercialBaseDetails;
      return JSON.parse(params.commercialBaseDetails);
    } catch (e) {
      console.error('❌ Error parsing baseDetails:', e);
      return null;
    }
  }, [params.commercialBaseDetails]);

  // Load draft from AsyncStorage
useEffect(() => {
  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem('draft_storage_details');
      if (draft) {
        const prevData = JSON.parse(draft);
        console.log('📦 Loading Storage draft from AsyncStorage');
        
        setLocation(prevData.location || '');
        setNeighborhoodArea(prevData.neighborhoodArea || '');
        setPlotArea(prevData.plotArea?.toString() || '');
        setUnit(prevData.unit || 'sqft');
        setLength(prevData.length?.toString() || '');
        setBreadth(prevData.breadth?.toString() || '');
        setWashroomType(prevData.washroomType || null);
        setCeilingHeight(prevData.ceilingHeight?.toString() || '');
        setFlooring(prevData.flooring || '');
        setVentilation(prevData.ventilation || null);
        setTemperatureControl(prevData.temperatureControl || false);
        setCovered(prevData.covered || null);
        setSecurity(prevData.security || []);
        setAccessibility(prevData.accessibility || '');
        setAvailability(prevData.availability || null);
        setAgeOfProperty(prevData.ageOfProperty || null);
        setPossessionBy(prevData.possessionBy || '');
        
        console.log('✅ Storage draft loaded, storageType:', prevData.storageType);
        return;
      }
    } catch (e) {
      console.log('⚠️ Failed to load Storage draft:', e);
    }

    // Fallback to params
    if (params.storageDetails) {
      try {
        const prevData = JSON.parse(params.storageDetails);
        setLocation(prevData.location || '');
        setNeighborhoodArea(prevData.neighborhoodArea || '');
        setPlotArea(prevData.storageArea?.value?.toString() || '');
        setUnit(prevData.storageArea?.unit || 'sqft');
        setLength(prevData.dimensions?.length?.toString() || '');
        setBreadth(prevData.dimensions?.breadth?.toString() || '');
        setWashroomType(prevData.washroomType || null);
        setCeilingHeight(prevData.ceilingHeight?.toString() || '');
        setFlooring(prevData.flooring || '');
        setVentilation(prevData.ventilation || null);
        setTemperatureControl(prevData.temperatureControl || false);
        setCovered(prevData.covered || null);
        setSecurity(prevData.security || []);
        setAccessibility(prevData.accessibility || '');
        setAvailability(prevData.availability || null);
        setAgeOfProperty(prevData.ageOfProperty || null);
        setPossessionBy(prevData.possession?.expectedBy || '');
        
        console.log('✅ Restored from params, storageType:', prevData.storageType);
      } catch (e) {
        console.log('❌ Could not restore storage data:', e);
      }
    }
    
    if (params.area) {
      setNeighborhoodArea(params.area);
    }
  };

  loadDraft();
}, [params.storageDetails, params.area, params.commercialBaseDetails,  params.storageType]); // ✅ ADD params.commercialBaseDetails
  // Auto-save draft
  useEffect(() => {
    const saveDraft = async () => {
      const draftData = {
        location,
        neighborhoodArea,
        plotArea,
        unit,
        length,
        breadth,
        washroomType,
        ceilingHeight,
        flooring,
        ventilation,
        temperatureControl,
        covered,
        security,
        accessibility,
        availability,
        ageOfProperty,
        possessionBy,
        storageType: baseDetails?.storageType,
        timestamp: new Date().toISOString(),
      };

      try {
        await AsyncStorage.setItem('draft_storage_details', JSON.stringify(draftData));
        console.log('💾 Storage draft auto-saved');
      } catch (e) {
        console.log('⚠️ Failed to save Storage draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [location, neighborhoodArea, plotArea, unit, length, breadth, washroomType, 
      ceilingHeight, flooring, ventilation, temperatureControl, covered, 
      security, accessibility, availability, ageOfProperty, possessionBy, 
      baseDetails?.storageType]);

 const handleNext = () => {
  // ✅ FIX: Check multiple sources for storageType
  const storageType = baseDetails?.storageType || 
                      baseDetails?.storageKind ||
                      params.storageType;
  
  console.log('🔍 Storage type check:', {
    fromBaseDetails: baseDetails?.storageType,
    fromStorageKind: baseDetails?.storageKind,
    fromParams: params.storageType,
    finalStorageType: storageType
  });
  
  if (!storageType) {
    Toast.show({
      type: "error",
      text1: "Storage type missing",
      text2: "Please go back and select storage type",
    });
    return;
  }

    if (!location.trim()) {
      Toast.show({ type: "error", text1: "Location Required" });
      return;
    }

    if (!neighborhoodArea.trim()) {
      Toast.show({ type: "error", text1: "Area/Neighborhood Required" });
      return;
    }

    if (!plotArea.trim()) {
      Toast.show({ type: "error", text1: "Storage Area Required" });
      return;
    }

   const commercialDetails = {
  subType: "Storage",
  propertyTitle: baseDetails?.propertyTitle,

  storageDetails: {
    storageType: storageType, // ✅ Use the validated storageType
    location,
    neighborhoodArea,

        storageArea: {
          value: Number(plotArea),
          unit,
        },

        dimensions: {
          length: length ? Number(length) : null,
          breadth: breadth ? Number(breadth) : null,
        },

        ceilingHeight: ceilingHeight ? Number(ceilingHeight) : null,
        flooring,
        ventilation,
        temperatureControl,
        covered,
        security,
        accessibility,
        washroomType,
        availability,
        ageOfProperty,

        possession:
          availability === "UnderConstruction"
            ? { expectedBy: possessionBy }
            : null,
      },
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/StorageNext",
      params: {
        commercialDetails: JSON.stringify(commercialDetails),
        images: JSON.stringify(images),
        area: neighborhoodArea,
        propertyTitle: baseDetails?.propertyTitle,
      },
    });
  };

  const toggleArrayItem = (setter, array, value) => {
    if (array.includes(value)) {
      setter(array.filter((item) => item !== value));
    } else {
      setter([...array, value]);
    }
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
              const currentStorageData = {
                location,
                neighborhoodArea,
                plotArea,
                unit,
                length,
                breadth,
                washroomType,
                ceilingHeight,
                flooring,
                ventilation,
                temperatureControl,
                covered,
                security,
                accessibility,
                availability,
                ageOfProperty,
                possessionBy,
                storageType: baseDetails?.storageType,
              };

              router.push({
                pathname: "/home/screens/UploadScreens/CommercialUpload",
                params: {
                  storageDetails: JSON.stringify(currentStorageData),
                  images: JSON.stringify(images),
                  area: neighborhoodArea,
                  propertyTitle: baseDetails?.propertyTitle,
                   storageType: baseDetails?.storageType || currentStorageData.storageType, // ✅ ADD THIS
                  commercialBaseDetails: JSON.stringify({
                    subType: "Storage",
                    storageType: baseDetails?.storageType,
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
              Upload Your Property
            </Text>
            <Text className="text-[12px] text-[#00000066]">
              Add your property details
            </Text>
          </View>
        </View>

        {/* Location */}
        <View
          className="bg-white rounded-lg p-4 mb-4"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="text-[15px] text-[#00000060] mb-3">Location<Text className="text-red-500">*</Text></Text>
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
              placeholder="Enter Property Location"
              value={location}
              onChangeText={setLocation}
              onFocus={() => setFocusedField("location")}
              onBlur={() => setFocusedField(null)}
              className="flex-1 rounded-lg"
              style={{
                borderWidth: 1,
                borderColor: focusedField === "location" ? "#22C55E" : "#0000001A",
              }}
            />
          </View>

          {/* ✅ NEW - Neighborhood Area Field */}
          <Text className="text-[14px] font-medium text-[#00000099] mb-3">
            Area/Neighborhood<Text className="text-red-500">*</Text>
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
              placeholder="Enter Area/Neighborhood (e.g., Akkayapalem)"
              value={neighborhoodArea}
              onChangeText={setNeighborhoodArea}
              onFocus={() => setFocusedField("neighborhoodArea")}
              onBlur={() => setFocusedField(null)}
              className="flex-1"
            />
          </View>
        </View>

        {/* Area & Details Box */}
        <View
          className="bg-white rounded-lg p-4 mb-6"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="text-[14px] font-medium text-[#00000099] mb-3">
            Storage Area<Text className="text-red-500">*</Text>
          </Text>
          <View
            className="flex-row items-center mb-3 rounded-md"
            style={{
              borderWidth: 1,
              borderColor: focusedField === "plotArea" ? "#22C55E" : "#0000001A",
              backgroundColor: "#D9D9D91C",
              height: 52,
            }}
          >
            <TextInput
              placeholder="0"
              value={plotArea}
              onChangeText={(text) => setPlotArea(text.replace(/[^0-9]/g, ""))}
              className="flex-1 px-3"
              onFocus={() => setFocusedField("plotArea")}
              onBlur={() => setFocusedField(null)}
              style={{ height: 52 }}
              keyboardType="numeric"
            />

            <View style={{ width: 1, backgroundColor: "#0000001A", height: "60%" }} />
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

          <Text className="text-[15px] font-bold text-[#00000099] mb-2">Storage Dimensions (optional)</Text>
          <TextInput
            placeholder="Length (in Ft.)"
            value={length}
            onChangeText={(text) => setLength(text.replace(/[^0-9]/g, ""))}
            className="flex-1 mb-3 rounded-md p-3"
            onFocus={() => setFocusedField("length")}
            onBlur={() => setFocusedField(null)}
            style={{
              height: 50,
              backgroundColor: "#D9D9D91C",
              borderWidth: 1,
              borderColor: focusedField === "length" ? "#22C55E" : "#0000001A",
            }}
            keyboardType="numeric"
          />

          <TextInput
            placeholder="Breadth (in Ft.)"
            value={breadth}
            onChangeText={(text) => setBreadth(text.replace(/[^0-9]/g, ""))}
            className="flex-1 mb-3 rounded-md p-3"
            onFocus={() => setFocusedField("breadth")}
            onBlur={() => setFocusedField(null)}
            style={{
              height: 50,
              backgroundColor: "#D9D9D91C",
              borderWidth: 1,
              borderColor: focusedField === "breadth" ? "#22C55E" : "#0000001A",
            }}
            keyboardType="numeric"
          />

          {/* ✅ NEW - Ceiling Height */}
          <Text className="text-[15px] font-bold text-[#00000099] mb-2">Ceiling Height (optional)</Text>
          <TextInput
            placeholder="Height in Feet"
            value={ceilingHeight}
            onChangeText={(text) => setCeilingHeight(text.replace(/[^0-9]/g, ""))}
            className="flex-1 mb-3 rounded-md p-3"
            style={{
              height: 50,
              backgroundColor: "#D9D9D91C",
              borderWidth: 1,
              borderColor: "#0000001A",
            }}
            keyboardType="numeric"
          />

          {/* ✅ NEW - Flooring Type */}
          <Text className="text-[15px] font-bold text-[#00000099] mb-2">Flooring Type</Text>
          <View className="flex-row flex-wrap mb-3">
            {["Concrete", "Tiles", "Epoxy", "Other"].map((type) => (
              <PillButton
                key={type}
                label={type}
                selected={flooring === type}
                onPress={() => setFlooring(type)}
              />
            ))}
          </View>

          {/* ✅ NEW - Ventilation */}
          <Text className="text-[15px] font-bold text-[#00000099] mb-2">Ventilation</Text>
          <View className="flex-row mb-3">
            <PillButton
              label="Natural"
              selected={ventilation === "Natural"}
              onPress={() => setVentilation("Natural")}
            />
            <PillButton
              label="Mechanical"
              selected={ventilation === "Mechanical"}
              onPress={() => setVentilation("Mechanical")}
            />
            <PillButton
              label="Both"
              selected={ventilation === "Both"}
              onPress={() => setVentilation("Both")}
            />
          </View>

          {/* ✅ NEW - Temperature Control */}
          <Checkbox
            label="Temperature Controlled"
            selected={temperatureControl}
            onPress={() => setTemperatureControl(!temperatureControl)}
          />

          {/* ✅ NEW - Covered Storage */}
          <Text className="text-[15px] font-bold text-[#00000099] mb-2">Storage Type</Text>
          <View className="flex-row mb-3">
            <PillButton
              label="Covered"
              selected={covered === true}
              onPress={() => setCovered(true)}
            />
            <PillButton
              label="Open"
              selected={covered === false}
              onPress={() => setCovered(false)}
            />
          </View>

          {/* ✅ NEW - Security Features */}
          <Text className="text-[15px] font-bold text-[#00000099] mb-2">Security Features</Text>
          <View className="flex-row flex-wrap mb-3">
            {["CCTV", "Security Guard", "Alarm System", "Fire Safety"].map((sec) => (
              <PillButton
                key={sec}
                label={sec}
                selected={security.includes(sec)}
                onPress={() => toggleArrayItem(setSecurity, security, sec)}
              />
            ))}
          </View>

          {/* ✅ NEW - Accessibility */}
          <Text className="text-[15px] font-bold text-[#00000099] mb-2">Loading/Unloading Access</Text>
          <View className="flex-row flex-wrap mb-3">
            {["Dock Level", "Ground Level", "Ramp Access"].map((acc) => (
              <PillButton
                key={acc}
                label={acc}
                selected={accessibility === acc}
                onPress={() => setAccessibility(acc)}
              />
            ))}
          </View>

          {/* Washroom Details */}
          <Text className="text-[14px] text-gray-600 mb-2">Washroom Facilities</Text>
          <View className="flex-row mt-4">
            <PillButton
              label="None"
              selected={washroomType === "None"}
              onPress={() => setWashroomType("None")}
            />
            <PillButton
              label="Shared"
              selected={washroomType === "Shared"}
              onPress={() => setWashroomType("Shared")}
            />
            {["1", "2", "3", "4+"].map((num) => (
              <RoundOption
                key={num}
                label={num}
                selected={washroomType === num}
                onPress={() => setWashroomType(num)}
              />
            ))}
          </View>

          <Text className="text-[15px] text-[#00000099] font-bold mb-2 mt-4">
            Availability Status
          </Text>
          <View className="flex-row mb-3">
            <PillButton
              label="Ready to move"
              selected={availability === "Ready"}
              onPress={() => setAvailability("Ready")}
            />
            <PillButton
              label="Under Construction"
              selected={availability === "UnderConstruction"}
              onPress={() => setAvailability("UnderConstruction")}
            />
          </View>

          {availability === "Ready" && (
            <>
              <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                Age of property
              </Text>
              <View className="flex-row flex-wrap mb-4">
                {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                  <PillButton
                    key={age}
                    label={age}
                    selected={ageOfProperty === age}
                    onPress={() => setAgeOfProperty(age)}
                  />
                ))}
              </View>
            </>
          )}

          {availability === "UnderConstruction" && (
            <>
              <View>
                <Text className="font-semibold text-gray-500 mb-2">Possession By</Text>
                <TouchableOpacity
                  className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-[#F9FAFB]"
                  onPress={() => setVisible("possession")}
                >
                  <Text className="text-base text-gray-700">{possessionBy || "Expected By"}</Text>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
                <Modal visible={visible === "possession"} transparent animationType="slide">
                  <TouchableOpacity
                    activeOpacity={1}
                    onPressOut={() => setVisible(null)}
                    className="flex-1 justify-center items-center bg-black/40"
                  >
                    <View className="w-[90%] max-h-[50%] bg-white rounded-xl p-2 shadow-md">
                      <FlatList
                        data={[
                          "Immediate",
                          "Within 3 months",
                          "Within 6 months",
                          "By 2026",
                          "By 2027",
                          "By 2028",
                          "By 2029",
                          "By 2030",
                        ]}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            className={`p-3 border-b border-gray-200 ${item === "Immediate" ? "bg-[#22C55E]" : ""}`}
                            onPress={() => {
                              setPossessionBy(item);
                              setVisible(null);
                            }}
                          >
                            <Text className={`text-base ${item === "Immediate" ? "text-white font-medium" : "text-gray-700"}`}>
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

          <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-3">
            <TouchableOpacity
              className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
              onPress={() => {
                const currentStorageData = {
                  location,
                  neighborhoodArea,
                  plotArea,
                  unit,
                  length,
                  breadth,
                  washroomType,
                  ceilingHeight,
                  flooring,
                  ventilation,
                  temperatureControl,
                  covered,
                  security,
                  accessibility,
                  availability,
                  ageOfProperty,
                  possessionBy,
                  storageType: baseDetails?.storageType,
                };

                router.push({
                  pathname: "/home/screens/UploadScreens/CommercialUpload",
                  params: {
                    storageDetails: JSON.stringify(currentStorageData),
                    images: JSON.stringify(images),
                    area: neighborhoodArea,
                    propertyTitle: baseDetails?.propertyTitle,
                     storageType: baseDetails?.storageType || currentStorageData.storageType, // ✅ ADD THIS
                    commercialBaseDetails: JSON.stringify({
                      subType: "Storage",
                      storageType: baseDetails?.storageType,
                      propertyTitle: baseDetails?.propertyTitle,
                    }),
                  },
                });
              }}
            >
              <Text className="font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-5 py-3 rounded-lg bg-green-500"
              onPress={handleNext}
            >
              <Text className="text-white font-semibold">Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}