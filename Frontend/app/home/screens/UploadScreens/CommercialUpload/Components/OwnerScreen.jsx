// Landstime_Androidapp/Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen.jsx

import React, { useState, useMemo, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import DocumentUpload from "components/Documentupload";
import ImageUpload from "components/ImageUpload";
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
        images: JSON.stringify(propertyImages),
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

  const [propertyImages, setPropertyImages] = useState([]);
  const [ownershipDocs, setOwnershipDocs] = useState([]);
  const [identityDocs, setIdentityDocs] = useState([]);
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [email, setEmail] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Clear draft when subtype changes
  // ✅ FIXED - Clear draft when subtype changes (with prevention flag)
useEffect(() => {
  let isClearing = false; // Prevent multiple clears

  const clearDraftIfSubtypeChanged = async () => {
    if (isClearing) return;
    
    try {
      const draft = await AsyncStorage.getItem('draft_owner_screen');
      if (draft) {
        const parsed = JSON.parse(draft);
        const currentSubType = commercialDetails?.subType;
        
        // If subtype changed, clear the draft
        if (parsed.subType && parsed.subType !== currentSubType) {
          isClearing = true;
          
          await AsyncStorage.removeItem('draft_owner_screen');
          console.log('🧹 Cleared OwnerScreen draft due to subtype change:', {
            oldSubType: parsed.subType,
            newSubType: currentSubType
          });
          
          // Reset all fields ONLY if they match the old draft
          // This prevents clearing user's new inputs
          if (ownerName === parsed.ownerName) setOwnerName("");
          if (phone === parsed.phone) setPhone("");
          if (email === parsed.email) setEmail("");
          
          // Don't clear files if user already uploaded new ones
          if (propertyImages.length === parsed.propertyImages?.length) {
            setPropertyImages([]);
          }
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
}, [commercialDetails?.subType]); // ✅ ONLY depend on subType

// ✅ FIXED - Load draft on mount ONCE
useEffect(() => {
  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem('draft_owner_screen');
      if (draft) {
        const parsed = JSON.parse(draft);
        console.log('📦 Loading OwnerScreen draft from AsyncStorage');
        
        // Only load if subtype matches AND fields are empty
        if (parsed.subType === commercialDetails?.subType) {
          if (!ownerName && parsed.ownerName) setOwnerName(parsed.ownerName);
          if (!phone && parsed.phone) setPhone(parsed.phone);
          if (!email && parsed.email) setEmail(parsed.email);
          
          if (propertyImages.length === 0 && parsed.propertyImages?.length > 0) {
            setPropertyImages(parsed.propertyImages);
          }
          if (ownershipDocs.length === 0 && parsed.ownershipDocs?.length > 0) {
            setOwnershipDocs(parsed.ownershipDocs);
          }
          if (identityDocs.length === 0 && parsed.identityDocs?.length > 0) {
            setIdentityDocs(parsed.identityDocs);
          }
          
          console.log('✅ OwnerScreen draft loaded successfully');
          return;
        }
      }
    } catch (e) {
      console.log('⚠️ Failed to load OwnerScreen draft:', e);
    }

    // FALLBACK: Load images from params if no draft
    if (params.images && propertyImages.length === 0) {
      try {
        const parsedImages = typeof params.images === 'string' 
          ? JSON.parse(params.images) 
          : params.images;
        
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          setPropertyImages(parsedImages);
          console.log('✅ Images loaded from params:', parsedImages.length);
        }
      } catch (e) {
        console.log('⚠️ Failed to parse images:', e);
      }
    }
  };

  loadDraft();
}, []); // ✅ EMPTY DEPS - Load only once on mount

// ✅ FIXED - Auto-save with debounce (prevents rapid saves)
useEffect(() => {
  // Don't save empty state
  if (!ownerName && !phone && !email && 
      propertyImages.length === 0 && 
      ownershipDocs.length === 0 && 
      identityDocs.length === 0) {
    return;
  }

  const saveDraft = async () => {
    const ownerDraft = {
      propertyImages,
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

  // ✅ Debounce - only save after 2 seconds of inactivity
  const timer = setTimeout(saveDraft, 2000);
  return () => clearTimeout(timer);
}, [propertyImages, ownershipDocs, identityDocs, ownerName, phone, email, commercialDetails?.subType]);
  // ✅ Auto-save OwnerScreen draft
  useEffect(() => {
    const saveDraft = async () => {
      // Only save if we have meaningful data
      if (!ownerName && !phone && !email && propertyImages.length === 0) return;

      const ownerDraft = {
        propertyImages,
        ownershipDocs,
        identityDocs,
        ownerName,
        phone,
        email,
        subType: commercialDetails?.subType, // ✅ Store subType for validation
        timestamp: new Date().toISOString(),
      };

      try {
        await AsyncStorage.setItem('draft_owner_screen', JSON.stringify(ownerDraft));
        console.log('💾 OwnerScreen draft auto-saved for subType:', commercialDetails?.subType);
      } catch (e) {
        console.log('⚠️ Failed to save OwnerScreen draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [propertyImages, ownershipDocs, identityDocs, ownerName, phone, email, commercialDetails?.subType]);

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
    // ✅ Enhanced validation with detailed messages
    if (propertyImages.length === 0) {
      Alert.alert("Missing Images", "Please upload at least one property image to continue.");
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
    
    // ✅ Email validation
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
    });

    setIsSubmitting(true);

    try {
      const imageUris = propertyImages.map(img => img.uri);
      const result = await createProperty(propertyData, imageUris, ownershipDocs, identityDocs);
      
      if (!result.success) {
        throw new Error(result.error || result.data?.message || "Upload failed");
      }

      // ✅ Clear all drafts on successful upload
      try {
        await AsyncStorage.multiRemove([
          // Office drafts
          'draft_commercial_office',
          'draft_office_details',
          'draft_office_pricing',
          'draft_office_vaastu',
          
          // Retail drafts
          'draft_commercial_retail',
          'draft_retail_details',
          'draft_retail_pricing',
          'draft_retail_vaastu',
          
          // Hospitality drafts
          'draft_commercial_hospitality',
          'draft_hospitality_details',
          'draft_hospitality_pricing',
          'draft_hospitality_vaastu',

          // Plot drafts
          'draft_commercial_plot',
          'draft_plot_pricing',
          'draft_plot_vaastu',

          // Storage drafts
          'draft_commercial_storage',
          'draft_storage_details',
          'draft_storage_pricing',
          'draft_storage_vaastu',

          // Industry drafts
          'draft_commercial_industry',
          'draft_industry_details',
          'draft_industry_pricing',
          'draft_industry_vaastu',

          // Owner screen draft
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
      
      // ✅ Extract detailed validation errors
      let errorTitle = "Upload Failed";
      let errorMessage = 'Failed to upload property. Please check all fields and try again.';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        console.log('📋 Error response:', errorData);
        
        // Check for validation errors array
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorTitle = errorData.message || "Validation Error";
          errorMessage = errorData.errors.join('\n\n');
        } 
        // Check for validation object (Mongoose errors)
        else if (errorData.error?.validation && Array.isArray(errorData.error.validation)) {
          errorTitle = "Validation Error";
          errorMessage = errorData.error.validation.join('\n\n');
        }
        // Check for single error message
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
        // Check for nested error message
        else if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Show detailed error
      Alert.alert(errorTitle, errorMessage, [
        {
          text: "OK",
          style: "cancel"
        }
      ]);
      
      // Also show toast for quick feedback
      Toast.show({
        type: 'error',
        text1: errorTitle,
        text2: errorMessage.split('\n')[0], // Show first error in toast
        visibilityTime: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F5F6F8]">
      <View className="flex-row items-center mt-12">
        <TouchableOpacity onPress={handleBack} className="p-2" accessibilityRole="button">
          <Image source={require("../../../../../../assets/arrow.png")} style={{ width: 20, height: 20, resizeMode: "contain" }} />
        </TouchableOpacity>
        <View className="ml-2">
          <Text className="text-[16px] font-semibold">Upload Your Property</Text>
          <Text className="text-[12px] text-[#00000066]">Add your property details</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 36 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 mt-4 border border-gray-200 rounded-lg bg-white space-y-4">
          <ImageUpload 
            title="Property Images" 
            subtitle="Upload at least one image of your property." 
            files={propertyImages} 
            setFiles={setPropertyImages} 
            required 
          />
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
      </ScrollView>

      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16, gap: 12 }} className="mr-4 mb-3 bg-white border-t border-gray-200 py-4">
        <View className="flex-row justify-end space-x-3 mx-3 mb-4">
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