import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
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
    <html lang="en" suppressHydrationWarning>
      
      {/* ✅ Theme script BEFORE body (no flicker) */}
      <body className={`${jakarta.variable} font-sans min-h-screen antialiased`}>
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const saved = localStorage.getItem("theme");
                  if (saved === "dark") {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

        <Navbar />

        <main className="flex-1 lg:ml-[80px] pb-[80px] lg:pb-0 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}