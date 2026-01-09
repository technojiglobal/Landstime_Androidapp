import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Property from '../UserModels/Property.js';
import { translateToAllLanguages } from '../services/translationService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// ✅ ADD THIS NEW HELPER FUNCTION HERE
const getEnglishText = (field) => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object') {
    return field.en || field.te || field.hi || '';
  }
  return String(field);
};

async function retranslateProperties() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const properties = await Property.find({});
    console.log(`📊 Found ${properties.length} properties to retranslate\n`);

    for (const property of properties) {
      console.log(`\n🔄 Retranslating property: ${property._id}`);
      
     // ✅ Get English values using helper function
      const titleEN = getEnglishText(property.propertyTitle);
      const locationEN = getEnglishText(property.location);
      const areaEN = getEnglishText(property.area);
      const descEN = getEnglishText(property.description);

      // Translate
      const translations = {
        propertyTitle: await translateToAllLanguages(titleEN, 'en'),
        location: await translateToAllLanguages(locationEN, 'en'),
        area: await translateToAllLanguages(areaEN, 'en'),
        description: await translateToAllLanguages(descEN, 'en')
      };

      // ✅ Validate before updating
      if (translations.propertyTitle && 
          typeof translations.propertyTitle === 'object' &&
          translations.propertyTitle.en) {
        
        await Property.updateOne(
          { _id: property._id },
          {
            $set: {
              propertyTitle: translations.propertyTitle,
              location: translations.location,
              area: translations.area,
              description: translations.description
            }
          }
        );

        console.log(`   ✅ Updated: ${translations.propertyTitle.en}`);
        console.log(`      TE: ${translations.propertyTitle.te}`);
        console.log(`      HI: ${translations.propertyTitle.hi}`);
      } else {
        console.log(`   ❌ Skipped: Invalid translation data for ${property._id}`);
      }
    }

    console.log('\n✅ All properties retranslated successfully!');
    
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

retranslateProperties();