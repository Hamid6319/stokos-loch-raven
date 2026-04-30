"use client";

import { useState, useEffect } from "react";
import { Menu, Home, MapPin, Info, Phone, Moon, Sun, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark"; // Default dark
    setTheme(savedTheme);
    
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className={`hidden lg:flex fixed left-0 top-0 h-full w-[80px]
        custom-nav border-r flex-col items-center py-6 z-50 transition-colors duration-300
      `}>
        <button onClick={() => setOpen(true)} className="mb-8">
          <Menu size={26} />
        </button>

        <div className="flex flex-col gap-8 items-center">
          <Home className="cursor-pointer" />
          <MapPin className="cursor-pointer" />
          <Info className="cursor-pointer" />
          <Phone className="cursor-pointer" />
        </div>

        <div className="mt-auto mb-6">
          <button onClick={toggleTheme} className="p-2 rounded-full border border-gray-700">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* ================= EXPANDED MENU ================= */}
     <div className={`fixed top-0 left-0 h-full w-[300px] 
    custom-nav border-r shadow-2xl z-[999] transition-transform duration-500
    ${open ? "translate-x-0" : "-translate-x-full"}
    /* Sirf yeh class add karni hai separation ke liye */
    dark:shadow-[10px_0_40px_rgba(0,0,0,0.8)]
`}>
        <div className="flex flex-col h-full p-6">

             <button onClick={() => setOpen(false)}><X /></button>

                 <br /><br />

          <div className="flex justify-between items-center mb-10">
                <Image
                src="/images/newlogo.png"
                alt="How It Works"
                width={300}
                height={300}
                className="w-full h-auto object-contain
                "
              />
           
          </div>

          <div className="flex flex-col gap-6 text-lg font-medium">
            <a className="flex items-center gap-4 cursor-pointer"><Home size={20}/> Home</a>
            <a className="flex items-center gap-4 cursor-pointer"><MapPin size={20}/> Location</a>
            <a className="flex items-center gap-4 cursor-pointer"><Info size={20}/> Our Story</a>
            <a className="flex items-center gap-4 cursor-pointer"><Phone size={20}/> Contact</a>
          </div>

          <div className="mt-auto">
            {/* Toggle Button Inside Drawer */}
            <button 
              onClick={toggleTheme} 
              className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all border
                ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-100 border-gray-200'}`}
            >
              <span className="font-semibold">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              {theme === "dark" ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
            </button>

            <div className="mt-6 flex gap-6 justify-center text-xl">
              <FaFacebookF />
              <FaInstagram />
              <FaWhatsapp />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]" />}

      {/* ================= MOBILE NAV ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full custom-nav border-t flex justify-around py-4 z-50">
        <Home />
        <MapPin />
        <button onClick={() => setOpen(true)} className="bg-yellow-500 text-black w-14 h-14 rounded-full flex items-center justify-center -mt-10 shadow-lg border-4 custom-nav">
          <Menu />
        </button>
        <Info />
        <Phone />
      </div>
    </>
  );
}