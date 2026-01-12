// Frontend/components/interior/RoomTabs.jsx
import { ScrollView, TouchableOpacity, Text, View, Image } from "react-native";
import { useResponsive } from "../../utils/responsive";

export default function RoomTabs({ selectedRoom, setSelectedRoom }) {
  const { scaleWidth } = useResponsive();

  // Map each room to its icon
  const roomData = [
    { name: "All Rooms", icon: require("../../assets/house.png") },
    { name: "Living Area", icon: require("../../assets/living-icon.png") },
    { name: "Bedroom", icon: require("../../assets/bedroom.png") },
    { name: "Kitchen", icon: require("../../assets/kitchen-icon.png") },
    { name: "Bathroom", icon: require("../../assets/bath.png") },
    { name: "Workspace", icon: require("../../assets/work.png") },
    { name: "Storage", icon: require("../../assets/storage-icon.png") },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3"
    >
      <View className="flex-row space-x-3 px-4">

        {roomData.map((room) => {
          const isActive = selectedRoom === room.name;

          return (
            <TouchableOpacity
              key={room.name}
              onPress={() => setSelectedRoom(room.name)}
              className={`px-4 py-2 mx-2 rounded-xl flex-row items-center border ${
                isActive
                  ? "bg-[#22C55E] border-green-400"
                  : "border-gray-300 bg-gray-100"
              }`}
            >

              {/* Icon */}
              <Image
                source={room.icon}
                style={{
                  width: scaleWidth(22),
                  height: scaleWidth(22),
                  marginRight: scaleWidth(6),
                  tintColor: isActive ? "white" : "gray",
                }}
              />

              {/* Label */}
              <Text
                className={`font-medium ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              >
                {room.name}
              </Text>

            </TouchableOpacity>
          );
        })}

      </View>
    </ScrollView>
  );
}
