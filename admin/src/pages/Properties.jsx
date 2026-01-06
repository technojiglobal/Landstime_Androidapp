// Landstime_Androidapp/admin/src/pages/Properties.jsx

import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/properties/StatCard";
import PropertyModal from "../components/properties/PropertyModal";
import Toast from "../components/UserManagement/Toast";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Building2,
  Clock,
  X,
} from "lucide-react";
import {
  fetchAllProperties,
  updatePropertyStatus,
  softDeleteProperty,
  updatePropertyAvailability, 
  updatePropertyDetails,
} from "../services/propertyService";

// Helper function to safely extract string from translation object
const getTranslatedText = (value, fallback = 'N/A') => {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value.en || value.hi || value.te || fallback;
  }
  return fallback;
};

/* ---------------- COMPONENT ---------------- */
export default function Properties() {
  const [properties, setProperties] = useState([]);

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  /* ---------- FILTER (ALL COLUMNS) ---------- */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return properties.filter((p) =>
      Object.values(p)
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [properties, search]);

  /* ---------- PAGINATION ---------- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const start = filtered.length ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, filtered.length);

  /* ---------- ACTIONS ---------- */
  // Delete property (soft delete)
  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }
    
    try {
      await softDeleteProperty(id);
      setToast('Property deleted successfully');
      loadProperties();
    } catch (error) {
      console.error('Delete failed', error);
      setToast('Failed to delete property');
    }
  };

  // Update property availability status
  const handlePropertyStatusChange = async (id, newStatus) => {
    try {
      await updatePropertyAvailability(id, newStatus);
      setToast(`Property marked as ${newStatus}`);
      loadProperties();
    } catch (error) {
      console.error('Status update failed', error);
      setToast('Failed to update property status');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await updatePropertyStatus(id, status);
      setToast(`Property ${status}`);
      loadProperties();
    } catch (error) {
      console.error("Status update failed", error);
      setToast('Failed to update status');
    }
  };

  const loadProperties = async () => {
    try {
      const data = await fetchAllProperties();

      const formatted = data.map((p) => {
        // Determine subscription display
        let subscriptionDisplay = 'Freemium';
        
        if (p.userId?.currentSubscription?.status === 'active') {
          subscriptionDisplay = p.userId.currentSubscription.planName || 
                               p.userId.currentSubscription.planId?.toUpperCase() || 
                               'Active';
        }

        return {
          id: p._id,
          // Fixed: Use helper function to extract string from translation object
          title: getTranslatedText(p.propertyTitle, 'Untitled Property'),
          location: getTranslatedText(p.location, 'Unknown Location'),
          type: p.propertyType || 'N/A',
          price: `₹${p.expectedPrice || 0}`,
          status: p.status || 'pending',
          propertyStatus: p.propertyStatus || 'Available',
          subscription: subscriptionDisplay,
          sold: p.propertyStatus === 'Sold',
          uploaded: new Date(p.createdAt).toLocaleDateString(),
          owner: p.ownerDetails?.name || 'N/A',
          phone: p.ownerDetails?.phone || 'N/A',
          email: p.ownerDetails?.email || 'N/A',
          description: getTranslatedText(p.description, 'No description'),
          // Prefer absolute URLs from backend if available, else normalize local paths
          images: (p.imageUrls && p.imageUrls.length > 0)
            ? p.imageUrls
                .filter(v => typeof v === "string")
                .map(v => v.replace(/\\/g, "/"))
            : (p.images || [])
                .filter(v => typeof v === "string")
                .map(v => v.replace(/\\/g, "/")),

          documents: {
            ownership: (p.documentUrls?.ownership && p.documentUrls.ownership.length > 0)
              ? p.documentUrls.ownership
                  .filter(v => typeof v === "string")
                  .map(v => v.replace(/\\/g, "/"))
              : (p.documents?.ownership || [])
                  .filter(v => typeof v === "string")
                  .map(v => v.replace(/\\/g, "/")),

            identity: (p.documentUrls?.identity && p.documentUrls.identity.length > 0)
              ? p.documentUrls.identity
                  .filter(v => typeof v === "string")
                  .map(v => v.replace(/\\/g, "/"))
              : (p.documents?.identity || [])
                  .filter(v => typeof v === "string")
                  .map(v => v.replace(/\\/g, "/"))
          },
          raw: p, // Keep the entire raw object
        };
      });

      setProperties(formatted);
    } catch (err) {
      console.error("Failed to fetch properties", err);
      setToast('Failed to fetch properties');
    }
  };

  /* ---------- STATS ---------- */
  const stats = useMemo(() => {
    const total = properties.length;
    const approved = properties.filter(p => p.status === "approved").length;
    const pending = properties.filter(p => p.status === "pending").length;
    const rejected = properties.filter(p => p.status === "rejected").length;

    return [
      { title: "Total Properties", value: total, icon: Building2, color: "blue" },
      { title: "Approved", value: approved, icon: CheckCircle, color: "green" },
      { title: "Pending", value: pending, icon: Clock, color: "yellow" },
      { title: "Rejected", value: rejected, icon: X, color: "red" },
    ];
  }, [properties]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Upload Button */}
      <div className="flex justify-end">
        <button
          onClick={() => alert("Upload Property Clicked")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={16} /> Upload Property
        </button>
      </div>

      {/* Search + Page Size */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={pageSize}
          onChange={(e) => setPageSize(+e.target.value)}
          className="border rounded-lg px-3 py-2 w-full sm:w-auto"
        >
          {[5, 10, 15, 20].map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
      </div>

      {/* Table (Responsive) */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Property", "Type", "Price", "Status", "Property Status", "Uploaded", "Owner", "Subscription", "Phone", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-gray-500 font-medium"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {paginated.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3">
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-gray-500">{p.location}</p>
                </td>
                <td className="px-4 py-3">{p.type}</td>
                <td className="px-4 py-3">{p.price}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      p.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : p.status === "pending"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-500 text-white"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <select
                    value={p.propertyStatus}
                    onChange={(e) => handlePropertyStatusChange(p.id, e.target.value)}
                    className={`text-xs border rounded px-2 py-1 cursor-pointer ${
                      p.propertyStatus === 'Sold' 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                  </select>
                </td>

                <td className="px-4 py-3">{p.uploaded}</td>
                <td className="px-4 py-3">{p.owner}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      p.subscription === 'Freemium'
                        ? 'bg-gray-100 text-gray-600'
                        : p.subscription.toLowerCase().includes('gold')
                        ? 'bg-yellow-100 text-yellow-700'
                        : p.subscription.toLowerCase().includes('platinum')
                        ? 'bg-blue-100 text-blue-700'
                        : p.subscription.toLowerCase().includes('diamond')
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {p.subscription}
                  </span>
                </td>
                <td className="px-4 py-3">{p.phone}</td>

                <td className="px-4 py-3">
                  <div className="flex gap-3 items-center">
                    {/* View Icon */}
                    <Eye
                      size={16}
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                      onClick={() => setSelected(p)}
                      title="View Details"
                    />
                    
                    {/* Status Dropdown */}
                    <select
                      value={p.status}
                      onChange={(e) => updateStatus(p.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    
                    {/* Delete Icon */}
                    <X
                      size={16}
                      className="cursor-pointer text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteProperty(p.id)}
                      title="Delete Property"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <span>
          Showing {start} to {end} of {filtered.length} entries
        </span>

        <div className="flex items-center gap-4">
          <ChevronLeft
            className={page === 1 ? "opacity-40" : "cursor-pointer"}
            onClick={() => page > 1 && setPage(page - 1)}
          />
          <span className="font-medium text-gray-800">
            Page {page} of {totalPages}
          </span>
          <ChevronRight
            className={page === totalPages ? "opacity-40" : "cursor-pointer"}
            onClick={() => page < totalPages && setPage(page + 1)}
          />
        </div>
      </div>

      {selected && (
        <PropertyModal 
          property={selected} 
          onClose={() => setSelected(null)}
          onUpdate={async (id, updatedData) => {
            try {
              await updatePropertyDetails(id, updatedData);
              setToast('Property updated successfully');
              loadProperties();
            } catch (error) {
              console.error('Update failed', error);
              setToast('Failed to update property');
            }
          }}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}