//admin/src/pages/Properties.jsx
import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/properties/StatCard";
import PropertyModal from "../components/properties/PropertyModal";
import Toast from "../components/UserManagement/Toast";
import Loading from "../components/Loading";
import PropertyUploadModal from "../components/properties/PropertyUploadModal";
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
  Trash,
  X,
  Filter,
} from "lucide-react";
import {
  getAllProperties,
  updatePropertyStatus,
  adminDeleteProperty,
  updatePropertyAvailability, 
  adminUpdateProperty,
} from "../services/propertyService";


// Helper function remains the same...
const getTranslatedText = (value, fallback = 'N/A') => {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value.en || value.hi || value.te || fallback;
  }
  return fallback;
};

export default function Properties() {
const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
const [properties, setProperties] = useState([]);
const [search, setSearch] = useState("");
const [pageSize, setPageSize] = useState(30);
const [page, setPage] = useState(1);
const [selected, setSelected] = useState(null);
const [toast, setToast] = useState("");
const [isLoading, setIsLoading] = useState(true);
const [filterPropertyType, setFilterPropertyType] = useState("All");
const [filterPropertyStatus, setFilterPropertyStatus] = useState("All");
const [filterApprovalStatus, setFilterApprovalStatus] = useState("All");
const [filterUploadedBy, setFilterUploadedBy] = useState("All");


  useEffect(() => {
    loadProperties();
  }, []);

useEffect(() => {
  setPage(1);
}, [search, pageSize, filterPropertyType, filterPropertyStatus, filterApprovalStatus, filterUploadedBy]);

//   /* ---------- FILTER ---------- */
//  const filtered = useMemo(() => {
//   const q = search.toLowerCase();
  
//   return properties.filter((p) => {
//     const matchesSearch = 
//       p.title.toLowerCase().includes(q) ||
//       p.location.toLowerCase().includes(q) ||
//       p.type.toLowerCase().includes(q) ||
//       p.status.toLowerCase().includes(q) ||
//       p.subscription.toLowerCase().includes(q) ||
//       p.owner.toLowerCase().includes(q) ||
//       p.phone.toLowerCase().includes(q);

//     const matchesPropertyType = 
//       filterPropertyType === "All" || 
//       p.type === filterPropertyType;

//     const matchesPropertyStatus = 
//       filterPropertyStatus === "All" || 
//       p.propertyStatus === filterPropertyStatus;

//     const matchesApprovalStatus = 
//       filterApprovalStatus === "All" || 
//       p.status === filterApprovalStatus;

//     return matchesSearch && matchesPropertyType && matchesPropertyStatus && matchesApprovalStatus;
//   });
// }, [properties, search, filterPropertyType, filterPropertyStatus, filterApprovalStatus]);
const safe = (v) => (v != null && typeof v === "string" ? v.toLowerCase() : "");

const filtered = useMemo(() => {
  const q = search.toLowerCase();

  return properties.filter((p) => {
    const matchesSearch =
      safe(p.title).includes(q) ||
      safe(p.location).includes(q) ||
      safe(p.type).includes(q) ||
      safe(p.status).includes(q) ||
      safe(p.subscription).includes(q) ||
      safe(p.owner).includes(q) ||
      safe(p.phone).includes(q);

    const matchesPropertyType =
      filterPropertyType === "All" ||
      (p.type && p.type.trim() === filterPropertyType);

    const matchesPropertyStatus =
      filterPropertyStatus === "All" ||
      (p.propertyStatus && p.propertyStatus.trim() === filterPropertyStatus);

    const matchesApprovalStatus =
      filterApprovalStatus === "All" ||
      (p.status && p.status.toLowerCase() === filterApprovalStatus.toLowerCase());

    const matchesUploadedBy =
      filterUploadedBy === "All" ||
      (p.uploadedBy && p.uploadedBy.toLowerCase() === filterUploadedBy.toLowerCase());

    return (
      matchesSearch &&
      matchesPropertyType &&
      matchesPropertyStatus &&
      matchesApprovalStatus &&
      matchesUploadedBy
    );
  });
}, [properties, search, filterPropertyType, filterPropertyStatus, filterApprovalStatus, filterUploadedBy]);


  /* ---------- PAGINATION ---------- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const start = filtered.length ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, filtered.length);

 

  /* ---------- ACTIONS ---------- */
  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }
    
    try {
      await adminDeleteProperty(id);
      setToast('Property deleted successfully');
      loadProperties();
    } catch (error) {
      console.error('Delete failed', error);
      setToast('Failed to delete property');
    }
  };

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
//src/pages/Properties.jsx
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
  const handlePropertySubmit = async (propertyData) => {
  try {
    // Your API call to create property
    // await createProperty(propertyData);
    console.log('Property Data:', propertyData);
    setToast('Property uploaded successfully!');
    loadProperties();
    setIsUploadModalOpen(false);
  } catch (error) {
    console.error('Error uploading property:', error);
    setToast('Failed to upload property');
  }
};
  const loadProperties = async () => {
    setIsLoading(true);
    const startTime = performance.now();
    
    try {
      const response = await getAllProperties();
      const data = response.data || response;
      console.log(`✅ Fetched ${data.length} properties in ${(performance.now() - startTime).toFixed(0)}ms`);

      const formatted = data.map((p) => {
        let subscriptionDisplay = 'Freemium';
        
        if (p.userId?.currentSubscription?.status === 'active') {
          subscriptionDisplay = p.userId.currentSubscription.planName || 
                               p.userId.currentSubscription.planId?.toUpperCase() || 
                               'Active';
        }

      return {
  id: p._id,
  title: typeof p.propertyTitle === 'string' ? p.propertyTitle : (p.propertyTitle?.en || 'Untitled Property'),
  location: typeof p.location === 'string' ? p.location : (p.location?.en || 'Unknown Location'),
  area: typeof p.area === 'string' ? p.area : (p.area?.en || ''),
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
  uploadedBy: p.uploadedBy || 'user',
          description: getTranslatedText(p.description, 'No description'),
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
          raw: p,
        };
      });

      setProperties(formatted);
     
    } catch (err) {
      console.error("Failed to fetch properties", err.response?.status, err.response?.data || err.message);
      const message = err.response?.data?.message || err.message || 'Failed to fetch properties';
      setToast(message);
    } finally {
      setIsLoading(false);
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

  // Show loading while fetching
 // Show loading while fetching
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Loading message="Loading properties..." size="large" />
      </div>
    );
  }

  return (
    <>
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
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={16} /> Upload Property
        </button>
        
      </div>
     

{/* Move modal here - outside the div */}
<PropertyUploadModal
  isOpen={isUploadModalOpen}
  onClose={() => setIsUploadModalOpen(false)}
  onSubmit={handlePropertySubmit}
/>
    {/* Search + Filters + Page Size */}
<div className="flex flex-col lg:flex-row lg:items-center gap-2">
  
  {/* LEFT: Search + Filters */}
  <div className="flex flex-wrap items-center gap-2">
    
    {/* 🔍 Search Bar (same width as before) */}
    <div className="relative w-full lg:w-[320px]">
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      <input
        className="pl-10 pr-4 py-2 border rounded-lg w-full"
        placeholder="Search properties..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    {/* 🎛 Filters */}
    <div className="flex flex-wrap items-center gap-1">
      <div className="flex items-center gap-2 text-gray-600">
        <Filter size={18} />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <select
        value={filterPropertyType}
        onChange={(e) => setFilterPropertyType(e.target.value)}
        className="border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:border-blue-500"
      >
        <option value="All">All Property Types</option>
        <option value="House">House</option>
        <option value="Site/Plot/Land">Site/Plot/Land</option>
        <option value="Commercial">Commercial</option>
        <option value="Resort">Resort</option>
      </select>

      <select
        value={filterPropertyStatus}
        onChange={(e) => setFilterPropertyStatus(e.target.value)}
        className="border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:border-blue-500"
      >
        <option value="All">All Status</option>
        <option value="Available">Available</option>
        <option value="Sold">Sold</option>
      </select>

      <select
        value={filterApprovalStatus}
        onChange={(e) => setFilterApprovalStatus(e.target.value)}
        className="border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:border-blue-500"
      >
        <option value="All">All Approvals</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      <select
        value={filterUploadedBy}
        onChange={(e) => setFilterUploadedBy(e.target.value)}
        className="border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:border-blue-500"
      >
        <option value="All">All Uploaded By</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  </div>

  {/* RIGHT: Page Size (pushed to corner) */}
  <div className="lg:ml-auto">
    <select
      value={pageSize}
      onChange={(e) => setPageSize(+e.target.value)}
      className="border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:border-blue-500"
    >
      {[5, 10, 15, 20, 30].map((n) => (
        <option key={n} value={n}>
          {n} per page
        </option>
      ))}
    </select>
  </div>
</div>


      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Property", "Type", "Price", "Status", "Property Status", "Uploaded", "Owner", "Subscription", "Phone", "Uploaded By", "Actions"].map(
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
                <td className="px-4 py-3">
  {p.type}
  {p.type === 'Commercial' && p.raw.commercialDetails?.subType && (
    <span className="block text-xs text-gray-500 mt-0.5">
      ({p.raw.commercialDetails.subType})
    </span>
  )}
</td>
                
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
  {/* Show verified badge only for approved properties with admin upload or Diamond subscription */}
  {p.status === "approved" && (p.uploadedBy === "admin" || p.subscription === "Diamond") && (
    <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
      ✓ Verified
    </span>
  )}
</td>

               <td className="px-4 py-3">
  <select
    value={p.propertyStatus}
    onChange={(e) => handlePropertyStatusChange(p.id, e.target.value)}
    className={`text-xs border rounded px-2 py-1 cursor-pointer ${
      p.propertyStatus === 'Sold' 
        ? (p.raw?.soldBy === 'admin' ? 'bg-green-600 text-white' : 'bg-black text-white')
        : 'bg-gray-100 text-gray-700'
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
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      p.uploadedBy === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {p.uploadedBy === 'admin' ? 'Admin' : 'User'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-3 items-center">
                    <Eye
                      size={16}
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                      onClick={() => setSelected(p)}
                      title="View Details"
                    />
                    
                    <select
                      value={p.status}
                      onChange={(e) => updateStatus(p.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    
                    <Trash
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

    {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>

    {/* Move PropertyModal OUTSIDE the main container */}
    {selected && (
      <PropertyModal 
        property={selected} 
        onClose={() => setSelected(null)}
        onUpdate={async (id, updatedData) => {
          try {
            await adminUpdateProperty(id, updatedData);
            setToast('Property updated successfully');
            loadProperties();
          } catch (error) {
            console.error('Update failed', error);
            setToast('Failed to update property');
          }
        }}
      />
    )}
    </>
  );
}