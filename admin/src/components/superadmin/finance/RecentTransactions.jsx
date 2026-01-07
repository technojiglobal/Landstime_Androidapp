import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";

const transactions = [
  {
    title: "Property Sale Commission",
    meta: "Today, 2:30 PM • Admin A",
    amount: 125,
    type: "income",
  },
  {
    title: "Marketing Campaign",
    meta: "Today, 11:00 AM • System",
    amount: 45,
    type: "expense",
  },
  {
    title: "Subscription Revenue",
    meta: "Yesterday • Admin B",
    amount: 89,
    type: "income",
  },
  {
    title: "Server Costs",
    meta: "Yesterday • System",
    amount: 32,
    type: "expense",
  },
  {
    title: "Interior Design Fee",
    meta: "2 days ago • Admin C",
    amount: 56,
    type: "income",
  },
];

const RecentTransactions = () => {
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <DollarSign size={18} className="text-yellow-400" />
          Recent Transactions
        </h3>

        <button className="text-sm text-yellow-400 hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((t, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-[#111827] border border-white/5 rounded-xl p-4"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  t.type === "income"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {t.type === "income" ? (
                  <ArrowUpRight />
                ) : (
                  <ArrowDownRight />
                )}
              </div>

              <div>
                <p className="text-white font-medium">{t.title}</p>
                <p className="text-sm text-gray-400">{t.meta}</p>
              </div>
            </div>

            <p
              className={`font-semibold ${
                t.type === "income"
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {t.type === "income" ? "+" : "-"}₹{t.amount}K
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
