"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  PackageCheck,
  Search,
  Store,
  Truck,
  User,
  X,
} from "lucide-react";

type AdminOrderItem = {
  name: string;
  quantity: number;
  amount: number;
  currency: string;
};

type AdminOrder = {
  id: string;
  orderNumber: string;
  createdAt: string;
  store: string;
  orderType: "pickup" | "delivery" | string;
  deliveryAddress?: string;
  orderDay: string;
  orderTime: string;
  customerName: string;
  customerEmail: string;
  paymentStatus: string;
  amountTotal: number;
  currency: string;
  items: AdminOrderItem[];
};

const STORAGE_KEY = "stokos_admin_orders";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [search, setSearch] = useState("");
  const [activeOrder, setActiveOrder] = useState<AdminOrder | null>(null);
  const [notification, setNotification] = useState("");

  const loadOrders = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    setOrders(parsed);
    setActiveOrder(parsed[0] || null);
  };

  useEffect(() => {
    loadOrders();

    const channel = new BroadcastChannel("stokos-orders");

    channel.onmessage = (event) => {
      if (event.data?.type === "ORDER_CREATED") {
        loadOrders();
        setNotification(`New order received: ${event.data.order.orderNumber}`);
      }
    };

    const handleStorage = () => loadOrders();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("stokos-admin-orders-updated", loadOrders);

    return () => {
      channel.close();
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

  const totalRevenue = orders.reduce((acc, order) => acc + order.amountTotal, 0);
  const deliveryOrders = orders.filter((order) => order.orderType === "delivery").length;
  const pickupOrders = orders.filter((order) => order.orderType === "pickup").length;

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

            <button onClick={() => setNotification("")}>
              <X size={18} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <StatCard title="Total Orders" value={orders.length.toString()} icon={<PackageCheck />} />
          <StatCard title="Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={<CreditCard />} />
          <StatCard title="Pickup Orders" value={pickupOrders.toString()} icon={<Store />} />
          <StatCard title="Delivery Orders" value={deliveryOrders.toString()} icon={<Truck />} />
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
                  <p className="mt-1 text-sm">New demo orders will appear here.</p>
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
                          <p className="text-sm font-black">{order.orderNumber}</p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <span className="rounded-full bg-green-800 px-3 py-1 text-[10px] font-black uppercase text-white">
                          {order.orderType}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold">{order.customerName}</p>
                          <p className="text-xs text-zinc-500">{order.store}</p>
                        </div>

                        <p className="text-lg font-black">
                          ${order.amountTotal.toFixed(2)}
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

                <div className="grid gap-4 p-6 md:grid-cols-2">
                  <DetailCard
                    icon={<User size={20} />}
                    title="Customer"
                    main={activeOrder.customerName}
                    sub={activeOrder.customerEmail}
                  />

                  <DetailCard
                    icon={<CreditCard size={20} />}
                    title="Payment"
                    main={`${activeOrder.currency} ${activeOrder.amountTotal.toFixed(2)}`}
                    sub="Card via Stripe"
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
                    sub={`${activeOrder.orderDay} · ${activeOrder.orderTime}`}
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
                    sub="Store/order location"
                  />
                </div>

                <div className="px-6 pb-6">
                  <div className="rounded-3xl border border-zinc-200">
                    <div className="border-b border-zinc-200 p-5">
                      <h3 className="text-lg font-black uppercase">
                        Order Items
                      </h3>
                    </div>

                    <div className="divide-y divide-zinc-200">
                      {activeOrder.items.map((item, index) => (
                        <div
                          key={`${item.name}-${index}`}
                          className="flex items-center justify-between gap-4 p-5"
                        >
                          <div>
                            <p className="font-black">
                              {item.quantity}x {item.name}
                            </p>
                            <p className="text-xs text-zinc-500">
                              Item total
                            </p>
                          </div>

                          <p className="font-black">
                            {item.currency} {item.amount.toFixed(2)}
                          </p>
                        </div>
                      ))}
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
  icon: React.ReactNode;
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
  icon: React.ReactNode;
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