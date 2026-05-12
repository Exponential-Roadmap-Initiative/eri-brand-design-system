/**
 * Re-upload dark-mode SVG files with correct image/svg+xml content type
 * Run: node upload-svgs.mjs
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!FORGE_API_URL || !FORGE_API_KEY) {
  console.error('Missing BUILT_IN_FORGE_API_URL or BUILT_IN_FORGE_API_KEY');
  process.exit(1);
}

const baseUrl = FORGE_API_URL.replace(/\/+$/, '');

async function uploadSvg(localPath, remoteKey) {
  const data = readFileSync(localPath);
  const uploadUrl = new URL('v1/storage/upload', baseUrl + '/');
  uploadUrl.searchParams.set('path', remoteKey);

  const blob = new Blob([data], { type: 'image/svg+xml' });
  const formData = new FormData();
  const filename = remoteKey.split('/').pop() ?? remoteKey;
  formData.append('file', blob, filename);

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
  console.log(`✅ Uploaded ${filename}:`, result);
  return result;
}

// Upload both SVGs
const assets = [
  {
    local: '/home/ubuntu/webdev-static-assets/eri-logo-dark-mode.svg',
    key: 'eri-logo-dark-mode.svg',
  },
  {
    local: '/home/ubuntu/webdev-static-assets/eri-icon-mark-dark-mode.svg',
    key: 'eri-icon-mark-dark-mode.svg',
  },
];

for (const asset of assets) {
  try {
    await uploadSvg(asset.local, asset.key);
  } catch (err) {
    console.error(`❌ Failed to upload ${asset.key}:`, err.message);
  }
}
