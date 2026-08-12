-- Public storefront imagery lives in Storage, not as Base64 strings in Postgres.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'store-assets',
  'store-assets',
  true,
  8388608,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists duat_admin_select_store_assets on storage.objects;
drop policy if exists duat_admin_insert_store_assets on storage.objects;
drop policy if exists duat_admin_update_store_assets on storage.objects;
drop policy if exists duat_admin_delete_store_assets on storage.objects;

create policy duat_admin_select_store_assets
on storage.objects for select to authenticated
using (bucket_id = 'store-assets' and public.is_admin());

create policy duat_admin_insert_store_assets
on storage.objects for insert to authenticated
with check (bucket_id = 'store-assets' and public.is_admin());

create policy duat_admin_update_store_assets
on storage.objects for update to authenticated
using (bucket_id = 'store-assets' and public.is_admin())
with check (bucket_id = 'store-assets' and public.is_admin());

create policy duat_admin_delete_store_assets
on storage.objects for delete to authenticated
using (bucket_id = 'store-assets' and public.is_admin());

-- Realtime only sends a signal when an actual dashboard write occurs.
do $realtime$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'category_banners'
    ) then
      execute 'alter publication supabase_realtime add table public.category_banners';
    end if;

    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'store_settings'
    ) then
      execute 'alter publication supabase_realtime add table public.store_settings';
    end if;
  end if;
end
$realtime$;
