const ProfitLossSummary = () => {
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-6">
      <h3 className="text-white font-semibold text-lg mb-2">
        Profit & Loss Summary
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Detailed breakdown of income and expenses
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-500/20 to-[#0B1220]">
          <h4 className="text-emerald-400 font-semibold mb-4">
            Income Sources
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Property Sales</span>
              <span className="text-white">₹12.5L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Subscriptions</span>
              <span className="text-white">₹6.8L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Interior Design</span>
              <span className="text-white">₹3.2L</span>
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-red-500/20 to-[#0B1220]">
          <h4 className="text-red-400 font-semibold mb-4">
            Major Expenses
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Salaries</span>
              <span className="text-white">₹4.5L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Marketing</span>
              <span className="text-white">₹3.2L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Infrastructure</span>
              <span className="text-white">₹2.1L</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-yellow-500/20 to-[#0B1220]">
          <h4 className="text-yellow-400 font-semibold mb-4">
            Summary
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Total Income</span>
              <span className="text-emerald-400">₹24.5L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Expenses</span>
              <span className="text-red-400">₹12.8L</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-gray-200">Net Profit</span>
              <span className="text-emerald-400">₹11.7L</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossSummary;
