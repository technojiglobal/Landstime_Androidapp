// Frontend/app/home/screens/Settings/General.jsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

const General = () => {
  const { t } = useTranslation();

  return (
    <View className="bg-white rounded-xl p-6 shadow-md ml-6 w-[80%] mt-6">
      {/* Title */}
      <Text className="border-b border-gray-200 text-gray-700 font-semibold text-sm pb-2 mb-4">
        {t('general_title')}
      </Text>

      {/* Options */}
      <View className="flex flex-col space-y-4">
        {/* Language */}
        <TouchableOpacity className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 text-md">{t('language')}</Text>
          <Text className="text-gray-400 text-md">English {">"}</Text>
        </TouchableOpacity>

        {/* Currency */}
        <TouchableOpacity className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 text-md">{t('currency')}</Text>
          <Text className="text-gray-400 text-md">USD {">"}</Text>
        </TouchableOpacity>

        {/* Help & Support */}
        <TouchableOpacity className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 text-md">{t('help_support')}</Text>
          <Text className="text-gray-400 text-xl">{">"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default General;