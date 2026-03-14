create or replace function public.ping()
returns integer
language sql
as $$
  select 1;
$$;

grant execute on function public.ping() to anon, authenticated;
