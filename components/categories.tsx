"use client";

import { useState, useRef } from "react";

const CATEGORIES = [
  { id: "trending", name: "Popular Menu Items", special: true },
  { id: "breakfast", name: "Breakfast (served until 11am)" },
  { id: "deals", name: "Menu Coupons" },
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

  const handleCategoryClick = (
    id: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setActive(id);

    const target = e.currentTarget;
    const container = scrollRef.current;

    if (container) {
      const scrollPos =
        target.offsetLeft - container.offsetWidth / 2 + target.offsetWidth / 2;

      container.scrollTo({
        left: scrollPos,
        behavior: "smooth",
      });
    }

    const section = document.getElementById(id);

    if (section) {
      const yOffset = -150;
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="top-[125px] z-30 w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black md:top-[82px]">
      <div className="mx-auto max-w-[1600px] px-4 md:px-0">
        <div
          ref={scrollRef}
          className="no-scrollbar flex flex-nowrap items-center gap-2.5 overflow-x-auto scroll-smooth py-4 md:gap-3"
        >
          {CATEGORIES.map((cat) => {
            const isActive = active === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={(e) => handleCategoryClick(cat.id, e)}
                className={`
                  relative flex-shrink-0 whitespace-nowrap rounded-full px-5 py-2
                  text-[11px] font-semibold outline-none md:px-7 md:py-2.5 md:text-sm
                  ${
                    isActive
                      ? "bg-[#DA3327] text-white"
                      : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }
                `}
              >
                {cat.name}
              </button>
            );
          })}

          <div className="h-1 w-6 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}