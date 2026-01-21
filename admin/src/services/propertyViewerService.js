// admin/src/services/propertyViewerService.js

import axiosInstance from '../utils/axiosInstance';

/**
 * Fetch all property views with viewer details
 * Maps to: GET /api/property-views/admin/all
 */
export const fetchAllPropertyViews = async (filters = {}) => {
  try {
    const { subscriptionPlan, startDate, endDate, page = 1, limit = 100 } = filters;
    
    const params = new URLSearchParams();
    if (subscriptionPlan) params.append('subscriptionPlan', subscriptionPlan);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    params.append('page', page);
    params.append('limit', limit);

  const response = await axiosInstance.get(`/admin/property-views/all?${params.toString()}`);
    
    // PropertyView model now contains ownerPhone and ownerEmail
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching property views:', error);
    throw error;
  }
};

/**
 * Fetch viewers for a specific property
 * Maps to: GET /api/property-views/admin/property/:propertyId
 */
export const fetchPropertyViewers = async (propertyId, page = 1, limit = 50) => {
  try {
    const response = await axiosInstance.get(`/admin/property-views/property/${propertyId}?page=${page}&limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching property viewers:', error);
    throw error;
  }
};

/**
 * Export property views data as CSV (client-side generation)
 */
export const exportPropertyViews = async () => {
  try {
    const propertyViews = await fetchAllPropertyViews({ limit: 10000 });
    
    // Create CSV content
    const csvHeader = 'Property Title,Owner Name,Owner Phone,Owner Email,Total Views,Last Updated\n';
    
    const csvRows = propertyViews
      .map((pv) => {
        return [
          `"${(pv.propertyTitle || 'N/A').replace(/"/g, '""')}"`,
          `"${(pv.propertyOwnerName || 'N/A').replace(/"/g, '""')}"`,
          pv.ownerPhone || 'N/A',
          pv.ownerEmail || 'N/A',
          pv.totalViews || 0,
          new Date(pv.updatedAt).toLocaleDateString('en-IN'),
        ].join(',');
      })
      .join('\n');

    const csv = csvHeader + csvRows;
    
    // Convert to blob
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    return blob;
  } catch (error) {
    console.error('Error exporting property views:', error);
    throw error;
  }
};