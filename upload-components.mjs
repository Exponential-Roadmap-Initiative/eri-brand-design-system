/**
 * Upload @eri/components TSX files to CDN.
 * Uses the same v1/storage/upload endpoint + FormData as server/storage.ts storagePut().
 * Run: node upload-components.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FORGE_URL = (process.env.BUILT_IN_FORGE_API_URL || '').replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!FORGE_URL || !FORGE_KEY) {
  console.error('Missing BUILT_IN_FORGE_API_URL or BUILT_IN_FORGE_API_KEY');
  process.exit(1);
}

function buildUploadUrl(relKey) {
  const base = FORGE_URL.endsWith('/') ? FORGE_URL : FORGE_URL + '/';
  const url = new URL('v1/storage/upload', base);
  url.searchParams.set('path', relKey);
  return url.toString();
}

async function uploadFile(filePath, relKey, contentType) {
  const filename = path.basename(filePath);
  const content = fs.readFileSync(filePath);

  const formData = new FormData();
  const blob = new Blob([content], { type: contentType });
  formData.append('file', blob, filename);

  const uploadUrl = buildUploadUrl(relKey);

  const resp = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FORGE_KEY}`,
    },
    body: formData,
  });

  if (!resp.ok) {
    const text = await resp.text();
    console.error(`Upload failed for ${filename}: ${resp.status}`, text.slice(0, 300));
    return null;
  }

  const data = await resp.json();
  const url = data.url || data.data?.url;
  console.log(`✅ ${filename} -> ${url}`);
  return url;
}

const srcDir = path.join(__dirname, 'packages/eri-components/src');
const files = [
  ['EriAppHeader.tsx', 'components/EriAppHeader.tsx', 'text/plain; charset=utf-8'],
  ['EriAppFooter.tsx', 'components/EriAppFooter.tsx', 'text/plain; charset=utf-8'],
  ['EriStatusBadge.tsx', 'components/EriStatusBadge.tsx', 'text/plain; charset=utf-8'],
  ['EriContactUsButton.tsx', 'components/EriContactUsButton.tsx', 'text/plain; charset=utf-8'],
  ['EriHeroSection.tsx', 'components/EriHeroSection.tsx', 'text/plain; charset=utf-8'],
  ['EriPageLayout.tsx', 'components/EriPageLayout.tsx', 'text/plain; charset=utf-8'],
];

console.log(`Uploading ${files.length} component files...`);
for (const [filename, relKey, contentType] of files) {
  await uploadFile(path.join(srcDir, filename), relKey, contentType);
}
console.log('Done.');
