import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Call() {
  const router = useRouter();
  const { name, image } = useLocalSearchParams();

  const [mute, setMute] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [record, setRecord] = useState(false);

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">

      {/* Calling text */}
      <Text className="text-2xl font-bold text-gray-600 mb-2">Calling...</Text>

      {/* Profile Image */}
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-32 h-32 rounded-full mb-4"
          resizeMode="cover"
        />
      ) : (
        <View className="w-32 h-32 rounded-full bg-gray-300 items-center justify-center mb-4">
          <Ionicons name="person-circle" size={120} color="#999" />
        </View>
      )}

      {/* Name */}
      <Text className="text-2xl font-bold text-[#0C2E2F] mb-10">
        {name || "Unknown"}
      </Text>

      {/* Control Buttons */}
      <View className="flex-row items-center justify-center space-x-10">

        {/* Mute */}
        <TouchableOpacity
          className={`p-5 rounded-lg mx-2 ${
            mute ? "bg-green-100" : "bg-gray-200"
          }`}
          onPress={() => setMute(!mute)}
        >
          <Ionicons
            name={mute ? "mic-off" : "mic"}
            size={28}
            color={mute ? "#22C55E" : "#555"}
          />
        </TouchableOpacity>

        {/* Speaker */}
        <TouchableOpacity
          className={`p-5 rounded-lg mx-2 ${
            speaker ? "bg-green-100" : "bg-gray-200"
          }`}
          onPress={() => setSpeaker(!speaker)}
        >
          <Ionicons
            name={speaker ? "volume-high" : "volume-medium"}
            size={28}
            color={speaker ? "#22C55E" : "#555"}
          />
        </TouchableOpacity>

        {/* Record */}
        <TouchableOpacity
          className={`p-5 rounded-lg mx-2 ${
            record ? "bg-green-100" : "bg-gray-200"
          }`}
          onPress={() => setRecord(!record)}
        >
          <Ionicons
            name={record ? "radio-button-on" : "radio-button-off"}
            size={28}
            color={record ? "red" : "#555"}
          />
        </TouchableOpacity>

      </View>

      {/* End Call Button */}
      <TouchableOpacity
        className="mt-16 bg-[#C90000] w-80 h-16 rounded-full items-center justify-center"
        onPress={() => router.back()}   // closes call screen
      >
        <Ionicons name="call" size={36} color="white" />
      </TouchableOpacity>
    </View>
  );
}
