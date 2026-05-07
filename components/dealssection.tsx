"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const deals = [
  {
    title: "Family Pizza Combo",
    subtitle: "Large pizza, wings, fries, and soda",
    button: "Add Deal",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Local Store Coupons",
    subtitle: "Find the best offers near your location",
    button: "See Local Deals",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Wings & Pizza Special",
    subtitle: "Perfect combo for game night",
    button: "Order Now",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Lunch Value Deal",
    subtitle: "Fast pickup, hot food, better price",
    button: "View Deal",
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function DealsSection() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -420 : 420,
      behavior: "smooth",
    });
  };

  return (
    <section id="deals" className="w-full py-6 md:py-10">
      <div className="mx-auto max-w-[1600px]">
        
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white md:text-4xl">
            Explore More Deals
          </h2>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white text-black  transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white text-black transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 no-scrollbar md:gap-6"
        >
          {deals.map((deal, index) => (
            <div
              key={index}
              className="relative h-[190px] min-w-[86%] overflow-hidden rounded-2xl bg-zinc-100  md:h-[300px] md:min-w-[620px] lg:min-w-[680px]"
            >
              <Image
                src={deal.image}
                alt={deal.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 680px"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

              <div className="absolute left-4 top-1/2 w-[75%] -translate-y-1/2 rounded-2xl bg-white/95 p-4  md:left-7 md:w-[340px] md:p-6">
                <p className="text-xs font-black uppercase text-[#DA3327] md:text-sm">
                  Limited Time Deal
                </p>

                <h3 className="mt-1 text-xl font-black uppercase leading-tight text-black md:text-3xl">
                  {deal.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-zinc-600 md:text-sm">
                  {deal.subtitle}
                </p>

                <button
                  type="button"
                  className="mt-4 rounded-full bg-[#DA3327] px-6 py-2 text-xs font-black uppercase text-white transition hover:bg-[#c52d22] md:px-8 md:py-3"
                >
                  {deal.button}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}