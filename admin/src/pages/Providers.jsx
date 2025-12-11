// src/pages/Providers.jsx
import React, { useEffect, useState } from "react";
import {
  getAllProviders,
  deleteProvider,
  getProviderById,
} from "../api/providerApi";

import ConfirmDialog from "../components/common/ConfirmDialog";
import ProviderDetailsModal from "../components/providers/ProviderDetailsModal";

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    id: null,
  });

  const fetchProviders = async () => {
    setLoading(true);

    try {
      const res = await getAllProviders();
      setProviders(res.data);
    } catch (err) {
      console.error("Failed to load providers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleView = async (id) => {
    try {
      const res = await getProviderById(id);
      setSelectedProvider(res.data);
    } catch (err) {
      console.error("Failed to fetch provider", err);
    }
  };

  const handleDelete = async (id) => {
    setConfirmDelete({ show: false, id: null });

    try {
      await deleteProvider(id);
      fetchProviders();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        All Providers
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Manage tiffin service providers and their profiles.
      </p>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-slate-600">ID</th>
              <th className="p-3 text-left text-sm font-semibold text-slate-600">Business Name</th>
              <th className="p-3 text-left text-sm font-semibold text-slate-600">Phone</th>
              <th className="p-3 text-left text-sm font-semibold text-slate-600">Status</th>
              <th className="p-3 text-right text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">Loading providers...</td>
              </tr>
            ) : providers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">No providers found.</td>
              </tr>
            ) : (
              providers.map((p) => (
                <tr key={p.id} className="border-b hover:bg-slate-50 transition">
                  <td className="p-3 text-sm">{p.id}</td>
                  <td className="p-3 text-sm font-medium">{p.businessName}</td>
                  <td className="p-3 text-sm">{p.phoneNumber}</td>
                  <td className="p-3 text-sm">
                    {p.isApproved ? (
                      <span className="text-green-600 font-medium">Approved</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">Pending</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleView(p.id)}
                      className="px-3 py-1 text-sm text-primary-600 hover:text-primary-800"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        setConfirmDelete({ show: true, id: p.id })
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

      {selectedProvider && (
        <ProviderDetailsModal
          data={selectedProvider}
          close={() => setSelectedProvider(null)}
        />
      )}

      {confirmDelete.show && (
        <ConfirmDialog
          message="Are you sure you want to delete this provider?"
          onCancel={() => setConfirmDelete({ show: false, id: null })}
          onConfirm={() => handleDelete(confirmDelete.id)}
        />
      )}
    </div>
  );
}
