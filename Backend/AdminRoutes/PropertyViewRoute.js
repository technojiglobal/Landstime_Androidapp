//Backend/AdminRoutes/PropertyViewRoute.js
import express from 'express';
import {
  getPropertyViewers,
  getAllPropertyViews,
  migrateOwnerContacts
} from '../AdminControllers/PropertyViewController.js';
import { verifyAdmin } from '../AdminMiddleware/AdminMiddleware.js';

const router = express.Router();

// Admin routes
router.get('/property/:propertyId', verifyAdmin, getPropertyViewers);
router.get('/all', verifyAdmin, getAllPropertyViews);
// ✅ ADD THIS ROUTE (remove after running once)
router.get('/migrate-contacts', verifyAdmin, migrateOwnerContacts);

// ADD THIS TEMPORARILY
router.get('/migrate-owner-contacts', verifyAdmin, async (req, res) => {
  try {
    const PropertyView = (await import('../UserModels/PropertyView.js')).default;
    const Property = (await import('../UserModels/Property.js')).default;
    
    const views = await PropertyView.find({
      $or: [
        { ownerPhone: { $exists: false } },
        { ownerEmail: { $exists: false } },
        { ownerPhone: null },
        { ownerEmail: null }
      ]
    });
    
    let updated = 0;
    
    for (const view of views) {
      const property = await Property.findById(view.propertyId);
      
      if (property) {
        view.ownerPhone = property.ownerDetails.phone || 'N/A';
        view.ownerEmail = property.ownerDetails.email || 'N/A';
        await view.save();
        updated++;
      }
    }
    
    res.json({
      success: true,
      message: `Updated ${updated} property views with owner contact info`
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;