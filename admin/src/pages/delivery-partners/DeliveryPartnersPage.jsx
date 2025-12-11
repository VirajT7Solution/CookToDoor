// src/pages/delivery-partners/DeliveryPartnersPage.jsx
import React, { useEffect, useState } from "react";
import {
  getDeliveryPartners,
  deleteDeliveryPartner,
  getDeliveryPartnerById,
} from "../../api/deliveryPartnersApi";

import PartnerModal from "./PartnerModal";
import DeleteConfirmModal from "../users/DeleteConfirmModal"; // Reuse same modal

export default function DeliveryPartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [deleteDialog, setDeleteDialog] = useState({
    show: false,
    id: null,
  });

  const loadPartners = async () => {
    try {
      const res = await getDeliveryPartners();
      setPartners(res.data);
    } catch (err) {
      console.error("Failed to load delivery partners", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = async (id) => {
    try {
      const res = await getDeliveryPartnerById(id);
      setEditData(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to load partner", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDeliveryPartner(deleteDialog.id);
      setDeleteDialog({ show: false, id: null });
      loadPartners();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Delivery Partners
          </h2>
          <p className="text-sm text-slate-500">
            Manage delivery partners and their availability.
          </p>
        </div>

        
      </div>

      {/* Table */}
      <div className="bg-white border shadow-sm rounded-xl overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-sm text-left">ID</th>
              <th className="p-3 text-sm text-left">Name</th>
              <th className="p-3 text-sm text-left">Vehicle</th>
              <th className="p-3 text-sm text-left">Available</th>
              <th className="p-3 text-sm text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-5 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : partners.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-5 text-center text-slate-500">
                  No partners found.
                </td>
              </tr>
            ) : (
              partners.map((p) => (
                <tr key={p.id} className="border-b hover:bg-slate-50">
                  <td className="p-3 text-sm">{p.id}</td>
                  <td className="p-3 text-sm">{p.fullName}</td>
                  <td className="p-3 text-sm">{p.vehicleType}</td>
                  <td className="p-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        p.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.isAvailable ? "Available" : "Busy"}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleEdit(p.id)}
                      className="px-3 py-1 text-sm text-primary-600 hover:text-primary-800"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        setDeleteDialog({ show: true, id: p.id })
                      }
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <PartnerModal
          close={() => setShowModal(false)}
          editData={editData}
          refresh={loadPartners}
        />
      )}

      {/* Delete Confirmation */}
      {deleteDialog.show && (
        <DeleteConfirmModal
          message="Are you sure you want to delete this partner?"
          onCancel={() => setDeleteDialog({ show: false, id: null })}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
