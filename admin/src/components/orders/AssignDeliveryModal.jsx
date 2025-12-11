// src/components/orders/AssignDeliveryModal.jsx
import React, { useEffect, useState } from "react";
import { assignDelivery } from "../../api/orderApi";
import axiosClient from "../../api/axiosClient";

export default function AssignDeliveryModal({ order, close, refresh }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState("");

  const fetchPartners = async () => {
    try {
      const res = await axiosClient.get("/api/admin/delivery-partners");
      setPartners(res.data);
    } catch (err) {
      console.error("Failed to load partners", err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleAssign = async () => {
    if (!selectedPartner) return;

    setLoading(true);

    try {
      await assignDelivery(order.id, selectedPartner);
      refresh();
      close();
    } catch (err) {
      console.error("Assignment failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
          Assign Delivery for Order #{order.id}
        </h2>

        <div className="space-y-3">
          <label className="text-sm text-slate-600">Select Partner</label>
          <select
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Select delivery partner</option>

            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName} ({p.phoneNumber})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={close}
            className="px-4 py-2 text-sm border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
