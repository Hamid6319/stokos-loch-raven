"use client";

import { useState, useEffect } from "react";
import { Menu, Home, MapPin, Info, Phone, Moon, Sun, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check current state on load
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <>
      {/* Desktop Mini Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-[80px] custom-nav border-r flex-col items-center py-6 z-50 transition-colors">
        <button onClick={() => setOpen(true)} className="mb-8 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
          <Menu size={26} />
        </button>

        <div className="flex flex-col gap-10 items-center opacity-60">
          <Home className="cursor-pointer hover:opacity-100 transition-opacity" />
          <MapPin className="cursor-pointer hover:opacity-100 transition-opacity" />
          <Info className="cursor-pointer hover:opacity-100 transition-opacity" />
          <Phone className="cursor-pointer hover:opacity-100 transition-opacity" />
        </div>

        <div className="mt-auto mb-6">
          <button onClick={toggleTheme} className="p-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-90">
            {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Expanded Menu (Drawer) */}
      <div className={`fixed top-0 left-0 h-full w-[310px] custom-nav border-r shadow-2xl z-[1000] transition-transform duration-500 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"} dark:shadow-[15px_0_50px_rgba(0,0,0,0.8)]`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-end">
             <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"><X /></button>
          </div>

          <div className="px-6 py-8 flex justify-center">
            <Image src="/images/newlogo.png" alt="Logo" width={180} height={180} className="w-auto h-24 object-contain" />
          </div>

          <nav className="flex flex-col gap-6 text-lg font-bold mt-4">
            <a className="flex items-center gap-5 cursor-pointer hover:translate-x-2 transition-transform"><Home size={22} className="text-zinc-500"/> Home</a>
            <a className="flex items-center gap-5 cursor-pointer hover:translate-x-2 transition-transform"><MapPin size={22} className="text-zinc-500"/> Location</a>
            <a className="flex items-center gap-5 cursor-pointer hover:translate-x-2 transition-transform"><Info size={22} className="text-zinc-500"/> Our Story</a>
            <a className="flex items-center gap-5 cursor-pointer hover:translate-x-2 transition-transform"><Phone size={22} className="text-zinc-500"/> Contact</a>
          </nav>

          <div className="mt-auto">
            {/* Toggle Button in Drawer - Colors fixed for both modes */}
            <button 
              onClick={toggleTheme} 
              className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all border
                ${isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-200 text-black'}`}
            >
              <span className="font-bold">{isDark ? "Light Mode" : "Dark Mode"}</span>
              <div className={`p-2 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-white shadow-sm'}`}>
                {isDark ? <Sun size={18} className="text-white-500" /> : <Moon size={18} className="text-zinc-600" />}
              </div>
            </button>

            <div className="mt-8 flex gap-6 justify-center text-xl text-zinc-500">
              <FaFacebookF className="hover:text-blue-600 cursor-pointer transition-colors" />
              <FaInstagram className="hover:text-pink-600 cursor-pointer transition-colors" />
              <FaWhatsapp className="hover:text-green-600 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] transition-opacity" />}

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full custom-nav border-t flex justify-around items-center py-4 z-50">
        <Home className="text-zinc-500" />
        <MapPin className="text-zinc-500" />
        <button onClick={() => setOpen(true)} className="bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center -mt-10 shadow-xl border-4 border-white dark:border-[#050505] active:scale-90 transition-all">
          <Menu size={24} />
        </button>
        <Info className="text-zinc-500" />
        <Phone className="text-zinc-500" />
      </div>
    </>
  );
}