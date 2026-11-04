/**
 * EriFigureList — ERI Brand Design System
 *
 * A card of key figures: one row per figure with its value, the limit or target it
 * is held to, its own date, and a word for how it stands.
 *
 * RULES (do not override):
 *   - A value that is not known reads `missing` ("Not measured yet"), never a dash or a zero.
 *   - The standing is always in words; colour only repeats it:
 *       a maximum: "Within the limit" / "Near the limit" (80% or more of it) / "Over the limit"
 *       a minimum: "At or above the minimum" / "Below the minimum"   a target: "At the target" / "Not at the target"
 *   - The card computes nothing: the caller owns numbers, units and wording.
 *   - Colours: tokens only, as text and outline (each passes 4.5:1 on the card in light and dark):
 *     within var(--success), near var(--warning), over var(--danger);
 *     text var(--foreground) / var(--muted-foreground); rules var(--border).
 *   - `fold` (phones): the card is a details element: the title and a closed line stay in view, the rows open on a tap.
 *     The caller decides when to fold (a media query) and which card opens.
 *
 * USAGE:
 *   <EriFigureList title="Cost and pace" rows={[
 *     { key: "merges-today", label: "Merges today", value: "7", limit: "Limit 12", asOf: "4 Nov 2026",
 *       badge: { text: "Within the limit", tone: "ok" } },
 *     { key: "minutes", label: "Average minutes per company", value: null } ]} />
 */
import { type ReactNode, useId } from 'react';

export type EriFigureRow = {
  key: string;
  label: string;
  /** Already formatted, e.g. "USD 12.00"; null while not known. */
  value: string | null;
  /** e.g. "Limit USD 150", "Minimum 5", "Target 0". */
  limit?: string;
  /** Shown only with a value. */
  asOf?: string;
  badge?: { text: string; tone: 'ok' | 'warn' | 'fail' };
};

export interface EriFigureListProps {
  title: string;
  /** One line under the title, e.g. "11 figures · 11 not measured yet". */
  note?: string;
  rows: EriFigureRow[];
  missing?: string;
  footer?: ReactNode;
  /** Folds the card (phones): `open` is its state on first render, `line` is what a closed fold says, e.g. "9 figures · 8 not measured yet". */
  fold?: { open: boolean; line: string };
}

export function EriFigureList({ title, note, rows, missing = 'Not measured yet', footer, fold }: EriFigureListProps) {
  const id = useId();
  const body = (
    <>
      {note && <p className="eri-figlist__note">{note}</p>}
      <dl>
        {rows.map(row => (
          <div className="eri-figlist__row" key={row.key}>
            <dt>{row.label}</dt>
            <dd>
              <span className="eri-figlist__value" data-empty={row.value === null ? '' : undefined}>{row.value ?? missing}</span>
              {row.badge && <span className={`eri-figlist__badge eri-figlist__badge--${row.badge.tone}`}>{row.badge.text}</span>}
              {(row.limit || (row.asOf && row.value !== null)) && (
                <small>{[row.limit, row.asOf && row.value !== null ? `as of ${row.asOf}` : ''].filter(Boolean).join(' · ')}</small>
              )}
            </dd>
          </div>
        ))}
      </dl>
      {footer}
    </>
  );
  if (fold) {
    return (
      <details className="eri-figlist eri-figlist--fold" open={fold.open}>
        <summary><h3 id={id}>{title}</h3><span className="eri-figlist__note">{fold.line}</span></summary>
        {body}
      </details>
    );
  }
  return (
    <section className="eri-figlist" aria-labelledby={id}>
      <h3 id={id}>{title}</h3>
      {body}
    </section>
  );
}

export default EriFigureList;
