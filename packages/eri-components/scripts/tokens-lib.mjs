// ERI design tokens: read tokens/tokens.json, resolve references, render the built files.
// No dependencies: Node's standard library only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PKG_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SOURCE = join(PKG_DIR, 'tokens', 'tokens.json');
export const OUTPUTS = { css: 'dist/tokens.css', ts: 'dist/tokens.ts', names: 'dist/token-names.json' };
export const MODE_KEY = 'org.exponentialroadmap.mode';
export const CONTRAST_KEY = 'org.exponentialroadmap.contrast';
export const LAYERS = ['primitive', 'semantic', 'component'];

// CSS name for each primitive group: --eri-<kind>-<name>.
const PRIMITIVE_PREFIX = {
  color: '--eri-', 'font-family': '--eri-font-', 'font-weight': '--eri-font-weight-', 'font-size': '--eri-text-',
  'line-height': '--eri-leading-', space: '--eri-space-', radius: '--eri-radius-', shadow: '--eri-shadow-',
  duration: '--eri-duration-', easing: '--eri-ease-', 'z-index': '--eri-z-', breakpoint: '--eri-breakpoint-',
};
const GENERIC_FONTS = new Set(['system-ui', '-apple-system', 'sans-serif', 'serif', 'monospace', 'ui-monospace', 'ui-sans-serif']);
const REF = /^\{([^{}]+)\}$/;

export function loadTokens(path = SOURCE) { return JSON.parse(readFileSync(path, 'utf8')); }
export const isRef = (v) => typeof v === 'string' && REF.test(v);
export const refPath = (v) => v.match(REF)[1];

/** Every token as { path, layer, cssName, type, light, dark, description }. */
export function listTokens(doc) {
  const out = [];
  for (const layer of LAYERS) {
    const walk = (node, keys) => {
      for (const [k, v] of Object.entries(node || {})) {
        if (k.startsWith('$')) continue;
        if (v && typeof v === 'object' && '$value' in v) {
          const path = [layer, ...keys, k].join('.');
          let cssName;
          if (layer === 'primitive') {
            const prefix = PRIMITIVE_PREFIX[keys[0]];
            if (!prefix || keys.length !== 1) throw new Error(`${path}: primitives sit one level under a known group (${Object.keys(PRIMITIVE_PREFIX).join(', ')})`);
            cssName = prefix + k;
          } else {
            if (keys.length) throw new Error(`${path}: ${layer} tokens sit directly under "${layer}"`);
            cssName = layer === 'semantic' ? `--${k}` : `--eri-${k}`;
          }
          const dark = v.$extensions?.[MODE_KEY]?.dark;
          out.push({ path, layer, cssName, type: v.$type, light: v.$value, dark: dark ?? v.$value, description: v.$description });
        } else if (v && typeof v === 'object') walk(v, [...keys, k]);
      }
    };
    walk(doc[layer], []);
  }
  return out;
}

export function cssValue(token, value) {
  if (isRef(value)) return null;
  if (token.type === 'fontFamily') return value.map((f) => (GENERIC_FONTS.has(f) ? f : `'${f}'`)).join(', ');
  return String(value);
}

/** Resolve a value (following references) to the raw CSS value. */
export function resolve(byPath, value, mode, seen = []) {
  if (!isRef(value)) return value;
  const p = refPath(value);
  if (seen.includes(p)) throw new Error(`reference loop: ${[...seen, p].join(' -> ')}`);
  const t = byPath.get(p);
  if (!t) throw new Error(`unknown reference {${p}}`);
  return resolve(byPath, mode === 'dark' ? t.dark : t.light, mode, [...seen, p]);
}

export function build(doc) {
  const tokens = listTokens(doc);
  const byPath = new Map(tokens.map((t) => [t.path, t]));
  const out = (t, v) => (isRef(v) ? `var(${byPath.get(refPath(v)).cssName})` : cssValue(t, v));
  const head = '/* ERI design tokens. Built from packages/eri-components/tokens/tokens.json by scripts/build-tokens.mjs: do not edit. */\n';
  const light = tokens.map((t) => `  ${t.cssName}: ${out(t, t.light)};`);
  const dark = tokens.filter((t) => t.dark !== t.light).map((t) => `  ${t.cssName}: ${out(t, t.dark)};`);
  const css = `${head}:root {\n${light.join('\n')}\n}\n\n/* Dark: the class ERI_THEME_SCRIPT sets on <html>. */\n.dark {\n${dark.join('\n')}\n}\n`;

  const resolved = (mode) => Object.fromEntries(tokens.map((t) => [t.cssName, cssValue(t, resolve(byPath, mode === 'dark' ? t.dark : t.light, mode))]));
  const ts = `// ERI design tokens, resolved to CSS values for code that cannot read CSS variables (charts, canvas).\n`
    + `// Built from packages/eri-components/tokens/tokens.json by scripts/build-tokens.mjs: do not edit.\n`
    + `// In the DOM, prefer var(--name): it follows the theme on its own.\n\n`
    + `export const eriTokens = ${JSON.stringify({ light: resolved('light'), dark: resolved('dark') }, null, 2)} as const;\n\n`
    + `export type EriTokenName = keyof typeof eriTokens.light;\n`;
  const names = JSON.stringify(tokens.map((t) => t.cssName).sort(), null, 2) + '\n';
  return { tokens, byPath, files: { [OUTPUTS.css]: css, [OUTPUTS.ts]: ts, [OUTPUTS.names]: names } };
}

// --- Contrast (WCAG 2.x relative luminance), for hex and oklch() colours ---
function oklchToLinearSrgb(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
}
export function luminance(css) {
  let rgb;
  const hex = css.match(/^#([0-9a-f]{6})$/i);
  const ok = css.match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/i);
  if (hex) rgb = [0, 2, 4].map((i) => { const c = parseInt(hex[1].slice(i, i + 2), 16) / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  else if (ok) rgb = oklchToLinearSrgb(+ok[1], +ok[2], +ok[3]);
  else throw new Error(`cannot measure colour ${css}`);
  const [r, g, b] = rgb.map((v) => Math.min(1, Math.max(0, v)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a, b) { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); }
