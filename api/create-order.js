import {
  hasAllowedOrigin,
  hashClientIdentifier,
  publicErrorMessage,
  requirePost,
  sendJson,
  validateJsonPayload
} from './_lib/http.js';
import {
  containsDataUrl,
  loadQuote,
  validateCustomer
} from './_lib/order-service.js';
import { consumeRateLimit, getSupabaseAdmin } from './_lib/supabase-admin.js';
import { sendTrustedOrderNotification } from './_lib/telegram.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function collectExpectedUploads(quote, paymentMethod, paymentProof) {
  const expected = [];
  for (const item of quote.items) {
    if (item.design_upload_token && item.design_image_path) {
      expected.push({
        token: item.design_upload_token,
        bucket: 'order-designs',
        path: item.design_image_path,
        purpose: 'order-design'
      });
    }
  }

  if (paymentMethod === 'instapay') {
    const token = String(paymentProof?.claimToken || '');
    const path = String(paymentProof?.path || '');
    if (!token || !path) throw new Error('INVALID_UPLOAD');
    expected.push({ token, bucket: 'payment-proofs', path, purpose: 'payment-proof' });
  }
  return expected;
}

async function assertObjectExists(admin, upload) {
  const slashIndex = upload.object_path.lastIndexOf('/');
  const folder = slashIndex >= 0 ? upload.object_path.slice(0, slashIndex) : '';
  const fileName = slashIndex >= 0 ? upload.object_path.slice(slashIndex + 1) : upload.object_path;
  const { data, error } = await admin.storage.from(upload.bucket).list(folder, {
    limit: 10,
    search: fileName
  });
  if (error || !data?.some((file) => file.name === fileName)) throw new Error('INVALID_UPLOAD');
}

async function validatePendingUploads(admin, expected, identifierHash) {
  if (expected.length === 0) return [];
  const tokens = expected.map((upload) => upload.token);
  if (new Set(tokens).size !== tokens.length) throw new Error('INVALID_UPLOAD');

  const { data, error } = await admin
    .from('pending_uploads')
    .select('token, identifier_hash, bucket, object_path, purpose, expires_at, claimed_at')
    .in('token', tokens);
  if (error || data?.length !== expected.length) throw new Error('INVALID_UPLOAD');

  const now = Date.now();
  for (const wanted of expected) {
    const upload = data.find((row) => row.token === wanted.token);
    if (
      !upload ||
      upload.identifier_hash !== identifierHash ||
      upload.bucket !== wanted.bucket ||
      upload.object_path !== wanted.path ||
      upload.purpose !== wanted.purpose ||
      upload.claimed_at ||
      new Date(upload.expires_at).getTime() <= now
    ) {
      throw new Error('INVALID_UPLOAD');
    }
  }

  await Promise.all(data.map((upload) => assertObjectExists(admin, upload)));
  return data;
}

function itemsForStorage(items) {
  return items.map(({ design_upload_token: _claimToken, ...item }) => item);
}

export default async function handler(req, res) {
  if (!requirePost(req, res)) return;

  try {
    if (!hasAllowedOrigin(req)) throw new Error('INVALID_ORIGIN');
    const payload = validateJsonPayload(req, { maxBytes: 128_000 });
    if (containsDataUrl(payload)) throw new Error('INVALID_ORDER');

    const requestId = String(payload.requestId || '');
    if (!UUID_PATTERN.test(requestId)) throw new Error('INVALID_ORDER');
    const paymentMethod = payload.paymentMethod === 'instapay' ? 'instapay' : 'cod';
    const customer = validateCustomer(payload.customer);
    const admin = getSupabaseAdmin();
    const identifierHash = hashClientIdentifier(req);

    await consumeRateLimit(admin, {
      scope: 'create-order',
      identifierHash,
      limit: 6,
      windowSeconds: 900
    });

    const { data: existing } = await admin
      .from('orders')
      .select('id, ref, total, created_at')
      .eq('request_id', requestId)
      .maybeSingle();
    if (existing) {
      return sendJson(res, 200, { success: true, order: existing, duplicate: true });
    }

    const quote = await loadQuote(admin, {
      items: payload.items,
      couponCode: payload.couponCode,
      governorateId: payload.governorateId,
      requireGovernorate: true
    });
    const expectedUploads = collectExpectedUploads(quote, paymentMethod, payload.paymentProof);
    const pendingUploads = await validatePendingUploads(admin, expectedUploads, identifierHash);

    const storedCustomer = {
      ...customer,
      governorate: quote.governorate
    };
    const storedItems = itemsForStorage(quote.items);
    const paymentProofPath = paymentMethod === 'instapay' ? String(payload.paymentProof.path) : null;
    const orderPayload = {
      id: requestId,
      request_id: requestId,
      status: 'placed',
      customer: storedCustomer,
      items: storedItems,
      subtotal: quote.subtotal,
      discount: quote.discount,
      shipping_fee: quote.shippingFee,
      total: quote.total,
      coupon_code: quote.couponCode,
      payment_method: paymentMethod,
      payment_proof_path: paymentProofPath,
      notification_status: 'pending'
    };

    let { data: inserted, error: insertError } = await admin
      .from('orders')
      .insert(orderPayload)
      .select('id, ref, total, created_at')
      .single();

    if (insertError?.code === '23505') {
      const duplicateResult = await admin
        .from('orders')
        .select('id, ref, total, created_at')
        .eq('request_id', requestId)
        .maybeSingle();
      inserted = duplicateResult.data;
      insertError = duplicateResult.error;
    }
    if (insertError || !inserted?.ref) throw new Error('ORDER_SAVE_FAILED');

    if (pendingUploads.length > 0) {
      const { error: claimError } = await admin
        .from('pending_uploads')
        .update({ claimed_at: new Date().toISOString(), order_id: inserted.id })
        .in('token', pendingUploads.map((upload) => upload.token))
        .is('claimed_at', null);
      if (claimError) console.error('[create-order] Failed to claim uploads:', claimError.message);
    }

    const notification = await sendTrustedOrderNotification({
      ...orderPayload,
      ref: inserted.ref
    });
    await admin
      .from('orders')
      .update({
        notification_status: notification.delivered ? 'sent' : 'failed',
        notification_sent_at: notification.delivered ? new Date().toISOString() : null
      })
      .eq('id', inserted.id);

    return sendJson(res, 201, {
      success: true,
      order: inserted,
      notificationDelivered: notification.delivered
    });
  } catch (error) {
    console.error('[create-order]', error?.message);
    const status = error?.message === 'RATE_LIMITED'
      ? 429
      : error?.message === 'SERVICE_NOT_CONFIGURED'
        ? 503
        : error?.message === 'ORDER_SAVE_FAILED'
          ? 500
          : 400;
    return sendJson(res, status, { success: false, error: publicErrorMessage(error) });
  }
}
