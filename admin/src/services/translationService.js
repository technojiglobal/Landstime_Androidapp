// Create this new file
import axios from 'axios';

export const translateText = async (text, sourceLang = 'en', targetLangs = ['te', 'hi']) => {
  try {
    const translations = { [sourceLang]: text };
    
    for (const targetLang of targetLangs) {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY}`,
        {
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        }
      );
      
      translations[targetLang] = response.data.data.translations[0].translatedText;
    }
    
    return translations;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text if translation fails
    return { [sourceLang]: text };
  }
};