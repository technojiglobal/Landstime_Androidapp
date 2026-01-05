import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Property from '../UserModels/Property.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

async function updateProperty() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const propertyId = '6958a65453801ea8727bcf2c';
    
    console.log('🔄 Updating property with correct Telugu translations...');
    
    // Update with correct Telugu translations
  // Update with correct Telugu AND Hindi translations
    await Property.updateOne(
      { _id: propertyId },
      {
        $set: {
          'propertyTitle.te': 'సూర్య భవనం',
          'propertyTitle.hi': 'सूर्य भवन',
          'location.te': 'విశాఖపట్నం',
          'location.hi': 'विशाखापत्तनम',
          'area.te': 'అక్కయ్యపాలెం',
          'area.hi': 'अक्कायापलेम',
          'description.te': 'ఇది నా ఆస్తి.',
          'description.hi': 'यह मेरी संपत्ति है।'
        }
      }
    );

    console.log('✅ Property updated successfully!');
    
    const updated = await Property.findById(propertyId);
    console.log('\n📦 Updated property data:');
    console.log('Title (EN):', updated.propertyTitle.en);
    console.log('Title (TE):', updated.propertyTitle.te);
    console.log('Title (HI):', updated.propertyTitle.hi);
    console.log('\nLocation (EN):', updated.location.en);
    console.log('Location (TE):', updated.location.te);
    console.log('Location (HI):', updated.location.hi);
    console.log('\nArea (EN):', updated.area.en);
    console.log('Area (TE):', updated.area.te);
    console.log('Area (HI):', updated.area.hi);
    console.log('\nDescription (TE):', updated.description.te);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateProperty();