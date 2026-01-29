


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
  
  const existingFilters = currentFilters ? JSON.parse(currentFilters) : {};
  console.log('✅ Parsed Existing Filters:', existingFilters);
  
  // ✅ COMMON STATES
  const [selectedFilters, setSelectedFilters] = useState(existingFilters.selected || []);
  const [activeSection, setActiveSection] = useState(null);
  const [budgetRange, setBudgetRange] = useState(existingFilters.budgetRange || [1, 500]);
  
  // ✅ HOUSE/FLAT SPECIFIC STATES
  const [selectedBedrooms, setSelectedBedrooms] = useState(existingFilters.bedrooms || '');
  const [selectedBathrooms, setSelectedBathrooms] = useState(existingFilters.bathrooms || '');
  const [selectedBalconies, setSelectedBalconies] = useState(existingFilters.balconies || '');
  const [selectedFloors, setSelectedFloors] = useState(existingFilters.floors || '');
  const [areaRange, setAreaRange] = useState(existingFilters.areaRange || [0, 10000]); // sqft
  const [selectedFurnishing, setSelectedFurnishing] = useState(existingFilters.furnishing || '');
  const [selectedAgeOfProperty, setSelectedAgeOfProperty] = useState(existingFilters.ageOfProperty || '');
  const [selectedOtherRooms, setSelectedOtherRooms] = useState(existingFilters.otherRooms || []);
  const [selectedAvailability, setSelectedAvailability] = useState(existingFilters.availabilityStatus || '');
  
  // ✅ RESORT SPECIFIC STATES
  const [selectedResortType, setSelectedResortType] = useState(existingFilters.resortType || '');
  const [resortTypeOpen, setResortTypeOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState(existingFilters.rooms || '');
  const [landAreaRange, setLandAreaRange] = useState(existingFilters.landAreaRange || [0, 10000]);
  const [buildAreaRange, setBuildAreaRange] = useState(existingFilters.buildAreaRange || [0, 10000]);
  
  // ✅ MULTI-SELECT FILTERS (common)
  const [locAdvantages, setLocAdvantages] = useState(existingFilters.locAdvantages || []);
  const [quickFilters, setQuickFilters] = useState(existingFilters.quickFilters || []);
  const [facingDirections, setFacingDirections] = useState(existingFilters.facingDirections || []);

  // ✅ HOUSE/FLAT OPTIONS
  const BEDROOMS_OPTIONS = [
    { label: 'Any', value: 'any' },
    { label: '1 BHK', value: '1' },
    { label: '2 BHK', value: '2' },
    { label: '3 BHK', value: '3' },
    { label: '4 BHK', value: '4' },
    { label: '5+ BHK', value: '5+' },
  ];

  const BATHROOMS_OPTIONS = [
    { label: 'Any', value: 'any' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4+', value: '4+' },
  ];

  const BALCONIES_OPTIONS = [
    { label: 'Any', value: 'any' },
    { label: '0', value: '0' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3+', value: '3+' },
  ];

  const FLOORS_OPTIONS = [
    { label: 'Any', value: 'any' },
    { label: '1 Floor', value: '1' },
    { label: '2 Floors', value: '2' },
    { label: '3 Floors', value: '3' },
    { label: '4+ Floors', value: '4+' },
  ];

  const FURNISHING_OPTIONS = [
    { label: 'Any', value: 'any' },
    { label: t("furnished"), value: 'Furnished' },
    { label: t("semi_furnished"), value: 'Semi-furnished' },
    { label: t("unfurnished"), value: 'Unfurnished' },
  ];

  const AGE_OF_PROPERTY_OPTIONS = [
    { label: 'Any', value: 'any' },
    { label: t("0_1_years"), value: '0-1 years' },
    { label: t("1_5_years"), value: '1-5 years' },
    { label: t("5_10_years"), value: '5-10 years' },
    { label: t("10_years"), value: '10+ years' },
  ];

  const OTHER_ROOMS_OPTIONS = [
    { label: t("pooja_room"), value: 'Pooja Room' },
    { label: t("study_room"), value: 'Study Room' },
    { label: t("servant_room"), value: 'Servant Room' },
    { label: t("others"), value: 'Others' },
  ];

  const AVAILABILITY_OPTIONS = [
    { label: 'Any', value: 'any' },
    { label: 'Ready to Move', value: 'Ready to Move' },
    { label: 'Under Construction', value: 'Under Construction' },
  ];

  // ✅ RESORT TYPES
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

  const ROOMS_OPTIONS = [
    { label: 'Any', value: 'any' },
    { label: '1-5 Rooms', value: '1-5' },
    { label: '5-10 Rooms', value: '5-10' },
    { label: '10-20 Rooms', value: '10-20' },
    { label: '20+ Rooms', value: '20+' },
  ];

  // ✅ COMMON OPTIONS
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

  const QUICK_FILTERS = [
    { label: 'Verified Properties', value: 'verified' },
    { label: 'With Photos', value: 'with_photos' },
    { label: 'With Videos', value: 'with_videos' },
  ];

  // ✅ DYNAMIC FILTER CATEGORIES BASED ON PROPERTY TYPE
  const getFilterCategories = () => {
    const commonCategories = [
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
    ];

    if (propertyType === 'House' || propertyType === 'House/Flat') {
      return [
        ...commonCategories,
        {
          title: 'Bedrooms',
          options: BEDROOMS_OPTIONS,
          isSingle: true,
        },
        {
          title: 'Bathrooms',
          options: BATHROOMS_OPTIONS,
          isSingle: true,
        },
        {
          title: 'Balconies',
          options: BALCONIES_OPTIONS,
          isSingle: true,
        },
        {
          title: 'Floors',
          options: FLOORS_OPTIONS,
          isSingle: true,
        },
        {
          title: 'Area (sqft)',
          options: [],
          isSpecial: true,
        },
        {
          title: 'Furnishing',
          options: FURNISHING_OPTIONS,
          isSingle: true,
        },
        {
          title: 'Age of Property',
          options: AGE_OF_PROPERTY_OPTIONS,
          isSingle: true,
        },
        {
          title: 'Availability Status',
          options: AVAILABILITY_OPTIONS,
          isSingle: true,
        },
        {
          title: 'Other Rooms',
          options: OTHER_ROOMS_OPTIONS,
          hasSelectAll: true,
        },
        {
          title: 'Location Advantages',
          options: LOCATION_ADVANTAGES,
          hasSelectAll: true,
        },
        {
          title: 'Facing Direction',
          options: FACING_DIRECTIONS,
          hasSelectAll: true,
        },
      ];
    }

    if (propertyType === 'Resort') {
      return [
        ...commonCategories,
        {
          title: 'Resort Type',
          options: [],
          isSpecial: true,
        },
        {
          title: 'Rooms',
          options: ROOMS_OPTIONS,
          isSingle: true,
        },
        {
          title: 'Floors',
          options: FLOORS_OPTIONS,
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
        {
          title: 'Location Advantages',
          options: LOCATION_ADVANTAGES,
          hasSelectAll: true,
        },
        {
          title: 'Facing Direction',
          options: FACING_DIRECTIONS,
          hasSelectAll: true,
        },
      ];
    }

    // Default for other types
    return commonCategories;
  };

  const filterCategories = getFilterCategories();

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
      'Other Rooms': [selectedOtherRooms, setSelectedOtherRooms],
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
    
    setSelectedFilters([]);
    setBudgetRange([1, 500]);
    
    // House/Flat specific
    setSelectedBedrooms('');
    setSelectedBathrooms('');
    setSelectedBalconies('');
    setSelectedFloors('');
    setAreaRange([0, 10000]);
    setSelectedFurnishing('');
    setSelectedAgeOfProperty('');
    setSelectedOtherRooms([]);
    setSelectedAvailability('');
    
    // Resort specific
    setSelectedResortType('');
    setSelectedRooms('');
    setLandAreaRange([0, 10000]);
    setBuildAreaRange([0, 10000]);
    
    // Common
    setLocAdvantages([]);
    setQuickFilters([]);
    setFacingDirections([]);
    setActiveSection(null);
    
    console.log('✅ All filters cleared');
  };

  const handleApply = () => {
    console.log('✅ Applying Filters...');
    
    const filters = {};
    
    // Budget
    if (budgetRange[0] !== 1 || budgetRange[1] !== 500) {
      filters.budgetRange = budgetRange;
    }
    
    // House/Flat specific filters
    if (propertyType === 'House' || propertyType === 'House/Flat') {
      if (selectedBedrooms && selectedBedrooms !== '' && selectedBedrooms !== 'any') {
        filters.bedrooms = selectedBedrooms;
      }
      
      if (selectedBathrooms && selectedBathrooms !== '' && selectedBathrooms !== 'any') {
        filters.bathrooms = selectedBathrooms;
      }
      
      if (selectedBalconies && selectedBalconies !== '' && selectedBalconies !== 'any') {
        filters.balconies = selectedBalconies;
      }
      
      if (selectedFloors && selectedFloors !== '' && selectedFloors !== 'any') {
        filters.floors = selectedFloors;
      }
      
      if (areaRange[0] !== 0 || areaRange[1] !== 10000) {
        filters.areaRange = areaRange;
      }
      
      if (selectedFurnishing && selectedFurnishing !== '' && selectedFurnishing !== 'any') {
        filters.furnishing = selectedFurnishing;
      }
      
      if (selectedAgeOfProperty && selectedAgeOfProperty !== '' && selectedAgeOfProperty !== 'any') {
        filters.ageOfProperty = selectedAgeOfProperty;
      }
      
      if (selectedAvailability && selectedAvailability !== '' && selectedAvailability !== 'any') {
        filters.availabilityStatus = selectedAvailability;
      }
      
      if (selectedOtherRooms.length > 0) {
        filters.otherRooms = selectedOtherRooms;
      }
    }
    
    // Resort specific filters
    if (propertyType === 'Resort') {
      if (selectedResortType && selectedResortType !== '') {
        filters.resortType = selectedResortType;
      }
      
      if (selectedRooms && selectedRooms !== '' && selectedRooms !== 'any') {
        filters.rooms = selectedRooms;
      }
      
      if (landAreaRange[0] !== 0 || landAreaRange[1] !== 10000) {
        filters.landAreaRange = landAreaRange;
      }
      
      if (buildAreaRange[0] !== 0 || buildAreaRange[1] !== 10000) {
        filters.buildAreaRange = buildAreaRange;
      }
    }
    
    // Common filters
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

    router.back();
    
    setTimeout(() => {
      if (router.canGoBack()) {
        router.setParams({ appliedFilters: JSON.stringify(filters) });
        console.log('✅ Filters sent back to PropertyDetails');
      }
    }, 100);
  };

  const renderRightSection = () => {
    // ✅ BUDGET SECTION
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

    // ✅ AREA SECTION (for House/Flat)
    if (activeSection === 'Area (sqft)') {
      return (
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-semibold text-gray-800">Area</Text>
            <Text className="text-xs text-gray-500">Square Feet (sqft)</Text>
          </View>
          
          <View className="flex-row items-center justify-between mb-6">
            <View className="bg-green-50 border border-green-500 rounded-full px-5 py-2.5 min-w-[80px] items-center">
              <Text className="text-sm font-medium text-green-700">{areaRange[0]}</Text>
            </View>
            <Text className="text-sm text-gray-600 mx-3">to</Text>
            <View className="bg-green-50 border border-green-500 rounded-full px-5 py-2.5 min-w-[80px] items-center">
              <Text className="text-sm font-medium text-green-700">{areaRange[1]}</Text>
            </View>
          </View>

          <View className="mb-2">
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={10000}
              step={100}
              value={areaRange[0]}
              onValueChange={(val) => {
                const newRange = [Math.round(val), areaRange[1]];
                setAreaRange(newRange);
              }}
              minimumTrackTintColor="#22C55E"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#22C55E"
            />
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={areaRange[0]}
              maximumValue={10000}
              step={100}
              value={areaRange[1]}
              onValueChange={(val) => {
                const newRange = [areaRange[0], Math.round(val)];
                setAreaRange(newRange);
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

    // ✅ LAND AREA SECTION (for Resort)
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

    // ✅ BUILD AREA SECTION (for Resort)
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
                (activeSection === 'Bedrooms' && selectedBedrooms === option.value) ||
                (activeSection === 'Bathrooms' && selectedBathrooms === option.value) ||
                (activeSection === 'Balconies' && selectedBalconies === option.value) ||
                (activeSection === 'Floors' && selectedFloors === option.value) ||
                (activeSection === 'Furnishing' && selectedFurnishing === option.value) ||
                (activeSection === 'Age of Property' && selectedAgeOfProperty === option.value) ||
                (activeSection === 'Availability Status' && selectedAvailability === option.value) ||
                (activeSection === 'Rooms' && selectedRooms === option.value);
              
              return (
                <TouchableOpacity
                  key={option.value}
                  className="flex-row items-center py-3"
                  onPress={() => {
                    if (activeSection === 'Bedrooms') {
                      setSelectedBedrooms(option.value === 'any' ? '' : option.value);
                    } else if (activeSection === 'Bathrooms') {
                      setSelectedBathrooms(option.value === 'any' ? '' : option.value);
                    } else if (activeSection === 'Balconies') {
                      setSelectedBalconies(option.value === 'any' ? '' : option.value);
                    } else if (activeSection === 'Floors') {
                      setSelectedFloors(option.value === 'any' ? '' : option.value);
                    } else if (activeSection === 'Furnishing') {
                      setSelectedFurnishing(option.value === 'any' ? '' : option.value);
                    } else if (activeSection === 'Age of Property') {
                      setSelectedAgeOfProperty(option.value === 'any' ? '' : option.value);
                    } else if (activeSection === 'Availability Status') {
                      setSelectedAvailability(option.value === 'any' ? '' : option.value);
                    } else if (activeSection === 'Rooms') {
                      setSelectedRooms(option.value === 'any' ? '' : option.value);
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
              'Other Rooms': selectedOtherRooms,
            };

            const setterMap = {
              'Location Advantages': setLocAdvantages,
              'Facing Direction': setFacingDirections,
              'Quick Filters': setQuickFilters,
              'Other Rooms': setSelectedOtherRooms,
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

  // ✅ GET ACTIVE FILTER CHIPS
  const getActiveFilterChips = () => {
    const chips = [];

    // Budget
    if (budgetRange[0] !== 1 || budgetRange[1] !== 500) {
      chips.push({
        label: `₹${budgetRange[0]}-${budgetRange[1]}L`,
        onClear: () => setBudgetRange([1, 500]),
      });
    }

    // House/Flat filters
    if (propertyType === 'House' || propertyType === 'House/Flat') {
      if (selectedBedrooms && selectedBedrooms !== 'any') {
        chips.push({
          label: `${selectedBedrooms} BHK`,
          onClear: () => setSelectedBedrooms(''),
        });
      }

      if (selectedBathrooms && selectedBathrooms !== 'any') {
        chips.push({
          label: `${selectedBathrooms} Bath`,
          onClear: () => setSelectedBathrooms(''),
        });
      }

      if (selectedBalconies && selectedBalconies !== 'any') {
        chips.push({
          label: `${selectedBalconies} Balcony`,
          onClear: () => setSelectedBalconies(''),
        });
      }

      if (selectedFloors && selectedFloors !== 'any') {
        chips.push({
          label: `${selectedFloors} Floors`,
          onClear: () => setSelectedFloors(''),
        });
      }

      if (areaRange[0] !== 0 || areaRange[1] !== 10000) {
        chips.push({
          label: `${areaRange[0]}-${areaRange[1]} sqft`,
          onClear: () => setAreaRange([0, 10000]),
        });
      }

      if (selectedFurnishing && selectedFurnishing !== 'any') {
        chips.push({
          label: selectedFurnishing,
          onClear: () => setSelectedFurnishing(''),
        });
      }

      if (selectedAgeOfProperty && selectedAgeOfProperty !== 'any') {
        chips.push({
          label: selectedAgeOfProperty,
          onClear: () => setSelectedAgeOfProperty(''),
        });
      }

      if (selectedAvailability && selectedAvailability !== 'any') {
        chips.push({
          label: selectedAvailability,
          onClear: () => setSelectedAvailability(''),
        });
      }

      if (selectedOtherRooms.length > 0) {
        chips.push({
          label: `${selectedOtherRooms.length} Other Rooms`,
          onClear: () => setSelectedOtherRooms([]),
        });
      }
    }

    // Resort filters
    if (propertyType === 'Resort') {
      if (selectedResortType) {
        chips.push({
          label: selectedResortType,
          onClear: () => setSelectedResortType(''),
        });
      }

      if (selectedRooms && selectedRooms !== 'any') {
        chips.push({
          label: `${selectedRooms} Rooms`,
          onClear: () => setSelectedRooms(''),
        });
      }

      if (landAreaRange[0] !== 0 || landAreaRange[1] !== 10000) {
        chips.push({
          label: `Land: ${landAreaRange[0]}-${landAreaRange[1]} sqft`,
          onClear: () => setLandAreaRange([0, 10000]),
        });
      }

      if (buildAreaRange[0] !== 0 || buildAreaRange[1] !== 10000) {
        chips.push({
          label: `Build: ${buildAreaRange[0]}-${buildAreaRange[1]} sqft`,
          onClear: () => setBuildAreaRange([0, 10000]),
        });
      }
    }

    // Common filters
    if (locAdvantages.length > 0) {
      chips.push({
        label: `${locAdvantages.length} Location`,
        onClear: () => setLocAdvantages([]),
      });
    }

    if (facingDirections.length > 0) {
      chips.push({
        label: facingDirections.join(', '),
        onClear: () => setFacingDirections([]),
      });
    }

    if (quickFilters.length > 0) {
      chips.push({
        label: `${quickFilters.length} Quick`,
        onClear: () => setQuickFilters([]),
      });
    }

    return chips;
  };

  const activeChips = getActiveFilterChips();

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
      
      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
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
              {activeChips.map((chip, index) => (
                <View key={index} className="flex-row items-center bg-green-500 rounded-full px-3 py-1.5">
                  <Text className="text-xs text-white mr-2">{chip.label}</Text>
                  <TouchableOpacity onPress={chip.onClear}>
                    <Text className="text-white text-xs font-bold">✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
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