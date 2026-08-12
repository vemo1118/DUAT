-- Run this file ONCE in Supabase SQL Editor before migration 01.
-- Replace the value below with the exact email of the existing Supabase Auth user.
-- The script deliberately stops if the placeholder was not replaced.

begin;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

do $bootstrap$
declare
  v_admin_email constant text := 'REPLACE_WITH_YOUR_ADMIN_EMAIL';
  v_user_id uuid;
begin
  if v_admin_email = 'REPLACE_WITH_YOUR_ADMIN_EMAIL' then
    raise exception 'Edit v_admin_email in 00_admin_bootstrap.sql before running it.';
  end if;

  select id into v_user_id
  from auth.users
  where lower(email) = lower(v_admin_email)
  limit 1;

  if v_user_id is null then
    raise exception 'No Supabase Auth user exists for email %', v_admin_email;
  end if;

  insert into public.admin_users (user_id, email)
  values (v_user_id, lower(v_admin_email))
  on conflict (user_id) do update set email = excluded.email;
end
$bootstrap$;

commit;
