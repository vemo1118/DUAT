-- DUAT Store security and server-authoritative order pipeline.
-- Prerequisite: run 00_admin_bootstrap.sql first.
-- Review in a staging project before production. This file is idempotent.

begin;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

do $preflight$
begin
  if not exists (select 1 from public.admin_users) then
    raise exception 'No admin user configured. Run 00_admin_bootstrap.sql first.';
  end if;

  if exists (
    select 1 from public.orders where ref is not null group by ref having count(*) > 1
  ) then
    raise exception 'Duplicate order refs exist. Resolve them before running this migration.';
  end if;

  if exists (
    select 1 from public.orders
    where (payment_method is null or payment_method not in ('cod', 'instapay'))
      and coalesce(payment_method, '') <> 'system'
  ) then
    raise exception 'Unexpected payment methods exist. Resolve them before running this migration.';
  end if;

  if exists (
    select 1 from public.orders
    where (status is null or status not in ('placed', 'forge', 'in_production', 'shipped', 'delivered', 'cancelled'))
      and coalesce(status, '') not in ('system_config', 'system_live_edits')
  ) then
    raise exception 'Unexpected order statuses exist. Resolve them before running this migration.';
  end if;

  if exists (select 1 from public.orders where total is null or total < 0) then
    raise exception 'Invalid order totals exist. Resolve them before running this migration.';
  end if;
end
$preflight$;

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from public, anon, authenticated;
grant select on table public.admin_users to authenticated;
grant all on table public.admin_users to service_role;

do $policies$
declare v_policy record;
begin
  for v_policy in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'admin_users'
  loop
    execute format('drop policy if exists %I on public.admin_users', v_policy.policyname);
  end loop;
end
$policies$;

create policy admin_users_self_select
on public.admin_users for select to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $function$
  select (select auth.uid()) is not null and (
    coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
    or exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
    )
  );
$function$;

revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated, service_role;

-- Preserve the existing update triggers while fixing their mutable search_path.
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  new.updated_at := pg_catalog.now();
  return new;
end
$function$;

revoke all on function public.handle_updated_at() from public, anon, authenticated;
grant execute on function public.handle_updated_at() to authenticated, service_role;

-- This function backs the existing ensure_rls event trigger. Keep it, but do not
-- expose the SECURITY DEFINER function through the Data API roles.
do $lock_event_trigger$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke all on function public.rls_auto_enable() from public, anon, authenticated';
    execute 'grant execute on function public.rls_auto_enable() to postgres, service_role';
  end if;
end
$lock_event_trigger$;

-- Server-only bookkeeping for signed uploads and durable rate limits.
create table if not exists public.pending_uploads (
  token uuid primary key,
  identifier_hash text not null,
  bucket text not null check (bucket in ('payment-proofs', 'order-designs')),
  object_path text not null unique,
  purpose text not null check (purpose in ('payment-proof', 'order-design')),
  content_type text not null,
  byte_size bigint not null check (byte_size > 0 and byte_size <= 8388608),
  expires_at timestamptz not null,
  claimed_at timestamptz,
  order_id text,
  created_at timestamptz not null default now()
);

create index if not exists pending_uploads_expiry_idx
on public.pending_uploads (expires_at) where claimed_at is null;

alter table public.pending_uploads enable row level security;
revoke all on table public.pending_uploads from public, anon, authenticated;
grant all on table public.pending_uploads to service_role;
drop policy if exists pending_uploads_server_only on public.pending_uploads;
create policy pending_uploads_server_only
on public.pending_uploads for all to service_role
using (true) with check (true);

create table if not exists public.api_rate_limits (
  scope text not null,
  identifier_hash text not null,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0,
  primary key (scope, identifier_hash)
);

alter table public.api_rate_limits enable row level security;
revoke all on table public.api_rate_limits from public, anon, authenticated;
grant all on table public.api_rate_limits to service_role;
drop policy if exists api_rate_limits_server_only on public.api_rate_limits;
create policy api_rate_limits_server_only
on public.api_rate_limits for all to service_role
using (true) with check (true);

-- These legacy configuration records were stored in orders. Archive the complete
-- rows transactionally before removing them from the live order table.
create table if not exists public.legacy_order_records (
  source_id text primary key,
  source_ref text,
  legacy_type text not null,
  record jsonb not null,
  archived_at timestamptz not null default now()
);

alter table public.legacy_order_records enable row level security;
revoke all on table public.legacy_order_records from public, anon, authenticated;
grant all on table public.legacy_order_records to service_role;
drop policy if exists legacy_order_records_server_only on public.legacy_order_records;
create policy legacy_order_records_server_only
on public.legacy_order_records for all to service_role
using (true) with check (true);

insert into public.legacy_order_records (source_id, source_ref, legacy_type, record)
select
  orders_row.id,
  orders_row.ref,
  coalesce(nullif(orders_row.status, ''), nullif(orders_row.payment_method, ''), 'legacy-system-record'),
  to_jsonb(orders_row)
from public.orders as orders_row
where orders_row.payment_method = 'system'
   or orders_row.status in ('system_config', 'system_live_edits')
on conflict (source_id) do update set
  source_ref = excluded.source_ref,
  legacy_type = excluded.legacy_type,
  record = excluded.record,
  archived_at = now();

delete from public.orders
where payment_method = 'system'
   or status in ('system_config', 'system_live_edits');

create or replace function public.consume_rate_limit(
  p_scope text,
  p_identifier_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_row public.api_rate_limits%rowtype;
begin
  if p_limit < 1 or p_window_seconds < 1 or length(p_scope) > 80 or length(p_identifier_hash) > 128 then
    return false;
  end if;

  insert into public.api_rate_limits (scope, identifier_hash, request_count)
  values (p_scope, p_identifier_hash, 0)
  on conflict (scope, identifier_hash) do nothing;

  select * into v_row
  from public.api_rate_limits
  where scope = p_scope and identifier_hash = p_identifier_hash
  for update;

  if v_row.window_started_at <= now() - make_interval(secs => p_window_seconds) then
    update public.api_rate_limits
    set window_started_at = now(), request_count = 1
    where scope = p_scope and identifier_hash = p_identifier_hash;
    return true;
  end if;

  if v_row.request_count >= p_limit then return false; end if;

  update public.api_rate_limits
  set request_count = request_count + 1
  where scope = p_scope and identifier_hash = p_identifier_hash;
  return true;
end
$function$;

revoke all on function public.consume_rate_limit(text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, text, integer, integer) to service_role;

-- Atomic references and server-owned order totals.
alter table public.orders add column if not exists request_id uuid;
alter table public.orders add column if not exists subtotal numeric not null default 0;
alter table public.orders add column if not exists discount numeric not null default 0;
alter table public.orders add column if not exists shipping_fee numeric not null default 0;
alter table public.orders add column if not exists coupon_code text;
alter table public.orders add column if not exists notification_status text not null default 'pending';
alter table public.orders add column if not exists notification_sent_at timestamptz;

update public.orders
set ref = id
where (ref is null or btrim(ref) = '') and id like 'DUAT-%';

create unique index if not exists orders_request_id_unique_idx
on public.orders (request_id) where request_id is not null;

create sequence if not exists public.order_ref_seq start with 1000;

do $sequence$
declare v_max bigint;
begin
  select max((regexp_match(ref, '^DUAT-([0-9]+)$'))[1]::bigint)
  into v_max
  from public.orders
  where ref ~ '^DUAT-[0-9]+$';

  if v_max is null then
    perform setval('public.order_ref_seq', 1000, false);
  else
    perform setval('public.order_ref_seq', greatest(v_max, 1000), true);
  end if;
end
$sequence$;

create or replace function public.set_order_reference()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  if new.ref is null or btrim(new.ref) = '' then
    new.ref := 'DUAT-' || lpad(nextval('public.order_ref_seq')::text, 4, '0');
  end if;
  return new;
end
$function$;

revoke all on function public.set_order_reference() from public, anon, authenticated;
grant execute on function public.set_order_reference() to service_role;
revoke all on sequence public.order_ref_seq from public, anon, authenticated;
grant usage, select on sequence public.order_ref_seq to service_role;

drop trigger if exists orders_set_reference on public.orders;
create trigger orders_set_reference
before insert on public.orders
for each row execute function public.set_order_reference();

do $constraints$
begin
  if not exists (select 1 from pg_constraint where conname = 'orders_total_nonnegative') then
    alter table public.orders add constraint orders_total_nonnegative
      check (subtotal >= 0 and discount >= 0 and shipping_fee >= 0 and total >= 0) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'orders_valid_payment_method') then
    alter table public.orders add constraint orders_valid_payment_method
      check (payment_method in ('cod', 'instapay')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'orders_valid_status') then
    alter table public.orders add constraint orders_valid_status
      check (status in ('placed', 'forge', 'in_production', 'shipped', 'delivered', 'cancelled')) not valid;
  end if;
end
$constraints$;

alter table public.orders validate constraint orders_total_nonnegative;
alter table public.orders validate constraint orders_valid_payment_method;
alter table public.orders validate constraint orders_valid_status;

alter table public.orders enable row level security;
do $orders_policies$
declare v_policy record;
begin
  for v_policy in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'orders'
  loop
    execute format('drop policy if exists %I on public.orders', v_policy.policyname);
  end loop;
end
$orders_policies$;

revoke all on table public.orders from public, anon, authenticated;
grant select, update, delete on table public.orders to authenticated;
grant all on table public.orders to service_role;

create policy orders_admin_select on public.orders for select to authenticated using (public.is_admin());
create policy orders_admin_update on public.orders for update to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy orders_admin_delete on public.orders for delete to authenticated using (public.is_admin());

-- Retire browser-callable functions that previously exposed order/coupon data.
drop function if exists public.track_order(text);
drop function if exists public.get_order_status(text);
drop function if exists public.verify_coupon(text, numeric);
drop function if exists public.generate_order_ref();

-- Coupons are server-readable and admin-managed only.
alter table public.coupons enable row level security;
do $coupon_policies$
declare v_policy record;
begin
  for v_policy in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'coupons'
  loop
    execute format('drop policy if exists %I on public.coupons', v_policy.policyname);
  end loop;
end
$coupon_policies$;

revoke all on table public.coupons from public, anon, authenticated;
grant select, insert, update, delete on table public.coupons to authenticated;
grant all on table public.coupons to service_role;
create policy coupons_admin_all on public.coupons for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Public catalogue/config reads; only admins can mutate.
do $public_tables$
declare
  v_table text;
  v_policy record;
begin
  foreach v_table in array array['products', 'hero_slides', 'store_settings', 'category_banners', 'builder_settings']
  loop
    if to_regclass('public.' || v_table) is null then continue; end if;
    execute format('alter table public.%I enable row level security', v_table);

    for v_policy in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = v_table
    loop
      execute format('drop policy if exists %I on public.%I', v_policy.policyname, v_table);
    end loop;

    execute format('revoke all on table public.%I from public, anon, authenticated', v_table);
    execute format('grant select on table public.%I to anon, authenticated', v_table);
    execute format('grant insert, update, delete on table public.%I to authenticated', v_table);
    execute format('grant all on table public.%I to service_role', v_table);
    execute format('create policy %I on public.%I for select to anon, authenticated using (true)', v_table || '_public_select', v_table);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', v_table || '_admin_write', v_table);
  end loop;
end
$public_tables$;

-- Remove legacy secrets from the client-readable settings row/table.
alter table if exists public.builder_settings drop column if exists telegram_token;
alter table if exists public.builder_settings drop column if exists telegram_chat_id;

-- Both buckets are private. Uploads use short-lived signed upload URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('payment-proofs', 'payment-proofs', false, 5242880, array['image/png', 'image/jpeg', 'image/webp']),
  ('order-designs', 'order-designs', false, 8388608, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $storage_policies$
declare v_policy record;
begin
  for v_policy in
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and (
        coalesce(qual, '') ilike '%payment-proofs%'
        or coalesce(with_check, '') ilike '%payment-proofs%'
        or coalesce(qual, '') ilike '%order-designs%'
        or coalesce(with_check, '') ilike '%order-designs%'
      )
  loop
    execute format('drop policy if exists %I on storage.objects', v_policy.policyname);
  end loop;
end
$storage_policies$;

create policy duat_admin_read_private_uploads
on storage.objects for select to authenticated
using (bucket_id in ('payment-proofs', 'order-designs') and public.is_admin());

create policy duat_admin_delete_private_uploads
on storage.objects for delete to authenticated
using (bucket_id in ('payment-proofs', 'order-designs') and public.is_admin());

commit;
