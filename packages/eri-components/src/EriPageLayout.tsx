/**
 * EriPageLayout — ERI Brand Design System v2.12.0
 *
 * Canonical layout wrapper for all ERI applications.
 * Renders EriAppHeader and EriAppFooter ONCE, wrapping all page content.
 * Use this in App.tsx — never import header or footer directly in page files.
 *
 * USAGE in App.tsx:
 *   import { EriPageLayout } from '@eri/components';
 *
 *   function App() {
 *     const [menuOpen, setMenuOpen] = useState(false);
 *
 *     return (
 *       <EriPageLayout
 *         appName="Exponential Taxonomy"
 *         status="BETA"
 *         version="V.2026.04.21"
 *         showCTA={true}
 *         source="taxonomy"
 *         sourceLabel="Exponential Taxonomy"
 *         returnUrl="https://taxonomy.exponentialroadmap.org"
 *         footerTagline="The definitive framework for corporate climate action."
 *         showThemeToggle={true}
 *         onMenuClick={() => setMenuOpen(true)}
 *       >
 *         <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
 *         <Router /> {/* your page router *\/}
 *       </EriPageLayout>
 *     );
 *   }
 *
 * RULES (do not override):
 *   - This component is the ONLY place EriAppHeader and EriAppFooter are rendered
 *   - Never import EriAppHeader or EriAppFooter directly in page files
 *   - showCTA: always pass true — the Contact Us CTA is visible on ALL surfaces (public and authenticated).
 *     Only pass showCTA={false} if the app explicitly has no Contact Us entry point
 *     (e.g. a purely internal admin tool). Do NOT use showCTA={!isAuthenticated}.
 *   - showCTA requires source + sourceLabel + returnUrl — all three must be provided for CTA to render
 *   - onMenuClick defaults to no-op — hamburger is always visible; wire to () => setMenuOpen(true)
 *   - EriPageLayout does NOT render a drawer — your app owns the drawer as a child of EriPageLayout
 *   - The --eri-content-inset CSS variable must be defined in index.css (see below)
 *   - Each page's outermost div must set its own background (e.g. bg-[#F9FAFB]) — the layout wrapper
 *     sets #232323 on the outer shell; pages must override this for their own content area
 *   - EriPageLayout does NOT add pt-16 — pages must clear the fixed 64px header themselves
 *
 * THEME TOGGLE (showThemeToggle):
 *   - Dark mode is the ERI default — it saves display energy on OLED screens
 *   - Set showThemeToggle={true} to let users opt in to light mode
 *   - Add the FOLC-prevention script to index.html <head> to avoid flash of light content:
 *
 *     <script>
 *       (function() {
 *         var t = localStorage.getItem('eri-theme');
 *         if (!t || t === 'dark') document.documentElement.classList.add('dark');
 *       })();
 *     </script>
 *
 * Required in index.css:
 *   :root {
 *     --eri-content-inset: clamp(1rem, 3vw, 2rem);
 *   }
 *
 * BDS reference: https://eri-brand-design-system.manus.space/#standard-components
 */

import React from 'react';
import { EriAppHeader } from './EriAppHeader';
import { EriAppFooter, FooterLink } from './EriAppFooter';
import { EriStatusValue } from './EriStatusBadge';

interface EriPageLayoutProps {
  /** App display name shown in header and footer copyright */
  appName: string;
  /** Status badge value — omit to hide the badge */
  status?: EriStatusValue;
  /** Version string — e.g. "V.2026.04.21" */
  version: string;
  /**
   * Show the Contact Us CTA.
   * Always pass true — the CTA is visible on ALL surfaces (public and authenticated).
   * Only pass false if the app has no Contact Us entry point (e.g. a purely internal admin tool).
   * Do NOT use !isAuthenticated. Defaults to true.
   * Also requires source + sourceLabel + returnUrl — all three must be provided.
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
  /** Optional one-line tagline in the footer */
  footerTagline?: string;
  /** Optional right-aligned attribution in the footer bottom bar */
  footerAttribution?: string;
  /**
   * Links shown in the footer right zone between ERI homepage and Contact Us.
   * Defaults to Trust Centre + Human-AI Lab.
   * Pass an empty array to show no additional links.
   * The Trust Centre should pass footerLinks={[{ label: 'Human-AI Lab', href: 'https://human-ai-lab.exponentialroadmap.org' }]}
   * to avoid a self-referential link in its own footer.
   */
  footerLinks?: FooterLink[];
  /**
   * Callback for hamburger menu open.
   * Defaults to no-op — hamburger is always visible regardless.
   * Wire to () => setMenuOpen(true) and render your own drawer as a child.
   */
  onMenuClick?: () => void;
  /** Logo href — defaults to "/" */
  logoHref?: string;
  /**
   * Show the dark/light mode toggle button in the header.
   * Dark mode is the ERI default — it saves display energy on OLED screens.
   * Set to true to let users opt in to light mode.
   * Add the FOLC-prevention script to index.html <head> (see component JSDoc above).
   * Defaults to false.
   */
  showThemeToggle?: boolean;
  /** Page content — include your drawer component here as a sibling to Router */
  children: React.ReactNode;
}

export function EriPageLayout({
  appName,
  status,
  version,
  showCTA = true,
  source,
  sourceLabel,
  returnUrl,
  contactSubject,
  footerTagline,
  footerAttribution,
  footerLinks,
  onMenuClick,
  logoHref = '/',
  showThemeToggle = false,
  children,
}: EriPageLayoutProps) {
  // Clean delegation — no internal menuOpen state (that belongs to the consuming app)
  const handleMenuClick = () => {
    onMenuClick?.();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#232323' }}>
      <EriAppHeader
        appName={appName}
        status={status}
        version={version}
        showCTA={showCTA}
        source={source}
        sourceLabel={sourceLabel}
        returnUrl={returnUrl}
        contactSubject={contactSubject}
        onMenuClick={handleMenuClick}
        logoHref={logoHref}
        showThemeToggle={showThemeToggle}
      />

      {/* Page content — each page must add its own top padding to clear the fixed 64px header */}
      <main className="flex-1">
        {children}
      </main>

      <EriAppFooter
        appName={appName}
        tagline={footerTagline}
        attribution={footerAttribution}
        footerLinks={footerLinks}
      />
    </div>
  );
}

export default EriPageLayout;
