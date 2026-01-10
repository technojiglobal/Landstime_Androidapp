

// Frontend/app/home/screens/Resorts/(Property)/index.jsx
import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import TopAlert from "../../../../../components/TopAlert";
import VastuModal from "../../../../../components/VastuModal";
import { getPropertyById } from "../../../../../utils/propertyApi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import i18n from "../../../../../i18n/index";

// ✅ Helper function OUTSIDE component
const getLocalizedText = (field, language) => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[language] || field.en || field.te || field.hi || '';
};

export default function OverviewScreen() {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams();
  const [showAlert, setShowAlert] = useState(false);
  const [showVastuModal, setShowVastuModal] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Get current language
  const currentLanguage = i18n.language || 'en';

  // ✅ Fetch property on mount and when propertyId or language changes
  useEffect(() => {
    console.log('🔄 Effect triggered - propertyId:', propertyId, 'language:', i18n.language);
    if (propertyId) {
      fetchPropertyDetails();
    } else {
      console.error('❌ No propertyId available');
      setLoading(false);
    }
  }, [propertyId, i18n.language]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const currentLang = i18n.language || 'en';
      console.log('🔍 Fetching property:', propertyId);
      console.log('🌐 Current language:', currentLang);
      
      const response = await getPropertyById(propertyId, currentLang);
      
      if (response.success) {
        console.log('✅ Property fetched:', response.data);
        setProperty(response.data.data);
      } else {
        console.error('❌ Failed to fetch property:', response.error);
      }
    } catch (error) {
      console.error('❌ Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrochurePress = () => setShowAlert(true);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={{ marginTop: 16, color: '#6B7280', fontFamily: 'Poppins' }}>
          Loading property details...
        </Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text style={{ marginTop: 16, color: '#6B7280', fontFamily: 'Poppins' }}>
          Property not found
        </Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ marginTop: 16, backgroundColor: '#22C55E', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
        >
          <Text style={{ color: 'white', fontFamily: 'Poppins' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ Get resort-specific details
  const resortDetails = property.resortDetails || {};
  
  // ✅ Prepare stats for Resort
  const stats = [
    { 
      label: "Land Area", 
      value: resortDetails.landArea 
        ? `${resortDetails.landArea} acres` 
        : "N/A" 
    },
    { 
      label: "Build Area", 
      value: resortDetails.buildArea 
        ? `${resortDetails.buildArea} acres` 
        : "N/A" 
    },
    { 
      label: "Rooms", 
      value: resortDetails.rooms || 0 
    },
    { 
      label: "Floors", 
      value: resortDetails.floors || 0 
    },
  ];

  return (
    <View className="flex-1 bg-white relative">
      {(showAlert) && (
        <View
          className="absolute inset-0 bg-black/40"
          style={{ zIndex: 10 }}
          pointerEvents={"auto"}
        />
      )}
      {(showVastuModal) && (
        <View
          className="absolute inset-0 bg-black/40"
          pointerEvents={"auto"}
        />
      )}

      <ScrollView
        className="flex-1 bg-white"
        scrollEnabled={!showAlert && !showVastuModal}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 90,
        }}
      >
        {/* Resort Image */}
        <View className="items-center relative">
          <View className="relative">
           <Image
  source={
    property.images && property.images.length > 0
      ? { uri: property.images[0] }  // ✅ CHANGED: Removed IP address prefix for base64
      : require("../../../../../assets/resort.jpg")
  }
  className="rounded-[17px]"
  style={{ height: 223, width: 330, resizeMode: "cover" }}
/>
            <View
              className="absolute bg-white rounded-full p-1"
              style={{
                bottom: 10,
                right: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.5,
                elevation: 2,
              }}
            >
              <Image
                source={require("../../../../../assets/tick-icon.png")}
                style={{ width: 13, height: 13, resizeMode: "contain" }}
              />
            </View>
          </View>
        </View>

        {/* Property Info */}
        <View className="px-5 mt-5">
          {/* Name + Location + Rating */}
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-[20px] text-green-500 font-semibold" style={{ fontFamily: "Poppins", fontWeight: "bold" }}>
                {getLocalizedText(property.propertyTitle, currentLanguage) || 'Resort'}
              </Text>
              <View className="flex-row items-center mt-1">
                <Image
                  source={require("../../../../../assets/location-icon.png")}
                  style={{ width: 12, height: 12, resizeMode: "contain" }}
                />
                <Text className="text-[12px] text-[#72707090] ml-1" style={{ fontFamily: "Poppins" }}>
                  {getLocalizedText(property.location, currentLanguage) || 'Location'}
                </Text>
              </View>
            </View>

            <View className="items-end">
              <View className="flex-row items-center mb-1">
                <Ionicons name="star" size={14} color="#FF9500" />
                <Text className="text-[12px] ml-1 text-[#9CA3AF]" style={{ fontFamily: "Poppins" }}>
                  4.3
                </Text>
              </View>

              <TouchableOpacity
                className="bg-[#22C55E]/10 px-2 py-1 rounded-md"
                onPress={() => router.push("/home/screens/Resorts/Vrview")}
              >
                <Text className="text-[#22C55E] text-[10px]" style={{ fontFamily: "Poppins" }}>
                  VR View
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Price + Vaastu */}
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-[24px] font-semibold text-[#22C55E]" style={{ fontFamily: "Poppins" }}>
              ₹ {property.expectedPrice ? property.expectedPrice.toLocaleString('en-IN') : '0'}
            </Text>

            <TouchableOpacity
              onPress={() => setShowVastuModal(true)}
              className="flex-row items-center px-2 py-[2px] rounded-md"
              style={{ borderWidth: 0.5, borderColor: "#FFA50066" }}
            >
              <Image
                source={require("../../../../../assets/vastu.png")}
                style={{ width: 12, height: 12, resizeMode: "contain" }}
              />
              <Text className="ml-1 text-[12px] font-bold text-[#FFA500]" style={{ fontFamily: "Poppins" }}>
                View Vaastu
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="flex-row justify-between mt-5">
            {stats.map((item, idx) => (
              <View key={idx} className="items-center">
                <Text className="text-[14px] font-semibold" style={{ fontFamily: "Poppins" }}>
                  {item.value}
                </Text>
                <Text className="text-[12px] text-[#00000091]" style={{ fontFamily: "Poppins" }}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Resort Type */}
          {resortDetails.resortType && (
            <View className="mt-4">
              <Text className="text-[16px] font-semibold mb-1" style={{ fontFamily: "Poppins" }}>
                Resort Type
              </Text>
              <Text className="text-[14px] text-[#00000091]" style={{ fontFamily: "Poppins" }}>
                {resortDetails.resortType}
              </Text>
            </View>
          )}

          {/* Description */}
          <View className="mt-6">
            <Text className="text-[20px] font-semibold mb-1" style={{ fontFamily: "Poppins" }}>
              Description
            </Text>
            <Text className="text-[14px] text-[#00000091]" style={{ fontFamily: "Poppins" }}>
              {getLocalizedText(property.description, currentLanguage) || 'No description available'}
            </Text>
          </View>

          {/* Location Advantages */}
          {resortDetails.locationAdvantages && resortDetails.locationAdvantages.length > 0 && (
            <View className="mt-6">
              <Text className="text-[16px] font-semibold mb-2" style={{ fontFamily: "Poppins" }}>
                Location Advantages
              </Text>
              <View className="flex-row flex-wrap">
                {resortDetails.locationAdvantages.map((advantage, idx) => (
                  <View 
                    key={idx} 
                    className="bg-green-50 px-3 py-1 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-[12px] text-green-700" style={{ fontFamily: "Poppins" }}>
                      {advantage}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Buttons */}
          <View className="flex-row justify-between mt-8 mb-10">
            <TouchableOpacity
              onPress={handleBrochurePress}
              className="flex-1 border border-[#22C55E] py-3 rounded-[12px] mr-3 items-center flex-row justify-center"
              activeOpacity={0.8}
            >
              <Text className="text-[#22C55E] text-[14px]" style={{ fontFamily: "Poppins" }}>
                Brochure
              </Text>
              <Feather name="download" size={16} color="#22C55E" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-[#22C55E] py-3 rounded-[12px] items-center justify-center"
              activeOpacity={0.8}
              onPress={() => router.push("/home/screens/ContactForm")}
            >
              <Text className="text-white text-[14px]" style={{ fontFamily: "Poppins" }}>
                Contact Agent
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Alerts / Modals */}
      <TopAlert visible={showAlert} onHide={() => setShowAlert(false)} />
      <VastuModal visible={showVastuModal} onClose={() => setShowVastuModal(false)} />
    </View>
  );
}