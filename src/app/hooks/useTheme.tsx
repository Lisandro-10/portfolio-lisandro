"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "theme";
const THEME_EVENT_NAME = "theme-change";

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Cargar tema guardado
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as "dark" | "light";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("light", savedTheme === "light");
    }
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<"dark" | "light">;
      const nextTheme = customEvent.detail;
      if (!nextTheme) return;
      setTheme(nextTheme);
      document.documentElement.classList.toggle("light", nextTheme === "light");
    };

    window.addEventListener(THEME_EVENT_NAME, handler);
    return () => window.removeEventListener(THEME_EVENT_NAME, handler);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");

    window.dispatchEvent(new CustomEvent(THEME_EVENT_NAME, { detail: newTheme }));
  };

  return { theme, toggleTheme };
}