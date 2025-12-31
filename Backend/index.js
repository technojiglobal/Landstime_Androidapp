// // Backend/index.js
// import 'dotenv/config';
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import userRoutes from './UserRoutes/UserRoute.js';
// import propertyRoutes from './UserRoutes/PropertyRoute.js';
// import subscriptionRoutes from './UserRoutes/SubscriptionRoute.js';
// import adminAuthRoutes from "./AdminRoutes/AdminRoute.js";

// const app = express();
// const PORT = process.env.PORT || 8000;

// // Middleware
// // ✅ NEW CODE
// app.use(cors({
//   origin: [
//     'http://localhost:8081',           // React Native/Expo
//     'http://192.168.31.115:8081',      // React Native/Expo (network)
//     'http://localhost:5173'            // Admin Panel (Vite)
//   ],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/api/admin", adminAuthRoutes);
// // MongoDB Connection with better error handling
// console.log('🔍 Attempting MongoDB connection...');
// console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI exists ✅' : 'URI missing ❌');

// mongoose.connect(process.env.MONGODB_URI, {
//   serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
//   socketTimeoutMS: 45000,
// })
//   .then(() => {
//     console.log('✅ MongoDB Connected Successfully');
//     console.log('📊 Database:', mongoose.connection.name);
//   })
//   .catch((err) => {
//     console.error('❌ MongoDB Connection Error:', err.message);
//     console.log('\n💡 Troubleshooting Steps:');
//     console.log('   1. Check MongoDB Atlas → Network Access → Whitelist your IP');
//     console.log('   2. Verify your MongoDB credentials');
//     console.log('   3. Check if cluster is active (not paused)');
//     console.log('   4. Try: 0.0.0.0/0 for "Allow from Anywhere"\n');
//   });

// // Monitor connection status
// mongoose.connection.on('connected', () => {
//   console.log('🟢 Mongoose connected to MongoDB');
// });

// mongoose.connection.on('error', (err) => {
//   console.error('🔴 Mongoose connection error:', err.message);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('🟡 Mongoose disconnected from MongoDB');
// });

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   await mongoose.connection.close();
//   console.log('MongoDB connection closed due to app termination');
//   process.exit(0);
// });

// // Root Route
// app.get('/', (req, res) => {
//   res.json({ 
//     success: true,
//     message: 'LandsTime API Server is running',
//     version: '1.0.0'
//   });
// });

// // User Routes
// app.use('/api/user', userRoutes);
// app.use('/api/properties', propertyRoutes);
// app.use('/api/subscriptions', subscriptionRoutes); // NEW


// // 404 Handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found'
//   });
// });

// // Error Handler
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).json({
//     success: false,
//     message: 'Internal server error',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📱 Environment: ${process.env.NODE_ENV}`);
// });


// Backend/index.js
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './UserRoutes/UserRoute.js';
import propertyRoutes from './UserRoutes/PropertyRoute.js';
import subscriptionRoutes from './UserRoutes/SubscriptionRoute.js';
import adminAuthRoutes from "./AdminRoutes/AdminRoute.js";
import interiorDesignRoutes from "./AdminRoutes/InteriorDesignRoute.js"; // NEW

const app = express();
const PORT = process.env.PORT || 8000;

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8081',           // React Native/Expo
    'http://192.168.31.115:8081',      // React Native/Expo (network)
    'http://localhost:5173'            // Admin Panel (Vite)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' })); // Increased for image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
console.log("✅ Static middleware about to mount");
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log("✅ Static middleware mounted");


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
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/interior', interiorDesignRoutes); // NEW

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

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
});