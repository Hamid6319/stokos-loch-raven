"use client";

import { useState, useRef } from "react";

const CATEGORIES = [
  { id: "trending", name: "Popular Menu Items", special: true },
  { id: "breakfast", name: "Breakfast (served until 11am)" },
  { id: "coupons", name: "Menu Coupons" },
  { id: "salads", name: "Fresh Salads" },
  { id: "hot-subs", name: "Hot Subs" },
  { id: "cold-subs", name: "Cold Sub" },
  { id: "seafood-subs", name: "Seafood Subs" },
  { id: "sandwiches", name: "Sandwiches" },
  { id: "club-sandwiches", name: "Club Sanwiches" },
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

  const handleCategoryClick = (
    id: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setActive(id);

    const target = e.currentTarget;
    const container = scrollRef.current;

    if (container) {
      const scrollPos =
        target.offsetLeft -
        container.offsetWidth / 2 +
        target.offsetWidth / 2;

      container.scrollTo({
        left: scrollPos,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full sticky top-[68px] z-30 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 py-3 md:py-4 transition-colors">
      
      <div className="max-w-[1580px] mx-auto px-4 md:px-0">
        
        <div
          ref={scrollRef}
          className="flex items-center gap-2.5 md:gap-3 overflow-x-auto no-scrollbar flex-nowrap scroll-smooth"
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
                  outline-none

                  ${
                    isActive
                      ? cat.special
                        ? "bg-yellow-400 text-black shadow-[0_0_12px_rgba(250,204,21,0.4)] scale-105"
                        : "bg-green-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.4)] scale-105"
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  }
                `}
              >
                {cat.name}
              </button>
            );
          })}

          <div className="flex-shrink-0 w-6 h-1" />
        </div>
      </div>
    </div>
  );
}