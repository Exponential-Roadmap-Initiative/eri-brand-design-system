/**
 * EriAppHeader — ERI Brand Design System v2.15.3
 *
 * Canonical header for all ERI applications.
 * Renders once in EriPageLayout — never duplicated across page files.
 *
 * USAGE:
 *   <EriAppHeader
 *     appName="Exponential Taxonomy"
 *     status="BETA"
 *     version="V.2026.04.17"
 *     showCTA={true}
 *     source="taxonomy"
 *     sourceLabel="Exponential Taxonomy"
 *     returnUrl="https://taxonomy.exponentialroadmap.org"
 *     onMenuClick={() => setMenuOpen(true)}
 *   />
 *
 *   // With dark/light mode toggle and auto header theming (opt-in):
 *   <EriAppHeader
 *     appName="Exponential Taxonomy"
 *     showThemeToggle={true}
 *     headerTheme="auto"
 *     ...
 *   />
 *
 * RULES (do not override):
 *   - Background: #232323 always in dark mode; #FFFFFF in light mode when headerTheme="auto"
 *   - Desktop height: 64px (h-16) always — single row
 *   - Mobile height: ~80px — two rows (logo+controls row 1, app name row 2)
 *   - Left zone: ERI logo → pipe divider → app name
 *   - Right zone: status badge → version string → theme toggle (if showThemeToggle) → CTA (if showCTA) → hamburger
 *   - showCTA: always pass true — the Contact Us CTA is visible on ALL surfaces (public and authenticated).
 *     Only pass showCTA={false} if the specific app explicitly has no Contact Us entry point
 *     (e.g. a purely internal admin tool). Do NOT use showCTA={!isAuthenticated}.
 *   - CTA requires source + sourceLabel + returnUrl — all three must be provided
 *   - onMenuClick: provide () => setMenuOpen(true) — defaults to no-op (hamburger always visible)
 *   - Horizontal padding: var(--eri-content-inset) — aligns with hero text block
 *   - No navigation links in the header — use the hamburger drawer
 *
 * THEME TOGGLE (showThemeToggle):
 *   - Dark mode is the ERI default — it saves display energy on OLED screens
 *   - Set showThemeToggle={true} to let users opt in to light mode
 *   - The toggle is self-contained: reads/writes localStorage key "eri-theme"
 *   - The consuming app must apply the "dark" class to <html> on load to prevent
 *     flash of light content (FOLC). Add this to your index.html <head>:
 *
 *     <script>
 *       (function() {
 *         var t = localStorage.getItem('eri-theme');
 *         if (!t || t === 'dark') document.documentElement.classList.add('dark');
 *       })();
 *     </script>
 *
 *   - The toggle applies/removes the "dark" class on <html> and persists to localStorage.
 *   - Tailwind dark: variants in the consuming app will respond automatically.
 *
 * HEADER THEMING (headerTheme):
 *   - 'dark' (default): header is always #232323 — the ERI standard. White logo, white text.
 *   - 'auto': header responds to the active theme.
 *       Dark mode → #232323 background, white logo (eri-logo-dark-mode.svg), white text
 *       Light mode → #FFFFFF background, full-colour logo (eri-logo-full-color.svg), #1A1A1A text
 *     Use 'auto' when showThemeToggle={true} so the header visually matches the content area.
 *     Requires showThemeToggle={true} — otherwise the user cannot switch to light mode.
 *
 * MOBILE LAYOUT NOTE:
 *   The header uses a single <header> element with CSS media queries (via an inline <style>
 *   tag rendered in JSX, NOT via useEffect) rather than Tailwind responsive classes.
 *   This is intentional: @eri/components is a pre-compiled library — consuming projects'
 *   Tailwind compilers never scan its source, so sm:hidden / sm:flex classes would not be
 *   generated and both blocks would render simultaneously. All responsive behaviour is
 *   therefore handled via a scoped <style> block present on first render.
 *
 *   The Contact Us button is structurally absent from the mobile layout (not just CSS-hidden)
 *   to prevent any risk of it bleeding through if the scoped CSS fails to apply.
 *
 * COMMON MISTAKES:
 *   - Passing showCTA={!isAuthenticated}: incorrect — CTA should be visible on authenticated surfaces too.
 *   - Omitting source/sourceLabel/returnUrl with showCTA=true: CTA will be hidden. All three required.
 *   - Omitting onMenuClick: hamburger renders but does nothing. Always wire to your drawer open handler.
 *   - Using headerTheme="auto" without showThemeToggle={true}: the header will be stuck in dark mode
 *     because the user has no way to switch themes.
 *
 * BDS reference: https://eri-brand-design-system.manus.space/#standard-components
 */

import React, { useState, useEffect, useCallback } from 'react';
import { EriStatusBadge, EriStatusValue } from './EriStatusBadge';
import { EriContactUsButton } from './EriContactUsButton';

const CDN = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ';

// ERI wordmark — dark-mode SVG variant (white text + green X). Used on dark (#232323) backgrounds.
const ERI_LOGO_DARK = `${CDN}/eri-logo-dark-mode.svg`;

// ERI wordmark — full-colour SVG variant (dark text + green X). Used on light (#FFFFFF) backgrounds.
const ERI_LOGO_LIGHT = `${CDN}/eri-logo-full-color.svg`;

const STORAGE_KEY = 'eri-theme';

/** Read the current theme from localStorage, defaulting to 'dark' */
function readStoredTheme(): 'dark' | 'light' {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

/** Apply the theme class to <html>, persist to localStorage, and notify same-tab listeners */
function applyTheme(theme: 'dark' | 'light') {
  try {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem(STORAGE_KEY, theme);
    // Dispatch a CustomEvent so same-tab listeners (e.g. ThemeContext) can sync.
    // The native `storage` event only fires in OTHER tabs — not the originating tab.
    window.dispatchEvent(new CustomEvent('eri-theme-change', { detail: { theme } }));
  } catch {
    // localStorage unavailable — apply class only
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

interface EriAppHeaderProps {
  /** App display name shown after the pipe divider */
  appName: string;
  /** Status badge value — omit to hide the badge */
  status?: EriStatusValue;
  /** Version string — e.g. "V.2026.04.15" */
  version: string;
  /**
   * Show the Contact Us CTA.
   * Always pass true — the CTA is visible on ALL surfaces (public and authenticated).
   * Only pass false if the app has no Contact Us entry point (e.g. a purely internal admin tool).
   * Do NOT use !isAuthenticated. Defaults to true.
   * All three source props (source, sourceLabel, returnUrl) must be provided.
   */
  showCTA?: boolean;
  /** Source ID for the contact service — required if showCTA is true (e.g. "taxonomy") */
  source?: string;
  /** Human-readable app name for the contact service — required if showCTA is true */
  sourceLabel?: string;
  /** Return URL for the contact service — required if showCTA is true */
  returnUrl?: string;
  /** Optional subject for the contact service */
  contactSubject?: string;
  /**
   * Callback for the hamburger menu button.
   * Provide () => setMenuOpen(true) to open your drawer.
   * Defaults to a no-op — hamburger is always visible regardless.
   */
  onMenuClick?: () => void;
  /** Logo href — defaults to "/" */
  logoHref?: string;
  /**
   * Show the dark/light mode toggle button.
   * Dark mode is the ERI default — it saves display energy on OLED screens.
   * Set to true to let users opt in to light mode.
   * The toggle reads/writes localStorage key "eri-theme" and applies the
   * "dark" class to <html>. Add the FOLC-prevention script to index.html.
   * Defaults to false.
   */
  showThemeToggle?: boolean;
  /**
   * Header background theming mode.
   * - 'dark' (default): header is always #232323 regardless of active theme.
   *   White logo, white text. The ERI standard for all apps.
   * - 'auto': header responds to the active theme.
   *   Dark mode → #232323 background, white logo, white text.
   *   Light mode → #FFFFFF background, full-colour logo, #1A1A1A text.
   *   Use 'auto' together with showThemeToggle={true} so the header matches the content area.
   * Defaults to 'dark'.
   */
  headerTheme?: 'dark' | 'auto';
}

export function EriAppHeader({
  appName,
  status,
  version,
  showCTA = true,
  source,
  sourceLabel,
  returnUrl,
  contactSubject,
  onMenuClick = () => {},
  logoHref = '/',
  showThemeToggle = false,
  headerTheme = 'dark',
}: EriAppHeaderProps) {
  // Dev-mode warning: CTA requested but missing required props
  if (process.env.NODE_ENV !== 'production' && showCTA && (!source || !sourceLabel || !returnUrl)) {
    console.warn(
      '[EriAppHeader] showCTA is true but source, sourceLabel, or returnUrl is missing. ' +
      'The Contact Us button will not render. Provide all three props to show the CTA.'
    );
  }

  // Dev-mode warning: headerTheme="auto" without showThemeToggle
  if (process.env.NODE_ENV !== 'production' && headerTheme === 'auto' && !showThemeToggle) {
    console.warn(
      '[EriAppHeader] headerTheme="auto" is set but showThemeToggle={false}. ' +
      'The user cannot switch themes, so the header will always appear in dark mode. ' +
      'Pass showThemeToggle={true} to enable the toggle.'
    );
  }

  // Theme toggle state — initialised from localStorage, defaults to dark
  const [theme, setTheme] = useState<'dark' | 'light'>(() => readStoredTheme());

  // Sync to DOM on mount (in case the FOLC script wasn't present)
  useEffect(() => {
    applyTheme(theme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  }, [theme]);

  const isDark = theme === 'dark';

  // Resolve header appearance based on headerTheme prop and active theme
  const isHeaderDark = headerTheme === 'dark' || isDark;
  const headerBg = isHeaderDark ? '#232323' : '#FFFFFF';
  const logoSrc = isHeaderDark ? ERI_LOGO_DARK : ERI_LOGO_LIGHT;
  const appNameColor = isHeaderDark ? '#FFFFFF' : '#1A1A1A';
  const pipeDividerColor = isHeaderDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
  const versionColor = isHeaderDark ? '#9ca3af' : '#6b7280';
  const hamburgerColor = isHeaderDark ? '#FFFFFF' : '#1A1A1A';
  // Theme toggle icon colours
  const toggleIconColor = isHeaderDark ? '#9ca3af' : '#6b7280';
  const toggleHoverColor = isHeaderDark ? '#ffffff' : '#1A1A1A';
  const toggleHoverBg = isHeaderDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  // Bottom border in light mode to separate header from content
  const headerBorderBottom = isHeaderDark ? 'none' : '1px solid rgba(0,0,0,0.08)';

  // Unique scope ID for scoped styles
  const scopeId = 'eri-app-header';

  const ThemeToggleIcon = () => isDark ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );

  const HamburgerButton = ({ extraStyle = {} }: { extraStyle?: React.CSSProperties }) => (
    <button
      onClick={onMenuClick}
      style={{
        display: 'flex', flexDirection: 'column', gap: '5px',
        padding: '8px', background: 'transparent', border: 'none',
        cursor: 'pointer', color: hamburgerColor, ...extraStyle,
      }}
      aria-label="Open menu"
    >
      <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: 'currentColor' }} />
      <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: 'currentColor' }} />
      <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: 'currentColor' }} />
    </button>
  );

  // Determine whether to show the CTA (all required props present)
  const showCtaButton = showCTA && !!source && !!sourceLabel && !!returnUrl;

  return (
    <>
      {/*
        Scoped responsive styles — rendered inline in JSX (NOT via useEffect) so they are
        present on first render and suppress eri-header-desktop / eri-header-mobile correctly
        before the browser paints. This prevents any flash of the wrong layout.

        We use a <style> block rather than Tailwind responsive classes because @eri/components
        is a pre-compiled library — consuming projects' Tailwind compilers never scan this
        source, so sm:hidden / sm:flex classes would not be generated.
      */}
      <style>{`
        #${scopeId} .eri-header-desktop { display: none; }
        #${scopeId} .eri-header-mobile  { display: flex;  }
        @media (min-width: 640px) {
          #${scopeId} .eri-header-desktop { display: flex;  }
          #${scopeId} .eri-header-mobile  { display: none; }
        }
      `}</style>

      <header
        id={scopeId}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          backgroundColor: headerBg,
          borderBottom: headerBorderBottom,
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
          paddingInline: 'var(--eri-content-inset, clamp(1rem, 3vw, 2rem))',
        }}
      >
        {/* ── Desktop (≥ 640px): single row, 64px tall ── */}
        <div
          className="eri-header-desktop"
          style={{ alignItems: 'center', height: '64px' }}
        >
          {/* Left zone */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <a href={logoHref} style={{ flexShrink: 0 }} aria-label="Exponential Roadmap Initiative home">
              <img
                src={logoSrc}
                alt="Exponential Roadmap Initiative"
                style={{ height: '32px', width: 'auto', transition: 'opacity 0.2s ease' }}
              />
            </a>
            <div
              style={{
                width: '1px', height: '24px', flexShrink: 0,
                backgroundColor: pipeDividerColor,
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontSize: '14px', fontWeight: 500,
                color: appNameColor, transition: 'color 0.2s ease',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
            >
              {appName}
            </span>
          </div>
          {/* Right zone — desktop only: badge, version, theme toggle, CTA, hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {status && (
              <EriStatusBadge status={status} theme={isHeaderDark ? 'dark' : 'light'} />
            )}
            <span
              style={{
                fontSize: '12px', fontFamily: 'monospace',
                color: versionColor, transition: 'color 0.2s ease',
              }}
            >
              {version}
            </span>
            {showThemeToggle && (
              <button
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={
                  isDark
                    ? 'Switch to light mode — dark mode saves display energy on OLED screens'
                    : 'Switch to dark mode — saves display energy on OLED screens'
                }
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '32px', height: '32px', borderRadius: '6px',
                  border: 'none', background: 'transparent',
                  color: toggleIconColor, cursor: 'pointer',
                  transition: 'color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = toggleHoverColor;
                  (e.currentTarget as HTMLButtonElement).style.background = toggleHoverBg;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = toggleIconColor;
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                <ThemeToggleIcon />
              </button>
            )}
            {showCtaButton && (
              <EriContactUsButton
                source={source!}
                sourceLabel={sourceLabel!}
                returnUrl={returnUrl!}
                subject={contactSubject}
                size="sm"
              />
            )}
            <HamburgerButton />
          </div>
        </div>

        {/* ── Mobile (< 640px): two-row layout ── */}
        {/*
          IMPORTANT: Contact Us, status badge, and version string are intentionally
          ABSENT from the mobile layout — they are not CSS-hidden, they are structurally
          not rendered. This prevents any risk of them bleeding through if the scoped
          CSS fails to apply (e.g. in SSR, slow hydration, or unusual browser contexts).
          Mobile Row 1: logo | [theme toggle] [hamburger]
          Mobile Row 2: app name
        */}
        <div
          className="eri-header-mobile"
          style={{ flexDirection: 'column' }}
        >
          {/* Row 1: logo + theme toggle + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '48px' }}>
            <a href={logoHref} style={{ flexShrink: 0 }} aria-label="Exponential Roadmap Initiative home">
              <img
                src={logoSrc}
                alt="Exponential Roadmap Initiative"
                style={{ height: '24px', width: 'auto', transition: 'opacity 0.2s ease' }}
              />
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {showThemeToggle && (
                <button
                  onClick={toggleTheme}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '32px', height: '32px', borderRadius: '6px',
                    border: 'none', background: 'transparent',
                    color: toggleIconColor, cursor: 'pointer',
                  }}
                >
                  <ThemeToggleIcon />
                </button>
              )}
              <HamburgerButton />
            </div>
          </div>
          {/* Row 2: app name only */}
          <div
            style={{
              paddingBottom: '8px',
              fontSize: '12px', fontWeight: 500,
              color: appNameColor, opacity: 0.85,
              transition: 'color 0.2s ease',
            }}
          >
            {appName}
          </div>
        </div>
      </header>
    </>
  );
}

export default EriAppHeader;
