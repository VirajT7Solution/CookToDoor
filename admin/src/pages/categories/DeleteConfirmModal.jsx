// src/components/common/DeleteConfirmModal.jsx
import React from "react";

export default function DeleteConfirmModal({ message, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-lg">
        
        <h3 className="text-lg font-semibold text-slate-900 mb-3">
          Confirm Delete
        </h3>

        <p className="text-sm text-slate-600 mb-6">
          {message || "Are you sure you want to delete this item?"}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}
