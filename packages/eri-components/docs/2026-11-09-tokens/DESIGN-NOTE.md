# Design note: one token file, three layers, light and dark (design-system step 1, 9 Nov 2026)

**Nicklas, 9 Nov 2026:** "we need to start planning for a proper modern token based design system across the complete ERI Platform - like the legacy BDS page tried to do but did not do properly". Asked "Go ahead with the 7-step design-system plan?", he answered "Yes, go ahead".

**Use case:** a designer or developer changes an ERI colour, font or spacing value in one file, and the BDS site and, after their pin bump, every ERI app take it, in light and dark.

**What it removes:** the split between the BDS site (which held every value in `client/src/index.css`) and the package (which held none and only read them). From here, `tokens/tokens.json` is the only place a value is written.

## The file
`tokens/tokens.json`, W3C Design Tokens Community Group format (`$type`, `$value`, `$description`, references as `{path}`; the dark value in `$extensions["org.exponentialroadmap.mode"].dark`; values are CSS strings).
- **primitive** (raw values): 46 colours, 3 font families, 5 weights, 9 sizes, 10 line heights, 10 spaces, 1 radius, 2 shadows, 3 durations, 1 easing, 5 z-index steps, 4 breakpoints. Names: `--eri-<kind>-<name>`. Neutral and status colours are named by OKLCH lightness × 100 (`--eri-gray-9` is the dark page, `--eri-gray-98` the light page).
- **semantic** (44, each a reference to a primitive, light and dark): the names the components already read, unchanged (`--background` … `--ring`, `--success`, `--danger`, `--warning`, `--radius`, `--space-1…6`, `--shadow-sm`, `--font-archivo`), plus `--font-body`, `--font-heading`, `--pillar-1…5` and the six brand aliases `--brand-*`.
- **component**: none yet. No component on main needs its own token; the table's `--eri-dt-*` (#3) move in when #3 lands.

## Values: what is new
- **No raw value is new.** Every value is copied from BDS main 2a7aaa9: `client/src/index.css` (colours, radius, fonts), the BDS page (spacing scale, brand swatches), `client/src/lib/pillarColors.ts` (pillars and tints), and the Tailwind 4.2.2 defaults the site renders with (type scale, shadows, easing, breakpoints).
- **Truly new: dark values for the six brand aliases.** `brand-green`, `brand-dark-green`, `brand-dark-green-alt` and `brand-blue` keep their light value in dark; `brand-heading` becomes the dark body text (`--eri-gray-94`) and `brand-page-bg` the dark page (`--eri-gray-9`). Today no page uses these aliases as a utility class, so nothing renders differently.
- **Tokens for the first time:** spacing (4–96 px), the type scale and line heights, shadows (`sm`, `md`), motion (150, 300, 500 ms; one easing), z-index (10, 30, 40, 50, 60, from the site's use), breakpoints (640, 768, 1024, 1280), pillar colours and tints, the brand swatches (lime, yellow, neutral gray, body gray).

## What changes on the BDS page
Compared element by element (computed colour, background, borders, shadow, fonts, sizes) on 8,782 elements, before and after, in light and in dark:
- **one change:** body text is Open Sans, as every written rule says (6,464 elements; headings stay Archivo). It was Archivo, because the site's CSS was never updated when Open Sans was added on 19 Mar.
- the Typography section's sentence that said web apps map `font-sans` to Archivo now says `font-sans` is Open Sans; two code chips say the same.
- no colour, border, shadow, size or weight differs.

Shots: `before-*` and `after-*`, `top` and `typography`, light and dark, 1440 and 390. Rendered with the site's own CSS and page component in a local harness (the site's server, routes and data calls stubbed). At 390, the page runs 1,446 px wider than the screen before and after alike (unchanged by this PR).

## Contrast (from `node scripts/check-tokens.mjs`)
| Pair | Kind | Mode | Ratio | Needs | Result |
|---|---|---|---|---|---|
| foreground on background | text | light | 15.72:1 | 4.5:1 | pass |
| foreground on background | text | dark | 17.37:1 | 4.5:1 | pass |
| foreground on card | text | light | 16.46:1 | 4.5:1 | pass |
| foreground on card | text | dark | 16.88:1 | 4.5:1 | pass |
| card-foreground on card | text | light | 16.46:1 | 4.5:1 | pass |
| card-foreground on card | text | dark | 16.88:1 | 4.5:1 | pass |
| popover-foreground on popover | text | light | 16.46:1 | 4.5:1 | pass |
| popover-foreground on popover | text | dark | 16.88:1 | 4.5:1 | pass |
| muted-foreground on background | text | light | 4.61:1 | 4.5:1 | pass |
| muted-foreground on background | text | dark | 6.41:1 | 4.5:1 | pass |
| muted-foreground on card | text | light | 4.83:1 | 4.5:1 | pass |
| muted-foreground on card | text | dark | 6.23:1 | 4.5:1 | pass |
| muted-foreground on muted | text | light | 4.39:1 | 4.5:1 | known gap |
| muted-foreground on muted | text | dark | 6.16:1 | 4.5:1 | pass |
| secondary-foreground on secondary | text | light | 8.39:1 | 4.5:1 | pass |
| secondary-foreground on secondary | text | dark | 12.28:1 | 4.5:1 | pass |
| accent-foreground on accent | text | light | 14.96:1 | 4.5:1 | pass |
| accent-foreground on accent | text | dark | 15.96:1 | 4.5:1 | pass |
| primary-foreground on primary | text | light | 3.88:1 | 4.5:1 | known gap |
| primary-foreground on primary | text | dark | 3.88:1 | 4.5:1 | known gap |
| destructive-foreground on destructive | text | light | 4.56:1 | 4.5:1 | pass |
| destructive-foreground on destructive | text | dark | 4.56:1 | 4.5:1 | pass |
| success on card | text | light | 7.13:1 | 4.5:1 | pass |
| success on card | text | dark | 11.54:1 | 4.5:1 | pass |
| danger on card | text | light | 6.47:1 | 4.5:1 | pass |
| danger on card | text | dark | 7.27:1 | 4.5:1 | pass |
| warning on card | text | light | 7.09:1 | 4.5:1 | pass |
| warning on card | text | dark | 13.95:1 | 4.5:1 | pass |
| success on background | text | light | 6.81:1 | 4.5:1 | pass |
| success on background | text | dark | 11.88:1 | 4.5:1 | pass |
| danger on background | text | light | 6.18:1 | 4.5:1 | pass |
| danger on background | text | dark | 7.48:1 | 4.5:1 | pass |
| warning on background | text | light | 6.77:1 | 4.5:1 | pass |
| warning on background | text | dark | 14.35:1 | 4.5:1 | pass |
| brand-heading on brand-page-bg | text | light | 15.04:1 | 4.5:1 | pass |
| brand-heading on brand-page-bg | text | dark | 17.37:1 | 4.5:1 | pass |
| ring on background | non-text | light | 3.71:1 | 3:1 | pass |
| ring on background | non-text | dark | 5.34:1 | 3:1 | pass |
| ring on card | non-text | light | 3.88:1 | 3:1 | pass |
| ring on card | non-text | dark | 5.19:1 | 3:1 | pass |
| input on card | non-text | light | 1.27:1 | 3:1 | known gap |
| input on card | non-text | dark | 1.16:1 | 3:1 | known gap |
| border on card | non-text | light | 1.27:1 | 3:1 | known gap |
| border on card | non-text | dark | 1.38:1 | 3:1 | known gap |

The seven "known gap" rows fail today with the brand's current values. The check holds them where they are: none may get worse, and each entry must be removed once its pair passes. Fixing them changes brand values, so they wait for Nicklas:
- white text on ERI green (3.88:1; passes 3:1 for large or bold text only);
- muted text on the muted surface, light (4.39:1);
- the text-field edge (`--input`) and separators (`--border`) on the card, light and dark (1.16–1.38:1). Separators are outside WCAG 1.4.11; a field whose only boundary is its edge is not.

## Found, not changed (for UX and Nicklas)
- `--foreground` in light is `oklch(0.24 0.005 285)`, which is #1f1f22. The docs call it #383838 (the brand's body grey), which would be `oklch(0.34 …)`.
- `--primary` is `oklch(0.59 0.14 145)`, which is #3e9245. The brand's Primary Green is #3ba559 (`--brand-green`). Buttons and the green the docs name differ slightly.
- The Typography card says Archivo weights 400–900; the site hosts 400–800.

## Not in this change
- The package components' own raw colours (EriAppHeader, EriPageLayout's #232323) and the 28 px theme options: step 3.
- Any platform change: step 2, the first pin bump.
- The version: set at merge, the next free minor after #2, #3 and #4. Until then the surface check fails on purpose ("added without a minor bump").
