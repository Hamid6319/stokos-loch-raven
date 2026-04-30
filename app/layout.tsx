import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar"; 

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  // Yahan se weight wala array hata dein ya 900 nikal dein
  // Maximum available weights: 200, 300, 400, 500, 600, 700, 800
  weight: ["400", "500", "600", "700", "800"], 
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Stokos Loch Raven",
  description: "Online Ordering System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
         {/* Theme Script same rahega */}
      </head>

      {/* yahan font-sans class ko remove kar ke direct variable check karte hain */}
      <body 
        className={`${jakarta.variable} font-sans min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white antialiased`}
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-1 lg:ml-[80px] pb-[80px] lg:pb-0 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}