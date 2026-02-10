// Frontend/utils/searchHelper.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ KEYWORD DICTIONARY - Multi-language support
const KEYWORDS = {
  // Property Types
  propertyTypes: {
    house: ['house', 'flat', 'home', 'bhk', 'apartment', 'villa', 'ఇల్లు', 'ఫ్లాట్', 'घर', 'फ्लैट'],
    site: ['site', 'plot', 'land', 'స్థలం', 'ప్లాట్', 'भूमि', 'प्लॉट'],
    commercial: ['commercial', 'office', 'shop', 'retail', 'store', 'వాణిజ్య', 'ఆఫీస్', 'व्यावसायिक', 'दुकान'],
    resort: ['resort', 'hotel', 'రిసార్ట్', 'హోటల్', 'रिसॉर्ट', 'होटल']
  },
  
  // Bedrooms
  bedrooms: {
    '1': ['1bhk', '1 bhk', 'single bedroom', 'one bedroom', '1 bed', 'ఒక బెడ్‌రూమ్', 'एक बेडरूम'],
    '2': ['2bhk', '2 bhk', 'double bedroom', 'two bedroom', '2 bed', 'రెండు బెడ్‌రూమ్', 'दो बेडरूम'],
    '3': ['3bhk', '3 bhk', 'three bedroom', '3 bed', 'మూడు బెడ్‌రూమ్', 'तीन बेडरूम'],
    '4': ['4bhk', '4 bhk', 'four bedroom', '4 bed', 'నాలుగు బెడ్‌రూమ్', 'चार बेडरूम']
  },
  
  // Furnishing
  furnishing: {
    'Furnished': ['furnished', 'అమర్చబడినది', 'सुसज्जित'],
    'Semi-furnished': ['semi-furnished', 'semi furnished', 'పాక్షిక', 'अर्ध-सुसज्जित'],
    'Unfurnished': ['unfurnished', 'అమర్చబడనిది', 'असुसज्जित']
  },
  
  // Status
  status: {
    'Ready to Move': ['ready', 'ready to move', 'రెడీ', 'तैयार'],
    'Under Construction': ['under construction', 'construction', 'నిర్మాణంలో', 'निर्माणाधीन']
  }
};

// ✅ AREA KEYWORD MAPPING (matches your backend areaKey normalization)
const AREA_KEYWORDS = {
  'akkayapalem': ['akkayapalem', 'అక్కయ్యపాలెం', 'अक्कय्यपालेम'],
  'anandapuram': ['anandapuram', 'ఆనందపురం', 'आनंदपुरम'],
  'boyapalem': ['boyapalem', 'బోయపాలెం', 'बोयपालेम'],
  'chinnagadili': ['chinnagadili', 'చిన్నగడిలి', 'चिन्नगदिली'],
  'dwarkanagar': ['dwarkanagar', 'ద్వారకానగర్', 'द्वारकानगर'],
  'gajuwaka': ['gajuwaka', 'గాజువాక', 'गाजुवाका'],
  'kommadi': ['kommadi', 'కొమ్మడి', 'कोम्मडी']
};

/**
 * Parse search query and extract property type, bedrooms, area, etc.
 * @param {string} query - User search query
 * @param {string} language - Current language (en/te/hi)
 * @returns {object} - Parsed query with propertyType, bedrooms, areaKey, etc.
 */
export const parseSearchQuery = (query, language = 'en') => {
  if (!query || typeof query !== 'string') return {};
  
  const lowerQuery = query.toLowerCase().trim();
  const result = {};
  
  console.log('🔍 Parsing query:', lowerQuery);
  
  // ✅ STEP 1: Detect Property Type
  for (const [type, keywords] of Object.entries(KEYWORDS.propertyTypes)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()))) {
      switch(type) {
        case 'house':
          result.propertyType = 'House';
          result.route = '/home/screens/Flats/PropertyDetails';
          break;
        case 'site':
          result.propertyType = 'Site/Plot/Land';
          result.route = '/home/screens/Sites/PropertyDetails';
          break;
        case 'commercial':
          result.propertyType = 'Commercial';
          result.route = '/home/screens/Commercial/PropertyDetails';
          break;
        case 'resort':
          result.propertyType = 'Resort';
          result.route = '/home/screens/Resorts/PropertyDetails';
          break;
      }
      console.log('✅ Property type detected:', result.propertyType);
      break;
    }
  }
  
  // ✅ STEP 2: Detect Bedrooms (for houses only)
  if (result.propertyType === 'House') {
    for (const [count, keywords] of Object.entries(KEYWORDS.bedrooms)) {
      if (keywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()))) {
        result.bedrooms = parseInt(count);
        console.log('✅ Bedrooms detected:', result.bedrooms);
        break;
      }
    }
  }
  
  // ✅ STEP 3: Detect Area/Location
  for (const [areaKey, keywords] of Object.entries(AREA_KEYWORDS)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()))) {
      result.areaKey = areaKey;
      console.log('✅ Area detected:', result.areaKey);
      break;
    }
  }
  
  // ✅ STEP 4: Detect Furnishing (for houses)
  if (result.propertyType === 'House') {
    for (const [type, keywords] of Object.entries(KEYWORDS.furnishing)) {
      if (keywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()))) {
        result.furnishing = type;
        console.log('✅ Furnishing detected:', result.furnishing);
        break;
      }
    }
  }
  
  console.log('📋 Final parsed result:', result);
  return result;
};

/**
 * Get search suggestions while typing (not yet implemented - placeholder)
 * @param {string} query - Current search text
 * @param {array} allProperties - All properties (for local filtering)
 * @returns {array} - Suggested queries
 */
export const getSearchSuggestions = (query, allProperties = []) => {
  // Placeholder for future implementation
  return [];
};

/**
 * Save search query to history (max 5 recent searches)
 * @param {string} query - Search query to save
 */
export const saveSearchHistory = async (query) => {
  try {
    if (!query || query.trim().length < 2) return;
    
    const existing = await AsyncStorage.getItem('searchHistory');
    let history = existing ? JSON.parse(existing) : [];
    
    // Remove duplicate if exists
    history = history.filter(item => item !== query);
    
    // Add to beginning
    history.unshift(query);
    
    // Keep only last 5
    history = history.slice(0, 5);
    
    await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
    console.log('💾 Search history saved:', history);
  } catch (error) {
    console.error('❌ Error saving search history:', error);
  }
};

/**
 * Get search history from AsyncStorage
 * @returns {array} - Array of recent search queries (max 5)
 */
export const getSearchHistory = async () => {
  try {
    const existing = await AsyncStorage.getItem('searchHistory');
    const history = existing ? JSON.parse(existing) : [];
    console.log('📜 Search history retrieved:', history);
    return history;
  } catch (error) {
    console.error('❌ Error getting search history:', error);
    return [];
  }
};

/**
 * Clear all search history
 */
export const clearSearchHistory = async () => {
  try {
    await AsyncStorage.removeItem('searchHistory');
    console.log('🗑️ Search history cleared');
  } catch (error) {
    console.error('❌ Error clearing search history:', error);
  }
};

/**
 * In-memory cache for search results (max 20 queries)
 */
const searchCache = new Map();
const MAX_CACHE_SIZE = 20;

/**
 * Cache search results in memory
 * @param {string} query - Search query
 * @param {object} results - Search results
 */
export const cacheSearchResults = (query, results) => {
  if (!query) return;
  
  // Remove oldest entry if cache is full
  if (searchCache.size >= MAX_CACHE_SIZE) {
    const firstKey = searchCache.keys().next().value;
    searchCache.delete(firstKey);
  }
  
  searchCache.set(query.toLowerCase().trim(), {
    results,
    timestamp: Date.now()
  });
  
  console.log('💾 Search results cached for:', query);
};

/**
 * Get cached search results
 * @param {string} query - Search query
 * @returns {object|null} - Cached results or null
 */
export const getCachedResults = (query) => {
  if (!query) return null;
  
  const cached = searchCache.get(query.toLowerCase().trim());
  
  if (!cached) return null;
  
  // Cache expires after 5 minutes
  const isExpired = (Date.now() - cached.timestamp) > (5 * 60 * 1000);
  
  if (isExpired) {
    searchCache.delete(query.toLowerCase().trim());
    return null;
  }
  
  console.log('✅ Using cached results for:', query);
  return cached.results;
};

/**
 * Clear search cache
 */
export const clearSearchCache = () => {
  searchCache.clear();
  console.log('🗑️ Search cache cleared');
};