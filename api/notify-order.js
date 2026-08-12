import { requirePost, sendJson } from './_lib/http.js';

export default function handler(req, res) {
  if (!requirePost(req, res)) return;
  return sendJson(res, 410, {
    success: false,
    error: 'This endpoint was retired. Notifications are created only after a verified order is saved.'
  });
}
