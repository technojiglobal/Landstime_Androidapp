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
  const [officeKinds, setOfficeKinds] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [storageKinds, setStorageKinds] = useState([]);
  const [industryKinds, setIndustryKinds] = useState([]);
  const [HospitalityKinds, setHospitalityKinds] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [locatedInside, setLocatedInside] = useState("");
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

  const retailTypeOptions = [
    "Commercial Shop",
    "Commercial Showroom",
  ];
  const industryKindPills = [
    "Factory",
    "Manufacturing",
  ];
  const hospitalityKindPills = [
    "Hotel/Resorts",
    "Guest-House/Banquet-Halls"
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
       <View className="flex-row items-center mt-12 mb-4 ml-4">
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


      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- HEADER ---------- */}
       
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
          {selectedType === "Industry" && (
          <>
            <Text className="text-[15px] text-[#00000099] font-bold mb-2">
              What kind of industry is it ?
            </Text>
            <View className="flex-row flex-wrap mb-4">
              {industryKindPills.map((p) => (
                <PillButton
                  key={p}
                  label={p}
                  selected={industryKinds.includes(p)}
                  onPress={() => setIndustryKinds([p])}
                />
              ))}
            </View>
           
          </>
         )}
          {selectedType === "Retail" && (
            <>
              <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                What kind of office  is it?
              </Text>

              <View className="flex-row flex-wrap mb-2">
                {["Commercial Shop", "Commercial Showroom"].map((type) => (
                  <PillButton
                    key={type}
                    label={type}
                    selected={officeKinds.includes(type)}
                    onPress={() => setOfficeKinds([type])}
                  />
                ))}
              </View>
              {/* Located Inside */}
              <View
                className=" mb-4"

              >
                <Text className="text-[15px] text-[#00000099] mb-3">
                  Located Inside
                </Text>

                {/* Dropdown trigger */}
                <TouchableOpacity
                  onPress={() =>
                    setVisible(visible === "locatedInside" ? null : "locatedInside")
                  }
                  className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300"
                >
                  <Text className="text-gray-800">
                    {locatedInside || "Select Located Inside"}
                  </Text>
                  <Ionicons name="chevron-down" size={22} color="#888" />
                </TouchableOpacity>

                {/* Dropdown list */}
                {visible === "locatedInside" && (
                  <View
                    className="bg-white rounded-lg shadow-lg mt-2"
                    style={{ borderWidth: 1, borderColor: "#0000001A" }}
                  >
                    {[
                      "Mall",
                      "Commercial Project",
                      "Residential Project",
                      "Retail Complex / Building",
                      "Market / High Street",
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
                        <Text
                          className={`${locatedInside === item ? "text-white" : "text-gray-800"
                            }`}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>


            </>
          )}

          {selectedType === "Plot/Land" && (
            <>
              <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                What kind of plot/land is it ?
              </Text>

              <View className="flex-row flex-wrap mb-2">
                {["commercial Land/Inst.Land", "Agricultural/Farm Land", "Industrial Lands/Plots"].map((type) => (
                  <PillButton
                    key={type}
                    label={type}
                    selected={officeKinds.includes(type)}
                    onPress={() => setOfficeKinds([type])}
                  />
                ))}
              </View>



            </>
          )}
           {selectedType === "Hospitality" && 
        (
            <>
              <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                What kind of Hospitality is it ?
              </Text>
              <View className="flex-row flex-wrap mb-4">
                {hospitalityKindPills.map((p) => (
                  <PillButton
                    key={p}
                    label={p}
                    selected={HospitalityKinds.includes(p)}
                    onPress={() => setHospitalityKinds([p])}
                  />
                ))}
              </View>

            </>
          )
        }
        </View>

        {/* ---------- SELECT COMMERCIAL TYPE ---------- */}





       
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
       
        {selectedType === "Other" && <Other />}

        {/* ---------- ACTION BUTTONS ---------- */}
        
      </ScrollView>
      <View className="border-t border-gray-200 bg-white">
        <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-12">
          <TouchableOpacity
            className="px-10 py-3 rounded-lg bg-gray-200 mx-3"
          >
            <Text className="font-semibold">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-8 py-3 rounded-lg bg-green-500"
            onPress={handleNext}
          >
            <Text className="text-white font-semibold">Next</Text>
          </TouchableOpacity>
        </View>
        </View>
    </View>
  );
}