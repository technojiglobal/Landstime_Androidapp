// Backend/AdminControllers/DashboardController.js

import User from '../UserModels/User.js';
import Property from '../UserModels/Property.js';
import Subscription from '../UserModels/Subscription.js';
import Notification from '../AdminModels/Notification.js';

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/dashboard/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    // Get current date for trend calculations
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Total Subscribers
    const totalSubscribers = await User.countDocuments({ 
      role: { $in: ['Buyer', 'Owner'] } 
    });
    const lastMonthSubscribers = await User.countDocuments({
      role: { $in: ['Buyer', 'Owner'] },
      createdAt: { $lte: lastMonth }
    });
    const subscriberTrend = lastMonthSubscribers > 0 
      ? (((totalSubscribers - lastMonthSubscribers) / lastMonthSubscribers) * 100).toFixed(0)
      : 0;

    // Total Revenue (from active subscriptions)
    const activeSubscriptions = await Subscription.find({
      status: 'active',
      endDate: { $gte: now }
    });
    
    const totalRevenue = activeSubscriptions.reduce((sum, sub) => {
      return sum + (sub.amount || 0);
    }, 0);

    // Last month revenue
    const lastMonthActiveSubscriptions = await Subscription.find({
      status: 'active',
      createdAt: { $lte: lastMonth },
      endDate: { $gte: lastMonth }
    });
    
    const lastMonthRevenue = lastMonthActiveSubscriptions.reduce((sum, sub) => {
      return sum + (sub.amount || 0);
    }, 0);

    const revenueTrend = lastMonthRevenue > 0
      ? (((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(0)
      : 0;

    // Premium Users (users with active subscriptions)
    const premiumUsers = await User.countDocuments({
      role: { $in: ['Buyer', 'Owner'] },
      'currentSubscription.status': 'active',
      'currentSubscription.endDate': { $gte: now }
    });

    const lastMonthPremiumUsers = await User.countDocuments({
      role: { $in: ['Buyer', 'Owner'] },
      'currentSubscription.status': 'active',
      'currentSubscription.endDate': { $gte: lastMonth },
      createdAt: { $lte: lastMonth }
    });

    const premiumTrend = lastMonthPremiumUsers > 0
      ? (((premiumUsers - lastMonthPremiumUsers) / lastMonthPremiumUsers) * 100).toFixed(0)
      : 0;

    // Total Properties
    const totalProperties = await Property.countDocuments({ adminDeletedStatus: 'active' });
    const lastMonthProperties = await Property.countDocuments({
      adminDeletedStatus: 'active',
      createdAt: { $lte: lastMonth }
    });
    const propertyTrend = lastMonthProperties > 0
      ? (((totalProperties - lastMonthProperties) / lastMonthProperties) * 100).toFixed(0)
      : 0;

    // Approved Properties
    const approvedProperties = await Property.countDocuments({
      status: 'approved',
      adminDeletedStatus: 'active'
    });

    // Pending Approval
    const pendingProperties = await Property.countDocuments({
      status: 'pending',
      adminDeletedStatus: 'active'
    });

    // Rejected Properties
    const rejectedProperties = await Property.countDocuments({
      status: 'rejected',
      adminDeletedStatus: 'active'
    });

    const stats = [
      {
        title: 'Total Subscribers',
        value: totalSubscribers.toString(),
        icon: 'Users',
        color: 'blue',
        trend: `${subscriberTrend >= 0 ? '+' : ''}${subscriberTrend}% from last month`
      },
      {
        title: 'Total Revenue',
        value: `₹${totalRevenue.toLocaleString()}`,
        icon: 'DollarSign',
        color: 'green',
        trend: `${revenueTrend >= 0 ? '+' : ''}${revenueTrend}% from last month`
      },
      {
        title: 'Premium Users',
        value: premiumUsers.toString(),
        icon: 'Crown',
        color: 'purple',
        trend: `${premiumTrend >= 0 ? '+' : ''}${premiumTrend}% from last month`
      },
      {
        title: 'Total Properties',
        value: totalProperties.toString(),
        icon: 'Building2',
        color: 'indigo',
        trend: `${propertyTrend >= 0 ? '+' : ''}${propertyTrend}% from last month`
      },
      {
        title: 'Approved Properties',
        value: approvedProperties.toString(),
        icon: 'CheckCircle',
        color: 'green'
      },
      {
        title: 'Pending Approval',
        value: pendingProperties.toString(),
        icon: 'Clock',
        color: 'yellow'
      },
      {
        title: 'Rejected Properties',
        value: rejectedProperties.toString(),
        icon: 'XCircle',
        color: 'red'
      }
    ];

    res.status(200).json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Get recent properties
 * @route   GET /api/admin/dashboard/recent-properties
 * @access  Private/Admin
 */
export const getRecentProperties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const properties = await Property.find({ adminDeletedStatus: 'active' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('propertyTitle location status createdAt')
      .lean();

    const formattedProperties = properties.map(property => ({
      name: property.propertyTitle?.en || property.propertyTitle?.te || property.propertyTitle?.hi || 'Untitled Property',
      location: `${property.location?.en || property.location?.te || property.location?.hi || 'N/A'}`,
      status: property.status === 'approved' ? 'verified' : 
              property.status === 'rejected' ? 'rejected' : 'pending'
    }));

    res.status(200).json({
      success: true,
      properties: formattedProperties
    });

  } catch (error) {
    console.error('Error fetching recent properties:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent properties',
      error: error.message
    });
  }
};

/**
 * @desc    Get recent notifications
 * @route   GET /api/admin/dashboard/recent-notifications
 * @access  Private/Admin
 */
export const getRecentNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;

    const notifications = await Notification.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title message status sentDate scheduledDate createdAt')
      .lean();

    const formattedNotifications = notifications.map(notification => ({
      title: notification.title,
      desc: notification.message,
      status: notification.status === 'delivered' ? 'delivered' :
              notification.status === 'pending' ? 'pending' : 
              notification.status === 'completed' ? 'completed' : 'pending'
    }));

    res.status(200).json({
      success: true,
      notifications: formattedNotifications
    });

  } catch (error) {
    console.error('Error fetching recent notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent notifications',
      error: error.message
    });
  }
};

/**
 * @desc    Get complete dashboard data (stats + properties + notifications)
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
export const getDashboardData = async (req, res) => {
  try {
    // Get all data in parallel
    const [statsResponse, propertiesResponse, notificationsResponse] = await Promise.all([
      getDashboardStatsData(),
      getRecentPropertiesData(5),
      getRecentNotificationsData(4)
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: statsResponse,
        properties: propertiesResponse,
        notifications: notificationsResponse
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

// Helper functions (for getDashboardData)
async function getDashboardStatsData() {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  // Total Subscribers
  const totalSubscribers = await User.countDocuments({ 
    role: { $in: ['Buyer', 'Owner'] } 
  });
  const lastMonthSubscribers = await User.countDocuments({
    role: { $in: ['Buyer', 'Owner'] },
    createdAt: { $lte: lastMonth }
  });
  const subscriberTrend = lastMonthSubscribers > 0 
    ? (((totalSubscribers - lastMonthSubscribers) / lastMonthSubscribers) * 100).toFixed(0)
    : 0;

  // Total Revenue
  const activeSubscriptions = await Subscription.find({
    status: 'active',
    endDate: { $gte: now }
  });
  
  const totalRevenue = activeSubscriptions.reduce((sum, sub) => {
    return sum + (sub.amount || 0);
  }, 0);

  const lastMonthActiveSubscriptions = await Subscription.find({
    status: 'active',
    createdAt: { $lte: lastMonth },
    endDate: { $gte: lastMonth }
  });
  
  const lastMonthRevenue = lastMonthActiveSubscriptions.reduce((sum, sub) => {
    return sum + (sub.amount || 0);
  }, 0);

  const revenueTrend = lastMonthRevenue > 0
    ? (((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(0)
    : 0;

  // Premium Users
  const premiumUsers = await User.countDocuments({
    role: { $in: ['Buyer', 'Owner'] },
    'currentSubscription.status': 'active',
    'currentSubscription.endDate': { $gte: now }
  });

  const lastMonthPremiumUsers = await User.countDocuments({
    role: { $in: ['Buyer', 'Owner'] },
    'currentSubscription.status': 'active',
    'currentSubscription.endDate': { $gte: lastMonth },
    createdAt: { $lte: lastMonth }
  });

  const premiumTrend = lastMonthPremiumUsers > 0
    ? (((premiumUsers - lastMonthPremiumUsers) / lastMonthPremiumUsers) * 100).toFixed(0)
    : 0;

  // Total Properties
  const totalProperties = await Property.countDocuments({ adminDeletedStatus: 'active' });
  const lastMonthProperties = await Property.countDocuments({
    adminDeletedStatus: 'active',
    createdAt: { $lte: lastMonth }
  });
  const propertyTrend = lastMonthProperties > 0
    ? (((totalProperties - lastMonthProperties) / lastMonthProperties) * 100).toFixed(0)
    : 0;

  // Approved Properties
  const approvedProperties = await Property.countDocuments({
    status: 'approved',
    adminDeletedStatus: 'active'
  });

  // Pending Approval
  const pendingProperties = await Property.countDocuments({
    status: 'pending',
    adminDeletedStatus: 'active'
  });

  // Rejected Properties
  const rejectedProperties = await Property.countDocuments({
    status: 'rejected',
    adminDeletedStatus: 'active'
  });

  return [
    {
      title: 'Total Subscribers',
      value: totalSubscribers.toString(),
      icon: 'Users',
      color: 'blue',
      trend: `${subscriberTrend >= 0 ? '+' : ''}${subscriberTrend}% from last month`
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'green',
      trend: `${revenueTrend >= 0 ? '+' : ''}${revenueTrend}% from last month`
    },
    {
      title: 'Premium Users',
      value: premiumUsers.toString(),
      icon: 'Crown',
      color: 'purple',
      trend: `${premiumTrend >= 0 ? '+' : ''}${premiumTrend}% from last month`
    },
    {
      title: 'Total Properties',
      value: totalProperties.toString(),
      icon: 'Building2',
      color: 'indigo',
      trend: `${propertyTrend >= 0 ? '+' : ''}${propertyTrend}% from last month`
    },
    {
      title: 'Approved Properties',
      value: approvedProperties.toString(),
      icon: 'CheckCircle',
      color: 'green'
    },
    {
      title: 'Pending Approval',
      value: pendingProperties.toString(),
      icon: 'Clock',
      color: 'yellow'
    },
    {
      title: 'Rejected Properties',
      value: rejectedProperties.toString(),
      icon: 'XCircle',
      color: 'red'
    }
  ];
}

async function getRecentPropertiesData(limit = 5) {
  const properties = await Property.find({ adminDeletedStatus: 'active' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('propertyTitle location status createdAt')
    .lean();

  return properties.map(property => ({
    name: property.propertyTitle?.en || property.propertyTitle?.te || property.propertyTitle?.hi || 'Untitled Property',
    location: `${property.location?.en || property.location?.te || property.location?.hi || 'N/A'}`,
    status: property.status === 'approved' ? 'verified' : 
            property.status === 'rejected' ? 'rejected' : 'pending'
  }));
}

async function getRecentNotificationsData(limit = 4) {
  const notifications = await Notification.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('title message status sentDate scheduledDate createdAt')
    .lean();

  return notifications.map(notification => ({
    title: notification.title,
    desc: notification.message,
    status: notification.status === 'delivered' ? 'delivered' :
            notification.status === 'pending' ? 'pending' : 
            notification.status === 'completed' ? 'completed' : 'pending'
  }));
}