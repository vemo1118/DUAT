-- Conservative rollback for migration 01.
-- It removes the new server pipeline objects but intentionally DOES NOT disable
-- RLS, restore anonymous order access, or make payment files public.

begin;

drop trigger if exists orders_set_reference on public.orders;
drop function if exists public.set_order_reference();
drop function if exists public.consume_rate_limit(text, text, integer, integer);
drop table if exists public.api_rate_limits;
drop table if exists public.pending_uploads;

-- Keep order/security columns: dropping them could destroy production data.
-- Keep private storage and admin-only policies: reopening them is not a safe rollback.
-- Keep legacy_order_records: it is the recovery copy of rows archived from orders.

commit;
