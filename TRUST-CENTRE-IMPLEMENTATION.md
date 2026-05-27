# Trust Centre — ERI Brand Implementation Instructions

**Version:** 1.0 (2026-05-27)  
**For:** AI agents implementing or maintaining `trust.exponentialroadmap.org`  
**Status:** LIVE  
**@eri/components pin:** `v2.16.1`

---

> **How to use this document.** Follow the numbered steps in order. Every value in this document is exact — do not approximate, infer, or substitute. If a step says "copy this exactly", copy it exactly.

---

## Step 1 — Install the component package

Run this command in the project root:

```bash
pnpm add "github:Exponential-Roadmap-Initiative/eri-brand-design-system#v2.16.1&path:packages/eri-components"
```

This installs `@eri/components` from the ERI GitHub monorepo. The `#v2.16.1` pin is the current stable release. Do not use `#main` — it may contain unreleased changes.

---

## Step 2 — Add the CSS import

Open `client/src/index.css`. Add this line **at the very top**, before any other imports:

```css
@import "@eri/components/dist/eri-components.css";
```

**Why this matters:** Tailwind 4 does not scan `node_modules`. Without this import, every `@eri/components` component will render in the DOM but be completely invisible — no layout, no colours, no typography. This is the single most common failure point.

---

## Step 3 — Add the CSS variable

Open `client/src/index.css`. Inside the `:root {}` block, add:

```css
:root {
  --eri-content-inset: clamp(1rem, 3vw, 2rem);
}
```

**Why this matters:** This variable aligns the ERI logo in the header with the hero text block. Without it, the horizontal alignment is broken.

---

## Step 4 — Add the FOLC-prevention script

Open `client/index.html`. Add this `<script>` block as the **first child of `<head>`**, before any other tags:

```html
<script>
  (function() {
    try {
      var theme = localStorage.getItem('eri-theme') || 'dark';
      if (theme === 'dark') document.documentElement.classList.add('dark');
    } catch(e) {}
  })();
</script>
```

**Why this matters:** Without this, the page flashes white (light mode) for ~200ms before React hydrates and applies the dark theme. This is called a Flash of Light Content (FOLC). The script runs synchronously before any paint.

---

## Step 5 — Add the canonical CSS token block

Open `client/src/index.css`. Add this block **after** the `@import "@eri/components/dist/eri-components.css";` line and **before** your own styles:

```css
:root {
  --background: oklch(0.97 0.003 247);         /* #F9FAFB — light page bg */
  --foreground: oklch(0.24 0.005 285);          /* #383838 — body text on light bg */
  --card: oklch(1 0 0);                         /* #FFFFFF — card surface light */
  --card-foreground: oklch(0.24 0.005 285);     /* #383838 */
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.24 0.005 285);
  --muted: oklch(0.95 0.002 247);               /* #F3F4F6 */
  --muted-foreground: oklch(0.55 0.01 247);     /* #8B8FA8 */
  --border: oklch(0.88 0.005 247);              /* #E5E7EB */
  --accent: oklch(0.95 0.002 247);
  --accent-foreground: oklch(0.24 0.005 285);
  --eri-content-inset: clamp(1rem, 3vw, 2rem);
}

.dark {
  --background: oklch(0.10 0 0);               /* #111111 — dark page bg */
  --foreground: oklch(0.93 0.005 247);          /* #ECEEF2 — body text on dark bg */
  --card: oklch(0.14 0 0);                      /* #1a1a1a — card surface dark */
  --card-foreground: oklch(0.93 0.005 247);
  --popover: oklch(0.14 0 0);
  --popover-foreground: oklch(0.93 0.005 247);
  --muted: oklch(0.18 0 0);                     /* #232323 — muted dark */
  --muted-foreground: oklch(0.65 0.01 247);     /* #9A9EAA — secondary text dark (AAA) */
  --border: oklch(0.28 0 0);                    /* #3d3d3d — visible borders dark */
  --accent: oklch(0.18 0 0);
  --accent-foreground: oklch(0.93 0.005 247);
}
```

**Why this matters:** These are the canonical ERI semantic tokens. Every structural element in the Trust Centre must use these tokens (e.g. `bg-background`, `text-foreground`, `bg-card`) — never hardcoded hex values for structural colours. The tokens resolve correctly in both dark and light mode.

---

## Step 6 — Add the ThemeContext

Create `client/src/contexts/ThemeContext.tsx` with this exact content:

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('eri-theme') as Theme) || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('eri-theme', theme);
    } catch {}
  }, [theme]);

  // Listen for cross-tab theme changes (storage event)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'eri-theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
        setTheme(e.newValue);
      }
    };
    // Listen for same-tab theme changes (custom event from EriAppHeader)
    const handleCustom = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.theme === 'dark' || detail?.theme === 'light') {
        setTheme(detail.theme);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('eri-theme-change', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('eri-theme-change', handleCustom);
    };
  }, []);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

**Critical details:**
- The `localStorage` key is `'eri-theme'` — this exact string is shared across all ERI apps for cross-site persistence.
- The default is always `'dark'` — ERI apps default to dark mode as an energy-efficiency statement.
- The `eri-theme-change` custom event listener is required — without it, the header toggle will not update the page theme in the same tab (the `storage` event only fires in other tabs).

---

## Step 7 — Wrap the app in ThemeProvider

Open `client/src/main.tsx`. Wrap the app in `<ThemeProvider>`:

```tsx
import { ThemeProvider } from './contexts/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
```

---

## Step 8 — Wire EriPageLayout in App.tsx

Open `client/src/App.tsx`. This is the exact pattern for the Trust Centre:

```tsx
import { useState } from 'react';
import { EriPageLayout } from '@eri/components';
import { NavDrawer } from './components/NavDrawer'; // your drawer component
import { Router } from './Router'; // your page router

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <EriPageLayout
      appName="Trust Centre"
      status="LIVE"
      version="V.2026.05.27"
      showCTA={true}
      showThemeToggle={true}
      headerTheme="auto"
      source="trust"
      sourceLabel="Trust Centre"
      returnUrl="https://trust.exponentialroadmap.org"
      footerTagline="Transparency, security, and accountability for the ERI platform."
      onMenuClick={() => setMenuOpen(true)}
    >
      <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Router />
    </EriPageLayout>
  );
}
```

**Every prop explained:**

| Prop | Value | Why |
|---|---|---|
| `appName` | `"Trust Centre"` | Exact canonical name — do not change |
| `status` | `"LIVE"` | Trust Centre is live |
| `version` | `"V.YYYY.MM.DD"` | Update to today's date on each release |
| `showCTA` | `{true}` | Always true — Contact Us must be visible on all surfaces |
| `showThemeToggle` | `{true}` | Always true — users must be able to switch themes |
| `headerTheme` | `"auto"` | **Required with `showThemeToggle={true}`.** Without this, the header stays dark even when the user switches to light mode. `"auto"` = `#232323` in dark mode, `#FFFFFF` in light mode. |
| `source` | `"trust"` | Canonical stable ID — never change |
| `sourceLabel` | `"Trust Centre"` | Shown on the contact page hero |
| `returnUrl` | `"https://trust.exponentialroadmap.org"` | Contact page returns here after submission |
| `footerTagline` | your tagline | One line, max 80 chars |
| `onMenuClick` | `() => setMenuOpen(true)` | Wires the hamburger to your drawer |

---

## Step 9 — Add the hero section

The Trust Centre **must** use `ERI_HERO_IMAGE_TRUST`. This is mandatory — do not use `ERI_HERO_IMAGE_DEFAULT` or any other image.

```tsx
import { EriHeroSection, ERI_HERO_IMAGE_TRUST } from '@eri/components';

function HomePage() {
  return (
    <div className="bg-background">
      <EriHeroSection
        eyebrow="Trust Centre"
        titleLine1="Security, Transparency,"
        titleLine2="Accountability"
        body="How ERI protects your data, maintains platform integrity, and upholds its commitments to every stakeholder."
        primaryCTA={{ label: "View our commitments", href: "#commitments" }}
        secondaryCTA={{ label: "Contact us", href: "https://contact-us.exponentialroadmap.org/?source=trust&sourceLabel=Trust%20Centre&return=https%3A%2F%2Ftrust.exponentialroadmap.org" }}
        backgroundImage={ERI_HERO_IMAGE_TRUST}
        showScrollIndicator
      />
      {/* page content below */}
    </div>
  );
}
```

**Critical details:**
- `backgroundImage={ERI_HERO_IMAGE_TRUST}` — mandatory for the Trust Centre.
- Do **not** wrap `EriHeroSection` in a `pt-16` div — the component adds `paddingTop: 64px` internally. Adding `pt-16` doubles the clearance to 128px.
- The page wrapper `div` must have `bg-background` — without it, the `#232323` outer shell of `EriPageLayout` shows through.

---

## Step 10 — Add top padding to every non-hero page

For every page that does **not** start with `EriHeroSection`, add `pt-16` to the outermost div:

```tsx
function TrustPolicyPage() {
  return (
    <div className="bg-background pt-16">
      {/* content */}
    </div>
  );
}
```

**Why:** `EriPageLayout` does not add top padding. The header is `position: fixed` at 64px (`pt-16` = 4rem = 64px). Without this, the first content element is hidden behind the header.

---

## Step 11 — Structural colour rules

**Never use these for structural backgrounds, text, or borders:**

```
bg-white       bg-gray-50     bg-gray-100    bg-[#F9FAFB]
text-gray-900  text-gray-800  text-[#383838] text-[#232323]
border-gray-200
style={{ backgroundColor: '#F9FAFB' }}
style={{ color: '#383838' }}
```

**Always use these semantic tokens for structural elements:**

| Purpose | Class |
|---|---|
| Page background | `bg-background` |
| Card / panel surface | `bg-card text-card-foreground` |
| Muted / alternate row | `bg-muted` |
| Primary body text | `text-foreground` |
| Secondary / muted text | `text-muted-foreground` |
| Borders | `border-border` |

**Brand colours that CAN remain hardcoded:**

| Colour | Hex | Where |
|---|---|---|
| ERI Primary Dark | `#232323` | Hero overlay, footer background, dark section backgrounds |
| ERI Accent Lime | `#93E07D` | All filled CTA buttons |
| ERI Primary Green | `#3ba559` | Links, active states, text accents |

---

## Step 12 — Typography

**Two-font system — both must be self-hosted WOFF2 (GDPR requirement — no Google Fonts CDN):**

| Font | Use | Weight | CSS |
|---|---|---|---|
| Archivo | All headings (H1–H4) | 800 (extrabold) | `font-family: 'Archivo'; font-weight: 800;` |
| Open Sans | All body text | 400 (regular) | `font-family: 'Open Sans'; font-weight: 400;` |

Store WOFF2 files in `client/public/fonts/`. Add `@font-face` declarations in `index.css`. Do not use `<link>` tags in `index.html` for fonts.

Body text colour on light backgrounds: `#383838` (resolved via `text-foreground`).  
Body text colour on dark backgrounds: `#ECEEF2` (resolved via `text-foreground` in dark mode).  
Heading colour: `#232323` on light backgrounds (resolved via `text-foreground` in light mode for headings, or hardcode for hero/dark sections).

---

## Step 13 — CTA button shape

Every CTA button on every surface must use `rounded-lg`. Never `rounded-full`. Never `rounded-xl`.

```tsx
{/* ✅ Correct */}
<button className="bg-[#93E07D] text-[#232323] font-semibold rounded-lg px-6 py-3">
  View our commitments
</button>

{/* ❌ Wrong */}
<button className="bg-[#93E07D] rounded-full ...">...</button>
<button className="bg-[#93E07D] rounded-xl ...">...</button>
```

---

## Step 14 — Create bds-meta.json

Create `client/public/bds-meta.json`. Fetch the canonical template from:

```
https://bds.exponentialroadmap.org/tracker
```

Scroll to the "How this tracker works" section and copy the template. Then fill in the Trust Centre values:

```json
{
  "schemaVersion": "1.3",
  "appName": "Trust Centre",
  "appDomain": "trust.exponentialroadmap.org",
  "eriComponentsPin": "v2.16.1",
  "lastUpdated": "2026-05-27",
  "updatedBy": "Manus",
  "overallStatus": "green"
}
```

Fill in all the compliance fields honestly. Do not set fields to `true` unless the condition is genuinely met. The tracker at `https://bds.exponentialroadmap.org/tracker` will read this file and display the Trust Centre's compliance status.

---

## Quick verification

After implementing, run these checks:

```bash
# 1. Confirm @eri/components is installed
cat package.json | grep eri/components

# 2. Confirm CSS import is present
head -5 client/src/index.css

# 3. Confirm FOLC script is in index.html
grep -n "eri-theme" client/index.html

# 4. TypeScript check — must be 0 errors
pnpm check

# 5. Confirm bds-meta.json exists
cat client/public/bds-meta.json
```

---

## What NOT to do

| Do not | Why |
|---|---|
| Use `headerTheme="dark"` with `showThemeToggle={true}` | Header stays dark even in light mode — the toggle appears to do nothing |
| Omit `showThemeToggle` | Users cannot switch themes |
| Use `ERI_HERO_IMAGE_DEFAULT` on the Trust Centre | Trust Centre must use `ERI_HERO_IMAGE_TRUST` |
| Use `ERI_HERO_IMAGE_HANDS` | Deprecated — do not use in new projects |
| Wrap `EriHeroSection` in `pt-16` | Doubles the header clearance to 128px |
| Import `EriAppHeader` or `EriAppFooter` directly in page files | They are rendered once by `EriPageLayout` — importing them again duplicates the header/footer |
| Use `bg-white`, `bg-gray-50`, `text-gray-900` for structural elements | Breaks dark mode — use semantic tokens |
| Use `showCTA={!isAuthenticated}` | Incorrectly hides the CTA from logged-in users |
| Build a custom contact form | Always link to `https://contact-us.exponentialroadmap.org` |
| Use Google Fonts CDN for typography | GDPR violation — self-host WOFF2 files only |
| Use `rounded-full` or `rounded-xl` on CTA buttons | ERI CTA shape is always `rounded-lg` |
