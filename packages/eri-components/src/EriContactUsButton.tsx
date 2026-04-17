/**
 * EriContactUsButton — ERI Brand Design System v2.0.0
 *
 * Canonical Contact Us button for all ERI applications.
 * Links to the shared ERI Contact Us service at contact-us.exponentialroadmap.org.
 *
 * USAGE:
 *   <EriContactUsButton
 *     source="psm"
 *     sourceLabel="Professional Services Matrix"
 *     returnUrl="https://psm.exponentialroadmap.org"
 *   />
 *
 * RULES (do not override):
 *   - Fill: #93E07D (Accent Lime) — NEVER white, gray, or Primary Green
 *   - Text: #1a1a1a (near-black) — NEVER white
 *   - Shape: rounded-lg — NEVER rounded-full or rounded-none
 *   - No icon prefix or suffix — text only
 *   - Label: always "Contact Us" — do not rename
 *
 * BDS reference: https://eri-brand-design-system.manus.space/#contact-us
 */

import React from 'react';

interface EriContactUsButtonProps {
  /** Stable lowercase source ID for this app (e.g. "psm", "hal", "taxonomy") */
  source: string;
  /** Human-readable app name shown on the contact page (e.g. "Professional Services Matrix") */
  sourceLabel: string;
  /** URL to return to after form submission — must be URL-encoded */
  returnUrl: string;
  /** Optional subject prefix for the email (e.g. "PSM Enquiry") */
  subject?: string;
  /** 'sm' | 'md' (default) — controls padding only, never colour or shape */
  size?: 'sm' | 'md';
  /** Optional additional className — use only for margin/spacing */
  className?: string;
}

export function EriContactUsButton({
  source,
  sourceLabel,
  returnUrl,
  subject,
  size = 'md',
  className = '',
}: EriContactUsButtonProps) {
  const encodedReturn = encodeURIComponent(returnUrl);
  const encodedLabel = encodeURIComponent(sourceLabel);
  const subjectParam = subject ? `&subject=${encodeURIComponent(subject)}` : '';

  const href = `https://contact-us.exponentialroadmap.org/?source=${source}&sourceLabel=${encodedLabel}&return=${encodedReturn}${subjectParam}`;

  const padding = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition-opacity hover:opacity-90 ${padding} ${className}`}
      style={{ backgroundColor: '#93E07D', color: '#1a1a1a' }}
    >
      Contact Us
    </a>
  );
}

export default EriContactUsButton;
