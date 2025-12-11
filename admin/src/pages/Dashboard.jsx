// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../api/dashboardApi";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
      setError("Failed to load dashboard statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    if (amount == null) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className="text-slate-600">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-sm text-slate-600">
          Live statistics from PlateMate admin system
        </p>
      </div>

      {/* Main Stats Grid - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
              Total Users
            </p>
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold text-blue-900">{stats.totalUsers || 0}</p>
          <p className="text-xs text-blue-600 mt-1">
            {stats.totalCustomers || 0} customers
          </p>
        </div>

        {/* Total Providers */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
              Providers
            </p>
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold text-green-900">
            {stats.verifiedProviders || 0}
          </p>
          <p className="text-xs text-green-600 mt-1">
            {stats.pendingProviders || 0} pending
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
              Total Orders
            </p>
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold text-purple-900">
            {stats.totalOrders || 0}
          </p>
          <p className="text-xs text-purple-600 mt-1">
            {stats.todayOrders || 0} today
          </p>
        </div>

        {/* Total Revenue */}
        {/* <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
              Total Revenue
            </p>
            <svg
              className="w-5 h-5 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold text-amber-900">
            {formatCurrency(stats.totalRevenue)}
          </p>
          <p className="text-xs text-amber-600 mt-1">
            {formatCurrency(stats.todayRevenue)} today
          </p>
        </div> */}
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Delivery Partners */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Delivery Partners
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {stats.totalDeliveryPartners || 0}
          </p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs text-green-600">
              {stats.availableDeliveryPartners || 0} available
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">
              {stats.unavailableDeliveryPartners || 0} unavailable
            </span>
          </div>
        </div>

        {/* Payments */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Payments
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {stats.totalPayments || 0}
          </p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs text-green-600">
              {stats.successfulPayments || 0} successful
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-yellow-600">
              {stats.pendingPayments || 0} pending
            </span>
          </div>
        </div>

        {/* Payouts - NEW */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Payouts
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {stats.totalPayouts || 0}
          </p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs text-green-600">
              {formatCurrency(stats.totalPayoutAmount || 0)}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">
              {stats.todayPayouts || 0} today
            </span>
          </div>
        </div>

        {/* Active Carts - NEW */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Active Carts
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {stats.activeCarts || 0}
          </p>
          {/* <p className="text-xs text-slate-500 mt-2">
            {formatCurrency(stats.totalCartValue || 0)} total value
          </p> */}
        </div>
      </div>

      {/* Revenue Breakdown */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Today's Revenue
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(stats.todayRevenue)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {stats.todayOrders || 0} orders
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            This Week's Revenue
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(stats.weekRevenue)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {stats.weekOrders || 0} orders
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            This Month's Revenue
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(stats.monthRevenue)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {stats.monthOrders || 0} orders
          </p>
        </div>
      </div> */}

      {/* Orders by Status */}
      {stats.ordersByStatus && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Orders by Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => {
              const statusColors = {
                PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
                CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
                PREPARING: "bg-purple-50 text-purple-700 border-purple-200",
                READY: "bg-indigo-50 text-indigo-700 border-indigo-200",
                OUT_FOR_DELIVERY: "bg-orange-50 text-orange-700 border-orange-200",
                DELIVERED: "bg-green-50 text-green-700 border-green-200",
                CANCELLED: "bg-red-50 text-red-700 border-red-200",
              };
              const colorClass =
                statusColors[status] ||
                "bg-slate-50 text-slate-700 border-slate-200";

              return (
                <div
                  key={status}
                  className={`border rounded-lg p-3 text-center ${colorClass}`}
                >
                  <p className="text-xs font-semibold uppercase mb-1">
                    {status.replace(/_/g, " ")}
                  </p>
                  <p className="text-xl font-bold">{count}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payouts by Status - NEW */}
      {stats.payoutsByStatus && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Payouts by Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.payoutsByStatus).map(([status, count]) => {
              const statusColors = {
                PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
                PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
                COMPLETED: "bg-green-50 text-green-700 border-green-200",
                FAILED: "bg-red-50 text-red-700 border-red-200",
              };
              const colorClass =
                statusColors[status] ||
                "bg-slate-50 text-slate-700 border-slate-200";

              return (
                <div
                  key={status}
                  className={`border rounded-lg p-3 text-center ${colorClass}`}
                >
                  <p className="text-xs font-semibold uppercase mb-1">
                    {status}
                  </p>
                  <p className="text-xl font-bold">{count}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rating & Review Statistics - NEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Rating & Reviews
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Reviews</span>
              <span className="text-lg font-bold text-slate-900">
                {stats.totalReviews || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Average Rating</span>
              <span className="text-lg font-bold text-slate-900">
                {stats.averageRating
                  ? stats.averageRating.toFixed(1)
                  : "0.0"}{" "}
                ⭐
              </span>
            </div>
            {stats.reviewsByType && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  Reviews by Type
                </p>
                {Object.entries(stats.reviewsByType).map(([type, count]) => (
                  <div
                    key={type}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-slate-600">
                      {type.replace(/_/g, " ")}
                    </span>
                    <span className="font-semibold text-slate-900">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rating Distribution - NEW */}
        {stats.ratingDistribution && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Rating Distribution
            </h2>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating] || 0;
                const total = stats.totalReviews || 1;
                const percentage = (count / total) * 100;

                return (
                  <div key={rating} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">
                        {rating} ⭐ ({count})
                      </span>
                      <span className="font-semibold text-slate-900">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Payment Statistics
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Payment Amount</span>
              <span className="text-lg font-bold text-slate-900">
                {formatCurrency(stats.totalPaymentAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Today's Payments</span>
              <span className="text-lg font-bold text-slate-900">
                {formatCurrency(stats.todayPaymentAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Failed Payments</span>
              <span className="text-lg font-bold text-red-600">
                {stats.failedPayments || 0}
              </span>
            </div>
          </div>
        </div> */}

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Quick Stats
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Customers</span>
              <span className="text-lg font-bold text-slate-900">
                {stats.totalCustomers || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Providers</span>
              <span className="text-lg font-bold text-slate-900">
                {stats.totalProviders || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Pending Approvals</span>
              <span className="text-lg font-bold text-yellow-600">
                {stats.pendingProviders || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Commission Deducted</span>
              <span className="text-lg font-bold text-slate-900">
                {formatCurrency(stats.totalCommissionDeducted || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
