import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// replace with your assets
const propertyImage = require("../../../assets/land.jpg");
const propertyImage2 = require("../../../assets/land.jpg");

export default function ViewContactScreen() {
  const router = useRouter();

  const similarProperties = [
    { id: "1", title: "Land", price: "₹25L", image: propertyImage },
    { id: "2", title: "Land", price: "₹25L", image: propertyImage2 },
  ];

  const callNumber = (phone) => {
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  const openWhatsApp = (phone) => {
    const numeric = phone.replace(/[^\d]/g, "");
    Linking.openURL(`https://wa.me/${numeric}`).catch(() => {});
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
     

      {/* Header Section */}
      <View className="flex-row items-start px-4  mt-7 py-3">
         <TouchableOpacity onPress={() => router.push("/home/screens/Sites/(Property)")}>
            <Ionicons name="chevron-back-outline" size={22} color="black" />
          </TouchableOpacity>
          <View className="ml-3 flex-1 mt-9">
          

          <View className="mt-2 flex-row   items-center">
            <View className="w-5 h-5 rounded-full bg-green-500 items-center justify-center ">
              <Ionicons name="checkmark" size={12} color="#fff" />
            </View>
            <Text className="text-sm mx-3 text-gray-700">
            Man, you can use these contact details to contact the Owner
          </Text>
          </View>
        </View>
      </View>

      {/* Contact Card */}
      <View className="mx-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
       
          {/* Avatar */}
        <View className="flex-row ">  
          <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center">
            <Text className="text-green-600 font-semibold text-sm">US</Text>
          </View>

          {/* Details */}
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-gray-900">
                Uma Shankar
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                umahomes@gmail.com
              </Text>
              </View>
        </View>
            <View className="flex-row items-center mt-3 ml-9">
              {/* Phone */}
              <TouchableOpacity
                onPress={() => callNumber("+917026033444")}
                className="flex-row items-center mr-6"
              >
                <View className="p-2 rounded-full bg-blue-100">
                  <Ionicons name="call" size={16} color="#2563EB" />
                </View>
                <Text className="ml-2 text-sm text-gray-700">
                  91-7026033444
                </Text>
              </TouchableOpacity>

              {/* WhatsApp */}
              <TouchableOpacity
                onPress={() => openWhatsApp("+917026033444")}
                className="flex-row items-center"
              >
                <View className="p-2 rounded-full bg-green-100 ml-14">
                  <FontAwesome name="whatsapp" size={16} color="#16A34A" />
                </View>
                <Text className="ml-2 text-sm text-gray-700">Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
       
      

      {/* Similar Properties Section */}
      <View className="px-4 mt-6">
        <Text className="text-[15px] font-semibold text-gray-900">
          Similar Properties
        </Text>
      </View>

      {/* Scrollable Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
        contentContainerStyle={{ paddingHorizontal: 16 }}
        snapToInterval={SCREEN_WIDTH * 0.7 + 14}
        decelerationRate="fast"
      >
        {similarProperties.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-xl h-72 mr-4 shadow-md overflow-hidden"
            style={{ width: SCREEN_WIDTH * 0.7 }}
          >
            {/* Property Image */}
            <View className="w-full aspect-video relative">
              <Image
                source={item.image}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute  w-20 h-8 bottom-2 left-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                <Text className="text-xs font-semibold text-gray-800  justify-center item-center">
                  {item.price}
                </Text>
              </View>
            </View>

            <View className="p-3">
              <Text className="font-semibold text-sm text-gray-900">
                {item.title}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                In Ghatkesar, Hyderabad · posted by Owner
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
