import { AlertTriangle } from "lucide-react";

const alerts = [
  {
    message: "New admin account created: admin.raj@company.com",
    time: "2 min ago",
    color: "bg-blue-400",
  },
  {
    message: "Unusual login attempt detected from IP 192.168.1.45",
    time: "15 min ago",
    color: "bg-yellow-400",
  },
  {
    message: "Daily backup completed successfully",
    time: "1 hour ago",
    color: "bg-emerald-400",
  },
  {
    message: "Transaction limit exceeded by Admin #12",
    time: "2 hours ago",
    color: "bg-yellow-400",
  },
];

const RecentAlerts = () => {
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-6">
      {/* Header */}
      <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-6">
        <AlertTriangle size={18} className="text-yellow-400" />
        Recent Alerts
      </h3>

      {/* Alerts */}
      <div className="space-y-4">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="bg-[#111827] border border-white/5 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <span
                className={`w-2 h-2 rounded-full mt-2 ${alert.color}`}
              />
              <div>
                <p className="text-gray-200 text-sm">
                  {alert.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {alert.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAlerts;
