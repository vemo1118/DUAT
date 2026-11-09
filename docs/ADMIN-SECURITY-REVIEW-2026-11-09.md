# Admin entrance and access-control review — 9 November 2026

## Changes
- Removed the Admin entrance from the public footer. Existing owner bookmark `/admin` remains usable with authorized credentials.
- Admin UI revalidates server admin status on sign-in, token refresh and account updates. Verification errors fail closed, and stale auth checks cannot reopen a signed-out session.
- Added `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'; base-uri 'self'; object-src 'none'`, plus `nosniff` and strict-origin referrer policy.
- Admin responses receive `noindex, nofollow, noarchive` and no-store. Existing robots rule also excludes `/admin`.

## Checks
- All public tables have RLS enabled. Orders, admin membership, coupons and lead reads require appropriate admin/server permissions. Storefront configuration/catalogue reads remain public as required by the storefront.
- `is_admin()` trusts protected app metadata or the admin membership table. Editable user metadata is not an authorization source.
- Customer artwork, payment proofs and migration backups are private storage buckets. Store assets are intentionally public; admin-only policies protect writes.
- Live anonymous REST reads returned no sensitive rows for orders, coupons, admin membership, pending uploads, legacy orders and captured leads.
- Private bucket listing exposed no entries to an anonymous visitor.
- Admin notification API returned 401 both without a token and with an invalid token. No message was sent.
- Browser fixtures: anonymous visitors see the login gate; a locally fabricated session with user_metadata.role=admin is denied; authorized admin fixture still opens the dashboard.
- Added server authorization tests for missing/invalid tokens, non-admin editable metadata, protected app metadata and admin table membership. 82 tests pass; build, ESLint error check and diff check pass.

## Remaining account-level notice
Supabase's security advisor reports leaked-password protection disabled. Its documentation says the feature requires Pro or above. No subscription, password or account enrollment was changed:
https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

This is a review of the admin entrance and its authorization/data boundaries, not a claim of comprehensive penetration testing or an absolute security guarantee. No customer order, account or payment record was changed.
