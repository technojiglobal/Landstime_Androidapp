// Frontend/app/home/screens/Settings/Notifications.jsx

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

const Notifications = () => {
  const { t } = useTranslation();
  const [propertyAlerts, setPropertyAlerts] = useState(true);
  const [priceChanges, setPriceChanges] = useState(true);
  const [messages, setMessages] = useState(true);

  return (
    <View className="bg-white rounded-xl p-6 shadow-md ml-6 w-[80%] mt-6">
      {/* Title */}
      <Text className="border-b border-gray-200 text-gray-700 font-semibold text-sm pb-2 mb-4">
        {t('notifications_title')}
      </Text>

      {/* Options */}
      <View className="gap-2 flex flex-col space-y-4 text-sm text-gray-600">
        {/* Property Alerts */}
        <View className="flex flex-row justify-between items-center">
          <Text className="text-gray-700">{t('property_alerts')}</Text>
          <Toggle enabled={propertyAlerts} onChange={setPropertyAlerts} />
        </View>

        {/* Price Changes */}
        <View className="flex flex-row justify-between items-center">
          <Text className="text-gray-700">{t('price_changes')}</Text>
          <Toggle enabled={priceChanges} onChange={setPriceChanges} />
        </View>

        {/* Messages */}
        <View className="flex flex-row justify-between items-center">
          <Text className="text-gray-700">{t('messages')}</Text>
          <Toggle enabled={messages} onChange={setMessages} />
        </View>

        {/* Marketing Emails */}
        <View className="flex flex-row justify-between items-center">
          <Text className="text-gray-700">{t('marketing_emails')}</Text>
        </View>
      </View>
    </View>
  );
};

export default Notifications;