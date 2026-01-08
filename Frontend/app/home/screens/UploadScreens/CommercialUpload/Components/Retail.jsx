//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/Retail.jsx

import React, { useState,useEffect } from "react";
//import Toast from "react-native-toast-message"; // ✅ ADD THIS
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter,useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LocationSection from "components/LocationSection";
import Toast from "react-native-toast-message";
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

  const [locatedInside, setLocatedInside] = useState("");
const [zoneType, setZoneType] = useState("");
  const [location, setLocation] = useState("");
  const [locality, setLocality] = useState("");
 const [neighborhoodArea, setNeighborhoodArea] = useState(""); // ✅ RENAMED from 'area'
const [carpetArea, setCarpetArea] = useState(""); // ✅ NEW - Actual sqft value
  const [unit, setUnit] = useState("sqft");
  const [propertyAge, setPropertyAge] = useState("");

  const [visible, setVisible] = useState(null);

  const [entranceWidth, setEntranceWidth] = useState("");
  const [ceilingHeight, setCeilingHeight] = useState("");

  const [washroom, setWashroom] = useState("");
  const [floorDetails, setFloorDetails] = useState("");
  const [locatedNear, setLocatedNear] = useState([]);
  const [parkingType, setParkingType] = useState("");
  const [availability, setAvailability] = useState("");

  const [possessionYear, setPossessionYear] = useState("");
  const [possessionMonth, setPossessionMonth] = useState("");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const [businessTypes, setBusinessTypes] = useState([]);
  const [showBusinessTypes, setShowBusinessTypes] = useState(false);


  // ✅ NEW - Load draft from AsyncStorage on mount
useEffect(() => {
  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem('draft_retail_details');
      if (draft) {
        const parsed = JSON.parse(draft);
        console.log('📦 Loading Retail draft from AsyncStorage:', parsed);
        
        // ✅ FIX: Restore location and locality first
        setLocation(parsed.location || '');
        setLocality(parsed.locality || '');
        setNeighborhoodArea(parsed.neighborhoodArea || params.area || '');
        setCarpetArea(parsed.carpetArea?.toString() || '');
        setUnit(parsed.carpetAreaUnit || 'sqft');
        
        // ✅ ADD: Restore missing fields
        setLocatedInside(parsed.locatedInside || '');
setZoneType(parsed.zoneType || '');

// ✅ ADD THIS - Restore retailKind to params for proper flow
if (parsed.retailKind && !params.commercialBaseDetails) {
  // Store it so index.jsx can restore it
  console.log('✅ Restoring retailKind from draft:', parsed.retailKind);
}

setEntranceWidth(parsed.entranceWidth?.toString() || '');
        setCeilingHeight(parsed.ceilingHeight?.toString() || '');
        setWashroom(parsed.washroom || '');
        setFloorDetails(parsed.floorDetails || '');
        setLocatedNear(parsed.locatedNear || []);
        setParkingType(parsed.parkingType || '');
        setAvailability(parsed.availability || '');
        setPropertyAge(parsed.propertyAge || '');
        
        if (parsed.possession) {
          setPossessionYear(parsed.possession.year || '');
          setPossessionMonth(parsed.possession.month || '');
          if (parsed.possession.year) setShowMonthDropdown(true);
        }
        
        if (parsed.suitableFor) setBusinessTypes(parsed.suitableFor);
        
        console.log('✅ Retail draft loaded successfully');
        return;
      }
    } catch (e) {
      console.log('⚠️ Failed to load Retail draft:', e);
    }

    // ✅ FALLBACK: Load from params if no draft
  // ✅ FALLBACK: Load from params if no draft
if (params.retailDetails) {
  try {
    const prevData = JSON.parse(params.retailDetails);
    console.log('🔄 Restoring Retail data from params');
    
    setLocation(prevData.location || '');
    setLocality(prevData.locality || '');
    setNeighborhoodArea(prevData.neighborhoodArea || params.area || '');
    setCarpetArea(prevData.carpetArea?.toString() || '');
    setUnit(prevData.carpetAreaUnit || 'sqft');
    
    setLocatedInside(prevData.locatedInside || '');
    setZoneType(prevData.zoneType || '');
    
    setEntranceWidth(prevData.entranceWidth?.toString() || '');
    setCeilingHeight(prevData.ceilingHeight?.toString() || '');
    setWashroom(prevData.washroom || '');
    setFloorDetails(prevData.floorDetails || '');
    setLocatedNear(prevData.locatedNear || []);
    setParkingType(prevData.parkingType || '');
    setAvailability(prevData.availability || '');
    setPropertyAge(prevData.propertyAge || '');
    
    if (prevData.possession) {
      setPossessionYear(prevData.possession.year || '');
      setPossessionMonth(prevData.possession.month || '');
      if (prevData.possession.year) setShowMonthDropdown(true);
    }
    
    if (prevData.suitableFor) setBusinessTypes(prevData.suitableFor);
      } catch (e) {
        console.log('❌ Could not restore retail data:', e);
      }
    }
    
    // ✅ FIX: Always restore area from params if available
    if (params.area) {
      setNeighborhoodArea(params.area);
      console.log('✅ Area restored from params:', params.area);
    }
  };

  loadDraft();
}, [params.retailDetails, params.area]);

// ✅ NEW - Auto-save draft to AsyncStorage
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
  retailKind: baseDetails?.retailType, // ✅ ADD THIS
  
  entranceWidth,
  ceilingHeight,
  washroom,
  floorDetails,
  locatedNear,
  parkingType,
  availability,
  propertyAge,
  possession: {
    year: possessionYear,
    month: possessionMonth,
  },
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
    parkingType, availability, propertyAge, possessionYear, possessionMonth, 
    businessTypes, baseDetails?.retailType]); // ✅ ADD baseDetails.retailType

  /* ---------- OPTIONS ---------- */
  const washroomOptions = [
    "+Private Washrooms",
    "+Public Washrooms",
    "Not Available",
  ];
  const locatedNearOptions = ["+Entrance", "+Elevator", "+Stairs"];
  const parkingOptions = [
    "+Private Parking",
    "+Public Parking",
    "+Multilevel Parking",
    "Not Available",
  ];
  const availabilityOptions = ["Ready to move", "Under Construction"];

  const businessTypeOptions = [
    "ATM",
    "Bakery",
    "Boutique",
    "Clinic",
    "Clothes",
    "Cloud Kitchen",
    "Coffee",
    "Fast Food",
    "Footwear",
    "Grocery",
    "Gym",
    "Jewellery",
    "Medical",
    "Mobile",
    "Restaurant",
    "Salon/Spa",
    "Sweet Shop",
    "Other",
  ];
  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const toggleArray = (val, arr, setArr) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };
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
const handleRetailNext = () => {
  if (!location.trim()) {
    Toast.show({
      type: "error",
      text1: "Location required",
    });
    return;
  }

  if (!neighborhoodArea.trim()) {
    Toast.show({
      type: "error",
      text1: "Area/Neighborhood required",
    });
    return;
  }

  if (!carpetArea.trim()) {
    Toast.show({
      type: "error",
      text1: "Carpet Area required",
    });
    return;
  }

 const commercialDetails = {
    subType: "Retail",
    propertyTitle: baseDetails?.propertyTitle,
    retailDetails: {
      location,
      locality,
      
      // ✅ ADD MISSING FIELDS
      locatedInside,
      zoneType,
      
      neighborhoodArea: neighborhoodArea.trim(),
      carpetArea: carpetArea ? Number(carpetArea) : undefined,
      carpetAreaUnit: unit, // ✅ CHANGED from hardcoded "sqft"
      
      entranceWidth: entranceWidth ? Number(entranceWidth) : undefined,
      ceilingHeight: ceilingHeight ? Number(ceilingHeight) : undefined,
      washroom,
      floorDetails,
      locatedNear,
      parkingType,
      availability,
      propertyAge,
      possession:
        availability === "Under Construction"
          ? { year: possessionYear, month: possessionMonth }
          : undefined,
      suitableFor: businessTypes,
    },
  };

  router.push({
    pathname: "/home/screens/UploadScreens/CommercialUpload/Components/RetailNext",
    params: {
      commercialDetails: JSON.stringify(commercialDetails),
      propertyTitle: baseDetails?.propertyTitle,
      images: JSON.stringify(images),
      area: neighborhoodArea.trim(), // ✅ PASS FOR PERSISTENCE
    },
  });
};



  /* ---------- UI ---------- */
  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View className="flex-row items-center mt-7 mb-4">
        <TouchableOpacity
  onPress={() => {
    // Save current state before going back
    const currentData = {
      location,
      locality,
      neighborhoodArea,
      carpetArea,
      entranceWidth,
      ceilingHeight,
      washroom,
      floorDetails,
      locatedNear,
      parkingType,
      availability,
      propertyAge,
      possession: {
        year: possessionYear,
        month: possessionMonth,
      },
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
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* LOCATION */}
       {/* LOCATION */}
        <LocationSection
          location={location}
          setLocation={setLocation}
          locality={locality}
          setLocality={setLocality}
        />

        {/* ✅ ADD THESE MISSING DROPDOWNS */}
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
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 }}>
            Located Inside
          </Text>
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
            <Text>{locatedInside || "Select Located Inside"}</Text>
            <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          {visible === "locatedInside" && (
            <View style={{ marginTop: 8 }}>
              {["Mall", "Commercial Project", "Residential Project", "Retail Complex / Building", "Market / High Street"].map((item) => (
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

          <Text style={{ fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6, marginTop: 12 }}>
            Zone Type
          </Text>
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
            <Text>{zoneType || "Select Zone Type"}</Text>
            <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          {visible === "zoneType" && (
            <View style={{ marginTop: 8 }}>
              {["Commercial", "Residential", "Transport and Communication", "Public and Semi Public use", "open spaces", "Agricultural zone", "Special Economic zone", "Natural Conservation zone", "Government use", "Other"].map((item) => (
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

        {/* AREA */}
        {/* ================= WHITE CARD START ================= */}
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
          {/* ✅ NEIGHBORHOOD AREA FIELD (LIKE OFFICE.jsx) */}
<Text style={sectionLabel}>
  Area/Neighborhood<Text className="text-red-500">*</Text>
</Text>
<View
  className="flex-row items-center rounded-md p-3 mb-3"
  style={{
    borderWidth: 1,
    borderColor: "#0000001A",
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
    className="flex-1"
  />
</View>

{/* ✅ CARPET AREA IN SQFT (SEPARATE FIELD) */}
<Text style={sectionLabel}>
  Carpet Area (sqft)<Text className="text-red-500">*</Text>
</Text>

<View style={inputWithUnit}>
  <TextInput
    placeholder="Enter Carpet Area"
    value={carpetArea}
    onChangeText={(text) => setCarpetArea(text.replace(/[^0-9]/g, ""))}
    keyboardType="numeric"
    style={inputText}
  />

  <View style={divider} />

  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={unitText}>sqft</Text>
    <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
  </View>
</View>
          <Text style={sectionLabel}>Shop facade size (optional)</Text>

          <View style={inputWithUnit}>
            <TextInput
              placeholder="Entrance width"
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
              placeholder="Ceiling Height"
              value={ceilingHeight}
              onChangeText={setCeilingHeight}
              keyboardType="numeric"
              style={inputText}
            />
            <View style={divider} />
            <Text style={unitText}>ft</Text>
          </View>

          <Text style={sectionLabel}>Washroom details</Text>
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

          <Text style={sectionLabel}>Floor Details (Optional)</Text>
          <TextInput
            placeholder="Total Floors"
            value={floorDetails}
            onChangeText={setFloorDetails}
            style={plainInput}
          />

          {/* LOCATED NEAR */}
          <Text style={sectionLabel}>Located Near (optional)</Text>
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
          <Text style={sectionLabel}>Parking Type</Text>
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
          <Text style={sectionLabel}>Availability Status</Text>
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

          {availability === "Ready to move" && (
            <>
              <Text style={sectionLabel}>Age of property</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map(
                  (o) => (
                    <PillButton
                      key={o}
                      label={o}
                      selected={propertyAge === o}
                      onPress={() => setPropertyAge(o)}
                    />
                  )
                )}
              </View>
            </>
          )}
          {availability === "Under Construction" && (
            <>
              <Text style={sectionLabel}>Possession By</Text>

              {/* YEAR INPUT */}
              <TextInput
                placeholder="Year"
                value={possessionYear}
                onChangeText={(text) => {
                  const numeric = text.replace(/[^0-9]/g, "").slice(0, 4);
                  setPossessionYear(numeric);

                  if (numeric.length === 4) {
                    setShowMonthDropdown(true);
                  } else {
                    setShowMonthDropdown(false);
                    setPossessionMonth("");
                  }
                }}
                keyboardType="numeric"
                style={plainInput}
              />

              {/* MONTH DROPDOWN */}
              {showMonthDropdown && (
                <>
                  <TouchableOpacity
                    style={dropdownBox}
                    onPress={() => setShowMonthDropdown(!showMonthDropdown)}
                  >
                    <Text>{possessionMonth || "Month"}</Text>
                    <Ionicons name="chevron-down" size={18} />
                  </TouchableOpacity>

                  <View style={{ marginTop: 6 }}>
                    {monthOptions.map((month) => (
                      <TouchableOpacity
                        key={month}
                        onPress={() => {
                          setPossessionMonth(month);
                          setShowMonthDropdown(false);
                        }}
                        style={{
                          paddingVertical: 10,
                          borderBottomWidth: 1,
                          borderColor: "#E5E7EB",
                        }}
                      >
                        <Text>{month}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </>
          )}

          {/* BUSINESS TYPE */}
          <Text style={sectionLabel}>Suitable for business types</Text>

          <TouchableOpacity
            onPress={() => setShowBusinessTypes(!showBusinessTypes)}
            style={dropdownBox}
          >
            <Text>
              {businessTypes.length > 0
                ? `${businessTypes.length} selected`
                : "Select business type"}
            </Text>
            <Ionicons name="chevron-down" size={18} />
          </TouchableOpacity>
          {showBusinessTypes &&
            businessTypeOptions.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() =>
                  toggleArray(item, businessTypes, setBusinessTypes)
                }
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
  onPress={() => {
    const currentData = {
      location,
      locality,
      neighborhoodArea,
      carpetArea,
      entranceWidth,
      ceilingHeight,
      washroom,
      floorDetails,
      locatedNear,
      parkingType,
      availability,
      propertyAge,
      possession: {
        year: possessionYear,
        month: possessionMonth,
      },
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
  }}
  style={{
    marginRight: 10,
    backgroundColor: "#E5E7EB",
    padding: 14,
    alignItems: "center",
  }}
  className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
>
  <Text>Cancel</Text>
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
          <Text style={{ color: "#fff", fontWeight: "600" }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
