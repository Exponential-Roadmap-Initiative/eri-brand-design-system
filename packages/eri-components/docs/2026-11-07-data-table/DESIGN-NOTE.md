# Design note: EriDataTable and EriStateMessage move into @eri/components (7 Nov 2026)

**Asked for by:** the orchestrator, on Nicklas's words of 7 Nov: "yes, start the shared table move now, the rest after Monday". This is PR A of the UX lead's shared-components audit (G1, G2, G3, G4 and G7). PRs B and C come after Monday.

**Use case.** Every list on an ERI page (the CPR actions, runs, deviations, the Company Reports coverage, the Library's versions, the Data Lake explorers) uses one table, from one place. When a page needs something the table lacks, it is added here, not copied into the page.

**What it removes:**
- the platform's own copy of the table (`design-system/EriDataTable.tsx`, its model, tests and CSS);
- the table's dependence on the Data Lake explorer's stylesheets, which also restyle every CPR page;
- page-local paging, loading messages and phone layouts for the 42 hand-built tables (in 28 files) that the audit counted. Each would otherwise be designed again.

## What moved, unchanged

| From the ERI Platform | Into @eri/components |
|---|---|
| `EriDataTable` (search, quick filters, "only" toggles, chips, sort, groups, a row that opens, Columns, Export, paging, edge arrow, hidden rows) | `EriDataTable`, with the same props and the same address format (`t.q`, `t.f.*`, `t.sort`, `t.page`, `t.cols`) |
| `eriDataTableModel.ts` and its 7 tests | the same model, the same 7 tests, plus 4 new ones |
| `setEriTableFilter`, `useEriTableFilter` | the same |
| `StateMessage` (loading, empty, error, restricted) | `EriStateMessage`, also exported as `StateMessage` |
| `eri-data-table.css` and the explorer rules the table used | the `.eri-dt` rules in `styles.css`, with tokens only (`--eri-dt-*`, which default to the BDS semantic tokens) |

**Checked: the same look.**
- **Method:** a harness draws the old platform table and the new package table with 70 real-length CPR actions (codebook titles, long reasons, two hidden rows, the seven groups). It compares every element's computed style and box.
- **States compared:** the default view, an open filter, the Columns panel, chips, empty, hover and sorted, each at 1440 and 390.
- **Default view:** 0 pixels differ (`before-1440.png` and `after-1440.png`; `before-390.png` and `after-390.png`).
- **Three colours were literals and are now the nearest token:**
  - the paging range ("1–70 of 70") is in muted text;
  - the search box's typed text is in ink;
  - the filter pop-up's shadow is tinted from ink.
  The open filter differs only in that shadow (`before-filter-1440.png`, `after-filter-1440.png`).

## What is new

| Gap | What the page does | What the reader sees |
|---|---|---|
| **G2 Server paging** | passes `total` and `onViewChange(state)`; `rows` is one page | the same table and paging line ("26–50 of 70"); the server filters, sorts and cuts. A select column takes its `options`. Export goes through `onExport`, or is not shown |
| **G3 Filter slot** | puts page-level filters in `toolbar`; keeps them with `useEriTableParam` and `setEriTableParam` (`t.p.<name>` in the address) | the portfolio select first in the filter row; changing it returns to page 1, and the link keeps it |
| **G4 Loading and error** | `loading`, `error`, `onRetry` | "Loading actions…" in place of the rows. A reload keeps the rows, dimmed, with "· updating". The error message has "Try again" (`after-loading-1440.png`, `after-error-*.png`) |
| **G7 Phone layout** | marks columns `priority: "low"` | at 40rem and narrower, low columns fold into "Label: value" lines under the first cell. The table fills the width, and nothing scrolls sideways (`after-phone-priority-390.png`, `after-server-paging-390.png`) |

**A table that uses none of the new props is unchanged.** No current page sets `priority`, so the 4 pages look the same at every width.

## For the platform (Frontend's pin PR, after this merges)

1. Point the 6 imports at `@eri/components` (`actionTable`, `actionTableModel`, `calibration`, `company`, `portfolio`, `portfolioModel`). A trial compile of the CPR pages against this branch passes with only those lines changed.
2. Map the table's tokens once in `design-system/tokens.css` on `.eri-dt, .eri-state` (the block is in the PR description). Then delete the platform's copy and `eri-data-table.css`.
3. Change `cpr.css`'s `.eri-data-table code` only if it is renamed. The package keeps the `eri-data-table` class on the root, so that rule still applies.
4. Shoot the 4 pages at 1440 and 390 for the UX lead.

## Not in this PR

- G5 matrix, G6 totals, G8 EriBadge, G9 EriCard, G10 tab links, G11 chart parts, G12 EriSelect and G13 extracted tables.
- The version number: it is set at merge, after #2 (2.20.0).
- Any publish or platform pin.
