// src/components/orders/OrderDetailsModal.jsx
import React from "react";

export default function OrderDetailsModal({ order, close }) {
  const getStatusBadge = (status) => {
    const styles = {
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
        className={`px-2 py-1 rounded text-xs font-medium ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50"
      onClick={close}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Order Details #{order.id}
          </h2>
          <button
            onClick={close}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Order Status */}
          <div className="flex items-center gap-3">
            <strong className="text-sm text-slate-700 min-w-[100px]">
              Status:
            </strong>
            {getStatusBadge(order.orderStatus)}
          </div>

          {/* Customer & Provider Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong className="text-sm text-slate-700 block mb-1">
                Customer ID:
              </strong>
              <p className="text-sm text-slate-600">#{order.customerId}</p>
            </div>
            <div>
              <strong className="text-sm text-slate-700 block mb-1">
                Provider:
              </strong>
              <p className="text-sm text-slate-600">
                {order.providerName || "N/A"}
              </p>
            </div>
          </div>

          {/* Delivery Partner */}
          {order.deliveryPartnerName && (
            <div>
              <strong className="text-sm text-slate-700 block mb-1">
                Delivery Partner:
              </strong>
              <p className="text-sm text-slate-600">
                {order.deliveryPartnerName}
              </p>
            </div>
          )}

          {/* Order Items */}
          {order.cartItems && order.cartItems.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-slate-900 mb-3">Order Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-2 text-left font-semibold text-slate-700">
                        Item
                      </th>
                      <th className="p-2 text-center font-semibold text-slate-700">
                        Qty
                      </th>
                      <th className="p-2 text-right font-semibold text-slate-700">
                        Price
                      </th>
                      <th className="p-2 text-right font-semibold text-slate-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.cartItems.map((item) => (
                      <tr key={item.cartItemId} className="border-t">
                        <td className="p-2 text-slate-700">{item.itemName}</td>
                        <td className="p-2 text-center text-slate-600">
                          {item.quantity}
                        </td>
                        <td className="p-2 text-right text-slate-600">
                          ₹{item.itemPrice?.toFixed(2) || "0.00"}
                        </td>
                        <td className="p-2 text-right font-medium text-slate-900">
                          ₹{item.itemTotal?.toFixed(2) || "0.00"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold text-slate-900 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium text-slate-900">
                  ₹{order.subtotal?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Delivery Fee:</span>
                <span className="font-medium text-slate-900">
                  ₹{order.deliveryFee?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Platform Commission:</span>
                <span className="font-medium text-slate-900">
                  ₹{order.platformCommission?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold text-base">
                <span className="text-slate-900">Total Amount:</span>
                <span className="text-primary-600">
                  ₹{order.totalAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {order.deliveryAddress && (
            <div className="mt-4">
              <h3 className="font-semibold text-slate-900 mb-2">
                Delivery Address
              </h3>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                {order.deliveryAddress}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong className="text-slate-700 block mb-1">Order Time:</strong>
              <p className="text-slate-600">{formatDate(order.orderTime)}</p>
            </div>
            {order.estimatedDeliveryTime && (
              <div>
                <strong className="text-slate-700 block mb-1">
                  Estimated Delivery:
                </strong>
                <p className="text-slate-600">
                  {formatDate(order.estimatedDeliveryTime)}
                </p>
              </div>
            )}
            {order.deliveryTime && (
              <div>
                <strong className="text-slate-700 block mb-1">
                  Delivered At:
                </strong>
                <p className="text-slate-600">{formatDate(order.deliveryTime)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={close}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
