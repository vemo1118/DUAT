import {
  hasAllowedOrigin,
  hashClientIdentifier,
  publicErrorMessage,
  requirePost,
  sendJson,
  validateJsonPayload
} from './_lib/http.js';
import { loadQuote } from './_lib/order-service.js';
import { consumeRateLimit, getSupabaseAdmin } from './_lib/supabase-admin.js';

export default async function handler(req, res) {
  if (!requirePost(req, res)) return;

  try {
    if (!hasAllowedOrigin(req)) throw new Error('INVALID_ORIGIN');
    const payload = validateJsonPayload(req, { maxBytes: 96_000 });
    const admin = getSupabaseAdmin();
    await consumeRateLimit(admin, {
      scope: 'quote-order',
      identifierHash: hashClientIdentifier(req),
      limit: 30,
      windowSeconds: 600
    });

    const quote = await loadQuote(admin, {
      items: payload.items,
      couponCode: payload.couponCode,
      governorateId: payload.governorateId,
      requireGovernorate: false
    });

    return sendJson(res, 200, {
      success: true,
      quote: {
        subtotal: quote.subtotal,
        discount: quote.discount,
        shippingFee: quote.shippingFee,
        total: quote.total,
        couponCode: quote.couponCode
      }
    });
  } catch (error) {
    console.error('[quote-order]', error?.message);
    const status = error?.message === 'RATE_LIMITED' ? 429 : error?.message === 'SERVICE_NOT_CONFIGURED' ? 503 : 400;
    return sendJson(res, status, { success: false, error: publicErrorMessage(error) });
  }
}
