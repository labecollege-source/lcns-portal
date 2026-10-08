-- LCNS announcements table
create extension if not exists pgcrypto;

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now()
);

create index if not exists announcements_active_created_idx
  on public.announcements (is_active, created_at desc);

alter table public.announcements enable row level security;

-- Public visitors can read active notices.
drop policy if exists "Public can read active announcements" on public.announcements;
create policy "Public can read active announcements"
  on public.announcements
  for select
  using (is_active = true);

-- The current LCNS client-side admin page uses the configured Supabase anon key.
-- Replace these policies with Supabase Auth-based admin policies before production
-- if you need strict server-side role enforcement.
drop policy if exists "Configured admin can create announcements" on public.announcements;
create policy "Configured admin can create announcements"
  on public.announcements
  for insert
  with check (true);

drop policy if exists "Configured admin can delete announcements" on public.announcements;
create policy "Configured admin can delete announcements"
  on public.announcements
  for delete
  using (true);
