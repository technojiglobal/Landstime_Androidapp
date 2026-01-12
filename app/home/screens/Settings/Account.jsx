// Frontend/app/home/screens/Settings/Account.jsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

const Account = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="bg-white rounded-xl p-6 shadow-md ml-6 w-[92%]  mt-6">
      <Text className="border-b border-gray-200  font-semibold text-lg  pb-2 mb-4">
        {t('account_title')}
      </Text>

      <View className="flex flex-col space-y-4">
        {/* Edit Profile */}
        <TouchableOpacity
          onPress={() => router.push("/home/screens/Settings/Profile")}
          className="flex flex-row justify-between items-center"
        >
          <Text className="text-gray-500 text-[15px]">{t('edit_profile')}</Text>
          <Ionicons name="chevron-forward" size={21} color="#9CA3AF" />

        </TouchableOpacity>

        {/* Change Password */}
        <TouchableOpacity className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 text-[15px]">{t('change_password')}</Text>
          <Ionicons name="chevron-forward" size={21} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Verification */}
        <View className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 text-[15px]">{t('verification_status')}</Text>
          <Text className="text-[#139501] text-md font-semibold">{t('verified')}</Text>
        </View>
      </View>
    </View>
  );
};

export default Account;