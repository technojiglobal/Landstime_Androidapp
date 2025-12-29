// //admin/src/components/notifications/NotificationHistory.jsx

// import { Trash2 } from "lucide-react";

// const notifications = [
//   {
//     id: 1,
//     title: "Flash Sale Alert!",
//     message: "50% off on all blue teas. Limited time only!",
//     sendTo: "All Users",
//     status: "delivered",
//     date: "2024-07-25",
//   },
//   {
//     id: 2,
//     title: "New Arrivals",
//     message: "Check out our new Darjeeling collection",
//     sendTo: "All Users",
//     status: "delivered",
//     date: "2024-07-25",
//   },
//   {
//     id: 3,
//     title: "Order Shipped",
//     message: "Your order #1234 has been shipped",
//     sendTo: "Selected Users",
//     status: "delivered",
//     date: "2024-07-25",
//   },
//   {
//     id: 4,
//     title: "Weekend Special",
//     message: "Free shipping on all orders this weekend",
//     sendTo: "All Users",
//     status: "completed",
//     date: "2024-07-25",
//   },
//   {
//     id: 5,
//     title: "Loyalty Reward",
//     message: "You’ve earned 100 bonus points!",
//     sendTo: "All Users",
//     status: "pending",
//     date: "2024-07-25",
//   },
// ];

// const NotificationHistory = () => {
//   return (
//     <div className="mt-10 bg-white border rounded-xl p-6">
//       {/* Header */}
//       <div className="mb-5">
//         <h3 className="text-lg font-semibold">Notification History</h3>
//       </div>

//       {/* Table Wrapper */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm table-fixed">
//           <thead>
//             <tr className="text-left text-gray-500 border-b">
//               <th className="pb-3 w-[18%]">Title</th>
//               <th className="pb-3 w-[32%]">Message</th>
//               <th className="pb-3 w-[14%]">Send To</th>
//               <th className="pb-3 w-[12%]">Status</th>
//               <th className="pb-3 w-[14%]">Sent Date</th>
//               <th className="pb-3 w-[10%] text-center">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {notifications.map((item) => (
//               <tr key={item.id} className="border-b last:border-none">
//                 <td className="py-4 font-medium truncate">
//                   {item.title}
//                 </td>

//                 <td className="py-4 text-gray-600 truncate">
//                   {item.message}
//                 </td>

//                 <td className="py-4 truncate">
//                   {item.sendTo}
//                 </td>

//                 {/* ✅ STATUS COLUMN (FIXED) */}
//                 <td className="py-4">
//                   <span
//                     className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
//                       item.status === "delivered"
//                         ? "bg-green-100 text-green-700"
//                         : item.status === "completed"
//                         ? "bg-blue-100 text-blue-700"
//                         : "bg-yellow-100 text-yellow-700"
//                     }`}
//                   >
//                     {item.status}
//                   </span>
//                 </td>

//                 <td className="py-4">
//                   {item.date}
//                 </td>

//                 <td className="py-4 text-center">
//                   <button className="text-gray-400 hover:text-red-500 transition">
//                     <Trash2 size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default NotificationHistory;


import { Trash2 } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Flash Sale Alert!",
    message: "50% off on all blue teas. Limited time only!",
    sendTo: "All Users",
    status: "delivered",
    date: "2024-07-25",
  },
  {
    id: 2,
    title: "New Arrivals",
    message: "Check out our new Darjeeling collection",
    sendTo: "All Users",
    status: "delivered",
    date: "2024-07-25",
  },
  {
    id: 3,
    title: "Order Shipped",
    message: "Your order #1234 has been shipped",
    sendTo: "Selected Users",
    status: "delivered",
    date: "2024-07-25",
  },
  {
    id: 4,
    title: "Weekend Special",
    message: "Free shipping on all orders this weekend",
    sendTo: "All Users",
    status: "completed",
    date: "2024-07-25",
  },
  {
    id: 5,
    title: "Loyalty Reward",
    message: "You've earned 100 bonus points!",
    sendTo: "All Users",
    status: "pending",
    date: "2024-07-25",
  },
];

const NotificationHistory = () => {
  return (
    <div className="mt-6 sm:mt-8 lg:mt-10 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
          Notification History
        </h3>
      </div>

      {/* ========== DESKTOP TABLE (Large screens: 1024px+) ========== */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 bg-gray-50/80 border-b border-gray-200">
              <th className="px-6 xl:px-8 py-4 font-semibold whitespace-nowrap w-[18%]">
                Title
              </th>
              <th className="px-6 xl:px-8 py-4 font-semibold whitespace-nowrap w-[32%]">
                Message
              </th>
              <th className="px-6 xl:px-8 py-4 font-semibold whitespace-nowrap w-[14%]">
                Send To
              </th>
              <th className="px-6 xl:px-8 py-4 font-semibold whitespace-nowrap w-[12%]">
                Status
              </th>
              <th className="px-6 xl:px-8 py-4 font-semibold whitespace-nowrap w-[14%]">
                Sent Date
              </th>
              <th className="px-6 xl:px-8 py-4 font-semibold text-center whitespace-nowrap w-[10%]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {notifications.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50/50 transition-colors duration-200"
              >
                <td className="px-6 xl:px-8 py-4">
                  <div className="font-semibold text-gray-900 truncate">
                    {item.title}
                  </div>
                </td>

                <td className="px-6 xl:px-8 py-4">
                  <div className="text-gray-600 truncate max-w-[300px] xl:max-w-[400px]">
                    {item.message}
                  </div>
                </td>

                <td className="px-6 xl:px-8 py-4">
                  <div className="text-gray-600 truncate">
                    {item.sendTo}
                  </div>
                </td>

                <td className="px-6 xl:px-8 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${
                      item.status === "delivered"
                        ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                        : item.status === "completed"
                        ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                        : "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-6 xl:px-8 py-4 text-gray-600">
                  {item.date}
                </td>

                <td className="px-6 xl:px-8 py-4">
                  <div className="flex justify-center">
                    <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-red-50 transition-all duration-200 group">
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 group-hover:scale-110 transition-all duration-200" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========== TABLET TABLE (Medium screens: 768px - 1023px) ========== */}
      <div className="hidden md:block lg:hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 bg-gray-50/80 border-b border-gray-200">
              <th className="px-5 py-3.5 font-semibold whitespace-nowrap">
                Title
              </th>
              <th className="px-5 py-3.5 font-semibold whitespace-nowrap">
                Message
              </th>
              <th className="px-5 py-3.5 font-semibold whitespace-nowrap">
                Status
              </th>
              <th className="px-5 py-3.5 font-semibold text-center whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {notifications.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50/50 transition-colors duration-200"
              >
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900 max-w-[140px] truncate">
                    {item.title}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="text-gray-600 max-w-[220px] truncate">
                    {item.message}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${
                      item.status === "delivered"
                        ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                        : item.status === "completed"
                        ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                        : "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center">
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 transition-all duration-200 group">
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========== MOBILE CARDS (Small screens: < 768px) ========== */}
      <div className="md:hidden p-4 space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-200 bg-white"
          >
            {/* TOP SECTION */}
            <div className="flex justify-between gap-3 items-start mb-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 mb-1.5 truncate text-base">
                  {item.title}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {item.message}
                </p>
              </div>
              <button className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 active:bg-red-100 transition-colors duration-200 group">
                <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 group-active:text-red-600 transition-colors duration-200" />
              </button>
            </div>

            {/* BOTTOM SECTION */}
            <div className="flex justify-between items-center gap-3 pt-3 border-t border-gray-100">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                  item.status === "delivered"
                    ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                    : item.status === "completed"
                    ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                    : "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200"
                }`}
              >
                {item.status}
              </span>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span className="font-medium">{item.sendTo}</span>
                <span className="text-gray-400">•</span>
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationHistory;