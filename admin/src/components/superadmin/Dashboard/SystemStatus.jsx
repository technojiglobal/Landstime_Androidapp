import { Activity } from "lucide-react";

const services = [
  {
    name: "API Server",
    status: "Operational",
    uptime: "99.99%",
  },
  {
    name: "Database Cluster",
    status: "Operational",
    uptime: "99.95%",
  },
  {
    name: "Payment Gateway",
    status: "Operational",
    uptime: "99.90%",
  },
  {
    name: "Email Service",
    status: "Operational",
    uptime: "99.87%",
  },
];

const SystemStatus = () => {
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-6">
      {/* Header */}
      <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-6">
        <Activity size={18} className="text-emerald-400" />
        System Status
      </h3>

      {/* Status Rows */}
      <div className="space-y-4">
        {services.map((service, i) => (
          <div
            key={i}
            className="bg-[#111827] border border-white/5 rounded-xl px-5 py-4 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-gray-200 text-sm">
                {service.name}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                {service.status}
              </span>
              <span className="text-sm text-gray-500">
                {service.uptime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatus;
