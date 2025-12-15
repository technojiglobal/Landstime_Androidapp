// ==================== config/firebaseConfig.js ====================
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your LandsTime Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDee1TXMucS2nbaKMbYs5_qFqzoHuHcbaQ",
  authDomain: "landstime-b77f9.firebaseapp.com",
  projectId: "landstime-b77f9",
  storageBucket: "landstime-b77f9.firebasestorage.app",
  messagingSenderId: "678130074980",
  appId: "1:678130074980:android:8118cc66b82341facd6671"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Export app for other Firebase services
export default app;