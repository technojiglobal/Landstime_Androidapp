//Frontend//app//home//screens//UploadScreens//AddScreen.jsx (Home / House)
import React, { useState, useEffect } from "react";
import { createProperty, testBackendConnection } from "../../../../utils/propertyApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../../../../i18n/index";
import { useTranslation } from "react-i18next";
import LocationSection from "../../../../components/LocationSection";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  FlatList,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopAlert from "./TopAlert";
import CustomPickerAlert from "../../../../components/CustomPickerAlert";
import HowTo360Modal from "./HowTo360Modal";
import PhotoUploadGuide from "./PhotoUploadGuide";
import { Linking } from "react-native";
import MorePricingDetailsModal from "./MorePricingDetailsModal";
import PropertyImageUpload from "../../../../components/PropertyImageUpload";
import Toast from "react-native-toast-message";
import FurnishingsModal from "./FurnishingsModal";
import DocumentUpload from "../../../../components/Documentupload";
import OwnerDetails from "../../../../components/OwnersDetails";

export default function AddScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();

  // Form state variables
  const [constructionStatus, setConstructionStatus] = useState("");
  const [possessionBy, setPossessionBy] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [furnishings, setFurnishings] = useState([]);
  const [modalSubtitle, setModalSubtitle] = useState("");
  const [propertyType, setPropertyType] = useState(t("house"));
  const [propertyTitle, setPropertyTitle] = useState("");
  const [floors, setFloors] = useState("");
  const [area, setArea] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [areaKey, setAreaKey] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [balconies, setBalconies] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [otherRooms, setOtherRooms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOwnership, setSelectedOwnership] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [images, setImages] = useState([]);
  const [covered, setCovered] = useState(0);
  const [open, setOpen] = useState(0);
  const [visible, setVisible] = useState(null);
  const [pickerAlertVisible, setPickerAlertVisible] = useState(false);
  const [houseFacing, setHouseFacing] = useState(t("north_east"));
  const [masterBedroom, setMasterBedroom] = useState(t("north_east"));
  const [childrenBedroom, setChildrenBedroom] = useState(t("north_east"));
  const [livingRoom, setLivingRoom] = useState(t("north_east"));
  const [kitchenRoom, setKitchenRoom] = useState(t("north_east"));
  const [poojaRoom, setPoojaRoom] = useState(t("north_east"));
  const [balcony, setBalcony] = useState(t("north_east"));
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isHowto360ModalVisible, setIsHowto360ModalVisible] = useState(false);
  const [isPhotoGuideModalVisible, setIsPhotoGuideModalVisible] = useState(false);
  const [isMorePricingModalVisible, setIsMorePricingModalVisible] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ownershipDocs, setOwnershipDocs] = useState([]);
  const [identityDocs, setIdentityDocs] = useState([]);
  const [locAdvantages, setLocAdvantages] = useState([]);
  const options = [t("0_1_years"), t("1_5_years"), t("5_10_years"), t("10_years")];
  const directions = [t("north_east"), t("south_west"), t("east"), t("west"), t("north_west"), t("south_east"), t("north"), t("south")];
  const ownershipOptions = [
    t("freehold"),
    t("leasehold"),
    t("co_operative_society"),
    t("power_of_attorney"),
  ];

  const fields = [
    {
      key: "houseFacing",
      label: t("house_facing"),
      value: houseFacing,
      setValue: setHouseFacing,
    },
    {
      key: "masterBedroom",
      label: t("master_bedroom"),
      value: masterBedroom,
      setValue: setMasterBedroom,
    },
    {
      key: "childrenBedroom",
      label: t("children_bedroom"),
      value: childrenBedroom,
      setValue: setChildrenBedroom,
    },
    {
      key: "livingRoom",
      label: t("living_room"),
      value: livingRoom,
      setValue: setLivingRoom,
    },
    {
      key: "kitchenRoom",
      label: t("kitchen_room"),
      value: kitchenRoom,
      setValue: setKitchenRoom,
    },
    {
      key: "poojaRoom",
      label: t("pooja_room"),
      value: poojaRoom,
      setValue: setPoojaRoom,
    },
    { key: "balcony", label: t("balcony"), value: balcony, setValue: setBalcony },
  ];

  const getUserLanguage = () => {
    const currentLang = i18n.language || "en";
    console.log("📝 Current app language:", currentLang);
    return currentLang;
  };
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

  const handleUpload = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("🔐 Current token before upload:", token);
      if (!token) {
        Alert.alert(t("login_required"), t("please_login_to_upload_properties"), [
          {
            text: t("go_to_login"),
            onPress: () => router.push("/(tabs)/profile"),
          },
          {
            text: t("cancel"),
            style: "cancel",
          },
        ]);
        return;
      }

      console.log("🧪 Testing backend connection...");
      const backendReachable = await testBackendConnection();
      if (!backendReachable) {
        Alert.alert(
          "Connection Error",
          "Cannot reach backend server. Please check if backend is running."
        );
        setIsSubmitting(false);
        return;
      }
      console.log("✅ Backend is reachable!");

      console.log("🎬 Starting upload process...");
      setIsSubmitting(true);
      console.log("🔍 Validating fields...");

      if (!propertyTitle?.trim()) {
        Toast.show({
          type: "error",
          text1: t("error"),
          text2: t("property_title_required"),
        });
        setIsSubmitting(false);
        return;
      }
      console.log('📋 Form values before validation:', {
        location,
        neighborhood,
        area,
        areaKey
      });
      if (!location?.trim()) {
        Toast.show({
          type: "error",
          text1: t("error"),
          text2: t("location_required"),
        });
        setIsSubmitting(false);
        return;
      }
      if (!neighborhood?.trim()) {
        Toast.show({
          type: "error",
          text1: t("error"),
          text2: "Locality/Area is required",
        });
        setIsSubmitting(false);
        return;
      }
      if (!area?.trim()) {
        Toast.show({
          type: "error",
          text1: t("error"),
          text2: "Property area in sqft is required",
        });
        setIsSubmitting(false);
        return;
      }

      const priceValue = parseFloat(expectedPrice);
      console.log("💰 Price validation:", {
        expectedPrice,
        priceValue,
        isValid: !isNaN(priceValue) && priceValue > 0,
      });
      if (!expectedPrice || isNaN(priceValue) || priceValue <= 0) {
        Toast.show({
          type: "error",
          text1: t("error"),
          text2: t("valid_expected_price_required"),
        });
        setIsSubmitting(false);
        return;
      }
      if (ownershipDocs.length === 0) {
        Toast.show({
          type: "error",
          text1: t("missing_document"),
          text2: t("sale_deed_conveyance_required"),
        });
        setIsSubmitting(false);
        return;
      }
      if (identityDocs.length === 0) {
        Toast.show({
          type: "error",
          text1: t("missing_document"),
          text2: t("owner_identity_proof_required"),
        });
        setIsSubmitting(false);
        return;
      }
      if (!description?.trim()) {
        Toast.show({
          type: "error",
          text1: t("error"),
          text2: t("description_required"),
        });
        setIsSubmitting(false);
        return;
      }
      if (images.length === 0) {
        console.log("❌ No images selected");
        Toast.show({
          type: "error",
          text1: t("error"),
          text2: t("add_at_least_one_image"),
        });
        setIsSubmitting(false);
        return;
      }
      if (!ownerName?.trim()) {
        Toast.show({
          type: "error",
          text1: t("missing_details"),
          text2: t("owner_name_required"),
        });
        setIsSubmitting(false);
        return;
      }

      // ✅ Phone validation with detailed error
      if (!phone?.trim()) {
        Toast.show({
          type: "error",
          text1: t("missing_details"),
          text2: t("phone_number_required"),
        });
        setIsSubmitting(false);
        return;
      }

      // ✅ Validate phone format (Indian mobile: 10 digits, starts with 6-9)
      const phoneRegex = /^[6-9]\d{9}$/;
      const cleanedPhone = phone.replace(/[\s\-\(\)]/g, ''); // Remove spaces, hyphens, brackets
      if (!phoneRegex.test(cleanedPhone)) {
        Toast.show({
          type: "error",
          text1: "Invalid Phone Number",
          text2: "Please enter a valid 10-digit mobile number starting with 6-9",
        });
        setIsSubmitting(false);
        return;
      }

      // ✅ Email validation
      if (!email?.trim()) {
        Toast.show({
          type: "error",
          text1: t("missing_details"),
          text2: t("email_required"),
        });
        setIsSubmitting(false);
        return;
      }

      // ✅ Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        Toast.show({
          type: "error",
          text1: "Invalid Email",
          text2: "Please enter a valid email address (e.g., user@example.com)",
        });
        setIsSubmitting(false);
        return;
      }
      console.log("✅ Validation passed");


      const propertyData = {
        propertyType: "House",
        propertyTitle,
        location,
        area: neighborhood,
        areaKey,
        description,
        originalLanguage: getUserLanguage(),
        expectedPrice: parseFloat(expectedPrice),
        ownerDetails: {
          name: ownerName,
          phone,
          email,
        },
        priceDetails: {
          allInclusive: selectedPrices.includes(t("all_inclusive_price")),
          negotiable: selectedPrices.includes(t("price_negotiable")),
          taxExcluded: selectedPrices.includes(t("tax_excluded")),
        },
        houseDetails: {
          floors: parseInt(floors) || 0,
          area: parseFloat(area) || 0,
          areaUnit: "sqft",
          bedrooms: parseInt(bedrooms) || 0,
          bathrooms: parseInt(bathrooms) || 0,
          balconies: parseInt(balconies) || 0,
          availabilityStatus:
            constructionStatus === "Ready" ? "Ready to Move" : "Under Construction",
          ageOfProperty:
            selectedAge === t("0_1_years")
              ? "0-1 years"
              : selectedAge === t("1_5_years")
                ? "1-5 years"
                : selectedAge === t("5_10_years")
                  ? "5-10 years"
                  : selectedAge === t("10_years")
                    ? "10+ years"
                    : selectedAge,
          ownership:
            selectedOwnership === t("freehold")
              ? "Freehold"
              : selectedOwnership === t("leasehold")
                ? "Leasehold"
                : selectedOwnership === t("co_operative_society")
                  ? "Co-operative Society"
                  : selectedOwnership === t("power_of_attorney")
                    ? "Power of Attorney"
                    : selectedOwnership,
          possessionBy: constructionStatus === "Under" ? possessionBy : undefined,
          locationAdvantages: locAdvantages,
          otherRooms: otherRooms.map((room) => {
            if (room === t("pooja_room")) return "Pooja Room";
            if (room === t("study_room")) return "Study Room";
            if (room === t("servant_room")) return "Servant Room";
            if (room === t("others")) return "Others";
            return room;
          }),
          furnishing: furnishing
            ? furnishing === t("furnished")
              ? "Furnished"
              : furnishing === t("semi_furnished")
                ? "Semi-furnished"
                : furnishing === t("unfurnished")
                  ? "Unfurnished"
                  : undefined
            : undefined,
          furnishingItems: furnishings.length > 0 ? furnishings : undefined,
          parking: {
            covered,
            open,
          },
          vaasthuDetails: {
  houseFacing: houseFacing
    .replace(t("north_east"), "North East")
    .replace(t("south_west"), "South West")
    .replace(t("north_west"), "North West")
    .replace(t("south_east"), "South East")
    .replace(t("east"), "East")
    .replace(t("west"), "West")
    .replace(t("north"), "North")
    .replace(t("south"), "South"),
  masterBedroom: masterBedroom
    .replace(t("north_east"), "North East")
    .replace(t("south_west"), "South West")
    .replace(t("north_west"), "North West")
    .replace(t("south_east"), "South East")
    .replace(t("east"), "East")
    .replace(t("west"), "West")
    .replace(t("north"), "North")
    .replace(t("south"), "South"),
  childrenBedroom: childrenBedroom
    .replace(t("north_east"), "North East")
    .replace(t("south_west"), "South West")
    .replace(t("north_west"), "North West")
    .replace(t("south_east"), "South East")
    .replace(t("east"), "East")
    .replace(t("west"), "West")
    .replace(t("north"), "North")
    .replace(t("south"), "South"),
  livingRoom: livingRoom
    .replace(t("north_east"), "North East")
    .replace(t("south_west"), "South West")
    .replace(t("north_west"), "North West")
    .replace(t("south_east"), "South East")
    .replace(t("east"), "East")
    .replace(t("west"), "West")
    .replace(t("north"), "North")
    .replace(t("south"), "South"),
  kitchenRoom: kitchenRoom
    .replace(t("north_east"), "North East")
    .replace(t("south_west"), "South West")
    .replace(t("north_west"), "North West")
    .replace(t("south_east"), "South East")
    .replace(t("east"), "East")
    .replace(t("west"), "West")
    .replace(t("north"), "North")
    .replace(t("south"), "South"),
  poojaRoom: poojaRoom
    .replace(t("north_east"), "North East")
    .replace(t("south_west"), "South West")
    .replace(t("north_west"), "North West")
    .replace(t("south_east"), "South East")
    .replace(t("east"), "East")
    .replace(t("west"), "West")
    .replace(t("north"), "North")
    .replace(t("south"), "South"),
  balcony: balcony
    .replace(t("north_east"), "North East")
    .replace(t("south_west"), "South West")
    .replace(t("north_west"), "North West")
    .replace(t("south_east"), "South East")
    .replace(t("east"), "East")
    .replace(t("west"), "West")
    .replace(t("north"), "North")
    .replace(t("south"), "South"),
},
        },
      };

      console.log("📡 Calling createProperty API...");
      console.log("📋 Final property data:", JSON.stringify(propertyData, null, 2));
      const result = await createProperty(
        propertyData,
        images,
        ownershipDocs,
        identityDocs
      );
      console.log("📥 API Result:", result);
      if (result.success) {
        console.log("✅ Upload successful!");
        Alert.alert(t("success"), t("property_uploaded_successfully"));
        setAlertVisible(true);
        setTimeout(() => {
          router.push("/(tabs)/home");
        }, 2000);
      } else {
        console.error("❌ Upload failed:", result);
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

  const takePhoto = async () => {
    setPickerAlertVisible(false);
    let permission = await ImagePicker.getCameraPermissionsAsync();
    if (permission.status !== "granted") {
      permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(t("permission_required"), t("grant_camera_permissions"));
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
      console.log("📸 Camera - Images added:", newImages);
    }
  };

  const pickFromGallery = async () => {
    setPickerAlertVisible(false);
    let permission = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(t("permission_required"), t("grant_photo_library_access"));
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
      console.log("📸 Gallery - Images added:", newImages);
    }
  };

  const pickImage = () => {
    setPickerAlertVisible(true);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleOpenPlayStore = () => {
    const playStoreLink =
      "https://play.google.com/store/apps/details?id=com.google.android.street";
    Linking.openURL(playStoreLink).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <SafeAreaView className="flex-1 bg-white">
              <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
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
              <MorePricingDetailsModal
                visible={isMorePricingModalVisible}
                onClose={() => setIsMorePricingModalVisible(false)}
              />

              <FurnishingsModal
                visible={modalOpen}
                onClose={() => setModalOpen(false)}
                subtitle={modalSubtitle}
                onSubmit={(data) => {
                  const items = [
                    ...data.quantities.map(([item, qty]) => `${item} (${qty})`),
                    ...data.extras,
                  ];
                  setFurnishings(items);
                }}
              />

              <View className="flex-row items-center mt-3 mb-4">
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/home")}
                  className="p-2"
                  accessibilityRole="button"
                >
                  <Image
                    source={require("../../../../assets/arrow.png")}
                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                  />
                </TouchableOpacity>
                <View className="ml-2">
                  <Text className="text-[16px] font-semibold">{t("upload_property")}</Text>
                  <Text className="text-[12px] text-[#00000066]">
                    {t("add_property_details")}
                  </Text>
                </View>
              </View>

              <ScrollView>
                <CustomPickerAlert
                  visible={pickerAlertVisible}
                  onClose={() => setPickerAlertVisible(false)}
                  onCameraPress={takePhoto}
                  onGalleryPress={pickFromGallery}
                />

                <PropertyImageUpload
                  images={images}
                  onPickImage={pickImage}
                  onRemoveImage={removeImage}
                  onViewGuidelines={() => setIsPhotoGuideModalVisible(true)}
                  onWatchTutorial={() => setIsHowto360ModalVisible(true)}
                />

                {/* Basic Details */}
                <View className="border mt-1 overflow-hidden rounded-xl border-gray-300 shadow-sm bg-white m-5 p-5">
                  <Text className="mt-3 mb-4 font-bold">{t("basic_details")}</Text>

                  {/* Title */}
                  <Text className="text-gray-500 font-semibold mb-2 text-left">
                    {t("property_title")} <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    placeholder={t("property_title_placeholder")}
                    placeholderTextColor="#9CA3AF"
                    value={propertyTitle}
                    onChangeText={(text) => setPropertyTitle(text)}
                    style={{
                      backgroundColor: "#f3f4f6",
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 16,
                      color: "#1f2937",
                      borderColor: focusedField === "propertyTitle" ? "#22C55E" : "#d1d5db",
                      borderWidth: 2,
                    }}
                    onFocus={() => setFocusedField("propertyTitle")}
                    onBlur={() => setFocusedField(null)}
                  />

                  {/* Property Type */}
                  <View className="px-1">
                    <Text className="text-gray-500 font-semibold mb-2">
                      {t("property_type")}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setVisible(visible === "propertyType" ? null : "propertyType")
                      }
                      className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300"
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
                        {["House", "Site/Plot/Land", "Commercial", "Resort"].map((type) => (
                          <TouchableOpacity
                            key={type}
                            onPress={() => {
                              setPropertyType(type);
                              setVisible(null);
                              if (type === "House") {
                                // Already on the correct screen
                              } else if (type === "Site/Plot") {
                                router.push({
                                  pathname: "/home/screens/UploadScreens/SiteUpload",
                                  params: {
                                    images: JSON.stringify(images),
                                    propertyTitle: propertyTitle,
                                  },
                                });
                              } else if (type === "Commercial") {
                                router.push({
                                  pathname: "/home/screens/UploadScreens/CommercialUpload",
                                  params: {
                                    images: JSON.stringify(images),
                                    propertyTitle: propertyTitle,
                                  },
                                });
                              } else if (type === "Site/Plot/Land") {
                                router.push({
                                  pathname: "/home/screens/UploadScreens/SiteUpload",
                                  params: {
                                    images: JSON.stringify(images),
                                    propertyTitle: propertyTitle,
                                  },
                                });
                              } else if (type === "Resort") {
                                router.push({
                                  pathname: "/home/screens/UploadScreens/ResortUpload",
                                  params: {
                                    images: JSON.stringify(images),
                                    propertyTitle,
                                  },
                                });
                              }
                            }}
                            className={`p-4 border-b border-gray-200 ${propertyType === type ? "bg-green-500" : "bg-white"
                              }`}
                          >
                            <Text
                              className={`${propertyType === type ? "text-white" : "text-gray-800"
                                }`}
                            >
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Floors & Area */}
                  <View className="flex-row gap-2 mb-4">
                    <View className="flex-1">
                      <Text className="text-gray-500 font-semibold mb-2 text-left">
                        {t("floors")}
                      </Text>
                      <TextInput
                        placeholder="0"
                        value={floors}
                        onChangeText={(text) => setFloors(text.replace(/[^0-9]/g, ""))}
                        keyboardType="numeric"
                        style={{
                          backgroundColor: "#f3f4f6",
                          borderRadius: 8,
                          padding: 12,
                          color: "#1f2937",
                          borderColor: focusedField === "floors" ? "#22C55E" : "#d1d5db",
                          borderWidth: 2,
                        }}
                        onFocus={() => setFocusedField("floors")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-500 font-semibold mb-2 text-left">
                        {t("area_sqft")} <Text className="text-red-500">*</Text>
                      </Text>
                      <TextInput
                        placeholder="0"
                        value={area}
                        onChangeText={(text) => setArea(text.replace(/[^0-9]/g, ""))}
                        keyboardType="numeric"
                        style={{
                          backgroundColor: "#f3f4f6",
                          borderRadius: 8,
                          padding: 12,
                          color: "#1f2937",
                          borderColor: focusedField === "area" ? "#22C55E" : "#d1d5db",
                          borderWidth: 2,
                        }}
                        onFocus={() => setFocusedField("area")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </View>
                  </View>

                  {/* Bedrooms & Bathrooms */}
                  <View className="flex-row gap-2 mb-4">
                    <View className="flex-1">
                      <Text className="text-gray-500 font-semibold mb-2 text-left">
                        {t("bedrooms")}
                      </Text>
                      <TextInput
                        placeholder="0"
                        value={bedrooms}
                        onChangeText={(text) => setBedrooms(text.replace(/[^0-9]/g, ""))}
                        keyboardType="numeric"
                        style={{
                          backgroundColor: "#f3f4f6",
                          borderRadius: 8,
                          padding: 12,
                          color: "#1f2937",
                          borderColor: focusedField === "bedrooms" ? "#22C55E" : "#d1d5db",
                          borderWidth: 2,
                        }}
                        onFocus={() => setFocusedField("bedrooms")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-500 font-semibold mb-2 text-left">
                        {t("bathrooms")}
                      </Text>
                      <TextInput
                        placeholder="0"
                        value={bathrooms}
                        onChangeText={(text) => setBathrooms(text.replace(/[^0-9]/g, ""))}
                        keyboardType="numeric"
                        style={{
                          backgroundColor: "#f3f4f6",
                          borderRadius: 8,
                          padding: 12,
                          color: "#1f2937",
                          borderColor: focusedField === "bathrooms" ? "#22C55E" : "#d1d5db",
                          borderWidth: 2,
                        }}
                        onFocus={() => setFocusedField("bathrooms")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </View>
                  </View>

                  {/* Balcony */}
                  <View className="flex-1">
                    <Text className="text-gray-500 font-semibold mb-2 text-left">
                      {t("balconies")}
                    </Text>
                    <TextInput
                      placeholder="0"
                      value={balconies}
                      onChangeText={(text) => setBalconies(text.replace(/[^0-9]/g, ""))}
                      keyboardType="numeric"
                      style={{
                        backgroundColor: "#f3f4f6",
                        borderRadius: 8,
                        padding: 12,
                        color: "#1f2937",
                        borderColor: focusedField === "balconies" ? "#22C55E" : "#d1d5db",
                        borderWidth: 2,
                      }}
                      onFocus={() => setFocusedField("balconies")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>

                  {/* Construction Status Buttons */}
                  <Text className="text-gray-500 font-semibold mb-2 mt-4 text-left">
                    {t("availability_status")}
                  </Text>
                  <View className="flex-row justify-center mt-4 mb-6">
                    <TouchableOpacity
                      onPress={() => setConstructionStatus("Ready")}
                      className={`px-4 py-2 border rounded-full mx-2 ${constructionStatus === "Ready"
                        ? "border-green-500 bg-green-100"
                        : "border-gray-300 bg-white"
                        }`}
                    >
                      <Text
                        className={`font-medium ${constructionStatus === "Ready"
                          ? "text-green-600"
                          : "text-gray-600"
                          } text-left`}
                      >
                        {t("ready_to_move")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setConstructionStatus("Under")}
                      className={`px-4 py-2 border rounded-full mx-2 ${constructionStatus === "Under"
                        ? "border-green-500 bg-green-100"
                        : "border-gray-300 bg-white"
                        }`}
                    >
                      <Text
                        className={`font-medium ${constructionStatus === "Under"
                          ? "text-green-600"
                          : "text-gray-600"
                          } text-left`}
                      >
                        {t("under_construction")}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Conditional: Age of Property OR Possession By */}
                  {constructionStatus === "Ready" ? (
                    <>
                      {/* Age */}
                      <Text className="text-gray-500 font-semibold mb-2 text-left">
                        {t("age_of_property")}
                      </Text>
                      <View className="flex-row flex-wrap gap-3 mb-4">
                        {options.map((option) => {
                          const isSelected = selectedAge === option;
                          return (
                            <TouchableOpacity
                              key={option}
                              onPress={() => setSelectedAge(option)}
                              className={`px-4 py-2 rounded-full border ${isSelected
                                ? "border-green-500 bg-green-50"
                                : "border-gray-300 bg-white"
                                }`}
                            >
                              <Text
                                className={`text-sm ${isSelected
                                  ? "text-green-600 font-semibold"
                                  : "text-gray-700"
                                  } text-left`}
                              >
                                {option}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </>
                  ) : constructionStatus === "Under" ? (
                    <>
                      {/* Possession By */}
                      <Text className="font-semibold text-gray-500 mb-2 text-left">
                        {t("possession_by")}
                      </Text>
                      <TouchableOpacity
                        className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-[#F9FAFB] mb-4"
                        onPress={() => setVisible("possession")}
                      >
                        <Text className="text-base text-gray-700">
                          {possessionBy || t("expected_by")}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#666" />
                      </TouchableOpacity>
                      <Modal
                        visible={visible === "possession"}
                        transparent
                        animationType="slide"
                      >
                        <TouchableOpacity
                          activeOpacity={1}
                          onPressOut={() => setVisible(null)}
                          className="flex-1 justify-center items-center bg-black/40"
                        >
                          <View className="w-[90%] max-h-[50%] bg-white rounded-xl p-2 shadow-md">
                            <FlatList
                              data={[
                                t("immediate"),
                                t("within_3_months"),
                                t("within_6_months"),
                                t("by_year") + " 2026",
                                t("by_year") + " 2027",
                                t("by_year") + " 2028",
                                t("by_year") + " 2029",
                                t("by_year") + " 2030",
                              ]}
                              keyExtractor={(item) => item}
                              renderItem={({ item }) => (
                                <TouchableOpacity
                                  className={`p-3 border-b border-gray-200 ${item === t("immediate") ? "bg-[#22C55E]" : ""
                                    }`}
                                  onPress={() => {
                                    setPossessionBy(item);
                                    setVisible(null);
                                  }}
                                >
                                  <Text
                                    className={`text-base ${item === t("immediate")
                                      ? "text-white font-medium"
                                      : "text-gray-700"
                                      }`}
                                  >
                                    {item}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            />
                          </View>
                        </TouchableOpacity>
                      </Modal>
                    </>
                  ) : null}

                  {/* Ownership - Always visible */}
                  <Text className="text-gray-500 text-base font-semibold mb-2 text-left">
                    {t("ownership")}
                  </Text>
                  <View className="flex-row flex-wrap gap-3 mb-4">
                    {ownershipOptions.map((option) => {
                      const isSelected = selectedOwnership === option;
                      return (
                        <TouchableOpacity
                          key={option}
                          onPress={() => setSelectedOwnership(option)}
                          className={`px-4 py-2 rounded-full border ${isSelected
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 bg-white"
                            }`}
                        >
                          <Text
                            className={`text-sm ${isSelected ? "text-green-600 font-semibold" : "text-gray-700"
                              } text-left`}
                          >
                            {option}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Price Details - Always visible */}
                  <View className="mt-2">
                    <Text className="text-gray-500 font-semibold mb-2 text-left">
                      {t("price_details")} <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                      placeholder={t("expected_price")}
                      value={expectedPrice}
                      onChangeText={(text) => setExpectedPrice(text.replace(/[^0-9]/g, ""))}
                      keyboardType="numeric"
                      style={{
                        backgroundColor: "#f3f4f6",
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 12,
                        color: "#1f2937",
                        borderColor:
                          focusedField === "expectedPrice" ? "#22C55E" : "#d1d5db",
                        borderWidth: 2,
                      }}
                      onFocus={() => setFocusedField("expectedPrice")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>

                  {/* Price Options - Always visible */}
                  <View className="flex-col gap-2 mb-2">
                    {[
                      t("all_inclusive_price"),
                      t("price_negotiable"),
                      t("tax_excluded"),
                    ].map((item) => {
                      const isSelected = selectedPrices.includes(item);
                      return (
                        <TouchableOpacity
                          key={item}
                          onPress={() => {
                            if (isSelected) {
                              setSelectedPrices(selectedPrices.filter((i) => i !== item));
                            } else {
                              setSelectedPrices([...selectedPrices, item]);
                            }
                          }}
                          className="flex-row items-center gap-2"
                        >
                          <View
                            className={`w-5 h-5 border rounded-sm items-center justify-center ${isSelected
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300 bg-white"
                              }`}
                          >
                            {isSelected && (
                              <Ionicons name="checkmark" size={14} color="white" />
                            )}
                          </View>
                          <Text className="text-gray-700 text-left">{item}</Text>
                        </TouchableOpacity>
                      );
                    })}
                    <TouchableOpacity onPress={() => setIsMorePricingModalVisible(true)}>
                      <Text className="text-[#22C55E] font-semibold text-left">
                        {t("add_more_pricing")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Location Section */}
                {/* Location Section */}
                <View
                  className="bg-white rounded-lg p-4 mb-4 ml-5 mr-4"
                  style={{ borderWidth: 1, borderColor: "#d1d5db" }}
                >
                  <Text className="text-[15px] font-semibold text-gray-800 mb-3">
                    Location <Text className="text-red-500">*</Text>
                  </Text>

                  {/* Location Input */}
                  <View
                    className="flex-row items-center rounded-lg px-3 py-3 mb-3"
                    style={{
                      borderWidth: 1,
                      borderColor: focusedField === "location" ? "#22C55E" : "#E5E7EB",
                      backgroundColor: "#F9FAFB",
                    }}
                  >
                    <Image
                      source={require("../../../../assets/location.png")}
                      style={{ width: 18, height: 18, marginRight: 8 }}
                    />
                    <TextInput
  placeholder={t("enter_property_location")}
  placeholderTextColor="#9CA3AF"
  value={location}
  onChangeText={setLocation}
                      onFocus={() => setFocusedField("location")}
                      onBlur={() => setFocusedField(null)}
                      className="flex-1 text-[14px] text-gray-800"
                    />
                  </View>

                  {/* Locality/Area Input */}
                  <TextInput
  placeholder={t("locality_area")}
  placeholderTextColor="#9CA3AF"
  value={neighborhood}
                    onChangeText={(text) => {
                      setNeighborhood(text);
                      // Generate areaKey automatically
                      const generatedAreaKey = text.toLowerCase().trim().replace(/\s+/g, '-');
                      setAreaKey(generatedAreaKey);
                    }}
                    onFocus={() => setFocusedField("neighborhood")}
                    onBlur={() => setFocusedField(null)}
                    className="rounded-lg px-3 py-3 text-[14px] text-gray-800"
                    style={{
                      borderWidth: 1,
                      borderColor: focusedField === "neighborhood" ? "#22C55E" : "#E5E7EB",
                      backgroundColor: "#F9FAFB",
                    }}
                  />
                </View>


                {/* Description */}
                <View className="border border-gray-300 rounded-lg bg-white ml-5 mr-4 mt-5 p-5">
                  <Text className="text-gray-500 font-semibold mb-2 text-left">
                    {t("description")} <Text className="text-red-500">*</Text>
                  </Text>
                  <View
                    style={{
                      borderRadius: 8,
                      marginBottom: 16,
                      borderColor:
                        focusedField === "description" ? "#22C55E" : "#d1d5db",
                      borderWidth: 2,
                    }}
                  >
                    <TextInput
                      placeholder={t("describe_property")}
                      placeholderTextColor="#888"
                      value={description}
                      onChangeText={(text) => setDescription(text)}
                      multiline
                      numberOfLines={6}
                      textAlignVertical="top"
                      style={{
                        backgroundColor: "#f3f4f6",
                        height: 150,
                        width: "100%",
                        padding: 12,
                        color: "#1f2937",
                      }}
                      onFocus={() => setFocusedField("description")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>

                {/* Other rooms */}
                <View className="bg-white rounded-xl border border-gray-200 p-4 m-3 ml-5 mr-4">
                  <Text className="text-lg font-semibold text-gray-800">
                    {t("other_rooms")}{" "}
                    <Text className="text-gray-400 text-sm">({t("optional")})</Text>
                  </Text>
                  <View className="flex-row flex-wrap gap-2 mt-2">
                    {[t("pooja_room"), t("study_room"), t("servant_room"), t("others")].map(
                      (room) => (
                        <TouchableOpacity
                          key={room}
                          onPress={() => {
                            if (otherRooms.includes(room)) {
                              setOtherRooms(otherRooms.filter((r) => r !== room));
                            } else {
                              setOtherRooms([...otherRooms, room]);
                            }
                          }}
                          className={`border rounded-full px-4 py-2 ${otherRooms.includes(room)
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300"
                            }`}
                        >
                          <Text
                            className={`${otherRooms.includes(room)
                              ? "text-green-600"
                              : "text-gray-600"
                              }`}
                          >
                            {otherRooms.includes(room) ? "✓ " : "+ "}
                            {room}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>

                  <Text className="text-lg font-semibold text-gray-800 mt-5">
                    {t("furnishing")}{" "}
                    <Text className="text-gray-400 text-sm">({t("optional")})</Text>
                  </Text>
                  <View className="flex-row gap-2 mt-2">
                    {[t("unfurnished"), t("semi_furnished"), t("furnished")].map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => {
                          setFurnishing(type);
                          if (type === t("furnished")) {
                            setModalSubtitle(t("at_least_3_selections_mandatory"));
                            setModalOpen(true);
                          } else if (type === t("semi_furnished")) {
                            setModalSubtitle(t("at_least_1_selection_mandatory"));
                            setModalOpen(true);
                          } else {
                            setFurnishings([]);
                          }
                        }}
                        className={`rounded-full px-4 py-2 border ${furnishing === type
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                          }`}
                      >
                        <Text
                          className={`${furnishing === type ? "text-green-700" : "text-gray-600"
                            }`}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Reserved Parking */}
                  <Text className="text-lg font-semibold text-gray-800 mt-5">
                    {t("reserved_parking")}{" "}
                    <Text className="text-gray-400 text-sm">({t("optional")})</Text>
                  </Text>
                  <View className="mt-2 space-y-3">
                    {[
                      {
                        label: t("covered_parking"),
                        count: covered,
                        setCount: setCovered,
                      },
                      {
                        label: t("open_parking"),
                        count: open,
                        setCount: setOpen,
                      },
                    ].map((item) => (
                      <View
                        key={item.label}
                        className="flex-row items-center justify-between"
                      >
                        <Text className="text-gray-700">{item.label}</Text>
                        <View className="flex-row items-center space-x-3">
                          <TouchableOpacity
                            onPress={() => item.setCount(Math.max(0, item.count - 1))}
                            className="w-8 h-8 border border-gray-300 rounded-full items-center justify-center"
                          >
                            <Text className="text-gray-500 text-lg">-</Text>
                          </TouchableOpacity>
                          <Text className="text-gray-800 text-base w-4 text-center">
                            {item.count}
                          </Text>
                          <TouchableOpacity
                            onPress={() => item.setCount(item.count + 1)}
                            className="w-8 h-8 border border-gray-300 rounded-full items-center justify-center"
                          >
                            <Text className="text-gray-500 text-lg">+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                  <Text className="text-[15px] font-bold text-gray-600 mb-3">
                    {t('location_advantages')}
                  </Text>

                  <View className="flex-row flex-wrap">
                    {locationAdvantages.map((advantage) => (
                      <TouchableOpacity
                        key={advantage}
                        onPress={() => {
                          if (locAdvantages.includes(advantage)) {
                            setLocAdvantages(locAdvantages.filter((a) => a !== advantage));
                          } else {
                            setLocAdvantages([...locAdvantages, advantage]);
                          }
                        }}
                        className={`px-4 py-2 rounded-full mr-2 mb-2 border ${locAdvantages.includes(advantage)
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 bg-white"
                          }`}
                      >
                        <Text
                          className={`text-sm ${locAdvantages.includes(advantage)
                              ? "text-green-600 font-semibold"
                              : "text-gray-700"
                            }`}
                        >
                          {locAdvantages.includes(advantage) ? "✓ " : ""}
                          {advantage}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Vaasthu Details */}
                <View className="bg-white rounded-xl border border-gray-300 p-4 m-3 ml-5 mr-4">
                  <View className="flex-row items-center mb-3 justify-between">
                    <Text
                      className="text-lg font-semibold text-gray-800 text-left"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {t("vaasthu_details")} <Text className="text-red-500">*</Text>
                    </Text>
                    <Image
                      source={require("../../../../assets/vastu.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </View>
                  {fields.map((item) => (
                    <View key={item.key} className="mb-4">
                      <Text className="text-gray-700 font-semibold mb-1 text-left">
                        {item.label}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setVisible(item.key)}
                        className="flex-row items-center justify-between border border-gray-300 rounded-xl p-3 bg-[#F9FAFB]"
                      >
                        <Text className="text-gray-800 text-left">{item.value}</Text>
                        <Ionicons name="chevron-down" size={20} color="#555" />
                      </TouchableOpacity>
                      {/* Dropdown Modal */}
                      <Modal
                        visible={visible === item.key}
                        transparent
                        animationType="fade"
                      >
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
                                  <Text className="text-gray-800 text-left">
                                    {direction}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            />
                          </View>
                        </TouchableOpacity>
                      </Modal>
                    </View>
                  ))}
                </View>

                <DocumentUpload
                  title={t("property_ownership")}
                  subtitle={t("ownership_verify")}
                  files={ownershipDocs}
                  setFiles={setOwnershipDocs}
                  required
                />
                <DocumentUpload
                  title={t("owner_identity")}
                  subtitle={t("upload_identity")}
                  files={identityDocs}
                  setFiles={setIdentityDocs}
                  required
                />
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
              </ScrollView>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 10,
                  gap: 12,
                }}
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
                  onPress={() => {
                    router.push("/(tabs)/home");
                  }}
                >
                  <Text style={{ color: "black", fontWeight: "600", fontSize: 15 }}>
                    {t("cancel")}
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
                    {isSubmitting ? t("uploading") : t("upload_property")}
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
            <Toast />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}