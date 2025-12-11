// src/components/common/ConfirmDialog.jsx
import React from "react";

export default function ConfirmDialog({ message, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl">
        <p className="text-sm text-slate-700">{message}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
