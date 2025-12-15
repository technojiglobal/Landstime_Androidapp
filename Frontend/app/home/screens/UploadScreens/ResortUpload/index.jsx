import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  Alert,StatusBar
} from 'react-native';
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import TopAlert from "../TopAlert";

// Pill Button Component
const PillButton = ({ label, selected, onPress }) => (
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

// Checkbox Component
const Checkbox = ({ label, selected, onPress }) => (
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

// Round Option Component
const RoundOption = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="w-8 h-8 rounded-full items-center mx-2 justify-center"
    style={{ borderWidth: 1, borderColor: selected ? '#22C55E' : '#0000001A', backgroundColor: selected ? '#22C55E17' : 'transparent' }}
  >
    <Text style={{ fontSize: 12, fontWeight: selected ? '600' : '400', color: selected ? '#22C55E' : 'rgba(0,0,0,0.6)' }}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function PropertyFormScreen() {
  const router = useRouter();

  // State variables
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState('Commercial');
  const [visible, setVisible] = useState(null);

  const [selectedTypes, setSelectedTypes] = useState(['Office']);
  const typePills = ['Office', 'Retail', 'Plot/Land', 'Storage', 'Industry', 'Hospitality', 'Other'];

  
  const officeKindPills = ['Ready to move office space', 'Bare shell office space', 'Co-working office space'];
const [selectedType, setSelectedType] = useState("Office"); // Only one selected
const [officeKinds, setOfficeKinds] = useState(['Ready to move office space']);
const [retailKinds, setRetailKinds] = useState([]);
const [plotKinds, setPlotKinds] = useState([]);
  const [location, setLocation] = useState('');
  const [locatedInside, setLocatedInside] = useState('');
  const [zoneType, setZoneType] = useState('');

  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('sqft');
  const [carpetArea, setCarpetArea] = useState('');
  const [carpetUnit, setCarpetUnit] = useState('sqft');

  const [cabins, setCabins] = useState('');
  const [meetingRooms, setMeetingRooms] = useState('');
  const [seats, setSeats] = useState('');

  const [conferenceSelected, setConferenceSelected] = useState(null);
  const conferenceOptions = ['1', '2', '3', '4+'];

  const [publicWashroom, setPublicWashroom] = useState(null);
  const [privateWashroom, setPrivateWashroom] = useState(null);
  const [receptionArea, setReceptionArea] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [washroomType, setWashroomType] = useState(null);

  const [additionalFeatures, setAdditionalFeatures] = useState([]);
  const [fireMeasures, setFireMeasures] = useState([]);
  const fireOptions = ['Fire Extinguisher', 'Fire Sensors', 'Sprinklers', 'Fire Hose'];

  const [totalFloors, setTotalFloors] = useState('');
  const [stairCase, setStairCase] = useState(null);
  const stairOptions = ['1', '2', '3', '4+'];
  const [lift, setLift] = useState('');

  const [parking, setParking] = useState('');
  const [availability, setAvailability] = useState('');
  const ownershipOptions = ['Freehold', 'Leasehold', 'Company Owned', 'Other'];
  const [ownership, setOwnership] = useState('');

  const [expectedPrice, setExpectedPrice] = useState('');
  const [allInclusive, setAllInclusive] = useState(false);
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [taxExcluded, setTaxExcluded] = useState(false);
  const [preLeased, setPreLeased] = useState(null);
  const [nocCertified, setNocCertified] = useState(null);
  const [occupancyCertified, setOccupancyCertified] = useState(null);
  const [prevUsedFor, setPrevUsedFor] = useState('Commercial');
  const prevUsedForOptions = ['Commercial', 'Residential', 'Warehouse'];

  const [describeProperty, setDescribeProperty] = useState('');
  const amenityOptions = ['+Maintenance Staff','+Water Storage','+Water Disposal','+ATM','+Shopping Center','+Wheelchair Accessibility','+Cafeteria/Foodcourt','+DG Availability','+CCTV Surveillance','+Grocery shop','+Visitor Parking','+Power Backup','+Lift(s)'];
  const [amenities, setAmenities] = useState([]);
  const locationAdvantages = ['+Close to Metro Station','+Close to School','+Close to Hospital','+Close to Market','+Close to Railway Station','+Close to Airport','+Close to Mall','+Close to Highway'];
  const [locAdvantages, setLocAdvantages] = useState([]);

  const [image, setImage] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);

  const toggleArrayItem = (setter, array, value) => {
    if (array.includes(value)) setter(array.filter(item => item !== value));
    else setter([...array, value]);
  };

  const openCamera = async () => {
    let permission = await ImagePicker.getCameraPermissionsAsync();

    if (permission.status !== "granted") {
      permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "You need to grant camera permissions to use this feature. Please go to your device settings and enable them for this app."
        );
        return;
      }
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <TopAlert visible={alertVisible} onHide={() => setAlertVisible(false)} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 36 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center mt-7 mb-4">
          <TouchableOpacity
            onPress={() => router.push("/home/screens/UploadScreens/AddScreen")}
            className="p-2"
          >
            <Image source={require("../../../../../assets/arrow.png")} style={{ width: 20, height: 20, resizeMode: "contain" }} />
          </TouchableOpacity>
          <View className="ml-2">
            <Text className="text-[16px] font-semibold">Upload Your Property</Text>
            <Text className="text-[12px] text-[#00000066]">Add your property details</Text>
          </View>
        </View>

        {/* Property Photos */}
        <View className="bg-white rounded-lg p-4 mb-4" style={{ borderWidth: 1, borderColor: "#0000001A" }}>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-[15px] font-bold">Property Details</Text>
            <TouchableOpacity><Text className="text-[11px] text-[#22C55E]">View Guidelines</Text></TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={openCamera}
            className="border-2 border-dashed border-gray-300 rounded-xl mt-4 p-6 items-center mb-5"
          >
            <Ionicons name="camera-outline" size={40} color="#888" />
            <Text className="text-gray-500 mt-2 text-left">Add Photos or Videos</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} className="w-full h-48 -mt-2 mb-2 rounded-lg" />}
        </View>

            <View
                  className="bg-white rounded-lg p-4 mb-4"
                  style={{ borderWidth: 1, borderColor: "#0000001A" }}
                >
                  <Text className="text-[16px] font-bold mb-5">Basic Details</Text>
        
                  <Text className="text-[15px] text-[#00000099]  font-bold mb-2">Property Title</Text>
                  <TextInput
                    placeholder="Surya Teja Apartments"
                    value={title}
                    onChangeText={setTitle}
                    className="rounded-md p-3 mb-3"
                    style={{ borderWidth: 1, borderColor: "#0000001A", height: 50, backgroundColor: "#D9D9D91C" }}
                  />
        
                  <Text className="text-[15px] text-[#00000099] font-bold mb-2">Property Type</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setVisible(visible === "propertyType" ? null : "propertyType")
                    }
                    className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300"
                  >
                    <Text className="text-gray-800 text-left">
                      {propertyType || "House"}
                    </Text>
                    <Ionicons name="chevron-down" size={24} color="#888" />
                  </TouchableOpacity>
                  </View>
                 {visible === "propertyType" && (
          <View
            className="bg-white rounded-lg shadow-lg -mt-1 mb-4"
            style={{ borderWidth: 1, borderColor: "#0000001A" }}
          >
            {["House", "Site/Plot/Land", "Commercial", "Resort"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => {
                  setPropertyType(type);
                  setVisible(null);
                  if (type === "House") {
                    router.push("/home/screens/UploadScreens/AddScreen");
                  } else if (type === "Site/Plot/Land") {
                    router.push("/home/screens/UploadScreens/SiteUpload");
                  } else if (type === "Commercial") {
                    // Already on this screen
                  } else {
                    router.push("/home/screens/UploadScreens/ResortUpload");
                  }
                }}
                className={`p-4 border-b border-gray-200 ${propertyType === type ? "bg-green-500" : "bg-white"}`}
              >
                <Text className={`${propertyType === type ? "text-white" : "text-gray-800"}`}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
 <Text className="text-[15px] text-[#00000099] font-bold mt-4 mb-2">
  Select Property Type
</Text>
<View className="flex-row flex-wrap mb-4">
  {typePills.map((p) => (
    <PillButton
      key={p}
      label={p}
      selected={selectedType === p}
      onPress={() => setSelectedType(p)} // Only one type active
    />
  ))}
</View>

{/* Conditional sub-options */}
{selectedType === "Office" && (
  <>
    <Text className="text-[15px] text-[#00000099] font-bold mb-2">
      What kind of office is it?
    </Text>
    <View className="flex-row flex-wrap mb-4">
      {officeKindPills.map((p) => (
        <PillButton
          key={p}
          label={p}
          selected={officeKinds.includes(p)}
          onPress={() => setOfficeKinds([p])}
        />
      ))}
    </View>
      {/* Location */}
            <View
              className="bg-white rounded-lg p-4 mb-4"
              style={{ borderWidth: 1, borderColor: "#0000001A" }}
            >
              <Text className="text-[15px] text-[#00000060] mb-3">Location</Text>
              <View
                className="flex-row items-center rounded-md p-3 mb-5"
                style={{
                  backgroundColor: "#D9D9D91C",
                  borderWidth: 1,
                  borderColor: "#0000001A",
                }}
              >
                <Image
                  source={require("../../../../../assets/location.png")}
                  style={{ width: 18, height: 18, marginRight: 8 }}
                />
                <TextInput placeholder="Enter Property Location" className="flex-1" value={location} onChangeText={setLocation} />
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
      {["IT park", "Business Park", "Other"].map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => {
            setLocatedInside(item);
            setVisible(null);
          }}
          className={`p-4 border-b border-gray-200 ${locatedInside === item ? "bg-green-500" : "bg-white"}`}
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
                Area
              </Text>
              <View
                className="flex-row items-center mb-3 rounded-md"
                style={{
                  borderWidth: 1,
                  borderColor: "#0000001A",
                  backgroundColor: "#D9D9D91C",
                  height: 52,
                }}
              >
                <TextInput
                  placeholder="0"
                  value={area}
                  onChangeText={setArea}
                  className="flex-1 px-3"
                  style={{ height: 52 }}
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
              <TextInput placeholder="No.of Cabins" value={cabins} onChangeText={setCabins} className="mb-3 rounded-md p-3" style={{ borderWidth: 1, borderColor: "#0000001A", height: 50, backgroundColor: "#D9D9D91C" }} />
              <TextInput placeholder="No.of Meeting Rooms" value={meetingRooms} onChangeText={setMeetingRooms} className="mb-3 rounded-md p-3" style={{ borderWidth: 1, borderColor: "#0000001A", height: 50, backgroundColor: "#D9D9D91C" }} />
              <TextInput placeholder="No.of Seats(min)" value={seats} onChangeText={setSeats} className="mb-4 rounded-md p-3" style={{ borderWidth: 1, borderColor: "#0000001A", height: 50, backgroundColor: "#D9D9D91C" }} />
    
              <Text className="text-[15px] font-bold text-[#00000099] mb-2">Select the available features</Text>
              <Checkbox
                label="Conference Room"
                selected={!!conferenceSelected}
                onPress={() => setConferenceSelected(conferenceSelected ? null : '1')}
              />
    
              {!!conferenceSelected && <View className="flex-row mb-4">
                {conferenceOptions.map((o) => (
                  <RoundOption key={o} label={o} selected={conferenceSelected === o} onPress={() => setConferenceSelected(o)} />
                ))}
              </View>}
              <Checkbox
                label="WashRoom"
                selected={!!conferenceSelected}
                onPress={() => setConferenceSelected(conferenceSelected ? null : '1')}
              />
    
              <Text className="text-[13px] text-[#00000099] mb-2">Public Washroom</Text>
              <View className="flex-row mb-3">
                {['1', '2', '3', '4+'].map((o) => (
                  <RoundOption key={o} label={o} selected={publicWashroom === o} onPress={() => setPublicWashroom(o)} />
                ))}
              </View>
    
              <Text className="text-[13px] text-[#00000099] mb-2">Private Washroom</Text>
              <View className="flex-row mb-3">
                {['1', '2', '3', '4+'].map((o) => (
                  <RoundOption key={o} label={o} selected={privateWashroom === o} onPress={() => setPrivateWashroom(o)} />
                ))}
              </View>
    
              <Checkbox
                label="Reception Area"
                selected={receptionArea}
                onPress={() => setReceptionArea(!receptionArea)}
              />
              <Checkbox
                label="Privacy"
                selected={privacy}
                onPress={() => setPrivacy(!privacy)}
              />
    
              <View className="flex-row flex-wrap my-4">
                <PillButton label="Private" selected={washroomType === 'Private'} onPress={() => setWashroomType('Private')} />
                <PillButton label="Shared" selected={washroomType === 'Shared'} onPress={() => setWashroomType('Shared')} />
              </View>
              
    
              <Text className="text-[15px]  font-bold text-[#00000099] mb-2">Carpet Area (optional)</Text>
              <View
                className="flex-row items-center mb-4 rounded-md"
                style={{
                  borderWidth: 1,
                  borderColor: "#0000001A",
                  backgroundColor: "#D9D9D91C",
                  height: 52,
                }}
              >
                <TextInput
                  placeholder="Carpet Area"
                  value={carpetArea}
                  onChangeText={setCarpetArea}
                  className="flex-1 px-3"
                  style={{ height: 52 }}
                />
                <View style={{ width: 1, backgroundColor: "#0000001A", height: "60%" }} />
                <View style={{ width: 100 }}>
                  <Picker selectedValue={carpetUnit} onValueChange={(v) => setCarpetUnit(v)} mode="dropdown" style={{ height: 52, width: "100%" }}>
                    <Picker.Item label="sqft" value="sqft" />
                  </Picker>
                </View>
              </View>
    
              <View className="mb-4">
                <Text className="text-[15px] font-bold text-[#00000099] mb-2">Additional features</Text>
                <View>
                  {["Furnishing", "Central AC", "Oxygen Duct", "UPS"].map(item => (
                    <Checkbox
                      key={item}
                      label={item}
                      selected={additionalFeatures.includes(item)}
                      onPress={() => toggleArrayItem(setAdditionalFeatures, additionalFeatures, item)}
                    />
                  ))}
                </View>
              </View>
    
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
              <TextInput placeholder="Total floors" value={totalFloors} onChangeText={setTotalFloors} className="mb-4 rounded-md p-3" style={{ borderWidth: 1, borderColor: "#0000001A", height: 50, backgroundColor: "#D9D9D91C" }} />
    
              <Text className="text-[15px] font-bold text-[#00000099] mb-2">No.of stair cases (optional)</Text>
              <View className="flex-row mb-4">
                {stairOptions.map((s) => (
                  <RoundOption key={s} label={s} selected={stairCase === s} onPress={() => setStairCase(s)} />
                ))}
              </View>
    
              <Text className="text-[15px] font-bold text-[#00000099] mb-2">Lifts</Text>
              <View className="flex-row mb-4">
                <PillButton label="Available" selected={lift === 'Available'} onPress={() => setLift('Available')} />
                <PillButton label="Not-Available" selected={lift === 'Not-Available'} onPress={() => setLift('Not-Available')} />
              </View>
    
              <Text className="text-[15px] text-[#00000099] font-bold mb-2">Parking</Text>
              <View className="flex-row mb-4">
                <PillButton label="Available" selected={parking === 'Available'} onPress={() => setParking('Available')} />
                <PillButton label="Not-Available" selected={parking === 'Not-Available'} onPress={() => setParking('Not-Available')} />
              </View>
    
              <Text className="text-[15px] text-[#00000099] font-bold mb-2">Availability status</Text>
              <View className="flex-row mb-4">
                <PillButton label="Immediate" selected={availability === 'Immediate'} onPress={() => setAvailability('Immediate')} />
                <PillButton label="Later" selected={availability === 'Later'} onPress={() => setAvailability('Later')} />
              </View>
    
              <Text className="text-[15px] text-[#00000099] font-bold mb-2">Ownership</Text>
              <View className="flex-row flex-wrap mb-4">
                {ownershipOptions.map((o) => (
                  <PillButton key={o} label={o} selected={ownership === o} onPress={() => setOwnership(o)} />
                ))}
              </View>
    
              <Text className="mb-2 text-[15px]  font-bold text-[#00000099]">Price Details</Text>
              <TextInput
                placeholder="₹ Expected Price"
                value={expectedPrice}
                onChangeText={setExpectedPrice}
                className="rounded-md p-3 mb-3"
                style={{ borderWidth: 1, borderColor: "#0000001A", height: 52, backgroundColor: "#D9D9D91C" }}
              />
              <View>
                <Checkbox label="All inclusive price" selected={allInclusive} onPress={() => setAllInclusive(!allInclusive)} />
                <Checkbox label="Price Negotiable" selected={priceNegotiable} onPress={() => setPriceNegotiable(!priceNegotiable)} />
                <Checkbox label="Tax and Govt.charges excluded" selected={taxExcluded} onPress={() => setTaxExcluded(!taxExcluded)} />
              </View>
    
              <TouchableOpacity>
                <Text className="text-[#22C55E] text-sm mt-2">+ Add more pricing details</Text>
              </TouchableOpacity>
    
              <Text className="text-[14px]  font-bold text-[#00000099] mt-4 mb-2">Is it Pre-leased/Pre-Rented?</Text>
              <View className="flex-row mb-4">
                <PillButton label="Yes" selected={preLeased === 'Yes'} onPress={() => setPreLeased('Yes')} />
                <PillButton label="No" selected={preLeased === 'No'} onPress={() => setPreLeased('No')} />
              </View>
    
              <Text className="text-[14px]  font-bold text-[#00000099] mb-2">Is your office fire NOC Certified?</Text>
              <View className="flex-row mb-4">
                <PillButton label="Yes" selected={nocCertified === 'Yes'} onPress={() => setNocCertified('Yes')} />
                <PillButton label="No" selected={nocCertified === 'No'} onPress={() => setNocCertified('No')} />
              </View>
    
              <Text className="text-[14px]  font-bold text-[#00000099] mb-2">Is it Occupancy Certified?</Text>
              <View className="flex-row mb-4">
                <PillButton label="Yes" selected={occupancyCertified === 'Yes'} onPress={() => setOccupancyCertified('Yes')} />
                <PillButton label="No" selected={occupancyCertified === 'No'} onPress={() => setOccupancyCertified('No')} />
              </View>
    
              <Text className="text-[14px] font-bold text-[#00000099] mb-2">Office previously used for (optional)</Text>
              <TouchableOpacity
                onPress={() => setVisible(visible === 'prevUsedFor' ? null : 'prevUsedFor')}
                className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
              >
                <Text className="text-gray-800 text-left">
                  {prevUsedFor || "Select"}
                </Text>
                <Ionicons name="chevron-down" size={24} color="#888" />
              </TouchableOpacity>
              {visible === 'prevUsedFor' && (
               <View
      className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
      style={{ borderWidth: 1, borderColor: "#0000001A" }}
    >
      {prevUsedForOptions.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => {
            setPrevUsedFor(item);
            setVisible(null);
          }}
          className={`p-4 border-b border-gray-200 ${prevUsedFor === item ? "bg-green-500" : "bg-white"}`}
        >
          <Text className={`${prevUsedFor === item ? "text-white" : "text-gray-800"}`}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    
              )}
    
              <Text className="mt-4 mb-2  font-bold text-[15px] text-[#00000099]">Describr your property </Text>
              <TextInput
                placeholder="Share some details about your property like spacious rooms, well maintained facilities."
                value={describeProperty}
                onChangeText={setDescribeProperty}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
                className="rounded-md p-3"
                style={{
                  borderWidth: 1,
                  borderColor: "#0000001A",
                  width: "100%",
                  height: 108,
                  paddingTop: 10,
                }}
              />
            </View>
    
            <View
              className="bg-white rounded-lg p-4 mb-4"
              style={{ borderWidth: 1, borderColor: "#0000001A" }}
            >
              <Text className="text-[15px] font-bold text-[#00000099] mb-2">Amenities</Text>
              <View className="flex-row flex-wrap mb-4">
                {amenityOptions.map((a) => (
                  <PillButton key={a} label={a} selected={amenities.includes(a)} onPress={() => toggleArrayItem(setAmenities, amenities, a)} />
                ))}
              </View>
    
              <Text className="text-[15px] font-bold text-[#00000099] mt-4 mb-3">
                Location Advantages
              </Text>
              <View className="flex-row flex-wrap">
                {locationAdvantages.map((a) => (
                  <PillButton key={a} label={a} selected={locAdvantages.includes(a)} onPress={() => toggleArrayItem(setLocAdvantages, locAdvantages, a)} />
                ))}
              </View>
            </View>
    
            <View
              style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16, gap: 12 }}
              className="space-x-3 "
            >
              {/* Cancel Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: "#E5E7EB",
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                }}
                onPress={() => {
                  // handle cancel action
                }}
              >
                <Text style={{ color: "black", fontWeight: "600", fontSize: 15 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
    
              {/* Upload Property Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: "#22C55E",
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                }}
                onPress={() => setAlertVisible(true)}
              >
                <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
                  Upload Property
                </Text>
              </TouchableOpacity>
            </View>
    
  </>
)}

{selectedType === "Retail" && (
  <>
    <Text className="text-[15px] text-[#00000099] font-bold mb-2">
    What type of retail space do you have ?
    </Text>
    <View className="flex-row flex-wrap mb-4">
      {["Commercial Shops", "Commercial Showrooms"].map((p) => (
        <PillButton
          key={p}
          label={p}
          selected={retailKinds.includes(p)}
          onPress={() => setRetailKinds([p])}
        />
      ))}
    </View>

    
  </>
)}

{selectedType === "Plot/Land" && (
  <>
    <Text className="text-[15px] text-[#00000099] font-bold mb-2">
      Plot Details
    </Text>
    <View className="flex-row flex-wrap mb-4">
      {["Residential Plot", "Commercial Plot", "Agricultural Land"].map((p) => (
        <PillButton
          key={p}
          label={p}
          selected={plotKinds.includes(p)}
          onPress={() => setPlotKinds([p])}
        />
      ))}
    </View>
  </>
)}
                 
        </ScrollView>


        </View>
  )};