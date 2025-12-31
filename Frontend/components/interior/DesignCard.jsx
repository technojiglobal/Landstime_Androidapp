// // Frontend/components/interior/DesignCard.jsx

// import React from "react";
// import { View, Text, Image, TouchableOpacity } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { useState } from "react";
// import shareIcon from "../../assets/share-icon.png";
// import saveIcon from "../../assets/save-icon.png";
// import clockIcon from "../../assets/clock-icon.png";
// import scaleIcon from "../../assets/scale-icon.png";
// import locationIcon from "../../assets/location-icon2.png";
// import viewIcon from "../../assets/view-icon.png";
// import eyeIcon from "../../assets/eye-icon.png";
// import likeIcon from "../../assets/likes-icon.png";
// import starIcon from "../../assets/star-icon.png";
// import star from "../../assets/star-3d.png";
// export default function DesignCard({ data }) {
//   const router = useRouter();
//   const [saved, setSaved] = useState(false);
//   const [rated, setRated] = useState(false);
//   return (
//    <TouchableOpacity
//       onPress={() => router.push({
//         pathname: "/home/screens/Sidebar/RoomOverview",
//         params: { item: JSON.stringify(data) }   // SEND ENTIRE CARD DATA
//       })}
//       className="rounded-lg border border-gray-200 overflow-hidden shadow-sm bg-white w-full flex flex-col "
//     >
//       {/* ... your existing card UI ... */}
//        <View className="rounded-lg border border-gray-300 overflow-hidden  bg-white w-full flex flex-col">

//       {/* ---------- IMAGE SECTION ---------- */}
//       <View className="relative m-2 ">
//         <Image
//           source={data.image}
//           className="w-full h-56 rounded-xxl"
//           resizeMode="cover"
//         />

//         {/* Discount Tag */}
//         {data.discount && (
//           <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-md">
//             <Text className="text-white text-xs font-semibold">
//               {data.discount}
//             </Text>
//           </View>
//         )}

//         {/* Save + Share Icons */}
//         <View className="absolute top-2 right-2 flex-row space-x-2">
//           <View className="bg-white p-1.5 rounded-full shadow">
//           <TouchableOpacity onPress={() => setRated(!rated)}  >
//             <Image 
//               source={ rated 
//                 ? require("../../assets/star-3d.png")
//                 : require("../../assets/star-icon.png")
//               }
//                className="w-5 h-5"
//             />
//           </TouchableOpacity>
//           </View>
//           <View className="bg-white p-1.5 rounded-full shadow mx-2">
//          <TouchableOpacity onPress={() => setSaved(!saved)}>
//             <Image 
//               source={ saved 
//                 ? require("../../assets/save-blue.png")
//                 : require("../../assets/save-icon.png")
//               }
//               className="w-5 h-5"
//             />
//           </TouchableOpacity>
//           </View>
//           <View className="bg-white p-1.5 rounded-full shadow">
//             <TouchableOpacity onPress={()=>router.push("/home/screens/Sidebar/SavedInteriors")}>
//             <Image source={shareIcon} className="w-5 h-5" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Views & Likes */}
//         <View className="absolute bottom-2 right-2 flex-row space-x-4">
//           <View className=" bg-[#302924CC] mx-2 px-2 p-1 rounded-xl flex-row items-center space-x-1">
//             <Image source={eyeIcon} className="w-5 h-5 mx-1" />
//             <Text className="text-white text-sm font-medium">{data.views}</Text>
//           </View>

//           <View className=" bg-[#302924CC] mx-2 px-2 p-1 rounded-xl flex-row items-center space-x-1">
//             <Image source={likeIcon} className="w-5 h-5 mx-1" />
//             <Text className="text-white text-sm font-medium">{data.likes}</Text>
//           </View>
//         </View>
//       </View>

//       {/* ---------- CONTENT SECTION ---------- */}
//       <View className="p-4 flex flex-col flex-grow">

//         <View className="flex-row justify-between items-start mb-2">
//           <Text className="text-base font-semibold text-gray-800">
//             {data.title}
//           </Text>
//         </View>

//         {/* Designer + Rating */}
//         <View className="flex-row justify-between items-center mb-3">
//           <View className="flex-row items-center space-x-2">
//             {data.profile && (
//               <Image
//                 source={data.profile}
//                 className="w-7 h-7 rounded-full mx-2"
//                 resizeMode="cover"
//               />
//             )}
//             <Text className="text-sm text-gray-700">{data.designer}</Text>
//           </View>

//           <View className="flex-row items-center space-x-1">
//              <Image source={star} className="w-3 h-3" />
//             <Text className="text-sm font-medium text-gray-700">
//               {data.rating}
//             </Text>
//             <Text className="text-xs text-gray-500">({data.reviews})</Text>
//           </View>
//         </View>

//         {/* Area - Duration - Location */}
//         <View className="flex-row justify-between text-xs text-gray-600 mb-4">
//           <View className="flex-row items-center space-x-1">
//             <Image source={scaleIcon} className="w-3 h-3 mx-1" />
//             <Text className="text-xs">{data.area}</Text>
//           </View>

//           <View className="flex-row items-center space-x-1">
//             <Image source={clockIcon} className="w-3 h-3 mx-1" />
//             <Text className="text-xs">{data.duration}</Text>
//           </View>

//           <View className="flex-row items-center space-x-1">
//             <Image source={locationIcon} className="w-3 h-3 mx-1" />
//             <Text className="text-xs">{data.location}</Text>
//           </View>
//         </View>

//         {/* Price + Buttons */}
//         <View className="flex-row justify-between items-center mt-auto">
//           <View className=" flex-1 flex-row ">
//           <Text className="text-lg font-semibold text-gray-800">
//             {data.minprice}
//           </Text>
//           <Text className="text-md  mt-1 text-gray-500">
//             {data.maxprice}
//           </Text>
//           </View>
//           <View className=" flex-row space-x-2">
//             <TouchableOpacity className=" flex-row items-center border border-gray-300 rounded-md px-2  mx-2">
//                <Image source={viewIcon} className="w-5 h-5 m-1" />
//               <Text className="text-sm text-gray-700">View</Text>
//             </TouchableOpacity>
             

//             <TouchableOpacity
//               onPress={() => router.push("home/screens/Sidebar/Contact")}
//               className="bg-[#22C55E] rounded-md px-4 py-1"
//             >
//               <Text className="text-white text-sm font-medium">Contact</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//       </View>
//     </View>
//     </TouchableOpacity>
//   );
// }


//Frontend/components/interior/DesignCard.jsx
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import shareIcon from "../../assets/share-icon.png";
import saveIcon from "../../assets/save-icon.png";
import saveBlue from "../../assets/save-blue.png";
import clockIcon from "../../assets/clock-icon.png";
import scaleIcon from "../../assets/scale-icon.png";
import locationIcon from "../../assets/location-icon2.png";
import viewIcon from "../../assets/view-icon.png";
import eyeIcon from "../../assets/eye-icon.png";
import likeIcon from "../../assets/likes-icon.png";
import starIcon from "../../assets/star-icon.png";
import star3d from "../../assets/star-3d.png";
import profileImg from "../../assets/profile.jpg";

const BASE_URL = "http://10.10.1.101:8000";

export default function DesignCard({ data }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [rated, setRated] = useState(false);

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/home/screens/Sidebar/RoomOverview",
          params: { id: data._id }, // ✅ PASS ID ONLY
        })
      }
      className="rounded-lg border border-gray-200 overflow-hidden shadow-sm bg-white w-full"
    >
      <View className="rounded-lg border border-gray-300 overflow-hidden bg-white w-full">

        {/* ---------- IMAGE SECTION ---------- */}
        <View className="relative m-2">
          <Image
            source={{
              uri: data.images?.[0]
                ? `${BASE_URL}${data.images[0]}`
                : "https://via.placeholder.com/400x300",
            }}
            className="w-full h-56 rounded-xxl"
            resizeMode="cover"
          />

          {/* TOP RATED TAG */}
          {data.rating >= 4.7 && (
            <View className="absolute top-2 left-2 bg-green-600 px-2 py-1 rounded-md">
              <Text className="text-white text-xs font-semibold">
                TOP RATED
              </Text>
            </View>
          )}

          {/* SAVE + RATE + SHARE */}
          <View className="absolute top-2 right-2 flex-row">
            <View className="bg-white p-1.5 rounded-full shadow mx-1">
              <TouchableOpacity onPress={() => setRated(!rated)}>
                <Image
                  source={rated ? star3d : starIcon}
                  className="w-5 h-5"
                />
              </TouchableOpacity>
            </View>

            <View className="bg-white p-1.5 rounded-full shadow mx-1">
              <TouchableOpacity onPress={() => setSaved(!saved)}>
                <Image
                  source={saved ? saveBlue : saveIcon}
                  className="w-5 h-5"
                />
              </TouchableOpacity>
            </View>

            <View className="bg-white p-1.5 rounded-full shadow mx-1">
              <Image source={shareIcon} className="w-5 h-5" />
            </View>
          </View>

          {/* VIEWS & LIKES (fallback) */}
          <View className="absolute bottom-2 right-2 flex-row">
            <View className="bg-[#302924CC] mx-2 px-2 py-1 rounded-xl flex-row items-center">
              <Image source={eyeIcon} className="w-4 h-4 mx-1" />
              <Text className="text-white text-sm">
                {Math.floor(Math.random() * 3000) + 500}
              </Text>
            </View>

            <View className="bg-[#302924CC] mx-2 px-2 py-1 rounded-xl flex-row items-center">
              <Image source={likeIcon} className="w-4 h-4 mx-1" />
              <Text className="text-white text-sm">
                {Math.floor(Math.random() * 800) + 100}
              </Text>
            </View>
          </View>
        </View>

        {/* ---------- CONTENT ---------- */}
        <View className="p-4 flex flex-col flex-grow">

          {/* TITLE */}
          <Text className="text-base font-semibold text-gray-800 mb-2">
            {data.name}
          </Text>

          {/* DESIGNER + RATING */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Image
                source={profileImg}
                className="w-7 h-7 rounded-full mx-2"
              />
              <Text className="text-sm text-gray-700">
                {data.designer}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Image source={star3d} className="w-3 h-3 mr-1" />
              <Text className="text-sm font-medium text-gray-700">
                {data.rating}
              </Text>
            </View>
          </View>

          {/* AREA - DURATION - LOCATION */}
          <View className="flex-row justify-between text-xs text-gray-600 mb-4">
            <View className="flex-row items-center">
              <Image source={scaleIcon} className="w-3 h-3 mx-1" />
              <Text>{data.area}</Text>
            </View>

            <View className="flex-row items-center">
              <Image source={clockIcon} className="w-3 h-3 mx-1" />
              <Text>{data.duration}</Text>
            </View>

            <View className="flex-row items-center">
              <Image source={locationIcon} className="w-3 h-3 mx-1" />
              <Text>{data.location}</Text>
            </View>
          </View>

          {/* PRICE + ACTIONS */}
          <View className="flex-row justify-between items-center mt-auto">
            <Text className="text-lg font-semibold text-gray-800">
              {data.price}
            </Text>

            <View className="flex-row">
              <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-md px-2 mx-2">
                <Image source={viewIcon} className="w-5 h-5 m-1" />
                <Text className="text-sm text-gray-700">View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  router.push("/home/screens/Sidebar/Contact")
                }
                className="bg-[#22C55E] rounded-md px-4 py-1"
              >
                <Text className="text-white text-sm font-medium">
                  Contact
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    </TouchableOpacity>
  );
}
