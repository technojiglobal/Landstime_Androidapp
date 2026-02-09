// Frontend/app/home/screens/Commercial/index.jsx
import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Search,
  Mic,
  SlidersHorizontal,
  MapPin,
  ChevronRight,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

const districtsData = [
  { key: 'anantapur', properties: 1725 },
  { key: 'chittoor', properties: 1850 },
  { key: 'eastgodavari', properties: 4251 },
  { key: 'guntur', properties: 2904 },
  { key: 'kadapa', properties: 1503 },
  { key: 'krishna', properties: 3790 },
  { key: 'kurnool', properties: 2048 },
  { key: 'nellore', properties: 2210 },
  { key: 'srikakulam', properties: 1985 },
  { key: 'visakhapatnam', properties: 5124 },
  { key: 'vizianagaram', properties: 2487 },
  { key: 'westgodavari', properties: 3320 },
];

const ITEM_WIDTH = 339;

export default function SelectDistrictScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { voiceText } = useLocalSearchParams(); // ✅ NEW: Get voice input

  const [searchQuery, setSearchQuery] = useState("");
  const [contentHeight, setContentHeight] = useState(1);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const dragStartY = useRef(0);

  // ✅ NEW: Handle voice text when returned from Voice screen
  useEffect(() => {
    if (voiceText) {
      console.log('Received voice text:', voiceText);
      
      // ✅ Clean voice input (remove common words)
      const cleanedVoice = voiceText
        .toLowerCase()
        .replace(/district|properties|commercial|in|show me|find/gi, '')
        .trim();
      
      setSearchQuery(cleanedVoice);
    }
  }, [voiceText]);


  // ✅ Filter districts based on search query
  const filteredData = districtsData.filter((district) => {
    const translatedName = t(`districts.${district.key}`);
    
    // ✅ Clean search query
    const cleanQuery = searchQuery
      .toLowerCase()
      .replace(/district|properties|commercial|in/gi, '')
      .trim();
    
    return translatedName.toLowerCase().includes(cleanQuery);
  });

  const scrollIndicatorHeight =
    scrollViewHeight > 0
      ? (scrollViewHeight / contentHeight) * scrollViewHeight
      : 0;

  const scrollIndicatorPosition =
    contentHeight > scrollViewHeight
      ? Animated.multiply(
          scrollY,
          (scrollViewHeight - scrollIndicatorHeight) /
            (contentHeight - scrollViewHeight)
        )
      : 0;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragStartY.current = scrollY._value;
      },
      onPanResponderMove: (_, gesture) => {
        if (contentHeight <= scrollViewHeight) return;

        const ratio =
          (contentHeight - scrollViewHeight) /
          (scrollViewHeight - scrollIndicatorHeight);

        const newY = dragStartY.current + gesture.dy * ratio;
        const max = contentHeight - scrollViewHeight;

        const clamped = Math.max(0, Math.min(newY, max));

        scrollViewRef.current?.scrollTo({ y: clamped, animated: false });
        scrollY.setValue(clamped);
      },
    })
  ).current;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: 27,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* HEADER */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
          <ChevronLeft color="black" size={25} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t('selectDistrict.title')}</Text>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Search color="#888" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('selectDistrict.searchPlaceholder')}
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {/* ✅ NEW: CLICKABLE MIC ICON */}
          <TouchableOpacity
            onPress={() => router.push({
              pathname: '/home/screens/Flats/Voice',
              params: { 
                returnScreen: '/home/screens/Commercial',
                searchType: 'district'
              }
            })}
          >
            <Mic color="#888" size={20} />
          </TouchableOpacity>
          
        </View>
      </View>

      {/* LIST + SCROLLBAR */}
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* DISTRICT LIST */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          onContentSizeChange={(_, h) => setContentHeight(h)}
          onLayout={(e) => setScrollViewHeight(e.nativeEvent.layout.height)}
          scrollEventThrottle={16}
        >
          {filteredData.length === 0 && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                {t('selectDistrict.noResults', { query: searchQuery })}
              </Text>
            </View>
          )}

          {filteredData.map((district) => (
            <TouchableOpacity
              key={district.key}
              style={[styles.item, { width: ITEM_WIDTH }]}
              onPress={() =>
                router.push({
                  pathname: "/home/screens/Commercial/SelectSite",
                  params: { districtKey: district.key }
                })
              }
              activeOpacity={0.85}
            >
              <View>
                <Text style={styles.itemTitle}>{t(`districts.${district.key}`)}</Text>
                <View style={styles.itemSubRow}>
                  <MapPin color="#22C55E" size={14} />
                  <Text style={styles.itemSubtitle}>
                    {district.properties.toLocaleString()} {t('selectDistrict.propertiesAvailable')}
                  </Text>
                </View>
              </View>

              <ChevronRight color="#22C55E" size={20} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* CUSTOM SCROLLBAR */}
        <View style={styles.scrollTrack}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.scrollThumb,
              {
                height: scrollIndicatorHeight,
                transform: [{ translateY: scrollIndicatorPosition }],
              },
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 8,
    paddingTop: 0,
    marginTop: -12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },

  searchWrapper: { paddingHorizontal: 18, marginBottom: 4 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 12,
    width: 334,
    alignSelf: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },

  divider: { width: 1, height: 20, backgroundColor: "#d0d0d0", marginHorizontal: 12 },

  listContent: { alignItems: "center", paddingVertical: 20 },

  noResults: { padding: 20, alignItems: "center" },
  noResultsText: { color: "#888", fontSize: 16 },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 8,
    borderLeftColor: "#22C55E",
    backgroundColor: "#FFF",
    elevation: 4,
  },
  itemTitle: { fontSize: 18, fontWeight: "600", color: "#333" },

  itemSubRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },

  itemSubtitle: { fontSize: 14, color: "#666", marginLeft: 4 },

  scrollTrack: {
    width: 8,
    position: "absolute",
    right: 8,
    top: 0,
    bottom: 0,
    marginVertical: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    alignItems: "center",
  },

  scrollThumb: {
    width: "100%",
    backgroundColor: "#cbddd2ff",
    borderRadius: 4,
  },
});