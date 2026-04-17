/**
 * EriStatusBadge — ERI Brand Design System v2.0.0
 *
 * Canonical status badge for all ERI applications.
 * Transparent outlined pill, all-caps, adapts to dark or light backgrounds.
 *
 * USAGE:
 *   <EriStatusBadge status="BETA" theme="dark" />
 *
 * RULES (do not override):
 *   - Always transparent background — never filled
 *   - Always rounded-full pill shape
 *   - Always uppercase tracking-widest
 *   - theme="dark"  → white border + white text (for dark/transparent headers)
 *   - theme="light" → gray border + gray text (for white/light headers)
 *
 * BDS reference: https://eri-brand-design-system.manus.space/#badges
 */

import React from 'react';

export type EriStatusValue = 'ALPHA' | 'BETA' | 'PREVIEW' | 'LIVE';

interface EriStatusBadgeProps {
  /** The status value to display */
  status: EriStatusValue;
  /** 'dark' for dark/transparent headers, 'light' for white/light headers */
  theme?: 'dark' | 'light';
  /** Optional additional className — use only for margin/spacing, never for colour or shape */
  className?: string;
}

export function EriStatusBadge({ status, theme = 'dark', className = '' }: EriStatusBadgeProps) {
  const colours =
    theme === 'dark'
      ? 'border-white/60 text-white'
      : 'border-gray-400 text-gray-500';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-widest uppercase ${colours} ${className}`}
    >
      {status}
    </span>
  );
}

export default EriStatusBadge;
