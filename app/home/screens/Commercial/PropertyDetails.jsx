// //Frontend/app/home/screens/Commercial/PropertyDetails.jsx
// import React, { useRef, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   Animated,
//   Dimensions,StatusBar
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter, useLocalSearchParams } from "expo-router";

// const { height: SCREEN_HEIGHT } = Dimensions.get("window");
// const CARD_WIDTH = 345;
// const CARD_HEIGHT = 298;

// export default function PropertyListScreen() {
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const [contentHeight, setContentHeight] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const router = useRouter();
//   const { area } = useLocalSearchParams();

//   // Property data mapped to locations
//   const allProperties = [
//     {
//       id: 1,
//       name: "Green Valley Site",
//       type: "Residential Plot Development",
//       image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
//       rating: 4.8,
//       reviews: 124,
//       location: "Akkayapalem",
//       price: "₹8L - 4Cr",
//       verified: true,
//     },
//     {
//       id: 2,
//       name: "Harbor View Plaza",
//       type: "Commercial Complex",
//       image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
//       rating: 4.6,
//       reviews: 98,
//       location: "Akkayapalem",
//       price: "₹5Cr - 12Cr",
//       verified: true,
//     },
//     {
//       id: 3,
//       name: "Sai Enclave",
//       type: "Premium Resort",
//       image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
//       rating: 4.2,
//       reviews: 89,
//       location: "Anandapuram",
//       price: "₹2Cr - 4Cr",
//       verified: true,
//     },
//     {
//       id: 4,
//       name: "Tech Innovation Hub",
//       type: "IT Office Space",
//       image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
//       rating: 4.7,
//       reviews: 156,
//       location: "Anandapuram",
//       price: "₹3Cr - 8Cr",
//       verified: false,
//     },
//     {
//       id: 5,
//       name: "Coastal Business Center",
//       type: "Office Complex",
//       image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
//       rating: 4.4,
//       reviews: 112,
//       location: "Boyapalem",
//       price: "₹1.5Cr - 5Cr",
//       verified: true,
//     },
//     {
//       id: 6,
//       name: "Heritage Mall",
//       type: "Shopping Complex",
//       image: "https://images.unsplash.com/photo-1519167758481-83f29da8c8b1?w=800",
//       rating: 4.1,
//       reviews: 67,
//       location: "Chinna Gadili",
//       price: "₹80L - 3Cr",
//       verified: false,
//     },
//     {
//       id: 7,
//       name: "Golden Plaza",
//       type: "Retail Space",
//       image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
//       rating: 4.3,
//       reviews: 145,
//       location: "Dwaraka Nagar",
//       price: "₹1Cr - 4Cr",
//       verified: true,
//     },
//     {
//       id: 8,
//       name: "Prime Corporate Tower",
//       type: "Business Park",
//       image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
//       rating: 4.8,
//       reviews: 203,
//       location: "Dwaraka Nagar",
//       price: "₹5Cr - 15Cr",
//       verified: true,
//     },
//     {
//       id: 9,
//       name: "Industrial Park Zone",
//       type: "Warehouse & Factory",
//       image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800",
//       rating: 4.0,
//       reviews: 78,
//       location: "Gajuwaka",
//       price: "₹2Cr - 7Cr",
//       verified: false,
//     },
//     {
//       id: 10,
//       name: "Metro Trade Center",
//       type: "Commercial Hub",
//       image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
//       rating: 4.5,
//       reviews: 167,
//       location: "Gajuwaka",
//       price: "₹3Cr - 10Cr",
//       verified: true,
//     },
//     {
//       id: 11,
//       name: "Seaside Business Bay",
//       type: "Office Space",
//       image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
//       rating: 4.6,
//       reviews: 134,
//       location: "Kommadi",
//       price: "₹2.5Cr - 6Cr",
//       verified: true,
//     },
//     {
//       id: 12,
//       name: "Tech Park Plaza",
//       type: "IT Office Space",
//       image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
//       rating: 4.7,
//       reviews: 203,
//       location: "Madhurawada",
//       price: "₹3Cr - 8Cr",
//       verified: true,
//     },
//     {
//       id: 13,
//       name: "Innovation Square",
//       type: "Tech Campus",
//       image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
//       rating: 4.9,
//       reviews: 245,
//       location: "Madhurawada",
//       price: "₹6Cr - 18Cr",
//       verified: true,
//     },
//     {
//       id: 14,
//       name: "Prestige Towers",
//       type: "Premium Office Complex",
//       image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
//       rating: 4.5,
//       reviews: 189,
//       location: "MVP Colony",
//       price: "₹4Cr - 12Cr",
//       verified: true,
//     },
//     {
//       id: 15,
//       name: "Royal Gardens Commercial",
//       type: "Mixed Use Development",
//       image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
//       rating: 4.4,
//       reviews: 156,
//       location: "MVP Colony",
//       price: "₹2Cr - 8Cr",
//       verified: false,
//     },
//     {
//       id: 16,
//       name: "Ocean View Towers",
//       type: "Commercial Complex",
//       image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
//       rating: 4.5,
//       reviews: 156,
//       location: "Rushikonda",
//       price: "₹5Cr - 10Cr",
//       verified: false,
//     },
//     {
//       id: 17,
//       name: "Beach Front Business Center",
//       type: "Premium Office",
//       image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
//       rating: 4.8,
//       reviews: 198,
//       location: "Rushikonda",
//       price: "₹7Cr - 20Cr",
//       verified: true,
//     },
//     {
//       id: 18,
//       name: "Elite Corporate Hub",
//       type: "Business Complex",
//       image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
//       rating: 4.7,
//       reviews: 167,
//       location: "Siripuram",
//       price: "₹3.5Cr - 9Cr",
//       verified: true,
//     },
//     {
//       id: 19,
//       name: "Marina Trade Complex",
//       type: "Waterfront Commercial",
//       image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
//       rating: 4.6,
//       reviews: 178,
//       location: "Visakhapatnam Beach Road",
//       price: "₹8Cr - 25Cr",
//       verified: true,
//     },
//     {
//       id: 20,
//       name: "Beach Plaza Mall",
//       type: "Shopping & Entertainment",
//       image: "https://images.unsplash.com/photo-1519167758481-83f29da8c8b1?w=800",
//       rating: 4.4,
//       reviews: 234,
//       location: "Visakhapatnam Beach Road",
//       price: "₹10Cr - 30Cr",
//       verified: true,
//     },
//   ];

//   const filteredProperties = allProperties.filter(
//     (property) =>
//       property.location.toLowerCase() === String(area).toLowerCase() &&
//       property.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const scrollbarHeight = SCREEN_HEIGHT * (SCREEN_HEIGHT / contentHeight) * 0.3;

//   const scrollIndicator = Animated.multiply(
//     scrollY,
//     SCREEN_HEIGHT / contentHeight
//   ).interpolate({
//     inputRange: [0, SCREEN_HEIGHT],
//     outputRange: [0, SCREEN_HEIGHT - scrollbarHeight],
//     extrapolate: "clamp",
//   });

//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, index) => (
//       <Ionicons
//         key={index}
//         name={index < Math.floor(rating) ? "star" : "star-outline"}
//         size={14}
//         color="#FCD34D"
//         style={{ marginRight: 2 }}
//       />
//     ));
//   };

//   return (
//     <SafeAreaView className="flex-1">
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
//       {/* Header */}
//       <View className="flex-row items-center px-5 py-3">
//         <TouchableOpacity onPress={() => router.push('/home/screens/Commercial/SelectSite')}>
//           <Ionicons name="chevron-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="text-xl font-semibold ml-2">{area} Properties</Text>
//       </View>

//       <View style={{ flex: 1, flexDirection: "row" }}>
//         {/* Scrollable Content */}
//         <Animated.ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{
//             alignItems: "center",
//             paddingBottom: 60,
//           }}
//           onContentSizeChange={(_, h) => setContentHeight(h)}
//           onScroll={Animated.event(
//             [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//             { useNativeDriver: false }
//           )}
//           scrollEventThrottle={16}
//         >
//           {/* Search Bar */}
//           <View
//             className="flex-row items-center bg-white rounded-full px-4 py-2 border border-gray-200 mt-1"
//             style={{ width: CARD_WIDTH }}
//           >
//             <Ionicons name="search-outline" size={18} />
//             <TextInput
//               placeholder="Search by Properties"
//               className="flex-1 ml-2 text-gray-800"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               style={{
//                 fontFamily: "Poppins-Regular",
//                 fontSize: 15,
//                 color: "#6B7280",
//               }}
//             />
//             <Ionicons name="mic-outline" size={18} />
//             <Ionicons name="options-outline" size={18} style={{ marginLeft: 8 }} />
//           </View>

//           {/* Property Count */}
//           <Text
//             className="text-gray-400 text-sm mt-3 self-start"
//             style={{
//               width: CARD_WIDTH,
//               textAlign: "left",
//               paddingLeft: 30,
//               fontFamily: "Poppins-Regular",
//               fontSize: 12,
//               color: "#6B7280",
//             }}
//           >
//             {filteredProperties.length} properties found in {area}
//           </Text>

//           {/* Property Cards */}
//           {filteredProperties.length > 0 ? (
//             filteredProperties.map((property, index) => (
//               <View
//                 key={property.id}
//                 style={{
//                   width: CARD_WIDTH,
//                   height: CARD_HEIGHT,
//                   backgroundColor: "white",
//                   borderRadius: 24,
//                   marginTop: index === 0 ? 10 : 20,
//                   shadowColor: "#000",
//                   shadowOffset: { width: 0, height: 6 },
//                   shadowOpacity: 0.15,
//                   shadowRadius: 6,
//                   elevation: 6,
//                   overflow: "hidden",
//                   borderWidth: 0.5,
//                   borderColor: "#E5E7EB",
//                 }}
//               >
//                 {/* Image (Clickable) */}
//                 <TouchableOpacity
//                   activeOpacity={0.8}
//                   onPress={() => {
//                     router.push({
//                       pathname: "/home/screens/Commercial/(Property)",
//                       params: {
//                         propertyId: property.id,
//                         propertyData: JSON.stringify(property),
//                       },
//                     });
//                   }}
//                 >
//                   <Image
//                     source={{ uri: property.image }}
//                     style={{
//                       width: CARD_WIDTH,
//                       height: 163,
//                       borderTopLeftRadius: 17,
//                       borderTopRightRadius: 17,
//                       backgroundColor: "#E5E7EB",
//                     }}
//                     resizeMode="cover"
//                   />
//                 </TouchableOpacity>

//                 {/* Bookmark Icon */}
//                 <View
//                   style={{
//                     position: "absolute",
//                     right: 16,
//                     top: 12,
//                     backgroundColor: "rgba(255,255,255,0.9)",
//                     padding: 6,
//                     borderRadius: 50,
//                   }}
//                 >
//                   <Ionicons name="bookmark-outline" size={20} color="#16A34A" />
//                 </View>

//                 {/* Verified Badge */}
//                 {property.verified && (
//                   <View
//                     style={{
//                       position: "absolute",
//                       left: 16,
//                       top: 12,
//                       backgroundColor: "#16A34A",
//                       flexDirection: "row",
//                       alignItems: "center",
//                       paddingHorizontal: 8,
//                       paddingVertical: 4,
//                       borderRadius: 6,
//                     }}
//                   >
//                     <Ionicons name="checkmark-circle" size={14} color="white" />
//                     <Text
//                       style={{
//                         color: "white",
//                         fontSize: 11,
//                         fontWeight: "600",
//                         marginLeft: 4,
//                       }}
//                     >
//                       Verified
//                     </Text>
//                   </View>
//                 )}

//                 {/* Card Content */}
//                 <View style={{ paddingHorizontal: 12, paddingTop: 10 }}>
//                   {/* Title (Clickable) */}
//                   <TouchableOpacity
//                     activeOpacity={0.6}
//                     onPress={() => {
//                       router.push({
//                         pathname: "/home/screens/Commercial/(Property)",
//                         params: {
//                           propertyId: property.id,
//                           propertyData: JSON.stringify(property),
//                         },
//                       });
//                     }}
//                   >
//                     <Text
//                       style={{
//                         fontFamily: "Poppins-Medium",
//                         fontWeight: "500",
//                         fontSize: 12,
//                         color: "#16A34A",
//                         marginTop: 5,
//                       }}
//                     >
//                       {property.name}
//                     </Text>
//                   </TouchableOpacity>

//                   <View
//                     style={{
//                       flexDirection: "row",
//                       justifyContent: "space-between",
//                       alignItems: "flex-start",
//                       marginTop: 3,
//                     }}
//                   >
//                     <Text
//                       style={{
//                         fontFamily: "Poppins-Regular",
//                         fontSize: 11,
//                         color: "#6B7280",
//                         maxWidth: "100%",
//                       }}
//                     >
//                       {property.type}
//                     </Text>
//                   </View>

//                   {/* Rating */}
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       alignItems: "center",
//                       marginTop: 6,
//                     }}
//                   >
//                     {renderStars(property.rating)}
//                     <Text
//                       style={{
//                         fontFamily: "Poppins-Regular",
//                         fontSize: 12,
//                         color: "#000",
//                         marginLeft: 6,
//                       }}
//                     >
//                       {property.rating} ({property.reviews} reviews)
//                     </Text>
//                   </View>

//                   {/* Location */}
//                   <View className="flex-row items-center mt-1">
//                     <Ionicons name="location-outline" size={14} color="#16A34A" />
//                     <Text
//                       style={{
//                         fontFamily: "Poppins-Regular",
//                         fontSize: 11,
//                         color: "#6B7280",
//                         marginLeft: 4,
//                       }}
//                     >
//                       {property.location}
//                     </Text>
//                   </View>

//                   {/* Price Badge */}
//                   <View
//                     style={{
//                       position: "absolute",
//                       right: 12,
//                       bottom: 12,
//                     }}
//                   >
//                     <View
//                       style={{
//                         backgroundColor: "#16A34A",
//                         paddingHorizontal: 12,
//                         paddingVertical: 4,
//                         borderRadius: 20,
//                       }}
//                     >
//                       <Text
//                         style={{
//                           fontFamily: "Poppins-Medium",
//                           fontSize: 11,
//                           color: "#FFFFFF",
//                           textAlign: "center",
//                           paddingTop: 2,
//                         }}
//                       >
//                         {property.price}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             ))
//           ) : (
//             <View
//               style={{
//                 flex: 1,
//                 alignItems: "center",
//                 justifyContent: "center",
//                 paddingVertical: 80,
//               }}
//             >
//               <Ionicons name="search-outline" size={64} color="#D1D5DB" />
//               <Text
//                 style={{
//                   color: "#6B7280",
//                   fontSize: 16,
//                   marginTop: 16,
//                   fontFamily: "Poppins-Regular",
//                 }}
//               >
//                 No properties found
//               </Text>
//               <Text
//                 style={{
//                   color: "#9CA3AF",
//                   fontSize: 14,
//                   marginTop: 8,
//                   fontFamily: "Poppins-Regular",
//                 }}
//               >
//                 Try adjusting your search
//               </Text>
//             </View>
//           )}
//         </Animated.ScrollView>

//         {/* Custom Green Scroll Bar */}
//         <View
//           style={{
//             width: 7,
//             marginRight: 6,
//             borderRadius: 3,
//             backgroundColor: "#E5E7EB",
//             height: "90%",
//             alignSelf: "center",
//           }}
//         >
//           <Animated.View
//             style={{
//               width: 6,
//               borderRadius: 3,
//               backgroundColor: "#cbddd2ff",
//               height: scrollbarHeight,
//               transform: [{ translateY: scrollIndicator }],
//             }}
//           />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }


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
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/index";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = 345;
const CARD_HEIGHT = 298;

export default function PropertyListScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();
  const { areaKey, districtKey } = useLocalSearchParams();
  
  const areaName = areaKey ? t(`areas.${areaKey}`) : '';

  useEffect(() => {
    fetchProperties();
  }, [areaKey]);

  useEffect(() => {
    if (areaKey) {
      fetchProperties();
    }
  }, [i18n.language]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching commercial properties for areaKey:', areaKey);
      
      const currentLang = i18n.language || 'en';
      console.log('🌐 Fetching in language:', currentLang);
      
      const response = await getApprovedProperties('Commercial', 1, currentLang);
      
      if (response.success) {
        console.log('✅ All commercial properties fetched:', response.data);
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

  const filteredProperties = properties.filter((property) => {
    const propertyAreaKey = property.areaKey || '';
    
    let propertyTitle = '';
    if (typeof property.propertyTitle === 'string') {
      propertyTitle = property.propertyTitle;
    } else if (property.propertyTitle && typeof property.propertyTitle === 'object') {
      propertyTitle = property.propertyTitle.en || property.propertyTitle.te || property.propertyTitle.hi || '';
    }
    
    const matchesArea = propertyAreaKey === areaKey;
    const matchesSearch = propertyTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesArea && matchesSearch;
  });

  // ✅ NEW: Get sub-type for display
  const getSubType = (property) => {
    return property.commercialDetails?.subType || '';
  };

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
      
      <View className="flex-row items-center px-5 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold ml-2">{areaName} Properties</Text>
      </View>

      <View style={{ flex: 1, flexDirection: "row" }}>
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
                key={item._id}
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
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push(`/home/screens/Commercial/(Property)?propertyId=${item._id}`)}
                >
                  <Image
                    source={
                      item.images && item.images.length > 0
                        ? { uri: `10.10.2.144/${item.images[0]}` }
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

                <View style={{ paddingHorizontal: 12, paddingTop: 10 }}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => router.push(`/home/screens/Commercial/(Property)?propertyId=${item._id}`)}
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
                      {typeof item.propertyTitle === 'string' 
                        ? item.propertyTitle 
                        : item.propertyTitle?.en || item.propertyTitle?.te || item.propertyTitle?.hi || 'Property'}
                      {getSubType(item) && ` (${getSubType(item)})`}
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
                      {item.propertyType || 'Commercial'}
                    </Text>
                    <Image
                      source={require("../../../../assets/verify.png")}
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
                      {item.location || areaName}
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