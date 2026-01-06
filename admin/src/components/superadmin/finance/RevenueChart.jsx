// components/superadmin/finance/RevenueChart.jsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 250 },
  { month: "Feb", revenue: 310 },
  { month: "Mar", revenue: 280 },
  { month: "Apr", revenue: 430 },
  { month: "May", revenue: 390 },
  { month: "Jun", revenue: 450 },
];

const RevenueChart = () => {
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-white font-semibold text-lg">
          📈 Revenue Overview
        </h3>
        <p className="text-gray-400 text-sm">
          Monthly revenue performance
        </p>
      </div>

      {/* Chart */}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="month" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" tickFormatter={(v) => `₹${v}K`} />
            <Tooltip
              formatter={(v) => `₹${v}K`}
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />

            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#F59E0B"
              fill="url(#revenueGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-amber-500 rounded-full" />
          <span className="text-gray-400 text-sm">Revenue</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
