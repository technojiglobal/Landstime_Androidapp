// components/superadmin/finance/StatFinanceCard.jsx
const StatFinanceCard = ({ title, value, change, icon: Icon, bg, color }) => {
  return (
    <div
      className="rounded-2xl p-6 flex justify-between items-center"
      style={{ background: bg }}
    >
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
        <p className="text-sm text-emerald-600 mt-2">{change}</p>
      </div>

      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}30`, color }}
      >
        <Icon size={22} />
      </div>
    </div>
  );
};

export default StatFinanceCard;
