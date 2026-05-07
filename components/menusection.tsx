"use client";

import ProductCard from "@/components/productcard";
import { ChevronRight } from "lucide-react";

interface MenuSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  products: any[];
}

export default function MenuSection({
  id,
  title,
  subtitle,
  products,
}: MenuSectionProps) {
  const visibleProducts = products.slice(0, 10);

  return (
    <section
      id={id}
      className="
        w-full md:w-[1600px] mx-auto
        px-4 md:px-0
        pt-6 pb-8 md:pt-8 md:pb-10
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 md:mb-6">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2
            className="
              text-black dark:text-white
              text-3xl md:text-4xl
              font-black uppercase tracking-wide
              ml-1 leading-tight
            "
          >
            {title}
          </h2>

          {subtitle && (
            <span
              className="
                text-black dark:text-white
                text-xs md:text-sm
                font-bold
              "
            >
              ({subtitle})
            </span>
          )}

          <span
            className="
              text-zinc-600 dark:text-zinc-500
              text-xs font-bold uppercase hidden sm:block
            "
          >
            {visibleProducts.length} Items
          </span>
        </div>

        <button
          className="
            text-black dark:text-white
            text-sm md:text-lg
            font-black uppercase tracking-widest
            transition-all flex items-center gap-1
          "
        >
          ALL <ChevronRight size={20} strokeWidth={4} className="mt-0.5" />
        </button>
      </div>

      {/* Grid - small cards inside 1600px width */}
      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-[repeat(auto-fill,minmax(230px,280px))]
          md:grid-cols-[repeat(auto-fill,minmax(250px,300px))]
          justify-start
          gap-3 md:gap-4
        "
      >
        {visibleProducts.map((product, index) => (
          <div
            key={product.id}
            className={`
              w-full h-full
              ${index >= 4 ? "hidden md:block" : "block"}
            `}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}