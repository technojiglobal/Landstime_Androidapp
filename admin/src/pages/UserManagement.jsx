// admin/src/pages/UserManagement.jsx

import { useMemo, useState, useEffect } from "react";
import StatCard from "../components/UserManagement/StatsCard";
import Toast from "../components/UserManagement/Toast";
import axios from "axios";
import {
  Search,
  CheckCircle,
  Ban,
  Users,
  Crown,
  ChevronLeft,
  ChevronRight,
  UserX,
  UserPlus,
} from "lucide-react";

export default function UserManagement() {
  const [tab, setTab] = useState("subscribers");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setPage(1);
  }, [tab, search, pageSize]);

  // ── FETCH USERS ──
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      console.log("🔑 Fetching users with token:", token ? "EXISTS" : "MISSING");

      const response = await axios.get("http://localhost:8000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Users fetched:", response.data);

      if (response.data.success) {
        const formattedUsers = response.data.data.map((user) => {
          const now = new Date();
          const expDate = user.currentSubscription?.endDate
            ? new Date(user.currentSubscription.endDate)
            : null;

          let status = "active";
          if (user.isBlocked) {
            status = "blocked";
          } else if (expDate && expDate < now) {
            status = "expired";
          } else if (
            user.currentSubscription?.status === "active" &&
            expDate &&
            expDate > now
          ) {
            status = "active";
          }

          return {
            id: user._id,
            name: (() => {
              if (user.name && typeof user.name === "object") {
                return user.name.en || user.name.hi || user.name.te || "";
              }
              return user.name || "";
            })(),
            email: user.email,
            phone: user.phone,
            plan: (() => {
              const planName = user.currentSubscription?.planName;
              if (planName && typeof planName === "object") {
                return planName.en || planName.hi || planName.te || null;
              }
              return planName || null;
            })(),
            subscribed: !!user.currentSubscription?.planId,
            subDate: user.currentSubscription?.startDate
              ? new Date(user.currentSubscription.startDate).toLocaleDateString("en-CA")
              : null,
            expDate: user.currentSubscription?.endDate
              ? new Date(user.currentSubscription.endDate).toLocaleDateString("en-CA")
              : null,
            status: status,
            userType: user.role,
            isBlocked: user.isBlocked || false,
          };
        });

        setUsers(formattedUsers);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ── FILTER ──
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesTab = tab === "subscribers" ? u.subscribed : !u.subscribed;
      const searchText = search.toLowerCase();
      const matchesSearch = Object.values(u)
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchText);
      return matchesTab && matchesSearch;
    });
  }, [users, tab, search]);

  // ── PAGINATION ──
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const start = filteredUsers.length === 0 ? 0 : startIndex + 1;
  const end = Math.min(endIndex, filteredUsers.length);

  // ── TOGGLE BLOCK ──
  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");

      console.log("🔑 Token:", token ? "EXISTS" : "MISSING");
      console.log("🆔 User ID:", id);
      console.log("🌐 API URL:", `http://localhost:8000/api/admin/users/${id}/toggle-block`);

      const response = await axios.put(
        `http://localhost:8000/api/admin/users/${id}/toggle-block`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Response:", response.data);

      if (response.data.success) {
        await fetchUsers();
        setToast(response.data.message);
      }
    } catch (err) {
      console.error("❌ Full Error:", err);
      console.error("❌ Error Response:", err.response?.data);
      console.error("❌ Error Status:", err.response?.status);
      setToast(err.response?.data?.message || "Failed to update user status");
    }
  };

  // ── STATS ──
  const subscriberCount = users.filter((u) => u.subscribed).length;
  const nonSubscriberCount = users.filter((u) => !u.subscribed).length;
  const premiumCount = users.filter((u) => u.subscribed && u.plan).length;

  const stats =
    tab === "subscribers"
      ? [
          { title: "Total Subscribers", value: subscriberCount.toString(), icon: Users },
          { title: "Premium Users", value: premiumCount.toString(), icon: Crown },
        ]
      : [
          { title: "Total Non-Subscribers", value: nonSubscriberCount.toString(), icon: UserX },
          {
            title: "Potential Conversions",
            value: Math.floor(nonSubscriberCount * 0.15).toString(),
            icon: UserPlus,
          },
        ];

  // ── STATUS BADGE CLASS ──
  const getStatusClass = (status) => {
    switch (status) {
      case "blocked":
        return "bg-red-500 text-white";
      case "expired":
        return "bg-orange-500 text-white";
      default:
        return "bg-green-200 text-green-700";
    }
  };

  // ── LOADING ──
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          <p className="text-sm text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  // ── ERROR ──
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-base text-red-500">{error}</div>
      </div>
    );
  }

  // ── SUBSCRIBER MOBILE CARD ──
  const SubscriberCard = ({ u }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
      {/* Top row: name + status + action */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 text-sm truncate">{u.name}</p>
          <span
            className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(u.status)}`}
          >
            {u.status}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
            {u.plan || "N/A"}
          </span>
          <button
            onClick={() => toggleStatus(u.id)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            title={u.isBlocked ? "Unblock user" : "Block user"}
          >
            {u.isBlocked ? (
              <CheckCircle size={18} className="text-green-600" />
            ) : (
              <Ban size={18} className="text-orange-500" />
            )}
          </button>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-400 font-medium">Email</p>
          <p className="text-gray-700 mt-0.5 truncate">{u.email}</p>
        </div>
        <div>
          <p className="text-gray-400 font-medium">Phone</p>
          <p className="text-gray-700 mt-0.5">{u.phone}</p>
        </div>
        <div>
          <p className="text-gray-400 font-medium">Subscribed</p>
          <p className="text-gray-700 mt-0.5">{u.subDate || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 font-medium">Expiry</p>
          <p className="text-gray-700 mt-0.5">{u.expDate || "N/A"}</p>
        </div>
      </div>
    </div>
  );

  // ── NON-SUBSCRIBER MOBILE CARD ──
  const NonSubscriberCard = ({ u }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-gray-900 text-sm truncate flex-1">{u.name}</p>
        <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 flex-shrink-0">
          {u.userType}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-medium w-12 flex-shrink-0">Email</span>
          <span className="text-gray-700 truncate">{u.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-medium w-12 flex-shrink-0">Phone</span>
          <span className="text-gray-700">{u.phone}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">

      {/* ── TABS ── */}
      <div className="inline-flex bg-gray-200 rounded-lg p-1">
        {["subscribers", "non-subscribers"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              tab === t ? "bg-white shadow text-black" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "subscribers" ? "Subscribers" : "Non-Subscribers"}
          </button>
        ))}
      </div>

      {/* ── STATS ── */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* ── SEARCH + PAGE SIZE ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl w-full text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={pageSize}
          onChange={(e) => setPageSize(+e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full sm:w-auto focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all bg-white cursor-pointer"
        >
          {[5, 10, 15, 20].map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
      </div>

      {/* ── TABLE / CARDS ── */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {/* DESKTOP TABLE (md+) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {tab === "subscribers" ? (
                  <>
                    <th className="px-4 py-3 text-left text-gray-500 font-medium whitespace-nowrap">Name</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-medium whitespace-nowrap">Plan</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-medium whitespace-nowrap">Subscription</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-medium whitespace-nowrap">Expiry</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-medium whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-medium whitespace-nowrap">Email</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-medium whitespace-nowrap">Phone</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-medium whitespace-nowrap">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3 text-left text-gray-500 font-medium whitespace-nowrap">Name</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-medium whitespace-nowrap">Email</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-medium whitespace-nowrap">Phone</th>
                    <th className="px-4 py-3 text-left text-gray-500 font-medium whitespace-nowrap">User Type</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={tab === "subscribers" ? 8 : 4}
                    className="px-4 py-10 text-center text-gray-400 text-sm"
                  >
                    No {tab === "subscribers" ? "subscribers" : "non-subscribers"} found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50 transition-colors">
                    {tab === "subscribers" ? (
                      <>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{u.name}</td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                            {u.plan || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{u.subDate || "N/A"}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{u.expDate || "N/A"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusClass(u.status)}`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate">{u.email}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{u.phone}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleStatus(u.id)}
                            className="hover:opacity-70 transition-opacity cursor-pointer p-1 rounded-lg hover:bg-gray-100"
                            title={u.isBlocked ? "Unblock user" : "Block user"}
                          >
                            {u.isBlocked ? (
                              <CheckCircle size={18} className="text-green-600" />
                            ) : (
                              <Ban size={18} className="text-orange-500" />
                            )}
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{u.name}</td>
                        <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{u.email}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{u.phone}</td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                            {u.userType}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS (< md) */}
        <div className="md:hidden p-3 space-y-3">
          {paginatedUsers.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              No {tab === "subscribers" ? "subscribers" : "non-subscribers"} found
            </div>
          ) : (
            paginatedUsers.map((u) =>
              tab === "subscribers" ? (
                <SubscriberCard key={u.id} u={u} />
              ) : (
                <NonSubscriberCard key={u.id} u={u} />
              )
            )
          )}
        </div>
      </div>

      {/* ── FOOTER / PAGINATION ── */}
      <div className="flex flex-col xs:flex-row gap-3 xs:items-center xs:justify-between text-sm text-gray-500">
        <span className="text-xs sm:text-sm text-center xs:text-left">
          Showing{" "}
          <span className="font-semibold text-gray-700">{start}</span>
          {" "}to{" "}
          <span className="font-semibold text-gray-700">{end}</span>
          {" "}of{" "}
          <span className="font-semibold text-gray-700">{filteredUsers.length}</span>
          {" "}entries
        </span>

        <div className="flex items-center gap-3 justify-center">
          <button
            disabled={page === 1}
            onClick={() => page > 1 && setPage(page - 1)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-medium text-gray-800 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => page < totalPages && setPage(page + 1)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}