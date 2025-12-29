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
} from "../services/propertyService";

/* ---------------- DATA ---------------- */


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
  const updateStatus = async (id, status) => {
    try {
      await updatePropertyStatus(id, status); // 🔥 DB update
      setToast(`Property ${status}`);
      loadProperties(); // 🔄 re-fetch from DB
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  const loadProperties = async () => {
    try {
      const data = await fetchAllProperties();

      const formatted = data.map((p) => ({
        id: p._id,
        title: p.propertyTitle,
        location: p.location,
        type: p.propertyType,
        price: `₹${p.expectedPrice}`,
        status: p.status,
        sold: p.sold ?? false,
        uploaded: new Date(p.createdAt).toLocaleDateString(),
        owner: p.ownerDetails?.name,
        phone: p.ownerDetails?.phone,
        email: p.ownerDetails?.email,
        raw: p, // full object for modal
      }));

      setProperties(formatted);
    } catch (err) {
      console.error("Failed to fetch properties", err);
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
              {["Property", "Type", "Price", "Status", "Property Status", "Uploaded", "Owner", "Phone", "Actions"].map(
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
                    className={`px-3 py-1 rounded-full text-xs font-medium ${p.status === "approved"
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
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${p.sold
                      ? "bg-gray-800 text-white"
                      : "bg-green-100 text-green-700"
                      }`}
                  >
                    {p.sold ? "Sold" : "Available"}
                  </span>
                </td>

                <td className="px-4 py-3">{p.uploaded}</td>
                <td className="px-4 py-3">{p.owner}</td>
                <td className="px-4 py-3">{p.phone}</td>
                <td className="px-4 py-3 flex gap-3">
                  <Eye
                    size={16}
                    className="cursor-pointer"
                    onClick={() => setSelected(p)}
                  />
                  {p.status === "pending" && (
                    <>
                      <CheckCircle
                        size={16}
                        className="text-green-600 cursor-pointer"
                        onClick={() => updateStatus(p.id, "approved")}
                      />

                      <XCircle
                        size={16}
                        className="text-red-500 cursor-pointer"
                        onClick={() => updateStatus(p.id, "rejected")}
                      />
                    </>
                  )}
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
        <PropertyModal property={selected} onClose={() => setSelected(null)} />
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
