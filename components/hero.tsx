"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  {
    desktop: "/images/banner1.png",
    mobile: "/images/banner1.png",
    alt: "Stokos Deals Special 1",
  },
  {
    desktop: "/images/banner2.png",
    mobile: "/images/banner2.png",
    alt: "Stokos Deals Special 2",
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    // Check if screen is mobile to show correct image
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Placeholder while loading to prevent layout shift
  if (!isLoaded) return <div className="w-full aspect-[1/1.1] md:aspect-[25/9] bg-zinc-900 rounded-[1.4rem]" />;

  return (
    <div className="w-full px-2 md:px-12 py-2 md:py-4">
      {/* 
          ASPECT RATIO FIX: 
          Mobile: aspect-[1/1.1] (slightly taller than square) ensures text fits.
          Desktop: aspect-[25/9] (Ultra-wide)
      */}
      <div className="relative w-full aspect-[1/1.1] md:aspect-[21/8] lg:aspect-[25/9] overflow-hidden rounded-[1.4rem] shadow-2xl bg-zinc-900">
        
        <AnimatePresence initial={false}>
          <motion.div
            key={`${currentIndex}-${isMobile}`} // Re-animate if index OR screen type changes
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={isMobile ? images[currentIndex].mobile : images[currentIndex].desktop}
              alt={images[currentIndex].alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark overlay at bottom so image feels grounded */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}