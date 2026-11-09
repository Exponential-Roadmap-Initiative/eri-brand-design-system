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
 *   // With the Light / Dark / System switch and a header that follows the theme:
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
 *   - Right zone: status badge → version string → Light / Dark / System switch (if showThemeToggle) → CTA (if showCTA) → hamburger
 *   - showCTA: always pass true — the Contact Us CTA is visible on ALL surfaces (public and authenticated).
 *     Only pass showCTA={false} if the specific app explicitly has no Contact Us entry point
 *     (e.g. a purely internal admin tool). Do NOT use showCTA={!isAuthenticated}.
 *   - CTA requires source + sourceLabel + returnUrl — all three must be provided
 *   - onMenuClick: provide () => setMenuOpen(true) — defaults to no-op (hamburger always visible)
 *   - Horizontal padding: var(--eri-content-inset) — aligns with hero text block
 *   - No navigation links in the header — use the hamburger drawer
 *
 * THEME (showThemeToggle), the one ERI rule (Nicklas, 9 Nov 2026: "Follow the device"):
 *   - With no choice stored, the page follows the device's light/dark setting (System).
 *   - showThemeToggle={true} shows a Light / Dark / System switch (a radio group, "Appearance").
 *   - The choice is kept in localStorage "eri-theme-preference" (light | dark | system), the theme in use in
 *     "eri-theme" (light | dark) and as the "dark" class on <html>; tabs stay in step.
 *   - Every app puts ERI_THEME_SCRIPT (exported from @eri/components) inline in index.html's <head>,
 *     before any CSS or JS, so the first paint is already in the right theme:
 *
 *     <script>/* the exact text of ERI_THEME_SCRIPT *\/</script>
 *
 *   - An app with its own switch uses useEriTheme() or setEriThemePreference(); it never writes "eri-theme" itself.
 *   - Tailwind dark: variants in the consuming app respond automatically.
 *
 * HEADER THEMING (headerTheme):
 *   - 'dark' (default): header is always #232323 — the ERI standard. White logo, white text.
 *   - 'auto': header responds to the active theme.
 *       Dark mode → #232323 background, white logo (eri-logo-dark-mode.svg), white text
 *       Light mode → #FFFFFF background, full-colour logo (eri-logo-full-color.svg), #1A1A1A text
 *     Use 'auto' when showThemeToggle={true} so the header visually matches the content area.
 *     The header then follows the page theme, which follows the device unless the reader chooses.
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
 *   - Omitting ERI_THEME_SCRIPT from index.html: the first paint is light, then the page jumps to dark on a dark device.
 *
 * BDS reference: https://eri-brand-design-system.manus.space/#standard-components
 */

import React from 'react';
import { EriStatusBadge, EriStatusValue } from './EriStatusBadge';
import { EriContactUsButton } from './EriContactUsButton';
import { ERI_LOGO_DARK_SRC, ERI_LOGO_LIGHT_SRC } from './eriLogoAssets';
import { useEriTheme, type EriThemePreference } from './eriTheme';

const THEME_CHOICES: { value: EriThemePreference; label: string; title: string }[] = [
  { value: 'light', label: 'Light', title: 'Light' },
  { value: 'dark', label: 'Dark', title: 'Dark' },
  { value: 'system', label: 'System', title: 'System: follows your device' },
];

function ThemeChoiceIcon({ value }: { value: EriThemePreference }) {
  const common = { xmlns: 'http://www.w3.org/2000/svg', width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  if (value === 'light') return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>;
  if (value === 'dark') return <svg {...common}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>;
  return <svg {...common}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>;
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
   * Show the Light / Dark / System switch in the header.
   * With no choice stored, ERI pages follow the device's light/dark setting (System).
   * The choice is kept in localStorage "eri-theme-preference"; the theme in use is written to "eri-theme"
   * and set as the "dark" class on <html>. Put ERI_THEME_SCRIPT inline in index.html's <head>.
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
      'The header follows the page theme, which follows the device unless the app offers its own switch. ' +
      'Pass showThemeToggle={true} to show the Light / Dark / System switch here.'
    );
  }

  // The page theme: the reader's choice (Light, Dark or System, default System) and the theme in use.
  const { preference, theme, setPreference } = useEriTheme();

  const isDark = theme === 'dark';

  // Resolve header appearance based on headerTheme prop and active theme
  const isHeaderDark = headerTheme === 'dark' || isDark;
  const headerBg = isHeaderDark ? '#232323' : '#FFFFFF';
  const logoSrc = isHeaderDark ? ERI_LOGO_DARK_SRC : ERI_LOGO_LIGHT_SRC;
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

  // Light / Dark / System, as one radio group: arrow keys move the choice, as in any radio group.
  const themeSwitch = () => (
    <div
      role="radiogroup"
      aria-label="Appearance"
      style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '2px', borderRadius: '8px', border: `1px solid ${pipeDividerColor}` }}
      onKeyDown={(e) => {
        const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        const i = THEME_CHOICES.findIndex(c => c.value === preference);
        const next = THEME_CHOICES[(i + step + THEME_CHOICES.length) % THEME_CHOICES.length];
        setPreference(next.value);
        (e.currentTarget.querySelector(`[data-theme-choice="${next.value}"]`) as HTMLButtonElement | null)?.focus();
      }}
    >
      {THEME_CHOICES.map(choice => {
        const on = preference === choice.value;
        return (
          <button
            key={choice.value}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={choice.label}
            title={choice.title}
            tabIndex={on ? 0 : -1}
            data-theme-choice={choice.value}
            onClick={() => setPreference(choice.value)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '28px', height: '28px', borderRadius: '6px', border: 'none',
              background: on ? toggleHoverBg : 'transparent',
              color: on ? toggleHoverColor : toggleIconColor,
              cursor: 'pointer', transition: 'color 0.15s, background 0.15s',
            }}
          >
            <ThemeChoiceIcon value={choice.value} />
          </button>
        );
      })}
    </div>
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
            {showThemeToggle && themeSwitch()}
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
              {showThemeToggle && themeSwitch()}
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
