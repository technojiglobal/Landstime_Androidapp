//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/HospitalityNext.jsx

import React, { useState,useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ ADD THIS
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import { useRouter,useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';


import MorePricingDetailsModal from "../../MorePricingDetailsModal";
const PillButton = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: selected ? "#22C55E" : "#E5E7EB",
      backgroundColor: selected ? "#22C55E17" : "#fff",
      marginRight: 8,
      marginBottom: 8,
    }}
  >
    <Text style={{ fontSize: 12, color: selected ? "#22C55E" : "#6B7280" }}>
      {label}
    </Text>
  </TouchableOpacity>
);

const Checkbox = ({ selected }) => (
  <View
    style={{
      width: 16,
      height: 16,
      borderWidth: 1,
      borderColor: selected ? "#22C55E" : "#D1D5DB",
      backgroundColor: selected ? "#22C55E" : "#fff",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    }}
  >
    {selected && <Text style={{ color: "#fff", fontSize: 10 }}>✓</Text>}
  </View>
);
const HospitalityNext = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    const images = params.images ? JSON.parse(params.images) : [];

    /* ---------------- PRICE STATES ---------------- */
    const ownershipOptions = ['Freehold', 'Leasehold', 'Company Owned', 'Other'];
    const [ownership, setOwnership] = useState('');
    const [expectedPrice, setExpectedPrice] = useState("");
    const [allInclusive, setAllInclusive] = useState(false);
    const [priceNegotiable, setPriceNegotiable] = useState(false);
    const [taxExcluded, setTaxExcluded] = useState(false);
    const [IndustryApprovedBy, setIndustryApprovedBy] = useState("");
    const [approvedIndustryType, setApprovedIndustryType] = useState("");
    const authorityOptions = ['Local Authority'];
    /* ---------------- YES / NO STATES ---------------- */
    const [preLeased, setPreLeased] = useState(null);
    const [nocCertified, setNocCertified] = useState(null);
    const [occupancyCertified, setOccupancyCertified] = useState(null);

    /* ---------------- PREVIOUS USE ---------------- */
    const [visible, setVisible] = useState(null);

    const prevUsedForOptions = ["Commercial", "Residential", "Warehouse"];

    /* ---------------- DESCRIPTION ---------------- */
    const [describeProperty, setDescribeProperty] = useState("");
    const [wheelchairFriendly, setWheelchairFriendly] = useState(false);
    const [amenities, setAmenities] = useState([]);
    const [locAdvantages, setLocAdvantages] = useState([]);
    const [flooringType, setFlooringType] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const [pricingModalVisible, setPricingModalVisible] = useState(false);
     const [leaseDuration, setLeaseDuration] = useState("");
    const [monthlyRent, setMonthlyRent] = useState("");



    // ✅ NEW - Load draft from AsyncStorage
useEffect(() => {
  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem('draft_hospitality_pricing');
      if (draft) {
        const savedData = JSON.parse(draft);
        console.log('📦 Loading Hospitality pricing draft from AsyncStorage');
        
        setOwnership(savedData.ownership || '');
        setIndustryApprovedBy(savedData.IndustryApprovedBy || '');
        setApprovedIndustryType(savedData.approvedIndustryType || '');
        setExpectedPrice(savedData.expectedPrice?.toString() || '');
        setAllInclusive(savedData.allInclusive || false);
        setPriceNegotiable(savedData.priceNegotiable || false);
        setTaxExcluded(savedData.taxExcluded || false);
        setPreLeased(savedData.preLeased || null);
        setLeaseDuration(savedData.leaseDuration || '');
        setMonthlyRent(savedData.monthlyRent?.toString() || '');
        setDescribeProperty(savedData.describeProperty || '');
        setWheelchairFriendly(savedData.wheelchairFriendly || false);
        setAmenities(savedData.amenities || []);
        setLocAdvantages(savedData.locAdvantages || []);
        setFlooringType(savedData.flooringType || '');
        
        console.log('✅ Hospitality pricing draft loaded');
        return;
      }
    } catch (e) {
      console.log('⚠️ Failed to load pricing draft:', e);
    }

    // ✅ FALLBACK: Load from params
    if (params.commercialDetails) {
      try {
        const details = JSON.parse(params.commercialDetails);
        if (details.hospitalityDetails) {
          const hospitality = details.hospitalityDetails;
          
          setOwnership(hospitality.ownership || '');
          setExpectedPrice(hospitality.expectedPrice?.toString() || '');
          setAllInclusive(hospitality.priceDetails?.allInclusive || false);
          setPriceNegotiable(hospitality.priceDetails?.negotiable || false);
          setTaxExcluded(hospitality.priceDetails?.taxExcluded || false);
          setPreLeased(hospitality.preLeased || null);
          setLeaseDuration(hospitality.leaseDuration || '');
          setMonthlyRent(hospitality.monthlyRent?.toString() || '');
          setDescribeProperty(hospitality.description || '');
          setAmenities(hospitality.amenities || []);
          setLocAdvantages(hospitality.locationAdvantages || []);
          
          console.log('✅ Hospitality pricing restored from params');
        }
      } catch (e) {
        console.log('❌ Could not restore from params:', e);
      }
    }
  };

  loadDraft();
}, [params.commercialDetails]);

// ✅ NEW - Auto-save pricing draft
useEffect(() => {
  const saveDraft = async () => {
    const pricingDraft = {
      ownership,
      IndustryApprovedBy,
      approvedIndustryType,
      expectedPrice,
      allInclusive,
      priceNegotiable,
      taxExcluded,
      preLeased,
      leaseDuration,
      monthlyRent,
      describeProperty,
      wheelchairFriendly,
      amenities,
      locAdvantages,
      flooringType,
      timestamp: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem('draft_hospitality_pricing', JSON.stringify(pricingDraft));
      console.log('💾 Hospitality pricing draft auto-saved');
    } catch (e) {
      console.log('⚠️ Failed to save pricing draft:', e);
    }
  };

  const timer = setTimeout(saveDraft, 1000);
  return () => clearTimeout(timer);
}, [ownership, IndustryApprovedBy, approvedIndustryType, expectedPrice, 
    allInclusive, priceNegotiable, taxExcluded, preLeased, leaseDuration, 
    monthlyRent, describeProperty, wheelchairFriendly, amenities, 
    locAdvantages, flooringType]);
    /* ---------------- AMENITIES ---------------- */
    const amenityOptions = [

        "+Water Storage",
        "+currently Air Conditioned",
        "+Vaastu Complex",
        "+Security fire Alarm",
        "+Visitor Parking",
    ];
   

    /* ---------------- LOCATION ADVANTAGES ---------------- */
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
   
    

    /* ---------------- HELPERS ---------------- */
    const toggleArrayItem = (setter, array, value) => {
        if (array.includes(value)) {
            setter(array.filter((item) => item !== value));
        } else {
            setter([...array, value]);
        }
    };

 const handleNext = () => {
  if (!expectedPrice.trim()) {
    Toast.show({
      type: 'error',
      text1: 'Price Required',
      text2: 'Please enter the expected price.',
    });
    return;
  }
  if (!describeProperty.trim()) {
    Toast.show({
      type: 'error',
      text1: 'Description Required',
      text2: 'Please describe your property.',
    });
    return;
  }

  // ✅ BUILD COMPLETE DETAILS
  const updatedCommercialDetails = JSON.parse(params.commercialDetails);
  
  updatedCommercialDetails.hospitalityDetails = {
    ...updatedCommercialDetails.hospitalityDetails,
    ownership,
    IndustryApprovedBy,
    approvedIndustryType,
    expectedPrice: Number(expectedPrice),
    priceDetails: {
      allInclusive,
      negotiable: priceNegotiable,
      taxExcluded,
    },
    preLeased,
    leaseDuration: leaseDuration || undefined,
    monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
    description: describeProperty,
    amenities,
    locationAdvantages: locAdvantages,
    wheelchairFriendly,
    flooringType,
  };
  
  Toast.show({
    type: 'success',
    text1: 'Details Saved',
    text2: 'Moving to next step...',
  });

  router.push({
    pathname: "/home/screens/UploadScreens/CommercialUpload/Components/HospitalityVaastu",
    params: {
      commercialDetails: JSON.stringify(updatedCommercialDetails),
      images: JSON.stringify(images),
      area: params.area || updatedCommercialDetails.hospitalityDetails.neighborhoodArea, // ✅ FIXED
      propertyTitle: updatedCommercialDetails.hospitalityDetails?.propertyTitle || params.propertyTitle,
    },
  });
};

    return (
        <View className="flex-1 bg-white">
            <View className="flex-row items-center mt-4 mb-3 ml-4">
               <TouchableOpacity
  onPress={() => {
    const currentData = JSON.parse(params.commercialDetails);
    currentData.hospitalityDetails = {
      ...currentData.hospitalityDetails,
      ownership,
      IndustryApprovedBy,
      approvedIndustryType,
      expectedPrice: Number(expectedPrice) || undefined,
      priceDetails: { allInclusive, negotiable: priceNegotiable, taxExcluded },
      preLeased,
      leaseDuration,
      monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
      description: describeProperty,
      amenities,
      locationAdvantages: locAdvantages,
      wheelchairFriendly,
      flooringType,
    };
    
    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/Hospitality",
      params: {
        images: JSON.stringify(images),
        commercialDetails: JSON.stringify(currentData),
        area: params.area || currentData.hospitalityDetails.neighborhoodArea, // ✅ FIXED
      },
    });
  }}
  className="p-2"
>
                        <Image
                            source={require("../../../../../../assets/arrow.png")}
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
                
                {/* ---------- PRICE DETAILS ---------- */}
                <View
                    className="bg-white rounded-lg p-4 mb-4"
                    style={{ borderWidth: 1, borderColor: "#0000001A" }}
                >
                    <Text className="text-[15px] text-[#00000099] font-bold mb-2">Ownership</Text>
                    <View className="flex-row flex-wrap mb-4">
                        {ownershipOptions.map((o) => (
                            <PillButton key={o} label={o} selected={ownership === o} onPress={() => setOwnership(o)} />
                        ))}
                    </View>

                    <Text className="mb-2 text-[15px] font-bold text-[#00000099]">
                        Which authority the property is approved by?
                    </Text>
                    <View className="flex-row flex-wrap mb-4">
                        {authorityOptions.map((auth) => (
                            <PillButton
                                key={auth}
                                label={auth}
                                selected={IndustryApprovedBy === auth}
                                onPress={() => setIndustryApprovedBy(auth)}
                            />
                        ))}
                    </View>
                    <Text className="mb-2 text-[15px] font-bold text-[#00000099]">
                        Approved for industry type
                    </Text>

                    <TextInput
                        placeholder="select Industry Type"
                        value={approvedIndustryType}
                        onChangeText={setApprovedIndustryType}
                        onFocus={() => setFocusedField("industryType")}
                        onBlur={() => setFocusedField(null)}
                        className="rounded-md p-3 mb-3"
                        style={{
                            borderWidth: 1,
                            borderColor: focusedField === "industryType" ? "#22C55E" : "#0000001A",
                            backgroundColor: "#D9D9D91C",
                            height: 50,
                        }}
                    />

                    <Text className="mb-2 text-[15px] font-bold text-[#00000099]">
                        Expected Price Details <Text className="text-red-500">*</Text>
                    </Text>

                    <TextInput
                        placeholder="₹ Expected Price"
                        value={expectedPrice}
                        onChangeText={setExpectedPrice}
                        onFocus={() => setFocusedField("expectedPrice")}
                        onBlur={() => setFocusedField(null)}
                        className="rounded-md p-3 mb-3"
                        style={{
                            borderWidth: 1,
                            borderColor: focusedField === "expectedPrice" ? "#22C55E" : "#0000001A",
                            height: 52,
                            backgroundColor: "#D9D9D91C",
                        }}
                        keyboardType="numeric"
                    />

                    <Checkbox
                        label="DG & UPS Price included"
                        selected={allInclusive}
                        onPress={() => setAllInclusive(!allInclusive)}
                    />
                    <Checkbox
                        label="Price Negotiable"
                        selected={priceNegotiable}
                        onPress={() => setPriceNegotiable(!priceNegotiable)}
                    />
                    <Checkbox
                        label="Tax and Govt. charges excluded"
                        selected={taxExcluded}
                        onPress={() => setTaxExcluded(!taxExcluded)}
                    />

                    <TouchableOpacity onPress={() => setPricingModalVisible(true)}>
                        <Text className="text-[#22C55E] text-sm mt-2">
                            + Add more pricing details
                        </Text>
                    </TouchableOpacity>

                    {/* ---------- PRE LEASED ---------- */}
                    <Text className="text-[14px] font-bold text-[#00000099] mt-4 mb-2">
                        Is it Pre-leased/Pre-Rented?
                    </Text>
                    <View className="flex-row mb-4">
                        <PillButton
                            label="Yes"
                            selected={preLeased === "Yes"}
                            onPress={() => setPreLeased("Yes")}
                        />
                        <PillButton
                            label="No"
                            selected={preLeased === "No"}
                            onPress={() => setPreLeased("No")}
                        />
                    </View>
                    {preLeased === "Yes" && (
                        <View className="mb-4">
                            {/* Lease Duration */}

                            <TextInput
                                placeholder="Current rent per month"
                                value={leaseDuration}
                                onChangeText={setLeaseDuration}
                                onFocus={() => setFocusedField("leaseDuration")}
                                onBlur={() => setFocusedField(null)}
                                className="rounded-md p-3 mb-3"
                                style={{
                                    borderWidth: 1,
                                    borderColor: focusedField === "leaseDuration" ? "#22C55E" : "#0000001A",
                                    backgroundColor: "#D9D9D91C",
                                    height: 50,
                                }}
                            />

                            {/* Monthly Rent */}

                            <TextInput
                                placeholder=" Lease Tenure in years"
                                value={monthlyRent}
                                onChangeText={setMonthlyRent}
                                onFocus={() => setFocusedField("monthlyRent")}
                                onBlur={() => setFocusedField(null)}
                                keyboardType="numeric"
                                className="rounded-md p-3"
                                style={{
                                    borderWidth: 1,
                                    borderColor: focusedField === "monthlyRent" ? "#22C55E" : "#0000001A",
                                    backgroundColor: "#D9D9D91C",
                                    height: 50,
                                }}
                            />
                        </View>
                    )}


                    {/* ---------- FIRE NOC ---------- */}


                    {/* ---------- OCCUPANCY ---------- */}


                    {/* ---------- PREVIOUS USE ---------- */}

                    {/* ---------- DESCRIPTION ---------- */}
                    <Text className="mt-4 mb-2 font-bold text-[15px] text-[#00000099]">
                        Description <Text className="text-red-500">*</Text>
                    </Text>

                    <TextInput
                        placeholder="write here what makes your property unique."
                        value={describeProperty}
                        onChangeText={setDescribeProperty}
                        onFocus={() => setFocusedField("describeProperty")}
                        onBlur={() => setFocusedField(null)}
                        multiline
                        textAlignVertical="top"
                        className="rounded-md p-3"
                        style={{
                            borderWidth: 1,
                            borderColor: focusedField === "describeProperty" ? "#22C55E" : "#0000001A",
                            height: 108,
                        }}
                    />


                    {/* ---------- AMENITIES & LOCATION ---------- */}
                    <View
                        className="bg-white rounded-lg p-4 mt-4"
                        style={{ borderWidth: 1, borderColor: "#0000001A" }}
                    >
                        <Text className="text-[15px] font-bold text-[#00000099] mb-2">
                            Amenities
                        </Text>
                        <View className="flex-row flex-wrap mb-4">
                            {amenityOptions.map((a) => (
                                <PillButton
                                    key={a}
                                    label={a}
                                    selected={amenities.includes(a)}
                                    onPress={() =>
                                        toggleArrayItem(setAmenities, amenities, a)
                                    }
                                />
                            ))}
                        </View>
                         <Text className="text-[15px] font-bold text-[#00000099] mb-3">
                            Other Features
                        </Text>
                        <Checkbox
                        label="Wheelchair Friendly"
                        selected={wheelchairFriendly}
                        onPress={() => setWheelchairFriendly(!wheelchairFriendly)}
                    />
<Text className="text-[15px] font-bold text-[#00000099] mb-2 mt-3">Type of flooring</Text>
          <TouchableOpacity
            onPress={() => setVisible(visible === 'flooring' ? null : 'flooring')}
            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
          >
            <Text className="text-gray-800 text-left">{flooringType || "Select Flooring"}</Text>
            <Ionicons name="chevron-down" size={24} color="#888" />
          </TouchableOpacity>
          {visible === 'flooring' && (
  <View
    className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
    style={{ borderWidth: 1, borderColor: "#0000001A" }}
  >
    {[
      "Marble",
      "Concrete",
      "Ceramic",
      "Mosaic",
      "Cement",
      "Stone",
      "Vinyl",
      "Spartex",
      "IPS Finish",
      "Vitrified",
      "Wooden",
      "Granite",
      "Others",
    ].map((item) => (
      <TouchableOpacity
        key={item}
        onPress={() => {
          setFlooringType(item);
          setVisible(null);
        }}
        className={`p-4 border-b border-gray-200 ${
          flooringType === item ? "bg-green-500" : "bg-white"
        }`}
      >
        <Text
          className={`${
            flooringType === item ? "text-white" : "text-gray-800"
          }`}
        >
          {item}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
          )}
                        <Text className="text-[15px] font-bold text-[#00000099] mb-3">
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
                    </View>

                </View>

                {/* More Pricing Details Modal */}
                <MorePricingDetailsModal
                    visible={pricingModalVisible}
                    onClose={() => setPricingModalVisible(false)}
                />

            </ScrollView>
            <View className="bg-white border-t border-gray-200">
            <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-12">
                <TouchableOpacity
                    className="px-10 py-3 rounded-lg bg-gray-200 mx-3"
                    onPress={() => router.push("/home/screens/UploadScreens/CommercialUpload/Components/HospitalityVaastu")}
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
};

export default HospitalityNext;