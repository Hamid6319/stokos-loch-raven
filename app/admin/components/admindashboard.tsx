"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  PackageCheck,
  Search,
  Store,
  Truck,
  User,
  X,
  Utensils,
} from "lucide-react";

type AdminOrderItem = {
  name: string;
  quantity: number;
  amount: number;
  currency: string;
  size?: {
    label?: string;
    price?: number;
  };
  toppings?: Record<string, string>;
  sauces?: string[];
  note?: string;
};

type AdminOrder = {
  id: string;
  orderNumber: string;
  createdAt: string;
  store: string;
  storeSlug?: string;
  orderType: "pickup" | "delivery" | string;
  deliveryAddress?: string;
  orderDay: string;
  orderTime: string;
  customerName: string;
  customerEmail: string;
  paymentStatus: string;
  amountTotal: number;
  currency: string;
  paymentMethod?: string;
  items: AdminOrderItem[];
};

const STORAGE_KEY = "stokos_admin_orders";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [search, setSearch] = useState("");
  const [activeOrder, setActiveOrder] = useState<AdminOrder | null>(null);
  const [notification, setNotification] = useState("");

  const loadOrders = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed: AdminOrder[] = saved ? JSON.parse(saved) : [];

      setOrders(parsed);

      setActiveOrder((current) => {
        if (current) {
          return parsed.find((order) => order.id === current.id) || parsed[0] || null;
        }

        return parsed[0] || null;
      });
    } catch (error) {
      console.error("Failed to load admin orders:", error);
      setOrders([]);
      setActiveOrder(null);
    }
  };

  useEffect(() => {
    loadOrders();

    let channel: BroadcastChannel | null = null;

    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel("stokos-orders");

      channel.onmessage = (event) => {
        if (event.data?.type === "ORDER_CREATED") {
          loadOrders();
          setNotification(`New order received: ${event.data.order.orderNumber}`);
        }
      };
    }

    const handleStorage = () => loadOrders();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("stokos-admin-orders-updated", loadOrders);

    return () => {
      channel?.close();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("stokos-admin-orders-updated", loadOrders);
    };
  }, []);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification("");
    }, 4500);

    return () => clearTimeout(timer);
  }, [notification]);

  const filteredOrders = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return orders;

    return orders.filter((order) => {
      return (
        order.orderNumber.toLowerCase().includes(value) ||
        order.customerName.toLowerCase().includes(value) ||
        order.customerEmail.toLowerCase().includes(value) ||
        order.store.toLowerCase().includes(value) ||
        order.orderType.toLowerCase().includes(value)
      );
    });
  }, [orders, search]);

  const totalRevenue = orders.reduce(
    (acc, order) => acc + Number(order.amountTotal || 0),
    0
  );

  const deliveryOrders = orders.filter(
    (order) => order.orderType === "delivery"
  ).length;

  const pickupOrders = orders.filter(
    (order) => order.orderType === "pickup"
  ).length;

  const clearDemoOrders = () => {
    localStorage.removeItem(STORAGE_KEY);
    setOrders([]);
    setActiveOrder(null);
  };

  return (
    <main className="min-h-screen bg-[#f6f7f4] p-4 text-black md:p-6">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] bg-green-800 p-6 text-white shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/60">
              Stoko&apos;s Admin
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">
              Orders Dashboard
            </h1>

            <p className="mt-2 text-sm text-white/70">
              Live frontend demo dashboard for recent web ordering activity.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
            <Bell size={20} />
            <span className="text-sm font-bold">
              Live order updates enabled
            </span>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-900 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} />
              <p className="text-sm font-black">{notification}</p>
            </div>

            <button type="button" onClick={() => setNotification("")}>
              <X size={18} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={orders.length.toString()}
            icon={<PackageCheck />}
          />

          <StatCard
            title="Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            icon={<CreditCard />}
          />

          <StatCard
            title="Pickup Orders"
            value={pickupOrders.toString()}
            icon={<Store />}
          />

          <StatCard
            title="Delivery Orders"
            value={deliveryOrders.toString()}
            icon={<Truck />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          {/* Orders List */}
          <section className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black uppercase">Orders</h2>

                <button
                  type="button"
                  onClick={clearDemoOrders}
                  className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-black uppercase text-zinc-600 hover:bg-zinc-200"
                >
                  Clear Demo
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-zinc-200 px-4 py-3">
                <Search size={18} className="text-zinc-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div className="max-h-[720px] space-y-3 overflow-y-auto p-4">
              {filteredOrders.length === 0 ? (
                <div className="flex h-72 flex-col items-center justify-center text-center text-zinc-400">
                  <PackageCheck size={46} className="mb-4 opacity-30" />
                  <p className="font-bold">No orders yet</p>
                  <p className="mt-1 text-sm">
                    New demo orders will appear here.
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const isActive = activeOrder?.id === order.id;

                  return (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => setActiveOrder(order)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isActive
                          ? "border-green-700 bg-green-50"
                          : "border-zinc-200 bg-white hover:border-green-400"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black">
                            {order.orderNumber}
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <span className="rounded-full bg-green-800 px-3 py-1 text-[10px] font-black uppercase text-white">
                          {order.orderType}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold">
                            {order.customerName}
                          </p>

                          <p className="text-xs text-zinc-500">
                            {order.store}
                          </p>
                        </div>

                        <p className="text-lg font-black">
                          ${Number(order.amountTotal || 0).toFixed(2)}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          {/* Order Detail */}
          <section className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
            {!activeOrder ? (
              <div className="flex h-full min-h-[500px] flex-col items-center justify-center text-zinc-400">
                <PackageCheck size={52} className="mb-4 opacity-30" />
                <p className="font-bold">Select an order to view details</p>
              </div>
            ) : (
              <>
                {/* Detail Header */}
                <div className="border-b border-zinc-200 p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-green-700">
                        Order Detail
                      </p>

                      <h2 className="mt-2 text-3xl font-black">
                        {activeOrder.orderNumber}
                      </h2>

                      <p className="mt-1 text-sm text-zinc-500">
                        {new Date(activeOrder.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-green-50 px-5 py-3 text-green-800">
                      <p className="text-xs font-black uppercase">Payment</p>

                      <p className="text-sm font-black">
                        {activeOrder.paymentStatus === "paid"
                          ? "Paid Successfully"
                          : activeOrder.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detail Cards */}
                <div className="grid gap-4 p-6 md:grid-cols-2">
                  <DetailCard
                    icon={<User size={20} />}
                    title="Customer"
                    main={activeOrder.customerName || "Not provided"}
                    sub={activeOrder.customerEmail || "Not provided"}
                  />

                  <DetailCard
                    icon={<CreditCard size={20} />}
                    title="Payment"
                    main={`${activeOrder.currency || "USD"} ${Number(
                      activeOrder.amountTotal || 0
                    ).toFixed(2)}`}
                    sub={activeOrder.paymentMethod || "Card via Stripe"}
                  />

                  <DetailCard
                    icon={
                      activeOrder.orderType === "delivery" ? (
                        <Truck size={20} />
                      ) : (
                        <Store size={20} />
                      )
                    }
                    title="Order Type"
                    main={
                      activeOrder.orderType === "delivery"
                        ? "Delivery"
                        : "Pickup / Carryout"
                    }
                    sub={`${activeOrder.orderDay || "Today"} · ${
                      activeOrder.orderTime || "ASAP"
                    }`}
                  />

                  <DetailCard
                    icon={<MapPin size={20} />}
                    title={
                      activeOrder.orderType === "delivery"
                        ? "Delivery Address"
                        : "Pickup Store"
                    }
                    main={
                      activeOrder.orderType === "delivery"
                        ? activeOrder.deliveryAddress || "Not provided"
                        : activeOrder.store
                    }
                    sub="Store / order location"
                  />
                </div>

                {/* Full Order Items */}
                <div className="px-6 pb-6">
                  <div className="rounded-3xl border border-zinc-200">
                    <div className="flex items-center gap-3 border-b border-zinc-200 p-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-800">
                        <Utensils size={20} />
                      </div>

                      <div>
                        <h3 className="text-lg font-black uppercase">
                          Full Order Details
                        </h3>

                        <p className="text-sm text-zinc-500">
                          Items, size, toppings, sauces, and special instructions.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 p-5">
                      {activeOrder.items?.length ? (
                        activeOrder.items.map((item, index) => {
                          const hasToppings =
                            item.toppings &&
                            Object.keys(item.toppings).length > 0;

                          const hasSauces =
                            item.sauces && item.sauces.length > 0;

                          const hasNote =
                            item.note && item.note.trim().length > 0;

                          const hasDetails =
                            item.size?.label || hasToppings || hasSauces || hasNote;

                          return (
                            <div
                              key={`${item.name}-${index}`}
                              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-base font-black">
                                    {item.quantity}x {item.name}
                                  </p>

                                  {item.size?.label && (
                                    <p className="mt-1 text-xs font-semibold text-zinc-500">
                                      Size: {item.size.label}
                                    </p>
                                  )}
                                </div>

                                <p className="text-sm font-black">
                                  {item.currency || activeOrder.currency || "USD"}{" "}
                                  {Number(item.amount || 0).toFixed(2)}
                                </p>
                              </div>

                              {hasDetails && (
                                <div className="mt-4 space-y-3 rounded-xl bg-white p-3">
                                  {hasToppings && (
                                    <div>
                                      <p className="text-[11px] font-black uppercase tracking-wide text-zinc-500">
                                        Toppings
                                      </p>

                                      <p className="mt-1 text-xs leading-5 text-zinc-600">
                                        {Object.entries(item.toppings || {})
                                          .map(
                                            ([name, side]) =>
                                              `${name} (${side})`
                                          )
                                          .join(", ")}
                                      </p>
                                    </div>
                                  )}

                                  {hasSauces && (
                                    <div>
                                      <p className="text-[11px] font-black uppercase tracking-wide text-zinc-500">
                                        Sauces
                                      </p>

                                      <p className="mt-1 text-xs leading-5 text-zinc-600">
                                        {(item.sauces || []).join(", ")}
                                      </p>
                                    </div>
                                  )}

                                  {hasNote && (
                                    <div>
                                      <p className="text-[11px] font-black uppercase tracking-wide text-zinc-500">
                                        Special Instructions
                                      </p>

                                      <p className="mt-1 text-xs leading-5 text-zinc-600">
                                        {item.note}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex h-40 flex-col items-center justify-center text-center text-zinc-400">
                          <FileText size={34} className="mb-3 opacity-40" />
                          <p className="font-bold">No item details available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-800">
        {icon}
      </div>

      <p className="text-xs font-black uppercase tracking-wide text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function DetailCard({
  icon,
  title,
  main,
  sub,
}: {
  icon: ReactNode;
  title: string;
  main: string;
  sub: string;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
        {icon}
      </div>

      <p className="text-xs font-black uppercase tracking-wide text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-base font-black">{main}</p>
      <p className="mt-1 text-sm text-zinc-500">{sub}</p>
    </div>
  );
}