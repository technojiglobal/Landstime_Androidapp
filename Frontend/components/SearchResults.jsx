// Frontend/components/SearchResults.jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../utils/imageHelper';

/**
 * SearchResults Component - Dropdown UI for search results
 * 
 * @param {boolean} visible - Show/hide dropdown
 * @param {string} searchQuery - Current search text
 * @param {object} results - Grouped results: { House: [...], Site: [...], Commercial: [...], Resort: [...] }
 * @param {boolean} loading - Show loading spinner
 * @param {array} recentSearches - Array of recent query strings
 * @param {function} onResultPress - Callback when result is clicked (propertyType, areaKey)
 * @param {function} onSeeAllPress - Callback when "See All" is clicked (propertyType, areaKey)
 * @param {function} onRecentSearchPress - Callback when recent search is clicked (query)
 * @param {function} onClose - Callback to close dropdown
 */
const SearchResults = ({
  visible,
  searchQuery,
  results = {},
  loading = false,
  recentSearches = [],
  onResultPress,
  onSeeAllPress,
  onRecentSearchPress,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!visible) return null;

  // Helper to get localized text
  const getLocalizedText = (field, language = 'en') => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[language] || field.en || field.te || field.hi || '';
  };

  // Helper to get property type translation key
  const getPropertyTypeKey = (type) => {
    const typeMap = {
      'House': 'search_results_houses',
      'House/Flat': 'search_results_houses',
      'Site/Plot/Land': 'search_results_sites',
      'Commercial': 'search_results_commercial',
      'Resort': 'search_results_resorts'
    };
    return typeMap[type] || type;
  };

  // Count total results
  const totalResults = Object.values(results).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  // Check if showing recent searches
  const showRecentSearches = !loading && !searchQuery && recentSearches.length > 0;

  // Check if showing results
  const showResults = !loading && searchQuery && totalResults > 0;

  // Check if showing no results
  const showNoResults = !loading && searchQuery && totalResults === 0;

  return (
    <View
      style={{
        position: 'absolute',
        top: 50, // Below search bar
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 12,
        maxHeight: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 1000,
        marginHorizontal: 16,
      }}
    >
      {/* ========== LOADING STATE ========== */}
      {loading && (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={{ marginTop: 12, color: '#6B7280', fontSize: 14 }}>
            {t('search_loading')}
          </Text>
        </View>
      )}

      {/* ========== RECENT SEARCHES ========== */}
      {showRecentSearches && (
        <View style={{ padding: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>
              {t('search_recent')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          
          {recentSearches.map((query, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onRecentSearchPress(query)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 8,
                borderBottomWidth: index < recentSearches.length - 1 ? 1 : 0,
                borderBottomColor: '#F3F4F6',
              }}
            >
              <Ionicons name="time-outline" size={18} color="#9CA3AF" style={{ marginRight: 12 }} />
              <Text style={{ flex: 1, fontSize: 14, color: '#374151' }}>{query}</Text>
              <Ionicons name="arrow-up-outline" size={16} color="#9CA3AF" style={{ transform: [{ rotate: '45deg' }] }} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ========== SEARCH RESULTS ========== */}
      {showResults && (
        <ScrollView
          style={{ maxHeight: 380 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12 }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, paddingBottom: 8 }}>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>
              {totalResults} {totalResults === 1 ? 'property' : 'properties'} found
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Group results by property type */}
          {Object.entries(results).map(([propertyType, properties]) => {
            if (!properties || properties.length === 0) return null;

            // Get first property's areaKey for navigation
            const firstProperty = properties[0];
            const areaKey = firstProperty?.areaKey || '';

            return (
              <View key={propertyType} style={{ marginBottom: 16 }}>
                {/* Group Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#22C55E' }}>
                    {t(getPropertyTypeKey(propertyType))} ({properties.length})
                  </Text>
                  {properties.length > 3 && (
                    <TouchableOpacity onPress={() => onSeeAllPress(propertyType, areaKey)}>
                      <Text style={{ fontSize: 12, color: '#22C55E', fontWeight: '600' }}>
                        {t('search_see_all')} →
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Show max 3 results per group */}
                {properties.slice(0, 3).map((property, index) => (
                  <TouchableOpacity
                    key={property._id}
                    onPress={() => onResultPress(propertyType, property.areaKey || areaKey)}
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderBottomWidth: index < Math.min(properties.length, 3) - 1 ? 1 : 0,
                      borderBottomColor: '#F3F4F6',
                    }}
                  >
                    {/* Property Image */}
                    <Image
                      source={
                        property.images && property.images.length > 0
                          ? { uri: getImageUrl(property.images[0]) }
                          : require('../assets/Flat1.jpg')
                      }
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 8,
                        marginRight: 12,
                      }}
                      resizeMode="cover"
                    />

                    {/* Property Details */}
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: 4,
                        }}
                        numberOfLines={1}
                      >
                        {getLocalizedText(property.propertyTitle, 'en')}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#6B7280',
                            marginLeft: 4,
                          }}
                          numberOfLines={1}
                        >
                          {getLocalizedText(property.area, 'en')}
                        </Text>
                      </View>
                    </View>

                    {/* Price */}
                    <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: '#22C55E',
                        }}
                      >
                        ₹{property.expectedPrice ? (property.expectedPrice / 100000).toFixed(0) + 'L' : 'N/A'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* ========== NO RESULTS ========== */}
      {showNoResults && (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={onClose}
            style={{ position: 'absolute', top: 12, right: 12 }}
          >
            <Ionicons name="close" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <Ionicons name="search-outline" size={48} color="#D1D5DB" />
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginTop: 16 }}>
            {t('search_no_results')}
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 8, textAlign: 'center' }}>
            {t('search_try_different')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default SearchResults;