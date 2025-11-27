import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Toggle = ({ enabled, onChange }) => {
  return (
    <TouchableOpacity
      onPress={() => onChange(!enabled)}
      className={`w-11 h-6 flex flex-row items-center rounded-full
        ${enabled ? "bg-[#22C55E]" : "bg-gray-300"}`}
    >
      <View
        className={`w-5 h-5 bg-white rounded-full shadow
          ${enabled ? "translate-x-5" : "translate-x-1"}`}
      />
    </TouchableOpacity>
  );
};

const Notifications = () => {
  const [propertyAlerts, setPropertyAlerts] = useState(true);
  const [priceChanges, setPriceChanges] = useState(true);
  const [messages, setMessages] = useState(true);

  return (
    <View className="bg-white rounded-xl p-6 shadow-md ml-6 w-[80%] mt-6">
      
      {/* Title */}
      <Text className="border-b border-gray-200 text-gray-700 font-semibold text-sm pb-2 mb-4">
        Notifications
      </Text>

      {/* Options */}
      <View className="gap-2 flex flex-col space-y-4 text-sm text-gray-600">

        {/* Property Alerts */}
        <View className="flex flex-row justify-between items-center">
          <Text>Property Alerts</Text>
          <Toggle enabled={propertyAlerts} onChange={setPropertyAlerts} />
        </View>

        {/* Price Changes */}
        <View className="flex flex-row justify-between items-center">
          <Text>Price Changes</Text>
          <Toggle enabled={priceChanges} onChange={setPriceChanges} />
        </View>

        {/* Messages */}
        <View className="flex flex-row justify-between items-center">
          <Text>Messages</Text>
          <Toggle enabled={messages} onChange={setMessages} />
        </View>

        {/* Marketing Emails */}
        <View className="flex flex-row justify-between items-center">
          <Text>Marketing Emails</Text>
        </View>

      </View>
    </View>
  );
};

export default Notifications;
