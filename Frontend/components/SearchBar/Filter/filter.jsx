// Frontend/components/SearchBar/Filter/filter.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Search } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';

const FilterScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { propertyType, currentFilters } = useLocalSearchParams();
  
  console.log('🎬 Filter Screen Opened');
  console.log('📋 Property Type:', propertyType);
  console.log('🔍 Current Filters:', currentFilters);
  
  // Parse existing filters if any
  const existingFilters = currentFilters ? JSON.parse(currentFilters) : {};
  console.log('✅ Parsed Existing Filters:', existingFilters);
  
  // ✅ FIXED - Initialize with empty/default values only if they were previously set
  const [selectedFilters, setSelectedFilters] = useState(existingFilters.selected || []);
  const [activeSection, setActiveSection] = useState(null);
  const [budgetRange, setBudgetRange] = useState(existingFilters.budgetRange || [1, 500]); // ✅ CHANGED to Lakhs
  
  // ✅ RESORT-SPECIFIC STATES
  const [selectedResortType, setSelectedResortType] = useState(existingFilters.resortType || '');
  const [resortTypeOpen, setResortTypeOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState(existingFilters.rooms || '');
  const [selectedFloors, setSelectedFloors] = useState(existingFilters.floors || '');
  const [landAreaRange, setLandAreaRange] = useState(existingFilters.landAreaRange || [0, 10000]); // ✅ CHANGED to sqft
  const [buildAreaRange, setBuildAreaRange] = useState(existingFilters.buildAreaRange || [0, 10000]); // ✅ CHANGED to sqft
  
  // ✅ MULTI-SELECT FILTERS
  const [locAdvantages, setLocAdvantages] = useState(existingFilters.locAdvantages || []);
  const [quickFilters, setQuickFilters] = useState(existingFilters.quickFilters || []);
  const [facingDirections, setFacingDirections] = useState(existingFilters.facingDirections || []);
  
  // ✅ REMOVED - amenities and propertyFeatures (not in resort schema)

  // ✅ RESORT TYPES (from schema)
  const RESORT_TYPES = [
    t("beachfront_resort"),
    t("hill_station_mountain_resort"),
    t("forest_jungle_retreat"),
    t("lakefront_resort"),
    t("desert_resort"),
    t("eco_resort"),
    t("island_resort"),
    t("wellness_spa_resort"),
    t("luxury_resort"),
    t("boutique_resort"),
    t("family_resort"),
    t("adventure_activity_resort"),
    t("safari_wildlife_resort"),
    t("water_park_resort"),
    t("golf_resort"),
    t("riverfront_resort"),
    t("farm_agri_resort"),
    t("theme_resort"),
    t("business_conference_resort"),
    t("eco_lodge_nature_retreat"),
  ];

  // ✅ LOCATION ADVANTAGES
  const LOCATION_ADVANTAGES = [
    { label: t("close_to_metro_station"), value: 'close_to_metro_station' },
    { label: t("close_to_school"), value: 'close_to_school' },
    { label: t("close_to_hospital"), value: 'close_to_hospital' },
    { label: t("close_to_market"), value: 'close_to_market' },
    { label: t("close_to_railway_station"), value: 'close_to_railway_station' },
    { label: t("close_to_airport"), value: 'close_to_airport' },
    { label: t("close_to_mall"), value: 'close_to_mall' },
    { label: t("close_to_highway"), value: 'close_to_highway' },
  ];

  // ✅ FACING DIRECTIONS
  const FACING_DIRECTIONS = [
    { label: 'North', value: 'North' },
    { label: 'South', value: 'South' },
    { label: 'East', value: 'East' },
    { label: 'West', value: 'West' },
    { label: 'North-East', value: 'North-East' },
    { label: 'North-West', value: 'North-West' },
    { label: 'South-East', value: 'South-East' },
    { label: 'South-West', value: 'South-West' },
  ];

  // ✅ QUICK FILTERS
  const QUICK_FILTERS = [
    { label: 'Verified Properties', value: 'verified' },
    { label: 'With Photos', value: 'with_photos' },
    { label: 'With Videos', value: 'with_videos' },
  ];

  // ✅ RESORT FILTER CATEGORIES (REMOVED AMENITIES & PROPERTY FEATURES & POSSESSION STATUS)
  const filterCategories = [
    {
      title: 'Quick Filters',
      options: QUICK_FILTERS,
      hasSelectAll: true,
    },
    {
      title: 'Budget',
      options: [],
      isSpecial: true,
    },
    {
      title: 'Resort Type',
      options: [],
      isSpecial: true,
    },
    {
      title: 'Rooms',
      options: [
        { label: 'Any', value: 'any' },
        { label: '1-5 Rooms', value: '1-5' },
        { label: '5-10 Rooms', value: '5-10' },
        { label: '10-20 Rooms', value: '10-20' },
        { label: '20+ Rooms', value: '20+' },
      ],
      isSingle: true,
    },
    {
      title: 'Floors',
      options: [
        { label: 'Any', value: 'any' },
        { label: '1 Floor', value: '1' },
        { label: '2 Floors', value: '2' },
        { label: '3 Floors', value: '3' },
        { label: '4+ Floors', value: '4+' },
      ],
      isSingle: true,
    },
    {
      title: 'Land Area',
      options: [],
      isSpecial: true,
    },
    {
      title: 'Build Area',
      options: [],
      isSpecial: true,
    },
    // ✅ REMOVED - Amenities (not in resort schema)
    {
      title: 'Location Advantages',
      options: LOCATION_ADVANTAGES,
      hasSelectAll: true,
    },
    // ✅ REMOVED - Property Features (not in resort schema)
    {
      title: 'Facing Direction',
      options: FACING_DIRECTIONS,
      hasSelectAll: true,
    },
    // ✅ REMOVED - Possession Status (not in resort schema)
  ];

  const toggleArrayItem = (setter, array, value) => {
    const newArray = array.includes(value)
      ? array.filter((i) => i !== value)
      : [...array, value];
    
    console.log('🔄 Toggle Array Item:', { value, newArray });
    setter(newArray);
  };

  const selectAllInCategory = (categoryTitle) => {
    const category = filterCategories.find((cat) => cat.title === categoryTitle);
    if (!category || !category.options.length) return;

    const stateMap = {
      'Location Advantages': [locAdvantages, setLocAdvantages],
      'Facing Direction': [facingDirections, setFacingDirections],
      'Quick Filters': [quickFilters, setQuickFilters],
    };

    const [currentState, setter] = stateMap[categoryTitle] || [[], () => {}];
    const allOptionsInCategory = category.options.map(opt => opt.value);
    const allSelected = allOptionsInCategory.every(val => currentState.includes(val));

    if (allSelected) {
      setter([]);
      console.log(`❌ Deselected all in ${categoryTitle}`);
    } else {
      setter(allOptionsInCategory);
      console.log(`✅ Selected all in ${categoryTitle}:`, allOptionsInCategory);
    }
  };

  const clearAll = () => {
    console.log('🧹 Clearing all filters');
    console.log('🔄 Resetting all states to default');
    
    setSelectedFilters([]);
    setBudgetRange([1, 500]); // ✅ CHANGED
    setSelectedResortType('');
    setSelectedRooms('');
    setSelectedFloors('');
    setLandAreaRange([0, 10000]); // ✅ CHANGED
    setBuildAreaRange([0, 10000]); // ✅ CHANGED
    setLocAdvantages([]);
    setQuickFilters([]);
    setFacingDirections([]);
    setActiveSection(null);
    
    console.log('✅ All filters cleared');
  };

  const handleApply = () => {
    console.log('✅ Applying Filters...');
    
    // ✅ FIXED - Only send non-default values
    const filters = {};
    
    // Only add if not default
    if (budgetRange[0] !== 1 || budgetRange[1] !== 500) {
      filters.budgetRange = budgetRange;
    }
    
    if (selectedResortType && selectedResortType !== '') {
      filters.resortType = selectedResortType;
    }
    
    if (selectedRooms && selectedRooms !== '' && selectedRooms !== 'any') {
      filters.rooms = selectedRooms;
    }
    
    if (selectedFloors && selectedFloors !== '' && selectedFloors !== 'any') {
      filters.floors = selectedFloors;
    }
    
    if (landAreaRange[0] !== 0 || landAreaRange[1] !== 10000) {
      filters.landAreaRange = landAreaRange;
    }
    
    if (buildAreaRange[0] !== 0 || buildAreaRange[1] !== 10000) {
      filters.buildAreaRange = buildAreaRange;
    }
    
    if (locAdvantages.length > 0) {
      filters.locAdvantages = locAdvantages;
    }
    
    if (quickFilters.length > 0) {
      filters.quickFilters = quickFilters;
    }
    
    if (facingDirections.length > 0) {
      filters.facingDirections = facingDirections;
    }

    console.log('📦 Final Filters Object:', JSON.stringify(filters, null, 2));
    console.log('📊 Filter Counts:', {
      totalFilters: Object.keys(filters).length,
      locAdvantages: locAdvantages.length,
      quickFilters: quickFilters.length,
      facingDirections: facingDirections.length,
    });

    // ✅ Navigate back with filters
    router.back();
    
    setTimeout(() => {
      if (router.canGoBack()) {
        router.setParams({ appliedFilters: JSON.stringify(filters) });
        console.log('✅ Filters sent back to PropertyDetails');
      }
    }, 100);
  };

  const renderRightSection = () => {
    // ✅ BUDGET SECTION (LAKHS)
    if (activeSection === 'Budget') {
      return (
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-semibold text-gray-800">Budget Range</Text>
            <Text className="text-xs text-gray-500">INR - ₹ (Lakhs)</Text>
          </View>
          
          <View className="flex-row items-center justify-between mb-6">
            <View className="bg-green-50 border border-green-500 rounded-full px-5 py-2.5 min-w-[80px] items-center">
              <Text className="text-sm font-medium text-green-700">{budgetRange[0]}L</Text>
            </View>
            <Text className="text-sm text-gray-600 mx-3">to</Text>
            <View className="bg-green-50 border border-green-500 rounded-full px-5 py-2.5 min-w-[80px] items-center">
              <Text className="text-sm font-medium text-green-700">{budgetRange[1]}L</Text>
            </View>
          </View>

          <View className="mb-2">
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={1}
              maximumValue={500}
              value={budgetRange[0]}
              onValueChange={(val) => {
                const newRange = [Math.round(val), budgetRange[1]];
                console.log('💰 Budget Min Changed:', newRange);
                setBudgetRange(newRange);
              }}
              minimumTrackTintColor="#22C55E"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#22C55E"
            />
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={budgetRange[0]}
              maximumValue={500}
              value={budgetRange[1]}
              onValueChange={(val) => {
                const newRange = [budgetRange[0], Math.round(val)];
                console.log('💰 Budget Max Changed:', newRange);
                setBudgetRange(newRange);
              }}
              minimumTrackTintColor="#22C55E"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#22C55E"
            />
          </View>
        </View>
      );
    }

    // ✅ RESORT TYPE SECTION
    if (activeSection === 'Resort Type') {
      return (
        <View className="p-4">
          <Text className="text-base font-bold text-gray-800 mb-4">Resort Type</Text>
          
          <TouchableOpacity 
            onPress={() => setResortTypeOpen(!resortTypeOpen)}
            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-4"
          >
            <Text className="text-gray-800">
              {selectedResortType || 'Select Resort Type'}
            </Text>
            <Text className="text-gray-400 text-lg">{resortTypeOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {resortTypeOpen && (
            <Modal visible={resortTypeOpen} transparent animationType="fade">
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.2)",
                  justifyContent: "center",
                  padding: 20,
                }}
                onPress={() => setResortTypeOpen(false)}
              >
                <View style={{ backgroundColor: "white", borderRadius: 10, maxHeight: "70%" }}>
                  <ScrollView>
                    <TouchableOpacity
                      onPress={() => {
                        console.log('🏨 Resort Type: Any');
                        setSelectedResortType('');
                        setResortTypeOpen(false);
                      }}
                      style={{
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: "#F1F5F9",
                      }}
                    >
                      <Text style={{ color: "#374151", fontWeight: selectedResortType === '' ? 'bold' : 'normal' }}>
                        Any
                      </Text>
                    </TouchableOpacity>
                    {RESORT_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => {
                          console.log('🏨 Resort Type Selected:', type);
                          setSelectedResortType(type);
                          setResortTypeOpen(false);
                        }}
                        style={{
                          paddingVertical: 14,
                          paddingHorizontal: 16,
                          borderBottomWidth: 1,
                          borderBottomColor: "#F1F5F9",
                        }}
                      >
                        <Text style={{ 
                          color: "#374151",
                          fontWeight: selectedResortType === type ? 'bold' : 'normal'
                        }}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </Pressable>
            </Modal>
          )}
        </View>
      );
    }

    // ✅ LAND AREA SECTION (SQFT)
    if (activeSection === 'Land Area') {
      return (
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-semibold text-gray-800">Land Area</Text>
            <Text className="text-xs text-gray-500">Square Feet (sqft)</Text>
          </View>
          
          <View className="flex-row items-center justify-between mb-6">
            <View className="bg-green-50 border border-green-500 rounded-full px-5 py-2.5 min-w-[80px] items-center">
              <Text className="text-sm font-medium text-green-700">{landAreaRange[0]}</Text>
            </View>
            <Text className="text-sm text-gray-600 mx-3">to</Text>
            <View className="bg-green-50 border border-green-500 rounded-full px-5 py-2.5 min-w-[80px] items-center">
              <Text className="text-sm font-medium text-green-700">{landAreaRange[1]}</Text>
            </View>
          </View>

          <View className="mb-2">
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={10000}
              step={100}
              value={landAreaRange[0]}
              onValueChange={(val) => {
                const newRange = [Math.round(val), landAreaRange[1]];
                console.log('🌳 Land Area Min:', newRange);
                setLandAreaRange(newRange);
              }}
              minimumTrackTintColor="#22C55E"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#22C55E"
            />
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={landAreaRange[0]}
              maximumValue={10000}
              step={100}
              value={landAreaRange[1]}
              onValueChange={(val) => {
                const newRange = [landAreaRange[0], Math.round(val)];
                console.log('🌳 Land Area Max:', newRange);
                setLandAreaRange(newRange);
              }}
              minimumTrackTintColor="#22C55E"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#22C55E"
            />
          </View>
        </View>
      );
    }

    // ✅ BUILD AREA SECTION (SQFT)
    if (activeSection === 'Build Area') {
      return (
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-semibold text-gray-800">Build Area</Text>
            <Text className="text-xs text-gray-500">Square Feet (sqft)</Text>
          </View>
          
          <View className="flex-row items-center justify-between mb-6">
            <View className="bg-green-50 border border-green-500 rounded-full px-5 py-2.5 min-w-[80px] items-center">
              <Text className="text-sm font-medium text-green-700">{buildAreaRange[0]}</Text>
            </View>
            <Text className="text-sm text-gray-600 mx-3">to</Text>
            <View className="bg-green-50 border border-green-500 rounded-full px-5 py-2.5 min-w-[80px] items-center">
              <Text className="text-sm font-medium text-green-700">{buildAreaRange[1]}</Text>
            </View>
          </View>

          <View className="mb-2">
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={10000}
              step={100}
              value={buildAreaRange[0]}
              onValueChange={(val) => {
                const newRange = [Math.round(val), buildAreaRange[1]];
                console.log('🏗️ Build Area Min:', newRange);
                setBuildAreaRange(newRange);
              }}
              minimumTrackTintColor="#22C55E"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#22C55E"
            />
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={buildAreaRange[0]}
              maximumValue={10000}
              step={100}
              value={buildAreaRange[1]}
              onValueChange={(val) => {
                const newRange = [buildAreaRange[0], Math.round(val)];
                console.log('🏗️ Build Area Max:', newRange);
                setBuildAreaRange(newRange);
              }}
              minimumTrackTintColor="#22C55E"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#22C55E"
            />
          </View>
        </View>
      );
    }

    // ✅ DEFAULT RENDERING FOR OTHER SECTIONS
    const category = filterCategories.find((cat) => cat.title === activeSection);
    if (category && category.options.length > 0) {
      return (
        <View className="p-4">
          <Text className="text-base font-bold text-gray-800 mb-4">{activeSection}</Text>
          
          {category.options.map((option) => {
            // ✅ Single-select categories
            if (category.isSingle) {
              const isSelected = 
                (activeSection === 'Rooms' && selectedRooms === option.value) ||
                (activeSection === 'Floors' && selectedFloors === option.value);
              
              return (
                <TouchableOpacity
                  key={option.value}
                  className="flex-row items-center py-3"
                  onPress={() => {
                    if (activeSection === 'Rooms') {
                      console.log('🛏️ Rooms Selected:', option.value);
                      setSelectedRooms(option.value === 'any' ? '' : option.value);
                    } else if (activeSection === 'Floors') {
                      console.log('🏢 Floors Selected:', option.value);
                      setSelectedFloors(option.value === 'any' ? '' : option.value);
                    }
                  }}
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 justify-center items-center ${
                      isSelected ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <View className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </View>
                  <Text className="text-sm text-gray-800">{option.label}</Text>
                </TouchableOpacity>
              );
            }

            // ✅ Multi-select categories
            const stateMap = {
              'Location Advantages': locAdvantages,
              'Facing Direction': facingDirections,
              'Quick Filters': quickFilters,
            };

            const setterMap = {
              'Location Advantages': setLocAdvantages,
              'Facing Direction': setFacingDirections,
              'Quick Filters': setQuickFilters,
            };

            const currentState = stateMap[activeSection] || [];
            const setter = setterMap[activeSection];
            const isSelected = currentState.includes(option.value);

            return (
              <TouchableOpacity
                key={option.value}
                className="flex-row items-center py-3"
                onPress={() => {
                  if (setter) {
                    toggleArrayItem(setter, currentState, option.value);
                  }
                }}
              >
                <View
                  className={`w-5 h-5 rounded border-2 mr-3 justify-center items-center ${
                    isSelected ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                  )}
                </View>
                <Text className="text-sm text-gray-800">{option.label}</Text>
              </TouchableOpacity>
            );
          })}

          {category.hasSelectAll && (
            <TouchableOpacity 
              onPress={() => selectAllInCategory(activeSection)}
              className="mt-2 py-2"
            >
              <Text className="text-sm text-green-500 font-semibold">
                Select All
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-sm text-gray-400">Select a filter category</Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-gray-200">
        <TouchableOpacity onPress={() => {
          console.log('❌ Filter Cancelled');
          router.back();
        }}>
          <X color="black" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">
          Filters
        </Text>
        <TouchableOpacity onPress={clearAll}>
          <Text className="text-sm text-green-500 font-semibold">Clear All</Text>
        </TouchableOpacity>
      </View>
      
     {/* ✅ SELECTED FILTERS CHIPS - REAL-TIME DISPLAY (REMOVED AMENITIES & PROPERTY FEATURES) */}
{(selectedResortType || 
  selectedRooms !== '' || 
  selectedFloors !== '' || 
  (budgetRange[0] !== 1 || budgetRange[1] !== 500) ||
  (landAreaRange[0] !== 0 || landAreaRange[1] !== 10000) ||
  (buildAreaRange[0] !== 0 || buildAreaRange[1] !== 10000) ||
  locAdvantages.length > 0 ||
  facingDirections.length > 0 ||
  quickFilters.length > 0) && (
  <View className="px-4 py-3 bg-gray-50 border-b border-gray-200">
    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-xs font-semibold text-gray-600">
        SELECTED FILTERS
      </Text>
      <TouchableOpacity onPress={clearAll}>
        <Text className="text-xs text-red-500 font-semibold">Clear All</Text>
      </TouchableOpacity>
    </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row flex-wrap gap-2">
              {/* Resort Type */}
              {selectedResortType && (
                <View className="flex-row items-center bg-green-500 rounded-full px-3 py-1.5">
                  <Text className="text-xs text-white mr-2">{selectedResortType}</Text>
                  <TouchableOpacity onPress={() => setSelectedResortType('')}>
                    <Text className="text-white text-xs font-bold">✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Rooms */}
              {selectedRooms && selectedRooms !== '' && (
                <View className="flex-row items-center bg-green-500 rounded-full px-3 py-1.5">
                  <Text className="text-xs text-white mr-2">{selectedRooms} Rooms</Text>
                  <TouchableOpacity onPress={() => setSelectedRooms('')}>
                    <Text className="text-white text-xs font-bold">✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Floors */}
              {selectedFloors && selectedFloors !== '' && (
                <View className="flex-row items-center bg-green-500 rounded-full px-3 py-1.5">
                  <Text className="text-xs text-white mr-2">{selectedFloors} Floors</Text>
                  <TouchableOpacity onPress={() => setSelectedFloors('')}>
                    <Text className="text-white text-xs font-bold">✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Budget */}
              {(budgetRange[0] !== 1 || budgetRange[1] !== 500) && (
                <View className="flex-row items-center bg-green-500 rounded-full px-3 py-1.5">
                  <Text className="text-xs text-white mr-2">₹{budgetRange[0]}-{budgetRange[1]}L</Text>
                  <TouchableOpacity onPress={() => setBudgetRange([1, 500])}>
                    <Text className="text-white text-xs font-bold">✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Land Area */}
              {(landAreaRange[0] !== 0 || landAreaRange[1] !== 10000) && (
                <View className="flex-row items-center bg-green-500 rounded-full px-3 py-1.5">
                  <Text className="text-xs text-white mr-2">Land: {landAreaRange[0]}-{landAreaRange[1]} sqft</Text>
                  <TouchableOpacity onPress={() => setLandAreaRange([0, 10000])}>
                    <Text className="text-white text-xs font-bold">✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Build Area */}
              {(buildAreaRange[0] !== 0 || buildAreaRange[1] !== 10000) && (
                <View className="flex-row items-center bg-green-500 rounded-full px-3 py-1.5">
                  <Text className="text-xs text-white mr-2">Build: {buildAreaRange[0]}-{buildAreaRange[1]} sqft</Text>
                  <TouchableOpacity onPress={() => setBuildAreaRange([0, 10000])}>
                    <Text className="text-white text-xs font-bold">✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Location Advantages */}
              {locAdvantages.length > 0 && (
                <View className="flex-row items-center bg-green-500 rounded-full px-3 py-1.5">
                  <Text className="text-xs text-white mr-2">{locAdvantages.length} Location</Text>
                  <TouchableOpacity onPress={() => setLocAdvantages([])}>
                    <Text className="text-white text-xs font-bold">✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Facing Directions */}
              {facingDirections.length > 0 && (
                <View className="flex-row items-center bg-green-500 rounded-full px-3 py-1.5">
                  <Text className="text-xs text-white mr-2">{facingDirections.join(', ')}</Text>
                  <TouchableOpacity onPress={() => setFacingDirections([])}>
                    <Text className="text-white text-xs font-bold">✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Quick Filters */}
              {quickFilters.length > 0 && (
                <View className="flex-row items-center bg-green-500 rounded-full px-3 py-1.5">
                  <Text className="text-xs text-white mr-2">{quickFilters.length} Quick</Text>
                  <TouchableOpacity onPress={() => setQuickFilters([])}>
                    <Text className="text-white text-xs font-bold">✕</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Main Content */}
      <View className="flex-1 flex-row">
        {/* Left Section */}
        <ScrollView 
          className="w-[40%] bg-gray-50 border-r border-gray-200"
          persistentScrollbar={true}
        >
          {filterCategories.map((category) => (
            <TouchableOpacity
              key={category.title}
              className={`py-3 px-2 border-l-2 ${
                activeSection === category.title
                  ? 'bg-white border-l-green-500'
                  : 'border-l-transparent'
              }`}
              onPress={() => {
                console.log('📂 Section Opened:', category.title);
                setActiveSection(category.title);
              }}
            >
              <Text
                className={`text-sm ${
                  activeSection === category.title
                    ? 'text-gray-800 font-semibold'
                    : 'text-gray-600'
                }`}
              >
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Right Section */}
        <ScrollView 
          className="w-[60%]"
          persistentScrollbar={true}
        >
          {renderRightSection()}
        </ScrollView>
      </View>

      {/* Footer */}
      <View className="flex-row px-4 py-3 border-t border-gray-200 gap-3">
        <TouchableOpacity
          className="flex-1 py-3.5 rounded-lg border border-green-500 items-center"
          onPress={() => {
            console.log('❌ Filter Cancelled');
            router.back();
          }}
        >
          <Text className="text-base text-green-500 font-semibold">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-[2] py-3.5 rounded-lg bg-green-500 items-center"
          onPress={handleApply}
        >
          <Text className="text-base text-white font-semibold">
            Apply
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FilterScreen;