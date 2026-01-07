// components/superadmin/finance/ExpenseDonut.jsx
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Operations", value: 35, color: "#3B82F6" },
  { name: "Marketing", value: 25, color: "#8B5CF6" },
  { name: "Salaries", value: 22, color: "#10B981" },
  { name: "Infrastructure", value: 12, color: "#F59E0B" },
  { name: "Others", value: 6, color: "#6B7280" },
];

const ExpenseDonut = () => {
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-6">
      <h3 className="text-white font-semibold text-lg mb-6">
        🧾 Expense Breakdown
      </h3>

      {/* Donut Chart */}
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              formatter={(v) => `${v}%`}
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="space-y-3 mt-6">
        {data.map((item) => (
          <div key={item.name} className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-300">{item.name}</span>
            </div>
            <span className="text-white font-medium">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseDonut;
