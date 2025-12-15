import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDee1TXMucS2nbaKMbYs5_qFqzoHuHcbaQ",
  authDomain: "landstime-b77f9.firebaseapp.com",
  projectId: "landstime-b77f9",
  storageBucket: "landstime-b77f9.firebasestorage.app",
  messagingSenderId: "678130074980",
  appId: "1:678130074980:android:8118cc66b82341facd6671"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
