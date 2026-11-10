// Build dist/tokens.css, dist/tokens.ts and dist/token-names.json from tokens/tokens.json.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { PKG_DIR, build, loadTokens } from './tokens-lib.mjs';

const { files } = build(loadTokens());
for (const [rel, text] of Object.entries(files)) {
  mkdirSync(dirname(join(PKG_DIR, rel)), { recursive: true });
  writeFileSync(join(PKG_DIR, rel), text);
  console.log(`wrote ${rel} (${Buffer.byteLength(text)} bytes)`);
}
