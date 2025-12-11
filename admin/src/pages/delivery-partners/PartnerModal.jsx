// src/pages/delivery-partners/PartnerModal.jsx
import React, { useState } from "react";
import {
  createDeliveryPartner,
  updateDeliveryPartner,
} from "../../api/deliveryPartnersApi";

export default function PartnerModal({ close, refresh, editData }) {
  const isEdit = Boolean(editData);

  const [form, setForm] = useState({
    fullName: editData?.fullName || "",
    vehicleType: editData?.vehicleType || "BIKE",
    serviceArea: editData?.serviceArea || "",
    isAvailable: editData?.isAvailable || false,
    userId: editData?.userId || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateDeliveryPartner(editData.id, form);
      } else {
        await createDeliveryPartner(form);
      }

      refresh();
      close();
    } catch (err) {
      console.error("Save partner failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? "Edit Delivery Partner" : "Add Delivery Partner"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-sm">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded"
            />
          </div>

          {/* User ID */}
          <div>
            <label className="text-sm">User ID</label>
            <input
              type="number"
              name="userId"
              value={form.userId}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Vehicle */}
          <div>
            <label className="text-sm">Vehicle Type</label>
            <select
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded"
            >
              <option value="BIKE">Bike</option>
              <option value="SCOOTER">Scooter</option>
              <option value="BICYCLE">Bicycle</option>
              <option value="CAR">Car</option>
            </select>
          </div>

          {/* Service Area */}
          <div>
            <label className="text-sm">Service Area</label>
            <textarea
              name="serviceArea"
              value={form.serviceArea}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
            />
            <label>Available</label>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 text-sm bg-slate-200 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary-600 text-white rounded"
            >
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
