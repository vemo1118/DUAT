import { createHash } from 'node:crypto';

const DEFAULT_ALLOWED_ORIGINS = ['https://duat-six.vercel.app'];

export function applyApiHeaders(res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
}

export function sendJson(res, status, body) {
  applyApiHeaders(res);
  return res.status(status).json(body);
}

export function requirePost(req, res) {
  if (req.method === 'POST') return true;
  res.setHeader('Allow', 'POST');
  sendJson(res, 405, { success: false, error: 'Method not allowed' });
  return false;
}

export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

export function hashClientIdentifier(req) {
  const salt = process.env.RATE_LIMIT_SALT || 'duat-rate-limit-v1';
  const userAgent = String(req.headers['user-agent'] || '').slice(0, 160);
  return createHash('sha256')
    .update(`${salt}:${getClientIp(req)}:${userAgent}`)
    .digest('hex');
}

export function hasAllowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;

  const configured = String(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const allowed = new Set([...DEFAULT_ALLOWED_ORIGINS, ...configured]);

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  if (host) {
    allowed.add(`https://${host}`);
    allowed.add(`http://${host}`);
  }

  return allowed.has(origin);
}

export function validateJsonPayload(req, { maxBytes = 256_000 } = {}) {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('INVALID_JSON');
  }

  const estimatedSize = Buffer.byteLength(JSON.stringify(body), 'utf8');
  if (estimatedSize > maxBytes) throw new Error('PAYLOAD_TOO_LARGE');
  return body;
}

export function publicErrorMessage(error) {
  const code = error?.message || String(error || '');
  const messages = {
    INVALID_JSON: 'Invalid request body',
    PAYLOAD_TOO_LARGE: 'Request body is too large',
    INVALID_ORIGIN: 'Request origin is not allowed',
    RATE_LIMITED: 'Too many requests. Please try again shortly.',
    SERVICE_NOT_CONFIGURED: 'Order service is not configured yet',
    INVALID_ORDER: 'Order data is invalid',
    INVALID_CUSTOMER: 'Customer details are invalid',
    INVALID_PHONE: 'Phone number is invalid',
    INVALID_ITEMS: 'Cart items are invalid',
    INVALID_PRODUCT: 'One or more products are unavailable',
    INVALID_UPLOAD: 'An uploaded file is invalid or expired',
    INVALID_COUPON: 'Coupon is invalid',
    ORDER_SAVE_FAILED: 'The order could not be saved',
    TRACKING_NOT_FOUND: 'Order not found',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden'
  };
  return messages[code] || 'Unexpected server error';
}
