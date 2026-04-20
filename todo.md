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
