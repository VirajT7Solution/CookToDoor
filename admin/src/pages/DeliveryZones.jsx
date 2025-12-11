// src/pages/DeliveryZones.jsx
import React, { useEffect, useState } from "react";
import {
  getZones,
  deleteZone,
  assignProviderToZone,
} from "../api/deliveryZoneApi";

import DeliveryZoneModal from "../components/zones/DeliveryZoneModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import AssignProviderModal from "../components/zones/AssignProviderModal";

export default function DeliveryZones() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [assignModal, setAssignModal] = useState({
    show: false,
    zone: null,
  });

  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    id: null,
  });

  const fetchZones = async () => {
    setLoading(true);
    try {
      const res = await getZones();
      setZones(res.data);
    } catch (err) {
      console.error("Failed to fetch zones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await deleteZone(id);
    setConfirmDelete({ show: false, id: null });
    fetchZones();
  };

  const handleAssignProvider = (zone) => {
    setAssignModal({ show: true, zone });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Delivery Zones
          </h2>
          <p className="text-sm text-slate-500">
            Create and manage delivery zones.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700"
        >
          + Add Zone
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">ID</th>
              <th className="p-3 text-left text-sm font-semibold">Zone Name</th>
              <th className="p-3 text-left text-sm font-semibold">
                Assigned Provider
              </th>
              <th className="p-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-500">
                  Loading zones...
                </td>
              </tr>
            ) : zones.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-500">
                  No delivery zones found.
                </td>
              </tr>
            ) : (
              zones.map((z) => (
                <tr
                  key={z.id}
                  className="border-b hover:bg-slate-50 transition"
                >
                  <td className="p-3 text-sm">{z.id}</td>
                  <td className="p-3 text-sm">{z.zoneName}</td>

                  <td className="p-3 text-sm">
                    {z.providerName ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                        {z.providerName}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">
                        Not Assigned
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right text-sm">
                    <button
                      onClick={() => handleAssignProvider(z)}
                      className="px-3 py-1 text-primary-600 hover:text-primary-800"
                    >
                      Assign
                    </button>

                    <button
                      onClick={() => handleEdit(z)}
                      className="px-3 py-1 text-primary-600 hover:text-primary-800"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        setConfirmDelete({ show: true, id: z.id })
                      }
                      className="px-3 py-1 text-red-600 hover:text-red-800"
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

      {/* Modals */}
      {showModal && (
        <DeliveryZoneModal
          close={() => setShowModal(false)}
          editData={editData}
          refresh={fetchZones}
        />
      )}

      {assignModal.show && (
        <AssignProviderModal
          zone={assignModal.zone}
          close={() => setAssignModal({ show: false, zone: null })}
          refresh={fetchZones}
        />
      )}

      {confirmDelete.show && (
        <ConfirmDialog
          message="Are you sure you want to delete this zone?"
          onCancel={() => setConfirmDelete({ show: false, id: null })}
          onConfirm={() => handleDelete(confirmDelete.id)}
        />
      )}
    </div>
  );
}
