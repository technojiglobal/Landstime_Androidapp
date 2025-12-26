// Frontend/app/home/screens/Vaastu/Elements.jsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

export default function Elements() {
  const { t } = useTranslation();

  const elements = [
    {
      name: t('vaastu_element_water_name'),
      direction: t('vaastu_element_water_direction'),
      benefits: [
        t('vaastu_element_water_benefit_1'),
        t('vaastu_element_water_benefit_2'),
        t('vaastu_element_water_benefit_3'),
      ],
      items: [
        t('vaastu_element_water_item_1'),
        t('vaastu_element_water_item_2'),
        t('vaastu_element_water_item_3'),
        t('vaastu_element_water_item_4'),
      ],
    },
    {
      name: t('vaastu_element_fire_name'),
      direction: t('vaastu_element_fire_direction'),
      benefits: [
        t('vaastu_element_fire_benefit_1'),
        t('vaastu_element_fire_benefit_2'),
        t('vaastu_element_fire_benefit_3'),
      ],
      items: [
        t('vaastu_element_fire_item_1'),
        t('vaastu_element_fire_item_2'),
        t('vaastu_element_fire_item_3'),
        t('vaastu_element_fire_item_4'),
      ],
    },
    {
      name: t('vaastu_element_air_name'),
      direction: t('vaastu_element_air_direction'),
      benefits: [
        t('vaastu_element_air_benefit_1'),
        t('vaastu_element_air_benefit_2'),
        t('vaastu_element_air_benefit_3'),
      ],
      items: [
        t('vaastu_element_air_item_1'),
        t('vaastu_element_air_item_2'),
        t('vaastu_element_air_item_3'),
        t('vaastu_element_air_item_4'),
      ],
    },
    {
      name: t('vaastu_element_earth_name'),
      direction: t('vaastu_element_earth_direction'),
      benefits: [
        t('vaastu_element_earth_benefit_1'),
        t('vaastu_element_earth_benefit_2'),
        t('vaastu_element_earth_benefit_3'),
      ],
      items: [
        t('vaastu_element_earth_item_1'),
        t('vaastu_element_earth_item_2'),
        t('vaastu_element_earth_item_3'),
        t('vaastu_element_earth_item_4'),
      ],
    },
    {
      name: t('vaastu_element_space_name'),
      direction: t('vaastu_element_space_direction'),
      benefits: [
        t('vaastu_element_space_benefit_1'),
        t('vaastu_element_space_benefit_2'),
        t('vaastu_element_space_benefit_3'),
      ],
      items: [
        t('vaastu_element_space_item_1'),
        t('vaastu_element_space_item_2'),
        t('vaastu_element_space_item_3'),
        t('vaastu_element_space_item_4'),
      ],
    },
  ];

  return (
    <ScrollView className="mt-4 pb-7">
      {elements.map((ele, index) => (
        <View
          key={index}
          className="bg-white rounded-xl p-5 border border-gray-200 mb-5"
        >
          {/* Title Row */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-900">
              {ele.name}
            </Text>
            <View className="px-3 py-1 rounded-lg border border-gray-200">
              <Text className="text-xs font-medium text-gray-400">
                {ele.direction}
              </Text>
            </View>
          </View>

          {/* Benefits */}
          <Text className="font-medium text-gray-800 mb-2">
            {t('vaastu_elements_benefits_label')}
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            {ele.benefits.map((benefit, i) => (
              <View
                key={i}
                className="px-4 py-1 border border-gray-300 rounded-full"
              >
                <Text className="text-gray-600 text-sm">{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Suitable Items */}
          <Text className="font-medium text-gray-800 mb-2">
            {t('vaastu_elements_items_label')}
          </Text>
          <View className="flex-row flex-wrap gap-x-4 gap-y-2">
            {ele.items.map((item, i) => (
              <View key={i} className="flex-row items-center">
                <View className="w-2 h-2 bg-[#22C55E] rounded-full mr-2" />
                <Text className="text-gray-700 text-sm">{item}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}