// Backend/AdminControllers/InteriorDesignViewController.js

import InteriorDesignView from '../UserModels/InteriorDesignView.js';
import User from '../UserModels/User.js';

// ==================== GET ALL DESIGN VIEWS ====================
export const getAllDesignViews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { designTitle: { $regex: search, $options: 'i' } },
        { designerName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const [designViews, total] = await Promise.all([
      InteriorDesignView.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate({
          path: 'viewers.userId',
          select: 'currentSubscription.planId'
        })
        .lean(),
      InteriorDesignView.countDocuments(query)
    ]);

    // Calculate stats
    const totalDesigns = await InteriorDesignView.countDocuments();
    const totalViewers = await InteriorDesignView.aggregate([
      { $project: { viewerCount: { $size: '$viewers' } } },
      { $group: { _id: null, total: { $sum: '$viewerCount' } } }
    ]);
    
    const designsWithViews = await InteriorDesignView.countDocuments({ totalViews: { $gt: 0 } });
    const avgViews = totalViewers[0]?.total / totalDesigns || 0;

    res.status(200).json({
      success: true,
      data: designViews,
      stats: {
        totalDesigns,
        totalViewers: totalViewers[0]?.total || 0,
        designsWithViews,
        avgViewsPerDesign: parseFloat(avgViews.toFixed(2))
      },
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });

  } catch (error) {
    console.error('❌ Get all design views error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch design views',
      error: error.message
    });
  }
};

// ==================== GET VIEWERS FOR SPECIFIC DESIGN ====================
export const getDesignViewers = async (req, res) => {
  try {
    const { designId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = 'viewedAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const designView = await InteriorDesignView.findOne({ designId })
      .populate({
        path: 'viewers.userId',
        select: 'currentSubscription.planId'
      })
      .lean();

    if (!designView) {
      return res.status(404).json({
        success: false,
        message: 'No views found for this design'
      });
    }

    // Sort viewers
    let viewers = [...designView.viewers];
    viewers.sort((a, b) => {
      if (sortBy === 'viewedAt') {
        return sortOrder === 'asc' 
          ? new Date(a.viewedAt) - new Date(b.viewedAt)
          : new Date(b.viewedAt) - new Date(a.viewedAt);
      }
      return 0;
    });

    // Paginate viewers
    const total = viewers.length;
    const paginatedViewers = viewers.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.status(200).json({
      success: true,
      data: {
        designId: designView.designId,
        designTitle: designView.designTitle,
        designerName: designView.designerName,
        category: designView.category,
        totalViews: designView.totalViews,
        viewers: paginatedViewers
      },
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });

  } catch (error) {
    console.error('❌ Get design viewers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch viewers',
      error: error.message
    });
  }
};

// ==================== EXPORT DESIGN VIEWS TO CSV ====================
export const exportDesignViews = async (req, res) => {
  try {
    const designViews = await InteriorDesignView.find()
      .populate({
        path: 'viewers.userId',
        select: 'currentSubscription.planId'
      })
      .lean();

    // Prepare CSV data
    const csvRows = [];
    
    // Header
    csvRows.push([
      'Design Title',
      'Category',
      'Designer Name',
      'Designer Phone',
      'Total Views',
      'Viewer Name',
      'Viewer Phone',
      'Viewer Email',
      'Subscription Plan',
      'Viewed At'
    ].join(','));

    // Data rows
    designViews.forEach(dv => {
      if (dv.viewers.length === 0) {
        // Design with no views
        csvRows.push([
          `"${dv.designTitle}"`,
          `"${dv.category}"`,
          `"${dv.designerName}"`,
          `"${dv.designerPhone}"`,
          dv.totalViews,
          '',
          '',
          '',
          '',
          ''
        ].join(','));
      } else {
        // Design with viewers
        dv.viewers.forEach(viewer => {
          const planName = viewer.subscriptionPlan 
            ? viewer.subscriptionPlan.charAt(0).toUpperCase() + viewer.subscriptionPlan.slice(1)
            : 'None';
          
          csvRows.push([
            `"${dv.designTitle}"`,
            `"${dv.category}"`,
            `"${dv.designerName}"`,
            `"${dv.designerPhone}"`,
            dv.totalViews,
            `"${viewer.userName}"`,
            `"${viewer.userPhone}"`,
            `"${viewer.userEmail}"`,
            planName,
            new Date(viewer.viewedAt).toLocaleString()
          ].join(','));
        });
      }
    });

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=interior-design-views.csv');
    res.status(200).send(csvContent);

  } catch (error) {
    console.error('❌ Export design views error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export design views',
      error: error.message
    });
  }
};

export const updateDesignViewStatus = async (req, res) => {
  try {
    const { designId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['In Progress', 'Work in Progress', 'Settled', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const designView = await InteriorDesignView.findOneAndUpdate(
      { designId },
      { status },
      { new: true }
    );

    if (!designView) {
      return res.status(404).json({
        success: false,
        message: 'Design view not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: designView
    });

  } catch (error) {
    console.error('❌ Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
};