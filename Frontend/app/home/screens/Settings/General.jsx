// Frontend/app/home/screens/Settings/General.jsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

const General = () => {
  const { t } = useTranslation();

  return (
    <View className="bg-white rounded-xl p-6 shadow-md ml-6 w-[92%] mt-6">
      {/* Title */}
      <Text className="border-b border-gray-200  font-semibold text-lg pb-2 mb-4">
        {t('general_title')}
      </Text>

      {/* Options */}
      <View className="flex flex-col space-y-4">
        {/* Language */}
        <TouchableOpacity className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 text-[15px]">{t('language')}</Text>
           <Text className="text-gray-400 text-md">ENG <Ionicons name="chevron-forward" size={20} color="#9CA3AF" /></Text>
        </TouchableOpacity>

        {/* Currency */}
        <TouchableOpacity className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 text-[15px]">{t('currency')}</Text>
          <Text className="text-gray-400 text-md">USD <Ionicons name="chevron-forward" size={20} color="#9CA3AF" /></Text>
        </TouchableOpacity>

        {/* Help & Support */}
        <TouchableOpacity className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 text-[15px]">{t('help_support')}</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default General;