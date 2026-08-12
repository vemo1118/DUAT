import {
  hasAllowedOrigin,
  hashClientIdentifier,
  publicErrorMessage,
  requirePost,
  sendJson,
  validateJsonPayload
} from './_lib/http.js';
import { safeTrackingItems } from './_lib/order-service.js';
import { consumeRateLimit, getSupabaseAdmin } from './_lib/supabase-admin.js';

function normalizeReference(value) {
  const raw = String(value || '').trim().toUpperCase();
  const reference = raw.startsWith('DUAT-') ? raw : `DUAT-${raw}`;
  if (!/^DUAT-[A-Z0-9-]{3,32}$/.test(reference)) throw new Error('TRACKING_NOT_FOUND');
  return reference;
}

export default async function handler(req, res) {
  if (!requirePost(req, res)) return;

  try {
    if (!hasAllowedOrigin(req)) throw new Error('INVALID_ORIGIN');
    const payload = validateJsonPayload(req, { maxBytes: 2_000 });
    const reference = normalizeReference(payload.reference);
    const phoneLast4 = String(payload.phoneLast4 || '').replace(/\D/g, '');
    if (!/^\d{4}$/.test(phoneLast4)) throw new Error('TRACKING_NOT_FOUND');

    const admin = getSupabaseAdmin();
    await consumeRateLimit(admin, {
      scope: 'track-order',
      identifierHash: hashClientIdentifier(req),
      limit: 12,
      windowSeconds: 600
    });

    const { data, error } = await admin
      .from('orders')
      .select('ref, status, created_at, updated_at, customer, items')
      .eq('ref', reference)
      .maybeSingle();
    const phone = String(data?.customer?.phone || '').replace(/\D/g, '');
    if (error || !data || !phone.endsWith(phoneLast4)) throw new Error('TRACKING_NOT_FOUND');

    return sendJson(res, 200, {
      success: true,
      order: {
        code: data.ref,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        items: safeTrackingItems(data.items)
      }
    });
  } catch (error) {
    const status = error?.message === 'RATE_LIMITED' ? 429 : error?.message === 'SERVICE_NOT_CONFIGURED' ? 503 : 404;
    return sendJson(res, status, { success: false, error: publicErrorMessage(error) });
  }
}
