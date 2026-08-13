-- Continue public order references from the existing DUAT-0001 series.
-- The first security migration accidentally bootstrapped the sequence at 1000.
do $migration$
declare
  v_existing_max bigint;
  v_final_max bigint;
begin
  lock table public.orders in share row exclusive mode;

  select coalesce(max((regexp_match(ref, '^DUAT-([0-9]+)$'))[1]::bigint), 0)
  into v_existing_max
  from public.orders
  where ref ~ '^DUAT-[0-9]+$'
    and (regexp_match(ref, '^DUAT-([0-9]+)$'))[1]::bigint < 1000;

  with misnumbered as (
    select
      id,
      row_number() over (order by created_at, id) as sequence_offset
    from public.orders
    where ref ~ '^DUAT-[0-9]+$'
      and (regexp_match(ref, '^DUAT-([0-9]+)$'))[1]::bigint >= 1000
  )
  update public.orders as orders_to_fix
  set ref = 'DUAT-' || lpad((v_existing_max + misnumbered.sequence_offset)::text, 4, '0')
  from misnumbered
  where orders_to_fix.id = misnumbered.id;

  select coalesce(max((regexp_match(ref, '^DUAT-([0-9]+)$'))[1]::bigint), 0)
  into v_final_max
  from public.orders
  where ref ~ '^DUAT-[0-9]+$';

  if v_final_max = 0 then
    perform setval('public.order_ref_seq', 1, false);
  else
    perform setval('public.order_ref_seq', v_final_max, true);
  end if;
end
$migration$;
