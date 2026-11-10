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
  showCTA
  source="your-app-id"
  sourceLabel="Your App Name"
  returnUrl={window.location.href}
  footerTagline="Your app tagline."
>
  {/* your routes here */}
</EriPageLayout>
```

Pass `showCTA` on public pages. Pass `showCTA={false}` on the ERI Platform and CPR (Nicklas, 10 Nov 2026) and in internal admin tools. **Never** pass `showCTA={!isAuthenticated}`.

### The menu panel, the app sidebar and the breadcrumb (2.20.0)

Pass `menu` and the layout draws the one menu panel — a bare ☰ at the far right of the header opens it from the right — and, if you list `appSections`, a 224px sidebar on the left of the page on desktop:

```tsx
<EriPageLayout
  appName="Climate Performance Review"
  status="BETA"
  version="V.2026.11.10"
  showCTA={false}
  showThemeToggle
  headerTheme="auto"
  mainId="main"
  menu={{
    platformLinks: [{ label: 'Home', href: '/' }, { label: 'Data Lake', href: '/data-sources', current: false }],
    appTitle: 'This application · CPR',
    appSections: [{ title: 'CPR application', links: [{ label: 'Overview', href: '/cpr', current: true }] }],
    account: <YourSignInControl />,   // "Your access" / "Sign in": the package has no sign-in of its own
    linkComponent: YourRouterLink,     // optional: client-side navigation
  }}
>
  <EriBreadcrumbBar items={[{ label: 'ERI Platform', href: '/' }, { label: 'Applications', href: '/applications' }, { label: 'CPR' }]} />
  {/* the page: no <main> of its own, the layout draws it */}
</EriPageLayout>
```

- At 800px and below the sidebar is hidden and the same `appSections` are the first block of the panel (they never stack above the page).
- Below 640px the header leaves out the status badge, version and Contact Us; the panel carries them.
- `clearHeader` (default true with `menu`) starts the page under the fixed header with `padding-top: var(--eri-header-height)`; the token is 64px from 640px up and 73px below.
- `EriBreadcrumbBar` is the one breadcrumb position: 16px under the header, at `--eri-content-inset`.
- Header colours are tokens with the ERI standard as default: `--eri-header-bg` (#232323), `--eri-header-ink` (#ffffff), `--eri-header-muted` (#9ca3af) and a `-light` pair for `headerTheme="auto"`. Define them in your own CSS to override; nothing changes if you do not.

---

## Components

| Component | Purpose |
|---|---|
| `EriStatusBadge` | App status pill (ALPHA / BETA / PREVIEW; no badge = live) |
| `EriContactUsButton` | Accent Lime CTA linking to the shared contact service |
| `EriAppHeader` | Canonical 64px fixed dark header (two rows, 73px, on phones) |
| `EriAppFooter` | Canonical dark footer with confirmed nav links |
| `EriHeroSection` | Full-viewport hero section |
| `EriPageLayout` | Layout wrapper — renders header + footer once; with `menu`, also the menu panel and the app sidebar |
| `EriNavDrawer` | The one menu panel, opened from the right by the header's ☰ (drawn by `EriPageLayout` when you pass `menu`) |
| `EriAppSidebar` | An app's own sections, 224px on the left; hidden at 800px and below, where the panel carries them |
| `EriBreadcrumbBar` | One breadcrumb position for every page |

---

## Update workflow

When a component is updated in the BDS:

1. The BDS task edits the file in `packages/eri-components/src/`, runs `pnpm build:css` to rebuild `dist/eri-components.css`, and saves a checkpoint (which pushes to this GitHub repo)
2. Each ERI site picks up the change on its next deploy automatically (pnpm resolves the GitHub URL at install time)
3. To force an immediate update without waiting for a deploy, run `pnpm update @eri/components` in the target project

---

## Scope

These components apply to **public-facing ERI product apps** only (Taxonomy, Professional Services Matrix, HAL, and future apps). The BDS site itself is explicitly exempt — it uses its own `PublicLayout` with a white header appropriate for a reference document.
