"use client";

import { useState, useRef } from "react";

const CATEGORIES = [
  { id: "trending", name: "Popular Menu Items", special: true },
  { id: "breakfast", name: "Breakfast (served until 11am)" },
  { id: "coupons", name: "Menu Coupons" }, // This was likely the one failing
  { id: "salads", name: "Fresh Salads" },
  { id: "hot-subs", name: "Hot Subs" },
  { id: "cold-subs", name: "Cold Sub" },
  { id: "seafood-subs", name: "Seafood Subs" },
  { id: "sandwiches", name: "Sandwiches" },
  { id: "club-sandwiches", name: "Club Sanwiches" },
  { id: "pizzas", name: "Pizzas" },
  // ... rest of your categories
];

export default function Categories() {
  const [active, setActive] = useState("trending");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActive(id);
    const target = e.currentTarget;
    const container = scrollRef.current;

    if (container) {
      const scrollPos = target.offsetLeft - container.offsetWidth / 2 + target.offsetWidth / 2;
      container.scrollTo({ left: scrollPos, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full sticky top-[68px] z-30 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-[1680px] mx-auto px-4">
        
        {/* 
           FIX: Added py-4 (vertical padding) to the container. 
           This gives the shadows and "scale-105" room to breathe so they don't get clipped.
        */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2.5 md:gap-3 overflow-x-auto no-scrollbar flex-nowrap scroll-smooth py-4"
        >
          {CATEGORIES.map((cat) => {
            const isActive = active === cat.id;

            return (
              <button
                key={cat.id}
                onClick={(e) => handleCategoryClick(cat.id, e)}
                className={`
                  flex-shrink-0 whitespace-nowrap px-5 md:px-7 py-2 md:py-2.5 rounded-full
                  text-[11px] md:text-sm font-semibold transition-all duration-200
                  outline-none relative
                  ${isActive ? "z-10" : ""}

                  ${
                    isActive
                      ? cat.special
                        ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                        /* FIX: Changed "----" to "bg-black" (or whatever color you want for active items) */
                        : "bg-green-500 dark:bg-green-500 text-white dark:text-white shadow-lg"
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  }
                `}
              >
                {cat.name}
              </button>
            );
          })}

          {/* spacer */}
          <div className="flex-shrink-0 w-6 h-1" />
        </div>
      </div>
    </div>
  );
}