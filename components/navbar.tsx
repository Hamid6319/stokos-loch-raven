"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, Moon, Sun } from "lucide-react";
import { useCartStore } from "@/app/store/[slug]/usecartstore";

export default function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  const { cart, toggleCart } = useCartStore();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextDark = !isDark;

    if (nextDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setIsDark(nextDark);
  };

  const isStorePage = pathname.startsWith("/store");

  const navClass = (active: boolean) =>
    `font-extrabold transition whitespace-nowrap ${
      active
        ? "text-green-200 border-b-2 border-green-200 pb-1"
        : "text-white hover:text-green-200"
    }`;

  return (
    <>
      <header className="top-0 z-50 w-full bg-green-700 text-white shadow-md dark:bg-black border-b border-zinc-800 transition-colors">
        <div className="mx-auto w-full max-w-[1600px] px-4 md:px-6">
          <div className="relative flex min-h-[72px] items-center justify-between gap-4 lg:h-[82px]">
            <nav className="hidden lg:flex items-center gap-8 text-sm uppercase tracking-wide">
              <Link href="/" className={navClass(pathname === "/")}>
                Home
              </Link>

              <Link
                href={isStorePage ? "#trending" : "/store/towson#trending"}
                className={navClass(isStorePage)}
              >
                Menu
              </Link>

              <Link
                href={isStorePage ? "#deals" : "/store/towson#deals"}
                className={navClass(false)}
              >
                Deals
              </Link>

              <Link href="/contact" className={navClass(pathname === "/contact")}>
                Contact Us
              </Link>
            </nav>

            <Link href="/" className="lg:absolute lg:left-1/2 lg:-translate-x-1/2">
              <Image
                src="/images/newstokoslogo.png"
                alt="Stoko's Logo"
                width={170}
                height={70}
                priority
                className="h-11 w-auto object-contain md:h-14"
              />
            </Link>

            <div className="ml-auto flex items-center gap-3 md:gap-4">
              <div className="hidden md:flex items-center gap-2 rounded-full border-white/20 bg-white/15 px-4 py-2 border-b">
                <Search size={17} />
                <input
                  type="text"
                  placeholder="Search menu..."
                  className="w-[190px] bg-transparent text-sm text-white placeholder:text-white/70 outline-none"
                />
              </div>

              <button
                type="button"
                className="rounded-full bg-white px-4 py-2 text-xs font-bold text-green-800 transition hover:bg-green-100 md:px-5 md:text-sm"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="relative flex h-9 w-[64px] cursor-pointer items-center rounded-full border border-white/25 bg-white/20 px-1 md:w-[70px]"
              >
                <span
                  className={`absolute flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-300 ${
                    isDark
                      ? "translate-x-[28px] md:translate-x-[34px]"
                      : "translate-x-0"
                  }`}
                >
                  {isDark ? (
                    <Moon size={14} className="text-black" />
                  ) : (
                    <Sun size={14} className="text-green-800" />
                  )}
                </span>
              </button>
            </div>
          </div>

          <nav className="-mx-4 flex w-auto items-center justify-start gap-7 overflow-x-auto border-t border-white/20 px-4 py-3 text-xs uppercase no-scrollbar md:-mx-6 md:px-6 lg:hidden">
            <Link href="/" className={navClass(pathname === "/")}>
              Home
            </Link>

            <Link
              href={isStorePage ? "#trending" : "/store/towson#trending"}
              className={navClass(isStorePage)}
            >
              Menu
            </Link>

            <Link
              href={isStorePage ? "#deals" : "/store/towson#deals"}
              className={navClass(false)}
            >
              Deals
            </Link>

            <Link href="/contact" className={navClass(pathname === "/contact")}>
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Floating Cart */}
      <button
        type="button"
        onClick={toggleCart}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#DA3327] text-white shadow-2xl transition hover:scale-105 active:scale-95 md:h-16 md:w-16"
      >
        <ShoppingCart size={24} />

        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-black dark:bg-green-500 dark:text-white px-2 text-xs font-black text-white">
            {cartCount}
          </span>
        )}
      </button>
    </>
  );
}