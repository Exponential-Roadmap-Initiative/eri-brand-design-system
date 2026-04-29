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
- [x] Save checkpoint

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

## Cross-site theme system skill fix — v2.3.0 (2026-04-24)

- [x] Add Cross-Site Theme System section to eri-bds-reference skill
- [x] Include canonical CSS token block (OKLCH values for :root light and .dark dark)
- [x] Include ThemeContext.tsx verbatim copy with localStorage key "eri-theme"
- [x] Include FOLC-prevention script for index.html
- [x] Fix bg-white / bg-card contradiction in Component & Layout Rules
- [x] Update pre-action checklist row with token resolution values
- [x] Update integration note 8 with bg-background resolution values
- [x] Add cross-site persistence callout card to BDS site Surface Modes section
- [x] Add "Cross-site theme system" tag to Skills card
- [x] Bump skill to v2.3.0 and upload to CDN
- [x] Update Skills card and asset table to v2.3.0
- [x] Update PROJECT-CONTEXT.md with v2.3.0 changelog
- [x] TypeScript check — 0 errors
- [x] Save checkpoint

## Contradiction audit fixes — v2.4.0 (2026-04-25)

- [x] C1: Fix Surface Modes dark card tokens from #0d2828/#1a3a3a to #111111/#1a1a1a; change badge from "Marketing" to "Default"
- [x] C2: Fix Surface Modes intro paragraph — dark mode is ERI default for all apps, not just marketing
- [x] C3: Replace "When to use which mode" decision rule — remove authenticated=light and dark-hero→light-app rules
- [x] C4a: Fix BDS EriPageLayout integration note — bg-[#F9FAFB] → bg-background
- [x] C4b: Fix BDS Machine Instructions Component Rules card — bg-[#F9FAFB] → bg-background
- [x] C4c: Fix Skill Tier A + Landing Hero interior page rule — #F9FAFB → bg-background
- [x] C4d: Fix Skill EriPageLayout note — typically bg-[#F9FAFB] → bg-background
- [x] C5: Fix Dark by Default section decorative boxes — bg-[#0d2828]/bg-[#0d1a0d] → bg-[#111111]/bg-[#1a1a1a]
- [x] C6: Fix Machine Instructions Component Rules card — "Card background: white" → bg-card
- [x] TypeScript check — 0 errors
- [x] Bump skill to v2.4.0, upload to CDN, update Skills card
- [x] Save checkpoint

## Stable skill distribution URL — v2.6.0 (2026-04-25)

- [x] Upload skill to stable latest URL (eri-bds-reference-latest.skill) — overwrites on every release
- [x] Update skill release process to overwrite latest URL on every release
- [x] Update BDS site Skills card with stable URL and download-first instruction
- [x] Update BDS site Machine Instructions with stable URL
- [x] Update PROJECT-CONTEXT.md with new distribution mechanism and instruction text for all ERI projects
- [x] Bump skill to v2.6.0
- [x] Save checkpoint

## Add curl skill-update to Machine Instructions (2026-04-25)

- [x] Add curl command as first item in Machine Instructions "Before You Act" checklist on BDS site
- [x] Fix /skill/latest route — moved to /api/skill/latest to avoid SPA catch-all shadowing
- [x] Update all references in BrandDesignSystem.tsx, SKILL.md, PROJECT-CONTEXT.md
- [x] TypeScript check — 0 errors
- [x] Save checkpoint

## Canonical dark mode token update — v2.7.0 (2026-04-25)

- [ ] Update index.css .dark token block — improved card/border/foreground OKLCH values
- [ ] Update skill Cross-Site Theme System token block to match
- [ ] Update BDS site Surface Modes dark card token display
- [x] TypeScript check — 0 errors
- [ ] Bump skill to v2.7.0, upload to CDN, update /api/skill/latest redirect
- [ ] Update Skills card and asset table to v2.7.0
- [x] Save checkpoint

## Light mode --foreground token fix — v2.7.0 (2026-04-26)

- [x] Update --foreground in index.css :root from oklch(0.17 0.005 285) (#232323) to oklch(0.24 0.005 285) (#383838)
- [x] Update --card-foreground, --popover-foreground, --accent-foreground in :root to match
- [x] Update skill canonical :root token block to match
- [x] Update skill token resolution reference table (--foreground light mode: #232323 → #383838)
- [x] Bump skill to v2.7.0 and upload to CDN
- [x] Update SKILL_LATEST_URL in server/_core/index.ts to v2.7.0 CDN URL
- [x] Update Skills card in BrandDesignSystem.tsx to v2.7.0
- [x] Update asset table row in BrandDesignSystem.tsx to v2.7.0
- [x] Update PROJECT-CONTEXT.md canonical colour table and skill release section
- [x] TypeScript check — 0 errors
- [x] Save checkpoint

## Card Accent Colour System — v2.8.0 (2026-04-26)

- [x] Add "Card Accent Colours" section to eri-bds-reference skill (palette table, canonical pattern, rules)
- [x] Add cardAccentPattern checklist item (B7) to skill Project Alignment Checklist
- [x] Add eyebrowAccentLime checklist item (B8) to skill Project Alignment Checklist
- [x] Update bds-meta.json schema example in skill with new brand fields
- [x] Add "Card Accent Colours" section to BrandDesignSystem.tsx (after Pillar Colours)
- [x] Add B7/B8 rows to AlignmentTracker.tsx checklist table
- [x] Update BDS site's own bds-meta.json with new fields (14/14 passing)
- [x] Update AlignmentTracker clipboard template and visible seed template with new fields
- [x] Bump skill to v2.8.0 and upload to CDN
- [x] Update SKILL_LATEST_URL in server/_core/index.ts
- [x] Update Skills card in BrandDesignSystem.tsx to v2.8.0
- [x] Update PROJECT-CONTEXT.md with v2.8.0 changelog
- [x] TypeScript check — 0 errors
- [x] Save checkpoint

## Complete Overlay / Nav Drawer Spec — v2.9.0 (2026-04-27)

- [x] Update skill Navigation section: add Universal Overlay Rules table
- [x] Update skill Navigation section: add Tier A Workflow overlay spec (PSM pattern)
- [x] Update skill Navigation section: add code example for overlay implementation
- [x] Update skill Navigation section: add backdrop, close button, group separator specs
- [x] Add overlay spec section to BDS site Navigation & Layout section
- [x] Add C8 checklist item: overlayBackground (bg-[#232323] not pure black)
- [x] Update LayoutCompliance TypeScript interface with overlayBackground field
- [x] Update AlignmentTracker with C8 checklist row
- [x] Update bds-meta.json templates with overlayBackground field
- [x] Update BDS site bds-meta.json with overlayBackground: true
- [x] Bump skill to v2.9.0 and upload to CDN
- [x] Update SKILL_LATEST_URL in server/_core/index.ts
- [x] Update PROJECT-CONTEXT.md with v2.9.0 changelog
- [x] TypeScript check — 0 errors
- [x] Save checkpoint

## BDS v3.0.0 — Holocen-inspired upgrades (2026-04-29)

- [x] Download Archivo WOFF2 files (400, 600, 700, 800) to client/public/fonts/
- [x] Download Open Sans WOFF2 files (400, 600, 700, 800) to client/public/fonts/
- [x] Add @font-face declarations to client/src/index.css
- [x] Remove Google Fonts <link> tags from client/index.html
- [x] Add bdsSpec.getSpec tRPC procedure to server/routers/bdsSpec.ts + registered in routers.ts
- [x] Add AI Agent section cards to BDS site (JSON Spec Endpoint, GDPR Font Self-Hosting, Canonical Source Files)
- [x] Reformat dark mode rules as two-column table in skill
- [x] Update skill Typography Rules: replace Google Fonts CDN snippet with @font-face template + GDPR note
- [x] Update skill B2/B3 checklist items to reflect self-hosted fonts
- [x] Add B9 gdprFonts to skill Project Alignment Checklist
- [x] Add B9 gdprFonts row to AlignmentTracker.tsx
- [x] Add gdprFonts to BrandCompliance TypeScript interface
- [x] Update AlignmentTracker clipboard template and visible seed template to schema v1.2
- [x] Update BDS site bds-meta.json to schema v1.2 with gdprFonts: true
- [x] Bump skill to v3.0.0 and upload to CDN
- [x] Update SKILL_LATEST_URL in server/_core/index.ts
- [x] Update Skills card in BrandDesignSystem.tsx to v3.0.0
- [x] Update PROJECT-CONTEXT.md with v3.0.0 changelog and GDPR font rule
- [x] TypeScript check — 0 errors
- [x] Save checkpoint

## BDS v3.0.1 — AI Agent instruction gap fixes (2026-04-29)

- [x] Gap 1: Update bds-meta.json schema example in skill to v1.2 (add gdprFonts, cardAccentPattern, eyebrowAccentLime, overlayBackground)
- [x] Gap 3: Add CSS import step (Step 3b) to handoff_prompt in bdsSpec.ts
- [x] Gap 5: Add "Start Here" card to Machine Instructions section in BrandDesignSystem.tsx
- [x] Gap 4: Rename C section to "Components & Layout" in AlignmentTracker.tsx
- [x] Gap 2: Update hardcoded version tag in handoff_prompt to reference components.latestPin
- [x] Bump skill to v3.0.1 and upload to CDN
- [x] Update SKILL_LATEST_URL in server/_core/index.ts
- [x] Update Skills card in BrandDesignSystem.tsx to v3.0.1
- [x] Update bds-meta.json date
- [x] Update PROJECT-CONTEXT.md with v3.0.1 changelog
- [x] TypeScript check — 0 errors
- [x] Save checkpoint
