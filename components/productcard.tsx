"use client";

import Image from "next/image";
import { Plus } from "lucide-react";

export default function ProductCard({ product }: any) {
  return (
    <div className="group relative 
      bg-white text-black 
      dark:bg-[#121212] dark:text-white 
      rounded-2xl md:rounded-[1.5rem] 
      p-2.5 md:p-4 w-full shadow-2xl 
      transition-all duration-300 
      hover:bg-zinc-100 dark:hover:bg-[#181818] 
      border border-zinc-200 dark:border-zinc-900/50 
      flex flex-col"
    >
      
      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xl md:rounded-[1.5rem] mb-3 md:mb-5">
        
        {/* ✅ Badge (Best Seller etc) */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-green-600 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-md shadow-lg">
              {product.badge}
            </span>
          </div>
        )}

        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow px-1 pb-1">

        {/* Title */}
        <h3 className="text-black dark:text-white 
          text-sm md:text-xl font-black uppercase tracking-tight leading-tight 
          group-hover:text-yellow-500 transition-colors line-clamp-2">
          {product.title}
        </h3>
        
        {/* ✅ Updated Dynamic Description */}
        <p className="hidden md:block 
          text-black dark:text-white
          text-[14px] mt-2 line-clamp-3 leading-relaxed min-h-[48px]">
          {product.description}
        </p>

        {/* Bottom */}
        <div className="flex items-end justify-between mt-auto pt-3 md:pt-6">
          
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-[8px] md:text-[10px] 
                text-zinc-400 dark:text-zinc-600 
                line-through font-bold mb-0.5">
                ${product.oldPrice}
              </span>
            )}

            <div className="flex items-center gap-0.5 md:gap-1.5">
              {/* ✅ Changed Currency to $ */}
              <span className="text-sm md:text-xl font-black leading-none">
                $
              </span>

              <span className="text-base md:text-3xl font-black leading-none tracking-tighter 
                text-black dark:text-white">
                {product.price}
              </span>
            </div>
          </div>

          {/* Button */}
          <button className="w-8 h-8 md:w-12 md:h-12 rounded-full 
            bg-zinc-200 text-black border border-zinc-300
            dark:bg-zinc-900 dark:text-white dark:border-zinc-800 
            flex items-center justify-center 
            hover:bg-green-500 hover:border-green-500 hover:text-white 
            hover:scale-110 transition-all duration-300 shadow-lg active:scale-90">
            <Plus size={16} className="md:w-6 md:h-6" strokeWidth={3} />
          </button>

        </div>
      </div>
    </div>
  );
}