// Backend/index.js
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './UserRoutes/UserRoute.js';
//import propertyRoutes from './routes/propertyRoutes.js';
import propertyRoutes from './UserRoutes/PropertyRoute.js';
import adminAuthRoutes from "./AdminRoutes/AdminRoute.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8081', 'http://192.168.31.115:8081'], // Add your frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/admin", adminAuthRoutes);
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Root Route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'LandsTime API Server is running',
    version: '1.0.0'
  });
});

// User Routes
app.use('/api/user', userRoutes);

// NEW CODE - Add this line
app.use('/api/properties', propertyRoutes);

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