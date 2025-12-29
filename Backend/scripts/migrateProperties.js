import mongoose from 'mongoose';
import Property from '../UserModels/Property.js';
import 'dotenv/config';

async function migrateProperties() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Property.updateMany(
      { adminDeletedStatus: { $exists: false } },
      { $set: { adminDeletedStatus: 'active' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} properties`);
    await mongoose.connection.close();
  } catch (error) {
    console.error('Migration error:', error);
  }
}

migrateProperties();