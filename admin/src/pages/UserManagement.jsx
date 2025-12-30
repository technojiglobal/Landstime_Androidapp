// //admin/src/pages/UserManagement.jsx

// import { useMemo, useState, useEffect } from "react";
// import StatCard from "../components/UserManagement/StatsCard";
// //import DeleteModal from "../components/UserManagement/DeleteModal";
// import Toast from "../components/UserManagement/Toast";
// import {
//   Search,
//   Trash2,
//   CheckCircle,
//   Ban,
//   Users,
//   DollarSign,
//   Crown,
//   ChevronLeft,
//   ChevronRight,
//   UserX,
//   UserPlus,
// } from "lucide-react";

// /* -------------------- DATA -------------------- */
// const USERS = [
//   {
//     id: 1,
//     name: "John Smith",
//     email: "john.smith@gmail.com",
//     phone: "+1 (555) 123-4567",
//     plan: "Premium",
//     subscribed: true,
//     subDate: "2024-01-15",
//     expDate: "2025-01-15",
//     status: "blocked",
//   },
//   {
//     id: 2,
//     name: "Emily Davis",
//     email: "emily.davis@hotmail.com",
//     phone: "+1 (555) 456-7890",
//     plan: "Premium",
//     subscribed: true,
//     subDate: "2024-03-10",
//     expDate: "2025-03-10",
//     status: "blocked",
//   },
//   {
//     id: 3,
//     name: "Jennifer Taylor",
//     email: "jen.taylor@outlook.com",
//     phone: "+1 (555) 890-1234",
//     plan: "Basic",
//     subscribed: true,
//     subDate: "2024-04-05",
//     expDate: "2025-04-05",
//     status: "active",
//   },
//   {
//     id: 4,
//     name: "Michelle Thompson",
//     email: "michelle.t@gmail.com",
//     phone: "+1 (555) 222-3333",
//     subscribed: false,
//     userType: "User",
//   },
//   {
//     id: 5,
//     name: "Patricia Harris",
//     email: "p.harris@proton.me",
//     phone: "+1 (555) 444-5555",
//     subscribed: false,
//     userType: "Buyer",
//   },
// ];

// export default function UserManagement() {
//   const [tab, setTab] = useState("subscribers");
//   const [search, setSearch] = useState("");
//   const [pageSize, setPageSize] = useState(5);
//   const [page, setPage] = useState(1);
//   const [users, setUsers] = useState(USERS);
//   const [deleteUser, setDeleteUser] = useState(null);
//   const [toast, setToast] = useState("");

//   useEffect(() => {
//     setPage(1);
//   }, [tab, search, pageSize]);

//   /* -------------------- FILTER (ENHANCED SEARCH) -------------------- */
//   const filteredUsers = useMemo(() => {
//     return users.filter((u) => {
//       const matchesTab =
//         tab === "subscribers" ? u.subscribed : !u.subscribed;

//       const searchText = search.toLowerCase();

//       const matchesSearch = Object.values(u)
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase()
//         .includes(searchText);

//       return matchesTab && matchesSearch;
//     });
//   }, [users, tab, search]);

//   /* -------------------- PAGINATION -------------------- */
//   const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
//   const startIndex = (page - 1) * pageSize;
//   const endIndex = startIndex + pageSize;
//   const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

//   const start = filteredUsers.length === 0 ? 0 : startIndex + 1;
//   const end = Math.min(endIndex, filteredUsers.length);

//   /* -------------------- ACTIONS -------------------- */
//   const toggleStatus = (id) => {
//     setUsers((prev) =>
//       prev.map((u) =>
//         u.id === id
//           ? { ...u, status: u.status === "active" ? "blocked" : "active" }
//           : u
//       )
//     );
//     setToast("User status updated");
//   };

//   const confirmDelete = () => {
//     setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
//     setDeleteUser(null);
//     setToast("User deleted successfully");
//   };

//   /* -------------------- STATS -------------------- */
//   const stats =
//     tab === "subscribers"
//       ? [
//           { title: "Total Subscribers", value: "1,248", icon: Users, trend: "+5% from last month" },
//           { title: "Total Revenue", value: "$89,500", icon: DollarSign, trend: "+15% from last month" },
//           { title: "Premium Users", value: "456", icon: Crown, trend: "+12% from last month" },
//         ]
//       : [
//           { title: "Total Non-Subscribers", value: "3,567", icon: UserX },
//           { title: "Potential Conversions", value: "234", icon: UserPlus, trend: "+15% from last month" },
//         ];

//   return (
//     <div className="space-y-6">

//       {/* Tabs */}
//       <div className="inline-flex bg-gray-200 rounded-lg p-1">
//         {["subscribers", "non-subscribers"].map((t) => (
//           <button
//             key={t}
//             onClick={() => setTab(t)}
//             className={`px-4 py-2 rounded-md text-sm font-medium ${
//               tab === t ? "bg-white shadow text-black" : "text-gray-500"
//             }`}
//           >
//             {t === "subscribers" ? "Subscribers" : "Non-Subscribers"}
//           </button>
//         ))}
//       </div>

//       {/* Stats */}
//       <div className={`grid gap-6 grid-cols-1 sm:grid-cols-2 ${stats.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
//         {stats.map((s, i) => (
//           <StatCard key={i} {...s} />
//         ))}
//       </div>

//       {/* Search + Page Size */}
//       <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
//         <div className="relative w-full sm:w-96">
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//           <input
//             className="pl-10 pr-4 py-2 border rounded-lg w-full"
//             placeholder="Search users..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <select
//           value={pageSize}
//           onChange={(e) => setPageSize(+e.target.value)}
//           className="border rounded-lg px-3 py-2 w-full sm:w-auto"
//         >
//           {[5, 10, 15, 20].map((n) => (
//             <option key={n} value={n}>
//               {n} per page
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Table (Responsive) */}
//      <div className="bg-white rounded-xl shadow overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               {tab === "subscribers" ? (
//                 <>
//                   <th className="px-4 py-3 text-left text-gray-500 font-medium">Name</th>
//                   <th className="px-4 py-3 text-left text-gray-500 font-medium">Plan</th>
//                   <th className="px-4 py-3 text-left text-gray-500 font-medium">Subscription</th>
//                   <th className="px-4 py-3 text-left text-gray-500 font-medium">Expiry</th>
//                   <th className="px-4 py-3 text-left text-gray-500 font-medium">Status</th>
//                   <th className="px-4 py-3 text-left text-gray-500 font-medium">Email</th>
//                   <th className="px-4 py-3 text-left text-gray-500 font-medium">Phone</th>
//                   <th className="px-4 py-3 text-left text-gray-500 font-medium">Actions</th>
//                 </>
//               ) : (
//                 <>
//                   <th className="px-4 py-3 text-left text-gray-500 font-medium">Name</th>
//                   <th className="px-4 py-3 text-left text-gray-500 font-medium">Email</th>
//                   <th className="px-4 py-3 text-left text-gray-500 font-medium">Phone</th>
//                   <th className="px-4 py-3 text-left text-gray-500 font-medium">User Type</th>
//                   <th className="px-4 py-3 text-left text-gray-500 font-medium">Actions</th>
//                 </>
//               )}
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedUsers.map((u) => (
//               <tr key={u.id} className="border-t">
//                 {tab === "subscribers" ? (
//                   <>
//                     <td className="px-4 py-3">{u.name}</td>
//                     <td className="px-4 py-3">
//                       <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
//                         {u.plan}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">{u.subDate}</td>
//                     <td className="px-4 py-3">{u.expDate}</td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs ${
//                           u.status === "blocked"
//                             ? "bg-red-500 text-white font-medium"
//                             : "bg-green-200 text-green-700 font-medium"
//                         }`}
//                       >
//                         {u.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">{u.email}</td>
//                     <td className="px-4 py-3">{u.phone}</td>
//                     <td className="px-4 py-3 flex gap-3">
//                       <button onClick={() => toggleStatus(u.id)}>
//                         {u.status === "active" ? (
//                           <Ban size={16} className="text-orange-500 hover:text-black" />
//                         ) : (
//                           <CheckCircle size={16} className="text-green-600 hover:text-black" />
//                         )}
//                       </button>
//                       <button onClick={() => setDeleteUser(u)}>
//                         <Trash2 size={16} className="text-red-500 hover:text-black" />
//                       </button>
//                     </td>
//                   </>
//                 ) : (
//                   <>
//                     <td className="px-4 py-3">{u.name}</td>
//                     <td className="px-4 py-3">{u.email}</td>
//                     <td className="px-4 py-3">{u.phone}</td>
//                     <td className="px-4 py-3">
//                       <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
//                         {u.userType}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <button onClick={() => setDeleteUser(u)}>
//                         <Trash2 size={16} className="text-red-500 hover:text-black" />
//                       </button>
//                     </td>
//                   </>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>


//       {/* Footer */}
//       <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm text-gray-500">
//         <span>
//           Showing {start} to {end} of {filteredUsers.length} entries
//         </span>

//         <div className="flex items-center gap-4 justify-center">
//           <ChevronLeft
//             className={page === 1 ? "opacity-40" : "cursor-pointer"}
//             onClick={() => page > 1 && setPage(page - 1)}
//           />
//           <span className="font-medium text-gray-800">
//             Page {page} of {totalPages}
//           </span>
//           <ChevronRight
//             className={page === totalPages ? "opacity-40" : "cursor-pointer"}
//             onClick={() => page < totalPages && setPage(page + 1)}
//           />
//         </div>
//       </div>

//       {deleteUser && (
//         <DeleteModal
//           onCancel={() => setDeleteUser(null)}
//           onDelete={confirmDelete}
//         />
//       )}

//       {toast && <Toast message={toast} onClose={() => setToast("")} />}
//     </div>
//   );
// }


//admin/src/pages/UserManagement.jsx

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

  // Fetch users from backend
  useEffect(() => {
    fetchUsers();
  }, []);

// NEW CODE:
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('🔑 Fetching users with token:', token ? 'EXISTS' : 'MISSING');
      
      const response = await axios.get('http://localhost:8000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('✅ Users fetched:', response.data);

      if (response.data.success) {
        const formattedUsers = response.data.data.map(user => {
          const now = new Date();
          const expDate = user.currentSubscription?.endDate 
            ? new Date(user.currentSubscription.endDate) 
            : null;
          
          let status = 'active';
          if (user.isBlocked) {
            status = 'blocked';
          } else if (expDate && expDate < now) {
            status = 'expired';
          } else if (user.currentSubscription?.status === 'active' && expDate && expDate > now) {
            status = 'active';
          }

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            plan: user.currentSubscription?.planName || null,
            subscribed: !!user.currentSubscription?.planId,
            subDate: user.currentSubscription?.startDate 
              ? new Date(user.currentSubscription.startDate).toLocaleDateString('en-CA')
              : null,
            expDate: user.currentSubscription?.endDate
              ? new Date(user.currentSubscription.endDate).toLocaleDateString('en-CA')
              : null,
            status: status,
            userType: user.role,
            isBlocked: user.isBlocked || false
          };
        });
        
        setUsers(formattedUsers);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      setLoading(false);
    }
  };

  /* -------------------- FILTER (ENHANCED SEARCH) -------------------- */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesTab =
        tab === "subscribers" ? u.subscribed : !u.subscribed;

      const searchText = search.toLowerCase();

      const matchesSearch = Object.values(u)
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchText);

      return matchesTab && matchesSearch;
    });
  }, [users, tab, search]);

  /* -------------------- PAGINATION -------------------- */
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const start = filteredUsers.length === 0 ? 0 : startIndex + 1;
  const end = Math.min(endIndex, filteredUsers.length);

  /* -------------------- ACTIONS -------------------- */
 // NEW CODE:
  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      console.log('🔑 Token:', token ? 'EXISTS' : 'MISSING');
      console.log('🆔 User ID:', id);
      console.log('🌐 API URL:', `http://localhost:8000/api/admin/users/${id}/toggle-block`);
      
      const response = await axios.put(
        `http://localhost:8000/api/admin/users/${id}/toggle-block`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('✅ Response:', response.data);

      if (response.data.success) {
        await fetchUsers();
        setToast(response.data.message);
      }
    } catch (err) {
      console.error('❌ Full Error:', err);
      console.error('❌ Error Response:', err.response?.data);
      console.error('❌ Error Status:', err.response?.status);
      setToast(err.response?.data?.message || 'Failed to update user status');
    }
  };

  /* -------------------- STATS -------------------- */
  const subscriberCount = users.filter(u => u.subscribed).length;
  const nonSubscriberCount = users.filter(u => !u.subscribed).length;
  const premiumCount = users.filter(u => u.subscribed && u.plan).length;

  const stats =
    tab === "subscribers"
      ? [
          { title: "Total Subscribers", value: subscriberCount.toString(), icon: Users },
          { title: "Premium Users", value: premiumCount.toString(), icon: Crown },
        ]
      : [
          { title: "Total Non-Subscribers", value: nonSubscriberCount.toString(), icon: UserX },
          { title: "Potential Conversions", value: Math.floor(nonSubscriberCount * 0.15).toString(), icon: UserPlus },
        ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Tabs */}
      <div className="inline-flex bg-gray-200 rounded-lg p-1">
        {["subscribers", "non-subscribers"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              tab === t ? "bg-white shadow text-black" : "text-gray-500"
            }`}
          >
            {t === "subscribers" ? "Subscribers" : "Non-Subscribers"}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Search + Page Size */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
            placeholder="Search users..."
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
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {tab === "subscribers" ? (
                <>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">Plan</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">Subscription</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">Expiry</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">Phone</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">Actions</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">Phone</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">User Type</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u.id} className="border-t">
                {tab === "subscribers" ? (
                  <>
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                        {u.plan || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{u.subDate || 'N/A'}</td>
                    <td className="px-4 py-3">{u.expDate || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.status === "blocked"
                            ? "bg-red-500 text-white"
                            : u.status === "expired"
                            ? "bg-orange-500 text-white"
                            : "bg-green-200 text-green-700"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.phone}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => toggleStatus(u.id)}
                        className="hover:opacity-70 transition"
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
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.phone}</td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                        {u.userType}
                      </span>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm text-gray-500">
        <span>
          Showing {start} to {end} of {filteredUsers.length} entries
        </span>

        <div className="flex items-center gap-4 justify-center">
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
  );
}