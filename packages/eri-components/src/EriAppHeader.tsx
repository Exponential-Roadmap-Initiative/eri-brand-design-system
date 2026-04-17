/**
 * EriAppHeader — ERI Brand Design System v2.1.0
 *
 * Canonical 64px header for all ERI applications.
 * Renders once in EriPageLayout — never duplicated across page files.
 *
 * USAGE:
 *   <EriAppHeader
 *     appName="Exponential Taxonomy"
 *     status="BETA"
 *     version="V.2026.04.14"
 *     showCTA={!isAuthenticated}
 *     source="taxonomy"
 *     sourceLabel="Exponential Taxonomy"
 *     returnUrl="https://taxonomy.exponentialroadmap.org"
 *     onMenuClick={() => setMenuOpen(true)}
 *   />
 *
 * RULES (do not override):
 *   - Background: #232323 always
 *   - Height: 64px (h-16) always
 *   - Left zone: ERI logo → pipe divider → app name
 *   - Right zone: status badge → version string → CTA (if showCTA) → hamburger
 *   - showCTA: pass !isAuthenticated — defaults to true (public surface)
 *   - CTA requires source + sourceLabel + returnUrl — all three must be provided
 *   - onMenuClick: provide () => setMenuOpen(true) — defaults to no-op (hamburger always visible)
 *   - Horizontal padding: var(--eri-content-inset) — aligns with hero text block
 *   - No navigation links in the header — use the hamburger drawer
 *
 * COMMON MISTAKES:
 *   - Omitting showCTA: defaults to true (CTA shown). Pass showCTA={false} on authenticated surface.
 *   - Omitting source/sourceLabel/returnUrl with showCTA=true: CTA will be hidden. All three required.
 *   - Omitting onMenuClick: hamburger renders but does nothing. Always wire to your drawer open handler.
 *
 * BDS reference: https://eri-brand-design-system.manus.space/#standard-components
 */

import React from 'react';
import { EriStatusBadge, EriStatusValue } from './EriStatusBadge';
import { EriContactUsButton } from './EriContactUsButton';

// ERI wordmark — CDN hosted, inverted to white via CSS filter on dark background
const ERI_LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/eri-logo-full-color_64e5c7db.webp';

interface EriAppHeaderProps {
  /** App display name shown after the pipe divider */
  appName: string;
  /** Status badge value — omit to hide the badge */
  status?: EriStatusValue;
  /** Version string — e.g. "V.2026.04.15" */
  version: string;
  /**
   * Show the Contact Us CTA.
   * Pass !isAuthenticated — true on public surface, false on authenticated surface.
   * Defaults to true (public surface).
   * NOTE: CTA also requires source + sourceLabel + returnUrl — all three must be provided.
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
}: EriAppHeaderProps) {
  // Dev-mode warning: CTA requested but missing required props
  if (process.env.NODE_ENV !== 'production' && showCTA && (!source || !sourceLabel || !returnUrl)) {
    console.warn(
      '[EriAppHeader] showCTA is true but source, sourceLabel, or returnUrl is missing. ' +
      'The Contact Us button will not render. Provide all three props to show the CTA.'
    );
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center h-16"
      style={{ backgroundColor: '#232323', paddingInline: 'var(--eri-content-inset, clamp(1rem, 3vw, 2rem))' }}
    >
      {/* Left zone: logo + pipe + app name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <a href={logoHref} className="shrink-0" aria-label="Exponential Roadmap Initiative home">
          <img
            src={ERI_LOGO_URL}
            alt="Exponential Roadmap Initiative"
            className="h-8 w-auto"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </a>
        <div className="w-px h-6 bg-white/20 shrink-0" aria-hidden="true" />
        <span className="text-white text-sm font-medium truncate">{appName}</span>
      </div>

      {/* Right zone: badge + version + CTA + hamburger */}
      <div className="flex items-center gap-3 shrink-0">
        {status && <EriStatusBadge status={status} theme="dark" />}
        <span className="text-gray-400 text-xs font-mono hidden sm:block">{version}</span>
        {showCTA && source && sourceLabel && returnUrl && (
          <EriContactUsButton
            source={source}
            sourceLabel={sourceLabel}
            returnUrl={returnUrl}
            subject={contactSubject}
            size="sm"
          />
        )}
        {/* Hamburger — always rendered; wire onMenuClick to your drawer open handler */}
        <button
          onClick={onMenuClick}
          className="flex flex-col gap-1.5 p-2 text-white hover:opacity-70 transition-opacity"
          aria-label="Open menu"
        >
          <span className="block w-5 h-0.5 bg-current" />
          <span className="block w-5 h-0.5 bg-current" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>
    </header>
  );
}

export default EriAppHeader;
