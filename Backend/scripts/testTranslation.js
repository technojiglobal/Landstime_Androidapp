import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { translateToAllLanguages } from '../services/translationService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

async function testTranslations() {
  console.log('🧪 Testing Google Translate API...\n');

  const testTexts = [
    'New House',
    'This is a very nice property',
    'Visakhapatnam',
    'Akkayapalem'
  ];

  for (const text of testTexts) {
    console.log(`\n📝 Testing: "${text}"`);
    const result = await translateToAllLanguages(text, 'en');
    console.log('   EN:', result.en);
    console.log('   TE:', result.te);
    console.log('   HI:', result.hi);
  }
}

testTranslations();