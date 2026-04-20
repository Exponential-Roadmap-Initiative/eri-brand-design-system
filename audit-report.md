# ERI BDS Consistency Audit Report
Generated: 2026-04-20

## Methodology
Every prop, rule, and code example in the `eri-bds-reference` skill was cross-checked against:
1. The actual TypeScript source of all six components in `packages/eri-components/src/`
2. The BDS site (`client/src/pages/BrandDesignSystem.tsx`) prop tables and code snippets

---

## SKILL: `eri-bds-reference/SKILL.md`

### Issue 1 — bds-meta.json schema example uses stale component names
**Location:** `bds-meta.json` schema example block (near end of skill)
**Current:**
```json
"EriNavDrawer":   { "used": true, "compliant": true },
"EriFooter":      { "used": true, "compliant": true }
```
**Actual canonical names:** `EriAppHeader`, `EriPageLayout`, `EriHeroSection`, `EriAppFooter`, `EriStatusBadge`, `EriContactUsButton`
**Fix:** Replace `EriNavDrawer` and `EriFooter` with the six canonical component names.

### Issue 2 — Registered ERI projects table uses wrong PSM name
**Location:** "Registered ERI projects" table
**Current:** `Planetary Stewardship Monitor`
**Correct:** `Professional Services Matrix`
**Fix:** Update display name.

### Issue 3 — overallStatus rules in skill do not match tracker's computed logic
**Location:** `overallStatus rules` section
**Current:** `"red"` — any component has `compliant: false`, or `knownViolations` is non-empty
**Actual tracker logic:** `knownViolations` entries for `used: false` components are ignored. Only violations referencing a `used: true` component trigger red.
**Fix:** Update the rule to: `"red"` — any `used: true` component has `compliant: false`, or `knownViolations` contains entries for `used: true` components.

### Issue 4 — EriPageLayout RULES comment in skill omits `contactSubject` and `footerAttribution` props
**Location:** EriPageLayout props list (line ~85)
**Current:** `Props: appName, status?, version, showCTA?, source?, sourceLabel?, returnUrl?, footerTagline?, children`
**Missing from skill:** `contactSubject?`, `footerAttribution?`, `logoHref?`
**Fix:** Add the three missing props to the props list.

### Issue 5 — EriAppHeader props list in skill omits `contactSubject` and `logoHref`
**Location:** EriAppHeader component description (line ~79)
**Current:** `Props: appName, status?, version, showCTA?, source?, sourceLabel?, returnUrl?, onMenuClick`
**Missing:** `contactSubject?`, `logoHref?`
**Fix:** Add the two missing props.

### Issue 6 — EriContactUsButton props list in skill is absent
**Location:** EriContactUsButton component description
**Current:** No props listed — only the component name and a brief description
**Actual props:** `source`, `sourceLabel`, `returnUrl`, `subject?`, `size?`, `className?`
**Fix:** Add props list.

### Issue 7 — EriStatusBadge props list in skill is absent
**Location:** EriStatusBadge component description
**Current:** No props listed
**Actual props:** `status` (EriStatusValue: ALPHA | BETA | PREVIEW | LIVE), `theme?` ('dark' | 'light'), `className?`
**Fix:** Add props list.

### Issue 8 — EriAppFooter props list in skill is absent
**Location:** EriAppFooter component description
**Current:** No props listed
**Actual props:** `appName`, `tagline?`, `attribution?`
**Fix:** Add props list.

### Issue 9 — Header anatomy code example uses `<AppHeader>` not `<EriPageLayout>`
**Location:** Surface-Based Tier Model implementation example (line ~314)
**Current:**
```jsx
<EriPageLayout showCTA={true} source="myapp" sourceLabel="My App" returnUrl="https://myapp.exponentialroadmap.org" />
```
This is correct after the recent fix but the `<AppHeader>` reference in the surrounding prose (line ~313) should also be updated to `<EriPageLayout>`.
**Fix:** Update prose reference from "shared `<AppHeader />` component" to "`EriPageLayout`".

### Issue 10 — `EriPageLayout` does NOT add `pt-16` — but skill does not mention this
**Location:** Component rules section
**Source comment:** "EriPageLayout does NOT add pt-16 — pages must clear the fixed 64px header themselves"
**Skill:** Does not mention this at all — a common pitfall for implementing projects
**Fix:** Add a note: "Each page must add `pt-16` (or equivalent) to its outermost div to clear the fixed 64px header. `EriPageLayout` does not add this padding."

### Issue 11 — `--eri-content-inset` CSS variable requirement not mentioned in skill
**Location:** Component rules section
**Source comment:** "The `--eri-content-inset` CSS variable must be defined in index.css"
**Skill:** Does not mention this requirement
**Fix:** Add: "Add to `index.css`: `:root { --eri-content-inset: clamp(1rem, 3vw, 2rem); }`"

### Issue 12 — `EriPageLayout` background colour not mentioned in skill
**Location:** Component rules
**Source:** `EriPageLayout` sets `backgroundColor: '#232323'` on the outer shell
**Source comment:** "Each page's outermost div must set its own background (e.g. bg-[#F9FAFB]) — the layout wrapper sets #232323 on the outer shell; pages must override this for their own content area"
**Skill:** Does not mention this — pages that omit their own background will appear dark
**Fix:** Add this note to the component rules.

---

## BDS SITE: `client/src/pages/BrandDesignSystem.tsx`

### Issue A — `EriAppHeader` prop table still missing `logoHref`
**Location:** EriAppHeader prop table (line ~3484)
**Current:** Has `appName`, `status`, `version`, `showCTA`, `source`, `sourceLabel`, `returnUrl`, `contactSubject`, `onMenuClick`
**Missing:** `logoHref?` (string, defaults to "/")
**Fix:** Add `logoHref` row.

### Issue B — `EriPageLayout` prop table missing `footerAttribution` and `logoHref`
**Location:** EriPageLayout prop table (line ~3710 area)
**Current:** Needs verification — prop table was added in this session
**Fix:** Verify and add missing props if absent.

### Issue C — Machine Instructions section may still reference old component names
**Location:** Machine Instructions / AI instructions section
**Needs check:** Whether `EriNavDrawer` or `EriFooter` appear anywhere in the Machine Instructions
**Fix:** Replace any stale names with canonical six.

---

## Summary Table

| # | Source | Severity | Description |
|---|---|---|---|
| 1 | Skill | **Critical** | bds-meta.json schema uses stale component names (EriNavDrawer, EriFooter) |
| 2 | Skill | **High** | PSM registered name wrong (Planetary Stewardship Monitor → Professional Services Matrix) |
| 3 | Skill | **High** | overallStatus red rule ignores used:false distinction |
| 4 | Skill | Medium | EriPageLayout props list missing contactSubject, footerAttribution, logoHref |
| 5 | Skill | Medium | EriAppHeader props list missing contactSubject, logoHref |
| 6 | Skill | Medium | EriContactUsButton has no props list |
| 7 | Skill | Medium | EriStatusBadge has no props list |
| 8 | Skill | Medium | EriAppFooter has no props list |
| 9 | Skill | Low | Prose reference to "shared AppHeader component" should say EriPageLayout |
| 10 | Skill | **High** | pt-16 requirement not documented — pages will have content hidden under header |
| 11 | Skill | **High** | --eri-content-inset CSS variable requirement not documented |
| 12 | Skill | **High** | EriPageLayout outer shell #232323 background not documented — pages may appear dark |
| A | BDS site | Medium | EriAppHeader prop table missing logoHref |
| B | BDS site | Medium | EriPageLayout prop table needs verification for footerAttribution and logoHref |
| C | BDS site | **Critical** | Machine Instructions may still reference EriNavDrawer/EriFooter |
