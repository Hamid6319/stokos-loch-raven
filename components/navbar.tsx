"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, ShoppingCart, Moon, Sun } from "lucide-react";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextDark = !root.classList.contains("dark");

    root.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    setIsDark(nextDark);
  };

  return (
    <>
      <header className="top-0 z-50 w-full bg-green-800 text-white shadow-md dark:bg-black">
        <div className="mx-auto w-full max-w-[1600px] px-4 md:px-6">

          {/* Desktop Navbar */}
          <div className="hidden lg:flex relative h-[82px] items-center justify-between">
            <nav className="flex items-center gap-8 text-sm font-extrabold uppercase tracking-wide">
              <a href="/" className="hover:text-green-200">Home</a>
              <a href="#menu" className="hover:text-green-200">Menu</a>
              <a href="#deals" className="hover:text-green-200">Deals</a>
              <a href="#contact" className="hover:text-green-200">Contact Us</a>
            </nav>

            <div className="absolute left-1/2 -translate-x-1/2">
              <Image
                src="/images/newstokoslogo.png"
                alt="Stoko's Logo"
                width={170}
                height={70}
                priority
                className="h-14 w-auto object-contain"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2">
                <Search size={17} />
                <input
                  type="text"
                  placeholder="Search menu..."
                  className="w-[190px] bg-transparent text-sm text-white placeholder:text-white/70 outline-none"
                />
              </div>

              <button className="rounded-full bg-white px-5 py-2 text-sm font-bold text-green-800 hover:bg-green-100">
                Sign In
              </button>

              <button
                onClick={toggleTheme}
                className="relative flex h-9 w-[70px] items-center rounded-full border border-white/25 bg-white/20 px-1"
              >
                <span
                  className={`absolute flex h-7 w-7 items-center justify-center rounded-full bg-white transition-all duration-300 ${
                    isDark ? "translate-x-[34px]" : "translate-x-0"
                  }`}
                >
                  {isDark ? (
                    <Moon size={15} className="text-black" />
                  ) : (
                    <Sun size={15} className="text-green-800" />
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile / Tablet Navbar */}
          <div className="flex lg:hidden flex-col">

            {/* Top Row */}
            <div className="flex h-[68px] items-center justify-between">
              <Image
                src="/images/newstokoslogo.png"
                alt="Stoko's Logo"
                width={135}
                height={55}
                priority
                className="h-11 w-auto object-contain"
              />

              <div className="flex items-center gap-3">
                <button className="rounded-full bg-white px-4 py-2 text-xs font-bold text-green-800">
                  Sign In
                </button>

                <button
                  onClick={toggleTheme}
                  className="relative flex h-9 w-[64px] items-center rounded-full border border-white/25 bg-white/20 px-1"
                >
                  <span
                    className={`absolute flex h-7 w-7 items-center justify-center rounded-full bg-white transition-all duration-300 ${
                      isDark ? "translate-x-[28px]" : "translate-x-0"
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

            {/* Navigation Row */}
            <nav className="flex items-center justify-center gap-6 border-t border-white/15 py-3 text-xs font-extrabold uppercase">
              <a href="/">Home</a>
              <a href="#menu">Menu</a>
              <a href="#deals">Deals</a>
              <a href="#contact">Contact</a>
            </nav>

            {/* Search Row */}
            <div className="pb-4">
              <div className="hidden flex w-full items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search menu..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/70 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Checkout */}
      <button className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#DA3327] text-white shadow-2xl transition hover:scale-105 active:scale-95 dark:bg-[#DA3327] dark:text-white md:h-16 md:w-16">
        <ShoppingCart size={24} />
      </button>
    </>
  );
}