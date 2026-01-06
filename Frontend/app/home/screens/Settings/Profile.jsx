// src/screens/Profile/ProfileScreen.jsx
import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// Update path if needed
// 🔽 ADD
import { useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { getUserProfile, updateUserProfile } from "../../../../utils/api";
const IMAGE_BASE_URL = "http://10.10.7.127:8000"; // backend URL
export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  // 🔽 ADD
  

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await getUserProfile();
    if (res.success) {
      setProfile(res.data.data || res.data);
    }
  };


  // 🔽 ADD
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfile({ ...profile, profileImage: result.assets[0].uri });
    }
  };


  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

  // Reference device: iPhone 14 Pro Max
  const REF_WIDTH = 430;
  const REF_HEIGHT = 932;

  const scaleWidth = (size) => (SCREEN_WIDTH / REF_WIDTH) * size;
  const scaleHeight = (size) => (SCREEN_HEIGHT / REF_HEIGHT) * size;
  // 🔽 REPLACE
 const handleSave = async () => {
  const formData = new FormData();

  formData.append("name", profile.name);
  formData.append("phone", profile.phone);
  formData.append("email", profile.email);
  formData.append("address", profile.address || "");
  formData.append("about", profile.about || "");

  if (profile.profileImage?.startsWith("file://")) {
    formData.append("profileImage", {
      uri: profile.profileImage,
      name: "profile.jpg",
      type: "image/jpeg",
    });
  }

  const res = await updateUserProfile(formData);

  if (res.success) {
    // 🔽 IMPORTANT: re-fetch from backend
    await fetchProfile();
    setIsEditing(false);
  }
};


  const router = useRouter();
  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Loading profile...</Text>
      </View>
    );
  }
  return (


    <ScrollView className="mt-12 flex-1 bg-white px-4 pt-12">
     


      {/* Profile Header */}
      <View className="flex-row items-center mb-6 mt-2">

        {/* Profile Image */}
         <TouchableOpacity disabled={!isEditing} onPress={pickImage}>
        <Image
          source={
            profile.profileImage
              ? {
                uri: profile.profileImage.startsWith("file://")
                  ? profile.profileImage
                  : `${IMAGE_BASE_URL}${profile.profileImage}`,
              }
              : require("../../../../assets/profile.png")
          }
          className="w-24 h-24 rounded-full"
        />

      </TouchableOpacity>

        {/* Name + Phone */}
        <View className="ml-4 flex-1">

          {/* Name */}
          {isEditing ? (
            <TextInput
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              className="text-xl font-semibold text-[#16A34A] border-b pb-1"
            />
          ) : (
            <Text className="text-xl font-semibold text-[#16A34A]">
              {profile.name}
            </Text>
          )}

          {/* Phone */}
          {isEditing ? (
            <TextInput
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
              className="text-gray-500 mt-2 border-b border-gray-400 pb-1 w-36"
            />
          ) : (
            <Text className="text-gray-500 mt-1">{profile.phone}</Text>
          )}

        </View>

        {/* Edit Button */}
        <TouchableOpacity
          onPress={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
          className="bg-[#16A34A]/10 p-2 rounded-lg ml-2"
        >
          <Ionicons
            name={isEditing ? "checkmark" : "pencil"}
            size={18}
            color="#16A34A"
          />
        </TouchableOpacity>

      </View>

      {/* Contact Information */}
      <View className="bg-white border border-gray-100 rounded-2xl p-4"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        <Text className="text-lg font-semibold mb-3">Contact Information</Text>

        <View className="flex-row items-center mb-3">
          <Ionicons name="call-outline" size={18} color="gray" />
          <Text className="ml-3 text-gray-700">{profile.phone}</Text>
        </View>

        <View className="flex-row items-center mb-3">
          <Ionicons name="mail-outline" size={18} color="gray" />
          {isEditing ? (
            <TextInput
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              className="ml-3 border-b flex-1 text-gray-700"
            />
          ) : (
            <Text className="ml-3 text-gray-700">{profile.email}</Text>
          )}
        </View>

        <Ionicons name="location-outline" size={18} color="gray" />
        {isEditing ? (
          <TextInput
            value={profile.address || ""}
            onChangeText={(text) =>
              setProfile({ ...profile, address: text })
            }
            className="ml-3 border-b flex-1 text-gray-700"
            placeholder="Address"
          />
        ) : (
          <Text className="ml-3 text-gray-700">
            {profile.address || "—"}
          </Text>
        )}

      </View>

      {/* Statistics Section */}
      <View className="mt-5">
        <View className="flex-row justify-between">
          <View className="w-[48%] bg-white border border-gray-100 rounded-xl p-4 items-center">
            <View className="bg-[#E3F7E7] p-3 rounded-full mb-1">
              <Ionicons name="home-outline" size={22} color="#16A34A" />
            </View>

            <Text className="text-xl font-bold mt-1">{profile.listed}</Text>
            <Text className="text-sm text-gray-500">Properties Listed</Text>
          </View>

          <View className="w-[48%] bg-white border border-gray-100 rounded-xl p-4 items-center">
            <View className="bg-[#E3F7E7] p-3 rounded-full mb-1">
              <Ionicons name="briefcase-outline" size={22} color="#16A34A" />
            </View>

            <Text className="text-xl font-bold mt-1">{profile.sold}</Text>
            <Text className="text-sm text-gray-500">Properties Sold</Text>
          </View>
        </View>

        <View className="flex-row justify-between mt-4">
          <View className="w-[48%] bg-white border border-gray-100 rounded-xl p-4 items-center">
            <View className="bg-[#E3F7E7] p-3 rounded-full mb-1">
              <Ionicons name="star-outline" size={22} color="#16A34A" />
            </View>

            <Text className="text-xl font-bold mt-1">{profile.rating}</Text>
            <Text className="text-sm text-gray-500">Client Rating</Text>
          </View>

          <View className="w-[48%] bg-white border border-gray-100 rounded-xl p-4 items-center">
            <View className="bg-[#E3F7E7] p-3 rounded-full mb-1">
              <Ionicons name="ribbon-outline" size={20} color="#16A34A" />
            </View>

            <Text className="text-xl font-bold mt-1">
              {profile.reviews}
            </Text>

            <Text className="text-sm text-gray-500">
              Properties Reviewed
            </Text>
          </View>

        </View>
      </View>

      {/* About */}
      <View className="bg-white border border-gray-100 rounded-xl p-4 mt-6"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        <Text className="font-semibold mb-2">About</Text>

        {isEditing ? (
          <TextInput
            multiline
            value={profile.about}
            onChangeText={(text) => setProfile({ ...profile, about: text })}
            className="text-gray-700 border p-2 rounded-lg"
          />
        ) : (
          <Text className="text-gray-600 leading-5">{profile.about}</Text>
        )}
      </View>

      <View className="h-20" />
    </ScrollView>
  );
}
