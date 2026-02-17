
// admin/src/components/UserManagement/DeleteModal.jsx

export default function DeleteModal({
  title = "Delete Item",
  subtitle = "Are you sure you want to delete this item?",
  onCancel,
  onDelete,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:w-auto sm:min-w-[340px] sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-6 text-center shadow-2xl">

        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5">{title}</h3>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">{subtitle}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
