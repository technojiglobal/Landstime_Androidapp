import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LocationSection from "components/LocationSection";
import Toast from "react-native-toast-message";

/* ---------- UI HELPERS ---------- */
const PillButton = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-[14px] py-[6px] rounded-full border mr-2 mb-2 ${
      selected
        ? "border-[#22C55E] bg-[#22C55E17]"
        : "border-[#E5E7EB] bg-white"
    }`}
  >
    <Text className={`text-[12px] ${selected ? "text-[#22C55E]" : "text-[#6B7280]"}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function Plot() {
  const router = useRouter();

  /* ---------- STATE ---------- */
  const [location, setLocation] = useState("");
  const [locality, setLocality] = useState("");
  const [plotArea, setPlotArea] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [roadWidth, setRoadWidth] = useState("");
  const [openSides, setOpenSides] = useState("");
  const [constructionDone, setConstructionDone] = useState("");
  const [possessionYear, setPossessionYear] = useState("");
  const [possessionMonth, setPossessionMonth] = useState("");
  const [constructionTypes, setConstructionTypes] = useState([]);


  const monthOptions = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
 const constructionOptions = [
  "+ Shed",
  "+ Room(s)",
  "+ Washroom",
  "+ Other",
];
const toggleConstruction = (value) => {
  if (constructionTypes.includes(value)) {
    setConstructionTypes(constructionTypes.filter(v => v !== value));
  } else {
    setConstructionTypes([...constructionTypes, value]);
  }
};

  /* ---------- NEXT ---------- */
  const handleNext = () => {
    if (!location.trim()) {
      Toast.show({ type: "error", text1: "Location required" });
      return;
    }
    if (!plotArea.trim()) {
      Toast.show({ type: "error", text1: "Plot area required" });
      return;
    }
    router.push("/home/screens/UploadScreens/CommercialUpload/Components/PlotNext");
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        
        {/* HEADER */}
        <View className="flex-row items-center mt-6 mb-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Image
              source={require("../../../../../../assets/arrow.png")}
              className="w-5 h-5"
            />
          </TouchableOpacity>
          <View className="ml-2">
            <Text className="text-[16px] font-semibold">Upload Your Property</Text>
            <Text className="text-[12px] text-[#00000066]">
              Add your property details
            </Text>
          </View>
        </View>

        {/* LOCATION */}
        <LocationSection
          location={location}
          setLocation={setLocation}
          locality={locality}
          setLocality={setLocality}
        />

        {/* ================= WHITE CARD ================= */}
        <View className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] mt-4">

          {/* AREA */}
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            Add Area Details
          </Text>
          <View className="flex-row items-center h-[52px] px-3 mb-3 border border-[#E5E7EB] rounded-[12px]">
            <TextInput
              placeholder="Plot Area"
              value={plotArea}
              onChangeText={setPlotArea}
              keyboardType="numeric"
              className="flex-1 text-[14px]"
            />
            <Text className="text-[#6B7280]">sqft</Text>
          </View>

          {/* DIMENSIONS */}
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            Property Dimensions (optional)
          </Text>
          <TextInput
            placeholder="Length of plot (ft)"
            value={length}
            onChangeText={setLength}
            className="border border-[#E5E7EB] rounded-[12px] p-3 mb-2"
          />
          <TextInput
            placeholder="Breadth of plot (ft)"
            value={breadth}
            onChangeText={setBreadth}
            className="border border-[#E5E7EB] rounded-[12px] p-3 mb-3"
          />

          {/* ROAD WIDTH */}
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            Width of facing road
          </Text>
          <View className="flex-row items-center h-[52px] px-3 mb-3 border border-[#E5E7EB] rounded-[12px]">
            <TextInput
              placeholder="Enter the width"
              value={roadWidth}
              onChangeText={setRoadWidth}
              keyboardType="numeric"
              className="flex-1"
            />
            <Text className="text-[#6B7280]">Feet</Text>
          </View>

          {/* OPEN SIDES */}
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            No. of open sides
          </Text>
          <View className="flex-row mb-3">
            {["1", "2", "3", "4"].map(n => (
              <PillButton
                key={n}
                label={n}
                selected={openSides === n}
                onPress={() => setOpenSides(n)}
              />
            ))}
          </View>

          {/* CONSTRUCTION */}
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            Any construction done on this property?
          </Text>
          <View className="flex-row mb-3">
            <PillButton
              label="Yes"
              selected={constructionDone === "Yes"}
              onPress={() => setConstructionDone("Yes")}
            />
            <PillButton
              label="No"
              selected={constructionDone === "No"}
              onPress={() => setConstructionDone("No")}
            />
          </View>

          {/* POSSESSION */}
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            Possession By
          </Text>
          <TextInput
            placeholder="Year"
            value={possessionYear}
            onChangeText={setPossessionYear}
            keyboardType="numeric"
            className="border border-[#E5E7EB] rounded-[12px] p-3 mb-2"
          />

          {possessionYear.length === 4 && (
            <View className="border border-[#E5E7EB] rounded-[12px]">
              {monthOptions.map(m => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setPossessionMonth(m)}
                  className="p-3 border-b border-[#E5E7EB]"
                >
                  <Text>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <Text className="text-sm font-semibold mb-2">
        What type of construction has been done?
      </Text>

      <View className="flex-row flex-wrap">
        {["+ Shed", "+ Room(s)", "+ Washroom", "+ Other"].map(item => (
          <PillButton
            key={item}
            label={item}
            selected={constructionTypes.includes(item)}
            onPress={() => toggleConstruction(item)}
          />
        ))}
      </View>
    
        </View>
      
      
      </ScrollView>

      {/* FOOTER */}
      <View className="flex-row p-4 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-1 mr-3 bg-[#E5E7EB] py-3 items-center rounded-md"
        >
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          className="flex-1 bg-[#22C55E] py-3 items-center rounded-md"
        >
          <Text className="text-white font-semibold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
