// ERI theme: one rule for every ERI app and site (Nicklas, 9 Nov 2026: "Follow the device").
//
// - The reader's choice is Light, Dark or System. With no choice stored, it is System: the page follows the device's light/dark setting.
// - The choice is kept in localStorage `eri-theme-preference` ("light" | "dark" | "system").
// - The theme in use is always written to `eri-theme` ("light" | "dark") and set as the `dark` (or `light`) class on <html>,
//   so apps and older package versions that read `eri-theme` agree with the page.
// - A change is announced in the same tab with the `eri-theme-change` event (the `storage` event reaches other tabs).
// - Every app puts ERI_THEME_SCRIPT inline in its <head>, before any CSS or JS, so the first paint is already in the right theme.
//
// `eri-theme` alone was written automatically by older code (defaults, headers on mount), so it is not read as a choice.

import { useCallback, useEffect, useState } from 'react';

export type EriThemePreference = 'light' | 'dark' | 'system';
export type EriTheme = 'light' | 'dark';

export const ERI_THEME_PREFERENCE_KEY = 'eri-theme-preference';
export const ERI_THEME_KEY = 'eri-theme';
export const ERI_THEME_EVENT = 'eri-theme-change';
export const ERI_THEME_DEFAULT: EriThemePreference = 'system';
const DEVICE_DARK = '(prefers-color-scheme: dark)';

/** A stored value as a choice; anything else (nothing stored, an old value) is the default, System. */
export function parseThemePreference(value: string | null | undefined): EriThemePreference {
  return value === 'light' || value === 'dark' || value === 'system' ? value : ERI_THEME_DEFAULT;
}

/** The theme a choice gives, on a device that is (or is not) set to dark. */
export function themeFor(preference: EriThemePreference, deviceDark: boolean): EriTheme {
  return preference === 'system' ? (deviceDark ? 'dark' : 'light') : preference;
}

/**
 * The inline <head> script. It does what applyEriTheme does, before the first paint. Copy it verbatim
 * into each app's index.html (the BDS site's copy is checked against this string by a test).
 */
export const ERI_THEME_SCRIPT = "(function(){try{var p=localStorage.getItem('eri-theme-preference');if(p!=='light'&&p!=='dark')p='system';var d=p==='dark'||(p==='system'&&!!window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);var c=document.documentElement.classList;c.toggle('dark',d);c.toggle('light',!d);localStorage.setItem('eri-theme',d?'dark':'light');}catch(e){}})();";

function deviceDark(): boolean {
  try { return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(DEVICE_DARK).matches; } catch { return false; }
}

/** The stored choice (System when none is stored or storage is unavailable). */
export function readEriThemePreference(): EriThemePreference {
  try { return parseThemePreference(localStorage.getItem(ERI_THEME_PREFERENCE_KEY)); } catch { return ERI_THEME_DEFAULT; }
}

/** The theme in use now, from the stored choice and the device. */
export function currentEriTheme(): EriTheme {
  return themeFor(readEriThemePreference(), deviceDark());
}

function paint(theme: EriTheme) {
  if (typeof document === 'undefined') return;
  const c = document.documentElement.classList;
  c.toggle('dark', theme === 'dark');
  c.toggle('light', theme === 'light');
  try { localStorage.setItem(ERI_THEME_KEY, theme); } catch { /* storage unavailable: the class is still set */ }
}

/** Store a choice, apply it and tell the page. Returns the theme now in use. */
export function setEriThemePreference(preference: EriThemePreference): EriTheme {
  try { localStorage.setItem(ERI_THEME_PREFERENCE_KEY, preference); } catch { /* storage unavailable: applies for this page only */ }
  const theme = themeFor(preference, deviceDark());
  paint(theme);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(ERI_THEME_EVENT, { detail: { preference, theme } }));
  return theme;
}

/**
 * The reader's choice and the theme in use, kept current: a choice made anywhere in this tab, in another tab,
 * or (with System) a change of the device's setting. Use it for any theme switch or theme-aware part.
 */
export function useEriTheme(): { preference: EriThemePreference; theme: EriTheme; setPreference: (preference: EriThemePreference) => void } {
  const [preference, setPreferenceState] = useState<EriThemePreference>(() => readEriThemePreference());
  const [theme, setTheme] = useState<EriTheme>(() => currentEriTheme());

  useEffect(() => {
    const sync = () => { const p = readEriThemePreference(); const t = themeFor(p, deviceDark()); setPreferenceState(p); setTheme(t); paint(t); };
    sync();
    const onStorage = (e: StorageEvent) => { if (e.key === ERI_THEME_PREFERENCE_KEY || e.key === null) sync(); };
    window.addEventListener(ERI_THEME_EVENT, sync);
    window.addEventListener('storage', onStorage);
    const media = window.matchMedia ? window.matchMedia(DEVICE_DARK) : null;
    media?.addEventListener?.('change', sync);
    return () => {
      window.removeEventListener(ERI_THEME_EVENT, sync);
      window.removeEventListener('storage', onStorage);
      media?.removeEventListener?.('change', sync);
    };
  }, []);

  const setPreference = useCallback((next: EriThemePreference) => { setEriThemePreference(next); }, []);
  return { preference, theme, setPreference };
}
