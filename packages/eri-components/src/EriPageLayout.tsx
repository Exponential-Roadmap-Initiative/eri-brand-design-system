/**
 * EriPageLayout — ERI Brand Design System v2.0.0
 *
 * Canonical layout wrapper for all ERI applications.
 * Renders EriAppHeader and EriAppFooter ONCE, wrapping all page content.
 * Use this in App.tsx — never import header or footer directly in page files.
 *
 * USAGE in App.tsx:
 *   import { EriPageLayout } from '@/components/eri/EriPageLayout';
 *
 *   function App() {
 *     const [menuOpen, setMenuOpen] = useState(false);
 *     const isAuthenticated = useAuthState(); // your auth hook
 *
 *     return (
 *       <EriPageLayout
 *         appName="Professional Services Matrix"
 *         status="BETA"
 *         version="V.2026.04.15"
 *         showCTA={!isAuthenticated}
 *         source="psm"
 *         sourceLabel="Professional Services Matrix"
 *         returnUrl="https://psm.exponentialroadmap.org"
 *         footerTagline="Making Pillar 3 climate impact measurable and actionable."
 *         onMenuClick={() => setMenuOpen(true)}
 *       >
 *         <Router /> {/* your page router *\/}
 *       </EriPageLayout>
 *     );
 *   }
 *
 * RULES (do not override):
 *   - This component is the ONLY place EriAppHeader and EriAppFooter are rendered
 *   - Never import EriAppHeader or EriAppFooter directly in page files
 *   - showCTA must be driven by auth state — true when user is NOT authenticated
 *   - The --eri-content-inset CSS variable must be defined in index.css (see below)
 *
 * Required in index.css:
 *   :root {
 *     --eri-content-inset: clamp(1rem, 3vw, 2rem);
 *   }
 *
 * BDS reference: https://eri-brand-design-system.manus.space/#layout-wrapper
 */

import React, { useState } from 'react';
import { EriAppHeader } from './EriAppHeader';
import { EriAppFooter } from './EriAppFooter';
import { EriStatusValue } from './EriStatusBadge';

interface EriPageLayoutProps {
  /** App display name shown in header and footer copyright */
  appName: string;
  /** Status badge value — omit to hide the badge */
  status?: EriStatusValue;
  /** Version string — e.g. "V.2026.04.15" */
  version: string;
  /** Show the Contact Us CTA — pass !isAuthenticated from your auth state */
  showCTA?: boolean;
  /** Source ID for the contact service (required if showCTA may be true) */
  source?: string;
  /** Human-readable app name for the contact service */
  sourceLabel?: string;
  /** Return URL for the contact service */
  returnUrl?: string;
  /** Optional subject for the contact service */
  contactSubject?: string;
  /** Optional one-line tagline in the footer */
  footerTagline?: string;
  /** Optional right-aligned attribution in the footer bottom bar */
  footerAttribution?: string;
  /** Callback for hamburger menu open — implement your own drawer/sheet */
  onMenuClick?: () => void;
  /** Logo href — defaults to "/" */
  logoHref?: string;
  /** Page content */
  children: React.ReactNode;
}

export function EriPageLayout({
  appName,
  status,
  version,
  showCTA = false,
  source,
  sourceLabel,
  returnUrl,
  contactSubject,
  footerTagline,
  footerAttribution,
  onMenuClick,
  logoHref = '/',
  children,
}: EriPageLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(true);
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
      />

      {/* Page content — padded top by header height */}
      <main className="flex-1">
        {children}
      </main>

      <EriAppFooter
        appName={appName}
        tagline={footerTagline}
        attribution={footerAttribution}
      />
    </div>
  );
}

export default EriPageLayout;
