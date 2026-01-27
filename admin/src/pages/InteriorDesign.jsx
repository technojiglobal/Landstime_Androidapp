// Landstime_Androidapp/admin/src/pages/InteriorDesign.jsx
import { useEffect, useMemo, useState } from "react";
import UploadDesignModal from "../components/InteriorDesign/UploadDesignModal";
import Toast from "../components/UserManagement/Toast";
import ViewModal from "../components/InteriorDesign/ViewModal";
import ViewersModal from "../components/InteriorDesign/ViewersModal";
import {
  Search,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
  Trash2,
} from "lucide-react";

const API_URL = "http://localhost:8000/api/admin/interior";
const VIEWERS_API_URL = "http://localhost:8000/api/admin/interior-design-views";

/* ---------------- DATA ---------------- */


/* ---------------- COMPONENT ---------------- */
export default function InteriorDesign() {
  const [tab, setTab] = useState("enquiry");
  const [designs, setDesigns] = useState([]);
  const [designViews, setDesignViews] = useState([]);  // ✅ NEW - for enquiry tab
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [viewersModalDesign, setViewersModalDesign] = useState(null);





  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch designs from backend
  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        search: search,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      const response = await fetch(`${API_URL}/designs?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setDesigns(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
      } else {
        setToast("Failed to fetch designs");
      }
    } catch (error) {
      console.error("Fetch designs error:", error);
      setToast("Error fetching designs");
    } finally {
      setLoading(false);
    }
  };

  // ADD THIS NEW FUNCTION (after fetchDesigns function - around line 110):

// ✅ NEW - Fetch design views for enquiry tab
const fetchDesignViews = async () => {
  try {
    setLoading(true);
    const token = getToken();
    
    if (!token) {
      setToast("Please login as admin");
      return;
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: pageSize.toString(),
      search: search,
      sortBy: "updatedAt",
      sortOrder: "desc"
    });

    const response = await fetch(`${VIEWERS_API_URL}/all?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (data.success) {
      setDesignViews(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
    } else {
      setToast("Failed to fetch design views");
    }
  } catch (error) {
    console.error("Fetch design views error:", error);
    setToast("Error fetching design views");
  } finally {
    setLoading(false);
  }
};

  // Fetch designs when tab changes to "designs"
  useEffect(() => {
  if (tab === "designs") {
    fetchDesigns();
  } else if (tab === "enquiry") {
    fetchDesignViews();  // ✅ Fetch real data for enquiry tab
  }
}, [tab, page, pageSize, search]);

  // Reset page when search or pageSize changes
  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const data = tab === "enquiry" ? designViews : designs;

  /* ---------- SEARCH (ALL COLUMNS) - For Enquiries only ---------- */
  // const filtered = useMemo(() => {
  //   if (tab === "designs") {
  //     return designs; // Server-side search for designs
  //   }

  //   const q = search.toLowerCase();
  //   return data.filter((row) =>
  //     Object.values(row)
  //       .filter(Boolean)
  //       .join(" ")
  //       .toLowerCase()
  //       .includes(q)
  //   );
  // }, [data, search, tab, designs]);


  const filtered = useMemo(() => {
  // Both tabs now use server-side search
  return data;
}, [data]);

  /* ---------- PAGINATION ---------- */
  // const totalPagesCalc =
  //   tab === "designs"
  //     ? totalPages
  //     : Math.max(1, Math.ceil(filtered.length / pageSize));

  // const paginated =
  //   tab === "designs"
  //     ? designs
  //     : filtered.slice((page - 1) * pageSize, page * pageSize);

  // const start =
  //   tab === "designs"
  //     ? totalItems
  //       ? (page - 1) * pageSize + 1
  //       : 0
  //     : filtered.length
  //     ? (page - 1) * pageSize + 1
  //     : 0;

  // const end =
  //   tab === "designs"
  //     ? Math.min(page * pageSize, totalItems)
  //     : Math.min(page * pageSize, filtered.length);

  //NEW CODE (simplified - both use server pagination):
const totalPagesCalc = totalPages;
const paginated = data;
const start = totalItems ? (page - 1) * pageSize + 1 : 0;
const end = Math.min(page * pageSize, totalItems);


  /* ---------- ADD DESIGN ---------- */
  const addDesign = async (design) => {
    try {
      const token = getToken();
      if (!token) {
        setToast("Please login as admin");
        return;
      }

      const formData = new FormData();

      // Append text fields
      formData.append('name', design.name);
      formData.append('designer', design.designer);
      formData.append('phone', design.phone);
      formData.append('area', design.area);
      formData.append('category', design.category); 
      formData.append('price', design.price);
      formData.append('duration', design.duration);
      formData.append('location', design.location);
      if (design.description) formData.append('description', design.description);

      // Append image files
      if (design.images && design.images.length > 0) {
        design.images.forEach((image) => {
  formData.append("images", image);
});

      }

      const response = await fetch(`${API_URL}/designs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setShowUpload(false);
        setToast("Design uploaded successfully");
        fetchDesigns(); // Refresh the list
      } else {
        setToast(data.message || "Failed to upload design");
      }
    } catch (error) {
      console.error("Add design error:", error);
      setToast("Error uploading design");
    }
  };

  /* ---------- DELETE DESIGN ---------- */
  const deleteDesign = async (id) => {
    if (!window.confirm("Are you sure you want to delete this design?")) {
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setToast("Please login as admin");
        return;
      }

      const response = await fetch(`${API_URL}/designs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setToast("Design deleted successfully");
        fetchDesigns(); // Refresh the list
      } else {
        setToast(data.message || "Failed to delete design");
      }
    } catch (error) {
      console.error("Delete design error:", error);
      setToast("Error deleting design");
    }
  };

  // ADD THIS NEW FUNCTION (after deleteDesign function - around line 250):

// ✅ NEW - Update design view status
const updateStatus = async (designId, newStatus) => {
  try {
    const token = getToken();
    if (!token) {
      setToast("Please login as admin");
      return;
    }

    const response = await fetch(`${VIEWERS_API_URL}/design/${designId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await response.json();

    if (data.success) {
      setToast("Status updated successfully");
      fetchDesignViews(); // Refresh the list
    } else {
      setToast(data.message || "Failed to update status");
    }
  } catch (error) {
    console.error("Update status error:", error);
    setToast("Error updating status");
  }
};

  return (
    <div className="space-y-6">
      {/* Tabs + Upload */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <div className="inline-flex bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setTab("enquiry")}
            className={`px-4 py-2 rounded-md ${
              tab === "enquiry" ? "bg-white shadow" : "text-gray-500"
            }`}
          >
            Enquiry Requests
          </button>
          <button
            onClick={() => setTab("designs")}
            className={`px-4 py-2 rounded-md ${
              tab === "designs" ? "bg-white shadow" : "text-gray-500"
            }`}
          >
            Uploaded Designs
          </button>
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={16} /> Upload Design
        </button>
      </div>

      {/* Search + Page Size */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={18}
          />
          <input
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Search ${
              tab === "enquiry" ? "enquiries" : "designs"
            }...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={pageSize}
          onChange={(e) => setPageSize(+e.target.value)}
          className="border rounded-lg px-3 py-2 w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {[5, 10, 15, 20].map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
      </div>

      {/* TABLE (RESPONSIVE) */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
         // OLD CODE (entire table section from line 330-450):
// Replace the ENTIRE table section with this NEW CODE:

<table className="w-full text-sm">
  <thead className="bg-gray-50">
    <tr>
      {tab === "enquiry" ? (
        <>
          <th className="px-4 py-3 text-gray-500 font-semibold text-left">
            Design Title
          </th>
          <th className="px-4 py-3 text-gray-500 font-medium text-left">
            Category
          </th>
          <th className="px-4 py-3 text-gray-500 font-medium text-left">
            Designer
          </th>
          <th className="px-4 py-3 text-gray-500 font-medium text-left">
            Designer Phone
          </th>
          <th className="px-4 py-3 text-gray-500 font-medium text-left">
            Total Views
          </th>
          <th className="px-4 py-3 text-gray-500 font-medium text-left">
            Status
          </th>
          <th className="px-4 py-3 text-gray-500 font-medium text-left">
            Actions
          </th>
        </>
      ) : (
        <>
          <th className="px-4 py-3 text-gray-500 font-semibold text-left">
            Design Name
          </th>
          <th className="px-4 py-3 text-gray-500 font-medium text-left">
            Designer
          </th>
          <th className="px-4 py-3 text-gray-500 font-medium text-left">
            Phone
          </th>
          <th className="px-4 py-3 text-gray-500 font-medium text-left">
            Area
          </th>
          <th className="px-4 py-3 text-gray-500 font-medium text-left">
            Price Range
          </th>
          <th className="px-4 py-3 text-gray-500 font-medium text-left">
            Duration
          </th>
          <th className="px-4 py-3 text-gray-500 font-medium text-left">
            Location
          </th>
          <th className="px-4 py-3 text-gray-500 font-medium text-left">
            Rating
          </th>
          <th className="px-4 py-3 text-gray-500 font-medium text-left">
            Actions
          </th>
        </>
      )}
    </tr>
  </thead>

  <tbody>
    {paginated.length === 0 ? (
      <tr>
        <td
          colSpan={tab === "enquiry" ? 7 : 9}
          className="px-4 py-8 text-center text-gray-500"
        >
          No {tab === "enquiry" ? "design views" : "designs"} found
        </td>
      </tr>
    ) : (
      paginated.map((item) => (
        <tr key={item._id} className="border-t hover:bg-gray-50">
          {tab === "enquiry" ? (
            <>
              <td className="px-4 py-3 font-medium">{item.designTitle}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {item.category}
                </span>
              </td>
              <td className="px-4 py-3">{item.designerName}</td>
              <td className="px-4 py-3">{item.designerPhone}</td>
              <td className="px-4 py-3">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {item.totalViews}
                </span>
              </td>
              <td className="px-4 py-3">
                <select
                  value={item.status || 'In Progress'}
                  onChange={(e) => updateStatus(item.designId, e.target.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border-none outline-none cursor-pointer ${
                    item.status === "Settled"
                      ? "bg-green-100 text-green-700"
                      : item.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : item.status === "Work in Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Work in Progress">Work in Progress</option>
                  <option value="Settled">Settled</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td className="px-4 py-3">
                <Eye
                  size={16}
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                  onClick={() => setViewersModalDesign(item)}
                />
              </td>
            </>
          ) : (
            <>
              <td className="px-4 py-3 font-medium">{item.name}</td>
              <td className="px-4 py-3">{item.designer}</td>
              <td className="px-4 py-3">{item.phone}</td>
              <td className="px-4 py-3">{item.area}</td>
              <td className="px-4 py-3">{item.price.includes('₹') ? item.price : `₹${item.price}`}</td>
              <td className="px-4 py-3">{item.duration}</td>
              <td className="px-4 py-3">{item.location}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Star
                    size={14}
                    className="text-yellow-500 fill-yellow-500"
                  />
                  <span className="font-medium">{item.rating}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Eye
                    size={16}
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => setViewItem(item)}
                  />
                  <Trash2
                    size={16}
                    className="cursor-pointer text-red-600 hover:text-red-800"
                    onClick={() => deleteDesign(item._id)}
                  />
                </div>
              </td>
            </>
          )}
        </tr>
      ))
    )}
  </tbody>
</table>
        )}
      </div>
      {/* FOOTER */}
  <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center text-sm text-gray-500">
    <span>
  Showing {start} to {end} of {totalItems} entries
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
        Page {page} of {totalPagesCalc}
      </span>
      <ChevronRight
        className={
          page === totalPagesCalc
            ? "opacity-40"
            : "cursor-pointer hover:text-blue-600"
        }
        onClick={() => page < totalPagesCalc && setPage(page + 1)}
      />
    </div>
  </div>

  {showUpload && (
    <UploadDesignModal
      onClose={() => setShowUpload(false)}
      onUpload={addDesign}
    />
  )}

  {viewItem && (
  <ViewModal item={viewItem} onClose={() => setViewItem(null)} />
)}

{viewersModalDesign && (
  <ViewersModal
    design={viewersModalDesign}
    onClose={() => setViewersModalDesign(null)}
  />
)}

{toast && <Toast message={toast} onClose={() => setToast("")} />}
</div>
  );
}