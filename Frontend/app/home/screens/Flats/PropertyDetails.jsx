


//Frontend/app/home/screens/Flats/PropertyDetails.jsx
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getApprovedProperties } from "../../../../utils/propertyApi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import i18n  from "../../../../i18n/index"


const getLocalizedText = (field, language) => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[language] || field.en || field.te || field.hi || '';
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = 345;
const CARD_HEIGHT = 298;

// ✅ Helper function OUTSIDE component - extract language text


export default function PropertyListScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
 const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();
  const { areaKey, districtKey } = useLocalSearchParams();

  // ✅ Get current language
const currentLanguage = i18n.language || 'en';
  
  // Get translated area name from areaKey
  const areaName = areaKey ? t(`areas.${areaKey}`) : '';

  // ✅ FETCH REAL PROPERTIES
// ✅ FETCH REAL PROPERTIES
  useEffect(() => {
    fetchProperties();
  }, [areaKey]);

  // ✅ ADD THIS: Refetch when language changes
useEffect(() => {
  if (areaKey) {
    fetchProperties();
  }
}, [i18n.language]); // Refetch when language changes


const fetchProperties = async () => {
  try {
    setLoading(true);
    console.log('🔍 Fetching properties for areaKey:', areaKey);
    
    // ✅ Get current language from i18next (not AsyncStorage)
    const currentLang = i18n.language || 'en';
    console.log('🌐 Fetching in language:', currentLang);
    
    const response = await getApprovedProperties(null, 1, currentLang);
    
    if (response.success) {
      console.log('✅ All properties fetched:', response.data);
      setProperties(response.data.data || []);
    } else {
      console.error('❌ Failed to fetch properties:', response.error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    setLoading(false);
  }
};

  // ✅ FILTER BY AREA (location)
const filteredProperties = properties.filter((property) => {
  const propertyAreaKey = property.areaKey || '';
  
  // ✅ Use helper function to extract title
  const propertyTitle = getLocalizedText(property.propertyTitle, currentLanguage);
  
  // Match by areaKey (consistent across all languages)
  const matchesArea = propertyAreaKey === areaKey;
  const matchesSearch = propertyTitle.toLowerCase().includes(searchQuery.toLowerCase());
  
  return matchesArea && matchesSearch;
});

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
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="flex-row items-center px-5 py-3">

        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold ml-2">{areaName} Properties</Text>
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
           {filteredProperties.length} properties found in {areaName}
          </Text>

          {/* ✅ LOADING SPINNER */}
          {loading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 50 }}>
              <ActivityIndicator size="large" color="#16A34A" />
              <Text style={{ marginTop: 16, fontFamily: "Poppins-Regular", color: '#6B7280' }}>
                Loading properties...
              </Text>
            </View>
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((item, index) => (
              <View
                key={item._id}  // ✅ CHANGED: item.id → item._id
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
                {/* ✅ REAL IMAGE with fallback */}
              <TouchableOpacity
  activeOpacity={0.8}
  onPress={() => router.push({
    pathname: '/home/screens/Flats/(Property)',
    params: { propertyId: item._id }
  })}
>

                


                  <Image
                    source={
                      item.images && item.images.length > 0
                        ? { uri: `http://10.37.92.184:8000/${item.images[0]}` }
                        : require("../../../../assets/Flat1.jpg")
                    }
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
                  {/* ✅ REAL TITLE */}
                 <TouchableOpacity
  activeOpacity={0.6}
  onPress={() => router.push({
    pathname: '/home/screens/Flats/(Property)',
    params: { propertyId: item._id }
  })}
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
 {getLocalizedText(item.propertyTitle, currentLanguage) || 'Property'}
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
                    {/* ✅ REAL PROPERTY TYPE */}
                    <Text
                      style={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 11,
                        color: "#6B7280",
                        maxWidth: "60%",
                      }}
                    >
                      {item.propertyType || 'Property Type'}
                    </Text>
                    <Image
                      source={require("../../../../assets/verify.png")}
                      style={{ width: 45, height: 16, resizeMode: "contain", marginTop: 1 }}
                    />
                  </View>

                  {/* ✅ RATING - Using dummy data for now (backend doesn't have ratings yet) */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 6,
                    }}
                  >
                    <Image
                      source={require("../../../../assets/star.png")}
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
                      4.5 (0 reviews)
                    </Text>
                  </View>

                  {/* ✅ REAL LOCATION */}
                  <View className="flex-row items-center mt-1">
                    <Image
                      source={require("../../../../assets/location.png")}
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
                    {getLocalizedText(item.area, currentLanguage) || getLocalizedText(item.location, currentLanguage) || areaName}
                    </Text>
                  </View>

                  {/* ✅ REAL PRICE */}
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
                        ₹{item.expectedPrice ? (item.expectedPrice / 100000).toFixed(0) + 'L' : 'N/A'}
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