// Landstime_Androidapp/Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen.jsx

import React, { useState, useMemo, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import DocumentUpload from "components/Documentupload";
import OwnerDetails from "components/OwnersDetails";
import { createProperty } from "utils/propertyApi";
import Toast from 'react-native-toast-message';

export default function OwnerScreen() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const params = useLocalSearchParams();
  const rawCommercialDetails = params.commercialDetails;

  const getUserLanguage = () => {
    const currentLang = i18n.language || 'en';
    console.log('📝 Current app language:', currentLang);
    return currentLang;
  };

  const handleBack = () => {
    if (!commercialDetails) {
      router.back();
      return;
    }

    const subType = commercialDetails.subType;
    let pathname = "/home/screens/UploadScreens/CommercialUpload/Components/OfficeVaastu";
    let propertyTitle = commercialDetails.officeDetails?.propertyTitle || params.propertyTitle;

    if (subType === "Retail") {
      pathname = "/home/screens/UploadScreens/CommercialUpload/Components/RetailVaastu";
      propertyTitle = commercialDetails.retailDetails?.propertyTitle || params.propertyTitle;
    } else if (subType === "Plot/Land") {
      pathname = "/home/screens/UploadScreens/CommercialUpload/Components/PlotVaastu";
      propertyTitle = commercialDetails.plotDetails?.propertyTitle || params.propertyTitle;
    } else if (subType === "Industry") {
      pathname = "/home/screens/UploadScreens/CommercialUpload/Components/IndustryVaastu";
      propertyTitle = commercialDetails.industryDetails?.propertyTitle || params.propertyTitle;
    } else if (subType === "Hospitality") {
      pathname = "/home/screens/UploadScreens/CommercialUpload/Components/HospitalityVaastu";
      propertyTitle = commercialDetails.hospitalityDetails?.propertyTitle || params.propertyTitle;
    } else if (subType === "Storage") {
      pathname = "/home/screens/UploadScreens/CommercialUpload/Components/StorageVaastu";
      propertyTitle = commercialDetails.storageDetails?.propertyTitle || params.propertyTitle;
    }

    router.push({
      pathname,
      params: {
        commercialDetails: JSON.stringify(commercialDetails),
        images: JSON.stringify(images),
        area: params.area,
        propertyTitle,
        commercialBaseDetails: params.commercialBaseDetails,
      },
    });
  };

  const commercialDetails = useMemo(() => {
    if (!rawCommercialDetails) return null;
    try {
      if (typeof rawCommercialDetails === 'string') return JSON.parse(rawCommercialDetails);
      if (Array.isArray(rawCommercialDetails)) {
        const first = rawCommercialDetails[0];
        if (typeof first === 'string') return JSON.parse(first);
        return first;
      }
      if (typeof rawCommercialDetails === 'object') return rawCommercialDetails;
    } catch (e) {
      console.warn('Failed to parse commercial details', e);
      return null;
    }
    return null;
  }, [rawCommercialDetails]);

  // ✅ Parse images from params
  const images = useMemo(() => {
    if (!params.images) return [];
    try {
      if (typeof params.images === 'string') {
        return JSON.parse(params.images);
      }
      if (Array.isArray(params.images)) {
        return params.images;
      }
      return [];
    } catch (e) {
      console.warn('Failed to parse images from params', e);
      return [];
    }
  }, [params.images]);

  const [ownershipDocs, setOwnershipDocs] = useState([]);
  const [identityDocs, setIdentityDocs] = useState([]);
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [email, setEmail] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Clear draft when subtype changes
  useEffect(() => {
    let isClearing = false;

    const clearDraftIfSubtypeChanged = async () => {
      if (isClearing) return;

      try {
        const draft = await AsyncStorage.getItem('draft_owner_screen');
        if (draft) {
          const parsed = JSON.parse(draft);
          const currentSubType = commercialDetails?.subType;

          if (parsed.subType && parsed.subType !== currentSubType) {
            isClearing = true;

            await AsyncStorage.removeItem('draft_owner_screen');
            console.log('🧹 Cleared OwnerScreen draft due to subtype change:', {
              oldSubType: parsed.subType,
              newSubType: currentSubType
            });

            if (ownerName === parsed.ownerName) setOwnerName("");
            if (phone === parsed.phone) setPhone("");
            if (email === parsed.email) setEmail("");

            if (ownershipDocs.length === parsed.ownershipDocs?.length) {
              setOwnershipDocs([]);
            }
            if (identityDocs.length === parsed.identityDocs?.length) {
              setIdentityDocs([]);
            }
          }
        }
      } catch (e) {
        console.log('⚠️ Failed to check draft subtype:', e);
      }
    };

    if (commercialDetails?.subType) {
      clearDraftIfSubtypeChanged();
    }
  }, [commercialDetails?.subType]);

  // ✅ Load draft on mount ONCE
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await AsyncStorage.getItem('draft_owner_screen');
        if (draft) {
          const parsed = JSON.parse(draft);
          console.log('📦 Loading OwnerScreen draft from AsyncStorage');

          if (parsed.subType === commercialDetails?.subType) {
            if (!ownerName && parsed.ownerName) setOwnerName(parsed.ownerName);
            if (!phone && parsed.phone) setPhone(parsed.phone);
            if (!email && parsed.email) setEmail(parsed.email);

            if (ownershipDocs.length === 0 && parsed.ownershipDocs?.length > 0) {
              setOwnershipDocs(parsed.ownershipDocs);
            }
            if (identityDocs.length === 0 && parsed.identityDocs?.length > 0) {
              setIdentityDocs(parsed.identityDocs);
            }

            console.log('✅ OwnerScreen draft loaded successfully');
          }
        }
      } catch (e) {
        console.log('⚠️ Failed to load OwnerScreen draft:', e);
      }
    };

    loadDraft();
  }, []);

  // ✅ Auto-save with debounce
  useEffect(() => {
    if (!ownerName && !phone && !email &&
      ownershipDocs.length === 0 &&
      identityDocs.length === 0) {
      return;
    }

    const saveDraft = async () => {
      const ownerDraft = {
        ownershipDocs,
        identityDocs,
        ownerName,
        phone,
        email,
        subType: commercialDetails?.subType,
        timestamp: new Date().toISOString(),
      };

      try {
        await AsyncStorage.setItem('draft_owner_screen', JSON.stringify(ownerDraft));
        console.log('💾 OwnerScreen draft auto-saved for subType:', commercialDetails?.subType);
      } catch (e) {
        console.log('⚠️ Failed to save OwnerScreen draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 2000);
    return () => clearTimeout(timer);
  }, [ownershipDocs, identityDocs, ownerName, phone, email, commercialDetails?.subType]);

  const validatePhone = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);
    setPhone(limited);
    if (limited.length === 0) {
      setPhoneError("");
    } else if (limited.length < 10) {
      setPhoneError("Phone must be 10 digits");
    } else if (!/^[6-9]/.test(limited)) {
      setPhoneError("Must start with 6, 7, 8, or 9");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async () => {
    // ✅ Validate images from params
    if (!images || images.length === 0) {
      Alert.alert(
        "Missing Images",
        "Please go back and upload at least one property image.",
        [
          {
            text: "Go Back",
            onPress: () => handleBack()
          }
        ]
      );
      return;
    }

    if (ownershipDocs.length === 0) {
      Alert.alert("Missing Documents", "Please upload property ownership documents (Sale deed, Conveyance, etc.).");
      return;
    }
    if (identityDocs.length === 0) {
      Alert.alert("Missing Documents", "Please upload owner identity documents (PAN, Aadhaar, Passport, or Driver's License).");
      return;
    }
    if (!ownerName.trim()) {
      Alert.alert("Missing Information", "Please enter the property owner's name.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Missing Information", "Please enter the owner's phone number.");
      return;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      Alert.alert("Invalid Phone", "Phone number must be exactly 10 digits.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      Alert.alert("Invalid Phone", "Please enter a valid Indian mobile number starting with 6-9.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Missing Information", "Please enter the owner's email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!commercialDetails) {
      Alert.alert("Error", "Property details missing. Please go back and fill all required information.");
      return;
    }

    const restOfCommercialDetails = commercialDetails || {};

    const getExpectedPrice = () => {
      if (restOfCommercialDetails.officeDetails?.expectedPrice) {
        return restOfCommercialDetails.officeDetails.expectedPrice;
      }
      if (restOfCommercialDetails.retailDetails?.expectedPrice) {
        return restOfCommercialDetails.retailDetails.expectedPrice;
      }
      if (restOfCommercialDetails.industryDetails?.pricing?.expectedPrice) {
        return restOfCommercialDetails.industryDetails.pricing.expectedPrice;
      }
      if (restOfCommercialDetails.hospitalityDetails?.pricing?.expectedPrice) {
        return restOfCommercialDetails.hospitalityDetails.pricing.expectedPrice;
      }
      if (restOfCommercialDetails.storageDetails?.pricing?.expectedPrice) {
        return restOfCommercialDetails.storageDetails.pricing.expectedPrice;
      }
      if (restOfCommercialDetails.plotDetails?.pricing?.expectedPrice) {
        return restOfCommercialDetails.plotDetails.pricing.expectedPrice;
      }
      return commercialDetails.expectedPrice || 0;
    };

    const getLocation = () => {
      return restOfCommercialDetails.officeDetails?.location ||
        restOfCommercialDetails.retailDetails?.location ||
        restOfCommercialDetails.industryDetails?.location ||
        restOfCommercialDetails.hospitalityDetails?.location ||
        restOfCommercialDetails.plotDetails?.location ||
        restOfCommercialDetails.storageDetails?.location ||
        '';
    };

    const getNeighborhoodArea = () => {
      return params.area ||
        restOfCommercialDetails.officeDetails?.neighborhoodArea ||
        restOfCommercialDetails.retailDetails?.neighborhoodArea ||
        restOfCommercialDetails.hospitalityDetails?.neighborhoodArea ||
        restOfCommercialDetails.industryDetails?.neighborhoodArea ||
        restOfCommercialDetails.storageDetails?.neighborhoodArea ||
        restOfCommercialDetails.plotDetails?.neighborhoodArea ||
        restOfCommercialDetails.area ||
        '';
    };

    const getDescription = () => {
      return restOfCommercialDetails.officeDetails?.description ||
        restOfCommercialDetails.retailDetails?.description ||
        restOfCommercialDetails.industryDetails?.description ||
        restOfCommercialDetails.hospitalityDetails?.description ||
        restOfCommercialDetails.plotDetails?.description ||
        restOfCommercialDetails.storageDetails?.description ||
        '';
    };

    const propertyData = {
      propertyTitle: restOfCommercialDetails.propertyTitle || params.propertyTitle || `Commercial ${restOfCommercialDetails.subType || "Office"}`,
      propertyType: "Commercial",
      originalLanguage: getUserLanguage(),
      location: getLocation(),
      area: getNeighborhoodArea(),
      description: getDescription(),
      expectedPrice: getExpectedPrice(),
      commercialDetails: restOfCommercialDetails,
      ownerDetails: {
        name: ownerName,
        phone,
        email,
      },
    };

    console.log('📤 Submitting property data:', {
      propertyType: propertyData.propertyType,
      subType: propertyData.commercialDetails?.subType,
      hasLocation: !!propertyData.location,
      hasArea: !!propertyData.area,
      expectedPrice: propertyData.expectedPrice,
      imageCount: images.length,
    });

    setIsSubmitting(true);

    try {
      // ✅ Get images from params
      const imageUris = images && images.length > 0
        ? images.map(img => typeof img === 'string' ? img : img.uri)
        : [];

      const result = await createProperty(propertyData, imageUris, ownershipDocs, identityDocs);

      if (!result.success) {
        throw new Error(result.error || result.data?.message || "Upload failed");
      }

      // ✅ Clear all drafts on successful upload
      try {
        await AsyncStorage.multiRemove([
          'draft_commercial_office',
          'draft_office_details',
          'draft_office_pricing',
          'draft_office_vaastu',

          'draft_commercial_retail',
          'draft_retail_details',
          'draft_retail_pricing',
          'draft_retail_vaastu',

          'draft_commercial_hospitality',
          'draft_hospitality_details',
          'draft_hospitality_pricing',
          'draft_hospitality_vaastu',

          'draft_commercial_plot',
          'draft_plot_details',
          'draft_plot_pricing',
          'draft_plot_vaastu',

          'draft_commercial_storage',
          'draft_storage_details',
          'draft_storage_pricing',
          'draft_storage_vaastu',

          'draft_commercial_industry',
          'draft_industry_details',
          'draft_industry_pricing',
          'draft_industry_vaastu',

          'draft_owner_screen',
        ]);
        console.log('🧹 All drafts cleared including OwnerScreen');
      } catch (e) {
        console.log('⚠️ Failed to clear drafts:', e);
      }

      Alert.alert("Success", "Property uploaded successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/home"),
        },
      ]);
    } catch (error) {
      console.error('❌ Upload error:', error);

      let errorTitle = "Upload Failed";
      let errorMessage = 'Failed to upload property. Please check all fields and try again.';

      if (error.response?.data) {
        const errorData = error.response.data;

        console.log('📋 Error response:', errorData);

        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorTitle = errorData.message || "Validation Error";
          errorMessage = errorData.errors.join('\n\n');
        }
        else if (errorData.error?.validation && Array.isArray(errorData.error.validation)) {
          errorTitle = "Validation Error";
          errorMessage = errorData.error.validation.join('\n\n');
        }
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
        else if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert(errorTitle, errorMessage, [
        {
          text: "OK",
          style: "cancel"
        }
      ]);

      Toast.show({
        type: 'error',
        text1: errorTitle,
        text2: errorMessage.split('\n')[0],
        visibilityTime: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

 return (
  <View className="flex-1 bg-[#F5F6F8]">
    {/* Header */}
    <View className="flex-row items-center mt-12 mb-4">
      <TouchableOpacity onPress={handleBack} className="p-2" accessibilityRole="button">
        <Image source={require("../../../../../../assets/arrow.png")} style={{ width: 20, height: 20, resizeMode: "contain" }} />
      </TouchableOpacity>
      <View className="ml-2">
        <Text className="text-[16px] font-semibold">Upload Your Property</Text>
        <Text className="text-[12px] text-[#00000066]">Add your property details</Text>
      </View>
    </View>

    {/* Scrollable Content - Extended padding */}
    <ScrollView 
      contentContainerStyle={{ padding: 16, paddingBottom: 250 }} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="px-4 mt-4 border border-gray-200 rounded-lg bg-white space-y-4 mb-4">
        <DocumentUpload 
          title="Property Ownership" 
          subtitle="Verify ownership to publish your property listing securely." 
          files={ownershipDocs} 
          setFiles={setOwnershipDocs} 
          required 
        />
        <DocumentUpload 
          title="Owner Identity" 
          subtitle="Upload PAN, Aadhaar, Passport or Driver's License" 
          files={identityDocs} 
          setFiles={setIdentityDocs} 
          required 
        />
        <OwnerDetails 
          ownerName={ownerName} 
          setOwnerName={setOwnerName} 
          phone={phone} 
          setPhone={validatePhone} 
          phoneError={phoneError} 
          email={email} 
          setEmail={setEmail} 
          focusedField={focusedField} 
          setFocusedField={setFocusedField} 
        />
      </View>
      
      {/* Extra spacing to ensure content is visible above keyboard */}
      <View style={{ height: 100 }} />
    </ScrollView>

    {/* Footer Buttons - Absolute positioning */}
    <View 
      style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingVertical: 16,
        paddingBottom: Platform.OS === 'ios' ? 24 : 16
      }}
    >
      <View className="flex-row justify-end space-x-3 mx-3 mb-8">
        <TouchableOpacity 
          style={{ backgroundColor: "#E5E7EB", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 }} 
          onPress={handleBack} 
          className="mx-4"
          disabled={isSubmitting}
        >
          <Text style={{ color: "black", fontWeight: "600", fontSize: 15 }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ 
            backgroundColor: isSubmitting ? "#9CA3AF" : "#22C55E", 
            paddingVertical: 12, 
            paddingHorizontal: 20, 
            borderRadius: 10 
          }} 
          onPress={handleSubmit} 
          disabled={isSubmitting}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
            {isSubmitting ? "Uploading..." : "Upload Property"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
}