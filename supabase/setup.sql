-- Run once in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/bafzwhflrmfdkxjxcsmd/sql

create table if not exists public.visitor_counter (
  id int primary key default 1 check (id = 1),
  count bigint not null default 11361
);

insert into public.visitor_counter (id, count)
values (1, 11361)
on conflict (id) do nothing;

alter table public.visitor_counter enable row level security;

drop policy if exists "Public read visitor count" on public.visitor_counter;
create policy "Public read visitor count"
  on public.visitor_counter
  for select
  to anon, authenticated
  using (true);

create or replace function public.increment_visitor()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
begin
  insert into public.visitor_counter (id, count)
  values (1, 11361)
  on conflict (id) do nothing;

  update public.visitor_counter
  set count = count + 1
  where id = 1
  returning count into new_count;

  return new_count;
end;
$$;

revoke all on function public.increment_visitor() from public;
grant execute on function public.increment_visitor() to anon, authenticated;
