"use client";

import ProductCard from "@/components/productcard";
import { ChevronRight } from "lucide-react"; // Added this import

interface MenuSectionProps {
  title: string;
  products: any[];
}

export default function MenuSection({ title, products }: MenuSectionProps) {
  return (
    <section className="max-w-[1750px] mx-auto px-2  py-10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        
        <div className="flex items-baseline gap-3">
          
          <h2
  className="text-black dark:text-white 
  text-2xl md:text-3xl font-black uppercase tracking-widest"
>
  {title}
</h2>

          <span className="text-zinc-600 dark:text-zinc-500 
            text-xs font-bold uppercase hidden sm:block">
            {products.length} Items
          </span>

        </div>

        {/* Updated Button with Icon */}
        <button className="text-yellow-500 text-sm md:text-lg font-black uppercase tracking-widest hover:underline transition-all flex items-center gap-1">
          ALL <ChevronRight size={20} strokeWidth={4} className="mt-0.5" />
        </button>

      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
}