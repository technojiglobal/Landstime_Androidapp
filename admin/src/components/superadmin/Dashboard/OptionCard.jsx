// components/superadmin/OptionCard.jsx
const OptionCard = ({ title, icon: Icon, color, items }) => {
  return (
    <div className="group bg-[#0B1220] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-yellow-500/30">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center
                     transition-transform duration-300
                     group-hover:scale-110"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon size={22} />
        </div>

        <h3
          className="font-semibold transition-colors duration-300
                     text-white group-hover:text-yellow-400"
        >
          {title}
        </h3>
      </div>

      {/* List */}
      <ul className="space-y-2 text-sm text-gray-400">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1 w-1 h-1 bg-gray-500 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OptionCard;
