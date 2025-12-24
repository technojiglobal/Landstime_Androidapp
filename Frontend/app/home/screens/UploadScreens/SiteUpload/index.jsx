// //Frontend//app//home//screens//UploadScreens//SiteUpload.jsx
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   Pressable,
//   Alert,StatusBar
// } from "react-native";
// import { useRouter } from "expo-router";
// import * as ImagePicker from "expo-image-picker";
// import { Ionicons } from "@expo/vector-icons";
// import { Picker } from "@react-native-picker/picker";
// import TopAlert from "../TopAlert";
// import { useLocalSearchParams } from "expo-router";
// export default function UploadPropertyScreen({ navigation }) {
//   // ✅ State variables
  
//     const params = useLocalSearchParams();
//   const [propertyType, setPropertyType] = useState("Site/Plot/Land");
//   const [propertyTitle, setPropertyTitle] = useState(params.propertyTitle || "");
//   const [image, setImage] = useState(params.image || null);
  
//   const [possessionBy, setPossessionBy] = useState("");
//   const [ownership, setOwnership] = useState([]);
//   const [approvedBy, setApprovedBy] = useState([]);
//   const [constructionDone, setConstructionDone] = useState("yes");
//   const [constructionType, setConstructionType] = useState([]);
//   const [amenities, setAmenities] = useState([]);
//   const [propertyFacing, setPropertyFacing] = useState([]);
//   const [locationAdvantages, setLocationAdvantages] = useState([]);
//   const [overlooking, setOverlooking] = useState([]);
//   const [overlookingAdditional, setOverlookingAdditional] = useState([]);
//   const [boundaryWall, setBoundaryWall] = useState(null);
//   const [openSides, setOpenSides] = useState("");
//   const [unit, setUnit] = useState("sqft");
//   const [allInclusive, setAllInclusive] = useState(false);
//   const [negotiable, setNegotiable] = useState(false);
//   const [taxExcluded, setTaxExcluded] = useState(false);
  
//   const router = useRouter();

//   const [visible, setVisible] = useState(null);
//   const [alertVisible, setAlertVisible] = useState(false);
//  const [roadUnit, setRoadUnit] = useState("sqft"); 
//    const [negotiable1, setNegotiable1] = useState(false);
//   const [taxExcluded1, setTaxExcluded1] = useState(false);
// const [selectedPrices, setSelectedPrices] = useState([]);
// const [selectedOverlooking, setSelectedOverlooking] = useState([]);

//     const checkboxes = [
//     { label: "All inclusive price", value: allInclusive, setValue: setAllInclusive },
//     { label: "Price Negotiable", value: negotiable, setValue: setNegotiable },
//     { label: "Tax and Govt.charges excluded", value: taxExcluded, setValue: setTaxExcluded },
//   ];

//    const checkboxes1 = [
//     { label: "In a Gated Society", value: taxExcluded1, setValue: setTaxExcluded1 },
//     { label: "Corner Property", value: negotiable1, setValue: setNegotiable1 },
//    ]
  
//   // ✅ Utility for array toggle
//   const toggleArray = (arr, setArr, item) => {
//     if (arr.includes(item)) setArr(arr.filter((i) => i !== item));
//     else setArr([...arr, item]);
//   };



//   // ✅ Common Checkbox Component
//   const Checkbox = ({ label, selected, onPress }) => (
//     <Pressable onPress={onPress} className="flex-row items-center mb-2">
//       <View
//         className="w-4 h-4 mr-2  mt-3 rounded-sm items-center justify-center"
//         style={{
//           borderWidth: 1,
//           borderColor: selected ? "#22C55E" : "#0000001A",
//           backgroundColor: selected ? "#22C55E" : "white",
//         }}
//       >
//         {selected && <Text style={{ color: "white", fontWeight: 'bold' }}>✓</Text>}
//       </View>
//       <Text className="text-[11px] text-[#00000099]">{label}</Text>
//     </Pressable>
//   );

//   // ✅ Common PillButton (for selectable tags)
//   const PillButton = ({ label, selected, onPress }) => (
//     <Pressable
//       onPress={onPress}
//       className="px-3 py-1  h-[23px]  rounded-full mr-2 mb-4 items-center  justify-center"
//       style={{
//         borderWidth: 1,
//         borderColor: selected ? "#22C55E" : "#0000001A",
//         backgroundColor: selected ? "#22C55E17" : "white",
//       }}
//     >
//       <Text
//         className="text-[10px]"
//         style={{ color: selected ? "#22C55E" : "#00000099" }}
//       >
//         {label}
//       </Text>
//     </Pressable>
//   );

//   const openCamera = async () => {
//     let permission = await ImagePicker.getCameraPermissionsAsync();

//     if (permission.status !== "granted") {
//       permission = await ImagePicker.requestCameraPermissionsAsync();
//       if (permission.status !== "granted") {
//         Alert.alert(
//           "Permission Required",
//           "You need to grant camera permissions to use this feature. Please go to your device settings and enable them for this app."
//         );
//         return;
//       }
//     }
//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });
//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };
    
//   return (
//     <View className="flex-1 bg-gray-50">
//       <TopAlert visible={alertVisible} onHide={() => setAlertVisible(false)} />
//       <ScrollView
//         contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
//         showsVerticalScrollIndicator={false}
//       >
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
//         {/* Header */}
//         <View className="flex-row items-center mt-7 mb-4">
//           <TouchableOpacity
//             onPress={() => router.push("/home/screens/UploadScreens/AddScreen")}
//             className="p-2"
//             accessibilityRole="button"
//           >
//               <Image
//                 source={require("../../../../../assets/arrow.png")}
//               style={{ width: 20, height: 20, resizeMode: "contain" }}
//             />
//           </TouchableOpacity>
//           <View className="ml-2">
//             <Text className="text-[16px]  font-semibold">
//               Upload Your Property
//             </Text>
//             <Text className="text-[12px]  text-[#00000066] ">
//               Add your property details
//             </Text>
//           </View>
//         </View>

//         {/* Property Details Card */}
//         <View
//           className="bg-white rounded-lg p-4 mb-4"
//           style={{ borderWidth: 1, borderColor: "#0000001A" }}
//         >
//           <View className="flex-row justify-between items-center mb-2">
//             <Text className="text-[15px] font-bold">Property Details</Text>
//             <TouchableOpacity>
//               <Text className="text-[11px] text-[#22C55E]">View Guidelines</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             onPress={openCamera}
//             className="border-2 border-dashed border-gray-300 rounded-xl mt-4 p-6 items-center mb-5"
//           >
//             <Ionicons name="camera-outline" size={40} color="#888" />
//             <Text className="text-gray-500 mt-2 text-left">
//               Add Photos or Videos
//             </Text>
//           </TouchableOpacity>
//           {image && (
//             <Image
//               source={{ uri: image }}
//               className="w-full h-48 -mt-2 mb-2 rounded-lg"
//             />
//           )}
//         </View>

//         {/* Basic Details */}
//         <View
//           className="bg-white rounded-lg p-4 mb-4"
//           style={{ borderWidth: 1, borderColor: "#0000001A" }}
//         >
//           <Text className="text-[16px] font-bold mb-5">Basic Details</Text>

//           <Text className="text-[15px] text-[#00000099] mb-2">Property Title</Text>
//             <TextInput
//     placeholder="Surya Teja Sites"
//     className="rounded-md p-3 mb-3"
//     style={{ borderWidth: 1, borderColor: "#0000001A", height:50, backgroundColor:"#D9D9D91C"}}
//     value={propertyTitle}
//     onChangeText={setPropertyTitle}
//   />


//           <Text className="text-[15px] text-[#00000099] mb-2">Property Type</Text>
//           <TouchableOpacity
//             onPress={() =>
//               setVisible(visible === "propertyType" ? null : "propertyType")
//             }
//             className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300"
//           >
//             <Text className="text-gray-800 text-left">
//               {propertyType || "House"}
//             </Text>
//             <Ionicons name="chevron-down" size={24} color="#888" />
//           </TouchableOpacity>
//            {visible === "propertyType" && (
//     <View
//       className="bg-white rounded-lg shadow-lg -mt-1 mb-4"
//       style={{ borderWidth: 1, borderColor: "#0000001A" }}
//     >
//       {["House", "Site/Plot/Land", "Commercial", "Resort"].map((type) => (
//         <TouchableOpacity
//           key={type}
//           onPress={() => {
//             setPropertyType(type);
//             setVisible(null);
            
//             if (type === "House") {
//               router.push({
//                 pathname: "/home/screens/UploadScreens/AddScreen",
//                 params: { 
//                   image: image,
//                   propertyTitle: propertyTitle 
//                 },
//               });
//             } else if (type === "Site/Plot/Land") {
//               // Already on this screen
//             } else if (type === "Commercial") {
//               router.push({
//                 pathname: "/home/screens/UploadScreens/CommercialUpload",
//                 params: { 
//                   image: image,
//                   propertyTitle: propertyTitle 
//                 },
//               });
//             } else {
//               router.push({
//                 pathname: "/home/screens/UploadScreens/ResortUpload",
//                 params: { 
//                   image: image,
//                   propertyTitle: propertyTitle 
//                 },
//               });
//             }
//           }}
//           className={`p-4 border-b border-gray-200 ${
//             propertyType === type ? "bg-green-500" : "bg-white"
//           }`}
//         >
//           <Text className={`${propertyType === type ? "text-white" : "text-gray-800"}`}>{type}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   )}

//         </View>

//         {/* Location */}
//         <View
//           className="bg-white rounded-lg p-4 mb-4"
//           style={{ borderWidth: 1, borderColor: "#0000001A" }}
//         >
//           <Text className="text-[15px] text-[#00000060] mb-3">Location</Text>
//           <View
//             className="flex-row items-center rounded-md p-3"
//             style={{
//               backgroundColor: "#D9D9D91C",
//               borderWidth: 1,
//               borderColor: "#0000001A",
//             }}
//           >
//               <Image
//                 source={require("../../../../../assets/location.png")}
//               style={{ width: 18, height: 18, marginRight: 8 }}
//             />
//             <TextInput placeholder="Enter Property Location" className="flex-1" />
//           </View>
//         </View>

//         {/* Area + Length/Breadth */}
//   <View
//   className="bg-white rounded-lg p-4 mb-6"
//   style={{ borderWidth: 1, borderColor: "#0000001A" }}
// >
//   {/* Area with Unit Picker */}
//   <Text className="text-[14px] font-medium text-[#00000099] mb-3">
//     Area
//   </Text>
//   <View
//     className="flex-row items-center mb-3 rounded-md"
//     style={{
//       borderWidth: 1,
//       borderColor: "#0000001A",
//       backgroundColor: "#D9D9D91C",
//       height: 52,
//     }}
//   >
//     <TextInput
//       placeholder="0"
//       className="flex-1 px-3"
//       style={{ height: 52 }}
//     />
//     <View style={{ width: 1, backgroundColor: "#0000001A", height: "60%" }} />
//     <View style={{ width: 100 }}>
//       <Picker
//         selectedValue={unit}
//         onValueChange={(v) => setUnit(v)}
//         mode="dropdown"
//         style={{ height: 52, width: "100%" }}
//       >
//         <Picker.Item label="sqft" value="sqft" />
//         <Picker.Item label="sqm" value="sqm" />
//         <Picker.Item label="acre" value="acre" />
//       </Picker>
//     </View>
//   </View>

//   {/* Length & Breadth */}
//   <View className="flex-row space-x-3 mb-3">
//     <View className="flex-1">
//       <Text className="text-sm text-[#00000099] mb-2">Length (optional)</Text>
//       <TextInput
//         placeholder="in Ft.."
//         className="rounded-md p-3 mx-1"
//         style={{
//           borderWidth: 1,
//           borderColor: "#0000001A",
//           backgroundColor: "#D9D9D91C",
//           height: 51,
//         }}
//       />
//     </View>
//     <View className="flex-1">
//       <Text className="text-sm text-[#00000099] mb-2">Breadth (optional)</Text>
//       <TextInput
//         placeholder="in Ft.."
//         className="rounded-md p-3 mx-1"
//         style={{
//           borderWidth: 1,
//           borderColor: "#0000001A",
//           backgroundColor: "#D9D9D91C",
//           height: 51,
//         }}
//       />
//     </View>
//   </View>

//   {/* Floors */}
//   <Text className="text-sm mt-3 text-[#00000099] mb-2">
//     Floors Allowed for Construction
//   </Text>
//   <TextInput
//     placeholder="No.of Floors"
//     className="rounded-md p-3 mb-3"
//     style={{
//       borderWidth: 1,
//       borderColor: "#0000001A",
//       backgroundColor: "#D9D9D91C",
//       height: 51,
//     }}
//   />

//   {/* Boundary Wall */}
//   <Text className="mb-2 text-[14px] text-[#00000099]">
//     Is there a boundary wall around the property?
//   </Text>
//   <View className="flex-row items-center space-x-3 mb-3">
//     {["Yes", "No"].map((v) => (
//       <Pressable
//         key={v}
//         onPress={() => setBoundaryWall(v)}
//         className="w-[51px] h-[23px] rounded-full items-center mx-3 justify-center"
//         style={{
//           borderWidth: 1,
//           borderColor: boundaryWall === v ? "#22C55E" : "#0000001A",
//           backgroundColor: boundaryWall === v ? "#22C55E17" : "transparent",
//         }}
//       >
//         <Text
//           className="text-[10px]"
//           style={{ color: boundaryWall === v ? "#22C55E" : "black" }}
//         >
//           {v}
//         </Text>
//       </Pressable>
//     ))}
//   </View>

//   {/* Open Sides */}
//   <Text className="mb-2 text-[14px] text-[#00000099]">No.of open sides</Text>
//   <View className="flex-row space-x-3 mb-4">
//     {["1", "2", "3", "3+"].map((v) => (
//       <Pressable
//         key={v}
//         onPress={() => setOpenSides(v)}
//         className="w-8 h-8 rounded-full items-center mx-2 justify-center"
//         style={{
//           borderWidth: 1,
//           borderColor: openSides === v ? "#22C55E" : "#0000001A",
//           backgroundColor: openSides === v ? "#22C55E17" : "transparent",
//         }}
//       >
//         <Text
//           className="text-[10px]"
//           style={{ color: openSides === v ? "#22C55E" : "#00000099" }}
//         >
//           {v}
//         </Text>
//       </Pressable>
//     ))}
//   </View>

//   {/* Construction Done */}
//   <Text className="mb-2 text-[14px] text-[#00000099]">
//     Any construction done on this property?
//   </Text>
//   <View className="flex-row space-x-3 mb-3">
//     {["yes", "no"].map((v) => (
//       <Pressable
//         key={v}
//         onPress={() => setConstructionDone(v)}
//         className="w-[51px] h-[23px] rounded-full mx-3 items-center justify-center"
//         style={{
//           borderWidth: 1,
//           borderColor: constructionDone === v ? "#22C55E" : "#0000001A",
//           backgroundColor:
//             constructionDone === v ? "#22C55E17" : "transparent",
//         }}
//       >
//         <Text
//           className="text-[10px]"
//           style={{ color: constructionDone === v ? "#22C55E" : "black" }}
//         >
//           {v === "yes" ? "Yes" : "No"}
//         </Text>
//       </Pressable>
//     ))}
//   </View>

//   {/* Construction Type */}
//   <Text className="mb-2 text-[14px] text-[#00000099]">
//     What type of construction has been done?
//   </Text>
//   <View className="flex-row flex-wrap mb-3">
//     {[
//       { k: "Shed", l: "+ Shed" },
//       { k: "Room", l: "+ Room(s)" },
//       { k: "Washroom", l: "+ Washroom" },
//       { k: "Other", l: "+ Other" },
//     ].map((o) => (
//       <PillButton
//         key={o.k}
//         label={o.l}
//         selected={constructionType.includes(o.k)}
//         onPress={() =>
//           toggleArray(constructionType, setConstructionType, o.k)
//         }
//       />
//     ))}
//   </View>

//   {/* Possession */}
//   <Text className="text-[15px] text-[#00000099] mb-2">Possession By</Text>
//   <TouchableOpacity
//     onPress={() => setVisible(visible === "possessionBy" ? null : "possessionBy")}
//     className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
//   >
//     <Text className="text-gray-800 text-left">
//       {possessionBy || "Expected By"}
//     </Text>
//     <Ionicons name="chevron-down" size={24} color="#888" />
//   </TouchableOpacity>
//   {visible === "possessionBy" && (
//     <View
//       className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
//       style={{ borderWidth: 1, borderColor: "#0000001A" }}
//     >
//       {[
//         "Immediate",
//         "1-3 months",
//         "3-6 months",
//         "6+ months",
//         "Ready to Move",
//         "Other",
//       ].map((item) => (
//         <TouchableOpacity
//           key={item}
//           onPress={() => {
//             setPossessionBy(item);
//             setVisible(null);
//           }}
//           className={`p-4 border-b border-gray-200 ${possessionBy === item ? "bg-green-500" : "bg-white"}`}
//         >
//           <Text className={`${possessionBy === item ? "text-white" : "text-gray-800"}`}>{item}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   )}

//   {/* Ownership */}
//   <Text className="text-[15px] text-[#00000099] mb-2">Ownership</Text>
//   <View className="flex-row flex-wrap mb-3">
//     {["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"].map((o) => (
//       <PillButton
//         key={o}
//         label={o}
//         selected={ownership.includes(o)}
//         onPress={() => toggleArray(ownership, setOwnership, o)}
//       />
//     ))}
//   </View>

//   {/* Approved By */}
//   <Text className="text-[15px] text-[#00000099] mb-3">
//     Which authority the property is approved by? (Optional)
//   </Text>
//   <View className="flex-row flex-wrap mb-3">
//     {["GHMC", "HMDA", "DTCP"].map((o) => (
//       <PillButton
//         key={o}
//         label={o}
//         selected={approvedBy.includes(o)}
//         onPress={() => toggleArray(approvedBy, setApprovedBy, o)}
//       />
//     ))}
//   </View>

//   {/* Price Details */}
//    <View className="mt-2">
//                   <Text className="text-gray-500 font-semibold mb-2 text-left">Price Details</Text>
//                   <TextInput
//                     placeholder="₹ Expected Price"
//                     keyboardType="numeric"
//                     className="border  border-gray-300 rounded-lg bg-[#F9F9F9] p-3 mb-3 text-gray-800 text-left"
//                   />
//                 </View>
//                 <View className="flex-col gap-2 mb-2">
//                  {["All inclusive price", "Price Negotiable", "Tax and Govt.charges excluded"].map((item) => {
//     const isSelected = selectedPrices.includes(item);
//     return (
//       <TouchableOpacity
//         key={item}
//         onPress={() => {
//           if (isSelected) {
//             setSelectedPrices(selectedPrices.filter((i) => i !== item));
//           } else {
//             setSelectedPrices([...selectedPrices, item]);
//           }
//         }}
//         className="flex-row items-center gap-2"
//       >
//         <View
//           className={`w-5 h-5 border rounded-sm items-center justify-center ${
//             isSelected ? "border-green-500 bg-green-500" : "border-gray-300 bg-white"
//           }`}
//         >
//           {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
//         </View>
//         <Text className="text-gray-700 text-left">{item}</Text>
//       </TouchableOpacity>
//     );
//   })}
  
//                   <TouchableOpacity>
//                     <Text className="text-[#22C55E] font-semibold text-left">+ Add more pricing details</Text>
//                   </TouchableOpacity>
//                 </View>
              
  

//   {/* Unique Features */}
//   <Text className="mt-4 mb-2 text-[15px] text-[#00000099]">What makes your property unique</Text>
//   <TextInput
//   placeholder="Share some details about your property like spacious rooms, well maintained facilities."
//   multiline={true}         // ✅ allow multiple lines
//   numberOfLines={3}        // ✅ initial visible lines (optional)
//   textAlignVertical="top"  // ✅ make text start from the top
//   className="rounded-md p-3"
//   style={{
//     borderWidth: 1,
//     borderColor: "#0000001A",
//     width: "100%",
//     height: 108,           // keeps your fixed height
//     paddingTop: 10,        // optional, for better spacing
//   }}
// />

// </View>


//         {/* Amenities, Overlooking, Facing */}
//         <View
//           className="bg-white rounded-lg p-4 mb-4"
//           style={{ borderWidth: 1, borderColor: "#0000001A" }}
//         >
//           {/* Amenities */}
//           <Text className="text-[15px] text-[#00000099] mb-2">Amenities</Text>
//           <View className="flex-row flex-wrap mb-3">
//             {["+Maintenance Staff", "+Water Storage", "+RainWater Harvesting", "Feng Shui/Vastu Complaint"].map((item) => (
//               <PillButton
//                 key={item}
//                 label={item}
//                 selected={amenities.includes(item)}
//                 onPress={() => toggleArray(amenities, setAmenities, item)}
//               />
//             ))}
//           </View>

//           {/* Overlooking */}
//           <Text className="text-[15px] text-[#00000099] mb-2">Overlooking</Text>
//          <View className="flex-row flex-wrap mb-3">
//             {["pool","park","club","MainRoad","Others"].map((item) => (
//               <PillButton
//                 key={item}
//                 label={item}
//                 selected={overlooking.includes(item)}
//                 onPress={() => toggleArray(overlooking, setOverlooking, item)}
//               />
//             ))}
//           </View>

//           {/* Overlooking Additional */}
//           <Text className="text-[15px] text-[#00000099] mt-4 mb-2">
//             Overlooking 
//           </Text>
//           <View className="flex-col gap-2 mb-2">
//             {["In a Gated Society", "Corner Property"].map((item) => {
//               const isSelected = selectedOverlooking.includes(item);
//               return (
//                 <TouchableOpacity
//                key={item}
//                onPress={() => {
//                  if (isSelected) {
//                    setSelectedOverlooking(selectedOverlooking.filter((i) => i !== item));
//                  } else {
//                    setSelectedOverlooking([...selectedOverlooking, item]);
//                  }
//                }}
//                className="flex-row items-center gap-2"
//              >
//                <View
//                  className={`w-5 h-5 border rounded-sm items-center justify-center ${
//                    isSelected ? "border-green-500 bg-green-500" : "border-gray-300 bg-white"
//                  }`}
//                >
//                  {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
//                </View>
//                <Text className="text-gray-700 text-left">{item}</Text>
//              </TouchableOpacity>
//            );
//          })}
//          </View>
         
         

//           {/* Property Facing */}
//           <Text className="text-[15px] text-[#00000099] mt-4 mb-3">
//             Property Facing
//           </Text>
//           <View className="flex-row flex-wrap mb-3">
//             {["East", "West", "North", "South", "North-East","South-east", "South-West"].map(
//               (item) => (
//                 <PillButton
//                   key={item}
//                   label={item}
//                   selected={propertyFacing.includes(item)}
//                   onPress={() =>
//                     toggleArray(propertyFacing, setPropertyFacing, item)
//                   }
//                 />
//               )
//             )}
//           </View>
//           <Text className="text-[15px] text-gray-500 mb-3">Width of facing road</Text>
//           <View
//             className="flex-row items-center rounded-md p-3"
//             style={{
//               backgroundColor: "#D9D9D91C",
//               borderWidth: 1,
//               borderColor: "#0000001A",
              
//             }}
//           >
//            <TextInput
//       placeholder="Enter the width"
//       className="flex-1 px-3"
//       style={{ height: 52 }}
//     />
//      <View style={{ width: 1, backgroundColor: "#0000001A", height: "90%" }} />
//     <View style={{ width: 100 }}>
//       <Picker
//         selectedValue={roadUnit}
//         onValueChange={(v) => setRoadUnit(v)}
//         mode="dropdown"
//         style={{ height: 52, width: "100%" }}
//       >
//         <Picker.Item label="sqft" value="sqft" />
//         <Picker.Item label="sqm" value="sqm" />
//         <Picker.Item label="acre" value="acre" />
//       </Picker>
//     </View>
//   </View>
        
//           {/* Location Advantages */}
//           <Text className="text-[15px] text-[#00000099] mt-4 mb-3">
//             Location Advantages
//           </Text>
//           <View className="flex-row flex-wrap">
//             {[
//               "+ close to Market",
//               "+ close to Mall",
//               "+ close to Hospital",
//               "+ close to Railway Station",
//               "+ close to Metro Station",
//               "+ close to School",
//               "+ close to Airport",
//               "+ close to Highway",
//             ].map((item) => (
//               <PillButton
//                 key={item}
//                 label={item}
//                 selected={locationAdvantages.includes(item)}
//                 onPress={() =>
//                   toggleArray(locationAdvantages, setLocationAdvantages, item)
//                 }
//               />
//             ))}
//           </View>
//         </View>

// <View
//   style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16,
//     gap:12
//    }}
//   className="space-x-3 "
// >
//   {/* Cancel Button */}
//   <TouchableOpacity
//     style={{
//       backgroundColor: "#E5E7EB",
//       paddingVertical: 12,
//       paddingHorizontal: 20,
//       borderRadius: 10,
//     }}
//     onPress={() => {
//       // handle cancel action
//     }}
//   >
//     <Text style={{ color: "black", fontWeight: "600", fontSize: 15 }}>
//       Cancel
//     </Text>
//   </TouchableOpacity>

//   {/* Upload Property Button */}
//   <TouchableOpacity
//     style={{
//       backgroundColor: "#22C55E",
//       paddingVertical: 12,
//       paddingHorizontal: 20,
//       borderRadius: 10,
//     }}
//     onPress={() => setAlertVisible(true)}
//   >
//     <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
//       Upload Property
//     </Text>
//   </TouchableOpacity>
// </View>



//       </ScrollView>
//     </View>
//   );
// }






//Frontend//app/home/screens/UploadScreens/SiteUpload//index.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Pressable,
  Alert,
  StatusBar,
  FlatList,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import TopAlert from "../TopAlert";
import { useLocalSearchParams } from "expo-router";
import { createProperty } from "utils/propertyApi";
import AsyncStorage from '@react-native-async-storage/async-storage';
//import CustomPickerAlert from "../../../../components/CustomPickerAlert";
//import CustomPickerAlert from "../../../../components/CustomPickerAlert";
import CustomPickerAlert from "components/CustomPickerAlert";
import PropertyImageUpload from "components/PropertyImageUpload";
import Toast from 'react-native-toast-message';
import MorePricingDetailsModal from "../MorePricingDetailsModal";
export default function UploadPropertyScreen() {
  const params = useLocalSearchParams();
  const [propertyType, setPropertyType] = useState("Site/Plot/Land");
  const [propertyTitle, setPropertyTitle] = useState(params.propertyTitle || "");
  const [images, setImages] = useState([]);
  
  const [possessionBy, setPossessionBy] = useState("");
  const [ownership, setOwnership] = useState("");
  const [approvedBy, setApprovedBy] = useState([]);
  const [constructionDone, setConstructionDone] = useState(null);
  const [constructionType, setConstructionType] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [propertyFacing, setPropertyFacing] = useState("");
  const [locationAdvantages, setLocationAdvantages] = useState([]);
  const [overlooking, setOverlooking] = useState([]);
  const [boundaryWall, setBoundaryWall] = useState(null);
  const [openSides, setOpenSides] = useState("");
  const [unit, setUnit] = useState("sqft");
   const [isMorePricingModalVisible, setIsMorePricingModalVisible] = useState(false);
  const router = useRouter();

  const [visible, setVisible] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [roadUnit, setRoadUnit] = useState("sqft"); 
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedOverlooking, setSelectedOverlooking] = useState([]);
  
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [length, setLength] = useState('');
  const [breadth, setBreadth] = useState('');
  const [floorsAllowed, setFloorsAllowed] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [description, setDescription] = useState('');
  const [roadWidth, setRoadWidth] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickerAlertVisible, setPickerAlertVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const toggleArray = (arr, setArr, item) => {
    if (arr.includes(item)) setArr(arr.filter((i) => i !== item));
    else setArr([...arr, item]);
  };

  const PillButton = ({ label, selected, onPress }) => (
    <Pressable
      onPress={onPress}
      className="px-3 py-1 h-[23px] rounded-full mr-2 mb-4 items-center justify-center"
      style={{
        borderWidth: 1,
        borderColor: selected ? "#22C55E" : "#0000001A",
        backgroundColor: selected ? "#22C55E17" : "white",
      }}
    >
      <Text
        className="text-[10px]"
        style={{ color: selected ? "#22C55E" : "#00000099" }}
      >
        {label}
      </Text>
    </Pressable>
  );

  const takePhoto = async () => {
    setPickerAlertVisible(false);
    let permission = await ImagePicker.getCameraPermissionsAsync();

    if (permission.status !== "granted") {
      permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "You need to grant camera permissions to use this feature."
        );
        return;
      }
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const pickFromGallery = async () => {
    setPickerAlertVisible(false);
    let permission = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (permission.status !== "granted") {
      permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "You need to grant access to your photo library."
        );
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 0.8,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const pickImage = () => {
    setPickerAlertVisible(true);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    try {
     const token = await AsyncStorage.getItem('userToken');
     console.log('🔐 Current token before upload:', token);
      
      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login to upload properties",
          [
            {
              text: "Go to Login",
              onPress: () => router.push('/(tabs)/profile')
            },
            { text: "Cancel", style: "cancel" }
          ]
        );
        return;
      }
      
      console.log('🎬 Starting upload process...');
      setIsSubmitting(true);

      if (!propertyTitle?.trim()) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Property Title is required.' });
        setIsSubmitting(false);
        return;
      }

      if (!location?.trim()) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Location is required.' });
        setIsSubmitting(false);
        return;
      }

      if (!area?.trim()) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Area is required.' });
        setIsSubmitting(false);
        return;
      }

      if (!length?.trim()) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Length is required.' });
        setIsSubmitting(false);
        return;
      }

      if (!breadth?.trim()) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Breadth is required.' });
        setIsSubmitting(false);
        return;
      }

      const priceValue = parseFloat(expectedPrice);
      console.log('💰 Price validation:', { expectedPrice, priceValue, isValid: !isNaN(priceValue) && priceValue > 0 });

      if (!expectedPrice || isNaN(priceValue) || priceValue <= 0) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'A valid Expected Price is required.' });
        setIsSubmitting(false);
        return;
      }

      if (!description?.trim()) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'What makes your property unique is required.' });
        setIsSubmitting(false);
        return;
      }

      if (images.length === 0) {
        console.log('❌ No images selected');
        Toast.show({ type: 'error', text1: 'Error', text2: 'Please add at least one image.' });
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Validation passed');
    const propertyData = {
  propertyType: "Site/Plot/Land",
  propertyTitle,
  location,
  description,
  expectedPrice: parseFloat(expectedPrice),
  priceDetails: {
    allInclusive: selectedPrices.includes("All inclusive price"),
    negotiable: selectedPrices.includes("Price Negotiable"),
    taxExcluded: selectedPrices.includes("Tax and Govt.charges excluded")
  },
  siteDetails: {
    area: parseFloat(area) || 0,
    areaUnit: unit,
    length: parseFloat(length) || 0,
    breadth: parseFloat(breadth) || 0,
    floorsAllowed: parseInt(floorsAllowed) || 0,
    boundaryWall: boundaryWall === "Yes",
    openSides: parseInt(openSides) || 0,
    constructionDone: constructionDone === "yes",
    constructionType,
    possessionBy,
    ownership: ownership || "Freehold",
    approvedBy,
    amenities,
    propertyFacing: propertyFacing || "East",
    overlooking,
    inGatedSociety: selectedOverlooking.includes("In a Gated Society"),
    cornerProperty: selectedOverlooking.includes("Corner Property"),
    locationAdvantages,
    roadWidth: parseFloat(roadWidth) || 0,
    roadWidthUnit: roadUnit
  }
};

console.log('📡 Calling createProperty API...');
console.log('📋 Final property data:', JSON.stringify(propertyData, null, 2));
console.log('📸 Images to upload:', images.length, 'images');
console.log('🔍 First image URI:', images[0]);
      
      const result = await createProperty(propertyData, images);
      
      console.log('📥 API Result:', result);
      console.log('📥 API Result Data:', JSON.stringify(result.data, null, 2));
      if (result.success) {
        console.log('✅ Upload successful!');
        Alert.alert("Success", "Property uploaded successfully!");
        setAlertVisible(true);
        
        setTimeout(() => {
          router.push("/(tabs)/home");
        }, 2000);
      } else {
        console.error('❌ Upload failed:', result);
        Alert.alert(
          "Error", 
          result.data?.message || result.error || "Failed to upload property. Please try again."
        );
      }
      
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
    
  return (
    <>
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <TopAlert visible={alertVisible} onHide={() => setAlertVisible(false)} />
        <MorePricingDetailsModal
        visible={isMorePricingModalVisible}
        onClose={() => setIsMorePricingModalVisible(false)}
      />

      <CustomPickerAlert
        visible={pickerAlertVisible}
        onClose={() => setPickerAlertVisible(false)}
        onCameraPress={takePhoto}
        onGalleryPress={pickFromGallery}
      />
         <View className="flex-row items-center mt-12 mb-4">
          <TouchableOpacity
            onPress={() => router.push("/home/screens/UploadScreens/AddScreen")}
            className="p-2"
            accessibilityRole="button"
          >
            <Image
              source={require("../../../../../assets/arrow.png")}
              style={{ width: 20, height: 20, resizeMode: "contain" }}
            />
          </TouchableOpacity>
          <View className="ml-2">
            <Text className="text-[16px] font-semibold">
              Upload Your Property
            </Text>
            <Text className="text-[12px] text-[#00000066]">
              Add your property details
            </Text>
          </View>
        </View>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
     

                <PropertyImageUpload
                     images={images}
                     onPickImage={pickImage}
                     onRemoveImage={removeImage}
                     onViewGuidelines={() => setIsPhotoGuideModalVisible(true)}
                     onWatchTutorial={() => setIsHowto360ModalVisible(true)}
                   />                

        {/* Basic Details */}
        <View
          className="bg-white rounded-lg p-4 mb-4"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="text-[16px] font-bold mb-5">Basic Details</Text>

          <Text className="text-[15px] text-[#00000099] mb-2">Property Title <Text className="text-red-500">*</Text></Text>
          <TextInput
            placeholder="Surya Teja Sites"
            className="rounded-md p-3 mb-3"
            style={{ 
              borderWidth: 1, 
              borderColor: focusedField === 'propertyTitle' ? '#90EE90' : '#0000001A', 
              height:50, 
              backgroundColor:"#D9D9D91C"
            }}
            value={propertyTitle}
            onChangeText={(text) => setPropertyTitle(text.replace(/[^a-zA-Z0-9\s]/g, ''))}
            onFocus={() => setFocusedField('propertyTitle')}
            onBlur={() => setFocusedField(null)}
          />

          <Text className="text-[15px] text-[#00000099] mb-2">Property Type</Text>
          <TouchableOpacity
            onPress={() =>
              setVisible(visible === "propertyType" ? null : "propertyType")
            }
            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300"
          >
            <Text className="text-gray-800 text-left">
              {propertyType || "House"}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#888" />
          </TouchableOpacity>
          {visible === "propertyType" && (
            <View
              className="bg-white rounded-lg shadow-lg -mt-1 mb-4"
              style={{ borderWidth: 1, borderColor: "#0000001A" }}
            >
              {["House", "Site/Plot/Land", "Commercial", "Resort"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => {
                    setPropertyType(type);
                    setVisible(null);
                    
                    if (type === "House") {
                      router.push({
                        pathname: "/home/screens/UploadScreens/AddScreen",
                        params: { 
                          images: JSON.stringify(images),
                          propertyTitle: propertyTitle 
                        },
                      });
                    } else if (type === "Site/Plot/Land") {
                      // Already on this screen
                    } else if (type === "Commercial") {
                      router.push({
                        pathname: "/home/screens/UploadScreens/CommercialUpload",
                        params: { 
                          images: JSON.stringify(images),
                          propertyTitle: propertyTitle 
                        },
                      });
                    } else {
                      router.push({
                        pathname: "/home/screens/UploadScreens/ResortUpload",
                        params: { 
                          images: JSON.stringify(images),
                          propertyTitle: propertyTitle 
                        },
                      });
                    }
                  }}
                  className={`p-4 border-b border-gray-200 ${
                    propertyType === type ? "bg-green-500" : "bg-white"
                  }`}
                >
                  <Text className={`${propertyType === type ? "text-white" : "text-gray-800"}`}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Location */}
        <View
          className="bg-white rounded-lg p-4 mb-4"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="text-[15px] text-[#00000060] mb-3">Location <Text className="text-red-500">*</Text></Text>
          <View
            className="flex-row items-center rounded-md p-3"
            style={{
              backgroundColor: "#D9D9D91C",
              borderWidth: 1,
              borderColor: focusedField === 'location' ? '#90EE90' : '#0000001A',
            }}
          >
            <Image
              source={require("../../../../../assets/location.png")}
              style={{ width: 18, height: 18, marginRight: 8 }}
            />
            <TextInput 
              placeholder="Enter Property Location" 
              className="flex-1"
              value={location}
              onChangeText={(text) => setLocation(text.replace(/[^a-zA-Z0-9\s]/g, ''))}
              onFocus={() => setFocusedField('location')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* Area + Length/Breadth */}
        <View
          className="bg-white rounded-lg p-4 mb-6"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          {/* Area with Unit Picker */}
          <Text className="text-[14px] font-medium text-[#00000099] mb-3">
            Area <Text className="text-red-500">*</Text>
          </Text>
          <View
            className="flex-row items-center mb-3 rounded-md"
            style={{
              borderWidth: 1,
              borderColor: focusedField === 'area' ? '#90EE90' : '#0000001A',
              backgroundColor: "#D9D9D91C",
              height: 52,
            }}
          >
            <TextInput
              placeholder="0"
              className="flex-1 px-3"
              style={{ height: 52 }}
              value={area}
              onChangeText={(text) => setArea(text.replace(/[^0-9.]/g, ''))}
              keyboardType="numeric"
              onFocus={() => setFocusedField('area')}
              onBlur={() => setFocusedField(null)}
            />
            <View style={{ width: 1, backgroundColor: "#0000001A", height: "60%" }} />
            <View style={{ width: 100 }}>
              <Picker
                selectedValue={unit}
                onValueChange={(v) => setUnit(v)}
                mode="dropdown"
                style={{ height: 52, width: "100%" }}
              >
                <Picker.Item label="sqft" value="sqft" />
                <Picker.Item label="sqm" value="sqm" />
                <Picker.Item label="acre" value="acre" />
              </Picker>
            </View>
          </View>

          {/* Length & Breadth */}
          <View className="flex-row space-x-3 mb-3">
            <View className="flex-1">
              <Text className="text-sm text-[#00000099] mb-2">Length <Text className="text-red-500">*</Text></Text>
              <TextInput
                placeholder="in Ft.."
                className="rounded-md p-3 mx-1"
                style={{
                  borderWidth: 1,
                  borderColor: focusedField === 'length' ? '#90EE90' : '#0000001A',
                  backgroundColor: "#D9D9D91C",
                  height: 51,
                }}
                value={length}
                onChangeText={(text) => setLength(text.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                onFocus={() => setFocusedField('length')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-[#00000099] mb-2">Breadth <Text className="text-red-500">*</Text></Text>
              <TextInput
                placeholder="in Ft.."
                className="rounded-md p-3 mx-1"
                style={{
                  borderWidth: 1,
                  borderColor: focusedField === 'breadth' ? '#90EE90' : '#0000001A',
                  backgroundColor: "#D9D9D91C",
                  height: 51,
                }}
                value={breadth}
                onChangeText={(text) => setBreadth(text.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                onFocus={() => setFocusedField('breadth')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Floors */}
          <Text className="text-sm mt-3 text-[#00000099] mb-2">
            Floors Allowed for Construction
          </Text>
          <TextInput
            placeholder="No.of Floors"
            className="rounded-md p-3 mb-3"
            style={{
              borderWidth: 1,
              borderColor: focusedField === 'floors' ? '#90EE90' : '#0000001A',
              backgroundColor: "#D9D9D91C",
              height: 51,
            }}
            value={floorsAllowed}
            onChangeText={(text) => setFloorsAllowed(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            onFocus={() => setFocusedField('floors')}
            onBlur={() => setFocusedField(null)}
          />

          {/* Boundary Wall */}
          <Text className="mb-2 text-[14px] text-[#00000099]">
            Is there a boundary wall around the property?
          </Text>
          <View className="flex-row items-center space-x-3 mb-3">
            {["Yes", "No"].map((v) => (
              <Pressable
                key={v}
                onPress={() => setBoundaryWall(v)}
                className="w-[51px] h-[23px] rounded-full items-center mx-3 justify-center"
                style={{
                  borderWidth: 1,
                  borderColor: boundaryWall === v ? "#22C55E" : "#0000001A",
                  backgroundColor: boundaryWall === v ? "#22C55E17" : "transparent",
                }}
              >
                <Text
                  className="text-[10px]"
                  style={{ color: boundaryWall === v ? "#22C55E" : "black" }}
                >
                  {v}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Open Sides */}
          <Text className="mb-2 text-[14px] text-[#00000099]">No.of open sides</Text>
          <View className="flex-row space-x-3 mb-4">
            {["1", "2", "3", "3+"].map((v) => (
              <Pressable
                key={v}
                onPress={() => setOpenSides(v)}
                className="w-8 h-8 rounded-full items-center mx-2 justify-center"
                style={{
                  borderWidth: 1,
                  borderColor: openSides === v ? "#22C55E" : "#0000001A",
                  backgroundColor: openSides === v ? "#22C55E17" : "transparent",
                }}
              >
                <Text
                  className="text-[10px]"
                  style={{ color: openSides === v ? "#22C55E" : "#00000099" }}
                >
                  {v}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Construction Done */}
          <Text className="mb-2 text-[14px] text-[#00000099]">
            Any construction done on this property?
          </Text>
          <View className="flex-row space-x-3 mb-3">
            {["yes", "no"].map((v) => (
              <Pressable
                key={v}
                onPress={() => setConstructionDone(v)}
                className="w-[51px] h-[23px] rounded-full mx-3 items-center justify-center"
                style={{
                  borderWidth: 1,
                  borderColor: constructionDone === v ? "#22C55E" : "#0000001A",
                  backgroundColor:
                    constructionDone === v ? "#22C55E17" : "transparent",
                }}
              >
                <Text
                  className="text-[10px]"
                  style={{ color: constructionDone === v ? "#22C55E" : "black" }}
                >
                  {v === "yes" ? "Yes" : "No"}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Construction Type */}
          {constructionDone === "yes" && (
            <>
              <Text className="mb-2 text-[14px] text-[#00000099]">
                What type of construction has been done?
              </Text>
              <View className="flex-row flex-wrap mb-3">
                {[
                  { k: "Shed", l: "+ Shed" },
                  { k: "Room", l: "+ Room(s)" },
                  { k: "Washroom", l: "+ Washroom" },
                  { k: "Other", l: "+ Other" },
                ].map((o) => (
                  <PillButton
                    key={o.k}
                    label={o.l}
                    selected={constructionType.includes(o.k)}
                    onPress={() =>
                      toggleArray(constructionType, setConstructionType, o.k)
                    }
                  />
                ))}
              </View>
            </>
          )}

          {/* Possession */}
          <Text className="text-[15px] text-[#00000099] mb-2">Possession By</Text>
          <TouchableOpacity
            onPress={() => setVisible(visible === "possessionBy" ? null : "possessionBy")}
            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
          >
            <Text className="text-gray-800 text-left">
              {possessionBy || "Expected By"}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#888" />
          </TouchableOpacity>
          {visible === "possessionBy" && (
            <View
              className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
              style={{ borderWidth: 1, borderColor: "#0000001A" }}
            >
              {[
                "Immediate",
                "1-3 months",
                "3-6 months",
                "6+ months",
                "Ready to Move",
                "Other",
              ].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setPossessionBy(item);
                    setVisible(null);
                  }}
                  className={`p-4 border-b border-gray-200 ${possessionBy === item ? "bg-green-500" : "bg-white"}`}
                >
                  <Text className={`${possessionBy === item ? "text-white" : "text-gray-800"}`}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Ownership */}
          <Text className="text-[15px] text-[#00000099] mb-2">Ownership</Text>
          <View className="flex-row flex-wrap mb-3">
            {["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"].map((o) => (
              <PillButton
                key={o}
                label={o}
                selected={ownership === o}
                onPress={() => setOwnership(o)}
              />
            ))}
          </View>

          {/* Approved By */}
          <Text className="text-[15px] text-[#00000099] mb-3">
            Which authority the property is approved by? (Optional)
          </Text>
          <View className="flex-row flex-wrap mb-3">
            {["GHMC", "HMDA", "DTCP"].map((o) => (
              <PillButton
                key={o}
                label={o}
                selected={approvedBy.includes(o)}
                onPress={() => toggleArray(approvedBy, setApprovedBy, o)}
              />
            ))}
          </View>

          {/* Price Details */}
          <View className="mt-2">
            <Text className="text-gray-500 font-semibold mb-2 text-left">Price Details <Text className="text-red-500">*</Text></Text>
            <TextInput
              placeholder="₹ Expected Price"
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg bg-[#F9F9F9] p-3 mb-3 text-gray-800 text-left"
              value={expectedPrice}
              onChangeText={(text) => setExpectedPrice(text.replace(/[^0-9.]/g, ''))}
              onFocus={() => setFocusedField('price')}
              onBlur={() => setFocusedField(null)}
              style={{
                borderColor: focusedField === 'price' ? '#90EE90' : '#d1d5db',
              }}
            />
          </View>
          <View className="flex-col gap-2 mb-2">
            {["All inclusive price", "Price Negotiable", "Tax and Govt.charges excluded"].map((item) => {
              const isSelected = selectedPrices.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    if (isSelected) {
                      setSelectedPrices(selectedPrices.filter((i) => i !== item));
                    } else {
                      setSelectedPrices([...selectedPrices, item]);
                    }
                  }}
                  className="flex-row items-center gap-2"
                >
                  <View
                    className={`w-5 h-5 border rounded-sm items-center justify-center ${
                      isSelected ? "border-green-500 bg-green-500" : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
                  </View>
                  <Text className="text-gray-700 text-left">{item}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity  onPress={() => setIsMorePricingModalVisible(true)}>
              <Text className="text-[#22C55E] font-semibold text-left">+ Add more pricing details</Text>
            </TouchableOpacity>
          </View>

          {/* Unique Features */}
          <Text className="mt-4 mb-2 text-[15px] text-[#00000099]">What makes your property unique <Text className="text-red-500">*</Text></Text>
          <TextInput
            placeholder="Share some details about your property like spacious rooms, well maintained facilities."
            multiline={true}
            numberOfLines={3}
            textAlignVertical="top"
            className="rounded-md p-3"
            style={{
              borderWidth: 1,
              borderColor: focusedField === 'description' ? '#90EE90' : '#0000001A',
              width: "100%",
              height: 108,
              paddingTop: 10,
            }}
            value={description}
            onChangeText={(text) => setDescription(text.replace(/[^a-zA-Z0-9\s]/g, ''))}
            onFocus={() => setFocusedField('description')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {/* Amenities, Overlooking, Facing */}
        <View
          className="bg-white rounded-lg p-4 mb-4"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          {/* Amenities */}
          <Text className="text-[15px] text-[#00000099] mb-2">Amenities</Text>
          <View className="flex-row flex-wrap mb-3">
            {["+Maintenance Staff", "+Water Storage", "+RainWater Harvesting", "Feng Shui/Vastu Complaint"].map((item) => (
              <PillButton
                key={item}
                label={item}
                selected={amenities.includes(item)}
                onPress={() => toggleArray(amenities, setAmenities, item)}
              />
            ))}
          </View>

          {/* Overlooking */}
          <Text className="text-[15px] text-[#00000099] mb-2">Overlooking</Text>
          <View className="flex-row flex-wrap mb-3">
            {["pool","park","club","MainRoad","Others"].map((item) => (
              <PillButton
                key={item}
                label={item}
                selected={overlooking.includes(item)}
                onPress={() => toggleArray(overlooking, setOverlooking, item)}
              />
            ))}
          </View>

          {/* Overlooking Additional */}
          <Text className="text-[15px] text-[#00000099] mt-4 mb-2">
            Overlooking 
          </Text>
          <View className="flex-col gap-2 mb-2">
            {["In a Gated Society", "Corner Property"].map((item) => {
              const isSelected = selectedOverlooking.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    if (isSelected) {
                      setSelectedOverlooking(selectedOverlooking.filter((i) => i !== item));
                    } else {
                      setSelectedOverlooking([...selectedOverlooking, item]);
                    }
                  }}
                  className="flex-row items-center gap-2"
                >
                  <View
                    className={`w-5 h-5 border rounded-sm items-center justify-center ${
                      isSelected ? "border-green-500 bg-green-500" : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
                  </View>
                  <Text className="text-gray-700 text-left">{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Property Facing */}
          <Text className="text-[15px] text-[#00000099] mt-4 mb-3">
            Property Facing
          </Text>
          <View className="flex-row flex-wrap mb-3">
            {["East", "West", "North", "South", "North-East","South-east", "South-West"].map(
              (item) => (
                <PillButton
                  key={item}
                  label={item}
                  selected={propertyFacing === item}
                  onPress={() => setPropertyFacing(item)}
                />
              )
            )}
          </View>
          <Text className="text-[15px] text-gray-500 mb-3">Width of facing road</Text>
          <View
            className="flex-row items-center rounded-md p-3"
            style={{
              backgroundColor: "#D9D9D91C",
              borderWidth: 1,
              borderColor: focusedField === 'roadWidth' ? '#90EE90' : '#0000001A',
            }}
          >
            <TextInput
              placeholder="Enter the width"
              className="flex-1 px-3"
              style={{ height: 52 }}
              value={roadWidth}
              onChangeText={(text) => setRoadWidth(text.replace(/[^0-9.]/g, ''))}
              keyboardType="numeric"
              onFocus={() => setFocusedField('roadWidth')}
              onBlur={() => setFocusedField(null)}
            />
            <View style={{ width: 1, backgroundColor: "#0000001A", height: "90%" }} />
            <View style={{ width: 100 }}>
              <Picker
                selectedValue={roadUnit}
                onValueChange={(v) => setRoadUnit(v)}
                mode="dropdown"
                style={{ height: 52, width: "100%" }}
              >
                <Picker.Item label="sqft" value="sqft" />
                <Picker.Item label="sqm" value="sqm" />
                <Picker.Item label="acre" value="acre" />
              </Picker>
            </View>
          </View>
        
          {/* Location Advantages */}
          <Text className="text-[15px] text-[#00000099] mt-4 mb-3">
            Location Advantages
          </Text>
          <View className="flex-row flex-wrap">
            {[
              "+ close to Market",
              "+ close to Mall",
              "+ close to Hospital",
              "+ close to Railway Station",
              "+ close to Metro Station",
              "+ close to School",
              "+ close to Airport",
              "+ close to Highway",
            ].map((item) => (
              <PillButton
                key={item}
                label={item}
                selected={locationAdvantages.includes(item)}
                onPress={() =>
                  toggleArray(locationAdvantages, setLocationAdvantages, item)
                }
              />
            ))}
          </View>
        </View>

       
      </ScrollView>
       <View
          style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16, gap:12 }}
          className="space-x-3 mb-8"
        >
          {/* Cancel Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#E5E7EB",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 10,
            }}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={{ color: "black", fontWeight: "600", fontSize: 15 }}>
              Cancel
            </Text>
          </TouchableOpacity>

          {/* Upload Property Button */}
          <TouchableOpacity
            style={{
              backgroundColor: isSubmitting ? "#9CA3AF" : "#22C55E",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 10,
            }}
            onPress={handleUpload}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
                Upload Property
              </Text>
            )}
          </TouchableOpacity>
        </View>
    </View>
    <Toast />
    </>
  );
}