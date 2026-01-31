// Frontend/components/SimilarProperties.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { getSimilarProperties } from '../utils/propertyApi';
import { getImageUrl } from '../utils/imageHelper';
import i18n from '../i18n/index';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ✅ Helper function to get localized text
const getLocalizedText = (field, language) => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[language] || field.en || field.te || field.hi || '';
};

export default function SimilarProperties({ propertyId, currentPropertyType }) {
  const router = useRouter();
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentLanguage = i18n.language || 'en';

  useEffect(() => {
    if (propertyId) {
      fetchSimilarProperties();
    }
  }, [propertyId]);

  const fetchSimilarProperties = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching similar properties for:', propertyId);
      
      const result = await getSimilarProperties(propertyId);
      
      if (result.success && result.data) {
        console.log('✅ Similar properties loaded:', result.data.length);
        setSimilarProperties(result.data);
      } else {
        console.log('❌ No similar properties found');
        setSimilarProperties([]);
      }
    } catch (error) {
      console.error('❌ Error fetching similar properties:', error);
      setSimilarProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyPress = (property) => {
    console.log('🔄 Navigating to property:', property._id);
    
    // Determine the correct route based on property type
    let pathname = '';
    
    switch (property.propertyType) {
      case 'House':
      case 'House/Flat':
        pathname = '/home/screens/Flats/(Property)';
        break;
      case 'Site/Plot/Land':
        pathname = '/home/screens/Sites/(Property)';
        break;
      case 'Resort':
        pathname = '/home/screens/Resorts/(Property)';
        break;
      case 'Commercial':
        pathname = '/home/screens/Commercial/(Property)';
        break;
      default:
        pathname = '/home/screens/Flats/(Property)';
    }
    
    router.push({
      pathname,
      params: {
        propertyId: property._id,
        areaKey: property.areaKey,
        propertyData: JSON.stringify(property)
      }
    });
  };

  // Don't show section if no properties
  if (!loading && similarProperties.length === 0) {
    return null;
  }

  return (
    <View style={{ marginTop: 16 }}>
      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#1F2937',
            fontFamily: 'Poppins'
          }}
        >
          Similar Properties
        </Text>
      </View>

      {loading ? (
        <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          snapToInterval={SCREEN_WIDTH * 0.7 + 14}
          decelerationRate="fast"
        >
          {similarProperties.map((property) => {
            const propertyTitle = getLocalizedText(property.propertyTitle, currentLanguage);
            const location = getLocalizedText(property.location, currentLanguage);
            const area = getLocalizedText(property.area, currentLanguage);
            
            return (
              <TouchableOpacity
                key={property._id}
                onPress={() => handlePropertyPress(property)}
                activeOpacity={0.8}
                style={{
                  width: SCREEN_WIDTH * 0.7,
                  height: 280,
                  backgroundColor: 'white',
                  borderRadius: 16,
                  marginRight: 14,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                  overflow: 'hidden'
                }}
              >
                {/* Property Image */}
                <View style={{ width: '100%', height: 160, position: 'relative' }}>
                  <Image
                    source={
                      property.images && property.images.length > 0
                        ? { uri: getImageUrl(property.images[0]) }
                        : require('../assets/Flat1.jpg')
                    }
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                  
                  {/* Price Badge */}
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      backgroundColor: 'white',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 2,
                      elevation: 2
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: '#1F2937',
                        fontFamily: 'Poppins'
                      }}
                    >
                      ₹{property.expectedPrice ? (property.expectedPrice / 100000).toFixed(0) + 'L' : 'N/A'}
                    </Text>
                  </View>
                </View>

                {/* Property Info */}
                <View style={{ padding: 12 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: '#16A34A',
                      fontFamily: 'Poppins',
                      marginBottom: 4
                    }}
                    numberOfLines={1}
                  >
                    {propertyTitle || 'Property'}
                  </Text>
                  
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#6B7280',
                      fontFamily: 'Poppins',
                      marginBottom: 4
                    }}
                    numberOfLines={1}
                  >
                    {area || location || 'Location'}
                  </Text>
                  
                  {/* Property Type Badge */}
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      backgroundColor: '#F0FDF4',
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 6,
                      marginTop: 4
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        color: '#16A34A',
                        fontFamily: 'Poppins',
                        fontWeight: '500'
                      }}
                    >
                      {property.propertyType}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}