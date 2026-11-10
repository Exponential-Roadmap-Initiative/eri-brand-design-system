// Tests for the token build (node --test test/).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build, contrast, listTokens, loadTokens } from '../scripts/tokens-lib.mjs';

const doc = loadTokens();

test('contrast: black on white is 21:1, and hex and oklch agree', () => {
  assert.equal(Math.round(contrast('#000000', '#ffffff') * 100) / 100, 21);
  assert.ok(Math.abs(contrast('oklch(1 0 0)', '#000000') - 21) < 0.01);
});

test('the names the package components read are all defined', () => {
  const names = new Set(listTokens(doc).map((t) => t.cssName));
  for (const n of ['--background', '--foreground', '--card', '--primary', '--border', '--ring', '--muted', '--muted-foreground',
    '--destructive', '--success', '--danger', '--warning', '--font-archivo', '--shadow-sm', '--radius',
    '--space-1', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6']) assert.ok(names.has(n), n);
});

test('body text is Open Sans and headings are Archivo', () => {
  const css = build(doc).files['dist/tokens.css'];
  assert.match(css, /--eri-font-body: 'Open Sans', system-ui, -apple-system, sans-serif;/);
  assert.match(css, /--eri-font-heading: 'Archivo', system-ui, -apple-system, sans-serif;/);
  assert.match(css, /--font-body: var\(--eri-font-body\);/);
});

test('dark values sit on .dark, and the build is the same each time', () => {
  const a = build(doc).files, b = build(loadTokens()).files;
  assert.deepEqual(a, b);
  assert.match(a['dist/tokens.css'], /\.dark \{\n {2}--background: var\(--eri-gray-9\);/);
});

test('semantic and component tokens hold references only', () => {
  for (const t of listTokens(doc).filter((x) => x.layer !== 'primitive'))
    for (const v of [t.light, t.dark]) assert.match(String(v), /^\{(primitive|semantic)\.[^}]+\}$/, t.path);
});
