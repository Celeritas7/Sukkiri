-- Sukkiri · cross-device timers (run after sukkiri_schema_R001.sql)
create table if not exists public.sukkiri_timers (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  payload    jsonb not null default '{"timers":[],"rev":0}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.sukkiri_timers enable row level security;
drop policy if exists "own timers" on public.sukkiri_timers;
create policy "own timers" on public.sukkiri_timers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
