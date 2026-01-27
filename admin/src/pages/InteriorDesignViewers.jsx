// // admin/src/pages/InteriorDesignViewers.jsx

// import { useEffect, useMemo, useState } from "react";
// //import ViewersModal from "../components/interiorDesignViewers/ViewersModal";
// import ViewersModal from "../components/propertyViewers/ViewersModal";
// import Toast from "../components/UserManagement/Toast";
// import {
//   Search,
//   Eye,
//   Download,
//   ChevronLeft,
//   ChevronRight,
//   TrendingUp,
//   Users,
//   LayoutGrid,
//   BarChart3
// } from "lucide-react";

// const API_URL = "http://localhost:8000/api/admin/interior-design-views";

// export default function InteriorDesignViewers() {
//   const [designViews, setDesignViews] = useState([]);
//   const [stats, setStats] = useState({
//     totalDesigns: 0,
//     totalViewers: 0,
//     designsWithViews: 0,
//     avgViewsPerDesign: 0
//   });
//   const [search, setSearch] = useState("");
//   const [pageSize, setPageSize] = useState(10);
//   const [page, setPage] = useState(1);
//   const [selectedDesign, setSelectedDesign] = useState(null);
//   const [toast, setToast] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [sortBy, setSortBy] = useState("updatedAt");
//   const [sortOrder, setSortOrder] = useState("desc");

//   // Get token from localStorage
//   const getToken = () => {
//     return localStorage.getItem("token");
//   };

//   // Fetch design views from backend
//   const fetchDesignViews = async () => {
//     try {
//       setLoading(true);
//       const token = getToken();
      
//       if (!token) {
//         setToast("Please login as admin");
//         return;
//       }

//       const queryParams = new URLSearchParams({
//         page: page.toString(),
//         limit: pageSize.toString(),
//         search: search,
//         sortBy: sortBy,
//         sortOrder: sortOrder
//       });

//       const response = await fetch(`${API_URL}/all?${queryParams}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//       });

//       const data = await response.json();

//       if (data.success) {
//         setDesignViews(data.data);
//         setStats(data.stats);
//         setTotalPages(data.pagination.totalPages);
//         setTotalItems(data.pagination.totalItems);
//       } else {
//         setToast("Failed to fetch design views");
//       }
//     } catch (error) {
//       console.error("Fetch design views error:", error);
//       setToast("Error fetching design views");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch on mount and when dependencies change
//   useEffect(() => {
//     fetchDesignViews();
//   }, [page, pageSize, search, sortBy, sortOrder]);

//   // Reset page when search or pageSize changes
//   useEffect(() => {
//     setPage(1);
//   }, [search, pageSize]);

//   // Export to CSV
//   const handleExport = async () => {
//     try {
//       const token = getToken();
      
//       if (!token) {
//         setToast("Please login as admin");
//         return;
//       }

//       const response = await fetch(`${API_URL}/export`, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'interior-design-views.csv';
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//         setToast("Export successful!");
//       } else {
//         setToast("Failed to export data");
//       }
//     } catch (error) {
//       console.error("Export error:", error);
//       setToast("Error exporting data");
//     }
//   };

//   // Handle sort change
//   const handleSort = (field) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(field);
//       setSortOrder("desc");
//     }
//   };

//   // Pagination calculations
//   const start = totalItems ? (page - 1) * pageSize + 1 : 0;
//   const end = Math.min(page * pageSize, totalItems);

//   return (
//     <div className="space-y-6">
//       {/* Page Title */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Interior Design Viewers</h1>
//         <p className="text-gray-500 mt-1">Track who's viewing interior design contacts</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white rounded-xl shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Designs</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">
//                 {stats.totalDesigns}
//               </p>
//             </div>
//             <div className="p-3 bg-blue-100 rounded-lg">
//               <LayoutGrid className="text-blue-600" size={24} />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Viewers</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">
//                 {stats.totalViewers}
//               </p>
//             </div>
//             <div className="p-3 bg-green-100 rounded-lg">
//               <Users className="text-green-600" size={24} />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Designs with Views</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">
//                 {stats.designsWithViews}
//               </p>
//             </div>
//             <div className="p-3 bg-purple-100 rounded-lg">
//               <TrendingUp className="text-purple-600" size={24} />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Avg Views/Design</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">
//                 {stats.avgViewsPerDesign}
//               </p>
//             </div>
//             <div className="p-3 bg-orange-100 rounded-lg">
//               <BarChart3 className="text-orange-600" size={24} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search + Export + Page Size */}
//       <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
//         <div className="relative w-full sm:w-96">
//           <Search
//             className="absolute left-3 top-2.5 text-gray-400"
//             size={18}
//           />
//           <input
//             className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Search designs, designers, categories..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={handleExport}
//             className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
//           >
//             <Download size={16} /> Export CSV
//           </button>

//           <select
//             value={pageSize}
//             onChange={(e) => setPageSize(+e.target.value)}
//             className="border rounded-lg px-3 py-2 w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             {[5, 10, 15, 20, 50].map((n) => (
//               <option key={n} value={n}>
//                 {n} per page
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         ) : (
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th 
//                   className="px-4 py-3 text-gray-500 font-semibold text-left cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('designTitle')}
//                 >
//                   Design Title {sortBy === 'designTitle' && (sortOrder === 'asc' ? '↑' : '↓')}
//                 </th>
//                 <th className="px-4 py-3 text-gray-500 font-medium text-left">
//                   Category
//                 </th>
//                 <th className="px-4 py-3 text-gray-500 font-medium text-left">
//                   Designer Name
//                 </th>
//                 <th className="px-4 py-3 text-gray-500 font-medium text-left">
//                   Designer Phone
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-gray-500 font-medium text-left cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('totalViews')}
//                 >
//                   Total Views {sortBy === 'totalViews' && (sortOrder === 'asc' ? '↑' : '↓')}
//                 </th>
//                 <th 
//                   className="px-4 py-3 text-gray-500 font-medium text-left cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('updatedAt')}
//                 >
//                   Last Updated {sortBy === 'updatedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
//                 </th>
//                 <th className="px-4 py-3 text-gray-500 font-medium text-left">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {designViews.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="px-4 py-8 text-center text-gray-500"
//                   >
//                     No design views found
//                   </td>
//                 </tr>
//               ) : (
//                 designViews.map((dv) => (
//                   <tr key={dv._id} className="border-t hover:bg-gray-50">
//                     <td className="px-4 py-3 font-medium">{dv.designTitle}</td>
//                     <td className="px-4 py-3">
//                       <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
//                         {dv.category}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">{dv.designerName}</td>
//                     <td className="px-4 py-3">{dv.designerPhone}</td>
//                     <td className="px-4 py-3">
//                       <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
//                         {dv.totalViews}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-gray-600">
//                       {new Date(dv.updatedAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-3">
//                       <Eye
//                         size={16}
//                         className="cursor-pointer text-blue-600 hover:text-blue-800"
//                         onClick={() => setSelectedDesign(dv)}
//                       />
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* FOOTER */}
//       <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center text-sm text-gray-500">
//         <span>
//           Showing {start} to {end} of {totalItems} entries
//         </span>

//         <div className="flex items-center gap-4">
//           <ChevronLeft
//             className={
//               page === 1
//                 ? "opacity-40"
//                 : "cursor-pointer hover:text-blue-600"
//             }
//             onClick={() => page > 1 && setPage(page - 1)}
//           />
//           <span className="font-medium text-gray-800">
//             Page {page} of {totalPages}
//           </span>
//           <ChevronRight
//             className={
//               page === totalPages
//                 ? "opacity-40"
//                 : "cursor-pointer hover:text-blue-600"
//             }
//             onClick={() => page < totalPages && setPage(page + 1)}
//           />
//         </div>
//       </div>

//       {/* Viewers Modal */}
//       {selectedDesign && (
//         <ViewersModal
//           design={selectedDesign}
//           onClose={() => setSelectedDesign(null)}
//         />
//       )}

//       {/* Toast */}
//       {toast && <Toast message={toast} onClose={() => setToast("")} />}
//     </div>
//   );
// }