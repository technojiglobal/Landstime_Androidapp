// Frontend/app/home/screens/UploadScreens/VastuDropdown.jsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';

const VastuDropdown = ({ label, value, options, onSelect }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  // ✅ Default Vastu directions with translations
  const DEFAULT_DIRECTIONS = [
    t('vaastu_option_north'),
    t('vaastu_option_north_east'),
    t('vaastu_option_east'),
    t('vaastu_option_south_east'),
    t('vaastu_option_south'),
    t('vaastu_option_south_west'),
    t('vaastu_option_west'),
    t('vaastu_option_north_west'),
  ];

  // Use provided options or default directions
  const dropdownOptions = options || DEFAULT_DIRECTIONS;

  return (
    <View className="mb-4">
      {/* Label */}
      <Text className="font-semibold text-gray-500 mb-2">{label}</Text>

      {/* Selected box */}
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className={`flex-row justify-between items-center border rounded-lg p-3
          ${value ? "bg-green-100 border-green-400" : "bg-[#F9FAFB] border-gray-300"}`}
      >
        <Text className="text-base text-gray-700">
          {value || "Select direction"}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {/* Dropdown list */}
      {open && (
        <View className="mt-2 border border-gray-200 rounded-lg overflow-hidden bg-white">
          {dropdownOptions.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                onSelect(item);
                setOpen(false);
              }}
              className={`p-3 border-b border-gray-100
                ${item === value ? "bg-green-500" : "bg-white"}`}
            >
              <Text
                className={`text-base
                  ${item === value ? "text-white font-medium" : "text-gray-700"}`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default VastuDropdown;