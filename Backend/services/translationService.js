// Landstime_Androidapp/Backend/services/translationService.js
import { Translate } from '@google-cloud/translate/build/src/v2/index.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ✅ Load .env before creating client
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const translateClient = new Translate({
  key: process.env.TRANSLATION_API_KEY
});

// ✅ Verify API key is loaded
if (!process.env.TRANSLATION_API_KEY) {
  console.error('❌ ERROR: TRANSLATION_API_KEY is not set in .env file!');
} else {
  console.log('✅ Google Translate API Key loaded');
}

export const translateToAllLanguages = async (text, sourceLang = 'en') => {
  try {
    // ✅ FIX: Check if text is a string first
    if (!text || typeof text !== 'string' || !text.trim()) {
      console.log('⚠️  Empty or invalid text provided, skipping translation');
      return { te: '', hi: '', en: '' };
    }

    console.log(`🔄 : "${text}" from ${sourceLang}`);
    
    // ✅ CRITICAL FIX: Always translate from English
    const actualSourceLang = 'en';
    const targetLanguages = ['te', 'hi', 'en'];
    const result = {};

    for (const targetLang of targetLanguages) {
      if (targetLang === actualSourceLang) {
        // Source language - keep original
        result[targetLang] = text;
        console.log(`   ✅ Source (${targetLang}): "${text}"`);
      } else {
        try {
          //console.log(`   → Translating to ${targetLang}...`);
          
          const [translation] = await translateClient.translate(text, targetLang);
          
          result[targetLang] = translation;
         // console.log(`   ✅ en→${targetLang}: "${translation}"`);
          
        } catch (error) {
          console.error(`   ❌ Translation failed (en→${targetLang}):`, error.message);
          result[targetLang] = text; // Fallback to original text
        }
      }
    }

   // console.log('✅ Translation complete:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Translation error:', error);
    return { te: text, hi: text, en: text };
  }
};

// export const translatePropertyFields = async (fields, sourceLang = 'en') => {
//   const translatedFields = {};

//   for (const [fieldName, fieldValue] of Object.entries(fields)) {
//     if (fieldValue && typeof fieldValue === 'string') {
//       translatedFields[fieldName] = await translateToAllLanguages(fieldValue, sourceLang);
//     }
//   }

//   return translatedFields;
// };

/**
 * Detect language of text
 * @param {string} text
 * @returns {string} - Language code (te, hi, en, etc.)
 */


// Make sure your translation service includes area in the fields to translate
// Example structure:
// ✅ NEW CODE (Working)
export const translatePropertyFields = async (fields, originalLanguage) => {
  // console.log('\n🌐 === TRANSLATION SERVICE STARTED ===');
  // console.log('📝 Original Language:', originalLanguage);
  // console.log('📝 Fields to translate:', Object.keys(fields));
  
  const result = {};
  
  for (const [key, value] of Object.entries(fields)) {
    console.log(`\n🔄 Processing field: ${key}`);
    
    if (value && typeof value === 'string') {
      console.log(`   Original value: "${value}"`);
      result[key] = await translateToAllLanguages(value, originalLanguage);
      console.log(`   Translated:`, result[key]);
    } else {
      console.log(`   ⚠️  Skipped (empty or not string)`);
      result[key] = { te: '', hi: '', en: '' };
    }
  }
  
  console.log('\n✅ === TRANSLATION SERVICE COMPLETE ===');
 // console.log('📦 Final result:', JSON.stringify(result, null, 2));
  
  return result;
};
// export const detectLanguage = async (text) => {
//   try {
//     if (!text || !text.trim()) return 'en';
    
//     console.log('🔍 Detecting language for:', text.substring(0, 30));
//     const [detection] = await translateClient.detect(text); // ← Fixed: was 'translate', should be 'translateClient'
//     console.log('✅ Detected language:', detection.language);
//     return detection.language;
    
//   } catch (error) {
//     console.error('❌ Language detection error:', error);
//     return 'en'; // Default to English
//   }
// };






export const detectLanguage = async (text) => {
  try {
    if (!text || !text.trim()) return 'en';
    
    console.log('🔍 Detecting language for:', text.substring(0, 30));
    const [detection] = await translateClient.detect(text);
    console.log('✅ Detected language:', detection.language);
    return detection.language;
    
  } catch (error) {
    console.error('❌ Language detection error:', error);
    return 'en'; // Default to English
  }
};

// ✅ NEW: Normalize area key for consistent filtering
export const normalizeAreaKey = (area) => {
  if (!area) return '';
  return area.toString().toLowerCase().trim().replace(/\s+/g, '-');
};







