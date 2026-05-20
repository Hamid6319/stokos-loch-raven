"use client";

import { useState } from "react";
import { PackageCheck, ShoppingBag } from "lucide-react";
import AdminDashboard from "./components/admindashboard";
import ProductManagementDemo from "./components/productManagementDemo";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");

  return (
    <main className="min-h-screen bg-[#f6f7f4] p-4 text-black md:p-6">
      <div className="mx-auto max-w-[1600px]">
        {/* Top Header */}
        <div className="mb-6 rounded-[28px] bg-green-800 p-6 text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-white/60">
            Stoko&apos;s Admin
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-white/70">
            Manage demo orders and product management UI.
          </p>

          {/* Tabs */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black uppercase transition ${
                activeTab === "orders"
                  ? "bg-white text-green-800"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <PackageCheck size={18} />
              Orders
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black uppercase transition ${
                activeTab === "products"
                  ? "bg-white text-green-800"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <ShoppingBag size={18} />
              Product Management
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "orders" && <AdminDashboard />}

        {activeTab === "products" && <ProductManagementDemo />}
      </div>
    </main>
  );
}