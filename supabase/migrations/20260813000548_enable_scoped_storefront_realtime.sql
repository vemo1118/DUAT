-- Public storefront providers subscribe only to changes in their own tables.
-- Keeping these tables in the publication lets the UI refresh once after a
-- real dashboard write instead of polling or broadcasting local state.
do $$
declare
  table_name text;
begin
  foreach table_name in array array['products', 'hero_slides', 'builder_settings']
  loop
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = table_name
    ) then
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    end if;
  end loop;
end
$$;
