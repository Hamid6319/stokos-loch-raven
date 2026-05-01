"use client";

import Image from "next/image";
import { Flame } from "lucide-react";

export default function Hero() {
  return (
    <div className="w-full px-2 md:px-6 py-2 md:py-4">
      {/* 
         Aspect ratio 1.2/1 mobile par image ko sharp rakhta hai.
      */}
      <div className="relative w-full aspect-[1.2/1] md:aspect-[21/8] lg:aspect-[25/9] overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl group">
        
        {/* 1. BACKGROUND IMAGE */}
        <Image
          src="/images/herotwo.png"
          alt="Stokos Deals"
          fill
          priority
          className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
        />

        {/* 2. DARK OVERLAY FOR MOBILE (bg-black/65 mobile ke liye, gradient desktop ke liye) */}
        <div className="absolute inset-0 bg-black/25 md:bg-gradient-to-r md:from-black/90 md:via-black/40 md:to-transparent z-10" />

        {/* 3. CONTENT AREA */}
        <div className="absolute inset-0 flex flex-col justify-end md:justify-center px-5 py-6 md:px-16 lg:px-24 z-20">
          
          {/* Badge */}
          <div className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full w-fit mb-3 md:mb-6 shadow-lg">
            <Flame size={12} fill="white" className="animate-pulse md:w-[14px]" />
            <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest">NEW SPECIALS LIVE</span>
          </div>

          {/* Heading: Mobile par text-3.5xl (bara) kar diya hai */}
          <h1 className="text-white text-[2.2rem] sm:text-4xl md:text-6xl lg:text-8xl font-extrabold italic uppercase leading-[0.95] tracking-tighter mb-3 md:mb-6 max-w-3xl drop-shadow-2xl">
            Stokos Deals <br /> 
            <span className="text-white/95 text-[0.9em]">Stacked High</span>
          </h1>

          {/* Description: Pure White color and clear visibility */}
          <p className="text-white text-[12px] sm:text-sm md:text-lg lg:text-xl max-w-[280px] md:max-w-lg mb-5 md:mb-10 font-medium leading-snug">
            Towson's hottest meals — wings, pizza, subs & seafood. Fresh, fast, and always a deal.
          </p>

          {/* Action Buttons: Force Row on Mobile with smaller width */}
          <div className="flex flex-row items-center gap-2 md:gap-6">
            <button className="whitespace-nowrap bg-green-500 hover:bg-green-600 text-black font-extrabold px-4 md:px-10 py-2.5 md:py-3.5 rounded-full text-[10px] md:text-sm uppercase transition-all shadow-xl active:scale-95">
              Order Specials
            </button>

            <button className="whitespace-nowrap bg-black/50 hover:bg-black/70 text-white border border-white/20 font-extrabold px-4 md:px-10 py-2.5 md:py-3.5 rounded-full text-[10px] md:text-sm uppercase transition-all backdrop-blur-md active:scale-95">
              EXPLORE MENU 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}