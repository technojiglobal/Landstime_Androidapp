import { Translate } from '@google-cloud/translate/build/src/v2/index.js';

const translateClient = new Translate({
  key: process.env.TRANSLATION_API_KEY
});

export const translateToAllLanguages = async (text, sourceLang = 'en') => {
  try {
    if (!text || !text.trim()) {
      return { te: '', hi: '', en: '' };
    }

    const targetLanguages = ['te', 'hi', 'en'].filter(lang => lang !== sourceLang);
    const result = { [sourceLang]: text };

    for (const targetLang of targetLanguages) {
      try {
        const [translation] = await translateClient.translate(text, {
          from: sourceLang,
          to: targetLang
        });
        result[targetLang] = translation;
        console.log(`✅ ${sourceLang}->${targetLang}: ${translation.substring(0, 30)}...`);
      } catch (error) {
        console.error(`❌ Translation failed (${sourceLang}->${targetLang}):`, error.message);
        result[targetLang] = text;
      }
    }

    return result;
  } catch (error) {
    console.error('❌ Translation error:', error);
    return { te: text, hi: text, en: text };
  }
};

export const translatePropertyFields = async (fields, sourceLang = 'en') => {
  const translatedFields = {};

  for (const [fieldName, fieldValue] of Object.entries(fields)) {
    if (fieldValue && typeof fieldValue === 'string') {
      translatedFields[fieldName] = await translateToAllLanguages(fieldValue, sourceLang);
    }
  }

  return translatedFields;
};

/**
 * Detect language of text
 * @param {string} text
 * @returns {string} - Language code (te, hi, en, etc.)
 */
export const detectLanguage = async (text) => {
  try {
    if (!text || !text.trim()) return 'en';
    
    const [detection] = await translate.detect(text);
    return detection.language;
    
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default to English
  }
};