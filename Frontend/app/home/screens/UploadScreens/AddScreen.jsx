//Frontend//app//home//screens//UploadScreens//AddScreen.jsx
import React, { useState, useEffect } from "react";
import { createProperty } from '../../../../utils/propertyApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import TopAlert from "./TopAlert";
import CustomPickerAlert from "../../../../components/CustomPickerAlert";
import HowTo360Modal from "./HowTo360Modal";
import PhotoUploadGuide from "./PhotoUploadGuide";
import { Linking } from "react-native";
import MorePricingDetailsModal from "./MorePricingDetailsModal";
import PropertyImageUpload from "../../../../components/PropertyImageUpload";
import Toast from 'react-native-toast-message';
import FurnishingsModal from "./FurnishingsModal";
export default function AddScreen() {
  const [constructionStatus, setConstructionStatus] = useState("");
  const [possessionBy, setPossessionBy] = useState("");
  const router = useRouter();
  const navigation = useNavigation();

  // Form state variables
  const [furnishing, setFurnishing] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [furnishings, setFurnishings] = useState([]);
  const [modalSubtitle, setModalSubtitle] = useState("");

  const [propertyType, setPropertyType] = useState("House");
  const [propertyTitle, setPropertyTitle] = useState("");
  const [floors, setFloors] = useState("");
  const [area, setArea] = useState("");
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

  const [houseFacing, setHouseFacing] = useState("North-East");
  const [masterBedroom, setMasterBedroom] = useState("North-East");
  const [childrenBedroom, setChildrenBedroom] = useState("North-East");
  const [livingRoom, setLivingRoom] = useState("North-East");
  const [kitchenRoom, setKitchenRoom] = useState("North-East");
  const [poojaRoom, setPoojaRoom] = useState("North-East");
  const [balcony, setBalcony] = useState("North-East");
  const [selectedPrices, setSelectedPrices] = useState([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isHowto360ModalVisible, setIsHowto360ModalVisible] = useState(false);
  const [isPhotoGuideModalVisible, setIsPhotoGuideModalVisible] = useState(false);
  const [isMorePricingModalVisible, setIsMorePricingModalVisible] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const options = ["0-1 years", "1-5 years", "5-10 years", "10+ years"];
  const directions = ["North-East", "South-West", "East", "West"];
  const ownershipOptions = [
    "Freehold",
    "Leasehold",
    "Co-operative society",
    "Power of Attorney",
  ];

  const fields = [
    { key: "houseFacing", label: "House Facing", value: houseFacing, setValue: setHouseFacing },
    { key: "masterBedroom", label: "Master Bedroom", value: masterBedroom, setValue: setMasterBedroom },
    { key: "childrenBedroom", label: "Children Bedroom", value: childrenBedroom, setValue: setChildrenBedroom },
    { key: "livingRoom", label: "Living Room", value: livingRoom, setValue: setLivingRoom },
    { key: "kitchenRoom", label: "Kitchen Room", value: kitchenRoom, setValue: setKitchenRoom },
    { key: "poojaRoom", label: "Pooja Room", value: poojaRoom, setValue: setPoojaRoom },
    { key: "balcony", label: "Balcony", value: balcony, setValue: setBalcony },
  ];

  const handleUpload = async () => {
    try {
      // ✅ Check authentication FIRST
      const token = await AsyncStorage.getItem('userToken');
      console.log('🔐 Current token before upload:', token);

      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login to upload properties",
          [
            {
              text: "Go to Login",
              onPress: () => router.push('/(tabs)/profile') // Change to your login screen path
            },
            {
              text: "Cancel",
              style: "cancel"
            }
          ]
        );
        return; // ⚠️ STOP execution if no token
      }

      console.log('🎬 Starting upload process...');
      setIsSubmitting(true);


      // Validate required fields
      console.log('🔍 Validating fields...');
      // Validate required fields
      if (!propertyTitle?.trim()) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Property Title is required.' });
        setIsSubmitting(false);
        return;
      }

      if (!location?.trim()) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Location is required.' });
        setIsSubmitting(false);
        return;
      }

      const priceValue = parseFloat(expectedPrice);
      console.log('💰 Price validation:', { expectedPrice, priceValue, isValid: !isNaN(priceValue) && priceValue > 0 });

      if (!expectedPrice || isNaN(priceValue) || priceValue <= 0) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'A valid Expected Price is required.' });
        setIsSubmitting(false);
        return;
      }

      if (!area?.trim()) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Area is required.' });
        setIsSubmitting(false);
        return;
      }

      if (!description?.trim()) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Description is required.' });
        setIsSubmitting(false);
        return;
      }

      if (images.length === 0) {
        console.log('❌ No images selected');
        Toast.show({ type: 'error', text1: 'Error', text2: 'Please add at least one image' });
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Validation passed');
      console.log('✅ Validation passed');

      // Prepare property data based on schema
      const propertyData = {
        propertyType: "House",
        propertyTitle,
        location,
        description,
        expectedPrice: parseFloat(expectedPrice),
        priceDetails: {
          allInclusive: selectedPrices.includes("All inclusive price"),
          negotiable: selectedPrices.includes("Price Negotiable"),
          taxExcluded: selectedPrices.includes("Tax and Govt.charges excluded")
        },
        houseDetails: {
          floors: parseInt(floors) || 0,
          area: parseFloat(area) || 0,
          areaUnit: "sqft",
          bedrooms: parseInt(bedrooms) || 0,
          bathrooms: parseInt(bathrooms) || 0,
          balconies: parseInt(balconies) || 0,
          floorDetails,
          availabilityStatus: constructionStatus === "Ready" ? "Ready to Move" : "Under Construction",
          ageOfProperty: selectedAge,
          ownership: selectedOwnership,
          possessionBy: constructionStatus === "Under" ? possessionBy : undefined,
          otherRooms,
          furnishing,
          furnishingItems,
          parking: {
            covered,
            open
          },
          vaasthuDetails: {
            houseFacing,
            masterBedroom,
            childrenBedroom,
            livingRoom,
            kitchenRoom,
            poojaRoom,
            balcony
          }
        }
      };

      // Call API
      console.log('📡 Calling createProperty API...');
      console.log('📋 Final property data:', JSON.stringify(propertyData, null, 2));

      const result = await createProperty(propertyData, images);

      console.log('📥 API Result:', result);

      if (result.success) {
        console.log('✅ Upload successful!');
        Alert.alert("Success", "Property uploaded successfully!");
        setAlertVisible(true);

        // Reset form after 2 seconds
        setTimeout(() => {
          router.push("/(tabs)/home");
        }, 2000);
      } else {
        console.error('❌ Upload failed:', result);
        Alert.alert(
          "Error",
          result.data?.message || result.error || "Failed to upload property. Please try again."
        );
      }

    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
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
        Alert.alert(
          "Permission Required",
          "You need to grant camera permissions to use this feature. Please go to your device settings and enable them for this app."
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
      console.log('📸 Camera - Images added:', newImages);
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
          "You need to grant access to your photo library to use this feature. Please go to your device settings and enable them for this app."
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
      console.log('📸 Gallery - Images added:', newImages);
    }
  };

  const pickImage = () => {
    setPickerAlertVisible(true);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleOpenPlayStore = () => {
    // Replace with the actual app link
    const playStoreLink = 'https://play.google.com/store/apps/details?id=com.google.android.street';
    Linking.openURL(playStoreLink).catch(err =>
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
                onSubmit={(data) => setFurnishings(data)}
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
                  <Text className="text-[16px] font-semibold">
                    Upload Your Property
                  </Text>
                  <Text className="text-[12px] text-[#00000066]">
                    Add your property details
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

                {/* Header */}


                {/* Property Details Card */}
                <PropertyImageUpload
                  images={images}
                  onPickImage={pickImage}
                  onRemoveImage={removeImage}
                  onViewGuidelines={() => setIsPhotoGuideModalVisible(true)}
                  onWatchTutorial={() => setIsHowto360ModalVisible(true)}
                />


                {/* Conditional Content */}
                {constructionStatus !== "Under" ? (
                  <View>
                    {/* Basic Details */}
                    <View className="border mt-1 overflow-hidden rounded-xl border-gray-300 shadow-sm bg-white m-5 p-5">
                      <Text className="mt-3 mb-4 font-bold">Basic Details</Text>

                      {/* Title */}
                      <Text className="text-gray-500 font-semibold mb-2 text-left">Property Title <Text className="text-red-500">*</Text></Text>
                      <TextInput
                        placeholder="Surya Teja Apartments"
                        placeholderTextColor="#9CA3AF"
                        value={propertyTitle}
                        onChangeText={(text) => setPropertyTitle(text.replace(/[^a-zA-Z0-9\s]/g, ''))}
                        style={{
                          backgroundColor: '#f3f4f6',
                          borderRadius: 8,
                          padding: 12,
                          marginBottom: 16,
                          color: '#1f2937',
                          borderColor: focusedField === 'propertyTitle' ? '#22C55E' : '#d1d5db',
                          borderWidth: 2,
                        }}
                        onFocus={() => setFocusedField('propertyTitle')}
                        onBlur={() => setFocusedField(null)}
                      />

                      {/* Property Type */}
                      <View className="px-1">
                        <Text className="text-gray-500 font-semibold mb-2">
                          Property Type
                        </Text>
                        <TouchableOpacity
                          onPress={() => setVisible(visible === "propertyType" ? null : "propertyType")}
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
                            {["House", "Site/Plot", "Commercial", "Resort"].map((type) => (
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
                                        propertyTitle: propertyTitle
                                      },
                                    });
                                  } else if (type === "Commercial") {
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
                                className={`p-4 border-b border-gray-200 ${propertyType === type ? "bg-green-500" : "bg-white"}`}
                              >
                                <Text className={`${propertyType === type ? "text-white" : "text-gray-800"}`}>{type}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>

                      {/* Floors & Area */}
                      <View className="flex-row gap-2 mb-4">
                        <View className="flex-1">
                          <Text className="text-gray-500 font-semibold mb-2 text-left">No. of Floors</Text>
                          <TextInput
                            placeholder="0"
                            value={floors}
                            onChangeText={(text) => setFloors(text.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            style={{
                              backgroundColor: '#f3f4f6',
                              borderRadius: 8,
                              padding: 12,
                              color: '#1f2937',
                              borderColor: focusedField === 'floors' ? '#22C55E' : '#d1d5db',
                              borderWidth: 2,
                            }}
                            onFocus={() => setFocusedField('floors')}
                            onBlur={() => setFocusedField(null)}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-gray-500 font-semibold mb-2 text-left">Area (sqft) <Text className="text-red-500">*</Text></Text>
                          <TextInput
                            placeholder="0"
                            value={area}
                            onChangeText={(text) => setArea(text.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            style={{
                              backgroundColor: '#f3f4f6',
                              borderRadius: 8,
                              padding: 12,
                              color: '#1f2937',
                              borderColor: focusedField === 'area' ? '#22C55E' : '#d1d5db',
                              borderWidth: 2,
                            }}
                            onFocus={() => setFocusedField('area')}
                            onBlur={() => setFocusedField(null)}
                          />
                        </View>
                      </View>

                      {/* Bedrooms & Bathrooms */}
                      <View className="flex-row gap-2 mb-4">
                        <View className="flex-1">
                          <Text className="text-gray-500 font-semibold mb-2 text-left">Bedrooms</Text>
                          <TextInput
                            placeholder="0"
                            value={bedrooms}
                            onChangeText={(text) => setBedrooms(text.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            style={{
                              backgroundColor: '#f3f4f6',
                              borderRadius: 8,
                              padding: 12,
                              color: '#1f2937',
                              borderColor: focusedField === 'bedrooms' ? '#22C55E' : '#d1d5db',
                              borderWidth: 2,
                            }}
                            onFocus={() => setFocusedField('bedrooms')}
                            onBlur={() => setFocusedField(null)}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-gray-500 font-semibold mb-2 text-left">Bathrooms</Text>
                          <TextInput
                            placeholder="0"
                            value={bathrooms}
                            onChangeText={(text) => setBathrooms(text.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            style={{
                              backgroundColor: '#f3f4f6',
                              borderRadius: 8,
                              padding: 12,
                              color: '#1f2937',
                              borderColor: focusedField === 'bathrooms' ? '#22C55E' : '#d1d5db',
                              borderWidth: 2,
                            }}
                            onFocus={() => setFocusedField('bathrooms')}
                            onBlur={() => setFocusedField(null)}
                          />
                        </View>
                      </View>

                      {/* Balcony */}
                      <View className="flex-1">
                        <Text className="text-gray-500 font-semibold mb-2 text-left">Balcony</Text>
                        <TextInput
                          placeholder="0"
                          value={balconies}
                          onChangeText={(text) => setBalconies(text.replace(/[^0-9]/g, ''))}
                          keyboardType="numeric"
                          style={{
                            backgroundColor: '#f3f4f6',
                            borderRadius: 8,
                            padding: 12,
                            color: '#1f2937',
                            borderColor: focusedField === 'balconies' ? '#22C55E' : '#d1d5db',
                            borderWidth: 2,
                          }}
                          onFocus={() => setFocusedField('balconies')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </View>




                      {/* Construction Status Buttons */}
                      <Text className="text-gray-500 font-semibold mb-2 mt-4 text-left">Availability Status</Text>
                      <View className="flex-row justify-center mt-4 mb-6">
                        <TouchableOpacity
                          onPress={() => setConstructionStatus("Ready")}
                          className={`px-4 py-2 border rounded-full mx-2 ${constructionStatus === "Ready" ? "border-green-500 bg-green-100" : "border-gray-300 bg-white"
                            }`}
                        >
                          <Text className={`font-medium ${constructionStatus === "Ready" ? "text-green-600" : "text-gray-600"} text-left`}>
                            Ready to Move
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setConstructionStatus("Under")}
                          className={`px-4 py-2 border rounded-full mx-2 ${constructionStatus === "Under" ? "border-green-500 bg-green-100" : "border-gray-300 bg-white"
                            }`}
                        >
                          <Text className={`font-medium ${constructionStatus === "Under" ? "text-green-600" : "text-gray-600"} text-left`}>
                            Under Construction
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {constructionStatus === 'Ready' && (<>
                        {/* Age */}
                        <Text className="text-gray-500 font-semibold mb-2 text-left">Age of Property</Text>
                        <View className="flex-row flex-wrap gap-3 mb-4">
                          {options.map((option) => {
                            const isSelected = selectedAge === option;
                            return (
                              <TouchableOpacity
                                key={option}
                                onPress={() => setSelectedAge(option)}
                                className={`px-4 py-2 rounded-full border ${isSelected ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"}`}
                              >
                                <Text className={`text-sm ${isSelected ? "text-green-600 font-semibold" : "text-gray-700"} text-left`}>
                                  {option}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </>)}

                      {/* Ownership */}
                      <Text className="text-gray-500 text-base font-semibold mb-2 text-left">Ownership</Text>
                      <View className="flex-row flex-wrap gap-3 mb-4">
                        {ownershipOptions.map((option) => {
                          const isSelected = selectedOwnership === option;
                          return (
                            <TouchableOpacity
                              key={option}
                              onPress={() => setSelectedOwnership(option)}
                              className={`px-4 py-2 rounded-full border ${isSelected ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"}`}
                            >
                              <Text className={`text-sm ${isSelected ? "text-green-600 font-semibold" : "text-gray-700"} text-left`}>
                                {option}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      {/* Price Details */}
                      <View className="mt-2">
                        <Text className="text-gray-500 font-semibold mb-2 text-left">Price Details <Text className="text-red-500">*</Text></Text>
                        <TextInput
                          placeholder="₹ Expected Price"
                          value={expectedPrice}
                          onChangeText={(text) => setExpectedPrice(text.replace(/[^0-9]/g, ''))}
                          keyboardType="numeric"
                          style={{
                            backgroundColor: '#f3f4f6',
                            borderRadius: 8,
                            padding: 12,
                            marginBottom: 12,
                            color: '#1f2937',
                            borderColor: focusedField === 'expectedPrice' ? '#22C55E' : '#d1d5db',
                            borderWidth: 2,
                          }}
                          onFocus={() => setFocusedField('expectedPrice')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </View>

                      {/* Price Options */}
                      <View className="flex-col gap-2 mb-2">
                        {["All inclusive price", "Price Negotiable", "Tax and Govt.charges excluded"].map((item) => {
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
                                className={`w-5 h-5 border rounded-sm items-center justify-center ${isSelected ? "border-green-500 bg-green-500" : "border-gray-300 bg-white"
                                  }`}
                              >
                                {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
                              </View>
                              <Text className="text-gray-700 text-left">{item}</Text>
                            </TouchableOpacity>
                          );
                        })}
                        <TouchableOpacity onPress={() => setIsMorePricingModalVisible(true)}>
                          <Text className="text-[#22C55E] font-semibold text-left">+ Add more pricing details</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Location */}
                    <View className="border border-gray-300 rounded-lg bg-white ml-5 mt-5 mr-4 p-5">
                      <Text className="text-gray-500 font-semibold mb-2 text-left">Location <Text className="text-red-500">*</Text></Text>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#f3f4f6',
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 16,
                        borderColor: focusedField === 'location' ? '#22C55E' : '#d1d5db',
                        borderWidth: 2,
                      }}>
                        <Ionicons name="location-outline" size={20} color="#22C55E" />
                        <TextInput
                          placeholder="Enter Property Location"
                          placeholderTextColor="#888"
                          value={location}
                          onChangeText={(text) => setLocation(text.replace(/[^a-zA-Z0-9\s]/g, ''))}
                          style={{ flex: 1, marginLeft: 8, color: '#1f2937' }}
                          onFocus={() => setFocusedField('location')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </View>
                    </View>

                    {/* Description */}
                    <View className="border border-gray-300 rounded-lg bg-white ml-5 mr-4 mt-5 p-5">
                      <Text className="text-gray-500 font-semibold mb-2 text-left">Description <Text className="text-red-500">*</Text></Text>
                      <View style={{
                        borderRadius: 8,
                        marginBottom: 16,
                        borderColor: focusedField === 'description' ? '#22C55E' : '#d1d5db',
                        borderWidth: 2,
                      }}>
                        <TextInput
                          placeholder="Describe your property ........"
                          placeholderTextColor="#888"
                          value={description}
                          onChangeText={(text) => setDescription(text.replace(/[^a-zA-Z0-9\s]/g, ''))}
                          multiline
                          numberOfLines={6}            // ⬅️ increases initial rows
                          textAlignVertical="top"      // ⬅️ cursor starts at top (Android fix)
                          style={{
                            backgroundColor: '#f3f4f6',
                            height: 150,               // ⬅️ KEY: fixed textarea height
                            width: '100%',
                            padding: 12,
                            color: '#1f2937',
                          }}
                          onFocus={() => setFocusedField('description')}
                          onBlur={() => setFocusedField(null)}
                        />

                      </View>
                    </View>

                    {/* Other rooms */}
                    <View className="bg-white rounded-xl border border-gray-200 p-4 m-3 ml-5 mr-4">
                      <Text className="text-lg font-semibold text-gray-800">
                        Other Rooms <Text className="text-gray-400 text-sm">(Optional)</Text>
                      </Text>
                      <View className="flex-row flex-wrap gap-2 mt-2">
                        {["Pooja Room", "Study Room", "Servant Room", "Others"].map((room) => (
                          <TouchableOpacity
                            key={room}
                            onPress={() => {
                              if (otherRooms.includes(room)) {
                                setOtherRooms(otherRooms.filter(r => r !== room));
                              } else {
                                setOtherRooms([...otherRooms, room]);
                              }
                            }}
                            className={`border rounded-full px-4 py-2 ${otherRooms.includes(room) ? "border-green-500 bg-green-50" : "border-gray-300"
                              }`}
                          >
                            <Text className={`${otherRooms.includes(room) ? "text-green-600" : "text-gray-600"}`}>
                              {otherRooms.includes(room) ? "✓ " : "+ "}{room}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      <Text className="text-lg font-semibold text-gray-800 mt-5">
                        Furnishing <Text className="text-gray-400 text-sm">(Optional)</Text>
                      </Text>

                      <View className="flex-row gap-2 mt-2">
                        {["Unfurnished", "Semi-furnished", "Furnished"].map((type) => (
                          <TouchableOpacity
                            key={type}
                            onPress={() => {
                              setFurnishing(type);

                              if (type === "Furnished") {
                                setModalSubtitle("At least 3 selections are mandatory");
                                setModalOpen(true);
                              } else if (type === "Semi-furnished") {
                                setModalSubtitle("At least 1 selection is mandatory");
                                setModalOpen(true);
                              } else {
                                // Unfurnished
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
                        Reserved Parking <Text className="text-gray-400 text-sm">(Optional)</Text>
                      </Text>
                      <View className="mt-2 space-y-3">
                        {[
                          { label: "Covered Parking", count: covered, setCount: setCovered },
                          { label: "Open Parking", count: open, setCount: setOpen },
                        ].map((item) => (
                          <View key={item.label} className="flex-row items-center justify-between">
                            <Text className="text-gray-700">{item.label}</Text>
                            <View className="flex-row items-center space-x-3">
                              <TouchableOpacity
                                onPress={() => item.setCount(Math.max(0, item.count - 1))}
                                className="w-8 h-8 border border-gray-300 rounded-full items-center justify-center"
                              >
                                <Text className="text-gray-500 text-lg">-</Text>
                              </TouchableOpacity>
                              <Text className="text-gray-800 text-base w-4 text-center">{item.count}</Text>
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
                    </View>

                    {/* Vaasthu Details */}
                    <View className="bg-white rounded-xl border border-gray-300 p-4 m-3 ml-5 mr-4">
                      <View className="flex-row items-center mb-3 justify-between">
                        <Text
                          className="text-lg font-semibold text-gray-800 text-left"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          Vaasthu Details <Text className="text-red-500">*</Text>
                        </Text>
                        <Image source={require("../../../../assets/vastu.png")} style={{ width: 30, height: 30 }} />
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
                  </View>
                ) : (
                  <View>
                    {/* Basic Details for Under Construction */}
                    <View className="border mt-1 overflow-hidden rounded-xl border-gray-300 shadow-sm bg-white m-5 p-5">
                      <Text className="mt-3 mb-4 font-bold">Basic Details</Text>

                      {/* Title */}
                      <Text className="text-gray-500 font-semibold mb-2 text-left">Property Title <Text className="text-red-500">*</Text></Text>
                      <TextInput
                        placeholder="Surya Teja Apartments"
                        placeholderTextColor="#9CA3AF"
                        value={propertyTitle}
                        onChangeText={(text) => setPropertyTitle(text.replace(/[^a-zA-Z0-9\s]/g, ''))}
                        style={{
                          backgroundColor: '#f3f4f6',
                          borderRadius: 8,
                          padding: 12,
                          marginBottom: 16,
                          color: '#1f2937',
                          borderColor: focusedField === 'propertyTitle' ? '#22C55E' : '#d1d5db',
                          borderWidth: 2,
                        }}
                        onFocus={() => setFocusedField('propertyTitle')}
                        onBlur={() => setFocusedField(null)}
                      />

                      {/* Type */}
                      <Text className="text-gray-500 font-semibold mb-2 text-left">Property Type</Text>
                      <View className="relative mb-4">
                        <TextInput
                          placeholder="House"
                          value={propertyType}
                          editable={false}
                          className="bg-[#D9D9D91C] rounded-lg p-3 pr-12 text-gray-800 text-left"
                        />
                        <Ionicons
                          name="chevron-down"
                          size={24}
                          color="#888"
                          style={{ position: "absolute", right: 10, top: "50%", transform: [{ translateY: -12 }] }}
                        />
                      </View>

                      {/* Floors & Area */}
                      <View className="flex-row gap-2 mb-4">
                        <View className="flex-1">
                          <Text className="text-gray-500 font-semibold mb-2 text-left">No. of Floors</Text>
                          <TextInput
                            placeholder="0"
                            value={floors}
                            onChangeText={(text) => setFloors(text.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            style={{
                              backgroundColor: '#f3f4f6',
                              borderRadius: 8,
                              padding: 12,
                              color: '#1f2937',
                              borderColor: focusedField === 'floors' ? '#22C55E' : '#d1d5db',
                              borderWidth: 2,
                            }}
                            onFocus={() => setFocusedField('floors')}
                            onBlur={() => setFocusedField(null)}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-gray-500 font-semibold mb-2 text-left">Area (sqft) <Text className="text-red-500">*</Text></Text>
                          <TextInput
                            placeholder="0"
                            value={area}
                            onChangeText={(text) => setArea(text.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            style={{
                              backgroundColor: '#f3f4f6',
                              borderRadius: 8,
                              padding: 12,
                              color: '#1f2937',
                              borderColor: focusedField === 'area' ? '#22C55E' : '#d1d5db',
                              borderWidth: 2,
                            }}
                            onFocus={() => setFocusedField('area')}
                            onBlur={() => setFocusedField(null)}
                          />
                        </View>
                      </View>

                      {/* Bedrooms & Bathrooms */}
                      <View className="flex-row gap-2 mb-4">
                        <View className="flex-1">
                          <Text className="text-gray-500 font-semibold mb-2 text-left">Bedrooms</Text>
                          <TextInput
                            placeholder="0"
                            value={bedrooms}
                            onChangeText={(text) => setBedrooms(text.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            style={{
                              backgroundColor: '#f3f4f6',
                              borderRadius: 8,
                              padding: 12,
                              color: '#1f2937',
                              borderColor: focusedField === 'bedrooms' ? '#22C55E' : '#d1d5db',
                              borderWidth: 2,
                            }}
                            onFocus={() => setFocusedField('bedrooms')}
                            onBlur={() => setFocusedField(null)}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-gray-500 font-semibold mb-2 text-left">Bathrooms</Text>
                          <TextInput
                            placeholder="0"
                            value={bathrooms}
                            onChangeText={(text) => setBathrooms(text.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            style={{
                              backgroundColor: '#f3f4f6',
                              borderRadius: 8,
                              padding: 12,
                              color: '#1f2937',
                              borderColor: focusedField === 'bathrooms' ? '#22C55E' : '#d1d5db',
                              borderWidth: 2,
                            }}
                            onFocus={() => setFocusedField('bathrooms')}
                            onBlur={() => setFocusedField(null)}
                          />
                        </View>
                      </View>

                      {/* Construction Status Buttons */}
                      <Text className="text-gray-500 font-semibold mb-2 text-left">Availability Status</Text>
                      <View className="flex-row justify-center mt-4 mb-6">
                        <TouchableOpacity
                          onPress={() => setConstructionStatus("Ready")}
                          className={`px-4 py-2 border rounded-full mx-2 ${constructionStatus === "Ready" ? "border-green-500 bg-green-100" : "border-gray-300 bg-white"
                            }`}
                        >
                          <Text className={`font-medium ${constructionStatus === "Ready" ? "text-green-600" : "text-gray-600"} text-left`}>
                            Ready to Move
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setConstructionStatus("Under")}
                          className={`px-4 py-2 border rounded-full mx-2 ${constructionStatus === "Under" ? "border-green-500 bg-green-100" : "border-gray-300 bg-white"
                            }`}
                        >
                          <Text className={`font-medium ${constructionStatus === "Under" ? "text-green-600" : "text-gray-600"} text-left`}>
                            Under Construction
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Possession */}
                      <View>
                        <Text className="font-semibold text-gray-500 mb-2">Possession By</Text>
                        <TouchableOpacity
                          className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-[#F9FAFB]"
                          onPress={() => setVisible("possession")}
                        >
                          <Text className="text-base text-gray-700">{possessionBy || "Expected By"}</Text>
                          <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                        <Modal visible={visible === "possession"} transparent animationType="slide">
                          <TouchableOpacity
                            activeOpacity={1}
                            onPressOut={() => setVisible(null)}
                            className="flex-1 justify-center items-center bg-black/40"
                          >
                            <View className="w-[90%] max-h-[50%] bg-white rounded-xl p-2 shadow-md">
                              <FlatList
                                data={[
                                  "Immediate",
                                  "Within 3 months",
                                  "Within 6 months",
                                  "By 2026",
                                  "By 2027",
                                  "By 2028",
                                  "By 2029",
                                  "By 2030",
                                ]}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                  <TouchableOpacity
                                    className={`p-3 border-b border-gray-200 ${item === "Immediate" ? "bg-[#22C55E]" : ""}`}
                                    onPress={() => {
                                      setPossessionBy(item);
                                      setVisible(null);
                                    }}
                                  >
                                    <Text className={`text-base ${item === "Immediate" ? "text-white font-medium" : "text-gray-700"}`}>
                                      {item}
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              />
                            </View>
                          </TouchableOpacity>
                        </Modal>
                      </View>
                    </View>

                    {/* Location */}
                    <View className="border border-gray-300 rounded-lg bg-white ml-2 mt-5 p-5">
                      <Text className="text-gray-500 font-semibold mb-2 text-left">Location <Text className="text-red-500">*</Text></Text>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#f3f4f6',
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 16,
                        borderColor: focusedField === 'location' ? '#22C55E' : '#d1d5db',
                        borderWidth: 2,
                      }}>
                        <Ionicons name="location-outline" size={20} color="#22C55E" />
                        <TextInput
                          placeholder="Enter Property Location"
                          placeholderTextColor="#888"
                          value={location}
                          onChangeText={(text) => setLocation(text.replace(/[^a-zA-Z0-9\s]/g, ''))}
                          style={{ flex: 1, marginLeft: 8, color: '#1f2937' }}
                          onFocus={() => setFocusedField('location')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </View>
                    </View>

                    {/* Description */}
                    <View className="border border-gray-300 rounded-lg bg-white ml-2 mt-5 p-5">
                      <Text className="text-gray-500 font-semibold mb-2 text-left">Description <Text className="text-red-500">*</Text></Text>
                      <View style={{
                        borderRadius: 8,
                        marginBottom: 16,
                        borderColor: focusedField === 'description' ? '#22C55E' : '#d1d5db',
                        borderWidth: 2,
                      }}>
                        <TextInput
                          placeholder="Describe your property ........"
                          placeholderTextColor="#888"
                          value={description}
                          onChangeText={(text) => setDescription(text.replace(/[^a-zA-Z0-9\s]/g, ''))}
                          multiline
                          numberOfLines={6}            // ⬅️ increases initial rows
                          textAlignVertical="top"      // ⬅️ cursor starts at top (Android fix)
                          style={{
                            backgroundColor: '#f3f4f6',
                            height: 150,               // ⬅️ KEY: fixed textarea height
                            width: '100%',
                            padding: 12,
                            color: '#1f2937',
                          }}
                          onFocus={() => setFocusedField('description')}
                          onBlur={() => setFocusedField(null)}
                        />

                      </View>
                    </View>
                  </View>
                )}

                {/* Owner Details */}
                <View className="bg-white m-5 p-4 rounded-xl border border-gray-200">

                  {/* Title */}
                  <Text className="text-base font-semibold text-gray-800 mb-4">
                    Owner Details
                  </Text>

                  {/* Name */}
                  <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-3">
                    <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                    <TextInput
                      value={ownerName}
                      onChangeText={setOwnerName}
                      placeholder="Name of the Owner"
                      placeholderTextColor="#9CA3AF"
                      className="flex-1 ml-3 text-gray-900"
                    />
                  </View>

                  {/* Phone */}
                  <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-3">
                    <Ionicons name="call-outline" size={20} color="#9CA3AF" />
                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="Phone Number"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                      className="flex-1 ml-3 text-gray-900"
                    />
                  </View>

                  {/* Email */}
                  <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
                    <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Enter your Email"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="flex-1 ml-3 text-gray-900"
                    />
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
                  onPress={() => {
                    router.push("/(tabs)/home")
                  }}
                >
                  <Text style={{ color: "black", fontWeight: "600", fontSize: 15 }}>
                    Cancel
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
                    {isSubmitting ? "Uploading..." : "Upload Property"}
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