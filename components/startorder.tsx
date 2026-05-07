import Link from "next/link";

export default function StartOrder() {
  return (
    <section className="w-full bg-white dark:bg-black py-3 md:py-6">
      <div className="mx-auto flex max-w-[1600px] flex-col items-start gap-3 px-4 sm:px-6 md:flex-row md:items-center md:gap-8">
        
        {/* Heading */}
        <h2 className="text-left text-2xl sm:text-2xl md:text-4xl font-black uppercase tracking-tight text-black dark:text-white whitespace-nowrap">
          Start Your Order
        </h2>

        {/* Buttons Row */}
        <div className="flex w-full items-center gap-2 md:flex-1 md:gap-5">
          <Link
            href="/store/towson?order_type=delivery"
            className="flex h-9 sm:h-10 md:h-14 flex-1 items-center justify-center rounded-full bg-[#DA3327] px-3 md:px-8 text-[11px] sm:text-xs md:text-base font-black uppercase text-white shadow-md transition hover:bg-[#c52d22] active:scale-[0.98]"
          >
            Delivery
          </Link>

          <span className="text-xs sm:text-sm md:text-lg font-black uppercase text-black dark:text-white">
            OR
          </span>

          <Link
            href="/store/towson?order_type=carryout"
            className="flex h-9 sm:h-10 md:h-14 flex-1 items-center justify-center rounded-full bg-[#DA3327] px-3 md:px-8 text-[11px] sm:text-xs md:text-base font-black uppercase text-white shadow-md transition hover:bg-[#c52d22] active:scale-[0.98]"
          >
            Carryout
          </Link>
        </div>
      </div>
    </section>
  );
}