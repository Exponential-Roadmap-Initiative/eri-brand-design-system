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
| `EriStatusBadge` | App status pill (ALPHA / BETA / PREVIEW / LIVE) |
| `EriContactUsButton` | Accent Lime CTA linking to the shared contact service |
| `EriAppHeader` | Canonical 64px fixed dark header |
| `EriAppFooter` | Canonical dark footer with confirmed nav links |
| `EriHeroSection` | Full-viewport hero section |
| `EriPageLayout` | Layout wrapper — renders header + footer once |

---

## Update workflow

When a component is updated in the BDS:

1. The BDS task edits the file in `packages/eri-components/src/`, runs `pnpm build:css` to rebuild `dist/eri-components.css`, and saves a checkpoint (which pushes to this GitHub repo)
2. Each ERI site picks up the change on its next deploy automatically (pnpm resolves the GitHub URL at install time)
3. To force an immediate update without waiting for a deploy, run `pnpm update @eri/components` in the target project

---

## Scope

These components apply to **public-facing ERI product apps** only (Taxonomy, Professional Services Matrix, HAL, and future apps). The BDS site itself is explicitly exempt — it uses its own `PublicLayout` with a white header appropriate for a reference document.
