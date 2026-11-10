// Checks for the ERI design tokens and the package's public surface. Exit 1 on any failure.
//   1. Layers: primitives hold raw values; semantic tokens refer to primitives; component tokens refer to semantic tokens.
//   2. Built files: dist/tokens.css, dist/tokens.ts and dist/token-names.json equal what the source produces.
//   3. Contrast, light and dark: each text pair at 4.5:1 or better, each non-text pair (focus, control edge) at 3:1.
//      A pair that fails today is listed as a knownGap with its measured ratio: it may not get worse, and the entry
//      must go once the pair passes.
//   4. Size: dist/tokens.css under 10 KB.
//   5. Public surface against the base branch (ERI_BASE_REF, default origin/main): names from src/index.ts and
//      dist/token-names.json. An added name needs a minor bump, a removed name a major bump; the version may not
//      equal the base's or an existing tag.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONTRAST_KEY, PKG_DIR, build, contrast, isRef, loadTokens, refPath, resolve } from './tokens-lib.mjs';

const failures = [];
const fail = (msg) => failures.push(msg);
const doc = loadTokens();
const { tokens, byPath, files } = build(doc);

// 1. Layers
const allowed = { primitive: null, semantic: 'primitive', component: 'semantic' };
for (const t of tokens) {
  if (!t.type) fail(`${t.path}: no $type`);
  for (const [mode, v] of [['light', t.light], ['dark', t.dark]]) {
    if (t.layer === 'primitive') { if (isRef(v)) fail(`${t.path} (${mode}): a primitive holds a raw value, not a reference`); continue; }
    if (!isRef(v)) { fail(`${t.path} (${mode}): raw value ${JSON.stringify(v)}; a ${t.layer} token must refer to a ${allowed[t.layer]} token`); continue; }
    const target = byPath.get(refPath(v));
    if (!target) fail(`${t.path} (${mode}): unknown reference ${v}`);
    else if (target.layer !== allowed[t.layer]) fail(`${t.path} (${mode}): refers to a ${target.layer} token; a ${t.layer} token refers to a ${allowed[t.layer]} token`);
  }
}
const names = tokens.map((t) => t.cssName);
for (const n of new Set(names)) if (names.filter((x) => x === n).length > 1) fail(`duplicate CSS name ${n}`);

// 2. Built files
for (const [rel, text] of Object.entries(files)) {
  const p = join(PKG_DIR, rel);
  if (!existsSync(p)) fail(`${rel} is missing: run node scripts/build-tokens.mjs`);
  else if (readFileSync(p, 'utf8') !== text) fail(`${rel} differs from what tokens.json produces: run node scripts/build-tokens.mjs and commit`);
}

// 3. Contrast
const rows = [];
for (const pr of doc.$extensions?.[CONTRAST_KEY] ?? []) {
  for (const mode of ['light', 'dark']) {
    const fg = byPath.get(`semantic.${pr.fg}`), bg = byPath.get(`semantic.${pr.bg}`);
    if (!fg || !bg) { fail(`contrast pair ${pr.fg} on ${pr.bg}: unknown semantic token`); break; }
    const ratio = contrast(resolve(byPath, mode === 'dark' ? fg.dark : fg.light, mode), resolve(byPath, mode === 'dark' ? bg.dark : bg.light, mode));
    const ok = ratio >= pr.min, r = ratio.toFixed(2), gap = pr.knownGap?.measured?.[mode];
    let result = ok ? 'pass' : 'FAIL';
    if (ok && gap !== undefined) fail(`contrast ${pr.fg} on ${pr.bg} (${mode}) now passes at ${r}:1: remove its knownGap entry`);
    else if (!ok && gap !== undefined && ratio >= gap - 0.005) result = 'known gap';
    else if (!ok && gap !== undefined) fail(`contrast ${pr.fg} on ${pr.bg} (${mode}): ${r}:1, worse than the known gap of ${gap}:1`);
    else if (!ok) fail(`contrast ${pr.fg} on ${pr.bg} (${mode}): ${r}:1, needs ${pr.min}:1`);
    rows.push(`| ${pr.fg} on ${pr.bg} | ${pr.kind} | ${mode} | ${r}:1 | ${pr.min}:1 | ${result} |`);
  }
}
console.log('| Pair | Kind | Mode | Ratio | Needs | Result |\n|---|---|---|---|---|---|\n' + rows.join('\n'));

// 4. Size
const cssBytes = Buffer.byteLength(files['dist/tokens.css']);
console.log(`\ndist/tokens.css: ${cssBytes} bytes`);
if (cssBytes >= 10240) fail(`dist/tokens.css is ${cssBytes} bytes; the target is under 10 KB`);

// 5. Public surface against the base branch
const base = process.env.ERI_BASE_REF || 'origin/main';
const git = (...a) => execFileSync('git', a, { cwd: PKG_DIR, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
const atBase = (rel) => { try { return git('show', `${base}:packages/eri-components/${rel}`); } catch { return null; } };
const exportNames = (src) => {
  const out = new Set();
  for (const m of src.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}/g))
    for (const part of m[1].split(',')) { const s = part.trim().replace(/^type\s+/, ''); if (s) out.add(s.split(/\s+as\s+/).pop().trim()); }
  for (const m of src.matchAll(/export\s+(?:declare\s+)?(?:const|let|function|class|type|interface|enum)\s+([A-Za-z0-9_$]+)/g)) out.add(m[1]);
  return out;
};
const surface = (indexSrc, namesSrc) => new Set([...exportNames(indexSrc ?? ''), ...(namesSrc ? JSON.parse(namesSrc) : [])]);
const basePkg = atBase('package.json');
if (!basePkg) fail(`cannot read ${base}: fetch the base branch (git fetch origin main) or set ERI_BASE_REF`);
else {
  const before = surface(atBase('src/index.ts'), atBase('dist/token-names.json'));
  const after = surface(readFileSync(join(PKG_DIR, 'src/index.ts'), 'utf8'), files['dist/token-names.json']);
  const added = [...after].filter((n) => !before.has(n)), removed = [...before].filter((n) => !after.has(n));
  const v = (s) => s.split('.').map(Number);
  const [bv, cv] = [JSON.parse(basePkg).version, JSON.parse(readFileSync(join(PKG_DIR, 'package.json'), 'utf8')).version];
  const [B, C] = [v(bv), v(cv)];
  const major = C[0] > B[0], minor = major || (C[0] === B[0] && C[1] > B[1]);
  console.log(`\nPublic surface against ${base}: version ${bv} -> ${cv}; ${added.length} added, ${removed.length} removed`);
  if (removed.length && !major) fail(`removed without a major bump: ${removed.join(', ')}`);
  if (added.length && !minor) fail(`${added.length} names added without a minor bump (version is ${cv}, base is ${bv})`);
  if (cv === bv) fail(`version ${cv} equals ${base}'s: bump it once, at merge`);
  let tags = [];
  try { tags = git('tag', '--list').split('\n'); } catch { /* no tags */ }
  if (tags.includes(`v${cv}`) || tags.includes(`eri-components-v${cv}`)) fail(`version ${cv} is already tagged`);
}

if (failures.length) { console.error(`\n${failures.length} check(s) failed:\n- ${failures.join('\n- ')}`); process.exit(1); }
console.log('\nAll token and surface checks pass.');
