// // admin/src/components/interiorDesignViewers/ViewersModal.jsx

// import { useEffect, useState } from "react";
// import { X, ChevronLeft, ChevronRight, Award } from "lucide-react";

// const API_URL = "http://localhost:8000/api/admin/interior-design-views";

// export default function ViewersModal({ design, onClose }) {
//   const [viewers, setViewers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);

//   // Get token from localStorage
//   const getToken = () => {
//     return localStorage.getItem("token");
//   };

//   // Fetch viewers for this design
//   const fetchViewers = async () => {
//     try {
//       setLoading(true);
//       const token = getToken();
      
//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       const queryParams = new URLSearchParams({
//         page: page.toString(),
//         limit: pageSize.toString(),
//         sortBy: "viewedAt",
//         sortOrder: "desc"
//       });

//       const response = await fetch(
//         `${API_URL}/design/${design.designId}?${queryParams}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//           }
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         setViewers(data.data.viewers);
//         setTotalPages(data.pagination.totalPages);
//         setTotalItems(data.pagination.totalItems);
//       }
//     } catch (error) {
//       console.error("Fetch viewers error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (design) {
//       fetchViewers();
//     }
//   }, [design, page]);

//   // Get plan badge color
//   const getPlanBadge = (plan) => {
//     if (!plan) {
//       return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">None</span>;
//     }
    
//     const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
    
//     switch (plan.toLowerCase()) {
//       case 'gold':
//         return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
//           <Award size={12} /> {planName}
//         </span>;
//       case 'platinum':
//         return <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium flex items-center gap-1">
//           <Award size={12} /> {planName}
//         </span>;
//       case 'diamond':
//         return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
//           <Award size={12} /> {planName}
//         </span>;
//       default:
//         return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">None</span>;
//     }
//   };

//   const start = totalItems ? (page - 1) * pageSize + 1 : 0;
//   const end = Math.min(page * pageSize, totalItems);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
//           <div className="flex items-start justify-between">
//             <div>
//               <h2 className="text-2xl font-bold">{design.designTitle}</h2>
//               <div className="mt-2 flex flex-wrap gap-3 text-sm">
//                 <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
//                   {design.category}
//                 </span>
//                 <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
//                   Designer: {design.designerName}
//                 </span>
//                 <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
//                   Total Views: {design.totalViews}
//                 </span>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
//             >
//               <X size={24} />
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           {loading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//           ) : viewers.length === 0 ? (
//             <div className="text-center py-12 text-gray-500">
//               No viewers yet for this design
//             </div>
//           ) : (
//             <>
//               {/* Viewers Table */}
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-gray-600 font-semibold">
//                         Viewer Name
//                       </th>
//                       <th className="px-4 py-3 text-left text-gray-600 font-semibold">
//                         Phone
//                       </th>
//                       <th className="px-4 py-3 text-left text-gray-600 font-semibold">
//                         Email
//                       </th>
//                       <th className="px-4 py-3 text-left text-gray-600 font-semibold">
//                         Subscription Plan
//                       </th>
//                       <th className="px-4 py-3 text-left text-gray-600 font-semibold">
//                         Viewed Date
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {viewers.map((viewer, index) => (
//                       <tr key={index} className="border-t hover:bg-gray-50">
//                         <td className="px-4 py-3 font-medium text-gray-900">
//                           {viewer.userName}
//                         </td>
//                         <td className="px-4 py-3 text-gray-700">
//                           {viewer.userPhone}
//                         </td>
//                         <td className="px-4 py-3 text-gray-700">
//                           {viewer.userEmail}
//                         </td>
//                         <td className="px-4 py-3">
//                           {getPlanBadge(viewer.subscriptionPlan)}
//                         </td>
//                         <td className="px-4 py-3 text-gray-600">
//                           {new Date(viewer.viewedAt).toLocaleString()}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center text-sm text-gray-500">
//                   <span>
//                     Showing {start} to {end} of {totalItems} viewers
//                   </span>

//                   <div className="flex items-center gap-4">
//                     <ChevronLeft
//                       className={
//                         page === 1
//                           ? "opacity-40"
//                           : "cursor-pointer hover:text-blue-600"
//                       }
//                       onClick={() => page > 1 && setPage(page - 1)}
//                     />
//                     <span className="font-medium text-gray-800">
//                       Page {page} of {totalPages}
//                     </span>
//                     <ChevronRight
//                       className={
//                         page === totalPages
//                           ? "opacity-40"
//                           : "cursor-pointer hover:text-blue-600"
//                       }
//                       onClick={() => page < totalPages && setPage(page + 1)}
//                     />
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="bg-gray-50 px-6 py-4 border-t">
//           <div className="flex justify-end">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// admin/src/components/InteriorDesign/ViewersModal.jsx

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Award, User, Phone, Mail, Calendar, Eye } from "lucide-react";

const API_URL = "http://localhost:8000/api/admin/interior-design-views";

export default function ViewersModal({ design, onClose }) {
  const [viewers, setViewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const getToken = () => localStorage.getItem("token");

  const fetchViewers = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) { console.error("No token found"); return; }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        sortBy: "viewedAt",
        sortOrder: "desc",
      });

      const response = await fetch(
        `${API_URL}/design/${design.designId}?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
    if (design) fetchViewers();
  }, [design, page]);

  // ── PLAN BADGE ──
  const PlanBadge = ({ plan }) => {
    if (!plan) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
          No Plan
        </span>
      );
    }
    const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
    const config = {
      gold: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
      platinum: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" },
      diamond: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    };
    const style = config[plan.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200" };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 ${style.bg} ${style.text} border ${style.border} rounded-full text-xs font-medium`}
      >
        <Award size={11} />
        {planName}
      </span>
    );
  };

  const start = totalItems ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-5xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[96vh] sm:max-h-[90vh] overflow-hidden">

        {/* ── HEADER ── */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4 sm:py-5 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-xl font-bold text-white truncate">
                {design.designTitle}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 text-white text-xs rounded-full">
                  {design.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 text-white text-xs rounded-full">
                  <User size={11} />
                  {design.designerName}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 text-white text-xs rounded-full">
                  <Eye size={11} />
                  {design.totalViews} views
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors mt-0.5"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-16 sm:py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600" />
                <p className="text-sm text-gray-500">Loading viewers...</p>
              </div>
            </div>
          ) : viewers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-gray-400">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <Eye size={28} className="text-gray-300" />
              </div>
              <p className="text-base font-medium text-gray-500">No viewers yet</p>
              <p className="text-sm text-gray-400 mt-1">No one has viewed this design so far</p>
            </div>
          ) : (
            <div className="p-4 sm:p-6">

              {/* ── DESKTOP TABLE (md+) ── */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Viewer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Viewed At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {viewers.map((viewer, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {viewer.userName?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <span className="font-medium text-gray-900">{viewer.userName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{viewer.userPhone}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{viewer.userEmail}</td>
                        <td className="px-4 py-3">
                          <PlanBadge plan={viewer.subscriptionPlan} />
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(viewer.viewedAt).toLocaleString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── MOBILE CARDS (< md) ── */}
              <div className="md:hidden space-y-3">
                {viewers.map((viewer, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    {/* Card header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {viewer.userName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{viewer.userName}</span>
                      </div>
                      <PlanBadge plan={viewer.subscriptionPlan} />
                    </div>

                    {/* Card rows */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone size={12} className="text-gray-400 flex-shrink-0" />
                        <span>{viewer.userPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 min-w-0">
                        <Mail size={12} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{viewer.userEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                        <span>
                          {new Date(viewer.viewedAt).toLocaleString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── PAGINATION ── */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center mt-5 pt-5 border-t border-gray-100 text-sm text-gray-500">
                  <span className="text-xs sm:text-sm">
                    Showing <span className="font-semibold text-gray-700">{start}</span> to{" "}
                    <span className="font-semibold text-gray-700">{end}</span> of{" "}
                    <span className="font-semibold text-gray-700">{totalItems}</span> viewers
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={page === 1}
                      onClick={() => page > 1 && setPage(page - 1)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="font-semibold text-gray-800 text-sm">
                      {page} / {totalPages}
                    </span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => page < totalPages && setPage(page + 1)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Total: <span className="font-semibold text-gray-600">{totalItems}</span> viewers
            </p>
            <button
              onClick={onClose}
              className="px-4 sm:px-5 py-2 bg-gray-700 text-white text-sm font-medium rounded-xl hover:bg-gray-800 active:scale-95 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}