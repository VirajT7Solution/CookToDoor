import React, { useState } from "react";
import { createZone } from "../../api/deliveryZonesApi";

export default function CreateZoneModal({ onClose, refresh }) {
  const [form, setForm] = useState({
    zoneName: "",
    city: "",
    pincodeRanges: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createZone(form); // 🔥 Send body correctly
      refresh();              // 🔥 Reload zones
      onClose();              // 🔥 Close modal
    } catch (err) {
      console.error("Create Zone Error:", err);
      alert("Failed to create delivery zone");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Add Delivery Zone</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="zoneName"
            placeholder="Zone Name"
            className="w-full border p-2 rounded"
            value={form.zoneName}
            onChange={handleChange}
            required
          />

          <input
            name="city"
            placeholder="City"
            className="w-full border p-2 rounded"
            value={form.city}
            onChange={handleChange}
            required
          />

          <input
            name="pincodeRanges"
            placeholder="Comma-separated pincodes"
            className="w-full border p-2 rounded"
            value={form.pincodeRanges}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded"
            >
              Create Zone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
