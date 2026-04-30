"use client";

import Image from "next/image";
import { Search, Flame, ShoppingBag, Menu, MapPin, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full custom-nav border-b px-4 py-2 md:py-3">
      <div className="flex items-center justify-between max-w-[1440px] mx-auto gap-2 md:gap-4">
        
        {/* LEFT: Mobile Menu + Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu Icon (Only visible on small screens) */}
      

          {/* RESPONSIVE LOGO: w-24 on mobile, w-48 on desktop */}
          <div className="relative w-40 md:w-36 lg:w-44 transition-all duration-300">
            <Image 
              src="/images/newlogo.png" 
              alt="Stokos Logo" 
              width={400} 
              height={400} 
              priority
              className="object-contain h-auto"
            />
          </div>
        </div>

        {/* CENTER: Search Bar (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search pizza, wings, seafood..."
            className="w-full py-2 pl-11 pr-4 rounded-full bg-transparent border border-gray-300 dark:border-zinc-800 
                       text-black dark:text-white placeholder-gray-500 text-xs lg:text-sm
                       focus:outline-none focus:border-gray-500 transition-all"
          />
        </div>

        {/* RIGHT SECTION: Hot Deals + Location + Cart */}
        <div className="flex items-center gap-2 lg:gap-4">
          
          {/* Hot Deals Button with Notification Dot */}
          <button className="relative flex items-center justify-center p-2 rounded-full bg-red-600/10 border border-red-600/20 text-red-600">
            <Flame size={18} fill="currentColor" />
            <span className="absolute -top-1 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <span className="hidden lg:inline ml-2 text-xs font-bold uppercase">Hot Deals</span>
          </button>

       
          {/* CART ICON */}
          <button className="relative p-2.5 md:p-3 rounded-full bg-green-500 text-black hover:bg-green-600 transition-all shadow-lg active:scale-95">
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-black">
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}