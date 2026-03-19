/**
 * CrocodileChartExamples — Live SVG chart demos for the Charts section
 *
 * Design: ERI Brand Design System — Charts & Data Visualisation
 *
 * Chart anatomy (from reference screenshots):
 *   - Y-axis centred on 0; gridlines at -50, 0, +50
 *   - Revenue/GDP line goes POSITIVE (above 0) — cyan #00B4D8
 *   - CO₂ line goes NEGATIVE (below 0) — near-black #1A1A1A
 *   - Fill is the entire gap between the two lines (the "crocodile jaw")
 *   - Green fill #7DD87A for company/corporate entities
 *   - Salmon fill #F08070 for nation/region/supranational entities
 *   - No chart border box; horizontal gridlines only
 *   - Bold Archivo uppercase title, left-aligned
 *   - Both charts shown side by side (no tabs)
 *
 * Implementation: custom SVG chart so we can correctly fill between
 * two diverging lines (one positive, one negative) without Recharts
 * stacking limitations.
 */

/* ─── Synthetic illustrative data ────────────────────────────────────────── */
// Values represent % change from baseline (0 = baseline year)
// upper (revenue/GDP) goes positive; lower (CO₂) goes negative

const companyData = [
  { year: "2013", upper: 0, lower: 0 },
  { year: "14", upper: 2, lower: -2 },
  { year: "15", upper: 4, lower: -5 },
  { year: "16", upper: 3, lower: -8 },
  { year: "17", upper: 5, lower: -12 },
  { year: "18", upper: 8, lower: -18 },
  { year: "19", upper: 12, lower: -24 },
  { year: "20", upper: 10, lower: -30 },
  { year: "21", upper: 22, lower: -36 },
  { year: "22", upper: 38, lower: -42 },
  { year: "23", upper: 52, lower: -48 },
  { year: "24", upper: 65, lower: -52 },
];

const nationData = [
  { year: "1995", upper: 0, lower: 0 },
  { year: "98", upper: 4, lower: -1 },
  { year: "2000", upper: 8, lower: -2 },
  { year: "02", upper: 10, lower: -4 },
  { year: "04", upper: 14, lower: -6 },
  { year: "06", upper: 18, lower: -8 },
  { year: "08", upper: 20, lower: -10 },
  { year: "10", upper: 18, lower: -14 },
  { year: "12", upper: 20, lower: -18 },
  { year: "14", upper: 24, lower: -22 },
  { year: "16", upper: 28, lower: -26 },
  { year: "18", upper: 32, lower: -30 },
  { year: "20", upper: 30, lower: -36 },
  { year: "22", upper: 36, lower: -40 },
  { year: "24", upper: 44, lower: -46 },
];

/* ─── SVG chart component ────────────────────────────────────────────────── */

type DataPoint = { year: string; upper: number; lower: number };

function CrocodileChart({
  title,
  data,
  fillColor,
  upperLabel,
  lowerLabel,
  sourceNote,
}: {
  title: string;
  data: DataPoint[];
  fillColor: string;
  upperLabel: string;
  lowerLabel: string;
  sourceNote: string;
}) {
  // Chart dimensions
  const W = 400;
  const H = 240;
  const PAD = { top: 16, right: 16, bottom: 32, left: 44 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  // Data domain: y from -60 to +70
  const Y_MIN = -60;
  const Y_MAX = 70;
  const Y_RANGE = Y_MAX - Y_MIN;

  const n = data.length;

  // Map data → SVG coordinates
  const xScale = (i: number) => PAD.left + (i / (n - 1)) * chartW;
  const yScale = (v: number) => PAD.top + ((Y_MAX - v) / Y_RANGE) * chartH;

  // Build path strings
  const upperPoints = data.map((d, i) => `${xScale(i)},${yScale(d.upper)}`);
  const lowerPoints = data.map((d, i) => `${xScale(i)},${yScale(d.lower)}`);

  // Fill polygon: upper line forward, lower line backward
  const fillPath =
    "M " +
    upperPoints.join(" L ") +
    " L " +
    [...lowerPoints].reverse().join(" L ") +
    " Z";

  const upperLinePath = "M " + upperPoints.join(" L ");
  const lowerLinePath = "M " + lowerPoints.join(" L ");

  // Gridline y values
  const gridYValues = [-50, 0, 50];
  const y0 = yScale(0);

  // X-axis: show first, middle, last labels + a couple in between
  const labelIndices = [0, Math.floor(n / 3), Math.floor((2 * n) / 3), n - 1];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex-1 min-w-0">
      {/* Title */}
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

      {/* SVG chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", overflow: "visible" }}
        aria-label={`${title} crocodile economy chart`}
      >
        {/* Horizontal gridlines */}
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
                stroke="#CCCCCC"
                strokeWidth={isZero ? 1.5 : 0.5}
              />
              {/* Y-axis tick label */}
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

        {/* Fill between upper and lower lines */}
        <path d={fillPath} fill={fillColor} fillOpacity={0.75} />

        {/* Upper line (revenue/GDP) — cyan */}
        <path
          d={upperLinePath}
          fill="none"
          stroke="#00B4D8"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Lower line (CO₂) — near-black */}
        <path
          d={lowerLinePath}
          fill="none"
          stroke="#1A1A1A"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* X-axis labels */}
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

      {/* Legend */}
      <div className="flex gap-4 mt-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5" style={{ backgroundColor: "#00B4D8" }} />
          <span style={{ fontSize: 10, fontFamily: "'Open Sans', sans-serif", color: "#555" }}>
            {upperLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5" style={{ backgroundColor: "#1A1A1A" }} />
          <span style={{ fontSize: 10, fontFamily: "'Open Sans', sans-serif", color: "#555" }}>
            {lowerLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-3 rounded-sm"
            style={{ backgroundColor: fillColor, opacity: 0.75 }}
          />
          <span style={{ fontSize: 10, fontFamily: "'Open Sans', sans-serif", color: "#555" }}>
            Decoupling gap
          </span>
        </div>
      </div>

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
    </div>
  );
}

/* ─── Exported wrapper — side by side, no tabs ───────────────────────────── */

export default function CrocodileChartExamples() {
  return (
    <div>
      <div className="flex gap-4 flex-col sm:flex-row">
        <CrocodileChart
          title="Company"
          data={companyData}
          fillColor="#7DD87A"
          upperLabel="Revenue (% change)"
          lowerLabel="CO₂ emissions (% change)"
          sourceNote="Illustrative. Sources: company annual reports, Klimatkollen."
        />
        <CrocodileChart
          title="Country"
          data={nationData}
          fillColor="#F08070"
          upperLabel="GDP (% change)"
          lowerLabel="CO₂ emissions (% change)"
          sourceNote="Illustrative. Sources: World Bank GDP, Global Carbon Budget."
        />
      </div>

      {/* Semantic colour note */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
        <strong>Semantic encoding rule:</strong> The fill colour between the two lines is not
        decorative. It encodes entity type — always green for companies, always salmon for
        countries/regions. Never swap these colours.
      </div>
    </div>
  );
}
