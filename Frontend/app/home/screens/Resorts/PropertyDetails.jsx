// Frontend/app/home/screens/Resorts/PropertyDetails.jsx
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getApprovedProperties } from "../../../../utils/propertyApi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/index";
import { saveProperty, unsaveProperty, checkIfSaved } from "../../../../utils/savedPropertiesApi";
import { Alert } from "react-native";
import { fetchReviews } from "../../../../utils/reviewApi";
import { getImageUrl } from "../../../../utils/imageHelper";

const getLocalizedText = (field, language) => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[language] || field.en || field.te || field.hi || '';
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = 345;
const CARD_HEIGHT = 298;

export default function PropertyListScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();
  const { areaKey, districtKey, appliedFilters } = useLocalSearchParams();
  const [savedStates, setSavedStates] = useState({});
  const currentLanguage = i18n.language || 'en';
  const [reviewSummary, setReviewSummary] = useState({});
  
  // ✅ Filter state
  const [activeFilters, setActiveFilters] = useState(null);
  const [displayedProperties, setDisplayedProperties] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const areaName = areaKey ? t(`areas.${areaKey}`) : '';

  // ✅ PARSE FILTERS when returned from Filter screen
useEffect(() => {
  if (appliedFilters) {
    try {
      const filters = JSON.parse(appliedFilters);
      console.log('✅ Filters received from Filter screen:', filters);
      console.log('📊 Filter breakdown:', {
        budgetRange: filters.budgetRange,
        resortType: filters.resortType,
        rooms: filters.rooms,
        floors: filters.floors,
        landAreaRange: filters.landAreaRange,
        buildAreaRange: filters.buildAreaRange,
        locAdvantages: filters.locAdvantages?.length || 0,
        quickFilters: filters.quickFilters?.length || 0,
        facingDirections: filters.facingDirections?.length || 0,
      });
      
      // ✅ NEW: Check if filters object has any actual filters
      const hasFilters = Object.keys(filters).length > 0;
      
      if (hasFilters) {
        setActiveFilters(filters);
        setIsFiltering(true);
        console.log('✅ Filters active, will apply to properties');
      } else {
        setActiveFilters(null);
        setIsFiltering(false);
        console.log('🔄 Empty filters object, showing all properties');
      }
    } catch (error) {
      console.error('❌ Error parsing filters:', error);
      setActiveFilters(null);
      setIsFiltering(false);
    }
  } else {
    console.log('🔄 No filters applied, showing all properties');
    setActiveFilters(null);
    setIsFiltering(false);
  }
}, [appliedFilters]);

  // ✅ Apply filters whenever properties or activeFilters change
  useEffect(() => {
    if (properties.length > 0) {
      if (activeFilters && isFiltering) {
        console.log('🔍 Applying filters to properties...');
        applyFilters(properties, activeFilters);
      } else {
        // No filters, just filter by area
        console.log('📍 Filtering by area only (no active filters)');
        const areaFiltered = properties.filter((property) => {
          const propertyAreaKey = property.areaKey || '';
          return propertyAreaKey === areaKey;
        });
        console.log(`✅ Area-filtered: ${areaFiltered.length} properties`);
        setFilteredProperties(areaFiltered);
      }
    }
  }, [properties, activeFilters, isFiltering, areaKey]);

  // ✅ FETCH PROPERTIES
  useEffect(() => {
    fetchProperties();
  }, [areaKey]);

  useEffect(() => {
    if (areaKey) {
      fetchProperties();
    }
  }, [i18n.language]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching RESORTS for areaKey:', areaKey);

      const currentLang = i18n.language || 'en';
      console.log('🌐 Fetching in language:', currentLang);

      const response = await getApprovedProperties(null, 1, currentLang);

      if (response.success) {
        const resortProperties = (response.data.data || []).filter(
          property => property.propertyType === 'Resort'
        );
        console.log('✅ Resorts filtered:', resortProperties.length);
        setProperties(resortProperties);
        
        // ✅ Apply filters if they exist
        if (activeFilters) {
          applyFilters(resortProperties, activeFilters);
        } else {
          // ✅ Filter by area only
          const areaFiltered = resortProperties.filter((property) => {
            const propertyAreaKey = property.areaKey || '';
            return propertyAreaKey === areaKey;
          });
          setFilteredProperties(areaFiltered);
        }
        
        await checkAllSavedStatuses(resortProperties);
      } else {
        console.error('❌ Failed to fetch properties:', response.error);
      }
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ COMPLETE FILTER APPLICATION FUNCTION WITH ALL FIXES
  const applyFilters = (propertyList, filters) => {
    console.log('🔍 ========== STARTING FILTER APPLICATION ==========');
    console.log('📊 Initial properties count:', propertyList.length);
    console.log('🎯 Filters received:', JSON.stringify(filters, null, 2));
    
    let filtered = [...propertyList];
    let filterSteps = [];

    // ✅ STEP 1: Filter by area (ALWAYS FIRST)
    const initialCount = filtered.length;
    filtered = filtered.filter((property) => {
      const propertyAreaKey = property.areaKey || '';
      const matches = propertyAreaKey === areaKey;
      if (!matches) {
        console.log(`❌ Filtered out (wrong area): ${property.propertyTitle?.en || property.propertyTitle} - areaKey: ${propertyAreaKey}`);
      }
      return matches;
    });
    
    filterSteps.push({
      step: 'Area Filter',
      before: initialCount,
      after: filtered.length,
      removed: initialCount - filtered.length
    });
    
    console.log(`📍 Area filter (${areaKey}): ${initialCount} → ${filtered.length} properties`);

    // ✅ STEP 2: BUDGET FILTER (LAKHS - FIXED)
    if (filters.budgetRange && Array.isArray(filters.budgetRange)) {
      const beforeBudget = filtered.length;
      const [minBudget, maxBudget] = filters.budgetRange;
      
      // ✅ Skip if default range (1-500)
      if (minBudget !== 1 || maxBudget !== 500) {
        filtered = filtered.filter(property => {
          const price = property.expectedPrice / 100000; // Convert to Lakhs
          const inRange = price >= minBudget && price <= maxBudget;
          
          if (!inRange) {
            console.log(`💰 Filtered out (budget): ${property.propertyTitle?.en || property.propertyTitle} - Price: ₹${price.toFixed(2)}L (Range: ${minBudget}-${maxBudget}L)`);
          }
          
          return inRange;
        });
        
        filterSteps.push({
          step: `Budget (₹${minBudget}-${maxBudget}L)`,
          before: beforeBudget,
          after: filtered.length,
          removed: beforeBudget - filtered.length
        });
        
        console.log(`💰 Budget filter (${minBudget}-${maxBudget}L): ${beforeBudget} → ${filtered.length} properties`);
      }
    }

    // ✅ STEP 3: RESORT TYPE FILTER
// ✅ STEP 3: RESORT TYPE FILTER (CASE-INSENSITIVE & TRIM)
if (filters.resortType && filters.resortType !== '' && filters.resortType !== 'Any') {
  const beforeResortType = filtered.length;
  
  // ✅ Normalize for comparison - trim and lowercase
  const normalizeResortType = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase().trim();
  };
  
  const normalizedFilter = normalizeResortType(filters.resortType);
  console.log('🏨 Normalized filter resort type:', normalizedFilter);
  
  filtered = filtered.filter(property => {
    const propertyResortType = property.resortDetails?.resortType || '';
    const normalizedProperty = normalizeResortType(propertyResortType);
    
    const matches = normalizedProperty === normalizedFilter;
    
    if (!matches) {
      console.log(`🏨 Filtered out (resort type): ${property.propertyTitle?.en || property.propertyTitle}`);
      console.log(`   Property: "${propertyResortType}" (normalized: "${normalizedProperty}")`);
      console.log(`   Filter: "${filters.resortType}" (normalized: "${normalizedFilter}")`);
    } else {
      console.log(`✅ MATCH: ${property.propertyTitle?.en || property.propertyTitle} - Type: ${propertyResortType}`);
    }
    
    return matches;
  });
  
  filterSteps.push({
    step: `Resort Type (${filters.resortType})`,
    before: beforeResortType,
    after: filtered.length,
    removed: beforeResortType - filtered.length
  });
  
  console.log(`🏨 Resort type filter (${filters.resortType}): ${beforeResortType} → ${filtered.length} properties`);
}



    // ✅ STEP 4: ROOMS FILTER
    if (filters.rooms && filters.rooms !== 'any' && filters.rooms !== '') {
      const beforeRooms = filtered.length;
      
      filtered = filtered.filter(property => {
        const rooms = property.resortDetails?.rooms || 0;
        let matches = false;
        
        switch (filters.rooms) {
          case '1-5':
            matches = rooms >= 1 && rooms <= 5;
            break;
          case '5-10':
            matches = rooms >= 5 && rooms <= 10;
            break;
          case '10-20':
            matches = rooms >= 10 && rooms <= 20;
            break;
          case '20+':
            matches = rooms >= 20;
            break;
          default:
            matches = true;
        }
        
        if (!matches) {
          console.log(`🛏️ Filtered out (rooms): ${property.propertyTitle?.en || property.propertyTitle} - Rooms: ${rooms} (Range: ${filters.rooms})`);
        }
        
        return matches;
      });
      
      filterSteps.push({
        step: `Rooms (${filters.rooms})`,
        before: beforeRooms,
        after: filtered.length,
        removed: beforeRooms - filtered.length
      });
      
      console.log(`🛏️ Rooms filter (${filters.rooms}): ${beforeRooms} → ${filtered.length} properties`);
    }

    // ✅ STEP 5: FLOORS FILTER
    if (filters.floors && filters.floors !== 'any' && filters.floors !== '') {
      const beforeFloors = filtered.length;
      
      filtered = filtered.filter(property => {
        const floors = property.resortDetails?.floors || 0;
        let matches = false;
        
        switch (filters.floors) {
          case '1':
            matches = floors === 1;
            break;
          case '2':
            matches = floors === 2;
            break;
          case '3':
            matches = floors === 3;
            break;
          case '4+':
            matches = floors >= 4;
            break;
          default:
            matches = true;
        }
        
        if (!matches) {
          console.log(`🏢 Filtered out (floors): ${property.propertyTitle?.en || property.propertyTitle} - Floors: ${floors} (Expected: ${filters.floors})`);
        }
        
        return matches;
      });
      
      filterSteps.push({
        step: `Floors (${filters.floors})`,
        before: beforeFloors,
        after: filtered.length,
        removed: beforeFloors - filtered.length
      });
      
      console.log(`🏢 Floors filter (${filters.floors}): ${beforeFloors} → ${filtered.length} properties`);
    }

    // ✅ STEP 6: LAND AREA FILTER (SQFT - FIXED)
    if (filters.landAreaRange && Array.isArray(filters.landAreaRange)) {
      const beforeLandArea = filtered.length;
      const [minLand, maxLand] = filters.landAreaRange;
      
      // ✅ Skip if default range (0-10000)
      if (minLand !== 0 || maxLand !== 10000) {
        filtered = filtered.filter(property => {
          const landArea = property.resortDetails?.landArea || 0;
          const inRange = landArea >= minLand && landArea <= maxLand;
          
          if (!inRange) {
            console.log(`🌳 Filtered out (land area): ${property.propertyTitle?.en || property.propertyTitle} - Land: ${landArea} sqft (Range: ${minLand}-${maxLand} sqft)`);
          }
          
          return inRange;
        });
        
        filterSteps.push({
          step: `Land Area (${minLand}-${maxLand} sqft)`,
          before: beforeLandArea,
          after: filtered.length,
          removed: beforeLandArea - filtered.length
        });
        
        console.log(`🌳 Land area filter (${minLand}-${maxLand}): ${beforeLandArea} → ${filtered.length} properties`);
      }
    }

    // ✅ STEP 7: BUILD AREA FILTER (SQFT - FIXED)
    if (filters.buildAreaRange && Array.isArray(filters.buildAreaRange)) {
      const beforeBuildArea = filtered.length;
      const [minBuild, maxBuild] = filters.buildAreaRange;
      
      // ✅ Skip if default range (0-10000)
      if (minBuild !== 0 || maxBuild !== 10000) {
        filtered = filtered.filter(property => {
          const buildArea = property.resortDetails?.buildArea || 0;
          const inRange = buildArea >= minBuild && buildArea <= maxBuild;
          
          if (!inRange) {
            console.log(`🏗️ Filtered out (build area): ${property.propertyTitle?.en || property.propertyTitle} - Build: ${buildArea} sqft (Range: ${minBuild}-${maxBuild} sqft)`);
          }
          
          return inRange;
        });
        
        filterSteps.push({
          step: `Build Area (${minBuild}-${maxBuild} sqft)`,
          before: beforeBuildArea,
          after: filtered.length,
          removed: beforeBuildArea - filtered.length
        });
        
        console.log(`🏗️ Build area filter (${minBuild}-${maxBuild}): ${beforeBuildArea} → ${filtered.length} properties`);
      }
    }

    // ✅ STEP 8: LOCATION ADVANTAGES FILTER (CASE-INSENSITIVE - FIXED)
    if (filters.locAdvantages && filters.locAdvantages.length > 0) {
      const beforeLocAdv = filtered.length;
      
      filtered = filtered.filter(property => {
        const propertyAdvantages = property.resortDetails?.locationAdvantages || [];
        
        // ✅ FIX: Normalize both arrays for case-insensitive comparison
        const normalizeText = (text) => text.toLowerCase().replace(/[\s_-]+/g, '');
        
        const normalizedPropertyAdvantages = propertyAdvantages.map(adv => normalizeText(adv));
        const normalizedFilterAdvantages = filters.locAdvantages.map(adv => normalizeText(adv));
        
        const hasAdvantage = normalizedFilterAdvantages.some(adv => 
          normalizedPropertyAdvantages.includes(adv)
        );
        
        if (!hasAdvantage) {
          console.log(`📍 Filtered out (location advantages): ${property.propertyTitle?.en || property.propertyTitle}`);
          console.log(`   Property has: [${propertyAdvantages.join(', ')}]`);
          console.log(`   Looking for: [${filters.locAdvantages.join(', ')}]`);
        }
        
        return hasAdvantage;
      });
      
      filterSteps.push({
        step: `Location Advantages (${filters.locAdvantages.length} selected)`,
        before: beforeLocAdv,
        after: filtered.length,
        removed: beforeLocAdv - filtered.length
      });
      
      console.log(`📍 Location advantages filter: ${beforeLocAdv} → ${filtered.length} properties`);
    }

    // ✅ STEP 9: FACING DIRECTIONS FILTER (FIXED PATH)
    if (filters.facingDirections && filters.facingDirections.length > 0) {
      const beforeFacing = filtered.length;
      
      filtered = filtered.filter(property => {
        const propertyFacing = property.resortDetails?.vaasthuDetails?.propertyFacing || '';
        
        // ✅ Normalize for comparison
        const normalizeText = (text) => text.toLowerCase().replace(/[\s_-]+/g, '');
        const normalizedPropertyFacing = normalizeText(propertyFacing);
        const normalizedFilterFacings = filters.facingDirections.map(f => normalizeText(f));
        
        const matchesFacing = normalizedFilterFacings.includes(normalizedPropertyFacing);
        
        if (!matchesFacing) {
          console.log(`🧭 Filtered out (facing): ${property.propertyTitle?.en || property.propertyTitle} - Facing: ${propertyFacing} (Expected: [${filters.facingDirections.join(', ')}])`);
        }
        
        return matchesFacing;
      });
      
      filterSteps.push({
        step: `Facing Direction (${filters.facingDirections.length} selected)`,
        before: beforeFacing,
        after: filtered.length,
        removed: beforeFacing - filtered.length
      });
      
      console.log(`🧭 Facing direction filter: ${beforeFacing} → ${filtered.length} properties`);
    }

    // ✅ STEP 10: QUICK FILTERS (Verified, With Photos, With Videos, Ready to Move)
    if (filters.quickFilters && filters.quickFilters.length > 0) {
      const beforeQuick = filtered.length;
      
      filtered = filtered.filter(property => {
        let passes = true;
        
        filters.quickFilters.forEach(quickFilter => {
          switch (quickFilter) {
            case 'verified':
              if (property.status !== 'approved') {
                passes = false;
                console.log(`✅ Filtered out (not verified): ${property.propertyTitle?.en || property.propertyTitle}`);
              }
              break;
            case 'with_photos':
              if (!property.images || property.images.length === 0) {
                passes = false;
                console.log(`📸 Filtered out (no photos): ${property.propertyTitle?.en || property.propertyTitle}`);
              }
              break;
            case 'with_videos':
              if (!property.videos || property.videos.length === 0) {
                passes = false;
                console.log(`🎥 Filtered out (no videos): ${property.propertyTitle?.en || property.propertyTitle}`);
              }
              break;
            case 'ready_to_move':
              // ✅ Note: Resorts don't have possessionStatus in schema
              // This filter may not work unless schema is updated
              if (property.resortDetails?.possessionStatus !== 'Ready to Move') {
                passes = false;
                console.log(`🏡 Filtered out (not ready to move): ${property.propertyTitle?.en || property.propertyTitle}`);
              }
              break;
          }
        });
        
        return passes;
      });
      
      filterSteps.push({
        step: `Quick Filters (${filters.quickFilters.length} selected)`,
        before: beforeQuick,
        after: filtered.length,
        removed: beforeQuick - filtered.length
      });
      
      console.log(`⚡ Quick filters: ${beforeQuick} → ${filtered.length} properties`);
    }

    // ✅ STEP 11: SEARCH QUERY FILTER (if exists)
    if (searchQuery && searchQuery.trim()) {
      const beforeSearch = filtered.length;
      
      filtered = filtered.filter((property) => {
        const propertyTitle = getLocalizedText(property.propertyTitle, currentLanguage);
        const matches = propertyTitle.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matches) {
          console.log(`🔎 Filtered out (search): ${propertyTitle} (Query: ${searchQuery})`);
        }
        
        return matches;
      });
      
      filterSteps.push({
        step: `Search Query (${searchQuery})`,
        before: beforeSearch,
        after: filtered.length,
        removed: beforeSearch - filtered.length
      });
      
      console.log(`🔎 Search filter (${searchQuery}): ${beforeSearch} → ${filtered.length} properties`);
    }

    // ✅ FINAL SUMMARY
    console.log('📊 ========== FILTER SUMMARY ==========');
    console.table(filterSteps);
    console.log(`✅ Final result: ${propertyList.length} → ${filtered.length} properties`);
    console.log(`❌ Removed: ${propertyList.length - filtered.length} properties`);
    console.log('=========================================');

    setFilteredProperties(filtered);
  };

  // ✅ SEARCH QUERY EFFECT
  useEffect(() => {
    if (activeFilters) {
      applyFilters(properties, activeFilters);
    } else {
      const areaFiltered = properties.filter((property) => {
        const propertyAreaKey = property.areaKey || '';
        const propertyTitle = getLocalizedText(property.propertyTitle, currentLanguage);
        const matchesArea = propertyAreaKey === areaKey;
        const matchesSearch = propertyTitle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesArea && matchesSearch;
      });
      setFilteredProperties(areaFiltered);
    }
  }, [searchQuery, properties]);

  const fetchReviewForProperty = async (propertyId) => {
    try {
      const res = await fetchReviews('property', propertyId);
      setReviewSummary(prev => ({
        ...prev,
        [propertyId]: {
          avgRating: res.avgRating || 0,
          count: res.count || 0
        }
      }));
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  useEffect(() => {
    if (properties.length > 0) {
      properties.forEach(property => {
        fetchReviewForProperty(property._id);
      });
    }
  }, [properties]);

  const checkAllSavedStatuses = async (propertyList) => {
    const savedStatusPromises = propertyList.map(async (property) => {
      const response = await checkIfSaved(property._id, 'property');
      return { id: property._id, isSaved: response.success ? response.isSaved : false };
    });

    const results = await Promise.all(savedStatusPromises);
    const newSavedStates = {};
    results.forEach(({ id, isSaved }) => {
      newSavedStates[id] = isSaved;
    });
    setSavedStates(newSavedStates);
  };

  const handleToggleSave = async (propertyId) => {
    const currentState = savedStates[propertyId] || false;

    setSavedStates(prev => ({ ...prev, [propertyId]: !currentState }));

    try {
      let response;
      if (currentState) {
        response = await unsaveProperty(propertyId, 'property');
      } else {
        response = await saveProperty(propertyId, 'property');
      }

      if (!response.success) {
        setSavedStates(prev => ({ ...prev, [propertyId]: currentState }));
        Alert.alert('Error', response.message || 'Failed to update saved status');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      setSavedStates(prev => ({ ...prev, [propertyId]: currentState }));
    }
  };

  // ✅ CLEAR FILTERS FUNCTION
  const handleClearFilters = () => {
    setActiveFilters(null);
    setIsFiltering(false);
    const areaFiltered = properties.filter((property) => {
      const propertyAreaKey = property.areaKey || '';
      return propertyAreaKey === areaKey;
    });
    setFilteredProperties(areaFiltered);
  };

  // ✅ GET ACTIVE FILTER COUNT (FIXED - REMOVED AMENITIES & PROPERTY FEATURES)
  const getActiveFilterCount = () => {
    if (!activeFilters) return 0;
    
    let count = 0;
    
    // Basic filters
    if (activeFilters.resortType && activeFilters.resortType !== '' && activeFilters.resortType !== 'Any') count++;
    if (activeFilters.rooms && activeFilters.rooms !== 'any' && activeFilters.rooms !== '') count++;
    if (activeFilters.floors && activeFilters.floors !== 'any' && activeFilters.floors !== '') count++;
    
    // Range filters (UPDATED DEFAULTS)
    if (activeFilters.budgetRange && (activeFilters.budgetRange[0] !== 1 || activeFilters.budgetRange[1] !== 500)) count++;
    if (activeFilters.landAreaRange && (activeFilters.landAreaRange[0] !== 0 || activeFilters.landAreaRange[1] !== 10000)) count++;
    if (activeFilters.buildAreaRange && (activeFilters.buildAreaRange[0] !== 0 || activeFilters.buildAreaRange[1] !== 10000)) count++;
    
    // Multi-select filters (AMENITIES & PROPERTY FEATURES REMOVED)
    if (activeFilters.locAdvantages && activeFilters.locAdvantages.length > 0) count++;
    if (activeFilters.facingDirections && activeFilters.facingDirections.length > 0) count++;
    if (activeFilters.quickFilters && activeFilters.quickFilters.length > 0) count++;
    
    console.log('🔢 Active filter count:', count);
    return count;
  };

  const scrollbarHeight = SCREEN_HEIGHT * (SCREEN_HEIGHT / contentHeight) * 0.3;

  const scrollIndicator = Animated.multiply(
    scrollY,
    SCREEN_HEIGHT / contentHeight
  ).interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [0, SCREEN_HEIGHT - scrollbarHeight],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="flex-row items-center px-5 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold ml-2">{areaName} Properties</Text>
      </View>

      <View style={{ flex: 1, flexDirection: "row" }}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 60,
          }}
          onContentSizeChange={(_, h) => setContentHeight(h)}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Search Bar */}
          <View
            className="flex-row items-center bg-white rounded-full px-4 py-2 border border-gray-200 mt-1"
            style={{ width: CARD_WIDTH }}
          >
            <Ionicons name="search-outline" size={18} />
            <TextInput
              placeholder="Search by Properties"
              className="flex-1 ml-2 text-gray-800"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 15,
                color: "#6B7280",
              }}
            />
            <Ionicons name="mic-outline" size={18} />
            {/* ✅ FILTER ICON - WITH BADGE */}
            <TouchableOpacity 
              onPress={() => router.push({
                pathname: '/home/screens/Resorts/Filter',
                params: { 
                  propertyType: 'Resort',
                  currentFilters: activeFilters ? JSON.stringify(activeFilters) : ''
                }
              })}
              style={{ marginLeft: 8, position: 'relative' }}
            >
              <Ionicons name="options-outline" size={18} />
              {getActiveFilterCount() > 0 && (
                <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 items-center justify-center">
                  <Text className="text-white text-[10px] font-bold">
                    {getActiveFilterCount()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ✅ ACTIVE FILTERS DISPLAY (FIXED - REMOVED AMENITIES & PROPERTY FEATURES) */}
          {activeFilters && getActiveFilterCount() > 0 && (
            <View className="w-full px-5 mt-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-gray-600">Active Filters: {getActiveFilterCount()}</Text>
                <TouchableOpacity onPress={handleClearFilters}>
                  <Text className="text-sm text-green-500 font-semibold">Clear All</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {/* Resort Type */}
                {activeFilters.resortType && activeFilters.resortType !== '' && activeFilters.resortType !== 'Any' && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">{activeFilters.resortType}</Text>
                  </View>
                )}
                
                {/* Rooms */}
                {activeFilters.rooms && activeFilters.rooms !== 'any' && activeFilters.rooms !== '' && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">{activeFilters.rooms} Rooms</Text>
                  </View>
                )}
                
                {/* Floors */}
                {activeFilters.floors && activeFilters.floors !== 'any' && activeFilters.floors !== '' && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">{activeFilters.floors} Floors</Text>
                  </View>
                )}
                
                {/* Budget (UPDATED TO LAKHS) */}
                {activeFilters.budgetRange && (activeFilters.budgetRange[0] !== 1 || activeFilters.budgetRange[1] !== 500) && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">
                      ₹{activeFilters.budgetRange[0]}-{activeFilters.budgetRange[1]}L
                    </Text>
                  </View>
                )}
                
                {/* Land Area (UPDATED TO SQFT) */}
                {activeFilters.landAreaRange && (activeFilters.landAreaRange[0] !== 0 || activeFilters.landAreaRange[1] !== 10000) && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">
                      Land: {activeFilters.landAreaRange[0]}-{activeFilters.landAreaRange[1]} sqft
                    </Text>
                  </View>
                )}
                
                {/* Build Area (UPDATED TO SQFT) */}
                {activeFilters.buildAreaRange && (activeFilters.buildAreaRange[0] !== 0 || activeFilters.buildAreaRange[1] !== 10000) && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">
                      Build: {activeFilters.buildAreaRange[0]}-{activeFilters.buildAreaRange[1]} sqft
                    </Text>
                  </View>
                )}
                
                {/* Location Advantages */}
                {activeFilters.locAdvantages && activeFilters.locAdvantages.length > 0 && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">
                      {activeFilters.locAdvantages.length} Location Advantage{activeFilters.locAdvantages.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
                
                {/* Facing Directions */}
                {activeFilters.facingDirections && activeFilters.facingDirections.length > 0 && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">
                      Facing: {activeFilters.facingDirections.join(', ')}
                    </Text>
                  </View>
                )}
                
                {/* Quick Filters Count */}
                {activeFilters.quickFilters && activeFilters.quickFilters.length > 0 && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">
                      {activeFilters.quickFilters.length} Quick Filter{activeFilters.quickFilters.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Property Count */}
          <Text
            className="text-gray-400 text-sm mt-3 self-start"
            style={{
              width: CARD_WIDTH,
              textAlign: "left",
              paddingLeft: 30,
              fontFamily: "Poppins-Regular",
              fontSize: 12,
              color: "#6B7280",
            }}
          >
            {filteredProperties.length} properties found in {areaName}
          </Text>

          {/* LOADING */}
          {loading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 50 }}>
              <ActivityIndicator size="large" color="#16A34A" />
              <Text style={{ marginTop: 16, fontFamily: "Poppins-Regular", color: '#6B7280' }}>
                Loading properties...
              </Text>
            </View>
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((item, index) => (
              <View
                key={item._id}
                style={{
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  backgroundColor: "white",
                  borderRadius: 24,
                  marginTop: index === 0 ? 10 : 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.15,
                  shadowRadius: 6,
                  elevation: 6,
                  overflow: "hidden",
                  borderWidth: 0.5,
                  borderColor: "#E5E7EB",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push({
                    pathname: '/home/screens/Resorts/(Property)',
                    params: {
                      propertyId: item._id,
                      propertyData: JSON.stringify(item),
                      areaKey: item.areaKey || areaKey,
                      entityType: 'property'
                    }
                  })}
                >
                  <Image
                    source={
                      item.images && item.images.length > 0
                        ? { uri: getImageUrl(item.images[0]) }
                        : require("../../../../assets/resort.jpg")
                    }
                    style={{
                      width: CARD_WIDTH,
                      height: 163,
                      borderTopLeftRadius: 17,
                      borderTopRightRadius: 17,
                    }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleToggleSave(item._id)}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 12,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    padding: 6,
                    borderRadius: 50,
                  }}
                >
                  <Ionicons
                    name={savedStates[item._id] ? "bookmark" : "bookmark-outline"}
                    size={20}
                    color="#16A34A"
                  />
                </TouchableOpacity>

                <View style={{ paddingHorizontal: 12, paddingTop: 10 }}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => router.push({
                      pathname: '/home/screens/Resorts/(Property)',
                      params: {
                        propertyId: item._id,
                        areaKey: item.areaKey || areaKey,
                        entityType: 'property'
                      }
                    })}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins-Medium",
                        fontWeight: "500",
                        fontSize: 12,
                        color: "#16A34A",
                        marginTop: 5,
                      }}
                    >
                      {getLocalizedText(item.propertyTitle, currentLanguage) || 'Property'}
                    </Text>
                  </TouchableOpacity>

                 <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 3 }}>
  <Text
    style={{
      fontFamily: "Poppins-Regular",
      fontSize: 11,
      color: "#6B7280",
      flex: 1,
    }}
  >
    {item.resortDetails?.resortType || 'Resort'}
  </Text>
  
  {/* ✅ Verified Badge - Show only if isVerified is true */}
  {item.isVerified && (
    <View style={{ 
      backgroundColor: "#22C55E", 
      paddingHorizontal: 6, 
      paddingVertical: 2, 
      borderRadius: 3,
      marginLeft: 8
    }}>
      <Text style={{ 
        color: "white", 
        fontSize: 8, 
        fontFamily: "Poppins-Medium",
        fontWeight: "600"
      }}>
        ✓ Verified
      </Text>
    </View>
  )}
</View>
                  <View className="flex-row items-center mb-1 mt-2">
                    <Ionicons name="star" size={14} color="#FF9500" />
                    <Text className="text-xs mx-3 text-gray-700 justify-center item-center">
                      {reviewSummary[item._id]?.avgRating?.toFixed(1) || '0.0'} ({reviewSummary[item._id]?.count || 0} reviews)
                    </Text>
                  </View>

                  <View className="flex-row items-center mt-1">
                    <Image
                      source={require("../../../../assets/location.png")}
                      style={{ width: 10, height: 14, resizeMode: "contain" }}
                    />
                    <Text
                      style={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 11,
                        color: "#6B7280",
                        marginLeft: 4,
                      }}
                    >
                      {getLocalizedText(item.area, currentLanguage) || getLocalizedText(item.location, currentLanguage) || areaName}
                    </Text>
                  </View>

                  <View
                    style={{
                      position: "absolute",
                      right: 12,
                      bottom: 12,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#16A34A",
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Poppins-Medium",
                          fontSize: 11,
                          color: "#FFFFFF",
                          textAlign: "center",
                          paddingTop: 2,
                        }}
                      >
                        ₹{item.expectedPrice ? (item.expectedPrice / 100000).toFixed(0) + 'L' : 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 80,
              }}
            >
              <Ionicons name="search-outline" size={64} color="#D1D5DB" />
              <Text
                style={{
                  color: "#6B7280",
                  fontSize: 16,
                  marginTop: 16,
                  fontFamily: "Poppins-Regular",
                }}
              >
                No properties found
              </Text>
              <Text
                style={{
                  color: "#9CA3AF",
                  fontSize: 14,
                  marginTop: 8,
                  fontFamily: "Poppins-Regular",
                }}
              >
                Try adjusting your filters
              </Text>
            </View>
          )}
        </Animated.ScrollView>

        {/* Custom Scroll Bar */}
        <View
          style={{
            width: 7,
            marginRight: 6,
            borderRadius: 3,
            backgroundColor: "#E5E7EB",
            height: "90%",
            alignSelf: "center",
          }}
        >
          <Animated.View
            style={{
              width: 6,
              borderRadius: 3,
              backgroundColor: "#cbddd2ff",
              height: scrollbarHeight,
              transform: [{ translateY: scrollIndicator }],
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}