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
 *
 * Cross-component sync: listens for `storage` events so that external theme
 * writers (e.g. EriAppHeader's self-contained toggle) keep this context in sync.
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

  // Apply theme class to <html> and persist to localStorage
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

  // Sync with external theme changes — e.g. EriAppHeader's self-contained toggle.
  // Two listeners are needed:
  //   1. `storage` event — fires when ANOTHER tab writes to localStorage.
  //   2. `eri-theme-change` CustomEvent — dispatched by EriAppHeader.applyTheme()
  //      in the SAME tab (the native `storage` event does NOT fire in the originating tab).
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = e.newValue;
      if (next === "light" || next === "dark") {
        setTheme(next);
      }
    };
    const handleCustomChange = (e: Event) => {
      const detail = (e as CustomEvent<{ theme: string }>).detail;
      if (detail?.theme === "light" || detail?.theme === "dark") {
        setTheme(detail.theme as Theme);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("eri-theme-change", handleCustomChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("eri-theme-change", handleCustomChange);
    };
  }, []);

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
