# ERI Brand Design System — TODO

## Completed
- [x] ERI_HERO_IMAGE_TRUST added to @eri/components v2.10.6
- [x] @eri/components installed as pnpm workspace dependency
- [x] All 5 live component previews use real @eri/components
- [x] AlignmentTracker redesigned with ERI brand language
- [x] Both page hero sections aligned (same eyebrow, padding, typography)
- [x] EriAppHeader live preview sandboxed (isolation:isolate stacking context)
- [x] Server-side CORS proxy added (/api/fetch-bds-meta)
- [x] HAL project shows as Compliant (green dot, v2.10.6)
- [x] Expanded "How this tracker works" panel with canonical template + Copy button
- [x] ComponentName type fixed (canonical names: EriAppHeader, EriPageLayout, EriHeroSection, EriAppFooter, EriStatusBadge, EriContactUsButton)
- [x] COMPONENT_NAMES array fixed in AlignmentTracker.tsx
- [x] Copy template button string fixed (canonical component names)
- [x] BrandDesignSystem.tsx version references updated v2.10.0 → v2.10.6

## Pending
- [x] Push updated v2.10.6 Git tag
- [x] Fix tracker: used:false components must not trigger Violations status even if knownViolations is non-empty
- [x] Update field reference docs to clarify knownViolations should only contain entries for used:true components
- [ ] Publish BDS site (click Publish button)
- [ ] Add bds-meta.json to Trust site
- [ ] Update HAL's bds-meta.json to canonical object format
- [x] Add heroImages.trust to assets.ts and Surface Modes gallery
- [x] Audit all Standard Components prop descriptions against source code
- [x] Add live showScrollIndicator toggle to EriHeroSection preview
- [x] Fix PSM label: "Planetary Stewardship Monitor" -> "Professional Services Matrix" in tracker and BDS
- [x] Fix BDS colour table: clarify #3ba559 primary-green usage (NOT for filled buttons)
- [x] Fix BDS colour table: clarify #93E07D Accent Lime usage (typographic accent + CTA buttons on dark bg)
- [x] Update eri-bds-reference skill colour table to match corrected BDS rules
- [x] Full consistency audit: skill + BDS site vs component source — fix all 13 inconsistencies in one pass (S1–S11 in skill, B1–B2 in BDS site)
- [x] Add bds-meta.json Required Project File callout card to Machine Instructions section
- [x] Fix Machine Instructions Typography Rules: add Open Sans as body font (two-font system was only showing Archivo)
- [x] Update eri-bds-reference skill pre-action checklist item 5: add /tracker URL link for canonical template
- [x] Create BDS site's own client/public/bds-meta.json (was missing)
- [x] Bump @eri/components to v2.11.1 and update all version strings
- [x] Fix duplicate version display: remove Introduction section version line, keep header badge as canonical; update APP_VERSION to V.2026.04.21
- [x] Fix /tracker crash: TypeError on meta?.components[c] when components field is missing (Framework site uses legacy schema); added optional chaining and schema validation on fetch
- [x] Update eri-bds-reference skill: restructure pre-action checklist with Step 0 (Manus project instructions), Step 1 (PROJECT-CONTEXT.md for all ERI projects), Step 2 (bds-meta.json)
- [x] Add System Operations section to AlignmentTracker page: what/why/how display for PROJECT-CONTEXT.md and Manus project instructions pattern
- [x] Add PROJECT-CONTEXT.md seed template to /tracker System Operations HOW section with copy button
- [x] Add System Operations callout card to Machine Instructions section on main BDS page pointing to /tracker
- [x] Fix skill Gap 1: C5 showCTA wording — change to "Pass showCTA={true} explicitly, do not rely on default"
- [x] Fix skill Gap 2: C6 — add trust and bds to Contact Us Registered Source IDs table in skill
- [x] Add Project Alignment Checklist section to eri-bds-reference skill (S1-S3, B1-B5, C1-C7)
- [x] Add Project Alignment Checklist section to /tracker page with human-readable what/why for each item
- [x] Extend bds-meta.json schema: add systemOps, brand, layout self-reported compliance fields
- [x] Update bds-meta-spec.md with new schema fields
- [x] Update eri-bds-reference skill: add new fields to schema example and checklist
- [x] Update AlignmentTracker: Checklist score column, self-reporting note, updated canonical template and seed template
- [x] Update BDS site's own bds-meta.json with new fields
- [x] Apply PSM feedback: add explicit live-fetch instruction to skill — always fetch live tracker template before writing bds-meta.json, do not rely on skill's reproduced template
- [x] Move Checklist column to appear after CSS Import column in /tracker project table
- [x] Update Skills card in BrandDesignSystem.tsx: version v1.1.0 → v2.0.0, date → 23 Apr 2026, feature tags, CDN URLs, asset table version
- [x] Add Skill release process section to PROJECT-CONTEXT.md with upload command and current CDN URL

## Dark / Light Mode — v2.12.0
- [x] Update ThemeContext: key eri-theme, default dark, switchable=true
- [x] Add dark CSS token block to index.css (html.dark override)
- [x] Update App.tsx ThemeProvider: defaultTheme=dark, switchable=true
- [x] Add ThemeToggleButton component (sun/moon icon, tooltip, aria-label)
- [x] Wire ThemeToggleButton into SiteHeader in App.tsx
- [x] Add energy statement + toggle to PublicLayout footer (placeholder copy)
- [x] Add showThemeToggle prop to EriAppHeader in @eri/components
- [x] Add showThemeToggle prop to EriPageLayout in @eri/components (pass-through)
- [x] Bump @eri/components to v2.12.0
- [x] Update BDS site version strings and install command
- [x] Add 'Dark by Default' subsection to Surface Modes section (placeholder energy copy)
- [x] Update PROJECT-CONTEXT.md with dark mode decisions
- [x] Push v2.12.0 git tag
- [x] Save checkpoint
- [x] Update energy statement copy once updated research report arrives
- [x] Update eri-bds-reference skill with showThemeToggle prop and dark-by-default pattern

## Dark Mode — Full Implementation (Learning Exercise) v2.12.1

- [x] Define complete semantic token set in index.css (:root light, html.dark overrides)
- [x] Configure Tailwind dark variant (@custom-variant dark) in index.css
- [x] Replace structural bg/text/border colours in PublicLayout.tsx
- [x] Replace structural bg/text/border colours in App.tsx SiteHeader and TabNav
- [x] Replace structural bg/text/border colours in BrandDesignSystem.tsx layout wrappers (not doc swatches)
- [x] Replace structural bg/text/border colours in AlignmentTracker.tsx
- [x] Verify full-page dark mode visually in browser
- [x] Verify full-page light mode visually in browser
- [x] Iterate on colour issues found during visual testing
- [x] Document learnings in PROJECT-CONTEXT.md as canonical pattern
- [x] Checkpoint v2.12.1

## Dark Mode — Systematic Fix (All Pages)

- [x] Fix AlignmentTracker.tsx — replace T object structural colours (offWhite, bodyText, muted, border) with semantic Tailwind classes
- [x] Fix NotFound.tsx — replace hardcoded gradient and card background with semantic tokens
- [x] Update PROJECT-CONTEXT.md with dark mode rule: never use inline style for theme-sensitive colours
- [x] Verify dark mode works on all pages visually
- [x] Checkpoint

## Dark Mode Enforcement — Three-Layer System

- [x] Fix AlignmentTracker.tsx — replace T object structural colours with semantic Tailwind classes; fix pre-existing JSX error at line 477
- [x] Fix NotFound.tsx — replace hardcoded gradient and card background
- [x] Create client/src/pages/NewPage.tsx — canonical page template with semantic classes and warning comment
- [x] Update eri-bds-reference skill — add dark mode enforcement rule and semantic token mapping table
- [x] Update PROJECT-CONTEXT.md — add dark mode rule section with mapping table
- [x] Verify all pages in dark and light mode visually
- [x] Checkpoint

## Contrast Fixes (approved 2026-04-24)

- [x] Fix --muted-foreground in index.css dark block: oklch(0.55 0.01 247) → oklch(0.65 0.01 247)
- [x] Fix --border in index.css dark block: oklch(0.22 0 0) → oklch(0.28 0 0)
- [x] Replace hardcoded text-gray-500 in AlignmentTracker.tsx with text-muted-foreground (already done in previous session)
- [x] Verify visually in dark mode (BrandDesignSystem + AlignmentTracker pages)
- [x] Run TypeScript check (tsc --noEmit) — confirm 0 errors
- [x] Save checkpoint after contrast fixes confirmed

## BrandDesignSystem.tsx — Full Dark Mode Fix (2026-04-24)

- [x] Replace all structural text-gray-600/500/400/300 with text-muted-foreground / text-foreground
- [x] Replace all structural bg-white / bg-[#F9FAFB] / bg-gray-50 with bg-card / bg-muted
- [x] Replace all structural border-gray-200/300 with border-border
- [x] Fix SectionNavigator sidebar navigation contrast (section titles and subsection labels)
- [x] Preserve intentional documentation specimens (colour swatches, code blocks, live previews)
- [x] Visual verification in dark mode — all structural text passes WCAG AA (min 4.90:1, primary 14.98:1)
- [x] TypeScript check — 0 errors
- [x] Save checkpoint after BDS dark mode fix

## B6 Checklist Item — No Hardcoded Grey Classes (2026-04-24)

- [x] Add B6 check to Project Alignment Checklist in AlignmentTracker.tsx
- [x] Update bds-meta.json schema template to include brand.noHardcodedGreys field
- [x] Update checklistScore() function to score noHardcodedGreys
- [x] Update bds-meta.json on BDS site itself to include noHardcodedGreys: true
- [x] Update BrandCompliance TypeScript interface in bdsMetaTypes.ts
- [x] Save checkpoint after B6 addition

## eri-bds-reference skill update — B6 and dark mode enforcement (2026-04-24)

- [x] Read skill-creator skill and current eri-bds-reference SKILL.md
- [x] Add B6 to Project Alignment Checklist table in skill
- [x] Add noHardcodedGreys field to bds-meta.json schema example in skill
- [x] Dark Mode Enforcement section already existed in skill (comprehensive — no new content needed)
- [x] Bump skill version to v2.1.0
- [x] Upload updated skill to CDN (https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/eri-bds-reference-v2.1.0_50838fc0.skill)
- [x] Update BDS site Skills card (version badge v2.1.0, CDN URLs, date 24 Apr 2026)
- [x] Save checkpoint after skill update

## Project instructions + bds-meta.json updates (2026-04-24)

- [ ] Update Manus project instructions to reference eri-bds-reference v2.1.0 (requires manual UI update — no project.update API endpoint)
- [ ] Add noHardcodedGreys: true to HAL bds-meta.json (HAL fetch failed — site may be down; JSON prepared at /home/ubuntu/bds-meta-updates/hal-bds-meta.json)
- [ ] Add noHardcodedGreys: true to PSM bds-meta.json (JSON prepared at /home/ubuntu/bds-meta-updates/psm-bds-meta.json)
- [ ] Add noHardcodedGreys: true to Taxonomy bds-meta.json (JSON prepared at /home/ubuntu/bds-meta-updates/taxonomy-bds-meta.json)
- [ ] Add noHardcodedGreys: true to Framework bds-meta.json (JSON prepared at /home/ubuntu/bds-meta-updates/framework-bds-meta.json; also needs systemOps/brand/layout blocks added)
- [ ] Save checkpoint

## Schema versioning + changelog endpoint (2026-04-24)

- [x] Bump schemaVersion to 1.1 in bds-meta-spec.md
- [x] Bump schemaVersion to 1.1 in BDS site's own bds-meta.json
- [x] Bump schemaVersion to 1.1 in AlignmentTracker.tsx clipboard template and visible code block
- [x] Publish bds-meta-changelog.json to client/public/ on BDS site
- [x] Update eri-bds-reference skill Step 2 with changelog check instruction
- [x] Bump skill to v2.2.0 and upload to CDN
- [x] Update BDS site Skills card to v2.2.0
- [x] Update bds-meta-spec.md with schemaVersion increment rule and changelog reference
- [x] TypeScript check — 0 errors
- [x] Save checkpoint
