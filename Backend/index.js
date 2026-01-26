
// Backend/index.js

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './UserRoutes/UserRoute.js';
import propertyRoutes from './UserRoutes/PropertyRoutes.js';
import adminPropertyRoutes from './AdminRoutes/adminPropertyRoute.js';  

import subscriptionRoutes from './UserRoutes/SubscriptionRoute.js';
import userNotificationRoutes from './UserRoutes/UserNotificationRoute.js'; // ✅ NEW
import adminAuthRoutes from "./AdminRoutes/AdminRoute.js";
import interiorDesignRoutes from "./AdminRoutes/InteriorDesignRoute.js";
import notificationRoutes from "./AdminRoutes/NotificationRoute.js";
import { startNotificationScheduler } from "./services/notificationScheduler.js"; // ✅ NEW
import reviewRoutes from "./UserRoutes/ReviewRoutes.js";
import bannerRoutes from './AdminRoutes/BannerRoutes.js';
import adminPropertyViewRoutes from './AdminRoutes/PropertyViewRoute.js';
import userPropertyViewRoutes from './UserRoutes/PropertyViewRoute.js';

import interiorDesignViewUserRoute from './UserRoutes/InteriorDesignViewRoute.js';
import interiorDesignViewAdminRoute from './AdminRoutes/InteriorDesignViewRoute.js';

import savedPropertiesRoutes from './UserRoutes/savedPropertiesRoutes.js';

const app = express();
const PORT = process.env.PORT || 8000;

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
console.log("✅ Static middleware about to mount");
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/properties', express.static(path.join(__dirname, 'uploads/properties')));

console.log("✅ Static middleware mounted");
app.use("/api/reviews", reviewRoutes);
// MongoDB Connection
console.log('🔍 Attempting MongoDB connection...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI exists ✅' : 'URI missing ❌');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('\n💡 Troubleshooting Steps:');
    console.log('   1. Check MongoDB Atlas → Network Access → Whitelist your IP');
    console.log('   2. Verify your MongoDB credentials');
    console.log('   3. Check if cluster is active (not paused)');
    console.log('   4. Try: 0.0.0.0/0 for "Allow from Anywhere"\n');
  });

// Monitor connection status
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

// Root Route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'LandsTime API Server is running',
    version: '1.0.0'
  });
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/admin/properties', adminPropertyRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/interior', interiorDesignRoutes);
app.use('/api/admin/notifications', notificationRoutes); // NEW
app.use('/api/user/notifications', userNotificationRoutes); // ✅ NEW
app.use('/api/banners', bannerRoutes);
app.use('/api/property-views', userPropertyViewRoutes);
app.use('/api/admin/property-views', adminPropertyViewRoutes);

// Useer Routes (Interior Design Views)
app.use('/api/user/interior-design-views', interiorDesignViewUserRoute);

// Admin Routes (Interior Design Views)
app.use('/api/admin/interior-design-views', interiorDesignViewAdminRoute);
// 🔽 ADD

// 🔽 ADD
app.use("/uploads", express.static("uploads"));
app.use('/api/saved', savedPropertiesRoutes);


// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
// Temporary debug route
app.get('/api/debug/images', async (req, res) => {
  const Property = (await import('./UserModels/Property.js')).default;
  const prop = await Property.findOne({ images: { $exists: true, $ne: [] } });
  res.json({
    sampleImagePath: prop?.images[0],
    fullUrl: `http://localhost:8000/${prop?.images[0]}`
  });
});
// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // ✅ Start notification scheduler
  startNotificationScheduler();
});