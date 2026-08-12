import { createClient } from '@supabase/supabase-js';

let cachedClient = null;

export function getSupabaseAdmin() {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new Error('SERVICE_NOT_CONFIGURED');

  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return cachedClient;
}

export async function consumeRateLimit(admin, { scope, identifierHash, limit, windowSeconds }) {
  const { data, error } = await admin.rpc('consume_rate_limit', {
    p_scope: scope,
    p_identifier_hash: identifierHash,
    p_limit: limit,
    p_window_seconds: windowSeconds
  });

  if (error) {
    console.error('[RateLimit] Database check failed:', error.message);
    throw new Error('SERVICE_NOT_CONFIGURED');
  }
  if (data !== true) throw new Error('RATE_LIMITED');
}

export async function requireAdminFromRequest(admin, req) {
  const authHeader = String(req.headers.authorization || '');
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) throw new Error('UNAUTHORIZED');

  const { data, error } = await admin.auth.getUser(token);
  const user = data?.user;
  if (error || !user) throw new Error('UNAUTHORIZED');

  const appRole = user.app_metadata?.role;
  if (appRole === 'admin') return user;

  const { data: adminRow, error: adminError } = await admin
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (adminError || !adminRow) throw new Error('FORBIDDEN');
  return user;
}
