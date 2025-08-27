"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = 
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center transition-all duration-300"
        aria-label="Toggle Dark Mode"
      >
        <div className="w-5 h-5 bg-muted-foreground/30 rounded animate-pulse" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-accent shadow-sm hover:shadow-md"
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} className="text-muted-foreground" />
      )}
    </button>
  );
}
