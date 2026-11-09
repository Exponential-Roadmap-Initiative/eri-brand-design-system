import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import vm from "node:vm"
// The one ERI theme rule (Nicklas, 9 Nov 2026: "Follow the device"). Run: node --test packages/eri-components/test/
import { ERI_THEME_DEFAULT, ERI_THEME_SCRIPT, parseThemePreference, themeFor } from "../src/eriTheme.ts"

test("with no choice stored, the default is System", () => {
  assert.equal(ERI_THEME_DEFAULT, "system")
  for (const v of [null, undefined, "", "dark-ish", "auto"]) assert.equal(parseThemePreference(v), "system")
  for (const v of ["light", "dark", "system"]) assert.equal(parseThemePreference(v), v)
})

test("System follows the device; Light and Dark do not", () => {
  assert.equal(themeFor("system", true), "dark"); assert.equal(themeFor("system", false), "light")
  assert.equal(themeFor("light", true), "light"); assert.equal(themeFor("dark", false), "dark")
})

// Runs the head script in a bare page: localStorage, a device setting and <html>'s classes.
function runScript({ stored = {}, deviceDark = false, matchMedia = true } = {}) {
  const store = { ...stored }; const classes = new Set()
  const window = matchMedia ? { matchMedia: q => ({ matches: q === "(prefers-color-scheme: dark)" && deviceDark }) } : {}
  const ctx = { window, localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v) } },
    document: { documentElement: { classList: { toggle: (c, on) => { on ? classes.add(c) : classes.delete(c) } } } } }
  vm.runInNewContext(ERI_THEME_SCRIPT, ctx)
  return { classes: [...classes].sort().join(","), theme: store["eri-theme"] }
}

test("the head script: a first visit follows the device", () => {
  assert.deepEqual(runScript({ deviceDark: true }), { classes: "dark", theme: "dark" })
  assert.deepEqual(runScript({ deviceDark: false }), { classes: "light", theme: "light" })
})

test("the head script: a stored choice wins over the device", () => {
  assert.deepEqual(runScript({ stored: { "eri-theme-preference": "light" }, deviceDark: true }), { classes: "light", theme: "light" })
  assert.deepEqual(runScript({ stored: { "eri-theme-preference": "dark" }, deviceDark: false }), { classes: "dark", theme: "dark" })
  assert.deepEqual(runScript({ stored: { "eri-theme-preference": "system" }, deviceDark: true }), { classes: "dark", theme: "dark" })
})

test("the head script: an old automatic eri-theme value is not a choice", () => {
  assert.deepEqual(runScript({ stored: { "eri-theme": "dark" }, deviceDark: false }), { classes: "light", theme: "light" })
  assert.deepEqual(runScript({ stored: { "eri-theme": "light" }, deviceDark: true }), { classes: "dark", theme: "dark" })
})

test("the head script: without matchMedia the page is light, and it never throws", () => {
  assert.deepEqual(runScript({ matchMedia: false }), { classes: "light", theme: "light" })
  assert.doesNotThrow(() => vm.runInNewContext(ERI_THEME_SCRIPT, { window: {}, document: {} }))
})

test("the BDS site's index.html carries the head script verbatim", () => {
  const html = readFileSync(new URL("../../../client/index.html", import.meta.url), "utf8")
  assert.ok(html.includes(`<script>${ERI_THEME_SCRIPT}</script>`))
})
