create table if not exists public.preorder_popup_leads (
  id uuid primary key default gen_random_uuid(),
  popup_key text not null default 'preorder_popup',
  field_id text not null,
  field_type text not null check (field_type in ('email','tel','text')),
  value text not null check (char_length(value) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table public.preorder_popup_leads enable row level security;

create policy preorder_popup_leads_public_insert on public.preorder_popup_leads
  for insert to anon, authenticated
  with check (field_type in ('email','tel','text') and char_length(value) between 1 and 500);

create policy preorder_popup_leads_admin_select on public.preorder_popup_leads
  for select to authenticated using (public.is_admin());

create policy preorder_popup_leads_admin_delete on public.preorder_popup_leads
  for delete to authenticated using (public.is_admin());

create index if not exists preorder_popup_leads_created_at_idx
  on public.preorder_popup_leads(created_at desc);
