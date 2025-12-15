import React from "react";
import { View, Text, Image } from "react-native";
import TickIcon from "../../../../assets/Do.png";
import WrongIcon from "../../../../assets/Dont.png";

export default function Dodont() {
  const dos = [
    "Avoid sleeping with feet towards south",
    "Ensure proper ventilation and natural light",
    "Use light and soothing colors",
    "Plant trees on South and West sides",
    "Use quality materials for construction",
    "Maintain regular prayer and meditation",
    "Keep books organized and clean",
    "Keep water storage in North or Northeast",
    "Face East or North while cooking/studying",
  ];

  const donts = [
    "Don’t place toilets in Northeast corner",
    "Avoid sleeping with feet towards south",
    "Don’t keep broken or unused items",
    "Avoid dark colors in Northeast",
    "Don’t place mirrors in bedrooms facing bed",
    "Avoid overhead water tanks in Northeast",
    "Don’t place kitchen in Northeast corner",
    "Avoid keeping thorny plants inside house",
  ];

  return (
    <View className="mt-4 mb-12 px-4">

      {/* DO's */}
      <View className="bg-white rounded-xl p-5 border border-gray-300 mb-5">
        <View className="flex-row items-center gap-2 mb-3">
          <Image source={TickIcon} className="w-5 h-5" resizeMode="contain" />
          <Text className="text-lg font-semibold text-[#17AB4E]">Vaastu Do's</Text>
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
          <Text className="text-lg font-semibold text-[#CD0007]">Vaastu Don'ts</Text>
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
