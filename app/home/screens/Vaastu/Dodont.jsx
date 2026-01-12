// Frontend/app/home/screens/Vaastu/Dodont.jsx

import React from "react";
import { View, Text, Image } from "react-native";
import { useTranslation } from "react-i18next";
import TickIcon from "../../../../assets/Do.png";
import WrongIcon from "../../../../assets/Dont.png";

export default function Dodont() {
  const { t } = useTranslation();

  const dos = [
    t('vaastu_do_1'),
    t('vaastu_do_2'),
    t('vaastu_do_3'),
    t('vaastu_do_4'),
    t('vaastu_do_5'),
    t('vaastu_do_6'),
    t('vaastu_do_7'),
    t('vaastu_do_8'),
    t('vaastu_do_9'),
  ];

  const donts = [
    t('vaastu_dont_1'),
    t('vaastu_dont_2'),
    t('vaastu_dont_3'),
    t('vaastu_dont_4'),
    t('vaastu_dont_5'),
    t('vaastu_dont_6'),
    t('vaastu_dont_7'),
    t('vaastu_dont_8'),
  ];

  return (
    <View className="mt-4 mb-12 px-4">

      {/* DO's */}
      <View className="bg-white rounded-xl p-5 border border-gray-300 mb-5">
        <View className="flex-row items-center gap-2 mb-3">
          <Image source={TickIcon} className="w-5 h-5" resizeMode="contain" />
          <Text className="text-lg font-semibold text-[#17AB4E]">
            {t('vaastu_dos_title')}
          </Text>
        </View>

        {dos.map((text, i) => (
          <View key={i} className="flex-row items-start gap-2 mb-2">
            <View className="w-2 h-2 bg-[#22C55E] rounded-full mt-1" />
            <Text className="text-gray-800 text-sm leading-5">{text}</Text>
          </View>
        ))}
      </View>

      {/* DON'Ts */}
      <View className="bg-white rounded-xl p-5 border border-gray-300 mb-5">
        <View className="flex-row items-center gap-2 mb-3">
          <Image source={WrongIcon} className="w-5 h-5" resizeMode="contain" />
          <Text className="text-lg font-semibold text-[#CD0007]">
            {t('vaastu_donts_title')}
          </Text>
        </View>

        {donts.map((text, i) => (
          <View key={i} className="flex-row items-start gap-2 mb-2">
            <View className="w-2 h-2 bg-[#22C55E] rounded-full mt-1" />
            <Text className="text-gray-800 text-sm leading-5">{text}</Text>
          </View>
        ))}
      </View>

    </View>
  );
}