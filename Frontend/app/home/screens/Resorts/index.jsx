import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Search,
  Mic,
  SlidersHorizontal,
  MapPin,
  ChevronRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const districtsData = [
 { name: 'Anantapur', properties: 1725 },
  { name: 'Chittoor', properties: 1850 },
  { name: 'East Godavari', properties: 4251 },
  { name: 'Guntur', properties: 2904 },
  { name: 'Kadapa', properties: 1503 },
  { name: 'Krishna', properties: 3790 },
  { name: 'Kurnool', properties: 2048 },
  { name: 'Nellore', properties: 2210 },
  { name: 'Srikakulam', properties: 1985 },
  { name: 'Visakhapatnam', properties: 5124 },
  { name: 'Vizianagaram', properties: 2487 },
  { name: 'West Godavari', properties: 3320 },
];

const itemWidth = 339;

const SelectDistrictScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [contentHeight, setContentHeight] = useState(1);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const scrollY = new Animated.Value(0);
  const scrollViewRef = useRef(null);
  const scrollPositionOnDragStart = useRef(0);

  // Filter data based on search query
  const filteredData = districtsData.filter((district) =>
    district.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollIndicatorHeight =
    scrollViewHeight > 0 ? (scrollViewHeight / contentHeight) * scrollViewHeight : 0;

  const scrollIndicatorPosition =
    contentHeight > scrollViewHeight
      ? Animated.multiply(
          scrollY,
          (scrollViewHeight - scrollIndicatorHeight) /
            (contentHeight - scrollViewHeight)
        )
      : 0;

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        scrollPositionOnDragStart.current = scrollY._value;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (contentHeight <= scrollViewHeight) return;

        const scrollRatio =
          (contentHeight - scrollViewHeight) /
          (scrollViewHeight - scrollIndicatorHeight);

        const newScrollY =
          scrollPositionOnDragStart.current + gestureState.dy * scrollRatio;

        const maxScrollOffset = contentHeight - scrollViewHeight;
        const clampedScrollY = Math.max(0, Math.min(newScrollY, maxScrollOffset));

        scrollViewRef.current?.scrollTo({ y: clampedScrollY, animated: false });
        scrollY.setValue(clampedScrollY);
      },
    })
  ).current;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 7 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="bg-white">
        <View className="flex-row items-center py-3 px-4">
          <TouchableOpacity className="p-1" onPress={() => router.push('/(tabs)/home')}>
            <ChevronLeft color="black" size={25} />
          </TouchableOpacity>

          <Text className="text-2xl font-bold ml-3">Select District in Andhra</Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 pb-2">
          <View
            style={{
              ...styles.searchBar,
              backgroundColor: '#FFFFFF',
              width: 334,
              marginLeft: 18,
            }}
          >
            <Search color="#888" size={20} />
            <TextInput
              className="flex-1 text-base h-full ml-2"
              placeholder="Search districts in Andhra..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity className="p-2">
              <Mic color="#888" size={20} />
            </TouchableOpacity>
            <View className="w-px h-6 bg-gray-300 mx-2" />
            <TouchableOpacity className="p-2">
              <SlidersHorizontal color="#888" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* District List */}
      <View className="flex-1 flex-row">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          onContentSizeChange={(width, height) => setContentHeight(height)}
          onLayout={(event) => setScrollViewHeight(event.nativeEvent.layout.height)}
          scrollEventThrottle={16}
        >
          {/* No Results Message */}
          {filteredData.length === 0 && (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#888', fontSize: 16 }}>
                No districts found for "{searchQuery}"
              </Text>
            </View>
          )}

          {filteredData.map((district) => (
            <TouchableOpacity
              key={district.name}
              style={[styles.siteItem, { borderLeftColor: '#22C55E', width: itemWidth }]}
              onPress={() => router.push('/home/screens/Resorts/SelectSite')}
              activeOpacity={0.85}
            >
              <View className="flex-col">
                <Text className="text-lg font-semibold text-gray-800">{district.name}</Text>
                <View className="flex-row items-center mt-1">
                  <MapPin color="#22C55E" size={14} />
                  <Text className="text-sm text-gray-500 ml-1">
                    {district.properties.toLocaleString()} properties available
                  </Text>
                </View>
              </View>
              <ChevronRight color="#22C55E" size={20} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Custom Scroll Bar */}
        <View
          style={{
            width: 8,
            position: 'absolute',
            right: 8,
            top: 0,
            bottom: 0,
            backgroundColor: '#E5E7EB',
            borderRadius: 4,
            marginVertical: 8,
            alignItems: 'center',
          }}
        >
          <Animated.View
            {...panResponder.panHandlers}
            style={{
              backgroundColor: '#cbddd2ff',
              width: '100%',
              height: scrollIndicatorHeight,
              borderRadius: 4,
              transform: [{ translateY: scrollIndicatorPosition }],
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  siteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 8,
    backgroundColor: '#fff',

    

    elevation: 6,
  },
});

export default SelectDistrictScreen;