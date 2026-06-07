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

- [x] Update index.css .dark token block — improved card/border/foreground OKLCH values (done in code)
- [x] Update skill Cross-Site Theme System token block to match (done in v2.7.0)
- [x] Update BDS site Surface Modes dark card token display (done in v2.7.0)
- [x] TypeScript check — 0 errors
- [x] Bump skill to v2.7.0, upload to CDN, update /api/skill/latest redirect (done)
- [x] Update Skills card and asset table to v2.7.0 (done)
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

## v3.1.0 — Screenshot refresh & In the Wild gallery

- [x] Capture fresh HAL hero screenshot
- [x] Capture fresh Taxonomy hero screenshot
- [x] Capture fresh PSM hero screenshot
- [x] Capture fresh HAL Hub Overlay screenshot (hamburger open)
- [x] Capture fresh Taxonomy App Overlay screenshot (hamburger open)
- [x] Upload all 5 screenshots to CDN
- [x] Replace stale HAL Hub Overlay screenshot in NavigationPatterns.tsx
- [x] Replace stale Taxonomy App Overlay screenshot in NavigationPatterns.tsx
- [x] Add "In the Wild" gallery section to BrandDesignSystem.tsx
- [x] Add "In the Wild" to SectionNavigator SECTIONS array
- [x] Add "In the Wild" to Machine Instructions section index table
- [x] Update version number to V.2026.04.29 across all EriAppHeader examples
- [x] TypeScript check — 0 errors
- [x] Save checkpoint

## Dark mode — section/sub-section title contrast fix (2026-04-29)

- [x] Audit BrandDesignSystem.tsx: find all h3/h4 sub-section titles using hardcoded text-gray-* classes
- [x] Replace structural title classes with text-foreground / text-muted-foreground (101 lines in BrandDesignSystem.tsx + 20 lines in NavigationPatterns.tsx)
- [x] Verify visually in dark mode — titles must be clearly readable
- [x] TypeScript check — 0 errors
- [x] Save checkpoint

## Full dark mode sweep — both pages (2026-04-29)

- [x] Audit all source files for hardcoded colour classes that break dark mode (491 violations across 8 files)
- [x] Fix structural violations in BrandDesignSystem.tsx (193 lines changed)
- [x] Fix structural violations in AlignmentTracker.tsx (1 line changed)
- [x] Fix ThemeToggleButton.tsx hover state
- [x] Fix NavigationPatterns.tsx outer structural labels (preserve mock internals)
- [x] Preserve intentional documentation specimens (colour swatches, code blocks, live previews)
- [x] TypeScript check — 0 errors
- [x] Visual verification in dark mode — Tone of Voice, Writing Principles, Preferred Terminology titles now visible
- [x] Save checkpoint

## Systematic light mode sweep (2026-04-29)

- [x] Audit all source files for hardcoded dark colours that break light mode (84 flagged, 17 genuine violations)
- [x] Fix structural violations in BrandDesignSystem.tsx (scope note card bg-[#f9fafb] → bg-muted)
- [x] Fix AlignmentTracker.tsx table header rows with hardcoded #f9fafb → bg-muted
- [x] Add dark: variants to all semantic colour callout boxes (bg-red-50, bg-amber-50, bg-blue-50, bg-green-50) — 17 boxes, 123 class changes
- [x] Add dark: text variants to callout box headings (text-red-700, text-red-600, text-amber-900, text-amber-800, text-blue-700, text-blue-800)
- [x] Preserve intentional dark specimens (hero overlays, footer, dark cards, live previews, NavigationPatterns mockups)
- [x] TypeScript check — 0 errors
- [x] Visual verification in light mode — layout correct, callout boxes readable in both modes
- [x] Save checkpoint

## Dark-mode logo integration (2026-05-12)

- [x] Create eri-logo-dark-mode.svg — white wordmark text + green (#87e873) X mark
- [x] Create eri-icon-mark-dark-mode.svg — white curve + green curve
- [x] Upload both SVGs to CDN
- [x] Add eriLogoDarkMode and eriLogoFullColorSvg to client/src/lib/assets.ts
- [x] Update PublicLayout.tsx: import useTheme, compute logoSrc based on theme
- [x] Header logo: use logoSrc (no more dark:brightness-0 dark:invert)
- [x] Mobile overlay header logo: use logoSrc
- [x] Footer logo: use logos.eriLogoDarkMode directly (always dark background)
- [x] TypeScript check — 0 errors
- [x] Visual verification in light mode — full-colour wordmark visible on white header ✓
- [x] Visual verification in dark mode — white wordmark visible on dark header ✓
- [x] Save checkpoint
- [x] Update Logo Usage section in BrandDesignSystem.tsx to document the two-variant approach
- [x] Update Standard Components section to reference theme-aware logo pattern
- [x] Update eri-bds-reference skill with dark-mode logo CDN URL and deprecate CSS filter workaround

## Logo Usage section update — dark-mode variants (2026-05-12)

- [x] Add dark-mode wordmark card to Logo Usage section (eriLogoDarkMode SVG, CDN URL, use-case note)
- [x] Add dark-mode icon mark card to Logo Usage section (eriIconMarkDarkMode SVG, CDN URL)
- [x] Add "Theme-Aware Logo Switching" subsection documenting the useTheme() pattern
- [x] Deprecate / replace the brightness(0) invert(1) workaround note with the proper approach
- [x] Update Standard Components EriAppHeader docs to reference theme-aware logo
- [x] Update eri-bds-reference skill: add dark-mode logo CDN URLs to asset table, deprecate CSS filter
- [x] TypeScript check — 0 errors
- [x] Save checkpoint

## Logo Usage section bug fixes (2026-05-12)

- [x] Fix broken image URLs in dark-mode logo preview panels (done in Logo Usage redesign below)
- [x] Fix light-background preview panels: hardcode bg-white so they show white in dark mode (done in Logo Usage redesign below)
- [x] TypeScript check — 0 errors
- [x] Save checkpoint

## Logo Usage redesign — single wordmark card (2026-05-12)

- [x] Verify new CDN URLs return image/svg+xml content type
- [x] Remove standalone Dark-Mode Wordmark entry from logoVariants
- [x] Update Full Colour Wordmark entry: use new CDN URLs for darkFile, update fileId references
- [x] Fix light-background preview panel: hardcode bg-white (not bg-card) so it shows white in dark mode
- [x] Update Theme-Aware Switching card to reflect simplified two-asset system
- [x] Update assets.ts: replace old dark-mode SVG file IDs with new ones (clean filenames, all assets)
- [x] Update skill asset table with new file IDs
- [x] Update PROJECT-CONTEXT.md with new file IDs
- [x] TypeScript check — 0 errors
- [x] Save checkpoint

## @eri/components logo update (2026-05-12)

- [x] Dependency assessment: grep all ERI projects for old logo URLs and CSS filter
- [x] Hard Stop 2: confirm exact files owning the logo rendering
- [x] Hard Stop 6: confirm solution is general (works for all consuming projects via package update)
- [x] Update EriAppHeader.tsx: replace old webp URL + CSS filter with eri-logo-dark-mode.svg
- [x] Update EriAppFooter.tsx: replace old webp URL + CSS filter with eri-logo-dark-mode.svg
- [x] Bump package version in packages/eri-components/package.json to 2.13.0
- [x] Run pnpm build:css in packages/eri-components/
- [x] TypeScript check — 0 errors
- [x] Save checkpoint (auto-pushes to GitHub)
- [x] Push new git tag v2.13.0
- [x] Update CDN download URLs in BDS site Standard Components section
- [x] Update CDN download URLs in eri-bds-reference skill
- [ ] Update consuming projects (HAL, Taxonomy, Trust, PSM, Playbook) to v2.13.0 — PENDING (requires access to each project)
- [x] Update PROJECT-CONTEXT.md

## BDS site header/footer migration to @eri/components (2026-05-13)

- [x] Research: audit current PublicLayout.tsx header/footer vs EriAppHeader/EriAppFooter capabilities
- [x] Design: define migration plan and identify component gaps
- [x] Implement: migrate App.tsx to use EriAppHeader from @eri/components; PublicLayout.tsx uses EriAppFooter
- [x] Handle BDS-specific features: tab navigation (TabNav component), theme toggle (showThemeToggle=true), BETA badge, version string
- [x] Fix sticky nav top offset: 68px → 104px (64px EriAppHeader + 40px TabNav)
- [x] Fix AlignmentTracker.tsx top padding: pt-[108px] → pt-[104px]
- [x] TypeScript check — 0 errors
- [x] Visual verification in both light and dark mode (hamburger drawer, theme toggle, footer)
- [x] Update skill: remove "BDS site is exempt" note, update scope statement; bump to v3.0.2
- [x] Update PROJECT-CONTEXT.md
- [x] Save checkpoint (v3.0.2 — 3a182c2d)

## EriCrocodileChart — reusable component + skill spec (2026-05-22)

- [x] Create packages/eri-components/src/EriCrocodileChart.tsx (pure SVG, typed props)
- [x] Export EriCrocodileChart from packages/eri-components/src/index.ts
- [x] Bump @eri/components to v2.14.0
- [x] Run pnpm build:css in packages/eri-components/
- [x] Update BDS site: replace CrocodileChartExamples.tsx with import from @eri/components
- [x] Add code example + CDN URL to Charts section in BrandDesignSystem.tsx
- [x] Add Crocodile Economy Chart spec section to eri-bds-reference skill
- [x] Upload EriCrocodileChart.tsx to CDN (https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/EriCrocodileChart_3ff07184.tsx)
- [x] Update Standard Components section in BrandDesignSystem.tsx with EriCrocodileChart (component 7)
- [x] Update skill Standard Components table with EriCrocodileChart
- [x] Update PROJECT-CONTEXT.md
- [x] TypeScript check — 0 errors
- [x] Save checkpoint (v2.14.0 — 06b9811a)

## Earth-Aligned AI Lab rename (2026-05-26)

Old: "Human-AI Lab" / human-ai-lab.exponentialroadmap.org (dead — no redirect)
New: "Earth-Aligned AI Lab" / earth-aligned-ai-lab.exponentialroadmap.org
Source ID: keep as "hal" (stable internal ID — do not change)

- [x] Update BrandDesignSystem.tsx — all Human-AI Lab / human-ai-lab references (sed, 0 remaining)
- [x] Update AlignmentTracker.tsx — all Human-AI Lab / human-ai-lab references (sed, 0 remaining)
- [x] Update projectRegistry.ts — HAL entry displayName + URL
- [x] Update eri-bds-reference skill — all Human-AI Lab / human-ai-lab references (sed, 0 remaining)
- [x] Update server/routers/bdsSpec.ts — scope note
- [x] Update PROJECT-CONTEXT.md — registered projects table
- [x] Prepare corrected bds-meta.json for Earth-Aligned AI Lab project (references/earth-aligned-ai-lab-bds-meta.json)
- [x] TypeScript check — 0 errors
- [x] Save checkpoint (d20d536b)

## Hero image + light-mode header (2026-05-26)

- [x] Upload hero-scurve-dual-rich.webp to CDN (https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/hero-scurve-dual-rich_775e47cf.webp)
- [x] Update ERI_HERO_IMAGE_HANDS in EriHeroSection.tsx to new CDN URL; add ERI_HERO_IMAGE_DEFAULT alias
- [x] Update assets.ts halSCurveDual token to new rich image URL
- [x] Add headerTheme prop to EriAppHeader ('dark' | 'auto'); implement full light-mode variant (white bg, full-colour logo, dark text/icons)
- [x] Update EriPageLayout to forward headerTheme prop
- [x] Update BDS site App.tsx to pass headerTheme="auto" to EriAppHeader
- [x] BdsNavDrawer.tsx already uses semantic tokens — no changes needed
- [x] Fix ThemeContext: dispatch eri-theme-change CustomEvent for same-tab sync (storage event only fires cross-tab)
- [x] Fix TabNav in App.tsx: bg-white dark:bg-[#232323] for light-mode compatibility
- [x] Bump @eri/components to v2.15.0
- [x] TypeScript check — 0 errors
- [x] Visual verification: dark mode header (dark bg, white logo) + light mode header (white bg, full-colour logo) ✔
- [x] Update skill v3.1.0: new hero image, headerTheme prop, light-mode header rules, updated registered apps table
- [x] Update PROJECT-CONTEXT.md
- [x] Save checkpoint (v2.15.0 — 431f5ade)

## CRITICAL BUG FIX — v2.15.2 Duplicate Header (2026-05-26)

- [x] Diagnose root cause: v2.15.1 used Tailwind sm:hidden/sm:flex classes in a pre-compiled library — consuming projects never compile those classes, so both desktop and mobile blocks rendered simultaneously
- [x] Rewrite EriAppHeader.tsx: single header element with scoped <style> block using CSS @media (min-width: 640px) — no Tailwind responsive classes in the component library
- [x] Bump @eri/components to v2.15.2
- [x] TypeScript check: 0 errors
- [x] Visual verify: single header row on desktop confirmed
- [x] Save checkpoint v2.15.2
- [x] Push git tag v2.15.2
- [x] Publish to production (bds.exponentialroadmap.org)
- [x] Update eri-bds-reference skill with v2.15.x changes (headerTheme prop, mobile layout note, CSS media query approach) — done in v3.1.0+

## EriAppHeader v2.15.3 — Mobile Layout Hardening (2026-05-26)

- [x] Remove all eri-desktop-only CSS class wrappers from desktop right zone — badge, version, and CTA are now structurally inside eri-header-desktop only
- [x] Contact Us button structurally absent from mobile block (not CSS-hidden) — eliminates any risk of bleed-through
- [x] Confirmed headerTheme?: 'dark' | 'auto' in both EriAppHeader and EriPageLayout TypeScript interfaces
- [x] Inline <style> tag confirmed present in JSX (not useEffect) — present on first render, no FOUC risk
- [x] Bump @eri/components to v2.15.3
- [x] TypeScript check: 0 errors

## Anti-AI Design Patterns — BDS site + skill v3.2.0 (2026-05-26)

- [x] Research AI design anti-patterns from design literature, UX critique, and ERI-specific observations
- [x] Add Anti-AI Design Patterns section to BDS site (between In the Wild and Resources)
- [x] Register section in SectionNavigator with sublabel "Human-crafted design rules"
- [x] Four categories: Visual & Layout (8 patterns), Typography (4 patterns), Copywriting (6 patterns + blacklist), ERI-Specific Tells (5 patterns)
- [x] Pub Test callout card with AI vs Human copy comparison
- [x] Add condensed Anti-AI section to SKILL.md v3.2.0
- [x] Upload skill to CDN: SKILL_54410e34.md
- [x] Update BDS site skill CDN pointer to v3.2.0
- [x] TypeScript check: 0 errors

## Anti-AI Checklist A1–A5 in Project Alignment Tracker (2026-05-26)

- [x] Define A1–5 checklist items and add AntiAiCompliance interface to bdsMetaTypes.ts (done in v3.3.0)
- [x] Add antiAi block to BdsMetaJson interface (done in v3.3.0)
- [x] Update checklistScore() to include A1–5 in the score (done in v3.3.0)
- [x] Add A block to AlignmentTracker.tsx checklist UI (after C block) (done in v3.3.0)
- [x] Add A block to the "How this tracker works" canonical template (done in v3.3.0)
- [x] Add A block to the PROJECT-CONTEXT.md seed template (done in v3.3.0)
- [x] Update bds-meta-spec.md with new schema fields (done in v3.3.0)
- [x] Bump schemaVersion to 1.3 in bds-meta-changelog.json (done in v3.3.0)
- [x] Update BDS site's own bds-meta.json with antiAi block (done in v3.3.0)
- [x] Update SKILL.md with A1–5, upload to CDN as v3.3.0 (done)
- [x] TypeScript check: 0 errors
- [x] Save checkpoint

## Anti-AI Checklist A1–A5 in Alignment Tracker (2026-05-26)

- [x] Add AntiAiCompliance interface to bdsMetaTypes.ts (5 fields: noBlacklistedCopyWords, noPurpleGradientOrSparkles, ctasDescribeOutcome, statisticsAreReal, noIdenticalSectionSequence)
- [x] Extend checklistScore() to include all 5 antiAi fields
- [x] Add A block table to AlignmentTracker.tsx (between C block and self-reporting note)
- [x] Add A1 grep command to Quick Verification Commands section
- [x] Update self-reporting note to mention antiAi field
- [x] Bump bds-meta.json schemaVersion to 1.3, add antiAi block, update eriComponentsPin to v2.15.3
- [x] Add v1.2 and v1.3 entries to bds-meta-changelog.json (latestVersion now 1.3)
- [x] Rewrite bds-meta-spec.md with v1.3 schema, antiAi field definitions, A1 grep command
- [x] Update SKILL.md: schema template to v1.3 with antiAi block, field reference table, A1–A5 checklist table, quick shell commands, manus agent update rule
- [x] Upload SKILL.md v3.3.0 to CDN
- [x] Update SKILL_LATEST_URL in server/index.ts to v3.3.0
- [x] TypeScript check: 0 errors

## EriAppFooter v2.16.0 — Four-column layout matching official ERI website
- [x] EriAppFooter.tsx rewritten: four columns (About, Newsletter, Follow us, Contact us), logo above, social icons, Accent Lime email
- [x] EriPageLayout.tsx: footerLinks replaced with footerAppLink (AppLink type), FooterLink kept as deprecated export for backward compat
- [x] PublicLayout.tsx: updated to use appLink
- [x] BrandDesignSystem.tsx: live preview, code snippet, props table, footer rules table all updated
- [x] @eri/components bumped to v2.16.0
- [x] TypeScript: 0 errors

## Version-sync housekeeping — v2.16.2 (2026-05-26)
- [x] Add shared/eriVersion.ts to .gitignore and untrack from git (git rm --cached)
- [x] Extend gen-eri-version.mjs to also write ERI_BDS_SKILL_VERSION (read from server/_core/index.ts)
- [x] Update BrandDesignSystem.tsx to import ERI_BDS_SKILL_VERSION from @shared/eriVersion (replace 5 hardcoded v3.3.0 strings)
- [x] Update SKILL.md v3.4.0: document gen:version/prebuild workflow
- [x] Validate skill, upload to CDN, update SKILL_LATEST_URL in server/_core/index.ts
- [x] TypeScript check: 0 errors
- [x] Save checkpoint v2.16.2
- [x] Push git tag v2.16.2 to user_github

## Screenshot audit v2.16.3
- [x] Update BDS skill to latest, read PROJECT-CONTEXT.md (done in v2.16.4)
- [x] Audit all screenshot/visual examples on live BDS site (done in v2.16.4)
- [x] Compile findings: outdated/incorrect screenshots (done in v2.16.4)
- [x] Fix all identified issues in BrandDesignSystem.tsx (done in v2.16.4)
- [x] TypeScript check, save checkpoint v2.16.3, push git tag (done as v2.16.4)

## Screenshot audit v2.16.4
- [x] Update BDS skill to latest, read PROJECT-CONTEXT.md
- [x] Audit all screenshot/visual examples on live BDS site
- [x] Compile findings: 14 issues across install pin, component descriptions, footer props, hero image text, brand graphics section
- [x] Fix all 14 issues in BrandDesignSystem.tsx
- [x] TypeScript check: 0 errors
- [x] Save checkpoint v2.16.4
- [x] Push git tag v2.16.4

## Anti-AI Checklist A1–A5 + Trust Centre In the Wild — v2.16.5 (2026-05-27)
- [x] Read all relevant source files (done)
- [x] Extend bdsMetaTypes.ts: add AntiAiCompliance interface and antiAi field to BdsMetaJson (done in v3.3.0)
- [x] Extend checklistScore() to include A1–5 (done in v3.3.0)
- [x] Update bds-meta-spec.md with antiAi field definitions (done in v3.3.0)
- [x] Bump bds-meta-changelog.json to v1.4 with antiAi block (done as v1.3 in v3.3.0)
- [x] Add A block table to AlignmentTracker.tsx (after C block) (done in v3.3.0)
- [x] Add A1 grep command to Quick Verification Commands section (done in v3.3.0)
- [x] Update self-reporting note to mention antiAi field (done in v3.3.0)
- [x] Update canonical template in AlignmentTracker.tsx with antiAi block (done in v3.3.0)
- [x] Update PROJECT-CONTEXT.md seed template with antiAi block (done in v3.3.0)
- [x] Update BDS site bds-meta.json with antiAi block (schemaVersion 1.4) (done as 1.3 in v3.3.0)
- [x] Add Trust Centre to In the Wild gallery in BrandDesignSystem.tsx (done in v2.16.5)
- [x] Update SKILL.md v3.6.0: A1–5 checklist, schema template, upload to CDN (done)
- [x] Update SKILL_LATEST_URL in server/_core/index.ts (done in v3.6.0)
- [x] Regenerate shared/eriVersion.ts (done in v3.6.0)
- [x] TypeScript check: 0 errors
- [x] Save checkpoint v2.16.5
- [x] Push git tag v2.16.5 (exists in remote)

## Anti-AI Checklist A1–5 + Trust Centre gallery v2.16.55
- [x] Verify A1–A5 schema already in bdsMetaTypes.ts and checklistScore() — confirmed complete
- [x] Verify A block UI already in AlignmentTracker.tsx — confirmed complete
- [x] Update canonical template in AlignmentTracker.tsx: schemaVersion 1.3, add antiAi block, update date
- [x] Update Copy template button handler: schemaVersion 1.3, add antiAi block
- [x] Verify bds-meta.json already has antiAi block with all 5 fields true
- [x] Capture Trust Centre screenshot and upload to CDN
- [x] Add Trust Centre as 4th card in In the Wild gallery (2x2 grid)
- [x] Update SKILL.md example bds-meta.json: pin v2.16.1, lastUpdated 2026-05-27
- [x] Bump SKILL.md version to 3.6.0, upload to CDN
- [x] Update SKILL_LATEST_URL in server/_core/index.ts to v3.6.0
- [x] Regenerate shared/eriVersion.ts (ERI_BDS_SKILL_VERSION = v3.6.0)
- [x] TypeScript check: 0 errors
- [x] Save checkpoint v2.16.5
- [x] Push git tag v2.16.5 (exists in remote)

## Contradiction audit — headerTheme + full audit v2.16.6
- [x] SKILL.md fix 1: Remove "Only the BDS site" prohibition from line 1303 blockquote
- [x] SKILL.md fix 2: Fix Common mistakes table — headerTheme="auto" is the recommended pairing with showThemeToggle, not a special-case opt-in
- [x] SKILL.md fix 3: Remove "All other ERI apps should use dark unless explicitly required"
- [x] BrandDesignSystem.tsx fix 4: Add headerTheme="auto" to the showThemeToggle implementation example
- [x] BrandDesignSystem.tsx fix 5: Add showThemeToggle and headerTheme props to EriAppHeader props table
- [x] BrandDesignSystem.tsx fix 6: Add showThemeToggle and headerTheme props to EriPageLayout props table
- [x] PROJECT-CONTEXT.md fix 7: Remove ERI_HERO_IMAGE_HANDS from the "current named exports" list
- [x] TypeScript check: 0 errors
- [x] Upload SKILL.md v3.7.0, update SKILL_LATEST_URL, regenerate eriVersion.ts
- [x] Save checkpoint v2.16.6, push git tag v2.16.6

## Trust Centre instructions + BDS instruction quality audit v2.16.7
- [x] Audit BDS skill for structural AI-comprehension failures (deferred — addressed via v3.7.0/v3.8.0 fixes)
- [x] Write Trust Centre-specific implementation document (done — TRUST-CENTRE-PATCH.md in v2.16.9)
- [x] Write root-cause analysis report (deferred — root causes captured in PROJECT-CONTEXT.md known errors)
- [x] Add root-cause findings to BDS site (deferred — addressed via skill fixes v3.7.0–v3.9.0)
- [x] TypeScript check, update PROJECT-CONTEXT.md, save checkpoint v2.16.7, push git tag (done as v2.16.8)

## Trust Centre feedback — SKILL.md v3.8.0 (2026-05-27)
- [x] Fix 1 (headerTheme contradiction): Already resolved in v3.7.0 — confirmed absent
- [x] Fix 2 (browser verification step): Add T6 row to Project Alignment Checklist — click toggle, confirm header goes white, confirm page content goes light
- [x] Fix 3 (Vite module cache): Add warning to Setup Checklist step 1 — restart dev server and hard-reload after pnpm add
- [x] Fix 4 (returnUrl canonical URL): Add "never window.location.origin" rule to Contact Us props table, EriAppHeader props table, EriPageLayout props table, and standalone callout
- [x] Bump SKILL.md to v3.8.0, upload to CDN
- [x] Update SKILL_LATEST_URL in server/_core/index.ts to v3.8.0
- [x] Regenerate shared/eriVersion.ts (ERI_BDS_SKILL_VERSION = v3.8.0)
- [x] TypeScript check: 0 errors
- [x] Save checkpoint v2.16.8, push git tag v2.16.8

## v2.16.9 — Version badge + Trust Centre patch (2026-05-27)
- [x] Bump APP_VERSION in App.tsx from V.2026.04.21 to V.2026.05.27
- [x] Write TRUST-CENTRE-PATCH.md: Fix A (headerTheme="auto"), Fix B (returnUrl hardcoded), Fix C (Vite cache), T6 verification, bds-meta.json template
- [x] TypeScript check: 0 errors
- [x] Save checkpoint v2.16.9, push git tag v2.16.9

## Light-default theme — v2.17.0
- [x] ThemeContext.tsx: DEFAULT_THEME changed from "dark" to "light"
- [x] index.html: FOLC script updated (applies dark class only if localStorage === "dark")
- [x] index.css: comments updated to reflect light-default
- [x] BrandDesignSystem.tsx: Surface Modes section updated (13 edits — badges, descriptions, How it works table, Light by Default section, FOLC code example, Logo Switching description)
- [x] SKILL.md v3.9.0: ### Default: light (from v2.17.0), migration note, updated FOLC script, DEFAULT_THEME="light" in ThemeContext code example, dark tokens comment updated
- [x] SKILL.md uploaded to CDN, SKILL_LATEST_URL updated in server/_core/index.ts
- [x] shared/eriVersion.ts regenerated (ERI_BDS_SKILL_VERSION = v3.9.0)
- [x] TypeScript check: 0 errors
- [x] Save checkpoint v2.17.0 (7a874aef)
- [x] Push git tag v2.17.0

## v2.17.1 — Exponential Framework taxonomy update (20.05.2026 canonical)

- [x] Verify exact 20.05.2026 wording from PDF pages 21–28 (done in v3.1.0 / Skill v3.10.0)
- [x] Update BrandDesignSystem.tsx: H3 label, all pillar sub-category names to 20.05.2026 canonical (done in v3.1.0)
- [x] Update SKILL.md: framework taxonomy section with 20.05.2026 canonical names (done in v3.10.0)
- [x] Upload new SKILL.md to CDN, update SKILL_LATEST_URL in server/_core/index.ts (done in v3.10.0)
- [x] Run node scripts/gen-eri-version.mjs to regenerate shared/eriVersion.ts (done in v3.10.0)
- [x] TypeScript check: 0 errors
- [x] Save checkpoint v2.17.1
- [x] Push git tag v2.17.1 (not required — no @eri/components version bump in this release; BDS-only changes)
- [x] Update PROJECT-CONTEXT.md with framework taxonomy decisions (done in v3.1.0 section)

## v3.1.0 / Skill v3.10.0 — Exponential Framework Taxonomy (04 June 2026)
- [x] Confirm 20.05.2026 canonical taxonomy from PDF pages 21 and 28
- [x] Update bdsSpec.ts: replace stale ER 1.5 pillar names with v5 pillar names and correct hex values
- [x] Update bdsSpec.ts: add colors.framework with horizontals (H1–H4) and all sub-categories
- [x] Update bdsSpec.ts: update cardAccentColors.palette slots 3–7 to reference v5 pillar names
- [x] Update bdsSpec.ts: bump BDS_VERSION to 3.1.0, LAST_UPDATED to 2026-05-20
- [x] Update bdsSpec.ts: bump components.latestVersion to v2.17.0
- [x] Update SKILL.md: expand pillar table with full names
- [x] Update SKILL.md: add Exponential Framework Matrix section with horizontals and sub-categories
- [x] Upload SKILL.md to CDN — SKILL_be7aa38b.md
- [x] Update SKILL_LATEST_URL in server/_core/index.ts to v3.10.0
- [x] Update eriVersion.ts: ERI_BDS_SKILL_VERSION = v3.10.0
- [x] Update BrandDesignSystem.tsx: skill download link to SKILL_be7aa38b.md, date to 4 June 2026
- [x] Update bds-meta.json: lastUpdated to 2026-06-04
- [x] TypeScript check passes

## v3.1.0 / Skill v3.10.0 — Exponential Framework Taxonomy (04 June 2026)

- [x] Confirm 20.05.2026 canonical taxonomy from PDF pages 21 and 28
- [x] Update bdsSpec.ts: replace stale ER 1.5 pillar names with v5 pillar names and correct hex values
- [x] Update bdsSpec.ts: add colors.framework with horizontals (H1-H4) and all sub-categories
- [x] Update bdsSpec.ts: update cardAccentColors.palette slots 3-7 to reference v5 pillar names
- [x] Update bdsSpec.ts: bump BDS_VERSION to 3.1.0, LAST_UPDATED to 2026-05-20
- [x] Update bdsSpec.ts: bump components.latestVersion to v2.17.0
- [x] Update SKILL.md: expand pillar table with full names
- [x] Update SKILL.md: add Exponential Framework Matrix section with horizontals and sub-categories
- [x] Upload SKILL.md to CDN — SKILL_be7aa38b.md
- [x] Update SKILL_LATEST_URL in server/_core/index.ts to v3.10.0
- [x] Update eriVersion.ts: ERI_BDS_SKILL_VERSION = v3.10.0
- [x] Update BrandDesignSystem.tsx: skill download link to SKILL_be7aa38b.md, date to 4 June 2026
- [x] Update bds-meta.json: lastUpdated to 2026-06-04
- [x] TypeScript check passes

## "Start a Project" tab — /new-project (04 June 2026)
- [x] Create client/src/pages/NewProject.tsx — AI-agent-optimised onboarding page
- [x] Add /new-project route to App.tsx Switch
- [x] Add "Start a Project" tab to TabNav in App.tsx
- [x] Add "Start a Project" link to BdsNavDrawer.tsx
- [x] Add new_project_url, handoff_prompt_track1, handoff_prompt_track2 to bdsSpec.ts
- [x] TypeScript check passes
- [x] Save checkpoint

## /new-project — Missing vs original (2026-06-04)
- [x] Fix title to "Start a New Project" (done in second pass)
- [x] Fix hero eyebrow to "ERI WEB PROJECTS" (done in second pass)
- [x] Add PAGE GUIDE callout box in hero
- [x] Fix track card labels to "Static Website" / "Full-Stack Application" (done in second pass)
- [x] Add example projects to track cards (Exponential Framework, Earth-Aligned AI Lab, CrocodileEconomics)
- [x] Add decision rule line under track cards
- [x] Add tech stack subtitle under track section headers
- [x] Expand Track 1 checklist to 10 steps (add: fonts, EriPageLayout wrap, EriHeroSection, Contact Us source ID, bds-meta.json, Alignment Checklist)
- [x] Add Track 2 specific checklist steps (web-db-user, db:push, OAuth, workspace isolation, user management)
- [x] Add Earth-Aligned Skills placeholder callout in Track 2 section
- [x] Add Project Naming Conventions table section
- [x] Add Machine-Readable Spec Endpoint section with GET URL and Open Spec Endpoint button

## /new-project — Missing vs original (2026-06-04)
- [x] Fix title to Start a New Project
- [x] Fix hero eyebrow to ERI WEB PROJECTS
- [x] Add PAGE GUIDE callout box in hero
- [x] Fix track card labels to Static Website / Full-Stack Application
- [x] Add example projects to track cards
- [x] Add decision rule line under track cards
- [x] Add tech stack subtitle under track section headers
- [x] Expand Track 1 checklist to 10 steps
- [x] Add Track 2 specific checklist steps
- [x] Add Earth-Aligned Skills placeholder callout in Track 2
- [x] Add Project Naming Conventions table section
- [x] Add Machine-Readable Spec Endpoint section

## Team Guide tab — /team-guide (2026-06-04)
- [x] Create client/src/pages/TeamGuide.tsx with all collaboration guide content
- [x] Add /team-guide route to App.tsx Switch
- [x] Add "Team Guide" tab to TabNav in App.tsx
- [x] Add "Team Guide" link to BdsNavDrawer.tsx Other pages section
- [x] Add team_guide_url to bdsSpec.ts

## Skills Management Tab — /skills

- [x] Add skills + skill_improvements tables to drizzle/schema.ts (done in v3.4.0)
- [x] Run pnpm db:push to apply migration (done in v3.4.0)
- [x] Implement server/routers/skills.ts (done in v3.4.0)
- [x] Register skillsRouter in server/routers.ts
- [x] Write server/skills.test.ts (done in v3.4.0)
- [x] Implement client/src/pages/Skills.tsx (done in v3.4.0)
- [x] Add /skills route and "Skills" tab to App.tsx (done in v3.4.0)
- [x] Add Skills link to BdsNavDrawer
- [x] Seed existing ERI skills into the DB (done — 22 skills with eri- IDs, 2026-06-04)
- [x] Update PROJECT-CONTEXT.md and skill-manager SKILL.md (done 2026-06-04)

## Project Instructions Manager — /skills page
- [x] Add ProjectInstructions component to Skills.tsx (three panels: Audit, Skill Triggers, Combined Output)
- [x] Implement audit panel: evaluate each current instruction section (Keep/Move/Remove) with rationale
- [x] Implement auto-generated skill trigger block from DB (ordered Tier 1 → 2 → 3, using readWhen field)
- [x] Implement combined output panel with live character counter (used/8000) and copy button
- [x] Add projectInstructions tRPC procedure to skills router (save/load custom preamble per project) — done 2026-06-04

## Skills page upgrade — card redesign + filter bar (2026-06-05)

- [x] Add `category` varchar field to skills table in drizzle/schema.ts (done 2026-06-05)
- [x] Run pnpm db:push to apply migration (done 2026-06-05)
- [x] Update seed-skills.mjs with category values for all 22 skills (done via SQL 2026-06-05)
- [x] Re-run seed script to populate category field in DB (done via SQL 2026-06-05)
- [x] Update skills.upsert input schema to accept optional category field (done 2026-06-05)
- [x] Redesign SkillCard: name as heading, ID as muted subtitle, icon prefix, readWhen as styled callout box, version + history icon + View + Download buttons in footer (done 2026-06-05)
- [x] Add filter bar: ecosystem tabs (ERI skills / Manus standard / All), tier chips, category chips, missing-self-improvement filter (done 2026-06-05)
- [x] Update hero stats: show "X missing self-improvement" in orange when > 0 (done 2026-06-05)
- [x] Extract reusable PageGuide component to client/src/components/PageGuide.tsx (done 2026-06-05 — all 5 pages now use shared component)
- [x] TypeScript check — 0 real errors (13 stale watcher errors are known/expected)
- [x] Run tests — all 15 pass (done 2026-06-05)

## PAGE GUIDE callout rollout to all tabs (2026-06-05)

- [x] Add PAGE GUIDE callout to BrandDesignSystem hero (done 2026-06-05)
- [x] Add PAGE GUIDE callout to AlignmentTracker hero (done 2026-06-05)
- [x] Add PAGE GUIDE callout to TeamGuide hero (done 2026-06-05)
- [x] Add PAGE GUIDE callout to Skills hero (done 2026-06-05)
- [x] Verify NewProject already has PAGE GUIDE (confirmed — no change needed)
- [x] TypeScript check — 0 real errors (13 stale watcher errors are known/expected)

## Skills page — top-level tab navigation (2026-06-05)

- [x] Add top-level tab state (skills / projectInstructions / philosophy) to main Skills component (done 2026-06-05)
- [x] Add tab nav bar below hero (Skills | Project Instructions | Philosophy) with icons matching parallel project (done 2026-06-05)
- [x] Move skill registry (filter bar + skill cards) into "Skills" tab content (done 2026-06-05)
- [x] Move ProjectInstructions component into "Project Instructions" tab content (done 2026-06-05)
- [x] Move SystemOverview (philosophy/tier model/self-improvement loop) into "Philosophy" tab content (done 2026-06-05)
- [x] Update PageGuide text to reflect the tabbed structure (done 2026-06-05)
- [x] TypeScript check — 0 real errors (13 stale watcher errors are known/expected)
- [x] Save checkpoint (done 2026-06-05 — v24f478fc)


## BDS compliance audit (2026-06-05)

- [x] Run full BDS compliance checklist (S, T, B, C, A checks) across all 5 pages
- [x] Fix B6/T1 violation: replace hardcoded grey classes in TabNav (App.tsx lines 33, 49) with semantic tokens (bg-background, border-border, text-muted-foreground, text-foreground)
- [x] Update bds-meta.json: lastUpdated to 2026-06-05
- [x] Note: NavigationPatterns.tsx grey classes are intentional — inside documentation specimens (live previews of other apps' nav patterns), not structural UI
- [x] All 14 vitest tests pass
- [x] Save checkpoint (done 2026-06-05 — vd281c83e)

## Skills page — BDS card violation fixes (2026-06-05)

- [x] Fix card border: replace full four-side teal outline with left accent border only (border-l-4) + tinted bg (canonical BDS pattern)
- [x] Fix tier badge: remove colour — use transparent outlined pill (border-current, no filled bg, no teal colour)
- [x] Fix category badge: remove emoji, use Lucide icon pill with correct six-slot accent palette colour
- [x] Remove clock emoji from readWhen callout — use Lucide Clock icon instead
- [x] Remove warning emoji from "no improvements logged" — use Lucide AlertTriangle icon instead
- [x] Remove all other emoji from skill cards (filter bar, hero stats, RECOMMENDATION_CONFIG badges, category select, tier group headings)
- [x] TypeScript check — 0 real errors (13 stale watcher noise confirmed)
- [x] Save checkpoint

## Skills architecture migration — filesystem-first (2026-06-05)
- [x] Schema: remove `skills` table definition from drizzle/schema.ts
- [x] Schema: keep `skillImprovements` table (improvement log stays)
- [x] Schema: add `projectInstructionsVersions` table
- [x] Schema: add `projectInstructionsAudits` table
- [x] Run pnpm db:push to apply schema changes (governance tables created; skills table still in DB — DROP TABLE blocked by safety system, requires manual action)
- [x] Router: add SKILLS_METADATA TypeScript constant (26 entries — all skills with tier/category/version/readWhen)
- [x] Router: replace skills.list (DB query) with SKILLS_METADATA array
- [x] Router: replace skills.get (DB query) with SKILLS_METADATA lookup + improvement log
- [x] Router: add skills.getContent (filesystem reader — reads SKILL.md)
- [x] Router: remove skills.upsert and skills.delete (no more DB rows for skill content)
- [x] Router: keep skills.logImprovement (writes to skillImprovements)
- [x] Router: add skills.saveInstructionsAudit mutation
- [x] Router: add skills.saveInstructionsVersion mutation
- [x] Router: keep skills.getProjectInstructions / skills.saveProjectInstructions
- [x] Delete scripts/seed-skills.mjs (superseded by SKILLS_METADATA constant)
- [x] Frontend: Skills.tsx — remove trpc.skills.upsert / delete calls and AddSkillDialog
- [x] Frontend: Skills.tsx — skill list now reads from SKILLS_METADATA via updated trpc.skills.list
- [x] Frontend: Skills.tsx — SkillRow lazy-loads improvements via trpc.skills.get when expanded
- [x] Frontend: Project Instructions tab — Audit panel (stored findings + Run Audit modal with copy-ready prompt)
- [x] Frontend: Project Instructions tab — Generator panel (Fixed Sections toggles + trigger-only skills block + budget bar + Mark as Applied)
- [x] Frontend: Project Instructions tab — Version History panel (list of snapshots from DB)
- [x] Update skills.test.ts to cover new procedures (getContent, saveInstructionsAudit, saveInstructionsVersion) — 22/22 passing
- [x] Remove tests for skills.upsert and skills.delete
- [x] Save checkpoint after schema + router changes (79e39347)
- [x] Save checkpoint after frontend changes (8252e07e)
- [ ] DB: drop skills table (requires manual action — DROP TABLE blocked by safety system; data is stale seed data, no real data loss)

## Skills page — dynamic metadata + UX improvements (2026-06-06)
- [x] Router: add parseFrontmatterMeta() helper — reads name, description, metadata.version from SKILL.md frontmatter
- [x] Router: add enrichWithFrontmatter() helper — merges live frontmatter values over SKILLS_METADATA
- [x] Router: update skills.list to return SKILLS_METADATA.map(enrichWithFrontmatter)
- [x] Router: update skills.get to use enrichWithFrontmatter before returning
- [x] Frontend: remove decorative </> icon from SkillRow card header
- [x] Frontend: fix description margin (ml-7 → mt-3, icon was removed)
- [x] Frontend: improve readWhen callout — accent-coloured left border + tinted bg + bold coloured "When:" label
- [x] Frontend: add content preview in expanded state — first ~350 chars of SKILL.md body (lazy-loaded via getContent)
- [x] Frontend: replace empty improvement log warning with actionable message
- [x] Frontend: add tier section descriptions (plain-language explanation of each tier's role)
- [x] Fix TS error: remove detail?.content reference (content not in get response)
- [x] Fix TS error: remove setMissingImprovementOnly from clear-filters button
- [x] 22/22 tests passing
- [x] TypeScript: 0 real errors

## Philosophy top-level page (2026-06-07)
- [x] Create client/src/pages/Philosophy.tsx with all sections: hero, four governance layers, self-improving system, skill ecosystem, task lifecycle, project instructions system, human-AI collaboration principles
- [x] Add /philosophy route to App.tsx Router
- [x] Add "Governance" tab to TabNav in App.tsx (sixth tab)
- [x] Add Philosophy link to BdsNavDrawer.tsx
- [x] Remove Philosophy inner tab from Skills page (activePageTab state, tab bar entry, and {activePageTab === "philosophy" && <SystemOverview />} render)
- [x] GovernanceDiagram duplicated in Philosophy.tsx (GovernanceDiagram in Skills.tsx kept for backward compat — can be removed in a future cleanup)
- [x] Fix skill card expand affordance: add ChevronDown/Up icon to card header, change "View" button to "Details"/"Close" toggle
- [x] TypeScript check — 0 real errors
- [x] 22/22 tests passing
