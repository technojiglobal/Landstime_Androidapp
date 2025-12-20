import { useEffect, useMemo, useState } from "react";
import UploadDesignModal from "../components/InteriorDesign/UploadDesignModal";
import Toast from "../components/UserManagement/Toast";
import ViewModal from "../components/InteriorDesign/ViewModal";
import {
  Search,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";

/* ---------------- DATA ---------------- */
const ENQUIRIES = [
  {
    id: 1,
    name: "Alice Morrison",
    email: "alice.m@gmail.com",
    phone: "+1 (555) 111-1111",
    designType: "Full Home Renovation",
    designer: "Alexander Chen",
    designerPhone: "+1 (555) 111-2222",
    cost: "$85,000",
    status: "In Progress",
  },
  {
    id: 2,
    name: "Benjamin Foster",
    email: "ben.foster@outlook.com",
    phone: "+1 (555) 222-2222",
    designType: "Living Room & Kitchen",
    designer: "Emma Lindberg",
    designerPhone: "+1 (555) 222-3333",
    cost: "$42,000",
    status: "Settled",
  },
  {
    id: 3,
    name: "Eleanor Hughes",
    email: "eleanor.h@gmail.com",
    phone: "+1 (555) 555-5555",
    designType: "Outdoor Living Space",
    designer: "Isabella Romano",
    designerPhone: "+1 (555) 444-5555",
    cost: "$55,000",
    status: "Rejected",
  },
];

const INITIAL_DESIGNS = [
  {
    id: 1,
    name: "Modern Minimalist Living",
    designer: "Alexander Chen",
    phone: "+1 (555) 111-2222",
    area: "1,500 sqft",
    price: "$25,000 - $45,000",
    duration: "6-8 weeks",
    location: "New York, NY",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Scandinavian Comfort Suite",
    designer: "Emma Lindberg",
    phone: "+1 (555) 222-3333",
    area: "1,200 sqft",
    price: "$18,000 - $32,000",
    duration: "4-6 weeks",
    location: "Seattle, WA",
    rating: 4.9,
  },
];

/* ---------------- COMPONENT ---------------- */
export default function InteriorDesign() {
  const [tab, setTab] = useState("enquiry");
  const [designs, setDesigns] = useState(INITIAL_DESIGNS);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => setPage(1), [tab, search, pageSize]);

  const data = tab === "enquiry" ? ENQUIRIES : designs;

  /* ---------- SEARCH (ALL COLUMNS) ---------- */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return data.filter((row) =>
      Object.values(row)
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [data, search]);

  /* ---------- PAGINATION ---------- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const start = filtered.length ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, filtered.length);

  /* ---------- ADD DESIGN ---------- */
  const addDesign = (design) => {
    setDesigns((prev) => [
      ...prev,
      { ...design, id: Date.now(), rating: 4.8 },
    ]);
    setShowUpload(false);
    setToast("Design uploaded successfully");
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={16} /> Upload Design
        </button>
      </div>

      {/* Search + Page Size */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
            placeholder={`Search ${tab === "enquiry" ? "enquiries" : "designs"}...`}
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

      {/* TABLE (RESPONSIVE) */}
     <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {tab === "enquiry" ? (
                <>
                  <th className="px-4 py-3 text-gray-500 font-semibold text-left">Customer Name</th>
                  <th className="px-4 py-3 text-gray-500 font-medium text-left">Email</th>
                  <th className="px-4 py-3 text-gray-500 font-medium text-left">Phone</th>
                  <th className="px-4 py-3 text-gray-500 font-medium text-left">Design Type</th>
                  <th className="px-4 py-3 text-gray-500 font-medium text-left">Designer</th>
                  <th className="px-4 py-3 text-gray-500 font-medium text-left">Designer Phone</th>
                  <th className="px-4 py-3 text-gray-500 font-medium text-left">Est. Cost</th>
                  <th className="px-4 py-3 text-gray-500 font-medium text-left">Status</th>
                  <th className="px-4 py-3 text-gray-500 font-medium text-left">Actions</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3">Design Name</th>
                  <th className="px-4 py-3">Designer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Area</th>
                  <th className="px-4 py-3">Price Range</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Actions</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {paginated.map((item) => (
              <tr key={item.id} className="border-t">
                {tab === "enquiry" ? (
                  <>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.email}</td>
                    <td className="px-4 py-3">{item.phone}</td>
                    <td className="px-4 py-3">{item.designType}</td>
                    <td className="px-4 py-3">{item.designer}</td>
                    <td className="px-4 py-3">{item.designerPhone}</td>
                    <td className="px-4 py-3">{item.cost}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "Settled"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Rejected"
                            ? "bg-red-500 text-white"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Eye
                        size={16}
                        className="cursor-pointer"
                        onClick={() => setViewItem(item)}
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.designer}</td>
                    <td className="px-4 py-3">{item.phone}</td>
                    <td className="px-4 py-3">{item.area}</td>
                    <td className="px-4 py-3">{item.price}</td>
                    <td className="px-4 py-3">{item.duration}</td>
                    <td className="px-4 py-3">{item.location}</td>
                    <td className="px-4 py-3 flex items-center gap-1">
                      <Star size={14} className="text-yellow-500" />
                      {item.rating}
                    </td>
                    <td className="px-4 py-3">
                      <Eye
                        size={16}
                        className="cursor-pointer"
                        onClick={() => setViewItem(item)}
                      />
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* FOOTER */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center text-sm text-gray-500">
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

      {showUpload && (
        <UploadDesignModal
          onClose={() => setShowUpload(false)}
          onUpload={addDesign}
        />
      )}

      {viewItem && (
        <ViewModal item={viewItem} onClose={() => setViewItem(null)} />
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
