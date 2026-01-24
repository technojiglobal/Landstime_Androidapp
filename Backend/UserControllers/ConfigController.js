// UserControllers/ConfigController.js
import googleMapsConfig from '../config/googleMaps.js';
import axios from 'axios';

// Get Google Maps API Key
export const getGoogleMapsConfig = async (req, res) => {
  try {
    // Only send API key if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if API key exists
    if (!googleMapsConfig.apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Google Maps API key not configured'
      });
    }

    // Return config without sensitive info
    res.status(200).json({
      success: true,
      data: {
        apiKey: googleMapsConfig.apiKey,
        region: googleMapsConfig.region,
        language: googleMapsConfig.language
      }
    });
  } catch (error) {
    console.error('Error fetching Google Maps config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch configuration'
    });
  }
};

// Health check for Maps API
export const checkMapsApiHealth = async (req, res) => {
  try {
    // Test API key with a simple geocoding request
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: 'Bengaluru, India',
          key: googleMapsConfig.apiKey
        }
      }
    );

    if (response.data.status === 'OK') {
      return res.status(200).json({
        success: true,
        message: 'Google Maps API is working',
        status: response.data.status
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Google Maps API error',
        status: response.data.status
      });
    }
  } catch (error) {
    console.error('Maps API health check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check API health',
      error: error.message
    });
  }
};