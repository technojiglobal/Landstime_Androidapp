
const colorMap = {
  blue: {
    bg: "bg-blue-100",
    icon: "text-blue-600",
  },
  green: {
    bg: "bg-green-100",
    icon: "text-green-600",
  },
  yellow: {
    bg: "bg-yellow-100",
    icon: "text-yellow-600",
  },
  red: {
    bg: "bg-red-100",
    icon: "text-red-600",
  },
};

export default function StatCard({ title, value, icon: Icon, color = "blue" }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow transition flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h2 className="text-2xl font-semibold mt-1">{value}</h2>
      </div>

      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color].bg}`}
      >
        <Icon className={`${colorMap[color].icon}`} />
      </div>
    </div>
  );
}
