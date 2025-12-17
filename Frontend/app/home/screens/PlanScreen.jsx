import React from "react";
import { View, Text, ScrollView,Image, TouchableOpacity,StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { subscriptionPlans } from "../../../data/plansData";
import arrow from "../../../assets/arrow.png"
export default function SubscriptionPlansScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 mt-7 bg-white">
    <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View  className="flex-row ml-5 mt-9 border-b border-gray-200 mb-5 pb-2">
           <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
              <Image  source={arrow}  className="w-6 h-6"/>
            </TouchableOpacity>
          
                  {/* Title (RIGHT aligned) */}
            <Text className="text-xl font-bold text-gray-500 mr-auto ml-3 ">
             Subscription plans
            </Text>
        </View>
        <View className="items-center">
          <Text className="font-semibold text-xl text-center">
            Choose the perfect plan for you
          </Text>
          <Text className="text-center">
            Unlock powerful features to grow your real {"\n"} estate business.Select the plan that best fits {"\n"} your needs.
          </Text>
        </View>

        <View className="mt-6 px-4 pb-10 mx-5">
          {subscriptionPlans.map((plan) => (
            <View
              key={plan.id}
              className="bg-white border border-gray-300 p-6 mb-6 rounded-3xl"
            >
              <View className="flex-row items-center justify-center mb-3  border-b border-gray-200 pb-3">
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

              <TouchableOpacity className="border border-green-500  w-40 h-10 rounded-xl py-1 text-center items-center justify-center mt-4 ml-28">
                <Text className="text-center text-green-600 font-bold">
                  Subscribe Now
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}
