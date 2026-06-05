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
| **Dark Gray** | **`#383838`** | **Standard body paragraph text on white/light backgrounds** — this is NOT `#232323`. This is the canonical value of `--foreground` in light mode (`oklch(0.24 0.005 285)`). |
| Neutral Gray | `#6b7280` | Secondary text, borders, disabled states |
| Off White | `#F9FAFB` | Page background, card background, light section background |
| Accent Lime | `#93E07D` | **All filled CTA buttons** on every surface; heading accent words on dark/hero backgrounds |
| Highlight Yellow | `#F5C842` | Data highlights, chart callouts — introduced in Playbook v5 |
| LinkedIn Blue | `#007BB6` | LinkedIn icon background only — no other use |
| YouTube Red | `#A82400` | YouTube icon background only — no other use |

**The `#232323` / `#383838` distinction is intentional and must be preserved everywhere:**
- `#232323` = headings, footer background, dark section backgrounds, hero overlay
- `#383838` = body paragraph text on white/light backgrounds — this is the canonical value of `--foreground` in light mode
- Any rule that says "use `#232323` for body text" is a stale error and must be corrected immediately.
- `text-foreground` in light mode now resolves to `#383838` (updated v2.7.0). Projects using `text-foreground` correctly satisfy the `bodyTextHex383838` checklist item.

---

## Canonical typography rules

- **Heading font:** Archivo — self-hosted WOFF2 in `client/public/fonts/` (GDPR requirement — no Google Fonts CDN)
- **Body font:** Open Sans — self-hosted WOFF2 in `client/public/fonts/` (GDPR requirement)
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

Package: `@eri/components` — current pin: **v2.16.1**

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
- `ERI_HERO_IMAGE_DEFAULT` and `ERI_HERO_IMAGE_TRUST` are named exports from `@eri/components`. `ERI_HERO_IMAGE_HANDS` is a deprecated alias for `ERI_HERO_IMAGE_DEFAULT` — do not use in new code.

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
| HAL | Earth-Aligned AI Lab | `earth-aligned-ai-lab.exponentialroadmap.org` |
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

8. **Hero image assignment was passive, not mandatory** — the instruction said “use `ERI_HERO_IMAGE_TRUST` for trust contexts” but never gave a per-project table. An AI building the Trust Centre defaulted to the hands image. Fixed 2026-04-20: added mandatory per-project assignment table to both the skill and BDS site (amber callout box in EriHeroSection section). Trust Centre MUST use `ERI_HERO_IMAGE_TRUST`. All other apps MUST omit `backgroundImage` (defaults to `ERI_HERO_IMAGE_DEFAULT`).

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

**Current skill version:** v3.11.0 (2026-06-04) — 20.05.2026 canonical Exponential Framework taxonomy: full pillar names (v5), H1–H4 horizontals, all 17 sub-categories by pillar; fixed skill fetch URL in Step 0 (was missing /api/ segment); updated pillar table with full names; bdsSpec.ts BDS_VERSION bumped to 3.1.0. CDN: `https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/SKILL_01177c24.md`

**Previous skill version:** v3.5.0 (2026-05-27) — EriAppFooter docs updated (four-column layout, appLink prop, contact-us.exponentialroadmap.org); install pin bumped to v2.16.1 in SKILL.md. CDN: `https://files.manuscdn.com/user_upload_by_module/session_file/310519663319595517/BcfwdIJHtTNhcuml.md`

**Content audit v2.16.4 (2026-05-27):** 14 stale/incorrect items fixed in BrandDesignSystem.tsx: (1–2) install pin v2.12.0 → v2.16.1 in two places; (3–4) intro component list descriptions for EriHeroSection and EriAppFooter; (5–6) EriHeroSection section description — removed stale “hands” references, updated to “S-curve” and “ERI_HERO_IMAGE_DEFAULT”; (7) code example — removed deprecated ERI_HERO_IMAGE_HANDS import; (8–9) EriAppFooter props table — appName and tagline descriptions corrected; (10) Footer Rules table Column 4 — hello@ → contact-us.exponentialroadmap.org; (11) non-conformant callout — Tier C is admin tools not public marketing sites; (12) known violations — stale Taxonomy single-row item replaced with generic rule; (13–14) Brand Graphics section heading and description — “Hands Touching (Primary)” → “Dual S-Curve Rich (ERI_HERO_IMAGE_DEFAULT)” with accurate description.

**Current @eri/components version:** v2.16.1 (2026-05-26) — EriAppFooter four-column layout matching official ERI site; Contact Us links to contact-us.exponentialroadmap.org

**Version auto-sync:** `shared/eriVersion.ts` is gitignored and auto-generated by `scripts/gen-eri-version.mjs` via `predev`/`prebuild` npm hooks. Sources: `ERI_COMPONENTS_VERSION` ← `packages/eri-components/package.json`; `ERI_BDS_SKILL_VERSION` ← `server/_core/index.ts` version string. Run `pnpm gen:version` to regenerate on demand. Never edit `shared/eriVersion.ts` manually.

**CRITICAL deployment rule:** Never put `fs.readFileSync`/`require()` at top level of `vite.config.ts` — it gets bundled into `dist/index.js` and crashes at runtime with ENOENT. Use prebuild scripts instead.

**@eri/components v2.13.0 (2026-05-12):** `EriAppHeader` and `EriAppFooter` updated to use `eri-logo-dark-mode.svg` (dedicated dark-mode SVG with white text + green X) instead of the full-colour WebP + `filter: brightness(0) invert(1)` workaround. The CSS filter incorrectly inverted the green accent colour. Both components now reference the clean CDN URL: `https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/eri-logo-dark-mode.svg`. Package version bumped from 2.12.0 to 2.13.0. CSS rebuilt. Git tag `v2.13.0` pushed to GitHub. CDN fallback download URLs updated to clean `/components/` path (e.g. `.../components/EriAppHeader.tsx`). **Consuming projects** (HAL, Taxonomy, Trust, PSM, Playbook) must run `pnpm update @eri/components` or pin to `v2.13.0` to receive the fix. **No bds-meta.json schema change** — no new checklist items added.

**Dark-mode logo integration (2026-05-12):** Two dedicated dark-mode SVG assets created and uploaded to CDN with `image/svg+xml` content type. `logos.eriLogoDarkMode` (`eri-logo-dark-mode.svg`) — white wordmark text (#ffffff) + green X mark (#87e873). `logos.eriIconMarkDarkMode` (`eri-icon-mark-dark-mode.svg`) — white curve + green curve. Clean (non-hashed) filenames — these are stable permanent URLs. **Logo Usage section redesigned:** Removed standalone Dark-Mode Wordmark card; merged into single "ERI Wordmark" card showing both surfaces side-by-side. Light-background preview panel hardcoded to `bg-white` so it shows correctly in dark mode. Dark-mode file ID chip added (dark-styled). "Dark SVG" download button added alongside primary Download button. Both added to `client/src/lib/assets.ts`. `PublicLayout.tsx` updated to use `useTheme()` to switch between `eriLogoFullColorSvg` (light mode) and `eriLogoDarkMode` (dark mode) in the header; footer always uses `eriLogoDarkMode`. **Deprecated:** `filter: brightness(0) invert(1)` on the full-colour wordmark — this incorrectly inverts the green accent. BDS site Logo Usage section updated: new Dark-Mode Wordmark card, updated ERI Icon Mark card, new "Theme-Aware Logo Switching" callout card with code example, updated logoDonts, updated Asset URL Reference table. Skill updated: asset table now has 4-column format with token names, dark-mode entries bolded, deprecation notice. EriAppHeader Left Zone and footer code example updated in both BDS site and skill.

**v3.0.1 changes (2026-04-29):** Fixed 5 AI agent instruction gaps identified in post-v3.0.0 audit. (1) **Gap 1 — Stale bds-meta.json schema in skill:** Updated schema example to v1.2 with all current fields (`gdprFonts`, `cardAccentPattern`, `eyebrowAccentLime`, `overlayBackground`). Added bold warning: "This example may be stale. Always copy from the tracker." (2) **Gap 2 — Hardcoded version in handoff_prompt:** Added note to check `components.latestVersion` before running install command. (3) **Gap 3 — Missing CSS import step in handoff_prompt:** Added Step 3b: `@import "@eri/components/dist/eri-components.css"` at top of `index.css` — the single most common failure point. (4) **Gap 4 — C section not labelled as Components & Layout:** Renamed C section to "Components & Layout" in AlignmentTracker. (5) **Gap 5 — "Read this first" card not in Machine Instructions section:** Added prominent "Start Here" card at very top of Machine Instructions section in BrandDesignSystem.tsx with skill fetch command and JSON spec endpoint URL.

**v3.0.0 changes (2026-04-29):** Breaking change — GDPR font compliance. (1) **GDPR Self-Hosted Fonts:** Google Fonts CDN prohibited for all ERI projects. All projects must self-host Archivo + Open Sans WOFF2 files in `client/public/fonts/`. `@font-face` declarations replace CDN `<link>` tags in `index.html`. BDS site migrated as reference implementation. New checklist item B9 `gdprFonts`. (2) **Machine-readable JSON spec endpoint:** `https://bds.exponentialroadmap.org/api/trpc/bdsSpec.getSpec` — full brand spec as structured JSON including `handoff_prompt`, `fontFaceTemplate`, `darkModeRules` array, `cardAccentPalette`, `overlaySpec`. Inspired by Holocen brand identity system. (3) **Dark mode rules table:** Reformatted as two-column rule/correct/anti-pattern table in skill and BDS site for faster AI agent scanning. (4) **AI Agent section on BDS site:** Three new cards — JSON Spec Endpoint (with live-fetch example), GDPR Font Self-Hosting guide (with `@font-face` template), Canonical Source Files panel. (5) **bds-meta.json schema v1.2:** Added `brand.gdprFonts` field. `BrandCompliance` TypeScript interface updated. `BdsMeta.schemaVersion` union extended to `"1.0" | "1.1" | "1.2"`. AlignmentTracker B9 row added, clipboard and visible seed templates updated to schema v1.2.

**v2.9.0 changes (2026-04-27):** Added canonical Overlay / Nav Drawer spec to NavigationPatterns.tsx and skill Navigation section. Universal rules: `bg-[#232323]` mandatory (never pure black `#000000`, never `bg-background`), `w-80`, `bg-black/50` backdrop, slide-in from right `duration-300`. Per-item colours: inactive `text-white/80 hover:text-white hover:bg-white/5`, active `bg-[#3ba559]/10 text-[#3ba559]`. Tier A Workflow (PSM) four-group nav structure documented. Full `NavDrawer.tsx` code example added to BDS site. New checklist item C8: `overlayBackground` (`layout.overlayBackground` in bds-meta.json). `LayoutCompliance` TypeScript interface updated. AlignmentTracker clipboard template rewritten as `JSON.stringify` (eliminates template literal corruption risk). BDS site `bds-meta.json`: `overlayBackground: true`. Root cause: PSM nav drawer used pure black (`#000000`) instead of `#232323` — the shadcn/ui `Sheet` default resolves to near-black in dark mode and was not overridden.

**v2.8.0 changes (2026-04-26):** Added Card Accent Colour System section to skill and BDS site. Six-slot category accent palette (Green `#3ba559`, Blue `#17b7dd`, Orange `#ff8b00`, Red `#ff5133`, Sage `#9aa08c`, Teal `#00ac58`). Canonical pattern: `border-l-4` + `rgba()` tint at 8% opacity — never full four-side coloured outline. Section eyebrow labels always `#93E07D` regardless of card accent colour. Added B7 (`cardAccentPattern`) and B8 (`eyebrowAccentLime`) to Project Alignment Checklist. Updated `BrandCompliance` TypeScript interface, AlignmentTracker clipboard template, and BDS site `bds-meta.json` (14/14 passing). Root cause: HAL site used `border-2 border-[#00B8D4]` full outline on cards — jarring neon-box effect in dark mode. The correct pattern was undocumented.

**v2.7.0 changes (2026-04-26):** Updated canonical light mode `--foreground` token from `oklch(0.17 0.005 285)` (#232323) to `oklch(0.24 0.005 285)` (#383838). This aligns the semantic token `text-foreground` with the ERI brand spec for body text on light backgrounds. Projects using `text-foreground` now correctly satisfy the `bodyTextHex383838` checklist item. Also updated `--card-foreground`, `--popover-foreground`, and `--accent-foreground` in `:root` to match. Dark mode tokens unchanged.

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

---

## BDS Site Header/Footer Migration — v2.13.0 (2026-05-13)

The BDS site now uses `EriAppHeader` and `EriAppFooter` from `@eri/components` directly.
The old `SiteHeader` component (custom header in `App.tsx`) was replaced.

### Architecture after migration

| Zone | Component | Notes |
|---|---|---|
| Header | `EriAppHeader` from `@eri/components` | Fixed 64px, `#232323`, dark-mode SVG logo, BETA badge, theme toggle, Contact Us CTA, hamburger |
| Tab bar | `TabNav` (local, in `App.tsx`) | BDS-specific — sits at `top: 64px`, height 40px, `#232323` background |
| Mobile drawer | `BdsNavDrawer` (local) | Triggered by `onMenuClick` from `EriAppHeader` |
| Content | `PublicLayout.tsx` | Adds `paddingTop: 104px` (64px header + 40px TabNav) |
| Footer | `EriAppFooter` from `@eri/components` | Always `#232323`, ERI logo (dark-mode SVG), tagline, links |

### Key layout values

- `EriAppHeader` height: **64px** (fixed, `top: 0`)
- `TabNav` height: **40px** (fixed, `top: 64px`)
- Total fixed chrome: **104px**
- `PublicLayout` `paddingTop`: **104px**
- Sticky section nav `top`: **104px** (was 68px — corrected in this migration)
- `AlignmentTracker` `pt-[104px]` (was `pt-[108px]` — corrected in this migration)

### Skill update

The `eri-bds-reference` skill scope note was updated: the BDS site is no longer "exempt" from using `@eri/components`. The scope statement now reads:

> **Scope — All Public-Facing ERI Apps:** These components apply to all public-facing ERI product apps, including the BDS site itself.

The BDS row in the EriAppHeader props table was also updated to note that it uses `EriAppHeader` + `EriAppFooter` directly (no `EriHeroSection`).

### Theme toggle behaviour

The `EriAppHeader` `showThemeToggle={true}` prop is set. The toggle reads/writes `localStorage` key `eri-theme`. The `ThemeContext` in `App.tsx` listens for `storage` events to stay in sync. The FOLC-prevention script in `client/index.html` ensures the page is dark before React hydrates.

### Background colour rule confirmed

The user confirmed: **the background should always be `#232323`**. This applies to:
- `EriAppHeader` (always `#232323` — hardcoded in component)
- `TabNav` (always `#232323` — hardcoded in `App.tsx`)
- Hero sections (always `#232323` — hardcoded in page components)
- `EriAppFooter` (always `#232323` — hardcoded in component)
- Dark content cards (always `#232323` — hardcoded in content)

The content area (`bg-background`) remains theme-aware (dark/light switchable).

---

## EriCrocodileChart — @eri/components v2.14.0 (2026-05-22)

`EriCrocodileChart` was added to `@eri/components` as canonical component 7. It is a pure SVG component with zero external dependencies (no Recharts, no Chart.js, no D3).

### Key decisions

- **Pure SVG** — the existing `CrocodileChartExamples.tsx` in the BDS site already used pure SVG. The component was extracted and generalised into `packages/eri-components/src/EriCrocodileChart.tsx`.
- **`entityType` prop** — enforces the semantic colour rule automatically. `'company'` → green `#7DD87A`. `'nation'` → salmon `#F08070`. This encoding is semantic and must never be swapped.
- **`CrocodileDataPoint` type** — exported from `@eri/components`. Format: `{ year: string; upper: number; lower: number }`. `upper` = positive % change from baseline (GDP/Revenue). `lower` = negative % change from baseline (CO₂ emissions). First data point must be `{ upper: 0, lower: 0 }`.
- **BDS site** — `CrocodileChartExamples.tsx` was updated to import from `@eri/components` instead of duplicating the SVG logic.
- **Standard Components section** — updated to list 7 components (was 6). Component 7 subsection added with live preview, usage code, props table, and semantic colour rule callout.
- **Skill** — `eri-bds-reference` updated with: EriCrocodileChart in component summaries, prop table, CDN fallback table, import line, and a new dedicated "Crocodile Economy Chart" section with anatomy, semantic colour rule, data format, usage examples, and non-conformant patterns.

### CDN URL

`EriCrocodileChart.tsx` (canonical source file):
`https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/EriCrocodileChart_3ff07184.tsx`

### Why this solves the replication problem

Previous Manus agents failed to replicate the chart because the skill had only one line about it (`#F5C842 = data highlights, chart callouts`). The agent had to guess the library, colours, anatomy rules, and data format — and guessed wrong. The new skill section provides:
1. Exact anatomy (line colours, fill colours, opacity, gridlines, axis style)
2. Semantic colour encoding rule (green = company, salmon = nation — never swap)
3. Exact data format with baseline year convention
4. Copy-paste usage example for both company and nation charts
5. Non-conformant patterns list (do not use Recharts/Chart.js/D3)

Any agent reading the skill before starting work will now have everything needed to use the component correctly without guessing.

---

## v2.15.0 — Hero image + light-mode header (2026-05-26)

### Hero image change
- **New default hero:** `hero-scurve-dual-rich.webp` — dual S-curves (amber + lime) crossing on dark teal grid with particle bokeh. No human figures.
- CDN URL: `https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/hero-scurve-dual-rich_775e47cf.webp`
- `ERI_HERO_IMAGE_DEFAULT` is the new canonical export (points to the rich S-curve image)
- `ERI_HERO_IMAGE_HANDS` is now a deprecated alias for `ERI_HERO_IMAGE_DEFAULT` — still works, but prefer `ERI_HERO_IMAGE_DEFAULT` for new code
- Old hands image retained in CDN for backward compatibility

### Light-mode header (headerTheme prop)
- New prop `headerTheme?: 'dark' | 'auto'` added to `EriAppHeader` and `EriPageLayout`
- Default: `'dark'` (always `#232323` — backward compatible, no breaking change)
- `'auto'`: white (`#FFFFFF`) header in light mode, `#232323` in dark mode; logo switches between white wordmark (dark) and full-colour wordmark (light); all text/icons adapt
- BDS site uses `headerTheme="auto"` — first adopter
- Other projects should migrate to `'auto'` when they update to v2.15.0+

### ThemeContext sync fix
- `EriAppHeader.applyTheme()` now dispatches `window.dispatchEvent(new CustomEvent('eri-theme-change', { detail: { theme } }))` after setting localStorage
- `ThemeContext.tsx` listens for `eri-theme-change` CustomEvent in addition to `storage` event
- This fixes same-tab theme sync (the `storage` event only fires in other tabs/windows)

### TabNav light-mode fix
- `TabNav` in `App.tsx` updated from `bg-[#232323]` to `bg-white dark:bg-[#232323]` so it adapts to light mode

### Skill version
- Skill bumped to v3.1.0 with all above changes documented

---

## v2.16.5 — Anti-AI Checklist A1–A5 complete + Trust Centre In the Wild (2026-05-27)

### Anti-AI Checklist A1–A5 — fully implemented
- `bdsMetaTypes.ts` `AntiAiCompliance` interface: 5 fields (`noBlacklistedCopyWords`, `noPurpleGradientOrSparkles`, `ctasDescribeOutcome`, `statisticsAreReal`, `noIdenticalSectionSequence`)
- `checklistScore()` in `AlignmentTracker.tsx` scores all 5 fields
- A block UI table in `AlignmentTracker.tsx`: rows A1–A5 with check description and pass condition
- Canonical template (visible + Copy button) updated to `schemaVersion: "1.3"` with `antiAi` block
- BDS site `bds-meta.json` already had `antiAi` block with all 5 fields `true`

### Trust Centre added to In the Wild gallery
- Screenshot captured from `trust.exponentialroadmap.org` and uploaded to CDN
- CDN URL: `https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/trust-hero_61e9c5e5.png`
- Gallery switched from 3-column to 2×2 grid to accommodate 4 cards
- Trust Centre card: badge LIVE, tier "Tier B — App", description notes `ERI_HERO_IMAGE_TRUST`

### SKILL.md v3.6.0
- Example `bds-meta.json` pin updated from `v2.15.3` to `v2.16.1`
- `lastUpdated` updated to `2026-05-27`
- Frontmatter description updated to mention A1–A5 Anti-AI checklist and Trust Centre
- CDN URL: `https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/SKILL_31d5b90f.md`
- `SKILL_LATEST_URL` in `server/_core/index.ts` updated to v3.6.0 CDN URL
- `shared/eriVersion.ts` regenerated: `ERI_BDS_SKILL_VERSION = "v3.6.0"`

17. **`headerTheme="auto"` restriction was a prohibition, not a status note (2026-05-27)** — SKILL.md said "Only the BDS site currently uses `headerTheme='auto'`. All other ERI apps should use `headerTheme='dark'` unless explicitly required." This was written as a status note but read as a prohibition. Fixed in SKILL.md v3.7.0: the rule is now "Always pair `showThemeToggle={true}` with `headerTheme='auto'`". Without `headerTheme='auto'`, the header stays dark even in light mode. The canonical code examples, integration checklist step 6, and both props tables in SKILL.md and BrandDesignSystem.tsx have been updated to reflect this.

---

## SKILL.md v3.8.0 — Trust Centre feedback applied (2026-05-27)

Four gaps identified by the Trust Centre project after a failed implementation:

1. **headerTheme contradiction** — already resolved in v3.7.0. Confirmed absent.
2. **No browser verification step** — T6 row added to Project Alignment Checklist (T block): "Open the app in a browser. Click the theme toggle. Confirm: (1) header goes white; (2) page content goes light; (3) all text readable in both modes." Do not mark task complete until T6 passes.
3. **Vite module cache not mentioned** — Setup Checklist step 1 now warns: after `pnpm add @eri/components`, restart the dev server and hard-reload the browser (`Cmd+Shift+R`). Vite pre-bundles on first start — old cache may be served otherwise.
4. **returnUrl canonical value not stated** — `returnUrl` prop description in EriAppHeader, EriPageLayout, and the Contact Us props table now says "Always the hardcoded canonical production URL — never `window.location.origin`". A standalone callout added after the Contact Us props table. `window.location.origin` resolves to `http://localhost:3000` in development and breaks the Contact Us return flow in production.

CDN URL: `https://files.manuscdn.com/user_upload_by_module/session_file/310519663319595517/XMkyuyXwCGcxKiHP.md`

---

## v2.16.9 — Version badge + Trust Centre patch document (2026-05-27)

- `APP_VERSION` in `client/src/App.tsx` bumped from `V.2026.04.21` to `V.2026.05.27`.
- `TRUST-CENTRE-PATCH.md` written in project root: exact three-fix patch (Fix A: `headerTheme="auto"`, Fix B: `returnUrl` hardcoded, Fix C: Vite cache restart + hard-reload), T6 browser verification table, and complete `bds-meta.json` template for the Trust Centre.

---

## v3.3.0 — "Team Guide" tab (2026-06-04)

### New page: /team-guide
- `client/src/pages/TeamGuide.tsx` — Manus collaboration guide for non-technical ERI colleagues
- Content ported from `eri-collaboration.manus.space` (prototype site — now consolidated here)
- Four-tab navigation: Brand Design System / Project Alignment Tracker / Start a Project / **Team Guide**
- Content: hero with three entry cards (I'm new / I need to share / I want the full picture), Getting Started (4 steps), ERI Pre-Prompt with Hard Stops table, ERI AI Stack (Perplexity vs Manus), Sharing (4 quick facts, 4 explanatory steps, sharing models table, team workflow)
- `bdsSpec.ts` addition: `team_guide_url`
- `BdsNavDrawer.tsx`: Team Guide link added to Other pages section
- Decision: distinct standalone page with its own layout — not integrated into BDS sidebar sections

---

## v3.2.0 — "Start a Project" tab + Vite cache failure pattern (2026-06-04)

### New page: /new-project
- `client/src/pages/NewProject.tsx` — AI-agent-optimised onboarding page
- Three-tab navigation: Brand Design System / Project Alignment Tracker / **Start a Project**
- Content: mandatory setup steps (01–05), seven canonical components table, copy-paste project instructions (Track 1 + Track 2 toggle), quick links, Vite cache warning callout
- `bdsSpec.ts` additions: `new_project_url`, `handoff_prompt_track1`, `handoff_prompt_track2`
- `BdsNavDrawer.tsx`: "Other pages" section added with Start a Project + Tracker links

### Confirmed failure pattern: Vite pre-bundle cache
**Symptom:** Blank page after `webdev_add_feature` or major `pnpm add`. No JavaScript errors. Network log shows no requests for `/src/main.tsx`.
**Root cause:** Stale `node_modules/.vite/` pre-bundle cache. New dependencies were installed but Vite's cache was not invalidated.
**Fix:** `rm -rf node_modules/.vite` → restart dev server → hard-reload browser (`Cmd+Shift+R`).
**Rule:** This must be the FIRST thing tried when a page goes blank after any dependency change. Do not spend time investigating script conflicts, CSP, or runtime errors before clearing the cache.
**Added to:** SKILL.md (Setup Checklist step 1), NewProject.tsx (Vite cache warning callout), bdsSpec.ts `handoff_prompt_track1` Step 9, `handoff_prompt_track2` REMINDER section.

---

## v2.17.0 — Light-default theme (2026-06-03)

**Decision:** Default theme changed from dark to light. Dark mode is now an active individual user preference, persisted in `localStorage` under `eri-theme`. Key stakeholders found the dark-by-default approach too heavy.

**Changes made:**
- `ThemeContext.tsx`: `DEFAULT_THEME` changed from `"dark"` to `"light"`
- `client/index.html`: FOLC script updated — now only applies `.dark` class if `localStorage.getItem('eri-theme') === 'dark'` (not on first visit)
- `client/src/index.css`: comments updated to reflect light-default
- `BrandDesignSystem.tsx`: Surface Modes section fully updated (13 edits — section title, badges, descriptions, How it works table, "Light by Default" section replacing "Dark by Default", FOLC code example, Logo Switching description)
- `SKILL.md v3.9.0`: `### Default: light (from v2.17.0)`, migration note for pre-v2.17.0 projects, updated FOLC script, `DEFAULT_THEME="light"` in ThemeContext code example, dark tokens comment updated

**Migration for consuming projects (HAL, PSM, Trust, Taxonomy):**
1. Update `DEFAULT_THEME` in `ThemeContext.tsx` from `"dark"` to `"light"`
2. Update the FOLC script in `client/index.html`:
   ```html
   <script>
     (function() {
       try {
         if (localStorage.getItem('eri-theme') === 'dark')
           document.documentElement.classList.add('dark');
       } catch(e) {}
     })();
   </script>
   ```
3. Run `pnpm update @eri/components` to pull in v2.17.x if needed
4. Hard-reload browser to flush Vite cache
5. Verify: first visit shows light mode; toggle to dark works; preference persists on reload

**SKILL.md v3.9.0 CDN:** `https://files.manuscdn.com/user_upload_by_module/session_file/310519663319595517/bYsMBUbdpKgsycna.md`

---

## v3.4.0 — Skills tab (2026-06-04)

### New page: /skills
- `client/src/pages/Skills.tsx` — self-improving skills registry for the ERI skill ecosystem
- Fifth tab added to navigation: Brand Design System / Project Alignment Tracker / Start a Project / Team Guide / **Skills**
- Database: `skills` table (id, name, description, tier, version, readWhen, createdAt, updatedAt) and `skill_improvements` table (id, skillId, version, summary, taskContext, loggedAt)
- Router: `server/routers/skills.ts` — `publicProcedure` for reads (list, get), `adminProcedure` for writes (upsert, logImprovement, delete)
- 22 skills seeded from `/home/ubuntu/skills/` directory (all current ERI skills, post-rename)
- Seed script: `scripts/seed-skills.mjs` — idempotent, safe to re-run
- Tests: `server/skills.test.ts` — 9 tests, all passing
- `bdsSpec.ts` addition: `skills_url`
- `BdsNavDrawer.tsx`: Skills link added to Other pages section

### Tier model (post-rename, 2026-06-04)
- Tier 1 — Always-on (3 skills): eri-bds-reference, eri-human-ai-collaboration, eri-skill-manager
- Tier 2 — Per-action gate (3 skills): eri-code-quality, eri-trpc, eri-decision
- Tier 3 — Conditional (16 skills): eri-data-source, eri-widget, eri-database, eri-security, eri-rest-api, eri-earth-aligned-agent, eri-report-finder, eri-ueil-nav, eri-user-management, eri-bds-site, manus-api, manus-config, automation-and-scheduling, persistent-computing, imagegen, music-prompter

### Skill renaming/consolidation (2026-06-04)
- All ERI-owned skills renamed with `eri-` prefix
- Three explorer skills (data-source-integration, data-source-explorer, explorer-compare-view) consolidated into single `eri-data-source`
- `skill-creator` → `eri-skill-manager` (ERI-adapted meta-skill with tier governance, BDS registry, project instructions management)
- `exponential-human-ai-collaboration` → `eri-human-ai-collaboration`
- `bgm-prompter` archived to `_archive/`
- Skill directories at `/home/ubuntu/skills/eri-*/`; old directories remain for backward compat
- DB cleaned: old IDs deleted, new IDs seeded via `scripts/seed-skills.mjs`

### Admin note
- `adminProcedure` throws `FORBIDDEN` (not `UNAUTHORIZED`) for null users — this is correct behaviour (admin gate checks role, not just auth)
- Writes (upsert, logImprovement, delete) require admin role
- Reads (list, get) are public — no login required

### Current routes table
| Route | Component | Status |
|---|---|---|
| `/` | BrandDesignSystem.tsx | Live |
| `/tracker` | AlignmentTracker.tsx | Live |
| `/new-project` | NewProject.tsx | Live |
| `/team-guide` | TeamGuide.tsx | Live |
| `/skills` | Skills.tsx | Live |

---

## v3.8.0 — Skills page BDS card violation fixes (2026-06-05)

### What was fixed

All BDS compliance violations in `client/src/pages/Skills.tsx` were resolved. The page now exemplifies the system it documents.

**Card pattern violations fixed:**
- `SkillRow` card: replaced full four-side teal outline with `border-l-4` left accent border + `tintBg` background (canonical BDS card pattern). Category `accentColor` used when available, tier `accentColor` as fallback.
- `SystemOverview` tier model cards: replaced `cfg.border`/`cfg.bg` classes with `border-l-4` + inline `accentColor`/`tintBg`.

**Badge violations fixed:**
- `TierBadge`: now transparent outlined pill — `border` with `accentColor` border colour, no filled background, no hardcoded colour class.
- `CategoryBadge`: Lucide icon + `accentColor` border/bg (no emoji, uses six-slot BDS palette).
- `RECOMMENDATION_CONFIG`: removed `badge`/`icon` fields; replaced with `accentColor`/`tintBg`. Audit section recommendation pills now use inline style (transparent outlined pill pattern).

**Emoji violations fixed (all replaced with Lucide icons or text):**
- `readWhen` callout: `⏰` → `<Clock size={12} />`
- "no improvements logged": `⚠` → `<AlertTriangle size={11} />`
- Hero stats warning: `⚠` → `<AlertTriangle size={14} />`
- Filter bar missing-self-improvement button: `⚠` → `<AlertTriangle size={12} />`
- View/Download buttons: emoji → `<Eye size={12} />` / `<Download size={12} />`
- Folder path hint: `📁` → `/` text
- Category select in `AddSkillDialog`: `cfg.icon` (emoji) → Lucide `CfgIcon` component

**Stale config class violations fixed:**
- Filter bar tier chips: `cfg.badge` → inline `style` with `cfg.accentColor`/`cfg.tintBg`
- Filter bar category chips: `catCfg.badge`/`catCfg.icon` → Lucide `CatIcon` + inline `style`
- Tier group headings: `cfg.heading` class → inline `style={{ color: cfg.accentColor }}`
- `SystemOverview` tier card heading: `cfg.heading` class → inline `style={{ color: cfg.accentColor }}`

### Config objects after fix

`TIER_CONFIG` fields: `label`, `shortLabel`, `accentColor`, `tintBg`, `when`, `constraint`, `example`
- The `badge`, `border`, `bg`, `heading` fields have been **removed** — do not re-add them.

`CATEGORY_CONFIG` fields: `label`, `Icon` (Lucide component), `accentColor`, `tintBg`
- The `icon` (emoji string) and `badge` fields have been **removed** — do not re-add them.

`RECOMMENDATION_CONFIG` fields: `label`, `accentColor`, `tintBg`
- The `badge` and `icon` fields have been **removed** — do not re-add them.

### Checkpoint
- Version: `3810c562`
- Tests: 14/14 passing (`server/skills.test.ts`)
- TypeScript: 0 real errors (13 stale watcher noise — TS 5.6.3 vs 5.9.3 path mismatch, safe to ignore)

---

## v3.9.0 — Skills architecture migration: filesystem-first (2026-06-05)

### Architecture decision

The `skills` DB table was a stale copy of SKILL.md content. The new architecture:

- **Filesystem = source of truth for skill content** (name, description, tier, category, version, readWhen, hasReferences)
- **DB = source of truth for governance data** (improvement log, project instructions preamble, version snapshots, audit findings)

### What changed

**Schema (`drizzle/schema.ts`):**
- `skills` table removed from schema (still exists in DB — `DROP TABLE` blocked by safety system; requires manual drop via Database panel)
- `skillImprovements` table kept (no FK to `skills` — standalone improvement log keyed by `skillId` string)
- `projectInstructionsVersions` table added (snapshots when "Mark as Applied" is clicked)
- `projectInstructionsAudits` table added (agent-written audit findings from "Run Audit" workflow)

**Router (`server/routers/skills.ts`):**
- `SKILLS_METADATA` TypeScript constant added — 26 entries, one per skill directory, with all structured metadata
- `skills.list` — now returns `SKILLS_METADATA` array (no DB query)
- `skills.get` — returns one entry from `SKILLS_METADATA` + improvement log from DB
- `skills.getContent` — new procedure; reads SKILL.md from filesystem at `/home/ubuntu/skills/{id}/SKILL.md`
- `skills.upsert` — removed (skills are filesystem-only)
- `skills.delete` — removed (skills are filesystem-only)
- `skills.logImprovement` — kept (writes to `skillImprovements`)
- `skills.saveInstructionsVersion` — new; writes snapshot to `projectInstructionsVersions`
- `skills.listInstructionsVersions` — new; reads from `projectInstructionsVersions`
- `skills.saveInstructionsAudit` — new; writes to `projectInstructionsAudits`
- `skills.listInstructionsAudits` — new; reads from `projectInstructionsAudits`
- `skills.getProjectInstructions` / `skills.saveProjectInstructions` — kept (preamble storage)

**Frontend (`client/src/pages/Skills.tsx`):**
- `AddSkillDialog` component removed
- `DeleteSkillButton` component removed
- `SkillRow` now lazy-loads improvements via `trpc.skills.get` when expanded
- `FIXED_SECTIONS` constant added (5 toggleable blocks for Generator panel)
- `generateSkillTriggers` updated to trigger-only format (strips "Read before/when" prefix)
- `ProjectInstructions` rewritten with 3 panels:
  - **Generator**: Fixed Sections toggles + trigger-only skills block + live budget bar (vs 8,000 chars) + "Copy all" + "Mark as Applied" button
  - **Version History**: list of saved snapshots from `projectInstructionsVersions` DB table
  - **Audit**: static analysis sections + "Run Audit" button (opens modal with copy-ready prompt for pasting into a new Manus task) + list of stored audit findings from `projectInstructionsAudits`

**Tests (`server/skills.test.ts`):**
- Rewritten for new architecture — 22/22 passing
- Tests for `upsert` and `delete` removed
- Tests added for `getContent`, `saveInstructionsAudit`, `saveInstructionsVersion`

### Known issue: skills table still in DB

The `skills` table still exists in the DB because `DROP TABLE` is blocked by the safety system. The data is stale seed data (22 rows from `scripts/seed-skills.mjs`). No real data is at risk. To drop it:
1. Open the **Database panel** in the Management UI
2. Select the `skills` table
3. Delete all rows, then drop the table

The `seed-skills.mjs` script has been deleted — it is superseded by the `SKILLS_METADATA` constant in the router.

### Checkpoints
- `79e39347` — after schema + router changes (22/22 tests passing)
- `8252e07e` — after frontend changes (22/22 tests passing)

### SKILLS_METADATA — how to add a new skill

To add a new skill to the registry:
1. Create the skill directory: `/home/ubuntu/skills/{id}/SKILL.md`
2. Add an entry to `SKILLS_METADATA` in `server/routers/skills.ts` with the correct `id`, `name`, `description`, `tier`, `category`, `version`, `readWhen`, `hasReferences`
3. No DB migration required — the list is a TypeScript constant

### FIXED_SECTIONS — Project Instructions Generator

The Generator panel has 5 toggleable Fixed Sections:
1. **ERI workflow** — the 5-step ERI development workflow
2. **Exponential Framework** — 5×4 matrix, pillar/horizontal names
3. **Earth-Aligned AI Agent** — key files for the agent pipeline
4. **BDS compliance** — pre-action checklist reference
5. **Checkpoint discipline** — save-checkpoint rules

These are rendered before the skill triggers block in the combined output. The budget bar shows used/8,000 characters.
