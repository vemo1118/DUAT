import { describe, it, expect, vi } from 'vitest';
import { requireAdminFromRequest } from '../../api/_lib/supabase-admin';
const request = { headers: { authorization: 'Bearer fixture-token' } };
const adminClient = (user, membership = null) => ({
  auth: { getUser: vi.fn(async () => ({ data: { user }, error: null })) },
  from: vi.fn(() => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: membership, error: null }) }) }) }))
});
describe('admin server authorization', () => {
  it('denies a request without a token before accessing user or database', async () => {
    const admin = adminClient(null);
    await expect(requireAdminFromRequest(admin, { headers: {} })).rejects.toThrow('UNAUTHORIZED');
    expect(admin.auth.getUser).not.toHaveBeenCalled();
  });
  it('denies invalid tokens', async () => {
    await expect(requireAdminFromRequest(adminClient(null), request)).rejects.toThrow('UNAUTHORIZED');
  });
  it('does not grant admin from editable user metadata', async () => {
    const admin = adminClient({ id: 'user-1', user_metadata: { role: 'admin' }, app_metadata: {} });
    await expect(requireAdminFromRequest(admin, request)).rejects.toThrow('FORBIDDEN');
  });
  it('allows server-managed app metadata', async () => {
    const user = { id: 'admin-1', app_metadata: { role: 'admin' } }, admin = adminClient(user);
    await expect(requireAdminFromRequest(admin, request)).resolves.toBe(user);
    expect(admin.from).not.toHaveBeenCalled();
  });
  it('allows membership in the protected admin table', async () => {
    const user = { id: 'admin-2' };
    await expect(requireAdminFromRequest(adminClient(user, { user_id: 'admin-2' }), request)).resolves.toBe(user);
  });
});
