import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  signInWithCustomToken 
} from 'firebase/auth';
import { auth } from '../Config/FirebaseConfig.js';
import axios from 'axios';

const API_URL = `${process.env.BACKEND_URL}/api/users`;

class AuthService {
  constructor() {
    this.recaptchaVerifier = null;
  }

  // Setup reCAPTCHA (for web only)
  setupRecaptcha(containerId = 'recaptcha-container') {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA verified');
        }
      });
    }
    return this.recaptchaVerifier;
  }

  // Send OTP
  async sendOTP(phoneNumber, countryCode = '+91') {
    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      
      const appVerifier = this.setupRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        fullPhoneNumber, 
        appVerifier
      );
      
      return {
        success: true,
        confirmationResult,
        message: 'OTP sent successfully'
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify OTP
  async verifyOTP(confirmationResult, otp) {
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const idToken = await user.getIdToken();
      
      return {
        success: true,
        user,
        idToken,
        firebaseUid: user.uid
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Register user in backend
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      
      if (response.data.success) {
        // Sign in with custom token
        await signInWithCustomToken(auth, response.data.data.customToken);
        
        // Store user data
        await this.storeUserData(response.data.data.user);
      }
      
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  }

  // Login user
  async login(firebaseUid) {
    try {
      const response = await axios.post(`${API_URL}/login`, { firebaseUid });
      
      if (response.data.success) {
        await signInWithCustomToken(auth, response.data.data.customToken);
        await this.storeUserData(response.data.data.user);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      
      const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  }

  // Store user data locally (AsyncStorage for React Native)
  async storeUserData(userData) {
    try {
      // For React Native, use AsyncStorage
      // await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      // For web, use localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Store user data error:', error);
    }
  }

  // Get stored user data
  async getStoredUserData() {
    try {
      // For React Native
      // const userData = await AsyncStorage.getItem('user');
      
      // For web
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
      }
      return null;
    } catch (error) {
      console.error('Get stored user data error:', error);
      return null;
    }
  }

  // Logout
  async logout() {
    try {
      await auth.signOut();
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      // For React Native: await AsyncStorage.removeItem('user');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new AuthService();
