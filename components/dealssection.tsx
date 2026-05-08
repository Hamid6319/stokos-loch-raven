"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const deals = [
  {
    href: "/store/towson?deal=family-pizza-combo",
    image: "/images/deal1.png",
  },
  {
    href: "/store/towson?deal=local-store-coupons",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?q=80&w=1200&auto=format&fit=crop",
  },
  {
    href: "/store/towson?deal=wings-pizza-special",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop",
  },
  {
    href: "/store/towson?deal=lunch-value-deal",
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function DealsSection() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const scrollAmount = sliderRef.current.clientWidth * 0.85;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="deals" className="w-full py-5 md:py-10">
      <div className="mx-auto max-w-[1600px] px-4 md:px-0">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h2 className="text-[26px] font-black uppercase leading-none tracking-tight text-black dark:text-white md:text-4xl">
            Explore More Deals
          </h2>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white text-black transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
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
          className="
            no-scrollbar
            flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2
            md:gap-6
          "
        >
          {deals.map((deal, index) => (
            <Link
              key={index}
              href={deal.href}
              className="
                relative block shrink-0 snap-start overflow-hidden
                rounded-2xl bg-black shadow-sm transition
                active:scale-[0.98] md:hover:scale-[1.01]

                w-[88vw] aspect-[2/1]
                sm:w-[430px]
                md:h-[300px] md:w-[620px] md:aspect-auto
                lg:w-[680px]
              "
            >
              <Image
                src={deal.image}
                alt={`Deal ${index + 1}`}
                fill
                priority={index === 0}
                className="
                  object-contain object-center
                  md:object-cover
                "
                sizes="(max-width: 640px) 88vw, (max-width: 768px) 430px, 680px"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}