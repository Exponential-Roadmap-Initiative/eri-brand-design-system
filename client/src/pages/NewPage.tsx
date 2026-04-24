/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ERI BDS — Canonical Page Template
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * COPY THIS FILE when creating a new page. It enforces the dark/light mode
 * pattern required by the ERI Brand Design System.
 *
 * ⚠️  DARK MODE RULE — READ BEFORE WRITING ANY COLOUR CLASS ⚠️
 *
 * NEVER use hardcoded colours for structural backgrounds, text, or borders.
 * ALWAYS use the semantic Tailwind tokens listed below.
 *
 * Structural colours (MUST use semantic tokens):
 * ┌──────────────────────────────────┬──────────────────────────────────────┐
 * │ Purpose                          │ Tailwind class                       │
 * ├──────────────────────────────────┼──────────────────────────────────────┤
 * │ Page background                  │ bg-background                        │
 * │ Card / panel surface             │ bg-card text-card-foreground         │
 * │ Muted / alternate row background │ bg-muted                             │
 * │ Primary body text                │ text-foreground                      │
 * │ Secondary / muted text           │ text-muted-foreground                │
 * │ Borders                          │ border-border                        │
 * │ Input backgrounds                │ bg-input                             │
 * │ Popover / dropdown               │ bg-popover text-popover-foreground   │
 * └──────────────────────────────────┴──────────────────────────────────────┘
 *
 * Brand colours (CAN be hardcoded — these are ERI brand values, not UI theme):
 * ┌──────────────────────────────────┬──────────────────────────────────────┐
 * │ Colour                           │ Hex value                            │
 * ├──────────────────────────────────┼──────────────────────────────────────┤
 * │ ERI Primary Dark                 │ #232323                              │
 * │ ERI Accent Lime                  │ #93E07D                              │
 * │ ERI Primary Green                │ #3ba559                              │
 * │ ERI Neutral Gray                 │ #6b7280                              │
 * │ ERI Off White                    │ #F9FAFB (only for brand swatches)    │
 * └──────────────────────────────────┴──────────────────────────────────────┘
 *
 * Inline style={{ backgroundColor: ... }} and style={{ color: ... }} with
 * hardcoded hex values are FORBIDDEN for structural elements. Use CSS variable
 * helpers if you must use inline styles:
 *
 *   const TV = {
 *     background: "var(--background)",
 *     card:       "var(--card)",
 *     muted:      "var(--muted)",
 *     foreground: "var(--foreground)",
 *     mutedFg:    "var(--muted-foreground)",
 *     border:     "var(--border)",
 *   };
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Rename this component and the file when copying ──────────────────────────

export default function NewPage() {
  return (
    // Page wrapper — always bg-background so the full page responds to theme
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Hero / header section ─────────────────────────────────────────── */}
      {/* Use bg-[#232323] for intentional ERI dark hero surfaces */}
      <section className="bg-[#232323] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="font-archivo text-xs font-semibold uppercase tracking-widest mb-3 text-[#93E07D]">
            Section label
          </p>
          <h1 className="font-archivo text-4xl font-extrabold text-white mb-4">
            Page Title
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Page description goes here.
          </p>
        </div>
      </section>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Card example — bg-card adapts to dark/light mode */}
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <h2 className="font-archivo font-bold text-xl text-foreground mb-3">
            Section Heading
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Body text uses text-muted-foreground for secondary content.
            Primary text uses text-foreground.
          </p>
        </div>

        {/* Muted background example — bg-muted for alternate rows / callouts */}
        <div className="rounded-xl bg-muted p-6 mb-6">
          <p className="text-foreground text-sm">
            Muted background section — use bg-muted for callout boxes,
            alternate table rows, and secondary panels.
          </p>
        </div>

        {/* Table example — structural colours only */}
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm bg-card text-foreground">
            <thead>
              <tr className="bg-[#232323]">
                <th className="text-left px-4 py-3 font-semibold text-[#93E07D] text-xs uppercase tracking-wide">
                  Column A
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[#93E07D] text-xs uppercase tracking-wide">
                  Column B
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr
                  key={i}
                  className="border-t border-border transition-colors hover:bg-muted/50"
                >
                  <td className="px-4 py-3 text-foreground">Row {i}, A</td>
                  <td className="px-4 py-3 text-muted-foreground">Row {i}, B</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}
