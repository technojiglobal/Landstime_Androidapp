// components/superadmin/createAccount/StatMiniCard.jsx
const StatMiniCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-5 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <h3 className="text-2xl font-semibold text-white mt-1">{value}</h3>
      </div>

      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}20`, color }}
      >
        <Icon size={22} />
      </div>
    </div>
  );
};

export default StatMiniCard;
