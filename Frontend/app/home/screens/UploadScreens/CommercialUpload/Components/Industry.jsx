//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/Industry.jsx

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
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Toast from 'react-native-toast-message';

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
    <Text className={`text-sm ${selected ? "text-green-700 font-semibold" : "text-[rgba(0,0,0,0.6)]"}`}>
      {label}
    </Text>
  </TouchableOpacity>
);





export default function PropertyFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const images = params.images ? JSON.parse(params.images) : [];
  const [visible, setVisible] = useState(null);
  const [focusedField, setFocusedField] = useState(null);


  // Location
  const [location, setLocation] = useState('');


  // Area
  const [plotArea, setPlotArea] = useState('');
  const [unit, setUnit] = useState('sqft');
  const [length, setLength] = useState('');
  const [breadth, setBreadth] = useState('');
  const [rooms, setRooms] = useState(0);
  const [washroomType, setWashroomType] = useState(null);
  

  // Availability
  const [availability, setAvailability] = useState(null);
  const [ageOfProperty, setAgeOfProperty] = useState(null);
  const [possessionBy, setPossessionBy] = useState("");

  
   const handleNext = () => {
  if (!location.trim()) {
    Toast.show({
      type: "error",
      text1: "Location Required",
      text2: "Please enter the property location",
    });
    return;
  }

  if (!plotArea.trim()) {
    Toast.show({
      type: "error",
      text1: "Area Required",
      text2: "Please enter the area",
    });
    return;
  }

  const commercialDetails = {
    subType: "Industry",
    
    industryDetails: {
      location,
      area: {
        value: Number(plotArea),
        unit,
      },
      washroomType,
      availability,
      ageOfProperty,
      possessionBy,
    },
  };

  router.push({
  pathname:
    "/home/screens/UploadScreens/CommercialUpload/Components/IndustryNext",
  params: {
    commercialDetails: JSON.stringify(commercialDetails),
    images: JSON.stringify(images), // ✅ ADD THIS
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
            onPress={() => router.push({
  pathname: "/home/screens/UploadScreens/CommercialUpload",
  params: {
    images: JSON.stringify(images),
  }
})}
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


        </View>
          

        {/* Area & Details Box */}
        <View
          className="bg-white rounded-lg p-4 mb-6"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="text-[16px]  font-bold text-gray-600 mb-2">
            Add Room Details
          </Text>

          
            <Text className="text-[14px] text-gray-500 mr-4">
              No of Wash Rooms
            </Text>

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


          <Text className="text-[14px] font-medium text-[#00000099] mb-3">
            Add Area Details<Text className="text-red-500">*</Text>
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

         

          {/* Add Room Details */}
        
         

          
           
              
            
       


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

        </View>
        
          
      </ScrollView>
      <View className="bg-white border-t border-gray-200">
      <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-12">
            <TouchableOpacity
              className="px-8 py-3 rounded-lg bg-gray-200 mx-3"
              onPress={() => router.back()}
            >
              <Text className="font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-10 py-3 rounded-lg bg-green-500"
              onPress={ handleNext}
            >
              <Text className="text-white font-semibold">Next</Text>
            </TouchableOpacity>
          </View>
          </View>
    </View>
  );
}
