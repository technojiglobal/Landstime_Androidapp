//Frontend/app/home/screens/Sidebar/RoomOverview.jsx

// import {React,useState,useEffect} from "react";
// import { View, Text, Image, ScrollView, TouchableOpacity,StatusBar } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import starImg from "../../../../assets/star-3d.png";
// import saveIcon from "../../../../assets/save-icon.png" ;
// import saveBlue from "../../../../assets/save-blue.png"
// export default function RoomOverviewScreen() {
//   const router = useRouter();
//   const { id } = useLocalSearchParams();
// const BASE_URL = "http://192.168.31.115:8000";
// const [save,setSave]=useState(false)
// const [data, setData] = useState(null);
// const [loading, setLoading] = useState(true);


// useEffect(() => {
//   fetchDesign();
// }, []);

// const fetchDesign = async () => {
//   try {
//     const res = await fetch(
//       `${BASE_URL}/api/admin/interior/designs/${id}`
//     );
//     const json = await res.json();
//     setData(json.data);
//   } catch (error) {
//     console.error("Failed to load design", error);
//   } finally {
//     setLoading(false);
//   }
// };
// if (loading || !data) {
//   return (
//     <View className="flex-1 justify-center items-center bg-white">
//       <Text>Loading...</Text>
//     </View>
//   );
// }


//   return (
//     <ScrollView className="flex-1 bg-white mt-12">
//   <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
//       {/* Top Image Section */}
//       <View className="relative">
//         <Image
//   source={{
//     uri: data.images?.[0]
//       ? `${BASE_URL}${data.images[0]}`
//       : "https://via.placeholder.com/600x400",
//   }}
//   className="w-full h-64"
//   resizeMode="cover"
// />


//         {/* Back Icon */}
//         <TouchableOpacity 
//           onPress={() => router.back()} 
//           className="absolute top-10 left-4 bg-black/30 p-2 rounded-full"
//         >
//           <Ionicons name="arrow-back" size={22} color="white" />
//         </TouchableOpacity>

//         {/* Bookmark */}
//         <TouchableOpacity className="absolute top-10 right-4 bg-black/30 p-2 rounded-full" onPress={()=>setSave(!save)}>
//          <Image source={save?saveIcon:saveBlue} className="w-6 h-6" />
//         </TouchableOpacity>

//         {/* Views + Likes */}
//         <View className="absolute bottom-3 right-3 flex-row space-x-4">
//           <View className=" px-2 py-1 rounded-2xl bg-[#302924CC] flex-row items-center mx-2 ">
//             <Ionicons name="eye" size={16} color="white" />
//             <Text className="text-white ml-1">{Math.floor(Math.random() * 3000) + 500}
// </Text>
//           </View>
//           <View className="flex-row items-center px-2 py-1 rounded-2xl bg-[#302924CC]">
//             <Ionicons name="heart" size={16} color="white" />
//             <Text className="text-white ml-1">{Math.floor(Math.random() * 3000) + 500}
// </Text>
//           </View>
//         </View>
//       </View>

//       {/* Content Section */}
//       <View className="p-4">

//         {/* Title */}
//         <Text className="text-xl font-bold text-gray-900">
//           {data.name}
//         </Text>

//         {/* Rating Row */}
//         <View className="flex-row justify-between items-center mt-2">

//           {/* Left Rating */}
//           <View className="flex-row items-center">
//             <View className="flex-row my-2">
//                      {[1, 2, 3, 4].map((_, i) => (
//                        <Image
//                          key={i}
//                          source={starImg}
//                          style={{
//                            width: 22,
//                            height: 22,
//                            marginHorizontal: 2,
//                            opacity: 1,
//                          }}
//                          resizeMode="contain"
//                        />
//                      ))}

//                      <Image
//                        source={starImg}
//                        style={{
//                          width: 22,
//                          height: 22,
//                          marginHorizontal: 2,
//                          opacity: 0.3, // empty
//                        }}
//                        resizeMode="contain"
//                      />
//                    </View>

//             <Text className="ml-1 text-gray-800 font-semibold">
//               {data.rating ?? 4.8}
// <Text className="ml-1 text-gray-500 text-sm">(Verified)</Text>

//             </Text>
//             {/* <Text className="ml-1 text-gray-500 text-sm">
//               ({data.reviews})
//             </Text> */}
//           </View>

//           {/* Button */}
//           <TouchableOpacity className="bg-[#22C55E] px-4 py-2  rounded-full flex-row items-center">
//             <Ionicons name="location-outline" size={18} color="white" />
//             <Text className="ml-2 text-white font-semibold">See on Map</Text>
//           </TouchableOpacity>

//         </View>

//         {/* Price Section */}
//         <Text className="text-green-600 mt-3 text-xl font-bold">
//           {data.price}

//         </Text>

//         {/* Info Row */}
//         <View className="flex-row justify-between mt-4">

//           {/* Area */}
//           <View className="items-center">
//             <Text className="font-semibold text-base">{data.area}</Text>
//             <Text className="text-gray-500 text-sm">sq ft</Text>
//           </View>

//           {/* Duration */}
//           <View className="items-center">
//             <Text className="font-semibold text-base">{data.duration}</Text>
//             <Text className="text-gray-500 text-sm">Weeks</Text>
//           </View>

//           {/* Location */}
//           <View className="items-center">
//             <Text className="font-semibold text-base">{data.location}</Text>
//             <Text className="text-gray-500 text-sm">Location</Text>
//           </View>

//         </View>

//         {/* Description */}
//         <Text className="mt-6 text-xl font-semibold">Description</Text>
//             <Text className="text-gray-600 mt-2 leading-6">
//             {data.description ||
//                 "Luxurious resort property nestled in the heart of Araku’s tea plantations. Features modern amenities, panoramic valley views, and excellent connectivity to major attractions. Perfect for hospitality business or private retreat.\n\nLuxurious resort property nestled in the heart of Araku’s tea plantations. Features modern amenities, panoramic valley views, and excellent connectivity to major attractions. Perfect for hospitality business or private retreat."
//             }
//             </Text>




//       </View>
//     </ScrollView>
//   );
// }


// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import starImg from "../../../../assets/star-3d.png";
// import saveIcon from "../../../../assets/save-icon.png";
// import saveBlue from "../../../../assets/save-blue.png";

// const BASE_URL = "http://192.168.31.115:8000";

// export default function RoomOverviewScreen() {
//   const router = useRouter();
//   const { id } = useLocalSearchParams();

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [save, setSave] = useState(false);

//   useEffect(() => {
//     fetchDesign();
//   }, [id]);

//   const fetchDesign = async () => {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/admin/interior/designs/${id}`
//       );
//       const json = await res.json();

//       if (res.ok) {
//         setData(json.data);
//       } else {
//         console.error(json.message);
//       }
//     } catch (err) {
//       console.error("Fetch design error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-white">
//         <ActivityIndicator size="large" color="#22C55E" />
//       </View>
//     );
//   }

//   if (!data) {
//     return (
//       <View className="flex-1 justify-center items-center bg-white">
//         <Text>Design not found</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-white mt-12">
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

//       {/* ---------- IMAGE SECTION ---------- */}
//       <View className="relative">
//         <Image
//           source={{
//             uri: data.images?.[0]
//               ? `${BASE_URL}${data.images[0]}`
//               : "https://via.placeholder.com/400x300",
//           }}
//           className="w-full h-64"
//           resizeMode="cover"
//         />

//         {/* Back */}
//         <TouchableOpacity
//           onPress={() => router.back()}
//           className="absolute top-10 left-4 bg-black/30 p-2 rounded-full"
//         >
//           <Ionicons name="arrow-back" size={22} color="white" />
//         </TouchableOpacity>

//         {/* Save */}
//         <TouchableOpacity
//           className="absolute top-10 right-4 bg-black/30 p-2 rounded-full"
//           onPress={() => setSave(!save)}
//         >
//           <Image source={save ? saveBlue : saveIcon} className="w-6 h-6" />
//         </TouchableOpacity>
//       </View>

//       {/* ---------- CONTENT ---------- */}
//       <View className="p-4">

//         {/* Title */}
//         <Text className="text-xl font-bold text-gray-900">
//           {data.name}
//         </Text>

//         {/* Rating */}
//         <View className="flex-row items-center mt-2 ">
//           {[1, 2, 3, 4, 5].map((_, i) => (
//             <Image
//               key={i}
//               source={starImg}
//               style={{
//                 width: 20,
//                 height: 20,
//                 marginRight: 2,
//                 opacity: i < Math.round(data.rating) ? 1 : 0.3,
//               }}
//             />
//           ))}
//           <Text className="ml-2 font-semibold text-gray-800">
//             {data.rating}
//           </Text>
//           <TouchableOpacity className="bg-[#22C55E] px-4 py-2  rounded-full flex-row -right-4 ml-24">
// //             <Ionicons name="location-outline" size={18} color="white" />
// //             <Text className="ml-2 text-white font-semibold">See on Map</Text>
// //           </TouchableOpacity>
//         </View>

//         {/* Price */}
//         <Text className="text-green-600 mt-3 text-xl font-bold">
//           {data.price}
//         </Text>

//         {/* Info */}
//         <View className="flex-row justify-between mt-4">
//           <Info label="Area" value={data.area} />
//           <Info label="Duration" value={data.duration} />
//           <Info label="Location" value={data.location} />
//         </View>

//         {/* Description */}
//         <Text className="mt-6 text-xl font-semibold">Description</Text>
//         <Text className="text-gray-600 mt-2 leading-6">
//           {data.description || "No description available"}
//         </Text>
//       </View>
//     </ScrollView>
//   );
// }

// /* ---------- Helper ---------- */
// const Info = ({ label, value }) => (
//   <View className="items-center">
//     <Text className="font-semibold text-base">{value}</Text>
//     <Text className="text-gray-500 text-sm">{label}</Text>
//   </View>
// );

//Frontend/app/home/screens/Sidebar/RoomOverview.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import starImg from "../../../../assets/star-3d.png";
import saveIcon from "../../../../assets/save-icon.png";
import saveBlue from "../../../../assets/save-blue.png";
import Review from "../../../../components/Review";
import WriteReview from "../../../../components/WriteReview";
export default function RoomOverviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const BASE_URL = "http://192.168.31.115:8000";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [save, setSave] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [reviewSummary, setReviewSummary] = useState({
    avg: 0,
    count: 0,
  });

  useEffect(() => {
    fetch(`http://192.168.31.115:8000/api/reviews/interior/${id}`)
      .then((res) => res.json())
      .then((data) =>
        setReviewSummary({
          avg: data.avgRating,
          count: data.count,
        })
      );
  }, []);


  /* ---------- FETCH DESIGN ---------- */
  useEffect(() => {
    fetchDesign();
  }, []);

  const fetchDesign = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/admin/interior/designs/${id}`
      );
      const json = await res.json();
      setData(json.data);
    } catch (error) {
      console.error("Failed to load design", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white mt-12">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />



      {/* ================= TABS ================= */}
      <View className="flex-row justify-around border-b border-gray-200">
        {["Overview", "Reviews", "Write Review"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`py-3 px-4 ${activeTab === tab ? "border-b-2 border-green-600" : ""
              }`}
          >
            <Text
              className={`font-semibold ${activeTab === tab ? "text-black" : "text-gray-400"
                }`}
            >
              {tab}
              {tab === "Reviews" && ` (${reviewSummary.count})`}

            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ================= OVERVIEW TAB ================= */}
      {activeTab === "Overview" && (
        <View className="p-4">
          {/* ================= IMAGE SECTION ================= */}
          <View className="relative">
            <Image
              source={{
                uri: data.images?.[0]
                  ? `${BASE_URL}${data.images[0]}`
                  : "https://via.placeholder.com/600x400",
              }}
              className="w-full h-64"
              resizeMode="cover"
            />

            {/* Back */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute top-10 left-4 bg-black/30 p-2 rounded-full"
            >
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>

            {/* Save */}
            <TouchableOpacity
              onPress={() => setSave(!save)}
              className="absolute top-10 right-4 bg-black/30 p-2 rounded-full"
            >
              <Image
                source={save ? saveBlue : saveIcon}
                className="w-6 h-6"
              />
            </TouchableOpacity>

            {/* Views + Likes */}
            <View className="absolute bottom-3 right-3 flex-row space-x-4">
              <View className="px-2 py-1 rounded-2xl bg-[#302924CC] flex-row items-center mx-2">
                <Ionicons name="eye" size={16} color="white" />
                <Text className="text-white ml-1">
                  {Math.floor(Math.random() * 3000) + 500}
                </Text>
              </View>

              <View className="px-2 py-1 rounded-2xl bg-[#302924CC] flex-row items-center">
                <Ionicons name="heart" size={16} color="white" />
                <Text className="text-white ml-1">
                  {Math.floor(Math.random() * 3000) + 500}
                </Text>
              </View>
            </View>
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-gray-900 mt-4">
            {data.name}
          </Text>

          {/* Rating */}
          <View className="flex-row justify-between items-center mt-2">
            <View className="flex-row items-center">
              <View className="flex-row my-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Image
                    key={i}
                    source={starImg}
                    style={{
                      width: 22,
                      height: 22,
                      marginHorizontal: 2,
                      opacity: i <= Math.round(reviewSummary.avg) ? 1 : 0.3,
                    }}
                  />
                ))}
              </View>


              <Text className="ml-1 text-gray-800 font-semibold">
                <Text>{reviewSummary.avg}</Text>
                <Text>({reviewSummary.count} reviews)</Text>

              </Text>
              
            </View>

            <TouchableOpacity className="bg-[#22C55E] px-4 py-2 rounded-full flex-row items-center">
              <Ionicons name="location-outline" size={18} color="white" />
              <Text className="ml-2 text-white font-semibold">
                See on Map
              </Text>
            </TouchableOpacity>
          </View>

          {/* Price */}
          <Text className="text-green-600 mt-3 text-xl font-bold">
            ₹ {data.price}
          </Text>

          {/* Info */}
          <View className="flex-row justify-between mt-4">
            <View className="items-center">
              <Text className="font-semibold">{data.area}</Text>
              <Text className="text-gray-500 text-sm">sq ft</Text>
            </View>

            <View className="items-center">
              <Text className="font-semibold">{data.duration}</Text>
              <Text className="text-gray-500 text-sm">Weeks</Text>
            </View>

            <View className="items-center">
              <Text className="font-semibold">{data.location}</Text>
              <Text className="text-gray-500 text-sm">Location</Text>
            </View>
          </View>

          {/* Description */}
          <Text className="mt-6 text-xl font-semibold">Description</Text>
          <Text className="text-gray-600 mt-2 leading-6">
            {data.description || "No description available"}
          </Text>
        </View>
      )}

      {/* ================= REVIEWS TAB ================= */}
      {activeTab === "Reviews" && (
        <Review entityId={id} entityType="interior" />
      )}

      {/* ================= WRITE REVIEW TAB ================= */}
      {activeTab === "Write Review" && (
        <WriteReview entityId={id} entityType="interior" />
      )}
    </ScrollView>
  );
}