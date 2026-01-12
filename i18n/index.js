// Landstime_Androidapp/Frontend/i18n/index.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import en from '../translations/en.json';
import hi from '../translations/hi.json';
import te from '../translations/te.json';

const LANGUAGE_KEY = '@app_language';

/* -------------------- */
/* 1️⃣ GET INITIAL LANG */
/* -------------------- */

let initialLanguage = 'en';

if (Platform.OS === 'web') {
  try {
    const savedLang = localStorage.getItem(LANGUAGE_KEY);
    if (savedLang) {
      initialLanguage = savedLang;
    }
  } catch (e) {
    initialLanguage = 'en';
  }
}

/* -------------------- */
/* 2️⃣ INIT I18N        */
/* -------------------- */

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        hi: { translation: hi },
        te: { translation: te },
      },
      lng: initialLanguage, // ✅ IMPORTANT
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
}

/* -------------------- */
/* 3️⃣ LOAD NATIVE LANG */
/* -------------------- */

if (Platform.OS !== 'web') {
  AsyncStorage.getItem(LANGUAGE_KEY).then((savedLang) => {
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  });
}

/* -------------------- */
/* 4️⃣ CHANGE LANGUAGE  */
/* -------------------- */

// export const changeLanguage = async (languageCode) => {
//   if (Platform.OS === 'web') {
//     localStorage.setItem(LANGUAGE_KEY, languageCode);
//   } else {
//     await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
//   }
//   i18n.changeLanguage(languageCode);
// };


export const changeLanguage = async (languageCode) => {
  console.log('🌐 Changing language to:', languageCode);
  
  if (Platform.OS === 'web') {
    localStorage.setItem(LANGUAGE_KEY, languageCode);
  } else {
    await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
  }
  
  await i18n.changeLanguage(languageCode);
  
  // ✅ Force a small delay to ensure i18n updates
  return new Promise(resolve => setTimeout(resolve, 100));
};
export default i18n;
