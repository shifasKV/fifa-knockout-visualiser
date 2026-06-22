-- Run once in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/bafzwhflrmfdkxjxcsmd/sql

create table if not exists public.live_standings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.live_standings enable row level security;

drop policy if exists "Public read live standings" on public.live_standings;
create policy "Public read live standings"
  on public.live_standings
  for select
  to anon, authenticated
  using (true);
