// Landstime_Androidapp/Frontend/app/home/screens/UploadScreens/HowTo360Modal.jsx

import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const HowTo360Modal = ({
  visible,
  onClose,
  onOpenPlayStore,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center">

        <View className="bg-white w-[92%] rounded-2xl overflow-hidden">

          {/* Header */}
          <View className="flex-row items-center text-center justify-between px-4 py-3">
            <Text className="text-lg text-gray-900">
              How to Take 360° Property Photos
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Video */}
          <View className="px-4">
            <View className="rounded-xl overflow-hidden relative">
              <Video
                source={{
                  uri: "https://www.w3schools.com/html/mov_bbb.mp4",
                }}
                style={{ width: "100%", height: 190 }}
                resizeMode="cover"
                useNativeControls={false}
              />

              {/* Play Overlay */}
              <View className="absolute inset-0 items-center justify-center">
                <View className="w-14 h-14 bg-white rounded-full items-center justify-center shadow">
                  <Ionicons name="play" size={26} color="#22C55E" />
                </View>
              </View>
            </View>
          </View>

          {/* Content */}
          <ScrollView className="px-4 mt-4" showsVerticalScrollIndicator={false}>

            <Text className="text-lg text-gray-800 mb-3">
              Step-by-Step Guide:
            </Text>

            {/* Step 1 */}
            <View className="flex-row mb-4">
              <View className="w-6 h-6 rounded-full bg-green-100 items-center justify-center mr-3">
                <Text className="text-green-600 text-xs font-bold">1</Text>
              </View>
              <View className="flex-1">
                <Text className=" font-medium">
                  Install Go Street App
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Search for “Go Street” in playstore and install the app
                </Text>
              </View>
            </View>

            {/* Step 2 */}
            <View className="flex-row mb-4">
              <View className="w-6 h-6 rounded-full bg-green-100 items-center justify-center mr-3">
                <Text className="text-green-600 text-xs font-bold">2</Text>
              </View>
              <View className="flex-1">
                <Text className=" font-medium">
                  Capture Panorama Photos
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Open the app, stand at the center of the room, and follow the
                  on-screen guide to capture around 30 photos while slowly
                  rotating.
                </Text>
              </View>
            </View>

            {/* Step 3 */}
            <View className="flex-row mb-4">
              <View className="w-6 h-6 rounded-full bg-green-100 items-center justify-center mr-3">
                <Text className="text-green-600 text-xs font-bold">3</Text>
              </View>
              <View className="flex-1">
                <Text className=" font-medium">
                  Generate JPEG File
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                  The app stitches the photos automatically and creates a single
                  panorama JPEG saved to your gallery.
                </Text>
              </View>
            </View>

            {/* Step 4 */}
            <View className="flex-row mb-5">
              <View className="w-6 h-6 rounded-full bg-green-100 items-center justify-center mr-3">
                <Text className="text-green-600 text-xs font-bold">4</Text>
              </View>
              <View className="flex-1">
                <Text className=" font-medium">
                  Upload Here
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Return to this screen and upload your panorama JPEG. The 360°
                  view will be enabled automatically.
                </Text>
              </View>
            </View>

            {/* Pro Tip */}
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
              <Text className="text-blue-700 font-medium mb-1">
                Pro Tip:
              </Text>
              <Text className="text-blue-600 text-sm">
                Take photos during daytime with good lighting. Capture 5–8 photos
                covering all rooms.
              </Text>
            </View>

          </ScrollView>

          {/* Footer */}
          <View className="flex-row justify-end px-4 py-3 border-t border-gray-200 gap-3">
            <TouchableOpacity onPress={onClose} className="border border-gray-300 px-4 py-2 rounded-lg">
              <Text className="text-gray-400  font-medium">
                Close
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onOpenPlayStore}
              className="bg-green-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">
                Open Playstore
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default HowTo360Modal;
