import Banner from '../AdminModels/Banner.js';

// Create a new banner
export const createBanner = async (req, res) => {
  try {
    console.log('📥 Banner creation request');
    
    const bannerData = req.body;
    
    console.log('📋 Banner Data:', JSON.stringify(bannerData, null, 2));

    // Validate required fields
    if (!bannerData.title?.en || !bannerData.title?.te || !bannerData.title?.hi) {
      return res.status(400).json({
        success: false,
        message: 'Title in all languages (English, Telugu, Hindi) is required'
      });
    }

    if (!bannerData.subtitle?.en || !bannerData.subtitle?.te || !bannerData.subtitle?.hi) {
      return res.status(400).json({
        success: false,
        message: 'Subtitle in all languages (English, Telugu, Hindi) is required'
      });
    }

    if (!bannerData.image) {
      return res.status(400).json({
        success: false,
        message: 'Banner image is required'
      });
    }

    // Create banner object
    const banner = new Banner({
      title: bannerData.title,
      subtitle: bannerData.subtitle,
      image: bannerData.image, // Directly use the base64 string
      isActive: bannerData.isActive !== undefined ? bannerData.isActive : true,
      order: bannerData.order || 0,
      ctaText: bannerData.ctaText,
      ctaLink: bannerData.ctaLink
    });

    await banner.save();

    console.log('✅ BANNER SAVED TO DATABASE');
    console.log('🆔 Banner ID:', banner._id);

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: banner
    });

  } catch (error) {
    console.error('❌ Banner creation error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create banner',
      error: error.message
    });
  }
};

// Get all banners (for admin)
export const getAllBanners = async (req, res) => {
  try {
    console.log('📥 Admin fetching all banners');

    const banners = await Banner.find()
      .sort({ order: 1, createdAt: -1 });

    console.log(`✅ Found ${banners.length} banners`);

    res.status(200).json({
      success: true,
      data: banners,
      count: banners.length
    });

  } catch (error) {
    console.error('❌ Get banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banners',
      error: error.message
    });
  }
};

// Get active banners (for mobile app)
export const getActiveBanners = async (req, res) => {
  try {
    const { language = 'en' } = req.query;

    console.log('🔍 Getting active banners for language:', language);

    // Get all active banners, sorted by order
    const banners = await Banner.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    if (!banners || banners.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active banners found'
      });
    }

    // Return banners with language-specific content
    const response = banners.map(banner => ({
      _id: banner._id,
      title: banner.title[language] || banner.title.en,
      subtitle: banner.subtitle[language] || banner.subtitle.en,
      image: banner.image,
      isActive: banner.isActive,
      order: banner.order,
      ctaText: banner.ctaText,
      ctaLink: banner.ctaLink
    }));

    console.log(`✅ Found ${response.length} active banners`);

    res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('❌ Get active banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active banners',
      error: error.message
    });
  }
};

// Get banner by ID
export const getBannerById = async (req, res) => {
  try {
    console.log('🔍 Getting banner by ID:', req.params.id);

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    console.log('✅ Banner found:', banner._id);

    res.status(200).json({
      success: true,
      data: banner
    });

  } catch (error) {
    console.error('❌ Get banner error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid banner ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch banner',
      error: error.message
    });
  }
};

// Update banner
export const updateBanner = async (req, res) => {
  try {
    console.log('📝 Updating banner:', req.params.id);

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    const updateData = req.body;
    console.log('📦 Update data:', updateData);

    // Update banner fields
    if (updateData.title) banner.title = updateData.title;
    if (updateData.subtitle) banner.subtitle = updateData.subtitle;
    if (updateData.image) banner.image = updateData.image; // Expects base64 string
    if (updateData.isActive !== undefined) banner.isActive = updateData.isActive;
    if (updateData.order !== undefined) banner.order = updateData.order;
    if (updateData.ctaText) banner.ctaText = updateData.ctaText;
    if (updateData.ctaLink) banner.ctaLink = updateData.ctaLink;

    await banner.save();

    console.log('✅ Banner updated:', banner._id);

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      data: banner
    });

  } catch (error) {
    console.error('❌ Update banner error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid banner ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update banner',
      error: error.message
    });
  }
};

// Delete banner
export const deleteBanner = async (req, res) => {
  try {
    console.log('🗑️ Deleting banner:', req.params.id);

    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    console.log('✅ Banner deleted:', req.params.id);

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete banner error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid banner ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete banner',
      error: error.message
    });
  }
};

// Toggle banner active status
export const toggleBannerStatus = async (req, res) => {
  try {
    console.log('🔄 Toggling banner status:', req.params.id);

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    console.log('✅ Banner status toggled:', banner._id, 'Active:', banner.isActive);

    res.status(200).json({
      success: true,
      message: `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`,
      data: banner
    });

  } catch (error) {
    console.error('❌ Toggle banner status error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid banner ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to toggle banner status',
      error: error.message
    });
  }
};

// Update banner order (for drag & drop reordering)
export const updateBannerOrder = async (req, res) => {
  try {
    console.log('🔢 Updating banner order');

    const { banners } = req.body; // Array of { id, order }

    if (!Array.isArray(banners)) {
      return res.status(400).json({
        success: false,
        message: 'Banners array is required'
      });
    }

    // Update each banner's order
    const updatePromises = banners.map(({ id, order }) =>
      Banner.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    console.log('✅ Banner order updated');

    res.status(200).json({
      success: true,
      message: 'Banner order updated successfully'
    });

  } catch (error) {
    console.error('❌ Update banner order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update banner order',
      error: error.message
    });
  }
};