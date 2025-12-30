// // Frontend/components/interior/FeaturedDesigns.jsx

// import { View, Text, ScrollView } from "react-native";
// import DesignCard from "./DesignCard";
// import { designData } from "../../data/designData";

// export default function FeaturedDesigns({ selectedRoom }) {
//   const filtered =
//     selectedRoom === "All Rooms"
//       ? designData
//       : designData.filter((item) => item.category === selectedRoom);

//   return (
//     <View className="mt-6 px-4">
//       <Text className="text-xl font-bold text-gray-900 mb-3">
//         Featured Designs
//       </Text>

//       {filtered.map((card) => (
//         <View key={card.id} className="mb-6">
//            <DesignCard data={card} />  {/*Frontend/components/interior/FeaturedDesigns.jsx */}
//         </View>
//       ))}
//     </View>
//   );
// }
import { View, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import DesignCard from "./DesignCard";
import { fetchInteriorDesigns } from "../../utils/interiorDesignApi";

export default function FeaturedDesigns({ selectedRoom }) {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadDesigns();
  }, [selectedRoom]);

  const loadDesigns = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await fetchInteriorDesigns({
        selectedRoom,
        page: 1,
        limit: 10,
      });

      setDesigns(res.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mt-6 px-4">
      <Text className="text-xl font-bold text-gray-900 mb-3">
        Featured Designs
      </Text>

      {loading && (
        <ActivityIndicator size="large" color="#000" className="mt-6" />
      )}

      {error && (
        <Text className="text-red-500 text-center mt-6">
          Failed to load designs
        </Text>
      )}

      {!loading && designs.length === 0 && (
        <Text className="text-gray-500 text-center mt-6">
          No designs found
        </Text>
      )}

      {!loading &&
        designs.map((card) => (
          <View key={card._id} className="mb-6">
            <DesignCard data={card} />
          </View>
        ))}
    </View>
  );
}
