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
    message: "You’ve earned 100 bonus points!",
    sendTo: "All Users",
    status: "pending",
    date: "2024-07-25",
  },
];

const NotificationHistory = () => {
  return (
    <div className="mt-10 bg-white border rounded-xl p-6">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold">Notification History</h3>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3 w-[18%]">Title</th>
              <th className="pb-3 w-[32%]">Message</th>
              <th className="pb-3 w-[14%]">Send To</th>
              <th className="pb-3 w-[12%]">Status</th>
              <th className="pb-3 w-[14%]">Sent Date</th>
              <th className="pb-3 w-[10%] text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {notifications.map((item) => (
              <tr key={item.id} className="border-b last:border-none">
                <td className="py-4 font-medium truncate">
                  {item.title}
                </td>

                <td className="py-4 text-gray-600 truncate">
                  {item.message}
                </td>

                <td className="py-4 truncate">
                  {item.sendTo}
                </td>

                {/* ✅ STATUS COLUMN (FIXED) */}
                <td className="py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      item.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : item.status === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="py-4">
                  {item.date}
                </td>

                <td className="py-4 text-center">
                  <button className="text-gray-400 hover:text-red-500 transition">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationHistory;
