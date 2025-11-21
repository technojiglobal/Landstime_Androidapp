import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';

const FilterScreen = () => {
  const router = useRouter();
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [budgetRange, setBudgetRange] = useState([7, 90]);
  const [isSizeExpanded, setIsSizeExpanded] = useState(false);
  const [isPossessionExpanded, setIsPossessionExpanded] = useState(null);
  const [builderSearchQuery, setBuilderSearchQuery] = useState('');
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [selectedSizeUnit, setSelectedSizeUnit] = useState('sq.ft');
  const [sizeRange, setSizeRange] = useState([0, 100]);

  const filterCategories = [
    {
      title: 'Quick Filters',
      options: [
        { label: 'Verified Properties', value: 'verified' },
        { label: 'New Launches', value: 'new_launches' },
        { label: 'Gated Society', value: 'gated_society' },
        { label: 'Zero Brokerage', value: 'zero_brokerage' },
        { label: 'With Photos', value: 'with_photos' },
      ],
      hasSelectAll: true,
    },
    {
      title: 'Budget',
      options: [],
      isSpecial: true,
    },
    {
      title: 'Property Type',
      options: [
        { label: 'Residential Apartment', value: 'residential_apartment' },
        { label: 'Residential Land', value: 'residential_land' },
        { label: 'Independent House/ Villa', value: 'independent_house_villa' },
        { label: 'Independent / Builder Floor', value: 'independent_builder' },
        { label: '1 RK / Studio Apartment', value: '1rk_studio_apartment'}
      ],
      hasSelectAll: true,
    },
    {
      title: 'BHK',
      options: [
        { label: '1 RK/1 BHK', value: '1bhk' },
        { label: '2 BHK', value: '2bhk' },
        { label: '3 BHK', value: '3bhk' },
        { label: '4 BHK', value: '4bhk' },
        { label: '4+ BHK', value: '4+bhk' },
      ],
      hasSelectAll: true,
    },
    {
      title: 'Bathrooms',
      options: [
        { label: '1 +', value: '1' },
        { label: '2 +', value: '2' },
        { label: '3 +', value: '3' },
        { label: '4 +', value: '4' },
        { label: '5 +', value: '5' },
      ],
      hasSelectAll: true,
    },
    {
      title: 'Size',
      options: [],
      isSpecial: true,
    },
    {
      title: 'Possession Status',
      options: [
        { 
          label: 'Ready to Move', 
          value: 'ready',
          subOptions: [
            { label: '0 - 1 Years', value: 'ready_0_1years' },
            { label: '3 - 6 Years', value: 'ready_3_6years' },
            { label: '6 - 12 Years', value: 'ready_6_12years' },
            { label: '10+ Years', value: 'ready_12years' },
          ]
        },
        { 
          label: 'Under Construction', 
          value: 'under_construction',
          subOptions: [
            { label: 'In 3 months', value: 'uc_3months' },
            { label: 'In 6 months', value: 'uc_6months' },
            { label: 'In 2025', value: 'uc_in_2025' },
            { label: 'In 2030', value: 'uc_in_2030' },
          ]
        },
      ],
      isDropdown: true,
    },
    {
      title: 'New Booking Resale',
      options: [
        { label: 'New Booking', value: 'new_booking' },
        { label: 'Resale', value: 'resale' },
      ],
      hasSelectAll: true,
    },
    {
      title: 'Amenities & Facilities',
      options: [
        { label: 'Parking', value: 'parking' },
        { label: 'Park', value: 'park' },
        { label: 'Vaastu Complaint', value: 'vaastu_complaint' },
        { label: 'Power Backup', value: 'power_backup' },
        { label: 'Gas Pipeline', value: 'gas_pipeline' },
        { label: 'Security Personal', value: 'security_personal' },
        { label: 'Club House', value: 'club_house' },
        { label: 'Gymnasium', value: 'gymnasium' },
        { label: 'Swimming Pool', value: 'pool' },
      ],
      hasSelectAll: true,
    },
    {
      title: 'Localities',
      options: [
        { label: 'Gajuwaka', value: 'gajuwaka' },
        { label: 'Madhurawada', value: 'madhurawada' },
        { label: 'Rushikonda', value: 'rushikonda' },
      ],
    },
    {
      title: 'Builders',
      options: [
        { label: 'Ramky Estates', value: 'ramky' },
        { label: 'My Home Group', value: 'myhome' },
        { label: 'Aparna Constructions', value: 'aparna' },
        { label: 'ATS Group', value: 'ats' },
        { label: 'Mahindra Lifespace', value: 'mahindra' },
        { label: 'Omaxe Builders', value: 'omaxe' },
        { label: 'Parsvnath Developers', value: 'parsvnath' },
        { label: 'Supertech Limited', value: 'supertech' },
        { label: 'Unitech Group', value: 'unitech' },
        { label: 'Sobha Limited', value: 'sobha' },
      ],
      hasSearch: true,
    },
    {
      title: 'Projects',
      options: [
        { label: 'Green Valley', value: 'green_valley' },
        { label: 'Ocean View', value: 'ocean_view' },
        { label: 'Sector 28 RWA', value: 'sector_28_rwa' },
        { label: 'Sector 26 RWA', value: 'sector_26_rwa' },
        { label: 'Sector 2 RWA', value: 'sector_2_rwa' },
        { label: 'Sector 50 RWA', value: 'sector_50_rwa' },
        { label: 'Sector 54 RWA', value: 'sector_54_rwa' },
        { label: 'Sector 5 RWA', value: 'sector_5_rwa' },
        { label: 'Sector 8 RWA', value: 'sector_8_rwa' },
      ],
      hasSearch: true,
    },
    {
      title: 'Floor Preference',
      options: [
        { label: 'Ground Floor', value: 'ground' },
        { label: 'Low Rise (1-4)', value: 'low_rise' },
        { label: 'Mid Rise (5-9)', value: 'mid_rise' },
        { label: 'High Rise (10+)', value: 'high_rise' },
      ],
    },
    {
      title: 'Facing Direction',
      options: [
        { label: 'North', value: 'north' },
        { label: 'South', value: 'south' },
        { label: 'East', value: 'east' },
        { label: 'West', value: 'west' },
        { label: 'North - West', value: 'north_west' },
        { label: 'North - East', value: 'north_east' },
        { label: 'South - East', value: 'south_east' },
        { label: 'South - West', value: 'south_west' },
      ],
      hasSelectAll: true,
    },
    {
      title: 'Property Features',
      options: [
        { label: 'Corner Property', value: 'corner_property' },
        { label: 'Park Facing', value: 'park_facing' },
        { label: 'Road Facing', value: 'road_facing' },
      ],
      hasSelectAll: true,
    },
    {
      title: 'Photos',
      options: [{ label: 'With Photos Only', value: 'photos_only' }],
    },
    {
      title: 'Videos',
      options: [{ label: 'With Videos Only', value: 'videos_only' }],
    },
    {
      title: 'Furnishing Status',
      options: [
        { label: 'Fully Furnished', value: 'fully_furnished' },
        { label: 'Semi Furnished', value: 'semi_furnished' },
        { label: 'Unfurnished', value: 'unfurnished' },
      ],
      hasSelectAll: true,
    },
    {
      title: 'RERA Approved',
      options: [
        { label: 'RERA Approved Properties', value: 'rera_approved_properties' },
        { label: 'RERA Registered Dealers', value: 'rera_registered_dealers' }
      ],
      hasSelectAll: true,
    },
  ];

  const toggleFilter = (value, label) => {
    const filterObj = { value, label };
    const exists = selectedFilters.find((f) => f.value === value);

    if (exists) {
      setSelectedFilters(selectedFilters.filter((f) => f.value !== value));
    } else {
      setSelectedFilters([...selectedFilters, filterObj]);
    }
  };

  const selectAllInCategory = (categoryTitle) => {
    const category = filterCategories.find((cat) => cat.title === categoryTitle);
    if (!category || !category.options.length) return;

    const allOptionsInCategory = category.options.map(opt => opt.value);
    const allSelected = allOptionsInCategory.every(val => 
      selectedFilters.find(f => f.value === val)
    );

    if (allSelected) {
      // Deselect all
      setSelectedFilters(selectedFilters.filter(f => 
        !allOptionsInCategory.includes(f.value)
      ));
    } else {
      // Select all
      const newFilters = category.options.filter(opt => 
        !selectedFilters.find(f => f.value === opt.value)
      ).map(opt => ({ value: opt.value, label: opt.label }));
      setSelectedFilters([...selectedFilters, ...newFilters]);
    }
  };

  const removeFilter = (value) => {
    setSelectedFilters(selectedFilters.filter((f) => f.value !== value));
  };

  const clearAll = () => {
    setSelectedFilters([]);
    setBudgetRange([7, 90]);
    setSizeRange([0, 100]);
    setSelectedSizeUnit('sq.ft');
    setActiveSection(null);
    setIsSizeExpanded(false);
    setIsPossessionExpanded(null);
    setBuilderSearchQuery('');
    setProjectSearchQuery('');
  };

  const handleApply = () => {
    router.back();
  };

  const renderRightSection = () => {
    // Budget Section
    if (activeSection === 'Budget') {
      return (
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-semibold text-gray-800">Budget Range</Text>
            <Text className="text-xs text-gray-500">INR - ₹</Text>
          </View>
          
          <View className="flex-row items-center justify-between mb-6">
            <View className="bg-green-50 border border-green-500 rounded-full px-5 py-2.5 min-w-[80px] items-center">
              <Text className="text-sm font-medium text-green-700">{budgetRange[0]} Cr</Text>
            </View>
            <Text className="text-sm text-gray-600 mx-3">to</Text>
            <View className="bg-green-50 border border-green-500 rounded-full px-5 py-2.5 min-w-[80px] items-center">
              <Text className="text-sm font-medium text-green-700">{budgetRange[1]} Cr</Text>
            </View>
          </View>

          <View className="mb-2">
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={100}
              value={budgetRange[0]}
              onValueChange={(val) => setBudgetRange([Math.round(val), budgetRange[1]])}
              minimumTrackTintColor="#22C55E"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#22C55E"
            />
            <View className="flex-row justify-between px-1">
              <Text className="text-xs text-gray-400">0</Text>
              <Text className="text-xs text-gray-400">100</Text>
            </View>
          </View>
        </View>
      );
    }

    // Size Section with Dropdown
    if (activeSection === 'Size') {
      const sizeUnits = [
        { label: 'sq.ft', value: 'sq.ft' },
        { label: 'sq.yards', value: 'sqyards' },
        { label: 'sq.meters', value: 'sqmeters' },
        { label: 'acres', value: 'acres' },
        { label: 'marla', value: 'marla' },
        { label: 'cents', value: 'cents' },
        { label: 'bigha', value: 'bigha' },
        { label: 'kottah', value: 'kottah' },
        { label: 'kanal', value: 'kanal' },
        { label: 'grounds', value: 'grounds' },
        { label: 'ares', value: 'ares' },
        { label: 'biswa', value: 'biswa' },
        { label: 'guntha', value: 'guntha' },
        { label: 'aankadam', value: 'aankadam' },
        { label: 'hectares', value: 'hectares' },
        { label: 'rood', value: 'rood' },
        { label: 'chataks', value: 'chataks' },
        { label: 'Perch', value: 'perch' },
      ];

      return (
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-semibold text-gray-800">Size</Text>
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={() => setIsSizeExpanded(!isSizeExpanded)}
            >
              <Text className="text-sm text-gray-600 mr-1">{selectedSizeUnit}</Text>
              <Text className="text-gray-400 text-lg">{isSizeExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>
          </View>

          {/* Unit Selection Dropdown */}
          {isSizeExpanded && (
            <View className="mb-4 bg-gray-50 rounded-lg p-2 max-h-48">
              <ScrollView>
                {sizeUnits.map((unit) => (
                  <TouchableOpacity
                    key={unit.value}
                    className="py-2 px-2"
                    onPress={() => {
                      setSelectedSizeUnit(unit.label);
                      setIsSizeExpanded(false);
                    }}
                  >
                    <Text className={`text-sm ${selectedSizeUnit === unit.label ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                      {unit.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Size Range Input Fields */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="bg-green-50 border border-green-500 rounded-full px-5 py-2.5 min-w-[80px] items-center">
              <Text className="text-sm font-medium text-green-700">{sizeRange[0]}</Text>
            </View>
            <Text className="text-sm text-gray-600 mx-3">to</Text>
            <View className="bg-green-50 border border-green-500 rounded-full px-5 py-2.5 min-w-[80px] items-center">
              <Text className="text-sm font-medium text-green-700">{sizeRange[1]}</Text>
            </View>
            <Text className="text-xs text-gray-500 ml-2">{selectedSizeUnit}</Text>
          </View>

          {/* Size Range Slider */}
          <View className="mb-2">
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={100}
              value={sizeRange[0]}
              onValueChange={(val) => setSizeRange([Math.round(val), sizeRange[1]])}
              minimumTrackTintColor="#22C55E"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#22C55E"
            />
            <View className="flex-row justify-between px-1">
              <Text className="text-xs text-gray-400">0</Text>
              <Text className="text-xs text-gray-400">100</Text>
            </View>
          </View>
        </View>
      );
    }

    // Possession Status Section with Nested Dropdowns
    if (activeSection === 'Possession Status') {
      const category = filterCategories.find((cat) => cat.title === 'Possession Status');
      return (
        <View className="p-4">
          <Text className="text-base font-semibold text-gray-800 mb-3">Possession Status</Text>
          
          {category.options.map((option) => {
            const isParentSelected = selectedFilters.find((f) => f.value === option.value);
            const isExpanded = isPossessionExpanded === option.value;
            
            return (
              <View key={option.value} className="mb-2">
                <TouchableOpacity
                  className="flex-row items-center justify-between py-3 border-b border-gray-100"
                  onPress={() => setIsPossessionExpanded(isExpanded ? null : option.value)}
                >
                  <View className="flex-row items-center flex-1">
                    <TouchableOpacity
                      onPress={() => toggleFilter(option.value, option.label)}
                      className="mr-3"
                    >
                      <View
                        className={`w-5 h-5 rounded border-2 justify-center items-center ${
                          isParentSelected ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}
                      >
                        {isParentSelected && (
                          <Text className="text-white text-xs font-bold">✓</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                    <Text className="text-sm text-gray-800">{option.label}</Text>
                  </View>
                  <Text className="text-gray-400 text-xl">{isExpanded ? '−' : '+'}</Text>
                </TouchableOpacity>
                
                {isExpanded && option.subOptions && (
                  <View className="ml-8 mt-2">
                    {option.subOptions.map((subOption) => {
                      const isSubSelected = selectedFilters.find((f) => f.value === subOption.value);
                      return (
                        <TouchableOpacity
                          key={subOption.value}
                          className="flex-row items-center py-2.5"
                          onPress={() => toggleFilter(subOption.value, subOption.label)}
                        >
                          <View
                            className={`w-4 h-4 rounded border-2 mr-3 justify-center items-center ${
                              isSubSelected ? 'bg-green-500 border-green-500' : 'border-gray-300'
                            }`}
                          >
                            {isSubSelected && (
                              <Text className="text-white text-[10px] font-bold">✓</Text>
                            )}
                          </View>
                          <Text className="text-xs text-gray-700">{subOption.label}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      );
    }

    // Default rendering for other sections with Select All
    const category = filterCategories.find((cat) => cat.title === activeSection);
    if (category && category.options.length > 0) {
      const allOptionsSelected = category.options.every(opt => 
        selectedFilters.find(f => f.value === opt.value)
      );

      // Filter options based on search query for Builders and Projects
      let filteredOptions = category.options;
      if (category.hasSearch) {
        const searchQuery = activeSection === 'Builders' ? builderSearchQuery : projectSearchQuery;
        filteredOptions = category.options.filter(opt =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return (
        <View className="p-4">
          <Text className="text-base font-bold text-gray-800 mb-4">{activeSection}</Text>
          
          {/* Search Bar for Builders and Projects */}
          {category.hasSearch && (
            <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
              <Search color="#9CA3AF" size={18} />
              <TextInput
                className="flex-1 ml-2 text-sm text-gray-800"
                placeholder={`Search ${activeSection}`}
                placeholderTextColor="#9CA3AF"
                value={activeSection === 'Builders' ? builderSearchQuery : projectSearchQuery}
                onChangeText={(text) => {
                  if (activeSection === 'Builders') {
                    setBuilderSearchQuery(text);
                  } else {
                    setProjectSearchQuery(text);
                  }
                }}
              />
            </View>
          )}

          {/* Options List */}
          {filteredOptions.map((option) => {
            const isSelected = selectedFilters.find((f) => f.value === option.value);
            return (
              <TouchableOpacity
                key={option.value}
                className="flex-row items-center py-3"
                onPress={() => toggleFilter(option.value, option.label)}
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

          {/* No Results Message */}
          {category.hasSearch && filteredOptions.length === 0 && (
            <Text className="text-sm text-gray-400 text-center py-4">
              No results found
            </Text>
          )}

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
        <TouchableOpacity onPress={() => router.back()}>
          <X color="black" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">
          Filters ({selectedFilters.length})
        </Text>
        <TouchableOpacity onPress={clearAll}>
          <Text className="text-sm text-green-500 font-semibold">Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Selected Filters Tags */}
      {selectedFilters.length > 0 && (
        <ScrollView
          horizontal
          persistentScrollbar={true}
          className="max-h-16 border-b border-gray-200"
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
        >
          {selectedFilters.map((filter) => (
            <View
              key={filter.value}
              className="flex-row items-center bg-green-50 rounded-full px-3 py-1.5 mr-2 border border-green-500"
            >
              <Text className="text-xs text-green-500 mr-1.5 font-medium">{filter.label}</Text>
              <TouchableOpacity onPress={() => removeFilter(filter.value)}>
                <X color="#22C55E" size={16} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Main Content */}
      <View className="flex-1 flex-row">
        {/* Left Section - 40% width */}
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
              onPress={() => setActiveSection(category.title)}
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

        {/* Right Section - 60% width */}
        <ScrollView 
          className="w-[60%]"
          persistentScrollbar={true}
        >
          {renderRightSection()}
        </ScrollView>
      </View>

      {/* Footer Buttons */}
      <View className="flex-row px-4 py-3 border-t border-gray-200 gap-3">
        <TouchableOpacity
          className="flex-1 py-3.5 rounded-lg border border-green-500 items-center"
          onPress={() => router.back()}
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