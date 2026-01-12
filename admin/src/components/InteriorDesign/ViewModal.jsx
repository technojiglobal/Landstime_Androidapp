import { X } from "lucide-react";

export default function ViewModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] relative">
        <X className="absolute right-4 top-4 cursor-pointer" onClick={onClose} />
        <pre className="text-sm">{JSON.stringify(item, null, 2)}</pre>
      </div>
    </div>
  );
}
