"use client";

import ProductCard from "@/components/productcard";
import { ChevronRight } from "lucide-react";

interface MenuSectionProps {
  id: string;    // Add this
  title: string;
  products: any[];
}


export default function MenuSection({ id, title, products }: MenuSectionProps) {
  const visibleProducts = products.slice(0,8);

  return (
    <section id={id} className="w-[1290px] mx-auto px-4 md:px-12 pt-6 pb-8 md:pt-8 md:pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 md:mb-6">
        <div className="flex items-baseline gap-3">
          <h2
            className="
              text-black dark:text-white
              text-3xl md:text-4xl
              font-black uppercase tracking-wider
              ml-1 leading-tight
            "
          >
            {title}
          </h2>

          <span
            className="
              text-zinc-600 dark:text-zinc-500
              text-xs font-bold uppercase hidden sm:block
            "
          >
            {visibleProducts.length} Items
          </span>
        </div>

        {/* Button with Icon */}
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

      {/* Grid */}
  <div
  className="
    grid grid-cols-2 
    md:grid-cols-3 lg:grid-cols-4 
    gap-3 md:gap-4
    auto-rows-fr
  "
>
  {/* 1. Use slice(0, 8) to limit the total items rendered to 8 */}
  {visibleProducts.slice(0, 8).map((product, index) => (
    <div
      key={product.id}
      className={`h-full ${
        /* 2. Hide items 5 through 8 on mobile (index 4 to 7), 
           show them only from md (desktop) up */
        index >= 4 ? "hidden md:block" : "block"
      }`}
    >
      <ProductCard product={product} />
    </div>
  ))}
</div>
    </section>
  );
}