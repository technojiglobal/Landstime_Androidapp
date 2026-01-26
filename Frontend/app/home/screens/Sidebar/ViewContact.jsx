// Frontend/app/home/screens/Sidebar/ViewContact.jsx (Interior Design Version)

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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Placeholder images for similar designs
const designImage = require('../../../../assets/land.jpg'); // Replace with actual design images

export default function ViewContactScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [designId, setDesignId] = useState(null);
  const [designTitle, setDesignTitle] = useState('');
  const [designerDetails, setDesignerDetails] = useState(null);
  const [alreadyViewed, setAlreadyViewed] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Similar designs (can be fetched from API later)
  const similarDesigns = [
    { id: '1', title: 'Modern Living Room', price: '₹2L - ₹5L', image: designImage },
    { id: '2', title: 'Cozy Bedroom', price: '₹1.5L - ₹3L', image: designImage },
  ];
  
  useEffect(() => {
    try {
      // Parse designer details
      if (params.designerDetails) {
        const parsedDesigner = JSON.parse(params.designerDetails);
        setDesignerDetails(parsedDesigner);
      }
      
      // Parse already viewed flag
      if (params.alreadyViewed) {
        setAlreadyViewed(params.alreadyViewed === 'true');
      }

      if (params.designId) {
        setDesignId(params.designId);
      }

      if (params.designTitle) {
        setDesignTitle(params.designTitle);
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
    const message = 'Hi, I found your interior design on LandsTime and I\'m interested to know more details.';
    const url = `https://wa.me/${numeric}?text=${encodeURIComponent(message)}`;
    
    Linking.openURL(url).catch(err => {
      console.error('WhatsApp error:', err);
      Alert.alert('Error', 'WhatsApp not installed');
    });
  };
  
  if (loading || !designerDetails) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22C55E" />
          <Text className="mt-4 text-gray-600">Loading contact details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Get designer initials
  const getInitials = (name) => {
    if (!name) return 'DS';
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
          if (designId) {
            router.push({
              pathname: '/home/screens/Sidebar/RoomOverview',
              params: { id: designId }
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
                : 'Great! You can now contact the Designer'}
            </Text>
          </View>
          
          {/* FREE Info Badge */}
          <View className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                <Text className="ml-2 text-sm font-semibold text-green-700">
                  100% FREE
                </Text>
              </View>
              <Text className="text-xs text-green-600">
                No subscription required
              </Text>
            </View>
            <Text className="text-xs text-green-600 mt-1">
              View unlimited interior design contacts for free!
            </Text>
          </View>
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
                {getInitials(designerDetails.name)}
              </Text>
            </View>

            {/* Details */}
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-gray-900">
                {designerDetails.name || 'Interior Designer'}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Interior Designer
              </Text>
            </View>
          </View>
          
          {/* Contact Actions */}
          <View className="flex-row items-center mt-3 ml-9">
            {/* Phone */}
            <TouchableOpacity
              onPress={() => callNumber(designerDetails.phone)}
              className="flex-row items-center mr-6"
            >
              <View className="p-2 rounded-full bg-blue-100">
                <Ionicons name="call" size={16} color="#2563EB" />
              </View>
              <Text className="ml-2 text-sm text-gray-700">
                {designerDetails.phone?.replace(/[^0-9]/g, '').replace(/^91/, '') || 'N/A'}
              </Text>
            </TouchableOpacity>

            {/* WhatsApp */}
            <TouchableOpacity
              onPress={() => openWhatsApp(designerDetails.phone)}
              className="flex-row items-center"
            >
              <View className="p-2 rounded-full bg-green-100 ml-14">
                <FontAwesome name="whatsapp" size={16} color="#16A34A" />
              </View>
              <Text className="ml-2 text-sm text-gray-700">Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Design Title (if available) */}
        {designTitle && (
          <View className="mx-4 mt-4 bg-gray-50 rounded-lg p-3">
            <Text className="text-xs text-gray-500">Design Viewed:</Text>
            <Text className="text-sm font-medium text-gray-800 mt-1">
              {designTitle}
            </Text>
          </View>
        )}

        {/* Similar Designs Section */}
        <View className="px-4 mt-6">
          <Text className="text-[15px] font-semibold text-gray-900">
            Similar Designs
          </Text>
        </View>

        {/* Scrollable Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
          contentContainerStyle={{ paddingHorizontal: 16 }}
          snapToInterval={SCREEN_WIDTH * 0.7 + 14}
          decelerationRate="fast"
        >
          {similarDesigns.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-xl h-72 mr-4 shadow-md overflow-hidden"
              style={{ width: SCREEN_WIDTH * 0.7 }}
            >
              {/* Design Image */}
              <View className="w-full aspect-video relative">
                <Image
                  source={item.image}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute w-28 h-8 bottom-2 left-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                  <Text className="text-xs font-semibold text-gray-800 justify-center item-center">
                    {item.price}
                  </Text>
                </View>
              </View>

              <View className="p-3">
                <Text className="font-semibold text-sm text-gray-900">
                  {item.title}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  In Visakhapatnam · by {designerDetails.name}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
        
        {/* Info Section */}
        <View className="mx-4 mt-6 mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <View className="flex-row items-center">
            <Ionicons name="information-circle" size={20} color="#2563EB" />
            <Text className="ml-2 text-sm font-semibold text-blue-700">
              Why is this FREE?
            </Text>
          </View>
          <Text className="text-xs text-blue-600 mt-2">
            Interior design contact viewing is completely free for all users. We believe in connecting homeowners with talented designers without barriers.
          </Text>
        </View>
        
        {/* Bottom spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}