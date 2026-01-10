// //Frontend//app//home//screens//Resorts//SelectSite.jsx
// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
//   StyleSheet,
//   Dimensions,
//   Animated,
//   PanResponder,
// } from 'react-native';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import {
//   ChevronLeft,
//   Search,
//   Mic,
//   SlidersHorizontal,
//   MapPin,
//   ChevronRight,
// } from 'lucide-react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router'; // ✅ Added useLocalSearchParams

// const sitesData = [
//   { name: 'Akkayapalem', properties: 1247 },
//   { name: 'Anandapuram', properties: 892 },
//   { name: 'Boyapalem', properties: 2156 },
//   { name: 'Chinna Gadili', properties: 892 },
//   { name: 'Dwarka Nagar', properties: 445 },
//   { name: 'Gajuwaka', properties: 3021 },
//   { name: 'Kommadi', properties: 3021 },
// ];

// const { width } = Dimensions.get('window');
// const itemWidth = width * 0.9;

// const SelectSiteScreen = () => {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const { district } = useLocalSearchParams(); // ✅ Receive district from previous screen
//   const [searchQuery, setSearchQuery] = useState('');
//   const [contentHeight, setContentHeight] = useState(1);
//   const [scrollViewHeight, setScrollViewHeight] = useState(0);
//   const scrollY = new Animated.Value(0);
//   const scrollViewRef = useRef(null);
//   const scrollPositionOnDragStart = useRef(0);

//   // Filter data based on search query
//   const filteredData = sitesData.filter((site) =>
//     site.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const scrollIndicatorHeight =
//     scrollViewHeight > 0 ? ((scrollViewHeight / contentHeight) * scrollViewHeight) * 0.5 : 0;

//   const scrollIndicatorPosition =
//     contentHeight > scrollViewHeight
//       ? Animated.multiply(
//           scrollY,
//           (scrollViewHeight - scrollIndicatorHeight) /
//             (contentHeight - scrollViewHeight)
//         )
//       : 0;

//   const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false });

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => {
//         scrollPositionOnDragStart.current = scrollY._value;
//       },
//       onPanResponderMove: (evt, gestureState) => {
//         if (contentHeight <= scrollViewHeight) return;

//         const scrollRatio =
//           (contentHeight - scrollViewHeight) /
//           (scrollViewHeight - scrollIndicatorHeight);

//         const newScrollY =
//           scrollPositionOnDragStart.current + gestureState.dy * scrollRatio;

//         const maxScrollOffset = contentHeight - scrollViewHeight;
//         const clampedScrollY = Math.max(0, Math.min(newScrollY, maxScrollOffset));

//         scrollViewRef.current?.scrollTo({ y: clampedScrollY, animated: false });
//         scrollY.setValue(clampedScrollY);
//       },
//     })
//   ).current;

//   const districtName = district || 'Vizag'; // fallback if no district is passed

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 7}}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

//       {/* Header */}
//       <View className="bg-white">
//         <View className="flex-row items-center py-3 px-4">
//           <TouchableOpacity className="p-1" onPress={() => router.push('/home/screens/Resorts')}>
//             <ChevronLeft color="black" size={25} />
//           </TouchableOpacity>

//           {/* ✅ Dynamic district name */}
//           <Text className="text-2xl font-bold ml-3">
//             Select Resort from {districtName}
//           </Text>
//         </View>

//         {/* Search Bar */}
//         <View className="px-4 pb-2">
//           <View style={styles.searchBar}>
//             <Search color="#888" size={20} />
//             <TextInput
//               className="flex-1 text-base h-full ml-2"
//               placeholder={`Search properties in ${districtName}...`}
//               placeholderTextColor="#888"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//             <TouchableOpacity
//               className="p-2"
//               onPress={() => router.push('/home/screens/Resorts/Voice')}
//             >
//               <Mic color="#888" size={20} />
//             </TouchableOpacity>
//             <View className="w-px h-6 bg-gray-300 mx-2" />
//             <TouchableOpacity
//               className="p-2"
//               onPress={() => router.push('/home/screens/Resorts/Filter')}
//             >
//               <SlidersHorizontal color="#888" size={20} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       {/* Site List */}
//       <View className="flex-1 flex-row">
//         <ScrollView
//           ref={scrollViewRef}
//           className="flex-1"
//           contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}
//           showsVerticalScrollIndicator={false}
//           onScroll={onScroll}
//           onContentSizeChange={(width, height) => setContentHeight(height)}
//           onLayout={(event) => setScrollViewHeight(event.nativeEvent.layout.height)}
//           scrollEventThrottle={16}
//         >
//           {/* No Results Message */}
//           {filteredData.length === 0 && (
//             <View style={{ padding: 20, alignItems: 'center' }}>
//               <Text style={{ color: '#888', fontSize: 16 }}>
//                 No properties found for "{searchQuery}"
//               </Text>
//             </View>
//           )}

//           {/* Site Items */}
//           {filteredData.map((site) => (
//             <TouchableOpacity
//               key={site.name}
//               style={[styles.siteItem, { borderLeftColor: '#22C55E', width: itemWidth }]}
//               onPress={() =>
//                 router.push({
//                   pathname: '/home/screens/Resorts/PropertyDetails',
//                   params: { area: site.name, district: districtName }, // ✅ Pass both
//                 })
//               }
//               activeOpacity={0.85}
//             >
//               <View className="flex-col">
//                 <Text className="text-lg font-semibold text-gray-800">{site.name}</Text>
//                 <View className="flex-row items-center mt-1">
//                   <MapPin color="#22C55E" size={14} />
//                   <Text className="text-sm text-gray-500 ml-1">
//                     {site.properties.toLocaleString()} properties available
//                   </Text>
//                 </View>
//               </View>
//               <ChevronRight color="#22C55E" size={20} />
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* Custom Scroll Bar */}
//         <View
//           style={{
//             width: 8,
//             position: 'absolute',
//             right: 8,
//             top: 0,
//             bottom: 0,
//             backgroundColor: '#E5E7EB',
//             borderRadius: 4,
//             marginVertical: 8,
//             alignItems: 'center',
//           }}
//         >
//           <Animated.View
//             {...panResponder.panHandlers}
//             style={{
//               backgroundColor: '#cbddd2ff',
//               width: '100%',
//               height: scrollIndicatorHeight,
//               borderRadius: 4,
//               transform: [{ translateY: scrollIndicatorPosition }],
//             }}
//           />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     height: 48,
//     paddingHorizontal: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   siteItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     marginBottom: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderLeftWidth: 8,
//     backgroundColor: '#fff',
   
//     elevation: 6,
//   },
// });

// export default SelectSiteScreen;


// Frontend/app/home/screens/Resorts/SelectSite.jsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Search,
  Mic,
  SlidersHorizontal,
  MapPin,
  ChevronRight,
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

// ✅ Use keys for areas (matching Flats implementation)
const sitesData = [
  { key: 'akkayapalem', properties: 1247 },
  { key: 'anandapuram', properties: 892 },
  { key: 'boyapalem', properties: 2156 },
  { key: 'chinnagadili', properties: 892 },
  { key: 'dwarkanagar', properties: 445 },
  { key: 'gajuwaka', properties: 3021 },
  { key: 'kommadi', properties: 3021 },
];

const { width } = Dimensions.get('window');
const itemWidth = width * 0.9;

const SelectSiteScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { districtKey } = useLocalSearchParams(); // ✅ Receive districtKey
  const [searchQuery, setSearchQuery] = useState('');
  const [contentHeight, setContentHeight] = useState(1);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const scrollY = new Animated.Value(0);
  const scrollViewRef = useRef(null);
  const scrollPositionOnDragStart = useRef(0);

  // ✅ Filter using translated names (matching Flats implementation)
  const filteredData = sitesData.filter((site) => {
    const translatedName = t(`areas.${site.key}`);
    return translatedName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const scrollIndicatorHeight =
    scrollViewHeight > 0 ? ((scrollViewHeight / contentHeight) * scrollViewHeight) * 0.5 : 0;

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

  const districtName = districtKey ? t(`districts.${districtKey}`) : t('districts.visakhapatnam');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 8 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="bg-white">
        <View className="flex-row items-center py-3 px-4">
          <TouchableOpacity className="p-1" onPress={() => router.push('/home/screens/Resorts')}>
            <ChevronLeft color="black" size={25} />
          </TouchableOpacity>

          <Text className="text-2xl font-bold ml-3">
            {t('selectSite.title')} {districtName}
          </Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 pb-2">
          <View style={styles.searchBar}>
            <Search color="#888" size={20} />
            <TextInput
              className="flex-1 text-base h-full ml-2"
              placeholder={`${t('selectSite.searchPlaceholder')} ${districtName}...`}
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              className="p-2"
              onPress={() => router.push('/home/screens/Resorts/Voice')}
            >
              <Mic color="#888" size={20} />
            </TouchableOpacity>
            <View className="w-px h-6 bg-gray-300 mx-2" />
            <TouchableOpacity
              className="p-2"
              onPress={() => router.push('/home/screens/Resorts/Filter')}
            >
              <SlidersHorizontal color="#888" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Site List */}
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
                {t('selectSite.noResults')} "{searchQuery}"
              </Text>
            </View>
          )}

          {/* ✅ Site Items - Pass areaKey */}
          {filteredData.map((site) => (
            <TouchableOpacity
              key={site.key}
              style={[styles.siteItem, { borderLeftColor: '#22C55E', width: itemWidth }]}
              onPress={() =>
                router.push({
                  pathname: '/home/screens/Resorts/PropertyDetails',
                  params: { 
                    areaKey: site.key,  // ✅ Pass areaKey
                    districtKey: districtKey  // ✅ Pass districtKey
                  },
                })
              }
              activeOpacity={0.85}
            >
              <View className="flex-col">
                <Text className="text-lg font-semibold text-gray-800">
                  {t(`areas.${site.key}`)}
                </Text>
                <View className="flex-row items-center mt-1">
                  <MapPin color="#22C55E" size={14} />
                  <Text className="text-sm text-gray-500 ml-1">
                    {site.properties.toLocaleString()} {t('selectDistrict.propertiesAvailable')}
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
    backgroundColor: '#FFFFFF',
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
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default SelectSiteScreen;