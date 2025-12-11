// src/components/payouts/ProcessPayoutModal.jsx
import React, { useState } from "react";
import { processPayout } from "../../api/payoutsApi";

export default function ProcessPayoutModal({ provider, onClose, onSuccess }) {
  const [amount, setAmount] = useState(provider.pendingAmount || 0);
  const [paymentMethod, setPaymentMethod] = useState("CASH"); // Default to CASH
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setProcessing(true);

    try {
      await processPayout(provider.providerId, amount, paymentMethod);
      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to process payout"
      );
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Process Payout
        </h2>

        <div className="mb-4">
          <p className="text-sm text-slate-600 mb-2">Provider:</p>
          <p className="font-semibold text-slate-900">{provider.businessName}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-slate-600 mb-2">Pending Amount:</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(provider.pendingAmount || 0)}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payout Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={provider.pendingAmount || 0}
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Maximum: {formatCurrency(provider.pendingAmount || 0)}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment Method
            </label>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH"
                  checked={paymentMethod === "CASH"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Cash</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Online</span>
              </label>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Payment method is saved for record keeping. Both methods are marked as completed immediately.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
              disabled={processing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              disabled={processing}
            >
              {processing ? "Processing..." : "Process Payout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


