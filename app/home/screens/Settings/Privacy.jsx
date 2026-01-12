// Frontend/app/home/screens/Settings/Privacy.jsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

const Toggle = ({ enabled, onChange }) => {
  return (
    <TouchableOpacity
      onPress={() => onChange(!enabled)}
      className={`w-8 h-4 flex flex-row items-center rounded-full
        ${enabled ? "bg-[#22C55E]" : "bg-gray-300"}`}
    >
      <View
        className={`w-3 h-3 bg-white rounded-full shadow
          ${enabled ? "translate-x-4" : "translate-x-0.5"}`}
      />
    </TouchableOpacity>
  );
};

const Privacy = () => {
  const { t } = useTranslation();
  const [profileVisible, setProfileVisible] = useState(true);
  const [showActivity, setShowActivity] = useState(false);
  const [allowMessages, setAllowMessages] = useState(true);

  return (
    <View className="bg-white rounded-xl p-6 shadow-md ml-6 w-[92%] mt-6">
      {/* Title */}
      <Text className="border-b border-gray-200  font-semibold text-lg pb-2 mb-4">
        {t('privacy_title')}
      </Text>

      {/* Options */}
      <View className="gap-2 text-sm text-gray-600">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 text-[15px]">{t('profile_visible')}</Text>
          <Toggle enabled={profileVisible} onChange={setProfileVisible} />
        </View>

        <View className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 text-[15px]">{t('show_activity')}</Text>
          <Toggle enabled={showActivity} onChange={setShowActivity} />
        </View>

        <View className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 text-[15px]">{t('allow_messages')}</Text>
          <Toggle enabled={allowMessages} onChange={setAllowMessages} />
        </View>
      </View>
    </View>
  );
};

export default Privacy;