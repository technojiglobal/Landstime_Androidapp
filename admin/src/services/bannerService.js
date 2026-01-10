import axios from '../utils/axiosInstance';

export const bannerService = {
  // Get all banners (admin)
  getAllBanners: async () => {
    const response = await axios.get('/banners');
    return response.data;
  },

  // Get active banner (mobile app)
  getActiveBanner: async (language = 'en') => {
    const response = await axios.get('/banners/active', {
      params: { language }
    });
    return response.data;
  },

  // Create banner
  createBanner: async (formData) => {
    const response = await axios.post('/banners', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update banner
  updateBanner: async (id, formData) => {
    const response = await axios.put(`/banners/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete banner
  deleteBanner: async (id) => {
    const response = await axios.delete(`/banners/${id}`);
    return response.data;
  },

  // Toggle banner status
  toggleBannerStatus: async (id) => {
    const response = await axios.patch(`/banners/${id}/toggle`);
    return response.data;
  },
};