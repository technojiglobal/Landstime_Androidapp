import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const Account = () => {
  const router = useRouter();

  return (
    <View className="bg-white rounded-xl p-6 shadow-md ml-6 w-[80%] mt-6">

      <Text className="border-b border-gray-200 text-gray-700 font-semibold text-sm pb-2 mb-4">
        Account
      </Text>

      <View className="flex flex-col space-y-4">

        {/* Edit Profile */}
        <TouchableOpacity
          onPress={() => router.push("/home/screens/Settings/Profile")}
          className="flex flex-row justify-between items-center"
        >
          <Text className="text-gray-500 text-md">Edit Profile</Text>
          <Text className="text-gray-400 text-xl">{">"}</Text>
        </TouchableOpacity>

        {/* Change Password */}
        <TouchableOpacity className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 text-md">Change Password</Text>
          <Text className="text-gray-400 text-xl">{">"}</Text>
        </TouchableOpacity>

        {/* Verification */}
        <View className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 text-md">Verification Status</Text>
          <Text className="text-[#139501] text-md font-semibold">Verified</Text>
        </View>

      </View>
    </View>
  );
};

export default Account;
