vi.mock('../domain/preorderWindow.js', () => ({ PREORDER_WINDOW: { opensAt: null, closesAt: null, productionStartsAt: null, shipsBy: null } }));
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

const dependencies = vi.hoisted(() => ({ admin: null, notify: vi.fn() }));
vi.mock('../../api/_lib/supabase-admin.js', () => ({
  getSupabaseAdmin: () => dependencies.admin,
  consumeRateLimit: vi.fn(async () => {})
}));
vi.mock('../../api/_lib/telegram.js', () => ({ sendTrustedOrderNotification: dependencies.notify }));

import createOrder from '../../api/create-order.js';
import quoteOrder from '../../api/quote-order.js';

const requestId = '12345678-1234-4234-8234-123456789abc';
const stock = { id: 'test-stock', quantity: 4, price: 1 };
const custom = (quantity) => ({
  id: 'custom-sticker-test', quantity,
  design_image_path: 'pending/test.png', design_upload_token: 'claim-test'
});
const payload = (items, expectedTotal) => ({
  requestId, customer: { fullName: 'Test Customer', phone: '01012345678', address: 'Test address' },
  items, governorateId: 'cairo', paymentMethod: 'cod', expectedTotal
});
const response = () => ({
  setHeader: vi.fn(), status: vi.fn(function (code) { this.statusCode = code; return this; }),
  json: vi.fn(function (body) { this.body = body; return this; })
});
const invoke = async (handler, body) => {
  const res = response();
  await handler({ method: 'POST', headers: {}, body }, res);
  return res;
};

let insert;
let existing;
beforeEach(() => {
  existing = null;
  insert = vi.fn((order) => ({ select: () => ({ single: async () => ({ data: {
    id: order.id, ref: 'DUAT-TEST', total: order.total, created_at: '2026-10-26'
  }, error: null }) }) }));
  dependencies.notify.mockReset().mockResolvedValue({ delivered: true });
  dependencies.admin = {
    from: vi.fn((table) => {
      if (table === 'products') return { select: () => ({ in: async () => ({ data: [
        { id: 'test-stock', category: 'stickers', price: 999, is_active: true }
      ], error: null }) }) };
      if (table === 'orders') return {
        select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: existing }) }) }),
        insert,
        update: () => ({ eq: async () => ({ error: null }) })
      };
      throw new Error(`Unexpected database access: ${table}`);
    })
  };
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => { vi.restoreAllMocks(); });

describe('checkout API boundaries with isolated database and notification adapters', () => {
  it('quotes custom pieces but reports the unopened booking window', async () => {
    const res = await invoke(quoteOrder, { items: [custom(4)] });
    expect(res.statusCode).toBe(200);
    expect(res.body.quote).toMatchObject({ subtotal: 180, customQuantity: 4, checkoutIssue: 'PREORDER_NOT_OPEN' });
    expect(insert).not.toHaveBeenCalled();
  });
  it('rejects incomplete custom orders even when the browser asks to bypass validation', async () => {
    const res = await invoke(createOrder, { ...payload([custom(3)], 135), requireCheckout: false });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Pre-orders require at least 4 custom stickers');
    expect(insert).not.toHaveBeenCalled();
    expect(dependencies.notify).not.toHaveBeenCalled();
  });
  it('rejects custom payment while fulfillment dates remain unset', async () => {
    const res = await invoke(createOrder, { ...payload([custom(4)], 180), paymentMethod: 'instapay' });
    expect(res.body.error).toBe('Pre-orders are not open for payment yet');
    expect(insert).not.toHaveBeenCalled();
  });
  it('rejects a stale total before storing or notifying', async () => {
    const res = await invoke(createOrder, payload([stock], 1));
    expect(res.body.error).toBe('Order total changed. Review the current total before submitting.');
    expect(insert).not.toHaveBeenCalled();
    expect(dependencies.notify).not.toHaveBeenCalled();
  });
  it('saves the trusted stock price and shipping despite client price tampering', async () => {
    const quoted = await invoke(quoteOrder, payload([stock]));
    expect(quoted.body.quote.subtotal).toBe(200);
    expect(quoted.body.quote.shippingFee).toBeGreaterThan(0);
    const res = await invoke(createOrder, payload([stock], quoted.body.quote.total));
    expect(res.statusCode).toBe(201);
    expect(insert).toHaveBeenCalledOnce();
    expect(insert.mock.calls[0][0]).toMatchObject({ subtotal: 200, total: quoted.body.quote.total });
    expect(insert.mock.calls[0][0].items[0].price).toBe(50);
    expect(dependencies.notify).toHaveBeenCalledOnce();
  });
  it('returns an existing request without creating or notifying twice', async () => {
    existing = { id: requestId, ref: 'DUAT-TEST', total: 310 };
    const res = await invoke(createOrder, payload([stock], 310));
    expect(res.body).toMatchObject({ duplicate: true, order: existing });
    expect(insert).not.toHaveBeenCalled();
    expect(dependencies.notify).not.toHaveBeenCalled();
  });
});
