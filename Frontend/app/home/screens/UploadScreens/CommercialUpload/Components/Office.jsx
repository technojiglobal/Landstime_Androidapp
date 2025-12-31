import React, { useState } from 'react';
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
      className={`w-5 h-5 rounded items-center justify-center ${checked ? "bg-green-500" : "border border-gray-300"
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
    <Text className={`text-sm ${selected ? "text-green-700 font-semibold" : "text-[rgba(0,0,0,0.6)]"}`}>
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
      className="w-7 h-7 rounded-full border   border-gray-300 items-center justify-center"
    >
      <Text>+</Text>
    </TouchableOpacity>
  </View>
);




export default function PropertyFormScreen() {
  const params = useLocalSearchParams();

const baseDetails = params.commercialBaseDetails
  ? JSON.parse(params.commercialBaseDetails)
  : null;

// ✅ office type from previous screen
const officeKindFromBase = baseDetails?.subType;

  // Basic Details

  const [visible, setVisible] = useState(null);
  const [focusedField, setFocusedField] = useState(null);



  


  // Location
  const [location, setLocation] = useState('');
  const [locatedInside, setLocatedInside] = useState('');
  const [zoneType, setZoneType] = useState('');
  //const [possessionBy, setPossessionBy] = useState("");

  // Area / Setup
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('sqft');

  const [carpetArea, setCarpetArea] = useState('');
  const [cabins, setCabins] = useState('');
  const [meetingRooms, setMeetingRooms] = useState('');
  const [seats, setSeats] = useState('');
  const [maxSeats, setMaxSeats] = useState("")
  const [showMaxSeats, setShowMaxSeats] = useState(false);
  // Features
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

  const [carpetUnit, setCarpetUnit] = useState('sqft');

  // checkboxes and pills
  const [additionalFeatures, setAdditionalFeatures] = useState([]);
  const [fireMeasures, setFireMeasures] = useState([]);
  const fireOptions = ['Fire Extinguisher', 'Fire Sensors', 'Sprinklers', 'Fire Hose'];

  // Floor / stairs / lifts
  const [totalFloors, setTotalFloors] = useState('');
  const [floorNo, setFloorNo] = useState('');
  const [stairCase, setStairCase] = useState(null);
  const stairOptions = ['1', '2', '3', '4+'];


  // Parking / Availability / Ownership
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

  const ownershipOptions = ['Freehold', 'Leasehold', 'Company Owned', 'Other'];
  const [ownership, setOwnership] = useState('');

  // Price and other

  const router = useRouter();
  ;

  // helpers
  const toggleArrayItem = (arrSetter, arr, value) => {
    if (arr.includes(value)) arrSetter(arr.filter((a) => a !== value));
    else arrSetter([...arr, value]);
  };
  const handleNext = () => {
     if (!officeKindFromBase) {
  Toast.show({
    type: "error",
    text1: "Office type missing",
    text2: "Please go back and select office type",
  });
  return;
}

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

  const officeDetails = {
   officeKind: officeKindFromBase,

    location,
    locatedInside,
    zoneType,

    area: Number(area),
    areaUnit: unit,

    carpetArea: carpetArea ? Number(carpetArea) : undefined,
    carpetAreaUnit: carpetUnit,

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

    additionalFeatures: [
      features.centralAC && "Central AC",
      features.oxygenDuct && "Oxygen Duct",
      features.ups && "UPS",
    ].filter(Boolean),

    fireSafetyMeasures: fireMeasures,

    totalFloors: totalFloors ? Number(totalFloors) : undefined,
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
    pathname:
      "/home/screens/UploadScreens/CommercialUpload/Components/OfficeNext",
    params: {
      officeDetails: JSON.stringify(officeDetails),
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





        {/* Location */}
        <View
          className="bg-white rounded-lg p-4 mb-4"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="text-[15px] text-[#00000060] mb-3">Location<Text className="text-red-500">*</Text></Text>
          <View
            className="flex-row items-center rounded-md p-3 mb-5"
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
          {/* Possession */}

          <TouchableOpacity
            onPress={() => setVisible(visible === "locatedInside" ? null : "locatedInside")}
            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
          >
            <Text className="text-gray-800 text-left">
              {locatedInside || "Located Inside"}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#888" />
          </TouchableOpacity>
          {visible === "locatedInside" && (
            <View
              className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
              style={{ borderWidth: 1, borderColor: "#0000001A" }}
            >
              {[
                "IT park",
                "Business Park",
                "Other",
              ].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setLocatedInside(item);
                    setVisible(null);
                  }}
                  className={`p-4 border-b border-gray-200 ${locatedInside === item ? "bg-green-500" : "bg-white"
                    }`}
                >
                  <Text className={`${locatedInside === item ? "text-white" : "text-gray-800"}`}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}

            </View>
          )}
          {/* Possession */}

          <TouchableOpacity
            onPress={() => setVisible(visible === "zoneType" ? null : "zoneType")}
            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
          >
            <Text className="text-gray-800 text-left">
              {zoneType || "zoneType"}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#888" />
          </TouchableOpacity>
          {visible === "zoneType" && (
            <View
              className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
              style={{ borderWidth: 1, borderColor: "#0000001A" }}
            >
              {[
                "Commercial",
                "Residential",
                "Transport and Communication",
                "Public and Semi Public use",
                "open spaces",
                "Agricultural zone",
                "Special Economic zone",
                "Natural Conservation zone",
                "Government use",
                "Other",
              ].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setZoneType(item);
                    setVisible(null);
                  }}
                  className={`p-4 border-b border-gray-200 ${zoneType === item ? "bg-green-500" : "bg-white"}`}
                >
                  <Text className={`${zoneType === item ? "text-white" : "text-gray-800"}`}>
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
            Area<Text className="text-red-500">*</Text>
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
              value={area}
              onChangeText={(text) => setArea(text.replace(/[^0-9]/g, ""))}
              className="flex-1 px-3"
              onFocus={() => setFocusedField("area")}
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

          <Text className="text-[15px]  font-bold text-[#00000099] mb-2">Describe your office setup</Text>
          <TextInput placeholder="No.of Cabins" value={cabins} onChangeText={(text) => setCabins(text.replace(/[^0-9]/g, ""))} className=" flex-1 mb-3 rounded-md p-3"

            onFocus={() => setFocusedField("cabins")}
            onBlur={() => setFocusedField(null)}
            style={{
              height: 50, backgroundColor: "#D9D9D91C", borderWidth: 1,
              borderColor: focusedField === "cabins" ? "#22C55E" : "#0000001A",
            }} keyboardType="numeric" />


          <TextInput placeholder="No.of Meeting Rooms" value={meetingRooms} onChangeText={(text) => setMeetingRooms(text.replace(/[^0-9]/g, ""))}
            className=" flex-1 mb-3 rounded-md p-3"
            onFocus={() => setFocusedField("meeting")}
            onBlur={() => setFocusedField(null)}
            style={{
              height: 50, backgroundColor: "#D9D9D91C", borderWidth: 1,
              borderColor: focusedField === "meeting" ? "#22C55E" : "#0000001A",
            }} keyboardType="numeric" />
          <TextInput placeholder="No.of Seats(min)" value={seats} onChangeText={(text) => setSeats(text.replace(/[^0-9]/g, ""))}
            className=" flex-1 mb-3 rounded-md p-3"
            onFocus={() => setFocusedField("seats")}
            onBlur={() => setFocusedField(null)}
            style={{
              height: 50, backgroundColor: "#D9D9D91C", borderWidth: 1,
              borderColor: focusedField === "seats" ? "#22C55E" : "#0000001A",
            }} keyboardType="numeric" />
          <TouchableOpacity
            className="mb-2"
            onPress={() => setShowMaxSeats(true)}
          >
            <Text className="text-sm font-bold text-green-500">
              + Add max seats
            </Text>
          </TouchableOpacity>

          {/* Conditionally Render Input */}
          {showMaxSeats && (
            <TextInput
              placeholder="Max No. of Seats"
              value={maxSeats}
              onChangeText={(text) => setMaxSeats(text.replace(/[^0-9]/g, ""))}
              className=" flex-1 mb-3 rounded-md p-3"
              onFocus={() => setFocusedField("maxseats")}
              onBlur={() => setFocusedField(null)}
              style={{
                height: 50, backgroundColor: "#D9D9D91C", borderWidth: 1,
                borderColor: focusedField === "maxseats" ? "#22C55E" : "#0000001A",
              }}
              keyboardType="numeric"
            />
          )}
          <Text className="text-base font-bold mb-1">
            Mark the available features
          </Text>
          <Text className="text-xs text-gray-400 mb-4">
            Select the facilities in your office space
          </Text>

          {/* ---------- CONFERENCE ROOM ---------- */}
          <FeatureCheckbox
            label="Conference Room"
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
            label="Wash Room"
            checked={features.washRoom}
            onToggle={() => toggleFeature("washRoom")}
          />

          {features.washRoom && (
            <View className="mb-4">
              <Text className="text-xs text-gray-500 mb-2">
                Public Washrooms
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
                Private Washrooms
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
            label="Reception Area"
            checked={features.reception}
            onToggle={() => toggleFeature("reception")}
          />

          {/* ---------- PANTRY ---------- */}
          <FeatureCheckbox
            label="Pantry"
            checked={features.pantry}
            onToggle={() => toggleFeature("pantry")}
          />

          {features.pantry && (
            <View className="mb-4">
              <View className="flex-row mb-2">
                {["Private", "Shared"].map((type) => (
                  <PillButton
                    key={type}
                    label={type}
                    selected={pantryType === type}
                    onPress={() => setPantryType(type)}
                  />
                ))}
              </View>

              <TextInput
                placeholder="Pantry Size (Optional)"
                value={pantrySize}
                onChangeText={(text) => setPantrySize(text.replace(/[^0-9]/g, ""))}
                className=" flex-1 mb-3 rounded-md p-3"
                onFocus={() => setFocusedField("pantry")}
                onBlur={() => setFocusedField(null)}
                style={{
                  height: 50, backgroundColor: "#D9D9D91C", borderWidth: 1,
                  borderColor: focusedField === "pantry" ? "#22C55E" : "#0000001A",
                }}
                keyboardType="numeric"
              />
            </View>
          )}

          {/* ---------- SIMPLE TOGGLES ---------- */}
          <FeatureCheckbox
            label="Furnishing"
            checked={features.furnishing}
            onToggle={() => toggleFeature("furnishing")}
          />
          <FeatureCheckbox
            label="Central AC"
            checked={features.centralAC}
            onToggle={() => toggleFeature("centralAC")}
          />
          <FeatureCheckbox
            label="Oxygen Duct"
            checked={features.oxygenDuct}
            onToggle={() => toggleFeature("oxygenDuct")}
          />
          <FeatureCheckbox
            label="UPS"
            checked={features.ups}
            onToggle={() => toggleFeature("ups")}
          />





          <Text className="text-[15px] font-bold text-[#00000099] mb-2">Fire safety measures include (optional)</Text>
          <View className="flex-row flex-wrap mb-4">
            {fireOptions.map((f) => (
              <PillButton
                key={f}
                label={f}
                selected={fireMeasures.includes(f)}
                onPress={() => toggleArrayItem(setFireMeasures, fireMeasures, f)}
              />
            ))}
          </View>

          <Text className="text-[15px] font-bold text-[#00000099] mb-2">Floor Details</Text>
          <TextInput placeholder="Total floors" value={totalFloors} onChangeText={(text) => setTotalFloors(text.replace(/[^0-9]/g, ""))}
            onFocus={() => setFocusedField("totalfloors")}
            onBlur={() => setFocusedField(null)}
            className="rounded-lg px-3 mb-3"
            style={{
              borderWidth: 1,
              borderColor: focusedField === "totalfloors" ? "#22C55E" : "#0000001A",
            }} keyboardType="numeric" />
            <TextInput placeholder="Your floor No" value={floorNo} onChangeText={(text) => setFloorNo(text.replace(/[^0-9]/g, ""))} className=" flex-1 mb-3 rounded-md p-3"

            onFocus={() => setFocusedField("cabins")}
            onBlur={() => setFocusedField(null)}
            style={{
              height: 50, backgroundColor: "#D9D9D91C", borderWidth: 1,
              borderColor: focusedField === "cabins" ? "#22C55E" : "#0000001A",
            }} keyboardType="numeric" />

          <Text className="text-[15px] font-bold text-[#00000099] mb-2">No.of stair cases (optional)</Text>
          <View className="flex-row mb-4">
            {stairOptions.map((s) => (
              <RoundOption key={s} label={s} selected={stairCase === s} onPress={() => setStairCase(s)} />
            ))}
          </View>

          <Text className="text-[15px] font-bold text-[#00000099] mb-2">Lifts</Text>
          <View className="flex-row mb-3">
            <PillButton
              label="Available"
              selected={lift === "Available"}
              onPress={() => setLift("Available")}
            />
            <PillButton
              label="Not-Available"
              selected={lift === "Not-Available"}
              onPress={() => setLift("Not-Available")}
            />
          </View>

          {lift === "Available" && (
            <View className="mb-4">
              <View className="flex-row justify-between mb-3">
                <Text className="text-sm text-gray-600">Passenger Lifts</Text>
                <Counter value={passengerLifts} setValue={setPassengerLifts} />
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Service Lifts</Text>
                <Counter value={serviceLifts} setValue={setServiceLifts} />
              </View>
            </View>
          )}


          <Text className="text-[15px] text-[#00000099] font-bold mb-2">Parking</Text>
          <View className="flex-row mb-3">
            <PillButton
              label="Available"
              selected={parking === "Available"}
              onPress={() => setParking("Available")}
            />
            <PillButton
              label="Not-Available"
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
                    className={`w-4 h-4 mr-2 border border-gray-300 rounded ${parkingOptions[key] ? "bg-green-500" : ""
                      }`}
                  />
                  <Text className="text-xs text-gray-600">
                    {key === "basement" && "Private Parking in Basement"}
                    {key === "outside" && "Private Parking Outside"}
                    {key === "private" && "Private Parking"}
                  </Text>
                </TouchableOpacity>
              ))}

              <TextInput
                placeholder="No. of Parking (Optional)"
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




          <Text className="text-[15px] text-[#00000099] font-bold mb-2">Ownership</Text>
          <View className="flex-row flex-wrap mb-4">
            {ownershipOptions.map((o) => (
              <PillButton key={o} label={o} selected={ownership === o} onPress={() => setOwnership(o)} />
            ))}
          </View>
          <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-3">
            <TouchableOpacity
              className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
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