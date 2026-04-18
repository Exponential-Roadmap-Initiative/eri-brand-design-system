# EriHeroSection — Self-Review Checklist

Simulating a consuming project (e.g. Taxonomy) integrating EriHeroSection for the first time.

## Known failure modes from previous components → checked against EriHeroSection

### 1. Silent prop failures
- EriAppHeader: CTA silently disappeared when source/sourceLabel/returnUrl were missing.
- EriHeroSection: `backgroundImage` defaults to ERI_HERO_IMAGE_HANDS — no silent failure.
  `primaryCTA` is required (non-optional TypeScript) — TypeScript will error if omitted. ✓

### 2. Dead internal state
- EriPageLayout: had internal `menuOpen` that was set but never read.
- EriHeroSection: zero internal state. Purely presentational. ✓

### 3. Double top padding
- EriPageLayout: does NOT add pt-16; pages must do it themselves.
- EriHeroSection: adds `paddingTop: '64px'` internally.
  Risk: consuming project wraps it in a `pt-16` div → 128px gap.
  Mitigation: JSDoc explicitly says "Do NOT wrap it in a div with pt-16". ✓
  BDS site non-conformant patterns list includes this. ✓

### 4. Background colour bleed
- EriPageLayout: sets #232323 on outer wrapper; pages must override.
- EriHeroSection: sets its own background via backgroundImage + overlay.
  The #232323 from EriPageLayout will show for ~1 frame before the image loads.
  This is acceptable and matches HAL's behaviour. ✓

### 5. --eri-content-inset not defined
- EriAppHeader: relies on this variable with no fallback.
- EriHeroSection: uses `var(--eri-content-inset, clamp(1rem, 3vw, 2rem))` with fallback. ✓
  Component works even if the variable is absent.

### 6. Tailwind 4 CSS purging
- All structural classes (min-h-screen, justify-center, tracking-widest, font-extrabold,
  flex-wrap, rounded-lg) confirmed present in dist/eri-components.css. ✓
- Brand colours (#93E07D, #1a1a1a, rgba(35,35,35,...)) are inline styles — not Tailwind utilities.
  They are NOT subject to purging. ✓

### 7. Named export for the image URL
- Consuming project can do: `import { ERI_HERO_IMAGE_HANDS } from '@eri/components'`
  This is exported from index.ts. ✓

### 8. TypeScript types
- All props are typed. `primaryCTA` is required. `secondaryCTA` is optional.
- `overlayOpacity` is typed as `number` — TypeScript will catch string values. ✓
- `backgroundImage` is typed as `string` — TypeScript will catch non-string values. ✓

### 9. Minimal integration example (what a consuming project writes)
```tsx
// App.tsx or HomePage.tsx
import { EriHeroSection } from '@eri/components';

<EriHeroSection
  eyebrow="EXPONENTIAL TAXONOMY ——— BETA"
  titleLine1="Exponential"
  titleLine2="Taxonomy"
  body="A science-backed classification system for corporate climate action."
  primaryCTA={{ label: "Explore the Taxonomy", href: "/taxonomy" }}
  secondaryCTA={{ label: "View Methodology", href: "/methodology" }}
/>
```
No backgroundImage needed. No overlayOpacity needed. No pt-16 wrapper needed. ✓

### 10. Edge case: no secondaryCTA
```tsx
<EriHeroSection
  eyebrow="EXPONENTIAL PLATFORM ——— PILOT"
  titleLine1="Exponential"
  titleLine2="Platform"
  body="The ERI member workspace."
  primaryCTA={{ label: "Access Workspace", href: "/workspace" }}
/>
```
Secondary CTA block is conditionally rendered — no empty space left behind. ✓

### 11. Edge case: no titleLine2
```tsx
<EriHeroSection
  eyebrow="CROCODILE ECONOMICS ——— PROTOTYPE"
  titleLine1="Crocodile Economics"
  body="Revenue up. Emissions down."
  primaryCTA={{ label: "Explore the Data", href: "/data" }}
/>
```
titleLine2 block is conditionally rendered — H1 is a single line in Accent Lime. ✓

### 12. Edge case: custom backgroundImage
```tsx
import { EriHeroSection } from '@eri/components';

<EriHeroSection
  eyebrow="CROCODILE ECONOMICS ——— PROTOTYPE"
  titleLine1="Crocodile"
  titleLine2="Economics"
  body="Revenue up. Emissions down."
  primaryCTA={{ label: "Explore the Data", href: "/data" }}
  backgroundImage="https://cdn.example.com/croc-hero.webp"
  overlayOpacity={0.75}
/>
```
Custom image + adjusted opacity. ✓

## Result: PASS — all known failure modes addressed
