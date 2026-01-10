// //Frontend//app//home//screens//Resorts//(Property)//_layout.jsx
// import { View, Text, TouchableOpacity } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { Slot, useRouter, usePathname } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function PropertyLayout() {
//   const router = useRouter();
//   const pathname = usePathname() ?? "";

//   const tabs = [
//     { label: "Overview", route: "/home/screens/Resorts/(Property)" },
//     { label: "Reviews(27)", route: "/home/screens/Resorts/(Property)/Review" },
//     { label: "Write Review", route: "/home/screens/Resorts/(Property)/WriteReview" },
//   ];

//   // ✅ Tab detection logic
//   const isReview = pathname.includes("/Review");
//   const isWriteReview = pathname.includes("/WriteReview");
//   const isOverview = !isReview && !isWriteReview ;

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       {/* Header */}
//       <View
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           paddingHorizontal: 16,
//           paddingTop: 12,
//           marginBottom: 8,
//         }}
//       >
//         <TouchableOpacity onPress={() => router.push("/home/screens/Resorts/SelectSite")}>
//           <Ionicons name="chevron-back-outline" size={22} color="black" />
//         </TouchableOpacity>

//         <Text
//           style={{
//             marginLeft: 10,
//             fontSize: 20,
//             fontFamily: "Poppins",
//             fontWeight: "600",
//             color: "#000",
//           }}
//         >
//           Property Details
//         </Text>
//       </View>

//       {/* Tabs */}
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "space-around",
//           borderBottomWidth: 1,
//           borderBottomColor: "#E5E7EB",
//         }}
//       >
//         {tabs.map((tab, idx) => {
//           const isActive =
//             (tab.route.endsWith("/Review") && isReview) ||
//             (tab.route.endsWith("/WriteReview") && isWriteReview) ||
//             (tab.route === "/home/screens/Resorts/(Property)" && isOverview);

//           return (
//             <TouchableOpacity
//               key={idx}
//               onPress={() => !isActive && router.push(tab.route)}
//               activeOpacity={0.7}
//               style={{
//                 alignItems: "center",
//                 paddingVertical: 10,
//                 paddingHorizontal: 8,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 13,
//                   fontFamily: "Poppins",
//                   color: isActive ? "#000" : "#9CA3AF",
//                   fontWeight: isActive ? "600" : "400",
//                 }}
//               >
//                 {tab.label}
//               </Text>

//               {isActive && (
//                 <View
//                   style={{
//                     width: 80,
//                     height: 2,
//                     backgroundColor: "#000",
//                     borderRadius: 2,
//                     marginTop: 4,
//                   }}
//                 />
//               )}
//             </TouchableOpacity>
//           );
//         })}
//       </View>

//       {/* Page content */}
//       <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20 }}>
//         <Slot />
//       </View>
//     </SafeAreaView>
//   );
// }


// Frontend/app/home/screens/Resorts/(Property)/_layout.jsx
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Slot, useRouter, usePathname, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PropertyLayout() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const { propertyId } = useLocalSearchParams(); // ✅ Get propertyId from params

  const tabs = [
    { label: "Overview", route: "/home/screens/Resorts/(Property)", params: { propertyId } },
    { label: "Reviews(27)", route: "/home/screens/Resorts/(Property)/Review", params: { propertyId } },
    { label: "Write Review", route: "/home/screens/Resorts/(Property)/WriteReview", params: { propertyId } },
  ];

  // ✅ Tab detection logic
  const isReview = pathname.includes("/Review");
  const isWriteReview = pathname.includes("/WriteReview");
  const isOverview = !isReview && !isWriteReview;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 12,
          marginBottom: 8,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={22} color="black" />
        </TouchableOpacity>

        <Text
          style={{
            marginLeft: 10,
            fontSize: 20,
            fontFamily: "Poppins",
            fontWeight: "600",
            color: "#000",
          }}
        >
          Property Details
        </Text>
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        {tabs.map((tab, idx) => {
          const isActive =
            (tab.route.endsWith("/Review") && isReview) ||
            (tab.route.endsWith("/WriteReview") && isWriteReview) ||
            (tab.route === "/home/screens/Resorts/(Property)" && isOverview);

          return (
            <TouchableOpacity
              key={idx}
              onPress={() => !isActive && router.push({
                pathname: tab.route,
                params: tab.params
              })}
              activeOpacity={0.7}
              style={{
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins",
                  color: isActive ? "#000" : "#9CA3AF",
                  fontWeight: isActive ? "600" : "400",
                }}
              >
                {tab.label}
              </Text>

              {isActive && (
                <View
                  style={{
                    width: 80,
                    height: 2,
                    backgroundColor: "#000",
                    borderRadius: 2,
                    marginTop: 4,
                  }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Page content */}
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20 }}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}