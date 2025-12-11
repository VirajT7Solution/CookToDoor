// src/pages/orders/AssignPartnerModal.jsx
import React, { useEffect, useState } from "react";
import { getAvailablePartners } from "../../api/deliveryPartnersApi";
import { assignDeliveryPartner } from "../../api/ordersApi";

export default function AssignPartnerModal({ orderId, close, refresh }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadPartners = async () => {
    try {
      const res = await getAvailablePartners();
      const available = res.data.filter((p) => p.isAvailable === true);
      setPartners(available);
    } catch (err) {
      console.error("Failed to load partners", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const handleAssign = async () => {
    if (!selectedPartner) return alert("Please select a delivery partner");

    setSubmitting(true);
    try {
      await assignDeliveryPartner(orderId, selectedPartner);
      refresh(); // reload orders list
      close();   // close modal
    } catch (err) {
      console.error("Assign failed", err);
      alert("Failed to assign delivery partner");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">

        <h2 className="text-lg font-semibold mb-4">
          Assign Delivery Partner
        </h2>

        {/* Partner List */}
        {loading ? (
          <p className="text-sm text-slate-600">Loading partners...</p>
        ) : partners.length === 0 ? (
          <p className="text-sm text-slate-600">
            No available partners right now.
          </p>
        ) : (
          <select
            className="w-full border rounded-lg p-2 text-sm"
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
          >
            <option value="">Select partner</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName} ({p.vehicleType})
              </option>
            ))}
          </select>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={close}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            Cancel
          </button>

          <button
            disabled={submitting}
            onClick={handleAssign}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? "Assigning..." : "Assign Partner"}
          </button>
        </div>
      </div>
    </div>
  );
}
