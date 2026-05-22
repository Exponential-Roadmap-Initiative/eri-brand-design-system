/**
 * CrocodileChartExamples — Live chart demos for the BDS Charts section.
 *
 * Uses EriCrocodileChart from @eri/components — the canonical implementation.
 * This file only provides the illustrative sample data and the two-chart layout.
 * Do not reimplement the chart logic here — import from the package.
 */

import { EriCrocodileChart } from "@eri/components";
import type { CrocodileDataPoint } from "@eri/components";

/* ─── Synthetic illustrative data ────────────────────────────────────────── */
// Values represent % change from baseline (0 = baseline year)
// upper (revenue/GDP) goes positive; lower (CO₂) goes negative

const companyData: CrocodileDataPoint[] = [
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

const nationData: CrocodileDataPoint[] = [
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

/* ─── Exported wrapper — side by side, no tabs ───────────────────────────── */

export default function CrocodileChartExamples() {
  return (
    <div>
      <div className="flex gap-4 flex-col sm:flex-row">
        <EriCrocodileChart
          title="Company"
          entityType="company"
          data={companyData}
          upperLabel="Revenue (% change)"
          lowerLabel="CO₂ emissions (% change)"
          sourceNote="Illustrative. Sources: company annual reports, Klimatkollen."
        />
        <EriCrocodileChart
          title="Country"
          entityType="nation"
          data={nationData}
          upperLabel="GDP (% change)"
          lowerLabel="CO₂ emissions (% change)"
          sourceNote="Illustrative. Sources: World Bank GDP, Global Carbon Budget."
        />
      </div>

      {/* Semantic colour note */}
      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-800 dark:text-amber-300">
        <strong>Semantic encoding rule:</strong> The fill colour between the two lines is not
        decorative. It encodes entity type — always green for companies, always salmon for
        countries/regions. Never swap these colours.
      </div>
    </div>
  );
}
