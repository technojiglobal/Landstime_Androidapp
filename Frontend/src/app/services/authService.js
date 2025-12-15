import { 
  PhoneAuthProvider,
  signInWithCredential,
  signInWithCustomToken 
} from 'firebase/auth';
import { auth } from '../config/_firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = `${process.env.BACKEND_URL}/api/users`;

class AuthService {
  constructor() {
    this.verificationId = null;
  }

  // Send OTP via Backend (Recommended approach)
  async sendOTP(phoneNumber, countryCode = '+91') {
    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      console.log('Sending OTP to:', fullPhoneNumber);
      
      // Call your backend to send OTP
      const response = await axios.post(`${API_URL}/send-otp`, {
        phoneNumber: fullPhoneNumber
      });
      
      if (response.data.success) {
        // Store verification ID if your backend returns one
        this.verificationId = response.data.verificationId;
        
        return {
          success: true,
          message: 'OTP sent successfully',
          verificationId: response.data.verificationId
        };
      }
      
      return {
        success: false,
        error: response.data.message || 'Failed to send OTP'
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Verify OTP via Backend
  async verifyOTP(phoneNumber, otp, verificationId) {
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, {
        phoneNumber,
        otp,
        verificationId: verificationId || this.verificationId
      });
      
      if (response.data.success) {
        // Backend should return custom token after verifying OTP
        const customToken = response.data.customToken;
        
        // Sign in with custom token
        const userCredential = await signInWithCustomToken(auth, customToken);
        const user = userCredential.user;
        const idToken = await user.getIdToken();
        
        return {
          success: true,
          user,
          idToken,
          firebaseUid: user.uid,
          phoneNumber: user.phoneNumber,
          userData: response.data.user
        };
      }
      
      return {
        success: false,
        error: response.data.message || 'Invalid OTP'
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Alternative: Direct Firebase Phone Auth (Requires additional setup)
  async sendOTPFirebase(phoneNumber, countryCode = '+91') {
    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      
      // This requires Firebase App Check or reCAPTCHA Enterprise
      // For React Native, you need to set up Firebase App Check
      const phoneProvider = new PhoneAuthProvider(auth);
      
      // Note: This will NOT work without proper setup
      // You need Firebase App Check configured
      const verificationId = await phoneProvider.verifyPhoneNumber(
        fullPhoneNumber,
        // recaptchaVerifier not needed with App Check
      );
      
      this.verificationId = verificationId;
      
      return {
        success: true,
        verificationId,
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

  // Verify Firebase OTP
  async verifyFirebaseOTP(otp, verificationId) {
    try {
      const vid = verificationId || this.verificationId;
      
      if (!vid) {
        throw new Error('No verification ID found');
      }
      
      const credential = PhoneAuthProvider.credential(vid, otp);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      
      return {
        success: true,
        user,
        idToken,
        firebaseUid: user.uid,
        phoneNumber: user.phoneNumber
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
        // Sign in with custom token if provided
        if (response.data.data.customToken) {
          await signInWithCustomToken(auth, response.data.data.customToken);
        }
        
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
        if (response.data.data.customToken) {
          await signInWithCustomToken(auth, response.data.data.customToken);
        }
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

  // Store user data locally
  async storeUserData(userData) {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('userId', userData.id.toString());
    } catch (error) {
      console.error('Store user data error:', error);
    }
  }

  // Get stored user data
  async getStoredUserData() {
    try {
      const userData = await AsyncStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get stored user data error:', error);
      return null;
    }
  }

  // Store temporary registration data
  async storeTempRegistrationData(data) {
    try {
      await AsyncStorage.setItem('tempRegData', JSON.stringify(data));
    } catch (error) {
      console.error('Store temp data error:', error);
    }
  }

  // Get temporary registration data
  async getTempRegistrationData() {
    try {
      const data = await AsyncStorage.getItem('tempRegData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Get temp data error:', error);
      return null;
    }
  }

  // Clear temporary registration data
  async clearTempRegistrationData() {
    try {
      await AsyncStorage.removeItem('tempRegData');
    } catch (error) {
      console.error('Clear temp data error:', error);
    }
  }

  // Logout
  async logout() {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('tempRegData');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new AuthService();