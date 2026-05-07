import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800" ],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} font-sans min-h-screen antialiased bg-white dark:bg-black`}
      >
        

        <main className="min-h-screen pb-[80px]">
          {children}
        </main>
      </body>
    </html>
  );
}