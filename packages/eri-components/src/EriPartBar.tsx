/**
 * EriPartBar and EriPartSwatch — ERI Brand Design System v2.21.0
 *
 * A part-of-whole bar with its legend attached: one bar split into parts, each as wide as its count, and directly under it a
 * legend that says, per part, its name, its count, its share and what it means. Colour is never the only way to read it: the
 * bar has one text label, and every part is named in the legend.
 *
 * USAGE:
 *   <EriPartBar
 *     label="560 grades: 311 same grade, 47 fixable, 109 justified, 93 not yet explained"
 *     segments={[
 *       { key: "same", n: 311, tone: "success", name: "Same grade", value: "311 of 560", share: "55.5 %", description: "The engine gives the expert's exact grade." },
 *       { key: "fixable", n: 47, tone: "primary", hatched: true, name: "Fixable", value: "47 of 560", share: "8.4 %", description: "We know why they differ and can fix it." },
 *     ]} />
 *   <EriPartBar size="compact" legend={false} label="…" segments={…} />   // a thin bar for a table row, no legend
 *
 * RULES (do not override):
 *   - The caller owns every number and word: the bar computes nothing but widths (each part is as wide as its `n`; a part with n = 0
 *     has no width in the bar and keeps its legend line).
 *   - Tones are tokens only: success var(--success), warning var(--warning), danger var(--danger), primary var(--primary), muted
 *     var(--muted-foreground). `hatched` draws the tone as diagonal stripes on the card colour, for a part that is "on its way".
 *   - `className` lets an app give a part its own fill (tokens only); it is applied to the bar part and to the legend swatch.
 *   - The legend swatch and the table-header swatch (EriPartSwatch) are the same shape and colour as the part, so a column and a
 *     part that share a meaning share a colour.
 *   - Responsive CSS is in dist/eri-components.css (.eri-partbar*): below 640px the description moves under the name and count.
 */

import React from 'react';

export type EriPartTone = 'success' | 'warning' | 'danger' | 'primary' | 'muted';

export interface EriPartSegment {
  key: string;
  /** The count that sets the part's width. */
  n: number;
  tone?: EriPartTone;
  /** Draw the tone as diagonal stripes. */
  hatched?: boolean;
  /** Optional own fill for the part and its swatch (an app's token-only class). */
  className?: string;
  /** Legend: the part's name, e.g. "Same grade". */
  name?: string;
  /** Legend: its count, already formatted, e.g. "311 of 560". */
  value?: string;
  /** Legend: its share, already formatted, e.g. "55.5 %". */
  share?: string;
  /** Legend: what the part means, one sentence. */
  description?: string;
}

export interface EriPartBarProps {
  /** The text alternative of the whole bar: every part with its count. */
  label: string;
  segments: EriPartSegment[];
  /** `compact` is a thin bar for a table row. */
  size?: 'default' | 'compact';
  /** Show the legend under the bar. Default true, and only when a part has a `name`. */
  legend?: boolean;
  /** Id of the element that names the legend (a heading above it), for the list's accessible name. */
  labelledBy?: string;
}

const partClass = (s: Pick<EriPartSegment, 'tone' | 'hatched' | 'className'>) =>
  ['eri-part', s.tone ? `eri-part--${s.tone}` : '', s.hatched ? 'eri-part--hatched' : '', s.className ?? ''].filter(Boolean).join(' ');

/** A small square in a part's colour, for a table column header or a key. Decorative: the column or part is named beside it. */
export function EriPartSwatch({ tone, hatched, className }: Pick<EriPartSegment, 'tone' | 'hatched' | 'className'>) {
  return <i className={`${partClass({ tone, hatched, className })} eri-part-swatch`} aria-hidden="true" />;
}

export function EriPartBar({ label, segments, size = 'default', legend = true, labelledBy }: EriPartBarProps) {
  const named = segments.filter(s => s.name);
  return (
    <div className={`eri-partbar eri-partbar--${size}`}>
      <div className="eri-partbar__bar" role="img" aria-label={label}>
        {segments.filter(s => s.n > 0).map(s => (
          <span key={s.key} className={partClass(s)} style={{ flex: `${s.n} 1 0` }} />
        ))}
      </div>
      {legend && named.length > 0 && (
        <ul className="eri-partbar__legend" role="list" aria-labelledby={labelledBy}>
          {named.map(s => (
            <li key={s.key} role="listitem">
              <EriPartSwatch tone={s.tone} hatched={s.hatched} className={s.className} />
              <span className="eri-partbar__name">{s.name}</span>
              {/* All five cells are always drawn (empty when a field is missing): the legend is one grid, and a missing cell would move every later cell one column left. */}
              <span className="eri-partbar__num">{s.value}</span>
              <span className="eri-partbar__share">{s.share ? `(${s.share})` : null}</span>
              <span className="eri-partbar__what">{s.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EriPartBar;
