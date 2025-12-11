// src/pages/PendingProviders.jsx
import React, { useEffect, useState } from "react";
import {
  getPendingProviders,
  approveProvider,
  rejectProvider,
  getProviderById,
} from "../api/providerApi";

import ProviderDetailsModal from "../components/providers/ProviderDetailsModal";
import ConfirmDialog from "../components/common/ConfirmDialog";

export default function PendingProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProvider, setSelectedProvider] = useState(null);

  const [confirmApproval, setConfirmApproval] = useState({
    show: false,
    id: null,
  });

  const [confirmReject, setConfirmReject] = useState({
    show: false,
    id: null,
  });

  const fetchPendingProviders = async () => {
    setLoading(true);

    try {
      const res = await getPendingProviders();
      setProviders(res.data);
    } catch (err) {
      console.error("Failed to load pending providers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const handleView = async (id) => {
    const res = await getProviderById(id);
    setSelectedProvider(res.data);
  };

  const handleApprove = async (id) => {
    setConfirmApproval({ show: false, id: null });
    await approveProvider(id);
    fetchPendingProviders();
  };

  const handleReject = async (id) => {
    setConfirmReject({ show: false, id: null });
    await rejectProvider(id);
    fetchPendingProviders();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        Pending Providers
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Manage provider approvals awaiting verification.
      </p>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-slate-600">ID</th>
              <th className="p-3 text-left text-sm font-semibold text-slate-600">Business Name</th>
              <th className="p-3 text-left text-sm font-semibold text-slate-600">Phone</th>
              <th className="p-3 text-right text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-500">
                  Loading pending providers...
                </td>
              </tr>
            ) : providers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-500">
                  No pending providers.
                </td>
              </tr>
            ) : (
              providers.map((p) => (
                <tr key={p.id} className="border-b hover:bg-slate-50">
                  <td className="p-3 text-sm">{p.id}</td>
                  <td className="p-3 text-sm">{p.businessName}</td>
                  <td className="p-3 text-sm">{p.phoneNumber}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleView(p.id)}
                      className="px-3 py-1 text-sm text-primary-600 hover:text-primary-800"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        setConfirmApproval({ show: true, id: p.id })
                      }
                      className="px-3 py-1 text-sm text-green-600 hover:text-green-800"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        setConfirmReject({ show: true, id: p.id })
                      }
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {selectedProvider && (
        <ProviderDetailsModal
          data={selectedProvider}
          close={() => setSelectedProvider(null)}
        />
      )}

      {confirmApproval.show && (
        <ConfirmDialog
          message="Approve this provider?"
          onCancel={() => setConfirmApproval({ show: false, id: null })}
          onConfirm={() => handleApprove(confirmApproval.id)}
        />
      )}

      {confirmReject.show && (
        <ConfirmDialog
          message="Reject this provider?"
          onCancel={() => setConfirmReject({ show: false, id: null })}
          onConfirm={() => handleReject(confirmReject.id)}
        />
      )}
    </div>
  );
}
