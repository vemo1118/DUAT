import { supabase } from '../lib/supabase';

const STORE_ASSETS_BUCKET = 'store-assets';
const MAX_STORE_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

function safePathSegment(value, fallback) {
  const safe = String(value || '')
    .trim()
    .replace(/[^a-z0-9_-]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return safe || fallback;
}

function extensionFor(contentType) {
  if (contentType === 'image/jpeg') return 'jpg';
  return contentType.split('/')[1];
}

async function sha256Prefix(buffer) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 24);
}

export function isInlineStoreImage(value) {
  return typeof value === 'string' && value.startsWith('data:image/');
}

export async function uploadStoreImage(file, { folder = 'misc', assetId = 'asset' } = {}) {
  if (!(file instanceof Blob)) throw new Error('INVALID_STORE_IMAGE');
  const contentType = String(file.type || '').toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(contentType) || file.size < 1 || file.size > MAX_STORE_IMAGE_BYTES) {
    throw new Error('INVALID_STORE_IMAGE');
  }

  const buffer = await file.arrayBuffer();
  const checksum = await sha256Prefix(buffer);
  const objectPath = `${safePathSegment(folder, 'misc')}/${safePathSegment(assetId, 'asset')}/${checksum}.${extensionFor(contentType)}`;
  const { error } = await supabase.storage.from(STORE_ASSETS_BUCKET).upload(objectPath, buffer, {
    contentType,
    cacheControl: '31536000',
    upsert: false
  });

  const duplicate = error?.statusCode === '409' || /already exists|duplicate/i.test(error?.message || '');
  if (error && !duplicate) throw new Error(`STORE_IMAGE_UPLOAD_FAILED:${error.message}`);

  const { data } = supabase.storage.from(STORE_ASSETS_BUCKET).getPublicUrl(objectPath);
  if (!data?.publicUrl) throw new Error('STORE_IMAGE_URL_FAILED');
  return {
    bucket: STORE_ASSETS_BUCKET,
    path: objectPath,
    publicUrl: data.publicUrl,
    created: !error
  };
}

export async function uploadStoreImageDataUrl(dataUrl, options) {
  if (!isInlineStoreImage(dataUrl)) throw new Error('INVALID_STORE_IMAGE');
  const response = await fetch(dataUrl);
  if (!response.ok) throw new Error('INVALID_STORE_IMAGE');
  return uploadStoreImage(await response.blob(), options);
}

export async function removeStoreImage(path) {
  if (!path) return;
  const { error } = await supabase.storage.from(STORE_ASSETS_BUCKET).remove([path]);
  if (error) console.warn('[StoreAssets] Failed to remove unused image:', error.message);
}
