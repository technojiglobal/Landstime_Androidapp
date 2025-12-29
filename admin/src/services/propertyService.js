// Landstime_Androidapp/admin/src/services/propertyService.js

import axiosInstance from "../utils/axiosInstance";

// Fetch ALL properties (admin)
export const fetchAllProperties = async () => {
  const res = await axiosInstance.get("/admin/all");
  return res.data.data; // backend sends { success, data }
};

// Update property status (approve / reject)
export const updatePropertyStatus = async (id, status) => {
  const res = await axiosInstance.patch(`/admin/${id}/status`, {
    status,
  });
  return res.data.data;
};


// Soft delete property
export const softDeleteProperty = async (id) => {
  const res = await axiosInstance.patch(`/admin/${id}/soft-delete`);
  return res.data;
};

// Update property availability
export const updatePropertyAvailability = async (id, propertyStatus) => {
  const res = await axiosInstance.patch(`/admin/${id}/property-status`, {
    propertyStatus
  });
  return res.data;
};

// Update property details
// Update property details
export const updatePropertyDetails = async (id, updatedData) => {
  const res = await axiosInstance.put(`/admin/${id}/update`, updatedData);
  return res.data.data;
};
