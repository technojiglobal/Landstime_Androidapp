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
    
    // ... your existing translation code ...
    
    // ✅ STEP 3: Add areaKey to all properties
    console.log('\n📝 Step 3: Adding areaKey to properties...');
    
    const propertiesWithoutAreaKey = await Property.find({
      $or: [
        { areaKey: { $exists: false } },
        { areaKey: '' },
        { areaKey: null }
      ]
    });
    
    console.log(`📊 Found ${propertiesWithoutAreaKey.length} properties without areaKey`);
    
    let areaKeySuccessCount = 0;
    let areaKeyErrorCount = 0;
    
    for (const property of propertiesWithoutAreaKey) {
      try {
        // Generate areaKey from area.en (or area if it's a string)
        let areaKey = '';
        
        if (property.area) {
          if (typeof property.area === 'object' && property.area.en) {
            areaKey = property.area.en.toLowerCase().trim().replace(/\s+/g, '');
          } else if (typeof property.area === 'string') {
            areaKey = property.area.toLowerCase().trim().replace(/\s+/g, '');
          }
        }
        
        if (areaKey) {
          await Property.updateOne(
            { _id: property._id },
            { $set: { areaKey } }
          );
          console.log(`   ✅ ${property._id}: areaKey = "${areaKey}"`);
          areaKeySuccessCount++;
        } else {
          console.log(`   ⚠️  ${property._id}: Could not generate areaKey (no area data)`);
          areaKeyErrorCount++;
        }
        
      } catch (error) {
        console.error(`   ❌ Error adding areaKey to ${property._id}:`, error.message);
        areaKeyErrorCount++;
      }
    }
    
    console.log(`\n   ✅ Added areaKey to ${areaKeySuccessCount} properties`);
    console.log(`   ❌ Failed: ${areaKeyErrorCount} properties`);

    console.log('\n' + '='.repeat(50));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully migrated: ${successCount} properties`);
    console.log(`❌ Failed: ${errorCount} properties`);
    console.log(`📝 Total processed: ${oldFormatProperties.length} properties`);
    console.log(`✅ AreaKey added: ${areaKeySuccessCount} properties`);
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