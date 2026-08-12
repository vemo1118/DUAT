import { randomUUID } from 'node:crypto';
import {
  hasAllowedOrigin,
  hashClientIdentifier,
  publicErrorMessage,
  requirePost,
  sendJson,
  validateJsonPayload
} from './_lib/http.js';
import { consumeRateLimit, getSupabaseAdmin } from './_lib/supabase-admin.js';

const UPLOAD_RULES = {
  'payment-proof': {
    bucket: 'payment-proofs',
    folder: 'pending',
    maxBytes: 5 * 1024 * 1024,
    contentTypes: new Set(['image/png', 'image/jpeg', 'image/webp'])
  },
  'order-design': {
    bucket: 'order-designs',
    folder: 'pending',
    maxBytes: 8 * 1024 * 1024,
    contentTypes: new Set(['image/png', 'image/jpeg', 'image/webp'])
  }
};

const EXTENSIONS = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp'
};

export default async function handler(req, res) {
  if (!requirePost(req, res)) return;

  try {
    if (!hasAllowedOrigin(req)) throw new Error('INVALID_ORIGIN');
    const payload = validateJsonPayload(req, { maxBytes: 4_000 });
    const purpose = String(payload.purpose || '');
    const contentType = String(payload.contentType || '').toLowerCase();
    const byteSize = Math.floor(Number(payload.byteSize));
    const rule = UPLOAD_RULES[purpose];
    if (!rule || !rule.contentTypes.has(contentType) || byteSize < 1 || byteSize > rule.maxBytes) {
      throw new Error('INVALID_UPLOAD');
    }

    const admin = getSupabaseAdmin();
    const identifierHash = hashClientIdentifier(req);
    await consumeRateLimit(admin, {
      scope: 'create-upload',
      identifierHash,
      limit: 15,
      windowSeconds: 600
    });

    const pendingToken = randomUUID();
    const objectPath = `${rule.folder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${EXTENSIONS[contentType]}`;
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    const { data: signed, error: signedError } = await admin.storage
      .from(rule.bucket)
      .createSignedUploadUrl(objectPath);
    if (signedError || !signed?.token) throw new Error('INVALID_UPLOAD');

    const { error: pendingError } = await admin.from('pending_uploads').insert({
      token: pendingToken,
      identifier_hash: identifierHash,
      bucket: rule.bucket,
      object_path: objectPath,
      purpose,
      content_type: contentType,
      byte_size: byteSize,
      expires_at: expiresAt
    });
    if (pendingError) throw new Error('SERVICE_NOT_CONFIGURED');

    return sendJson(res, 200, {
      success: true,
      upload: {
        bucket: rule.bucket,
        path: objectPath,
        signedToken: signed.token,
        claimToken: pendingToken,
        expiresAt
      }
    });
  } catch (error) {
    console.error('[create-upload]', error?.message);
    const code = error?.message === 'RATE_LIMITED' ? 429 : error?.message === 'SERVICE_NOT_CONFIGURED' ? 503 : 400;
    return sendJson(res, code, { success: false, error: publicErrorMessage(error) });
  }
}
