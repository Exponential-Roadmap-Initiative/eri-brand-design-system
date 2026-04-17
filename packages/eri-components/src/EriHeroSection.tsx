/**
 * EriHeroSection — ERI Brand Design System v2.0.0
 *
 * Canonical full-viewport hero section for all ERI applications.
 *
 * USAGE:
 *   <EriHeroSection
 *     eyebrow="Professional Services Matrix"
 *     status="BETA"
 *     titleLine1="Professional"
 *     titleLine2="Services Matrix"
 *     accentWord="Matrix"
 *     body="Making Pillar 3 climate impact measurable and actionable."
 *     primaryCTA={{ label: "Try the Client Assessment", href: "/assessment" }}
 *     secondaryCTA={{ label: "PSM Journey Demo", href: "/demo" }}
 *     backgroundImage="https://cdn.example.com/hero-bg.webp"
 *   />
 *
 * RULES (do not override):
 *   - Height: 100vh (full viewport) — the hero fills the screen
 *   - Vertical alignment: flex items-center — text block is always vertically centred
 *   - Left edge: var(--eri-content-inset) — aligned with the header logotype
 *   - Text block width: max-w-xl — never full-width
 *   - Eyebrow: uppercase, Accent Lime (#93E07D), tracking-widest, with status badge if provided
 *   - H1: white, with one optional accent word in Accent Lime (#93E07D)
 *   - Primary CTA: Accent Lime fill (#93E07D), #1a1a1a text, rounded-lg — NEVER rounded-full
 *   - Secondary CTA: transparent background, white border, white text, rounded-lg
 *   - No icon prefix or suffix on any CTA button
 *
 * BDS reference: https://eri-brand-design-system.manus.space/#navigation
 */

import React from 'react';
import { EriStatusBadge, EriStatusValue } from './EriStatusBadge';

interface CtaButton {
  label: string;
  href: string;
}

interface EriHeroSectionProps {
  /** Eyebrow label — displayed in uppercase Accent Lime above the H1 */
  eyebrow: string;
  /** Optional status badge shown after the eyebrow dash */
  status?: EriStatusValue;
  /** First line of the H1 heading */
  titleLine1: string;
  /** Second line of the H1 heading */
  titleLine2?: string;
  /** A single word from titleLine1 or titleLine2 to highlight in Accent Lime */
  accentWord?: string;
  /** Body paragraph text */
  body: string;
  /** Primary CTA — Accent Lime button */
  primaryCTA: CtaButton;
  /** Optional secondary CTA — outline button */
  secondaryCTA?: CtaButton;
  /** CDN URL for the hero background image */
  backgroundImage: string;
  /** Optional additional content below the CTA buttons */
  children?: React.ReactNode;
}

function highlightAccentWord(text: string, accentWord?: string): React.ReactNode {
  if (!accentWord) return text;
  const parts = text.split(accentWord);
  if (parts.length < 2) return text;
  return (
    <>
      {parts[0]}
      <span style={{ color: '#93E07D' }}>{accentWord}</span>
      {parts[1]}
    </>
  );
}

export function EriHeroSection({
  eyebrow,
  status,
  titleLine1,
  titleLine2,
  accentWord,
  body,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  children,
}: EriHeroSectionProps) {
  return (
    <section
      className="relative flex items-center min-h-screen w-full overflow-hidden"
      style={{ paddingTop: '64px' /* header height */ }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />
      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Text block — left-aligned, vertically centred, anchored to --eri-content-inset */}
      <div
        className="relative z-10 max-w-xl"
        style={{ paddingInline: 'var(--eri-content-inset, clamp(1rem, 3vw, 2rem))' }}
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: '#93E07D' }}
          >
            {eyebrow}
          </span>
          {status && (
            <>
              <span className="w-8 h-px bg-gray-500" aria-hidden="true" />
              <EriStatusBadge status={status} theme="dark" />
            </>
          )}
        </div>

        {/* H1 */}
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white mb-6">
          <span className="block">{highlightAccentWord(titleLine1, accentWord)}</span>
          {titleLine2 && (
            <span className="block">{highlightAccentWord(titleLine2, accentWord)}</span>
          )}
        </h1>

        {/* Body */}
        <p className="text-base md:text-lg text-gray-200 mb-8 leading-relaxed">{body}</p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3">
          <a
            href={primaryCTA.href}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#93E07D', color: '#1a1a1a' }}
          >
            {primaryCTA.label}
          </a>
          {secondaryCTA && (
            <a
              href={secondaryCTA.href}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold border border-white text-white bg-transparent transition-colors hover:bg-white/10"
            >
              {secondaryCTA.label}
            </a>
          )}
        </div>

        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

export default EriHeroSection;
