// // src/components/layout/Sidebar.jsx
// import React from "react";

// const menuItems = [
//   { key: "dashboard", label: "Dashboard" },
//   { key: "users", label: "Users" },
//   { key: "providers", label: "Providers" },
//   { key: "pending-providers", label: "Pending Providers" },
//   { key: "categories", label: "Categories" },
//   { key: "orders", label: "Orders" },
//   { key: "delivery-partners", label: "Delivery Partners" },
//   { key: "delivery-zones", label: "Delivery Zones" },
//   { key: "payouts", label: "Payouts" },
// ];

// export default function Sidebar({ activeKey, onChange }) {
//   return (
//     <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
//       <div className="px-4 py-4 text-lg font-semibold border-b border-slate-800">
//         PlateMate Admin
//       </div>

//       <nav className="flex-1 px-2 py-4 space-y-1">
//         {menuItems.map((item) => {
//           const isActive = item.key === activeKey;
//           return (
//             <button
//               key={item.key}
//               onClick={() => onChange(item.key)}
//               className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1
//                 ${
//                   isActive
//                     ? "bg-sky-500 text-white"
//                     : "text-slate-300 hover:bg-slate-800 hover:text-white"
//                 }`}
//             >
//               {item.label}
//             </button>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }

// src/components/layout/Sidebar.jsx
import React from "react";
import { Menu, X } from "lucide-react";
import logoImage from "../../assets/images/1.png";

const menuItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "users", label: "Users" },
  { key: "providers", label: "Providers" },
  { key: "pending-providers", label: "Pending Providers" },
  { key: "categories", label: "Categories" },
  { key: "orders", label: "Orders" },
  { key: "delivery-partners", label: "Delivery Partners" },
  { key: "delivery-zones", label: "Delivery Zones" },
  { key: "payouts", label: "Payouts" },
];

export default function Sidebar({ activeKey, onChange }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-slate-900 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay on Mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-slate-900 text-slate-100
          flex flex-col z-40 shadow-xl border-r border-slate-800
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={logoImage}
              alt="PlateMate Logo"
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col">
              <div className="text-lg font-bold text-white">PlateMate</div>
              <div className="text-xs text-slate-400">Admin Panel</div>
            </div>
          </div>

          {/* Close Icon Mobile */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = item.key === activeKey;

            return (
              <button
                key={item.key}
                onClick={() => {
                  onChange(item.key);
                  setOpen(false);
                }}
                className={`
                  relative w-full text-left px-4 py-2 rounded-md text-sm font-medium
                  flex items-center gap-3 transition-all duration-200
                  ${
                    isActive
                      ? "bg-sky-500 text-white shadow-md scale-[1.02]"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r"></span>
                )}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer / Version */}
        <div className="px-4 py-3 text-xs text-slate-500 border-t border-slate-800">
          © {new Date().getFullYear()} PlateMate Admin
        </div>
      </aside>
    </>
  );
}
