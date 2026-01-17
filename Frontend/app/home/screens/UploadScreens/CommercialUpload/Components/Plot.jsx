

// Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/Plot.jsx

import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
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
  const params = useLocalSearchParams();

  // ✅ Parse params safely
  const safeParse = (raw) => {
    if (!raw) return null;
    if (typeof raw === 'string') {
      try { return JSON.parse(raw); } catch (e) { return null; }
    }
    if (Array.isArray(raw)) {
      const first = raw[0];
      if (typeof first === 'string') {
        try { return JSON.parse(first); } catch (e) { return null; }
      }
      return first;
    }
    if (typeof raw === 'object') return raw;
    return null;
  };

  const images = params.images ? safeParse(params.images) || [] : [];
  const baseDetails = safeParse(params.commercialBaseDetails);
  const propertyTitle = baseDetails?.propertyTitle || params.propertyTitle || "";
  
  // ✅ Get plotKind from multiple sources - ADD MORE FALLBACKS
  const plotKindFromParams = baseDetails?.plotKind || 
                             params.plotKind || 
                             safeParse(params.plotDetails)?.plotKind || 
                             '';
  
  console.log('🔍 Plot.jsx mounted - plotKindFromParams:', plotKindFromParams);
  console.log('🔍 Plot.jsx mounted - baseDetails:', baseDetails);
  console.log('🔍 Plot.jsx mounted - params.plotKind:', params.plotKind);

  /* ---------- STATE ---------- */
  const [location, setLocation] = useState("");
  const [locality, setLocality] = useState("");
  const [neighborhoodArea, setNeighborhoodArea] = useState("");
  const [plotArea, setPlotArea] = useState("");
const [plotKind, setPlotKind] = useState(plotKindFromParams || ""); // ✅ Initialize with params value
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [roadWidth, setRoadWidth] = useState("");
  const [openSides, setOpenSides] = useState("");
  const [constructionDone, setConstructionDone] = useState("");
  const [possessionYear, setPossessionYear] = useState("");
  const [possessionMonth, setPossessionMonth] = useState("");
  const [constructionTypes, setConstructionTypes] = useState([]);
  const [focusedField, setFocusedField] = useState(null);

  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const toggleConstruction = (value) => {
    if (constructionTypes.includes(value)) {
      setConstructionTypes(constructionTypes.filter(v => v !== value));
    } else {
      setConstructionTypes([...constructionTypes, value]);
    }
  };

  // ✅ Load draft from AsyncStorage on mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        console.log("📦 Loading Plot draft from AsyncStorage");
        const draft = await AsyncStorage.getItem('draft_plot_details');
        if (draft) {
          const parsed = JSON.parse(draft);
          console.log('✅ Plot draft loaded:', parsed);
          
          setLocation(parsed.location || '');
          setLocality(parsed.locality || '');
          setNeighborhoodArea(parsed.neighborhoodArea || params.area || '');
          setPlotArea(parsed.plotArea?.toString() || '');
          setLength(parsed.length?.toString() || '');
          setBreadth(parsed.breadth?.toString() || '');
          setRoadWidth(parsed.roadWidth?.toString() || '');
          setOpenSides(parsed.openSides || '');
          setConstructionDone(parsed.constructionDone || '');
          setPossessionYear(parsed.possessionYear || '');
          setPossessionMonth(parsed.possessionMonth || '');
          setConstructionTypes(parsed.constructionTypes || []);
          // ✅ ADD THIS - Restore plotKind from draft OR params
         // ✅ Restore plotKind (priority: draft > params > state)
const restoredPlotKind = parsed.plotKind || plotKindFromParams;
if (restoredPlotKind) {
  setPlotKind(restoredPlotKind);
}
console.log('✅ plotKind restored:', restoredPlotKind);

          console.log('✅ Plot draft loaded successfully');
          console.log('✅ plotKind restored:', parsed.plotKind || plotKindFromParams);

          return;
        }
      } catch (e) {
        console.log('⚠️ Failed to load Plot draft:', e);
      }

      // ✅ FALLBACK: Load from params if no draft
      if (params.plotDetails) {
        try {
          const prevData = safeParse(params.plotDetails);
          console.log('🔄 Restoring from params.plotDetails');
          
          setLocation(prevData.location || '');
          setLocality(prevData.locality || '');
          setNeighborhoodArea(prevData.neighborhoodArea || params.area || '');
          setPlotArea(prevData.plotArea?.toString() || '');
          setLength(prevData.length?.toString() || '');
          setBreadth(prevData.breadth?.toString() || '');
          setRoadWidth(prevData.roadWidth?.toString() || '');
          setOpenSides(prevData.openSides || '');
          setConstructionDone(prevData.constructionDone || '');
          setPossessionYear(prevData.possessionYear || '');
          setPossessionMonth(prevData.possessionMonth || '');
          setConstructionTypes(prevData.constructionTypes || []);
        } catch (e) {
          console.log('❌ Could not restore plot data:', e);
        }
      }
      
      // ✅ FIX: Always restore area from params if available
      if (params.area) {
        setNeighborhoodArea(params.area);
        console.log('✅ Area restored from params:', params.area);
      }
      
      // ✅ ADD THIS: Log plotKind to verify it exists
      console.log('✅ Final plotKindFromParams check:', plotKindFromParams);
    };

    loadDraft();
  }, [params.plotDetails, params.area, plotKindFromParams]); // ✅ ADD plotKindFromParams to dependencies

  // ✅ Auto-save draft to AsyncStorage
  useEffect(() => {
    const saveDraft = async () => {
      // ✅ Load existing draft first to preserve plotKind
      let existingPlotKind = plotKindFromParams;
      
      try {
        const existingDraft = await AsyncStorage.getItem('draft_plot_details');
        if (existingDraft) {
          const parsed = JSON.parse(existingDraft);
          // ✅ If current plotKind is empty but draft has one, keep the draft's plotKind
          if (!plotKindFromParams && parsed.plotKind) {
            existingPlotKind = parsed.plotKind;
          }
        }
      } catch (e) {
        console.log('⚠️ Could not load existing draft:', e);
      }
      
      const draftData = {
        location,
        locality,
        neighborhoodArea,
        plotArea,
        length,
        breadth,
        roadWidth,
        openSides,
        constructionDone,
        possessionYear,
        possessionMonth,
        constructionTypes,
        plotKind: existingPlotKind || plotKindFromParams, // ✅ Preserve plotKind
        timestamp: new Date().toISOString(),
      };

      try {
        await AsyncStorage.setItem('draft_plot_details', JSON.stringify(draftData));
        console.log('💾 Plot draft auto-saved with plotKind:', existingPlotKind || plotKindFromParams);
      } catch (e) {
        console.log('⚠️ Failed to save Plot draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [location, locality, neighborhoodArea, plotArea, length, breadth, roadWidth, 
      openSides, constructionDone, possessionYear, possessionMonth, constructionTypes, plotKindFromParams]);

  const handleNext = () => {
    const finalPlotKind = plotKind || plotKindFromParams; // ✅ Check state first, then params
    
    console.log('🔍 handleNext - plotKind (state):', plotKind);
    console.log('🔍 handleNext - plotKindFromParams:', plotKindFromParams);
    console.log('🔍 handleNext - finalPlotKind:', finalPlotKind);
    
    if (!finalPlotKind) {
      console.log('❌ Plot kind is missing!');
      Toast.show({
        type: "error",
        text1: "Plot kind is missing",
        text2: "Please go back and select plot type",
      });
      return;
    }

    if (!location.trim() || !neighborhoodArea.trim() || !plotArea.trim() || !length || !breadth || !roadWidth) {
      Toast.show({
        type: "error",
        text1: "All required fields must be filled",
      });
      return;
    }

    const commercialDetails = {
      subType: "Plot/Land",
      propertyTitle,
      plotDetails: {
        location,
        locality,
        neighborhoodArea,
        area: Number(plotArea),
        dimensions: {
          length: Number(length),
          breadth: Number(breadth),
        },
        roadWidth: Number(roadWidth),
        openSides,
        constructionDone,
        constructionTypes,
        possession: possessionYear.length === 4
          ? { year: possessionYear, month: possessionMonth }
          : null,
        plotKind: finalPlotKind, // ✅ ADD THIS
      },
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/PlotNext",
      params: {
        commercialDetails: JSON.stringify(commercialDetails),
        propertyTitle,
        images: JSON.stringify(images),
        area: neighborhoodArea,
        plotKind: plotKindFromParams,
      },
    });
  };

  const handleBack = () => {
    const currentData = {
      location,
      locality,
      neighborhoodArea,
      plotArea,
      length,
      breadth,
      roadWidth,
      openSides,
      constructionDone,
      possessionYear,
      possessionMonth,
      constructionTypes,
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload",
      params: {
        plotKind: plotKindFromParams,
        plotDetails: JSON.stringify({
          ...currentData,
          plotKind: plotKindFromParams,
        }),
        images: JSON.stringify(images),
        area: neighborhoodArea,
        propertyTitle,
        commercialBaseDetails: JSON.stringify({
          subType: "Plot/Land",
          plotKind: plotKindFromParams,
          propertyTitle,
        }),
      },
    });
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        
        {/* HEADER */}
        <View className="flex-row items-center mt-6 mb-4">
          <TouchableOpacity 
            onPress={handleBack}
            className="p-2"
          >
            <Image
              source={require("../../../../../../assets/arrow.png")}
              className="w-5 h-5"
            />
          </TouchableOpacity>
          <View className="ml-2">
            <Text className="text-[16px] font-semibold">Upload Your Property</Text>
            <Text className="text-[12px] text-[#00000066]">Add your property details</Text>
          </View> 
        </View>

        {/* LOCATION */}
        <LocationSection
          location={location}
          setLocation={setLocation}
          locality={locality}
          setLocality={setLocality}
        />

        {/* AREA/NEIGHBORHOOD FIELD */}
        <View className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] mt-4">
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            Area/Neighborhood<Text className="text-red-500">*</Text>
          </Text>
          <View
            className="flex-row items-center rounded-md p-3 mb-3"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "neighborhoodArea" ? "#22C55E" : "#E5E7EB",
              backgroundColor: "#D9D9D91C",
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

        {/* WHITE CARD */}
        <View className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] mt-4">

          {/* AREA */}
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            Add Area Details<Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row items-center h-[52px] px-3 mb-3 border rounded-[12px]"
                style={{
                  borderWidth: 2,
                  borderColor: focusedField === "plotArea" ? "#22C55E" : "#E5E7EB",
                }}>
            <TextInput
              placeholder="Plot Area"
              value={plotArea}
              onChangeText={(t) => setPlotArea(t.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              className="flex-1 text-[14px]"
              onFocus={() => setFocusedField("plotArea")}
              onBlur={() => setFocusedField(null)}
            />
            <Text className="text-[#6B7280]">sqft</Text>
          </View>

          {/* DIMENSIONS */}
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            Property Dimensions (optional) <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder="Length of plot (ft)"
            value={length}
            onChangeText={(t) => setLength(t.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            className="border rounded-[12px] p-3 mb-2"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "length" ? "#22C55E" : "#E5E7EB",
            }}
            onFocus={() => setFocusedField("length")}
            onBlur={() => setFocusedField(null)}
          />
          <TextInput
            placeholder="Breadth of plot (ft)"
            value={breadth}
            onChangeText={(t) => setBreadth(t.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            className="border rounded-[12px] p-3 mb-3"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "breadth" ? "#22C55E" : "#E5E7EB",
            }}
            onFocus={() => setFocusedField("breadth")}
            onBlur={() => setFocusedField(null)}
          />

          {/* ROAD WIDTH */}
          <Text className="text-[13px] font-semibold text-[#374151] mb-1">
            Width of facing road<Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row items-center h-[52px] px-3 mb-3 border rounded-[12px]"
                style={{
                  borderWidth: 2,
                  borderColor: focusedField === "roadWidth" ? "#22C55E" : "#E5E7EB",
                }}>
            <TextInput
              placeholder="Enter the width"
              value={roadWidth}
              onChangeText={(t) => setRoadWidth(t.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              className="flex-1"
              onFocus={() => setFocusedField("roadWidth")}
              onBlur={() => setFocusedField(null)}
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
            onChangeText={(t) => setPossessionYear(t.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            className="border rounded-[12px] p-3 mb-2"
            style={{
              borderWidth: 2,
              borderColor: focusedField === "possessionYear" ? "#22C55E" : "#E5E7EB",
            }}
            onFocus={() => setFocusedField("possessionYear")}
            onBlur={() => setFocusedField(null)}
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
      <View className="bg-white border-t border-gray-200">
        <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-12">
          <TouchableOpacity
            className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
            onPress={handleBack}
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
    </View>
  );
}