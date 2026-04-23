/**
 * ERI Brand Design System — ThemeContext
 *
 * Dark mode is the ERI default — a deliberate energy-efficiency statement.
 * OLED displays consume near-zero power for black pixels; defaulting to dark
 * reduces display energy consumption without any user effort required.
 *
 * Storage key: "eri-theme" (localStorage)
 * Default: "dark"
 * OS preference (prefers-color-scheme): intentionally ignored — ERI always
 * defaults to dark regardless of OS setting.
 *
 * Flash of light content (FOLC) prevention: the CSS default (`:root`) is dark,
 * so the page is dark before any JavaScript runs. Switching to light requires
 * an explicit user action.
 */

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "eri-theme";
const DEFAULT_THEME: Theme = "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch {
      // localStorage may be unavailable in some environments
    }
    return DEFAULT_THEME;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage may be unavailable in some environments
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
