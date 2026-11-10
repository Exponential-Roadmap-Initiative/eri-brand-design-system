/**
 * EriFigureList — ERI Brand Design System (v2.21.0 adds the "tiles" layout and the card-level as-of line)
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
 *   - `layout="tiles"` (2.21.0): the figures as tiles side by side (4 across at 1440, 2 across below 1100px), each with its label, its
 *     value in large type, an optional "of N" and share, and one short line. A tile may say what it is out of (`of`, `share`), and
 *     `tone: "attention"` marks the one that must change. Tiles carry no badge and no per-row date: the card says "as of" once
 *     (`asOf`, a node: e.g. a "Confirmed by Q&E" badge and the date). The tiles layout has no card border of its own: put it inside
 *     the page's own card; `title` still names the list for assistive technology (hide it visually with `hideTitle`).
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
  /** Tiles layout: what the value is out of, e.g. "of 560". */
  of?: string;
  /** Tiles layout: the share, e.g. "55.5 % of all grades". */
  share?: string;
  /** Tiles layout: one short line under the figure. */
  line?: string;
  /** Tiles layout: `attention` marks the figure that must change (warning colour). */
  tone?: 'attention';
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
  /** `tiles` draws the figures as tiles (see the rules above). Default `list`. */
  layout?: 'list' | 'tiles';
  /** Tiles layout: the card-level "as of" line, shown once above the tiles instead of a date on every figure. */
  asOf?: ReactNode;
  /** Tiles layout: keep the title for assistive technology but do not show it. */
  hideTitle?: boolean;
}

export function EriFigureList({ title, note, rows, missing = 'Not measured yet', footer, fold, layout = 'list', asOf, hideTitle }: EriFigureListProps) {
  const id = useId();
  if (layout === 'tiles') {
    return (
      <section className="eri-figlist eri-figlist--tiles" aria-labelledby={id}>
        <h3 id={id} className={hideTitle ? 'eri-figlist__sr' : undefined}>{title}</h3>
        {note && <p className="eri-figlist__note">{note}</p>}
        {asOf && <div className="eri-figlist__asof">{asOf}</div>}
        <dl className="eri-figlist__tiles">
          {rows.map(row => (
            <div className={`eri-figlist__tile${row.tone === 'attention' ? ' eri-figlist__tile--attention' : ''}`} key={row.key}>
              <dt>{row.label}</dt>
              <dd>
                <span className="eri-figlist__big" data-empty={row.value === null ? '' : undefined}>{row.value ?? missing}</span>
                {row.value !== null && row.of && <span className="eri-figlist__of">{row.of}</span>}
                {row.value !== null && row.share && <span className="eri-figlist__share">{row.share}</span>}
                {row.line && <span className="eri-figlist__line">{row.line}</span>}
              </dd>
            </div>
          ))}
        </dl>
        {footer}
      </section>
    );
  }
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
