//Frontend//app//home//screens//UploadScreens//ResortUpload//index.jsx

import React, { useState,useEffect } from "react";
import {useTranslation } from "react-i18next";
import i18n from "../../../../../i18n/index"; // ✅ ADD THIS LINE
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
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TopAlert from "../TopAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import DocumentUpload from "components/Documentupload";
import { createProperty,updateProperty } from "../../../../../utils/propertyApi";
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
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState(t("resort"));
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

const [propertyFacing, setPropertyFacing] = useState(t("east"));
const [masterSuitroom, setMasterSuitroom] = useState(t("east"));
const [kitchenRoom, setKitchenRoom] = useState(t("east"));
const [poojaRoom, setPoojaRoom] = useState(t("east"));
const [balcony, setBalcony] = useState(t("east"));
const [entranceDirection, setEntranceDirection] = useState(t("east"));
const [receptionAreaFacing, setReceptionAreaFacing] = useState(t("east"));
const [mainLobbyDirection, setMainLobbyDirection] = useState(t("east"));
const [guestRoom, setGuestRoom] = useState(t("east"));
const [restaurantDirection, setRestaurantDirection] = useState(t("east"));
const [vipSuite, setVipSuite] = useState(t("east"));
const [conferenceDirection, setconferenceDirection] = useState(t("east"));
const [spaRoom, setSpaRoom] = useState(t("east"));
const [swimmingPool, setSwimmingPool] = useState(t("east"));
const [yoga, setYoga] = useState(t("east"));
const [office, setOffice] = useState(t("east"));
const [recreation, setRecreation] = useState(t("east"));
const [garden, setGarden] = useState(t("east"));
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

const [isEditMode, setIsEditMode] = useState(false);
const [editPropertyId, setEditPropertyId] = useState(null);
const [existingDocuments, setExistingDocuments] = useState({
  ownership: [],
  identity: []
});




const getUserLanguage = () => {
  const currentLang = i18n.language || 'en';
  console.log('📝 Current app language:', currentLang);
  return currentLang;
};

// ✅ ADD EDIT MODE DATA LOADING
useEffect(() => {
  if (params.editMode === 'true' && params.propertyData) {
    try {
      const property = JSON.parse(params.propertyData);
      setIsEditMode(true);
      setEditPropertyId(params.propertyId);
      
      console.log('📝 Loading resort for edit:', property._id);
      
      // Helper function to get localized text
      const getLocalizedText = (field) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        if (typeof field === 'object') {
          const currentLang = i18n.language || 'en';
          return field[currentLang] || field.en || field.te || field.hi || '';
        }
        return '';
      };
      
      // Pre-fill basic fields
      const titleText = property.propertyTitle?.en || property.propertyTitle?.te || property.propertyTitle?.hi || property.propertyTitle || '';
      const locationText = property.location?.en || property.location?.te || property.location?.hi || property.location || '';
      const areaText = property.area?.en || property.area?.te || property.area?.hi || property.area || '';
      const descText = property.description?.en || property.description?.te || property.description?.hi || property.description || '';
      
      setTitle(typeof titleText === 'string' ? titleText : '');
      setLocation(typeof locationText === 'string' ? locationText : '');
      setNeighborhood(typeof areaText === 'string' ? areaText : '');
      setDescription(typeof descText === 'string' ? descText : '');
      setPrice(property.expectedPrice?.toString() || '');
      
      // Resort details
      if (property.resortDetails) {
        setRooms(property.resortDetails.rooms?.toString() || '');
        setFloors(property.resortDetails.floors?.toString() || '');
        setArea(property.resortDetails.landArea?.toString() || '');
        setBuildArea(property.resortDetails.buildArea?.toString() || '');
        setResortType(property.resortDetails.resortType || '');
        setLocAdvantages(property.resortDetails.locationAdvantages || []);
        
        // Vastu details
        if (property.resortDetails.vaasthuDetails) {
          setPropertyFacing(property.resortDetails.vaasthuDetails.propertyFacing || t("east"));
          setEntranceDirection(property.resortDetails.vaasthuDetails.entranceDirection || t("east"));
          setReceptionAreaFacing(property.resortDetails.vaasthuDetails.receptionAreaFacing || t("east"));
          setMainLobbyDirection(property.resortDetails.vaasthuDetails.mainLobbyDirection || t("east"));
          setMasterSuitroom(property.resortDetails.vaasthuDetails.masterSuitroom || t("east"));
          setGuestRoom(property.resortDetails.vaasthuDetails.guestRoom || t("east"));
          setRestaurantDirection(property.resortDetails.vaasthuDetails.restaurantDirection || t("east"));
          setVipSuite(property.resortDetails.vaasthuDetails.vipSuite || t("east"));
          setconferenceDirection(property.resortDetails.vaasthuDetails.conferenceDirection || t("east"));
          setSpaRoom(property.resortDetails.vaasthuDetails.spaRoom || t("east"));
          setSwimmingPool(property.resortDetails.vaasthuDetails.swimmingPool || t("east"));
          setYoga(property.resortDetails.vaasthuDetails.yoga || t("east"));
          setKitchenRoom(property.resortDetails.vaasthuDetails.kitchenRoom || t("east"));
          setPoojaRoom(property.resortDetails.vaasthuDetails.poojaRoom || t("east"));
          setOffice(property.resortDetails.vaasthuDetails.office || t("east"));
          setRecreation(property.resortDetails.vaasthuDetails.recreation || t("east"));
          setBalcony(property.resortDetails.vaasthuDetails.balcony || t("east"));
          setGarden(property.resortDetails.vaasthuDetails.garden || t("east"));
        }
      }
      
      // Owner details
      if (property.ownerDetails) {
        setOwnerName(property.ownerDetails.name || '');
        setPhone(property.ownerDetails.phone || '');
        setEmail(property.ownerDetails.email || '');
      }
      
      // Images - Load existing Cloudinary URLs
      if (property.images && property.images.length > 0) {
        setImages(property.images);
        console.log('✅ Loaded existing images:', property.images.length);
      }
      
      // Store existing documents (read-only)
      if (property.documents) {
        setExistingDocuments({
          ownership: property.documents.ownership || [],
          identity: property.documents.identity || []
        });
        console.log('✅ Loaded existing documents');
      }
      
      console.log('✅ Resort data loaded for editing');
    } catch (error) {
      console.error('❌ Error loading resort data:', error);
      Alert.alert('Error', 'Failed to load resort data');
    }
  }
}, [params.editMode, params.propertyData, params.propertyId]);

  /* ---------- Helpers ---------- */

  /* ---------- Helpers ---------- */
  const isAlphaNumeric = (text) => /^[a-zA-Z0-9\s]+$/.test(text);
  const isNumeric = (text) => /^[0-9]+$/.test(text);

const showToast = (message) => {
  Toast.show({
    type: 'error',
    text1: t('error'),
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
        t("login_required"),
        t("please_login_to_upload_properties"),
        [
          {
            text: t("go_to_login"),
            onPress: () => router.push('/(tabs)/profile')
          },
          { text: t("cancel"), style: "cancel" }
        ]
      );
      return;
    }
    
    console.log(isEditMode ? '🎬 Starting update process...' : '🎬 Starting upload process...');
    setIsSubmitting(true);

    // 2. ✅ In edit mode, skip image validation if images already exist
    if (!isEditMode && images.length === 0) {
      console.log('❌ No images selected');
      showToast(t("add_at_least_one_image"));
      setIsSubmitting(false);
      return;
    }

    // 3. ✅ In edit mode, skip document validation (documents already exist)
    if (!isEditMode && (ownershipDocs.length === 0 || identityDocs.length === 0)) {
      showToast(t("upload_required_documents"));
      setIsSubmitting(false);
      return;
    }

    // 4. Validate owner details
    if (!ownerName?.trim()) {
      showToast(t("owner_name_required"));
      setIsSubmitting(false);
      return;
    }

    if (!phone?.trim()) {
      showToast(t("phone_number_required"));
      setIsSubmitting(false);
      return;
    }

    if (!email?.trim()) {
      showToast(t("email_required"));
      setIsSubmitting(false);
      return;
    }

    // 5. Validate property details
    if (!title?.trim()) {
      showToast(t("resort_title_required"));
      setIsSubmitting(false);
      return;
    }

    if (!location?.trim()) {
      showToast(t("location_required"));
      setIsSubmitting(false);
      return;
    }

    const priceValue = parseFloat(price);
    console.log("💰 Price validation:", { price, priceValue, isValid: !isNaN(priceValue) && priceValue > 0 });

    if (!price || isNaN(priceValue) || priceValue <= 0) {
      showToast(t("valid_price_required"));
      setIsSubmitting(false);
      return;
    }

    if (!neighborhood?.trim()) {
      showToast(t("area_required"));
      setIsSubmitting(false);
      return;
    }

    if (!area || Number(area) <= 0) {
      showToast(t("land_area_required"));
      setIsSubmitting(false);
      return;
    }

    if (!buildArea || Number(buildArea) <= 0) {
      showToast(t("build_area_required"));
      setIsSubmitting(false);
      return;
    }

    if (!resortType) {
      showToast(t("select_resort_type"));
      setIsSubmitting(false);
      return;
    }

    if (!description?.trim()) {
      showToast(t("description_required"));
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


   console.log('📡 Calling API...');
    console.log('📋 Final property data:', JSON.stringify(propertyData, null, 2));
    console.log('📸 Images to upload:', uploadImages.length, 'images');
    
    // 9. Call API
    let result;
    
    if (isEditMode) {
      // ✅ UPDATE MODE
      console.log('📡 Calling updateProperty API...');
      result = await updateProperty(editPropertyId, propertyData, uploadImages);
    } else {
      // ✅ CREATE MODE
      result = await createProperty(
        propertyData,
        uploadImages,
        ownershipDocs,
        identityDocs
      );
    }

    console.log('📥 API Result:', result);
    console.log('📥 API Result Data:', JSON.stringify(result.data, null, 2));

    // 10. Handle response
    if (result.success) {
      Alert.alert(
        t("success"),
        isEditMode ? t("property_updated_successfully") : t("upload_success"),
        [
          {
            text: t("ok"),
            onPress: () => {
              router.replace(isEditMode ? "/home/screens/Sidebar/MyProperties" : "/(tabs)/home");
            },
          },
        ]
      );
    } else {
      console.error(isEditMode ? '❌ Update failed:' : '❌ Upload failed:', result);
      showToast(result.data?.message || result.error || (isEditMode ? t("failed_to_update_property") : t("failed_to_upload_property")));
    }

  } catch (error) {
    console.error("❌ Upload error:", error);
    showToast(error.message || t("something_went_wrong"));
  } finally {
    setIsSubmitting(false); // ✅ Always reset loading state
  }
};


const RESORT_TYPES = [
  t("beachfront_resort"),
  t("hill_station_mountain_resort"),
  t("forest_jungle_retreat"),
  t("lakefront_resort"),
  t("desert_resort"),
  t("eco_resort"),
  t("island_resort"),
  t("wellness_spa_resort"),
  t("luxury_resort"),
  t("boutique_resort"),
  t("family_resort"),
  t("adventure_activity_resort"),
  t("safari_wildlife_resort"),
  t("water_park_resort"),
  t("golf_resort"),
  t("riverfront_resort"),
  t("farm_agri_resort"),
  t("theme_resort"),
  t("business_conference_resort"),
  t("eco_lodge_nature_retreat"),
];

  const locationAdvantages = [
    t("close_to_metro_station"),
    t("close_to_school"),
    t("close_to_hospital"),
    t("close_to_market"),
    t("close_to_railway_station"),
    t("close_to_airport"),
    t("close_to_mall"),
    t("close_to_highway"),
  ];
 const directions = [t("north_east"), t("south_west"), t("east"), t("west"),t("north_west"), t("south_west"), t("north"), t("south")];
   const fields = [
    { key: "propertyFacing", label: t("property_facing"), value: propertyFacing, setValue: setPropertyFacing },
    { key: "entranceDirection", label: t("entrance_direction"), value: entranceDirection, setValue: setEntranceDirection },
    { key: "receptionAreaFacing", label: t("reception_facing"), value: receptionAreaFacing, setValue: setReceptionAreaFacing },
    { key: "mainLobbyDirection", label: t("main_lobby"), value: mainLobbyDirection, setValue: setMainLobbyDirection },

    { key: "masterSuitroom", label: t("master_suite"), value: masterSuitroom, setValue: setMasterSuitroom },
   // { key: "masterBedroom", label: "Master Bedroom", value: masterBedroom, setValue: setMasterBedroom },
   { key: "guestRoom", label: t("guest_room"), value: guestRoom, setValue: setGuestRoom },
    { key: "restaurantDirection", label: t("restaurant_direction"), value: restaurantDirection, setValue: setRestaurantDirection },
    { key: "vipSuite", label: t("vip_suite"), value: vipSuite, setValue: setVipSuite },
    { key: "conferenceDirection", label: t("conference_direction"), value: conferenceDirection, setValue: setconferenceDirection},
    { key: "spaRoom", label: t("spa_direction"), value: spaRoom, setValue: setSpaRoom },
    { key: "swimmingPool", label: t("swimming_pool"), value: swimmingPool, setValue: setSwimmingPool },
    { key: "yoga", label: t("yoga_area"), value: yoga, setValue: setYoga },
    { key: "kitchenRoom", label: t("kitchen_direction"), value: kitchenRoom, setValue: setKitchenRoom },
    { key: "poojaRoom", label: t("pooja_room"), value: poojaRoom, setValue: setPoojaRoom },
    { key: "office", label: t("office_direction"), value: office, setValue: setOffice },
    { key: "recreation", label: t("recreation_area"), value: recreation, setValue: setRecreation },
     { key: "balcony", label: t("balcony"), value: balcony, setValue: setBalcony },
     { key: "garden", label: t("garden"), value: garden, setValue: setGarden },
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
        t("permission_required"),
        t("grant_camera_permissions")
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
        t("permission_required"),
        t("grant_photo_library_access")
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
    {isEditMode ? t('edit_property') : t('upload_your_resort')}
  </Text>
  <Text className="text-[12px] text-[#00000066]">
    {isEditMode ? t('update_property_details') : t('add_property_details')}
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
          <Text className="text-[16px] font-bold mb-4">{t('basic_details')}</Text>

         <Text className="text-[14px] font-bold text-gray-600 mb-2">
          {t('resort_title')} <Text style={{ color: "red" }}>*</Text>
         </Text>
          <TextInput
            placeholder={t('resort_title_placeholder')}
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
    {t('property_type')}
  </Text>
  <TouchableOpacity
    onPress={() => !isEditMode && setVisible(visible === "propertyType" ? null : "propertyType")}
    disabled={isEditMode}
    className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300"
    style={{ opacity: isEditMode ? 0.6 : 1 }}
  >
    <Text className="text-gray-800 text-left">
      {propertyType || t("resort")}
    </Text>
    {!isEditMode && <Ionicons name="chevron-down" size={24} color="#888" />}
    {isEditMode && <Ionicons name="lock-closed" size={20} color="#888" />}
  </TouchableOpacity>
  {isEditMode && (
    <Text className="text-xs text-gray-500 mt-1">Property type cannot be changed</Text>
  )}
                          {visible === "propertyType" && (
                            <View
                              className="bg-white rounded-lg shadow-lg -mt-3 mb-4"
                              style={{ borderWidth: 1, borderColor: "#0000001A" }}
                            >
                              {["House", "Site/Plot/Land", "Commercial", "Resort"].map((type) => (
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
<Text  className="text-[14px] font-bold text-gray-500 mt-1 mb-2">{t('resort_type')} <Text style={{ color: "red" }}>*</Text></Text>

{/* Dropdown Trigger */}
<TouchableOpacity onPress={() => setResortOpen(!resortOpen)}
  className="bg-[#D9D9D91C]  rounded-lg p-3 flex-row justify-between items-center border border-gray-300">
  <Text>{resortType || t('select_resort_type')}</Text>
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
                          <Text className="text-gray-500 font-semibold mb-2 text-left">{t('rooms')}</Text>
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
                          <Text className="text-gray-500 font-semibold mb-2 text-left">{t('land_area')}<Text style={{ color: "red" }}>*</Text></Text>
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
                          <Text className="text-gray-500 font-semibold mb-2 text-left">{t('floors')}</Text>
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
                          <Text className="text-gray-500 font-semibold mb-2 text-left">{t('build_area')}<Text style={{ color: "red" }}>*</Text></Text>
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
            {t('price')} <Text style={{ color: "red" }}>*</Text>

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
            {t('location')} <Text style={{ color: "red" }}>*</Text>
          </Text>
        
          <View className="flex-row items-center bg-[#D9D9D91C]  border border-gray-200 focus:border-green-500 focus:ring-[#22C55E] rounded-md p-3 mb-4">
            <Image
              source={require("../../../../../assets/location.png")}
              style={{ width: 18, height: 18, marginRight: 8 }}
            />
            <TextInput
              placeholder={t('enter_property_location')}
              className="flex-1"
              value={location}
              onChangeText={setLocation}
              
            />
           </View>
        </View>

                      {/* Area */}
        <View className="border border-gray-300 rounded-lg bg-white ml-5 mt-5 mr-4 mb-3 p-5">
          <Text className="text-gray-500 font-semibold mb-2 text-left">
            {t('area')} <Text className="text-red-500">*</Text>
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
              placeholder={t('enter_area')}
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
            {t('description')} <Text style={{ color: "red" }}>*</Text>
          </Text>
        
          <View className="flex-row items-center bg-[#D9D9D91C]  border border-gray-200 focus:border-green-500 focus:ring-[#22C55E] rounded-md p-3 mb-4">

            <TextInput
              placeholder={t('describe_property')}
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
                          {t('vaasthu_details')} <Text style={{ color: "red" }}>*</Text>
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
              {/* ✅ Property Ownership Documents */}
<View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
  <Text className="text-base font-semibold">{t('property_ownership')}</Text>
  <Text className="text-gray-500 text-sm mt-1">{t('ownership_verify')}</Text>
  
  {isEditMode && existingDocuments.ownership.length > 0 ? (
    <View className="mt-4">
      <View className="flex-row items-center bg-green-50 border border-green-200 rounded-lg px-3 py-3">
        <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
        <View className="ml-3 flex-1">
          <Text className="text-sm font-medium text-gray-800">
            {existingDocuments.ownership.length} {existingDocuments.ownership.length === 1 ? 'document' : 'documents'} uploaded
          </Text>
          <Text className="text-xs text-gray-500 mt-1">Documents cannot be changed during edit</Text>
        </View>
      </View>
    </View>
  ) : !isEditMode ? (
    <DocumentUpload
      title={t('property_ownership')}
      subtitle={t('ownership_verify')}
      files={ownershipDocs}
      setFiles={setOwnershipDocs}
      required
    />
  ) : null}
</View>

{/* ✅ Owner Identity Documents */}
<View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
  <Text className="text-base font-semibold">{t('owner_identity')}</Text>
  <Text className="text-gray-500 text-sm mt-1">{t('upload_identity')}</Text>
  
  {isEditMode && existingDocuments.identity.length > 0 ? (
    <View className="mt-4">
      <View className="flex-row items-center bg-green-50 border border-green-200 rounded-lg px-3 py-3">
        <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
        <View className="ml-3 flex-1">
          <Text className="text-sm font-medium text-gray-800">
            {existingDocuments.identity.length} {existingDocuments.identity.length === 1 ? 'document' : 'documents'} uploaded
          </Text>
          <Text className="text-xs text-gray-500 mt-1">{t('documents_locked')}</Text>
        </View>
      </View>
    </View>
  ) : !isEditMode ? (
    <DocumentUpload
      title={t('owner_identity')}
      subtitle={t('upload_identity')}
      files={identityDocs}
      setFiles={setIdentityDocs}
      required
    />
  ) : null}
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
            {t('location_advantages')}
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
        className="mb-12"
      >
<View className="flex-row justify-end gap-4">
  <TouchableOpacity 
    className="bg-gray-200 px-5 py-3 rounded-lg"
    onPress={() => router.push(isEditMode ? "/home/screens/Sidebar/MyProperties" : "/(tabs)/home")}
  >
    <Text className="font-semibold">{t('cancel')}</Text>
  </TouchableOpacity>

  {/* Upload/Update Property Button */}
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
      {isSubmitting 
        ? (isEditMode ? t('updating') : t('uploading'))
        : (isEditMode ? t('update_property') : t('upload_property'))
      }
    </Text>
  </TouchableOpacity>
</View>

      </View>
    </SafeAreaView>
<Toast/>
    </>
  );
}