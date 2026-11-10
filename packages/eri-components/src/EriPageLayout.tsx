/**
 * EriPageLayout — ERI Brand Design System v2.20.0
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
 *         headerTheme="auto"
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
 *   - Menu panel: pass `menu` (see EriMenu in EriNav.tsx) and EriPageLayout owns the panel — the hamburger opens it from the
 *     right, with your platform links, your app's own sections on narrow screens, and your account slot at the foot. Without
 *     `menu`, EriPageLayout draws no panel and your app owns the drawer as a child, as before.
 *   - App sidebar: `menu.appSections` also draws EriAppSidebar (224px, left, sticky) beside the page on desktop. At 800px and
 *     below it is hidden and the same sections are the first block of the panel.
 *   - clearHeader: adds padding-top: var(--eri-header-height) so the page starts under the fixed header. It defaults to true when
 *     `menu` is given and to false otherwise (existing apps clear the header themselves).
 *   - mainId: sets the id of the <main> element EriPageLayout draws, for a skip link. A page inside the layout draws no <main> of its own.
 *   - The --eri-content-inset CSS variable must be defined in index.css (see below)
 *   - Each page's outermost div must set its own background (e.g. bg-[#F9FAFB]) — the layout wrapper
 *     sets var(--eri-header-bg) (default #232323) on the outer shell; pages must override this for their own content area
 *     (with `menu`, the layout paints the content area with var(--background))
 *   - Without `menu` or clearHeader, EriPageLayout does NOT add padding — pages must clear the fixed header themselves
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
 * HEADER THEMING (headerTheme):
 *   - 'dark' (default): header is always #232323 — the ERI standard.
 *   - 'auto': header responds to active theme. White background + full-colour logo in light mode.
 *     Use together with showThemeToggle={true}.
 *
 * Required in index.css:
 *   :root {
 *     --eri-content-inset: clamp(1rem, 3vw, 2rem);
 *   }
 *
 * BDS reference: https://eri-brand-design-system.manus.space/#standard-components
 */

import React, { useState } from 'react';
import { EriAppHeader } from './EriAppHeader';
import { EriAppFooter, AppLink } from './EriAppFooter';
import { EriStatusValue } from './EriStatusBadge';
import { EriContactUsButton } from './EriContactUsButton';
import { EriNavDrawer } from './EriNavDrawer';
import { EriAppSidebar } from './EriAppSidebar';
import type { EriMenu } from './EriNav';

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
   * Optional single app-specific link shown in the About column of the footer,
   * below "Members and partners" and "Privacy policy".
   * Example: { label: 'Human-AI Lab', href: 'https://human-ai-lab.exponentialroadmap.org' }
   */
  footerAppLink?: AppLink;
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
  /**
   * Header background theming mode.
   * - 'dark' (default): header is always #232323 regardless of active theme.
   * - 'auto': header responds to the active theme — white background in light mode.
   *   Use together with showThemeToggle={true}.
   * Defaults to 'dark'.
   */
  headerTheme?: 'dark' | 'auto';
  /**
   * The menu panel and the app sidebar. When given, EriPageLayout draws EriNavDrawer (opened by the hamburger) and, if
   * `menu.appSections` is set, EriAppSidebar beside the page. See EriMenu.
   */
  menu?: EriMenu;
  /**
   * Start the page under the fixed header (padding-top: var(--eri-header-height)).
   * Defaults to true when `menu` is given, false otherwise.
   */
  clearHeader?: boolean;
  /** id for the <main> element EriPageLayout draws (a skip link's target). */
  mainId?: string;
  /** Page content — without `menu`, include your own drawer here as a sibling to Router */
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
  footerAppLink,
  onMenuClick,
  logoHref = '/',
  showThemeToggle = false,
  headerTheme = 'dark',
  menu,
  clearHeader,
  mainId,
  children,
}: EriPageLayoutProps) {
  // The panel's open state belongs to the layout only when it draws the panel (`menu`); otherwise the app owns it.
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuClick = () => {
    onMenuClick?.();
    if (menu) setMenuOpen(true);
  };
  const clear = clearHeader ?? !!menu;
  const showCtaButton = showCTA && !!source && !!sourceLabel && !!returnUrl;
  const hasSidebar = !!menu?.appSections && menu.appSections.length > 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--eri-header-bg, #232323)' }}>
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
        menuOpen={menu ? menuOpen : undefined}
        logoHref={logoHref}
        showThemeToggle={showThemeToggle}
        headerTheme={headerTheme}
      />

      {/* Page content — each page must add its own top padding to clear the fixed 64px header */}
      <main
        id={mainId}
        className={`flex-1${menu ? ' eri-page-body' : ''}`}
        style={clear ? { paddingTop: 'var(--eri-header-height, 64px)' } : undefined}
      >
        {hasSidebar ? (
          <div className="eri-app-body">
            <EriAppSidebar
              sections={menu!.appSections!}
              label={menu!.sidebarLabel ?? menu!.appTitle ?? 'Application sections'}
              linkComponent={menu!.linkComponent}
            />
            <div className="eri-app-main">{children}</div>
          </div>
        ) : (
          children
        )}
      </main>

      {menu && (
        <EriNavDrawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          menu={menu}
          status={status}
          version={version}
          cta={showCtaButton ? (
            <EriContactUsButton
              source={source!}
              sourceLabel={sourceLabel!}
              returnUrl={returnUrl!}
              subject={contactSubject}
              size="sm"
            />
          ) : undefined}
        />
      )}

      <EriAppFooter
        appName={appName}
        tagline={footerTagline}
        attribution={footerAttribution}
        appLink={footerAppLink}
      />
    </div>
  );
}

export default EriPageLayout;
