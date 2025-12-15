import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

export default function LogoutModal({ visible, onClose, onConfirm }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View className="bg-green-200 rounded-2xl w-full max-w-sm  h-40 p-5 items-center">
          
          <Text className="text-gray-600 text-lg font-semibold text-center mb-4 mt-4">
            Are you sure want to log out ?
          </Text>

          <View className="flex-row ml-24 w-56  mt-3">
            {/* No Button */}
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 rounded-2xl py-2  mx-1 items-center border-2 border-green-300"
            >
              <Text className="text-gray-400 font-semibold">No</Text>
            </TouchableOpacity>

            {/* Yes Button */}
            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1  rounded-2xl py-2 mx-1 items-center border-2 border-green-300"
            >
              <Text className="text-gray-400 font-semibold">Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
