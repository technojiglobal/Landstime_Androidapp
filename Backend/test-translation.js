// Backend/test-translation.js
import { Translate } from '@google-cloud/translate/build/src/v2/index.js';
import 'dotenv/config';

const translateClient = new Translate({
  key: process.env.TRANSLATION_API_KEY
});

async function testTranslation() {
  try {
    console.log('🔑 API Key:', process.env.TRANSLATION_API_KEY ? 'Found' : 'Missing');
    
    const text = 'Hello World';
    const [translation] = await translateClient.translate(text, 'te');
    
    console.log('✅ Translation works!');
    console.log(`Original: ${text}`);
    console.log(`Telugu: ${translation}`);
    
  } catch (error) {
    console.error('❌ Translation failed:', error.message);
  }
}

testTranslation();