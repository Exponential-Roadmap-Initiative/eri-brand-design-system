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

Package: `@eri/components` — current pin: **v2.10.7**

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

## Known pending work (as of 2026-04-20)

- [ ] Publish BDS site (click Publish button in Management UI)
- [ ] Add `bds-meta.json` to Trust site — it is the only registered project still missing the file
- [ ] Update HAL's `bds-meta.json` to canonical object format (currently using legacy string format)

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

10. **Manual hero container code block was not marked as fallback** — an AI reading the skill would build the hero manually instead of using `EriHeroSection`. Fixed 2026-04-20: block now labelled “Manual hero container structure (fallback only — prefer `EriHeroSection`)” with a mandatory preference note.

---

## How to verify consistency before closing any task

Before saving a checkpoint, run this mental checklist:

1. Does any rule in the Machine Instructions section of the BDS site contradict the Colour System section? (Check body text colour, heading colour, CTA colour.)
2. Does the skill Typography Rules section match the BDS site Typography section?
3. Do all component names in the skill and BDS site match the six canonical names?
4. Does the skill Colour Tokens table include `#383838` Dark Gray as the body text colour?
5. Are all prop tables in the BDS site complete and matching the component source in `packages/eri-components/src/`?
6. If the `@eri/components` version was bumped: has the git tag been created AND pushed to `user_github`? Run `git ls-remote --tags user_github | grep v2.` to verify. **Never bump version strings in files without also pushing the tag.**

If any answer is "no" or "unsure", fix it before closing the task.

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
