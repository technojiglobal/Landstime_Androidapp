


// Frontend/app/home/screens/ContactForm.jsx

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
const router = useRouter();
const { propertyId, areaKey } = useLocalSearchParams();
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '../../../utils/api';
import { getPropertyById } from '../../../utils/propertyApi';
import { checkViewAccess, recordPropertyView } from '../../../utils/propertyViewApi';

export default function ContactForm() {
  const router = useRouter();
  const { propertyId, areaKey } = useLocalSearchParams();
  
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agent, setAgent] = useState('no'); // Default to 'no' (Owner)
  const [accepted, setAccepted] = useState(false);
  const [viewEnabled, setViewEnabled] = useState(false);
  
  // User and property state
  const [currentUser, setCurrentUser] = useState(null);
  const [property, setProperty] = useState(null);
  const [maskedPhone, setMaskedPhone] = useState('');
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  

  // ✅ NEW: Early validation
useEffect(() => {
  if (!propertyId) {
    console.error('❌ No propertyId in params');
    Alert.alert('Error', 'Property information missing');
    router.back();
  }
}, [propertyId]);

  // Fetch user profile and property on mount
  useEffect(() => {
    fetchUserAndProperty();
  }, []);
  
const fetchUserAndProperty = async () => {
  try {
    setLoading(true);
    
    console.log('🚀 STARTING fetchUserAndProperty');
    
    // Get user profile
    console.log('📞 Calling getUserProfile...');
    const userResult = await getUserProfile();
    
    console.log('🔍 STEP 1: Full API Response:', userResult);
    console.log('🔍 STEP 2: Success?', userResult.success);
    console.log('🔍 STEP 3: Response Data:', userResult.data);
    
    if (userResult.success) {
      const userData = userResult.data.data;
      
      console.log('🔍 STEP 4: userData object:', userData);
      console.log('🔍 STEP 5: userData.name:', userData.name);
      console.log('🔍 STEP 6: userData.phone:', userData.phone);
      console.log('🔍 STEP 7: userData.email:', userData.email);
      
      // Extract name
      let userName = '';
      if (typeof userData.name === 'string') {
        userName = userData.name;
      } else if (userData.name && typeof userData.name === 'object') {
        userName = userData.name.en || userData.name.te || userData.name.hi || '';
      }
      
      console.log('🔍 STEP 8: Extracted userName:', userName);
      
      setCurrentUser({
        name: userName,
        phone: userData.phone,
        email: userData.email
      });
      
      console.log('🔍 STEP 9: Called setCurrentUser with:', {
        name: userName,
        phone: userData.phone,
        email: userData.email
      });
    } else {
      console.log('❌ getUserProfile failed:', userResult);
      Alert.alert('Error', 'Failed to load user profile');
      router.back();
      return;
    }
      
      // Get property details
     // Get property details
if (propertyId) {
  const propResult = await getPropertyById(propertyId);
  if (propResult.success) {
    const propData = propResult.data.data || propResult.data;
    setProperty(propData);
    
    // ✅ FIX: Use ownerDetails OR userId (fallback)
    const ownerPhone = propData.ownerDetails?.phone || propData.userId?.phone || '';
    setMaskedPhone(maskPhoneNumber(ownerPhone));
    
    // ✅ Get property title in current language
    const titleObj = propData.propertyTitle;
    const title = typeof titleObj === 'string' ? titleObj : (titleObj?.en || titleObj?.te || titleObj?.hi || 'Property');
    
    console.log('✅ Property loaded:', title);
  } else {
          Alert.alert('Error', 'Failed to load property details');
          router.back();
        }
      }
      
   } catch (error) {
    console.error('❌ fetchUserAndProperty ERROR:', error);
    console.error('❌ Error stack:', error.stack);
    Alert.alert('Error', 'Something went wrong');
    router.back();
  } finally {
    setLoading(false);
  }
};
  
  // Phone number masking helper
  const maskPhoneNumber = (phoneNum) => {
    if (!phoneNum) return '';
    const stripped = stripPhone(phoneNum);
    if (stripped.length < 10) return phoneNum;
    return `+91-${stripped.substring(0, 2)}${'x'.repeat(stripped.length - 4)}${stripped.substring(stripped.length - 2)}`;
  };
  
  // Strip phone number helper
  const stripPhone = (phoneNum) => {
    if (!phoneNum) return '';
    return phoneNum.replace(/[\s\-\+]/g, '').replace(/^91/, '');
  };
  
const verifyCredentials = () => {
  console.log('🔍 verifyCredentials called');
  console.log('🔍 currentUser:', currentUser);
  
  if (!currentUser) {
    console.log('❌ No currentUser yet!');
    return false;
  }
  
  console.log('🔍 currentUser.name:', currentUser.name);
  console.log('🔍 currentUser.name type:', typeof currentUser.name);
  
  const strippedInputPhone = stripPhone(phone);
  const strippedUserPhone = stripPhone(currentUser.phone);
  const phoneMatch = strippedInputPhone === strippedUserPhone;
  
  const inputName = name.toLowerCase().trim();
  const userName = (currentUser.name || '').toLowerCase().trim();
  const nameMatch = inputName === userName;
  
  console.log('🔐 Frontend verification:', {
    inputName,
    userName,
    currentUserNameRaw: currentUser.name,
    phoneMatch,
    nameMatch
  });
  
  return phoneMatch && nameMatch;
};
  // Update button enable state
  useEffect(() => {
  if (!currentUser || loading) {
    setViewEnabled(false);
    return;
  }
  
    
    const fieldsValid = name && phone && agent && accepted;
    const credentialsMatch = verifyCredentials();
    
    setViewEnabled(fieldsValid && credentialsMatch);
  }, [name, phone, agent, accepted, currentUser]);
  
  // Numeric input only
  const handlePhoneChange = (text) => {
    setPhone(text.replace(/[^0-9]/g, ''));
  };
  
  // Show limit exceeded popup
  const showLimitExceededPopup = (data) => {
    const nextPlan = data.planName === 'Gold' ? 'Platinum' : 'Diamond';
    const nextPlanLimit = data.planName === 'Gold' ? 30 : 50;
    
    Alert.alert(
      'Subscription Limit Reached',
      `Your ${data.planName} plan allows ${data.totalViews} property contacts.\n\n` +
      `You've used all ${data.usedViews} views.\n\n` +
      `Upgrade to ${nextPlan} for ${nextPlanLimit} contacts!`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Upgrade Now', 
          onPress: () => router.push('/home/screens/PlanScreen') 
        }
      ]
    );
  };
  
  // Handle View Contact button press
  const handleViewContact = async () => {
    try {
      setVerifying(true);
      
      console.log('🔍 Checking access for property:', propertyId);
      
      // Step 1: Check access
      const accessCheck = await checkViewAccess(
        propertyId,
        name,
        stripPhone(phone)
      );
      
      console.log('📥 Access check result:', accessCheck);
      
      if (!accessCheck.success) {
        // Show error based on reason
        if (accessCheck.data?.reason === 'limit_exceeded') {
          showLimitExceededPopup(accessCheck.data);
        } else if (accessCheck.data?.reason === 'verification_failed') {
          Alert.alert('Verification Failed', accessCheck.data.message);
        } else if (accessCheck.data?.reason === 'no_subscription') {
          Alert.alert(
            'No Subscription',
            'Please purchase a subscription to view contact details',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'View Plans', onPress: () => router.push('/home/screens/PlanScreen') }
            ]
          );
        } else if (accessCheck.data?.reason === 'subscription_expired') {
          Alert.alert(
            'Subscription Expired',
            'Your subscription has expired. Please renew to continue.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Renew', onPress: () => router.push('/home/screens/PlanScreen') }
            ]
          );
        } else {
          Alert.alert('Error', accessCheck.data?.message || 'Failed to check access');
        }
        return;
      }
      
      // Step 2: Handle already viewed or new view
      if (accessCheck.data?.alreadyViewed) {
        // Already viewed - just navigate
        console.log('✅ Property already viewed - navigating to ViewContact');
        router.push({
  pathname: '/home/screens/ViewContact',
  params: {
    ownerDetails: JSON.stringify(accessCheck.data.ownerDetails),
    quota: JSON.stringify(accessCheck.data.quota),
    alreadyViewed: 'true',
    areaKey: areaKey,
    propertyId: propertyId  // ✅ Add this
  }
});
      } else {
        // New view - record it
        console.log('📝 Recording new property view');
        const recordResult = await recordPropertyView(propertyId);
        
        if (!recordResult.success) {
          Alert.alert('Error', 'Failed to record view');
          return;
        }
        
        console.log('✅ View recorded - navigating to ViewContact');
        router.push({
  pathname: '/home/screens/ViewContact',
  params: {
    ownerDetails: JSON.stringify(recordResult.data.ownerDetails),
    quota: JSON.stringify(recordResult.data.quota),
    alreadyViewed: 'false',
    areaKey: areaKey,
    propertyId: propertyId  // ✅ Add this
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
        {/* 🟩 Top Box */}
        <View className="w-[412px] h-[215px] rounded-b-[30px] bg-[#22C55E33] items-start justify-center px-5">
          <View className="-mt-32 flex flex-row">
            <TouchableOpacity onPress={() => {
  if (propertyId) {
    router.push({
      pathname: '/home/screens/Sites/(Property)',
      params: { 
        propertyId: propertyId,
        areaKey: areaKey 
      }
    });
  } else {
    router.back();
  }
}}>
  <Ionicons name="chevron-back-outline" size={22} color="black" />
</TouchableOpacity>

            <Text className="ml-8 text-[19px] text-[#4E4E4E] font-medium">
              Please share your details to contact {"\n"}
              the Owner
            </Text>
          </View>
        </View>

        {/* 👤 Owner Card */}
        <View className="mt-[-30px] self-center w-[371px] h-[100px] bg-white border border-[#0000001A] rounded-[10px] flex-row items-center px-4">
          <View className="w-12 h-12 rounded-full bg-[#E6F8EF] items-center justify-center">
            <Text className="text-green-600 font-semibold">
              {property?.ownerDetails?.name ? property.ownerDetails.name.substring(0, 2).toUpperCase() : 'US'}
            </Text>
          </View>

          <View className="ml-3">
            <View className="flex-row items-center">
              <Text className="text-[14px] text-[#000000CC] font-semibold">
                {property?.ownerDetails?.name || property?.userId?.name || currentUser?.name || 'Owner'}
              </Text>
              <View className="ml-2 w-[48px] h-[16px] bg-white border border-[#0000001A] rounded-[6px] items-center justify-center">
                <Text className="text-[9px] text-[#00000099]">Owner</Text>
              </View>
            </View>
            <Text className="text-[14px] text-[#00000052] mt-1">
              {property?.ownerDetails?.company || 'UmaHomes'} | {maskedPhone || '+91-7xxxxxxxx44'}
            </Text>
          </View>
        </View>

        {/* 🧾 Form Section */}
        <View className="mt-10 self-center w-[371px]">
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
          
          {/* Info Note - Show when fields are filled but credentials don't match */}
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