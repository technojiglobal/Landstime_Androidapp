

// Frontend/app/home/screens/Resorts/(Property)/index.jsx
import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import TopAlert from "../../../../../components/TopAlert";
import VastuModal from "../../../../../components/VastuModal";
import { getPropertyById } from "../../../../../utils/propertyApi";
import { getUserProfile } from "../../../../../utils/api";
import { checkViewAccess } from "../../../../../utils/propertyViewApi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import i18n from "../../../../../i18n/index";
import { Alert } from "react-native";
import { fetchReviews } from "../../../../../utils/reviewApi";
// ADD THIS IMPORT
import { getImageUrl } from "../../../../../utils/imageHelper";
import { FlatList, Dimensions } from "react-native";
// ✅ Helper: Strip phone number
const stripPhone = (phoneNum) => {
  if (!phoneNum) return '';
  return phoneNum.replace(/[\s\-\+]/g, '').replace(/^91/, '');
};

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
  const [reviewSummary, setReviewSummary] = useState({ avgRating: 0, count: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
   useEffect(() => {
    if (propertyId) {
      fetchReviews('property', propertyId).then((res) => {
        setReviewSummary({
          avgRating: res.avgRating || 0,
          count: res.count || 0,
        });
      }).catch(err => {
        console.error('Failed to fetch reviews:', err);
      });
    }
  }, [propertyId]);
  

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
 

  // ✅ NEW: Handle Contact Agent button press
  const handleContactAgent = async () => {
    try {
      if (!property || !property._id) {
        Alert.alert('Error', 'Property information not available');
        return;
      }

      console.log('🔍 Checking if property already viewed:', property._id);

      // Get user profile to check viewedProperties
      const userResult = await getUserProfile();

      if (!userResult.success) {
        console.log('❌ Failed to get user profile, going to ContactForm');
        router.push({
          pathname: "/home/screens/ContactForm",
          params: {
            propertyId: property._id,
            areaKey: property.areaKey
          }
        });
        return;
      }

      const userData = userResult.data.data;
      const viewedProperties = userData.currentSubscription?.viewedProperties || [];

      // Check if already viewed
      if (viewedProperties.includes(property._id)) {
        console.log('✅ Property already viewed - checking access for direct navigation');

        // Get user name
        let userName = '';
        if (typeof userData.name === 'string') {
          userName = userData.name;
        } else if (userData.name && typeof userData.name === 'object') {
          userName = userData.name.en || userData.name.te || userData.name.hi || '';
        }

        // Get access (will return owner details since already viewed)
        const accessCheck = await checkViewAccess(
          property._id,
          userName,
          stripPhone(userData.phone)
        );

        if (accessCheck.success && accessCheck.data.alreadyViewed) {
          console.log('✅ Navigating directly to ViewContact');

          // Navigate directly to ViewContact
          router.push({
            pathname: '/home/screens/ViewContact',
            params: {
              ownerDetails: JSON.stringify(accessCheck.data.ownerDetails),
              quota: JSON.stringify(accessCheck.data.quota),
              alreadyViewed: 'true',
              areaKey: property.areaKey,
              propertyId: property._id
            }
          });
          return;
        }
      }

      // Not viewed yet - go to ContactForm
      console.log('📝 Property not viewed yet - going to ContactForm');
      router.push({
        pathname: "/home/screens/ContactForm",
        params: {
          propertyId: property._id,
          areaKey: property.areaKey
        }
      });

    } catch (error) {
      console.error('❌ handleContactAgent error:', error);
      // On error, fallback to ContactForm
      router.push({
        pathname: "/home/screens/ContactForm",
        params: {
          propertyId: property._id,
          areaKey: property.areaKey
        }
      });
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
      {/* Property Images */}
<View className="items-center relative">
  {property.images && property.images.length > 0 ? (
    <FlatList
      data={property.images}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      snapToInterval={350}
      decelerationRate="fast"
      snapToAlignment="start"
      contentContainerStyle={{ paddingHorizontal: 10 }}
      onMomentumScrollEnd={(event) => {
        const index = Math.round(
          event.nativeEvent.contentOffset.x / 350
        );
        setCurrentImageIndex(index);
      }}
      keyExtractor={(item, index) => `image-${index}`}
     renderItem={({ item }) => (
  <View className="relative" style={{ width: 330, marginHorizontal: 10 }}>
    <Image
      source={{ uri: getImageUrl(item) }}
      className="rounded-[17px]"
      style={{ height: 223, width: 330, resizeMode: "cover" }}
    />
    {/* ✅ Only show tick if isVerified is true */}
    {property.isVerified && (
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
    )}
  </View>
)}
    />
  ) : (
    <View className="relative">
      <Image
        source={require("../../../../../assets/CommercialHub.jpg")}
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
  )}
  {/* Image Indicators */}
  {property.images && property.images.length > 1 && (
    <View className="flex-row justify-center mt-2">
      {property.images.map((_, index) => (
        <View
          key={index}
          className="rounded-full mx-1"
          style={{
            width: 6,
            height: 6,
            backgroundColor: currentImageIndex === index ? '#22C55E' : '#D1D5DB'
          }}
        />
      ))}
    </View>
  )}
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

  <View className="flex-row items-center mb-1">
    <Ionicons name="star" size={14} color="#FF9500" />
    <Text className="text-[12px] ml-1 text-[#9CA3AF]" style={{ fontFamily: "Poppins" }}>
      {reviewSummary.avgRating.toFixed(1)} ({reviewSummary.count})
    </Text>
  </View>
</View>

{/* ✅ Verified Badge - Right aligned (above View Vaastu) */}
{property.isVerified && (
  <View className="flex-row justify-end mt-2">
    <View style={{ 
      backgroundColor: "#22C55E", 
      paddingHorizontal: 8, 
      paddingVertical: 3, 
      borderRadius: 4,
    }}>
      <Text style={{ 
        color: "white", 
        fontSize: 10, 
        fontFamily: "Poppins-Medium",
        fontWeight: "600"
      }}>
        ✓ Verified
      </Text>
    </View>
  </View>
)}

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

          

          {/* Description */}
          <View className="mt-6">
            <Text className="text-[20px] font-semibold mb-1" style={{ fontFamily: "Poppins" }}>
              Description
            </Text>
            <Text className="text-[14px] text-[#00000091]" style={{ fontFamily: "Poppins" }}>
              {getLocalizedText(property.description, currentLanguage) || 'No description available'}
            </Text>
          </View>

      

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
              onPress={handleContactAgent}
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
     <VastuModal 
  visible={showVastuModal}
  onClose={() => setShowVastuModal(false)}
  propertyType={property?.propertyType}
  vastuDetails={property?.resortDetails?.vaasthuDetails}
/>
    </View>
  );
}