# Design note: ERI pages follow the device (9 Nov 2026)

**Decision:** Nicklas, 9 Nov 2026, asked "When someone opens an ERI page, should it start in light or follow their device's setting?", answered **"Follow the device"**. Every ERI app and site is to start in the device's light or dark setting; the switch (Light / Dark / System) comes with `showThemeToggle` or an app's own switch through `useEriTheme()`.

**Use case:** a reader whose device is set to dark gets ERI pages in the brand's dark colours without doing anything; anyone can still choose Light or Dark.

**What it removes:** the BDS's two defaults: light, device ignored (the site's head script, ThemeContext, the BDS page) against dark (EriAppHeader's fallback). Apps no longer need to force `eri-theme = light` to stop the header turning dark (the platform's CPR and story shells do that today).

## The rule, in one place
`packages/eri-components/src/eriTheme.ts`, exported from `@eri/components`:
- the choice: `eri-theme-preference` = `light` | `dark` | `system`; nothing stored means System;
- the theme in use: written to `eri-theme` (`light` | `dark`) and set as the `dark`/`light` class on `<html>`, so older readers of `eri-theme` agree;
- `ERI_THEME_SCRIPT`: the inline `<head>` script that applies it before the first paint (the BDS site's copy is checked by a test);
- `useEriTheme()`: the choice and the theme in use, kept current from this tab, other tabs and, with System, the device;
- `setEriThemePreference()` for an app's own switch.

An old `eri-theme` value is not read as a choice, because older code wrote it automatically. So every reader starts on System once.

## The header switch (`showThemeToggle`)
The sun/moon button becomes a three-choice switch: Light (sun), Dark (moon), System (screen). It is a radio group named "Appearance": each option has its name as label and tooltip ("System: follows your device"), the arrow keys move the choice, and focus stays on it. The colours are the header's own, as before. At 390 it sits in the first row, beside the menu button.

## Checked (platform harness, the BDS light and dark tokens only)
| Case | Result |
|---|---|
| First visit, device light / dark | light / dark from the head script, before any module runs; the switch shows System |
| Choose Dark on a light device; Light on a dark device | the page follows, and a reload keeps it |
| System, then the device changes | the page follows at once |
| Arrow key on the switch | the next choice, focus kept |
| Another tab | follows the choice |
| Errors, sideways overflow | 0, at 1440 and 390 |

Shots: `system-light-*`, `system-dark-*`, `chose-dark-on-light-device-*`, `chose-light-on-dark-device-*`, at 1440 and 390.
Tests: `test/eriTheme.test.mjs` covers the default, the rule, the head script run in a sandbox (first visit, stored choice, old `eri-theme`, no matchMedia, no storage) and the site's copy of the script.

## Not in this change
- The platform's switch in its account panel (UX's spec, Frontend's PR), which uses `useEriTheme()`.
- The header's existing inline colours, which stay as they are.
- The version number: it is set at merge, after #2 and #3.
