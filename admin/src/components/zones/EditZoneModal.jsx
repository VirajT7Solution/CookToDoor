import React, { useState } from "react";
import { updateZone } from "../../api/deliveryZonesApi";

export default function EditZoneModal({ onClose, refresh, data }) {
  const [form, setForm] = useState({
    zoneName: data.zoneName,
    city: data.city,
    pincodeRanges: data.pincodeRanges,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateZone(data.id, form);
      refresh();
      onClose();
    } catch (err) {
      console.error("Update Zone Failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Edit Delivery Zone</h3>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="zoneName"
            value={form.zoneName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />

          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />

          <input
            type="text"
            name="pincodeRanges"
            value={form.pincodeRanges}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
