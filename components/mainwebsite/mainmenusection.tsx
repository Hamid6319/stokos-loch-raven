import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "Pizza",
    category: "pizzas",
    image: "/images/mainmenu1.png",
  },
  {
    title: "Subs",
    category: "subs",
    image: "/images/mainmenu2.png",
  },
  {
    title: "Wings",
    category: "wings",
    image: "/images/mainmenuwings.png",
  },
  {
    title: "Breakfast",
    category: "breakfast",
    image: "/images/mainmenu4.png",
  },
  {
    title: "Sandwiches",
    category: "sandwiches",
    image: "/images/mainmenu5.png",
  },
  {
    title: "Sides",
    category: "sides",
    image: "/images/mainmenu6.png",
  },
];

export default function ExploreMenuSection() {
  return (
    <section className="w-full bg-[#e0e7e1] px-4 py-16 transition-colors duration-300 dark:bg-[#1b241d] md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1245px]">
        {/* Header */}
        <div className="mb-9">
          <p className="mb-3 text-[12px] font-black uppercase tracking-[0.35em] text-[#ff3131]">
            Made Fresh Daily
          </p>

          <h2 className="text-[34px] font-black leading-none tracking-[-0.04em] text-black dark:text-white md:text-[40px]">
            Explore Our Menu
          </h2>
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={`/mainwebsite/location?action=menu&category=${item.category}`}
              className="group flex h-[222px] flex-col items-center justify-center rounded-[18px] bg-white shadow-[0_10px_28px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] dark:bg-[#101a12] dark:ring-white/5 dark:shadow-[0_12px_30px_rgba(0,0,0,0.28)] dark:hover:shadow-[0_18px_45px_rgba(0,0,0,0.38)]"
            >
              <div className="relative h-[150px] w-[150px] overflow-hidden rounded-full bg-white p-1 shadow-inner dark:bg-[#18241a]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="rounded-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              <h3 className="mt-5 text-[15px] font-black uppercase tracking-wide text-black transition-colors duration-300 dark:text-white">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}