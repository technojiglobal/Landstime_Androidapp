// Frontend/app/home/screens/Vaastu/Rooms.jsx

import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import VastuIcon from "../../../../assets/vastu.png";

export default function Rooms() {
  const { t } = useTranslation();

  const rooms = [
    {
      title: t('vaastu_room_main_entrance_title'),
      desc: t('vaastu_room_main_entrance_desc'),
      tips: [
        t('vaastu_room_main_entrance_tip_1'),
        t('vaastu_room_main_entrance_tip_2'),
        t('vaastu_room_main_entrance_tip_3'),
        t('vaastu_room_main_entrance_tip_4'),
      ],
    },
    {
      title: t('vaastu_room_kitchen_title'),
      desc: t('vaastu_room_kitchen_desc'),
      tips: [
        t('vaastu_room_kitchen_tip_1'),
        t('vaastu_room_kitchen_tip_2'),
        t('vaastu_room_kitchen_tip_3'),
        t('vaastu_room_kitchen_tip_4'),
      ],
    },
    {
      title: t('vaastu_room_pooja_title'),
      desc: t('vaastu_room_pooja_desc'),
      tips: [
        t('vaastu_room_pooja_tip_1'),
        t('vaastu_room_pooja_tip_2'),
        t('vaastu_room_pooja_tip_3'),
        t('vaastu_room_pooja_tip_4'),
      ],
    },
    {
      title: t('vaastu_room_study_title'),
      desc: t('vaastu_room_study_desc'),
      tips: [
        t('vaastu_room_study_tip_1'),
        t('vaastu_room_study_tip_2'),
        t('vaastu_room_study_tip_3'),
        t('vaastu_room_study_tip_4'),
      ],
    },
  ];

  return (
    <ScrollView className="mt-4 ">
      {rooms.map((room, index) => (
        <View
          key={index}
          className="bg-white rounded-xl p-5 border border-gray-200 mb-5"
        >
          {/* Title + Desc */}
          <Text className="text-lg font-semibold text-gray-900">
            {room.title}
          </Text>
          <Text className="text-gray-600 text-sm mt-1">{room.desc}</Text>

          {/* Vaastu Icon + Heading */}
          <View className="flex-row items-center gap-2 mt-3 mb-1">
            <Image
              source={VastuIcon}
              className="w-5 h-5"
              resizeMode="contain"
            />
            <Text className="font-semibold text-gray-700">
              {t('vaastu_rooms_tips_heading')}
            </Text>
          </View>

          {/* Bullet Tips */}
          {room.tips.map((tip, i) => (
            <View key={i} className="flex-row items-start gap-2 mt-1">
              <View className="w-2 h-2 bg-[#22C55E] rounded-full mt-1" />
              <Text className="text-gray-700 text-sm">{tip}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}