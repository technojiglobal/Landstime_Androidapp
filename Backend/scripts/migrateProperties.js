// //Backend/scripts/migrateProperties.js

// import mongoose from 'mongoose';
// import Property from '../UserModels/Property.js';
// import 'dotenv/config';

// async function migrateProperties() {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('Connected to MongoDB');

//     const result = await Property.updateMany(
//       { adminDeletedStatus: { $exists: false } },
//       { $set: { adminDeletedStatus: 'active' } }
//     );

//     console.log(`✅ Updated ${result.modifiedCount} properties`);
//     await mongoose.connection.close();
//   } catch (error) {
//     console.error('Migration error:', error);
//   }
// }

// migrateProperties();


//Backend/scripts/migrateProperties.js

import mongoose from 'mongoose';
import Property from '../UserModels/Property.js';
import { translatePropertyFields } from '../services/translationService.js';
import 'dotenv/config';

async function migrateProperties() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // ✅ STEP 1: Fix adminDeletedStatus for old properties
    console.log('\n📝 Step 1: Fixing adminDeletedStatus...');
    const adminDeleteResult = await Property.updateMany(
      { adminDeletedStatus: { $exists: false } },
      { $set: { adminDeletedStatus: 'active' } }
    );
    console.log(`   ✅ Updated ${adminDeleteResult.modifiedCount} properties with adminDeletedStatus`);

    // ✅ STEP 2: Translate old properties to 3 languages
    console.log('\n📝 Step 2: Translating properties to 3 languages...');
    
    // Find properties with old string format (not yet migrated)
    const oldFormatProperties = await Property.find({
      $or: [
        { 'propertyTitle.te': { $exists: false } },
        { 'propertyTitle.hi': { $exists: false } },
        { 'propertyTitle.en': { $exists: false } }
      ]
    });

    console.log(`📊 Found ${oldFormatProperties.length} properties to translate`);

    if (oldFormatProperties.length === 0) {
      console.log('   ℹ️  All properties are already in 3-language format');
    }

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < oldFormatProperties.length; i++) {
      const property = oldFormatProperties[i];
      console.log(`\n🔄 Migrating ${i + 1}/${oldFormatProperties.length}`);
      console.log(`   ID: ${property._id}`);
      console.log(`   Type: ${property.propertyType}`);

      try {
        // Check if already has object format (partial migration)
        const hasObjectFormat = 
          typeof property.propertyTitle === 'object' && 
          property.propertyTitle !== null;

        if (hasObjectFormat) {
          console.log('   ⏭️  Already in object format, skipping translation');
          successCount++;
          continue;
        }

        // Get original text values
        const originalTitle = property.propertyTitle || 'Untitled Property';
        const originalDescription = property.description || '';
        const originalLocation = property.location || '';

        console.log(`   Original Title: ${originalTitle.substring(0, 50)}...`);

        // Translate to all 3 languages (assume old data was in English)
        console.log('   🌐 Translating...');
        const translatedFields = await translatePropertyFields({
          propertyTitle: originalTitle,
          description: originalDescription,
          location: originalLocation
        }, 'en'); // Assuming old properties were in English

        // Update property with translated versions
        await Property.updateOne(
          { _id: property._id },
          {
            $set: {
              propertyTitle: translatedFields.propertyTitle,
              description: translatedFields.description,
              location: translatedFields.location,
              originalLanguage: 'en' // Mark as originally English
            }
          }
        );

        console.log('   ✅ Successfully translated');
        successCount++;

        // Add delay to avoid API rate limits (optional)
        if (i < oldFormatProperties.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second delay
        }

      } catch (error) {
        console.error(`   ❌ Error migrating property ${property._id}:`, error.message);
        errorCount++;
        
        // Continue with next property instead of stopping
        continue;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully migrated: ${successCount} properties`);
    console.log(`❌ Failed: ${errorCount} properties`);
    console.log(`📝 Total processed: ${oldFormatProperties.length} properties`);
    console.log('='.repeat(50));

    await mongoose.connection.close();
    console.log('\n✅ Migration complete! Database connection closed.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

migrateProperties();