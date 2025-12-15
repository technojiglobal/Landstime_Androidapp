import { View, Text, ScrollView } from "react-native";
import DesignCard from "./DesignCard";
import { designData } from "../../data/designData";

export default function FeaturedDesigns({ selectedRoom }) {
  const filtered =
    selectedRoom === "All Rooms"
      ? designData
      : designData.filter((item) => item.category === selectedRoom);

  return (
    <View className="mt-6 px-4">
      <Text className="text-xl font-bold text-gray-900 mb-3">
        Featured Designs
      </Text>

      {filtered.map((card) => (
        <View key={card.id} className="mb-6">
          <DesignCard data={card} />
        </View>
      ))}
    </View>
  );
}
