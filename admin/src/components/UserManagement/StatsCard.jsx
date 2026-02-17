// admin/src/components/UserManagement/StatsCard.jsx

export default function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow transition-shadow flex items-center justify-between gap-4">
      {/* Left: text content */}
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm text-gray-500 truncate">{title}</p>
        <h2 className="text-xl sm:text-2xl font-semibold mt-1 text-gray-900">{value}</h2>
        {trend && (
          <p className="text-xs sm:text-sm text-green-700 font-medium mt-1 truncate">{trend}</p>
        )}
      </div>

      {/* Right: icon */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
        <Icon className="text-blue-600" size={20} />
      </div>
    </div>
  );
}