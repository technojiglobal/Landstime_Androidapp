// Landstime_Androidapp/Frontend/app/home/screens/Settings/Profile.jsx
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getUserProfile, updateUserProfile } from "../../../../utils/api";
import { API_URL } from "../../../../utils/apiConfig";
import { getImageUrl } from "../../../../utils/imageHelper";

export default function Profile() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [backupProfile, setBackupProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [focused, setFocused] = useState(null);

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await getUserProfile();
    if (res.success) {
      const user = res.data.data || res.data;
      setProfile({
        ...user,
        name: typeof user.name === "object" ? user.name.en : user.name,
      });
    }
  };

  /* ---------------- IMAGE PICKER ---------------- */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfile({ ...profile, profileImage: result.assets[0].uri });
    }
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", profile.name);
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
      await fetchProfile();
      setIsEditing(false);
    }
  };

  /* ---------------- SAFE INPUT CLASS ---------------- */
  const inputClass = (key) =>
    `border-b pb-1 text-gray-700 ${
      focused === key ? "border-[#16A34A]" : "border-gray-300"
    }`;

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      {/* ---------- FIXED HEADER ---------- */}
      <View className="h-14 flex-row items-center mt-8 px-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#16A34A" />

        </TouchableOpacity>
        <Text className="ml-4 text-lg font-semibold">Profile</Text>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="flex-1 px-4 pt-6"
      >
        {/* ---------- PROFILE HEADER ---------- */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity disabled={!isEditing} onPress={pickImage}>
            <Image
  source={
    profile.profileImage
      ? {
          uri: profile.profileImage.startsWith("file://")
            ? profile.profileImage
            : getImageUrl(profile.profileImage),
        }
      : require("../../../../assets/profile.png")
  }
  className="w-24 h-24 rounded-full"
/>
          </TouchableOpacity>

          <View className="ml-4 flex-1">
            {isEditing ? (
              <TextInput
                value={profile.name}
                onChangeText={(t) => setProfile({ ...profile, name: t })}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                className={inputClass("name")}
              />
            ) : (
              <Text className="text-xl font-semibold text-[#16A34A]">
                {profile.name}
              </Text>
            )}
            <Text className="text-gray-500 mt-1">{profile.phone}</Text>
          </View>

          {!isEditing && (
            <TouchableOpacity
              onPress={() => {
                setBackupProfile(profile);
                setIsEditing(true);
              }}
              className="bg-[#16A34A]/10 p-2 rounded-lg"
            >
              <Ionicons name="pencil" size={18} color="#16A34A" />
            </TouchableOpacity>
          )}
        </View>

        {/* ---------- ACTION BUTTONS ---------- */}
        {isEditing && (
          <View className="flex-row justify-end gap-3 mb-4">
            <TouchableOpacity
              onPress={() => {
                setProfile(backupProfile);
                setIsEditing(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <Text className="text-gray-600">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="px-4 py-2 bg-[#16A34A] rounded-lg"
            >
              <Text className="text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ---------- CONTACT INFO ---------- */}
        <View className="bg-white border border-gray-100 rounded-xl p-4 mb-4 shadow">
          <Text className="text-lg font-semibold mb-3">
            Contact Information
          </Text>

          <TextInput
            value={profile.email}
            editable={isEditing}
            onChangeText={(t) => setProfile({ ...profile, email: t })}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            className={`${inputClass("email")} mb-3`}
          />

          <TextInput
            value={profile.address || ""}
            editable={isEditing}
            onChangeText={(t) => setProfile({ ...profile, address: t })}
            onFocus={() => setFocused("address")}
            onBlur={() => setFocused(null)}
            className={inputClass("address")}
            placeholder="Address"
          />
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

        {/* ---------- ABOUT ---------- */}
        <View className="bg-white border mt-6 border-gray-100 rounded-xl p-4 shadow">
          <Text className="font-semibold mb-2">About</Text>
          {isEditing ? (
            <TextInput
              multiline
              value={profile.about || ""}
              onChangeText={(t) => setProfile({ ...profile, about: t })}
              onFocus={() => setFocused("about")}
              onBlur={() => setFocused(null)}
              className={`border rounded-lg p-2 text-gray-700 ${
                focused === "about"
                  ? "border-[#16A34A]"
                  : "border-gray-300"
              }`}
            />
          ) : (
            <Text className="text-gray-600 leading-5">
              {profile.about || "—"}
            </Text>
          )}
        </View>

        <View className="h-24" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
