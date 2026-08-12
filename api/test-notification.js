import {
  hasAllowedOrigin,
  publicErrorMessage,
  requirePost,
  sendJson
} from './_lib/http.js';
import { getSupabaseAdmin, requireAdminFromRequest } from './_lib/supabase-admin.js';
import { sendTestNotification } from './_lib/telegram.js';

export default async function handler(req, res) {
  if (!requirePost(req, res)) return;

  try {
    if (!hasAllowedOrigin(req)) throw new Error('INVALID_ORIGIN');
    const admin = getSupabaseAdmin();
    await requireAdminFromRequest(admin, req);
    await sendTestNotification();
    return sendJson(res, 200, { success: true });
  } catch (error) {
    const status = error?.message === 'UNAUTHORIZED' ? 401 : error?.message === 'FORBIDDEN' ? 403 : 500;
    return sendJson(res, status, { success: false, error: publicErrorMessage(error) });
  }
}
