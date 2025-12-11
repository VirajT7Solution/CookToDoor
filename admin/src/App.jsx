
import React, { useState } from "react";
import { useAuthStore } from "./store/authStore";

// Layout Components
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UsersPage from "./pages/users/UsersPage";
import ProvidersPage from "./pages/providers/ProvidersPage";
import PendingProvidersPage from "./pages/providers/PendingProvidersPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import OrdersPage from "./pages/orders/OrdersPage";
import DeliveryPartnersPage from "./pages/delivery-partners/DeliveryPartnersPage";
import DeliveryZonesPage from "./pages/delivery-zones/DeliveryZonesPage";
import PayoutsPage from "./pages/payouts/PayoutsPage";

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const [activeKey, setActiveKey] = useState("dashboard");

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="h-screen flex bg-slate-100">
      <Sidebar activeKey={activeKey} onChange={setActiveKey} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={getTitleFromKey(activeKey)} />

        <main className="flex-1 overflow-y-auto">
          {renderContent(activeKey)}
        </main>
      </div>
    </div>
  );
}

// ------------------------------------------------------
// Component Renderer (serves enterprise-grade navigation)
// ------------------------------------------------------
function renderContent(key) {
  const components = {
    dashboard: <Dashboard />,
    users: <UsersPage />,
    providers: <ProvidersPage />,
    "pending-providers": <PendingProvidersPage />,
    categories: <CategoriesPage />,
    orders: <OrdersPage />,
    "delivery-partners": <DeliveryPartnersPage />,
    "delivery-zones": <DeliveryZonesPage />,
    payouts: <PayoutsPage />,
  };

  return components[key] || <Dashboard />;
}

// ------------------------------------------------------
// Dynamic Title Mapping
// ------------------------------------------------------
function getTitleFromKey(key) {
  const titles = {
    dashboard: "Dashboard",
    users: "Users",
    providers: "Providers",
    "pending-providers": "Pending Providers",
    categories: "Categories",
    orders: "Orders",
    "delivery-partners": "Delivery Partners",
    "delivery-zones": "Delivery Zones",
    payouts: "Payouts",
  };

  return titles[key] || "Dashboard";
}
