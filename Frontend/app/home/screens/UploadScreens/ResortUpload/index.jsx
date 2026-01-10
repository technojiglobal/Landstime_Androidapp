//Frontend//app//home//screens//UploadScreens//ResortUpload//index.jsx

import React, { useState } from "react";
import {useTranslation } from "react-i18next";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  Alert,
  StatusBar,Modal,FlatList 
  
} from "react-native";
import Toast from 'react-native-toast-message';
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import TopAlert from "../TopAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import DocumentUpload from "components/Documentupload";
import { createProperty } from "../../../../../utils/propertyApi";
import OwnerDetails from "components/OwnersDetails";
import CustomPickerAlert from "../../../../../components/CustomPickerAlert";
import HowTo360Modal from "../HowTo360Modal";
import PhotoUploadGuide from "../PhotoUploadGuide";
//import PropertyImageUpload from "../../../../components/PropertyImageUpload";
import PropertyImageUpload from "../../../../../components/PropertyImageUpload";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Platform } from "react-native";
/* ---------- Reusable Components ---------- */
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

/* ---------- Screen ---------- */
export default function PropertyFormScreen() {
  const {i18n} = useTranslation();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("Resort");
  const [visible, setVisible] = useState(null);
  const [rooms, setRooms] = useState("");
  const [floors, setFloors] = useState("");
  const [buildArea, setBuildArea] = useState("");
  const [area, setArea] = useState("");
  // separate state for textual area/neighborhood to avoid clashing with numeric land area
  const [neighborhood, setNeighborhood] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [locAdvantages, setLocAdvantages] = useState([]);
  const [images, setImages] = useState([]);
   const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

const [propertyFacing, setPropertyFacing] = useState("East");
const [masterSuitroom, setMasterSuitroom] = useState("East");
const [kitchenRoom, setKitchenRoom] = useState("East");
const [poojaRoom, setPoojaRoom] = useState("East");
const [balcony, setBalcony] = useState("East");
const [entranceDirection, setEntranceDirection] = useState("East");
const [receptionAreaFacing, setReceptionAreaFacing] = useState("East");
const [mainLobbyDirection, setMainLobbyDirection] = useState("East");
const [guestRoom, setGuestRoom] = useState("East");
const [restaurantDirection, setRestaurantDirection] = useState("East");
const [vipSuite, setVipSuite] = useState("East");
const [conferenceDirection, setconferenceDirection] = useState("East");
const [spaRoom, setSpaRoom] = useState("East");
const [swimmingPool, setSwimmingPool] = useState("East");
const [yoga, setYoga] = useState("East");
const [office, setOffice] = useState("East");
const [recreation, setRecreation] = useState("East");
const [garden, setGarden] = useState("East");
const [resortType, setResortType] = useState("");
const [resortOpen, setResortOpen] = useState(false);
const [ownershipDocs, setOwnershipDocs] = useState([]);
const [identityDocs, setIdentityDocs] = useState([]);
const [ownerName, setOwnerName] = useState("");
const [phone, setPhone] = useState("");
const [email, setEmail] = useState("");
const [focusedField, setFocusedField] = useState(null);
const [pickerAlertVisible, setPickerAlertVisible] = useState(false);
const [isHowto360ModalVisible, setIsHowto360ModalVisible] = useState(false);
const [isPhotoGuideModalVisible, setIsPhotoGuideModalVisible] = useState(false);


// Inside AddScreen component, add this helper function
const getUserLanguage = () => {
  const currentLang = i18n.language || 'en';
  console.log('📝 Current app language:', currentLang);
  return currentLang;
};

  /* ---------- Helpers ---------- */
  const isAlphaNumeric = (text) => /^[a-zA-Z0-9\s]+$/.test(text);
  const isNumeric = (text) => /^[0-9]+$/.test(text);

const showToast = (message) => {
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: message,
    position: 'top',
    visibilityTime: 3000,
  });
};


/* ---------- Validation ---------- */
const handleUpload = async () => {
  try {
    // 1. Check authentication first
    const token = await AsyncStorage.getItem('userToken');
    console.log('🔐 Current token before upload:', token);
    
    if (!token) {
      Alert.alert(
        "Login Required",
        "Please login to upload properties",
        [
          {
            text: "Go to Login",
            onPress: () => router.push('/(tabs)/profile')
          },
          { text: "Cancel", style: "cancel" }
        ]
      );
      return;
    }
    
    console.log('🎬 Starting upload process...');
    setIsSubmitting(true);

    // 2. Validate images first
    if (images.length === 0) {
      console.log('❌ No images selected');
      showToast("Please upload at least one property image");
      setIsSubmitting(false);
      return;
    }

    // 3. Validate documents
    if (ownershipDocs.length === 0 || identityDocs.length === 0) {
      showToast("Please upload required documents");
      setIsSubmitting(false);
      return;
    }

    // 4. Validate owner details
    if (!ownerName?.trim()) {
      showToast("Owner name is required");
      setIsSubmitting(false);
      return;
    }

    if (!phone?.trim()) {
      showToast("Owner phone number is required");
      setIsSubmitting(false);
      return;
    }

    if (!email?.trim()) {
      showToast("Owner email is required");
      setIsSubmitting(false);
      return;
    }

    // 5. Validate property details
    if (!title?.trim()) {
      showToast("Resort title is required");
      setIsSubmitting(false);
      return;
    }

    if (!location?.trim()) {
      showToast("Location is required");
      setIsSubmitting(false);
      return;
    }

    const priceValue = parseFloat(price);
    console.log('💰 Price validation:', { price, priceValue, isValid: !isNaN(priceValue) && priceValue > 0 });

    if (!price || isNaN(priceValue) || priceValue <= 0) {
      showToast("Valid price is required");
      setIsSubmitting(false);
      return;
    }

    if (!neighborhood?.trim()) {
      showToast("Area/Neighborhood is required");
      setIsSubmitting(false);
      return;
    }

    if (!area || Number(area) <= 0) {
      showToast("Land area is required");
      setIsSubmitting(false);
      return;
    }

    if (!buildArea || Number(buildArea) <= 0) {
      showToast("Build area is required");
      setIsSubmitting(false);
      return;
    }

    if (!resortType) {
      showToast("Please select resort type");
      setIsSubmitting(false);
      return;
    }

    if (!description?.trim()) {
      showToast("Description is required");
      setIsSubmitting(false);
      return;
    }

    // // 6. Validate Vaasthu details
    // const vaasthuFields = [
    //   propertyFacing,
    //   entranceDirection,
    //   receptionAreaFacing,
    //   mainLobbyDirection,
    //   masterSuitroom,
    //   guestRoom,
    //   restaurantDirection,
    //   vipSuite,
    //   conferenceDirection,
    //   spaRoom,
    //   swimmingPool,
    //   yoga,
    //   kitchenRoom,
    //   poojaRoom,
    //   office,
    //   recreation,
    //   balcony,
    //   garden,
    // ];

    // if (vaasthuFields.includes("Select")) {
    //   showToast("Please fill all Vaasthu Details");
    //   setIsSubmitting(false);
    //   return;
    // }

    console.log('✅ Validation passed');

    // 7. Handle web-specific image conversion (if needed)
    let uploadImages = images;
    if (Platform.OS === 'web') {
      uploadImages = await Promise.all(
        images.map(async (uri) => {
          if (uri.startsWith('blob:')) {
            const response = await fetch(uri);
            const blob = await response.blob();
            return new File([blob], `image-${Date.now()}.jpg`, { type: 'image/jpeg' });
          }
          return uri;
        })
      );
    }

    // 8. Prepare property data
// New Code (in ResortUpload/index.jsx) - Add priceDetails to propertyData (consistent with SiteUpload and AddScreen)
const propertyData = {
  propertyType: "Resort",
  propertyTitle: title,
  location,
  area: neighborhood,  // ✅ This is the area field (neighborhood name)
  description,
  originalLanguage: getUserLanguage(), // ✅ ADD THIS - for translation
  expectedPrice: priceValue,
  ownerDetails: {
    name: ownerName.trim(),
    phone: phone.trim(),
    email: email.trim(),
  },
  priceDetails: { // ✅ Add this block with defaults (no UI change needed)
    allInclusive: false,
    negotiable: false,
    taxExcluded: false
  },
  resortDetails: {
    rooms: Number(rooms) || 0,
    floors: Number(floors) || 0,
    landArea: Number(area),
    buildArea: Number(buildArea),
    resortType,
    locationAdvantages: locAdvantages,
    vaasthuDetails: {
      propertyFacing,
      entranceDirection,
      receptionAreaFacing,
      mainLobbyDirection,
      masterSuitroom,
      guestRoom,
      restaurantDirection,
      vipSuite,
      conferenceDirection,
      spaRoom,
      swimmingPool,
      yoga,
      kitchenRoom,
      poojaRoom,
      office,
      recreation,
      balcony,
      garden,
    },
  },
};


    console.log('📡 Calling createProperty API...');
    console.log('📋 Final property data:', JSON.stringify(propertyData, null, 2));
    console.log('📸 Images to upload:', uploadImages.length, 'images');
    
    // 9. Call API
    const result = await createProperty(
      propertyData,
      uploadImages,
      ownershipDocs,
      identityDocs
    );

    console.log('📥 API Result:', result);
    console.log('📥 API Result Data:', JSON.stringify(result.data, null, 2));

    // 10. Handle response
   if (result?.data?.success) {
  Alert.alert(
    "Success",
    "Property uploaded successfully and sent for approval",
    [
      {
        text: "OK",
        onPress: () => {
          router.replace("/(tabs)/home");
        },
      },
    ]
  );
}else {
      console.error('❌ Upload failed:', result);
      showToast(result.data?.message || result.error || "Failed to upload property");
    }

  } catch (error) {
    console.error("❌ Upload error:", error);
    showToast(error.message || "Something went wrong. Please try again.");
  } finally {
    setIsSubmitting(false); // ✅ Always reset loading state
  }
};


const RESORT_TYPES = [
  "Beachfront Resort",
  "Hill Station / Mountain Resort",
  "Forest / Jungle Retreat",
  "Lakefront Resort",
  "Desert Resort",
  "Eco-Resort",
  "Island Resort",
  "Wellness / Spa Resort",
  "Luxury Resort",
  "Boutique Resort",
  "Family Resort",
  "Adventure / Activity Resort",
  "Safari / Wildlife Resort",
  "Water Park Resort",
  "Golf Resort",
  "Riverfront Resort",
  "Farm / Agri-Resort",
  "Theme Resort",
  "Business / Conference Resort",
  "Eco-Lodge / Nature Retreat",
];

  const locationAdvantages = [
    "+Close to Metro Station",
    "+Close to School",
    "+Close to Hospital",
    "+Close to Market",
    "+Close to Railway Station",
    "+Close to Airport",
    "+Close to Mall",
    "+Close to Highway",
  ];
 const directions = ["North-East", "South-West", "East", "West"];
   const fields = [
    { key: "propertyFacing", label: "Property Facing", value: propertyFacing, setValue: setPropertyFacing },
    { key: "entranceDirection", label: "Entrance Direction", value: entranceDirection, setValue: setEntranceDirection },
    { key: "receptionAreaFacing", label: "Reception Area Facing", value: receptionAreaFacing, setValue: setReceptionAreaFacing },
    { key: "mainLobbyDirection", label: "Main Lobby Direction", value: mainLobbyDirection, setValue: setMainLobbyDirection },

    { key: "masterSuitroom", label: "Master Suitroom Direction", value: masterSuitroom, setValue: setMasterSuitroom },
   // { key: "masterBedroom", label: "Master Bedroom", value: masterBedroom, setValue: setMasterBedroom },
   { key: "guestRoom", label: "Guest Room Direction", value: guestRoom, setValue: setGuestRoom },
    { key: "restaurantDirection", label: "Restaurant Direction", value: restaurantDirection, setValue: setRestaurantDirection },
    { key: "vipSuite", label: "VIP Suite Direction(if applicable)", value: vipSuite, setValue: setVipSuite },
    { key: "conferenceDirection", label: "Conference/Banquet Hall Direction", value: conferenceDirection, setValue: setconferenceDirection},
    { key: "spaRoom", label: "Spa/Wellness Center Direction", value: spaRoom, setValue: setSpaRoom },
    { key: "swimmingPool", label: "Swimming Pool Direction", value: swimmingPool, setValue: setSwimmingPool },
    { key: "yoga", label: "Yoga/Meditation Area Direction", value: yoga, setValue: setYoga },
    { key: "kitchenRoom", label: "Kitchen Direction", value: kitchenRoom, setValue: setKitchenRoom },
    { key: "poojaRoom", label: "Prayer/Pooja/Meditation Room Direction", value: poojaRoom, setValue: setPoojaRoom },
    { key: "office", label: "Office/Administration Room Direction", value: office, setValue: setOffice },
    { key: "recreation", label: "Recreation/Activity Area Direction", value: recreation, setValue: setRecreation },
     { key: "balcony", label: "Balcony/Deck/Veranda", value: balcony, setValue: setBalcony },
     { key: "garden", label: "Garden/Open Space/Lawn", value: garden, setValue: setGarden },
  ];
  const toggleArrayItem = (setter, array, value) => {
    setter(
      array.includes(value)
        ? array.filter((i) => i !== value)
        : [...array, value]
    );
  };

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

const removeImage = (index) => {
  setImages(images.filter((_, i) => i !== index));
};

const handleOpenPlayStore = () => {
  const playStoreLink = "https://play.google.com/store/apps/details?id=com.google.android.street";
  Linking.openURL(playStoreLink).catch((err) =>
    console.error("Couldn't load page", err)
  );
};


  return (
    <>
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
      <TopAlert visible={alertVisible} onHide={() => setAlertVisible(false)} />
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
      {/* ---------- Header ---------- */}
        <View className="flex-row items-center  mb-2">
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
              Upload Your Resort
            </Text>
            <Text className="text-[12px] text-[#00000066]">
              Add your property details
            </Text>
          </View>
        </View>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        

       {/* ---------- Property Media ---------- */}
        <PropertyImageUpload
          images={images}
          onPickImage={pickImage}
          onRemoveImage={removeImage}
          onViewGuidelines={() => setIsPhotoGuideModalVisible(true)}
          onWatchTutorial={() => setIsHowto360ModalVisible(true)}
        />

        {/* ---------- Basic Details ---------- */}
        <View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <Text className="text-[16px] font-bold mb-4">Basic Details</Text>

         <Text className="text-[14px] font-bold text-gray-600 mb-2">
          Resort Title <Text style={{ color: "red" }}>*</Text>
         </Text>
          <TextInput
            placeholder="Ocean Breeze Paradise"
            value={title}
            onChangeText={(text) => {
    if (text === "" || isAlphaNumeric(text)) {
      setTitle(text);
    }
  }}
            className="rounded-md p-3 mb-3 bg-[#D9D9D91C]  border border-gray-300 focus:border-green-500 focus:ring-[#22C55E]"
          />

           {/* Property Type */}
                        <View className="px-1">
                          <Text className="text-gray-500 font-semibold mb-2">
                            Property Type
                          </Text>
                          <TouchableOpacity
                            onPress={() => setVisible(visible === "propertyType" ? null : "propertyType")}
                            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 "
                          >
                            <Text className="text-gray-800 text-left">
                              {propertyType || "House"}
                            </Text>
                            <Ionicons name="chevron-down" size={24} color="#888" />
                          </TouchableOpacity>
                          {visible === "propertyType" && (
                            <View
                              className="bg-white rounded-lg shadow-lg -mt-3 mb-4"
                              style={{ borderWidth: 1, borderColor: "#0000001A" }}
                            >
                              {["House", "Site/Plot", "Commercial", "Resort"].map((type) => (
                                <TouchableOpacity
                                  key={type}
                                  onPress={() => {
                                    setPropertyType(type);
                                    setVisible(null);
                                    
                                    if (type === "House") {
                                      router.push("/home/screens/UploadScreens/AddScreen");
                                    } else if (type === "Site/Plot") {
                                      router.push ("/home/screens/UploadScreens/SiteUpload")
                                    } else if (type === "Commercial") {
                                      router.push( "/home/screens/UploadScreens/CommercialUpload");                           
                                    } else {
                                      router.push("/home/screens/UploadScreens/ResortUpload");
                                    }
                                  }}
                                  className={`p-4 border-b border-gray-200 ${propertyType === type ? "bg-green-500" : "bg-white"}`}
                                >
                                  <Text className={`${propertyType === type ? "text-white" : "text-gray-800"}`}>{type}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                        </View>
         {/* Resort Type */}
<Text  className="text-[14px] font-bold text-gray-500 mt-1 mb-2">Resort Type <Text style={{ color: "red" }}>*</Text></Text>

{/* Dropdown Trigger */}
<TouchableOpacity onPress={() => setResortOpen(!resortOpen)}
  className="bg-[#D9D9D91C]  rounded-lg p-3 flex-row justify-between items-center border border-gray-300">
  <Text>{resortType || "Select Resort Type"}</Text>
   <Ionicons name="chevron-down" size={20} color="#888" />
</TouchableOpacity>


{/* Dropdown List (FIXED USING MODAL) */}
<Modal
  visible={resortOpen}
  transparent
  animationType="fade"
>
  <Pressable
    style={{
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.2)",
      justifyContent: "center",
      padding: 20,
    }}
    onPress={() => setResortOpen(false)}
  >
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        maxHeight: "70%",
      }}
    >
      <ScrollView>
        {RESORT_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => {
              setResortType(type);
              setResortOpen(false);
            }}
            style={{
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#F1F5F9",
            }}
          >
            <Text style={{ color: "#374151" }}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  </Pressable>
</Modal>


           {/* Rooms & Area */}
                      <View className="flex-row gap-2 mb-4 mt-3">
                        <View className="flex-1">
                          <Text className="text-gray-500 font-semibold mb-2 text-left">Rooms</Text>
                          <TextInput
                            placeholder="0"
                            
                            value={rooms}
                             onChangeText={(text) => {
    if (text === "" || isNumeric(text)) {
      setRooms(text);
    }
  }}
                            keyboardType="numeric"
                            className="bg-[#D9D9D91C] rounded-lg p-3 border border-gray-200 text-gray-800 text-left focus:border-green-500 focus:ring-[#22C55E]"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-gray-500 font-semibold mb-2 text-left">LandArea (sqft)<Text style={{ color: "red" }}>*</Text></Text>
                          <TextInput
                            placeholder="0"
                            value={area}
                           onChangeText={(text) => {
  if (text === "" || isNumeric(text)) {
    setArea(text);
  }
}}
                            keyboardType="numeric"
                            className="bg-[#D9D9D91C] rounded-lg p-3 border border-gray-200 text-gray-800 text-left focus:border-green-500 focus:ring-[#22C55E]"
                          />
                        </View>
                      </View>
              {/* Floors & BuildArea */}
                      <View className="flex-row gap-2 mb-4">
                        <View className="flex-1">
                          <Text className="text-gray-500 font-semibold mb-2 text-left">Floors</Text>
                          <TextInput
                            placeholder="0"
                            value={floors}
                           onChangeText={(text) => {
  if (text === "" || isNumeric(text)) {
    setFloors(text);
  }
}}
                            keyboardType="numeric"
                            className="bg-[#D9D9D91C] rounded-lg p-3 border border-gray-200 text-gray-800 text-left focus:border-green-500 focus:ring-[#22C55E]"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-gray-500 font-semibold mb-2 text-left">BuildArea (sqft)<Text style={{ color: "red" }}>*</Text></Text>
                          <TextInput
                            placeholder="0"
                            value={buildArea}
                            onChangeText={(text) => {
  if (text === "" || isNumeric(text)) {
    setBuildArea(text);
  }
}}

                            keyboardType="numeric"
                            className="bg-[#D9D9D91C] rounded-lg p-3 border border-gray-200 text-gray-800 text-left focus:border-green-500 focus:ring-[#22C55E]"
                          />
                        </View>
                      </View>
                      <Text className="text-[14px] font-bold text-gray-600 mb-2">
            Price(₹) <Text style={{ color: "red" }}>*</Text>

          </Text>
          <TextInput
            placeholder="0"
            value={price}
           onChangeText={(text) => {
  if (text === "" || isNumeric(text)) {
    setPrice(text);
  }
}}
 keyboardType="numeric"
            className="bg-[#D9D9D91C] rounded-md p-3 mb-3 border border-gray-200 focus:border-green-500 focus:ring-green-500"
          />
        </View>

        {visible === "propertyType" && (
          <View className="bg-white rounded-lg border border-gray-200 mb-4">
            {["House", "Site/Plot/Land", "Commercial", "Resort"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => {
                  setPropertyType(type);
                  setVisible(null);
                }}
                className="p-4 border-b border-gray-100"
              >
                <Text>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        

        {/* ---------- Location ---------- */}
        <View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <Text className="text-[15px] font-bold text-gray-600 mb-3">
            Location <Text style={{ color: "red" }}>*</Text>
          </Text>
        
          <View className="flex-row items-center bg-[#D9D9D91C]  border border-gray-200 focus:border-green-500 focus:ring-[#22C55E] rounded-md p-3 mb-4">
            <Image
              source={require("../../../../../assets/location.png")}
              style={{ width: 18, height: 18, marginRight: 8 }}
            />
            <TextInput
              placeholder="Enter Property Location"
              className="flex-1"
              value={location}
              onChangeText={setLocation}
              
            />
           </View>
        </View>

                      {/* Area */}
        <View className="border border-gray-300 rounded-lg bg-white ml-5 mt-5 mr-4 mb-3 p-5">
          <Text className="text-gray-500 font-semibold mb-2 text-left">
            Area <Text className="text-red-500">*</Text>
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f3f4f6",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              borderColor: focusedField === "neighborhood" ? "#22C55E" : "#d1d5db",
              borderWidth: 2,
            }}
          >
            <Ionicons name="location-outline" size={20} color="#22C55E" />
            <TextInput
              placeholder="Enter Area/Neighborhood (e.g., Akkayapalem)"
              placeholderTextColor="#888"
              value={neighborhood}
              onChangeText={(text) => setNeighborhood(text)}
              style={{ flex: 1, marginLeft: 8, color: "#1f2937" }}
              onFocus={() => setFocusedField("neighborhood")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>
         {/* ---------- Description ---------- */}
        <View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <Text className="text-[15px] font-bold text-gray-600 mb-3 ">
            Description <Text style={{ color: "red" }}>*</Text>
          </Text>
        
          <View className="flex-row items-center bg-[#D9D9D91C]  border border-gray-200 focus:border-green-500 focus:ring-[#22C55E] rounded-md p-3 mb-4">

            <TextInput
              placeholder="Describe your property ........"
              className="flex-1 "
              value={description}
              onChangeText={setDescription}
               multiline
  numberOfLines={4}
  textAlignVertical="top"   // ✅ fixes Android cursor center issue
  style={{ minHeight: 120 }} // ✅ textarea height
  
            />
           </View>
        </View>
         
         {/* Vaasthu Details */}
                    <View className="bg-white rounded-lg border border-gray-200 p-4 mb-4">

                      <View className="flex-row items-center mb-3 justify-between">
                        <Text
                          className="text-lg font-semibold text-gray-800 text-left"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          Vaasthu Details <Text style={{ color: "red" }}>*</Text>
                        </Text>
                        <Image source={require("../../../../../assets/vastu.png")} style={{ width: 30, height: 30 }} />
                      </View>
                      {fields.map((item) => (
                        <View key={item.key} className="mb-4">
                          <Text className="text-gray-700 font-semibold mb-1 text-left">{item.label}</Text>
                          <TouchableOpacity
                            onPress={() => setVisible(item.key)}
                            className="flex-row items-center justify-between border border-gray-300 rounded-xl p-3 bg-[#F9FAFB]"
                          >
                            <Text className="text-gray-800 text-left">{item.value}</Text>
                            <Ionicons name="chevron-down" size={20} color="#555" />
                          </TouchableOpacity>
                          {/* Dropdown Modal */}
                          <Modal visible={visible === item.key} transparent animationType="fade">
                            <TouchableOpacity
                              activeOpacity={1}
                              onPressOut={() => setVisible(null)}
                              className="flex-1 bg-black/30 justify-center items-center"
                            >
                              <View className="bg-white w-[85%] rounded-2xl p-3 shadow-lg">
                                <FlatList
                                  data={directions}
                                  keyExtractor={(dir) => dir}
                                  renderItem={({ item: direction }) => (
                                    <TouchableOpacity
                                      onPress={() => {
                                        item.setValue(direction);
                                        setVisible(null);
                                      }}
                                      className="p-3 border-b border-gray-200"
                                    >
                                      <Text className="text-gray-800 text-left">{direction}</Text>
                                    </TouchableOpacity>
                                  )}
                                />
                              </View>
                            </TouchableOpacity>
                          </Modal>
                        </View>
                      ))}
                    </View>
                <View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
  <DocumentUpload
    title="Property Ownership"
    subtitle="Verify ownership to publish your property listing securely."
    files={ownershipDocs}
    setFiles={setOwnershipDocs}
    required
  />
</View>

<View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
  <DocumentUpload
    title="Owner Identity"
    subtitle="Upload PAN, Aadhaar, Passport or Driver’s License"
    files={identityDocs}
    setFiles={setIdentityDocs}
    required
  />
</View>

  <OwnerDetails
   ownerName={ownerName}
   setOwnerName={setOwnerName}
   phone={phone}
   setPhone={setPhone}
   email={email}
   setEmail={setEmail}
   focusedField={focusedField}
   setFocusedField={setFocusedField}
 />

          <Text className="text-[15px] font-bold text-gray-600 mb-3">
            Location Advantages
          </Text>

          <View className="flex-row flex-wrap">
            {locationAdvantages.map((a) => (
              <PillButton
                key={a}
                label={a}
                selected={locAdvantages.includes(a)}
                onPress={() =>
                  toggleArrayItem(setLocAdvantages, locAdvantages, a)
                }
              />
            ))}
          </View>
      </ScrollView>
     
     {/* ---------- FIXED ACTION BUTTON ---------- */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          backgroundColor: "#ffffff",
        }}
      >
        <View className="flex-row justify-end gap-4">
          <TouchableOpacity className="bg-gray-200 px-5 py-3 rounded-lg"
         onPress={() => router.back()}>
            <Text className="font-semibold">Cancel</Text>
          </TouchableOpacity>

        {/* Upload Property Button */}
         <TouchableOpacity
          style={{
            backgroundColor: "#22C55E",
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 10,
          }}
          onPress={handleUpload}
          disabled={isSubmitting}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
            {isSubmitting ? "Uploading..." : "Upload Property"}
          </Text>
        </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
<Toast/>
    </>
  );
}
