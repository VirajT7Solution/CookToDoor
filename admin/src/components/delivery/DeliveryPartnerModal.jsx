// src/components/delivery/DeliveryPartnerModal.jsx
import React, { useState } from "react";
import {
  createDeliveryPartner,
  updateDeliveryPartner,
} from "../../api/deliveryPartnerApi";

export default function DeliveryPartnerModal({
  close,
  editData,
  refresh,
}) {
  const [form, setForm] = useState({
    fullName: editData?.fullName || "",
    phoneNumber: editData?.phoneNumber || "",
    isActive: editData?.isActive ?? true,
  });

  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(editData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      if (isEdit) {
        await updateDeliveryPartner(editData.id, form);
      } else {
        await createDeliveryPartner(form);
      }

      refresh();
      close();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 w-full max-w-md rounded-xl shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? "Edit Delivery Partner" : "Add Delivery Partner"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-600">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            <label className="text-sm text-slate-600">Active</label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={close}
            className="px-4 py-2 text-sm border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700"
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
