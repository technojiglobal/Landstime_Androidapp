// admin/src/components/interiorDesignViewers/ViewersModal.jsx

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Award } from "lucide-react";

const API_URL = "http://localhost:8000/api/admin/interior-design-views";

export default function ViewersModal({ design, onClose }) {
  const [viewers, setViewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch viewers for this design
  const fetchViewers = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        console.error("No token found");
        return;
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        sortBy: "viewedAt",
        sortOrder: "desc"
      });

      const response = await fetch(
        `${API_URL}/design/${design.designId}?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setViewers(data.data.viewers);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
      }
    } catch (error) {
      console.error("Fetch viewers error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (design) {
      fetchViewers();
    }
  }, [design, page]);

  // Get plan badge color
  const getPlanBadge = (plan) => {
    if (!plan) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">None</span>;
    }
    
    const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
    
    switch (plan.toLowerCase()) {
      case 'gold':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
          <Award size={12} /> {planName}
        </span>;
      case 'platinum':
        return <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium flex items-center gap-1">
          <Award size={12} /> {planName}
        </span>;
      case 'diamond':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
          <Award size={12} /> {planName}
        </span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">None</span>;
    }
  };

  const start = totalItems ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{design.designTitle}</h2>
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {design.category}
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  Designer: {design.designerName}
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  Total Views: {design.totalViews}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : viewers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No viewers yet for this design
            </div>
          ) : (
            <>
              {/* Viewers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                        Viewer Name
                      </th>
                      <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                        Subscription Plan
                      </th>
                      <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                        Viewed Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewers.map((viewer, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {viewer.userName}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {viewer.userPhone}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {viewer.userEmail}
                        </td>
                        <td className="px-4 py-3">
                          {getPlanBadge(viewer.subscriptionPlan)}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(viewer.viewedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center text-sm text-gray-500">
                  <span>
                    Showing {start} to {end} of {totalItems} viewers
                  </span>

                  <div className="flex items-center gap-4">
                    <ChevronLeft
                      className={
                        page === 1
                          ? "opacity-40"
                          : "cursor-pointer hover:text-blue-600"
                      }
                      onClick={() => page > 1 && setPage(page - 1)}
                    />
                    <span className="font-medium text-gray-800">
                      Page {page} of {totalPages}
                    </span>
                    <ChevronRight
                      className={
                        page === totalPages
                          ? "opacity-40"
                          : "cursor-pointer hover:text-blue-600"
                      }
                      onClick={() => page < totalPages && setPage(page + 1)}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}