// Frontend/app/home/screens/UploadScreens/CommercialUpload/index.jsx
import React, { useState ,useEffect} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import * as ImagePicker from "expo-image-picker";
import { Linking } from "react-native";


// import PropertyImageUpload from "components/PropertyImageUpload";
// import TopAlert from "../TopAlert";

import PropertyImageUpload from "components/PropertyImageUpload";
import TopAlert from "../TopAlert";

import CustomPickerAlert from "components/CustomPickerAlert";
import HowTo360Modal from "../HowTo360Modal";
import PhotoUploadGuide from "../PhotoUploadGuide";


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
  const [retailKinds, setRetailKinds] = useState([]);

  const [storageKinds, setStorageKinds] = useState([]);
  const [industryKinds, setIndustryKinds] = useState([]);
  const [HospitalityKinds, setHospitalityKinds] = useState([]);
   const [area, setArea] = useState(""); // ✅ ADD THIS LINE
  const [neighborhoodArea, setNeighborhoodArea] = useState(""); // ✅ ADD THIS LINE
const [alertVisible, setAlertVisible] = useState(false);
  const [locatedInside, setLocatedInside] = useState("");
  const [isHowto360ModalVisible, setIsHowto360ModalVisible] = useState(false);
  const [isPhotoGuideModalVisible, setIsPhotoGuideModalVisible] =
    useState(false);
  const [pickerAlertVisible, setPickerAlertVisible] = useState(false);




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


// ADD THIS useEffect after all useState declarations (around line ~42):

useEffect(() => {
  console.log('🔍 index.jsx useEffect - params:', {
    hasOfficeDetails: !!params.officeDetails,
    hasHospitalityDetails: !!params.hospitalityDetails, // ✅ ADD THIS
    hasCommercialBaseDetails: !!params.commercialBaseDetails,
    hasImages: !!params.images,
    hasArea: !!params.area
  });

  // STEP 1: Restore images first
  if (params.images) {
    try {
      const savedImages = JSON.parse(params.images);
      if (Array.isArray(savedImages)) {
        setImages(savedImages);
        console.log('✅ Images restored:', savedImages.length);
      }
    } catch (e) {
      console.log('❌ Could not restore images:', e);
    }
  }
  
  // STEP 2: Restore area
  if (params.area) {
    setNeighborhoodArea(params.area);
    setArea(params.area);
    console.log('✅ Area restored from params:', params.area);
  }
  
  // STEP 3: Restore from commercialBaseDetails (highest priority)
 if (params.commercialBaseDetails) {
  try {
    const baseDetails = JSON.parse(params.commercialBaseDetails);
    console.log('🔄 Restoring from commercialBaseDetails:', baseDetails);
    
    setSelectedType(baseDetails.subType || '');
    setPropertyTitle(baseDetails.propertyTitle || '');
    
  if (baseDetails.officeKind) {
  setOfficeKinds([baseDetails.officeKind]);
}

if (baseDetails.retailKind) {
  setRetailKinds([baseDetails.retailKind]);
  console.log('✅ Retail kind restored from baseDetails:', baseDetails.retailKind);
}

if (baseDetails.locatedInside) {
  setLocatedInside(baseDetails.locatedInside);
  console.log('✅ Located inside restored from baseDetails:', baseDetails.locatedInside);
}

if (baseDetails.hospitalityKind) {
  setHospitalityKinds([baseDetails.hospitalityKind]);
}

if (baseDetails.storageKind) {
  setStorageKinds([baseDetails.storageKind]);
  console.log('✅ Storage kind restored from baseDetails:', baseDetails.storageKind);
}

if (baseDetails.locatedInside) {
  setLocatedInside(baseDetails.locatedInside);
}
    
    console.log('✅ Selected type restored:', baseDetails.subType);
    console.log('✅ Property title restored:', baseDetails.propertyTitle);
  } catch (e) {
    console.log('❌ Failed to parse commercialBaseDetails:', e);
  }
}
  
  // STEP 4: Fallback - restore from officeDetails
  if (params.officeDetails && officeKinds.length === 0) {
    try {
      const savedData = JSON.parse(params.officeDetails);
      if (savedData.officeKind) {
        setOfficeKinds([savedData.officeKind]);
        console.log('✅ Office kind restored from officeDetails:', savedData.officeKind);
      }
    } catch (e) {
      console.log('❌ Could not restore from officeDetails:', e);
    }
  }
  
  // ✅ NEW - STEP 5: Fallback - restore from hospitalityDetails
  if (params.hospitalityDetails && HospitalityKinds.length === 0) {
    try {
      const savedData = JSON.parse(params.hospitalityDetails);
      if (savedData.hospitalityType) {
        setHospitalityKinds([savedData.hospitalityType]);
        console.log('✅ Hospitality type restored from hospitalityDetails:', savedData.hospitalityType);
      }
    } catch (e) {
      console.log('❌ Could not restore from hospitalityDetails:', e);
    }
  }

}, [params.officeDetails, params.hospitalityDetails, params.images, params.commercialBaseDetails, params.area]); // ✅ ADD params.hospitalityDetails


// ✅ NEW - Load draft from AsyncStorage on mount
useEffect(() => {
  const loadDraft = async () => {
    try {
      // ✅ Try loading Office draft first
    const officeDraft = await AsyncStorage.getItem('draft_commercial_office');
if (officeDraft) {
  const parsed = JSON.parse(officeDraft);
  console.log('📦 Loading Office draft from AsyncStorage:', parsed);
  
  if (parsed.selectedType) setSelectedType(parsed.selectedType);
if (parsed.propertyTitle) setPropertyTitle(parsed.propertyTitle);
if (parsed.officeKind) setOfficeKinds([parsed.officeKind]);
if (parsed.retailKind) {
  setRetailKinds([parsed.retailKind]);
  console.log('✅ Retail kind restored from draft:', parsed.retailKind);
}
if (parsed.locatedInside) {
  setLocatedInside(parsed.locatedInside);
  console.log('✅ Located inside restored from draft:', parsed.locatedInside);
}
  if (parsed.images) setImages(parsed.images);
        if (parsed.neighborhoodArea) {
          setNeighborhoodArea(parsed.neighborhoodArea);
          setArea(parsed.neighborhoodArea);
        }
        if (parsed.area) {
          setArea(parsed.area);
        }
        
        console.log('✅ Office draft loaded successfully');
        return; // Exit early if Office draft found
      }

      // ✅ NEW - Try loading Retail draft
    const retailDraft = await AsyncStorage.getItem('draft_commercial_retail');
    if (retailDraft) {
      const parsed = JSON.parse(retailDraft);
      console.log('📦 Loading Retail draft from AsyncStorage:', parsed);
      
      if (parsed.selectedType) setSelectedType(parsed.selectedType);
      if (parsed.propertyTitle) setPropertyTitle(parsed.propertyTitle);
      if (parsed.retailKind) {
        setRetailKinds([parsed.retailKind]);
        console.log('✅ Retail kind restored:', parsed.retailKind);
      }
      if (parsed.locatedInside) {
        setLocatedInside(parsed.locatedInside);
        console.log('✅ Located inside restored:', parsed.locatedInside);
      }
      if (parsed.images) setImages(parsed.images);
      if (parsed.neighborhoodArea) {
        setNeighborhoodArea(parsed.neighborhoodArea);
        setArea(parsed.neighborhoodArea);
      }
      if (parsed.area) {
        setArea(parsed.area);
      }
      
      console.log('✅ Retail draft loaded successfully');
      return; // Exit early
    }
    
      
      // ✅ NEW - Try loading Hospitality draft
     const hospitalityDraft = await AsyncStorage.getItem('draft_commercial_hospitality');
if (hospitalityDraft) {
  const parsed = JSON.parse(hospitalityDraft);
  console.log('📦 Loading Hospitality draft from AsyncStorage:', parsed);
  
  if (parsed.selectedType) setSelectedType(parsed.selectedType);
  if (parsed.propertyTitle) setPropertyTitle(parsed.propertyTitle);
  if (parsed.hospitalityKind) setHospitalityKinds([parsed.hospitalityKind]);
  if (parsed.images) setImages(parsed.images);
        if (parsed.neighborhoodArea) {
          setNeighborhoodArea(parsed.neighborhoodArea);
          setArea(parsed.neighborhoodArea);
        }
        if (parsed.area) {
          setArea(parsed.area);
        }
        
        console.log('✅ Hospitality draft loaded successfully');

        return;
      }
    

    // ✅ NEW - Try loading Storage draft
      const storageDraft = await AsyncStorage.getItem('draft_commercial_storage');
      if (storageDraft) {
        const parsed = JSON.parse(storageDraft);
        console.log('📦 Loading Storage draft from AsyncStorage:', parsed);
        
        if (parsed.selectedType) setSelectedType(parsed.selectedType);
        if (parsed.propertyTitle) setPropertyTitle(parsed.propertyTitle);
        if (parsed.storageKind) setStorageKinds([parsed.storageKind]);
        if (parsed.images) setImages(parsed.images);
        if (parsed.neighborhoodArea) {
          setNeighborhoodArea(parsed.neighborhoodArea);
          setArea(parsed.neighborhoodArea);
        }
        if (parsed.area) {
          setArea(parsed.area);
        }
        
        console.log('✅ Storage draft loaded successfully');
      }
    }
  

    
    catch (e) {
      console.log('⚠️ Failed to load draft:', e);
    }
  };

  


  
  loadDraft();
}, []);


// ✅ NEW - Auto-save index.jsx state changes
useEffect(() => {
  const saveDraft = async () => {
    // Only save if we have meaningful data
    if (!selectedType) return;

  const draftData = {
      selectedType,
      propertyTitle,
      images,
      officeKind: officeKinds.length > 0 ? officeKinds[0] : undefined,
      retailKind: retailKinds.length > 0 ? retailKinds[0] : undefined,
      hospitalityKind: HospitalityKinds.length > 0 ? HospitalityKinds[0] : undefined,
      storageKind: storageKinds.length > 0 ? storageKinds[0] : undefined,
      locatedInside: locatedInside || undefined,
      area: area || neighborhoodArea || undefined,
      timestamp: new Date().toISOString(),
    };

    const storageKey = selectedType === 'Office' 
      ? 'draft_commercial_office' 
      : selectedType === 'Hospitality'
      ? 'draft_commercial_hospitality'
      : selectedType === 'Retail'
      ? 'draft_commercial_retail'
      : selectedType === 'Storage'
      ? 'draft_commercial_storage'
      : null;

    if (storageKey) {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(draftData));
        console.log(`💾 ${selectedType} index draft auto-saved`);
      } catch (e) {
        console.log('⚠️ Failed to auto-save index draft:', e);
      }
    }
  };

  const timer = setTimeout(saveDraft, 1000);
  return () => clearTimeout(timer);
}, [selectedType, propertyTitle, images, officeKinds, retailKinds, 
    HospitalityKinds, storageKinds, locatedInside, area, neighborhoodArea]);



  /* ---------- IMAGE HANDLERS ---------- */
const takePhoto = async () => {
  setPickerAlertVisible(false);
  let permission = await ImagePicker.getCameraPermissionsAsync();

  if (permission.status !== "granted") {
    permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert(
        "Permission Required",
        "You need to grant camera permissions to use this feature."
      );
      return;
    }
  }
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    quality: 0.8,
  });
  if (!result.canceled && result.assets && result.assets.length > 0) {
    const newImages = result.assets.map((asset) => asset.uri);
    setImages([...images, ...newImages]);
  }
};

const pickFromGallery = async () => {
  setPickerAlertVisible(false);
  let permission = await ImagePicker.getMediaLibraryPermissionsAsync();

  if (permission.status !== "granted") {
    permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert(
        "Permission Required",
        "You need to grant access to your photo library."
      );
      return;
    }
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    quality: 0.8,
    allowsMultipleSelection: true,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });
  if (!result.canceled && result.assets && result.assets.length > 0) {
    const newImages = result.assets.map((asset) => asset.uri);
    setImages([...images, ...newImages]);
  }
};

const pickImage = () => {
  setPickerAlertVisible(true);
};

const handleOpenPlayStore = () => {
  const playStoreLink = "https://play.google.com/store/apps/details?id=com.google.android.street";
  Linking.openURL(playStoreLink).catch((err) =>
    console.error("Couldn't load page", err)
  );
};

 const removeImage = (index) => {
  setImages((prev) => prev.filter((_, i) => i !== index));
};

  /* ---------- NEXT HANDLER ---------- */
const handleNext = async () => { // ✅ Make async
    if (!selectedType) {
      Alert.alert("Select Property Type", "Please select a property type");
      return;
    }

    const base = "/home/screens/UploadScreens/CommercialUpload/Components";

    // ✅ Common params with images
    const commonParams = {
      commercialBaseDetails: JSON.stringify({
        subType: selectedType,
        propertyTitle,
      }),
      images: JSON.stringify(images),
    };

    switch (selectedType) {
      case "Office":
        if (!officeKinds.length) {
          Alert.alert("Office Type Required", "Please select what kind of office it is");
          return;
        }

        // ✅ NEW - Save draft to AsyncStorage
  const draftData = {
  selectedType,
  propertyTitle,
  images: images,
  officeKind: officeKinds.length > 0 ? officeKinds[0] : undefined,
  retailKind: retailKinds.length > 0 ? retailKinds[0] : undefined,
  hospitalityKind: HospitalityKinds.length > 0 ? HospitalityKinds[0] : undefined,
  locatedInside: locatedInside || undefined,
  area: area || neighborhoodArea || undefined, // ✅ ADD THIS
  timestamp: new Date().toISOString(),
};
        
        try {
          await AsyncStorage.setItem('draft_commercial_office', JSON.stringify(draftData));
          console.log('✅ Draft saved to AsyncStorage');
        } catch (e) {
          console.log('⚠️ Failed to save draft:', e);
        }

        router.push({
          pathname: `${base}/Office`,
          params: {
            ...commonParams,
            commercialBaseDetails: JSON.stringify({
              subType: "Office",
              officeKind: officeKinds[0],
              propertyTitle,
            }),
          },
        });
        break;

      case "Retail":
        router.push({
          pathname: `${base}/Retail`,
          params: commonParams, // ✅ INCLUDES IMAGES
        });
        break;

      case "Plot/Land":
        router.push({
          pathname: `${base}/Plot`,
          params: commonParams, // ✅ INCLUDES IMAGES
        });
        break;

     case "Storage":
        if (!storageKinds.length) {
          Alert.alert("Storage Type Required", "Please select storage type");
          return;
        }
        
        // ✅ NEW - Save draft to AsyncStorage
        const storageDraftData = {
          selectedType: "Storage",
          propertyTitle,
          storageKind: storageKinds[0],
          images,
          area: area || neighborhoodArea,
          timestamp: new Date().toISOString(),
        };
        
        try {
          await AsyncStorage.setItem('draft_commercial_storage', JSON.stringify(storageDraftData));
          console.log('✅ Storage draft saved to AsyncStorage');
        } catch (e) {
          console.log('⚠️ Failed to save Storage draft:', e);
        }
        
        router.push({
          pathname: `${base}/Storage`,
          params: {
            ...commonParams,
            commercialBaseDetails: JSON.stringify({
              subType: "Storage",
              storageType: storageKinds[0],
              propertyTitle,
            }),
          },
        });
        break;

      case "Industry":
        if (!industryKinds.length) {
          Alert.alert("Industry Type Required", "Please select industry type");
          return;
        }
        router.push({
          pathname: `${base}/Industry`,
          params: {
            ...commonParams,
            commercialBaseDetails: JSON.stringify({
              subType: "Industry",
              industryType: industryKinds[0],
              propertyTitle,
            }),
          },
        });
        break;
case "Hospitality":
  if (!HospitalityKinds.length) {
    Alert.alert("Hospitality Type Required", "Please select hospitality type");
    return;
  }

  // ✅ NEW - Save draft to AsyncStorage
  const hospitalityDraftData = {
    subType: "Hospitality",
    hospitalityType: HospitalityKinds[0],
    propertyTitle,
    images,
    neighborhoodArea: neighborhoodArea || area,
    area: area || neighborhoodArea, // ✅ Add both for flexibility
    timestamp: new Date().toISOString(),
  };
  
  try {
    await AsyncStorage.setItem('draft_commercial_hospitality', JSON.stringify(hospitalityDraftData));
    console.log('✅ Hospitality draft saved to AsyncStorage');
  } catch (e) {
    console.log('⚠️ Failed to save Hospitality draft:', e);
  }

  router.push({
    pathname: `${base}/Hospitality`,
    params: {
      ...commonParams,
      commercialBaseDetails: JSON.stringify({
        subType: "Hospitality",
        hospitalityType: HospitalityKinds[0],
        propertyTitle,
      }),
    },
  });
  break;

      case "Other":
        router.push({
          pathname: `${base}/Other`,
          params: commonParams, // ✅ INCLUDES IMAGES
        });
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
      
      <HowTo360Modal
        visible={isHowto360ModalVisible}
        onClose={() => setIsHowto360ModalVisible(false)}
        onOpenPlayStore={handleOpenPlayStore}
      />
      
      <PhotoUploadGuide
        visible={isPhotoGuideModalVisible}
        onClose={() => setIsPhotoGuideModalVisible(false)}
      />
      
      <CustomPickerAlert
        visible={pickerAlertVisible}
        onClose={() => setPickerAlertVisible(false)}
        onCameraPress={takePhoto}
        onGalleryPress={pickFromGallery}
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
                    selected={retailKinds.includes(type)}
onPress={() => setRetailKinds([type])}

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