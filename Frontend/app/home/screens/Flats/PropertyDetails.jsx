// //Frontend/app/home/screens/Flats/PropertyDetails.jsx
// import React, { useRef, useState } from "react";
// import { useEffect } from "react";
// import { getApprovedProperties } from "utils/propertyApi";
// import {
//   View,
//   Text,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   Animated,
//   Dimensions,StatusBar,
//   ActivityIndicator
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import { getApprovedProperties } from "../../../../utils/propertyApi";

// const { height: SCREEN_HEIGHT } = Dimensions.get("window");
// const CARD_WIDTH = 345;
// const CARD_HEIGHT = 298;

// export default function PropertyListScreen() {
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const [contentHeight, setContentHeight] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const { area } = useLocalSearchParams();

//   // // All properties data mapped to locations
//   // const allProperties = [
//   //   {
//   //     id: 1,
//   //     title: "Green Valley Site",
//   //     subtitle: "Residential Plot Development",
//   //     rating: 4.8,
//   //     reviews: 124,
//   //     location: "Akkayapalem",
//   //     price: "₹5L–45L",
//   //     image: require("../../../../assets/Flat1.jpg"),
//   //   },
//   //   {
//   //     id: 2,
//   //     title: "Sai Enclave",
//   //     subtitle: "Premium Resort",
//   //     rating: 4.2,
//   //     reviews: 89,
//   //     location: "Anandapuram",
//   //     price: "₹22L–45L",
//   //     image: require("../../../../assets/Flat2.jpg"),
//   //   },
//   //   {
//   //     id: 3,
//   //     title: "Ocean Breeze Residency",
//   //     subtitle: "Luxury Apartment",
//   //     rating: 4.6,
//   //     reviews: 102,
//   //     location: "Boyapalem",
//   //     price: "₹35L–75L",
//   //     image: require("../../../../assets/Flat3.jpg"),
//   //   },
//   //   {
//   //     id: 4,
//   //     title: "Sunrise Heights",
//   //     subtitle: "Modern Apartments",
//   //     rating: 4.5,
//   //     reviews: 156,
//   //     location: "Chinna Gadili",
//   //     price: "₹28L–60L",
//   //     image: require("../../../../assets/Flat1.jpg"),
//   //   },
//   //   {
//   //     id: 5,
//   //     title: "Park View Residency",
//   //     subtitle: "Luxury Flats",
//   //     rating: 4.7,
//   //     reviews: 198,
//   //     location: "Dwarka Nagar",
//   //     price: "₹40L–85L",
//   //     image: require("../../../../assets/Flat2.jpg"),
//   //   },
//   //   {
//   //     id: 6,
//   //     title: "Metro Plaza Apartments",
//   //     subtitle: "Premium Living",
//   //     rating: 4.4,
//   //     reviews: 134,
//   //     location: "Gajuwaka",
//   //     price: "₹18L–55L",
//   //     image: require("../../../../assets/Flat3.jpg"),
//   //   },
//   //   {
//   //     id: 7,
//   //     title: "Coastal Towers",
//   //     subtitle: "Sea View Apartments",
//   //     rating: 4.9,
//   //     reviews: 267,
//   //     location: "Kommadi",
//   //     price: "₹50L–1.2Cr",
//   //     image: require("../../../../assets/Flat1.jpg"),
//   //   },
//   // ];

//    // ✅ FETCH REAL PROPERTIES
//   useEffect(() => {
//     fetchProperties();
//   }, [area]);

//   const fetchProperties = async () => {
//     try {
//       setLoading(true);
//       console.log('🔍 Fetching properties for area:', area);
      
//       const response = await getApprovedProperties();
      
//       if (response.success) {
//         console.log('✅ All properties fetched:', response.data);
//         setProperties(response.data.data || []);
//       } else {
//         console.error('❌ Failed to fetch properties:', response.error);
//       }
//     } catch (error) {
//       console.error('❌ Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ FILTER BY AREA (location)
//  const filteredProperties = properties.filter((property) => {
//     const propertyLocation = typeof property.location === 'string' 
//       ? property.location 
//       : property.location?.en || '';
    
//     const propertyTitle = property.propertyTitle?.en || property.propertyTitle || '';
    
//     return propertyLocation.toLowerCase().includes(String(area).toLowerCase()) &&
//            propertyTitle.toLowerCase().includes(searchQuery.toLowerCase());
//   });

//   const scrollbarHeight = SCREEN_HEIGHT * (SCREEN_HEIGHT / contentHeight) * 0.3;

//   const scrollIndicator = Animated.multiply(
//     scrollY,
//     SCREEN_HEIGHT / contentHeight
//   ).interpolate({
//     inputRange: [0, SCREEN_HEIGHT],
//     outputRange: [0, SCREEN_HEIGHT - scrollbarHeight],
//     extrapolate: "clamp",
//   });

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
//       {/* Header */}
//       <View className="flex-row items-center px-5 py-3">
//         <TouchableOpacity onPress={() => router.push('/home/screens/Flats/SelectSite')}>
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
//             filteredProperties.map((item, index) => (
//               <View
//                 key={item.id}
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
//   activeOpacity={0.8}
//   onPress={() => router.push(`/home/screens/Flats/(Property)?propertyId=${item.id}`)}
// >
//   <Image
//     source={item.image}
//     style={{
//       width: CARD_WIDTH,
//       height: 163,
//       borderTopLeftRadius: 17,
//       borderTopRightRadius: 17,
//     }}
//     resizeMode="cover"
//   />
// </TouchableOpacity>

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

//                 {/* Card Content */}
//                 <View style={{ paddingHorizontal: 12, paddingTop: 10 }}>
//                   {/* Title (Clickable) */}
//                   <TouchableOpacity
//                     activeOpacity={0.6}
//                     onPress={() => router.push(`/home/screens/Flats/(Property)?propertyId=${item.id}`)}
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
//                       {item.title}
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
//                         maxWidth: "60%",
//                       }}
//                     >
//                       {item.subtitle}
//                     </Text>
//                     <Image
//                       source={require("../../../../assets/verify.png")}
//                       style={{ width: 45, height: 16, resizeMode: "contain", marginTop: 1 }}
//                     />
//                   </View>

//                   <View
//                     style={{
//                       flexDirection: "row",
//                       alignItems: "center",
//                       marginTop: 6,
//                     }}
//                   >
//                     <Image
//                       source={require("../../../../assets/star.png")}
//                       style={{ width: 100, height: 30, resizeMode: "contain" }}
//                     />
//                     <Text
//                       style={{
//                         fontFamily: "Poppins-Regular",
//                         fontSize: 12,
//                         color: "#000",
//                         marginLeft: 6,
//                       }}
//                     >
//                       {item.rating} ({item.reviews} reviews)
//                     </Text>
//                   </View>

//                   <View className="flex-row items-center mt-1">
//                     <Image
//                       source={require("../../../../assets/location.png")}
//                       style={{ width: 10, height: 14, resizeMode: "contain" }}
//                     />
//                     <Text
//                       style={{
//                         fontFamily: "Poppins-Regular",
//                         fontSize: 11,
//                         color: "#6B7280",
//                         marginLeft: 4,
//                       }}
//                     >
//                       {item.location}
//                     </Text>
//                   </View>

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
//                         {item.price}
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
  const { area } = useLocalSearchParams();

  // ✅ FETCH REAL PROPERTIES
  useEffect(() => {
    fetchProperties();
  }, [area]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching properties for area:', area);
      
      const response = await getApprovedProperties();
      
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
// ✅ NEW CODE
const filteredProperties = properties.filter((property) => {
  // Get area in English (since SelectSite passes English names)
  const propertyArea = typeof property.area === 'string' 
    ? property.area 
    : property.area?.en || '';
  
  // Get title in user's current language
  const propertyTitle = property.propertyTitle?.en || property.propertyTitle || '';
  
  // Match area AND search query
  const matchesArea = propertyArea.toLowerCase().includes(String(area).toLowerCase());
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
        <TouchableOpacity onPress={() => router.push('/home/screens/Flats/SelectSite')}>
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
                  onPress={() => router.push(`/home/screens/Flats/(Property)?propertyId=${item._id}`)}  // ✅ CHANGED
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
                    onPress={() => router.push(`/home/screens/Flats/(Property)?propertyId=${item._id}`)}  // ✅ CHANGED
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
                      {item.propertyTitle?.en || item.propertyTitle || 'Property'}
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
                      {typeof item.location === 'string' ? item.location : item.location?.en || area}
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