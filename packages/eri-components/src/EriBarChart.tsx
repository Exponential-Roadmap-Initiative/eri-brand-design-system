/**
 * EriBarChart — ERI Brand Design System
 *
 * One series of bars over periods (days or months), on a scale from 0 to `max`.
 * Zero external dependencies; tokens only (no hex values).
 *
 * RULES (do not override):
 *   - One series per chart. Several series are several charts on one shared `max`
 *     (small multiples), never stacked, never a second axis.
 *   - A null value is a gap, not a zero. A zero is a zero.
 *   - `light` marks a period still in progress ("so far"); `over` marks a bar over
 *     its limit, and the caller also says so in words next to the chart.
 *   - The chart is one image to a screen reader, named by `label`; the same figures
 *     belong in a table beside it.
 *   - Colours: bars var(--primary), over var(--destructive), gridlines var(--border),
 *     limit line and text var(--foreground) / var(--muted-foreground).
 *
 * USAGE:
 *   <EriBarChart label="GitHub Actions, USD per month" max={150}
 *     format={v => `USD ${v.toFixed(0)}`}
 *     limit={{ value: 150, label: "Limit 150 a month" }}
 *     bars={[{ key: "2026-10", value: 107.17, tip: "Oct 2026 · USD 107.17", tick: "Oct" },
 *            { key: "2026-11", value: 49.69, tip: "Nov 2026 so far · USD 49.69", tick: "Nov", light: true }]} />
 */
import type { CSSProperties } from 'react';

export type EriBar = { key: string; value: number | null; tip: string; tick?: string; light?: boolean; over?: boolean };

export interface EriBarChartProps {
  /** What the chart shows, read by screen readers (the chart is one image). */
  label: string;
  bars: EriBar[];
  /** Top of the scale; the caller derives it from the data and rounds up. */
  max: number;
  /** How a scale value is written, e.g. v => `USD ${v}`. */
  format: (value: number) => string;
  /** Optional dashed limit line, drawn only when it fits the scale. */
  limit?: { value: number; label: string };
  /** Plot height in px. */
  height?: number;
}

export function EriBarChart({ label, bars, max, format, limit, height = 140 }: EriBarChartProps) {
  const share = (value: number) => `${max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0}%`;
  return (
    <div className="eri-bars" role="img" aria-label={label} style={{ '--eri-bars-height': `${height}px` } as CSSProperties}>
      <div className="eri-bars__axis" aria-hidden="true"><span>{format(max)}</span><span>{format(max / 2)}</span><span>{format(0)}</span></div>
      <div className="eri-bars__plot" aria-hidden="true">
        {bars.map(bar => (
          <span key={bar.key} className="eri-bars__slot" title={bar.tip}>
            {bar.value !== null && (
              <span className={`eri-bars__bar${bar.light ? ' eri-bars__bar--light' : ''}${bar.over ? ' eri-bars__bar--over' : ''}`} style={{ height: share(bar.value) }} />
            )}
          </span>
        ))}
        {limit && limit.value <= max && <span className="eri-bars__limit" style={{ bottom: share(limit.value) }}><small>{limit.label}</small></span>}
      </div>
      <div className="eri-bars__ticks" aria-hidden="true">
        {bars.map(bar => <span key={bar.key}>{bar.tick && <small>{bar.tick}</small>}</span>)}
      </div>
    </div>
  );
}

export default EriBarChart;
