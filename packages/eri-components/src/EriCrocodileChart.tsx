/**
 * EriCrocodileChart — Canonical ERI Crocodile Economy chart component
 *
 * Part of @eri/components. Zero external dependencies — pure SVG.
 *
 * ── Chart anatomy ────────────────────────────────────────────────────────────
 *   Upper line (GDP / Revenue)   cyan  #00B4D8   — goes positive (above zero)
 *   Lower line (CO₂ emissions)   near-black #1A1A1A — goes negative (below zero)
 *   Fill between lines           green #7DD87A (company) | salmon #F08070 (nation)
 *   Gridlines / axes             light grey #CCCCCC
 *   Zero line                    1.5px (thicker than other gridlines at 0.5px)
 *   Fill opacity                 0.75 (gridlines visible through fill)
 *   Background                   white #FFFFFF — no chart background colour
 *   No border box                horizontal gridlines only
 *   Y-axis                       left side only; no right-side axis
 *   X-axis                       year labels only — no tick marks
 *
 * ── Semantic colour rule ─────────────────────────────────────────────────────
 *   entityType="company"  → green fill  #7DD87A  (private-sector actors)
 *   entityType="nation"   → salmon fill #F08070  (public-sector / supranational)
 *   This is a semantic encoding — never swap the colours.
 *
 * ── Typography ───────────────────────────────────────────────────────────────
 *   Chart title    Archivo 700 uppercase #232323
 *   Axis labels    Open Sans 400 #666666 11–12px
 *   Tick values    Open Sans 400 #888888 10–11px
 *   Legend labels  Open Sans 400 #555555 10px
 *   Source note    Open Sans 400 #AAAAAA 10px
 *
 * ── Usage ────────────────────────────────────────────────────────────────────
 *   import { EriCrocodileChart } from "@eri/components";
 *
 *   <EriCrocodileChart
 *     title="Company"
 *     entityType="company"
 *     data={[
 *       { year: "2013", upper: 0,  lower: 0   },
 *       { year: "2018", upper: 8,  lower: -18 },
 *       { year: "2024", upper: 65, lower: -52 },
 *     ]}
 *     upperLabel="Revenue (% change)"
 *     lowerLabel="CO₂ emissions (% change)"
 *     sourceNote="Sources: company annual reports, Klimatkollen."
 *   />
 *
 * ── Data format ──────────────────────────────────────────────────────────────
 *   data: DataPoint[]   — array of { year: string; upper: number; lower: number }
 *   upper values        — positive numbers (% change above baseline)
 *   lower values        — negative numbers (% change below baseline)
 *   Minimum 2 points required; 8–16 points recommended for a readable jaw shape.
 *
 * ── Version ──────────────────────────────────────────────────────────────────
 *   Introduced: @eri/components v2.14.0
 */

import React from "react";

/** A single data point in the Crocodile Economy chart time series. */
export interface CrocodileDataPoint {
  /** Year label displayed on the x-axis (e.g. "2013", "14", "2020"). */
  year: string;
  /** Upper trajectory value — positive % change from baseline (GDP / Revenue). */
  upper: number;
  /** Lower trajectory value — negative % change from baseline (CO₂ emissions). */
  lower: number;
}

export interface EriCrocodileChartProps {
  /** Chart title — rendered in Archivo 700 uppercase above the chart. */
  title: string;
  /**
   * Entity type — controls the fill colour between the two lines.
   * "company" → green #7DD87A (private-sector actors)
   * "nation"  → salmon #F08070 (public-sector / supranational actors)
   * This is a semantic encoding — never swap the colours.
   */
  entityType: "company" | "nation";
  /** Time-series data. Minimum 2 points; 8–16 recommended. */
  data: CrocodileDataPoint[];
  /** Legend label for the upper (GDP / Revenue) line. */
  upperLabel: string;
  /** Legend label for the lower (CO₂ emissions) line. */
  lowerLabel: string;
  /** Optional data source attribution displayed below the chart. */
  sourceNote?: string;
  /**
   * Optional CSS class name applied to the outermost container div.
   * Use for width/layout control in the consuming component.
   */
  className?: string;
}

/** Semantic fill colours — never swap these. */
const FILL_COLORS: Record<EriCrocodileChartProps["entityType"], string> = {
  company: "#7DD87A",
  nation: "#F08070",
};

/** Chart line colours — fixed across all entity types. */
const LINE_UPPER = "#00B4D8"; // Cyan — GDP / Revenue
const LINE_LOWER = "#1A1A1A"; // Near-black — CO₂ emissions
const LINE_GRID = "#CCCCCC";  // Light grey — gridlines and axes

/**
 * EriCrocodileChart — canonical ERI Crocodile Economy decoupling chart.
 *
 * Renders a pure SVG chart showing the diverging "crocodile jaw" between
 * economic growth (upper line) and CO₂ emissions (lower line) over time.
 * The fill colour between the lines encodes entity type — green for companies,
 * salmon for nations. This encoding is semantic and must never be swapped.
 */
export function EriCrocodileChart({
  title,
  entityType,
  data,
  upperLabel,
  lowerLabel,
  sourceNote,
  className = "",
}: EriCrocodileChartProps) {
  // ── Chart dimensions ──────────────────────────────────────────────────────
  const W = 400;
  const H = 240;
  const PAD = { top: 16, right: 16, bottom: 32, left: 44 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  // ── Data domain ───────────────────────────────────────────────────────────
  // Fixed domain: y from -60 to +70 — consistent across all charts for
  // visual comparability. Adjust only if data consistently exceeds these bounds.
  const Y_MIN = -60;
  const Y_MAX = 70;
  const Y_RANGE = Y_MAX - Y_MIN;

  const n = data.length;

  // ── Scale functions ───────────────────────────────────────────────────────
  const xScale = (i: number) => PAD.left + (i / Math.max(n - 1, 1)) * chartW;
  const yScale = (v: number) => PAD.top + ((Y_MAX - v) / Y_RANGE) * chartH;

  // ── Path strings ──────────────────────────────────────────────────────────
  const upperPoints = data.map((d, i) => `${xScale(i)},${yScale(d.upper)}`);
  const lowerPoints = data.map((d, i) => `${xScale(i)},${yScale(d.lower)}`);

  // Fill polygon: upper line forward, lower line backward → closed shape
  const fillPath =
    "M " +
    upperPoints.join(" L ") +
    " L " +
    [...lowerPoints].reverse().join(" L ") +
    " Z";

  const upperLinePath = "M " + upperPoints.join(" L ");
  const lowerLinePath = "M " + lowerPoints.join(" L ");

  // ── Gridlines ─────────────────────────────────────────────────────────────
  const gridYValues = [-50, 0, 50];

  // ── X-axis labels ─────────────────────────────────────────────────────────
  // Show first, ~⅓, ~⅔, and last year labels — avoids crowding
  const labelIndices =
    n <= 4
      ? data.map((_, i) => i)
      : [0, Math.floor(n / 3), Math.floor((2 * n) / 3), n - 1];

  const fillColor = FILL_COLORS[entityType];

  return (
    <div
      className={`bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex-1 min-w-0 ${className}`}
    >
      {/* ── Chart title ─────────────────────────────────────────────────── */}
      <p
        style={{
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "#232323",
          marginBottom: 8,
        }}
      >
        {title}
      </p>

      {/* ── SVG chart ───────────────────────────────────────────────────── */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", overflow: "visible" }}
        aria-label={`${title} crocodile economy decoupling chart`}
        role="img"
      >
        {/* Horizontal gridlines + y-axis tick labels */}
        {gridYValues.map((v) => {
          const y = yScale(v);
          const isZero = v === 0;
          return (
            <g key={v}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + chartW}
                y2={y}
                stroke={LINE_GRID}
                strokeWidth={isZero ? 1.5 : 0.5}
              />
              <text
                x={PAD.left - 6}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fontFamily="'Open Sans', sans-serif"
                fill="#888888"
              >
                {v > 0 ? `+${v}` : v}
              </text>
            </g>
          );
        })}

        {/* Fill between upper and lower lines (the "crocodile jaw") */}
        <path d={fillPath} fill={fillColor} fillOpacity={0.75} />

        {/* Upper line — GDP / Revenue — cyan */}
        <path
          d={upperLinePath}
          fill="none"
          stroke={LINE_UPPER}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Lower line — CO₂ emissions — near-black */}
        <path
          d={lowerLinePath}
          fill="none"
          stroke={LINE_LOWER}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* X-axis year labels */}
        {labelIndices.map((i) => (
          <text
            key={i}
            x={xScale(i)}
            y={H - 6}
            textAnchor="middle"
            fontSize={10}
            fontFamily="'Open Sans', sans-serif"
            fill="#888888"
          >
            {data[i].year}
          </text>
        ))}
      </svg>

      {/* ── Legend ──────────────────────────────────────────────────────── */}
      <div className="flex gap-4 mt-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5" style={{ backgroundColor: LINE_UPPER }} />
          <span
            style={{
              fontSize: 10,
              fontFamily: "'Open Sans', sans-serif",
              color: "#555555",
            }}
          >
            {upperLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5" style={{ backgroundColor: LINE_LOWER }} />
          <span
            style={{
              fontSize: 10,
              fontFamily: "'Open Sans', sans-serif",
              color: "#555555",
            }}
          >
            {lowerLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-3 rounded-sm"
            style={{ backgroundColor: fillColor, opacity: 0.75 }}
          />
          <span
            style={{
              fontSize: 10,
              fontFamily: "'Open Sans', sans-serif",
              color: "#555555",
            }}
          >
            Decoupling gap
          </span>
        </div>
      </div>

      {/* ── Source note ─────────────────────────────────────────────────── */}
      {sourceNote && (
        <p
          className="mt-2"
          style={{
            fontSize: 10,
            fontFamily: "'Open Sans', sans-serif",
            color: "#AAAAAA",
          }}
        >
          {sourceNote}
        </p>
      )}
    </div>
  );
}

export default EriCrocodileChart;
