/**
 * EriFigureList — ERI Brand Design System (proposed for @eri/components 2.19.0)
 *
 * A card of key figures: one row per figure with its value, the limit or target it
 * is held to, its own date, and a word for how it stands.
 *
 * RULES (do not override):
 *   - A value that is not known reads `missing` ("Not measured yet"), never a dash or a zero.
 *   - The standing is always in words; colour only repeats it:
 *       within → "Within the limit"   near → "Near the limit"   over/below/off → "Over the limit" / "Below target" / "Off target"
 *   - The card computes nothing: the caller owns numbers, units and wording.
 *   - Colours: tokens only — within var(--primary), near var(--warning),
 *     over var(--destructive); text var(--foreground) / var(--muted-foreground); rules var(--border).
 *
 * USAGE:
 *   <EriFigureList title="Cost and pace" rows={[
 *     { key: "merges-today", label: "Merges today", value: "7", limit: "Limit 12", asOf: "4 Nov 2026",
 *       badge: { text: "Within the limit", tone: "ok" } },
 *     { key: "minutes", label: "Average minutes per company", value: null } ]} />
 *
 * Same API as eri-platform's local FigureList (#1406), plus one tone: "warn" for "Near the limit".
 */
import { type ReactNode, useId } from 'react';

export type EriFigureRow = {
  key: string;
  label: string;
  /** Already formatted, e.g. "USD 12.00"; null while not known. */
  value: string | null;
  /** e.g. "Limit USD 150", "Target at least 80". */
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
}

export function EriFigureList({ title, note, rows, missing = 'Not measured yet', footer }: EriFigureListProps) {
  const id = useId();
  return (
    <section className="eri-figlist" aria-labelledby={id}>
      <h3 id={id}>{title}</h3>
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
    </section>
  );
}

export default EriFigureList;
