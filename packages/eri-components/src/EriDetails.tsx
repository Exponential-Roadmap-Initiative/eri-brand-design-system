/**
 * EriDetails — ERI Brand Design System
 *
 * A fold-out: a summary line that opens to show more. Native <details>, so it works without
 * script, opens with Enter/Space and is searchable by the browser's find.
 *
 * RULES (do not override):
 *   - The summary says what is inside in words ("Source notes [01]–[20]"), never "More" alone.
 *   - Put no heading inside the summary (a heading loses its role there); the caller puts a
 *     heading before the fold-out if the page outline needs one.
 *   - variant "card": a BDS card that folds (default). variant "plain": no frame, for a fold-out
 *     inside a card.
 *   - Colours: tokens only — var(--card), var(--border), var(--foreground), var(--muted-foreground), var(--ring).
 *
 * USAGE:
 *   <EriDetails summary="29 October 2026 edition: text changed or moved">…</EriDetails>
 */
import type { ReactNode } from 'react';

export interface EriDetailsProps {
  summary: ReactNode;
  children: ReactNode;
  /** Open on first render. */
  defaultOpen?: boolean;
  variant?: 'card' | 'plain';
  /** Extra layout class from the caller (spacing only). */
  className?: string;
}

export function EriDetails({ summary, children, defaultOpen = false, variant = 'card', className }: EriDetailsProps) {
  return (
    <details className={`eri-details eri-details--${variant}${className ? ` ${className}` : ''}`} open={defaultOpen || undefined}>
      <summary className="eri-details__summary">{summary}</summary>
      <div className="eri-details__body">{children}</div>
    </details>
  );
}

export default EriDetails;
