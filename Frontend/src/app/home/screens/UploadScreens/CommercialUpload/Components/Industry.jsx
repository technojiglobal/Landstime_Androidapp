import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import TopAlert from "../../TopAlert";

const PillButton = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-3 py-1 h-[23px] rounded-full mr-2 mb-4 items-center justify-center ${
      selected ? "bg-green-100 border-green-500" : "border-gray-300"
    }`}
    style={{
      borderWidth: 1,
      borderColor: selected ? "#22C55E" : "#0000001A",
      backgroundColor: selected ? "#22C55E17" : "white",
    }}
  >
    <Text className="text-xs font-medium" style={{ color: selected ? "#22C55E" : "#00000099" }}>{label}</Text>
  </TouchableOpacity>
);

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


export default function UploadPropertyScreen() {
  // ✅ State variables
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("Commercial");
  const [image, setImage] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [visible, setVisible] = useState(null);
   const [selectedTypes, setSelectedTypes] = useState(['Storage']);
  const [storageKinds, setStorageKinds] = useState([]);
  const [washroomSelected, setWashroomSelected] = useState(true);
  const [washrooms, setWashrooms] = useState(null);
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('sqft');
  const [showCarpetArea, setShowCarpetArea] = useState(false);
  const [carpetArea, setCarpetArea] = useState('');
  const [showBuiltUpArea, setShowBuiltUpArea] = useState(false);
  const [builtUpArea, setBuiltUpArea] = useState('');
  const [availability, setAvailability] = useState("Ready to Move");
  const [propertyAge, setPropertyAge] = useState("0-1 years");
  const [possessionBy, setPossessionBy] = useState('');
  const [expectedMonth, setExpectedMonth] = useState('');
  const [ownership, setOwnership] = useState("");
  const [authorityApprove, setAuthorityApprove] = useState(null);
  const [approvedIndustryType, setApprovedIndustryType] = useState('');
  const [expectedPrice, setExpectedPrice] = useState("");
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [preReleased, setPreReleased] = useState("Yes");
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [propertyFacing, setPropertyFacing] = useState("");
  const [locationAdvantages, setLocationAdvantages] = useState([]);
  const [flooringType, setFlooringType] = useState('');
  const router = useRouter();

  // ✅ Options
  const typePills = ['Office', 'Retail', 'Plot/Land', 'Storage', 'Industry', 'Hospitality', 'Other'];
  const storageKindPills = ['Factory', 'Manufacturing'];
  const washroomOptions = ['1', '2', '3', '4+'];
  const availabilityOptions = ["Ready to Move", "Under Construction"];
  const possessionOptions = [
    "Immediate",
    "Within 3 months",
    "Within 6 months",
    "By 2026",
    "By 2027",
    "By 2028",
    "By 2029",
    "By 2030",
  ];
  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const showMonthDropdown = possessionBy.startsWith("By ");
  const industryTypeOptions = [
    "Automobiles",
    "BioTechnology",
    "Capital Goods",
    "Chemicals",
    "Construction",
    "Defence and Aerospace Manufacturing",
    "Electronics Hardware",
    "Engineering",
    "Food Processing",
    "Gems And Jewellery",
    "Handicrafts","IT and ITes","Leather","Manufacturing","Medical Devices","Metals","Mixed",
    "Petroleum","Pharmaceuticals","Renewable Energy","Software","Textiles"
  ];


  const propertyAgeOptions = ["0-1 years", "1-5 Years", "5-10 Years", "10+ Years"];
  const ownershipOptions = ["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"];
  const amenitiesOptions = [
    "+Service/Goods Lift","+Water Storage","+Water Disposal","+ATM","+Maintenance Staff",
    "+Rain Water Harvesting","+Security Alarm","+Near Bank","+Security Personal","+Visitor Parking","+Lifts"
  ];
  const facingOptions = [
    "East",
    "West",
    "North",
    "South",
    "North-East",
    "North-West",
    "South-East",
  ];
  const locationAdvOptions = 
    ['+Close to Metro Station','+Close to School','+Close to Hospital','+Close to Market',
        '+Close to Railway Station','+Close to Airport','+Close to Mall','+Close to Highway'];

  const toggleSelection = (value, setFunction, currentArray) => {
    if (currentArray.includes(value)) {
      setFunction(currentArray.filter((v) => v !== value));
    } else {
      setFunction([...currentArray, value]); 
    }
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
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        <TopAlert visible={alertVisible} onHide={() => setAlertVisible(false)} />
        {/* Header */}
      
         

          <Text className="text-[15px] text-[#00000099] font-bold mb-2">What kind of Industry is it?</Text>
          <View className="flex-row flex-wrap">
            {storageKindPills.map((p) => (
              <PillButton key={p} label={p} selected={storageKinds.includes(p)} onPress={() => setStorageKinds([p])} />
            ))}
          </View>
      

        {/* Location */}
        <View className="bg-white rounded-lg p-4 mb-4" style={{ borderWidth: 1, borderColor: "#0000001A" }}>
          <Text className="text-[15px] text-[#00000060] mb-3">Location</Text>
          <View className="flex-row items-center rounded-md p-3" style={{ backgroundColor: "#D9D9D91C", borderWidth: 1, borderColor: "#0000001A" }}>
            <Image source={require("../../../../../../../assets/location.png")} style={{ width: 18, height: 18, marginRight: 8 }} />
            <TextInput placeholder="Enter Property Location" className="flex-1" />
          </View>
        </View>

        {/* Card 1 */}
        <View className="bg-white rounded-lg p-4 mb-4" style={{ borderWidth: 1, borderColor: "#0000001A" }}>
             <Text className="text-[15px] text-[#00000099] font-bold mb-3">Add Room Details</Text>
              <Text className="text-sm text-[#00000099] font-bold mb-1">Select the available features</Text>
               <Text className="text-[10px] text-[#00000060] mb-3">Select the features in your office space</Text>
          <Checkbox label="Washrooms" selected={washroomSelected} onPress={() => setWashroomSelected(!washroomSelected)} />
          {washroomSelected && <View className="flex-row mb-4 mt-2">
            {washroomOptions.map((o) => (
              <RoundOption key={o} label={o} selected={washrooms === o} onPress={() => setWashrooms(o)} />
            ))}
          </View>}
          </View>

          <Text className="text-[14px] font-medium text-[#00000099] mb-3">Area(sqft)</Text>
          <View className="flex-row items-center mb-3 rounded-md" style={{ borderWidth: 1, borderColor: "#0000001A", backgroundColor: "#D9D9D91C", height: 52 }}>
            <TextInput placeholder="0" value={area} onChangeText={setArea} className="flex-1 px-3" style={{ height: 52 }} keyboardType="numeric" />
            <View style={{ width: 1, backgroundColor: "#0000001A", height: "60%" }} />
            <View style={{ width: 100 }}>
              <Picker selectedValue={unit} onValueChange={(v) => setUnit(v)} mode="dropdown" style={{ height: 52, width: "100%" }}>
                <Picker.Item label="sqft" value="sqft" />
                <Picker.Item label="sqm" value="sqm" />
                <Picker.Item label="acre" value="acre" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity onPress={() => setShowCarpetArea(true)}><Text className="text-green-500 text-sm mb-2">+Add Carpet Area</Text></TouchableOpacity>
          {showCarpetArea && <TextInput placeholder="Carpet Area" value={carpetArea} onChangeText={setCarpetArea} className="mb-3 rounded-md p-3" style={{ borderWidth: 1, borderColor: "#0000001A", height: 50, backgroundColor: "#D9D9D91C" }} keyboardType="numeric" />}

          <TouchableOpacity onPress={() => setShowBuiltUpArea(true)}><Text className="text-green-500 text-sm mb-2">+Add Built-up Area</Text></TouchableOpacity>
          {showBuiltUpArea && <TextInput placeholder="Built-up Area" value={builtUpArea} onChangeText={setBuiltUpArea} className="mb-3 rounded-md p-3" style={{ borderWidth: 1, borderColor: "#0000001A", height: 50, backgroundColor: "#D9D9D91C" }} keyboardType="numeric" />}

          <Text className="text-[15px] text-[#00000099] font-bold mb-2">Availability Status</Text>
          <View className="flex-row mb-4">
            {availabilityOptions.map((o) => (
              <PillButton key={o} label={o} selected={availability === o} onPress={() => setAvailability(o)} />
            ))}
          </View>
        {availability === "Under Construction" && (
  <>
    <Text className="text-[15px] text-[#00000099] font-bold mb-2">Possession By</Text>
    <TouchableOpacity
      onPress={() => setVisible(visible === "possessionBy" ? null : "possessionBy")}
      className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
    >
      <Text className="text-gray-800 text-left">{possessionBy || "Expected By"}</Text>
      <Ionicons name="chevron-down" size={24} color="#888" />
    </TouchableOpacity>

    {visible === "possessionBy" && (
      <View
        className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
        style={{ borderWidth: 1, borderColor: "#0000001A" }}
      >
        {possessionOptions.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => {
              setPossessionBy(item);
              setVisible(null);
              if (!item.startsWith("By ")) {
                setExpectedMonth(""); // Reset month if not a year option
              }
            }}
            className={`p-4 border-b border-gray-200 ${
              possessionBy === item ? "bg-green-500" : "bg-white"
            }`}
          >
            <Text className={`${possessionBy === item ? "text-white" : "text-gray-800"}`}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )}

    {showMonthDropdown && (
      <>
        <Text className="text-[15px] text-[#00000099] font-bold mb-2">Expected By Month</Text>
        <TouchableOpacity
          onPress={() => setVisible(visible === "expectedMonth" ? null : "expectedMonth")}
          className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
        >
          <Text className="text-gray-800 text-left">{expectedMonth || "Select Month"}</Text>
          <Ionicons name="chevron-down" size={24} color="#888" />
        </TouchableOpacity>

        {visible === "expectedMonth" && (
          <View
            className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
            style={{ borderWidth: 1, borderColor: "#0000001A" }}
          >
            {monthOptions.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setExpectedMonth(item);
                  setVisible(null);
                }}
                className={`p-4 border-b border-gray-200 ${
                  expectedMonth === item ? "bg-green-500" : "bg-white"
                }`}
              >
                <Text className={`${expectedMonth === item ? "text-white" : "text-gray-800"}`}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </>
    )}
  </>
)}


          <Text className="text-[15px] text-[#00000099] font-bold mb-2">Age of Property</Text>
          <View className="flex-row flex-wrap">
            {propertyAgeOptions.map((o) => (
              <PillButton key={o} label={o} selected={propertyAge === o} onPress={() => setPropertyAge(o)} />
            ))}
          </View>
       

        <View className="bg-white rounded-lg p-4 mb-4" style={{ borderWidth: 1, borderColor: "#0000001A" }}>
          <Text className="text-[15px] text-[#00000099] font-bold mb-2">Ownership</Text>
      <View className="flex-row flex-wrap">
        {ownershipOptions.map((option) => (
          <PillButton
            key={option}
            label={option}
            selected={ownership === option}
            onPress={() => setOwnership(option)}
          />
        ))}
      </View>

          <Text className="text-[15px] text-[#00000099] font-bold mb-2">Which authority the property is approved by?</Text>
          <View className="flex-row mb-4">
            <PillButton label="local Authority" selected={authorityApprove === 'local Authority'} onPress={() => setAuthorityApprove('local Authority')} />

          </View>

          <Text className="text-[15px] text-[#00000099] font-bold mb-2">Approved for industry type?</Text>
          <TouchableOpacity
            onPress={() => setVisible(visible === "industryType" ? null : "industryType")}
            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
          >
            <Text className="text-gray-800 text-left">{approvedIndustryType || "Select Industry Type"}</Text>
            <Ionicons name="chevron-down" size={24} color="#888" />
          </TouchableOpacity>
         {visible === "industryType" && (
  <View
    className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
    style={{ borderWidth: 1, borderColor: "#0000001A" }}
  >
    <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
      {industryTypeOptions.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => {
            setApprovedIndustryType(item);
            setVisible(null);
          }}
          className={`p-4 border-b border-gray-200 ${
            approvedIndustryType === item ? "bg-green-500" : "bg-white"
          }`}
        >
          <Text
            className={`${
              approvedIndustryType === item ? "text-white" : "text-gray-800"
            }`}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)}


          <Text className="mb-2 text-[15px] font-bold text-[#00000099]"> Expected Price Details</Text>
      <TextInput
        placeholder="Enter expected price"
        value={expectedPrice}
        onChangeText={setExpectedPrice}
        className="rounded-md p-3 mb-3"
        style={{ borderWidth: 1, borderColor: "#0000001A", height: 50, backgroundColor: "#D9D9D91C" }}
      />

      <Checkbox
        label=" Tax Nand Govt changes excluded"
        selected={checkbox1}
        onPress={() => setCheckbox1(!checkbox1)}
      />
      <Checkbox
        label="Price Negotiable"
        selected={checkbox2}
        onPress={() => setCheckbox2(!checkbox2)}
      />
      <TouchableOpacity>
        <Text className="text-green-500 text-sm mt-2"> +Add more pricing details</Text>
      </TouchableOpacity>

          <Text className="text-[15px] font-bold text-[#00000099] mt-4 mb-2">Is it Pre-released?/Pre-Rented</Text>
      <View className="flex-row">
        {["Yes", "No"].map((option) => (
          <PillButton
            key={option}
            label={option}
            selected={preReleased === option}
            onPress={() => setPreReleased(option)}
          />
        ))}
      </View>

      <TextInput
        placeholder="Current rent per month"
        value={input1}
        onChangeText={setInput1}
        className="rounded-md p-3 mb-3"
        style={{ borderWidth: 1, borderColor: "#0000001A", height: 50, backgroundColor: "#D9D9D91C" }}
      />
      <TextInput
        placeholder="Lease tenure in years"
        value={input2}
        onChangeText={setInput2}
        className="rounded-md p-3 mb-3"
        style={{ borderWidth: 1, borderColor: "#0000001A", height: 50, backgroundColor: "#D9D9D91C" }}
      />

          <Text className="mt-4 mb-2 font-bold text-[15px] text-[#00000099]">Describe your property</Text>
      <TextInput
        placeholder="Write here what makes your property unique"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className="rounded-md p-3 mb-3"
        style={{ borderWidth: 1, borderColor: "#0000001A", height: 108, paddingTop: 10 }}
      />

          <Text className="text-[15px] font-bold text-[#00000099] mb-2">Amenities</Text>
      <View className="flex-row flex-wrap">
        {amenitiesOptions.map((option) => (
          <PillButton
            key={option}
            label={option}
            selected={amenities.includes(option)}
            onPress={() => toggleSelection(option, setAmenities, amenities)}
          />
        ))}
      </View>
          <TouchableOpacity><Text className="text-green-500 text-sm mb-4">+Add more Amenities</Text></TouchableOpacity>

          <Text className="text-[15px] font-bold text-[#00000099] mt-4 mb-3">Location Advantages</Text>
      <View className="flex-row flex-wrap">
        {locationAdvOptions.map((option) => (
          <PillButton
            key={option}
            label={option}
            selected={propertyFacing === option}
            onPress={() => setPropertyFacing(option)}
          />
        ))}
      </View>

          <Text className="text-[15px] font-bold text-[#00000099] mb-2 mt-2">Property Facing</Text>
      <View className="flex-row flex-wrap">
        {facingOptions.map((option) => (
          <PillButton
            key={option}
            label={option}
            selected={propertyFacing === option}
            onPress={() => setPropertyFacing(option)}
          />
        ))}
      </View>

          <Text className="text-[15px] font-bold text-[#00000099] mb-2 mt-3">Type of flooring</Text>
          <TouchableOpacity
            onPress={() => setVisible(visible === 'flooring' ? null : 'flooring')}
            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
          >
            <Text className="text-gray-800 text-left">{flooringType || "Select Flooring"}</Text>
            <Ionicons name="chevron-down" size={24} color="#888" />
          </TouchableOpacity>
          {visible === 'flooring' && (
  <View
    className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
    style={{ borderWidth: 1, borderColor: "#0000001A" }}
  >
    {[
      "Marble",
      "Concrete",
      "Ceramic",
      "Mosaic",
      "Cement",
      "Stone",
      "Vinyl",
      "Spartex",
      "IPS Finish",
      "Vitrified",
      "Wooden",
      "Granite",
      "Others",
    ].map((item) => (
      <TouchableOpacity
        key={item}
        onPress={() => {
          setFlooringType(item);
          setVisible(null);
        }}
        className={`p-4 border-b border-gray-200 ${
          flooringType === item ? "bg-green-500" : "bg-white"
        }`}
      >
        <Text
          className={`${
            flooringType === item ? "text-white" : "text-gray-800"
          }`}
        >
          {item}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
)}

        </View>

      
      </ScrollView>
    </View>
  );
}