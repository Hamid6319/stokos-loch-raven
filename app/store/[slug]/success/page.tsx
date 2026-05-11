"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  ReceiptText,
  Phone,
  MapPin,
  ArrowRight,
  Home,
} from "lucide-react";
import { useCartStore } from "../usecartstore";

export default function SuccessPage() {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam || "towson";

  const clearCart = useCartStore((state) => state.clearCart);

  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    setOrderNumber(`STK-${Math.floor(100000 + Math.random() * 900000)}`);
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen bg-[#fafafa] px-4 py-10 text-black dark:bg-black dark:text-white">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-[#111]">
          {/* Top Success Area */}
          <div className="bg-gradient-to-br from-green-50 to-white px-6 py-10 text-center dark:from-green-950/30 dark:to-[#111] md:px-12">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/40">
              <CheckCircle2 size={46} strokeWidth={2.5} />
            </div>

            <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-green-600">
              Payment Successful
            </p>

            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Order Placed!
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400 md:text-base">
              Thank you. Your order has been received and your payment was
              completed successfully.
            </p>

            <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-black shadow-sm dark:border-zinc-800 dark:bg-black">
              <ReceiptText size={18} />
              Order #{orderNumber || "Generating..."}
            </div>
          </div>

          {/* Details */}
          <div className="grid border-t border-zinc-200 dark:border-zinc-800 md:grid-cols-3">
            <div className="border-b border-zinc-200 p-6 dark:border-zinc-800 md:border-b-0 md:border-r">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                <Clock size={22} />
              </div>

              <h3 className="mb-2 text-sm font-black uppercase">
                Estimated Time
              </h3>

              <p className="text-sm leading-6 text-zinc-500">
                Your order will be prepared shortly. Please allow around 25–40
                minutes depending on store rush.
              </p>
            </div>

            <div className="border-b border-zinc-200 p-6 dark:border-zinc-800 md:border-b-0 md:border-r">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                <Phone size={22} />
              </div>

              <h3 className="mb-2 text-sm font-black uppercase">Need Help?</h3>

              <p className="text-sm leading-6 text-zinc-500">
                Call the store if you need to update your order, pickup time,
                or special instructions.
              </p>
            </div>

            <div className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                <MapPin size={22} />
              </div>

              <h3 className="mb-2 text-sm font-black uppercase">
                Pickup / Delivery
              </h3>

              <p className="text-sm leading-6 text-zinc-500">
                Please keep this confirmation page available when collecting
                your order.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 border-t border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-black md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="text-sm font-black uppercase">
                Thanks for ordering from Stoko&apos;s
              </h4>
              <p className="mt-1 text-xs text-zinc-500">
                Your cart has been cleared after successful payment.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/store/${slug}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-zinc-300 px-5 text-sm font-black uppercase dark:border-zinc-700"
              >
                <Home size={18} />
                Back to Menu
              </Link>

              <Link
                href={`/store/${slug}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#DA3327] px-6 text-sm font-black uppercase text-white shadow-lg transition hover:bg-red-700"
              >
                Order Again
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}