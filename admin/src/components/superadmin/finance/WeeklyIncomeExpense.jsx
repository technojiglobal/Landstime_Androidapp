import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

const data = [
  { day: "Mon", income: 45, expense: 28 },
  { day: "Tue", income: 52, expense: 31 },
  { day: "Wed", income: 38, expense: 22 },
  { day: "Thu", income: 68, expense: 34 },
  { day: "Fri", income: 78, expense: 41 },
  { day: "Sat", income: 88, expense: 48 },
  { day: "Sun", income: 33, expense: 18 },
];

const WeeklyIncomeExpense = () => {
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-6">
      <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-6">
        <BarChart3 className="text-blue-400" size={18} />
        Weekly Income vs Expense
      </h3>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" tickFormatter={(v) => `₹${v}K`} />
            <Tooltip formatter={(v) => `₹${v}K`} />
            <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" fill="#EF4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyIncomeExpense;
