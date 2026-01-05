// Landstime_Androidapp/Backend/services/translationService.js
import { Translate } from '@google-cloud/translate/build/src/v2/index.js';

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
    if (!text || !text.trim()) {
      console.log('⚠️  Empty text provided, skipping translation');
      return { te: '', hi: '', en: '' };
    }

    console.log(`🔄 Translating: "${text}" from ${sourceLang}`);
    
    const targetLanguages = ['te', 'hi', 'en'].filter(lang => lang !== sourceLang);
    const result = { [sourceLang]: text };

    for (const targetLang of targetLanguages) {
      try {
        console.log(`   → Translating to ${targetLang}...`);
        
        const [translation] = await translateClient.translate(text, {
          from: sourceLang,
          to: targetLang
        });
        
        result[targetLang] = translation;
        console.log(`   ✅ ${sourceLang}→${targetLang}: "${translation}"`);
        
      } catch (error) {
        console.error(`   ❌ Translation failed (${sourceLang}→${targetLang}):`, error.message);
        result[targetLang] = text; // Fallback to original text
      }
    }

    console.log('✅ Translation complete:', result);
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
  console.log('\n🌐 === TRANSLATION SERVICE STARTED ===');
  console.log('📝 Original Language:', originalLanguage);
  console.log('📝 Fields to translate:', Object.keys(fields));
  
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
  console.log('📦 Final result:', JSON.stringify(result, null, 2));
  
  return result;
};
export const detectLanguage = async (text) => {
  try {
    if (!text || !text.trim()) return 'en';
    
    console.log('🔍 Detecting language for:', text.substring(0, 30));
    const [detection] = await translateClient.detect(text); // ← Fixed: was 'translate', should be 'translateClient'
    console.log('✅ Detected language:', detection.language);
    return detection.language;
    
  } catch (error) {
    console.error('❌ Language detection error:', error);
    return 'en'; // Default to English
  }
};







// // Landstime_Androidapp/Backend/services/translationService.js
// import { Translate } from '@google-cloud/translate/build/src/v2/index.js';

// const translateClient = new Translate({
//   key: process.env.TRANSLATION_API_KEY
// });

// // ✅ Verify API key is loaded
// if (!process.env.TRANSLATION_API_KEY) {
//   console.error('❌ ERROR: TRANSLATION_API_KEY is not set in .env file!');
// } else {
//   console.log('✅ Google Translate API Key loaded');
// }

// // ✅ NEW: Function to detect if text is likely a proper name
// const isProperName = (text) => {
//   if (!text || typeof text !== 'string') return false;
  
//   // Proper names are usually:
//   // 1. Short (1-3 words)
//   // 2. Start with capital letter
//   // 3. Don't contain common words
  
//   const words = text.trim().split(/\s+/);
  
//   // If more than 3 words, probably not a name
//   if (words.length > 3) return false;
  
//   // Check if starts with capital letter (for Latin script)
//   const startsWithCapital = /^[A-Z]/.test(text);
  
//   // Check if it's a single word or 2-3 words with capitals
//   const isShortAndCapitalized = words.length <= 3 && words.every(w => /^[A-Z]/.test(w));
  
//   // If it's short and looks like a name, preserve it
//   return startsWithCapital || isShortAndCapitalized || words.length === 1;
// };

// // ✅ NEW: Function to transliterate (convert script) instead of translate
// const transliterateText = async (text, sourceLang, targetLang) => {
//   try {
//     // For proper names, we want transliteration (script conversion) not translation
//     console.log(`🔤 Transliterating "${text}" from ${sourceLang} to ${targetLang}`);
    
//     // Google Translate with transliteration hint
//     const [result] = await translateClient.translate(text, {
//       from: sourceLang,
//       to: targetLang,
//       format: 'text'
//     });
    
//     // If the result is very different in length, it's probably translated not transliterated
//     // In that case, keep original
//     if (Math.abs(result.length - text.length) > text.length * 0.5) {
//       console.log(`⚠️  Translation changed length too much, keeping original`);
//       return text;
//     }
    
//     return result;
    
//   } catch (error) {
//     console.error('Transliteration error:', error);
//     return text;
//   }
// };



// export const translateToAllLanguages = async (text, sourceLang = 'en') => {
//   try {
//     if (!text || !text.trim()) {
//       console.log('⚠️  Empty text provided, skipping translation');
//       return { te: '', hi: '', en: '' };
//     }

//     console.log(`🔄 Translating: "${text}" from ${sourceLang}`);
    
//     // ✅ NEW: Check if this is a proper name
//     const isProbablyName = isProperName(text);
//     console.log(`🏷️  Is this a proper name? ${isProbablyName}`);
    
//     const targetLanguages = ['te', 'hi', 'en'].filter(lang => lang !== sourceLang);
//     const result = { [sourceLang]: text };

//     for (const targetLang of targetLanguages) {
//       try {
//         console.log(`   → ${isProbablyName ? 'Transliterating' : 'Translating'} to ${targetLang}...`);
        
//         let translation;
        
//         if (isProbablyName) {
//           // ✅ For names: transliterate (convert script) instead of translate (convert meaning)
//           translation = await transliterateText(text, sourceLang, targetLang);
//         } else {
//           // For regular text: translate normally
//           [translation] = await translateClient.translate(text, {
//             from: sourceLang,
//             to: targetLang
//           });
//         }
        
//         result[targetLang] = translation;
//         console.log(`   ✅ ${sourceLang}→${targetLang}: "${translation}"`);
        
//       } catch (error) {
//         console.error(`   ❌ Translation failed (${sourceLang}→${targetLang}):`, error.message);
//         result[targetLang] = text; // Fallback to original text
//       }
//     }

//     console.log('✅ Translation complete:', result);
//     return result;
    
//   } catch (error) {
//     console.error('❌ Translation error:', error);
//     return { te: text, hi: text, en: text };
//   }
// };
// // export const translatePropertyFields = async (fields, sourceLang = 'en') => {
// //   const translatedFields = {};

// //   for (const [fieldName, fieldValue] of Object.entries(fields)) {
// //     if (fieldValue && typeof fieldValue === 'string') {
// //       translatedFields[fieldName] = await translateToAllLanguages(fieldValue, sourceLang);
// //     }
// //   }

// //   return translatedFields;
// // };

// /**
//  * Detect language of text
//  * @param {string} text
//  * @returns {string} - Language code (te, hi, en, etc.)
//  */


// // Make sure your translation service includes area in the fields to translate
// // Example structure:
// // ✅ NEW CODE (Working)
// export const translatePropertyFields = async (fields, originalLanguage) => {
//   console.log('\n🌐 === TRANSLATION SERVICE STARTED ===');
//   console.log('📝 Original Language:', originalLanguage);
//   console.log('📝 Fields to translate:', Object.keys(fields));
  
//   const result = {};
  
//   for (const [key, value] of Object.entries(fields)) {
//     console.log(`\n🔄 Processing field: ${key}`);
    
//     if (value && typeof value === 'string') {
//       console.log(`   Original value: "${value}"`);
//       result[key] = await translateToAllLanguages(value, originalLanguage);
//       console.log(`   Translated:`, result[key]);
//     } else {
//       console.log(`   ⚠️  Skipped (empty or not string)`);
//       result[key] = { te: '', hi: '', en: '' };
//     }
//   }
  
//   console.log('\n✅ === TRANSLATION SERVICE COMPLETE ===');
//   console.log('📦 Final result:', JSON.stringify(result, null, 2));
  
//   return result;
// };
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