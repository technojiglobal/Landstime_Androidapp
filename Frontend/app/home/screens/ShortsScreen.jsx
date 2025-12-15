import {  Text, View,Image } from 'react-native'
import React from 'react'
import ShortsImg from "../../../assets/shorts.jpg"; // adjust path if needed

const ShortsScreen = () => {
  return (
    <View className='flex-1 justify-center items-center'>
      <Image
        source={ShortsImg}
        className="w-full h-full rounded-xl"
        resizeMode="contain"
      />
    </View>
  )
}

export default ShortsScreen

