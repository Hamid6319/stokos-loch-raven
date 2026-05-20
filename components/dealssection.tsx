"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import DealProductModal from "./dealsproductmodel";

type StoreSlug = "towson" | "york" | "liberty";

type DealProduct = {
  id: string;
  deal: string;
  category: "deals";
  title: string;
  description: string;
  price: string;
  image: string;
  storeSlug?: StoreSlug;
};

const validStores: StoreSlug[] = ["towson", "york", "liberty"];

const deals: DealProduct[] = [
  {
    id: "half-sub-fries-soda-special",
    deal: "half-sub-fries-soda-special",
    category: "deals",
    title: "Half Sub Combo",
    description:
      "Any 1/2 sub with French fries and a can of soda. Seafood subs extra.",
    price: "$12.99",
    image: "/images/halfsubcombo.jpeg",
  },
  {
    id: "two-large-one-topping-pizzas",
    deal: "two-large-one-topping-pizzas",
    category: "deals",
    title: "2 Large 1-Topping Pizzas",
    description: "Two large pizzas with one topping each.",
    price: "$18.99",
    image: "/images/largepizza.png",
  },
  {
    id: "xl-pizza-one-topping-20-wings",
    deal: "xl-pizza-one-topping-20-wings",
    category: "deals",
    title: "XL Pizza & 20 Wings",
    description: "X-large 1-topping pizza with 20 Buffalo wings.",
    price: "$29.99",
    image: "/images/pizzaandwings.png",
  },
];

export default function DealsSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const searchParams = useSearchParams();

  const [selectedDeal, setSelectedDeal] = useState<DealProduct | null>(null);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);

  const slugParam = params?.slug;
  const currentSlug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const storeSlug: StoreSlug = validStores.includes(currentSlug as StoreSlug)
    ? (currentSlug as StoreSlug)
    : "towson";

  const selectedDealSlug = searchParams.get("deal");

  const openDealModal = (deal: DealProduct) => {
    setSelectedDeal({
      ...deal,
      storeSlug,
    });
    setIsDealModalOpen(true);
  };

  const closeDealModal = () => {
    setIsDealModalOpen(false);
    setSelectedDeal(null);
  };

  useEffect(() => {
    if (!selectedDealSlug) return;

    const matchedDeal = deals.find(
      (item) => item.deal === selectedDealSlug || item.id === selectedDealSlug
    );

    if (!matchedDeal) return;

    const timer = window.setTimeout(() => {
      const dealsSection = document.getElementById("deals");

      if (dealsSection) {
        const top =
          dealsSection.getBoundingClientRect().top + window.scrollY - 120;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      }

      openDealModal(matchedDeal);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [selectedDealSlug, storeSlug]);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const scrollAmount = sliderRef.current.clientWidth * 0.85;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section id="deals" className="scroll-mt-[120px] w-full py-5 md:py-10">
        <div className="mx-auto max-w-[1600px] px-4 md:px-0">
          <div className="mb-4 flex items-center justify-between md:mb-6">
            <h2 className="text-[26px] font-black uppercase leading-none tracking-tight text-black dark:text-white md:text-4xl">
              Explore More Deals
            </h2>

            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Previous deals"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white text-black transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Next deals"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white text-black transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div
            ref={sliderRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 md:gap-6 md:px-3"
          >
            {deals.map((deal) => (
              <article
                key={deal.id}
                className="group w-[86vw] shrink-0 snap-start overflow-hidden rounded-[20px] bg-white ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 dark:bg-[#121b13] dark:ring-white/10 sm:w-[390px] md:w-[405px] lg:w-[410px]"
              >
                <button
                  type="button"
                  onClick={() => openDealModal(deal)}
                  className="relative block h-[210px] w-full overflow-hidden bg-neutral-100 text-left dark:bg-[#050505] md:h-[225px]"
                >
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 86vw, 410px"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-[#DA3327] px-4 py-2 text-[12px] font-black uppercase tracking-wide text-white">
                    Deal
                  </div>

                  <div className="pointer-events-none absolute inset-0 hidden bg-black/5 dark:block" />
                </button>

                <div className="p-6">
                  <h3 className="text-[22px] font-black leading-tight tracking-[-0.03em] text-black transition-colors duration-300 dark:text-white">
                    {deal.title}
                  </h3>

                  <p className="mt-3 min-h-[52px] text-[14px] font-medium leading-[1.55] text-neutral-700 transition-colors duration-300 dark:text-neutral-300">
                    {deal.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <p className="text-[26px] font-black leading-none tracking-[-0.04em] text-black dark:text-white">
                      {deal.price}
                    </p>

                    <button
                      type="button"
                      onClick={() => openDealModal(deal)}
                      className="inline-flex h-[42px] items-center justify-center rounded-full bg-[#DA3327] px-6 text-[12px] font-black uppercase tracking-wide text-white transition hover:bg-[#DA2337] active:scale-[0.98]"
                    >
                      Order Deal
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {selectedDeal && (
        <DealProductModal
          product={selectedDeal}
          isOpen={isDealModalOpen}
          onClose={closeDealModal}
        />
      )}
    </>
  );
}