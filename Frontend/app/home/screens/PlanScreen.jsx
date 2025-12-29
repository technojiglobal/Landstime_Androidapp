//Frontend/app/home/screens/PlanScreen.jsx

import React, { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar, Alert, ActivityIndicator, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { subscriptionPlans } from "../../../data/plansData";
import arrow from "../../../assets/arrow.png";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  createSubscriptionOrder, 
  verifySubscriptionPayment,
  getCurrentUserSubscription 
} from '../../../utils/subscriptionApi';

export default function SubscriptionPlansScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);

      // Fetch current subscription if user is logged in
      if (token) {
        const subscriptionResult = await getCurrentUserSubscription();
        if (subscriptionResult.success && subscriptionResult.data.hasActiveSubscription) {
          setCurrentSubscription(subscriptionResult.data.data);
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  // Handle subscription process
  const handleSubscribe = async (plan) => {
    try {
      // Check if user is logged in
      if (!userToken) {
        Alert.alert(
          'Login Required',
          'Please login to subscribe to a plan',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Login', onPress: () => router.push('/auth/login') }
          ]
        );
        return;
      }

      setProcessingPlan(plan.id);
      setLoading(true);

      // Step 1: Create order from backend using API function
      console.log('📦 Creating subscription order...');
      const orderResult = await createSubscriptionOrder(
        plan.id,
        plan.title,
        plan.price,
        plan.features
      );

      console.log('📦 Order Result:', orderResult);

      if (!orderResult.success || !orderResult.data.success) {
        throw new Error(orderResult.data?.message || 'Failed to create order');
      }

      const orderData = orderResult.data.data;
      console.log('✅ Order created:', orderData.orderId);

      // Step 2: Open Razorpay payment gateway
      if (Platform.OS === 'web') {
        // For web platform, use Razorpay Checkout script
        openRazorpayWeb(orderData, plan);
      } else {
        // For mobile (iOS/Android)
        openRazorpayMobile(orderData, plan);
      }

    } catch (error) {
      console.error('Subscribe error:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
      setLoading(false);
      setProcessingPlan(null);
    }
  };

  // Open Razorpay for Web
  const openRazorpayWeb = (orderData, plan) => {
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'LandsTime',
        description: `${plan.title} Plan Subscription`,
        order_id: orderData.orderId,
        prefill: {
          name: orderData.user.name,
          email: orderData.user.email,
          contact: orderData.user.phone
        },
        theme: {
          color: '#10B981'
        },
        handler: async function (response) {
          console.log('💳 Payment successful:', response);
          await verifyPayment(response, orderData.subscriptionId);
        },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled');
            Alert.alert('Payment Cancelled', 'You cancelled the payment');
            setLoading(false);
            setProcessingPlan(null);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        Alert.alert('Payment Failed', response.error.description);
        setLoading(false);
        setProcessingPlan(null);
      });
    };

    script.onerror = () => {
      Alert.alert('Error', 'Failed to load payment gateway');
      setLoading(false);
      setProcessingPlan(null);
    };

    document.body.appendChild(script);
  };

  // Open Razorpay for Mobile (iOS/Android)
  const openRazorpayMobile = async (orderData, plan) => {
    try {
      const RazorpayCheckout = require('react-native-razorpay').default;
      
      const options = {
        description: `${plan.title} Plan Subscription`,
        currency: orderData.currency,
        key: orderData.razorpayKeyId,
        amount: orderData.amount,
        name: 'LandsTime',
        order_id: orderData.orderId,
        prefill: {
          email: orderData.user.email,
          contact: orderData.user.phone,
          name: orderData.user.name
        },
        theme: { color: '#10B981' }
      };

      const data = await RazorpayCheckout.open(options);
      console.log('💳 Payment successful:', data);
      await verifyPayment(data, orderData.subscriptionId);
      
    } catch (error) {
      console.error('Payment error:', error);
      if (error.code !== 0) { // code 0 means user cancelled
        Alert.alert('Payment Failed', error.description || 'Payment was cancelled or failed');
      }
      setLoading(false);
      setProcessingPlan(null);
    }
  };

  // Verify payment with backend
  const verifyPayment = async (paymentData, subscriptionId) => {
    try {
      const verifyResult = await verifySubscriptionPayment(
        paymentData.razorpay_order_id,
        paymentData.razorpay_payment_id,
        paymentData.razorpay_signature,
        subscriptionId
      );

      if (verifyResult.success && verifyResult.data.success) {
        // Refresh subscription status
        const subscriptionResult = await getCurrentUserSubscription();
        if (subscriptionResult.success && subscriptionResult.data.hasActiveSubscription) {
          setCurrentSubscription(subscriptionResult.data.data);
        }

        Alert.alert(
          'Success! 🎉',
          `Your ${verifyResult.data.data.planName} subscription is now active!`,
          [
            { text: 'OK', onPress: () => router.push('/(tabs)/home') }
          ]
        );
      } else {
        throw new Error(verifyResult.data?.message || 'Payment verification failed');
      }

    } catch (error) {
      console.error('Verify payment error:', error);
      Alert.alert(
        'Verification Failed',
        'Payment was successful but verification failed. Please contact support.'
      );
    } finally {
      setLoading(false);
      setProcessingPlan(null);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <View 
        className="flex-1 bg-white"
        style={{ 
          marginTop: insets.top, 
          marginBottom: insets.bottom 
        }}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row ml-5 mt-9 border-b border-gray-200 mb-5 pb-2">
            <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
              <Image source={arrow} className="w-6 h-6"/>
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-500 mr-auto ml-3">
              Subscription plans
            </Text>
          </View>
          <View className="items-center">
            <Text className="font-semibold text-xl text-center">
              Choose the perfect plan for you
            </Text>
            <Text className="text-center">
              Unlock powerful features to grow your real {"\n"} estate business. Select the plan that best fits {"\n"} your needs.
            </Text>
          </View>
          <View className="mt-6 px-4 pb-10 mx-5">
            {subscriptionPlans.map((plan) => {
              const isActivePlan = currentSubscription?.planId === plan.id;
              
              return (
                <View
                  key={plan.id}
                  className={`p-6 mb-6 rounded-3xl ${
                    isActivePlan 
                      ? 'bg-green-50 border-2 border-green-500' 
                      : 'bg-white border border-gray-300'
                  }`}
                >
                  {isActivePlan && (
                    <View className="bg-green-500 px-4 py-2 rounded-full mb-3 self-center">
                      <Text className="text-white font-bold">✓ Your Current Plan</Text>
                    </View>
                  )}
                  <View className="flex-row items-center justify-center mb-3 border-b border-gray-200 pb-3">
                    <Image source={plan.image} className="w-8 h-8"/>
                    <Text className="text-xl font-semibold ml-2">
                      {plan.title}
                    </Text>
                  </View>
                  <Text className="text-center text-[32px] font-bold">
                    ₹{plan.price}
                    <Text className="text-lg text-gray-500">/{plan.period}</Text>
                  </Text>
                  <View className="mt-5">
                    {plan.features.map((f, index) => (
                      <View key={index} className="flex-row items-center mb-3">
                        <Ionicons name="checkmark-circle" size={20} color="#32CD32" />
                        <Text className="ml-3 text-gray-700 text-base">{f}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity 
                    className={`border ${
                      isActivePlan 
                        ? 'border-green-700 bg-green-600' 
                        : processingPlan === plan.id 
                          ? 'border-gray-400 bg-gray-100' 
                          : 'border-green-500'
                    } w-40 h-10 rounded-xl py-1 text-center items-center justify-center mt-4 ml-28`}
                    onPress={() => handleSubscribe(plan)}
                    disabled={loading || processingPlan === plan.id || isActivePlan}
                  >
                    {processingPlan === plan.id ? (
                      <ActivityIndicator color="#10B981" />
                    ) : (
                      <Text className={`text-center font-bold ${
                        isActivePlan ? 'text-white' : 'text-green-600'
                      }`}>
                        {isActivePlan ? 'Active Plan' : 'Subscribe Now'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>   
  );
}