import Link from "next/link";

export default function StartOrder() {
  return (
    <section className="w-full bg-white dark:bg-black py-6">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-5 px-4 md:flex-row md:gap-8">

        {/* Heading */}
        <h2 className="text-center text-2xl font-black uppercase tracking-tight text-black dark:text-white md:text-4xl md:weight-extrabold">
          Start Your Order
        </h2>

        {/* Buttons */}
        <div className="flex w-full flex-col items-center gap-4 md:flex-1 md:flex-row">
          <Link
            href="/store/towson?order_type=delivery"
            className="flex h-12 w-full items-center justify-center rounded-full bg-[#DA3327] px-8 text-sm font-black uppercase text-white shadow-md transition hover:bg-[#c52d22] md:h-14"
          >
            Delivery
          </Link>

          <span className="text-lg font-black uppercase text-black dark:text-white">
            OR
          </span>

          <Link
            href="/store/towson?order_type=carryout"
            className="flex h-12 w-full items-center justify-center rounded-full bg-[#DA3327] px-8 text-sm font-black uppercase text-white shadow-md transition hover:bg-[#c52d22] md:h-14"
          >
            Carryout
          </Link>
        </div>
      </div>
    </section>
  );
}