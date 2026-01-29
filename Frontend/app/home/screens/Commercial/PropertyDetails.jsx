// //Frontend/app/home/screens/Commercial/PropertyDetails.jsx
// import React, { useRef, useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   Animated,
//   Dimensions,
//   StatusBar,
//   ActivityIndicator
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import { getApprovedProperties } from "../../../../utils/propertyApi";
// import { useTranslation } from "react-i18next";
// import i18n from "../../../../i18n/index";
// import { saveProperty, unsaveProperty, checkIfSaved } from "../../../../utils/savedPropertiesApi";
// import { Alert } from "react-native";
// import { fetchReviews } from "../../../../utils/reviewApi";
// // ADD THIS IMPORT
// import { getImageUrl } from "../../../../utils/imageHelper";
// const { height: SCREEN_HEIGHT } = Dimensions.get("window");
// const CARD_WIDTH = 345;
// const CARD_HEIGHT = 298;

// // ✅ Helper function to extract language text
// const getLocalizedText = (field, language) => {
//   if (!field) return '';
//   if (typeof field === 'string') return field;
//   return field[language] || field.en || field.te || field.hi || '';
// };

// export default function PropertyListScreen() {
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const [contentHeight, setContentHeight] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const { t } = useTranslation();
//   const { areaKey, districtKey } = useLocalSearchParams();

//   const currentLanguage = i18n.language || 'en';
//   const areaName = areaKey ? t(`areas.${areaKey}`) : '';
//   const [savedStates, setSavedStates] = useState({});
//   const [reviewSummary, setReviewSummary] = useState({});

//   const filteredProperties = properties.filter((property) => {
//     const propertyAreaKey = property.areaKey || '';
//     const propertyTitle = getLocalizedText(property.propertyTitle, currentLanguage);
//     const matchesArea = propertyAreaKey === areaKey;
//     const matchesSearch = propertyTitle.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesArea && matchesSearch;
//   });

//   useEffect(() => {
//     fetchProperties();
//   }, [areaKey]);

//   useEffect(() => {
//     if (areaKey) {
//       fetchProperties();
//     }
//   }, [i18n.language]);

//   useEffect(() => {
//     if (filteredProperties.length > 0) {
//       filteredProperties.forEach(property => {
//         fetchReviewForProperty(property._id);
//       });
//     }
//   }, [filteredProperties]);

//   const fetchProperties = async () => {
//     try {
//       setLoading(true);
//       console.log('🔍 Fetching commercial properties for areaKey:', areaKey);

//       const currentLang = i18n.language || 'en';
//       console.log('🌐 Fetching in language:', currentLang);

//       const response = await getApprovedProperties('Commercial', 1, currentLang);

//       if (response.success) {
//         console.log('✅ All commercial properties fetched:', response.data);
//         setProperties(response.data.data || []);
//         await checkAllSavedStatuses(response.data.data || []);
//       } else {
//         console.error('❌ Failed to fetch properties:', response.error);
//       }
//     } catch (error) {
//       console.error('❌ Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkAllSavedStatuses = async (propertyList) => {
//     const savedStatusPromises = propertyList.map(async (property) => {
//       const response = await checkIfSaved(property._id, 'property');
//       return { id: property._id, isSaved: response.success ? response.isSaved : false };
//     });
//     const results = await Promise.all(savedStatusPromises);
//     const newSavedStates = {};
//     results.forEach(({ id, isSaved }) => {
//       newSavedStates[id] = isSaved;
//     });
//     setSavedStates(newSavedStates);
//   };

//   const handleToggleSave = async (propertyId) => {
//     const currentState = savedStates[propertyId] || false;

//     // Optimistic update
//     setSavedStates(prev => ({ ...prev, [propertyId]: !currentState }));

//     try {
//       let response;
//       if (currentState) {
//         response = await unsaveProperty(propertyId, 'property');
//       } else {
//         response = await saveProperty(propertyId, 'property');
//       }

//       if (!response.success) {
//         // Revert on failure
//         setSavedStates(prev => ({ ...prev, [propertyId]: currentState }));
//         Alert.alert('Error', response.message || 'Failed to update saved status');
//       }
//     } catch (error) {
//       console.error('Error toggling save:', error);
//       setSavedStates(prev => ({ ...prev, [propertyId]: currentState }));
//     }
//   };



//   // ✅ Get sub-type for display
//   const getSubType = (property) => {
//     return property.commercialDetails?.subType || '';
//   };

//   // ✅ Helper function to fetch reviews for a property
//   const fetchReviewForProperty = async (propertyId) => {
//     try {
//       const res = await fetchReviews('property', propertyId);
//       setReviewSummary(prev => ({
//         ...prev,
//         [propertyId]: {
//           avgRating: res.avgRating || 0,
//           count: res.count || 0
//         }
//       }));
//     } catch (err) {
//       console.error('Failed to fetch reviews:', err);
//     }
//   };

  

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

//       <View className="flex-row items-center px-5 py-3">
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="chevron-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="text-xl font-semibold ml-2">{areaName} Properties</Text>
//       </View>

//       <View style={{ flex: 1, flexDirection: "row" }}>
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
//             {filteredProperties.length} properties found in {areaName}
//           </Text>

//           {loading ? (
//             <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 50 }}>
//               <ActivityIndicator size="large" color="#16A34A" />
//               <Text style={{ marginTop: 16, fontFamily: "Poppins-Regular", color: '#6B7280' }}>
//                 Loading properties...
//               </Text>
//             </View>
//           ) : filteredProperties.length > 0 ? (
//             filteredProperties.map((item, index) => (
//               <View
//                 key={item._id}
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
//                 <TouchableOpacity
//                   activeOpacity={0.8}
//                   onPress={() => router.push({
//                     pathname: '/home/screens/Commercial/(Property)',
//                     params: {
//                       propertyId: item._id,
//                       propertyData: JSON.stringify(item),
//                       areaKey: item.areaKey || areaKey,
//                       entityType: 'property'
//                     }
//                   })}
//                 >
//                   <Image
//                     source={
//                       item.images && item.images.length > 0
//                         ? { uri: getImageUrl(item.images[0]) }
//                         : require("../../../../assets/CommercialHub.jpg")
//                     }
//                     style={{
//                       width: CARD_WIDTH,
//                       height: 163,
//                       borderTopLeftRadius: 17,
//                       borderTopRightRadius: 17,
//                     }}
//                     resizeMode="cover"
//                   />
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={() => handleToggleSave(item._id)}
//                   style={{
//                     position: "absolute",
//                     right: 16,
//                     top: 12,
//                     backgroundColor: "rgba(255,255,255,0.9)",
//                     padding: 6,
//                     borderRadius: 50,
//                   }}
//                 >
//                   <Ionicons
//                     name={savedStates[item._id] ? "bookmark" : "bookmark-outline"}
//                     size={20}
//                     color="#16A34A"
//                   />
//                 </TouchableOpacity>

//                 <View style={{ paddingHorizontal: 12, paddingTop: 10 }}>
//                   <TouchableOpacity
//                     activeOpacity={0.6}
//                     onPress={() => router.push({
//                       pathname: '/home/screens/Commercial/(Property)',
//                       params: {
//                         propertyId: item._id,
//                         areaKey: item.areaKey || areaKey,
//                         entityType: 'property'
//                       }
//                     })}
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
//                       {getLocalizedText(item.propertyTitle, currentLanguage) || 'Property'}
//                       {getSubType(item) && ` (${getSubType(item)})`}
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
//                       {item.propertyType || 'Commercial'}
//                     </Text>
//                     <Image
//                       source={require("../../../../assets/verify.png")}
//                       style={{ width: 45, height: 16, resizeMode: "contain", marginTop: 1 }}
//                     />
//                   </View>

//                   <View className="flex-row items-center mb-1">
//                     <Ionicons name="star" size={14} color="#FF9500" />
//                     <Text className="text-xs mx-3 text-gray-700 justify-center item-center">
//                       {reviewSummary[item._id]?.avgRating?.toFixed(1) || '0.0'} ({reviewSummary[item._id]?.count || 0} reviews)
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
//                       {getLocalizedText(item.location, currentLanguage) || areaName}
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
//                         ₹{item.expectedPrice ? (item.expectedPrice / 100000).toFixed(0) + 'L' : 'N/A'}
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


// Frontend/app/home/screens/Commercial/PropertyDetails.jsx
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
import { saveProperty, unsaveProperty, checkIfSaved } from "../../../../utils/savedPropertiesApi";
import { Alert } from "react-native";
import { fetchReviews } from "../../../../utils/reviewApi";
import { getImageUrl } from "../../../../utils/imageHelper";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = 345;
const CARD_HEIGHT = 298;

const getLocalizedText = (field, language) => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[language] || field.en || field.te || field.hi || '';
};

export default function PropertyListScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();
  const { areaKey, districtKey, appliedFilters } = useLocalSearchParams();
  const currentLanguage = i18n.language || 'en';
  const areaName = areaKey ? t(`areas.${areaKey}`) : '';
  const [savedStates, setSavedStates] = useState({});
  const [reviewSummary, setReviewSummary] = useState({});
  
  // ✅ Filter state
  const [activeFilters, setActiveFilters] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // ✅ PARSE FILTERS when returned from Filter screen
  useEffect(() => {
    if (appliedFilters) {
      try {
        const filters = JSON.parse(appliedFilters);
        console.log('✅ Commercial Filters received:', filters);
        console.log('📊 Filter breakdown:', {
          budgetRange: filters.budgetRange,
          subTypes: filters.subTypes,
          areaRange: filters.areaRange,
          // Office filters
          officeFilters: filters.officeFilters,
          // Retail filters
          retailFilters: filters.retailFilters,
          // Storage filters
          storageFilters: filters.storageFilters,
          // Industry filters
          industryFilters: filters.industryFilters,
          // Hospitality filters
          hospitalityFilters: filters.hospitalityFilters,
          // Plot filters
          plotFilters: filters.plotFilters,
          // Common filters
          locAdvantages: filters.locAdvantages?.length || 0,
          quickFilters: filters.quickFilters?.length || 0,
        });
        
        const hasFilters = Object.keys(filters).length > 0;
        
        if (hasFilters) {
          setActiveFilters(filters);
          setIsFiltering(true);
          console.log('✅ Filters active, will apply to properties');
        } else {
          setActiveFilters(null);
          setIsFiltering(false);
          console.log('🔄 Empty filters object, showing all properties');
        }
      } catch (error) {
        console.error('❌ Error parsing filters:', error);
        setActiveFilters(null);
        setIsFiltering(false);
      }
    } else {
      console.log('🔄 No filters applied, showing all properties');
      setActiveFilters(null);
      setIsFiltering(false);
    }
  }, [appliedFilters]);

  // ✅ Apply filters whenever properties or activeFilters change
  useEffect(() => {
    if (properties.length > 0) {
      if (activeFilters && isFiltering) {
        console.log('🔍 Applying filters to properties...');
        applyFilters(properties, activeFilters);
      } else {
        console.log('📍 Filtering by area only (no active filters)');
        const areaFiltered = properties.filter((property) => {
          const propertyAreaKey = property.areaKey || '';
          return propertyAreaKey === areaKey;
        });
        console.log(`✅ Area-filtered: ${areaFiltered.length} properties`);
        setFilteredProperties(areaFiltered);
      }
    }
  }, [properties, activeFilters, isFiltering, areaKey]);

  // ✅ FETCH PROPERTIES
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
        console.log('✅ All commercial properties fetched:', response.data.data?.length);
        const commercialProps = response.data.data || [];
        setProperties(commercialProps);
        
        if (activeFilters) {
          applyFilters(commercialProps, activeFilters);
        } else {
          const areaFiltered = commercialProps.filter((property) => {
            const propertyAreaKey = property.areaKey || '';
            return propertyAreaKey === areaKey;
          });
          setFilteredProperties(areaFiltered);
        }
        
        await checkAllSavedStatuses(commercialProps);
      } else {
        console.error('❌ Failed to fetch properties:', response.error);
      }
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ COMPLETE FILTER APPLICATION FUNCTION
  const applyFilters = (propertyList, filters) => {
    console.log('🔍 ========== STARTING COMMERCIAL FILTER APPLICATION ==========');
    console.log('📊 Initial properties count:', propertyList.length);
    console.log('🎯 Filters received:', JSON.stringify(filters, null, 2));
    
    let filtered = [...propertyList];
    let filterSteps = [];

    // ✅ STEP 1: Filter by area (ALWAYS FIRST)
    const initialCount = filtered.length;
    filtered = filtered.filter((property) => {
      const propertyAreaKey = property.areaKey || '';
      const matches = propertyAreaKey === areaKey;
      if (!matches) {
        console.log(`❌ Filtered out (wrong area): ${property.propertyTitle?.en || property.propertyTitle}`);
      }
      return matches;
    });
    
    filterSteps.push({
      step: 'Area Filter',
      before: initialCount,
      after: filtered.length,
      removed: initialCount - filtered.length
    });
    
    console.log(`📍 Area filter (${areaKey}): ${initialCount} → ${filtered.length} properties`);

    // ✅ STEP 2: SUB-TYPE FILTER
    if (filters.subTypes && filters.subTypes.length > 0) {
      const beforeSubType = filtered.length;
      
      filtered = filtered.filter(property => {
        const subType = property.commercialDetails?.subType || '';
        const matches = filters.subTypes.includes(subType);
        
        if (!matches) {
          console.log(`🏢 Filtered out (sub-type): ${property.propertyTitle?.en || property.propertyTitle} - Type: ${subType}`);
        }
        
        return matches;
      });
      
      filterSteps.push({
        step: `Sub-Type (${filters.subTypes.join(', ')})`,
        before: beforeSubType,
        after: filtered.length,
        removed: beforeSubType - filtered.length
      });
      
      console.log(`🏢 Sub-type filter: ${beforeSubType} → ${filtered.length} properties`);
    }

    // ✅ STEP 3: BUDGET FILTER (LAKHS)
    if (filters.budgetRange && Array.isArray(filters.budgetRange)) {
      const beforeBudget = filtered.length;
      const [minBudget, maxBudget] = filters.budgetRange;
      
      if (minBudget !== 1 || maxBudget !== 500) {
        filtered = filtered.filter(property => {
          const price = property.expectedPrice / 100000;
          const inRange = price >= minBudget && price <= maxBudget;
          
          if (!inRange) {
            console.log(`💰 Filtered out (budget): ${property.propertyTitle?.en || property.propertyTitle} - Price: ₹${price.toFixed(2)}L`);
          }
          
          return inRange;
        });
        
        filterSteps.push({
          step: `Budget (₹${minBudget}-${maxBudget}L)`,
          before: beforeBudget,
          after: filtered.length,
          removed: beforeBudget - filtered.length
        });
        
        console.log(`💰 Budget filter: ${beforeBudget} → ${filtered.length} properties`);
      }
    }

    // ✅ STEP 4: AREA RANGE FILTER (Common for all)
    if (filters.areaRange && Array.isArray(filters.areaRange)) {
      const beforeArea = filtered.length;
      const [minArea, maxArea] = filters.areaRange;
      
      if (minArea !== 0 || maxArea !== 10000) {
        filtered = filtered.filter(property => {
          const subType = property.commercialDetails?.subType;
          let area = 0;
          
          // Get area based on sub-type
          switch (subType) {
            case 'Office':
              area = property.commercialDetails?.officeDetails?.carpetArea || 0;
              break;
            case 'Retail':
              area = property.commercialDetails?.retailDetails?.carpetArea || 0;
              break;
            case 'Storage':
              area = property.commercialDetails?.storageDetails?.storageArea?.value || 0;
              break;
            case 'Industry':
              area = property.commercialDetails?.industryDetails?.area?.value || 0;
              break;
            case 'Hospitality':
              area = property.commercialDetails?.hospitalityDetails?.area?.value || 0;
              break;
            case 'Plot/Land':
              area = property.commercialDetails?.plotDetails?.area || 0;
              break;
          }
          
          const inRange = area >= minArea && area <= maxArea;
          
          if (!inRange) {
            console.log(`📏 Filtered out (area): ${property.propertyTitle?.en || property.propertyTitle} - Area: ${area} sqft`);
          }
          
          return inRange;
        });
        
        filterSteps.push({
          step: `Area (${minArea}-${maxArea} sqft)`,
          before: beforeArea,
          after: filtered.length,
          removed: beforeArea - filtered.length
        });
        
        console.log(`📏 Area filter: ${beforeArea} → ${filtered.length} properties`);
      }
    }

    // ✅ STEP 5: OFFICE-SPECIFIC FILTERS
    if (filters.officeFilters && Object.keys(filters.officeFilters).length > 0) {
      const beforeOffice = filtered.length;
      const officeFilters = filters.officeFilters;
      
      filtered = filtered.filter(property => {
        if (property.commercialDetails?.subType !== 'Office') return true;
        
        const officeDetails = property.commercialDetails?.officeDetails || {};
        let passes = true;
        
        // Cabins
        if (officeFilters.cabins && officeFilters.cabins !== 'any') {
          const cabins = officeDetails.cabins || 0;
          if (officeFilters.cabins === '5+') {
            passes = passes && cabins >= 5;
          } else {
            passes = passes && cabins === Number(officeFilters.cabins);
          }
        }
        
        // Meeting Rooms
        if (officeFilters.meetingRooms && officeFilters.meetingRooms !== 'any') {
          const rooms = officeDetails.meetingRooms || 0;
          if (officeFilters.meetingRooms === '5+') {
            passes = passes && rooms >= 5;
          } else {
            passes = passes && rooms === Number(officeFilters.meetingRooms);
          }
        }
        
        // Parking Type
        if (officeFilters.parkingType && officeFilters.parkingType !== '') {
          const hasParking = officeDetails.parking?.type === 'Available';
          passes = passes && ((officeFilters.parkingType === 'Available' && hasParking) || 
                             (officeFilters.parkingType === 'Not-Available' && !hasParking));
        }
        
        // Furnishing
        if (officeFilters.furnishing !== undefined) {
          passes = passes && officeDetails.furnishing === officeFilters.furnishing;
        }
        
        if (!passes) {
          console.log(`🏢 Filtered out (office filters): ${property.propertyTitle?.en || property.propertyTitle}`);
        }
        
        return passes;
      });
      
      filterSteps.push({
        step: 'Office Filters',
        before: beforeOffice,
        after: filtered.length,
        removed: beforeOffice - filtered.length
      });
      
      console.log(`🏢 Office filters: ${beforeOffice} → ${filtered.length} properties`);
    }

    // ✅ STEP 6: RETAIL-SPECIFIC FILTERS
    if (filters.retailFilters && Object.keys(filters.retailFilters).length > 0) {
      const beforeRetail = filtered.length;
      const retailFilters = filters.retailFilters;
      
      filtered = filtered.filter(property => {
        if (property.commercialDetails?.subType !== 'Retail') return true;
        
        const retailDetails = property.commercialDetails?.retailDetails || {};
        let passes = true;
        
        // Located Inside
        if (retailFilters.locatedInside && retailFilters.locatedInside !== '') {
          passes = passes && retailDetails.locatedInside === retailFilters.locatedInside;
        }
        
        // Washroom Type
        if (retailFilters.washroomType && retailFilters.washroomType !== '') {
          passes = passes && retailDetails.washroom === retailFilters.washroomType;
        }
        
        if (!passes) {
          console.log(`🏪 Filtered out (retail filters): ${property.propertyTitle?.en || property.propertyTitle}`);
        }
        
        return passes;
      });
      
      filterSteps.push({
        step: 'Retail Filters',
        before: beforeRetail,
        after: filtered.length,
        removed: beforeRetail - filtered.length
      });
      
      console.log(`🏪 Retail filters: ${beforeRetail} → ${filtered.length} properties`);
    }

    // ✅ STEP 7: STORAGE-SPECIFIC FILTERS
    if (filters.storageFilters && Object.keys(filters.storageFilters).length > 0) {
      const beforeStorage = filtered.length;
      const storageFilters = filters.storageFilters;
      
      filtered = filtered.filter(property => {
        if (property.commercialDetails?.subType !== 'Storage') return true;
        
        const storageDetails = property.commercialDetails?.storageDetails || {};
        let passes = true;
        
        // Storage Type
        if (storageFilters.storageType && storageFilters.storageType !== '') {
          passes = passes && storageDetails.storageType === storageFilters.storageType;
        }
        
        // Temperature Control
        if (storageFilters.temperatureControl !== undefined) {
          passes = passes && storageDetails.temperatureControl === storageFilters.temperatureControl;
        }
        
        if (!passes) {
          console.log(`📦 Filtered out (storage filters): ${property.propertyTitle?.en || property.propertyTitle}`);
        }
        
        return passes;
      });
      
      filterSteps.push({
        step: 'Storage Filters',
        before: beforeStorage,
        after: filtered.length,
        removed: beforeStorage - filtered.length
      });
      
      console.log(`📦 Storage filters: ${beforeStorage} → ${filtered.length} properties`);
    }

    // ✅ STEP 8: INDUSTRY-SPECIFIC FILTERS
    if (filters.industryFilters && Object.keys(filters.industryFilters).length > 0) {
      const beforeIndustry = filtered.length;
      const industryFilters = filters.industryFilters;
      
      filtered = filtered.filter(property => {
        if (property.commercialDetails?.subType !== 'Industry') return true;
        
        const industryDetails = property.commercialDetails?.industryDetails || {};
        let passes = true;
        
        // Washroom Type
        if (industryFilters.washroomType && industryFilters.washroomType !== '') {
          passes = passes && industryDetails.washroomType === industryFilters.washroomType;
        }
        
        if (!passes) {
          console.log(`🏭 Filtered out (industry filters): ${property.propertyTitle?.en || property.propertyTitle}`);
        }
        
        return passes;
      });
      
      filterSteps.push({
        step: 'Industry Filters',
        before: beforeIndustry,
        after: filtered.length,
        removed: beforeIndustry - filtered.length
      });
      
      console.log(`🏭 Industry filters: ${beforeIndustry} → ${filtered.length} properties`);
    }

    // ✅ STEP 9: HOSPITALITY-SPECIFIC FILTERS
    if (filters.hospitalityFilters && Object.keys(filters.hospitalityFilters).length > 0) {
      const beforeHospitality = filtered.length;
      const hospitalityFilters = filters.hospitalityFilters;
      
      filtered = filtered.filter(property => {
        if (property.commercialDetails?.subType !== 'Hospitality') return true;
        
        const hospitalityDetails = property.commercialDetails?.hospitalityDetails || {};
        let passes = true;
        
        // Rooms
        if (hospitalityFilters.rooms && hospitalityFilters.rooms !== 'any') {
          const rooms = hospitalityDetails.rooms || 0;
          if (hospitalityFilters.rooms === '20+') {
            passes = passes && rooms >= 20;
          } else {
            // Parse range like "1-5"
            const [min, max] = hospitalityFilters.rooms.split('-').map(Number);
            passes = passes && rooms >= min && rooms <= max;
          }
        }
        
        // Furnishing Type
        if (hospitalityFilters.furnishingType && hospitalityFilters.furnishingType !== '') {
          passes = passes && hospitalityDetails.furnishingType === hospitalityFilters.furnishingType;
        }
        
        if (!passes) {
          console.log(`🏨 Filtered out (hospitality filters): ${property.propertyTitle?.en || property.propertyTitle}`);
        }
        
        return passes;
      });
      
      filterSteps.push({
        step: 'Hospitality Filters',
        before: beforeHospitality,
        after: filtered.length,
        removed: beforeHospitality - filtered.length
      });
      
      console.log(`🏨 Hospitality filters: ${beforeHospitality} → ${filtered.length} properties`);
    }

    // ✅ STEP 10: PLOT-SPECIFIC FILTERS
    if (filters.plotFilters && Object.keys(filters.plotFilters).length > 0) {
      const beforePlot = filtered.length;
      const plotFilters = filters.plotFilters;
      
      filtered = filtered.filter(property => {
        if (property.commercialDetails?.subType !== 'Plot/Land') return true;
        
        const plotDetails = property.commercialDetails?.plotDetails || {};
        let passes = true;
        
        // Boundary Wall
        if (plotFilters.boundaryWall && plotFilters.boundaryWall !== '') {
          const hasBoundary = plotDetails.boundaryWall === 'Yes';
          passes = passes && ((plotFilters.boundaryWall === 'Yes' && hasBoundary) || 
                             (plotFilters.boundaryWall === 'No' && !hasBoundary));
        }
        
        // Open Sides
        if (plotFilters.openSides && plotFilters.openSides !== '') {
          const openSides = plotDetails.openSides || '';
          passes = passes && openSides === plotFilters.openSides;
        }
        
        // Construction Done
        if (plotFilters.constructionDone && plotFilters.constructionDone !== '') {
          passes = passes && plotDetails.constructionDone === plotFilters.constructionDone;
        }
        
        if (!passes) {
          console.log(`🏞️ Filtered out (plot filters): ${property.propertyTitle?.en || property.propertyTitle}`);
        }
        
        return passes;
      });
      
      filterSteps.push({
        step: 'Plot Filters',
        before: beforePlot,
        after: filtered.length,
        removed: beforePlot - filtered.length
      });
      
      console.log(`🏞️ Plot filters: ${beforePlot} → ${filtered.length} properties`);
    }

    // ✅ STEP 11: LOCATION ADVANTAGES FILTER
    if (filters.locAdvantages && filters.locAdvantages.length > 0) {
      const beforeLocAdv = filtered.length;
      
      filtered = filtered.filter(property => {
        const subType = property.commercialDetails?.subType;
        let propertyAdvantages = [];
        
        // Get location advantages based on sub-type
        switch (subType) {
          case 'Office':
            propertyAdvantages = property.commercialDetails?.officeDetails?.locationAdvantages || [];
            break;
          case 'Retail':
            propertyAdvantages = property.commercialDetails?.retailDetails?.locationAdvantages || [];
            break;
          case 'Storage':
            propertyAdvantages = property.commercialDetails?.storageDetails?.locationAdvantages || [];
            break;
          case 'Industry':
            propertyAdvantages = property.commercialDetails?.industryDetails?.pricing?.locationAdvantages || [];
            break;
          case 'Hospitality':
            propertyAdvantages = property.commercialDetails?.hospitalityDetails?.locationAdvantages || [];
            break;
          case 'Plot/Land':
            propertyAdvantages = property.commercialDetails?.plotDetails?.locationAdvantages || [];
            break;
        }
        
        const normalizeText = (text) => text.toLowerCase().replace(/[\s_-]+/g, '');
        const normalizedPropertyAdvantages = propertyAdvantages.map(adv => normalizeText(adv));
        const normalizedFilterAdvantages = filters.locAdvantages.map(adv => normalizeText(adv));
        
        const hasAdvantage = normalizedFilterAdvantages.some(adv => 
          normalizedPropertyAdvantages.includes(adv)
        );
        
        if (!hasAdvantage) {
          console.log(`📍 Filtered out (location advantages): ${property.propertyTitle?.en || property.propertyTitle}`);
        }
        
        return hasAdvantage;
      });
      
      filterSteps.push({
        step: `Location Advantages (${filters.locAdvantages.length} selected)`,
        before: beforeLocAdv,
        after: filtered.length,
        removed: beforeLocAdv - filtered.length
      });
      
      console.log(`📍 Location advantages filter: ${beforeLocAdv} → ${filtered.length} properties`);
    }

    // ✅ STEP 12: QUICK FILTERS
    if (filters.quickFilters && filters.quickFilters.length > 0) {
      const beforeQuick = filtered.length;
      
      filtered = filtered.filter(property => {
        let passes = true;
        
        filters.quickFilters.forEach(quickFilter => {
          switch (quickFilter) {
            case 'verified':
              if (property.status !== 'approved') {
                passes = false;
                console.log(`✅ Filtered out (not verified): ${property.propertyTitle?.en || property.propertyTitle}`);
              }
              break;
            case 'with_photos':
              if (!property.images || property.images.length === 0) {
                passes = false;
                console.log(`📸 Filtered out (no photos): ${property.propertyTitle?.en || property.propertyTitle}`);
              }
              break;
            case 'with_videos':
              if (!property.videos || property.videos.length === 0) {
                passes = false;
                console.log(`🎥 Filtered out (no videos): ${property.propertyTitle?.en || property.propertyTitle}`);
              }
              break;
          }
        });
        
        return passes;
      });
      
      filterSteps.push({
        step: `Quick Filters (${filters.quickFilters.length} selected)`,
        before: beforeQuick,
        after: filtered.length,
        removed: beforeQuick - filtered.length
      });
      
      console.log(`⚡ Quick filters: ${beforeQuick} → ${filtered.length} properties`);
    }

    // ✅ STEP 13: SEARCH QUERY FILTER
    if (searchQuery && searchQuery.trim()) {
      const beforeSearch = filtered.length;
      
      filtered = filtered.filter((property) => {
        const propertyTitle = getLocalizedText(property.propertyTitle, currentLanguage);
        const matches = propertyTitle.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matches) {
          console.log(`🔎 Filtered out (search): ${propertyTitle} (Query: ${searchQuery})`);
        }
        
        return matches;
      });
      
      filterSteps.push({
        step: `Search Query (${searchQuery})`,
        before: beforeSearch,
        after: filtered.length,
        removed: beforeSearch - filtered.length
      });
      
      console.log(`🔎 Search filter (${searchQuery}): ${beforeSearch} → ${filtered.length} properties`);
    }

    // ✅ FINAL SUMMARY
    console.log('📊 ========== FILTER SUMMARY ==========');
    console.table(filterSteps);
    console.log(`✅ Final result: ${propertyList.length} → ${filtered.length} properties`);
    console.log(`❌ Removed: ${propertyList.length - filtered.length} properties`);
    console.log('=========================================');

    setFilteredProperties(filtered);
  };

  // ✅ SEARCH QUERY EFFECT
  useEffect(() => {
    if (activeFilters) {
      applyFilters(properties, activeFilters);
    } else {
      const areaFiltered = properties.filter((property) => {
        const propertyAreaKey = property.areaKey || '';
        const propertyTitle = getLocalizedText(property.propertyTitle, currentLanguage);
        const matchesArea = propertyAreaKey === areaKey;
        const matchesSearch = propertyTitle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesArea && matchesSearch;
      });
      setFilteredProperties(areaFiltered);
    }
  }, [searchQuery, properties]);

  useEffect(() => {
    if (filteredProperties.length > 0) {
      filteredProperties.forEach(property => {
        fetchReviewForProperty(property._id);
      });
    }
  }, [filteredProperties]);

  const fetchReviewForProperty = async (propertyId) => {
    try {
      const res = await fetchReviews('property', propertyId);
      setReviewSummary(prev => ({
        ...prev,
        [propertyId]: {
          avgRating: res.avgRating || 0,
          count: res.count || 0
        }
      }));
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const checkAllSavedStatuses = async (propertyList) => {
    const savedStatusPromises = propertyList.map(async (property) => {
      const response = await checkIfSaved(property._id, 'property');
      return { id: property._id, isSaved: response.success ? response.isSaved : false };
    });

    const results = await Promise.all(savedStatusPromises);
    const newSavedStates = {};
    results.forEach(({ id, isSaved }) => {
      newSavedStates[id] = isSaved;
    });
    setSavedStates(newSavedStates);
  };

  const handleToggleSave = async (propertyId) => {
    const currentState = savedStates[propertyId] || false;
    setSavedStates(prev => ({ ...prev, [propertyId]: !currentState }));

    try {
      let response;
      if (currentState) {
        response = await unsaveProperty(propertyId, 'property');
      } else {
        response = await saveProperty(propertyId, 'property');
      }

      if (!response.success) {
        setSavedStates(prev => ({ ...prev, [propertyId]: currentState }));
        Alert.alert('Error', response.message || 'Failed to update saved status');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      setSavedStates(prev => ({ ...prev, [propertyId]: currentState }));
    }
  };

  // ✅ CLEAR FILTERS FUNCTION
  const handleClearFilters = () => {
    setActiveFilters(null);
    setIsFiltering(false);
    const areaFiltered = properties.filter((property) => {
      const propertyAreaKey = property.areaKey || '';
      return propertyAreaKey === areaKey;
    });
    setFilteredProperties(areaFiltered);
  };

  // ✅ GET ACTIVE FILTER COUNT
  const getActiveFilterCount = () => {
    if (!activeFilters) return 0;
    
    let count = 0;
    
    // Sub-types
    if (activeFilters.subTypes && activeFilters.subTypes.length > 0) count++;
    
    // Range filters
    if (activeFilters.budgetRange && (activeFilters.budgetRange[0] !== 1 || activeFilters.budgetRange[1] !== 500)) count++;
    if (activeFilters.areaRange && (activeFilters.areaRange[0] !== 0 || activeFilters.areaRange[1] !== 10000)) count++;
    
    // Sub-type specific filters
    if (activeFilters.officeFilters && Object.keys(activeFilters.officeFilters).length > 0) count++;
    if (activeFilters.retailFilters && Object.keys(activeFilters.retailFilters).length > 0) count++;
    if (activeFilters.storageFilters && Object.keys(activeFilters.storageFilters).length > 0) count++;
    if (activeFilters.industryFilters && Object.keys(activeFilters.industryFilters).length > 0) count++;
    if (activeFilters.hospitalityFilters && Object.keys(activeFilters.hospitalityFilters).length > 0) count++;
    if (activeFilters.plotFilters && Object.keys(activeFilters.plotFilters).length > 0) count++;
    
    // Multi-select filters
    if (activeFilters.locAdvantages && activeFilters.locAdvantages.length > 0) count++;
    if (activeFilters.quickFilters && activeFilters.quickFilters.length > 0) count++;
    
    console.log('🔢 Active filter count:', count);
    return count;
  };

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

      {/* Header */}
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
            {/* ✅ FILTER ICON - WITH BADGE */}
            <TouchableOpacity 
              onPress={() => router.push({
                pathname: '/home/screens/Commercial/Filter',
                params: { 
                  propertyType: 'Commercial',
                  currentFilters: activeFilters ? JSON.stringify(activeFilters) : ''
                }
              })}
              style={{ marginLeft: 8, position: 'relative' }}
            >
              <Ionicons name="options-outline" size={18} />
              {getActiveFilterCount() > 0 && (
                <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 items-center justify-center">
                  <Text className="text-white text-[10px] font-bold">
                    {getActiveFilterCount()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ✅ ACTIVE FILTERS DISPLAY */}
          {activeFilters && getActiveFilterCount() > 0 && (
            <View className="w-full px-5 mt-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-gray-600">Active Filters: {getActiveFilterCount()}</Text>
                <TouchableOpacity onPress={handleClearFilters}>
                  <Text className="text-sm text-green-500 font-semibold">Clear All</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {/* Sub-types */}
                {activeFilters.subTypes && activeFilters.subTypes.length > 0 && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">{activeFilters.subTypes.join(', ')}</Text>
                  </View>
                )}
                
                {/* Budget */}
                {activeFilters.budgetRange && (activeFilters.budgetRange[0] !== 1 || activeFilters.budgetRange[1] !== 500) && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">
                      ₹{activeFilters.budgetRange[0]}-{activeFilters.budgetRange[1]}L
                    </Text>
                  </View>
                )}
                
                {/* Area */}
                {activeFilters.areaRange && (activeFilters.areaRange[0] !== 0 || activeFilters.areaRange[1] !== 10000) && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">
                      {activeFilters.areaRange[0]}-{activeFilters.areaRange[1]} sqft
                    </Text>
                  </View>
                )}
                
                {/* Office Filters */}
                {activeFilters.officeFilters && Object.keys(activeFilters.officeFilters).length > 0 && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">Office Filters</Text>
                  </View>
                )}
                
                {/* Retail Filters */}
                {activeFilters.retailFilters && Object.keys(activeFilters.retailFilters).length > 0 && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">Retail Filters</Text>
                  </View>
                )}
                
                {/* Storage Filters */}
                {activeFilters.storageFilters && Object.keys(activeFilters.storageFilters).length > 0 && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">Storage Filters</Text>
                  </View>
                )}
                
                {/* Industry Filters */}
                {activeFilters.industryFilters && Object.keys(activeFilters.industryFilters).length > 0 && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">Industry Filters</Text>
                  </View>
                )}
                
                {/* Hospitality Filters */}
                {activeFilters.hospitalityFilters && Object.keys(activeFilters.hospitalityFilters).length > 0 && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">Hospitality Filters</Text>
                  </View>
                )}
                
                {/* Plot Filters */}
                {activeFilters.plotFilters && Object.keys(activeFilters.plotFilters).length > 0 && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">Plot Filters</Text>
                  </View>
                )}
                
                {/* Location Advantages */}
                {activeFilters.locAdvantages && activeFilters.locAdvantages.length > 0 && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">
                      {activeFilters.locAdvantages.length} Location{activeFilters.locAdvantages.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
                
                {/* Quick Filters */}
                {activeFilters.quickFilters && activeFilters.quickFilters.length > 0 && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">
                      {activeFilters.quickFilters.length} Quick Filter{activeFilters.quickFilters.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

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

          {/* LOADING */}
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
                  onPress={() => router.push({
                    pathname: '/home/screens/Commercial/(Property)',
                    params: {
                      propertyId: item._id,
                      propertyData: JSON.stringify(item),
                      areaKey: item.areaKey || areaKey,
                      entityType: 'property'
                    }
                  })}
                >
                  <Image
                    source={
                      item.images && item.images.length > 0
                        ? { uri: getImageUrl(item.images[0]) }
                        : require("../../../../assets/CommercialHub.jpg")
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

                <TouchableOpacity
                  onPress={() => handleToggleSave(item._id)}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 12,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    padding: 6,
                    borderRadius: 50,
                  }}
                >
                  <Ionicons
                    name={savedStates[item._id] ? "bookmark" : "bookmark-outline"}
                    size={20}
                    color="#16A34A"
                  />
                </TouchableOpacity>

                <View style={{ paddingHorizontal: 12, paddingTop: 10 }}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => router.push({
                      pathname: '/home/screens/Commercial/(Property)',
                      params: {
                        propertyId: item._id,
                        areaKey: item.areaKey || areaKey,
                        entityType: 'property'
                      }
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

                  <View className="flex-row items-center mb-1">
                    <Ionicons name="star" size={14} color="#FF9500" />
                    <Text className="text-xs mx-3 text-gray-700 justify-center item-center">
                      {reviewSummary[item._id]?.avgRating?.toFixed(1) || '0.0'} ({reviewSummary[item._id]?.count || 0} reviews)
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
                      {getLocalizedText(item.location, currentLanguage) || areaName}
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
                Try adjusting your filters
              </Text>
            </View>
          )}
        </Animated.ScrollView>

        {/* Custom Scroll Bar */}
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