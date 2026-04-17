/**
 * EriAppHeader — ERI Brand Design System v2.0.0
 *
 * Canonical 64px header for all ERI applications.
 * Renders once in PageLayout — never duplicated across page files.
 *
 * USAGE:
 *   <EriAppHeader
 *     appName="Professional Services Matrix"
 *     status="BETA"
 *     version="V.2026.04.15"
 *     showCTA={!isAuthenticated}
 *     source="psm"
 *     sourceLabel="Professional Services Matrix"
 *     returnUrl="https://psm.exponentialroadmap.org"
 *     onMenuClick={() => setMenuOpen(true)}
 *   />
 *
 * RULES (do not override):
 *   - Background: #232323 always
 *   - Height: 64px (h-16) always
 *   - Left zone: ERI logo → pipe divider → app name
 *   - Right zone: status badge → version string → CTA (if showCTA) → hamburger
 *   - CTA: shown on public surface (showCTA=true), hidden on authenticated surface (showCTA=false)
 *   - Horizontal padding: var(--eri-content-inset) — aligns with hero text block
 *   - No navigation links in the header — use the hamburger drawer
 *
 * BDS reference: https://eri-brand-design-system.manus.space/#navigation
 */

import React from 'react';
import { EriStatusBadge, EriStatusValue } from './EriStatusBadge';
import { EriContactUsButton } from './EriContactUsButton';

// ERI white wordmark SVG — do not replace with a different logo
const ERI_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" fill="white" aria-label="Exponential Roadmap Initiative">
  <text x="0" y="22" font-family="Arial Black, sans-serif" font-weight="900" font-size="16" letter-spacing="-0.5">EXPONENTIAL</text>
  <text x="0" y="36" font-family="Arial Black, sans-serif" font-weight="900" font-size="16" letter-spacing="-0.5">ROADMAP</text>
  <text x="106" y="36" font-family="Arial, sans-serif" font-weight="400" font-size="7" letter-spacing="0.5">INITIATIVE</text>
</svg>`;

interface EriAppHeaderProps {
  /** App display name shown after the pipe divider */
  appName: string;
  /** Status badge value — omit to hide the badge */
  status?: EriStatusValue;
  /** Version string — e.g. "V.2026.04.15" */
  version: string;
  /** Show the Contact Us CTA — true on public surface, false on authenticated surface */
  showCTA?: boolean;
  /** Source ID for the contact service — required if showCTA is true */
  source?: string;
  /** Human-readable app name for the contact service — required if showCTA is true */
  sourceLabel?: string;
  /** Return URL for the contact service — required if showCTA is true */
  returnUrl?: string;
  /** Optional subject for the contact service */
  contactSubject?: string;
  /** Callback for the hamburger menu button */
  onMenuClick: () => void;
  /** Logo href — defaults to "/" */
  logoHref?: string;
}

export function EriAppHeader({
  appName,
  status,
  version,
  showCTA = false,
  source,
  sourceLabel,
  returnUrl,
  contactSubject,
  onMenuClick,
  logoHref = '/',
}: EriAppHeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center h-16"
      style={{ backgroundColor: '#232323', paddingInline: 'var(--eri-content-inset, clamp(1rem, 3vw, 2rem))' }}
    >
      {/* Left zone: logo + pipe + app name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <a href={logoHref} className="shrink-0" aria-label="Exponential Roadmap Initiative home">
          {/* ERI wordmark — inverted to white on dark background */}
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/eri-logo-full-color_64e5c7db.webp"
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
