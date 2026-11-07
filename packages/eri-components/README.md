# @eri/components

Canonical shared UI components for all Exponential Roadmap Initiative web applications.

**Source of truth:** This package lives inside the [ERI Brand Design System repository](https://github.com/Exponential-Roadmap-Initiative/eri-brand-design-system/tree/main/packages/eri-components). All changes to these components are made in the BDS project and automatically propagate to all ERI sites on their next deploy.

---

## Installation

Pin to a stable release (recommended):

```bash
pnpm add "github:Exponential-Roadmap-Initiative/eri-brand-design-system#v2.9.0&path:packages/eri-components"
```

Or track latest (auto-updates on each deploy):

```bash
pnpm add "github:Exponential-Roadmap-Initiative/eri-brand-design-system#main&path:packages/eri-components"
```

---

## Required: Import the Pre-Built CSS

In your project's global stylesheet (e.g. `client/src/index.css`), add this line **before** your own styles:

```css
@import "@eri/components/dist/eri-components.css";
```

This is required for all ERI projects using Tailwind 4. Without it, the `EriAppHeader` and `EriAppFooter` components will render in the DOM but be invisible, because Tailwind 4 does not scan `node_modules` by default.

---

## Usage

```tsx
import { EriPageLayout, EriHeroSection, EriStatusBadge, EriContactUsButton } from '@eri/components';
```

Wrap your router in `EriPageLayout` in `App.tsx`:

```tsx
<EriPageLayout
  appName="Your App Name"
  status="BETA"
  version="V.2026.04.17"
  showCTA={!isAuthenticated}
  source="your-app-id"
  sourceLabel="Your App Name"
  returnUrl={window.location.href}
  footerTagline="Your app tagline."
>
  {/* your routes here */}
</EriPageLayout>
```

---

## Components

| Component | Purpose |
|---|---|
| `EriStatusBadge` | App status pill (ALPHA / BETA / PREVIEW; no badge = live) |
| `EriContactUsButton` | Accent Lime CTA linking to the shared contact service |
| `EriAppHeader` | Canonical 64px fixed dark header |
| `EriAppFooter` | Canonical dark footer with confirmed nav links |
| `EriHeroSection` | Full-viewport hero section |
| `EriPageLayout` | Layout wrapper — renders header + footer once |
| `EriBarChart` | One series of bars, shared scale, optional limit line |
| `EriFigureList` | Card of key figures with a standing word |
| `EriTabs` | Small pill switch inside a page tab |
| `EriDataTable` | The one data table of ERI's applications (below) |
| `EriStateMessage` | Loading, empty, error and restricted messages (`StateMessage` is the same component) |

### EriDataTable

One table for every list in ERI's applications; a page never builds its own. Declare the columns; the table draws the search, a quick filter per
`select` column, "only" toggles, chips, sortable headings, row groups, a row that opens (`rowHref`), Columns, Export and paging. The view (search,
filters, sort, page, chosen columns) lives in the page's address under `urlKey`, so a filtered view can be shared and Back undoes a change.

```tsx
import { EriDataTable, type ColumnSpec } from '@eri/components';

const columns: ColumnSpec<Row>[] = [
  { key: 'action', label: 'Action', value: r => r.id, text: r => `${r.id} ${r.title}`, filter: 'search', width: 300 },
  { key: 'result', label: 'Result', type: 'grade', value: r => r.result, filter: 'select', width: 160 },
  { key: 'why', label: 'Why', value: r => r.reason, width: 360, priority: 'low' },   // folds under the first cell on phones
];
<EriDataTable columns={columns} rows={rows} rowKey={r => r.id} urlKey="actions" noun="actions" singular="action" label="Actions" />
```

- **Server paging:** pass `total` (rows matching the view on the server) and `onViewChange(state)`; `rows` is then the one page the server sent.
  The table calls `onViewChange` when it first shows and on every change of search, filters, sort, page or page-level filters. Give a select
  column its `options`, since one page cannot list them; with `exportable`, the server makes the file through `onExport(state)`.
- **Page-level filters:** put them in `toolbar` (they sit first in the filter row); keep their value in the address with
  `useEriTableParam(urlKey, name)` and `setEriTableParam(urlKey, name, value)` (stored as `<urlKey>.p.<name>`; a change returns to page 1).
- **Loading and errors:** `loading` (a message while there are no rows; with rows, they stay and are marked as updating), `error` and `onRetry`.
- **Phone layout:** at 40rem and narrower, a column with `priority: "low"` is not drawn as a column; its label and value fold into one line
  under the first cell. A table with no low column looks the same at every width.
- **Filters from outside:** `setEriTableFilter(urlKey, column, values)` and `useEriTableFilter(urlKey, column)` (a chart that filters its table).
- **Tokens:** the table reads `--eri-dt-*` names, which default to the shared semantic tokens (`--foreground`, `--card`, `--border`, `--primary`…).
  An app with its own token names maps them once on `.eri-dt, .eri-state`.

---

## Update workflow

When a component is updated in the BDS:

1. The BDS task edits the file in `packages/eri-components/src/`, runs `pnpm build:css` to rebuild `dist/eri-components.css`, and saves a checkpoint (which pushes to this GitHub repo)
2. Each ERI site picks up the change on its next deploy automatically (pnpm resolves the GitHub URL at install time)
3. To force an immediate update without waiting for a deploy, run `pnpm update @eri/components` in the target project

---

## Scope

These components apply to **public-facing ERI product apps** only (Taxonomy, Professional Services Matrix, HAL, and future apps). The BDS site itself is explicitly exempt — it uses its own `PublicLayout` with a white header appropriate for a reference document.
