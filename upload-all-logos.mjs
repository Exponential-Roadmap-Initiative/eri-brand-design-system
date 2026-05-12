/**
 * Upload all ERI logo assets with correct MIME types via the storage proxy.
 * Uses clean (non-hashed) filenames for stable permanent URLs.
 * Run: node upload-all-logos.mjs
 */
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!FORGE_API_URL || !FORGE_API_KEY) {
  console.error('Missing BUILT_IN_FORGE_API_URL or BUILT_IN_FORGE_API_KEY');
  process.exit(1);
}

const baseUrl = FORGE_API_URL.replace(/\/+$/, '');

async function uploadAsset(localPath, remoteKey, mimeType) {
  const data = readFileSync(localPath);
  const uploadUrl = new URL('v1/storage/upload', baseUrl + '/');
  uploadUrl.searchParams.set('path', remoteKey);

  const blob = new Blob([data], { type: mimeType });
  const formData = new FormData();
  formData.append('file', blob, remoteKey.split('/').pop() ?? remoteKey);

  const response = await fetch(uploadUrl.toString(), {
    method: 'POST',
    headers: { Authorization: `Bearer ${FORGE_API_KEY}` },
    body: formData,
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`Upload failed (${response.status}): ${msg}`);
  }

  const result = await response.json();
  console.log(`✅ ${remoteKey} -> ${result.url}`);
  return result;
}

const assets = [
  // Full-colour wordmark — SVG (primary for display)
  {
    local: '/home/ubuntu/logo-analysis/eri-logo-full-color.svg',
    key: 'eri-logo-full-color.svg',
    mime: 'image/svg+xml',
  },
  // Full-colour wordmark — WebP (legacy, keep for compatibility)
  {
    local: '/home/ubuntu/logo-analysis/eri-logo-full-color.webp',
    key: 'eri-logo-full-color.webp',
    mime: 'image/webp',
  },
  // Dark-mode wordmark — SVG (already uploaded, re-upload to confirm)
  {
    local: '/home/ubuntu/webdev-static-assets/eri-logo-dark-mode.svg',
    key: 'eri-logo-dark-mode.svg',
    mime: 'image/svg+xml',
  },
  // ERI icon mark — WebP
  {
    local: '/home/ubuntu/logo-analysis/eri-icon-mark.webp',
    key: 'eri-icon-mark.webp',
    mime: 'image/webp',
  },
  // ERI icon mark — dark mode SVG (already uploaded, re-upload to confirm)
  {
    local: '/home/ubuntu/webdev-static-assets/eri-icon-mark-dark-mode.svg',
    key: 'eri-icon-mark-dark-mode.svg',
    mime: 'image/svg+xml',
  },
];

console.log(`Uploading ${assets.length} logo assets...\n`);
for (const asset of assets) {
  try {
    await uploadAsset(asset.local, asset.key, asset.mime);
  } catch (err) {
    console.error(`❌ Failed: ${asset.key} — ${err.message}`);
  }
}
console.log('\nDone.');
