import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Toast from 'react-native-toast-message';
import FurnishingsModal from "../../FurnishingsModal";
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
            className={`text-sm ${selected ? "text-green-700 font-semibold" : "text-[rgba(0,0,0,0.6)]"
                }`}
        >
            {label}
        </Text>
    </TouchableOpacity>
);




export default function Hospitality() {
    const router = useRouter();
    /* ---------- VALIDATION ---------- */
const handleNext = (location, plotArea, router) => {
  if (!location.trim()) {
    Toast.show({ type: "error", text1: "Location Required" });
    return;
  }
  if (!plotArea.trim()) {
    Toast.show({ type: "error", text1: "Area Required" });
    return;
  }

  const commercialDetails = {
    subType: "Hospitality",
    hospitalityDetails: {
      location,
      rooms,
      washroomType,
      balconies,
      otherRooms,
      furnishingType,
      furnishingDetails,
      area: Number(plotArea),
      areaUnit: unit,
      availability,
      ageOfProperty,
      possessionBy,
      expectedMonth,
    },
  };

  router.push({
    pathname:
      "/home/screens/UploadScreens/CommercialUpload/Components/HospitalityNext",
    params: {
      commercialDetails: JSON.stringify(commercialDetails),
    },
  });
};
    const [focusedField, setFocusedField] = useState(null);
    const [visible, setVisible] = useState(null);

    /* ---------- STATE ---------- */
    const [location, setLocation] = useState("");
    const [plotArea, setPlotArea] = useState("");
    const [unit, setUnit] = useState("sqft");

    const [rooms, setRooms] = useState("");
    const [washroomType, setWashroomType] = useState(null);
    const [balconies, setBalconies] = useState(null);
    const [otherRooms, setOtherRooms] = useState([]);

   const [modalOpen, setModalOpen] = useState(false);
     const [furnishingType, setFurnishingType] = useState("Unfurnished");
     const [furnishingDetails, setFurnishingDetails] = useState([]);
     const [modalSubtitle, setModalSubtitle] = useState("");
    const [availability, setAvailability] = useState(null);
    const [ageOfProperty, setAgeOfProperty] = useState(null);
    const [possessionBy, setPossessionBy] = useState("");
    const [expectedMonth, setExpectedMonth] = useState("");
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);

    const toggleOtherRoom = (room) => {
        setOtherRooms((prev) =>
            prev.includes(room)
                ? prev.filter((r) => r !== room)
                : [...prev, room]
        );
    };

    const possessionOptions = [
        "Immediate",
        "Within 3 months",
        "Within 6 months",
        "By 2025",
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

   

    return (
        
        <View className="flex-1 bg-gray-50">
            <FurnishingsModal
              visible={modalOpen}
              onClose={() => setModalOpen(false)}
              subtitle={modalSubtitle}
              onSubmit={(data) => {
                // Convert quantities and extras to a flat array
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
                        onPress={() => router.push("/home/screens/UploadScreens/CommercialUpload")
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

                {/* LOCATION */}
                <View className="bg-white rounded-lg p-4 mb-4 border border-[#0000001A]">
                    <Text className="text-[15px] text-[#00000060] mb-3">
                        Location<Text className="text-red-500">*</Text>
                    </Text>

                    <View className="flex-row items-center bg-[#D9D9D91C] rounded-md p-3">
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
                            className="flex-1"
                            style={{
                                borderWidth: 1,
                                borderColor:
                                    focusedField === "location" ? "#22C55E" : "#0000001A",
                            }}
                        />
                    </View>
                </View>

                {/* ADD ROOM DETAILS */}
                <View className="bg-white rounded-lg p-4 mb-6 border border-[#0000001A]">
                    <Text className="text-[16px] font-bold text-gray-600 mb-2">
                        Add Room Details
                    </Text>

                    {/* ROOMS */}
                    <Text className="text-[14px] text-gray-500 mb-2">
                        No of Rooms
                    </Text>



                    <TextInput
                        placeholder="Enter the total no of rooms"
                        value={rooms}
                        onChangeText={(t) => setRooms(t.replace(/[^0-9]/g, ""))}
                        keyboardType="numeric"
                        className="border border-[#0000001A] rounded-md px-3 py-3 mb-4 bg-[#D9D9D91C]"
                    />

                    {/* WASHROOMS */}
                    <Text className="text-[14px] text-gray-500 mb-2">
                        No of Washrooms
                    </Text>
                    <View className="flex-row mb-4">
                        <PillButton label="None" selected={washroomType === "None"} onPress={() => setWashroomType("None")} />
                        <PillButton label="Shared" selected={washroomType === "Shared"} onPress={() => setWashroomType("Shared")} />
                        {["1", "2", "3", "4+"].map((n) => (
                            <RoundOption key={n} label={n} selected={washroomType === n} onPress={() => setWashroomType(n)} />
                        ))}
                    </View>

                    {/* BALCONIES */}
                    <Text className="text-[14px] text-gray-500 mb-2">Balconies</Text>
                    <View className="flex-row mb-4">
                        {["0", "1", "2", "3", "More than 3"].map((b) => (
                            <PillButton
                                key={b}
                                label={b}
                                selected={balconies === b}
                                onPress={() => setBalconies(b)}
                            />
                        ))}
                    </View>

                    {/* OTHER ROOMS */}
                    <Text className="text-[14px] text-gray-500 mb-2">
                        Other rooms (optional)
                    </Text>
                    <View className="flex-row flex-wrap mb-4">
                        {["Pooja Room", "Study Room", "Servant Room", "Other"].map((room) => (
                            <PillButton
                                key={room}
                                label={room}
                                selected={otherRooms.includes(room)}
                                onPress={() => toggleOtherRoom(room)}
                            />
                        ))}
                    </View>

                    {/* FURNISHING */}
                     <Text className="text-lg font-semibold text-gray-800 ">
                                            Furnishing{" "}
                                            <Text className="text-gray-400 text-sm">
                                              (Optional)
                                            </Text>
                                          </Text>
                    
                                          <View className="flex-row gap-2 mt-2 mb-4">
                                            {["Unfurnished", "Semi-furnished", "Furnished"].map(
                                              (type) => (
                                                <TouchableOpacity
                                                  key={type}
                                                  onPress={() => {
                                                    setFurnishingType(type);
                    
                                                    if (type === "Furnished") {
                                                      setModalSubtitle(
                                                        "At least 3 selections are mandatory"
                                                      );
                                                      setModalOpen(true);
                                                    } else if (type === "Semi-furnished") {
                                                      setModalSubtitle(
                                                        "At least 1 selection is mandatory"
                                                      );
                                                      setModalOpen(true);
                                                    } else {
                                                      // Unfurnished
                                                      setFurnishingDetails([]);
                                                    }
                                                  }}
                                                  className={`rounded-full px-4 py-2 border ${
                                                    furnishingType === type
                                                      ? "border-green-500 bg-green-50"
                                                      : "border-gray-300"
                                                  }`}
                                                >
                                                  <Text
                                                    className={`${
                                                      furnishingType === type
                                                        ? "text-green-700"
                                                        : "text-gray-600"
                                                    }`}
                                                  >
                                                    {type}
                                                  </Text>
                                                </TouchableOpacity>
                                              )
                                            )}
                                          </View>

                    {/* AREA */}
                    <Text className="text-[14px] font-bold text-[#00000099] mb-2">
                        Add Area Details<Text className="text-red-500">*</Text>
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
                            <Picker.Item label="sqft" value="sqft" />
                            <Picker.Item label="sqm" value="sqm" />
                            <Picker.Item label="acre" value="acre" />
                        </Picker>
                    </View>

                    {/* AVAILABILITY */}
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
                                                if (item.startsWith("By ")) {
                                                  setShowMonthDropdown(true);
                                                } else {
                                                  setShowMonthDropdown(false);
                                                  setExpectedMonth("");
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
                    
                </View>
            </ScrollView>

            {/* FOOTER */}
            <View className="bg-white border-t border-gray-200">
                <View className="flex-row justify-end mt-4 mx-3 mb-12">
                    <TouchableOpacity className="px-8 py-3 rounded-lg bg-gray-200 mx-3">
                        <Text className="font-semibold">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="px-10 py-3 rounded-lg bg-green-500"
                        onPress={() => handleNext(location, plotArea, router)}
                    >
                        <Text className="text-white font-semibold">Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
