"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ToggleDark() {
  const [dark, setDark] = useState(false);

  // Load initial theme
  useEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-5 left-5 w-12 h-12 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg transition"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}