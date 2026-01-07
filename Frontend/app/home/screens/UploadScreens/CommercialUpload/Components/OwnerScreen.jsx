// Landstime_Androidapp/Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen.jsx

import React, { useState,useMemo,useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import { useRouter,useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import DocumentUpload from "components/Documentupload";
import ImageUpload from "components/ImageUpload";
import OwnerDetails from "components/OwnersDetails";
import { createProperty } from "utils/propertyApi";

export default function OwnerScreen() {
    const router = useRouter();
    const {i18n} = useTranslation();
    // Read all params once at top-level (hooks must not be called inside event handlers)
    const params = useLocalSearchParams();
    const rawCommercialDetails = params.commercialDetails;


     // Helper function to get user's current language
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

 router.push({
  pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OfficeVaastu",
  params: {
    commercialDetails: JSON.stringify(commercialDetails),
    images: JSON.stringify(propertyImages),
    area: params.area,
    propertyTitle: commercialDetails.officeDetails?.propertyTitle || params.propertyTitle,
    // ✅ ADD THIS
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

    // State for documents and images
    const [propertyImages, setPropertyImages] = useState([]);
    const [ownershipDocs, setOwnershipDocs] = useState([]);
    const [identityDocs, setIdentityDocs] = useState([]);

    // State for owner details
    const [ownerName, setOwnerName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [focusedField, setFocusedField] = useState(null);

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        // Validation
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
        if (!email.trim()) {
            Alert.alert("Error", "Please enter email address.");
            return;
        }
        if (!commercialDetails) {
  Alert.alert("Error", "Property details missing. Please restart.");
  return;
}

// ✅ Extract expectedPrice from commercialDetails
// ✅ Extract expectedPrice based on subType

const restOfCommercialDetails = commercialDetails || {};

const getExpectedPrice = () => {
  if (restOfCommercialDetails.officeDetails?.expectedPrice) {
    return restOfCommercialDetails.officeDetails.expectedPrice;
  }
  if (restOfCommercialDetails.retailDetails?.pricing?.expectedPrice) {
    return restOfCommercialDetails.retailDetails.pricing.expectedPrice;
  }
  if (restOfCommercialDetails.industryDetails?.pricing?.expectedPrice) {
    return restOfCommercialDetails.industryDetails.pricing.expectedPrice;
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
    restOfCommercialDetails.area || 
    '';
};
// ✅ ADD THIS helper function before propertyData
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
  propertyTitle:
    restOfCommercialDetails.propertyTitle || 
    params.propertyTitle || 
    `Commercial ${restOfCommercialDetails.subType || "Office"}`,
  propertyType: "Commercial",
  originalLanguage: getUserLanguage(),
  
  location: getLocation(),
  area: getNeighborhoodArea(),
  
  description: getDescription(), // ✅ Use helper function

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
  // Use shared API helper to upload property and docs
  const imageUris = propertyImages.map(img => img.uri);
  const result = await createProperty(propertyData, imageUris, ownershipDocs, identityDocs);

  if (!result.success) {
    throw new Error(result.error || result.data?.message || "Upload failed");
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
            <View className="flex-row items-center mt-12 ">
         
<TouchableOpacity
  onPress={handleBack}
  className="p-2"
  accessibilityRole="button"
>                 <Image
                                source={require("../../../../../../assets/arrow.png")}
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
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
                showsVerticalScrollIndicator={false}
            >

                {/* uploads + owner details */}
                <View className="px-4 mt-4  border border-gray-200 rounded-lg bg-white space-y-4">

                    {/* Header */}
                    
                    {/* Image Upload */}
                    <ImageUpload
                        title="Property Images"
                        subtitle="Upload at least one image of your property."
                        files={propertyImages}
                        setFiles={setPropertyImages}
                        required
                    />

                    {/* Document Uploads */}
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

                    {/* Owner Details */}
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

                    {/* Action Buttons */}
                   
                </View>
            </ScrollView>
             <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            marginTop: 16,
                            gap: 12,
                        }}
                        className=" mr-4 mb-3 bg-white border-t border-gray-200 py-4"
                    >
                        {/* Cancel Button */}
                        <View className="flex-row justify-end  space-x-3 mx-3 mb-4">
                        
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#E5E7EB",
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                borderRadius: 10,
                            }}
                            onPress={() => router.push("/(tabs)/home")}
                            className="mx-4"
                        >
                            <Text
                                style={{ color: "black", fontWeight: "600", fontSize: 15 }}
                            >
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
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <Text
                                style={{ color: "white", fontWeight: "600", fontSize: 15 }}
                            >
                                {isSubmitting ? "Uploading..." : "Upload Property"}
                            </Text>
                        </TouchableOpacity>
                        </View>
                        </View>
                    
        </View>

    );
}