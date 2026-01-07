

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

  // ✅ Determine which Vaastu screen to go back to based on subType
  const subType = commercialDetails.subType;
  let pathname = "/home/screens/UploadScreens/CommercialUpload/Components/OfficeVaastu";
  let propertyTitle = commercialDetails.officeDetails?.propertyTitle || params.propertyTitle;

  if (subType === "Retail") {
    pathname = "/home/screens/UploadScreens/CommercialUpload/Components/RetailVaastu";
    propertyTitle = commercialDetails.retailDetails?.propertyTitle || params.propertyTitle;
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
    if (propertyImages.length === 0) {
      Alert.alert("Error", "Please upload at least one property image.");
      return;
    }
    if (ownershipDocs.length === 0) {
      Alert.alert("Error", "Please upload property ownership documents.");
      return;
    }
    if (identityDocs.length === 0) {
      Alert.alert("Error", "Please upload owner identity documents.");
      return;
    }
    if (!ownerName.trim()) {
      Alert.alert("Error", "Please enter owner name.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Error", "Please enter phone number.");
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
      Alert.alert("Error", "Please enter email address.");
      return;
    }
    if (!commercialDetails) {
      Alert.alert("Error", "Property details missing. Please restart.");
      return;
    }

    const restOfCommercialDetails = commercialDetails || {};

   const getExpectedPrice = () => {
  if (restOfCommercialDetails.officeDetails?.expectedPrice) {
    return restOfCommercialDetails.officeDetails.expectedPrice;
  }
  // ✅ FIXED - Retail expectedPrice is at top level, not in pricing object
  if (restOfCommercialDetails.retailDetails?.expectedPrice) {
    return restOfCommercialDetails.retailDetails.expectedPrice;
  }
  if (restOfCommercialDetails.industryDetails?.pricing?.expectedPrice) {
    return restOfCommercialDetails.industryDetails.pricing.expectedPrice;
  }
  if (restOfCommercialDetails.hospitalityDetails?.pricing?.expectedPrice) {
    return restOfCommercialDetails.hospitalityDetails.pricing.expectedPrice;
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
    restOfCommercialDetails.retailDetails?.neighborhoodArea || // ✅ ADD THIS
    restOfCommercialDetails.hospitalityDetails?.neighborhoodArea ||
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

    setIsSubmitting(true);

    try {
      const imageUris = propertyImages.map(img => img.uri);
      const result = await createProperty(propertyData, imageUris, ownershipDocs, identityDocs);
      if (!result.success) {
        throw new Error(result.error || result.data?.message || "Upload failed");
      }
      try {
  await AsyncStorage.multiRemove([
    // Office drafts
    'draft_commercial_office',
    'draft_office_details',
    'draft_office_pricing',
    'draft_office_vaastu',
    
    // ✅ NEW - Retail drafts
    'draft_commercial_retail',
    'draft_retail_details',
    'draft_retail_pricing',
    'draft_retail_vaastu',
    
    // Hospitality drafts
    'draft_commercial_hospitality',
    'draft_hospitality_details',
    'draft_hospitality_pricing',
    'draft_hospitality_vaastu',
  ]);
  console.log('🧹 All drafts cleared');
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
      console.error(error);
      Alert.alert("Error", error.message || "Failed to upload property");
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

      {/* ✅ TEMPORARY - CLEAR BAD TOKEN BUTTON */}
      <TouchableOpacity 
        onPress={async () => {
          await AsyncStorage.removeItem('userToken');
          Alert.alert('Success', 'Token cleared. Please login again.');
          router.replace('/auth/LoginScreen');
        }}
        style={{ padding: 15, backgroundColor: '#FF6B6B', margin: 10, borderRadius: 8 }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          🔧 Clear Token & Re-login
        </Text>
      </TouchableOpacity>


      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 36 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 mt-4 border border-gray-200 rounded-lg bg-white space-y-4">
          <ImageUpload title="Property Images" subtitle="Upload at least one image of your property." files={propertyImages} setFiles={setPropertyImages} required />
          <DocumentUpload title="Property Ownership" subtitle="Verify ownership to publish your property listing securely." files={ownershipDocs} setFiles={setOwnershipDocs} required />
          <DocumentUpload title="Owner Identity" subtitle="Upload PAN, Aadhaar, Passport or Driver's License" files={identityDocs} setFiles={setIdentityDocs} required />
          <OwnerDetails ownerName={ownerName} setOwnerName={setOwnerName} phone={phone} setPhone={validatePhone} phoneError={phoneError} email={email} setEmail={setEmail} focusedField={focusedField} setFocusedField={setFocusedField} />
        </View>
      </ScrollView>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16, gap: 12 }} className="mr-4 mb-3 bg-white border-t border-gray-200 py-4">
        <View className="flex-row justify-end space-x-3 mx-3 mb-4">
          <TouchableOpacity style={{ backgroundColor: "#E5E7EB", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 }} onPress={handleBack} className="mx-4">
            <Text style={{ color: "black", fontWeight: "600", fontSize: 15 }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: "#22C55E", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 }} onPress={handleSubmit} disabled={isSubmitting}>
            <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>{isSubmitting ? "Uploading..." : "Upload Property"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}