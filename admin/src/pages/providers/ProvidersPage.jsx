// src/pages/providers/ProvidersPage.jsx
import React, { useEffect, useState } from "react";
import {
  getProviders,
  approveProvider,
  rejectProvider,
  deleteProvider,
} from "../../api/providersApi";
import ProviderDetailsModal from "../../components/providers/ProviderDetailsModal";

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDetailsProviderId, setViewDetailsProviderId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getProviders();
      // Filter out pending providers - only show verified providers
      const verifiedProviders = res.data.filter(
        (provider) => provider.isVerified === true
      );
      setProviders(verifiedProviders);
    } catch (err) {
      console.error("Failed to fetch providers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveProvider(id);
      fetchData();
    } catch (err) {
      console.error("Failed to approve provider", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectProvider(id);
      fetchData();
    } catch (err) {
      console.error("Failed to reject provider", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this provider?")) {
      try {
        await deleteProvider(id);
        fetchData();
      } catch (err) {
        console.error("Failed to delete provider", err);
      }
    }
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Providers Management
        </h2>
        <p className="text-sm text-slate-600">
          Manage all verified tiffin providers on the platform. View details and
          manage provider accounts.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase mb-1">
            Verified Providers
          </p>
          <p className="text-2xl font-bold text-green-600">
            {providers.length}
          </p>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase mb-1">
            Total Providers
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {providers.length}
          </p>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  View Details
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Delete
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mb-2"></div>
                      <p className="text-sm text-slate-500">
                        Loading providers...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : providers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <p className="text-sm">No verified providers found.</p>
                  </td>
                </tr>
              ) : (
                providers.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">
                        #{p.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">
                        {p.businessName || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        {p.user?.username || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Verified
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => setViewDetailsProviderId(p.id)}
                        className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <svg
                          className="w-4 h-4 mr-1.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow"
                        title="Delete Provider"
                      >
                        <svg
                          className="w-4 h-4 mr-1.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden p-4 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-2"></div>
              <p className="text-sm text-slate-500">Loading providers...</p>
            </div>
          ) : providers.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              No providers found.
            </p>
          ) : (
            providers.map((p) => (
              <div
                key={p.id}
                className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">
                      {p.businessName}
                    </h3>
                    <p className="text-xs text-slate-500">ID: #{p.id}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Verified
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-4">
                  Owner:{" "}
                  <span className="font-medium text-slate-900">
                    {p.user?.username}
                  </span>
                </p>

                {/* Action Buttons Grid */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => setViewDetailsProviderId(p.id)}
                    className="flex flex-col items-center justify-center px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition active:scale-95"
                  >
                    <svg
                      className="w-4 h-4 mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex flex-col items-center justify-center px-3 py-2 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition active:scale-95"
                  >
                    <svg
                      className="w-4 h-4 mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Provider Details Modal */}
      {viewDetailsProviderId && (
        <ProviderDetailsModal
          providerId={viewDetailsProviderId}
          close={() => setViewDetailsProviderId(null)}
        />
      )}
    </div>
  );
}
