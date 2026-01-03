import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Property from '../UserModels/Property.js';
import { translatePropertyFields } from '../services/translationService.js';



// ✅ FIX: Load .env from Backend directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

console.log('📂 Loading .env from:', envPath);
dotenv.config({ path: envPath });

// ✅ Verify API key loaded
if (!process.env.TRANSLATION_API_KEY) {
  console.error('❌ TRANSLATION_API_KEY not found after loading .env');
  console.error('   Make sure .env file exists at:', envPath);
  process.exit(1);
} else {
  console.log('✅ TRANSLATION_API_KEY loaded successfully');
}
async function fixTranslations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find properties with bad Telugu translations
    const properties = await Property.find({
      'propertyTitle.te': 'Surya building' // Find properties with untranslated Telugu
    });

    console.log(`📊 Found ${properties.length} properties with bad translations`);

    for (const property of properties) {
      console.log(`\n🔄 Fixing property: ${property._id}`);
      
      // Get English version (assuming it's correct)
      const englishTitle = property.propertyTitle.en;
      const englishLocation = property.location.en;
      const englishDescription = property.description.en;
      const englishArea = property.area.en;

      console.log('📝 Original English:', englishTitle);

      // Re-translate everything
      const translated = await translatePropertyFields({
        propertyTitle: englishTitle,
        location: englishLocation,
        description: englishDescription,
        area: englishArea
      }, 'en');

      console.log('✅ New Telugu:', translated.propertyTitle.te);

      // Update property
      await Property.updateOne(
        { _id: property._id },
        {
          $set: {
            propertyTitle: translated.propertyTitle,
            location: translated.location,
            description: translated.description,
            area: translated.area
          }
        }
      );

      console.log('✅ Property updated successfully');
    }

    console.log('\n✅ All translations fixed!');
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixTranslations();