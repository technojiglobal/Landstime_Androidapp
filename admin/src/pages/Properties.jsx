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

/* ---------------- DATA ---------------- */
const INITIAL_PROPERTIES = [
  {
    id: 1,
    title: "Sunset Villa Estate",
    location: "Miami Beach, FL",
    type: "Resort",
    price: "$2,500,000",
    status: "verified",
    uploaded: "2024-06-15",
    owner: "James Wilson",
    phone: "+1 (555) 123-4567",
  },
  {
    id: 2,
    title: "Manhattan Penthouse",
    location: "New York, NY",
    type: "Flat",
    price: "$4,850,000",
    status: "pending",
    uploaded: "2024-07-20",
    owner: "Victoria Chen",
    phone: "+1 (555) 234-5678",
    area: "3,800 sqft",
    description:
      "Luxurious penthouse in Midtown with floor-to-ceiling windows and Central Park views.",
    email: "v.chen@luxuryrealty.com",
  },
  {
    id: 3,
    title: "Silicon Valley Tech Campus",
    location: "Palo Alto, CA",
    type: "Commercial",
    price: "$15,000,000",
    status: "verified",
    uploaded: "2024-05-10",
    owner: "TechVentures LLC",
    phone: "+1 (555) 345-6789",
  },
  {
    id: 4,
    title: "Rocky Mountain Retreat Plot",
    location: "Aspen, CO",
    type: "Site",
    price: "$1,850,000",
    status: "rejected",
    uploaded: "2024-08-01",
    owner: "Thomas Harrison",
    phone: "+1 (555) 456-7890",
  },
];

/* ---------------- COMPONENT ---------------- */
export default function Properties() {
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => setPage(1), [search, pageSize]);

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
  const updateStatus = (id, status) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status } : p
      )
    );
    setToast(`Property ${status}`);
  };

  /* ---------- STATS ---------- */
  const stats = [
    { title: "Total Properties", value: "892", icon: Building2, color: "blue" },
    { title: "Approved", value: "654", icon: CheckCircle, color: "green" },
    { title: "Pending", value: "149", icon: Clock, color: "yellow" },
    { title: "Rejected", value: "89", icon: X, color: "red" },
  ];

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
              {["Property", "Type", "Price", "Status", "Uploaded", "Owner", "Phone", "Actions"].map(
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
                      p.status === "verified"
                        ? "bg-green-100 text-green-700"
                        : p.status === "pending"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {p.status}
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
                        onClick={() => updateStatus(p.id, "verified")}
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
