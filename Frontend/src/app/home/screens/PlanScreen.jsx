import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { subscriptionPlans } from "../../../data/plansData";

export default function SubscriptionPlansScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>

        <View className="mt-6 px-4 pb-10 mx-5">
          {subscriptionPlans.map((plan) => (
            <View
              key={plan.id}
              className="bg-white border border-gray-300 p-6 mb-6 rounded-3xl"
            >
              <View className="flex-row items-center justify-center mb-3">
                <Ionicons name={plan.icon} size={24} color={plan.color} />
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
