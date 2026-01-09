import { Translate } from '@google-cloud/translate/build/src/v2/index.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const apiKey = process.env.TRANSLATION_API_KEY;
console.log('🔑 API Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'NOT FOUND');

if (!apiKey) {
  console.error('❌ No API key found!');
  process.exit(1);
}

const translateClient = new Translate({ key: apiKey });

async function test() {
  try {
    console.log('\n🧪 Testing translation...');
    const [translation] = await translateClient.translate('Hello World', {
      from: 'en',
      to: 'te'
    });
    console.log('✅ SUCCESS!');
    console.log('English: Hello World');
    console.log('Telugu:', translation);
  } catch (error) {
    console.error('❌ FAILED:', error.message);
    console.error('\nFull error:', error);
  }
}

test();