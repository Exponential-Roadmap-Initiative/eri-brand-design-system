# ERI Brand Design System — Project Context

**READ THIS FILE FIRST.** Before taking any action on this project, read this file in full.
It is the single source of truth for all project decisions, known errors, and canonical values.
Do not rely on memory of previous sessions — context compaction removes that history.

---

## What this project is

The `eri-brand-design-system` project has two outputs:

1. **The BDS site** (`bds.exponentialroadmap.org`) — a live reference documentation site for the ERI Brand Design System. It mirrors the canonical brand reference and is the primary resource for developers building ERI applications.

2. **The `eri-bds-reference` skill** (`/home/ubuntu/skills/eri-bds-reference/SKILL.md`) — a structured AI-readable skill that Manus reads before working on any ERI project. It must stay in sync with the BDS site and the component source.

The `@eri/components` package (`packages/eri-components/`) is the component library that both the BDS site documents and consumes as a live preview dependency.

---

## Canonical colour values — non-negotiable

These are the ground-truth values. If any document, skill, or code contradicts these, the document is wrong.

| Token | Hex | Usage |
|---|---|---|
| Primary Green | `#3ba559` | Links, active states, text accents — **NOT for filled buttons or CTAs** |
| Primary Dark | `#232323` | **Headings (H1–H4)**, footer background, dark section backgrounds, hero overlay base colour |
| **Dark Gray** | **`#383838`** | **Standard body paragraph text on white/light backgrounds** — this is NOT `#232323` |
| Neutral Gray | `#6b7280` | Secondary text, borders, disabled states |
| Off White | `#F9FAFB` | Page background, card background, light section background |
| Accent Lime | `#93E07D` | **All filled CTA buttons** on every surface; heading accent words on dark/hero backgrounds |
| Highlight Yellow | `#F5C842` | Data highlights, chart callouts — introduced in Playbook v5 |
| LinkedIn Blue | `#007BB6` | LinkedIn icon background only — no other use |
| YouTube Red | `#A82400` | YouTube icon background only — no other use |

**The `#232323` / `#383838` distinction is intentional and must be preserved everywhere:**
- `#232323` = headings, footer background, dark section backgrounds, hero overlay
- `#383838` = body paragraph text on white/light backgrounds
- Any rule that says "use `#232323` for body text" is a stale error and must be corrected immediately.

---

## Canonical typography rules

- **Heading font:** Archivo — Google Fonts CDN only, never local files
- **Body font:** Open Sans — Google Fonts CDN
- **Heading weight:** `font-extrabold` (800) for all H1–H3
- **Body:** 16px / Open Sans 400 / line-height 1.6 / colour `#383838` on white/light backgrounds
- **Do not use:** `text-gray-900` for body text — use `#383838`
- **Do not use:** font-weight 600 for headings — use 800
- **Do not use:** Inter, Roboto, or any other font as primary

---

## Canonical pillar colours

| Pillar | Name | Hex |
|---|---|---|
| P1 | Cut Operational Emissions | `#9aa08c` |
| P2 | Decarbonize Value Chain | `#17b7dd` |
| P3 | Build & Scale Solutions | `#00ac58` |
| P4 | Mobilize Finance & Investment | `#ff8b00` |
| P5 | Shape Policy & Narrative | `#ff5133` |

---

## Standard components — canonical names and current version

Package: `@eri/components` — current pin: **v2.12.0**

The six canonical component names are:

| Component | Purpose |
|---|---|
| `EriAppHeader` | 64px fixed header — rendered once via `EriPageLayout` |
| `EriPageLayout` | Full-page layout wrapper — use in `App.tsx` only |
| `EriHeroSection` | Full-viewport hero section |
| `EriAppFooter` | Two-zone dark footer — rendered once via `EriPageLayout` |
| `EriStatusBadge` | Status pill badge (ALPHA / BETA / PREVIEW / LIVE) |
| `EriContactUsButton` | Accent Lime CTA linking to the shared contact service |

**There is no component called `EriNavDrawer` or `EriFooter`.** Any reference to these names is a stale error.

---

## Critical implementation rules

### EriPageLayout
- Renders `EriAppHeader` and `EriAppFooter` exactly once. Never import those directly in page files.
- Sets `backgroundColor: '#232323'` on its outer shell. Every page component must set its own background (typically `bg-[#F9FAFB]`) on its outermost div, or the page will appear dark.
- Does **NOT** add `pt-16` to the content area. Each page's first section must add enough top padding to clear the fixed 64px header (e.g. `pt-16`), unless using `EriHeroSection` which handles this internally.
- The `--eri-content-inset` CSS variable must be defined in `index.css`: `:root { --eri-content-inset: clamp(1rem, 3vw, 2rem); }`
- Hamburger button is always rendered — wire `onMenuClick` to your drawer state.

### EriHeroSection
- Adds `paddingTop: '64px'` internally — do NOT wrap it in a `pt-16` div.
- Overlay is always `rgba(35,35,35,0.82)` — never `bg-black/40` or any other overlay.
- Body text colour inside the hero is `rgba(255,255,255,0.85)` — white on dark, not `#383838`.
- Primary CTA is always Accent Lime (`#93E07D`). Secondary CTA is white outline.
- `ERI_HERO_IMAGE_HANDS` and `ERI_HERO_IMAGE_TRUST` are named exports from `@eri/components`.

### showCTA rule
- Always pass `showCTA={true}`. The Contact Us CTA must be visible on all surfaces (public and authenticated).
- Only pass `showCTA={false}` for purely internal admin tools with no contact entry point.
- Never use `showCTA={!isAuthenticated}` — this incorrectly hides the CTA from logged-in users.

### Contact Us CTA
- Three props are all required when `showCTA={true}`: `source`, `sourceLabel`, `returnUrl`.
- Omitting any one silently hides the button.

### CSS import
- Every ERI project must import `@eri/components/dist/eri-components.css` at the top of `index.css`.
- Without this, components will be invisible in Tailwind 4 projects.

---

## bds-meta.json spec

Each ERI project publishes `client/public/bds-meta.json`. The canonical schema uses the six component names above. The `overallStatus` red rule applies only to `used: true` components — violations for `used: false` components do not trigger red.

Full spec: see `bds-meta-spec.md` in this project root.

---

## Registered ERI projects

| Code | Display Name | Domain |
|---|---|---|
| BDS | Brand Design System | `bds.exponentialroadmap.org` |
| HAL | Human-AI Lab | `human-ai-lab.exponentialroadmap.org` |
| PSM | Professional Services Matrix | `psm.exponentialroadmap.org` |
| Trust | Trust Centre | `trust.exponentialroadmap.org` |
| Taxonomy | Exponential Taxonomy | `taxonomy.exponentialroadmap.org` |

**PSM = Professional Services Matrix** — never "Planetary Stewardship Monitor".

---

## Known pending work (as of 2026-04-21)

- [x] Push v2.10.8 git tag — verified on GitHub 2026-04-20
- [x] Add `footerLinks` prop to `EriAppFooter` (v2.10.8) and `EriPageLayout` pass-through (v2.10.9)
- [x] Add `bds-meta.json` ownership warning to skill pre-action checklist and BDS site tracker
- [x] Push v2.10.9 git tag — verified on GitHub 2026-04-21
- [x] Push v2.11.0 git tag — verified on GitHub 2026-04-21
- [x] Add bds-meta.json Required Project File callout card to Machine Instructions section
- [x] Fix Machine Instructions Typography Rules: add Open Sans as body font (two-font system was only showing Archivo)
- [x] Update skill pre-action checklist item 5: add /tracker URL link for canonical template
- [x] Create BDS site's own `client/public/bds-meta.json` (was missing)
- [x] Push v2.11.1 git tag — verified on GitHub 2026-04-21
- [x] Fix duplicate version display: removed Introduction section version line, header badge is canonical (APP_VERSION in App.tsx)
- [x] Fix /tracker crash: TypeError on meta?.components[c] when components field missing (Framework uses legacy schema); added optional chaining + schema validation on fetch
- [x] Update eri-bds-reference skill: new Steps 0-2 pre-action checklist (Step 0 = read Manus project instructions, Step 1 = PROJECT-CONTEXT.md for all ERI projects, Step 2 = bds-meta.json)
- [x] Add System Operations section to /tracker page: WHAT/WHY/HOW cards explaining context continuity pattern
- [x] Add PROJECT-CONTEXT.md seed template to /tracker HOW section with copy button (also fixed LATEST_VERSION stale at v2.10.9 → v2.11.1)
- [x] Add System Operations callout card (dark #232323 card with SYS OPS badge) to Machine Instructions section on main BDS page, linking to /tracker
- [x] Fix skill Gap 1 (C5): showCTA wording — now says "Pass showCTA={true} explicitly — do not rely on the default"
- [x] Fix skill Gap 2 (C6): add trust and bds to Contact Us Registered Source IDs table in skill
- [x] Add Project Alignment Checklist (S1-S3, B1-B5, C1-C7) to eri-bds-reference skill
- [x] Add Project Alignment Checklist section to /tracker page with three colour-coded tables (S/B/C) and quick shell commands
- [x] Extend bds-meta.json schema with self-reported systemOps, brand, layout compliance fields (Option A) — 2026-04-22
- [x] Update bds-meta-spec.md with new schema fields — 2026-04-22
- [x] Update eri-bds-reference skill: add new fields to schema example and checklist — 2026-04-22
- [x] Update AlignmentTracker: Checklist score column, self-reporting note, updated canonical and seed templates — 2026-04-22
- [x] Update BDS site bds-meta.json with new systemOps/brand/layout fields — 2026-04-22
- [ ] Publish BDS site (click Publish button in Management UI)
- [ ] Add `bds-meta.json` to Trust site — it is the only registered project still missing the file
- [ ] Update HAL's `bds-meta.json` to canonical object format (currently using legacy string format)
- [ ] Update Framework site's `bds-meta.json` to v1.0 schema (currently uses legacy format, shows as Unreachable)
- [x] Apply PSM feedback: added explicit live-fetch instruction to skill Step 2 and Manus agent update rule — "Always fetch and read the live tracker template before writing or updating bds-meta.json — do not rely on the template reproduced in this skill, which may be stale" — 2026-04-22
- [x] BrandDesignSystem.tsx full dark mode structural fix — 2026-04-24: all structural text-gray-*/bg-white/bg-gray-* replaced with semantic tokens in 5 passes; documentation specimens preserved; contrast verified ≥ 4.90:1 WCAG AA
- [x] Added B6 check to Project Alignment Checklist — 2026-04-24: "No structural Tailwind grey classes used for text or backgrounds outside documentation specimens"; added noHardcodedGreys field to BrandCompliance interface, bds-meta.json schema template, checklistScore(), and BDS site's own bds-meta.json (noHardcodedGreys: true)
- [x] Implement dark/light mode toggle — v2.12.0 — 2026-04-23
  - ThemeContext updated: key `eri-theme`, default `dark`, switchable=true
  - CSS token system: `:root` = light tokens, `html.dark` = dark overrides
  - ThemeToggleButton component: sun/moon icon, tooltip with energy message, aria-label
  - SiteHeader (App.tsx): dark-aware classes, ThemeToggleButton in right zone
  - TabNav (App.tsx): dark-aware classes
  - PublicLayout footer: energy statement + toggle (placeholder copy pending updated research)
  - EriAppHeader: new `showThemeToggle` prop (default false) — self-contained toggle logic
  - EriPageLayout: new `showThemeToggle` prop — passes through to EriAppHeader
  - BDS site Surface Modes section: new "Dark by Default" subsection with implementation guide
  - FOLC prevention script documented in EriAppHeader JSDoc and BDS site
- [x] Full-page dark mode implemented on BDS site — 2026-04-23
  - All structural backgrounds replaced with semantic tokens (`bg-background`, `bg-card`, `bg-muted`)
  - All structural text colours replaced with semantic tokens (`text-foreground`, `text-muted-foreground`)
  - Documentation swatches (colour system, brand spec tables) intentionally remain hardcoded
  - Tailwind dark variant fixed: `(&:where(.dark, .dark *))` — covers both html.dark and descendants
  - PublicLayout: `bg-[#F9FAFB]` → `bg-background`; all structural colours semantic
  - SectionNavigator: all hardcoded colours replaced with semantic tokens
  - BrandDesignSystem.tsx: 3 passes of targeted replacements (structural only, not documentation)
  - AlignmentTracker.tsx: structural backgrounds updated
- [x] Dark mode contrast fixes applied — 2026-04-24
  - --muted-foreground raised: oklch(0.55 0.01 247) → oklch(0.65 0.01 247) ≈ #9A9EAA (7.05:1 on bg, 6.50:1 on card — AAA/AA)
  - --border raised: oklch(0.22 0 0) → oklch(0.28 0 0) ≈ #3d3d3d (visible separators without washing out hierarchy)
  - text-gray-500 in AlignmentTracker URL cells was already replaced with text-muted-foreground in previous session
  - **Root cause found 2026-04-24**: AlignmentTracker project name cells used `style={{ color: T.dark }}` (#232323 hardcoded) — invisible on dark bg. All 18 standalone `color: T.dark` text usages replaced with `text-foreground` Tailwind class. The 5 combined `backgroundColor: T.lime, color: T.dark` usages were intentionally left (lime button text — correct on lime bg).
- [ ] Push v2.12.0 git tag
- [ ] Update energy statement copy (footer + Surface Modes section) once updated research report arrives
- [x] Update eri-bds-reference skill with showThemeToggle prop and dark-by-default pattern (v2.3.0)
- [x] Add Cross-Site Theme System section to skill (v2.3.0) — canonical CSS tokens, ThemeContext verbatim, FOLC script, localStorage key rule
- [ ] Fix HAL site dark mode — revert dark green, apply canonical token block, use eri-theme key
- [ ] Push v2.12.0 git tag

---

## Known errors that have been corrected — do not reintroduce

The following errors have been found and fixed multiple times. If you see them again, fix them immediately.

1. **Body text colour stated as `#232323`** — the correct value is `#383838` on white/light backgrounds. `#232323` is for headings and the footer background only. This error appeared in the Machine Instructions section of the BDS site and in the skill Typography Rules section. Both were corrected on 2026-04-20. Also: `dark-gray #383838` and `accent-lime #93E07D` were missing from the Machine Instructions Colour Tokens table and the skill Canonical Colour Tokens table — both added 2026-04-20.

2. **Stale component names `EriNavDrawer` and `EriFooter`** — the canonical names are `EriAppHeader`, `EriPageLayout`, `EriHeroSection`, `EriAppFooter`, `EriStatusBadge`, `EriContactUsButton`. These stale names appeared in the `bds-meta.json` schema example in the skill. Corrected 2026-04-20.

3. **PSM display name as "Planetary Stewardship Monitor"** — the correct name is "Professional Services Matrix". Corrected 2026-04-20.

4. **`overallStatus` red rule ignoring `used: false` distinction** — the red rule applies only to `used: true` components. Corrected 2026-04-20.

5. **Missing prop tables for `EriPageLayout`** — the BDS site previously had no prop table for this component. Added 2026-04-20.

6. **Missing props `contactSubject`, `footerAttribution`, `logoHref`** — these were absent from the skill and BDS site prop tables for `EriAppHeader` and `EriPageLayout`. Added 2026-04-20.

7. **`PublicLayout` / `transparentHeader` references in Machine Instructions and skill** — the correct component name is `EriPageLayout`. `PublicLayout` is the BDS site’s own internal layout (exempt from the standard). `transparentHeader` is a non-existent prop — it was removed from the component. References corrected to `EriPageLayout` on 2026-04-20.

8. **Hero image assignment was passive, not mandatory** — the instruction said “use `ERI_HERO_IMAGE_TRUST` for trust contexts” but never gave a per-project table. An AI building the Trust Centre defaulted to the hands image. Fixed 2026-04-20: added mandatory per-project assignment table to both the skill and BDS site (amber callout box in EriHeroSection section). Trust Centre MUST use `ERI_HERO_IMAGE_TRUST`. All other apps MUST omit `backgroundImage` (defaults to `ERI_HERO_IMAGE_HANDS`).

9. **Registered Source IDs table was incomplete** — `trust` was missing. Trust Centre source ID is `trust`, `sourceLabel` is `"Trust Centre"`, `returnUrl` is `"https://trust.exponentialroadmap.org"`, `status` is `"LIVE"`. Added to skill table 2026-04-20.

10. **Manual hero container code block was not marked as fallback** — an AI reading the skill would build the hero manually instead of using `EriHeroSection`. Fixed 2026-04-20: block now labelled "Manual hero container structure (fallback only — prefer `EriHeroSection`)" with a mandatory preference note.

11. **Machine Instructions Typography Rules only mentioned Archivo, not Open Sans** — the Typography Rules card in Machine Instructions said "Font: Archivo" but did not mention Open Sans as the body font. An AI reading only this card would use Archivo for everything. Fixed 2026-04-21: card now says "Two-font system: Archivo (headings) + Open Sans (body text)" with explicit Open Sans weight and usage.

12. **Skill pre-action checklist item 5 did not link to /tracker** — item 5 referenced the bds-meta.json section at the bottom of the skill but not the canonical template URL on the BDS site. An AI following the checklist would not know to visit `/tracker`. Fixed 2026-04-21: item 5 now includes a direct link to `https://bds.exponentialroadmap.org/tracker`.

13. **BDS site's own `client/public/bds-meta.json` was missing** — the BDS site had no `bds-meta.json` file at all, causing it to appear as "Unreachable" in its own tracker. Created 2026-04-21 with `overallStatus: "amber"` (exempt from standard layout requirements).

14. **`T.dark` used as text colour in AlignmentTracker** — the `T` object in AlignmentTracker.tsx contains `T.dark = "#232323"` which is ERI Primary Dark (near-black). This was used as `style={{ color: T.dark }}` on project names, headings, and labels throughout the page — completely invisible on a dark background. Fixed 2026-04-24: all 18 standalone `color: T.dark` text usages replaced with `text-foreground` Tailwind class. The 5 combined `backgroundColor: T.lime, color: T.dark` usages (lime buttons with dark text) are intentional and correct. **Rule**: `T.dark` must only be used as a background colour or as text on a lime/light background. Never as text on a dark surface.

15. **Structural `text-gray-*` / `bg-white` / `bg-gray-*` in BrandDesignSystem.tsx** — the main BDS page had hundreds of structural `text-gray-600`, `text-gray-500`, `bg-white`, `bg-gray-50`, `bg-[#F9FAFB]`, and `border-gray-200` classes on section descriptions, navigation items, card wrappers, and table cells. These are completely invisible or wrong in dark mode. Fixed 2026-04-24 in five passes: all structural usages replaced with `text-muted-foreground`, `text-foreground`, `bg-card`, `bg-muted`, `border-border`. Documentation specimens (colour swatches, code examples, live previews) intentionally preserved with hardcoded values. Contrast verified: all structural text ≥ 4.90:1 (WCAG AA pass). **Rule**: Never use `text-gray-*`, `bg-white`, or `bg-gray-*` for structural UI — only for intentional documentation specimens.

---

## How to verify consistency before closing any task

This checklist is **mandatory** before every checkpoint. Every item must be checked explicitly — do not skip items because they seem unrelated to the current task. Errors recur precisely because they are in sections that seem unrelated.

### A. Colour rules — check all four locations independently

1. **BDS Colour System section** — does the `dark-gray #383838` entry say it is for body text? Does the `primary-dark #232323` entry say it is NOT for body text?
2. **BDS Typography section** — does the type scale specimen show `#383838` for body text?
3. **BDS Machine Instructions — Colour Tokens table** — are `dark-gray #383838` and `accent-lime #93E07D` present? Does the table say body text is `#383838`, not `#232323`?
4. **BDS Machine Instructions — quick-reference cards** — does the "Choosing a font" card say two-font system (Archivo + Open Sans)? Does any card contradict the Colour System?
5. **Skill — Canonical Colour Tokens table** — same check as item 3 above.
6. **Skill — Typography Rules section** — does it say body colour is `#383838`?

### B. Typography rules — check all four locations independently

7. **BDS Typography section** — does it say Archivo for headings AND Open Sans for body?
8. **BDS Machine Instructions — Typography Rules subsection** — same check.
9. **BDS Machine Instructions — quick-reference cards** — does the "Choosing a font" card say the two-font system? (This card is a summary of the Typography Rules subsection — they must match.)
10. **Skill — Typography Rules section** — same check.
11. **Skill — Machine Instructions quick-reference table** — does the "Choosing a font" row say the two-font system?

### C. Component names — check all locations

12. Do all six canonical names appear correctly everywhere? The six names are: `EriAppHeader`, `EriPageLayout`, `EriHeroSection`, `EriAppFooter`, `EriStatusBadge`, `EriContactUsButton`. No `EriNavDrawer`, no `EriFooter`, no `PublicLayout` (except the BDS site's own internal layout which is exempt).

### D. Prop tables — check against component source

13. For each of the six components, does the BDS site prop table match the TypeScript interface in `packages/eri-components/src/`? Run: `grep -n "interface.*Props" packages/eri-components/src/*.tsx` to get the current interfaces.
14. Does the skill Component Summaries section list all props for each component?

### E. Per-project assignment rules

15. **Hero image** — does the BDS site EriHeroSection section have the mandatory amber callout table? Does it say Trust Centre → `ERI_HERO_IMAGE_TRUST`, all others → omit `backgroundImage`?
16. **Source IDs** — does the skill Registered Source IDs table include all five projects (BDS, HAL, PSM, Trust, Taxonomy) with their canonical `source`, `sourceLabel`, `returnUrl`, and `status` values?

### F. Version and release

17. **Version strings** — are all version strings in `BrandDesignSystem.tsx` (header display, live previews, prop table examples, install command) consistent with `packages/eri-components/package.json`?
18. **Git tag** — if the version was bumped, has the tag been pushed? Run: `git ls-remote --tags user_github | grep v2.` to verify. **Never bump version strings without pushing the tag.**
19. **`PROJECT-CONTEXT.md` version pin** — does the "current pin" line match the package version?

### G. bds-meta.json

20. **Ownership warning** — does the BDS site Alignment Tracker section and the skill pre-action checklist both say that `bds-meta.json` is created by the consuming project, not shipped in `@eri/components`?

If any answer is "no" or "unsure", fix it before closing the task.

---

## Skill release process — update when skill changes

Whenever the `eri-bds-reference` skill is updated, the following must also be updated:

1. Bump `Version: X.Y.Z` in `SKILL.md` metadata.
2. Upload versioned file: `cp /home/ubuntu/skills/eri-bds-reference/SKILL.md /home/ubuntu/webdev-static-assets/eri-bds-reference-vX.Y.Z.skill && manus-upload-file --webdev /home/ubuntu/webdev-static-assets/eri-bds-reference-vX.Y.Z.skill`
3. Update `SKILL_LATEST_URL` in `server/_core/index.ts` to the new CDN URL. Also update the version string in the `/skill/latest.json` response.
4. Update the Skills card in `BrandDesignSystem.tsx`: version badge, updated date, CDN URLs (Download Skill button, CDN URL button, filename label), and asset URL table row.
5. Save checkpoint and deploy (Publish button). The `/skill/latest` redirect only works when deployed.

**Stable URL:** `https://bds.exponentialroadmap.org/api/skill/latest` — always redirects to the current CDN URL. **This URL never changes.** All ERI project instructions reference this URL. Update only `SKILL_LATEST_URL` in `server/_core/index.ts` when releasing a new version.

**JSON discovery endpoint:** `https://bds.exponentialroadmap.org/api/skill/latest.json` — returns `{ url, version }` for programmatic discovery.

**Current skill version:** v2.6.0 — CDN: `https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/eri-bds-reference-v2.6.0_11724023.skill`

**Instruction text for every ERI project's Manus project instructions:**
```
Critical: At the start of every task, run: curl -sL https://bds.exponentialroadmap.org/api/skill/latest > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated" — then read /home/ubuntu/skills/eri-bds-reference/SKILL.md in full before taking any action.
```

**v2.6.0 changes (2026-04-25):** Added stable skill distribution URL. `/skill/latest` route on BDS server redirects to current CDN URL. `/skill/latest.json` exposes `{ url, version }` for programmatic discovery. Step 0 of pre-action checklist now instructs agents to run `curl -sL https://bds.exponentialroadmap.org/api/skill/latest > /home/ubuntu/skills/eri-bds-reference/SKILL.md` before reading. Skills card updated with stable URL button and project instruction text. Root cause: each project sandbox has a stale snapshot of the skill from project creation — agents were reading old versions.

**v2.5.0 changes (2026-04-25):** Added `showThemeToggle={true}` to Setup Checklist (step 6), Canonical App.tsx pattern, and `EriPageLayout` prop table. Step 10 of checklist now directs agents to read the Cross-Site Theme System section. Root cause: agents implementing EriPageLayout from the checklist omitted the theme toggle prop.

**v2.4.0 changes (2026-04-25):** Fixed 6 contradictions found in full audit: (C1) Surface Modes dark card tokens corrected from `#0d2828`/`#1a3a3a` to `#111111`/`#1a1a1a`; (C2) Surface Modes intro paragraph corrected — dark mode is ERI default for all apps; (C3) "When to use which mode" decision rule replaced — removed authenticated=light rule; (C4a–d) All `bg-[#F9FAFB]` prescriptive instructions replaced with `bg-background` in BDS site and skill; (C5) Dark by Default decorative boxes corrected; (C6) Machine Instructions card — "Card background: white" replaced with `bg-card`.

**v2.3.0 changes (2026-04-24):** Added **Cross-Site Theme System** section with: canonical CSS token block (`:root` light + `.dark` dark with exact OKLCH values), `ThemeContext.tsx` verbatim copy, FOLC-prevention script, `localStorage` key `"eri-theme"` cross-site persistence rule. Fixed `bg-white`/`bg-card` contradiction in Component & Layout Rules. Updated pre-action checklist row with token resolution values. Updated integration note 8. Added cross-site persistence callout card to BDS site Surface Modes section. Added "Cross-site theme system" tag to Skills card. Root cause: HAL agent misinterpreted dark mode rules and invented dark green values because canonical CSS token values were not in the skill.

**v2.2.0 changes (2026-04-24):** Added `bds-meta-changelog.json` endpoint check to Step 2 of the pre-action checklist. Agents now fetch `/bds-meta-changelog.json` to compare their `schemaVersion` and self-update their `bds-meta.json` without human prompts. `bds-meta.json` schemaVersion bumped to `"1.1"`. `bds-meta-changelog.json` published at `client/public/bds-meta-changelog.json`. `bds-meta-spec.md` updated with schemaVersion increment rule and changelog reference. BDS site Skills card updated to v2.2.0.

**v2.1.0 changes (2026-04-24):** Added B6 to Project Alignment Checklist (no structural Tailwind grey classes); added `brand.noHardcodedGreys` to bds-meta.json schema example and field reference; added `noHardcodedGreys` to `BrandCompliance` TypeScript interface; updated BDS site Skills card to v2.1.0.

---

## Release process for @eri/components version bumps

1. Update `packages/eri-components/package.json` version field
2. Update version display string in `BrandDesignSystem.tsx` (introduction section, live previews, prop table examples)
3. Update install command in `BrandDesignSystem.tsx` to reference the new tag
4. Run `npx tsc --noEmit` — must be 0 errors
5. Save checkpoint (this pushes the commit to `main`)
6. **Create and push the git tag:** `git tag -a vX.Y.Z -m "release notes" && git push user_github vX.Y.Z`
7. Verify with `git ls-remote --tags user_github | grep vX.Y.Z`
8. Update `PROJECT-CONTEXT.md` canonical version pin

Do NOT skip step 6. The install command in the BDS site is `github:Exponential-Roadmap-Initiative/eri-brand-design-system#vX.Y.Z&path:packages/eri-components` — if the tag does not exist, the install command fails silently for all downstream projects.

---

## Dark Mode Enforcement Rule — CRITICAL

> **This is the single most common source of dark mode failures in AI-generated code. Read this before writing any structural colour.**

### How dark mode works in this project

The BDS uses a semantic CSS variable token system. `ThemeContext` applies `.dark` to `document.documentElement`. The `.dark {}` block in `index.css` overrides the `:root` token values. This only works if structural elements reference CSS variables — not hardcoded hex.

### The rule: NEVER use these for structural backgrounds, text, or borders

- `bg-white`, `bg-gray-50`, `bg-gray-100`, `bg-[#F9FAFB]`, `bg-[#FFFFFF]`
- `text-gray-900`, `text-gray-800`, `text-[#232323]` on body text, `text-[#383838]`
- `border-gray-200`, `border-gray-300`
- `style={{ backgroundColor: '#F9FAFB' }}`, `style={{ color: '#383838' }}`

### ALWAYS use these semantic tokens for structural elements

| Purpose | Tailwind class |
|---|---|
| Page background | `bg-background` |
| Card / panel surface | `bg-card text-card-foreground` |
| Muted / alternate row | `bg-muted` |
| Primary body text | `text-foreground` |
| Secondary / muted text | `text-muted-foreground` |
| Borders | `border-border` |

### Brand colours that CAN remain hardcoded

- `#232323` — ERI Primary Dark (hero sections, footer background)
- `#93E07D` — ERI Accent Lime (CTA buttons)
- `#3ba559` — ERI Primary Green (links, active states)

### The T object anti-pattern

```tsx
// ❌ NEVER — inline styles with hardcoded hex break dark mode
const T = { offWhite: '#F9FAFB', bodyText: '#383838', border: '#e5e7eb' };
<div style={{ backgroundColor: T.offWhite }}>...</div>

// ✅ CORRECT — semantic Tailwind classes
<div className="bg-background text-foreground border-border">...</div>
```

### Canonical page template

Copy `client/src/pages/NewPage.tsx` as the starting point for every new page. It contains the full token reference as a comment block and a working structural skeleton.

### Pages fixed (as of v2.12.0)

- `BrandDesignSystem.tsx` — structural `bg-white`/`bg-gray-*` replaced with semantic tokens (documentation swatches remain hardcoded intentionally)
- `AlignmentTracker.tsx` — `T` object structural colours replaced with semantic tokens; brand colours (`T.lime`, `T.green`, `T.dark` on hero) remain hardcoded
- `NotFound.tsx` — hardcoded gradient and card background replaced with semantic tokens
- `PublicLayout.tsx` — `bg-[#F9FAFB]` wrapper replaced with `bg-background`
- `SectionNavigator.tsx` — all structural colours replaced with semantic tokens

### Dark mode token definitions

Defined in `client/src/index.css`:
- `:root {}` — light mode values (default)
- `.dark {}` — dark mode overrides applied to `html` element by `ThemeContext`

---

## Dark Mode — v2.12.0 decisions

| Decision | Value |
|---|---|
| Default mode | Dark |
| Persistence | `localStorage` key `eri-theme` |
| OS preference respected | No — always default to dark (energy-efficiency statement) |
| Toggle placement | Header right zone (sun/moon icon) + footer energy statement |
| Icon convention | Destination mode — sun in dark mode, moon in light mode |
| Three-mode (AMOLED black) | Decided against — 1–3% energy gain swamped by rebound effect |
| Footer copy | Honest v2 report framing — no specific TWh figures (VERY LOW confidence) |
| Energy copy location | `ThemeToggleButton.tsx` (tooltip) and `PublicLayout.tsx` (footer) |
| `@eri/components` prop | `showThemeToggle` on `EriAppHeader` and `EriPageLayout` (v2.12.0) |

---
