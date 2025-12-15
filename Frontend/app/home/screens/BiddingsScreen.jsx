import { Text, View,TouchableOpacity } from 'react-native'
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


const SettingsScreen = () => {
  const router = useRouter();
  return (
    <View className="flex-1 justify-center items-center">
       <TouchableOpacity
        onPress={() =>router.push("/(tabs)/home")}
        className="absolute top-6 left-5 z-10  p-2 "
      >
        <Ionicons name="chevron-back-outline" size={22} color="black" />
      </TouchableOpacity>

      <Text className='font-bold '>Bidding Screen coming soon...</Text>
    </View>
  )
}

export default SettingsScreen;

