// components/superadmin/SectionHeader.jsx
const SectionHeader = ({ title }) => {
  return (
    <div className="flex items-center gap-3 mt-10 mb-6">
      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="flex-1 h-px bg-white/10 ml-2" />
    </div>
  );
};

export default SectionHeader;
