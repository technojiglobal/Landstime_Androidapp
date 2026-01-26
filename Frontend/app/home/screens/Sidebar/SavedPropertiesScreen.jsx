// Frontend/app/home/screens/Sidebar/SavedPropertiesScreen.jsx
import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StatusBar, 
  ActivityIndicator,
  Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getSavedProperties, unsaveProperty } from "../../../../utils/savedPropertiesApi";
import { API_URL } from "../../../../utils/apiConfig";
import arrow from "../../../../assets/arrow.png";

export default function SavedPropertiesScreen() {
  const [savedItems, setSavedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const router = useRouter();

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, activeFilter, savedItems]);

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);
      const response = await getSavedProperties();
      
      if (response.success) {
        setSavedItems(response.data);
      } else {
        Alert.alert('Error', 'Failed to load saved properties');
      }
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
  let filtered = [...savedItems];

  // Filter by type
  if (activeFilter !== "All") {
    filtered = filtered.filter(item => {
      if (activeFilter === "Interiors") {
        return item.entityType === 'InteriorDesign';
      } else {
        // For properties, check propertyType
        if (item.entityType === 'Property' && item.entityId) {
          const propertyType = item.entityId.propertyType;
          if (activeFilter === "Sites") return propertyType === 'Site/Plot/Land';
          if (activeFilter === "Resorts") return propertyType === 'Resort';
          if (activeFilter === "Flats") return propertyType === 'House' || propertyType === 'House/Flat';
          if (activeFilter === "Commercial") return propertyType === 'Commercial';
        }
        return false;
      }
    });
  }

  // Filter by search query
  if (searchQuery.trim()) {
    filtered = filtered.filter(item => {
      if (item.entityType === 'InteriorDesign' && item.entityId) {
        return item.entityId.name?.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (item.entityType === 'Property' && item.entityId) {
        const title = typeof item.entityId.propertyTitle === 'string' 
          ? item.entityId.propertyTitle 
          : item.entityId.propertyTitle?.en || '';
        return title.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    });
  }

  setFilteredItems(filtered);
};
  const handleUnsave = async (itemId, entityType) => {
    try {
      const response = await unsaveProperty(itemId, entityType);
      
      if (response.success) {
        // Remove from local state
        setSavedItems(prev => prev.filter(item => 
          !(item.entityId._id === itemId && item.entityType === entityType)
        ));
      } else {
        Alert.alert('Error', 'Failed to remove saved item');
      }
    } catch (error) {
      console.error('Error unsaving:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const renderSavedCard = ({ item }) => {
    if (!item.entityId) return null;
const isInterior = item.entityType === 'InteriorDesign';
    const entity = item.entityId;

    // Get title
    const title = isInterior 
      ? entity.name 
      : (typeof entity.propertyTitle === 'string' 
          ? entity.propertyTitle 
          : entity.propertyTitle?.en || 'Property');

    // Get image
    const imageUri = entity.images && entity.images.length > 0
      ? (isInterior ? `${API_URL}${entity.images[0]}` : entity.images[0])
      : null;

    // Get price
    const price = isInterior 
      ? `₹${entity.price || 'N/A'}` 
      : `₹${entity.expectedPrice ? (entity.expectedPrice / 100000).toFixed(0) + 'L' : 'N/A'}`;

    // Get location
    const location = isInterior 
      ? entity.location 
      : (typeof entity.location === 'string' 
          ? entity.location 
          : entity.location?.en || entity.area?.en || 'Location');

    return (
      <TouchableOpacity
        className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100"
        activeOpacity={0.7}
        onPress={() => {
          if (isInterior) {
            router.push(`/home/screens/Sidebar/RoomOverview?id=${entity._id}`);
          } else {
            // Navigate based on property type
            const propertyType = entity.propertyType;
            let path = '';
            if (propertyType === 'House') path = '/home/screens/Flats/(Property)';
            else if (propertyType === 'Site/Plot/Land') path = '/home/screens/Sites/(Property)';
            else if (propertyType === 'Resort') path = '/home/screens/Resorts/(Property)';
            else if (propertyType === 'Commercial') path = '/home/screens/Commercial/(Property)';
            
            if (path) {
              router.push(`${path}?propertyId=${entity._id}`);
            }
          }
        }}
      >
        <View className="flex-row p-3">
          {/* Image */}
          <Image
            source={
              imageUri 
                ? { uri: imageUri }
                : require("../../../../assets/Flat1.jpg")
            }
            className="w-24 h-24 rounded-xl"
            resizeMode="cover"
          />

          {/* Details */}
          <View className="flex-1 ml-3 justify-between">
            <View>
              <Text className="text-[15px] font-semibold text-gray-900" numberOfLines={1}>
                {title}
              </Text>
              
              <View className="flex-row items-center mt-1">
                <Ionicons name="location-outline" size={14} color="#6B7280" />
                <Text className="text-[12px] text-gray-500 ml-1" numberOfLines={1}>
                  {location}
                </Text>
              </View>

              {isInterior && (
                <View className="flex-row items-center mt-1">
                  <Text className="text-[11px] text-gray-500">
                    {entity.area} sq ft • {entity.duration} weeks
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <Text className="text-[14px] font-bold text-green-600">
                {price}
              </Text>

              <TouchableOpacity
                onPress={() => handleUnsave(entity._id, item.entityType)}
                className="p-2"
              >
                <Ionicons name="bookmark" size={20} color="#16A34A" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white mt-2 px-4 pt-12">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={arrow} className="w-6 h-6" />
        </TouchableOpacity>
        <Text className="text-[18px] font-semibold ml-2">Saved Properties</Text>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-[#F4F4F4] rounded-xl px-3 py-3 mb-4">
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search saved properties..."
          placeholderTextColor="#999"
          className="ml-2 flex-1 text-[15px]"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View className="mb-4">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={["All", "Sites", "Resorts", "Flats", "Commercial", "Interiors"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveFilter(item)}
              className={`px-4 py-2 mx-1 rounded-full border ${
                activeFilter === item ? "bg-green-100 border-green-400" : "border-gray-300"
              }`}
            >
              <Text className={`${activeFilter === item ? "text-green-600" : "text-gray-600"}`}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Saved Properties Count */}
      <Text className="text-[16px] font-semibold mb-2">
        Saved Items ({filteredItems.length})
      </Text>

      {/* Property List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16A34A" />
          <Text className="text-gray-500 mt-4">Loading saved items...</Text>
        </View>
      ) : filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => `${item.entityType}-${item.entityId._id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          renderItem={renderSavedCard}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="bookmark-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-500 mt-4 text-center">
            {searchQuery || activeFilter !== "All" 
              ? "No items match your filters" 
              : "No saved properties yet"}
          </Text>
        </View>
      )}
    </View>
  );
}