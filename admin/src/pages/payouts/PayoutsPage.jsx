// src/pages/payouts/PayoutsPage.jsx
import React, { useEffect, useState } from "react";
import {
  getProvidersWithPendingAmounts,
  processPayout,
  getPayoutHistory,
} from "../../api/payoutsApi";
import ProcessPayoutModal from "../../components/payouts/ProcessPayoutModal";

export default function PayoutsPage() {
  const [providers, setProviders] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "history"

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "pending") {
        const res = await getProvidersWithPendingAmounts();
        setProviders(res.data || []);
      } else {
        const res = await getPayoutHistory();
        setHistory(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayout = (provider) => {
    setSelectedProvider(provider);
    setShowProcessModal(true);
  };

  const handlePayoutSuccess = () => {
    setShowProcessModal(false);
    setSelectedProvider(null);
    fetchData();
  };

  const formatCurrency = (amount) => {
    if (amount == null) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Payout Management
        </h1>
        <p className="text-sm text-slate-600">
          Process payouts to providers and view payout history
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 font-medium text-sm transition ${
              activeTab === "pending"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pending Payouts ({providers.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 font-medium text-sm transition ${
              activeTab === "history"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Payout History
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      ) : activeTab === "pending" ? (
        <PendingPayoutsList
          providers={providers}
          onProcessPayout={handleProcessPayout}
          formatCurrency={formatCurrency}
        />
      ) : (
        <PayoutHistoryList
          history={history}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
        />
      )}

      {/* Process Payout Modal */}
      {showProcessModal && selectedProvider && (
        <ProcessPayoutModal
          provider={selectedProvider}
          onClose={() => {
            setShowProcessModal(false);
            setSelectedProvider(null);
          }}
          onSuccess={handlePayoutSuccess}
        />
      )}
    </div>
  );
}

function PendingPayoutsList({ providers, onProcessPayout, formatCurrency }) {
  if (providers.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <p className="text-slate-500">No providers with pending payouts.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Business Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Pending Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Last Payout
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {providers.map((provider) => (
              <tr
                key={provider.providerId}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-slate-900">
                    #{provider.providerId}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-slate-900">
                    {provider.businessName || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(provider.pendingAmount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {provider.lastPayoutDate
                    ? new Date(provider.lastPayoutDate).toLocaleDateString(
                        "en-IN"
                      )
                    : "Never"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => onProcessPayout(provider)}
                    className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                  >
                    Process Payout
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden p-4 space-y-4">
        {providers.map((provider) => (
          <div
            key={provider.providerId}
            className="bg-white border rounded-xl p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {provider.businessName}
                </h3>
                <p className="text-xs text-slate-500">ID: #{provider.providerId}</p>
              </div>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(provider.pendingAmount)}
              </span>
            </div>
            <div className="text-xs text-slate-600 mb-3">
              Last Payout:{" "}
              {provider.lastPayoutDate
                ? new Date(provider.lastPayoutDate).toLocaleDateString("en-IN")
                : "Never"}
            </div>
            <button
              onClick={() => onProcessPayout(provider)}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Process Payout
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PayoutHistoryList({
  history,
  formatCurrency,
  formatDate,
  getStatusColor,
}) {
  if (history.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <p className="text-slate-500">No payout history found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Processed At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {history.map((transaction) => (
              <tr
                key={transaction.transactionId}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  #{transaction.transactionId}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {transaction.businessName || `Provider #${transaction.providerId}`}
                    </div>
                    <div className="text-xs text-slate-500">
                      ID: #{transaction.providerId}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.paymentMethod === "CASH" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Cash
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Online
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {formatDate(transaction.processedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden p-4 space-y-4">
        {history.map((transaction) => (
          <div
            key={transaction.transactionId}
            className="bg-white border rounded-xl p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Transaction #{transaction.transactionId}
                </p>
                <p className="text-xs text-slate-500">
                  {transaction.businessName || `Provider #${transaction.providerId}`}
                  <span className="ml-1">(ID: #{transaction.providerId})</span>
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  transaction.status
                )}`}
              >
                {transaction.status}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Amount:</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Method:</span>
                <span>
                  {transaction.paymentMethod === "CASH" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Cash
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Online
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Processed:</span>
                <span className="text-slate-900">
                  {formatDate(transaction.processedAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


