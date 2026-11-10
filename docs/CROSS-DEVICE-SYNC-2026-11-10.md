# Cross-device settings repair — 10 November 2026

## Root cause
Notification settings wrote WhatsApp to localStorage first, then attempted to upsert `builder_settings.admin_whatsapp`, a column absent from the production schema. Returned Supabase errors were ignored, and the dashboard reported success. Other devices therefore retained the placeholder or their own local value.

## Repair
- Store WhatsApp in `store_settings.notification_settings`, with an admin-only confirmed save and a shared provider. Initialized the absent cloud row from the user's desktop reference: `201064652465`.
- Removed notification reliance on localStorage and the nonexistent builder column. Save failures are visible, invalid Egyptian numbers rejected, and unsaved drafts retained and labelled.
- Footer and tracking support links read the same cloud phone. No fallback link uses a made-up phone.
- Shared products, hero slides, categories, social grid and page settings no longer apply device-local overrides over cloud data. Empty server lists are authoritative and do not resurrect deleted banners. Product read failures show a retry notice rather than silently loading old device edits.
- Existing realtime subscriptions remain. Added visible-only fallback checks on page focus, Safari pageshow, visibility resume and internet reconnection; shared content polls every 60 seconds and admin orders/coupons every 15 seconds while visible.
- Browser fetch uses no-store for SDK requests. Identical polling results retain state references to avoid resetting dashboard forms.
- Notification settings contain only the public business phone. Telegram credentials remain server environment variables. Existing admin-only write policies and private order storage are unchanged.

## Verification
- 89 automated tests, including number normalization, confirmed cloud writes, failed saves and mobile resume/online/polling cleanup.
- Browser fixtures use independent desktop/mobile sessions seeded with conflicting legacy phone/settings. Confirmed save becomes visible to the other session on resume; failed save does not propagate or claim success.
- Unmocked cloud reads from independent desktop/mobile browsers returned identical 83 non-case products, 3 hero slides, shared settings and the configured business phone; seeded stale product/hero/social/page overrides were ignored.
- Production build, ESLint error check and whitespace check pass. No customer order, payment, campaign price or Telegram message was changed or sent.

Theme/language choices, cart and wishlist remain personal browser state; they are not shared merchant configuration. Offline or suspended devices catch up when connectivity/visibility returns. These are browser sessions with mobile viewport emulation, not a physical two-phone test.
