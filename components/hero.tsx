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
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
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

  // Use a transparent background for the placeholder to avoid the "box" look
  if (!isLoaded) return <div className="w-full aspect-[1/1.1] md:aspect-[25/9] rounded-[1.4rem] bg-transparent" />;

  return (
    <div className="w-full px-2 md:px-12 py-2 md:py-4">
      {/* 
          Removing bg-zinc-900 here prevents that "dark background" from 
          showing through during the image fade.
      */}
      <div className="relative w-full aspect-[1/1.1] md:aspect-[21/8] lg:aspect-[25/9] overflow-hidden rounded-[1.4rem] shadow-2xl bg-transparent">
        
        <AnimatePresence initial={false}>
          <motion.div
            key={`${currentIndex}-${isMobile}`}
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
      </div>
    </div>
  );
}