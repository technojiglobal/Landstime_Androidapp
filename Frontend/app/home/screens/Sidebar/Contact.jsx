// Frontend/app/home/screens/Sidebar/Contact.jsx (Interior Design Version)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '../../../../utils/api';
import { API_URL } from '../../../../utils/apiConfig';
import { checkDesignViewAccess, recordDesignView } from '../../../../utils/interiorDesignViewApi';

// Strip phone helper
const stripPhone = (phoneNum) => {
  if (!phoneNum) return '';
  return phoneNum.replace(/[\s\-\+]/g, '').replace(/^91/, '');
};

export default function ContactForm() {
  const router = useRouter();
  const { designId } = useLocalSearchParams();
  
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agent, setAgent] = useState('no');
  const [accepted, setAccepted] = useState(false);
  const [viewEnabled, setViewEnabled] = useState(false);
  
  // User and design state
  const [currentUser, setCurrentUser] = useState(null);
  const [design, setDesign] = useState(null);
  const [maskedPhone, setMaskedPhone] = useState('');
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [checkDone, setCheckDone] = useState(false); 

  // Early validation
  useEffect(() => {
    if (!designId) {
      console.error('❌ No designId in params');
      Alert.alert('Error', 'Design information missing');
      router.back();
    }
  }, [designId]);

  // Fetch user profile and design on mount
  useEffect(() => {
    fetchUserAndDesign();
  }, [designId]);

  // Check if already viewed (run only once after both loaded)
  useEffect(() => {
  if (currentUser && design && !checkDone) {
    checkAlreadyViewed();
    setCheckDone(true);  // ✅ Prevent re-checking
  }
}, [currentUser, design, checkDone]);

  // Verify credentials
  const verifyCredentials = () => {
    if (!currentUser) {
      return false;
    }
    
    const strippedInputPhone = stripPhone(phone);
    const strippedUserPhone = stripPhone(currentUser.phone);
    const phoneMatch = strippedInputPhone === strippedUserPhone;
    
    const inputName = name.toLowerCase().trim();
    const userName = (currentUser.name || '').toLowerCase().trim();
    const nameMatch = inputName === userName;
    
    console.log('🔐 Frontend verification:', {
      phoneMatch,
      nameMatch
    });
    
    return phoneMatch && nameMatch;
  };

  // Update button enable state
  //NEW CODE (inline verification to avoid function dependency):
useEffect(() => {
  if (!currentUser || loading) {
    setViewEnabled(false);
    return;
  }
  
  const fieldsValid = name && phone && agent && accepted;
  
  // ✅ Inline verification (instead of calling verifyCredentials())
  const strippedInputPhone = stripPhone(phone);
  const strippedUserPhone = stripPhone(currentUser.phone);
  const phoneMatch = strippedInputPhone === strippedUserPhone;
  
  const inputName = name.toLowerCase().trim();
  const userName = (currentUser.name || '').toLowerCase().trim();
  const nameMatch = inputName === userName;
  
  const credentialsMatch = phoneMatch && nameMatch;
  
  setViewEnabled(fieldsValid && credentialsMatch);
}, [name, phone, agent, accepted, currentUser, loading]);  // ✅ Add all dependencies

  // Check if already viewed
  const checkAlreadyViewed = async () => {
    if (!currentUser || !design || !designId) {
      return;
    }
    
    console.log('🔍 Checking if design already viewed...');
    
    try {
      const accessCheck = await checkDesignViewAccess(
        designId,
        currentUser.name,
        stripPhone(currentUser.phone)
      );
      
      if (accessCheck.success && accessCheck.alreadyViewed) {
        console.log('✅ Design already viewed - auto-navigating to ViewContact');
        
        router.replace({
          pathname: '/home/screens/Sidebar/ViewContact',
          params: {
            designerDetails: JSON.stringify(accessCheck.designerDetails),
            alreadyViewed: 'true',
            designId: designId,
            designTitle: design.name
          }
        });
      }
    } catch (error) {
      console.error('❌ Check already viewed error:', error);
    }
  };

  // Fetch user and design
  const fetchUserAndDesign = async () => {
    try {
      setLoading(true);
      console.log('🚀 Fetching user and design data...');
      
      // Get user profile
      const userResult = await getUserProfile();
      
      if (userResult.success) {
        const userData = userResult.data.data;
        console.log('✅ User profile loaded');
        
        // Extract name
        let userName = '';
        if (typeof userData.name === 'string') {
          userName = userData.name;
        } else if (userData.name && typeof userData.name === 'object') {
          userName = userData.name.en || userData.name.te || userData.name.hi || '';
        }
        
        setCurrentUser({
          name: userName,
          phone: userData.phone,
          email: userData.email
        });
        
        console.log('✅ User data set');
      } else {
        console.log('❌ getUserProfile failed:', userResult);
        Alert.alert('Error', 'Failed to load user profile');
        router.back();
        return;
      }
      
      // Get design details
      if (designId) {
        const response = await fetch(`${API_URL}/api/admin/interior/designs/${designId}`);
        const designResult = await response.json();
        
        if (designResult.success) {
          const designData = designResult.data;
          setDesign(designData);
          setMaskedPhone(maskPhoneNumber(designData.phone));
          
          console.log('✅ Design loaded:', designData.name);
        } else {
          Alert.alert('Error', 'Failed to load design details');
          router.back();
        }
      }
      
    } catch (error) {
      console.error('❌ fetchUserAndDesign ERROR:', error);
      Alert.alert('Error', 'Something went wrong');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // Mask phone number
  const maskPhoneNumber = (phoneNum) => {
    if (!phoneNum) return '';
    const stripped = stripPhone(phoneNum);
    if (stripped.length < 10) return phoneNum;
    return `+91-${stripped.substring(0, 2)}${'x'.repeat(stripped.length - 4)}${stripped.substring(stripped.length - 2)}`;
  };

  // Handle phone input
  const handlePhoneChange = (text) => {
    setPhone(text.replace(/[^0-9]/g, ''));
  };

  // Handle View Contact
  const handleViewContact = async () => {
    try {
      setVerifying(true);
      
      console.log('🔍 Checking access for design:', designId);
      
      // Step 1: Check access
      const accessCheck = await checkDesignViewAccess(
        designId,
        name,
        stripPhone(phone)
      );
      
      console.log('📥 Access check result:', accessCheck);
      
      if (!accessCheck.success) {
        if (accessCheck.reason === 'verification_failed') {
          Alert.alert('Verification Failed', accessCheck.message);
        } else {
          Alert.alert('Error', accessCheck.message || 'Failed to check access');
        }
        return;
      }
      
      // Step 2: Handle already viewed or new view
      if (accessCheck.alreadyViewed) {
        console.log('✅ Design already viewed - navigating to ViewContact');
        router.push({
          pathname: '/home/screens/Sidebar/ViewContact',
          params: {
            designerDetails: JSON.stringify(accessCheck.designerDetails),
            alreadyViewed: 'true',
            designId: designId,
            designTitle: design.name
          }
        });
      } else {
        // New view - record it (FREE)
        console.log('📝 Recording new design view (FREE)');
        const recordResult = await recordDesignView(designId);
        
        if (!recordResult.success) {
          Alert.alert('Error', 'Failed to record view');
          return;
        }
        
        console.log('✅ View recorded - navigating to ViewContact');
        router.push({
          pathname: '/home/screens/Sidebar/ViewContact',
          params: {
            designerDetails: JSON.stringify(recordResult.designerDetails),
            alreadyViewed: 'false',
            designId: designId,
            designTitle: design.name
          }
        });
      }
      
    } catch (error) {
      console.error('❌ View contact error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white mt-12">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22C55E" />
          <Text className="mt-4 text-gray-600">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 mt-12 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Box */}
        <View className="w-[412px] h-[215px] rounded-b-[30px] bg-[#22C55E33] items-start justify-center px-5">
          <View className="-mt-32 flex flex-row">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={22} color="black" />
            </TouchableOpacity>

            <Text className="ml-8 text-[19px] text-[#4E4E4E] font-medium">
              Please share your details to contact {"\n"}
              the Designer
            </Text>
          </View>
        </View>

        {/* Designer Card */}
        <View className="mt-[-30px] self-center w-[371px] h-[100px] bg-white border border-[#0000001A] rounded-[10px] flex-row items-center px-4">
          <View className="w-12 h-12 rounded-full bg-[#E6F8EF] items-center justify-center">
            <Text className="text-green-600 font-semibold">
              {design?.designer ? design.designer.substring(0, 2).toUpperCase() : 'DS'}
            </Text>
          </View>

          <View className="ml-3">
            <View className="flex-row items-center">
              <Text className="text-[14px] text-[#000000CC] font-semibold">
                {design?.designer || 'Designer'}
              </Text>
              <View className="ml-2 w-[60px] h-[16px] bg-white border border-[#0000001A] rounded-[6px] items-center justify-center">
                <Text className="text-[9px] text-[#00000099]">Designer</Text>
              </View>
            </View>
            <Text className="text-[14px] text-[#00000052] mt-1">
              {design?.category || 'Interior'} | {maskedPhone || '+91-7xxxxxxxx44'}
            </Text>
          </View>
        </View>

        {/* FREE Badge */}
        <View className="mt-4 self-center">
          <View className="bg-green-100 px-4 py-2 rounded-full">
            <Text className="text-green-700 font-semibold text-sm">
              ✨ FREE - No subscription required
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View className="mt-6 self-center w-[371px]">
          {/* Name */}
          <View className="bg-white w-full h-[72px] rounded-[8px] border border-[#0000001A] px-3 py-2 mb-4">
            <Text className="text-[14px] text-[#00000099]">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#00000052"
              className="text-[14px] text-[#000000CC] mt-1"
            />
          </View>

          {/* Phone */}
          <View className="bg-[#F4F7F5] w-full h-[72px] rounded-[8px] border border-[#0000001A] px-3 py-2">
            <Text className="text-[14px] text-[#00000099]">Phone Number</Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-[14px] text-[#000000CC] mr-2">+91</Text>
              <TextInput
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="numeric"
                placeholder="Enter number"
                placeholderTextColor="#00000052"
                maxLength={10}
                className="flex-1 text-[14px] text-[#000000CC]"
              />
            </View>
          </View>

          {/* Change Number */}
          <TouchableOpacity onPress={() => setPhone('')} activeOpacity={0.7}>
            <Text className="text-[13px] text-green-600 mt-2">Change Number</Text>
          </TouchableOpacity>

          {/* Agent Yes/No */}
          <Text className="text-[14px] text-black mt-3 mb-2">Are you a Real Estate Agent</Text>

          <View className="flex-row space-x-3">
            {['yes', 'no'].map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setAgent(opt)}
                className={`w-[84px] h-[34px] rounded-[8px] items-center justify-center border border-[#0000001A] mx-2 ${
                  agent === opt ? 'bg-[#22C55E1A]' : 'bg-white'
                }`}
              >
                <Text className="text-[14px] text-[#000000CC] capitalize">{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Checkbox */}
          <View className="flex-row items-center mt-6">
            <TouchableOpacity
              onPress={() => setAccepted(!accepted)}
              className={`w-5 h-5 rounded-[4px] border ${
                accepted ? 'bg-[#22C55E] border-[#22C55E]' : 'border-[#C0C0C0]'
              } items-center justify-center`}
            >
              {accepted && <Text className="text-white text-[12px] font-bold">✓</Text>}
            </TouchableOpacity>

            <Text className="ml-3 text-[#000000CC] text-[14px]">
              I agree to <Text className="text-[#22C55E] font-semibold">Terms & Conditions</Text> and{' '}
              <Text className="text-[#22C55E] font-semibold">Privacy Policy</Text>
            </Text>
          </View>
          
          {/* Info Note */}
          {!viewEnabled && name && phone && accepted && agent && (
            <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <View className="flex-row items-center">
                <Ionicons name="information-circle" size={20} color="#F59E0B" />
                <Text className="ml-2 text-sm text-yellow-800 flex-1">
                  Name or phone number doesn't match your account
                </Text>
              </View>
            </View>
          )}

          {/* View Contact Button */}
          <TouchableOpacity
            disabled={!viewEnabled || verifying}
            onPress={handleViewContact}
            className={`h-12 rounded-[8px] items-center justify-center mt-6 border border-[#0000001A] ${
              viewEnabled && !verifying ? 'bg-[#22C55E]' : 'bg-white'
            }`}
          >
            {verifying ? (
              <ActivityIndicator color={viewEnabled ? 'white' : '#00000099'} />
            ) : (
              <Text
                className={`text-[20px] font-semibold ${
                  viewEnabled ? 'text-white' : 'text-[#00000099]'
                }`}
              >
                View Contact
              </Text>
            )}
          </TouchableOpacity>
          
          {/* Helper Text */}
          <Text className="text-xs text-gray-500 text-center mt-3">
            Enter the same name and phone number used during registration
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}