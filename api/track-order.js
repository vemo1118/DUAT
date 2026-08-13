import {
  hasAllowedOrigin,
  hashClientIdentifier,
  publicErrorMessage,
  requirePost,
  sendJson,
  validateJsonPayload
} from './_lib/http.js';
import { consumeRateLimit, getSupabaseAdmin } from './_lib/supabase-admin.js';

export function normalizeOrderReference(value) {
  const raw = String(value || '').trim().toUpperCase().replace(/\s+/g, '');
  const numericPart = raw.replace(/^DUAT-?/, '');
  if (!/^\d{4,10}$/.test(numericPart)) throw new Error('TRACKING_NOT_FOUND');
  return `DUAT-${numericPart}`;
}

export default async function handler(req, res) {
  if (!requirePost(req, res)) return;

  try {
    if (!hasAllowedOrigin(req)) throw new Error('INVALID_ORIGIN');
    const payload = validateJsonPayload(req, { maxBytes: 2_000 });
    const reference = normalizeOrderReference(payload.reference);

    const admin = getSupabaseAdmin();
    await consumeRateLimit(admin, {
      scope: 'track-order',
      identifierHash: hashClientIdentifier(req),
      limit: 12,
      windowSeconds: 600
    });

    const { data, error } = await admin
      .from('orders')
      .select('ref, status, created_at, updated_at')
      .eq('ref', reference)
      .maybeSingle();
    if (error || !data) throw new Error('TRACKING_NOT_FOUND');

    return sendJson(res, 200, {
      success: true,
      order: {
        code: data.ref,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    });
  } catch (error) {
    const status = error?.message === 'RATE_LIMITED' ? 429 : error?.message === 'SERVICE_NOT_CONFIGURED' ? 503 : 404;
    return sendJson(res, status, { success: false, error: publicErrorMessage(error) });
  }
}
