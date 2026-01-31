

// Frontend/app/home/screens/ViewContact.jsx (for reference)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import SimilarProperties from '../../../components/SimilarProperties';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Property images
const propertyImage = require('../../../assets/land.jpg');
const propertyImage2 = require('../../../assets/land.jpg');

export default function ViewContactScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [propertyId, setPropertyId] = useState(null);

  
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [quota, setQuota] = useState(null);
  const [alreadyViewed, setAlreadyViewed] = useState(false);
  const [loading, setLoading] = useState(true);
  

  
 useEffect(() => {
    try {
      // Parse owner details
      if (params.ownerDetails) {
        const parsedOwner = JSON.parse(params.ownerDetails);
        setOwnerDetails(parsedOwner);
      }
      
      // Parse quota
      if (params.quota) {
        const parsedQuota = JSON.parse(params.quota);
        setQuota(parsedQuota);
      }
      
      // Parse already viewed flag
      if (params.alreadyViewed) {
        setAlreadyViewed(params.alreadyViewed === 'true');
      }

      if (params.propertyId) {
      setPropertyId(params.propertyId);
    }


      
      setLoading(false);
    } catch (error) {
      console.error('❌ Parse error:', error);
      Alert.alert('Error', 'Failed to load contact details');
      router.back();
    }
  }, [params]);
  
  // Handle phone call
  const callNumber = (phone) => {
    if (!phone) {
      Alert.alert('Error', 'Phone number not available');
      return;
    }
    
    const phoneNumber = phone.replace(/[^0-9]/g, '');
    Linking.openURL(`tel:${phoneNumber}`).catch(err => {
      console.error('Call error:', err);
      Alert.alert('Error', 'Unable to make call');
    });
  };
  
  // Handle WhatsApp
  const openWhatsApp = (phone) => {
    if (!phone) {
      Alert.alert('Error', 'Phone number not available');
      return;
    }
    
    const numeric = phone.replace(/[^\d]/g, '');
    const message = 'Hi, I found your property on LandsTime and I\'m interested to know more details.';
    const url = `https://wa.me/${numeric}?text=${encodeURIComponent(message)}`;
    
    Linking.openURL(url).catch(err => {
      console.error('WhatsApp error:', err);
      Alert.alert('Error', 'WhatsApp not installed');
    });
  };
  
  if (loading || !ownerDetails || !quota) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22C55E" />
          <Text className="mt-4 text-gray-600">Loading contact details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Get owner initials
  const getInitials = (name) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Section */}
      <View className="flex-row items-start px-4 mt-7 py-3">
        <TouchableOpacity onPress={() => {
  if (propertyId) {
    router.push({
      pathname: '/home/screens/Sites/(Property)',
      params: { 
        propertyId: propertyId,
        areaKey: params.areaKey 
      }
    });
  } else {
    router.back();
  }
}}>
  <Ionicons name="chevron-back-outline" size={22} color="black" />
</TouchableOpacity>
        
        <View className="ml-3 flex-1 mt-9">
          {/* Success Badge */}
          <View className="mt-2 flex-row items-center">
            <View className="w-5 h-5 rounded-full bg-green-500 items-center justify-center">
              <Ionicons name="checkmark" size={12} color="#fff" />
            </View>
            <Text className="text-sm mx-3 text-gray-700">
              {alreadyViewed 
                ? 'You have already viewed this contact' 
                : 'Man, you can use these contact details to contact the Owner'}
            </Text>
          </View>
          
          {/* Quota Information */}
          {quota && (
            <View className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-semibold text-gray-700">
                  {quota.planName} Plan
                </Text>
                <Text className="text-xs text-gray-500">
                  {quota.remainingViews} of {quota.totalViews} remaining
                </Text>
              </View>
              
              {/* Progress Bar */}
              <View className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <View 
                  className="h-full bg-green-500"
                  style={{ 
                    width: `${(quota.remainingViews / quota.totalViews) * 100}%` 
                  }}
                />
              </View>
              
              {/* Low quota warning */}
              {quota.remainingViews < 3 && quota.remainingViews > 0 && (
                <TouchableOpacity
                  className="mt-2 bg-yellow-500 py-1.5 px-3 rounded-md"
                  onPress={() => router.push('/home/screens/PlanScreen')}
                  activeOpacity={0.8}
                >
                  <Text className="text-white text-center font-semibold text-xs">
                    Low on views? Upgrade Now
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Card */}
        <View className="mx-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          {/* Avatar & Name */}
          <View className="flex-row">  
            <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center">
              <Text className="text-green-600 font-semibold text-sm">
                {getInitials(ownerDetails.name)}
              </Text>
            </View>

            {/* Details */}
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-gray-900">
                {ownerDetails.name || 'Property Owner'}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                {ownerDetails.email || 'No email provided'}
              </Text>
            </View>
          </View>
          
          {/* Contact Actions */}
          <View className="flex-row items-center mt-3 ml-9">
            {/* Phone */}
            <TouchableOpacity
              onPress={() => callNumber(ownerDetails.phone)}
              className="flex-row items-center mr-6"
            >
              <View className="p-2 rounded-full bg-blue-100">
                <Ionicons name="call" size={16} color="#2563EB" />
              </View>
              <Text className="ml-2 text-sm text-gray-700">
                {ownerDetails.phone?.replace(/[^0-9]/g, '').replace(/^91/, '') || 'N/A'}
              </Text>
            </TouchableOpacity>

            {/* WhatsApp */}
            <TouchableOpacity
              onPress={() => openWhatsApp(ownerDetails.phone)}
              className="flex-row items-center"
            >
              <View className="p-2 rounded-full bg-green-100 ml-14">
                <FontAwesome name="whatsapp" size={16} color="#16A34A" />
              </View>
              <Text className="ml-2 text-sm text-gray-700">Chat</Text>
            </TouchableOpacity>
          </View>
          
          {/* Company Info (if available) */}
          {ownerDetails.company && ownerDetails.company !== 'N/A' && (
            <View className="mt-3 pt-3 border-t border-gray-100">
              <View className="flex-row items-center">
                <Ionicons name="business" size={16} color="#6B7280" />
                <Text className="ml-2 text-sm text-gray-600">
                  Company: {ownerDetails.company}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Similar Properties Component */}
<SimilarProperties 
  propertyId={propertyId}
  currentPropertyType={params.propertyType || 'House'}
/>
        
        {/* Bottom spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}