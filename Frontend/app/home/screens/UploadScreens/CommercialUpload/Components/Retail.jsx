import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,Image
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LocationSection from "components/LocationSection";
import Toast from 'react-native-toast-message';
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

  /* ---------- STATE ---------- */
  const [location, setLocation] = useState("");
  const [locality, setLocality] = useState("");
  const [area, setArea] = useState("");
  const [unit, setUnit] = useState("sqft");
  const [propertyAge, setPropertyAge] = useState("");

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

  /* ---------- OPTIONS ---------- */
  const washroomOptions = ["+Private Washrooms", "+Public Washrooms", "Not Available"];
  const locatedNearOptions = ["+Entrance", "+Elevator", "+Stairs"];
  const parkingOptions = ["+Private Parking", "+Public Parking", "+Multilevel Parking", "Not Available"];
  const availabilityOptions = ["Ready to move", "Under Construction"];

  const businessTypeOptions = [
    "ATM","Bakery","Boutique","Clinic","Clothes","Cloud Kitchen",
    "Coffee","Fast Food","Footwear","Grocery","Gym","Jewellery",
    "Medical","Mobile","Restaurant","Salon/Spa","Sweet Shop","Other"
  ];
  const monthOptions = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

  const toggleArray = (val, arr, setArr) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
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
const handleRetailNext = (location, area, router) => {
  if (!location.trim()) {
    Toast.show({
      type: "error",
      text1: "Location Required",
      text2: "Please enter the property location.",
    });
    return;
  }

  if (!area.trim()) {
    Toast.show({
      type: "error",
      text1: "Area Required",
      text2: "Please enter the area.",
    });
    return;
  }

  router.push(
    "/home/screens/UploadScreens/CommercialUpload/Components/RetailNext"
  );
};

  /* ---------- UI ---------- */
  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View className="flex-row items-center mt-7 mb-4">
             <TouchableOpacity
               onPress={() =>
                 router.push("/home/screens/UploadScreens/AddScreen")
               }
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
        <LocationSection
          location={location}
          setLocation={setLocation}
          locality={locality}
          setLocality={setLocality}
        />

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

     <Text style={sectionLabel}>Area (sqft)<Text className="text-red-500">*</Text></Text>

<View style={inputWithUnit}>
  <TextInput
    placeholder="Carpet Area"
    value={area}
    onChangeText={setArea}
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
  {washroomOptions.map(o => (
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
  {locatedNearOptions.map(o => (
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
  {parkingOptions.map(o => (
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
  {availabilityOptions.map(o => (
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
      {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map(o => (
        <PillButton
          key={o}
          label={o}
          selected={propertyAge === o}
          onPress={() => setPropertyAge(o)}
        />
      ))}
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
          <Text>
            {possessionMonth || "Month"}
          </Text>
          <Ionicons name="chevron-down" size={18} />
        </TouchableOpacity>

        <View style={{ marginTop: 6 }}>
          {monthOptions.map(month => (
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
          businessTypeOptions.map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => toggleArray(item, businessTypes, setBusinessTypes)}
              style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
            >
              <Checkbox selected={businessTypes.includes(item)} />
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
</View>

        
      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View style={{ flexDirection: "row", padding: 16, backgroundColor: "#fff" }}
      className="mb-8 justify-end mt-4 space-x-5 mx-3"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{  marginRight: 10, backgroundColor: "#E5E7EB", padding: 14, alignItems: "center" }}
          className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
        >
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            handleRetailNext(location, area, router)}
          style={{  backgroundColor: "#22C55E", padding: 14, alignItems: "center" }}
          className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
