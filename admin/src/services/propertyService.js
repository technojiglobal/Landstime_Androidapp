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
