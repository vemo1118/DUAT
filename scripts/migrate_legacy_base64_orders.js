/**
 * Standalone Migration Script: Legacy Base64 Order Image Extractor
 * Usage: node scripts/migrate_legacy_base64_orders.js --apply
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set in environment or command line.
 *
 * Safe migration pipeline:
 * 1. Scans existing orders for items containing "data:image/" base64 strings.
 * 2. Uploads base64 images as binary PNG files to the "order-designs" storage bucket.
 * 3. Replaces base64 image strings with a private Storage object path.
 * 4. Logs any failed conversions without deleting legacy data.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

if (!process.argv.includes('--apply')) {
  console.error('❌ This script changes production order data. Re-run with --apply only after creating a database backup.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function parseImageDataUrl(dataUrl) {
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([a-z0-9+/=]+)$/i.exec(dataUrl);
  if (!match) throw new Error('Unsupported image data URL');
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length < 1 || buffer.length > 8 * 1024 * 1024) throw new Error('Image size is invalid');
  const extension = match[1] === 'image/jpeg' ? 'jpg' : match[1].split('/')[1];
  return { buffer, contentType: match[1].toLowerCase(), extension };
}

async function migrateLegacyOrders() {
  console.log('🚀 Starting legacy order base64 image migration...');

  const { data: orders, error } = await supabase.from('orders').select('id, ref, items');
  if (error) {
    console.error('❌ Failed fetching orders:', error.message);
    process.exit(1);
  }

  console.log(`📦 Found ${orders.length} total orders to analyze.`);

  let migratedCount = 0;
  let failedCount = 0;

  for (const order of orders) {
    let orderModified = false;
    const updatedItems = [];

    if (!Array.isArray(order.items)) continue;

    for (let index = 0; index < order.items.length; index++) {
      const item = { ...order.items[index] };
      const base64Candidate = item.designSnapshot || item.customConfig?.designSnapshot || (typeof item.image === 'string' && item.image.startsWith('data:image') ? item.image : null);

      if (base64Candidate && base64Candidate.startsWith('data:image')) {
        try {
          const { buffer, contentType, extension } = parseImageDataUrl(base64Candidate);
          const safeOrderId = String(order.ref || order.id).replace(/[^a-z0-9-]/gi, '-');
          const fileName = `migrated/${safeOrderId}-item-${index}-${crypto.randomUUID()}.${extension}`;

          const { error: uploadError } = await supabase.storage
            .from('order-designs')
            .upload(fileName, buffer, { contentType, upsert: false });

          if (uploadError) {
            console.error(`⚠️ Failed uploading image for order ${order.id}:`, uploadError.message);
            failedCount++;
          } else {
            item.design_image_path = fileName;
            delete item.design_image_url;

            // Strip redundant base64 strings
            if (typeof item.designSnapshot === 'string' && item.designSnapshot.startsWith('data:image')) {
              delete item.designSnapshot;
            }
            if (typeof item.image === 'string' && item.image.startsWith('data:image')) {
              delete item.image;
            }
            if (typeof item.customConfig?.designSnapshot === 'string' && item.customConfig.designSnapshot.startsWith('data:image')) {
              item.customConfig = { ...item.customConfig };
              delete item.customConfig.designSnapshot;
            }

            orderModified = true;
          }
        } catch (err) {
          console.error(`⚠️ Exception parsing base64 for order ${order.id}:`, err.message);
          failedCount++;
        }
      }

      updatedItems.push(item);
    }

    if (orderModified) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ items: updatedItems, updated_at: new Date().toISOString() })
        .eq('id', order.id);

      if (updateError) {
        console.error(`❌ Failed saving updated order ${order.id}:`, updateError.message);
        failedCount++;
      } else {
        console.log(`✅ Successfully migrated order ${order.id}`);
        migratedCount++;
      }
    }
  }

  console.log('\n========================================');
  console.log(`🎉 Migration Completed!`);
  console.log(`✅ Successfully Migrated Orders: ${migratedCount}`);
  console.log(`⚠️ Failed / Skipped Items: ${failedCount}`);
  console.log('========================================\n');
}

migrateLegacyOrders();
