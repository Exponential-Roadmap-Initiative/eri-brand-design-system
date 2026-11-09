/**
 * ERI Brand Design System — ThemeContext
 *
 * The one ERI theme rule (Nicklas, 9 Nov 2026: "Follow the device"):
 * - With no choice stored, the page follows the device's light/dark setting (System).
 * - The reader can choose Light, Dark or System; the choice is kept in localStorage "eri-theme-preference"
 *   and shared by every ERI app on the same browser.
 * - The theme in use is written to "eri-theme" and set as the "dark" class on <html>.
 *
 * The rule itself lives in @eri/components (eriTheme.ts): this context only hands it to the site's components.
 * The inline script in index.html (ERI_THEME_SCRIPT) applies it before the first paint, so there is no flash.
 * Choices made in EriAppHeader's switch, in another tab, or (with System) on the device reach this context too.
 */

import React, { createContext, useContext } from "react";
import { useEriTheme, type EriTheme, type EriThemePreference } from "@eri/components";

export type Theme = EriTheme;
export type ThemePreference = EriThemePreference;

interface ThemeContextType {
  /** The theme in use: "light" or "dark". */
  theme: Theme;
  /** The reader's choice: "light", "dark" or "system" (the default). */
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /** Switches to the other of light and dark, as a stored choice. */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, preference, setPreference } = useEriTheme();
  const toggleTheme = () => setPreference(theme === "dark" ? "light" : "dark");
  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference, toggleTheme }}>
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
