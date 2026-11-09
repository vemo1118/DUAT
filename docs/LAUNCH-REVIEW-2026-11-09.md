# DUAT launch review — 9 November 2026

## Implemented

- Dashboard section: **إتمام الطلب وطرق الدفع والشحن**.
- Add, remove, reorder, enable and edit up to 12 payment options, with Arabic/English names, descriptions, instructions, transfer account and optional HTTPS payment link.
- Supports manual prepaid transfers with proof and COD for ready-made products. This does not integrate a card gateway. Custom orders retain prepayment requirements.
- Checkout title, notice, submit button, paused message, optional email and notes; pause new orders from the dashboard.
- Shipping fees for each governorate, free-shipping threshold, or separate shipping collection before dispatch with explicit bilingual disclosure.
- Defaults preserve existing payment methods, shipping charges and threshold. No commercial shipping decision changed automatically.
- Server reads and enforces the cloud settings for every quote/order. Disabled/unknown methods are rejected before uploads are claimed or an order is inserted.
- Order stores the payment label/account and shipping mode at purchase time, plus optional email/notes. Historical records remain readable after an option is removed.
- Order list/details, CSV export and notification formatting include the actual method and discount context. No test notification sent.
- Status updates/deletion now report success only after a returned database row confirms the write.
- Cart artwork persists in IndexedDB for 24 hours. Expired pending design uploads are renewed from saved artwork during checkout. Request IDs survive same-tab reloads for retry safety.
- Arabic/Persian phone digits normalize before Egyptian phone validation. Relative product thumbnails are supported.

## Verification

- 73 automated tests pass; production build, ESLint error check and diff whitespace check pass.
- Browser route smoke: 64 combinations: 320/390/768/1440 widths × Arabic/English × eight routes. No horizontal overflow or uncaught page errors.
- Routes: home, stickers, brown/pink collection, builder, product detail, checkout, tracking and admin login.
- Isolated admin/browser fixture: add a manual payment option, edit and save settings, independent page fetch, Arabic checkout fields, COD submission payload, success view and persisted cart clearing.
- Actual API handler fixtures: payment method removal, pause enforcement, shipping changes and payment/customer snapshot insertion. Database and notification adapters isolated.
- Live database: RLS enabled for orders/settings/pending uploads; orders admin-only; design and payment-proof buckets private; existing customer orders not changed.
- Supabase security advisor returned one existing warning for leaked-password protection disabled. It did not report exposed order tables. Review account-level availability separately: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

## Verification boundaries

- Screen sizes are browser emulation, not a physical test on every phone/browser.
- Privileged dashboard mutation tests use isolated fixtures; no real customer order was deleted or modified for testing.
- No real transfer, card charge or customer notification performed. Manual payment settlement still requires checking the receiving account.
- A shipping-carrier agreement and its real rates are not verified by software testing. Owner can now explicitly configure separate collection or confirmed rates.
- Cart persistence depends on browser storage availability. Current session continues if storage is unavailable.
