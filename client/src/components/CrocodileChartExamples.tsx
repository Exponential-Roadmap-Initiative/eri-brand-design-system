/**
 * CrocodileChartExamples — Live interactive Recharts demos for the Charts section
 *
 * Design: ERI Brand Design System — Charts & Data Visualisation
 * Shows two canonical Crocodile Economy chart variants:
 *   1. Company chart (green fill) — Astra Zeneca example
 *   2. Nation/Region chart (salmon fill) — European Union example
 *
 * Colour semantics:
 *   Fill green  #7DD87A → company / corporate entity
 *   Fill salmon #F08070 → nation / region / supranational entity
 *   GDP/Revenue line #00B4D8 (cyan)
 *   CO₂ line    #1A1A1A (near-black)
 */
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState } from "react";

/* ─── Synthetic data ─────────────────────────────────────────────────────── */

const companyData = [
  { year: "2000", revenue: 100, co2: 100 },
  { year: "2002", revenue: 108, co2: 102 },
  { year: "2004", revenue: 118, co2: 104 },
  { year: "2006", revenue: 130, co2: 106 },
  { year: "2008", revenue: 138, co2: 104 },
  { year: "2010", revenue: 148, co2: 100 },
  { year: "2012", revenue: 158, co2: 94 },
  { year: "2014", revenue: 170, co2: 86 },
  { year: "2016", revenue: 182, co2: 78 },
  { year: "2018", revenue: 196, co2: 68 },
  { year: "2020", revenue: 188, co2: 56 },
  { year: "2022", revenue: 218, co2: 46 },
];

const nationData = [
  { year: "2000", gdp: 100, co2: 100 },
  { year: "2002", gdp: 106, co2: 101 },
  { year: "2004", gdp: 114, co2: 102 },
  { year: "2006", gdp: 124, co2: 102 },
  { year: "2008", gdp: 130, co2: 100 },
  { year: "2010", gdp: 128, co2: 96 },
  { year: "2012", gdp: 130, co2: 91 },
  { year: "2014", gdp: 136, co2: 85 },
  { year: "2016", gdp: 144, co2: 79 },
  { year: "2018", gdp: 152, co2: 73 },
  { year: "2020", gdp: 144, co2: 62 },
  { year: "2022", gdp: 158, co2: 57 },
];

/* ─── Shared chart styles ────────────────────────────────────────────────── */

const AXIS_STYLE = {
  fontSize: 11,
  fontFamily: "'Open Sans', sans-serif",
  fill: "#888888",
};

const TOOLTIP_STYLE = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 4,
  fontSize: 12,
  fontFamily: "'Open Sans', sans-serif",
};

/* ─── Custom legend ──────────────────────────────────────────────────────── */

function ChartLegend({
  items,
}: {
  items: { color: string; label: string; dashed?: boolean }[];
}) {
  return (
    <div className="flex gap-5 justify-center mt-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div
            className="w-8 h-0.5"
            style={{
              backgroundColor: item.color,
              borderTop: item.dashed ? `2px dashed ${item.color}` : undefined,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontFamily: "'Open Sans', sans-serif",
              color: "#444444",
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Company chart ──────────────────────────────────────────────────────── */

function CompanyChart() {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
      {/* Title */}
      <p
        className="text-center mb-4"
        style={{
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#232323",
        }}
      >
        Astra Zeneca — Revenue vs CO₂ Emissions (2000–2022)
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={companyData}
          margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="companyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7DD87A" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#7DD87A" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="0"
            horizontal
            vertical={false}
            stroke="#CCCCCC"
            strokeWidth={0.5}
          />
          <XAxis
            dataKey="year"
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
            domain={[0, 250]}
            tickFormatter={(v) => `${v}`}
            label={{
              value: "Index (2000 = 100)",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: { ...AXIS_STYLE, fill: "#AAAAAA", fontSize: 10 },
            }}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value: number, name: string) => [
              `${value}`,
              name === "revenue" ? "Revenue index" : "CO₂ index",
            ]}
          />
          {/* Green fill between revenue (top) and co2 (bottom) */}
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#00B4D8"
            strokeWidth={2}
            fill="url(#companyFill)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="co2"
            stroke="#1A1A1A"
            strokeWidth={2}
            fill="#ffffff"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <ChartLegend
        items={[
          { color: "#00B4D8", label: "Revenue (indexed)" },
          { color: "#1A1A1A", label: "CO₂ emissions (indexed)" },
          { color: "#7DD87A", label: "Decoupling gap (company = green)" },
        ]}
      />

      <p
        className="text-center mt-3"
        style={{
          fontSize: 10,
          fontFamily: "'Open Sans', sans-serif",
          color: "#AAAAAA",
        }}
      >
        Illustrative data based on Crocodile Economy chart style. Sources: company annual reports, Klimatkollen.
      </p>
    </div>
  );
}

/* ─── Nation chart ───────────────────────────────────────────────────────── */

function NationChart() {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
      {/* Title */}
      <p
        className="text-center mb-4"
        style={{
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#232323",
        }}
      >
        European Union — GDP vs CO₂ Emissions (2000–2022)
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={nationData}
          margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="nationFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F08070" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F08070" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="0"
            horizontal
            vertical={false}
            stroke="#CCCCCC"
            strokeWidth={0.5}
          />
          <XAxis
            dataKey="year"
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
            domain={[0, 200]}
            tickFormatter={(v) => `${v}`}
            label={{
              value: "Index (2000 = 100)",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: { ...AXIS_STYLE, fill: "#AAAAAA", fontSize: 10 },
            }}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value: number, name: string) => [
              `${value}`,
              name === "gdp" ? "GDP index" : "CO₂ index",
            ]}
          />
          {/* Salmon fill between gdp (top) and co2 (bottom) */}
          <Area
            type="monotone"
            dataKey="gdp"
            stroke="#00B4D8"
            strokeWidth={2}
            fill="url(#nationFill)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="co2"
            stroke="#1A1A1A"
            strokeWidth={2}
            fill="#ffffff"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <ChartLegend
        items={[
          { color: "#00B4D8", label: "GDP (indexed)" },
          { color: "#1A1A1A", label: "CO₂ emissions (indexed)" },
          { color: "#F08070", label: "Decoupling gap (nation = salmon)" },
        ]}
      />

      <p
        className="text-center mt-3"
        style={{
          fontSize: 10,
          fontFamily: "'Open Sans', sans-serif",
          color: "#AAAAAA",
        }}
      >
        Illustrative data based on Crocodile Economy chart style. Sources: World Bank GDP, Global Carbon Budget.
      </p>
    </div>
  );
}

/* ─── Tab wrapper ────────────────────────────────────────────────────────── */

export default function CrocodileChartExamples() {
  const [active, setActive] = useState<"company" | "nation">("company");

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActive("company")}
          className={[
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            active === "company"
              ? "bg-[#7DD87A] text-[#232323]"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200",
          ].join(" ")}
        >
          Company chart
        </button>
        <button
          onClick={() => setActive("nation")}
          className={[
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            active === "nation"
              ? "bg-[#F08070] text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200",
          ].join(" ")}
        >
          Nation / Region chart
        </button>
      </div>

      {active === "company" ? <CompanyChart /> : <NationChart />}

      {/* Semantic colour note */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
        <strong>Semantic encoding rule:</strong> The fill colour between the two lines is not decorative.
        It encodes entity type — always green for companies, always salmon for nations/regions.
        Never swap these colours.
      </div>
    </div>
  );
}
