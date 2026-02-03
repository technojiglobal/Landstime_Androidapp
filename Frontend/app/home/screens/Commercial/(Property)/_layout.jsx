
//Frontend/app/home/screens/Commercial/(Property)/_layout.jsx
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Slot, useRouter, usePathname, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react"; // ✅ Add useState and useEffect
import { fetchReviews } from "utils/reviewApi";
export default function PropertyLayout() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const params = useLocalSearchParams();
  const propertyId = params.propertyId;
  const entityType = params.entityType || 'property';
  const areaKey = params.areaKey; // ✅ Add these two lines
  const [reviewCount, setReviewCount] = useState(0);
useEffect(() => {
  if (propertyId && entityType) {
    fetchReviews(entityType, propertyId).then((res) => {
      setReviewCount(res.count || 0);
    });
  }
}, [propertyId, entityType]);
  const tabs = [
    { label: "Overview", route: "/home/screens/Commercial/(Property)" },
    { label: `Reviews(${reviewCount})`, route: "/home/screens/Commercial/(Property)/Review" },
    { label: "Write Review", route: "/home/screens/Commercial/(Property)/WriteReview" },
  ];

  // ✅ Tab detection logic
  const isReview = pathname.includes("/Review");
  const isWriteReview = pathname.includes("/WriteReview");
  const isOverview = !isReview && !isWriteReview;
 const handleBack = () => {
  router.push({
    pathname: "/home/screens/Flats/PropertyDetails",
    params: { propertyId, entityType, areaKey } // ✅ ADD areaKey here
  });
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
            (tab.route === "/home/screens/Commercial/(Property)" && isOverview);

          return (
            <TouchableOpacity
              key={idx}
              onPress={() => !isActive && router.replace(tab.route)}
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

      <Slot />
    </SafeAreaView>
  );
}