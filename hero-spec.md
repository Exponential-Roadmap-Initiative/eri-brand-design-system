# EriHeroSection — Complete Design Spec v2.10.0

## Lessons from previous component iterations

### From EriAppHeader / EriPageLayout
1. **Dead internal state** — never hold state inside a component that the consuming app should own.
   EriHeroSection has no interactive state — it is purely presentational.

2. **Silent failures from missing props** — EriAppHeader's CTA silently disappeared when source props were missing.
   Fix: all required props are non-optional. Optional props have sensible defaults baked in.
   The `backgroundImage` prop defaults to the canonical hands CDN URL — no need to pass it for standard use.

3. **No automatic top padding** — EriPageLayout does not add pt-16; pages must clear the fixed header themselves.
   Fix: EriHeroSection adds `paddingTop: '64px'` internally via inline style on the section element.
   Consuming projects do NOT need to add pt-16 themselves when using EriHeroSection.

4. **Outer background colour bleed** — EriPageLayout sets #232323 on its wrapper; pages must set their own bg.
   EriHeroSection is a full-viewport section — it sets its own background via the backgroundImage + overlay.
   No bg class needed on the consuming page's wrapper for the hero area.

5. **--eri-content-inset must be defined** — EriAppHeader relies on this CSS variable.
   EriHeroSection also uses it. The JSDoc must make this explicit with a fallback value in the component itself.
   Fallback: `clamp(1rem, 3vw, 2rem)` — component works even without the variable defined.

6. **Tailwind 4 CSS purging** — consuming projects must import `@eri/components/dist/eri-components.css`.
   EriHeroSection uses only inline styles for brand colours (not Tailwind colour utilities) to avoid purging.
   Structural classes (flex, items-center, etc.) are in the pre-built CSS via the @source directive.

### From showCTA iterations
7. **Prop naming clarity** — `showCTA` caused confusion because the default intent was unclear.
   EriHeroSection has no ambiguous boolean props. All props are either required strings or optional with clear defaults.

8. **JSDoc must document the "always" rule** — not just what the prop does but what the correct value always is.
   Applied throughout EriHeroSection JSDoc.

---

## Component spec

### Visual reference
- Live: https://human-ai-lab.exponentialroadmap.org/
- Background image: centred (`50% 50%`), cover — the hands composition is designed to be centred
- Text block: left half of viewport, left-aligned, vertically centred
- Overlay: `rgba(35, 35, 35, 0.82)` — brand dark, NOT pure black, NOT 40% opacity

### Layout
- Section: `min-h-screen`, `flex flex-col justify-center`, `overflow-hidden`, `w-full`
- Top padding: `paddingTop: '64px'` inline — clears the fixed 64px header (EriPageLayout does NOT do this)
- Background: inline style `backgroundImage`, `backgroundSize: cover`, `backgroundPosition: 50% 50%`
- Overlay: absolute inset div, `rgba(35,35,35,0.82)` — separate from background so opacity is independent
- Content container: `relative z-10`, `w-full max-w-screen-xl mx-auto`, `paddingInline: var(--eri-content-inset, clamp(1rem, 3vw, 2rem))`
- Text block: `max-w-xl text-left` — constrains text to left half; right half open for image composition

### Typography
- Eyebrow: `text-[11px] font-semibold uppercase tracking-widest`, colour `#93E07D`, `mb-5`
- H1 titleLine1: `font-extrabold leading-tight`, `clamp(2.5rem, 5vw, 3.75rem)`, colour `#93E07D`
- H1 titleLine2: same size, colour `white`
- Body: `text-base md:text-lg leading-relaxed`, colour `rgba(255,255,255,0.85)`, `mb-8`

### CTA buttons
- Container: `flex flex-wrap gap-3`
- Primary: `inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold`
  - bg: `#93E07D`, text: `#1a1a1a`, hover: `opacity-90`
  - NEVER `rounded-full`, NEVER icon prefix
- Secondary: same sizing, `border: '2px solid white'`, `text-white`, `bg-transparent`, hover: `bg-white/10`
  - NEVER `rounded-full`, NEVER icon prefix

### Props interface
| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `eyebrow` | `string` | Yes | — | Full eyebrow string e.g. "EXPONENTIAL HUMAN-AI LAB ——— BETA" |
| `titleLine1` | `string` | Yes | — | First H1 line — displayed in Accent Lime |
| `titleLine2` | `string` | No | — | Second H1 line — displayed in white |
| `body` | `string` | Yes | — | Body paragraph |
| `primaryCTA` | `{ label, href }` | Yes | — | Accent Lime filled button |
| `secondaryCTA` | `{ label, href }` | No | — | White outline button |
| `backgroundImage` | `string` | No | halHandsTouching CDN URL | Only override for app-specific images |
| `overlayOpacity` | `number` | No | `0.82` | 0–1. Overlay colour is always #232323 |
| `children` | `ReactNode` | No | — | Optional slot below CTAs (stat counters, scroll indicator) |

### Named export
- `EriHeroSection` — default and named export
- `ERI_HERO_IMAGE_HANDS` — named export of the canonical CDN URL so consuming projects can reference it

### index.ts update
- Export `ERI_HERO_IMAGE_HANDS` as a named export alongside `EriHeroSection`

---

## Integration checklist for consuming projects

1. `@import "@eri/components/dist/eri-components.css"` at top of `index.css` (v2.9.1+)
2. `:root { --eri-content-inset: clamp(1rem, 3vw, 2rem); }` in `index.css`
3. Use `EriHeroSection` as the FIRST child inside `EriPageLayout` — no extra `pt-16` needed on the page
4. Do NOT wrap `EriHeroSection` in a div that has `pt-16` — the component handles its own header clearance
5. Do NOT pass a custom `backgroundImage` unless the app has its own hero image — the default is the canonical hands image

---

## Non-conformant patterns (for BDS site red box)

- Centred text (`text-center`) — always left-aligned
- Top-anchored text (no `flex justify-center`) — always vertically centred
- Pure black overlay (`bg-black/40`) — always `rgba(35,35,35,0.82)`
- Pill CTA (`rounded-full`) — always `rounded-lg`
- Icon prefix on CTA buttons — text only
- Accent word in Primary Green (`#3ba559`) — always Accent Lime (`#93E07D`) on dark backgrounds
- Wrapping `EriHeroSection` in a `pt-16` div — the component handles its own header clearance
