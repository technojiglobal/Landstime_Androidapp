//Sites//PropertyDetails.jsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = 345;
const CARD_HEIGHT = 298;

export default function PropertyListScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { area } = useLocalSearchParams();

  // All properties data mapped to locations
  const allProperties = [
    {
      id: 1,
      title: "Green Valley Site",
      subtitle: "Residential Plot Development",
      rating: 4.8,
      reviews: 124,
      location: "Akkayapalem",
      price: "₹5L–45L",
      image: require("../../../../../assets/Flat1.jpg"),
    },
    {
      id: 2,
      title: "Palm Grove Plots",
      subtitle: "Premium Land Parcels",
      rating: 4.5,
      reviews: 98,
      location: "Anandapuram",
      price: "₹8L–35L",
      image: require("../../../../../assets/Flat2.jpg"),
    },
    {
      id: 3,
      title: "Sunrise Estates",
      subtitle: "Gated Community Plots",
      rating: 4.6,
      reviews: 156,
      location: "Boyapalem",
      price: "₹12L–60L",
      image: require("../../../../../assets/Flat3.jpg"),
    },
    {
      id: 4,
      title: "Heritage Gardens",
      subtitle: "Villa Plots",
      rating: 4.3,
      reviews: 87,
      location: "Chinna Gadili",
      price: "₹6L–28L",
      image: require("../../../../../assets/Flat1.jpg"),
    },
    {
      id: 5,
      title: "Royal Enclave",
      subtitle: "Premium Residential Land",
      rating: 4.7,
      reviews: 203,
      location: "Dwarka Nagar",
      price: "₹15L–75L",
      image: require("../../../../../assets/Flat2.jpg"),
    },
    {
      id: 6,
      title: "Metro Park Sites",
      subtitle: "Investment Plots",
      rating: 4.4,
      reviews: 134,
      location: "Gajuwaka",
      price: "₹10L–50L",
      image: require("../../../../../assets/Flat3.jpg"),
    },
    {
      id: 7,
      title: "Coastal Paradise",
      subtitle: "Beach Side Plots",
      rating: 4.9,
      reviews: 278,
      location: "Kommadi",
      price: "₹25L–1.5Cr",
      image: require("../../../../../assets/Flat1.jpg"),
    },
  ];

  const filteredProperties = allProperties.filter(
    (property) =>
      property.location.toLowerCase() === String(area).toLowerCase() &&
      property.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollbarHeight = SCREEN_HEIGHT * (SCREEN_HEIGHT / contentHeight) * 0.3;

  const scrollIndicator = Animated.multiply(
    scrollY,
    SCREEN_HEIGHT / contentHeight
  ).interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [0, SCREEN_HEIGHT - scrollbarHeight],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 py-3">
        <TouchableOpacity onPress={() => router.push("/home/screens/Sites")}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold ml-2">{area} Properties</Text>
      </View>

      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Scrollable Content */}
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 60,
          }}
          onContentSizeChange={(_, h) => setContentHeight(h)}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Search Bar */}
          <View
            className="flex-row items-center bg-white rounded-full px-4 py-2 border border-gray-200 mt-1"
            style={{ width: CARD_WIDTH }}
          >
            <Ionicons name="search-outline" size={18} />
            <TextInput
              placeholder="Search by Properties"
              className="flex-1 ml-2 text-gray-800"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 15,
                color: "#6B7280",
              }}
            />
            <Ionicons name="mic-outline" size={18} />
            <Ionicons name="options-outline" size={18} style={{ marginLeft: 8 }} />
          </View>

          {/* Property Count */}
          <Text
            className="text-gray-400 text-sm mt-3 self-start"
            style={{
              width: CARD_WIDTH,
              textAlign: "left",
              paddingLeft: 30,
              fontFamily: "Poppins-Regular",
              fontSize: 12,
              color: "#6B7280",
            }}
          >
            {filteredProperties.length} properties found in {area}
          </Text>

          {/* Property Cards */}
          {filteredProperties.length > 0 ? (
            filteredProperties.map((item, index) => (
              <View
                key={item.id}
                style={{
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  backgroundColor: "white",
                  borderRadius: 24,
                  marginTop: index === 0 ? 10 : 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.15,
                  shadowRadius: 6,
                  elevation: 6,
                  overflow: "hidden",
                  borderWidth: 0.5,
                  borderColor: "#E5E7EB",
                }}
              >
                {/* Image (Clickable) */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push("/home/screens/Sites/(Property)")}
                >
                  <Image
                    source={item.image}
                    style={{
                      width: CARD_WIDTH,
                      height: 163,
                      borderTopLeftRadius: 17,
                      borderTopRightRadius: 17,
                    }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                {/* Bookmark Icon */}
                <View
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 12,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    padding: 6,
                    borderRadius: 50,
                  }}
                >
                  <Ionicons name="bookmark-outline" size={20} color="#16A34A" />
                </View>

                {/* Card Content */}
                <View style={{ paddingHorizontal: 12, paddingTop: 10 }}>
                  {/* Title (Clickable) */}
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => router.push("/home/screens/Sites/(Property)")}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins-Medium",
                        fontWeight: "500",
                        fontSize: 12,
                        color: "#16A34A",
                        marginTop: 5,
                      }}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginTop: 3,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 11,
                        color: "#6B7280",
                        maxWidth: "60%",
                      }}
                    >
                      {item.subtitle}
                    </Text>
                    <Image
                      source={require("../../../../../assets/verify.png")}
                      style={{ width: 45, height: 16, resizeMode: "contain", marginTop: 1 }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 6,
                    }}
                  >
                    <Image
                      source={require("../../../../../assets/star.png")}
                      style={{ width: 100, height: 30, resizeMode: "contain" }}
                    />
                    <Text
                      style={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 12,
                        color: "#000",
                        marginLeft: 6,
                      }}
                    >
                      {item.rating} ({item.reviews} reviews)
                    </Text>
                  </View>

                  <View className="flex-row items-center mt-1">
                    <Image
                      source={require("../../../../../assets/location.png")}
                      style={{ width: 10, height: 14, resizeMode: "contain" }}
                    />
                    <Text
                      style={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 11,
                        color: "#6B7280",
                        marginLeft: 4,
                      }}
                    >
                      {item.location}
                    </Text>
                  </View>

                  <View
                    style={{
                      position: "absolute",
                      right: 12,
                      bottom: 12,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#16A34A",
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Poppins-Medium",
                          fontSize: 11,
                          color: "#FFFFFF",
                          textAlign: "center",
                          paddingTop: 2,
                        }}
                      >
                        {item.price}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 80,
              }}
            >
              <Ionicons name="search-outline" size={64} color="#D1D5DB" />
              <Text
                style={{
                  color: "#6B7280",
                  fontSize: 16,
                  marginTop: 16,
                  fontFamily: "Poppins-Regular",
                }}
              >
                No properties found
              </Text>
              <Text
                style={{
                  color: "#9CA3AF",
                  fontSize: 14,
                  marginTop: 8,
                  fontFamily: "Poppins-Regular",
                }}
              >
                Try adjusting your search
              </Text>
            </View>
          )}
        </Animated.ScrollView>

        {/* Custom Green Scroll Bar */}
        <View
          style={{
            width: 7,
            marginRight: 6,
            borderRadius: 3,
            backgroundColor: "#E5E7EB",
            height: "90%",
            alignSelf: "center",
          }}
        >
          <Animated.View
            style={{
              width: 6,
              borderRadius: 3,
              backgroundColor: "#cbddd2ff",
              height: scrollbarHeight,
              transform: [{ translateY: scrollIndicator }],
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}