/**
 * EriHeroSection — ERI Brand Design System v2.10.4
 *
 * Canonical full-viewport hero section for all ERI public-facing applications.
 * Matches the live pattern on human-ai-lab.exponentialroadmap.org.
 *
 * USAGE:
 *   <EriHeroSection
 *     eyebrow="EXPONENTIAL HUMAN-AI LAB ——— BETA"
 *     titleLine1="Exponential"
 *     titleLine2="Human-AI Lab"
 *     body="One place for everything ERI builds at the intersection of human expertise and AI."
 *     primaryCTA={{ label: "Explore the Application Suite", href: "/suite" }}
 *     secondaryCTA={{ label: "Human-AI Playbook", href: "/playbook" }}
 *     showScrollIndicator
 *   />
 *
 * RULES (do not override):
 *   - Height: min-h-screen — the hero fills the viewport
 *   - Vertical alignment: flex flex-col justify-center — text block is always vertically centred
 *   - Background image: centred (50% 50%), cover — the hands image is designed to be centred
 *   - Overlay: rgba(35,35,35,0.82) — brand dark colour, NOT pure black, NOT 40% opacity
 *   - Left edge: var(--eri-content-inset) — aligned with the header logotype
 *   - Text block width: max-w-xl — right half of viewport is reserved for the image composition
 *   - Text alignment: ALWAYS left — NEVER centred
 *   - Eyebrow: single string, uppercase, Accent Lime (#93E07D), tracking-widest
 *   - titleLine1: displayed in Accent Lime (#93E07D) — the accent line of the H1
 *   - titleLine2: displayed in white — the supporting line of the H1
 *   - Primary CTA: Accent Lime fill (#93E07D), #1a1a1a text, rounded-lg — NEVER rounded-full
 *   - Secondary CTA: transparent background, 2px white border, white text, rounded-lg
 *   - No icon prefix or suffix on any CTA button
 *   - Default backgroundImage: ERI_HERO_IMAGE_HANDS — no need to pass it for standard use
 *   - showScrollIndicator: renders a subtle animated chevron at the bottom-centre of the hero
 *
 * INTEGRATION NOTES (lessons from previous component iterations):
 *   1. Top padding: this component adds paddingTop: 64px internally to clear the fixed header.
 *      Do NOT wrap it in a div with pt-16 — that would double the clearance.
 *   2. Background: this component sets its own background. The consuming page does NOT need to set
 *      a background colour on its wrapper for the hero area.
 *   3. --eri-content-inset: define this in index.css :root. The component falls back to
 *      clamp(1rem, 3vw, 2rem) if the variable is absent, so it works even without it.
 *   4. CSS import: ensure @import "@eri/components/dist/eri-components.css" is at the top of
 *      index.css (required since v2.9.1 to prevent Tailwind 4 from purging component classes).
 *   5. backgroundImage default: the canonical hands image is baked in. Only override for
 *      app-specific hero images (e.g. Crocodile Economics). Never regenerate the hands image.
 *   6. showScrollIndicator: the indicator is absolutely positioned at the bottom-centre of the
 *      section. It uses a self-contained <style> tag for the bounce keyframe — no external CSS
 *      dependency. Safe to use in any consuming project.
 *
 * REQUIRED CSS VARIABLE (add to index.css :root):
 *   --eri-content-inset: clamp(1rem, 3vw, 2rem);
 *
 * BDS reference: https://eri-brand-design-system.manus.space/#standard-components
 */

import React from 'react';

/**
 * Canonical ERI hero background image — Michelangelo-inspired wireframe hands reaching toward
 * each other, fingertips meeting at the S-curve crossing point with a golden burst of light.
 * Use this constant directly rather than hard-coding the URL.
 */
export const ERI_HERO_IMAGE_HANDS =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/hal-hero-human-v2-hands_75d155b6.png';

interface CtaButton {
  label: string;
  href: string;
}

interface EriHeroSectionProps {
  /**
   * Eyebrow label — full string displayed in uppercase Accent Lime above the H1.
   * Recommended format: "APP NAME ——— STATUS"
   * Example: "EXPONENTIAL HUMAN-AI LAB ——— BETA"
   */
  eyebrow: string;

  /**
   * First line of the H1 — displayed in Accent Lime (#93E07D).
   * Typically the brand word(s): e.g. "Exponential"
   */
  titleLine1: string;

  /**
   * Second line of the H1 — displayed in white.
   * e.g. "Human-AI Lab"
   */
  titleLine2?: string;

  /** Body paragraph text — displayed in near-white (rgba(255,255,255,0.85)) */
  body: string;

  /**
   * Primary CTA — Accent Lime filled button (#93E07D background, #1a1a1a text).
   * Required. Shape is always rounded-lg — never rounded-full.
   */
  primaryCTA: CtaButton;

  /**
   * Secondary CTA — white outline button (transparent background, 2px white border).
   * Optional. Use for a secondary navigation action (e.g. "Human-AI Playbook").
   * Shape is always rounded-lg — never rounded-full.
   */
  secondaryCTA?: CtaButton;

  /**
   * CDN URL for the hero background image.
   * Defaults to ERI_HERO_IMAGE_HANDS (the canonical wireframe hands image).
   * Only override for app-specific hero images. Never regenerate the hands image.
   */
  backgroundImage?: string;

  /**
   * Overlay opacity — 0 to 1. Defaults to 0.82.
   * The overlay colour is always #232323 (brand dark). Do not change the colour.
   * Increase toward 1.0 if text legibility is poor against a bright image.
   */
  overlayOpacity?: number;

  /**
   * When true, renders a subtle animated chevron at the bottom-centre of the hero
   * to indicate that more content is available below the fold.
   * The animation is a gentle, repeating vertical bounce.
   * Defaults to false.
   */
  showScrollIndicator?: boolean;

  /**
   * Optional slot rendered below the CTA buttons.
   * Use for stat counters, attribution lines, or other supplementary content.
   * Note: for a scroll indicator, prefer the showScrollIndicator prop instead.
   */
  children?: React.ReactNode;
}

export function EriHeroSection({
  eyebrow,
  titleLine1,
  titleLine2,
  body,
  primaryCTA,
  secondaryCTA,
  backgroundImage = ERI_HERO_IMAGE_HANDS,
  overlayOpacity = 0.82,
  showScrollIndicator = false,
  children,
}: EriHeroSectionProps) {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden w-full"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        backgroundRepeat: 'no-repeat',
        // Clear the fixed 64px header — consuming projects must NOT add pt-16 on top of this
        paddingTop: '64px',
      }}
    >
      {/* Brand dark overlay — #232323 at 82% opacity, NOT pure black */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(35, 35, 35, ${overlayOpacity})` }}
        aria-hidden="true"
      />

      {/*
        Content container — max-w-screen-xl + --eri-content-inset aligns the left edge of the
        text block with the ERI logotype in the header. This is the same alignment anchor used
        by EriAppHeader.
      */}
      <div
        className="relative z-10 w-full max-w-screen-xl mx-auto"
        style={{ paddingInline: 'var(--eri-content-inset, clamp(1rem, 3vw, 2rem))' }}
      >
        {/* Text block — max-w-xl keeps text in the left half; right half open for the image */}
        <div className="max-w-xl text-left">

          {/* Eyebrow — uppercase Accent Lime, tracking-widest */}
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-5"
            style={{ color: '#93E07D' }}
          >
            {eyebrow}
          </p>

          {/* H1 — titleLine1 in Accent Lime, titleLine2 in white */}
          <h1
            className="font-extrabold leading-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)' }}
          >
            <span className="block" style={{ color: '#93E07D' }}>
              {titleLine1}
            </span>
            {titleLine2 && (
              <span className="block text-white">
                {titleLine2}
              </span>
            )}
          </h1>

          {/* Body paragraph */}
          <p
            className="text-base md:text-lg leading-relaxed mb-8"
            style={{ color: 'rgba(255, 255, 255, 0.85)' }}
          >
            {body}
          </p>

          {/* CTA buttons — side by side, flex-wrap for narrow viewports */}
          <div className="flex flex-wrap gap-3">

            {/* Primary — Accent Lime fill, dark text, rounded-lg */}
            <a
              href={primaryCTA.href}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#93E07D', color: '#1a1a1a' }}
            >
              {primaryCTA.label}
            </a>

            {/* Secondary — transparent, 2px white border, white text, rounded-lg */}
            {secondaryCTA && (
              <a
                href={secondaryCTA.href}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold text-white bg-transparent transition-colors hover:bg-white/10"
                style={{ border: '2px solid rgba(255, 255, 255, 0.9)' }}
              >
                {secondaryCTA.label}
              </a>
            )}
          </div>

          {/* Optional children slot — stat counters, attribution lines, etc. */}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      {showScrollIndicator && (
        <>
          {/*
            Self-contained keyframes — no external CSS dependency.
            Two animations:
              eri-scroll-drift  — the whole indicator drifts 6px down and back, breathing slowly
              eri-scroll-fadein — delays the indicator's appearance by 1.5s so it does not
                                  compete with the hero content on first impression
          */}
          <style>{`
            @keyframes eri-scroll-drift {
              0%, 100% { transform: translateX(-50%) translateY(0);   opacity: 0.3; }
              50%       { transform: translateX(-50%) translateY(6px); opacity: 0.8; }
            }
            @keyframes eri-scroll-fadein {
              0%   { opacity: 0; }
              100% { opacity: 1; }
            }
            .eri-scroll-indicator-wrap {
              animation:
                eri-scroll-fadein 0.8s ease-out 1.5s both,
                eri-scroll-drift  2.5s ease-in-out 2.3s infinite;
            }
          `}</style>
          <div
            className="eri-scroll-indicator-wrap absolute bottom-8 left-1/2 z-10 flex flex-col items-center"
            style={{ transform: 'translateX(-50%)' }}
            aria-hidden="true"
          >
            {/* Vertical line */}
            <div
              style={{
                width: '1px',
                height: '24px',
                background: 'rgba(255,255,255,0.35)',
                marginBottom: '6px',
              }}
            />
            {/* Single open chevron */}
            <svg
              width="20"
              height="12"
              viewBox="0 0 20 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L10 10L19 1"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </>
      )}
    </section>
  );
}

export default EriHeroSection;
