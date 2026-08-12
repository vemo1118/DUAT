/**
 * Legacy Base64 order image migration.
 *
 * Dry run (default):
 *   node scripts/migrate_legacy_base64_orders.js
 *
 * Apply after reviewing the dry-run summary:
 *   node scripts/migrate_legacy_base64_orders.js --apply
 *
 * Required environment variables:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Apply mode writes a permission-restricted local backup before changing data.
 * The backup directory is ignored by Git.
 */

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'order-designs';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const APPLY = process.argv.includes('--apply');
const BACKUP_DIR = resolve(process.env.MIGRATION_BACKUP_DIR || 'backups/legacy-base64-orders');
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const REMOVE_VALUE = Symbol('remove-base64-value');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function isImageDataUrl(value) {
  return typeof value === 'string' && value.startsWith('data:image/');
}

function parseImageDataUrl(dataUrl) {
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([a-z0-9+/=]+)$/i.exec(dataUrl);
  if (!match) throw new Error('unsupported image data URL');

  const buffer = Buffer.from(match[2], 'base64');
  const encodedInput = match[2].replace(/=+$/, '');
  const encodedBuffer = buffer.toString('base64').replace(/=+$/, '');
  if (encodedInput !== encodedBuffer) throw new Error('invalid base64 payload');
  if (buffer.length < 1 || buffer.length > MAX_IMAGE_BYTES) throw new Error('image size is outside the allowed range');

  const contentType = match[1].toLowerCase();
  return {
    buffer,
    contentType,
    extension: contentType === 'image/jpeg' ? 'jpg' : contentType.split('/')[1],
    hash: sha256(buffer)
  };
}

function collectBase64Images(value, path = [], output = []) {
  if (isImageDataUrl(value)) {
    output.push({ path, ...parseImageDataUrl(value) });
    return output;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectBase64Images(entry, [...path, String(index)], output));
    return output;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, entry]) => collectBase64Images(entry, [...path, key], output));
  }

  return output;
}

function stripBase64Images(value) {
  if (isImageDataUrl(value)) return REMOVE_VALUE;

  if (Array.isArray(value)) {
    return value
      .map((entry) => stripBase64Images(entry))
      .filter((entry) => entry !== REMOVE_VALUE);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, entry]) => [key, stripBase64Images(entry)])
        .filter(([, entry]) => entry !== REMOVE_VALUE)
    );
  }

  return value;
}

function pathKey(path) {
  return path.join('.');
}

function selectPrimaryImage(images) {
  const preferredPaths = [
    'designSnapshot',
    'customConfig.designSnapshot',
    'image',
    'customDetails.uploadedImage',
    'product.image'
  ];

  for (const preferredPath of preferredPaths) {
    const match = images.find((image) => pathKey(image.path) === preferredPath);
    if (match) return match;
  }

  return images[0];
}

function buildOrderPlan(order) {
  if (!Array.isArray(order.items)) return null;

  const itemPlans = [];
  for (let index = 0; index < order.items.length; index += 1) {
    const item = order.items[index];
    const images = collectBase64Images(item);
    if (images.length === 0) continue;

    const safeOrderId = String(order.ref || order.id).replace(/[^a-z0-9-]/gi, '-');
    const uniqueByHash = new Map();
    for (const image of images) {
      if (!uniqueByHash.has(image.hash)) uniqueByHash.set(image.hash, image);
    }

    const primary = selectPrimaryImage(images);
    const assets = [...uniqueByHash.values()].map((image) => ({
      ...image,
      storagePath: `migrated/${safeOrderId}/item-${index}-${image.hash.slice(0, 20)}.${image.extension}`
    }));
    const primaryAsset = assets.find((asset) => asset.hash === primary.hash);
    const cleanItem = stripBase64Images(item);
    cleanItem.design_image_path = primaryAsset.storagePath;
    cleanItem.design_asset_paths = assets.map((asset) => asset.storagePath);
    delete cleanItem.design_image_url;

    itemPlans.push({
      index,
      images,
      assets,
      cleanItem
    });
  }

  if (itemPlans.length === 0) return null;

  const updatedItems = [...order.items];
  itemPlans.forEach((plan) => {
    updatedItems[plan.index] = plan.cleanItem;
  });

  return { order, itemPlans, updatedItems };
}

async function validatePrivateBucket(plans) {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw new Error(`could not inspect Storage buckets: ${error.message}`);

  const bucket = buckets.find((entry) => entry.id === BUCKET || entry.name === BUCKET);
  if (!bucket) throw new Error(`${BUCKET} bucket does not exist`);
  if (bucket.public) throw new Error(`${BUCKET} must remain private`);

  const largestImage = Math.max(
    ...plans.flatMap((plan) => plan.itemPlans.flatMap((itemPlan) => itemPlan.assets.map((asset) => asset.buffer.length)))
  );
  if (bucket.file_size_limit && largestImage > bucket.file_size_limit) {
    throw new Error('one or more images exceed the bucket file-size limit');
  }
}

async function createLocalBackup(plans) {
  await mkdir(BACKUP_DIR, { recursive: true, mode: 0o700 });
  const createdAt = new Date().toISOString();
  const fileName = `orders-${createdAt.replace(/[:.]/g, '-')}.json`;
  const backupPath = resolve(BACKUP_DIR, fileName);
  const payload = JSON.stringify({
    version: 1,
    createdAt,
    purpose: 'pre-legacy-base64-migration',
    orders: plans.map(({ order }) => ({
      id: order.id,
      ref: order.ref,
      updated_at: order.updated_at,
      items: order.items
    }))
  });

  await writeFile(backupPath, payload, { encoding: 'utf8', mode: 0o600, flag: 'wx' });
  return { backupPath, checksum: sha256(payload) };
}

async function ensureStorageAsset(asset) {
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(asset.storagePath, asset.buffer, {
      contentType: asset.contentType,
      cacheControl: '31536000',
      upsert: false
    });

  if (!uploadError) return { created: true };

  const duplicate = uploadError.statusCode === '409' || /already exists|duplicate/i.test(uploadError.message || '');
  if (!duplicate) throw new Error(`upload failed: ${uploadError.message}`);

  const { data: existing, error: downloadError } = await supabase.storage.from(BUCKET).download(asset.storagePath);
  if (downloadError || !existing) throw new Error(`could not verify existing object: ${downloadError?.message || 'missing object'}`);
  const existingBuffer = Buffer.from(await existing.arrayBuffer());
  if (sha256(existingBuffer) !== asset.hash) throw new Error('existing object checksum does not match');
  return { created: false };
}

async function rollbackNewAssets(paths) {
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) console.error(`  Warning: could not remove newly uploaded objects: ${error.message}`);
}

async function applyOrderPlan(plan) {
  const createdPaths = [];

  try {
    for (const itemPlan of plan.itemPlans) {
      for (const asset of itemPlan.assets) {
        const result = await ensureStorageAsset(asset);
        if (result.created) createdPaths.push(asset.storagePath);
      }
    }

    let update = supabase
      .from('orders')
      .update({ items: plan.updatedItems, updated_at: new Date().toISOString() })
      .eq('id', plan.order.id);

    update = plan.order.updated_at
      ? update.eq('updated_at', plan.order.updated_at)
      : update.is('updated_at', null);

    const { data, error } = await update.select('id').maybeSingle();
    if (error) throw new Error(`database update failed: ${error.message}`);
    if (!data) throw new Error('order changed after the dry run; no database update was applied');

    const { data: verified, error: verifyError } = await supabase
      .from('orders')
      .select('items')
      .eq('id', plan.order.id)
      .single();
    if (verifyError) throw new Error(`verification read failed: ${verifyError.message}`);
    if (collectBase64Images(verified.items).length > 0) throw new Error('verification found remaining Base64 data');

    return { createdPaths };
  } catch (error) {
    await rollbackNewAssets(createdPaths);
    throw error;
  }
}

async function migrateLegacyOrders() {
  console.info(APPLY ? 'Mode: APPLY' : 'Mode: DRY RUN (no data will be changed)');

  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, ref, updated_at, items')
    .order('created_at', { ascending: true });
  if (error) throw new Error(`failed fetching orders: ${error.message}`);

  const plans = orders.map(buildOrderPlan).filter(Boolean);
  if (plans.length === 0) {
    console.info('No legacy Base64 images were found.');
    return;
  }

  await validatePrivateBucket(plans);

  const affectedItems = plans.reduce((sum, plan) => sum + plan.itemPlans.length, 0);
  const base64Copies = plans.reduce(
    (sum, plan) => sum + plan.itemPlans.reduce((itemSum, itemPlan) => itemSum + itemPlan.images.length, 0),
    0
  );
  const uniqueImages = plans.reduce(
    (sum, plan) => sum + plan.itemPlans.reduce((itemSum, itemPlan) => itemSum + itemPlan.assets.length, 0),
    0
  );
  const uploadBytes = plans.reduce(
    (sum, plan) => sum + plan.itemPlans.reduce(
      (itemSum, itemPlan) => itemSum + itemPlan.assets.reduce((assetSum, asset) => assetSum + asset.buffer.length, 0),
      0
    ),
    0
  );

  console.info(`Orders to migrate: ${plans.length}`);
  console.info(`Items to migrate: ${affectedItems}`);
  console.info(`Base64 copies to remove: ${base64Copies}`);
  console.info(`Unique images to preserve: ${uniqueImages}`);
  console.info(`Storage upload size: ${(uploadBytes / 1024 / 1024).toFixed(2)} MB`);
  plans.forEach((plan) => {
    const orderCopies = plan.itemPlans.reduce((sum, itemPlan) => sum + itemPlan.images.length, 0);
    const orderAssets = plan.itemPlans.reduce((sum, itemPlan) => sum + itemPlan.assets.length, 0);
    console.info(`  ${plan.order.ref || plan.order.id}: ${orderCopies} copies -> ${orderAssets} unique image(s)`);
  });

  if (!APPLY) {
    console.info('Dry run passed. Re-run with --apply to create a backup and migrate the data.');
    return;
  }

  const backup = await createLocalBackup(plans);
  console.info(`Backup created: ${backup.backupPath}`);
  console.info(`Backup SHA-256: ${backup.checksum}`);

  let migratedOrders = 0;
  for (const plan of plans) {
    try {
      await applyOrderPlan(plan);
      migratedOrders += 1;
      console.info(`  Migrated ${plan.order.ref || plan.order.id}`);
    } catch (error) {
      console.error(`  Failed ${plan.order.ref || plan.order.id}: ${error.message}`);
      throw new Error(`migration stopped after ${migratedOrders} completed order(s); use the backup for rollback if needed`);
    }
  }

  console.info(`Migration complete: ${migratedOrders} order(s) updated.`);
}

migrateLegacyOrders().catch((error) => {
  console.error(`Migration failed: ${error.message}`);
  process.exitCode = 1;
});
