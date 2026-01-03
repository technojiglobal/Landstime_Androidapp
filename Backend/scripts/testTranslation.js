import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Translate } from '@google-cloud/translate/build/src/v2/index.js'; // ← FIXED PATH

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const translateClient = new Translate({
  key: process.env.TRANSLATION_API_KEY
});

async function testTranslation() {
  console.log('🔑 API Key:', process.env.TRANSLATION_API_KEY ? 'Loaded ✅' : 'Missing ❌');
  
  try {
    console.log('\n🧪 Testing translation: "Surya building" → Telugu');
    
    const [translation] = await translateClient.translate('Surya building', {
      from: 'en',
      to: 'te'
    });
    
    console.log('✅ Result:', translation);
    
    console.log('\n🧪 Testing translation: "Surya building" → Hindi');
    
    const [translation2] = await translateClient.translate('Surya building', {
      from: 'en',
      to: 'hi'
    });
    
    console.log('✅ Result:', translation2);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testTranslation();