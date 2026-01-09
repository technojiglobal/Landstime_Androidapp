//CommercialUpload///Components//StorageNext.jsx (jahnavi)

import React, { useState,useEffect,useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
 
 const Checkbox = ({ label, selected, onPress }) => (
   <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
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
     <Text style={{ fontSize: 11, color: '#00000099' }}>{label}</Text>
   </TouchableOpacity>
 );
const StorageNext = () => {
    
 const router = useRouter();
    const params = useLocalSearchParams();



    /* ---------------- PRICE STATES ---------------- */
    const ownershipOptions = ['Freehold', 'Leasehold', 'Company Owned', 'Other'];
    const [ownership, setOwnership] = useState('');
    const [expectedPrice, setExpectedPrice] = useState("");
    const [allInclusive, setAllInclusive] = useState(false);
    const [priceNegotiable, setPriceNegotiable] = useState(false);
    const [taxExcluded, setTaxExcluded] = useState(false);
    const [IndustryApprovedBy, setIndustryApprovedBy] = useState("");
    const [approvedIndustryType, setApprovedIndustryType] = useState("");
    const authorityOptions = ['Local Authority',];
    /* ---------------- YES / NO STATES ---------------- */
    const [preLeased, setPreLeased] = useState(null);
    const [nocCertified, setNocCertified] = useState(null);
    const [occupancyCertified, setOccupancyCertified] = useState(null);

    /* ---------------- PREVIOUS USE ---------------- */
    const [visible, setVisible] = useState(null);

    const prevUsedForOptions = ["Commercial", "Residential", "Warehouse"];

    /* ---------------- DESCRIPTION ---------------- */
    const [describeProperty, setDescribeProperty] = useState("");
    const [focusedField, setFocusedField] = useState(null);
    const [pricingModalVisible, setPricingModalVisible] = useState(false);

    /* ---------------- AMENITIES ---------------- */
    const amenityOptions = [

        "+Water Storage",
        "+currently Air Conditioned",
        "+Vaastu Complex",
        "+Security fire Alarm",
        "+Visitor Parking",
    ];
   const [amenities, setAmenities] = useState([]);

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
    const [locAdvantages, setLocAdvantages] = useState([]);

   // ✅ ADD THIS: Debug logging for state changes
useEffect(() => {
  console.log('🔍 StorageNext state:', {
    amenities: amenities.length,
    locAdvantages: locAdvantages.length,
    amenitiesValues: amenities,
    locAdvantagesValues: locAdvantages,
  });
}, [amenities, locAdvantages]);


    /* ---------------- LOCATION ADVANTAGES ---------------- */
   
    
    const [leaseDuration, setLeaseDuration] = useState("");
    const [monthlyRent, setMonthlyRent] = useState("");

    /* ---------------- MODAL AND FOCUS STATES ---------------- */
   

    // ✅ NOW parse params AFTER all state is declared
    const images = useMemo(() => {
      try {
        if (!params.images) return [];
        if (typeof params.images === 'string') return JSON.parse(params.images);
        if (Array.isArray(params.images)) return params.images;
        return [];
      } catch (e) {
        console.error('❌ Error parsing images:', e);
        return [];
      }
    }, [params.images]);

    const commercialDetails = useMemo(() => {
      try {
        if (!params.commercialDetails) return null;
        if (typeof params.commercialDetails === 'object') return params.commercialDetails;
        return JSON.parse(params.commercialDetails);
      } catch (e) {
        console.error('❌ Error parsing commercialDetails:', e);
        return null;
      }
    }, [params.commercialDetails]);

// ✅ Load draft from AsyncStorage
// ✅ Load draft from AsyncStorage
useEffect(() => {
  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem('draft_storage_pricing');
      if (draft) {
        const savedData = JSON.parse(draft);
        console.log('📦 Loading Storage pricing draft from AsyncStorage');
        
        setOwnership(savedData.ownership || '');
        setExpectedPrice(savedData.expectedPrice?.toString() || '');
        setAllInclusive(savedData.allInclusive || false);
        setPriceNegotiable(savedData.priceNegotiable || false);
        setTaxExcluded(savedData.taxExcluded || false);
        setIndustryApprovedBy(savedData.IndustryApprovedBy || '');
        setApprovedIndustryType(savedData.approvedIndustryType || '');
        setPreLeased(savedData.preLeased || null);
        setLeaseDuration(savedData.leaseDuration || '');
        setMonthlyRent(savedData.monthlyRent?.toString() || '');
        setDescribeProperty(savedData.describeProperty || '');
        
        // ✅ FIX: Properly restore arrays with validation
        if (Array.isArray(savedData.amenities)) {
          setAmenities(savedData.amenities);
          console.log('✅ Amenities restored from draft:', savedData.amenities.length);
        }
        if (Array.isArray(savedData.locAdvantages)) {
          setLocAdvantages(savedData.locAdvantages);
          console.log('✅ Location advantages restored from draft:', savedData.locAdvantages.length);
        }
        
        console.log('✅ Storage pricing draft loaded');
        return;
      
      }
    } catch (e) {
      console.log('⚠️ Failed to load Storage pricing draft:', e);
    }

    // Fallback to params
  // Fallback to params
    if (commercialDetails?.storageDetails) {
      const storage = commercialDetails.storageDetails;
      console.log('🔄 Restoring from params:', {
        hasAmenities: !!storage.amenities,
        hasLocationAdvantages: !!storage.locationAdvantages,
        hasLocAdvantages: !!storage.locAdvantages,
      });
      
      setOwnership(storage.ownership || '');
      setExpectedPrice(storage.expectedPrice?.toString() || '');
      setAllInclusive(storage.priceDetails?.allInclusive || false);
      setPriceNegotiable(storage.priceDetails?.negotiable || false);
      setTaxExcluded(storage.priceDetails?.taxExcluded || false);
      setIndustryApprovedBy(storage.authority || '');
      setApprovedIndustryType(storage.approvedIndustryType || '');
      setPreLeased(storage.preLeased || null);
      setLeaseDuration(storage.leaseDuration || '');
      setMonthlyRent(storage.monthlyRent?.toString() || '');
      setDescribeProperty(storage.description || '');
      
      // ✅ FIX: Check both possible field names with proper validation
      const restoredAmenities = storage.amenities || [];
      const restoredLocAdvantages = storage.locationAdvantages || 
                                    storage.locAdvantages || [];
      
      if (Array.isArray(restoredAmenities) && restoredAmenities.length > 0) {
        setAmenities(restoredAmenities);
        console.log('✅ Amenities from params:', restoredAmenities);
      }
      
      if (Array.isArray(restoredLocAdvantages) && restoredLocAdvantages.length > 0) {
        setLocAdvantages(restoredLocAdvantages);
        console.log('✅ Location advantages from params:', restoredLocAdvantages);
      }
    }
  };

  loadDraft();
}, [commercialDetails]);

// ✅ Auto-save pricing draft
useEffect(() => {
  const saveDraft = async () => {
    const pricingDraft = {
      ownership,
      expectedPrice,
      allInclusive,
      priceNegotiable,
      taxExcluded,
      IndustryApprovedBy,
      approvedIndustryType,
      preLeased,
      leaseDuration,
      monthlyRent,
      describeProperty,
      amenities,
      locAdvantages,
      timestamp: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem('draft_storage_pricing', JSON.stringify(pricingDraft));
      console.log('💾 Storage pricing draft auto-saved');
    } catch (e) {
      console.log('⚠️ Failed to save Storage pricing draft:', e);
    }
  };

  const timer = setTimeout(saveDraft, 1000);
  return () => clearTimeout(timer);
}, [ownership, expectedPrice, allInclusive, priceNegotiable, taxExcluded,
    IndustryApprovedBy, approvedIndustryType, preLeased, leaseDuration,
    monthlyRent, describeProperty, amenities, locAdvantages]);

  

    /* ---------------- HELPERS ---------------- */
    const toggleArrayItem = (setter, array, value) => {
        if (array.includes(value)) {
            setter(array.filter((item) => item !== value));
        } else {
            setter([...array, value]);
        }
    };

const handleNext = () => {
  if (!commercialDetails) {
    Toast.show({ type: "error", text1: "Storage details missing" });
    return;
  }

  if (!expectedPrice.trim()) {
    Toast.show({ type: "error", text1: "Expected price required" });
    return;
  }

  if (!describeProperty.trim()) {
    Toast.show({ type: "error", text1: "Description required" });
    return;
  }

  const updatedCommercialDetails = {
    ...commercialDetails,
    
    storageDetails: {
      ...commercialDetails.storageDetails, // ✅ Preserve previous fields
      
      expectedPrice: Number(expectedPrice),
      description: describeProperty,

      priceDetails: {
        allInclusive,
        negotiable: priceNegotiable,
        taxExcluded,
      },

      ownership,
      authority: IndustryApprovedBy,
      approvedIndustryType,

      preLeased,
      leaseDuration,
      monthlyRent: monthlyRent ? Number(monthlyRent) : null,

      amenities,
      locationAdvantages: locAdvantages,
    },
  };

router.push({
  pathname: "/home/screens/UploadScreens/CommercialUpload/Components/StorageVaastu",
  params: {
    commercialDetails: JSON.stringify(updatedCommercialDetails),
    images: JSON.stringify(images),
    area: params.area,
    propertyTitle: commercialDetails.storageDetails?.propertyTitle || params.propertyTitle,
  },
});
};



    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
                showsVerticalScrollIndicator={false}

            >
                <View className="flex-row items-center mt-7 mb-4">
                    <TouchableOpacity
  onPress={() => {
    const currentData = {
      ...commercialDetails?.storageDetails,
      expectedPrice: Number(expectedPrice) || undefined,
      priceDetails: { allInclusive, negotiable: priceNegotiable, taxExcluded },
      ownership,
      authority: IndustryApprovedBy,
      approvedIndustryType,
      preLeased,
      leaseDuration,
      monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
      description: describeProperty,
      amenities,
      locationAdvantages: locAdvantages,
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/Storage",
      params: {
        storageDetails: JSON.stringify(currentData),
        images: JSON.stringify(images),
        area: params.area,
        storageType: commercialDetails?.storageDetails?.storageType || params.storageType, // ✅ ADD THIS
        commercialBaseDetails: params.commercialBaseDetails,
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
                        Price Details <Text className="text-red-500">*</Text>
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
                        label="All inclusive price"
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
                        Describe your property <Text className="text-red-500">*</Text>
                    </Text>

                    <TextInput
                        placeholder="Share some details about your property like spacious rooms, well maintained facilities."
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
                            Location Advantages
                        </Text>
                        <View className="flex-row flex-wrap">
                            {locationAdvantages.map((a) => {
                                const isSelected = locAdvantages.includes(a);
                                return (
                                    <PillButton
                                        key={a}
                                        label={a}
                                        selected={isSelected}
                                        onPress={() => {
                                            console.log('🔄 Toggling location advantage:', a, 'Current:', isSelected);
                                            toggleArrayItem(setLocAdvantages, locAdvantages, a);
                                        }}
                                    />
                                );
                            })}
                        </View>
                    </View>
                    <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-3">
                       <TouchableOpacity
  className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
  onPress={() => {
    const currentData = {
      ...commercialDetails?.storageDetails,
      expectedPrice: Number(expectedPrice) || undefined,
      priceDetails: { allInclusive, negotiable: priceNegotiable, taxExcluded },
      ownership,
      authority: IndustryApprovedBy,
      approvedIndustryType,
      preLeased,
      leaseDuration,
      monthlyRent: monthlyRent ? Number(monthlyRent) : undefined,
      description: describeProperty,
      amenities,
      locationAdvantages: locAdvantages,
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/Storage",
      params: {
        storageDetails: JSON.stringify(currentData),
        images: JSON.stringify(images),
        area: params.area,
        storageType: commercialDetails?.storageDetails?.storageType || params.storageType, // ✅ ADD THIS
        commercialBaseDetails: params.commercialBaseDetails,
      },
    });
  }}
>
                            <Text className="font-semibold">Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="px-5 py-3 rounded-lg bg-green-500"
                            onPress={handleNext}
                        >
                            <Text className="text-white font-semibold">Next</Text>
                        </TouchableOpacity>

                    </View>
                </View>

                {/* More Pricing Details Modal */}
                <MorePricingDetailsModal
                    visible={pricingModalVisible}
                    onClose={() => setPricingModalVisible(false)}
                />

            </ScrollView>
        </View>
    );
};

export default StorageNext;
