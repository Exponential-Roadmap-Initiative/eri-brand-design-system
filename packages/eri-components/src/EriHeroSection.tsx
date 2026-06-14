/**
 * EriHeroSection — ERI Brand Design System v2.18.0
 *
 * Canonical full-viewport hero section for all ERI public-facing applications.
 * Matches the live pattern on human-ai-lab.exponentialroadmap.org.
 *
 * TWO VARIANTS — controlled by the `heroVariant` prop:
 *
 * heroVariant="image" (default)
 *   Full-viewport hero with a background image and dark overlay.
 *   Use for: HAL, Trust, Crocodile Economics, and any app with a visual narrative hero.
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
 * heroVariant="content"
 *   Full-viewport hero with a solid #232323 dark background and a two-column layout.
 *   Left column: eyebrow, H1, body, CTAs (same as image variant).
 *   Right column: `contentSlot` — pass any React node (framework matrix, data viz, diagram, etc.).
 *   Use for: Exponential Framework, CPR tool, Taxonomy, and any app where the content IS the visual.
 *   <EriHeroSection
 *     heroVariant="content"
 *     eyebrow="EXPONENTIAL FRAMEWORK ——— PREVIEW"
 *     titleLine1="Exponential"
 *     titleLine2="Framework"
 *     body="The 20 solutions that halve emissions by 2030."
 *     primaryCTA={{ label: "Explore the Framework", href: "/framework" }}
 *     contentSlot={<FrameworkMatrix />}
 *     showScrollIndicator
 *   />
 *
 * RULES (do not override):
 *   - Height: min-h-screen — the hero fills the viewport
 *   - Vertical alignment: flex flex-col justify-center — text block is always vertically centred
 *   - image variant — Background image: centred (50% 50%), cover
 *   - image variant — Overlay: rgba(35,35,35,0.82) — brand dark colour, NOT pure black
 *   - content variant — Background: #232323 solid — no image, no overlay
 *   - content variant — Layout: two columns (text left, contentSlot right) on md+; stacked on mobile
 *   - Left edge: var(--eri-content-inset) — aligned with the header logotype
 *   - image variant — Text block width: max-w-xl — right half reserved for image composition
 *   - content variant — Text column: flex-1, min-w-0; contentSlot column: flex-1, min-w-0
 *   - Text alignment: ALWAYS left — NEVER centred
 *   - Eyebrow: single string, uppercase, Accent Lime (#93E07D), tracking-widest
 *   - titleLine1: displayed in Accent Lime (#93E07D) — the accent line of the H1
 *   - titleLine2: displayed in white — the supporting line of the H1
 *   - Primary CTA: Accent Lime fill (#93E07D), #1a1a1a text, rounded-lg — NEVER rounded-full
 *   - Secondary CTA: transparent background, 2px white border, white text, rounded-lg
 *   - No icon prefix or suffix on any CTA button
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
 *   5. backgroundImage default: the canonical S-curves image is baked in. Only override for
 *      app-specific hero images (e.g. Crocodile Economics). Never regenerate the image.
 *   6. showScrollIndicator: the indicator is absolutely positioned at the bottom-centre of the
 *      section. It uses a self-contained <style> tag for the bounce keyframe — no external CSS
 *      dependency. Safe to use in any consuming project.
 *   7. content variant: backgroundImage and overlayOpacity props are ignored when
 *      heroVariant="content". Pass contentSlot to fill the right column.
 *   8. content variant bds-meta.json: no knownViolations entry needed — this is a sanctioned
 *      BDS variant, not a deviation. Record heroVariant: "content" in your project's bds-meta.json
 *      layout section if you wish to document it.
 *
 * REQUIRED CSS VARIABLE (add to index.css :root):
 *   --eri-content-inset: clamp(1rem, 3vw, 2rem);
 *
 * BDS reference: https://eri-brand-design-system.manus.space/#standard-components
 */

import React from 'react';

/**
 * Canonical ERI hero background image — dual S-curves (green + amber) crossing at the
 * exponential inflection point, on a dark teal grid background with ambient bokeh.
 * No human figures. Use this constant directly rather than hard-coding the URL.
 * @since v2.15.0  Previously pointed to the wireframe hands image.
 */
export const ERI_HERO_IMAGE_HANDS =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/hero-scurve-dual-rich_775e47cf.webp';

/**
 * Alias for ERI_HERO_IMAGE_HANDS — preferred name going forward.
 * Use either constant; they resolve to the same URL.
 */
export const ERI_HERO_IMAGE_DEFAULT = ERI_HERO_IMAGE_HANDS;

/**
 * Trust & Security hero background image — abstract dark texture with interconnected node
 * network, hexagonal grid, and a subtle shield motif in the right half. Designed for
 * trust.exponentialroadmap.org and any ERI application where the hands image is inappropriate
 * (e.g. security, data integrity, compliance, or internal tool contexts).
 * The left half is darker to ensure white text reads clearly.
 * Use this constant directly rather than hard-coding the URL.
 */
export const ERI_HERO_IMAGE_TRUST =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/eri-trust-hero-clean_4d9b9a4a.png';

interface CtaButton {
  label: string;
  href: string;
}

interface EriHeroSectionProps {
  /**
   * Hero layout variant.
   *
   * "image" (default) — full-viewport hero with background image and dark overlay.
   *   Use for: HAL, Trust, Crocodile Economics, and any app with a visual narrative hero.
   *
   * "content" — full-viewport hero with solid #232323 background and two-column layout.
   *   Left column: eyebrow, H1, body, CTAs.
   *   Right column: `contentSlot` — any React node (framework matrix, data viz, diagram).
   *   Use for: Exponential Framework, CPR tool, Taxonomy, and any data-dense landing page
   *   where the content itself is the visual. backgroundImage and overlayOpacity are ignored.
   *
   * @default "image"
   */
  heroVariant?: 'image' | 'content';

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
   * Defaults to ERI_HERO_IMAGE_HANDS (the canonical S-curves image).
   * Only override for app-specific hero images (e.g. Crocodile Economics, Trust).
   * Ignored when heroVariant="content".
   */
  backgroundImage?: string;

  /**
   * Overlay opacity — 0 to 1. Defaults to 0.82.
   * The overlay colour is always #232323 (brand dark). Do not change the colour.
   * Increase toward 1.0 if text legibility is poor against a bright image.
   * Ignored when heroVariant="content".
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
   * Content slot for the right column — heroVariant="content" only.
   * Pass any React node: a framework matrix, data visualisation, diagram, or interactive widget.
   * Rendered in the right half of the two-column layout on md+ screens.
   * On mobile, rendered below the text column.
   * Ignored when heroVariant="image".
   */
  contentSlot?: React.ReactNode;

  /**
   * Optional slot rendered below the CTA buttons (both variants).
   * Use for stat counters, attribution lines, or other supplementary content.
   * Note: for a scroll indicator, prefer the showScrollIndicator prop instead.
   */
  children?: React.ReactNode;
}

export function EriHeroSection({
  heroVariant = 'image',
  eyebrow,
  titleLine1,
  titleLine2,
  body,
  primaryCTA,
  secondaryCTA,
  backgroundImage = ERI_HERO_IMAGE_HANDS,
  overlayOpacity = 0.82,
  showScrollIndicator = false,
  contentSlot,
  children,
}: EriHeroSectionProps) {

  /** Shared text block — identical in both variants */
  const textBlock = (
    <div className="text-left">
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
  );

  /** Shared scroll indicator */
  const scrollIndicator = showScrollIndicator && (
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
  );

  /* ─────────────────────────────────────────────────────────────────────────
   * heroVariant="content"
   * Solid #232323 background, two-column layout (text left, contentSlot right).
   * ───────────────────────────────────────────────────────────────────────── */
  if (heroVariant === 'content') {
    return (
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden w-full"
        style={{
          backgroundColor: '#232323',
          paddingTop: '64px',
        }}
      >
        {/*
          Two-column content container.
          On md+ screens: text left (flex-1), contentSlot right (flex-1).
          On mobile: stacked — text on top, contentSlot below.
        */}
        <div
          className="relative z-10 w-full max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12"
          style={{ paddingInline: 'var(--eri-content-inset, clamp(1rem, 3vw, 2rem))' }}
        >
          {/* Left column — text block */}
          <div className="flex-1 min-w-0">
            {textBlock}
          </div>

          {/* Right column — contentSlot */}
          {contentSlot && (
            <div className="flex-1 min-w-0 w-full">
              {contentSlot}
            </div>
          )}
        </div>

        {scrollIndicator}
      </section>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────────
   * heroVariant="image" (default)
   * Full-viewport background image with dark overlay, text constrained to max-w-xl.
   * ───────────────────────────────────────────────────────────────────────── */
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
        <div className="max-w-xl">
          {textBlock}
        </div>
      </div>

      {scrollIndicator}
    </section>
  );
}

export default EriHeroSection;
