// config/googleMaps.js
import dotenv from 'dotenv';

dotenv.config();

const googleMapsConfig = {
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
  libraries: ['places', 'geometry'],
  region: 'IN',
  language: 'en',

  // API restrictions (optional)
  allowedDomains: [
    'localhost',
    'your-domain.com'
  ],

  // Rate limiting (optional)
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerDay: 25000
  }
};

export default googleMapsConfig;
