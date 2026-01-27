// components/LocationPicker.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { getGoogleMapsApiKey } from '../utils/googleMapsApi';
import { extractAddressComponents } from '../utils/googleMapsConfig';

const LocationPicker = ({ visible, onClose, onLocationSelect, initialLocation }) => {
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [addressDetails, setAddressDetails] = useState(null);
  const webViewRef = useRef(null);

  const defaultCenter = initialLocation || { lat: 12.9716, lng: 77.5946 };

  useEffect(() => {
    if (visible && !apiKey) {
      loadApiKey();
    }
  }, [visible]);

  const loadApiKey = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🗺️  Loading Google Maps API key...');
      
      const key = await getGoogleMapsApiKey();
      setApiKey(key);
      console.log('✅ API key loaded successfully');
    } catch (err) {
      console.error('❌ Failed to load API key:', err);
      setError(err.message || 'Failed to load maps');
      Alert.alert('Maps Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const mapHTML = apiKey ? `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; }
        body, html { height: 100%; width: 100%; }
        #map { height: 100%; width: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      
      <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places"></script>
      <script>
        let map, marker, geocoder;
        
        function initMap() {
          const center = { lat: ${defaultCenter.lat}, lng: ${defaultCenter.lng} };
          
          map = new google.maps.Map(document.getElementById('map'), {
            center: center,
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          });
          
          geocoder = new google.maps.Geocoder();
          
          marker = new google.maps.Marker({
            position: center,
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP
          });
          
          map.addListener('click', (e) => {
            updateMarkerPosition(e.latLng);
          });
          
          marker.addListener('dragend', (e) => {
            updateMarkerPosition(e.latLng);
          });
          
          geocodeLocation(center);
        }
        
        function updateMarkerPosition(latLng) {
          marker.setPosition(latLng);
          map.panTo(latLng);
          geocodeLocation({ lat: latLng.lat(), lng: latLng.lng() });
        }
        
        function geocodeLocation(location) {
          geocoder.geocode({ location: location }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const data = {
                latitude: location.lat,
                longitude: location.lng,
                formatted_address: results[0].formatted_address,
                address_components: results[0].address_components,
                place_id: results[0].place_id
              };
              
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'locationSelected',
                data: data
              }));
            }
          });
        }
        
        function searchLocation(placeId) {
          geocoder.geocode({ placeId: placeId }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const location = results[0].geometry.location;
              updateMarkerPosition(location);
            }
          });
        }
        
        document.addEventListener('message', (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'search' && data.placeId) {
            searchLocation(data.placeId);
          }
        });
        
        initMap();
      </script>
    </body>
    </html>
  ` : '';

  const handleWebViewMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      
      if (message.type === 'locationSelected') {
        const { data } = message;
        setSelectedLocation({
          latitude: data.latitude,
          longitude: data.longitude
        });
        
        const components = extractAddressComponents(data.address_components);
        
        setAddressDetails({
          ...components,
          fullAddress: data.formatted_address,
          placeId: data.place_id
        });
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleSearch = async (text) => {
    setSearchQuery(text);
    
    if (text.length < 3 || !apiKey) {
      setSuggestions([]);
      return;
    }
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${apiKey}&components=country:in`
      );
      const data = await response.json();
      
      if (data.predictions) {
        setSuggestions(data.predictions);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const selectSuggestion = (prediction) => {
    setSearchQuery(prediction.description);
    setSuggestions([]);
    
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'search',
        placeId: prediction.place_id
      }));
    }
  };

  const handleConfirm = () => {
    if (selectedLocation && addressDetails) {
      onLocationSelect({
        coordinates: selectedLocation,
        address: addressDetails
      });
      onClose();
    } else {
      Alert.alert('Select Location', 'Please select a location on the map');
    }
  };

  if (loading) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={styles.loadingText}>Loading Maps...</Text>
        </View>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#ef4444" />
          <Text style={styles.errorTitle}>Maps Unavailable</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadApiKey}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Location</Text>
          <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
            <Text style={styles.confirmText}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for area, district, city..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setSuggestions([]);
            }}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {suggestions.length > 0 && (
          <ScrollView style={styles.suggestionsContainer}>
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => selectSuggestion(item)}
              >
                <Ionicons name="location-outline" size={20} color="#22C55E" />
                <View style={styles.suggestionText}>
                  <Text style={styles.suggestionMain}>{item.structured_formatting.main_text}</Text>
                  <Text style={styles.suggestionSecondary}>{item.structured_formatting.secondary_text}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.mapContainer}>
          {apiKey && (
            <WebView
              ref={webViewRef}
              source={{ html: mapHTML }}
              style={styles.map}
              onMessage={handleWebViewMessage}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          )}
        </View>

        {addressDetails && (
          <View style={styles.addressCard}>
            <Text style={styles.addressTitle}>Selected Location</Text>
            <Text style={styles.addressText}>{addressDetails.fullAddress}</Text>
            
            <View style={styles.detailsGrid}>
              {addressDetails.area && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Area:</Text>
                  <Text style={styles.detailValue}>{addressDetails.area}</Text>
                </View>
              )}
              {addressDetails.locality && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>City:</Text>
                  <Text style={styles.detailValue}>{addressDetails.locality}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 16, fontSize: 18, fontWeight: '600', color: '#333' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 30 },
  errorTitle: { marginTop: 20, fontSize: 22, fontWeight: 'bold', color: '#333' },
  errorText: { marginTop: 12, fontSize: 15, color: '#666', textAlign: 'center' },
  retryButton: { marginTop: 24, backgroundColor: '#22C55E', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  cancelButton: { marginTop: 12, padding: 12 },
  cancelText: { color: '#666', fontSize: 15 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e5e5', paddingTop: 50 },
  closeButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  confirmButton: { backgroundColor: '#22C55E', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  confirmText: { color: '#fff', fontWeight: '600' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', margin: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8, borderWidth: 1, borderColor: '#e5e5e5' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14 },
  suggestionsContainer: { maxHeight: 200, backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e5e5e5' },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  suggestionText: { flex: 1, marginLeft: 12 },
  suggestionMain: { fontSize: 14, fontWeight: '500', color: '#000' },
  suggestionSecondary: { fontSize: 12, color: '#666', marginTop: 2 },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  addressCard: { backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#e5e5e5', maxHeight: 200 },
  addressTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  addressText: { fontSize: 14, color: '#666', marginBottom: 12 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  detailItem: { width: '50%', marginBottom: 8 },
  detailLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
  detailValue: { fontSize: 14, fontWeight: '500', color: '#000' }
});

export default LocationPicker;