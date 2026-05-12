"use client";

import { useEffect, useState } from "react";
import { X, Send, ChevronRight } from "lucide-react";

type OrderType = "pickup" | "delivery";

export default function StartOrder() {
  const [modalOpen, setModalOpen] = useState(false);
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [address, setAddress] = useState("");
  const [day, setDay] = useState("Today");
  const [time, setTime] = useState("ASAP");

  useEffect(() => {
    const savedType = localStorage.getItem("stokos_order_type") as OrderType | null;
    const savedAddress = localStorage.getItem("stokos_delivery_address");
    const savedDay = localStorage.getItem("stokos_order_day");
    const savedTime = localStorage.getItem("stokos_order_time");

    if (savedType) setOrderType(savedType);
    if (savedAddress) setAddress(savedAddress);
    if (savedDay) setDay(savedDay);
    if (savedTime) setTime(savedTime);
  }, []);

  useEffect(() => {
    const openStartOrder = () => {
      setModalOpen(true);
    };

    window.addEventListener("stokos-open-start-order", openStartOrder);

    return () => {
      window.removeEventListener("stokos-open-start-order", openStartOrder);
    };
  }, []);

  const openModal = (type: OrderType) => {
    setOrderType(type);
    setModalOpen(true);
  };

  const updateOrder = () => {
    if (!orderType) return;
    if (orderType === "delivery" && !address.trim()) return;

    localStorage.setItem("stokos_order_type", orderType);
    localStorage.setItem("stokos_order_day", day);
    localStorage.setItem("stokos_order_time", time);

    if (orderType === "delivery") {
      localStorage.setItem("stokos_delivery_address", address);
    } else {
      localStorage.removeItem("stokos_delivery_address");
    }

    window.dispatchEvent(new Event("stokos-order-updated"));
    setModalOpen(false);
  };

  const canContinue =
    orderType === "pickup" || (orderType === "delivery" && address.trim().length > 0);

  const mainButtonClass = (type: OrderType) =>
    `flex h-9 flex-1 items-center justify-center rounded-full px-3 text-[11px] font-black uppercase text-white shadow-md transition active:scale-[0.98] sm:h-10 sm:text-xs md:h-14 md:px-8 md:text-base ${
      orderType === type
        ? "bg-green-800 hover:bg-green-900"
        : "bg-[#DA3327] hover:bg-[#c52d22]"
    }`;

  const modalButtonClass = (type: OrderType) =>
    `flex items-center justify-between rounded border px-3 py-2 text-left font-black transition ${
      orderType === type
        ? "border-green-700 bg-green-50 ring-2 ring-green-700"
        : "border-zinc-300 bg-white hover:border-green-500"
    }`;

  return (
    <>
      <section className="w-full bg-white py-3 dark:bg-black md:py-6">
        <div className="mx-auto flex max-w-[1600px] flex-col items-start gap-3 px-4 sm:px-6 md:flex-row md:items-center md:gap-8">
          <h2 className="whitespace-nowrap text-left text-2xl font-black uppercase tracking-tight text-black dark:text-white sm:text-2xl md:text-4xl">
            Start Your Order
          </h2>

          <div className="flex w-full items-center gap-2 md:flex-1 md:gap-5">
            <button
              type="button"
              onClick={() => openModal("pickup")}
              className={mainButtonClass("pickup")}
            >
              Pickup
            </button>

            <span className="text-xs font-black uppercase text-black dark:text-white sm:text-sm md:text-lg">
              OR
            </span>

            <button
              type="button"
              onClick={() => openModal("delivery")}
              className={mainButtonClass("delivery")}
            >
              Delivery
            </button>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-[450px] overflow-hidden rounded-md bg-white shadow-2xl">
            <div className="relative px-6 pt-6 text-center">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 text-zinc-700 hover:text-black"
              >
                <X size={24} />
              </button>

              <h3 className="text-xl font-black uppercase text-[#9E1111]">
                Stoko&apos;s
              </h3>

              <div className="mt-5">
                <h4 className="text-xl font-black text-black">Stoko&apos;s</h4>
                <p className="mt-1 text-base text-zinc-700">Towson</p>
              </div>

              <div className="mt-4 border-t border-zinc-200" />
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType("pickup")}
                  className={modalButtonClass("pickup")}
                >
                  <span className="text-green-700">Pickup</span>

                  <span
                    className={`rounded-full border px-2 py-1 text-xs ${
                      orderType === "pickup"
                        ? "border-green-700 bg-green-700 text-white"
                        : "border-green-700 text-green-700"
                    }`}
                  >
                    30m
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType("delivery")}
                  className={modalButtonClass("delivery")}
                >
                  <span className="text-green-700">Delivery</span>

                  <span
                    className={`rounded-full border px-2 py-1 text-xs ${
                      orderType === "delivery"
                        ? "border-green-700 bg-green-700 text-white"
                        : "border-green-700 text-green-700"
                    }`}
                  >
                    55m
                  </span>
                </button>
              </div>

              {orderType === "delivery" && (
                <div className="mt-6 flex overflow-hidden rounded border border-zinc-300">
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter street address..."
                    className="h-11 flex-1 px-3 text-sm outline-none"
                  />

                  <button
                    type="button"
                    className="m-1 flex h-9 w-9 items-center justify-center rounded bg-green-700 text-white"
                  >
                    <Send size={18} />
                  </button>
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 gap-2">
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="h-10 rounded border border-zinc-300 px-3 text-sm font-semibold outline-none"
                >
                  <option>Today</option>
                  <option>Tomorrow</option>
                </select>

                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-10 rounded border border-zinc-300 px-3 text-sm font-semibold outline-none"
                >
                  <option>ASAP</option>
                  <option>12:00 PM</option>
                  <option>12:30 PM</option>
                  <option>1:00 PM</option>
                  <option>1:30 PM</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={!canContinue}
              onClick={updateOrder}
              className={`flex w-full items-center justify-between px-6 py-4 text-left text-base font-black text-white ${
                canContinue
                  ? "bg-green-700 hover:bg-green-800"
                  : "cursor-not-allowed bg-zinc-400"
              }`}
            >
              <span>
                {!orderType
                  ? "Select Pickup or Delivery"
                  : orderType === "pickup"
                  ? "Update Your Pickup Order"
                  : address.trim()
                  ? "Update Your Delivery Order"
                  : "Enter Your Delivery Address to Continue"}
              </span>

              <ChevronRight size={26} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}