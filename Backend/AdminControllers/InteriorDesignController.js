// Backend/Controllers/InteriorDesignController.js

import InteriorDesign from '../AdminModels/InteriorDesign.js';

// Get all interior designs (with pagination, search, and filters)
export const getAllDesigns = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minRating,
      location
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = { isActive: true };

    // Search across multiple fields
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { designer: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by rating
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const [designs, total] = await Promise.all([
      InteriorDesign.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('uploadedBy', 'name email')
        .lean(),
      InteriorDesign.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: designs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
  } catch (error) {
    console.error('Get all designs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interior designs',
      error: error.message
    });
  }
};

// Get single design by ID
export const getDesignById = async (req, res) => {
  try {
    const { id } = req.params;

    const design = await InteriorDesign.findById(id)
      .populate('uploadedBy', 'name email')
      .lean();

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Interior design not found'
      });
    }

    res.status(200).json({
      success: true,
      data: design
    });
  } catch (error) {
    console.error('Get design by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interior design',
      error: error.message
    });
  }
};

// Create new design (Admin only)
export const createDesign = async (req, res) => {
  try {
    const {
      name,
      designer,
      phone,
      area,
      price,
      duration,
      location,
      rating,
      description
    } = req.body;

    // Validation
    if (!name || !designer || !phone || !area || !price || !duration || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Handle uploaded images
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => `/uploads/interior-designs/${file.filename}`);
    }

    // Create new design
    const newDesign = new InteriorDesign({
      name,
      designer,
      phone,
      area,
      price,
      duration,
      location,
      rating: rating || 4.8,
      description,
      images: imageUrls,
      features: [],
      uploadedBy: req.adminId // From middleware
    });

    await newDesign.save();

    res.status(201).json({
      success: true,
      message: 'Interior design created successfully',
      data: newDesign
    });
  } catch (error) {
    console.error('Create design error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create interior design',
      error: error.message
    });
  }
};

// Update design (Admin only)
export const updateDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.uploadedBy;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedDesign = await InteriorDesign.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedDesign) {
      return res.status(404).json({
        success: false,
        message: 'Interior design not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Interior design updated successfully',
      data: updatedDesign
    });
  } catch (error) {
    console.error('Update design error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update interior design',
      error: error.message
    });
  }
};

// Delete design (Admin only - soft delete)
export const deleteDesign = async (req, res) => {
  try {
    const { id } = req.params;

    const design = await InteriorDesign.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Interior design not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Interior design deleted successfully'
    });
  } catch (error) {
    console.error('Delete design error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete interior design',
      error: error.message
    });
  }
};

// Permanently delete design (Admin only)
export const permanentDeleteDesign = async (req, res) => {
  try {
    const { id } = req.params;

    const design = await InteriorDesign.findByIdAndDelete(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Interior design not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Interior design permanently deleted'
    });
  } catch (error) {
    console.error('Permanent delete design error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to permanently delete interior design',
      error: error.message
    });
  }
};

// Get designs statistics (Admin only)
export const getDesignStats = async (req, res) => {
  try {
    const [totalDesigns, averageRating, designsByLocation] = await Promise.all([
      InteriorDesign.countDocuments({ isActive: true }),
      InteriorDesign.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]),
      InteriorDesign.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$location', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalDesigns,
        averageRating: averageRating[0]?.avgRating || 0,
        designsByLocation
      }
    });
  } catch (error) {
    console.error('Get design stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch design statistics',
      error: error.message
    });
  }
};