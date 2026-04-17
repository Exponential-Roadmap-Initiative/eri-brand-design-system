/**
 * EriAppFooter — ERI Brand Design System v2.1.0
 *
 * Canonical two-zone footer for all ERI applications.
 * Renders once in EriPageLayout — never duplicated across page files.
 *
 * USAGE:
 *   <EriAppFooter
 *     appName="Professional Services Matrix"
 *     tagline="Making Pillar 3 climate impact measurable and actionable."
 *   />
 *
 * RULES (do not override):
 *   - Background: #232323 always — never dark green, white, or any other colour
 *   - Border: border-t border-gray-700 at the top
 *   - Left zone: ERI logo (h-7, links to exponentialroadmap.org) + optional tagline below
 *   - Right zone: confirmed links only — ERI homepage + Contact Us
 *   - Horizontal padding: var(--eri-content-inset) — aligns with header logo
 *   - Only show links with confirmed URLs — no placeholder link columns
 *
 * BDS reference: https://eri-brand-design-system.manus.space/#standard-components
 */

import React from 'react';

interface EriAppFooterProps {
  /** App name used in the copyright string and Contact Us source param */
  appName: string;
  /** Optional one-line tagline shown below the logo (max 80 chars) */
  tagline?: string;
  /** Optional right-aligned attribution string (e.g. data sources, playbook version) */
  attribution?: string;
}

export function EriAppFooter({ appName, tagline, attribution }: EriAppFooterProps) {
  const year = new Date().getFullYear();

  // Build the Contact Us URL with source tracking params
  const appSlug = appName.toLowerCase().replace(/\s+/g, '-');
  const contactUrl = `https://contact-us.exponentialroadmap.org?source=footer&app=${encodeURIComponent(appSlug)}`;

  return (
    <footer
      className="border-t border-gray-700 py-8"
      style={{ backgroundColor: '#232323', paddingInline: 'var(--eri-content-inset, clamp(1rem, 3vw, 2rem))' }}
    >
      {/* Main body: logo + tagline on left, confirmed links on right */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <a
            href="https://exponentialroadmap.org/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Exponential Roadmap Initiative"
          >
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/eri-logo-full-color_64e5c7db.webp"
              alt="Exponential Roadmap Initiative"
              className="h-7 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </a>
          {tagline && (
            <p className="text-sm text-gray-400 max-w-xs">{tagline}</p>
          )}
        </div>

        {/* Right zone: confirmed links only */}
        <nav aria-label="Footer navigation" className="flex flex-col gap-2 sm:items-end">
          <a
            href="https://exponentialroadmap.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Exponential Roadmap Initiative
          </a>
          <a
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Contact Us
          </a>
        </nav>
      </div>

      {/* Bottom bar: copyright + optional attribution */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 border-t border-gray-800">
        <p className="text-sm text-gray-500">
          © {year} Exponential Roadmap Initiative. {appName}.
        </p>
        {attribution && (
          <p className="text-sm text-gray-500">{attribution}</p>
        )}
      </div>
    </footer>
  );
}

export default EriAppFooter;
