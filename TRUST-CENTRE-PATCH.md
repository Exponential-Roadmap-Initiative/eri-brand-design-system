# Trust Centre — Three-Fix Patch (2026-05-27)

**For:** AI agents applying targeted fixes to `trust.exponentialroadmap.org`  
**Applies to:** An existing Trust Centre project that already has `@eri/components` installed and `EriPageLayout` wired.  
**Prerequisite:** Run `pnpm update @eri/components` first to ensure you are on `v2.16.1`.

> **How to use this document.** Apply Fix A, Fix B, and Fix C in order. Then run the T6 verification. Then create the `bds-meta.json` file. Do not skip any step.

---

## Fix A — Add `headerTheme="auto"` to `EriPageLayout`

**File:** `client/src/App.tsx`

**What to change:** Find the `<EriPageLayout>` call. It currently has `showThemeToggle={true}` but is missing `headerTheme="auto"`. Add `headerTheme="auto"` on the line immediately after `showThemeToggle={true}`.

**Before:**
```tsx
<EriPageLayout
  appName="Trust Centre"
  status="LIVE"
  version="V.2026.05.27"
  showCTA={true}
  showThemeToggle={true}
  source="trust"
  sourceLabel="Trust Centre"
  returnUrl={...}
  ...
>
```

**After:**
```tsx
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
  ...
>
```

**Why:** Without `headerTheme="auto"`, the header background is always `#232323` (dark). When the user clicks the theme toggle and switches to light mode, the page content goes light but the header stays dark. The toggle appears broken. `headerTheme="auto"` makes the header respond: `#232323` in dark mode, `#FFFFFF` in light mode.

---

## Fix B — Change `returnUrl` to the hardcoded canonical production URL

**File:** `client/src/App.tsx`

**What to change:** Find the `returnUrl` prop on `<EriPageLayout>`. Change it from `window.location.origin` (or any dynamic value) to the hardcoded string `"https://trust.exponentialroadmap.org"`.

**Before (wrong):**
```tsx
returnUrl={window.location.origin}
```

**After (correct):**
```tsx
returnUrl="https://trust.exponentialroadmap.org"
```

**Why:** `window.location.origin` resolves to `http://localhost:3000` during development. When the Contact Us form submits in production, it redirects back to `http://localhost:3000` — a dead URL. The `returnUrl` must always be the hardcoded canonical production URL so the redirect works in every environment.

---

## Fix C — Restart dev server and hard-reload to flush the Vite cache

After saving the changes from Fix A and Fix B, run these commands:

```bash
# 1. Stop the dev server (Ctrl+C if running in foreground, or kill the process)
# 2. Restart it
pnpm dev

# 3. In the browser, hard-reload to flush the Vite pre-bundle cache:
#    Mac:     Cmd + Shift + R
#    Windows: Ctrl + Shift + R
#    Or open DevTools → Network tab → check "Disable cache" → reload
```

**Why:** Vite pre-bundles dependencies on first start. If `@eri/components` was updated or reinstalled, the old pre-bundled version may be served from `.vite/deps/` until the server restarts. A hard-reload clears the browser cache on top of this.

---

## T6 — Browser verification (mandatory before marking task complete)

Do not mark this task complete until all five checks pass:

| # | Check | Expected result |
|---|---|---|
| T6.1 | Open the app in the browser | Page loads without console errors |
| T6.2 | Default state (dark mode) | Header background is `#232323` (dark) |
| T6.3 | Click the theme toggle (☀️ icon in the header) | Header background changes to `#FFFFFF` (white) |
| T6.4 | Page content in light mode | Page background is light (`#F9FAFB`), all text is readable |
| T6.5 | Click the theme toggle again (🌙 icon) | Header and page both return to dark mode |

If T6.3 fails (header stays dark after clicking the toggle), Fix A was not applied correctly — `headerTheme="auto"` is missing or the server was not restarted.

If T6.4 fails (page stays dark), the `ThemeContext` is not wired correctly — check that `ThemeProvider` wraps the app in `main.tsx` and that the `eri-theme-change` custom event listener is present.

---

## Create `client/public/bds-meta.json`

The Trust Centre is the only registered ERI project missing this file. Create it at `client/public/bds-meta.json` with this exact content, filling in the compliance fields honestly:

```json
{
  "schemaVersion": "1.3",
  "appName": "Trust Centre",
  "appDomain": "trust.exponentialroadmap.org",
  "eriComponentsPin": "v2.16.1",
  "lastUpdated": "2026-05-27",
  "updatedBy": "Manus",
  "overallStatus": "green",
  "components": {
    "EriPageLayout": {
      "used": true,
      "version": "v2.16.1",
      "violations": []
    },
    "EriAppHeader": {
      "used": true,
      "version": "v2.16.1",
      "violations": []
    },
    "EriAppFooter": {
      "used": true,
      "version": "v2.16.1",
      "violations": []
    },
    "EriHeroSection": {
      "used": true,
      "version": "v2.16.1",
      "violations": []
    },
    "EriStatusBadge": {
      "used": true,
      "version": "v2.16.1",
      "violations": []
    },
    "EriContactUsButton": {
      "used": false,
      "version": "v2.16.1",
      "violations": []
    },
    "EriCrocodileChart": {
      "used": false,
      "version": "v2.16.1",
      "violations": []
    }
  },
  "systemOps": {
    "hasProjectContextMd": true,
    "bdsMdReadAtTaskStart": true,
    "projectContextReadAtTaskStart": true,
    "bdsMdLiveUrl": "https://bds.exponentialroadmap.org/api/skill/latest"
  },
  "brand": {
    "primaryGreenHex3ba559": true,
    "accentLimeHex93E07D": true,
    "bodyTextHex383838": true,
    "headingFontArchivo800": true,
    "bodyFontOpenSans400": true,
    "ctaShapeRoundedLg": true,
    "noHardcodedGreys": true
  },
  "layout": {
    "eriPageLayoutUsedInAppTsx": true,
    "noDirectEriAppHeaderImport": true,
    "noDirectEriAppFooterImport": true,
    "heroSectionNoPt16Wrapper": true,
    "nonHeroPagesHavePt16": true,
    "pageBackgroundBgBackground": true
  },
  "antiAi": {
    "noBlacklistedCopyWords": true,
    "noPurpleGradientOrSparkles": true,
    "ctasDescribeOutcome": true,
    "statisticsAreReal": true,
    "noIdenticalSectionSequence": true
  }
}
```

**Notes on filling in the compliance fields:**
- Set `"used": false` for any component the Trust Centre does not use.
- Set `"violations": ["description"]` for any known violation — do not leave violations undocumented.
- Set `overallStatus` to `"red"` if any `used: true` component has violations. Set to `"amber"` if there are known issues being worked on. Set to `"green"` only if all checks pass.
- The tracker at `https://bds.exponentialroadmap.org/tracker` reads this file every time the page loads. It will display the Trust Centre's compliance score automatically.

---

## Verification commands

```bash
# Confirm @eri/components is on v2.16.1
cat package.json | grep eri/components

# Confirm headerTheme="auto" is present
grep -n "headerTheme" client/src/App.tsx

# Confirm returnUrl is hardcoded
grep -n "returnUrl" client/src/App.tsx

# Confirm bds-meta.json exists and is valid JSON
cat client/public/bds-meta.json | python3 -m json.tool

# TypeScript check — must be 0 errors
pnpm check
```
