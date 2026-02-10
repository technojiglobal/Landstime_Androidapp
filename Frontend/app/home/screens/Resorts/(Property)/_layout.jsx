


// Frontend/app/home/screens/Resorts/(Property)/_layout.jsx
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Slot, useRouter, usePathname, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { fetchReviews } from "utils/reviewApi";

export default function PropertyLayout() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const params = useLocalSearchParams();
  const propertyId = params.propertyId;
  const entityType = params.entityType || 'property';
  const areaKey = params.areaKey || null;
  const [reviewCount, setReviewCount] = useState(0);
 // ✅ Add these two lines// ✅ Get propertyId from params
 useEffect(() => {
    if (propertyId && entityType) {
      fetchReviews(entityType, propertyId).then((res) => {
        setReviewCount(res.count || 0);
      });
    }
  }, [propertyId, entityType]);
  const tabs = [
    { label: "Overview", route: "/home/screens/Resorts/(Property)", params: { propertyId } },
    { label: `Reviews(${reviewCount})`, route: "/home/screens/Resorts/(Property)/Review", params: { propertyId } },
    { label: "Write Review", route: "/home/screens/Resorts/(Property)/WriteReview", params: { propertyId } },
  ];

  // ✅ Tab detection logic
  const isReview = pathname.includes("/Review");
  const isWriteReview = pathname.includes("/WriteReview");
  const isOverview = !isReview && !isWriteReview;
  const handleBack = () => {
  const fromSaved = params.fromSaved;
  const fromMyProperties = params.fromMyProperties;
  const backRoute = params.backRoute;
  
  if (fromSaved === 'true') {
    router.push('/home/screens/Sidebar/SavedPropertiesScreen');
  } else if (fromMyProperties === 'true') {
    router.push('/home/screens/Sidebar/MyProperties');
  } else if (backRoute) {
    router.push({
      pathname: backRoute,
      params: { propertyId, entityType, areaKey }
    });
  } else {
    router.push({
      pathname: "/home/screens/Resorts/PropertyDetails",
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
            (tab.route === "/home/screens/Resorts/(Property)" && isOverview);

          return (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                if (!isActive) {
                  router.push({
                    pathname: tab.route,
                    params: {
                      propertyId,
                      entityType
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