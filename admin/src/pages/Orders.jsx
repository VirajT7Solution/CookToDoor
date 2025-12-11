// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import { getAllOrders } from "../api/orderApi";

import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import AssignDeliveryModal from "../components/orders/AssignDeliveryModal";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assignOrder, setAssignOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusBadge = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-700",
      CONFIRMED: "bg-blue-100 text-blue-700",
      PREPARING: "bg-teal-100 text-teal-700",
      READY: "bg-purple-100 text-purple-700",
      OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
      DELIVERED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-2 py-0.5 rounded-md text-xs font-medium ${
          colors[status] || "bg-slate-100 text-slate-700"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        Orders
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Manage all customer orders.
      </p>

      {/* Table */}
      <div className="bg-white border shadow-sm rounded-xl overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">Order ID</th>
              <th className="p-3 text-left text-sm font-semibold">Customer</th>
              <th className="p-3 text-left text-sm font-semibold">Provider</th>
              <th className="p-3 text-left text-sm font-semibold">Amount</th>
              <th className="p-3 text-left text-sm font-semibold">Status</th>
              <th className="p-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b hover:bg-slate-50 transition"
                >
                  <td className="p-3 text-sm">{o.id}</td>
                  <td className="p-3 text-sm">Customer #{o.customerId}</td>
                  <td className="p-3 text-sm">{o.providerName}</td>
                  <td className="p-3 text-sm">₹{o.totalAmount}</td>
                  <td className="p-3 text-sm">{statusBadge(o.orderStatus)}</td>

                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="px-3 py-1 text-sm text-primary-600 hover:text-primary-800"
                    >
                      View
                    </button>

                    <button
                      onClick={() => setAssignOrder(o)}
                      className="px-3 py-1 text-sm text-green-600 hover:text-green-800"
                    >
                      Assign Delivery
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          close={() => setSelectedOrder(null)}
        />
      )}

      {assignOrder && (
        <AssignDeliveryModal
          order={assignOrder}
          close={() => setAssignOrder(null)}
          refresh={fetchOrders}
        />
      )}
    </div>
  );
}
