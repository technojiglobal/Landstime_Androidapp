// // Frontend/app/home/screens/Sidebar/MyProperties.jsx

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   Platform,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { Modal } from "react-native";
// import { getUserProperties } from "utils/propertyApi";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_URL } from "../../../../utils/apiConfig";
// import { fetchReviews } from "../../../../utils/reviewApi";
// // ✅ ADD this import
// import { userMarkPropertySold } from "../../../../utils/propertyApi";
// import "../../../../assets/tick-icon.png"; // Ensure this path is correct based on your project structure

// export default function MyProperties() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("All");
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [language, setLanguage] = useState('en');
//   const [reviewSummary, setReviewSummary] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isListening, setIsListening] = useState(false);

//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [showOptionsModal, setShowOptionsModal] = useState(false);

//   useEffect(() => {
//     loadLanguagePreference();
//     fetchMyProperties();
//   }, []);

//   const loadLanguagePreference = async () => {
//     try {
//       const savedLanguage = await AsyncStorage.getItem('appLanguage');
//       if (savedLanguage) {
//         setLanguage(savedLanguage);
//       }
//     } catch (error) {
//       console.error('Error loading language preference:', error);
//     }
//   };

//   const fetchMyProperties = async () => {
//     try {
//       setLoading(true);
//       const propertyList = await getUserProperties();

//       console.log("📊 Properties count:", propertyList.length);

//       setProperties(Array.isArray(propertyList) ? propertyList : []);
//     } catch (error) {
//       console.error("❌ Failed to load properties:", error);
//       setProperties([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to extract text based on language
//   const getLocalizedText = (field) => {
//     if (!field) return '';

//     if (typeof field === 'string') return field;

//     if (typeof field === 'object') {
//       return field[language] || field.en || field.te || field.hi || '';
//     }

//     return '';
//   };

//   // Fetch reviews for each property
//   useEffect(() => {
//     if (filteredProperties.length > 0) {
//       filteredProperties.forEach(property => {
//         fetchReviewForProperty(property._id);
//       });
//     }
//   }, [properties, activeTab, searchQuery]);

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

//   const tabs = [
//     { label: "All", count: properties.length },
//     { label: "Active", count: properties.filter(p => p.status === "approved").length },
//     { label: "Pending", count: properties.filter(p => p.status === "pending").length },
//     { label: "Sold", count: properties.filter(p => p.propertyStatus === "Sold").length },
//   ];

//   // Filter properties by tab and search query
//   const filteredProperties = properties.filter((prop) => {
//     // Tab filter
//     let passesTab = true;
//     if (activeTab === "Active") passesTab = prop.status === "approved";
//     else if (activeTab === "Pending") passesTab = prop.status === "pending";
//     else if (activeTab === "Sold") passesTab = prop.propertyStatus === "Sold";
//     else if (activeTab === "All") passesTab = true;
    
//     // Search filter
//     let passesSearch = true;
//     if (searchQuery.trim()) {
//       const title = getLocalizedText(prop.propertyTitle).toLowerCase();
//       const location = getLocalizedText(prop.location).toLowerCase();
//       const propertyType = (prop.propertyType || '').toLowerCase();
//       const query = searchQuery.toLowerCase();
//       passesSearch = title.includes(query) || location.includes(query) || propertyType.includes(query);
//     }
    
//     return passesTab && passesSearch;
//   });

//   // Voice search function
//   const handleVoiceSearch = async () => {
//     try {
//       setIsListening(true);
      
//       if (Platform.OS === 'web') {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) {
//           Alert.alert('Not Supported', 'Voice search is not supported in this browser');
//           setIsListening(false);
//           return;
//         }
        
//         const recognition = new SpeechRecognition();
//         recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
//         recognition.continuous = false;
//         recognition.interimResults = false;
        
//         recognition.onresult = (event) => {
//           const transcript = event.results[0][0].transcript;
//           setSearchQuery(transcript);
//           setIsListening(false);
//         };
        
//         recognition.onerror = (event) => {
//           console.error('Speech recognition error:', event.error);
//           Alert.alert('Error', 'Failed to recognize speech');
//           setIsListening(false);
//         };
        
//         recognition.onend = () => {
//           setIsListening(false);
//         };
        
//         recognition.start();
//       } else {
//         Alert.alert('Voice Search', 'Voice search is currently only available on web platform');
//         setIsListening(false);
//       }
//     } catch (error) {
//       console.error('Voice search error:', error);
//       Alert.alert('Error', 'Failed to start voice search');
//       setIsListening(false);
//     }
//   };




//   // ✅ Handle 3-dot menu press
//   const handleOptionsPress = (property) => {
//     setSelectedProperty(property);
//     setShowOptionsModal(true);
//   };

//   // ✅ Handle mark as sold
//   const handleMarkSold = async () => {
//     if (!selectedProperty) return;
    
//     setShowOptionsModal(false);
    
//     Alert.alert(
//       "Mark as Sold",
//       "Are you sure you want to mark this property as sold? This action cannot be undone by you.",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Mark as Sold",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               const response = await userMarkPropertySold(selectedProperty._id);
              
//               if (response.success) {
//                 Alert.alert('Success', 'Property marked as sold');
//                 fetchMyProperties(); // Refresh list
//               } else {
//                 Alert.alert('Error', response.data?.message || 'Failed to mark property as sold');
//               }
//             } catch (error) {
//               console.error('Error marking sold:', error);
//               Alert.alert('Error', 'Something went wrong');
//             }
//           }
//         }
//       ]
//     );
//   };

//   // ✅ Handle edit (placeholder)
//  // ✅ Handle edit - Navigate to appropriate upload screen
// const handleEdit = () => {
//   setShowOptionsModal(false);
  
//   if (!selectedProperty) return;
  
//   const propertyType = selectedProperty.propertyType;
//   let editPath = '';
  
//   // Determine which upload screen to navigate to
//   if (propertyType === 'House' || propertyType === 'House/Flat') {
//     editPath = '/home/screens/UploadScreens/AddScreen';
//   } else if (propertyType === 'Site/Plot/Land') {
//     editPath = '/home/screens/UploadScreens/SiteUpload';
//   } else if (propertyType === 'Commercial') {
//     editPath = '/home/screens/UploadScreens/CommercialUpload';
//   } else if (propertyType === 'Resort') {
//     editPath = '/home/screens/UploadScreens/ResortUpload';
//   }
  
//   if (editPath) {
//     router.push({
//       pathname: editPath,
//       params: {
//         editMode: 'true',
//         propertyId: selectedProperty._id,
//         propertyData: JSON.stringify(selectedProperty)
//       }
//     });
//   }
// };


//   // Helper function to handle base64 images from backend
//   const getImageSource = (imageData) => {
//     if (!imageData) {
//       return { uri: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6" };
//     }

//     if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
//       return { uri: imageData };
//     }

//     if (typeof imageData === 'string' && (imageData.startsWith('http://') || imageData.startsWith('https://'))) {
//       return { uri: imageData };
//     }

//     return { uri: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6" };
//   };

//   return (
//     <View className="flex-1 bg-white">
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

//       {/* Header */}
//       <View className="mt-9 px-4 py-2 flex-row items-center bg-white">
//         <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="text-lg font-semibold text-black ml-4">
//           My Properties
//         </Text>
//       </View>

//       {/* Search Bar */}
//       <View className="px-4 mt-2 mb-2">
//         <View className="flex-row bg-gray-50 px-4 py-3 rounded-xl items-center">
//           <Ionicons name="search" size={20} color="#9CA3AF" />
//           <TextInput
//             placeholder="Search properties..."
//             placeholderTextColor="#9CA3AF"
//             className="ml-3 text-gray-700 flex-1 text-base"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//           {searchQuery ? (
//             <TouchableOpacity onPress={() => setSearchQuery("")} className="mr-3">
//               <Ionicons name="close-circle" size={22} color="#6B7280" />
//             </TouchableOpacity>
//           ) : null}
//           <TouchableOpacity onPress={handleVoiceSearch}>
//             <Ionicons 
//               name={isListening ? "mic" : "mic-outline"} 
//               size={22} 
//               color={isListening ? "#16A34A" : "#6B7280"} 
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Tabs Container */}
//       <View className="mt-3 px-4 mb-2">
//         <View
//           style={{
//             backgroundColor: "#F3F4F6",
//             borderRadius: 30,
//             paddingVertical: 6,
//             paddingHorizontal: 6,
//           }}
//         >
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{
//               flexDirection: "row",
//               alignItems: "center",
//             }}
//           >
//             {tabs.map((tab) => {
//               const isActive = activeTab === tab.label;

//               return (
//                 <TouchableOpacity
//                   key={tab.label}
//                   onPress={() => setActiveTab(tab.label)}
//                   style={{
//                     paddingHorizontal: 18,
//                     paddingVertical: 8,
//                     borderRadius: 20,
//                     marginRight: 8,
//                     backgroundColor: isActive ? "#FFFFFF" : "transparent",
//                     shadowColor: isActive ? "#000" : "transparent",
//                     shadowOffset: { width: 0, height: 2 },
//                     shadowOpacity: isActive ? 0.15 : 0,
//                     shadowRadius: 4,
//                     elevation: isActive ? 3 : 0,
//                   }}
//                 >
//                   <Text
//                     style={{
//                       fontSize: 14,
//                       fontWeight: "600",
//                       color: isActive ? "#111827" : "#6B7280",
//                     }}
//                   >
//                     {tab.label} ({tab.count})
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </ScrollView>
//         </View>
//       </View>

//       {/* Loading State */}
//       {loading ? (
//         <View className="flex-1 justify-center items-center">
//           <ActivityIndicator size="large" color="#16A34A" />
//           <Text className="mt-4 text-gray-600">Loading properties...</Text>
//         </View>
//       ) : filteredProperties.length === 0 ? (
//         /* Empty State */
//         <View className="flex-1 justify-center items-center px-4">
//           <Ionicons name="home-outline" size={64} color="#D1D5DB" />
//           <Text className="text-gray-600 text-lg font-semibold mt-4">
//             No properties found
//           </Text>
//           <Text className="text-gray-500 text-sm mt-2 text-center">
//             {searchQuery 
//               ? `No properties match "${searchQuery}"`
//               : activeTab === "All"
//               ? "You haven't added any properties yet"
//               : `No ${activeTab.toLowerCase()} properties`}
//           </Text>
//         </View>
//       ) : (
//         /* Property Cards */
//        /* Property Cards */
//         <ScrollView
//           className="px-4 flex-1"
//           showsVerticalScrollIndicator={false}
//         >
//           {filteredProperties.map((property) => {
//             const statusLabel =
//               property.status === "approved"
//                 ? "Active"
//                 : property.status === "pending"
//                   ? "Pending Review"
//                   : "Rejected";

//             const propertyTitle = getLocalizedText(property.propertyTitle);
//             const location = getLocalizedText(property.location);

//             return (
//               <View
//                 key={property._id}
//                 className="bg-white rounded-2xl mb-4 overflow-hidden"
//                 style={{
//                   shadowColor: "#000",
//                   shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: 0.1,
//                   shadowRadius: 8,
//                   elevation: 3,
//                 }}
//               >
//                 {/* ✅ Property Image (Clickable) */}
//                 <TouchableOpacity
//                   activeOpacity={0.9}
//                   onPress={() => {
//                     const propertyType = property.propertyType;
//                     let path = '';
//                     let detailsPath = '';
                    
//                     if (propertyType === 'House' || propertyType === 'House/Flat') {
//                       path = '/home/screens/Flats/(Property)';
//                       detailsPath = '/home/screens/Flats/PropertyDetails';
//                     } else if (propertyType === 'Site/Plot/Land') {
//                       path = '/home/screens/Sites/(Property)';
//                       detailsPath = '/home/screens/Sites/PropertyDetails';
//                     } else if (propertyType === 'Resort') {
//                       path = '/home/screens/Resorts/(Property)';
//                       detailsPath = '/home/screens/Resorts/PropertyDetails';
//                     } else if (propertyType === 'Commercial') {
//                       path = '/home/screens/Commercial/(Property)';
//                       detailsPath = '/home/screens/Commercial/PropertyDetails';
//                     }

//                     if (path) {
//                       router.push({
//                         pathname: path,
//                         params: {
//                           propertyId: property._id,
//                           propertyData: JSON.stringify(property),
//                           areaKey: property.areaKey,
//                           entityType: 'property',
//                           backRoute: detailsPath,
//                           fromMyProperties: 'true'
//                         }
//                       });
//                     }
//                   }}
//                 >
//                   <View className="relative">
//                     <Image
//                       source={getImageSource(property.images?.[0])}
//                       className="w-full h-52"
//                       resizeMode="cover"
//                     />

//                    {/* Status Badge */}
// <View
//   className={`absolute top-3 left-3 px-3 py-1.5 rounded-full ${statusLabel === "Active"
//       ? "bg-[#DBFCE7]"
//       : statusLabel === "Pending Review"
//         ? "bg-[#FEF9C2]"
//         : "bg-red-100"
//     }`}
// >
//   <Text
//     className={`text-xs font-bold ${statusLabel === "Active"
//         ? "text-[#008236]"
//         : statusLabel === "Pending Review"
//           ? "text-yellow-700"
//           : "text-red-700"
//       }`}
//   >
//     {statusLabel}
//   </Text>
// </View>

// {/* Show edit hint for rejected properties */}
// {property.status === "rejected" && (
//   <View className="absolute top-12 left-3 bg-orange-500 px-2 py-1 rounded">
//     <Text className="text-white text-xs">
//       Edit to resubmit
//     </Text>
//   </View>
// )}

//                     {/* ✅ Status Badge + 3-Dot Menu */}
//                     <View className="absolute top-3 right-3 flex-row items-start">
//                       {/* Sold Out Badge */}
//                       {property.propertyStatus === 'Sold' && (
//                         <View className="bg-red-600 px-3 py-1.5 rounded-full mr-2">
//                           <Text className="text-white text-xs font-bold">
//                             Sold Out
//                           </Text>
//                         </View>
//                       )}
                      
//                       {/* 3-Dot Menu */}
//                       <TouchableOpacity 
//                         className="bg-white/95 p-2 rounded-full"
//                         onPress={() => handleOptionsPress(property)}
//                       >
//                         <MaterialCommunityIcons name="dots-vertical" size={20} color="black" />
//                       </TouchableOpacity>
//                     </View>

//                     {/* ✅ Verified Badge on Image */}
//                     {property.isVerified && (
//                       <View
//                         className="absolute bg-white rounded-full p-1"
//                         style={{
//                           bottom: 10,
//                           right: 10,
//                           shadowColor: "#000",
//                           shadowOffset: { width: 0, height: 1 },
//                           shadowOpacity: 0.2,
//                           shadowRadius: 1.5,
//                           elevation: 2,
//                         }}
//                       >
//                         <Image
//                           source={require("../../../../assets/tick-icon.png")}
//                           style={{ width: 13, height: 13, resizeMode: "contain" }}
//                         />
//                       </View>
//                     )}
//                   </View>
//                 </TouchableOpacity>

//                 {/* Property Details */}
//                 <View className="p-4">
//                   {/* Title */}
//                   <Text className="text-green-600 font-bold text-base">
//                     {propertyTitle || 'Untitled Property'}
//                   </Text>

//                   {/* Subtitle */}
//                   <Text className="text-gray-500 text-sm mt-1">
//                     {property.propertyType}
//                   </Text>

//                   {/* Rating */}
//                   <View className="flex-row items-center mt-3">
//                     {reviewSummary[property._id]?.count > 0 ? (
//                       <>
//                         <View className="flex-row">
//                           {[1, 2, 3, 4, 5].map((star) => (
//                             <Ionicons 
//                               key={star} 
//                               name={star <= Math.round(reviewSummary[property._id].avgRating) ? "star" : "star-outline"} 
//                               size={16} 
//                               color="#FCD34D" 
//                             />
//                           ))}
//                         </View>
//                         <Text className="ml-2 text-gray-800 font-semibold text-sm">
//                           {reviewSummary[property._id].avgRating.toFixed(1)}
//                           <Text className="text-gray-500 font-normal">
//                             {' '}({reviewSummary[property._id].count} {reviewSummary[property._id].count === 1 ? 'review' : 'reviews'})
//                           </Text>
//                         </Text>
//                       </>
//                     ) : (
//                       <>
//                         <View className="flex-row">
//                           {[1, 2, 3, 4, 5].map((_, i) => (
//                             <Ionicons key={i} name="star-outline" size={16} color="#D1D5DB" />
//                           ))}
//                         </View>
//                         <Text className="ml-2 text-gray-500 text-sm">No reviews yet</Text>
//                       </>
//                     )}

//                     {property.status === "approved" && (
//                       <View className="ml-auto bg-green-600 px-2.5 py-1 rounded-full flex-row items-center">
//                         <Ionicons name="checkmark-circle" size={12} color="white" />
//                         <Text className="text-white text-xs font-semibold ml-1">
//                           Verified
//                         </Text>
//                       </View>
//                     )}
//                   </View>

//                   {/* Location */}
//                   <View className="flex-row items-center mt-3">
//                     <Ionicons name="location-outline" size={16} color="#6B7280" />
//                     <Text className="text-gray-600 text-sm ml-1">
//                       {location || 'Location not specified'}
//                     </Text>
//                   </View>

//                   {/* Price & Actions */}
//                   <View className="flex-row items-center justify-between mt-4">
//                     <Text className="text-green-600 text-xl font-bold">
//                       ₹ {property.expectedPrice?.toLocaleString('en-IN') || 'N/A'}
//                     </Text>
//                     <View className="flex-row">
//                       <TouchableOpacity
//                         className="border border-green-600 px-4 py-2 rounded-full mr-2 flex-row items-center"
//                         onPress={() => {
//                           const propertyType = property.propertyType;
//                           let path = '';
//                           let detailsPath = '';
                          
//                           if (propertyType === 'House' || propertyType === 'House/Flat') {
//                             path = '/home/screens/Flats/(Property)';
//                             detailsPath = '/home/screens/Flats/PropertyDetails';
//                           } else if (propertyType === 'Site/Plot/Land') {
//                             path = '/home/screens/Sites/(Property)';
//                             detailsPath = '/home/screens/Sites/PropertyDetails';
//                           } else if (propertyType === 'Resort') {
//                             path = '/home/screens/Resorts/(Property)';
//                             detailsPath = '/home/screens/Resorts/PropertyDetails';
//                           } else if (propertyType === 'Commercial') {
//                             path = '/home/screens/Commercial/(Property)';
//                             detailsPath = '/home/screens/Commercial/PropertyDetails';
//                           }

//                           if (path) {
//                             router.push({
//                               pathname: path,
//                               params: {
//                                 propertyId: property._id,
//                                 propertyData: JSON.stringify(property),
//                                 areaKey: property.areaKey,
//                                 entityType: 'property',
//                                 backRoute: detailsPath,
//                                 fromMyProperties: 'true'
//                               }
//                             });
//                           }
//                         }}
//                       >
//                         <Ionicons name="eye-outline" size={16} color="#16A34A" />
//                         <Text className="text-green-600 font-semibold ml-1 text-sm">
//                           View
//                         </Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             );
//           })}
//         </ScrollView>
//       )}

//       {/* ✅ Options Modal */}
//       <Modal
//         visible={showOptionsModal}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setShowOptionsModal(false)}
//       >
//         <TouchableOpacity
//           activeOpacity={1}
//           onPress={() => setShowOptionsModal(false)}
//           className="flex-1 bg-black/50 justify-end"
//         >
//           <View className="bg-white rounded-t-3xl p-5">
//             <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />
            
//             <Text className="text-lg font-semibold mb-4">Property Options</Text>
            
//           {/* Edit Option */}
// <TouchableOpacity
//   onPress={handleEdit}
//   disabled={selectedProperty?.propertyStatus === 'Sold'}
//   className="flex-row items-center py-4 border-b border-gray-100"
// >
//   <Ionicons 
//     name="create-outline" 
//     size={22} 
//     color={selectedProperty?.propertyStatus === 'Sold' ? "#D1D5DB" : "#6B7280"} 
//   />
//   <View className="flex-1 ml-3">
//     <Text 
//       className={`text-base ${
//         selectedProperty?.propertyStatus === 'Sold' 
//           ? 'text-gray-400' 
//           : 'text-gray-700'
//       }`}
//     >
//       {selectedProperty?.propertyStatus === 'Sold' ? 'Cannot Edit (Sold)' : 'Edit Property'}
//     </Text>
//     {selectedProperty?.status === 'rejected' && selectedProperty?.propertyStatus !== 'Sold' && (
//       <Text className="text-xs text-orange-600 mt-0.5">
//         Property will be resubmitted for review
//       </Text>
//     )}
//   </View>
// </TouchableOpacity>
            
//             {/* Mark as Sold Option */}
//             <TouchableOpacity
//               onPress={handleMarkSold}
//               disabled={selectedProperty?.propertyStatus === 'Sold'}
//               className="flex-row items-center py-4"
//             >
//               <MaterialCommunityIcons 
//                 name="tag-off" 
//                 size={22} 
//                 color={selectedProperty?.propertyStatus === 'Sold' ? "#D1D5DB" : "#EF4444"} 
//               />
//               <Text 
//                 className={`text-base ml-3 ${
//                   selectedProperty?.propertyStatus === 'Sold' 
//                     ? 'text-gray-400' 
//                     : 'text-red-600'
//                 }`}
//               >
//                 {selectedProperty?.propertyStatus === 'Sold' ? 'Already Sold' : 'Mark as Sold'}
//               </Text>
//             </TouchableOpacity>
            
//             {/* Cancel */}
//             <TouchableOpacity
//               onPress={() => setShowOptionsModal(false)}
//               className="bg-gray-100 py-3 rounded-xl mt-4"
//             >
//               <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// }


// Frontend/app/home/screens/Sidebar/MyProperties.jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal } from "react-native";
import { getUserProperties } from "utils/propertyApi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../../../../utils/apiConfig";
import { fetchReviews } from "../../../../utils/reviewApi";
import { userMarkPropertySold } from "../../../../utils/propertyApi";
import "../../../../assets/tick-icon.png";
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/index';

export default function MyProperties() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [reviewSummary, setReviewSummary] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  useEffect(() => {
    loadLanguagePreference();
    fetchMyProperties();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('appLanguage');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    }
  };

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const propertyList = await getUserProperties();

      console.log("📊 Properties count:", propertyList.length);

      setProperties(Array.isArray(propertyList) ? propertyList : []);
    } catch (error) {
      console.error("❌ Failed to load properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract text based on language
  const getLocalizedText = (field) => {
    if (!field) return '';

    if (typeof field === 'string') return field;

    if (typeof field === 'object') {
      return field[language] || field.en || field.te || field.hi || '';
    }

    return '';
  };

  // Fetch reviews for each property
  useEffect(() => {
    if (filteredProperties.length > 0) {
      filteredProperties.forEach(property => {
        fetchReviewForProperty(property._id);
      });
    }
  }, [properties, activeTab, searchQuery]);

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

  const tabs = [
    { label: "All",     displayLabel: t('tab_all'),     count: properties.length },
    { label: "Active",  displayLabel: t('tab_active'),  count: properties.filter(p => p.status === "approved").length },
    { label: "Pending", displayLabel: t('tab_pending'), count: properties.filter(p => p.status === "pending").length },
    { label: "Sold",    displayLabel: t('tab_sold'),    count: properties.filter(p => p.propertyStatus === "Sold").length },
  ];

  // Filter properties by tab and search query
  const filteredProperties = properties.filter((prop) => {
    let passesTab = true;
    if (activeTab === "Active") passesTab = prop.status === "approved";
    else if (activeTab === "Pending") passesTab = prop.status === "pending";
    else if (activeTab === "Sold") passesTab = prop.propertyStatus === "Sold";
    else if (activeTab === "All") passesTab = true;

    let passesSearch = true;
    if (searchQuery.trim()) {
      const title = getLocalizedText(prop.propertyTitle).toLowerCase();
      const location = getLocalizedText(prop.location).toLowerCase();
      const propertyType = (prop.propertyType || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      passesSearch = title.includes(query) || location.includes(query) || propertyType.includes(query);
    }

    return passesTab && passesSearch;
  });

  // Voice search function
  const handleVoiceSearch = async () => {
    try {
      setIsListening(true);

      if (Platform.OS === 'web') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          Alert.alert(t('voice_search_not_supported'));
          setIsListening(false);
          return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          setIsListening(false);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          Alert.alert(t('voice_search_not_supported'));
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } else {
        Alert.alert(t('voice_search_not_supported'));
        setIsListening(false);
      }
    } catch (error) {
      console.error('Voice search error:', error);
      Alert.alert(t('voice_search_not_supported'));
      setIsListening(false);
    }
  };

  // ✅ Handle 3-dot menu press
  const handleOptionsPress = (property) => {
    setSelectedProperty(property);
    setShowOptionsModal(true);
  };

  // ✅ Handle mark as sold
  const handleMarkSold = async () => {
    if (!selectedProperty) return;

    setShowOptionsModal(false);

    Alert.alert(
      t('mark_sold_title'),
      t('mark_sold_message'),
      [
        { text: t('btn_cancel'), style: "cancel" },
        {
          text: t('mark_sold_confirm'),
          style: "destructive",
          onPress: async () => {
            try {
              const response = await userMarkPropertySold(selectedProperty._id);

              if (response.success) {
                Alert.alert(t('tab_active'), t('success_marked_sold'));
                fetchMyProperties();
              } else {
                Alert.alert(t('status_rejected'), response.data?.message || t('error_mark_sold'));
              }
            } catch (error) {
              console.error('Error marking sold:', error);
              Alert.alert(t('status_rejected'), t('error_mark_sold'));
            }
          }
        }
      ]
    );
  };

  // ✅ Handle edit - Navigate to appropriate upload screen
  const handleEdit = () => {
    setShowOptionsModal(false);

    if (!selectedProperty) return;

    const propertyType = selectedProperty.propertyType;
    let editPath = '';

    if (propertyType === 'House' || propertyType === 'House/Flat') {
      editPath = '/home/screens/UploadScreens/AddScreen';
    } else if (propertyType === 'Site/Plot/Land') {
      editPath = '/home/screens/UploadScreens/SiteUpload';
    } else if (propertyType === 'Commercial') {
      editPath = '/home/screens/UploadScreens/CommercialUpload';
    } else if (propertyType === 'Resort') {
      editPath = '/home/screens/UploadScreens/ResortUpload';
    }

    if (editPath) {
      router.push({
        pathname: editPath,
        params: {
          editMode: 'true',
          propertyId: selectedProperty._id,
          propertyData: JSON.stringify(selectedProperty)
        }
      });
    }
  };

  // Helper function to handle base64 images from backend
  const getImageSource = (imageData) => {
    if (!imageData) {
      return { uri: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6" };
    }

    if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
      return { uri: imageData };
    }

    if (typeof imageData === 'string' && (imageData.startsWith('http://') || imageData.startsWith('https://'))) {
      return { uri: imageData };
    }

    return { uri: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6" };
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="mt-9 px-4 py-2 flex-row items-center bg-white">
        <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black ml-4">
          {t('my_properties_title')}
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 mt-2 mb-2">
        <View className="flex-row bg-gray-50 px-4 py-3 rounded-xl items-center">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder={t('my_properties_search_placeholder')}
            placeholderTextColor="#9CA3AF"
            className="ml-3 text-gray-700 flex-1 text-base"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")} className="mr-3">
              <Ionicons name="close-circle" size={22} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={handleVoiceSearch}>
            <Ionicons
              name={isListening ? "mic" : "mic-outline"}
              size={22}
              color={isListening ? "#16A34A" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs Container */}
      <View className="mt-3 px-4 mb-2">
        <View
          style={{
            backgroundColor: "#F3F4F6",
            borderRadius: 30,
            paddingVertical: 6,
            paddingHorizontal: 6,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.label;

              return (
                <TouchableOpacity
                  key={tab.label}
                  onPress={() => setActiveTab(tab.label)}
                  style={{
                    paddingHorizontal: 18,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                    backgroundColor: isActive ? "#FFFFFF" : "transparent",
                    shadowColor: isActive ? "#000" : "transparent",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isActive ? 0.15 : 0,
                    shadowRadius: 4,
                    elevation: isActive ? 3 : 0,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: isActive ? "#111827" : "#6B7280",
                    }}
                  >
                    {tab.displayLabel} ({tab.count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Loading State */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16A34A" />
          <Text className="mt-4 text-gray-600">{t('loading_properties')}</Text>
        </View>
      ) : filteredProperties.length === 0 ? (
        /* Empty State */
        <View className="flex-1 justify-center items-center px-4">
          <Ionicons name="home-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-600 text-lg font-semibold mt-4">
            {t('no_properties_found')}
          </Text>
          <Text className="text-gray-500 text-sm mt-2 text-center">
            {searchQuery
              ? t('search_no_match').replace('{query}', searchQuery)
              : activeTab === "All"
              ? t('no_properties_added')
              : t('no_properties_in_tab').replace('{tab}', tabs.find(tb => tb.label === activeTab)?.displayLabel || activeTab)}
          </Text>
        </View>
      ) : (
        /* Property Cards */
        <ScrollView
          className="px-4 flex-1"
          showsVerticalScrollIndicator={false}
        >
          {filteredProperties.map((property) => {
            const statusLabel =
              property.status === "approved"
                ? t('status_active')
                : property.status === "pending"
                  ? t('status_pending_review')
                  : t('status_rejected');

            const statusKey = property.status === "approved"
              ? "Active"
              : property.status === "pending"
                ? "Pending Review"
                : "Rejected";

            const propertyTitle = getLocalizedText(property.propertyTitle);
            const location = getLocalizedText(property.location);

            return (
              <View
                key={property._id}
                className="bg-white rounded-2xl mb-4 overflow-hidden"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                {/* ✅ Property Image (Clickable) */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    const propertyType = property.propertyType;
                    let path = '';
                    let detailsPath = '';

                    if (propertyType === 'House' || propertyType === 'House/Flat') {
                      path = '/home/screens/Flats/(Property)';
                      detailsPath = '/home/screens/Flats/PropertyDetails';
                    } else if (propertyType === 'Site/Plot/Land') {
                      path = '/home/screens/Sites/(Property)';
                      detailsPath = '/home/screens/Sites/PropertyDetails';
                    } else if (propertyType === 'Resort') {
                      path = '/home/screens/Resorts/(Property)';
                      detailsPath = '/home/screens/Resorts/PropertyDetails';
                    } else if (propertyType === 'Commercial') {
                      path = '/home/screens/Commercial/(Property)';
                      detailsPath = '/home/screens/Commercial/PropertyDetails';
                    }

                    if (path) {
                      router.push({
                        pathname: path,
                        params: {
                          propertyId: property._id,
                          propertyData: JSON.stringify(property),
                          areaKey: property.areaKey,
                          entityType: 'property',
                          backRoute: detailsPath,
                          fromMyProperties: 'true'
                        }
                      });
                    }
                  }}
                >
                  <View className="relative">
                    <Image
                      source={getImageSource(property.images?.[0])}
                      className="w-full h-52"
                      resizeMode="cover"
                    />

                    {/* Status Badge */}
                    <View
                      className={`absolute top-3 left-3 px-3 py-1.5 rounded-full ${
                        statusKey === "Active"
                          ? "bg-[#DBFCE7]"
                          : statusKey === "Pending Review"
                            ? "bg-[#FEF9C2]"
                            : "bg-red-100"
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          statusKey === "Active"
                            ? "text-[#008236]"
                            : statusKey === "Pending Review"
                              ? "text-yellow-700"
                              : "text-red-700"
                        }`}
                      >
                        {statusLabel}
                      </Text>
                    </View>

                    {/* Show edit hint for rejected properties */}
                    {property.status === "rejected" && (
                      <View className="absolute top-12 left-3 bg-orange-500 px-2 py-1 rounded">
                        <Text className="text-white text-xs">
                          {t('edit_to_resubmit')}
                        </Text>
                      </View>
                    )}

                    {/* ✅ Status Badge + 3-Dot Menu */}
                    <View className="absolute top-3 right-3 flex-row items-start">
                      {/* Sold Out Badge */}
                      {property.propertyStatus === 'Sold' && (
                        <View className="bg-red-600 px-3 py-1.5 rounded-full mr-2">
                          <Text className="text-white text-xs font-bold">
                            {t('status_sold_out')}
                          </Text>
                        </View>
                      )}

                      {/* 3-Dot Menu */}
                      <TouchableOpacity
                        className="bg-white/95 p-2 rounded-full"
                        onPress={() => handleOptionsPress(property)}
                      >
                        <MaterialCommunityIcons name="dots-vertical" size={20} color="black" />
                      </TouchableOpacity>
                    </View>

                    {/* ✅ Verified Badge on Image */}
                    {property.isVerified && (
                      <View
                        className="absolute bg-white rounded-full p-1"
                        style={{
                          bottom: 10,
                          right: 10,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.2,
                          shadowRadius: 1.5,
                          elevation: 2,
                        }}
                      >
                        <Image
                          source={require("../../../../assets/tick-icon.png")}
                          style={{ width: 13, height: 13, resizeMode: "contain" }}
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>

                {/* Property Details */}
                <View className="p-4">
                  {/* Title */}
                  <Text className="text-green-600 font-bold text-base">
                    {propertyTitle || t('untitled_property')}
                  </Text>

                  {/* Subtitle */}
                  <Text className="text-gray-500 text-sm mt-1">
                    {property.propertyType}
                  </Text>

                  {/* Rating */}
                  <View className="flex-row items-center mt-3">
                    {reviewSummary[property._id]?.count > 0 ? (
                      <>
                        <View className="flex-row">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                              key={star}
                              name={star <= Math.round(reviewSummary[property._id].avgRating) ? "star" : "star-outline"}
                              size={16}
                              color="#FCD34D"
                            />
                          ))}
                        </View>
                        <Text className="ml-2 text-gray-800 font-semibold text-sm">
                          {reviewSummary[property._id].avgRating.toFixed(1)}
                          <Text className="text-gray-500 font-normal">
                            {' '}({reviewSummary[property._id].count}{' '}
                            {reviewSummary[property._id].count === 1
                              ? t('review_singular')
                              : t('review_plural')})
                          </Text>
                        </Text>
                      </>
                    ) : (
                      <>
                        <View className="flex-row">
                          {[1, 2, 3, 4, 5].map((_, i) => (
                            <Ionicons key={i} name="star-outline" size={16} color="#D1D5DB" />
                          ))}
                        </View>
                        <Text className="ml-2 text-gray-500 text-sm">
                          {t('no_reviews_yet')}
                        </Text>
                      </>
                    )}

                    {property.status === "approved" && (
                      <View className="ml-auto bg-green-600 px-2.5 py-1 rounded-full flex-row items-center">
                        <Ionicons name="checkmark-circle" size={12} color="white" />
                        <Text className="text-white text-xs font-semibold ml-1">
                          {t('verified')}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Location */}
                  <View className="flex-row items-center mt-3">
                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-1">
                      {location || t('location_not_specified')}
                    </Text>
                  </View>

                  {/* Price & Actions */}
                  <View className="flex-row items-center justify-between mt-4">
                    <Text className="text-green-600 text-xl font-bold">
                      ₹ {property.expectedPrice?.toLocaleString('en-IN') || 'N/A'}
                    </Text>
                    <View className="flex-row">
                      <TouchableOpacity
                        className="border border-green-600 px-4 py-2 rounded-full mr-2 flex-row items-center"
                        onPress={() => {
                          const propertyType = property.propertyType;
                          let path = '';
                          let detailsPath = '';

                          if (propertyType === 'House' || propertyType === 'House/Flat') {
                            path = '/home/screens/Flats/(Property)';
                            detailsPath = '/home/screens/Flats/PropertyDetails';
                          } else if (propertyType === 'Site/Plot/Land') {
                            path = '/home/screens/Sites/(Property)';
                            detailsPath = '/home/screens/Sites/PropertyDetails';
                          } else if (propertyType === 'Resort') {
                            path = '/home/screens/Resorts/(Property)';
                            detailsPath = '/home/screens/Resorts/PropertyDetails';
                          } else if (propertyType === 'Commercial') {
                            path = '/home/screens/Commercial/(Property)';
                            detailsPath = '/home/screens/Commercial/PropertyDetails';
                          }

                          if (path) {
                            router.push({
                              pathname: path,
                              params: {
                                propertyId: property._id,
                                propertyData: JSON.stringify(property),
                                areaKey: property.areaKey,
                                entityType: 'property',
                                backRoute: detailsPath,
                                fromMyProperties: 'true'
                              }
                            });
                          }
                        }}
                      >
                        <Ionicons name="eye-outline" size={16} color="#16A34A" />
                        <Text className="text-green-600 font-semibold ml-1 text-sm">
                          {t('btn_view')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* ✅ Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <View className="bg-white rounded-t-3xl p-5">
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />

            <Text className="text-lg font-semibold mb-4">
              {t('options_title')}
            </Text>

            {/* Edit Option */}
            <TouchableOpacity
              onPress={handleEdit}
              disabled={selectedProperty?.propertyStatus === 'Sold'}
              className="flex-row items-center py-4 border-b border-gray-100"
            >
              <Ionicons
                name="create-outline"
                size={22}
                color={selectedProperty?.propertyStatus === 'Sold' ? "#D1D5DB" : "#6B7280"}
              />
              <View className="flex-1 ml-3">
                <Text
                  className={`text-base ${
                    selectedProperty?.propertyStatus === 'Sold'
                      ? 'text-gray-400'
                      : 'text-gray-700'
                  }`}
                >
                  {selectedProperty?.propertyStatus === 'Sold'
                    ? t('option_cannot_edit_sold')
                    : t('option_edit')}
                </Text>
                {selectedProperty?.status === 'rejected' && selectedProperty?.propertyStatus !== 'Sold' && (
                  <Text className="text-xs text-orange-600 mt-0.5">
                    {t('option_resubmit_note')}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            {/* Mark as Sold Option */}
            <TouchableOpacity
              onPress={handleMarkSold}
              disabled={selectedProperty?.propertyStatus === 'Sold'}
              className="flex-row items-center py-4"
            >
              <MaterialCommunityIcons
                name="tag-off"
                size={22}
                color={selectedProperty?.propertyStatus === 'Sold' ? "#D1D5DB" : "#EF4444"}
              />
              <Text
                className={`text-base ml-3 ${
                  selectedProperty?.propertyStatus === 'Sold'
                    ? 'text-gray-400'
                    : 'text-red-600'
                }`}
              >
                {selectedProperty?.propertyStatus === 'Sold'
                  ? t('option_already_sold')
                  : t('option_mark_sold')}
              </Text>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              onPress={() => setShowOptionsModal(false)}
              className="bg-gray-100 py-3 rounded-xl mt-4"
            >
              <Text className="text-center text-gray-700 font-semibold">
                {t('btn_cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}