//app//home//screens//Sites//(Property)//_layout.jsx
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Slot, useRouter, usePathname, useLocalSearchParams } from "expo-router"; // ✅ ADD useLocalSearchParams
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react"; // ✅ Add useState and useEffect
import { fetchReviews } from "utils/reviewApi"; // ✅ Add this import
export default function PropertyLayout() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const params = useLocalSearchParams();
  const propertyId = params.propertyId;
  const entityType = params.entityType || 'property'; // ✅ Add these two lines // ✅ GET propertyId from params
  const areaKey = params.areaKey;
  const [reviewCount, setReviewCount] = useState(0);
  console.log('📋 Layout - propertyId:', propertyId); // ✅ DEBUG

  
  useEffect(() => {
  if (propertyId && entityType) {
    fetchReviews(entityType, propertyId).then((res) => {
      setReviewCount(res.count || 0);
    });
  }
}, [propertyId, entityType]);
const tabs = [
  { label: "Overview", route: "/home/screens/Sites/(Property)", params: { propertyId } },
  { label: `Reviews(${reviewCount})`, route: "/home/screens/Sites/(Property)/Review", params: { propertyId } }, // ✅ Changed from Reviews(27)
  { label: "Write Review", route: "/home/screens/Sites/(Property)/WriteReview", params: { propertyId } },
];
  // ✅ Tab detection logic
  const isReview = pathname.includes("/Review");
  const isWriteReview = pathname.includes("/WriteReview");
  const isOverview = !isReview && !isWriteReview;
 const handleBack = () => {
  const fromSaved = params.fromSaved;
  const fromMyProperties = params.fromMyProperties;
  const backRoute = params.backRoute;
  const propertyDetailsRoute = params.propertyDetailsRoute; // ✅ ADD THIS
  
  if (fromSaved === 'true') {
    router.push('/home/screens/Sidebar/SavedPropertiesScreen');
  } else if (fromMyProperties === 'true') {
    router.push('/home/screens/Sidebar/MyProperties');
  } else if (propertyDetailsRoute) { // ✅ ADD THIS - use propertyDetailsRoute if available
    router.push({
      pathname: propertyDetailsRoute,
      params: { propertyId, entityType, areaKey }
    });
  } else if (backRoute) {
    router.push({
      pathname: backRoute,
      params: { propertyId, entityType, areaKey }
    });
  } else {
    router.push({
      pathname: "/home/screens/Sites/PropertyDetails",
      params: { propertyId, entityType, areaKey }
    });
  }
};
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
        <TouchableOpacity onPress={handleBack}>
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
    (tab.route === "/home/screens/Sites/(Property)" && isOverview); // ✅ FIXED: Changed from Flats to Sites

  return (
    <TouchableOpacity
      key={idx}
     onPress={() => {
  if (!isActive) {
    router.push({
      pathname: tab.route,
      params: { 
        propertyId,
        entityType,
        areaKey
      }
    });
  }
}}
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
