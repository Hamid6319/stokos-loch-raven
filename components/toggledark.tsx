"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem("theme");

    if (saved) {
      const isDark = saved === "dark";
      setDark(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(systemDark);
      document.documentElement.classList.toggle("dark", systemDark);
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDark);
  };

  if (!mounted) return null;

  return (
    <button onClick={toggleTheme}>
      {dark ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}