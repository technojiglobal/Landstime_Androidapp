// Frontend/app/home/screens/UploadScreens/CommercialUpload/index.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import PropertyImageUpload from "components/PropertyImageUpload";
import TopAlert from "../TopAlert";

import Office from "./Components/Office";
import Plot from "./Components/Plot";
import Retail from "./Components/Retail";
import Industry from "./Components/Industry";
import Storage from "./Components/Storage";
import Hospitality from "./Components/Hospitality";
import Other from "./Components/Other";

/* ---------------- PILL BUTTON ---------------- */
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

/* ---------------- MAIN SCREEN ---------------- */
export default function PropertyFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  /* ---------- STATES ---------- */
  const [propertyTitle, setPropertyTitle] = useState(
    params.propertyTitle || ""
  );
  const [propertyType, setPropertyType] = useState("Commercial");
  const [visible, setVisible] = useState(null);

  const [images, setImages] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [storageKinds, setStorageKinds] = useState([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [isHowto360ModalVisible, setIsHowto360ModalVisible] = useState(false);
  const [isPhotoGuideModalVisible, setIsPhotoGuideModalVisible] =
    useState(false);

  /* ---------- CONSTANTS ---------- */
  const typePills = [
    "Office",
    "Retail",
    "Plot/Land",
    "Storage",
    "Industry",
    "Hospitality",
    "Other",
  ];

  const officeKindPills = [
    "Ready to move office space",
    "Bare shell office space",
    "Co-working office space",
  ];
   const storageKindPills = [
    "Warehouse",
    "Cold Storage",
  ];


  /* ---------- IMAGE HANDLERS ---------- */
  const pickImage = (uri) => {
    setImages((prev) => [...prev, uri]);
  };

  const removeImage = (uri) => {
    setImages((prev) => prev.filter((img) => img !== uri));
  };

  /* ---------- NEXT HANDLER ---------- */
  const handleNext = () => {
    if (!selectedType) {
      Alert.alert("Select Property Type", "Please select a property type");
      return;
    }

    const base = "/home/screens/UploadScreens/CommercialUpload/Components";

    switch (selectedType) {
      case "Office":
        router.push(`${base}/Office`);
        break;
      case "Retail":
        router.push(`${base}/Retail`);
        break;
      case "Plot/Land":
        router.push(`${base}/Plot`);
        break;
      case "Industry":
        router.push(`${base}/Industry`);
        break;
      case "Storage":
        router.push(`${base}/Storage`);
        break;
      case "Hospitality":
        router.push(`${base}/Hospitality`);
        break;
      case "Other":
        router.push(`${base}/Other`);
        break;
      default:
        break;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <TopAlert
        visible={alertVisible}
        onHide={() => setAlertVisible(false)}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- HEADER ---------- */}
        <View className="flex-row items-center mt-7 mb-4">
          <TouchableOpacity
            onPress={() =>
              router.push("/home/screens/UploadScreens/AddScreen")
            }
            className="p-2"
          >
            <Image
              source={require("../../../../../assets/arrow.png")}
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

        {/* ---------- IMAGE UPLOAD ---------- */}
        <PropertyImageUpload
          images={images}
          onPickImage={pickImage}
          onRemoveImage={removeImage}
          onViewGuidelines={() => setIsPhotoGuideModalVisible(true)}
          onWatchTutorial={() => setIsHowto360ModalVisible(true)}
        />

        {/* ---------- BASIC DETAILS ---------- */}
        <View
          className="bg-white rounded-lg p-4 mb-4"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="text-[16px] font-bold mb-5">Basic Details</Text>

          <Text className="text-[15px] text-[#00000099] mb-2">
            Property Title
          </Text>
          <TextInput
            placeholder="Surya Teja Sites"
            value={propertyTitle}
            onChangeText={setPropertyTitle}
            className="rounded-md p-3 mb-3"
            style={{
              borderWidth: 1,
              borderColor: "#0000001A",
              height: 50,
              backgroundColor: "#D9D9D91C",
            }}
          />

          <Text className="text-[15px] text-[#00000099] font-bold mb-2">
            Property Type
          </Text>
          <TouchableOpacity
            onPress={() =>
              setVisible(visible === "propertyType" ? null : "propertyType")
            }
            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300"
          >
            <Text>{propertyType}</Text>
            <Ionicons name="chevron-down" size={20} />
          </TouchableOpacity>
          <Text className="text-[15px] text-[#00000099] font-bold mt-4 mb-2">
          Select Property Type
        </Text>
        <View className="flex-row flex-wrap mb-4">
          {typePills.map((p) => (
            <PillButton
              key={p}
              label={p}
              selected={selectedType === p}
              onPress={() => setSelectedType(p)}
            />
          ))}
        </View>
        {selectedType === "Office" && (
          <>
            <Text className="text-[15px] text-[#00000099] font-bold mb-2">
              What kind of office is it ?
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
           
          </>
        )}
        </View>

        {/* ---------- SELECT COMMERCIAL TYPE ---------- */}
        

        {/* ---------- OFFICE SUB TYPE ---------- */}
        

        {selectedType === "Retail" && <Retail />}
        {selectedType === "Plot/Land" && <Plot />}
        {selectedType === "Industry" && <Industry />}
        {selectedType === "Storage" &&
        (
          <>
            <Text className="text-[15px] text-[#00000099] font-bold mb-2">
              What kind of storage is it ?
            </Text>
            <View className="flex-row flex-wrap mb-4">
              {storageKindPills.map((p) => (
                <PillButton
                  key={p}
                  label={p}
                  selected={storageKinds.includes(p)}
                  onPress={() => setStorageKinds([p])}
                />
              ))}
            </View>
           
          </>
        )
        }
        {selectedType === "Hospitality" && <Hospitality />}
        {selectedType === "Other" && <Other />}

        {/* ---------- ACTION BUTTONS ---------- */}
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
      </ScrollView>
    </View>
  );
}
