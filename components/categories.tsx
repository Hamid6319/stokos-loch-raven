"use client";

import { useState, useRef } from "react";

const categories = [
  { id: "trending", name: "Popular Menu Items", special: true },
  { id: "breakfast", name: "Breakfast (served until 11am)" },
  { id: "coupons", name: "Menu Coupons" },
  { id: "salads", name: "Fresh Salads" },
  { id: "hot-subs", name: "Hot Subs" },
  { id: "cold-subs", name: "Cold Sub" },
  { id: "seafood-subs", name: "Seafood Subs" },
  { id: "sandwiches", name: "Sandwiches" },
  { id: "club-sandwiches", name: "Club Sandwiches" },
  { id: "pizzas", name: "Pizzas" },
  { id: "specialty-pizzas", name: "Stoko's Specialty Pizzas" },
  { id: "stromboli", name: "Famous Stromboli" },
  { id: "calzones", name: "Calzones" },
  { id: "quesadillas", name: "Quesadillas" },
  { id: "platters", name: "Platters" },
  { id: "chicken", name: "Chicken" },
  { id: "fish-special", name: "Fish Special" },
  { id: "fish-only", name: "Fish Only" },
  { id: "pasta", name: "Italian Pasta" },
  { id: "gyros", name: "Gyros" },
  { id: "pick-2", name: "Pick 2" },
  { id: "wrapped", name: "Get Wrapped" },
  { id: "sides", name: "Side Orders" },
  { id: "dessert", name: "Dessert" },
  { id: "beverages", name: "Beverages" },
];

export default function Categories() {
  const [active, setActive] = useState("trending");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActive(id);
    const target = e.currentTarget;
    const container = scrollRef.current;

    if (container && target) {
      const scrollPos = target.offsetLeft - (container.offsetWidth / 2) + (target.offsetWidth / 2);
      container.scrollTo({
        left: scrollPos,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full sticky top-[68px] z-30 bg-black border-b border-zinc-800 py-3 md:py-4 transition-all overflow-x-hidden">
      
      <div className="max-w-[1580px] mx-auto px-4 md:px-0">
        <div 
          ref={scrollRef}
          className="w-full flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar flex-nowrap scroll-smooth touch-pan-x"
          /* INLINE STYLE: Ye refresh flicker ko rokega */
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch' 
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={(e) => handleCategoryClick(cat.id, e)}
              className={`
                flex-shrink-0 whitespace-nowrap px-5 md:px-6 py-2 rounded-full text-[11px] md:text-sm font-bold transition-all duration-300 select-none
                ${
                  active === cat.id
                    ? "bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] scale-105" 
                    : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-transparent"
                }
              `}
            >
              {cat.name}
            </button>
          ))}

          <div className="flex-shrink-0 w-4 md:w-10 h-1" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}