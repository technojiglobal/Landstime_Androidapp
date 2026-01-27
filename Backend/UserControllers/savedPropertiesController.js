// Backend/UserControllers/savedPropertiesController.js
import SavedProperty from '../UserModels/SavedProperty.js';

// Save a property or interior
export const saveProperty = async (req, res) => {
  try {
    console.log('📝 Save request received');
    console.log('User:', req.user?._id);
    console.log('Body:', req.body);
    
    const { entityId, entityType } = req.body;
    const userId = req.user._id;

    // Validate entityType
    if (!['Property', 'InteriorDesign'].includes(entityType)) {
      console.log('❌ Invalid entity type:', entityType);
      return res.status(400).json({
        success: false,
        message: 'Invalid entity type. Must be "Property" or "InteriorDesign"'
      });
    }

    console.log('✅ Entity type valid:', entityType);

    // Check if already saved
    console.log('🔍 Checking if already saved...');
    const existing = await SavedProperty.findOne({
      user: userId,
      entityId,
      entityType
    });

    if (existing) {
      console.log('⚠️ Already saved:', existing);
      return res.status(400).json({
        success: false,
        message: 'Already saved'
      });
    }

    console.log('✅ Not saved yet, creating new entry...');

    // Create new saved entry
    const saved = await SavedProperty.create({
      user: userId,
      entityId,
      entityType
    });

    

    res.status(201).json({
      success: true,
      message: 'Saved successfully',
      data: saved
    });
  } catch (error) {
    console.error('❌ Save error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to save property',
      error: error.message
    });
  }
};

// Unsave a property or interior
export const unsaveProperty = async (req, res) => {
  try {
    const { entityId, entityType } = req.body;
    const userId = req.user._id;

    const result = await SavedProperty.findOneAndDelete({
      user: userId,
      entityId,
      entityType
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Saved item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Unsaved successfully'
    });
  } catch (error) {
    console.error('Error unsaving property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsave property',
      error: error.message
    });
  }
};

// Get all saved properties for a user
export const getSavedProperties = async (req, res) => {
  try {
    const userId = req.user._id;
    const { entityType } = req.query; // Optional filter by type

    const query = { user: userId };
    if (entityType) {
      query.entityType = entityType;
    }

    const saved = await SavedProperty.find(query)
      .populate({
        path: 'entityId',
        select: 'propertyTitle propertyType expectedPrice images location area areaKey name description price duration images'
      })
      .sort({ createdAt: -1 });

    // Filter out any null populated entities (in case property/interior was deleted)
    const validSaved = saved.filter(item => item.entityId !== null);

    res.status(200).json({
      success: true,
      count: validSaved.length,
      data: validSaved
    });
  } catch (error) {
    console.error('Error fetching saved properties:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch saved properties',
      error: error.message
    });
  }
};

// Check if a property is saved
export const checkIfSaved = async (req, res) => {
  try {
    const { entityId, entityType } = req.query;
    const userId = req.user._id;

    const saved = await SavedProperty.findOne({
      user: userId,
      entityId,
      entityType
    });

    res.status(200).json({
      success: true,
      isSaved: !!saved
    });
  } catch (error) {
    console.error('Error checking saved status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check saved status',
      error: error.message
    });
  }
};