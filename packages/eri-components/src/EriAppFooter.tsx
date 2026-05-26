/**
 * EriAppFooter — ERI Brand Design System v2.16.0
 *
 * Four-column footer matching the official ERI website (exponentialroadmap.org):
 *   Column 1 — About:       Members and partners · Privacy policy · optional appLink
 *   Column 2 — Newsletter:  Subscribe now (links to ERI newsletter signup)
 *   Column 3 — Follow us:   LinkedIn · X · YouTube branded icon buttons
 *   Column 4 — Contact us:  hello@exponentialroadmap.org in Accent Lime
 *
 * The ERI logo sits above the four columns, linking to exponentialroadmap.org.
 *
 * USAGE:
 *   // Minimal — app name only
 *   <EriAppFooter appName="Professional Services Matrix" />
 *
 *   // With tagline and an app-specific link in the About column
 *   <EriAppFooter
 *     appName="Professional Services Matrix"
 *     tagline="Making Pillar 3 climate impact measurable and actionable."
 *     appLink={{ label: 'Professional Services Matrix', href: 'https://psm.exponentialroadmap.org' }}
 *   />
 *
 * RULES (do not override):
 *   - Background: #232323 always — never dark green, white, or any other colour
 *   - Border: border-t border-gray-700 at the top
 *   - Logo: ERI dark-mode wordmark SVG (h-7), links to exponentialroadmap.org
 *   - Four columns are fixed — do not add, remove, or reorder them
 *   - Social icons use exact brand colours: LinkedIn #007BB6, X #1D1D1D, YouTube #A82400
 *   - Contact email uses Accent Lime #93E07D — never any other colour
 *   - Horizontal padding: var(--eri-content-inset) — aligns with header logo
 *
 * BDS reference: https://bds.exponentialroadmap.org/#standard-components
 */
import React from 'react';

export interface AppLink {
  /** Display label for the app-specific link in the About column */
  label: string;
  /** Absolute URL */
  href: string;
}

/** @deprecated Use appLink instead. Kept for backward-compat type export only. */
export interface FooterLink {
  label: string;
  href: string;
}

interface EriAppFooterProps {
  /** App name used in the copyright string */
  appName: string;
  /** Optional one-line tagline shown below the logo (max 80 chars) */
  tagline?: string;
  /** Optional right-aligned attribution string (e.g. data sources, playbook version) */
  attribution?: string;
  /**
   * Optional single app-specific link shown in the About column, below
   * "Members and partners" and "Privacy policy". Use this to link to the
   * app's own homepage or a key page within the ERI ecosystem.
   * Example: { label: 'Human-AI Lab', href: 'https://human-ai-lab.exponentialroadmap.org' }
   */
  appLink?: AppLink;
  /**
   * @deprecated Use appLink instead. footerLinks is ignored in v2.16.0+.
   * The four-column layout is now fixed per the official ERI website.
   */
  footerLinks?: FooterLink[];
}

// ── Social icon SVGs ─────────────────────────────────────────────────────────

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// ── Column heading with horizontal rule ──────────────────────────────────────

const ColumnHeading = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: '1rem' }}>
    <h3 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', fontFamily: 'inherit' }}>
      {children}
    </h3>
    <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)', margin: 0 }} />
  </div>
);

// ── Footer link ──────────────────────────────────────────────────────────────

const FooterTextLink = ({ href, children, accent }: { href: string; children: React.ReactNode; accent?: boolean }) => (
  <a
    href={href}
    target={href.startsWith('mailto:') ? undefined : '_blank'}
    rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
    style={{
      display: 'block',
      fontSize: '0.875rem',
      color: accent ? '#93E07D' : 'rgba(255,255,255,0.65)',
      textDecoration: 'none',
      marginBottom: '0.5rem',
      transition: 'color 0.15s',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = accent ? '#b8f0a0' : '#ffffff'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = accent ? '#93E07D' : 'rgba(255,255,255,0.65)'; }}
  >
    {children}
  </a>
);

// ── Social icon button ───────────────────────────────────────────────────────

const SocialButton = ({ href, label, bgColor, children }: { href: string; label: string; bgColor: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '6px',
      backgroundColor: bgColor,
      textDecoration: 'none',
      flexShrink: 0,
      transition: 'opacity 0.15s',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
  >
    {children}
  </a>
);

// ── Main component ───────────────────────────────────────────────────────────

export function EriAppFooter({ appName, tagline, attribution, appLink }: EriAppFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-gray-700"
      style={{
        backgroundColor: '#232323',
        paddingInline: 'var(--eri-content-inset, clamp(1rem, 3vw, 2rem))',
        paddingTop: '2.5rem',
        paddingBottom: '2rem',
      }}
    >
      {/* Logo row */}
      <div style={{ marginBottom: '2rem' }}>
        <a
          href="https://exponentialroadmap.org/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Exponential Roadmap Initiative"
          style={{ display: 'inline-block' }}
        >
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/eri-logo-dark-mode.svg"
            alt="Exponential Roadmap Initiative"
            style={{ height: '28px', width: 'auto' }}
          />
        </a>
        {tagline && (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem', marginTop: '0.5rem', maxWidth: '28rem', margin: '0.5rem 0 0' }}>
            {tagline}
          </p>
        )}
      </div>

      {/* Four-column grid — CSS media query (not Tailwind responsive) per BDS Critical Rule */}
      <style>{`
        .eri-footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem 1.5rem;
        }
        @media (min-width: 640px) {
          .eri-footer-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }
        }
      `}</style>

      <div className="eri-footer-grid" style={{ marginBottom: '2rem' }}>

        {/* Column 1 — About */}
        <div>
          <ColumnHeading>About</ColumnHeading>
          <FooterTextLink href="https://exponentialroadmap.org/members-and-partners/">
            Members and partners
          </FooterTextLink>
          <FooterTextLink href="https://exponentialroadmap.org/privacy-policy/">
            Privacy policy
          </FooterTextLink>
          {appLink && (
            <FooterTextLink href={appLink.href}>
              {appLink.label}
            </FooterTextLink>
          )}
        </div>

        {/* Column 2 — Newsletter */}
        <div>
          <ColumnHeading>Newsletter</ColumnHeading>
          <FooterTextLink href="https://exponentialroadmap.org/#subscribenewsletter">
            Subscribe now
          </FooterTextLink>
        </div>

        {/* Column 3 — Follow us */}
        <div>
          <ColumnHeading>Follow us</ColumnHeading>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <SocialButton
              href="https://www.linkedin.com/company/exponentialroadmapinitiative/"
              label="Follow on LinkedIn"
              bgColor="#007BB6"
            >
              <LinkedInIcon />
            </SocialButton>
            <SocialButton
              href="https://x.com/ExpRoadmap"
              label="Follow on X"
              bgColor="#1D1D1D"
            >
              <XIcon />
            </SocialButton>
            <SocialButton
              href="https://www.youtube.com/@ExponentialRoadmapInitiative"
              label="Follow on YouTube"
              bgColor="#A82400"
            >
              <YouTubeIcon />
            </SocialButton>
          </div>
        </div>

        {/* Column 4 — Contact us */}
        <div>
          <ColumnHeading>Contact us</ColumnHeading>
          <FooterTextLink href="mailto:hello@exponentialroadmap.org" accent>
            hello@exponentialroadmap.org
          </FooterTextLink>
        </div>

      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
          © {year} Exponential Roadmap Initiative. {appName}.
        </p>
        {attribution && (
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            {attribution}
          </p>
        )}
      </div>
    </footer>
  );
}

export default EriAppFooter;
