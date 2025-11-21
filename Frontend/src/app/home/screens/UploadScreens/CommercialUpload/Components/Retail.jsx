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
import TopAlert from "../../TopAlert"

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
    <Text className="text-[10px]" style={{ color: selected ? "#22C55E" : "#00000099" }}>{label}</Text>
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

export default function UploadPropertyScreen() {
  // ✅ State variables
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("Commercial");
  const [image, setImage] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [visible, setVisible] = useState(null);
  const [selectedWashroom, setSelectedWashroom] = useState("");
  const [selectedTypes, setSelectedTypes] = useState(["Retail"]);
  const [retailType, setRetailType] = useState(["Commercial Shops"]);
  const [locatedInside, setLocatedInside] = useState("");
  const [showAddMoreInput, setShowAddMoreInput] = useState(false);
  const [customLocatedInside, setCustomLocatedInside] = useState("");
  const [area, setArea] = useState("");
  const [unit, setUnit] = useState("sqft");
  const [cabins, setCabins] = useState("");
  const [meetingRooms, setMeetingRooms] = useState("");
  const [seats, setSeats] = useState("");
  const [floorDetails, setFloorDetails] = useState("");
  const [locatedNear, setLocatedNear] = useState("");
  const [parkingType, setParkingType] = useState("");
  const [availability, setAvailability] = useState("");
  const [propertyAge, setPropertyAge] = useState("");
  const [businessTypes, setBusinessTypes] = useState([]);
  const [ownership, setOwnership] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [preReleased, setPreReleased] = useState("Yes");
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [otherFeature1, setOtherFeature1] = useState(false);
  const [otherFeature2, setOtherFeature2] = useState(false);
  const [safetyMeasures, setSafetyMeasures] = useState([]);
  const [propertyFacing, setPropertyFacing] = useState("");
  const [roadWidth, setRoadWidth] = useState("");
  const [roadWidthUnit, setRoadWidthUnit] = useState("ft");
  const [locationAdvantages, setLocationAdvantages] = useState([]);
  const router = useRouter();

  // ✅ Options
  const typePills = ['Office', 'Retail', 'Plot/Land', 'Storage', 'Industry', 'Hospitality', 'Other'];
  const retailTypePills = ["Commercial Shops","Commercial Showrooms"];
  const businessTypeOptions = [
   "ATM","Bakery","Boutique","Clinic","Clothess","Cloud Kitchen","Coffee","Dental Clinic","Fast Food ","Foot Wear","Grocery","gYM","Jewellery",
   "Juice","Meat","Medical","Mobile","Pub","Restaurants","Salon/Spa","Stationery","Sweet","Tea Stall","Other Business Type"];
   
  
  const washroomOptions = ["+Private Washrooms", "+Public Washrooms", "Not Available"];
  const locatedNearOptions = ["+Entrance","+Elevator","+Stairs"];
  const parkingOptions = ["+Private Parking","+Public Parking","+Multilevel Parking","Not Available"];
  const availabilityOptions = ["Ready to Move","Under Construction"];
  const propertyAgeOptions = ["0-1 Years", "1-5 Years", "5-10 Years", "10+ Years"];
  const ownershipOptions = ["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"];
  const amenitiesOptions = [
    "+Service/Goods Lift","+Water Storage","+Water Disposal","+ATM","+Maintenance Staff","+Rain Water Harvesting","+Security Alarm","+Near Bank","+Security Personal","+Visitor Parking","+Lifts"
  ];
  const safetyOptions = ["Fire Extenguisher", "Fire Hose","Sprinklers"];
  const facingOptions = [
    "East",
    "West",
    "North",
    "South",
    "North-East",
    "North-West",
    "South-East",
  ];
  const locationAdvOptions =  ['+Close to Metro Station','+Close to School','+Close to Hospital','+Close to Market','+Close to Railway Station','+Close to Airport','+Close to Mall','+Close to Highway'];
  
         const[ possessionBy,setPossessionBy]=useState("");
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
      <TopAlert visible={alertVisible} onHide={() => setAlertVisible(false)} />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        
          <Text className="text-[15px] text-[#00000099] font-bold mb-2"> What type of Retail Space do you have?</Text>
          <View className="flex-row flex-wrap">
            {retailTypePills.map((p) => (
              <PillButton key={p} label={p} selected={retailType.includes(p)} onPress={() => toggleSelection(p, setRetailType, retailType)} />
            ))}
          </View>
    

        {/* Location */}
        <View className="bg-white rounded-lg p-4 mb-4" style={{ borderWidth: 1, borderColor: "#0000001A" }}>
          <Text className="text-[15px] text-[#00000060] mb-3">Location</Text>
          <View className="flex-row items-center rounded-md mb-5 p-3" style={{ backgroundColor: "#D9D9D91C", borderWidth: 1, borderColor: "#0000001A" }}>
            <Image source={require("../../../../../../../assets/location.png")} style={{ width: 18, height: 18, marginRight: 8 }} />
            <TextInput placeholder="Enter Property Location" className="flex-1" />
          </View>
          <TouchableOpacity
            onPress={() => {
              if (visible === "locatedInside") {
                setVisible(null);
                setShowAddMoreInput(false); // Also hide input when closing dropdown
              } else {
                setVisible("locatedInside");
              }
            }}
            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
          >
            <Text className="text-gray-800 text-left">
              {locatedInside || "Your shop is located inside"}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#888" />
          </TouchableOpacity>
          {visible === "locatedInside" && (
            <View
              className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
              style={{ borderWidth: 1, borderColor: "#0000001A" }}
            >
             {["Mall", "Commercial project", "Residential project", "Retail Complex/Building", "Market/HighStreet", "+Add More"].map((item) => (
  <TouchableOpacity
    key={item}
    onPress={() => {
      if (item === "+Add More") {
        setShowAddMoreInput(true); // Show the input
        setLocatedInside("");
      } else {
        setLocatedInside(item);
        setShowAddMoreInput(false);
        setVisible(null); // Close dropdown on selection
      }
    }}
    className={`p-4 ${locatedInside === item ? "bg-green-500" : ""}`}
  >
    <Text className={`${locatedInside === item ? "text-white" : item === "+Add More" ? "text-green-500" : "text-gray-800"}`}>
      {item}
    </Text>
  </TouchableOpacity>
))}

              {showAddMoreInput && (
                <View className="p-4 border-t border-gray-200">
                  <TextInput
                    placeholder="Enter other location"
                    value={customLocatedInside}
                    onChangeText={setCustomLocatedInside}
                    className="rounded-md p-3 mb-3"
                    style={{ borderWidth: 1, borderColor: "#0000001A", height: 50, backgroundColor: "#D9D9D91C" }}
                    autoFocus={true}
                  />
                  <TouchableOpacity
                    style={{ backgroundColor: "#22C55E", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center' }}
                    onPress={() => {
                      if (customLocatedInside.trim()) {
                        setLocatedInside(customLocatedInside);
                        setShowAddMoreInput(false);
                        setCustomLocatedInside("");
                        setVisible(null);
                      }
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>Continue</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        <View className="bg-white rounded-lg p-4 mb-4" style={{ borderWidth: 1, borderColor: "#0000001A" }}>
          <Text className="text-[14px] font-medium text-[#00000099] mb-3">Area</Text>
          <View className="flex-row items-center mb-3 rounded-md" style={{ borderWidth: 1, borderColor: "#0000001A", backgroundColor: "#D9D9D91C", height: 52 }}>
            <TextInput
              placeholder="Carpet Area"
              value={area}
              onChangeText={setArea}
              className="flex-1 px-3"
              style={{ height: 52 }}
            />
            <View style={{ width: 1, backgroundColor: "#0000001A", height: "60%" }} />
            <View style={{ width: 100 }}>
              <Picker selectedValue={unit} onValueChange={(v) => setUnit(v)} mode="dropdown" style={{ height: 52, width: "100%" }}>
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
        </View>

        <View className="bg-white rounded-lg p-4 mb-4" style={{ borderWidth: 1, borderColor: "#0000001A" }}>
          {/* a) Washroom Details */}
          <Text className="text-[15px] font-bold text-[#00000099] mb-2">Washroom Details</Text>
      <View className="flex-row flex-wrap">
        {washroomOptions.map((option) => (
          <PillButton
            key={option}
            label={option}
            selected={selectedWashroom === option}
            onPress={() => setSelectedWashroom(option)}
          />
        ))}
      </View>

          {/* b) Floor Details */}
          <Text className="text-[15px] font-bold text-[#00000099] mt-3 mb-2">Floor Details</Text>
      <TextInput
        placeholder="Enter floor details"
        value={floorDetails}
        onChangeText={setFloorDetails}
            className="rounded-md p-3 mb-3"
            style={{ borderWidth: 1, borderColor: "#0000001A", height: 50, backgroundColor: "#D9D9D91C" }}
      />

      {/* c) Located Near */}
      <Text className="text-[15px] font-bold text-[#00000099] mb-2">Located Near</Text>
      <View className="flex-row flex-wrap">
        {locatedNearOptions.map((option) => (
          <PillButton
            key={option}
            label={option}
            selected={locatedNear === option}
            onPress={() => setLocatedNear(option)}
          />
        ))}
      </View>

      {/* d) Parking Type */}
      <Text className="text-[15px] font-bold text-[#00000099] mb-2">Parking Type</Text>
      <View className="flex-row flex-wrap">
        {parkingOptions.map((option) => (
          <PillButton
            key={option}
            label={option}
            selected={parkingType === option}
            onPress={() => setParkingType(option)}
          />
        ))}
      </View>

      {/* e) Availability Status */}
     <View className="mt-4">
  <Text className="text-[15px] font-bold text-[#00000099] mb-2">
    Availability Status
  </Text>

  <View className="flex-row">
    {availabilityOptions.map((option) => (
      <PillButton
        key={option}
        label={option}
        selected={availability === option}
        onPress={() => setAvailability(option)}
      />
    ))}
  </View>

  {/* ✅ Conditional text based on selected availability */}
  {availability === "Ready to Move" ? (
    <>
    <Text className="text-[15px] font-bold text-[#00000099] mb-2">Age of Property</Text>
      <View className="flex-row flex-wrap">
        {propertyAgeOptions.map((option) => (
          <PillButton
            key={option}
            label={option}
            selected={propertyAge === option}
            onPress={() => setPropertyAge(option)}
          />
        ))}
      </View>
      {/* g) Suitable for Business Type */}
        <Text className="text-[15px] font-bold text-[#00000099] mb-2">Suitable for Business Type(s)</Text>
      <TouchableOpacity
        onPress={() => setVisible(visible === "businessType" ? null : "businessType")}
        className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
      >
      <Text className="text-gray-800 text-left">
  {businessTypes.length > 0 ? `${businessTypes.length} type(s) selected` : "Select Type(s)"}
</Text>

        <Ionicons name="chevron-down" size={24} color="#888" />
      </TouchableOpacity>
      {visible === "businessType" && (
        <View className="bg-white rounded-lg shadow-lg -mt-4 mb-4 max-h-64" style={{ borderWidth: 1, borderColor: "#0000001A" }}>
          <ScrollView nestedScrollEnabled={true}>
            {businessTypeOptions.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => toggleSelection(item, setBusinessTypes, businessTypes)}
                className="p-4 border-b border-gray-200 flex-row items-center"
              >
                <Checkbox
                  label=""
                  selected={businessTypes.includes(item)}
                  onPress={() => toggleSelection(item, setBusinessTypes, businessTypes)}
                />
                <Text className="text-gray-800 ml-2">{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      </>
  ) : (
    <>
             <Text className="text-[14px] font-medium text-black-300 mb-3">
                                              Possession By
                                       </Text>
                                      
                                          <TouchableOpacity
                                            onPress={() => setVisible(visible === "possessionBy" ? null : "possessionBy")}
                                            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
                                          >
                                            <Text className="text-gray-800 text-left">
                                              {possessionBy || "Expected By"}
                                            </Text>
                                            <Ionicons name="chevron-down" size={24} color="#888" />
                                          </TouchableOpacity>
                                          {visible === "possessionBy" && (
                                            <View
                                              className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
                                              style={{ borderWidth: 1, borderColor: "#0000001A" }}
                                            >
                                              {[
                                                "Immediate",
                                                "Within 3 months",
                                                "Within 6 months",
                                                "By 2026",
                                                "By 2027",
                                                "By 2028",
                                                "By 2029",
                                                "By 2030"
                                              ].map((item) => (
                                                <TouchableOpacity
                                                  key={item}
                                                  onPress={() => {
                                                    setPossessionBy(item);
                                                    setVisible(null);
                                                  }}
                                                  className={`p-4 border-b border-gray-200 ${possessionBy === item ? "bg-green-500" : "bg-white"}`}
                                                >
                                                  <Text className={`${possessionBy === item ? "text-white" : "text-gray-800"}`}>{item}</Text>
                                                </TouchableOpacity>
                                              ))}
                                            </View>
                                          )}
    
    </>
  )}
</View>


      

      
    

      {/* h) Ownership */}
      <Text className="text-[15px] font-bold text-[#00000099] mb-2">Ownership</Text>
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

      {/* i) Expected Price Details */}
      <Text className="text-[15px] font-bold text-[#00000099] mt-3 mb-2">Expected Price</Text>
      <TextInput
        placeholder="Enter expected price"
        value={expectedPrice}
        onChangeText={setExpectedPrice}
        className="rounded-md p-3 mb-3"
        style={{ borderWidth: 1, borderColor: "#0000001A", height: 50, backgroundColor: "#D9D9D91C" }}
      />

      {/* j) Two Checkboxes */}
      <Checkbox
        label="Include Maintenance"
        selected={checkbox1}
        onPress={() => setCheckbox1(!checkbox1)}
      />
      <Checkbox
        label="Price Negotiable"
        selected={checkbox2}
        onPress={() => setCheckbox2(!checkbox2)}
      />
      <TouchableOpacity>
        <Text className="text-green-500 text-sm mt-2">+Add maintenance and booking Amount</Text>
      </TouchableOpacity>

      {/* k) PreReleased */}
      <Text className="text-[15px] font-bold text-[#00000099] mb-2 mt-2">Is it PreReleased?</Text>
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

      {/* l) Two Input Boxes */}
      <TextInput
        placeholder="Enter carpet area"
        value={input1}
        onChangeText={setInput1}
        className="rounded-md p-3 mb-3"
        style={{ borderWidth: 1, borderColor: "#0000001A", height: 50, backgroundColor: "#D9D9D91C" }}
      />
      <TextInput
        placeholder="Enter built-up area"
        value={input2}
        onChangeText={setInput2}
        className="rounded-md p-3 mb-3"
        style={{ borderWidth: 1, borderColor: "#0000001A", height: 50, backgroundColor: "#D9D9D91C" }}
      />

      {/* m) Description */}
      <Text className="text-[15px] font-bold text-[#00000099] mb-2">Describe Your Property</Text>
      <TextInput
        placeholder="Enter property description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className="rounded-md p-3 mb-3"
        style={{ borderWidth: 1, borderColor: "#0000001A", height: 108, paddingTop: 10 }}
      />

      {/* n) Amenities */}
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

      {/* o) Other Features + Safety Measures */}
      <Text className="text-[15px] font-bold text-[#00000099] mb-2">Other Features</Text>
      <Checkbox
        label="Corner Property"
        selected={otherFeature1}
        onPress={() => setOtherFeature1(!otherFeature1)}
      />
      <Checkbox
        label="Vastu Compliant"
        selected={otherFeature2}
        onPress={() => setOtherFeature2(!otherFeature2)}
      />

      <Text className="text-[15px] font-bold text-[#00000099] mb-2 mt-2">Safety Measures</Text>
      <View className="flex-row flex-wrap">
        {safetyOptions.map((option) => (
          <PillButton
            key={option}
            label={option}
            selected={safetyMeasures.includes(option)}
            onPress={() =>
              toggleSelection(option, setSafetyMeasures, safetyMeasures)
            }
          />
        ))}
      </View>

      {/* p) Property Facing */}
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

      {/* q) Width of Facing Road */}
      <Text className="text-[15px] font-bold text-[#00000099] mb-2 mt-3">Width of Facing Road</Text>
      <View className="flex-row items-center mb-3 rounded-md" style={{ borderWidth: 1, borderColor: "#0000001A", backgroundColor: "#D9D9D91C", height: 52 }}>
        <TextInput
          placeholder="Enter width"
          value={roadWidth}
          onChangeText={setRoadWidth}
          className="flex-1 px-3"
          style={{ height: 52 }}
          keyboardType="numeric"
        />
        <View style={{ width: 1, backgroundColor: "#0000001A", height: "60%" }} />
        <View style={{ width: 100 }}>
          <Picker selectedValue={roadWidthUnit} onValueChange={(v) => setRoadWidthUnit(v)} mode="dropdown" style={{ height: 52, width: "100%" }}>
            <Picker.Item label="ft" value="ft" />
            <Picker.Item label="m" value="m" />
          </Picker>
        </View>
      </View>

      {/* r) Location Advantages */}
      <Text className="text-[15px] font-bold text-[#00000099] mb-2">Location Advantages</Text>
      <View className="flex-row flex-wrap">
        {locationAdvOptions.map((option) => (
          <PillButton
            key={option}
            label={option}
            selected={locationAdvantages.includes(option)}
            onPress={() =>
              toggleSelection(option, setLocationAdvantages, locationAdvantages)
            }
          />
        ))}
      </View>
        </View>

        {/* s) Buttons */}

      </ScrollView>
    </View>
  );
}