// src/pages/providers/PendingProvidersPage.jsx
import React, { useEffect, useState } from "react";
import {
  getPendingProviders,
  approveProvider,
  rejectProvider,
} from "../../api/providersApi";

export default function PendingProvidersPage() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPending = async () => {
    setLoading(true);
    try {
      const res = await getPendingProviders();
      setPending(res.data);
    } catch (err) {
      console.error("Failed to load pending providers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (id) => {
    await approveProvider(id);
    loadPending();
  };

  const handleReject = async (id) => {
    await rejectProvider(id);
    loadPending();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Pending Provider Approvals</h2>

      <div className="bg-white border rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">ID</th>
              <th className="p-3 text-left text-sm font-semibold">Business Name</th>
              <th className="p-3 text-left text-sm font-semibold">Owner</th>
              <th className="p-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : pending.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-500">
                  No pending providers 🎉
                </td>
              </tr>
            ) : (
              pending.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-3 text-sm">{p.id}</td>
                  <td className="p-3 text-sm">{p.businessName}</td>
                  <td className="p-3 text-sm">{p.user?.username}</td>

                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleApprove(p.id)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(p.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
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
    </div>
  );
}
