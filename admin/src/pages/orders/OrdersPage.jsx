// // src/pages/orders/OrdersPage.jsx
// import React, { useEffect, useState } from "react";
// import { getAllOrders } from "../../api/ordersApi";
// import AssignPartnerModal from "./AssignPartnerModal";

// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [assignModal, setAssignModal] = useState({
//     show: false,
//     orderId: null,
//   });

//   const loadOrders = async () => {
//     try {
//       const res = await getAllOrders();
//       setOrders(res.data);
//     } catch (err) {
//       console.error("Failed to load orders", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   const getStatusBadge = (status) => {
//     const styles = {
//       READY: "bg-blue-100 text-blue-700",
//       OUT_FOR_DELIVERY: "bg-yellow-100 text-yellow-700",
//       DELIVERED: "bg-green-100 text-green-700",
//       CANCELLED: "bg-red-100 text-red-700",
//     };

//     return (
//       <span
//         className={`px-2 py-1 rounded text-xs font-medium ${
//           styles[status] || "bg-gray-100 text-gray-700"
//         }`}
//       >
//         {status}
//       </span>
//     );
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold text-slate-900 mb-4">
//         Orders Management
//       </h2>

//       <div className="bg-white border shadow-sm rounded-xl overflow-hidden">
//         <table className="min-w-full">
//           <thead className="bg-slate-50 border-b">
//             <tr>
//               <th className="p-3 text-left text-sm font-semibold">Order ID</th>
//               <th className="p-3 text-left text-sm font-semibold">Customer</th>
//               <th className="p-3 text-left text-sm font-semibold">Provider</th>
//               <th className="p-3 text-left text-sm font-semibold">Amount</th>
//               <th className="p-3 text-left text-sm font-semibold">Status</th>
//               <th className="p-3 text-right text-sm font-semibold">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={6} className="p-5 text-center text-slate-500">
//                   Loading orders...
//                 </td>
//               </tr>
//             ) : orders.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="p-5 text-center text-slate-500">
//                   No orders found.
//                 </td>
//               </tr>
//             ) : (
//               orders.map((o) => (
//                 <tr key={o.id} className="border-b hover:bg-slate-50">
//                   <td className="p-3 text-sm">{o.id}</td>
//                   <td className="p-3 text-sm">{o.customerName}</td>
//                   <td className="p-3 text-sm">{o.providerName}</td>
//                   <td className="p-3 text-sm font-medium">₹{o.totalAmount}</td>
//                   <td className="p-3 text-sm">{getStatusBadge(o.orderStatus)}</td>

//                   <td className="p-3 text-right">
//                     <button className="px-3 py-1 text-sm text-primary-600 hover:text-primary-800">
//                       View
//                     </button>

//                     {o.orderStatus === "READY" && (
//                       <button
//                         onClick={() =>
//                           setAssignModal({ show: true, orderId: o.id })
//                         }
//                         className="ml-2 px-3 py-1 text-sm text-green-600 hover:text-green-800"
//                       >
//                         Assign Delivery
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* 📌 Assign Partner Modal */}
//       {assignModal.show && (
//         <AssignPartnerModal
//           orderId={assignModal.orderId}
//           close={() => setAssignModal({ show: false, orderId: null })}
//           refresh={loadOrders}
//         />
//       )}
//     </div>
//   );
// }


// src/pages/orders/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../api/ordersApi";
import AssignPartnerModal from "./AssignPartnerModal";
import OrderDetailsModal from "../../components/orders/OrderDetailsModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [assignModal, setAssignModal] = useState({
    show: false,
    orderId: null,
  });

  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load orders. Please check if the backend server is running.";
      setError(errorMessage);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

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

  // Show error message if there's an error
  if (error && !loading) {
    return (
      <div className="p-6 animate-fadeIn">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Orders Management
        </h2>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-800 font-semibold mb-2">
                Error Loading Orders
              </h3>
              <p className="text-red-700 text-sm mb-4">{error}</p>
              <p className="text-red-600 text-xs">
                Status Code:{" "}
                {error.includes("500")
                  ? "500 (Internal Server Error)"
                  : "Error"}
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={loadOrders}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              Retry
            </button>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Orders Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            View and manage all customer orders
          </p>
        </div>
        {error && (
          <button
            onClick={loadOrders}
            className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Refresh
          </button>
        )}
      </div>

      {/* Wrapper */}
      <div className="bg-white border shadow-sm rounded-xl overflow-hidden transition-all">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="min-w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-3 text-left text-sm font-semibold">
                  Order ID
                </th>
                <th className="p-3 text-left text-sm font-semibold">
                  Customer
                </th>
                <th className="p-3 text-left text-sm font-semibold">
                  Provider
                </th>
                <th className="p-3 text-left text-sm font-semibold">
                  Delivery Partner
                </th>
                <th className="p-3 text-left text-sm font-semibold">Total</th>
                <th className="p-3 text-left text-sm font-semibold">Status</th>
                <th className="p-3 text-left text-sm font-semibold">
                  Order Time
                </th>
                <th className="p-3 text-right text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-5 text-center text-slate-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mr-2"></div>
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-5 text-center text-slate-500">
                    <div className="py-8">
                      <p className="text-slate-600 mb-2">No orders found.</p>
                      <p className="text-xs text-slate-400">
                        Orders will appear here once customers place them.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((o, index) => (
                  <tr
                    key={o.id}
                    className="border-b hover:bg-slate-50 transition-all animate-slideUp"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <td className="p-3 text-sm font-medium">#{o.id}</td>
                    <td className="p-3 text-sm">
                      Customer #{o.customerId}
                    </td>
                    <td className="p-3 text-sm">{o.providerName || "N/A"}</td>
                    <td className="p-3 text-sm">
                      {o.deliveryPartnerName || (
                        <span className="text-slate-400">Not assigned</span>
                      )}
                    </td>
                    <td className="p-3 text-sm font-medium">
                      ₹{o.totalAmount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="p-3 text-sm">
                      {getStatusBadge(o.orderStatus)}
                    </td>
                    <td className="p-3 text-sm text-slate-600">
                      {o.orderTime
                        ? new Date(o.orderTime).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="px-3 py-1 text-sm text-primary-600 hover:text-primary-800 transition"
                      >
                        View
                      </button>

                      {o.orderStatus === "READY" && (
                        <button
                          onClick={() =>
                            setAssignModal({ show: true, orderId: o.id })
                          }
                          className="px-3 py-1 text-sm text-green-600 hover:text-green-800 transition"
                        >
                          Assign Delivery
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-3 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-slate-500">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600 mb-2">No orders found.</p>
              <p className="text-xs text-slate-400">
                Orders will appear here once customers place them.
              </p>
            </div>
          ) : (
            orders.map((o, index) => (
              <div
                key={o.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-all animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-sm font-semibold text-slate-700">
                      Order #{o.id}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      {o.orderTime
                        ? new Date(o.orderTime).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  {getStatusBadge(o.orderStatus)}
                </div>

                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <strong>Customer:</strong> Customer #{o.customerId}
                  </p>
                  <p>
                    <strong>Provider:</strong> {o.providerName || "N/A"}
                  </p>
                  {o.deliveryPartnerName && (
                    <p>
                      <strong>Delivery Partner:</strong> {o.deliveryPartnerName}
                    </p>
                  )}
                  <p>
                    <strong>Amount:</strong> ₹
                    {o.totalAmount?.toFixed(2) || "0.00"}
                  </p>
                </div>

                <div className="mt-3 flex justify-between">
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="text-primary-600 text-sm font-medium"
                  >
                    View Details
                  </button>

                  {o.orderStatus === "READY" && (
                    <button
                      onClick={() =>
                        setAssignModal({ show: true, orderId: o.id })
                      }
                      className="text-green-600 text-sm font-medium"
                    >
                      Assign Delivery
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          close={() => setSelectedOrder(null)}
        />
      )}

      {assignModal.show && (
        <div className="animate-fadeIn">
          <AssignPartnerModal
            orderId={assignModal.orderId}
            close={() => setAssignModal({ show: false, orderId: null })}
            refresh={loadOrders}
          />
        </div>
      )}
    </div>
  );
}
