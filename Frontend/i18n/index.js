import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import en from '../translations/en.json';
import hi from '../translations/hi.json';
import te from '../translations/te.json';

const LANGUAGE_KEY = '@app_language';

// Function to get stored language (works for both web and native)
const getStoredLanguage = async () => {
  try {
    if (Platform.OS === 'web') {
      // Use localStorage for web
      return localStorage.getItem(LANGUAGE_KEY);
    } else {
      // Use AsyncStorage for native
      return await AsyncStorage.getItem(LANGUAGE_KEY);
    }
  } catch (error) {
    console.error('Error getting stored language:', error);
    return null;
  }
};

// Function to save language (works for both web and native)
const saveLanguage = async (languageCode) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(LANGUAGE_KEY, languageCode);
    } else {
      await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
    }
  } catch (error) {
    console.error('Error saving language:', error);
  }
};



// Initialize i18n with proper language
if (!i18n.isInitialized) 
{
  i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      te: { translation: te },
    },
    lng: 'en', // default ONLY
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

// Apply stored language on app start (WEB + NATIVE)
getStoredLanguage().then((savedLanguage) => {
  if (savedLanguage && savedLanguage !== i18n.language) {
    i18n.changeLanguage(savedLanguage);
  }
});


// Load saved language for native (async)
if (Platform.OS !== 'web') {
  getStoredLanguage().then((savedLanguage) => {
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  });
}

// Function to change and save language
export const changeLanguage = async (languageCode) => {
  await saveLanguage(languageCode);
  await i18n.changeLanguage(languageCode);
};

export default i18n;