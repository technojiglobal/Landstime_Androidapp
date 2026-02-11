// Frontend/app/home/screens/Flats/PropertyDetails.jsx
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
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getApprovedProperties } from "../../../../utils/propertyApi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/index"
import { saveProperty, unsaveProperty, checkIfSaved } from "../../../../utils/savedPropertiesApi";
import { fetchReviews } from "../../../../utils/reviewApi";
import { getImageUrl } from "../../../../utils/imageHelper";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = 345;
const CARD_HEIGHT = 298;

// ✅ Helper function OUTSIDE component
const getLocalizedText = (field, language) => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[language] || field.en || field.te || field.hi || '';
};

export default function PropertyListScreen() {
  // ✅ 1. REFS
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // ✅ 2. ROUTER & TRANSLATION
  const router = useRouter();
  const { t } = useTranslation();
  const { areaKey, districtKey, appliedFilters } = useLocalSearchParams();
  
  // ✅ 3. STATE
  const [contentHeight, setContentHeight] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedStates, setSavedStates] = useState({});
  const [reviewSummary, setReviewSummary] = useState({});
  
  // ✅ NEW - Filter states
  const [activeFilters, setActiveFilters] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // ✅ 4. COMPUTED VALUES
  const currentLanguage = i18n.language || 'en';
  const areaName = areaKey ? t(`areas.${areaKey}`) : '';

  const scrollbarHeight = SCREEN_HEIGHT * (SCREEN_HEIGHT / contentHeight) * 0.3;
  const scrollIndicator = Animated.multiply(
    scrollY,
    SCREEN_HEIGHT / contentHeight
  ).interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [0, SCREEN_HEIGHT - scrollbarHeight],
    extrapolate: "clamp",
  });

  // ✅ 5. PARSE FILTERS when returned from Filter screen
  useEffect(() => {
    if (appliedFilters) {
      try {
        const filters = JSON.parse(appliedFilters);
        console.log('✅ Filters received from Filter screen:', filters);
        console.log('📊 Filter breakdown:', {
          budgetRange: filters.budgetRange,
          bedrooms: filters.bedrooms,
          bathrooms: filters.bathrooms,
          balconies: filters.balconies,
          floors: filters.floors,
          areaRange: filters.areaRange,
          furnishing: filters.furnishing,
          ageOfProperty: filters.ageOfProperty,
          availabilityStatus: filters.availabilityStatus,
          otherRooms: filters.otherRooms?.length || 0,
          locAdvantages: filters.locAdvantages?.length || 0,
          quickFilters: filters.quickFilters?.length || 0,
          facingDirections: filters.facingDirections?.length || 0,
        });
        
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

  // ✅ 6. FETCH PROPERTIES
  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching HOUSES for areaKey:', areaKey);

      const currentLang = i18n.language || 'en';
      console.log('🌐 Fetching in language:', currentLang);

      const response = await getApprovedProperties(null, 1, currentLang);
      
      console.log('=== API RESPONSE DEBUG ===');
      console.log('response.success:', response.success);
      console.log('response.data type:', typeof response.data);
      
      if (response.success && response.data) {
        let allProperties = [];
        
        if (Array.isArray(response.data)) {
          allProperties = response.data;
          console.log('✅ Found array in response.data');
        } else if (Array.isArray(response.data.data)) {
          allProperties = response.data.data;
          console.log('✅ Found array in response.data.data');
        } else if (Array.isArray(response.data.properties)) {
          allProperties = response.data.properties;
          console.log('✅ Found array in response.data.properties');
        } else {
          console.error('❌ Could not find properties array');
          console.error('response.data keys:', Object.keys(response.data));
          setProperties([]);
          return;
        }
        
        console.log('📊 Total properties:', allProperties.length);
        
        if (allProperties.length > 0) {
          console.log('First property sample:', {
            type: allProperties[0]?.propertyType,
            areaKey: allProperties[0]?.areaKey
          });
        }
        
        const houseProperties = allProperties.filter(
          property => property?.propertyType?.toLowerCase() === 'house' || 
                      property?.propertyType === 'House/Flat'
        );
        
        console.log('🏡 Filtered houses:', houseProperties.length);
        console.log('🔑 Target areaKey:', areaKey);
        
        await checkAllSavedStatuses(houseProperties);
        setProperties(houseProperties);
      } else {
        console.error('❌ API failed:', response.error);
        setProperties([]);
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 7. APPLY FILTERS FUNCTION
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
        console.log(`❌ Filtered out (wrong area): ${getLocalizedText(property.propertyTitle, currentLanguage)} - areaKey: ${propertyAreaKey}`);
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

    // ✅ STEP 2: BUDGET FILTER (LAKHS)
    if (filters.budgetRange && Array.isArray(filters.budgetRange)) {
      const beforeBudget = filtered.length;
      const [minBudget, maxBudget] = filters.budgetRange;
      
      if (minBudget !== 1 || maxBudget !== 500) {
        filtered = filtered.filter(property => {
          const price = property.expectedPrice / 100000; // Convert to Lakhs
          const inRange = price >= minBudget && price <= maxBudget;
          
          if (!inRange) {
            console.log(`💰 Filtered out (budget): ${getLocalizedText(property.propertyTitle, currentLanguage)} - Price: ₹${price.toFixed(2)}L (Range: ${minBudget}-${maxBudget}L)`);
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

    // ✅ STEP 3: BEDROOMS FILTER
    if (filters.bedrooms && filters.bedrooms !== '' && filters.bedrooms !== 'any') {
      const beforeBedrooms = filtered.length;
      
      filtered = filtered.filter(property => {
        const bedrooms = property.houseDetails?.bedrooms || 0;
        let matches = false;
        
        if (filters.bedrooms === '5+') {
          matches = bedrooms >= 5;
        } else {
          matches = bedrooms === parseInt(filters.bedrooms);
        }
        
        if (!matches) {
          console.log(`🛏️ Filtered out (bedrooms): ${getLocalizedText(property.propertyTitle, currentLanguage)} - Bedrooms: ${bedrooms} (Expected: ${filters.bedrooms})`);
        }
        
        return matches;
      });
      
      filterSteps.push({
        step: `Bedrooms (${filters.bedrooms})`,
        before: beforeBedrooms,
        after: filtered.length,
        removed: beforeBedrooms - filtered.length
      });
      
      console.log(`🛏️ Bedrooms filter (${filters.bedrooms}): ${beforeBedrooms} → ${filtered.length} properties`);
    }

    // ✅ STEP 4: BATHROOMS FILTER
    if (filters.bathrooms && filters.bathrooms !== '' && filters.bathrooms !== 'any') {
      const beforeBathrooms = filtered.length;
      
      filtered = filtered.filter(property => {
        const bathrooms = property.houseDetails?.bathrooms || 0;
        let matches = false;
        
        if (filters.bathrooms === '4+') {
          matches = bathrooms >= 4;
        } else {
          matches = bathrooms === parseInt(filters.bathrooms);
        }
        
        if (!matches) {
          console.log(`🚿 Filtered out (bathrooms): ${getLocalizedText(property.propertyTitle, currentLanguage)} - Bathrooms: ${bathrooms} (Expected: ${filters.bathrooms})`);
        }
        
        return matches;
      });
      
      filterSteps.push({
        step: `Bathrooms (${filters.bathrooms})`,
        before: beforeBathrooms,
        after: filtered.length,
        removed: beforeBathrooms - filtered.length
      });
      
      console.log(`🚿 Bathrooms filter (${filters.bathrooms}): ${beforeBathrooms} → ${filtered.length} properties`);
    }

    // ✅ STEP 5: BALCONIES FILTER
    if (filters.balconies && filters.balconies !== '' && filters.balconies !== 'any') {
      const beforeBalconies = filtered.length;
      
      filtered = filtered.filter(property => {
        const balconies = property.houseDetails?.balconies || 0;
        let matches = false;
        
        if (filters.balconies === '3+') {
          matches = balconies >= 3;
        } else {
          matches = balconies === parseInt(filters.balconies);
        }
        
        if (!matches) {
          console.log(`🪟 Filtered out (balconies): ${getLocalizedText(property.propertyTitle, currentLanguage)} - Balconies: ${balconies} (Expected: ${filters.balconies})`);
        }
        
        return matches;
      });
      
      filterSteps.push({
        step: `Balconies (${filters.balconies})`,
        before: beforeBalconies,
        after: filtered.length,
        removed: beforeBalconies - filtered.length
      });
      
      console.log(`🪟 Balconies filter (${filters.balconies}): ${beforeBalconies} → ${filtered.length} properties`);
    }

    // ✅ STEP 6: FLOORS FILTER
    if (filters.floors && filters.floors !== '' && filters.floors !== 'any') {
      const beforeFloors = filtered.length;
      
      filtered = filtered.filter(property => {
        const floors = property.houseDetails?.floors || 0;
        let matches = false;
        
        if (filters.floors === '4+') {
          matches = floors >= 4;
        } else {
          matches = floors === parseInt(filters.floors);
        }
        
        if (!matches) {
          console.log(`🏢 Filtered out (floors): ${getLocalizedText(property.propertyTitle, currentLanguage)} - Floors: ${floors} (Expected: ${filters.floors})`);
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

    // ✅ STEP 7: AREA FILTER (SQFT)
    if (filters.areaRange && Array.isArray(filters.areaRange)) {
      const beforeArea = filtered.length;
      const [minArea, maxArea] = filters.areaRange;
      
      if (minArea !== 0 || maxArea !== 10000) {
        filtered = filtered.filter(property => {
          const area = property.houseDetails?.area || 0;
          const inRange = area >= minArea && area <= maxArea;
          
          if (!inRange) {
            console.log(`📏 Filtered out (area): ${getLocalizedText(property.propertyTitle, currentLanguage)} - Area: ${area} sqft (Range: ${minArea}-${maxArea} sqft)`);
          }
          
          return inRange;
        });
        
        filterSteps.push({
          step: `Area (${minArea}-${maxArea} sqft)`,
          before: beforeArea,
          after: filtered.length,
          removed: beforeArea - filtered.length
        });
        
        console.log(`📏 Area filter (${minArea}-${maxArea}): ${beforeArea} → ${filtered.length} properties`);
      }
    }

    // ✅ STEP 8: FURNISHING FILTER
    if (filters.furnishing && filters.furnishing !== '' && filters.furnishing !== 'any') {
      const beforeFurnishing = filtered.length;
      
      filtered = filtered.filter(property => {
        const furnishing = property.houseDetails?.furnishing || '';
        const matches = furnishing === filters.furnishing;
        
        if (!matches) {
          console.log(`🛋️ Filtered out (furnishing): ${getLocalizedText(property.propertyTitle, currentLanguage)} - Furnishing: ${furnishing} (Expected: ${filters.furnishing})`);
        }
        
        return matches;
      });
      
      filterSteps.push({
        step: `Furnishing (${filters.furnishing})`,
        before: beforeFurnishing,
        after: filtered.length,
        removed: beforeFurnishing - filtered.length
      });
      
      console.log(`🛋️ Furnishing filter (${filters.furnishing}): ${beforeFurnishing} → ${filtered.length} properties`);
    }

    // ✅ STEP 9: AGE OF PROPERTY FILTER
    if (filters.ageOfProperty && filters.ageOfProperty !== '' && filters.ageOfProperty !== 'any') {
      const beforeAge = filtered.length;
      
      filtered = filtered.filter(property => {
        const ageOfProperty = property.houseDetails?.ageOfProperty || '';
        const matches = ageOfProperty === filters.ageOfProperty;
        
        if (!matches) {
          console.log(`🏚️ Filtered out (age): ${getLocalizedText(property.propertyTitle, currentLanguage)} - Age: ${ageOfProperty} (Expected: ${filters.ageOfProperty})`);
        }
        
        return matches;
      });
      
      filterSteps.push({
        step: `Age of Property (${filters.ageOfProperty})`,
        before: beforeAge,
        after: filtered.length,
        removed: beforeAge - filtered.length
      });
      
      console.log(`🏚️ Age filter (${filters.ageOfProperty}): ${beforeAge} → ${filtered.length} properties`);
    }

    // ✅ STEP 10: AVAILABILITY STATUS FILTER
    if (filters.availabilityStatus && filters.availabilityStatus !== '' && filters.availabilityStatus !== 'any') {
      const beforeAvailability = filtered.length;
      
      filtered = filtered.filter(property => {
        const availability = property.houseDetails?.availabilityStatus || '';
        const matches = availability === filters.availabilityStatus;
        
        if (!matches) {
          console.log(`🏗️ Filtered out (availability): ${getLocalizedText(property.propertyTitle, currentLanguage)} - Status: ${availability} (Expected: ${filters.availabilityStatus})`);
        }
        
        return matches;
      });
      
      filterSteps.push({
        step: `Availability (${filters.availabilityStatus})`,
        before: beforeAvailability,
        after: filtered.length,
        removed: beforeAvailability - filtered.length
      });
      
      console.log(`🏗️ Availability filter (${filters.availabilityStatus}): ${beforeAvailability} → ${filtered.length} properties`);
    }

    // ✅ STEP 11: OTHER ROOMS FILTER
    if (filters.otherRooms && filters.otherRooms.length > 0) {
      const beforeOtherRooms = filtered.length;
      
      filtered = filtered.filter(property => {
        const propertyOtherRooms = property.houseDetails?.otherRooms || [];
        
        const hasRoom = filters.otherRooms.some(room => 
          propertyOtherRooms.includes(room)
        );
        
        if (!hasRoom) {
          console.log(`🚪 Filtered out (other rooms): ${getLocalizedText(property.propertyTitle, currentLanguage)}`);
          console.log(`   Property has: [${propertyOtherRooms.join(', ')}]`);
          console.log(`   Looking for: [${filters.otherRooms.join(', ')}]`);
        }
        
        return hasRoom;
      });
      
      filterSteps.push({
        step: `Other Rooms (${filters.otherRooms.length} selected)`,
        before: beforeOtherRooms,
        after: filtered.length,
        removed: beforeOtherRooms - filtered.length
      });
      
      console.log(`🚪 Other rooms filter: ${beforeOtherRooms} → ${filtered.length} properties`);
    }

    // ✅ STEP 12: LOCATION ADVANTAGES FILTER
    if (filters.locAdvantages && filters.locAdvantages.length > 0) {
      const beforeLocAdv = filtered.length;
      
      filtered = filtered.filter(property => {
        const propertyAdvantages = property.houseDetails?.locationAdvantages || [];
        
        const normalizeText = (text) => text.toLowerCase().replace(/[\s_-]+/g, '');
        
        const normalizedPropertyAdvantages = propertyAdvantages.map(adv => normalizeText(adv));
        const normalizedFilterAdvantages = filters.locAdvantages.map(adv => normalizeText(adv));
        
        const hasAdvantage = normalizedFilterAdvantages.some(adv => 
          normalizedPropertyAdvantages.includes(adv)
        );
        
        if (!hasAdvantage) {
          console.log(`📍 Filtered out (location advantages): ${getLocalizedText(property.propertyTitle, currentLanguage)}`);
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

    // ✅ STEP 13: FACING DIRECTIONS FILTER
    if (filters.facingDirections && filters.facingDirections.length > 0) {
      const beforeFacing = filtered.length;
      
      filtered = filtered.filter(property => {
        const propertyFacing = property.houseDetails?.vaasthuDetails?.houseFacing || '';
        
        const normalizeText = (text) => text.toLowerCase().replace(/[\s_-]+/g, '');
        const normalizedPropertyFacing = normalizeText(propertyFacing);
        const normalizedFilterFacings = filters.facingDirections.map(f => normalizeText(f));
        
        const matchesFacing = normalizedFilterFacings.includes(normalizedPropertyFacing);
        
        if (!matchesFacing) {
          console.log(`🧭 Filtered out (facing): ${getLocalizedText(property.propertyTitle, currentLanguage)} - Facing: ${propertyFacing} (Expected: [${filters.facingDirections.join(', ')}])`);
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

    // ✅ STEP 14: QUICK FILTERS
    if (filters.quickFilters && filters.quickFilters.length > 0) {
      const beforeQuick = filtered.length;
      
      filtered = filtered.filter(property => {
        let passes = true;
        
        filters.quickFilters.forEach(quickFilter => {
          switch (quickFilter) {
            case 'verified':
              if (property.status !== 'approved') {
                passes = false;
                console.log(`✅ Filtered out (not verified): ${getLocalizedText(property.propertyTitle, currentLanguage)}`);
              }
              break;
            case 'with_photos':
              if (!property.images || property.images.length === 0) {
                passes = false;
                console.log(`📸 Filtered out (no photos): ${getLocalizedText(property.propertyTitle, currentLanguage)}`);
              }
              break;
            case 'with_videos':
              if (!property.videos || property.videos.length === 0) {
                passes = false;
                console.log(`🎥 Filtered out (no videos): ${getLocalizedText(property.propertyTitle, currentLanguage)}`);
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

    // ✅ STEP 15: SEARCH QUERY FILTER
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

  // ✅ 8. APPLY FILTERS EFFECT
  useEffect(() => {
    if (properties.length > 0) {
      if (activeFilters && isFiltering) {
        console.log('🔍 Applying filters to properties...');
        applyFilters(properties, activeFilters);
      } else {
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

  // ✅ 9. SEARCH QUERY EFFECT
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

  // ✅ 10. INITIAL FETCH
  useEffect(() => {
    fetchProperties();
  }, [areaKey]);

  useEffect(() => {
    if (areaKey) {
      fetchProperties();
    }
  }, [i18n.language]);

  // ✅ 11. HELPER FUNCTIONS
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
    const token = await AsyncStorage.getItem('userToken');
    
    if (!token) {
      Alert.alert('Not Logged In', 'Please log in to save properties');
      return;
    }

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

  // ✅ 12. CLEAR FILTERS FUNCTION
  const handleClearFilters = () => {
    setActiveFilters(null);
    setIsFiltering(false);
    const areaFiltered = properties.filter((property) => {
      const propertyAreaKey = property.areaKey || '';
      return propertyAreaKey === areaKey;
    });
    setFilteredProperties(areaFiltered);
  };

  // ✅ 13. GET ACTIVE FILTER COUNT
  const getActiveFilterCount = () => {
    if (!activeFilters) return 0;
    
    let count = 0;
    
    // Basic filters
    if (activeFilters.bedrooms && activeFilters.bedrooms !== 'any' && activeFilters.bedrooms !== '') count++;
    if (activeFilters.bathrooms && activeFilters.bathrooms !== 'any' && activeFilters.bathrooms !== '') count++;
    if (activeFilters.balconies && activeFilters.balconies !== 'any' && activeFilters.balconies !== '') count++;
    if (activeFilters.floors && activeFilters.floors !== 'any' && activeFilters.floors !== '') count++;
    if (activeFilters.furnishing && activeFilters.furnishing !== 'any' && activeFilters.furnishing !== '') count++;
    if (activeFilters.ageOfProperty && activeFilters.ageOfProperty !== 'any' && activeFilters.ageOfProperty !== '') count++;
    if (activeFilters.availabilityStatus && activeFilters.availabilityStatus !== 'any' && activeFilters.availabilityStatus !== '') count++;
    
    // Range filters
    if (activeFilters.budgetRange && (activeFilters.budgetRange[0] !== 1 || activeFilters.budgetRange[1] !== 500)) count++;
    if (activeFilters.areaRange && (activeFilters.areaRange[0] !== 0 || activeFilters.areaRange[1] !== 10000)) count++;
    
    // Multi-select filters
    if (activeFilters.otherRooms && activeFilters.otherRooms.length > 0) count++;
    if (activeFilters.locAdvantages && activeFilters.locAdvantages.length > 0) count++;
    if (activeFilters.facingDirections && activeFilters.facingDirections.length > 0) count++;
    if (activeFilters.quickFilters && activeFilters.quickFilters.length > 0) count++;
    
    console.log('🔢 Active filter count:', count);
    return count;
  };

  // ✅ 14. RENDER
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="flex-row items-center px-5 py-3">
        <TouchableOpacity onPress={() => router.push("/home/screens/Flats/SelectSite")}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold ml-2">{areaName} Properties</Text>
      </View>

      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Scrollable Content */}
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
            <TouchableOpacity 
              onPress={() => router.push({
                pathname: '/home/screens/Flats/Filter',
                params: { 
                  propertyType: 'House',
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

          {/* ✅ ACTIVE FILTERS DISPLAY */}
          {activeFilters && getActiveFilterCount() > 0 && (
            <View className="w-full px-5 mt-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-gray-600">Active Filters: {getActiveFilterCount()}</Text>
                <TouchableOpacity onPress={handleClearFilters}>
                  <Text className="text-sm text-green-500 font-semibold">Clear All</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {/* Bedrooms */}
                {activeFilters.bedrooms && activeFilters.bedrooms !== '' && activeFilters.bedrooms !== 'any' && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">{activeFilters.bedrooms} BHK</Text>
                  </View>
                )}
                
                {/* Bathrooms */}
                {activeFilters.bathrooms && activeFilters.bathrooms !== '' && activeFilters.bathrooms !== 'any' && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">{activeFilters.bathrooms} Bath</Text>
                  </View>
                )}
                
                {/* Balconies */}
                {activeFilters.balconies && activeFilters.balconies !== '' && activeFilters.balconies !== 'any' && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">{activeFilters.balconies} Balcony</Text>
                  </View>
                )}
                
                {/* Floors */}
                {activeFilters.floors && activeFilters.floors !== '' && activeFilters.floors !== 'any' && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">{activeFilters.floors} Floors</Text>
                  </View>
                )}
                
                {/* Budget */}
                {activeFilters.budgetRange && (activeFilters.budgetRange[0] !== 1 || activeFilters.budgetRange[1] !== 500) && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">
                      ₹{activeFilters.budgetRange[0]}-{activeFilters.budgetRange[1]}L
                    </Text>
                  </View>
                )}
                
                {/* Area */}
                {activeFilters.areaRange && (activeFilters.areaRange[0] !== 0 || activeFilters.areaRange[1] !== 10000) && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">
                      {activeFilters.areaRange[0]}-{activeFilters.areaRange[1]} sqft
                    </Text>
                  </View>
                )}
                
                {/* Furnishing */}
                {activeFilters.furnishing && activeFilters.furnishing !== '' && activeFilters.furnishing !== 'any' && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">{activeFilters.furnishing}</Text>
                  </View>
                )}
                
                {/* Age of Property */}
                {activeFilters.ageOfProperty && activeFilters.ageOfProperty !== '' && activeFilters.ageOfProperty !== 'any' && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">{activeFilters.ageOfProperty}</Text>
                  </View>
                )}
                
                {/* Availability Status */}
                {activeFilters.availabilityStatus && activeFilters.availabilityStatus !== '' && activeFilters.availabilityStatus !== 'any' && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">{activeFilters.availabilityStatus}</Text>
                  </View>
                )}
                
                {/* Other Rooms */}
                {activeFilters.otherRooms && activeFilters.otherRooms.length > 0 && (
                  <View className="flex-row items-center bg-green-50 border border-green-500 rounded-full px-3 py-1">
                    <Text className="text-xs text-green-700">
                      {activeFilters.otherRooms.length} Other Room{activeFilters.otherRooms.length > 1 ? 's' : ''}
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

          {/* Content */}
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
                    pathname: '/home/screens/Flats/(Property)',
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
                        : require("../../../../assets/Flat1.jpg")
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
                      pathname: '/home/screens/Flats/(Property)',
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
    {item.propertyType || 'Property Type'}
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
                    <Text className="text-xs mx-3 text-gray-700">
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
                Try adjusting your search
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