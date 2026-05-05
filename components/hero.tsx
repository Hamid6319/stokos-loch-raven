"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  {
    src: "/images/banner1.png",
    alt: "Stokos Deals Special 1",
  },
  {
    src: "/images/banner2.png",
    alt: "Stokos Deals Special 2",
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000); // Stays on each image for 5 seconds
    return () => clearInterval(timer);
  }, []);

  if (!isLoaded) return <div className="w-full aspect-[1.2/1] md:aspect-[25/9] bg-zinc-900 rounded-[2.5rem]" />;

  return (
    <div className="w-full px-2 md:px-6 py-2 md:py-4">
      <div className="relative w-full aspect-[1.2/1] md:aspect-[21/8] lg:aspect-[25/9] overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl bg-zinc-900">
        
        {/* Removed mode="wait" to allow cross-fade effect */}
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.9, // Reduced from 1.0 to 0.7 for more speed
              ease: "easeInOut" 
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle Bottom Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}