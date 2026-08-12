# DUAT secure order pipeline — activation checklist

The application code and database migration must be deployed together. Do not deploy the frontend first: public order creation now depends on the server APIs and the new database columns.

1. Create a Supabase database backup or point-in-time restore checkpoint.
2. In `migrations/00_admin_bootstrap.sql`, replace `REPLACE_WITH_YOUR_ADMIN_EMAIL` with the email of an existing Supabase Auth user, then run the file in Supabase SQL Editor.
3. Run `migrations/01_security_and_rls_overhaul.sql` in Supabase SQL Editor. Do not use the rollback snippet that disables RLS or makes `payment-proofs` public.
4. Add these server-only variables to Vercel for Production (and Preview if needed):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `RATE_LIMIT_SALT` (a long random secret)
   - `ALLOWED_ORIGINS=https://duat-six.vercel.app`
5. Keep `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as the browser-safe variables. Never expose the service-role key with a `VITE_` prefix.
6. Deploy one build containing both `/api/*` and the updated frontend.
7. Verify in order:
   - Admin login rejects a normal authenticated account.
   - A COD order is saved with a server-generated `DUAT-####` reference.
   - An InstaPay proof uploads and is visible only through the signed admin link.
   - A custom sticker and custom case store only Storage paths, never Base64 data.
   - Tracking requires the reference plus the last four phone digits.
   - A fake browser-supplied price does not change the saved total.
8. Monitor Supabase Egress for 48 hours. Public pages no longer fetch the orders table or subscribe to the old anonymous broadcast channel.

The conservative rollback file removes the new API bookkeeping objects but intentionally keeps RLS enabled and both sensitive buckets private.
