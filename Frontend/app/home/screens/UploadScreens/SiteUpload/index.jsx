//SiteUpload/index.jsx (src/app/home/screens/UploadScreens/SiteUpload/index.jsx)
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../../../i18n/index";
import "../../../../../assets/location.png";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Pressable,
  Alert,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Platform,
  Linking
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import TopAlert from "../TopAlert";
import { useLocalSearchParams } from "expo-router";
import { createProperty } from "utils/propertyApi";
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomPickerAlert from "components/CustomPickerAlert";
import PropertyImageUpload from "components/PropertyImageUpload";
import Toast from 'react-native-toast-message';
import MorePricingDetailsModal from "../MorePricingDetailsModal";
import HowTo360Modal from "../HowTo360Modal";
import PhotoUploadGuide from "../PhotoUploadGuide";
import DocumentUpload from "components/Documentupload";
import OwnerDetails from "components/OwnersDetails";
import LocationSection from 'components/LocationSection';

export default function UploadPropertyScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const [propertyType, setPropertyType] = useState(t("site_plot_land"));
  const [propertyTitle, setPropertyTitle] = useState(params.propertyTitle || "");
  const [images, setImages] = useState([]);
  
  const [possessionBy, setPossessionBy] = useState("");
  const [ownership, setOwnership] = useState("");
  const [approvedBy, setApprovedBy] = useState([]);
  const [constructionDone, setConstructionDone] = useState(null);
  const [constructionType, setConstructionType] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [propertyFacing, setPropertyFacing] = useState("");
  const [locationAdvantages, setLocationAdvantages] = useState([]);
  const [overlooking, setOverlooking] = useState([]);
  const [boundaryWall, setBoundaryWall] = useState(null);
  const [openSides, setOpenSides] = useState("");
  const [unit, setUnit] = useState("sqft");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ownershipDocs, setOwnershipDocs] = useState([]);
  const [identityDocs, setIdentityDocs] = useState([]);

  // Vaasthu Details States
  const [plotFacing, setPlotFacing] = useState(t("north_east"));
  const [mainEntryDirection, setMainEntryDirection] = useState(t("south_west"));
  const [plotSlope, setPlotSlope] = useState(t("towards_north"));
  const [openSpace, setOpenSpace] = useState(t("balanced_open_space"));
  const [plotShape, setPlotShape] = useState(t("square"));
  const [roadPosition, setRoadPosition] = useState(t("north_east"));
  const [waterSource, setWaterSource] = useState(t("water_source_north"));
  const [drainageDirection, setDrainageDirection] = useState(t("north_east"));
  const [compoundWallHeight, setCompoundWallHeight] = useState(t("equal_height_all_sides"));
  const [existingStructures, setExistingStructures] = useState(t("no_structures"));
  
  const [isMorePricingModalVisible, setIsMorePricingModalVisible] = useState(false);
  const [isHowto360ModalVisible, setIsHowto360ModalVisible] = useState(false);
  const [isPhotoGuideModalVisible, setIsPhotoGuideModalVisible] = useState(false);
  const router = useRouter();

  const [visible, setVisible] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [roadUnit, setRoadUnit] = useState("sqft"); 
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedOverlooking, setSelectedOverlooking] = useState([]);
  
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [length, setLength] = useState('');
  const [breadth, setBreadth] = useState('');
  const [floorsAllowed, setFloorsAllowed] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [description, setDescription] = useState('');
  const [roadWidth, setRoadWidth] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickerAlertVisible, setPickerAlertVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const getUserLanguage = () => {
    const currentLang = i18n.language || 'en';
    console.log('📝 Current app language:', currentLang);
    return currentLang;
  };

  const showToast = (message) => {
    Toast.show({
      type: 'error',
      text1: t('error'),
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  };

  const toggleArray = (arr, setArr, item) => {
    if (arr.includes(item)) setArr(arr.filter((i) => i !== item));
    else setArr([...arr, item]);
  };

  const PillButton = ({ label, selected, onPress }) => (
    <Pressable
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
    </Pressable>
  );

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
      const newImages = result.assets.map(asset => asset.uri);
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
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const handleOpenPlayStore = () => {
    const playStoreLink = 'https://play.google.com/store/apps/details?id=com.google.android.street';
    Linking.openURL(playStoreLink).catch(err =>
      console.error("Couldn't load page", err)
    );
  };

  const pickImage = () => {
    setPickerAlertVisible(true);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    try {
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
      
      console.log('🎬 Starting upload process...');
      setIsSubmitting(true);

      if (!propertyTitle?.trim()) {
        showToast(t('property_title_required'));
        setIsSubmitting(false);
        return;
      }

      if (!location?.trim()) {
        showToast(t('location_required'));
        setIsSubmitting(false);
        return;
      }

      if (!neighborhood?.trim()) {
        showToast(t('area_required'));
        setIsSubmitting(false);
        return;
      }
      
      if (!length?.trim()) {
        showToast(t('length_required'));
        setIsSubmitting(false);
        return;
      }

      if (!breadth?.trim()) {
        showToast(t('breadth_required'));
        setIsSubmitting(false);
        return;
      }

      const priceValue = parseFloat(expectedPrice);
      console.log('💰 Price validation:', { expectedPrice, priceValue, isValid: !isNaN(priceValue) && priceValue > 0 });

      if (!expectedPrice || isNaN(priceValue) || priceValue <= 0) {
        showToast(t('valid_expected_price_required'));
        setIsSubmitting(false);
        return;
      }

      if (!description?.trim()) {
        showToast(t('description_required'));
        setIsSubmitting(false);
        return;
      }

      if (images.length === 0) {
        console.log('❌ No images selected');
        showToast(t('add_at_least_one_image'));
        setIsSubmitting(false);
        return;
      }

      if (ownershipDocs.length === 0 || identityDocs.length === 0) {
        showToast(t('upload_required_documents'));
        setIsSubmitting(false);
        return;
      }

      if (!ownerName?.trim()) {
        showToast(t('owner_name_required'));
        setIsSubmitting(false);
        return;
      }

      if (!neighborhood?.trim()) {
  showToast(t('area_required'));
  setIsSubmitting(false);
  return;
}


      if (!phone?.trim()) {
        showToast(t('phone_number_required'));
        setIsSubmitting(false);
        return;
      }
      
      if (!email?.trim()) {
        showToast(t('email_required'));
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Validation passed');

      // Web-specific: Convert blob URIs to File objects for upload
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

      const propertyData = {
        propertyType: "Site/Plot/Land",
        propertyTitle,
        location,
        area: neighborhood,
        description,
        originalLanguage: getUserLanguage(),
        ownerDetails: {
          name: ownerName.trim(),
          phone: phone.trim(),
          email: email.trim(),
        },
        expectedPrice: parseFloat(expectedPrice),
        priceDetails: {
          allInclusive: selectedPrices.includes(t("all_inclusive_price")),
          negotiable: selectedPrices.includes(t("price_negotiable")),
          taxExcluded: selectedPrices.includes(t("tax_govt_charges_excluded"))
        },
        siteDetails: {
          area: area !== "" ? Number(area) : undefined,
          areaUnit: unit,
          length: length !== "" ? Number(length) : undefined,
          breadth: breadth !== "" ? Number(breadth) : undefined,
          floorsAllowed: floorsAllowed ? Number(floorsAllowed) : 0,
          boundaryWall: boundaryWall === "Yes",
          openSides: openSides ? Number(openSides) : 0,
          constructionDone: constructionDone === "yes",
          constructionType,
          possessionBy,
          ownership: ownership || "Freehold",
          approvedBy,
          amenities,
          propertyFacing: propertyFacing || "East",
          overlooking,
          inGatedSociety: selectedOverlooking.includes(t("in_gated_society")),
          cornerProperty: selectedOverlooking.includes(t("corner_property")),
          locationAdvantages,
          roadWidth: roadWidth ? Number(roadWidth) : 0,
          roadWidthUnit: roadUnit,
          vaasthuDetails: {
            plotFacing,
            mainEntryDirection,
            plotSlope,
            openSpace,
            plotShape,
            roadPosition,
            waterSource,
            drainageDirection,
            compoundWallHeight,
            existingStructures
          }
        }
      };

      console.log('📡 Calling createProperty API...');
      console.log('📋 Final property data:', JSON.stringify(propertyData, null, 2));
      console.log('📸 Images to upload:', uploadImages.length, 'images');
      console.log('🔍 First image URI:', uploadImages[0]);
      
      const result = await createProperty(
        propertyData,
        uploadImages,
        ownershipDocs,
        identityDocs
      );

      console.log('📥 API Result:', result);
      console.log('📥 API Result Data:', JSON.stringify(result.data, null, 2));
      
     if (result.success) {
  Alert.alert(
    t("success"),
    t("property_uploaded_successfully"),
    [
      {
        text: t("ok"),
        onPress: () => {
          router.replace("/(tabs)/home");
        },
      },
    ]
  );
}
       else {
        console.error('❌ Upload failed:', result);
        Alert.alert(
          t("error"), 
          result.data?.message || result.error || t("failed_to_upload_property")
        );
      }
      
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert(t("error"), t("something_went_wrong"));
    } finally {
      setIsSubmitting(false);
    }
  };
    
  return (
    <>
      <View className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <TopAlert visible={alertVisible} onHide={() => setAlertVisible(false)} />
        <MorePricingDetailsModal
          visible={isMorePricingModalVisible}
          onClose={() => setIsMorePricingModalVisible(false)}
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
        
        <View className="flex-row items-center mt-3 mb-4">
          <TouchableOpacity
            onPress={() => router.push("/home/screens/UploadScreens/AddScreen")}
            className="p-2"
            accessibilityRole="button"
          >
            <Image
              source={require("../../../../../assets/arrow.png")}
              style={{ width: 20, height: 20, resizeMode: "contain" }}
            />
          </TouchableOpacity>
          <View className="ml-2">
            <Text className="text-[16px] font-semibold">
              {t('upload_your_property')}
            </Text>
            <Text className="text-[12px] text-[#00000066]">
              {t('add_property_details')}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 36 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Property Image Upload Component */}
          <PropertyImageUpload
            images={images}
            onPickImage={pickImage}
            onRemoveImage={removeImage}
            onViewGuidelines={() => setIsPhotoGuideModalVisible(true)}
            onWatchTutorial={() => setIsHowto360ModalVisible(true)}
          />

          {/* Basic Details */}
          <View
            className="bg-white rounded-lg p-4 mb-4"
            style={{ borderWidth: 1, borderColor: "#0000001A" }}
          >
            <Text className="text-[16px] font-bold mb-5">{t('basic_details')}</Text>

            <Text className="text-[15px] text-[#00000099] mb-2">
              {t('property_title')} <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder={t('property_title_placeholder')}
              className="rounded-md p-3 mb-3"
              style={{ 
                borderWidth: 2, 
                borderColor: focusedField === 'propertyTitle' ? '#22C55E' : '#0000001A', 
                height:50, 
                backgroundColor:"#D9D9D91C"
              }}
              value={propertyTitle}
              onChangeText={(text) => setPropertyTitle(text.replace(/[^a-zA-Z0-9\s]/g, ''))}
              onFocus={() => setFocusedField('propertyTitle')}
              onBlur={() => setFocusedField(null)}
            />

            <Text className="text-[15px] text-[#00000099] mb-2">{t('property_type')}</Text>
            <TouchableOpacity
              onPress={() =>
                setVisible(visible === "propertyType" ? null : "propertyType")
              }
              className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300"
            >
              <Text className="text-gray-800 text-left">
                {propertyType || t("house")}
              </Text>
              <Ionicons name="chevron-down" size={24} color="#888" />
            </TouchableOpacity>
            {visible === "propertyType" && (
              <View
                className="bg-white rounded-lg shadow-lg -mt-1 mb-4"
                style={{ borderWidth: 1, borderColor: "#0000001A" }}
              >
                {[
                  { key: "House", label: t("house") },
                  { key: "Site/Plot/Land", label: t("site_plot_land") },
                  { key: "Commercial", label: t("commercial") },
                  { key: "Resort", label: t("resort") }
                ].map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    onPress={() => {
                      setPropertyType(type.label);
                      setVisible(null);
                      
                      if (type.key === "House") {
                        router.push({
                          pathname: "/home/screens/UploadScreens/AddScreen",
                          params: { 
                            images: JSON.stringify(images),
                            propertyTitle: propertyTitle 
                          },
                        });
                      } else if (type.key === "Site/Plot/Land") {
                        // Already on this screen
                      } else if (type.key === "Commercial") {
                        router.push({
                          pathname: "/home/screens/UploadScreens/CommercialUpload",
                          params: { 
                            images: JSON.stringify(images),
                            propertyTitle: propertyTitle 
                          },
                        });
                      } else {
                        router.push({
                          pathname: "/home/screens/UploadScreens/ResortUpload",
                          params: { 
                            images: JSON.stringify(images),
                            propertyTitle: propertyTitle 
                          },
                        });
                      }
                    }}
                    className={`p-4 border-b border-gray-200 ${
                      propertyType === type.label ? "bg-green-500" : "bg-white"
                    }`}
                  >
                    <Text className={`${propertyType === type.label ? "text-white" : "text-gray-800"}`}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

        
         

{/* Location */}
<View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
  <Text className="text-[15px] font-bold text-gray-600 mb-3">
    {t('location')} <Text style={{ color: "red" }}>*</Text>
  </Text>

  <View className="flex-row items-center bg-[#D9D9D91C] border border-gray-200 rounded-md p-3 mb-4"
    style={{
      borderColor: focusedField === 'location' ? '#22C55E' : '#d1d5db',
    }}>
    <Image
      source={require("../../../../../assets/location.png")}
      style={{ width: 18, height: 18, marginRight: 8 }}
    />
    <TextInput
      placeholder={t('enter_property_location')}
      className="flex-1"
      value={location}
      onChangeText={setLocation}
      onFocus={() => setFocusedField('location')}
      onBlur={() => setFocusedField(null)}
    />
  </View>
</View>

{/* Area/Neighborhood */}
<View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
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

          {/* Area + Length/Breadth */}
          <View
            className="bg-white rounded-lg p-4 mb-6"
            style={{ borderWidth: 1, borderColor: "#0000001A" }}
          >
            {/* Area with Unit Picker */}
            <Text className="text-[14px] font-medium text-[#00000099] mb-3">
              {t('area')} <Text className="text-red-500">*</Text>
            </Text>
            <View
              className="flex-row items-center mb-3 rounded-md"
              style={{
                borderWidth: 2,
                borderColor: focusedField === 'area' ? '#22C55E' : '#0000001A',
                backgroundColor: "#D9D9D91C",
                height: 52,
              }}
            >
              <TextInput
                placeholder="0"
                className="flex-1 px-3"
                style={{ height: 52 }}
                value={area}
                onChangeText={(text) => setArea(text.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                onFocus={() => setFocusedField('area')}
                onBlur={() => setFocusedField(null)}
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

            {/* Length & Breadth */}
            <View className="flex-row space-x-3 mb-3">
              <View className="flex-1">
                <Text className="text-sm text-[#00000099] mb-2">
                  {t('length')} <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  placeholder={t('in_ft')}
                  className="rounded-md p-3 mx-1"
                  style={{
                    borderWidth: 2,
                    borderColor: focusedField === 'length' ? '#22C55E' : '#0000001A',
                    backgroundColor: "#D9D9D91C",
                    height: 51,
                  }}
                  value={length}
                  onChangeText={(text) => setLength(text.replace(/[^0-9.]/g, ''))}
                  keyboardType="numeric"
                  onFocus={() => setFocusedField('length')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-[#00000099] mb-2">
                  {t('breadth')} <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  placeholder={t('in_ft')}
                  className="rounded-md p-3 mx-1"
                  style={{
                    borderWidth: 2,
                    borderColor: focusedField === 'breadth' ? '#22C55E' : '#0000001A',
                    backgroundColor: "#D9D9D91C",
                    height: 51,
                  }}
                  value={breadth}
                  onChangeText={(text) => setBreadth(text.replace(/[^0-9.]/g, ''))}
                  keyboardType="numeric"
                  onFocus={() => setFocusedField('breadth')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Floors */}
            <Text className="text-sm mt-3 text-[#00000099] mb-2">
              {t('floors_allowed_construction')}
            </Text>
            <TextInput
              placeholder={t('no_of_floors')}
              className="rounded-md p-3 mb-3"
              style={{
                borderWidth: 2,
                borderColor: focusedField === 'floors' ? '#22C55E' : '#0000001A',
                backgroundColor: "#D9D9D91C",
                height: 51,
              }}
              value={floorsAllowed}
              onChangeText={(text) => setFloorsAllowed(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              onFocus={() => setFocusedField('floors')}
              onBlur={() => setFocusedField(null)}
            />

            {/* Boundary Wall */}
            <Text className="mb-2 text-[14px] text-[#00000099]">
              {t('boundary_wall_question')}
            </Text>
            <View className="flex-row items-center space-x-3 mb-3">
              {[
                { key: "Yes", label: t("yes") },
                { key: "No", label: t("no") }
              ].map((v) => (
                <Pressable
                  key={v.key}
                  onPress={() => setBoundaryWall(v.key)}
                  className="w-[51px] h-[23px] rounded-full items-center mx-3 justify-center"
                  style={{
                    borderWidth: 1,
                    borderColor: boundaryWall === v.key ? "#22C55E" : "#0000001A",
                    backgroundColor: boundaryWall === v.key ? "#22C55E17" : "transparent",
                  }}
                >
                  <Text
                    className="text-[10px]"
                    style={{ color: boundaryWall === v.key ? "#22C55E" : "black" }}
                  >
                    {v.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Open Sides */}
            <Text className="mb-2 text-[14px] text-[#00000099]">{t('no_of_open_sides')}</Text>
            <View className="flex-row space-x-3 mb-4">
              {["1", "2", "3", "3+"].map((v) => (
                <Pressable
                  key={v}
                  onPress={() => setOpenSides(v)}
                  className="w-8 h-8 rounded-full items-center mx-2 justify-center"
                  style={{
                    borderWidth: 1,
                    borderColor: openSides === v ? "#22C55E" : "#0000001A",
                    backgroundColor: openSides === v ? "#22C55E17" : "transparent",
                  }}
                >
                  <Text
                    className="text-[10px]"
                    style={{ color: openSides === v ? "#22C55E" : "#00000099" }}
                  >
                    {v}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Construction Done */}
            <Text className="mb-2 text-[14px] text-[#00000099]">
              {t('construction_done_question')}
            </Text>
            <View className="flex-row space-x-3 mb-3">
              {[
                { key: "yes", label: t("yes") },
                { key: "no", label: t("no") }
              ].map((v) => (
                <Pressable
                  key={v.key}
                  onPress={() => setConstructionDone(v.key)}
                  className="w-[51px] h-[23px] rounded-full mx-3 items-center justify-center"
                  style={{
                    borderWidth: 1,
                    borderColor: constructionDone === v.key ? "#22C55E" : "#0000001A",
                    backgroundColor: constructionDone === v.key ? "#22C55E17" : "transparent",
                  }}
                >
                  <Text
                    className="text-[10px]"
                    style={{ color: constructionDone === v.key ? "#22C55E" : "black" }}
                  >
                    {v.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Construction Type */}
            {constructionDone === "yes" && (
              <>
                <Text className="mb-2 text-[14px] text-[#00000099]">
                  {t('construction_type_question')}
                </Text>
                <View className="flex-row flex-wrap mb-3">
                  {[
                    { k: "Shed", l: t("shed") },
                    { k: "Room", l: t("rooms") },
                    { k: "Washroom", l: t("washroom") },
                    { k: "Other", l: t("other") }
                  ].map((o) => (
                    <PillButton
                      key={o.k}
                      label={o.l}
                      selected={constructionType.includes(o.k)}
                      onPress={() =>
                        toggleArray(constructionType, setConstructionType, o.k)
                      }
                    />
                  ))}
                </View>
              </>
            )}

            {/* Possession */}
            <Text className="text-[15px] text-[#00000099] mb-2">{t('possession_by')}</Text>
            <TouchableOpacity
              onPress={() => setVisible(visible === "possessionBy" ? null : "possessionBy")}
              className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
            >
              <Text className="text-gray-800 text-left">
                {possessionBy || t("expected_by")}
              </Text>
              <Ionicons name="chevron-down" size={24} color="#888" />
            </TouchableOpacity>
            {visible === "possessionBy" && (
              <View
                className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
                style={{ borderWidth: 1, borderColor: "#0000001A" }}
              >
                {[
                  { key: "Immediate", label: t("immediate") },
                  { key: "1-3 months", label: t("1_3_months") },
                  { key: "3-6 months", label: t("3_6_months") },
                  { key: "6+ months", label: t("6_plus_months") },
                  { key: "Ready to Move", label: t("ready_to_move") },
                  { key: "Other", label: t("other") }
                ].map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => {
                      setPossessionBy(item.label);
                      setVisible(null);
                    }}
                    className={`p-4 border-b border-gray-200 ${possessionBy === item.label ? "bg-green-500" : "bg-white"}`}
                  >
                    <Text className={`${possessionBy === item.label ? "text-white" : "text-gray-800"}`}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Ownership */}
            <Text className="text-[15px] text-[#00000099] mb-2">{t('ownership')}</Text>
            <View className="flex-row flex-wrap mb-3">
              {[
                { key: "Freehold", label: t("freehold") },
                { key: "Leasehold", label: t("leasehold") },
                { key: "Co-operative Society", label: t("co_operative_society") },
                { key: "Power of Attorney", label: t("power_of_attorney") }
              ].map((o) => (
                <PillButton
                  key={o.key}
                  label={o.label}
                  selected={ownership === o.key}
                  onPress={() => setOwnership(o.key)}
                />
              ))}
            </View>

            {/* Approved By */}
            <Text className="text-[15px] text-[#00000099] mb-3">
              {t('approved_by_optional')}
            </Text>
            <View className="flex-row flex-wrap mb-3">
              {["GHMC", "HMDA", "DTCP"].map((o) => (
                <PillButton
                  key={o}
                  label={o}
                  selected={approvedBy.includes(o)}
                  onPress={() => toggleArray(approvedBy, setApprovedBy, o)}
                />
              ))}
            </View>

            {/* Price Details */}
            <View className="mt-2">
              <Text className="text-gray-500 font-semibold mb-2 text-left">
                {t('price_details')} <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                placeholder={t('expected_price_placeholder')}
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg bg-[#F9F9F9] p-3 mb-3 text-gray-800 text-left"
                value={expectedPrice}
                onChangeText={(text) => setExpectedPrice(text.replace(/[^0-9.]/g, ''))}
                onFocus={() => setFocusedField('price')}
                onBlur={() => setFocusedField(null)}
                style={{
                  borderColor: focusedField === 'price' ? '#90EE90' : '#d1d5db',
                }}
              />
            </View>
            <View className="flex-col gap-2 mb-2">
              {[
                { key: "All inclusive price", label: t("all_inclusive_price") },
                { key: "Price Negotiable", label: t("price_negotiable") },
                { key: "Tax and Govt.charges excluded", label: t("tax_govt_charges_excluded") }
              ].map((item) => {
                const isSelected = selectedPrices.includes(item.label);
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedPrices(selectedPrices.filter((i) => i !== item.label));
                      } else {
                        setSelectedPrices([...selectedPrices, item.label]);
                      }
                    }}
                    className="flex-row items-center gap-2"
                  >
                    <View
                      className={`w-5 h-5 border rounded-sm items-center justify-center ${
                        isSelected ? "border-green-500 bg-green-500" : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
                    </View>
                    <Text className="text-gray-700 text-left">{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity onPress={() => setIsMorePricingModalVisible(true)}>
                <Text className="text-[#22C55E] font-semibold text-left">
                  {t('add_more_pricing_details')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Description */}
            <Text className="mt-4 mb-2 text-[15px] text-[#00000099]">
              {t('description')} <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder={t('describe_property')}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
              className="rounded-md p-3"
              style={{
                borderWidth: 2,
                borderColor: focusedField === 'description' ? '#22C55E': '#0000001A',
                width: "100%",
                height: 108,
                paddingTop: 10,
              }}
              value={description}
              onChangeText={(text) => setDescription(text.replace(/[^a-zA-Z0-9\s]/g, ''))}
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Vaasthu Details Section */}
          <View
            className="bg-white rounded-lg p-4 mb-4"
            style={{ borderWidth: 1, borderColor: "#0000001A" }}
          >
            <View className="flex-row items-center mb-4 justify-between">
              <Text className="text-lg font-semibold text-gray-800">
                {t('vaasthu_details')}
              </Text>
              <Image
                source={require("../../../../../assets/vastu.png")}
                style={{ width: 30, height: 30 }}
              />
            </View>

            {/* Vaasthu Fields with Translations */}
            {[
              { key: "plotFacing", label: t("plot_facing"), value: plotFacing, setValue: setPlotFacing,
                options: [t("north_east"), t("south_west"), t("east"), t("west"), t("north"), t("south"), t("south_east"), t("north_west")] },
              { key: "mainEntry", label: t("main_entry_gate_direction"), value: mainEntryDirection, setValue: setMainEntryDirection,
                options: [t("north_east"), t("south_west"), t("east"), t("west"), t("north"), t("south"), t("south_east"), t("north_west")] },
              { key: "plotSlope", label: t("plot_slope_direction"), value: plotSlope, setValue: setPlotSlope,
                options: [t("towards_north"), t("towards_south"), t("towards_east"), t("towards_west"), t("level_ground")] },
              { key: "openSpace", label: t("open_space_vastu"), value: openSpace, setValue: setOpenSpace,
                options: [t("balanced_open_space"), t("more_space_north"), t("more_space_east"), t("more_space_south"), t("more_space_west")] },
              { key: "plotShape", label: t("shape"), value: plotShape, setValue: setPlotShape,
                options: [t("square"), t("rectangle"), t("irregular"), t("l_shaped"), t("t_shaped")] },
              { key: "roadPosition", label: t("road_position"), value: roadPosition, setValue: setRoadPosition,
                options: [t("north_east"), t("south_west"), t("east"), t("west"), t("north"), t("south")] },
              { key: "waterSource", label: t("water_source_location"), value: waterSource, setValue: setWaterSource,
                options: [t("water_source_north"), t("water_source_east"), t("water_source_north_east"), t("no_water_source")] },
              { key: "drainage", label: t("drainage_direction"), value: drainageDirection, setValue: setDrainageDirection,
                options: [t("north_east"), t("east"), t("north"), t("south_east")] },
              { key: "wallHeight", label: t("compound_wall_height"), value: compoundWallHeight, setValue: setCompoundWallHeight,
                options: [t("equal_height_all_sides"), t("higher_south"), t("higher_west"), t("no_compound_wall")] },
              { key: "structures", label: t("existing_structures"), value: existingStructures, setValue: setExistingStructures,
                options: [t("no_structures"), t("shed_garage"), t("small_room"), t("well_borewell"), t("temple")] }
            ].map((field) => (
              <View key={field.key}>
                <Text className="text-sm text-gray-600 mb-2">{field.label}</Text>
                <TouchableOpacity
                  onPress={() => setVisible(visible === field.key ? null : field.key)}
                  className="bg-[#F9FAFB] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-4"
                >
                  <Text className="text-gray-800">{field.value}</Text>
                  <Ionicons name="chevron-down" size={20} color="#555" />
                </TouchableOpacity>
                {visible === field.key && (
                  <View className="bg-white rounded-lg shadow-lg -mt-3 mb-4 border border-gray-200">
                    {field.options.map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => {
                          field.setValue(option);
                          setVisible(null);
                        }}
                        className="p-3 border-b border-gray-200"
                      >
                        <Text className="text-gray-800">{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>

          <View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <DocumentUpload
              title={t('property_ownership')}
              subtitle={t('ownership_verify')}
              files={ownershipDocs}
              setFiles={setOwnershipDocs}
              required
            />
          </View>

          <View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <DocumentUpload
              title={t('owner_identity')}
              subtitle={t('upload_identity')}
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

          {/* Amenities, Overlooking, Facing */}
          <View
            className="bg-white rounded-lg p-4 mb-4"
            style={{ borderWidth: 1, borderColor: "#0000001A" }}
          >
            {/* Amenities */}
            <Text className="text-[15px] text-[#00000099] mb-2">{t('amenities')}</Text>
            <View className="flex-row flex-wrap mb-3">
              {[
  { key: "+Maintenance Staff", label: "+ " + t("maintenance_staff") },
  { key: "+Water Storage", label: "+ " + t("water_storage") },
  { key: "+RainWater Harvesting", label: "+ " + t("rainwater_harvesting") },
  { key: "Feng Shui/Vastu Complaint", label: t("vastu_compliant") }
].map((item) => (
  <PillButton
    key={item.key}
    label={item.label}
    selected={amenities.includes(item.key)}
    onPress={() => toggleArray(amenities, setAmenities, item.key)}
  />
))}
            </View>

            {/* Overlooking */}
            <Text className="text-[15px] text-[#00000099] mb-2">{t('overlooking')}</Text>
            <View className="flex-row flex-wrap mb-3">
              {[
                { key: "pool", label: t("pool") },
                { key: "park", label: t("park") },
                { key: "club", label: t("club") },
                { key: "MainRoad", label: t("main_road") },
                { key: "Others", label: t("others") }
              ].map((item) => (
                <PillButton
                  key={item.key}
                  label={item.label}
                  selected={overlooking.includes(item.key)}
                  onPress={() => toggleArray(overlooking, setOverlooking, item.key)}
                />
              ))}
            </View>

            {/* Overlooking Additional */}
            <Text className="text-[15px] text-[#00000099] mt-4 mb-2">
              {t('overlooking')} 
            </Text>
            <View className="flex-col gap-2 mb-2">
              {[
                { key: "In a Gated Society", label: t("in_gated_society") },
                { key: "Corner Property", label: t("corner_property") }
              ].map((item) => {
                const isSelected = selectedOverlooking.includes(item.label);
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedOverlooking(selectedOverlooking.filter((i) => i !== item.label));
                      } else {
                        setSelectedOverlooking([...selectedOverlooking, item.label]);
                      }
                    }}
                    className="flex-row items-center gap-2"
                  >
                    <View
                      className={`w-5 h-5 border rounded-sm items-center justify-center ${
                        isSelected ? "border-green-500 bg-green-500" : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
                    </View>
                    <Text className="text-gray-700 text-left">{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Property Facing */}
            <Text className="text-[15px] text-[#00000099] mt-4 mb-3">
              {t('property_facing')}
            </Text>
            <View className="flex-row flex-wrap mb-3">
              {[
                { key: "East", label: t("east") },
                { key: "West", label: t("west") },
                { key: "North", label: t("north") },
                { key: "South", label: t("south") },
                { key: "North-East", label: t("north_east") },
                { key: "South-east", label: t("south_east") },
                { key: "South-West", label: t("south_west") }
              ].map((item) => (
                <PillButton
                  key={item.key}
                  label={item.label}
                  selected={propertyFacing === item.key}
                  onPress={() => setPropertyFacing(item.key)}
                />
              ))}
            </View>

            <Text className="text-[15px] text-gray-500 mb-3">{t('road_width')}</Text>
            <View
              className="flex-row items-center rounded-md p-3"
              style={{
                backgroundColor: "#D9D9D91C",
                borderWidth: 2,
                borderColor: focusedField === 'roadWidth' ? '#22C55E' : '#0000001A',
              }}
            >
              <TextInput
                placeholder={t('enter_width')}
                className="flex-1 px-3"
                style={{ height: 52 }}
                value={roadWidth}
                onChangeText={(text) => setRoadWidth(text.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                onFocus={() => setFocusedField('roadWidth')}
                onBlur={() => setFocusedField(null)}
              />
              <View style={{ width: 1, backgroundColor: "#0000001A", height: "90%" }} />
              <View style={{ width: 100 }}>
                <Picker
                  selectedValue={roadUnit}
                  onValueChange={(v) => setRoadUnit(v)}
                  mode="dropdown"
                  style={{ height: 52, width: "100%" }}
                >
                  <Picker.Item label="sqft" value="sqft" />
                  <Picker.Item label="sqm" value="sqm" />
                  <Picker.Item label="acre" value="acre" />
                </Picker>
              </View>
            </View>
          
            {/* Location Advantages */}
            <Text className="text-[15px] text-[#00000099] mt-4 mb-3">
              {t('location_advantages')}
            </Text>
            <View className="flex-row flex-wrap">
              {[
                { key: "+ close to Market", label: t("close_to_market") },
                { key: "+ close to Mall", label: t("close_to_mall") },
                { key: "+ close to Hospital", label: t("close_to_hospital") },
                { key: "+ close to Railway Station", label: t("close_to_railway_station") },
                { key: "+ close to Metro Station", label: t("close_to_metro_station") },
                { key: "+ close to School", label: t("close_to_school") },
                { key: "+ close to Airport", label: t("close_to_airport") },
                { key: "+ close to Highway", label: t("close_to_highway") }
              ].map((item) => (
                <PillButton
                  key={item.key}
                  label={item.label}
                  selected={locationAdvantages.includes(item.key)}
                  onPress={() =>
                    toggleArray(locationAdvantages, setLocationAdvantages, item.key)
                  }
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View
          style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16, gap: 12 }}
          className="space-x-3 mr-4 mb-3"
        >
          {/* Cancel Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#E5E7EB",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 10,
            }}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={{ color: "black", fontWeight: "600", fontSize: 15 }}>
              {t('cancel')}
            </Text>
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
              {isSubmitting ? t('uploading') : t('upload_property')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </>
  );
}